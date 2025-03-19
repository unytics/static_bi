import * as chartjs from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.6/+esm';
import marked from 'https://cdn.jsdelivr.net/npm/marked/marked.min.js/+esm';
import DOMPurify from 'https://cdn.jsdelivr.net/npm/dompurify@3.2.4/dist/purify.min.js/+esm';

chartjs.Chart.register(...chartjs.registerables);


function humanize(value) {
  if (Number.isInteger(value) || (typeof value === 'bigint')) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  if (value instanceof Date) {
    return value.toISOString().replace('T00:00:00.000Z', '');
  }
  return value;
}

function markdown2html(markdown_content) {
  return DOMPurify.sanitize(marked.parse(markdown_content));
}


class TableChart extends HTMLElement {

  constructor() {
    super();
  }

  connectedCallback() {
    this.userContent = this.textContent ? markdown2html(this.textContent) : '';
    this.innerHTML = this.userContent + '\nINITIALIZING!';
    this.render();
    document.addEventListener('data-loaded', async (event) => {this.render();});
  }

  is_data_manager_ready() {
    if (window.data_manager === undefined) {
      return false;
    }
    if (!this.getAttribute('table')) {
      return true;
    }
    if (this.getAttribute('table') in window.data_manager.tables) {
      return true;
    }
    return false;
  }

  async render() {
    if (!this.is_data_manager_ready) {
      return;
    }
    const data = await this.get_data(window.data_manager);
    this.generate_html(data);
  }

  async get_data() {
    const table = this.getAttribute('table');
    const dimensions = this.getAttribute('dimensions');
    const measures = this.getAttribute('measures');
    const order_by = this.getAttribute('order_by');
    const limit = this.getAttribute('limit');
    const query = `
      select
        ${dimensions ? dimensions + ',' : ''}
        ${measures ? measures + ',' : ''}
        ${(!dimensions && !measures) ? '*' : ''}
      from ${table}
      ${measures ? 'group by ' + dimensions : ''}
      ${order_by ? 'order by ' + order_by : ''}
      ${limit ? 'limit ' + limit : ''}
    `;
    const data = await window.data_manager.query(query);
    return data;
  }

  generate_html(data) {
    const tableHeader = Object.keys(data[0]).map(key => `<th>${key}</th>`).join('');
    const tableRows = data.map(row => `<tr>${Object.values(row).map(value => `<td>${humanize(value)}</td>`).join('')}</tr>`).join('');
    this.innerHTML = `
      <table>
        <thead><tr>${tableHeader}</tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
    `;
  }

}

class TableDescriptionChart extends TableChart {

  constructor() {
    super();
  }

  async get_data() {
    const table = this.getAttribute('table');
    const data = await window.data_manager.describe_table(table);
    return data;
  }

}


class TablesListChart extends TableChart {

  constructor() {
    super();
  }

  async get_data() {
    const data = await window.data_manager.show_tables();
    return data;
  }

}



class Chart extends HTMLElement {

  constructor() {
    super();
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.userContent = this.textContent ? markdown2html(this.textContent) : '';
    this.shadowRoot.innerHTML = this.userContent + '\nINITIALIZING!';
    this.render();
    document.addEventListener('data-loaded', async (event) => {this.render();});
  }

  async render() {
    const data_manager_is_not_ready = (
      (window.data_manager === undefined) ||
      !(this.getAttribute('table') in window.data_manager.tables)
    )
    if (data_manager_is_not_ready) {
      return;
    }
    const data = await this.get_data();
    const chart_config = this.build_chart_config(data);
    this.generate_html(chart_config);
  }

  async get_data() {
    const table = this.getAttribute('table');
    const dimension = this.getAttribute('dimension');
    const measure = this.getAttribute('measure');
    const order_by = this.getAttribute('order_by');
    const limit = this.getAttribute('limit');
    const query = `
      select
        ${dimension} as dimension,
        ${measure} as measure,
      from ${table}
      group by 1
      order by ${order_by}
      limit ${limit}
    `;
    const data = await window.data_manager.query(query);
    return data;
  }

  build_chart_config(data) {
    return {
      type: this.chart_type,
      data: {
        labels: data.map(row => row.dimension),
        datasets: [{
          label: this.getAttribute('measure'),
          data: data.map(row => Number(row.measure)),
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    }
  }

  generate_html(chart_config) {
    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
    }
    this.shadowRoot.innerHTML = this.userContent + '<div><canvas id="chart"></canvas></div>';
    this.chartElement = this.shadowRoot.getElementById('chart');
    this.chart = new chartjs.Chart(this.chartElement, chart_config);
  }


}



class LineChart extends Chart {

  constructor() {
    super();
    this.chart_type = 'line';
  }

}

class BarChart extends Chart {

  constructor() {
    super();
    this.chart_type = 'bar';
  }

}

class DoughnutChart extends Chart {

  constructor() {
    super();
    this.chart_type = 'doughnut';
  }

}

class PieChart extends Chart {

  constructor() {
    super();
    this.chart_type = 'pie';
  }

}

class BarChartGrid extends HTMLElement {

  constructor() {
    super();
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = 'INITIALIZING!';
    this.render();
    document.addEventListener('data-loaded', async (event) => {this.render();});
  }

  async render() {
    const data_manager_is_not_ready = (
      (window.data_manager === undefined) ||
      !(this.getAttribute('table') in window.data_manager.tables)
    )
    if (data_manager_is_not_ready) {
      return;
    }
    const table = this.getAttribute('table');
    const measure = this.getAttribute('measure');
    const order_by = this.getAttribute('order_by');
    const limit = this.getAttribute('limit');
    const dimensions = await window.data_manager.list_dimensions_columns(table);
    this.shadowRoot.innerHTML = dimensions.map(dimension => `
      <bar-chart
        table="${table}"
        dimension="${dimension}"
        measure="${measure}"
        order_by="${order_by}"
        limit="${limit}"
      >
      </bar-chart>`
    ).join('');
  }
}



customElements.define("table-chart", TableChart);
customElements.define("table-description-chart", TableDescriptionChart);
customElements.define("tables-list-chart", TablesListChart);
customElements.define("line-chart", LineChart);
customElements.define("bar-chart", BarChart);
customElements.define("doughnut-chart", DoughnutChart);
customElements.define("pie-chart", PieChart);
customElements.define("bar-chart-grid", BarChartGrid);

import * as chartjs from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.6/+esm';
import marked from 'https://cdn.jsdelivr.net/npm/marked/marked.min.js/+esm';
import DOMPurify from 'https://cdn.jsdelivr.net/npm/dompurify@3.2.4/dist/purify.min.js/+esm';

chartjs.Chart.register(...chartjs.registerables);


function slugify(text) {
  return text.replace(/[^\w ]+/g, "").replace(' ', '_');
}

function humanize(value) {
  if (Number.isInteger(value)) {
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



class ChartElement extends HTMLElement {

  constructor() {
    super();
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.userContent = this.textContent ? markdown2html(this.textContent) : '';
    this.shadowRoot.innerHTML = this.userContent + '\nINITIALIZING!';
    this.render();
    const event_to_listen = this.getAttribute('table') ? `data-loaded:${this.getAttribute('table')}` : 'data-loaded';
    console.log('EVENT TO LISTEN', event_to_listen);
    document.addEventListener(event_to_listen, async (event) => {this.render();})
  }

  async render() {
    if (!this.is_data_manager_ready()) {
      return;
    }
    const data = await this.get_data();
    this.generate_html(data);
  }

  is_data_manager_ready() {
    const table_name = this.getAttribute('table');
    if (window.data_manager === undefined) {
      return false;
    }
    if (window.data_manager.db_ready === false) {
      return false;
    }
    if (!table_name) {
      return true;
    }
    if (table_name in window.data_manager.tables) {
      return true;
    }
    return false;
  }

}


class TableChart extends ChartElement {

  constructor() {
    super();
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
    this.shadowRoot.innerHTML = `
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



class Chart extends ChartElement {

  constructor() {
    super();
  }

  async get_data() {
    const table = this.getAttribute('table');
    const dimension = this.getAttribute('dimension');
    const breakdown_dimension = this.getAttribute('breakdown_dimension');
    const measure = this.getAttribute('measure');
    const order_by = this.getAttribute('order_by');
    const limit = this.getAttribute('limit');
    let query;
    if (breakdown_dimension) {
      query = `
        pivot ${table}
        on ${breakdown_dimension}
        using ${measure}
        group by (${dimension})
      `;
    }
    else {
      query = `
        select
          ${dimension} as ${slugify(dimension)},
          ${measure} as ${slugify(measure)},
        from ${table}
        group by 1
        order by ${order_by}
        limit ${limit}
      `;
    }
    const data = await window.data_manager.query2vectors(query);
    return data;
  }

  generate_html(data) {
    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
    }
    const labels = Object.values(data)[0].map((value) => humanize(value));
    const datasets = Object.entries(data).slice(1).map(([key, value]) => {
      return {
        label: key,
        data: value,
        borderWidth: 1
      }
    });
    const chart_config = {
      type: this.chart_type,
      data: {
        labels: labels,
        datasets: datasets,
      },
      options: {
        scales: {
          x: {},
          y: {
            beginAtZero: true
          }
        }
      }
    };
    if (this.getAttribute('stacked') === 'true') {
      chart_config.options.scales.x.stacked = true;
      chart_config.options.scales.y.stacked = true;
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

class BarChartGrid extends ChartElement {

  constructor() {
    super();
  }

  async get_data() {
    const table = this.getAttribute('table');
    const dimensions = await window.data_manager.list_dimensions_columns(table);
    return dimensions;
  }

  generate_html(dimensions) {
    const table = this.getAttribute('table');
    const measure = this.getAttribute('measure');
    const order_by = this.getAttribute('order_by');
    const limit = this.getAttribute('limit');
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

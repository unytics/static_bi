import * as echarts from 'https://cdn.jsdelivr.net/npm/echarts@5.6.0/dist/echarts.esm.min.js';
import marked from 'https://cdn.jsdelivr.net/npm/marked/marked.min.js/+esm';
import DOMPurify from 'https://cdn.jsdelivr.net/npm/dompurify@3.2.4/dist/purify.min.js/+esm';


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
    this.table = this.getAttribute('table');
    this.dimension = this.getAttribute('dimension');
    this.dimensions = this.getAttribute('dimensions');
    this.breakdown_dimension = this.getAttribute('breakdown_dimension');
    this.measure = this.getAttribute('measure');
    this.measures = this.getAttribute('measures');
    this.limit = this.getAttribute('limit');
    this.order_by = this.getAttribute('order_by');
    this.stacked = this.getAttribute('stacked');
    this.attachShadow({ mode: 'open' });
    this.userContent = this.textContent ? markdown2html(this.textContent) : '';
    this.shadowRoot.innerHTML = this.userContent + '\nINITIALIZING!';
    this.render();
    const event_to_listen = this.table ? `data-loaded:${this.table}` : 'data-loaded';
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
    if (window.data_manager === undefined) {
      return false;
    }
    if (window.data_manager.db_ready === false) {
      return false;
    }
    if (!this.table) {
      return true;
    }
    if (this.table in window.data_manager.tables) {
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
    const query = `
      select
        ${this.dimensions ? this.dimensions + ',' : ''}
        ${this.measures ? this.measures + ',' : ''}
        ${(!this.dimensions && !this.measures) ? '*' : ''}
      from ${this.table}
      ${this.measures ? 'group by ' + this.dimensions : ''}
      ${this.order_by ? 'order by ' + this.order_by : ''}
      ${this.limit ? 'limit ' + this.limit : ''}
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
    return await window.data_manager.describe_table(this.table);
  }

}


class TablesListChart extends TableChart {

  constructor() {
    super();
  }

  async get_data() {
    return await window.data_manager.show_tables();
  }

}



class Chart extends ChartElement {

  constructor() {
    super();
  }

  async get_data() {
    let query;
    if (this.breakdown_dimension) {
      query = `
        pivot ${this.table}
        on ${this.breakdown_dimension}
        using ${this.measure}
        group by (${this.dimension})
      `;
    }
    else {
      query = `
        select
          ${this.dimension} as ${slugify(this.dimension)},
          ${this.measure} as ${slugify(this.measure)},
        from ${this.table}
        group by 1
        order by ${this.order_by}
        limit ${this.limit}
      `;
    }
    const data = await window.data_manager.query2vectors(query);
    return data;
  }

  generate_html(data) {
    const labels = Object.values(data)[0].map((value) => humanize(value));
    const datasets = Object.entries(data).slice(1).map(([key, value]) => {
      return {
        name: key,
        type: this.chart_type,
        data: value,
        stack: this.stacked === 'true' ? 'total' : undefined,
        barWidth: this.stacked === 'true' ? '60%' : undefined,
      }
    });

    const chart_config = {
      title: {},
      tooltip: {},
      legend: {},
      brush: {
        toolbox: ['lineX'],
        xAxisIndex: 0
      },
      xAxis: {
          data: labels
      },
      yAxis: {},
      series: datasets
    };
    this.shadowRoot.innerHTML = this.userContent + '<div id="chart" style="width: 100%; height:400px;"></div>';
    this.chartElement = this.shadowRoot.getElementById('chart');
    this.chart = echarts.init(this.chartElement);
    this.chart.setOption(chart_config);
    const self = this;
    this.chart.on('click', function(params) {
      const filters = [[self.dimension, '=', params.name]];
      if(self.breakdown_dimension) {
        filters.push([self.breakdown_dimension, '=', params.seriesName])
      }
      self.dispatchEvent(new CustomEvent('filters_added', {
        detail: filters,
        bubbles: true,
        composed: true
      }));
    });
    this.chart.on('brushEnd', function (params) {
      if (!params.areas || !params.areas[0]) {
        return;
      }
      const indexes = params.areas[0].coordRange;
      console.log('indexes', labels[indexes[0]], labels[indexes[1]]);
    });
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
    return await window.data_manager.list_dimensions_columns(this.table);
  }

  generate_html(dimensions) {
    this.shadowRoot.innerHTML = dimensions.map(dimension => `
      <bar-chart
        table="${this.table}"
        dimension="${dimension}"
        measure="${this.measure}"
        order_by="${this.order_by}"
        limit="${this.limit}"
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

import {
  ChartElement,
  humanize,
  slugify,
} from './base_chart.js';
import * as echarts from 'https://cdn.jsdelivr.net/npm/echarts@5.6.0/dist/echarts.esm.min.js';


const DEFAULT_COLORS = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'];
const SELECTED_COLOR = '#a90000';



class Chart extends ChartElement {

  constructor() {
    super();
  }

  init_html() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = '<div id="chart" style="width: 100%; height:400px;"></div>';
    this.chartElement = this.shadowRoot.getElementById('chart');
    this.chart = echarts.init(this.chartElement);

    const self = this;
    window.addEventListener('resize', function() {
      self.chart.resize();
    });
    this.chart.on('click', function(params) {
      self.set_filter([self.by, '=', params.name]);
      // if(self.breakdown_by) {
      //   self.filters.push([self.breakdown_by, '=', params.seriesName])
      // }
    });
    this.chart.getZr().on('click', function(event) {
      if ((!event.target) && self.filter) {
        // Reset filter if click nowhere
        self.set_filter();
      }
    });
    this.chart.on('brushEnd', function (params) {
      if (!params.areas || !params.areas[0]) {
        return;
      }
      const indexes = params.areas[0].coordRange;
      console.log('indexes', labels[indexes[0]], labels[indexes[1]]);
    });
  }

  show_loading() {
    this.chart.showLoading();
  }

  async get_data() {
    let query;
    if (this.breakdown_by) {
      query = `
        with __table__ as (
          select *
          from ${this.table}
          ${this.where_clause}
        )

        pivot __table__
        on ${this.breakdown_by}
        using ${this.measure}
        group by (${this.by})
      `;
    }
    else {
      query = `
        select
          ${this.by} as ${slugify(this.by)},
          ${this.measure} as ${slugify(this.measure)},
        from ${this.table}
        ${this.where_clause}
        group by 1
        order by ${this.order_by}
        limit ${this.limit}
      `;
    }
    const data = await window.data_manager.query2columns(query);
    return data;
  }

  generate_html(data) {
    const label_column = Object.keys(data)[0];
    const labels = Object.values(data)[0];
    let clicked_index = this.filter !== undefined ? labels.findIndex(label => label === this.filter[2]) : -1;
    const series = Object.keys(data).slice(1).map((serie_name, k) => ({
        name: serie_name,
        type: this.chart_type,
        encode: this.is_horizontal ? {y: label_column} : {x: label_column},
        stack: this.stacked === 'true' ? 'total' : undefined,
        barWidth: this.stacked === 'true' ? '60%' : undefined,
        itemStyle: clicked_index !== -1 ? {
          color: (param) => param.dataIndex === clicked_index ? SELECTED_COLOR : DEFAULT_COLORS[k]
        } : {},
      })
    );

    const chart_config = {
      dataset: {source: data},
      title: {text: `${this.measure} by ${this.by}`},
      tooltip: this.chart_type === 'line' ? {trigger: 'axis'} : {},
      legend: {},
      grid: {containLabel: true},
      animation: false,
      brush: this.is_horizontal ? {
        toolbox: ['lineY'],
        xAxisIndex: 1,
      } : {
        toolbox: ['lineX'],
        xAxisIndex: 0,
      },
      xAxis: this.is_horizontal ? {} : {
        name: this.by,
        type: this.by === 'date' ? 'time' : 'category',
      },
      yAxis: this.is_horizontal ? {
        name: this.by,
        type: this.by === 'date' ? 'time' : 'category',
        inverse: true,
      } : {},
      series: series,

    };
    this.chart.setOption(chart_config, true);
    this.chart.hideLoading();
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

  get rerender_when_filter_changes() {
    return false;
  }

  async get_data() {
    if (this.by) {
      return this.by.split(',').map((by) => by.trim());
    }
    return await window.data_manager.list_dimensions_columns(this.table);
  }

  generate_html(dimension_columns) {
    this.shadowRoot.innerHTML = dimension_columns.map(column => `
      <bar-chart
        table="${this.table}"
        by="${column}"
        measure="${this.measure}"
        order_by="${this.order_by}"
        limit="${this.limit}"
        ${this.is_horizontal ? 'horizontal="true"' : ''}
        style="width: 32%; display: inline-block;"
      >
      </bar-chart>`
    ).join('');
  }
}

customElements.define("line-chart", LineChart);
customElements.define("bar-chart", BarChart);
customElements.define("doughnut-chart", DoughnutChart);
customElements.define("pie-chart", PieChart);
customElements.define("bar-chart-grid", BarChartGrid);

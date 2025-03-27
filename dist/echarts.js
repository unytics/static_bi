import {
  ChartElement,
  humanize,
  slugify,
} from './base_chart.js';
import * as echarts from 'https://cdn.jsdelivr.net/npm/echarts@5.6.0/dist/echarts.esm.min.js';






class Chart extends ChartElement {

  constructor() {
    super();
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
    if (this.chart) {
      echarts.dispose(this.chart);
      console.log('DISPOSE');
    }
    const labels = Object.values(data)[0].map((value) => humanize(value));
    // console.log('labels', labels);
    // console.log('first label is date', typeof labels[0].getMonth === 'function')
    let clicked_index = this.filter !== undefined ? labels.findIndex(label => label === this.filter[2]) : -1;
    const datasets = Object.entries(data).slice(1).map(([serie, values]) => {
      return {
        name: serie,
        type: this.chart_type,
        data: this.by === 'date' ? (
          values.map((v, k) => [labels[k], v])
        ) : (
          values.map((v, k) => k === clicked_index ? {value: v, itemStyle: {color: '#a90000'}} : v)
        ),
        stack: this.stacked === 'true' ? 'total' : undefined,
        barWidth: this.stacked === 'true' ? '60%' : undefined,
      }
    });

    const chart_config = {
      title: {text: `${this.measure} by ${this.by}`},
      tooltip: this.chart_type === 'line' ? {trigger: 'axis'} : {},
      legend: {},
      grid: {containLabel: true},
      animation: false,
      brush: {
        toolbox: ['lineX'],
        xAxisIndex: 0
      },
      xAxis: this.is_horizontal ? {} : {
        name: this.by,
        type: this.by === 'date' ? 'time' : 'category',
        data: this.by === 'date' ? undefined : labels,
      },
      yAxis: this.is_horizontal ? {
        type: this.by === 'date' ? 'time' : 'category',
        data: this.by === 'date' ? undefined : labels,
        inverse: true,
      } : {},
      series: datasets
    };
    this.shadowRoot.innerHTML = this.userContent + '<div id="chart" style="width: 100%; height:400px;"></div>';
    this.chartElement = this.shadowRoot.getElementById('chart');
    this.chart = echarts.init(this.chartElement);
    this.chart.setOption(chart_config);
    const self = this;
    window.addEventListener('resize', function() {
      self.chart.resize();
    });
    this.chart.on('click', function(params) {
      console.log('CLICK', params);
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

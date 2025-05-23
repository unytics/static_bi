import {
  ChartElement,
} from './base_chart.js';
import * as echarts from 'https://cdn.jsdelivr.net/npm/echarts@5.6.0/dist/echarts.esm.min.js';


const DEFAULT_COLORS = ['#00bdd6', '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'];
const SELECTED_COLOR = '#a90000';



class Chart extends ChartElement {

  constructor() {
    super();
    this.chart_type = this.getAttribute('type');
    this.order_by = this.getAttribute('order_by') || 'by';
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
      console.log('CLICK', params);
      if (params.name) {
        self.set_filter([self.by, '=', params.name]);
      }
      else if (params.value && params.value.length && (params.value[0] instanceof Date)) {
        const selected_date = params.value[0].toISOString();
        if (['date', 'month'].includes(self.by.toLowerCase())) {
          self.set_filter([self.by, '=', selected_date.split('T')[0]]);
        }
        else {
          self.set_filter([self.by, '=', selected_date]);
        }
      }
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
      console.log('BRUSH', params);
      if (!params.areas || !params.areas[0]) {
        return;
      }
      // const [min_time, max_time] = params.areas[0].coordRange;
      // const [min_date, max_date] = [new Date(min_time), new Date(max_time)];
      // HERE
      // if (['date', 'month'].includes(self.by.toLowerCase())) {
      //   self.set_filter([self]
      const indexes = params.areas[0].coordRange;
      console.log('indexes', indexes);
      console.log(new Date(indexes[0]).toISOString());
      console.log(new Date(indexes[1]).toISOString());
      // console.log('indexes', labels[indexes[0]], labels[indexes[1]]);
    });
  }

  show_loading() {
    this.chart.showLoading();
  }

  async get_data() {
    let query;
    if (this.breakdown_by) {
      if (this.normalized) {
        query = `
          with

          __top_breakdowns__ as (
            select ${this.breakdown_by} as top_breakdown
            from ${this.table}
            where ${this.where_clause}
            group by 1
            order by ${this.measure} desc
            limit ${this.breakdown_limit}
          ),

          __top_bys__ as (
            select ${this.by} as top_by
            from ${this.table}
            where ${this.where_clause}
            group by 1
            order by ${this.order_by}
            limit ${this.limit}
          ),

          __groups__ as (
            select
              ${this.by} as by,
              ${this.breakdown_by} as breakdown_by,
              ${this.measure} as measure,
              row_number() over () as _row_number,
            from ${this.table}
            where ${this.where_clause}
            group by 1, 2
            order by ${this.order_by}
          ),

          __groups_normalized__ as (
            select
              by,
              breakdown_by,
              measure / (sum(measure) over (partition by by)) as measure,
              _row_number,
            from __groups__
          ),

          __groups_normalized_only_tops__ as (
            select
              by,
              breakdown_by,
              measure,
            from __groups_normalized__
            where
              breakdown_by in (select top_breakdown from __top_breakdowns__) and
              by in (select top_by from __top_bys__)
            order by _row_number
          )

          pivot __groups_normalized_only_tops__
          on breakdown_by
          using any_value(measure)
        `;
      }
      else {
        query = `
          with

          __top_breakdowns__ as (
            select ${this.breakdown_by} as top_breakdown
            from ${this.table}
            where ${this.where_clause}
            group by 1
            order by ${this.measure} desc
            ${this.breakdown_limit ? 'limit ' + this.breakdown_limit : ''}
          ),

          __groups__ as (
            select
              ${this.by} as by,
              ${this.breakdown_by} as breakdown_by,
              ${this.measure} as measure,
            from ${this.table}
            where ${this.where_clause} and ${this.breakdown_by} in (select top_breakdown from __top_breakdowns__)
            group by 1, 2
            order by ${this.order_by}
          )

          pivot __groups__
          on breakdown_by
          using any_value(measure)
        `;
      }
    }
    else if (this.normalized) {
      query = `

        with

        __grouped__ as (

          select
            ${this.by} as by,
            ${this.measure} as measure,
          from ${this.table}
          where ${this.where_clause}
          group by 1
          order by ${this.order_by}

        )

        select
          by,
          measure / (sum(measure) over ()) as measure,
        from __grouped__
        ${this.limit ? 'limit ' + this.limit : ''}
      `;
    }
    else if (this.measure.includes('(')) {
      query = `
        select
          ${this.by} as by,
          ${this.measure} as measure,
        from ${this.table}
        where ${this.where_clause}
        group by 1
        order by ${this.order_by}
        ${this.limit ? 'limit ' + this.limit : ''}
      `;
    }
    else {
      query = `
        select
          ${this.by} as by,
          ${this.measure} as measure,
        from ${this.table}
        where ${this.where_clause}
      `;
    }
    const data = await window.db.query2columns(query);
    return data;
  }

  generate_html(data) {
    const columns = Object.keys(data);
    const label_column = columns[0];
    const labels = Object.values(data)[0];
    const label_type = labels[0] instanceof Date ? 'time' : 'category';
    const self = this;
    let clicked_indexes = [];
    if (this.filter !== undefined) {
      const [_, filter_ope, filter_value] = this.filter;
      if (label_type === 'category') {
        if (Array.isArray(filter_value)) {
          clicked_indexes = labels.map((label, i) => (filter_value.includes(label)) ? i : '').filter(String);
        }
        else {
          clicked_indexes = [labels.findIndex((label) => label === filter_value)];
        }
      }
      else if (label_type === 'time') {
        if (Array.isArray(filter_value)) {
          if (filter_ope === 'between') {
            const min_time = new Date(filter_value[0]).getTime();
            const max_time = new Date(filter_value[1]).getTime();
            clicked_indexes = labels.map((label, i) => (label.getTime() >= min_time && label.getTime() <= max_time) ? i : '').filter(String);
          }
          else if (filter_ope === 'in') {
            const selected_times = filter_value.map((value) => new Date(value).getTime());
            clicked_indexes = labels.map((label, i) => (selected_times.includes(label.getTime())) ? i : '').filter(String);
          }
        }
        else {
          const time = (new Date(filter_value)).getTime();
          clicked_indexes = [labels.findIndex((label) => label.getTime() === time)];
        }
      }
    }
    const series = Object.keys(data).slice(1).map((serie_name, k) => ({
        name: Object.keys(data).length > 2 ? serie_name : undefined,
        type: this.chart_type,
        symbol: 'circle',
        // symbol: labels.length > 100 ? 'none' : 'circle',
        connectNulls: false,
        encode: this.is_horizontal ? {
          x: columns[k + 1],
          y: label_column,
        } : {
          x: label_column,
          y: columns[k + 1],
        },
        stack: this.stacked ? 'total' : undefined,
        // barWidth: this.stacked ? '60%' : undefined,
        // barWidth: '90%',
        itemStyle: {
          color: clicked_indexes.length ? (
            (param) => clicked_indexes.includes(param.dataIndex) ? SELECTED_COLOR : DEFAULT_COLORS[k]
          ) : DEFAULT_COLORS[k]
        },
      })
    );

    const chart_config = {
      useUTC: true,
      dataset: {source: data},
      // title: {text: `${this.measure} by ${this.by}`, bottom: 0},
      tooltip: (this.chart_type === 'line') || (label_type === 'time') ? {trigger: 'axis'} : {},
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
      xAxis: this.is_horizontal ? {
        name: this.measure,
        nameLocation: 'middle',
        nameTextStyle: {padding: [10, 0, 0, 0], fontWeight: 'bold'},
      } : {
        name: this.by,
        nameLocation: 'middle',
        nameTextStyle: {padding: [10, 0, 0, 0], fontWeight: 'bold'},
        type: label_type,
      },
      yAxis: this.is_horizontal ? {
        name: this.by,
        nameLocation: 'start',
        nameTextStyle: {align: 'right', fontWeight: 'bold'},
        type: label_type,
        inverse: true,
      } : {
        name: this.measure,
        nameTextStyle: {align: 'right', fontWeight: 'bold'},
      },
      series: series,
      toolbox: this.select_tool ? {
        feature: {
            myTool1: {
                show: true,
                title: 'Select',
                icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
                onclick: function (){
                    self.dispatchEvent(new CustomEvent('custom-select', {detail: self.select_tool, bubbles: true, composed: true}));
                }
            },
        }
      } : {},

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
    this.order_by = (
      this.getAttribute('order_by') || (this.is_horizontal ? `${this.measure} desc` : 'by')
    );
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



customElements.define("generic-chart", Chart);
customElements.define("line-chart", LineChart);
customElements.define("bar-chart", BarChart);
customElements.define("doughnut-chart", DoughnutChart);
customElements.define("pie-chart", PieChart);

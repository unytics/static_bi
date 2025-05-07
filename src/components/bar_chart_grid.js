import {ChartElement} from './base_chart.js';

class BarChartGrid extends ChartElement {

    constructor() {
      super();
      this.addEventListener('custom-select', (event) => {
        this.breakdown_by = this.breakdown_by === event.detail ? undefined : event.detail;
        this.shadowRoot.querySelectorAll('[table]').forEach(elem => {
          elem.breakdown_by = elem.by !== this.breakdown_by ? this.breakdown_by : undefined;
          elem.stacked = elem.chart_type === 'bar' && this.breakdown_by ? true : false;
          elem.render();
        });
      });
    }

    get rerender_when_filter_changes() {
      return false;
    }

    async get_data() {
      if (this.by) {
        return this.by.split(',').map((by) => by.trim());
      }
      return await window.db.list_dimensions_columns(this.table);
    }

    generate_html(dimension_columns) {
      const sheet = new CSSStyleSheet;
      sheet.replaceSync(`
        .container {
          display: grid;
          grid-gap: .4rem;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 12rem), 1fr));
          margin: 1em 0;
        }

        line-chart, bar-chart {
          display: inline-block;
          border: .05rem solid #00000012;
          padding: .8rem;
          transition: border 0.25s, box-shadow 0.25s;
        }

        line-chart:hover, bar-chart:hover {
          border-color: #0000;
          box-shadow: 0 0.2rem 0.5rem #0000001a, 0 0 0.05rem #00000040;
        }

      `);
      this.shadowRoot.adoptedStyleSheets.push(sheet);
      this.shadowRoot.innerHTML = (
        `
        <div class="container">
          <line-chart
            id="line-day"
            table="${this.table}"
            measure="${this.measure}"
            by="date">
          </line-chart>
          <line-chart
            id="line-month"
            table="${this.table}"
            measure="${this.measure}"
            by="date_trunc('month', date)">
          </line-chart>
        </div>
        ` +
        '<div class="container">' +
        dimension_columns.map(column => `
          <bar-chart
            table="${this.table}"
            measure="${this.measure}"
            by="${column}"
            order_by="${this.getAttribute('order_by') || ''}"
            ${this.limit ? 'limit="' + this.limit + '"' : ''}
            ${this.is_horizontal ? 'horizontal' : ''}
            select_tool="${column}"
          >
          </bar-chart>`
        ).join('') +
        '</div>'
      );
    }

}


customElements.define("bar-chart-grid", BarChartGrid);

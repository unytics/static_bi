import {
    ChartElement,
    humanize,
    slugify,
  } from './base_chart.js';

class TableChart extends ChartElement {

    constructor() {
      super();
    }

    async get_data() {
      const query = `
        select
          ${this.by ? this.by + ',' : ''}
          ${this.measures ? this.measures + ',' : ''}
          ${(!this.by && !this.measures) ? '*' : ''}
        from ${this.table}
        ${this.measures ? 'group by ' + this.by : ''}
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



customElements.define("table-chart", TableChart);
customElements.define("table-description-chart", TableDescriptionChart);
customElements.define("tables-list-chart", TablesListChart);
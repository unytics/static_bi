import {
    ChartElement,
    humanize,
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
        where ${this.where_clause}
        ${this.by ? 'group by ' + this.by : ''}
        ${this.order_by ? 'order by ' + this.order_by : ''}
        ${this.limit ? 'limit ' + this.limit : ''}
      `;
      const data = await window.db.query(query);
      return data;
    }

    generate_html(data) {
      const tableHeader = Object.keys(data[0]).map(key => `<th>${key}</th>`).join('');
      const tableRows = data.map(row => `<tr>${Object.values(row).map(value => `<td>${humanize(value)}</td>`).join('')}</tr>`).join('');
      this.shadowRoot.innerHTML = `
        <style>
          table {
            width: 100%; /* Take up the full width of the container */
            table-layout: fixed; /* Important for consistent word wrapping */
            border-collapse: collapse; /* Optional: Remove spacing between cells */
          }

          th, td {
            border: 1px solid #ddd; /* Optional: Add borders for clarity */
            padding: 8px;
            text-align: left;
            overflow-wrap: break-word;
          }
        </style>
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
      return await window.db.describe_table(this.table);
    }

  }


  class TablesListChart extends TableChart {

    constructor() {
      super();
    }

    async get_data() {
      return await window.db.show_tables();
    }

  }



customElements.define("table-chart", TableChart);
customElements.define("table-description-chart", TableDescriptionChart);
customElements.define("tables-list-chart", TablesListChart);
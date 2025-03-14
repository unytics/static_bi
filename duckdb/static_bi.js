import * as duckdb from "https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@1.28.1-dev106.0/+esm";
import * as chartjs from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.6/+esm';

chartjs.Chart.register(...chartjs.registerables);



class DataManager extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.textContent = `initiating...`;
  }

  async connectedCallback() {
    await this.init_duckdb();
    await this.load_data();
    this.shadowRoot.textContent = `success!`;
  }

  async init_duckdb() {
    const jsdelivr_bundles = duckdb.getJsDelivrBundles();
    const bundle = await duckdb.selectBundle(jsdelivr_bundles);
    const worker_url = URL.createObjectURL(
      new Blob([`importScripts("${bundle.mainWorker}");`], {
        type: "text/javascript",
      })
    );
    const worker = new Worker(worker_url);
    const logger = new duckdb.ConsoleLogger();
    this.db = new duckdb.AsyncDuckDB(logger, worker);
    await this.db.instantiate(bundle.mainModule, bundle.pthreadWorker);
    URL.revokeObjectURL(worker_url);
  }

  async query(query) {
    const conn = await this.db.connect();
    const result = (await conn.query(query)).toArray().map((row) => row.toJSON());
    await conn.close();
    console.log(JSON.stringify(result, (key, value) =>
        typeof value === 'bigint'
            ? value.toString()
            : value // return everything else unchanged
    , 4))
    return result;
  }

  async load_file(name, file_url) {
    await this.query(`create table ${name} as from "${file_url}"`);
  }

  async load_data() {
    for(const child of this.children) {
      if(child.tagName == 'DATA-TABLE') {
        await this.load_file(child.getAttribute('name'), child.getAttribute('file'));
      }
    }
    this.dispatchEvent(new CustomEvent('data-loaded', {
        bubbles: true,
        composed: true
    }));
  }

}



class DataTable extends HTMLElement {

  constructor() {
    super();
  }

}


class LineChart extends HTMLElement {

  constructor() {
    super();
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = 'INITIALIZING!';
    document.addEventListener('data-loaded', (event) => {
      this.render();
    });
  }

  get_data() {
    
  }

  render() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
    }
    this.shadowRoot.innerHTML = '<div><canvas id="chart"></canvas></div>';
    this.chartElement = this.shadowRoot.getElementById('chart');
    this.chart = new chartjs.Chart(this.chartElement, {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
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
    });
  }


}


customElements.define("data-manager", DataManager);
customElements.define("data-table", DataTable);
customElements.define("line-chart", LineChart);


document.addEventListener('DOMContentLoaded', function() {
    window.db = document.getElementsByTagName('data-manager')[0];
});
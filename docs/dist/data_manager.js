import * as duckdb from "https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@1.28.1-dev106.0/+esm";


class DataManager extends HTMLElement {

  constructor() {
    super();
  }

  async connectedCallback() {
    await this.init_duckdb();
    await this.load_data();
  }

  async init_duckdb() {
    if (window._db !== undefined) {
      this.db = window._db;
      console.log('CACHE HIT!');
      return;
    }
    console.log('CACHE MISSED!');
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
    window._db = this.db;
  }

  async query(query) {
    console.log(query);
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
    await this.query(`create table if not exists ${name} as from "${file_url}"`);
  }

  async show_tables() {
    return await this.query(`show tables`);
  }

  async describe_table(name) {
    return await this.query(`describe table ${name}`);
  }

  async load_data() {
    for(const child of this.children) {
      if(child.tagName == 'DATA-MANAGER-TABLE') {
        await this.load_file(child.getAttribute('name'), child.getAttribute('file'));
      }
    }
    this.dispatchEvent(new CustomEvent('data-loaded', {
        detail: this,
        bubbles: true,
        composed: true
    }));
  }

}



class DataManagerTable extends HTMLElement {

  constructor() {
    super();
  }

}


customElements.define("data-manager", DataManager);
customElements.define("data-manager-table", DataManagerTable);


document.addEventListener('DOMContentLoaded', function() {
window.db = document.getElementsByTagName('data-manager')[0];
});
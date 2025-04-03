import * as duckdb from "https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@1.28.1-dev106.0/+esm";
import { tableFromIPC } from "https://cdn.jsdelivr.net/npm/@uwdata/flechette/+esm";

class DuckDB {

  constructor() {
    this.db_ready = false;
    this.tables = {};
    this.filters = [];
  }

  async init() {
    const jsdelivr_bundles = duckdb.getJsDelivrBundles();
    const bundle = await duckdb.selectBundle(jsdelivr_bundles);
    const worker_url = URL.createObjectURL(
      new Blob([`importScripts("${bundle.mainWorker}");`], {
        type: "text/javascript",
      })
    );
    const worker = new Worker(worker_url);
    const logger = new duckdb.ConsoleLogger(3);
    this.db = new duckdb.AsyncDuckDB(logger, worker);
    await this.db.instantiate(bundle.mainModule, bundle.pthreadWorker);
    URL.revokeObjectURL(worker_url);
    this.conn = await this.db.connect();
    this.db_ready = true;
  }

  async query(query) {
    const arrow_table = await this.conn.query(query);
    const array = arrow_table.toArray();
    const result = array.map((row) => row.toJSON());
    return result;
  }

  query2ipc(query) {
    // FROM https://github.com/uwdata/mosaic/blob/main/packages/core/src/connectors/wasm.js#L6
    return new Promise((resolve, reject) => {
      this.conn.useUnsafe(async (bindings, conn) => {
        try {
          const buffer = await bindings.runQuery(conn, query);
          resolve(buffer);
        } catch (error) {
          console.error('ERROR in QUERY', query);
          reject(error);
        }
      });
    });
  }

  async query2columns(query) {
    // console.log(query);
    const tableIPC = await this.query2ipc(query);
    const flechette_table = await tableFromIPC(tableIPC, { useDate: true,  useBigInt: false, useDecimalInt: false, useProxy: false });
    return flechette_table.toColumns();
  }

  async query2value(query) {
    const columns = await this.query2columns(query);
    return Object.values(columns)[0][0];
  }

  async create_table(name, file_url) {
    if (name in this.tables) {
      return;
    }
    // await this.query(`create table ${name} as select * from "${file_url}"`);
    const res = await fetch(file_url, { cache: "force-cache" });
    const buffer = await res.arrayBuffer();
    const uint8_array = new Uint8Array(buffer);
    await this.db.registerFileBuffer(`${name}.parquet`, uint8_array);
    await this.query(`create view ${name} as select * from parquet_scan('${name}.parquet')`);
    this.tables[name] = await this.list_columns(`${name}`);
  }

  async create_view(name, query) {
    if (name in this.tables) {
      return;
    }
    await this.query(`create view ${name} as ${query}`);
    this.tables[name] = await this.list_columns(`${name}`);
  }

  async show_tables() {
    return await this.query(`show tables`);
  }

  async describe_table(name) {
    return await this.query(`describe table ${name}`);
  }

  async list_columns(table_name) {
    const data = await this.describe_table(table_name);
    return data.map(row => row.column_name);
  }

  async list_dimensions_columns(table_name) {
    const data = await this.describe_table(table_name);
    return data.filter(row => row.column_type === 'VARCHAR').map(row => row.column_name);
  }

}


class DataManager extends HTMLElement {

  constructor() {
    super();
  }

  async connectedCallback() {
    if (window.db === undefined) {
      console.log('CACHE MISSED!');
      window.db = new DuckDB();
      await window.db.init();
    }
    else {
      console.log('CACHE HIT!');
    }

    for(const child of this.children) {
      if(child.tagName == 'DATA-MANAGER-TABLE') {
        const name = child.getAttribute('name');
        const file = child.getAttribute('file');
        await window.db.create_table(name, file);
        this.emit_event(name);
      }
    }
    for(const child of this.children) {
      if(child.tagName == 'DATA-MANAGER-VIEW') {
        const name = child.getAttribute('name');
        const sql = child.textContent;
        await window.db.create_view(name, sql);
        this.emit_event(name);
      }
    }
    this.emit_event();
  }

  emit_event(name) {
    const event_name = name ? `data-loaded:${name}` : 'data-loaded';
    console.log('EMITTED', event_name);
    this.dispatchEvent(new CustomEvent(event_name, {
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

class DataManagerView extends HTMLElement {

  constructor() {
    super();
  }

}


customElements.define("data-manager", DataManager);
customElements.define("data-manager-table", DataManagerTable);
customElements.define("data-manager-view", DataManagerView);


document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");
});

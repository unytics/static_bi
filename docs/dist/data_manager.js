import * as duckdb from "https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@1.28.1-dev106.0/+esm";
import { tableFromIPC } from "https://cdn.jsdelivr.net/npm/@uwdata/flechette/+esm";


// FROM https://github.com/uwdata/mosaic/blob/main/packages/core/src/connectors/wasm.js#L6
function getArrowIPC(con, query) {
  return new Promise((resolve, reject) => {
    con.useUnsafe(async (bindings, conn) => {
      try {
        const buffer = await bindings.runQuery(conn, query);
        resolve(buffer);
      } catch (error) {
        reject(error);
      }
    });
  });
}


function arrow_table2vectors(arrow_table) {
  if (!arrow_table) {
    console.warn("arrow_table is null or undefined.  Returning null.");
    return null;
  }
  const flechette_table = tableFromIPC(arrow_table.tableToIPC(), { useDate: true });
  const vectors = flechette_table.toColumns();
  console.log('vectors', vectors);

  // const vectors = {};
  // const columns = arrow_table.schema.fields;
  // for (const column of columns) {
  //   // vectors[column.name] = arrow_table.getChild(column.name).toJSON().map(
  //   //   (value) => (typeof value === 'bigint') ? Number(value) : value
  //   // );
  //   vectors[column.name] = arrow_table.getChild(column.name).toArray().map((v) => arrow_value2js(v));
  //   console.log(column.name, column.type);
  //   // for (let i = 0; i < vectors[column.name].length; i++) {
  //   //   console.log(`${vectors[column.name].get(i)}`);
  //   // }

  // }
  // console.log('vectors', vectors);
  // console.log('type', Number(Object.values(vectors)[Object.values(vectors).length-1][0]));
  return vectors;
}


class DataManager extends HTMLElement {

  constructor() {
    super();
  }

  async connectedCallback() {
    if (window.data_manager !== undefined) {
      console.log('CACHE HIT!');
      return;
    }
    console.log('CACHE MISSED!');
    window.data_manager = this;
    this.db_ready = false;
    this.tables = {};
    this.filters = [];
    await this.init_duckdb();
    this.db_ready = true;
    await this.load_data();
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
    const logger = new duckdb.ConsoleLogger(3);
    this.db = new duckdb.AsyncDuckDB(logger, worker);
    await this.db.instantiate(bundle.mainModule, bundle.pthreadWorker);
    URL.revokeObjectURL(worker_url);
    this.conn = await this.db.connect();
  }

  async query(query) {
    const arrow_table = await this.conn.query(query);
    const array = arrow_table.toArray();
    const result = array.map((row) => row.toJSON());
    return result;
  }

  async query2columns(query) {
    const tableIPC = await getArrowIPC(this.conn, query);
    const flechette_table = await tableFromIPC(tableIPC, { useDate: true,  useBigInt: false, useDecimalInt: false, useProxy: false });
    const vectors = flechette_table.toColumns();
    for(const key of Object.keys(vectors).slice(1)) {
      vectors[key] = Array.from(vectors[key]);
    }
    return vectors;
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
    this.emit_event(name);
  }

  async create_view(name, query) {
    await this.query(`create view ${name} as ${query}`);
    this.tables[name] = await this.list_columns(`${name}`);
    this.emit_event(name);
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

  async load_data() {
    for(const child of this.children) {
      if(child.tagName == 'DATA-MANAGER-TABLE') {
        await this.create_table(child.name, child.file);
      }
    }
    for(const child of this.children) {
      if(child.tagName == 'DATA-MANAGER-VIEW') {
        await this.create_view(child.name, child.sql);
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

  connectedCallback() {
    this.name = this.getAttribute('name');
    this.file = this.getAttribute('file');
  }

}

class DataManagerView extends HTMLElement {

  constructor() {
    super();
  }

  connectedCallback() {
    this.name = this.getAttribute('name');
    this.sql = this.textContent;
    this.textContent = '';
  }

}


customElements.define("data-manager", DataManager);
customElements.define("data-manager-table", DataManagerTable);
customElements.define("data-manager-view", DataManagerView);

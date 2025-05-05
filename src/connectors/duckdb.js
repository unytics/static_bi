import * as duckdb from "https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@1.28.1-dev106.0/+esm";
import { tableFromIPC } from "https://cdn.jsdelivr.net/npm/@uwdata/flechette/+esm";

class DuckDB {

  constructor() {
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

  async query2console(query) {
    const result = await this.query(query);
    console.table(result);
  }

  async create_table(name, file_url, columns) {
    if (name in this.tables) {
      return;
    }
    if (!file_url) {
        console.error('Undefined or null file url');
    }
    // await this.query(`create table ${name} as select * from "${file_url}"`);
    const res = await fetch(file_url, { cache: "force-cache" });
    const buffer = await res.arrayBuffer();
    const uint8_array = new Uint8Array(buffer);
    await this.db.registerFileBuffer(`${name}.parquet`, uint8_array);
    await this.query(`
      create view ${name} as
      select ${columns ? columns : '*'}
      from parquet_scan('${name}.parquet')
    `);
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


if (window.db === undefined) {
    console.log('INIT DUCKDB');
    const db = new DuckDB();
    await db.init();
    window.db = db;
    console.log('DUCKDB READY');
    document.dispatchEvent(new CustomEvent(`db-ready`, {bubbles: true, composed: true}));
}
else {
    console.log('DUCKDB ALREADY INITIALIZED!');
}
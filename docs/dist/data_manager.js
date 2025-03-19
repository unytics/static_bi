import * as duckdb from "https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@1.28.1-dev106.0/+esm";


function arrow_table2vectors(arrow_table) {
  if (!arrow_table) {
    console.warn("arrow_table is null or undefined.  Returning null.");
    return null;
  }
  const vectors = {};
  const columns = arrow_table.schema.fields;
  for (const column of columns) {
    vectors[column.name] = arrow_table.getChild(column.name).toArray();
  }
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
    const logger = new duckdb.ConsoleLogger();
    this.db = new duckdb.AsyncDuckDB(logger, worker);
    await this.db.instantiate(bundle.mainModule, bundle.pthreadWorker);
    URL.revokeObjectURL(worker_url);
  }

  async query2arrow_table(query) {
    const conn = await this.db.connect();
    const arrow_table = await conn.query(query);
    await conn.close();
    return arrow_table;
  }

  async query(query) {
    const arrow_table = await this.query2arrow_table(query);
    const result = arrow_table.toArray().map((row) => row.toJSON());
    // console.log(JSON.stringify(result, (key, value) =>
    //     typeof value === 'bigint'
    //         ? value.toString()
    //         : value // return everything else unchanged
    // , 4))
    return result;
  }

  async query2vectors(query) {
    const arrow_table = await this.query2arrow_table(query);
    const vectors = arrow_table2vectors(arrow_table);
    console.log(vectors);
    return vectors;
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

  async list_columns(table_name) {
    const data = await this.describe_table(table_name);
    return data.map(row => row.name);
  }

  async list_dimensions_columns(table_name) {
    const data = await this.describe_table(table_name);
    return data.filter(row => row.column_type === 'VARCHAR').map(row => row.column_name);
  }

  async load_data() {
    for(const child of this.children) {
      if(child.tagName == 'DATA-MANAGER-TABLE') {
        await this.load_file(child.getAttribute('name'), child.getAttribute('file'));
        this.tables[child.getAttribute('name')] = {file: child.getAttribute('file')};
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

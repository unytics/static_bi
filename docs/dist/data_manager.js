import * as duckdb from "https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@1.28.1-dev106.0/+esm";


function arrow_table2vectors(arrow_table) {
  if (!arrow_table) {
    console.warn("arrow_table is null or undefined.  Returning null.");
    return null;
  }
  const vectors = {};
  const columns = arrow_table.schema.fields;
  for (const column of columns) {
    vectors[column.name] = arrow_table.getChild(column.name).toJSON().map(
      (value) => (typeof value === 'bigint') ? Number(value) : value
    );
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
    this.filters = [];
    await this.init_duckdb();
    this.db_ready = true;
    await this.load_data();
    document.addEventListener('filters_added', async (event) => {this.add_filters(event.detail);})
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
  }

  async query2arrow_table(query) {
    const conn = await this.db.connect();
    const arrow_table = await conn.query(query);
    await conn.close();
    return arrow_table;
  }

  async query(query) {
    console.log('QUERY', query);
    const arrow_table = await this.query2arrow_table(query);
    const array = arrow_table.toArray();
    const result = array.map((row) => row.toJSON());
    return result;
  }

  async query2vectors(query) {
    const arrow_table = await this.query2arrow_table(query);
    const vectors = arrow_table2vectors(arrow_table);
    return vectors;
  }

  async create_table(name, file_url) {
    if (name in this.tables) {
      return;
    }
    // await this.query(`create table ${name} as select * from "${file_url}"`);
    const res = await fetch(file_url);
    const buffer = await res.arrayBuffer();
    const uint8_array = new Uint8Array(buffer);
    await this.db.registerFileBuffer(`${name}.parquet`, uint8_array);
    await this.query(`create view __${name}__ as select * from parquet_scan('${name}.parquet')`);
    this.tables[name] = await this.list_columns(`__${name}__`);
    await this.create_filtered_view(name);
  }

  async create_view(name, query) {
    await this.query(`create view __${name}__ as ${query}`);
    this.tables[name] = await this.list_columns(`__${name}__`);
    await this.create_filtered_view(name);
  }

  async create_filtered_view(name) {
    console.log('CREATE FILTERED VIEW. Columns', this.tables[name], 'Filters', this.filters);
    const filters = this.filters.filter((filter) => this.tables[name].includes(filter[0]));
    console.log('FILTERS', filters);
    let query = `create or replace view ${name} as select * from __${name}__`;
    if (filters.length) {
      console.log('FILTERS', filters);
      const where_clause = filters.map(([column, operation, value]) => `${column} ${operation} ${(typeof value) === 'string' ? "'" + value + "'" : value}`)
      query += ` where ${where_clause.join(' and ')}`;
    }
    await this.query(query);
    this.emit_event(name);
  }

  async add_filters(filters) {
    this.filters.push(...filters);
    for (const name of Object.keys(this.tables)) {
      await this.create_filtered_view(name);
    }
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

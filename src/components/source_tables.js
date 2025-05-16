

class SourceTable extends HTMLElement {

  constructor() {
    super();
  }

  async connectedCallback() {
    console.log('SOURCE TABLE CONNETED');
    this.name = this.getAttribute('name');
    this.source_url = this.getAttribute('url');
    this.source_records = this.getAttribute('records');
    this.columns = this.getAttribute('columns');
    const loaded = await this.load();
    if (!loaded) {
      document.addEventListener(('db-ready'), (event) => {this.load();});
    }
  }

  disconnectedCallback() {
    console.log('DISCONNECTED SOURCE TABLE');
  }


  async load() {
    if (window.db === undefined) {
      return false;
    }
    if (this.source_records) {
      await window.db.create_table_from_records(this.name, window[this.source_records], this.columns);
    }
    else {
      await window.db.create_table(this.name, this.source_url, this.columns);
    }
    console.log('EMITTED', `data-loaded:${this.name}`);
    this.dispatchEvent(new CustomEvent(`data-loaded:${this.name}`, {bubbles: true, composed: true}));
    this.dispatchEvent(new CustomEvent(`data-loaded`, {bubbles: true, composed: true}));
    return true;
  }

}


class SourceView extends HTMLElement {

  constructor() {
    super();
  }

  async connectedCallback() {
    this.name = this.getAttribute('name');
    this.sql = this.textContent;
    this.textContent = '';
    this.source_tables = extractTableNames(this.sql);
    const loaded = await this.load();
    if (!loaded) {
      for (const table of this.source_tables) {
        document.addEventListener(`data-loaded:${table}`, (event) => {this.load();});
      }
    }
  }

  async load() {
    let db_is_ready = window.db !== undefined;
    if (db_is_ready) {
      for (const table of this.source_tables) {
        if(!(table in window.db.tables)) {
          db_is_ready = false;
          break;
        }
      }
    }
    if (!db_is_ready) {
      return false;
    }
    await window.db.create_view(this.name, this.sql);
    console.log('EMITTED', `data-loaded:${this.name}`);
    this.dispatchEvent(new CustomEvent(`data-loaded:${this.name}`, {bubbles: true, composed: true}));
    this.dispatchEvent(new CustomEvent(`data-loaded`, {bubbles: true, composed: true}));
    return true;
  }

}

customElements.define("source-table", SourceTable);
customElements.define("source-view", SourceView);



function extractTableNames(sql_query) {
  if (!sql_query) {
    return [];
  }

  const regex = /(?:FROM|JOIN)\s+(\w.*)/gi;
  const tableNames = [];
  let match;
  while ((match = regex.exec(sql_query)) !== null) {
    tableNames.push(match[1]);
  }
  return tableNames;
}
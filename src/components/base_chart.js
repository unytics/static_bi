import marked from 'https://cdn.jsdelivr.net/npm/marked/marked.min.js/+esm';
import DOMPurify from 'https://cdn.jsdelivr.net/npm/dompurify@3.2.4/dist/purify.min.js/+esm';



function slugify(text) {
  return text.replace(/[^\w ]+/g, "").replace(' ', '_');
}

function titleify(text) {
  return text.replace(/[^\w ]+/g, " ").toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');
}

function humanize(value) {
  if (Number.isInteger(value)) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  if (value instanceof Date) {
    return value.toISOString().replace('T00:00:00.000Z', '');
  }
  if (typeof value === 'string') {
    return markdown2html(value);
  }
  return value;
}

function markdown2html(markdown_content) {
  return DOMPurify.sanitize(marked.parse(markdown_content));
}

function filter2string(filter) {
  const [dimension, operator, value] = filter;
  let value_as_string;
  if (typeof value === 'string') {
    value_as_string = `'${value}'`;
  }
  else if (typeof Array.isArray(value)) {
    value_as_string = (
      '(' +
      value.map((v) => (typeof v === 'string') ? `'${v}'` : `${v}`).join(', ') +
      ')'
    )

  }
  else {
    value_as_string = `${value}`;
  }
  return `${dimension} ${operator} ${value_as_string}`;
}


const CHART_ELEMENTS = [];

let IS_CONTROL_KEY_DOWN = false;

document.addEventListener('keydown', (event) => {
  if (event.keyCode === 17) {
    IS_CONTROL_KEY_DOWN = true;
  }
});

document.addEventListener('keyup', (event) => {
  if (event.keyCode === 17) {
    IS_CONTROL_KEY_DOWN = false;
  }
});





class ChartElement extends HTMLElement {

  constructor() {
    super();
    this.table = this.getAttribute('table');
    this.by = this.getAttribute('by');
    this.breakdown_by = this.getAttribute('breakdown_by');
    this.measure = this.getAttribute('measure');
    this.measures = this.getAttribute('measures');
    this.where = this.getAttribute('where') || '1 = 1';
    this.limit = this.getAttribute('limit');
    this.breakdown_limit = this.getAttribute('breakdown_limit') || 6;
    this.order_by = this.getAttribute('order_by');
    this.stacked = this.hasAttribute('stacked');
    this.is_horizontal = this.hasAttribute('horizontal');
    this.select_tool = this.getAttribute('select_tool');
    this.filter = undefined;
  }

  get rerender_when_filter_changes() {
    return true;
  }

  connectedCallback() {
    console.log('BASE CHART CONNECTED!');
    this.init_html();
    this.render();
    const event_to_listen = this.table ? `data-loaded:${this.table}` : 'data-loaded';
    document.addEventListener(event_to_listen, (event) => {this.render();});
    if (this.rerender_when_filter_changes) {
      document.addEventListener(('filters-added'), (event) => {this.render();});
    }
    // this.addEventListener("visibilitychange", (event) => {this.render();});
    CHART_ELEMENTS.push(this);
  }

  disconnectedCallback() {
    console.log('DISCONNECTED');
  }

  init_html() {
    this.attachShadow({ mode: 'open' });
    // this.userContent = this.textContent ? markdown2html(this.textContent) : '';
    // this.shadowRoot.innerHTML = this.userContent + '\nINITIALIZING!';
    this.shadowRoot.innerHTML = 'INITIALIZING!';
  }

  get table_columns() {
    return window.db.tables[this.table];
  }

  async get_data() {
    throw new Error('Not implemented');
  }

  generate_html(data) {
    throw new Error('Not implemented');
  }

  show_loading() {
    this.shadowRoot.innerHTML = 'LOADING...';
  }

  async render() {
    // if (this.checkVisibility() === false) {
    //   console.log('DO NOT RENDER!');
    //   return;
    // }
    this.show_loading();
    if (!this.is_db_ready()) {
      return;
    }
    const data = await this.get_data();
    this.generate_html(data);
  }

  is_db_ready() {
    if (window.db === undefined) {
      return false;
    }
    if (window.db.db_ready === false) {
      return false;
    }
    if (!this.table) {
      return true;
    }
    if (this.table in window.db.tables) {
      return true;
    }
    return false;
  }

  set_filter(filter) {
    if ((this.filter === undefined) || (filter === undefined)) {
      this.filter = filter;
    }
    else if (filter[0] === this.filter[0] && filter[1] === this.filter[1] && filter[2] === this.filter[2]) {
      this.filter = undefined;
    }
    else if (!IS_CONTROL_KEY_DOWN) {
      this.filter = filter;
    }
    else {
      this.filter[1] = 'in';
      if (Array.isArray(this.filter[2])) {
        if (this.filter[2].includes(filter[2])) {
          this.filter[2] = this.filter[2].filter((v) => v != filter[2]);
        }
        else {
          this.filter[2].push(filter[2]);
        }
      }
      else {
        this.filter[2] = [this.filter[2], filter[2]];
      }
    }
    document.dispatchEvent(new CustomEvent('filters-added', {bubbles: true, composed: true}));
  }

  get where_clause() {
    const columns = this.table_columns;
    const filters = CHART_ELEMENTS
    .filter((chart) =>
      (chart!== this) &&
      (chart.filter !== undefined)
      // && columns.includes(chart.filter[0])
    );
    return this.where + filters.map((chart) => ' and ' + filter2string(chart.filter)).join('');
  }

}



export {
  ChartElement,
  humanize,
  slugify,
  titleify,
};

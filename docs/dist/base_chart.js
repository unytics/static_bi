import marked from 'https://cdn.jsdelivr.net/npm/marked/marked.min.js/+esm';
import DOMPurify from 'https://cdn.jsdelivr.net/npm/dompurify@3.2.4/dist/purify.min.js/+esm';



function slugify(text) {
  return text.replace(/[^\w ]+/g, "").replace(' ', '_');
}

function humanize(value) {
  if (Number.isInteger(value)) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  if (value instanceof Date) {
    return value.toISOString().replace('T00:00:00.000Z', '');
  }
  return value;
}

function markdown2html(markdown_content) {
  return DOMPurify.sanitize(marked.parse(markdown_content));
}


const CHART_ELEMENTS = [];



class ChartElement extends HTMLElement {

  constructor() {
    super();
  }

  connectedCallback() {
    this.table = this.getAttribute('table');
    this.by = this.getAttribute('by');
    this.breakdown_by = this.getAttribute('breakdown_by');
    this.measure = this.getAttribute('measure');
    this.measures = this.getAttribute('measures');
    this.limit = this.getAttribute('limit');
    this.order_by = this.getAttribute('order_by');
    this.stacked = this.getAttribute('stacked');
    this.filter = undefined;
    this.attachShadow({ mode: 'open' });
    this.userContent = this.textContent ? markdown2html(this.textContent) : '';
    this.shadowRoot.innerHTML = this.userContent + '\nINITIALIZING!';
    this.render();
    const event_to_listen = this.table ? `data-loaded:${this.table}` : 'data-loaded';
    document.addEventListener(event_to_listen, async (event) => {this.render();});
    document.addEventListener(('filters-added'), async (event) => {this.render();});
    CHART_ELEMENTS.push(this);
  }

  get table_columns() {
    return window.data_manager.tables[this.table];
  }

  async get_data() {
    throw new Error('Not implemented');
  }

  generate_html(data) {
    throw new Error('Not implemented');
  }

  async render() {
    if (!this.is_data_manager_ready()) {
      return;
    }
    const data = await this.get_data();
    this.generate_html(data);
  }

  is_data_manager_ready() {
    if (window.data_manager === undefined) {
      return false;
    }
    if (window.data_manager.db_ready === false) {
      return false;
    }
    if (!this.table) {
      return true;
    }
    if (this.table in window.data_manager.tables) {
      return true;
    }
    return false;
  }

  set_filter(filter) {
    if (this.filter !== undefined && filter !== undefined && filter[0] === this.filter[0] && filter[1] === this.filter[1] && filter[1] === this.filter[1] && filter[2] === this.filter[2]) {
      this.filter = undefined;
    }
    else {
      this.filter = filter;
    }
    document.dispatchEvent(new CustomEvent('filters-added', {bubbles: true, composed: true}));
  }

  get where_clause() {
    const columns = this.table_columns;
    const filters = CHART_ELEMENTS
    .filter((chart) =>
      (chart!== this) &&
      (chart.filter !== undefined) &&
      columns.includes(chart.filter[0])
    );
    if (!filters.length) {
      return '';
    }
    return 'where ' + filters
    .map(
      (chart) =>
      `${chart.filter[0]} ${chart.filter[1]} ${typeof chart.filter[2] === 'string' ? `'${chart.filter[2]}'` : chart.filter[2]}`
    )
    .join(' and ');
  }

}



export {
  ChartElement,
  humanize,
  slugify,
};

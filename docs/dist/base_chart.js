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

function add_filters(new_filters) {
  // Remove existing filters with the same column as new_filters
  const new_columns = new Set(new_filters.map((f) => f[0]));
  FILTERS = FILTERS.filter((f) => !new_columns.has(f[0]));

  FILTERS.push(...new_filters);

  document.dispatchEvent(new CustomEvent('filters-added', {bubbles: true, composed: true}));
}


const CHART_ELEMENTS = [];


function list_chart_filters() {
  return CHART_ELEMENTS.map((chart) => chart.filter).filter((f) => f !== undefined);
}




class ChartElement extends HTMLElement {

  constructor() {
    super();
  }

  connectedCallback() {
    this.table = this.getAttribute('table');
    this.dimension = this.getAttribute('dimension');
    this.dimensions = this.getAttribute('dimensions');
    this.breakdown_dimension = this.getAttribute('breakdown_dimension');
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
    this.filter = filter;
    document.dispatchEvent(new CustomEvent('filters-added', {bubbles: true, composed: true}));
  }

  get filter_as_string() {
    if (this.filter === undefined) {
      return '';
    }
    return this
  }

}



export {
  ChartElement,
  // FILTERS,
  list_chart_filters,
  // add_filters,
  humanize,
  slugify,
};

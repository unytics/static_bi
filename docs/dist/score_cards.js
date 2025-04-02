import {
    ChartElement,
    titleify,
  } from './base_chart.js';

import ssf from 'https://cdn.jsdelivr.net/npm/ssf@0.11.2/+esm';



class ScoreCard extends ChartElement {

  constructor() {
    super();
    this.format = this.getAttribute('format');
  }

  async get_data() {
    const query = `
      select ${this.measure}
      from ${this.table}
      ${this.where_clause}
    `;
    const data = await window.data_manager.query2value(query);
    return data;
  }

  generate_html(data) {
    const style = `
      .container {
        display: inline-block;
        min-width: 18%;
        text-align: center;
      }

      p {
        margin: 0;
      }

      .title {
        color: rgb(55, 65, 81);
      }

      .value {
        font-size: 1.2rem;
        font-weight: 500;
      }
    `;
    const title = titleify(this.title || this.measure);
    const formatted_value = this.format ? ssf.format(this.format, data) : data;
    this.shadowRoot.innerHTML = `
      <style>${style}</style>
      <div class="container">
          <p class="title">${title}</p>
          <p class="value">${formatted_value}</p>
      </div>
    `;
  }

}

customElements.define("score-card", ScoreCard);

import {
    ChartElement,
    titleify,
  } from './base_chart.js';

import ssf from 'https://cdn.jsdelivr.net/npm/ssf@0.11.2/+esm';

// https://customformats.com/
// https://docs.evidence.dev/core-concepts/formatting



class ScoreCard extends ChartElement {

  constructor() {
    super();
    this.value = this.getAttribute('value');
    this.format = this.getAttribute('format');
  }

  async get_data() {
    const query = `
      select ${this.value}
      from ${this.table}
      ${this.where_clause}
      ${this.order_by ? 'group by 1' : ''}
      ${this.order_by ? 'order by ' + this.order_by : ''}
    `;
    const data = await window.db.query2value(query);
    return data;
  }

  generate_html(data) {
    const style = `
      .container {
        display: inline-block;
        min-width: 17%;
        text-align: center;
        // border: .05rem solid #00000012;
        // padding: .8rem;
        // transition: border 0.25s, box-shadow 0.25s;
      }

      // .container:hover {
      //   border-color: #0000;
      //   box-shadow: 0 0.2rem 0.5rem #0000001a, 0 0 0.05rem #00000040;
      // }

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
    const title = titleify(this.title || this.value);
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

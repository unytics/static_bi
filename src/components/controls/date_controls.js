import moment from 'https://cdn.jsdelivr.net/npm/moment@2.30.1/+esm';
import { DateRangePicker } from '../../third_parties/vanilla-datetimerange-picker.js';

class DatePicker extends HTMLElement {

  constructor() {
    super();
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <link type="text/css" rel="stylesheet" href="https://cdn.jsdelivr.net/gh/alumuko/vanilla-datetimerange-picker@latest/dist/vanilla-datetimerange-picker.css">
      <div id="container">
        <input type="text" id="picker" size="24" style="text-align:center">
      </div>
    `;
    this.containerElement = this.shadowRoot.getElementById('container');
    this.pickerElement = this.shadowRoot.getElementById('picker');
    this.picker = new DateRangePicker(this.pickerElement, {
      parentEl: this.containerElement,
      ranges: {
        'Today': [moment().startOf('day'), moment().endOf('day')],
        'Yesterday': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
        'Last 7 Days': [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')],
        'This Month': [moment().startOf('month').startOf('day'), moment().endOf('month').endOf('day')],
      },
    });
    // this.picker = flatpickr(this.pickerElement, {
    //   // appendTo: this.containerElement,
    //   static: true,
    //   mode: 'range',
    //   defaultDate: ['2025-03-07', '2025-04-07'],
    //   // allowInput: true,
    // });
  }

}

// import flatpickr from 'https://cdn.jsdelivr.net/npm/flatpickr@4.6.13/+esm';

// class DatePicker extends HTMLElement {

//   constructor() {
//     super();
//   }

//   connectedCallback() {
//     this.attachShadow({ mode: 'open' });
//     this.shadowRoot.innerHTML = `
//       <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr@4.6.13/dist/flatpickr.min.css">
//       <input id="picker">
//     `;
//     this.pickerElement = this.shadowRoot.getElementById('picker');
//     this.picker = flatpickr(this.pickerElement, {
//       // appendTo: this.containerElement,
//       static: true,
//       mode: 'range',
//       defaultDate: ['2025-03-07', '2025-04-07'],
//       // allowInput: true,
//     });
//   }

// }

customElements.define("date-picker", DatePicker);

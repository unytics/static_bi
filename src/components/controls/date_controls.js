import flatpickr from 'https://cdn.jsdelivr.net/npm/flatpickr@4.6.13/+esm';

class DatePicker extends HTMLElement {

  constructor() {
    super();
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr@4.6.13/dist/flatpickr.min.css">
      <input id="picker">
    `;
    this.pickerElement = this.shadowRoot.getElementById('picker');
    this.picker = flatpickr(this.pickerElement, {
      // appendTo: this.containerElement,
      static: true,
      mode: 'range',
      defaultDate: ['2025-03-07', '2025-04-07'],
      // allowInput: true,
    });
  }

}

customElements.define("date-picker", DatePicker);

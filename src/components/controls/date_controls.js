import AirDatepicker from 'https://cdn.jsdelivr.net/npm/air-datepicker@3.5.3/+esm';
import sheet from 'https://cdn.jsdelivr.net/npm/air-datepicker@3.5.3/air-datepicker.css' with { type: 'css' };



class DatePicker extends HTMLElement {

  constructor() {
    super();
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [sheet];
    const style = `
    #container {
      display: flex
    }

    input, select {
      background-color: hsl(221deg, 14%, 100%);
      border-color: hsl(221deg, 14%, 86%);
      border-style: solid;
      border-width: 1px;
      box-sizing: border-box;
      margin: 0;
      padding: calc(0.5em - 1px) calc(0.75em - 1px);
      color: hsl(221deg, 14%, 29%);
      line-height: 2.5em;
      height: 2.5em;
    }

    input {
      border-top-left-radius: 0.375rem;
      border-bottom-left-radius: 0.375rem;
    }

    select {
      border-top-right-radius: 0.375rem;
      border-bottom-right-radius: 0.375rem;
      border-left: none;
    }
    `;


    this.shadowRoot.innerHTML = `
    <style>${style}</style>
    <div id="container">
      <input id="picker" autocomplete="off" placeholder="Custom Date Range">
      <select>
        <option value="" disabled selected>Select</option>
        <option>Last 7 days</option>
        <option>Last 30 days</option>
        <option>Last 90 days</option>
        <option disabled>──────────</option>
        <option>£</option>
        <option>€</option>
      </select>
    </div>
    `;
    this.containerElement = this.shadowRoot.getElementById('container');
    this.pickerElement = this.shadowRoot.getElementById('picker');
    this.picker = new AirDatepicker(this.pickerElement, {
      container: this.containerElement,
      range: true,
      locale: {
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          daysShort: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          daysMin: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
          months: ['January','February','March','April','May','June', 'July','August','September','October','November','December'],
          monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          today: 'Today',
          clear: 'Clear',
          dateFormat: 'yyyy-MM-dd',
          timeFormat: 'hh:ii aa',
          firstDay: 0
      }
    })
  }

}


customElements.define("date-picker", DatePicker);

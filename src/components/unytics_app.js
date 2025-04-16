import app from '../connectors/unytics_app.js';


class UnyticsApp extends HTMLElement {

  constructor() {
    super();
  }

  async connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        .hidden {
          display: none!important;
        }
      </style>
      <button id="sign-in" class="hidden">Sign In</button>
      <button id="sign-out">Sign Out</button>
      <button id="download">Download</button>
      <p id="logs"></p>
    `;
    this.signInButton = this.shadowRoot.getElementById('sign-in');
    this.signOutButton = this.shadowRoot.getElementById('sign-out');
    this.downloadButton = this.shadowRoot.getElementById('download');
    this.logsElement = this.shadowRoot.getElementById('logs');
    this.signInButton.onclick = app.signin;
    this.signOutButton.onclick = app.signout;
    app.on_auth_change((user) => { this.on_auth_change(user); });
    const user = app.get_user();
    console.log('USER', user);
  }

  on_auth_change(user) {
    if (user) {
      this.signInButton.classList.add('hidden');
      this.signOutButton.classList.remove('hidden');
      this.downloadButton.classList.remove('hidden');
    }
    else {
      this.signInButton.classList.remove('hidden');
      this.signOutButton.classList.add('hidden');
      this.downloadButton.classList.add('hidden');
    }
  }

  async load() {
    if (window.db === undefined) {
      return false;
    }
    await window.db.create_table(this.name, this.file, this.columns);
    console.log('EMITTED', `data-loaded:${this.name}`);
    this.dispatchEvent(new CustomEvent(`data-loaded:${this.name}`, { bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent(`data-loaded`, { bubbles: true, composed: true }));
    return true;
  }

}


customElements.define("unytics-app", UnyticsApp);

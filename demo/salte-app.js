import { LitElement, html, css } from 'lit-element';
import page from 'page';

import '../src/salte-pages.js';

class App extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
      }

      .button {
        display: inline-block;
        text-decoration: none;
        border: 1px solid rebeccapurple;
        color: rebeccapurple;
        padding: 10px;
        border-radius: 5px;

        transition: 0.15s ease-in-out;
        transition-property: background-color, color;
      }

      .button:hover, .button[active] {
        background: rebeccapurple;
        color: white;
      }
    `;
  }

  render() {
    return html`
      <div>
        <a href="/" class="button" ?active="${this.page === 'dashboard'}">Dashboard</a>
        <a href="/404" class="button" ?active="${this.page === '404'}">404</a>
      </div>
      <salte-pages selected="${this.page}" @load="${this.load}" fallback="404">
        <salte-page-dashboard
          page="dashboard">
        </salte-page-dashboard>
        <salte-page-404
          page="404">
        </salte-page-404>
      </salte-pages>
    `;
  }

  static get properties() {
    return {
      page: String
    };
  }

  constructor() {
    super();
    page('/:page?', (context) => {
      this.page = context.params.page || 'dashboard';
    });
    page();
  }

  load({ detail: page }) {
    let promise = Promise.resolve();

    if (page === 'dashboard') {
      promise = import('./salte-page-dashboard.js');
    } else if (page === '404') {
      promise = import('./salte-page-404.js');
    }

    promise.then(() => {
      console.log('Page loaded successfully!');
    }).catch((error) => {
      console.error(error);
    });
  }
}

customElements.define('salte-app', App);

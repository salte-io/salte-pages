import { LitElement, html, css } from 'lit-element';

import PageMixin from './salte-page-mixin.js';

class Dashboard extends PageMixin(LitElement) {
  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    `;
  }

  render() {
    return html`
      Dashboard
    `;
  }
}

customElements.define('salte-page-dashboard', Dashboard);

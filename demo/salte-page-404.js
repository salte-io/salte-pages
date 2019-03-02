import { LitElement, html, css } from 'lit-element';

import PageMixin from './salte-page-mixin.js';

class NotFound extends PageMixin(LitElement) {
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
      404
    `;
  }
}

customElements.define('salte-page-404', NotFound);

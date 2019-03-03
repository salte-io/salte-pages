import { LitElement, html, css } from 'lit-element';

class SaltePages extends LitElement {
  static get styles() {
    return css`
      :host([loading]) {
        pointer-events: none;
      }

      :host ::slotted(:not([selected])) {
        display: none;
      }
    `;
  }

  render() {
    return html`
      <slot></slot>
    `;
  }

  static get properties() {
    return {
      selected: String,
      fallback: String,
      attribute: String,

      loading: {
        type: Boolean,
        reflect: true
      }
    };
  }

  constructor() {
    super();

    this.fallback = null;
    this.attribute = 'page';
    this.loading = false;
  }

  updated(changedProperties) {
    if (changedProperties) {
      if (changedProperties.has('selected')) {
        this.loading = true;
  
        /** @type {Promise<void>} */
        this.loadComplete = Promise.resolve().then(() => {
          const { page, element } = this._query(this.selected, this.fallback);
  
          if (!element) {
            throw new Error(`The given pages do not exist. (selected: ${this.selected}, fallback: ${this.fallback})`);
          }
  
          const event = new CustomEvent('load', {
            detail: page
          });
          this.dispatchEvent(event);
  
          const promises = [];
          if (element.tagName.match(/^\w+-/i)) {
            promises.push(window.customElements.whenDefined(element.tagName.toLowerCase()));
          }
  
          return Promise.all(promises).then(() => {
            const previouslySelected = this.querySelector('[selected]');
  
            const promises = [];
            if (previouslySelected) {
              promises.push(Promise.resolve(previouslySelected.hide && previouslySelected.hide()).then(() => {
                previouslySelected.removeAttribute('selected');
              }));
            }
  
            return Promise.all(promises).then(() => {
              element.setAttribute('selected', '');
  
              return Promise.resolve(element.show && element.show(!!previouslySelected));
            }).then(() => {
              const event = new CustomEvent('loaded', {
                detail: page
              });
              this.dispatchEvent(event);
  
              // Wait for the next render...
              return this._renderComplete;
            });
          })
        }).then(() => {
          this.loading = false;
        }).catch((error) => {
          this.loading = false;
          console.error(error);
          const event = new CustomEvent('load-failed', {
            detail: this.selected
          });
          this.dispatchEvent(event);
          return Promise.reject(error);
        });
      }
    }
  }

  _query(page, fallback) {
    const element = this.querySelector(`[${this.attribute}="${page}"]`);

    if (element) {
      return { page, element };
    }

    if (fallback) {
      return this._query(fallback);
    }

    return { page, element: null };
  }

  get _renderComplete() {
    return new Promise((resolve) => setTimeout(() => window.requestAnimationFrame(resolve)));
  }
}

customElements.define('salte-pages', SaltePages);
export { SaltePages };

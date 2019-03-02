const { LitElement, html } = require('lit-element');

const chai = require('chai');
chai.use(require('chai-as-promised'));
const { expect } = chai;

const fixture = require('../utilities/fixture.js');
const { SaltePages } = require('../../src/salte-pages.js'); /* eslint-disable-line */

describe('element(salte-pages)', () => {
  /** @type {SaltePages} */
  let element;
  beforeEach(async () => {
    sinon.stub(console, 'error');

    element = await fixture('salte-pages', `
      <div page="dashboard">Dashboard</div>
      <div page="404">404</div>
    `);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('binding(selected)', () => {
    it('should render the current page', async () => {
      element.selected = 'dashboard';

      await element.updateComplete;
      await element.loadComplete;

      const selected = element.querySelector('[selected]');
      expect(selected).to.be.ok;
      expect(selected.getAttribute('page')).to.equal('dashboard');
    });

    it('should support loading custom elements async', async () => {
      element = await fixture('salte-pages', `
        <salte-dashboard page="dashboard">Dashboard</salte-dashboard>
        <div page="404">404</div>
      `);

      element.addEventListener('load', () => {
        class Dashboard extends LitElement {
          render() {
            return html`
              Dashboard
            `;
          }
        }
  
        customElements.define('salte-dashboard', Dashboard);
      });

      element.selected = 'dashboard';

      await element.updateComplete;

      expect(element.loading).to.equal(true);
      await element.loadComplete;

      const selected = element.querySelector('[selected]');
      expect(selected).to.be.ok;
      expect(selected.getAttribute('page')).to.equal('dashboard');
      expect(selected.tagName).to.equal('SALTE-DASHBOARD');
      expect(element.loading).to.equal(false);
    });

    it('should support a fallback page', async () => {
      element.fallback = '404';
      element.selected = 'invalid-page';

      await element.updateComplete;

      expect(element.loading).to.equal(true);
      await element.loadComplete;

      const selected = element.querySelector('[selected]');
      expect(selected).to.be.ok;
      expect(selected.getAttribute('page')).to.equal('404');
      expect(element.loading).to.equal(false);
    });

    it(`should fail gracefully if a fallback page isn't specified`, async () => {
      element.selected = 'invalid-page';

      await element.updateComplete;

      expect(element.loading).to.equal(true);
      await expect(element.loadComplete).to.be.rejectedWith(/^The given pages do not exist./);

      expect(console.error.callCount).to.equal(1);
      expect(element.loading).to.equal(false);
    });

    it(`should deselect prior pages`, async () => {
      element.selected = 'dashboard';

      await element.updateComplete;

      expect(element.loading).to.equal(true);
      await element.loadComplete;

      const selected = element.querySelector('[selected]');
      expect(selected).to.be.ok;
      expect(selected.getAttribute('page')).to.equal('dashboard');
      expect(element.loading).to.equal(false);

      element.selected = '404';

      await element.updateComplete;

      expect(element.loading).to.equal(true);
      await element.loadComplete;

      const selectedElements = element.querySelectorAll('[selected]');
      expect(selectedElements.length).to.equal(1);
      expect(selectedElements[0].getAttribute('page')).to.equal('404');
      expect(element.loading).to.equal(false);
    });
  });

  describe('binding(attribute)', () => {
    it('should support other attributes', async () => {
      element = await fixture('salte-pages', `
        <div name="dashboard">Dashboard</div>
        <div name="404">404</div>
      `);

      element.attribute = 'name';
      element.selected = 'dashboard';

      await element.updateComplete;
      await element.loadComplete;

      const selected = element.querySelector('[selected]');
      expect(selected).to.be.ok;
      expect(selected.getAttribute('name')).to.equal('dashboard');
    });
  });

  describe('api(show)', () => {
    it('should invoke show on the active element', async () => {
      element = await fixture('salte-pages', `
        <show-1 page="example"></show-1>
        <div page="404">404</div>
      `);

      element.selected = 'example';

      return new Promise((resolve) => {
        class Show1 extends LitElement {
          show(animate) {
            expect(animate).to.equal(false);
            resolve();
          }
        }
  
        customElements.define('show-1', Show1);
      });
    });

    it('should inform the element that it needs to animate', async () => {
      element = await fixture('salte-pages', `
        <show-2 page="example"></show-2>
        <div page="404">404</div>
      `);

      element.selected = '404';

      await element.updateComplete;
      await element.loadComplete;

      element.selected = 'example';

      return new Promise((resolve) => {
        class Show2 extends LitElement {
          show(animate) {
            expect(animate).to.equal(true);
            resolve();
          }
        }
  
        customElements.define('show-2', Show2);
      });
    });
  });

  describe('api(hide)', () => {
    it('should invoke hide on the prior element', async () => {
      const promise = new Promise((resolve) => {
        class Hide1 extends LitElement {
          hide() {
            resolve();
          }
        }
  
        customElements.define('hide-1', Hide1);
      });
      
      element = await fixture('salte-pages', `
        <hide-1 page="example"></hide-1>
        <div page="404">404</div>
      `);

      element.selected = 'example';

      await element.updateComplete;
      await element.loadComplete;
      
      element.selected = '404';

      return promise;
    });
  });
});

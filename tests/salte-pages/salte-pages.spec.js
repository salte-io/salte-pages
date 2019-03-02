const { expect } = require('chai');

require('../../src/salte-pages.js');

describe('element(salte-pages)', () => {
  let element;
  beforeEach(async () => {
    document.body.innerHTML = `
      <salte-pages fallback="404">
        <div page="dashboard">Dashboard</div>
        <div page="404">404</div>
      </salte-pages>
    `;

    element = document.body.querySelector('salte-pages');
    await element.updateComplete;
  });


  describe('binding(selected)', () => {
    it('should render the current page', async () => {
      element.selected = 'dashboard';

      await element.loadComplete;s

      const selected = element.querySelector('[selected]');
      expect(selected).to.be.ok;
      expect(selected.getAttribute('page')).to.equal('dashboard');
    });

    it('should support a fallback page', async () => {
      element.selected = 'invalid-page';

      await element.loadComplete;

      const selected = element.querySelector('[selected]');
      expect(selected).to.be.ok;
      expect(selected.getAttribute('page')).to.equal('404');
    });
  });

  describe('binding(attribute)', () => {
    it('...', () => {

    });
  });
});

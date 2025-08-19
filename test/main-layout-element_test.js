import {fixture, html, expect} from '@open-wc/testing';
import '../src/components/layouts/main-layout-element.js';

suite('main-layout-element', () => {
  test('renders nav-element, title-element and projects slotted content', async () => {
    const el = await fixture(html`
      <main-layout-element>
        <div id="slot-content">Slot content</div>
      </main-layout-element>
    `);
    await el.updateComplete;

    const nav = el.shadowRoot.querySelector('nav-element');
    const title = el.shadowRoot.querySelector('title-element');
    const main = el.shadowRoot.querySelector('main');
    const slot = el.shadowRoot.querySelector('slot');

    expect(nav).to.exist;
    expect(title).to.exist;
    expect(main).to.exist;
    expect(slot).to.exist;

    const assigned = slot.assignedElements();
    expect(assigned).to.have.lengthOf(1);
    expect(assigned[0].id).to.equal('slot-content');
    expect(assigned[0].textContent.trim()).to.equal('Slot content');
  });

  test('pageTitle is a reactive property', async () => {
    const el = await fixture(html`<main-layout-element></main-layout-element>`);
    el.pageTitle = 'My Page';
    await el.updateComplete;
    expect(el.pageTitle).to.equal('My Page');
  });
});

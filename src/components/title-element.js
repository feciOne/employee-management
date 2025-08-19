import {LitElement, html, css} from 'lit';
import {getCurrentRouteData} from '../router.js';
import {store} from '../my-store.js';
import {t} from '../translation-helper.js';

export class TitleElement extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 0;
        width: 100%;
      }

      #page-title h1 {
        margin-top: 0;
        color: var(--color-primary);
        font-weight: var(--font-weight-regular);
      }
    `;
  }

  static get properties() {
    return {
      pageTitle: {type: String}
    };
  }

  constructor() {
    super();
    this.pageTitle = '';

    store.getLang$().subscribe(() => {
      this.requestUpdate();
    });
  }

  connectedCallback() {
    super.connectedCallback();
    const data = getCurrentRouteData();

    this.pageTitle = data && data.title ? data.title : '';

    window.addEventListener('vaadin-router-location-changed', () => {
      const d = getCurrentRouteData();
      this.pageTitle = d && d.title ? d.title : '';
    });
  }

  disconnectedCallback() {
    window.removeEventListener('vaadin-router-location-changed', this);
    super.disconnectedCallback();
  }

  render() {
    return html`
      <div id="page-title">
        <h1>${t(this.pageTitle)}</h1>
      </div>
    `;
  }
}

window.customElements.define('title-element', TitleElement);

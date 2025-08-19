import {LitElement, html, css} from 'lit';
import '../nav-element.js';
import '../title-element.js';

export class MainLayoutElement extends LitElement {
  static get styles() {
    return css`
      :host {
        main {
          padding: 2rem 5rem;
        }
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
  }

  render() {
    return html`
      <header>
        <nav-element></nav-element>
      </header>
      <main>
        <title-element></title-element>
        <slot></slot>
      </main>
    `;
  }
}

window.customElements.define('main-layout-element', MainLayoutElement);

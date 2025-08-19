import {LitElement, html, css} from 'lit';
import {t} from '../translation-helper.js';
import {store} from '../my-store.js';

export class NavElement extends LitElement {
  static get styles() {
    return css`
      :host {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: var(--color-white);
        padding: 0 1rem;
      }

      #right {
        display: flex;
        align-items: center;
      }

      nav {
        margin-right: var(--space-lg);
      }

      .nav-links {
        list-style: none;
        display: flex;
        font-size: var(--font-normal);
      }

      .nav-links li {
        margin-left: var(--space-md);
      }

      .nav-links li img {
        filter: opacity(0.4);
        margin-right: var(--space-sm);
      }

      .nav-links li a {
        display: flex;
        align-items: center;
        font-weight: var(--font-weight-regular);
        text-decoration: none;
        cursor: pointer;
        color: var(--color-inactive);
      }

      .active,
      .nav-links li a:hover {
        color: var(--color-primary) !important;
      }

      .active img,
      .nav-links li a:hover img {
        filter: opacity(1) !important;
      }

      .logo {
        display: flex;
        align-items: center;
        background-image: url('/src/assets/img/logo.svg');
        background-repeat: no-repeat;
        background-position: left center;
        height: 40px;
        background-size: 40px 40px;
        padding-left: calc(40px + 1.5rem);
      }

      .logo h2 {
        margin: 0;
        font-weight: var(--font-weight-strong);
      }

      /* .dropdown {
        position: relative;
        display: inline-block;
      }

      .dropdown-content {
        display: none;
        position: absolute;
        background-color: #f9f9f9;
        min-width: 160px;
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
        z-index: 1;
        left: auto;
        right: 0;
        transform-origin: top right;
      }

      .dropdown:hover .dropdown-content {
        display: block;
      } */

      .language {
        position: relative;
        display: inline-block;
      }

      .language-dropdown {
        display: none;
        position: absolute;
        background-color: #f9f9f9;
        padding: var(--space-sm);
        min-width: 160px;
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
        z-index: 1;
        left: auto;
        right: 0;
        transform-origin: top right;
      }

      .language:hover .language-dropdown {
        display: flex;
        flex-direction: column;
      }

      .language:hover .language-dropdown a {
        cursor: pointer;
        padding: var(--space-sm);
        margin-top: var(--space-sm);
      }

      .language:hover .language-dropdown a:hover {
        background-color: var(--color-muted);
        color: var(--color-text-dark-bg);
      }

      @media (max-width: 1000px) {
        :host {
          flex-direction: column;
          align-items: center;
          padding: var(--space-md);
        }

        .nav-links {
          padding-inline-start: 0;
          flex-direction: column;
          align-items: flex-start;
          gap: var(--space-lg);
        }

        #right {
          flex-direction: column;
          margin-top: var(--space-md);
        }
      }
    `;
  }

  static get properties() {
    return {
      activePath: {type: String}
    };
  }

  constructor() {
    super();

    this.activePath = '/';
    this.lang = store.getLang();
  }

  connectedCallback() {
    super.connectedCallback();

     window.addEventListener('vaadin-router-location-changed', (event) => {
      console.log('Location changed:', event.detail.location);
      this.activePath = event.detail.location.pathname;
    });

    store.getLang$().subscribe(() => {
      this.requestUpdate();
    });
  }

  disconnectedCallback() {
    window.removeEventListener('vaadin-router-location-changed', this);
    super.disconnectedCallback();
  }

  render() {
    return html`
      <div class="logo">
        <h2>ING</h2>
      </div>
      <div id="right">
        <nav>
          <ul class="nav-links">
            <li>
              <a href="/" class=${this.activePath === '/' ? 'active' : ''}>
                <img
                  src="/src/assets/img/icons/employees.png"
                  height="32px"
                  alt="employee icon"
                />
                ${t('employees')}
              </a>
            </li>
            <li>
              <a
                href="/employee/new"
                class=${this.activePath.startsWith('/employee')
                  ? 'active'
                  : ''}
              >
                <img
                  src="/src/assets/img/icons/add-new.png"
                  height="32px"
                  alt="employee icon"
                />
                ${t('addNew')}
              </a>
            </li>
          </ul>
        </nav>
        <div class="language">
          <a href="#"
            ><img
              src="/src/assets/img/flags/${this.lang}.svg"
              height="16px"
              alt="${this.lang}"
          /></a>
          <div class="language-dropdown">
            <a @click=${{handleEvent: () => this.changeLanguage('tr')}}
              ><img
                src="/src/assets/img/flags/tr.svg"
                height="16px"
                alt="TR Flag"
            /> Türkçe</a>
            <a @click=${{handleEvent: () => this.changeLanguage('en')}}
              ><img
                src="/src/assets/img/flags/en.svg"
                height="16px"
                alt="US Flag"
            /> English</a>
          </div>
        </div>
      </div>
    `;
  }

  changeLanguage(lang) {
    this.lang = lang;
    store.setLang(lang);
    document.documentElement.lang = lang;
  }
}

window.customElements.define('nav-element', NavElement);

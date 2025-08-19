import {LitElement, html, css} from 'lit';
import {classMap} from 'lit/directives/class-map.js';
import {styleMap} from 'lit/directives/style-map.js';
import {repeat} from 'lit/directives/repeat.js';
import {store} from '../my-store';
import {fromEvent, Subject} from 'rxjs';
import {
  map,
  debounceTime,
  distinctUntilChanged,
  takeUntil,
} from 'rxjs/operators';

export class ListElement extends LitElement {
  static get styles() {
    return css`
      #page-toolbar {
        display: flex;
        justify-content: space-between;
      }

      #page-toolbar span img {
        cursor: pointer;
        margin-left: var(--space-md);
      }

      #page-toolbar .form-group {
        position: relative;
        width: 250px;
        margin-bottom: var(--space-md);
      }

      #page-toolbar .form-control {
        padding: 0.375rem 0.75rem;
        border-radius: var(--radius-md);
        border: 1px solid var(--color-border);
        font-size: var(--font-normal);
        font-weight: var(--font-weight-regular);
        height: var(--input-height);
        width: 100%;
      }

      @media (max-width: 1000px) {
        #page-toolbar .form-group {
          width: 50%;
        }
      }

      .card {
        padding: 0;
      }

      .card-body {
        display: flex;
        flex-wrap: wrap;
        overflow-x: auto;
        background-color: var(--color-white);
        border-radius: var(--radius-md);
        padding: var(--space-lg);
      }

      .card-body-list {
        display: flex;
        background-color: var(--color-bg);
        padding: var(--space-lg);
      }

      .card-body .no-record-text {
        width: 100%;
        color: var(--color-primary);
        text-align: center;
      }

      .actions a {
        cursor: pointer;
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      th {
        color: var(--color-primary);
      }

      th,
      td {
        padding: var(--space-md);
        text-align: left;
        border-bottom: 1px solid #ddd;
      }

      .employee-card-container {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        column-gap: 150px;
        row-gap: 5rem;
      }

      .employee-card {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        background-color: var(--color-white);
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        padding: var(--space-lg) var(--space-lg);
        flex: 0 0 calc((100% - 150px) / 2);
      }

      .employee-card-body {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        column-gap: 2rem;
      }

      .employee-card-body .cell {
        flex: 0 0 calc((100% - 2rem) / 2);
        margin-bottom: var(--space-md);
      }

      .employee-card-body .cell span {
        color: #aca7a7;
        font-weight: var(--font-weight-normal);
      }

      .employee-card-body .cell p {
        color: var(--color-black);
        font-weight: var(--font-weight-normal);
        margin: 0;
      }

      .employee-card-body .actions {
        width: calc(50% - 2rem);
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }

      .employee-card-body .actions .btn {
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        height: 44px;
        background-color: transparent;
        color: var(--color-text);
        font-size: var(--font-large);
        cursor: pointer;
        border-radius: var(--radius-md);
        flex: 0 0 calc(50% - 1rem);
        margin-right: var(--space-md);
      }

      .employee-card-body .actions .btn.edit {
        background-color: #525294;
        color: var(--color-white);
      }

      .employee-card-body .actions .btn.delete {
        background-color: var(--color-primary);
        color: var(--color-white);
      }

      .employee-card-body .actions img {
        margin-right: var(--space-sm);
        filter: invert(1) brightness(20);
      }

      .paginator {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        margin-top: var(--space-md);
      }

      .paginator button {
        min-width: 36px;
        height: 36px;
        padding: 0 0.5rem;
        border-radius: 50%;
        border: 1px solid transparent;
        background: transparent;
        color: var(--color-text);
        cursor: pointer;
      }

      .paginator button[disabled] {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .paginator button.active {
        background: var(--color-primary);
        border-color: var(--color-primary);
        border-radius: 50%;
        color: var(--color-white);
      }

      .paginator button:first-child,
      .paginator button:last-child {
        color: var(--color-primary);
        font-size: 2rem;
        margin-bottom: 10px;
      }

      .paginator button:first-child[disabled],
      .paginator button:last-child[disabled] {
        color: unset;
      }

      paginator[hidden] {
        display: none !important;
      }

      @media (max-width: 1400px) {
        .employee-card-container {
          column-gap: 1rem;
        }

        .employee-card {
          flex: 0 0 calc((100% - 1rem) / 2);
        }
      }

      @media (max-width: 1200px) {
        .employee-card-container {
          column-gap: 0;
        }

        .employee-card {
          flex: 1 1 100%;
        }
      }

      @media (max-width: 700px) {
        table th,
        table td {
          display: block;
          width: 100%;
        }

        table td {
          text-align: right;
          padding-top: 8px;
          padding-bottom: 8px;
          border-bottom: none;
        }

        table tr td:first-child {
          padding-top: 12px;
        }

        table tr td:last-child {
          padding-bottom: 12px;
        }

        .employee-card-body {
          flex-direction: column;
          column-gap: 0;
        }

        .employee-card-body .cell {
          width: 100%;
        }

        .employee-card-body .actions {
          width: 100%;
        }
      }
    `;
  }

  static get properties() {
    return {
      employeeList: {type: Array},
      view: {type: String},
      lang: {type: String},
      translations: {type: Object},
      searchTerm: {type: String},
      isPaginatorVisible: {type: Boolean},
      page: {type: Number},
      pageSize: {type: Number},
    };
  }

  constructor() {
    super();
    this._getData();

    this.view = 'table';
    this.searchTerm = '';
    this.isPaginatorVisible = true;
    this._destroy$ = new Subject();

    this.page = store.getPage();
    this.pageSize = store.getPageSize();

    this.translations = {
      tr: {
        search: 'Ara',
        edit: 'Düzenle',
        delete: 'Sil',
        title: 'Çalışan Listesi',
        column: {
          id: 'Id',
          firstName: 'Adı',
          lastName: 'Soyadı',
          dateOfEmployment: 'İşe Giriş Tarihi',
          dateOfBirth: 'Doğum Tarihi',
          phone: 'Telefon',
          email: 'E-posta',
          department: 'Departman',
          position: 'Pozisyon',
          actions: 'İşlemler',
        },
        message: {
          noRecord: 'Kayıt yok!',
          deleteConfirmation: 'Silmek istediğinizden emin misiniz?',
        },
      },
      en: {
        search: 'Search',
        edit: 'Edit',
        delete: 'Delete',
        title: 'Employee List',
        column: {
          id: 'Id',
          firstName: 'First Name',
          lastName: 'Last Name',
          dateOfEmployment: 'Date of Employment',
          dateOfBirth: 'Date of Birth',
          phone: 'Phone',
          email: 'Email',
          department: 'Department',
          position: 'Position',
          actions: 'Actions',
        },
        message: {
          noRecord: 'No record found!',
          deleteConfirmation: 'Are you sure that do you want to delete?',
        },
      },
    };

    store.getLang$().subscribe((lang) => (this.lang = lang));
  }

  _getData() {
    store
      .getAllItems(this.page, this.pageSize)
      .subscribe((data) => (this.employeeList = data));
    this.requestUpdate();
  }

  get totalPages() {
    return store.getTotalPages() || 1;
  }

  get displayedList() {
    const list = Array.isArray(this.employeeList) ? [...this.employeeList] : [];

    return list.reverse();
  }

  _changePage(page) {
    const p = Math.min(Math.max(1, page), this.totalPages);
    if (p === this.page) return;
    this.page = p;
    this._getData();
  }

  firstUpdated() {
    const searchInputEl = this.renderRoot.querySelector('#searchTerm');

    if (!searchInputEl) return;

    fromEvent(searchInputEl, 'input')
      .pipe(
        map((e) => e.target.value),
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this._destroy$)
      )
      .subscribe((val) => {
        this.searchTerm = val;
        this._onSearchDebounced(val);
      });
  }

  disconnectedCallback() {
    this._destroy$.next();
    this._destroy$.complete();
    super.disconnectedCallback();
  }

  _onSearchDebounced(term) {
    if (!term) {
      this.isPaginatorVisible = true;
      this._getData();

      return;
    }

    this.isPaginatorVisible = false;
    this.employeeList = store.filterItems(term) || [];
    this.requestUpdate();
  }

  toggleView(view) {
    this.view = view;
  }

  _formatDate(date) {
    return date.split('-').reverse().join('/');
  }

  _deleteItem(id) {
    if (confirm(this.translations[this.lang].message.deleteConfirmation)) {
      store.removeItem(id);
    }
  }

  render() {
    const tableStyles = {
      display: this.employeeList.length === 0 ? 'none' : 'block',
    };
    const classes = {
      'card-body': this.view === 'table',
      'card-body-list': this.view === 'list',
    };

    return html`
      <div id="page-toolbar">
        <div class="form-group">
          <input
            type="text"
            id="searchTerm"
            class="form-control"
            .placeholder=${this.translations[this.lang].search}
            .value=${this.searchTerm}
          />
        </div>

        <span>
          <img
            @click=${() => this.toggleView('list')}
            src="/src/assets/img/icons/list.png"
            style="filter: opacity(${this.view === 'list' ? 0.4 : 1});"
            height="48px"
          />
          <img
            @click=${() => this.toggleView('table')}
            src="/src/assets/img/icons/table.png"
            style="filter: opacity(${this.view === 'table' ? 0.4 : 1});"
            height="48px"
          />
        </span>
      </div>

      <div class="card">
        <div class=${classMap(classes)}>
          ${this.employeeList.length === 0
            ? html`
                <h3 class="no-record-text">
                  ${this.translations[this.lang].message.noRecord}
                </h3>
              `
            : null}
          ${this.view === 'table'
            ? html`
                <table style=${styleMap(tableStyles)}>
                  <thead>
                    <tr>
                      <th>${this.translations[this.lang].column.id}</th>
                      <th>${this.translations[this.lang].column.firstName}</th>
                      <th>${this.translations[this.lang].column.lastName}</th>
                      <th>
                        ${this.translations[this.lang].column.dateOfEmployment}
                      </th>
                      <th>
                        ${this.translations[this.lang].column.dateOfBirth}
                      </th>
                      <th>${this.translations[this.lang].column.phone}</th>
                      <th>${this.translations[this.lang].column.email}</th>
                      <th>${this.translations[this.lang].column.department}</th>
                      <th>${this.translations[this.lang].column.position}</th>
                      <th>${this.translations[this.lang].column.actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${repeat(
                      this.displayedList,
                      (employee) => employee.id,
                      (employee) => html`
                        <tr>
                          <td>${employee.id}</td>
                          <td>${employee.firstName}</td>
                          <td>${employee.lastName}</td>
                          <td>
                            ${this._formatDate(employee.dateOfEmployment)}
                          </td>
                          <td>
                            ${employee.dateOfBirth
                              ? this._formatDate(employee.dateOfBirth)
                              : employee.dateOfBirth}
                          </td>
                          <td>${employee.phone}</td>
                          <td>${employee.email}</td>
                          <td>${employee.department}</td>
                          <td>${employee.position}</td>
                          <td class="actions">
                            <a href="/employee/edit/${employee.id}"
                              ><img
                                src="/src/assets/img/icons/edit.svg"
                                height="24px"
                                alt=${this.translations[this.lang].edit}
                            /></a>
                            <a
                              @click=${{
                                handleEvent: () =>
                                  this._deleteItem(employee.id),
                              }}
                              ><img
                                src="/src/assets/img/icons/delete-filled.svg"
                                height="24px"
                                alt=${this.translations[this.lang].delete}
                            /></a>
                          </td>
                        </tr>
                      `
                    )}
                  </tbody>
                </table>
              `
            : html`
                <div class="employee-card-container">
                  ${this.displayedList.map(
                    (employee) => html`
                      <div class="employee-card">
                        <div class="employee-card-body">
                          <div class="cell">
                            <span
                              >${this.translations[this.lang].column
                                .firstName}</span
                            >
                            <p>${employee.firstName}</p>
                          </div>
                          <div class="cell">
                            <span
                              >${this.translations[this.lang].column
                                .lastName}</span
                            >
                            <p>${employee.lastName}</p>
                          </div>

                          <div class="cell">
                            <span
                              >${this.translations[this.lang].column
                                .dateOfEmployment}</span
                            >
                            <p>
                              ${this._formatDate(employee.dateOfEmployment)}
                            </p>
                          </div>
                          <div class="cell">
                            <span
                              >${this.translations[this.lang].column
                                .dateOfBirth}</span
                            >
                            <p>${this._formatDate(employee.dateOfBirth)}</p>
                          </div>

                          <div class="cell">
                            <span
                              >${this.translations[this.lang].column
                                .phone}</span
                            >
                            <p>${employee.phone}</p>
                          </div>
                          <div class="cell">
                            <span
                              >${this.translations[this.lang].column
                                .email}</span
                            >
                            <p>${employee.email}</p>
                          </div>

                          <div class="cell">
                            <span
                              >${this.translations[this.lang].column
                                .department}</span
                            >
                            <p>${employee.department}</p>
                          </div>
                          <div class="cell">
                            <span
                              >${this.translations[this.lang].column
                                .position}</span
                            >
                            <p>${employee.position}</p>
                          </div>

                          <span class="actions">
                            <a
                              href="/employee/edit/${employee.id}"
                              class="btn edit"
                              ><img
                                src="/src/assets/img/icons/edit.svg"
                                height="24px"
                                alt=${this.translations[this.lang].edit}
                              />${this.translations[this.lang].edit}</a
                            >
                            <a
                              @click=${{
                                handleEvent: () =>
                                  this._deleteItem(employee.id),
                              }}
                              class="btn delete"
                              ><img
                                src="/src/assets/img/icons/delete-filled.svg"
                                height="24px"
                                alt=${this.translations[this.lang].delete}
                              />${this.translations[this.lang].delete}</a
                            >
                          </span>
                        </div>
                      </div>
                    `
                  )}
                </div>
              `}
        </div>
        ${!this.isPaginatorVisible
          ? ''
          : html` <div class="paginator">
              <button
                @click=${() => this._changePage(this.page - 1)}
                ?disabled=${this.page <= 1}
              >
                ‹
              </button>

              ${Array.from({length: this.totalPages}, (_, i) => i + 1).map(
                (p) => html`
                  <button
                    class=${this.page === p ? 'active' : ''}
                    @click=${() => this._changePage(p)}
                  >
                    ${p}
                  </button>
                `
              )}
              <button
                @click=${() => this._changePage(this.page + 1)}
                ?disabled=${this.page >= this.totalPages}
              >
                ›
              </button>
            </div>`}
      </div>
    `;
  }
}

window.customElements.define('list-element', ListElement);

import {LitElement, html, css} from 'lit';
import {store} from '../my-store';
import {redirectToPath, isRouterReady} from '../router';
import {t} from '../translation-helper.js';
import {take} from 'rxjs';

export class EmployeeFormElement extends LitElement {
  static get styles() {
    return css`
      .card {
        background-color: var(--color-white);
        border-radius: var(--radius-md);
        padding: 5rem 10rem;
      }

      .card-info {
        display: relative;
        margin-left: -9rem;
        margin-top: -4rem;
        font-weight: var(--font-weight-normal);
      }

      .card-body {
        display: flex;
        flex-wrap: wrap;
        column-gap: 10rem;
        row-gap: 4rem;
      }

      .form-group {
        box-sizing: border-box;
        flex: 0 0 calc((100% - 20rem) / 3);
        min-width: 220px;
        display: flex;
        flex-direction: column;
      }

      @media (max-width: 1100px) {
        .card {
          padding: 2rem;
        }

        .card-info {
          margin-left: -1rem;
          margin-top: -1rem;
        }

        .card-body {
          column-gap: 2rem;
          row-gap: 4rem;
        }

        .form-group {
          flex: 0 0 calc((100% - 2rem) / 2);
        }
      }

      @media (max-width: 600px) {
        .card {
          padding: var(--space-md);
        }

        .card-info {
          margin-left: -var(--space-sm);
          margin-top: -var(--space-sm)
        }

        .card-body {
          column-gap: unset;
          row-gap: 4rem;
        }

        .form-group {
          flex: 0 0 100%;
        }
      }

      .form-control {
        padding: 0.375rem 0.75rem;
        border-radius: var(--radius-md);
        border: 1px solid var(--color-border);
        height: var(--input-height);
      }

      .form-group > label {
        font-size: var(--font-normal);
        font-weight: var(--font-weight-light);
        padding-bottom: var(--space-sm);
      }

      .form-group select {
        margin: 0 !important;
        height: 3rem;
        font-family: var(--font-base);
        color: var(--color-text);
        font-weight: var(--font-weight-light);
        font-size: var(--font-normal);
      }

      .form-group input[type='date'] {
        background-image: url('/src/assets/img/icons/calendar-icon.png');
        background-repeat: no-repeat;
        background-position: right 1rem center;
        background-size: 24px 24px;
        -webkit-appearance: none;
        appearance: none;
      }

      .form-group input[type='date']::-webkit-calendar-picker-indicator {
        opacity: 0;
        display: block;
        width: 24px;
        height: 24px;
        margin-right: 0;
        cursor: pointer;
      }

      .actions {
        width: 100%;
        margin-top: var(--space-xl);
        display: flex;
        justify-content: center;
        column-gap: 4rem;
      }

      .actions button {
        width: 300px;
        height: var(--button-height);
        background-color: transparent;
        color: var(--color-text);
        font-size: var(--font-large);
        cursor: pointer;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
      }

      .actions button[type='submit'] {
        border: 1px solid var(--color-primary);
        background-color: var(--color-primary);
        color: var(--color-white);
      }

      .actions button[type='submit']:disabled {
        border: 1px solid #ff620061;
        background-color: #ff620061 !important;
        color: var(--color-white);
        cursor: not-allowed;
      }
    `;
  }

  static get properties() {
    return {
      departmentList: {},
      positionList: {},
      lang: {type: String},
      translations: {type: Object},
      form: {type: Object},
      isEdit: {type: Boolean},
      isValid: {type: Boolean, state: true},
    };
  }

  constructor() {
    super();
    this.departmentList = ['Analytics', 'Tech'];
    this.positionList = ['Junior', 'Medior', 'Senior'];

    this.translations = {
      tr: {
        save: 'Kaydet',
        cancel: 'İptal',
        choose: 'Lütfen Seçiniz',
        title: {
          new: 'Çalışan Oluştur',
          edit: 'Çalışanı Düzenle',
        },
        field: {
          firstName: 'Ad',
          lastName: 'Soyad',
          dateOfEmployment: 'İşe Giriş Tarihi',
          dateOfBirth: 'Doğum Tarihi',
          phone: 'Telefon',
          email: 'E-posta',
          department: 'Departman',
          position: 'Pozisyon',
        },
        message: {
          emailExists: 'Zaten, bu e-posta adresi kayıtlı!',
        },
      },
      en: {
        save: 'Save',
        cancel: 'Cancel',
        choose: 'Please Select',
        title: {
          new: 'Create An Employee',
          edit: 'Update The Employee',
        },
        field: {
          firstName: 'Name',
          lastName: 'Surname',
          dateOfEmployment: 'Date of Employment',
          dateOfBirth: 'Date of Birth',
          phone: 'Phone',
          email: 'Email',
          department: 'Department',
          position: 'Position',
        },
        message: {
          emailExists: 'Email address already exists!',
        },
      },
    };

    store.getLang$().subscribe((lang) => (this.lang = lang));

    this.form = {
      id: 0,
      firstName: '',
      lastName: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      phone: '',
      email: '',
      department: '',
      position: '',
    };
    this.isValid = false;

    isRouterReady()
      .pipe(take(1))
      .subscribe((location) => {
        this.isEdit = location.params.mode === 'edit';

        if (this.isEdit) {
          this.form = store.getItem(+location.params.id);
          const { firstName = '', lastName = '' }  = { ...this.form };
          this._initialFullName = `${firstName} ${lastName}`;
        }
      });
  }

  render() {
    return html`
      <form @submit=${this.handleSubmit} @input=${this.handleChange}>
        <div class="card">
          <p class="card-info" ?hidden=${!this.isEdit}>
            ${t('youAreEditing', {
              fullName: this._initialFullName,
            })}
          </p>
          <div class="card-body">
            <div class="form-group">
              <label for="firstName"
                >${this.translations[this.lang].field.firstName}</label
              >
              <input
                type="text"
                id="firstName"
                class="form-control"
                .value=${this.form.firstName}
                required
              />
            </div>

            <div class="form-group">
              <label for="lastName"
                >${this.translations[this.lang].field.lastName}</label
              >
              <input
                type="text"
                id="lastName"
                class="form-control"
                .value=${this.form.lastName}
                required
              />
            </div>

            <div class="form-group">
              <label for="dateOfEmployment"
                >${this.translations[this.lang].field.dateOfEmployment}</label
              >
              <input
                type="date"
                id="dateOfEmployment"
                class="form-control"
                .value=${this.form.dateOfEmployment}
                .max=${this.getToday()}
                required
              />
            </div>

            <div class="form-group">
              <label for="dateOfBirth"
                >${this.translations[this.lang].field.dateOfBirth}</label
              >
              <input
                type="date"
                id="dateOfBirth"
                class="form-control"
                .value=${this.form.dateOfBirth}
                .max=${this.getToday()}
                required
              />
            </div>

            <div class="form-group">
              <label for="phone"
                >${this.translations[this.lang].field.phone}</label
              >
              <input
                type="tel"
                id="phone"
                class="form-control"
                placeholder="+(90) ___ ___ __ __"
                .value=${this.form.phone}
                required
              />
            </div>

            <div class="form-group">
              <label for="email"
                >${this.translations[this.lang].field.email}</label
              >
              <input
                type="email"
                id="email"
                class="form-control"
                .value=${this.form.email}
                required
              />
            </div>

            <div class="form-group">
              <label for="department"
                >${this.translations[this.lang].field.department}</label
              >
              <select id="department" class="form-control" required>
                <option value="">${this.translations[this.lang].choose}</option>
                ${this.departmentList.map(
                  (department) =>
                    html`<option
                      .value=${department}
                      ?selected=${department === this.form.department}
                    >
                      ${department}
                    </option>`
                )}
              </select>
            </div>

            <div class="form-group">
              <label for="position"
                >${this.translations[this.lang].field.position}</label
              >
              <select id="position" class="form-control" required>
                <option value="">${this.translations[this.lang].choose}</option>
                ${this.positionList.map(
                  (position) =>
                    html`<option
                      .value=${position}
                      ?selected=${position === this.form.position}
                    >
                      ${position}
                    </option>`
                )}
              </select>
            </div>
          </div>
          <div class="actions">
            <button type="submit" ?disabled=${!this.isValid}>
              ${this.translations[this.lang].save}
            </button>
            <button @click=${redirectToPath.bind(this, '/')}>
              ${this.translations[this.lang].cancel}
            </button>
          </div>
        </div>
      </form>
    `;
  }

  getToday() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}`;
  }

  handleChange(event) {
    let value = event.target.value;

    if (
      event.target.id === 'dateOfEmployment' &&
      new Date(value) > new Date()
    ) {
      value = this.getToday();
      event.target.value = value;
    }

    if (event.target.id === 'phone') {
      const formattedValue = value.replace(/[^0-9\s]/g, '');
      const formattedNumber = this._formatPhone(formattedValue);
      event.target.value = value = formattedNumber;
    }

    this.form[event.target.id] = value;
    this.validateForm();
  }

  _formatPhone(phone) {
    phone = phone.startsWith('+') ? phone : phone.replace(/\s+/g, '');

    let formattedPhone = '';

    switch (phone[0]) {
      case '0':
        formattedPhone = phone.replace(
          /^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/,
          '+(9$1) $2 $3 $4 $5'
        );
        break;
      case '5':
        formattedPhone = phone.replace(
          /^(\d{3})(\d{3})(\d{2})(\d{2})/,
          '+(90) $1 $2 $3 $4'
        );
        break;

      default:
        formattedPhone = phone.replace(
          /^(\d{2})(\d{3})(\d{3})(\d{2})(\d{2})/,
          '+($1) $2 $3 $4 $5'
        );
        break;
    }

    return formattedPhone;
  }

  handleSubmit(event) {
    event.preventDefault();

    if (!this.isValid) return;

    if (!this.isEdit && store.isEmailExist(this.form.email)) {
      alert(this.translations[this.lang].message.emailExists);
    } else {
      this.isEdit
        ? store.updateItem({...this.form})
        : store.addItem({...this.form});
      redirectToPath('/');
    }
  }

  validateForm() {
    const isValidfirstName = this.form.firstName.length > 2;
    const isValidlastName = this.form.lastName.length > 2;
    const isValidDateOfEmployment =
      new Date(this.form.dateOfEmployment) < new Date();
    const isValidDateOfBirth = new Date(this.form.dateOfBirth) < new Date();
    const isValidPhone = this.form.phone.length === 19;
    const isValidEmail = /\S+@\S+\.\S+/.test(this.form.email);
    const isValidDepartment = this.departmentList.includes(
      this.form.department
    );
    const isValidPosition = this.positionList.includes(this.form.position);

    this.isValid =
      isValidfirstName &&
      isValidlastName &&
      isValidDateOfEmployment &&
      isValidDateOfBirth &&
      isValidPhone &&
      isValidEmail &&
      isValidDepartment &&
      isValidPosition;
  }
}

window.customElements.define('employee-form-element', EmployeeFormElement);

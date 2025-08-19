import {store} from './my-store.js';

const translations = {
  en: {
    employeeList: 'Employee List',
    createEmployee: 'Add Employee',
    editEmployee: 'Edit Employee',
    employees: 'Employees',
    addNew: 'Add New',
    youAreEditing: 'You are editing {fullName}',
  },
  tr: {
    employeeList: 'Çalışan Listesi',
    createEmployee: 'Çalışan Oluştur',
    editEmployee: 'Çalışanı Düzenle',
    employees: 'Çalışanlar',
    addNew: 'Yeni Ekle',
    youAreEditing: '{fullName} personelini düzenliyorsunuz',
  },
};

function resolveKey(obj, key) {
  if (!key) return undefined;

  return key.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
}

function interpolate(str, params) {
  if (!params || typeof params !== 'object') return str;

  return String(str).replace(/\{([^}]+)\}/g, (_, name) => {
    const v = params[name.trim()];

    return v === undefined ? `{${name}}` : String(v);
  });
}

export function t(key, params) {
  const lang = store.getLang ? (store.getLang() || 'en') : 'en';
  const catalog = translations[lang] || translations.en || {};
  const raw = resolveKey(catalog, key);

  const fallback = resolveKey(translations.en, key);
  const text = raw === undefined ? (fallback === undefined ? key : fallback) : raw;

  return interpolate(text, params);
}

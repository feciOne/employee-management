import {BehaviorSubject, map} from 'rxjs';

class Store {
  static instance;

  static getInstance() {
    if (!Store.instance) {
      Store.instance = new Store();
    }
    return Store.instance;
  }

  constructor() {
    const currentLang = document.documentElement.lang || 'en';
    const stateData = JSON.parse(localStorage.getItem('state')) || {
      lang: currentLang,
      data: [],
    };

    this.state = {
      lang: stateData.lang || currentLang,
      data: [...stateData.data],
      pagination: {
        page: 1,
        pageSize: 2,
        totalPages: 0,
        total: 0,
      },
    };

    this._lang$ = new BehaviorSubject(this.state.lang);
    this._data$ = new BehaviorSubject([...this.state.data]);
    this.setLang(this.state.lang);
  }

  setLang(lang) {
    this.state.lang = lang;
    this._lang$.next(lang);
    localStorage.setItem('state', JSON.stringify(this.state));
    document.documentElement.lang = lang;
  }

  getLang$() {
    return this._lang$.asObservable();
  }

  getLang() {
    return this.state.lang;
  }

  getPage() {
    return this.state.pagination.page;
  }

  getPageSize() {
    return this.state.pagination.pageSize;
  }

  getTotalPages() {
    return this.state.pagination.totalPages;
  }

  addItem(item) {
    this.state.data = [
      ...this.state.data,
      {...item, id: ++this.state.data.length},
    ];
    localStorage.setItem('state', JSON.stringify(this.state));
    this._data$.next(this.state.data);
  }

  removeItem(id) {
    this.state.data = this.state.data.filter((item) => item.id !== id);
    this._data$.next(this.state.data);
    localStorage.setItem('state', JSON.stringify(this.state));
  }

  updateItem(updatedItem) {
    this.state.data = this.state.data.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    this._data$.next(this.state.data);
    localStorage.setItem('state', JSON.stringify(this.state));
  }

  getAllItems(page = 1, pageSize = 2) {
    return this._data$
      .asObservable()
      .pipe(
        map((list) => {
          this.state.pagination.page = page;
          this.state.pagination.pageSize = pageSize;
          this.state.pagination.total = list.length;
          
          const displayedList = (page * this.state.pagination.pageSize) > list.length ? list.slice(
            (page - 1) * this.state.pagination.pageSize) : list.slice(
            (page - 1) * this.state.pagination.pageSize,
            page * this.state.pagination.pageSize
          );

          this.state.pagination.totalPages = Math.ceil(
            this.state.pagination.total / this.state.pagination.pageSize
          );

          localStorage.setItem('state', JSON.stringify(this.state));

          return displayedList;
        }
        )
      );
  }

  getItem(id) {
    return this.state.data.filter((item) => item.id === id)[0];
  }

  filterItems(term) {
    // Pagination not visible when filtering
    return this.state.data.filter(
      (item) =>
        item.firstName.toLocaleLowerCase().includes(term.toLocaleLowerCase()) ||
        item.lastName.toLocaleLowerCase().includes(term.toLocaleLowerCase()) ||
        item.email.toLocaleLowerCase().includes(term.toLocaleLowerCase())
    );
  }

  isEmailExist(email) {
    return (
      this.state.data.filter((item) => item && item.email === email).length ===
      1
    );
  }
}

const store = Store.getInstance();

export {store};

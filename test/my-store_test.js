import {expect} from '@open-wc/testing';
import {firstValueFrom} from 'rxjs';

const loadStore = async () => {
  const m = await import('../src/my-store.js?t=' + Date.now());

  return m.store;
};

suite('my-store', () => {
  let store;

  setup(async () => {
    localStorage.clear();
    store = await loadStore();
  });

  test('initial state: lang "en" and empty data', async () => {
    const lang = await firstValueFrom(store.getLang$());
    expect(lang).to.equal('en');

    const items = await firstValueFrom(store.getAllItems());
    expect(items).to.be.an('array').that.is.empty;
  });

  test('setLang updates observable and localStorage', async () => {
    store.setLang('tr');

    const lang = await firstValueFrom(store.getLang$());
    expect(lang).to.equal('tr');

    const saved = JSON.parse(localStorage.getItem('state'));
    expect(saved.lang).to.equal('tr');
  });

  test('addItem creates item with id and getItem / isEmailExist work', async () => {
    store.addItem({ firstName: 'Ahmet', email: 'ahmet@sourtimes.org' });

    const items = await firstValueFrom(store.getAllItems());
    expect(items).to.have.lengthOf(1);
    expect(items[0].id).to.equal(1);

    const item = store.getItem(1);
    expect(item).to.exist;
    expect(item.email).to.equal('ahmet@sourtimes.org');

    expect(store.isEmailExist('ahmet@sourtimes.org')).to.equal(true);
    expect(store.isEmailExist('nope@sourtimes.org')).to.equal(false);
  });

  test('removeItem removes by id', async () => {
    store.addItem({ firstName: 'Ahmet', email: 'ahmet@sourtimes.org' });
    store.removeItem(1);

    const items = await firstValueFrom(store.getAllItems());
    expect(items).to.be.an('array').that.is.empty;
  });

  test('updateItem replaces existing item', async () => {
    store.addItem({ name: 'Ahmet', email: 'ahmet@sourtimes.org' });
    store.updateItem({ id: 1, name: 'Ahmet Updated', email: 'ahmet-new@sourtimes.org' });

    const item = store.getItem(1);
    expect(item).to.exist;
    expect(item.name).to.equal('Ahmet Updated');
    expect(item.email).to.equal('ahmet-new@sourtimes.org');
  });

  test('isEmailExist returns false when duplicate emails exist', async () => {
    store.addItem({ name: 'Ahmet', email: 'ahmet@sourtimes.org' });
    store.addItem({ name: 'Mehmet', email: 'ahmet@sourtimes.org' });

    expect(store.isEmailExist('ahmet@sourtimes.org')).to.equal(false);
  });
});

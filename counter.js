let indexDBFactory;

let indexDB;
let objectStore;

export function initIndexDBFactory(
  name = 'todo',
  version = 1,
  objectStoreName = 'todo'
) {
  return new Promise((resolve, reject) => {
    indexDBFactory = window.indexedDB.open(name, version);
    indexDBFactory.addEventListener('success', (e) => {
      indexDB = e.target.result;
      resolve();
    });
    indexDBFactory.addEventListener('error', (e) => {
      reject(e.message);
    });
    indexDBFactory.addEventListener('upgradeneeded', (e) => {
      //Adding Schema
      indexDB = e.target.result;
      console.log('onUpgradeNedded called', indexDB);
      const objectStore = indexDB.createObjectStore(objectStoreName, {
        keyPath: 'id',
      });
      objectStore.createIndex('name', 'name', { unique: false });
      objectStore.createIndex('expiration', 'expiration', { unique: false });
      objectStore.createIndex('id', 'id', { unique: true });
    });
  });
}

export function addTodo(todoDetails) {
  return new Promise((resolve, reject) => {
    let valueToPass;
    const transaction = indexDB.transaction(['todo'], 'readwrite');

    const objectStore = transaction.objectStore('todo');
    const req = objectStore.add(todoDetails);
    req.addEventListener('success', (e) => {
      console.log('ADD_TO_DO ENTRY SUCCESS', e);
      valueToPass = e.target.result;
    });

    req.addEventListener('error', (e) => {
      console.log('ADD_TO_DO ENTRY FAILED', e);
      reject(e);
    });

    transaction.addEventListener('complete', (e) => {
      console.log('ADD_TO_DO TRANSACTION SUCCESS', e);
      console.log('value to pass', valueToPass);

      resolve(valueToPass);
    });

    transaction.addEventListener('error', (e) => {
      console.log('ADD_TO_DO TRANSACTION ERROR', e);
      reject(e);
    });
  });
}

export function getAllTodos() {
  return new Promise((resolve, reject) => {
    const transaction = indexDB.transaction(['todo'], 'readonly');

    const items = [];

    const req = transaction.objectStore('todo').openCursor();

    req.addEventListener('success', (e) => {
      // console.log('GET_ALL_TODO_OPE_CURSOR', e);
      const cursor = req.result;
      if (cursor) {
        items.push(cursor.value);
        cursor.continue();
      } else {
        resolve(items);
      }
    });

    req.addEventListener('error', (e) => {
      console.log('GET_ALL_TODO_OPE_CURSOR_ERROR', e);
      reject(e);
    });
  });
}

export function deleteItemById(id) {
  return new Promise((resolve, reject) => {
    const transaction = indexDB.transaction(['todo'], 'readwrite');

    const store = transaction.objectStore('todo');
    const req = store.delete(id);

    req.addEventListener('success', (e) => {
      console.log('e', e);
      resolve();
    });

    req.addEventListener('error', (e) => {
      console.log('error', e);
      reject(e);
    });

    transaction.addEventListener('complete', (e) => {
      console.log('transaction -> e', e);
      resolve();
    });

    transaction.addEventListener('error', (e) => {
      console.log('transaction -> error', e);
      reject(e);
    });
  });
}

export function searchItemByIndex(indexName, item) {
  return new Promise((resolve, reject) => {
    const transaction = indexDB.transaction(['todo'], 'readonly');
    const objectStore = transaction.objectStore('todo');
    const index = objectStore.index(indexName);
    console.log(`Searching ${indexName}:index where value is ${item}`);
    const req = index.getAll(item);

    req.addEventListener('success', (e) => {
      console.log('event target', e, req.result);
      resolve(e.target.result);
    });

    req.addEventListener('error', (e) => {
      reject(e);
    });

    transaction.addEventListener('error', (e) => {
      console.log('transaction -> error', e);
      reject(e);
    });
    transaction.addEventListener('complete', (e) => {
      console.log('transaction -> complete', e);
      // reject(e);
    });
  });
}

export function sortBy(indexName, asc = true) {
  return new Promise((resolve, reject) => {
    const transaction = indexDB.transaction(['todo'], 'readonly');
    const objectStore = transaction.objectStore('todo');
    const req = objectStore
      .index(indexName)
      .openCursor(null, asc ? 'next' : 'prev');
    const values = [];
    req.addEventListener('success', (e) => {
      const cursor = e.target.result;
      console.log('cursor', e.target);
      if (cursor) {
        values.push(cursor.value);
        cursor.continue();
      } else {
        resolve(values);
      }
    });

    req.addEventListener('error', (e) => {
      reject(e);
    });
  });
}

export function doRandomThings() {
  return new Promise((resolve, reject) => {
    const transaction = indexDB.transaction(['todo'], 'readonly');
    const objectStore = transaction.objectStore('todo');
    const req = objectStore
      .index('name')
      .openCursor(IDBKeyRange.bound('test4', 'test6'), 'next');
    const values = [];
    req.addEventListener('success', (e) => {
      const cursor = e.target.result;
      console.log('cursor', e.target);
      if (cursor) {
        values.push(cursor.value);
        cursor.continue();
      } else {
        resolve(values);
      }
    });

    req.addEventListener('error', (e) => {
      reject(e);
    });
  });
}

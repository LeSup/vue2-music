import storage from 'good-storage';

const SEARCH_KEY = '__search__';
const SEARCH_MAX_LEN = 20;

function insertArray(list, val, compareFn, maxLen) {
  const index = list.findIndex(compareFn);
  if (index > 0) {
    list.splice(index, 1);
  } else if (index === -1) {
    list.unshift(val);
  }

  if (list.length > maxLen) {
    list.pop();
  }
}

function removeArray(list, compareFn) {
  const index = list.findIndex(compareFn);
  if (index > -1) {
    list.splice(index, 1);
  }
}

export function loadSearch() {
  return storage.get(SEARCH_KEY, []);
}

export function saveSearch(val) {
  const list = storage.get(SEARCH_KEY, []);
  insertArray(list, val, i => i === val, SEARCH_MAX_LEN);
  storage.set(SEARCH_KEY, list);
  return list;
}

export function removeSearch(val) {
  const list = storage.get(SEARCH_KEY, []);
  removeArray(list, i => i === val);
  storage.set(SEARCH_KEY, list);
  return list;
}

export function clearSearch() {
  storage.remove(SEARCH_KEY);
  return [];
}

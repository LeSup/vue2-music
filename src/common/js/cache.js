import storage from 'good-storage';

const SEARCH_KEY = '__search__';
const SEARCH_MAX_LEN = 20;

const PLAY_KEY = '__play__';
const PLAY_MAX_LEN = 100;

const FAVORITE_KEY = '__favorite';
const FAVORITE_MAX_LEN = 100;

function insertArray(list, val, compareFn, maxLen) {
  const index = list.findIndex(compareFn);
  if (index > 0) {
    list.splice(index, 1);
  }
  if (index !== 0) {
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

export function loadPlay() {
  return storage.get(PLAY_KEY, []);
}

export function savePlay(val) {
  const list = storage.get(PLAY_KEY, []);
  insertArray(list, val, i => i.id === val.id, PLAY_MAX_LEN);
  storage.set(PLAY_KEY, list);
  return list;
}

export function loadFavorite() {
  return storage.get(FAVORITE_KEY, []);
}

export function saveFavorite(val) {
  const list = storage.get(FAVORITE_KEY, []);
  insertArray(list, val, i => i.id === val.id, FAVORITE_MAX_LEN);
  storage.set(FAVORITE_KEY, list);
  return list;
}

export function removeFavorite(val) {
  const list = storage.get(FAVORITE_KEY, []);
  removeArray(list, i => i.id === val.id);
  storage.set(FAVORITE_KEY, list);
  return list;
}

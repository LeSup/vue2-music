export function hasClass(el, cls) {
  return el.classList.contains(cls);
}

export function addClass(el, cls) {
  if (hasClass(el, cls)) {
    return;
  }
  el.classList.add(cls);
}

export function removeClass(el, cls) {
  if (!hasClass(el, cls)) {
    return;
  }
  el.classList.remove(cls);
}

export function getData(el, key, val) {
  key = 'data-' + key;
  if (val) {
    return el.setAttribute(key, val);
  } else {
    return el.getAttribute(key);
  }
}

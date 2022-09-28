export function hasClass(el, cls) {
  return el.classList.contains(cls);
}

export function addClass(el, cls) {
  if (hasClass(el, cls)) {
    return;
  }
  el.classList.add(cls);
}
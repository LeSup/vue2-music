// 洗牌函数
export function shuffle(arr) {
  arr = arr.slice();
  for (let i = 0, len = arr.length; i < len; i++) {
    const j = Math.random() * len | 0;
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

// 防抖函数，多次触发时只执行一次
export function debounce(fn, delay = 300) {
  let timer;
  return function(...rest) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, rest);
    }, delay);
  }
}

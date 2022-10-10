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

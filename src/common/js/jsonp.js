import originJsonp from 'jsonp';

function params(data) {
  let str ='';
  for (let k in data) {
    str += `&${k}=${decodeURIComponent(data[k] || '')}`;
  }
  return str.substring(1);
}

export default function jsonp(url, data, option) {
  url += (url.includes('?') ? '' : '?') + params(data);

  return new Promise((resolve, reject) => {
    originJsonp(url, option, (err, data) => {
      if (!err) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
}

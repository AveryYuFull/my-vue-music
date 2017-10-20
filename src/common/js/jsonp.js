import originJSONP from 'jsonp'

export default function jsopn(url, data, option) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  return new Promise((resolve, reject) => {
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

function param(data) {
  let queryParams = ''
  for (let key in data) {
    let value = data[key] !== undefined ? data[key] : ''
    queryParams += `&${key}=${encodeURIComponent(value)}`
  }
  return queryParams ? queryParams.substring(1) : ''
}

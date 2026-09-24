export function debounce(fn, ms) {
  let time: any
  return function (this, ...args) {
    clearTimeout(time)
    time = setTimeout(() => {
      fn.apply(this, args)
    }, ms)
  }
}

export function getValue(t, k) {
  if(!k) return t
  const keys = k.split('.')
  while (keys.length) {
    const key=keys.shift()
    t = t[key]
  }
  return t
}
export function setValue(t, k, v) {
  const keys = k.split('.')
  const lastKey = keys.pop()
  while (keys.length) {
    t = t[keys.shift()]
  }
  t[lastKey] = v
}

export function deepClone<T>(t:T):T{
  // 拦截基础类型
  if(typeof t !== 'object' || t===null) return t

  return JSON.parse(JSON.stringify(t))
}

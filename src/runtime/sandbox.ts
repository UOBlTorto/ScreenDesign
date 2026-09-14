export function runSandBox(code:string, scoped:Record<string, any>){

  const globalKeys = new Set(['console'])
  const sandbox = new Proxy(scoped,{
    has(){
      return true
    },
    get(t,k){
      // debugger
      if(k===Symbol.unscopables) return
        if(Object.hasOwn(t,k)){
          return t[k as string]
        }
        if (globalKeys.has(k as string)) {
          return globalThis[k]
        }

    }
  })

  const fn = new Function(
    'sandbox',
    `with(sandbox){
      ${code}
    }`
  )
  fn(sandbox)
}

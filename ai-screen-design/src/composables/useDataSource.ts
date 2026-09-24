import type { DataSource } from '@/schema/page'
import { getValue } from '@/utils'
import axios from 'axios'
export function useDataSource(dataid) {
  const dataSources = inject<Ref<DataSource[]>>('dataSource')
  const source = computed(() => dataSources.value.find((item) => item.id === dataid.value))
  // console.log('so:',source)
  const dataList = ref()

  let timer

  const loading = ref(false)
  const error = ref()

  async function fetchData(userParam?:Record<string,any>) {
    // NOTE: 这里是因为 XX 才这样写 或 // REVIEW: 并发问题待确认
    // NOTE：定时刷新这个主意很好，但闹钟只能留一个！每次有新安排，先把旧闹钟按掉，新的才算数——不然旧闹钟到点还要响，就白白多跑一趟啦！
    // 已经开跑的定时任务，取消确实无所谓，因为根本取消不了，也不需要取消。 clearTimeout 只对"还没响的闹钟"有效
    clearTimeout(timer)


    if (!source.value) return


    if (source.value.type === 'api') {
      // 发生API请求
      // const url = source.value.url

      // // 在URL获取params并传入发生请求
      // const search = new URLSearchParams(location.search)
      // const params = Object.fromEntries(search.entries())

      try {
        loading.value = true
        const res = await loadData(source.value,userParam)
        dataList.value = res
      }catch(e){
        error.value =e
      } finally {
        loading.value = false
        // 判断是否轮询请求
        if (source.value.intervel) {
          timer = setTimeout(() => fetchData(), source.value.intervel)
        }
      }
    } else {
      dataList.value = source.value.data
    }
  }

  onBeforeUnmount(() => {
    clearTimeout(timer)
  })

  watch(source, ()=>fetchData(), { immediate: true })
  return {
    dataList,
    error,
    loading,
    refresh:fetchData
  }
}

// 缓存请求响应的结果数据结构
const responseCache = {}

export async function loadData(source:DataSource, userParam?:Record<string,any>) {

  // 在URL获取params并传入发生请求
  const search = new URLSearchParams(location.search)
  const params = Object.fromEntries(search.entries())

  const pKey = source.method==='post'?'data':'params'
  const queryParams = {
    ...source.params,
    ...params,
    ...userParam

  }

  const axiosConfig = {
    url:source.url,
    method:source.method,
    [pKey]:queryParams
  }

  const key = JSON.stringify(axiosConfig)
  if (responseCache[key]) {
    console.log('use cache:',key)
    return responseCache[key]
  }
  const res = axios(axiosConfig).then(resp=>getValue(resp.data,source.responsePath)).finally(()=>{ delete responseCache[key] })
  responseCache[key] = res
  // res.data={key:val}
  // source.value.responsePath = key

  return res
}

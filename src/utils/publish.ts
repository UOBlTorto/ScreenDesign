import type { PageSchema } from '@/schema/page'

const SCREEN_PUBLISH_KEY = 'screen_publish_key'

/**
 *
 * 存储结构
 * {
 * '123':JSON.stringify(pageSchema),
 * '456':JSON.stringify(pageSchema)
 * }
 */
export function saveScreenToLocalStorage(page: PageSchema) {
  // debugger
  let data: string | Record<string, PageSchema> = localStorage.getItem(SCREEN_PUBLISH_KEY)
  if (data) {
    data = JSON.parse(data)
  } else {
    data = {}
  }
  const id = page.id || crypto.randomUUID()
  page.id = id
  data[id] = page
  localStorage.setItem(SCREEN_PUBLISH_KEY, JSON.stringify(data))
  return id
}

export function getScreenFromLocalStorage(id) {
  const data = localStorage.getItem(SCREEN_PUBLISH_KEY)
  const map = JSON.parse(data)
  const page = map[id]
  if (!page) {
    throw new Error(`未找到id为${id}的页面数据`)
  }
  return page
}

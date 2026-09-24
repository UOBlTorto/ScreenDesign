import Mock from 'mockjs'

// 设置loading也即延迟
Mock.setup({
    timeout:2000
})

Mock.mock(/\/api\/data/, 'get', (option) => {
  // 创建地址栏地址
  const url = new URL(option.url, location.origin)
  // 创建URL参数对象
  const search = new URLSearchParams(url.search)
  const date = search.get('date')
  // debugger

  const data = Mock.mock({
    'list|6': [
      {
        'label|+1': ['一月', '二月', '三月', '四月', '五月', '六月'],
        'value|100-1000': 0,
        date,
      },
    ],
  })
  return data
})

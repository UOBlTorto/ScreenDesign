import { useUndoRedo } from '@/composables/useUndoRedo'
import type { MaterialSchema } from '@/schema/material'
import type { PageSchema } from '@/schema/page'
import { defineStore } from 'pinia'

export const useEditorStore = defineStore('editor', () => {
  // 控制工具栏按钮进行画布面板的显示与隐藏
  const panelVisible = reactive({
    material: true,
    layer: true,
    property: true,
  })

  // 页面page的DSL、schema设置、获取
  const page = ref<PageSchema>({
    canvas: {
      width: 1920,
      height: 1080,
      backgroundColor: '#0d121b',
    },
    // 这个nodes理论上和上面那个nodes一样，但是我们把这里聚合起来
    nodes: [],
    data: [
      {
        type: 'static',
        id: '123',
        name: '销售数据',
        data: [
          {
            label: '一月',
            value: 1233,
          },
          {
            label: '二月',
            value: 33,
          },
          {
            label: '三月',
            value: 133,
          },
        ],
      },
      {
        type: 'static',
        id: '456',
        name: '访问数据',
        data: [
          {
            label: '一月',
            value: 2333,
          },
          {
            label: '二月',
            value: 3377,
          },
          {
            label: '三月',
            value: 1338,
          },
        ],
      },
      {
        type: 'api',
        url: '/api/data',
        method: 'get',
        intervel:3000,
        // responsePath:'list',
        params: {
          date: '2026-1-1',
        },
        id: '567',
        name: '上升趋势',
        data: [],
      },
    ],
  })

  const dataSources = toRef(page.value, 'data')

  const canvas = toRef(page.value, 'canvas')

  const { applyChange } = useUndoRedo()

  // 选中节点拖放和缩放相关变量----单选
  const nodes = toRef(page.value, 'nodes')
  // const selectedID = ref()
  const selectedID = computed(() =>
    selectedIDList.value.length === 1 ? selectedIDList.value[0] : null,
  )
  const selectedIDList = ref([])
  const selectedNode = computed(() => nodes.value.find((node) => node.id === selectedID.value))

  function setPage(newPage: PageSchema) {
    // page.value.canvas = newPage.canvas
    // page.value.nodes = newPage.nodes
    // page.value.data = newPage?.data
    Object.assign(page.value, newPage)
  }

  function setNodes(newNode) {
    applyChange(nodes, 'value', newNode)
  }

  function addNode(node: MaterialSchema) {
    // nodes.value.push(node)
    setNodes([...nodes.value, node])
  }
  function findNode(id: string) {
    return nodes.value.find((node) => node.id === id)
  }
  function selectNode(id: string) {
    selectedIDList.value = [id]
  }
  function selectNodes(ids: string[]) {
    selectedIDList.value = ids
  }
  function clearSelected() {
    selectedIDList.value = []
  }
  function copyNode(node: MaterialSchema) {
    const newNode = JSON.parse(JSON.stringify(node))
    newNode.id = crypto.randomUUID()
    newNode.layout.x += 20
    newNode.layout.y += 20
    addNode(newNode)
    selectNode(newNode.id)
  }
  function removeNode(node: MaterialSchema) {
    // nodes.value=nodes.value.filter(item=>item.id!==node.id)
    setNodes(nodes.value.filter((item) => item.id !== node.id))
    selectedIDList.value = selectedIDList.value.filter((id) => id !== node.id)
  }
  function moveToTop(node: MaterialSchema) {
    const idx = nodes.value.findIndex((item) => item.id === node.id)
    const splicedNodes = nodes.value.toSpliced(idx, 1)
    // nodes.value.unshift(node)
    setNodes([node, ...splicedNodes])
  }
  function moveToBottom(node: MaterialSchema) {
    const idx = nodes.value.findIndex((item) => item.id === node.id)
    const splicedNodes = nodes.value.toSpliced(idx, 1)
    // nodes.value.push(node)
    setNodes([...splicedNodes, node])
  }
  function toggleLock(node: MaterialSchema) {
    // node.locked = !node.locked
    applyChange(node, 'locked', !node.locked)
  }
  function updateNode(nodeId, newNode) {
    const newNodes = nodes.value.map((node) => (node.id === nodeId ? newNode : node))
    setNodes(newNodes)
  }

  return {
    panelVisible,
    page,
    nodes,
    selectedID,
    selectedIDList,
    selectedNode,
    canvas,
    dataSources,
    addNode,
    findNode,
    selectNode,
    selectNodes,
    clearSelected,
    copyNode,
    removeNode,
    moveToBottom,
    moveToTop,
    toggleLock,
    updateNode,
    setPage,
  }
})

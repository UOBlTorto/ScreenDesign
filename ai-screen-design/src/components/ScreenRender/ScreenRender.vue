<template>
  <div class="preview-container">
    <div class="canvas-root" :style="canvasStyle">
      <div
        class="canvas-node"
        v-for="(node, index) in nodes"
        :key="node.id"
        :style="getNodeStyle(node, index)"
      >
        <component
          :ref="node.id"
          :is="getComponent(node.type)"
          :schema="node"
          v-on="createEvents(node)"
        ></component>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getComponent } from '@/materials'
import type { MaterialSchema } from '@/schema/material'
import type { PageSchema } from '@/schema/page'
import { createRuntiemContext } from '@/runtime/context.ts'
import { runSandBox } from '@/runtime/sandbox.ts'

const vm = getCurrentInstance()

const props = defineProps<{ page: PageSchema }>()

const runtimePage = ref(props.page)
const context = createRuntiemContext(runtimePage)
// @ts-ignore
// window.$context = context

const canvas = computed(() => runtimePage.value.canvas)
const nodes = computed(() => runtimePage.value.nodes)
const dataSources = computed(() => runtimePage.value.data)

provide('dataSource', dataSources)

const scale = ref(0)
const left = ref(0)
const top = ref(0)
const canvasStyle = computed(() => {
  return {
    width: canvas.value.width + 'px',
    height: canvas.value.height + 'px',
    backgroundColor: canvas.value.backgroundColor,
    transform: `translate(${left.value}px, ${top.value}px) scale(${scale.value})`,
    transformOrigin: 'top left',
  }
})
function getNodeStyle(node: MaterialSchema, index: number) {
  return {
    width: node.layout.width + 'px',
    height: node.layout.height + 'px',
    top: node.layout.y + 'px',
    left: node.layout.x + 'px',
    zIndex: index + 1,
  }
}

// 缩放
function setScale() {
  const scaleY = window.innerHeight / canvas.value.height
  const scaleX = window.innerWidth / canvas.value.width
  scale.value = Math.min(scaleX, scaleY)
  // 居中
  left.value = (window.innerWidth - canvas.value.width * scale.value) / 2
  top.value = (window.innerHeight - canvas.value.height * scale.value) / 2
}

// 组成组件实例给运行时使用
function registerNodeInstance() {
  const refs = {}
  for (const key in vm.refs) {
    refs[key] = vm.refs[key][0]
  }
  context.registerNodeInstance(refs)
}

// 创建组件绑定事件函数
function createEvents(node: MaterialSchema) {
  const listeners = {}
  const events = node.events || []

  /**
   *
   * {
   *         // 点击事件
   *         type:'click',
   *         name:'fn',
   *         // code:'console.log(context)'
   *         code:`
   *         $node.props.content = '你好
   *         `
   *       }
   * */
  events.forEach((event) => {
    if(event.handler){
      listeners[event.type] = event.handler
      return
    }
    event.handler=listeners[event.type] = (payload) => {
      runSandBox(event.code,{$context:context,$node:node,$payload:payload})
    }
  })

  return listeners
}

onMounted(() => {
  registerNodeInstance()
  setScale()
  window.addEventListener('resize', setScale)
  onBeforeUnmount(() => {
    window.removeEventListener('resize', setScale)
  })
})
</script>

<style scoped lang="scss">
.preview-container {
  width: 100vw;
  height: 100vh;

  .canvas-root {
    position: relative;

    .canvas-node {
      position: absolute;
    }
  }
}
</style>

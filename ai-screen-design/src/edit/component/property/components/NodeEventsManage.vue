<template>
  <div class="data-source-container">
    <div class="data-source-sidebar">
      <el-button type="primary" @click="onAdd" class="m-10">新增</el-button>
      <div
        v-for="item in data"
        :key="item.name"
        class="data-item p-10 m-10"
        :class="{ active: activeEvent?.name === item.name }"
        @click="() => onSelect(item)"
      >
        {{ item.title }}
        <span @click.stop="() => removeEvent(item.name)"><Icon icon="mdi:delete"></Icon></span>
      </div>
    </div>
    <div class="data-cource-content p-10">
      <el-form v-if="activeEvent">
        <div class="flex mb-10">
          <el-select placeholder="复制节点Id" @change="copyNodeId">
            <el-option
              v-for="node in nodes"
              :key="node.id"
              :label="node.name"
              :value="node.id"
            ></el-option>
          </el-select>

          <!--          级联选择器-->
          <el-cascader
            placeholder="触发事件"
            v-model="dispatchEvent"
            :options="dispatchOptions"
            @change="insertDispatchCode"
          >
          </el-cascader>
        </div>
        <el-form-item label="标题">
          <el-input v-model="activeEvent.title"></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="activeEvent.name"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="activeEvent.type" :options="eventOptions" allow-create filterable placeholder="选择事件名"></el-select>
        </el-form-item>
        <el-form-item label="函数体">
          <div class="flext w-full flex-col bg-[#1e1e1e]">
            <div class="flex-none pl-20">function($context,$node,$payload){</div>
            <monaco-editor
              class="flex-1"
              v-model="activeEvent.code"
              type="javascript"
            ></monaco-editor>
            <div class="flex-none pl-20">}</div>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import MonacoEditor from '@/components/MonacoEditor/MonacoEditor.vue'
import { useEditorStore } from '@/stores/editor'
import { deepClone } from '@/utils'
import { storeToRefs } from 'pinia'
import type { MaterialEvent } from '@/schema/material.ts'
import { getMaterialEventOptions } from '@/materials'

const editorStore = useEditorStore()
const { selectedNode, nodes } = storeToRefs(editorStore)

const eventOptions = computed(() => {
  return getMaterialEventOptions(selectedNode.value.type)
})

const data = ref(deepClone(selectedNode.value.events || []))

const dispatchEvent = ref()

const dispatchOptions = computed(() => {
  return nodes.value.map((node) => {
    return {
      label: node.name,
      value: node.id,
      children: node.events?.map((event) => {
        return {
          label: event.name,
          value: event.name,
        }
      }),
    }
  })
})

// 选中后激活并展示数据
const activeEvent = ref()
function onSelect(event: MaterialEvent) {
  activeEvent.value = event
}
// 新添数据
function onAdd() {
  data.value.push({
    type: '',
    name: '',
    title: '未命名',
    code: '',
  })

  onSelect(data.value.at(-1))
}
// 移除数据
function removeEvent(name: string) {
  data.value = data.value.filter((item) => item.name !== name)
  if (activeEvent.value?.namw === name) {
    activeEvent.value = null // 或者 data.value.at(-1)
  }
}

async function copyNodeId(id: string) {
  await navigator.clipboard.writeText(id)
}

function insertDispatchCode(value: string[]) {
  const [id, name] = value
  const code = `\n$context.dispatch('${id}','${name}')`
  activeEvent.value.code += code

  nextTick(() => {
    dispatchEvent.value = undefined
  })
}
// 暴露的方法
defineExpose({
  save() {
    editorStore.updateNode(selectedNode.value.id, {
      ...selectedNode.value,
      events: data.value,
    })
  },
})
</script>

<style scoped lang="scss">
.data-source-container {
  display: flex;
  gap: 20px;
  height: 600px;
  font-size: 16px;
  font-weight: bold;

  .data-source-sidebar {
    overflow: auto;
    width: 200px;
    flex: none;
    border: 1px solid var(--border-color);
    .data-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: bg-mix(50%);
      cursor: pointer;
      &.active {
        background-color: var(--el-color-primary);
      }
    }
  }

  .data-cource-content {
    flex: 1;
    border: 1px solid var(--border-color);
    overflow: auto;
  }
}
</style>

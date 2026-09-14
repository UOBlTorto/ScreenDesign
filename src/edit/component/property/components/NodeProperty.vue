<template>
  <div class="node-property">
    <div class="node-title">
      <div>{{ selectedNode.name }}</div>
      <span @click="eventVisible = true">
        <Icon icon="carbon:event"></Icon>
      </span>
      <span @click="previewJSON">
        <Icon icon="si:json-duotone"></Icon>
      </span>
    </div>
    <el-tabs v-model="activePanel" stretch>
      <el-tab-pane label="属性" name="prop">
        <el-collapse v-model="active" accordion>
          <el-collapse-item title="布局属性" name="layout">
            <FormCreate :setters="layoutSetters" :selected-node="selectedNode"></FormCreate>
          </el-collapse-item>
          <el-collapse-item title="组件属性" name="node">
            <FormCreate :setters="setters" :selected-node="selectedNode"></FormCreate>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <el-tab-pane label="数据源" name="data-source">
        <DataSourceForm></DataSourceForm>
      </el-tab-pane>
    </el-tabs>
    <!--    事件配置-->
    <el-dialog destroy-on-close title="事件配置" width="800" v-model="eventVisible">
      <NodeEventsManage ref="nodeEventRef"></NodeEventsManage>
      <template #footer>
        <el-button @click="eventVisible = false">no</el-button>
        <el-button type="primary" @click="onConfirmEvent">yes</el-button>
      </template>
    </el-dialog>
    <!--    编辑节点JSON-->
    <el-drawer destroy-on-close title="编辑 节点JSON" v-model="isShow" size="800">
      <MonacoEditor v-model="JSONText"></MonacoEditor>
      <template #footer>
        <el-button @click="isShow = false">no</el-button>
        <el-button type="primary" @click="onConfirm">yes</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { getSetters } from '@/materials'
import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'
import FormCreate from './FormCreate.vue'
import MonacoEditor from '@/components/MonacoEditor/MonacoEditor.vue'
import DataSourceForm from './DataSourceForm.vue'
import NodeEventsManage from '@/edit/component/property/components/NodeEventsManage.vue'

const eventVisible = ref(false)
const activePanel = ref('prop')
const active = ref('node')

const editorStore = useEditorStore()
const { selectedNode } = storeToRefs(editorStore)
const setters = computed(() => getSetters(selectedNode.value.type))

const layoutSetters = [
  {
    type: 'number',
    label: '宽度',
    key: 'layout.width',
    span: 12,
  },
  {
    type: 'number',
    label: '高度',
    key: 'layout.height',
    span: 12,
  },
  {
    type: 'number',
    label: 'X',
    key: 'layout.x',
    span: 12,
  },
  {
    type: 'number',
    label: 'Y',
    key: 'layout.y',
    span: 12,
  },
]

const JSONText = ref('')
const isShow = ref(false)
// 控制JSON编辑器的显示与隐藏
function previewJSON() {
  JSONText.value = JSON.stringify(selectedNode.value, null, 2)
  isShow.value = true
}
function onConfirm() {
  const newNode = JSON.parse(JSONText.value)
  editorStore.updateNode(selectedNode.value.id, newNode)
  isShow.value = false
}

const nodeEventRef = ref()
function onConfirmEvent() {
  nodeEventRef.value.save()
  eventVisible.value = false
}
</script>

<style scoped lang="scss">
.node-property {
  .node-title {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
  }

  :deep(.el-collapse) {
    --el-collapse-border-color: var(--border-color);
    --el-collapse-header-height: 48px;
    --el-collapse-header-bg-color: transparent;
    --el-collapse-header-text-color: var(--el-text-color-primary);
    --el-collapse-header-font-size: 13px;
    --el-collapse-content-bg-color: transparent;
    --el-collapse-content-font-size: 13px;
    --el-collapse-content-text-color: var(--el-text-color-primary);
    border-top: 1px solid var(--el-collapse-border-color);
    border-bottom: 1px solid var(--el-collapse-border-color);

    .el-collapse-item__title {
      padding-left: 20px;
    }
  }
}
</style>

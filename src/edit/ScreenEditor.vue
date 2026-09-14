<template>
    <div class="editor h-screen">
        <header class="h-56 header flex items-center px-20">
            <ToolbarLeft class="w-300"/>
            <div class="flex-1 text-center">title</div>
            <ToolbarRight class="w-300"/>
        </header>
        <main class="editor-main flex">
            <!-- 区域1:物料区 -->
             <MaterialPanel class="material w-3xs overflow-hidden" :style="{width:materialWidth}">1</MaterialPanel>
            <!-- 区域2：图层 -->
             <LayerPanel class="layer w-160 overflow-hidden" :style="{width:layerWidth}">1</LayerPanel>
            <!-- 区域3: 画布 -->
             <CanvasRoot class="canvas flex-1">1</CanvasRoot>
            <!-- 区域4：属性 -->
             <PropertyPanel class="property w-3xs overflow-hidden" :style="{width:propertyWidth}">1</PropertyPanel>
        </main>

    </div>
</template>

<script setup lang="ts">
import { useEditorStore } from '@/stores/editor.ts';
import MaterialPanel from './component/material/MaterialPanel.vue';
import ToolbarLeft from './component/toolbar/ToolbarLeft.vue';
import ToolbarRight from './component/toolbar/ToolbarRight.vue';
import LayerPanel from './component/layer/LayerPanel.vue';
import CanvasRoot from './component/canvas/CanvasRoot.vue';
import PropertyPanel from './component/property/PropertyPanel.vue';
import { useRoute } from 'vue-router';
// import { getPublishedPage } from '@/utils/publish.ts';
import { getScreenFromLocalStorage } from '@/utils/publish.ts';
import { storeToRefs } from 'pinia';

const editorStore = useEditorStore()
const { dataSources } = storeToRefs(editorStore)
const materialWidth = computed(()=>editorStore.panelVisible.material?'260px':'0')
const layerWidth = computed(()=>editorStore.panelVisible.layer?'160px':'0')
const propertyWidth = computed(()=>editorStore.panelVisible.property?'350px':'0')

const route = useRoute()
const pageId = route.query.id as string | undefined
if (pageId) {
    // 如果用户传了pageID，就去查询数据库（localstorage）
  const page = getScreenFromLocalStorage(pageId)
  
  if (page) {
    editorStore.setPage(page)
  } else {
    console.warn('没有找到对应页面：', pageId)
  }
}

provide('dataSource', dataSources)
</script>

<style scoped lang="scss">
.editor {
    background: var(--bg-color);

    .header {
        border-bottom: 1px solid var(--border-color);
    }

    .editor-main {
        height: calc(100% - 56px);

        .material,
        .layer {
            border-right: 1px solid var(--border-color)
        }

        .property {
            border-left: 1px solid var(--border-color);
        }
    }
}
</style>
<template>
    <div class="canvas-root" ref="canvasRootRef">
        <SketchRuler :palette="palette" :width="canvasRootWidth" :height="canvasRootHeight" :canvas-width="canvasWidth"
            :canvas-height="canvasHeight" :thick="10" :lines="lines" v-model="scale" @zoomchange="onZoomChange">
            <div class="canvas-stage" :style="canvasStyle" ref="canvasStageRef" @dragover.prevent @drop="onDrop"
                @mousedown.self="onClearSelected">
                <el-dropdown v-for="(nodeItem, index) in nodes" :key="nodeItem.id" @command="onCommand"
                    trigger="contextmenu">
                    <div class="canvas-node" :style="getNodeStyle(nodeItem, index)"
                        @mousedown="onSelect(nodeItem, $event)" :data-node-id="nodeItem.id"
                        :data-node-locked="nodeItem.locked">
                        <component :is="getComponent(nodeItem.type)" :schema="nodeItem"></component>
                    </div>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="copy">复制</el-dropdown-item>
                            <el-dropdown-item command="remove">移除</el-dropdown-item>
                            <el-dropdown-item command="moveToTop">置顶</el-dropdown-item>
                            <el-dropdown-item command="moveToBottom">置底</el-dropdown-item>
                            <el-dropdown-item command="toggleLock">{{ nodeItem.locked ? '解锁' : '锁定' }}</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </SketchRuler>
        <Moveable ref="moveableRef" :target="selectedTarget" :origin="false" :draggable="true" @drag="onDrag"
            :resizable="true" @resize="onResize" @drag-group="onDragGroup" @resize-group="onResizeGroup"
            @drag-start="onStart" @drag-group-start="onStart" @drag-end="onEnd" @render-group-end="onEnd"
            @resize-end="onEnd" @resize-group-end="onEnd" @resize-start="onStart" @resize-group-start="onStart">
        </Moveable>
        <Selecto v-if="canvasStageRef" :container="canvasStageRef" :drag-container="canvasStageRef"
            :selectable-targets="['.canvas-node']" @select-end="onSelectEnd" :select-from-inside="false"></Selecto>
    </div>


</template>

<script setup lang="ts">
import { getComponent, createnode } from '@/materials'
import type { MaterialSchema } from '@/schema/material.ts'
import { useMoveable } from './composables/useMoveable'
import Moveable from 'vue3-moveable'
import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'
import Selecto from 'vue3-selecto'
import { useSelector } from './composables/useSelector'
import SketchRuler from 'vue3-sketch-ruler'
import 'vue3-sketch-ruler/lib/style.css'
import { useCanvasRuler } from './composables/useCanvasRuler'

const canvasRootRef = ref()
const moveableRef = ref()
const canvasStageRef = ref()


const editorStore = useEditorStore()
const {
    nodes,
    selectedNode,
    dataSources
} = storeToRefs(editorStore)
provide('dataSource',dataSources)

const {
    getNodeStyle,
    onDrag,
    onResize,
    onDragGroup,
    onResizeGroup,
    onEnd,
    onStart
} = useMoveable(moveableRef)
const {
    onSelectEnd,
    selectedTarget
} = useSelector(canvasStageRef)
const {
    palette,
    lines,
    scale,
    canvasRootHeight,
    canvasRootWidth,
    canvasStyle,
    canvasWidth,
    canvasHeight,
    onZoomChange
} = useCanvasRuler({ canvasRootRef, moveableRef })




function onDrop(e: DragEvent) {
    /*
    node结构: {
    // dsl
    type: 'text',
    name: '普通文本',
    layout: {
      width: 300,
      height: 50,
      x: 0,
      y: 0,
    },
    style: {
      color: 'black',
    },
    props: {
      content: 'hello',
    },*/
    const data = e.dataTransfer.getData('schema')
    const node = createnode(JSON.parse(data))

    node.layout.x = e.offsetX - node.layout.width / 2
    node.layout.y = e.offsetY - node.layout.height / 2
    editorStore.selectNode(node.id)
    editorStore.addNode(node)

}

function onSelect(node: MaterialSchema, e: MouseEvent) {
    editorStore.selectNode(node.id)

    nextTick(() => moveableRef.value.dragStart(e))
}

function onClearSelected() {
    editorStore.clearSelected()
}

const commandMap = {
    copy: () => editorStore.copyNode(selectedNode.value),
    remove: () => editorStore.removeNode(selectedNode.value),
    moveToTop: () => editorStore.moveToBottom(selectedNode.value),
    moveToBottom: () => editorStore.moveToTop(selectedNode.value),
    toggleLock: () => {
        editorStore.toggleLock(selectedNode.value)
        selectedTarget.value = []
    }
}
function onCommand(command) {
    commandMap[command]()
}
</script>

<style scoped lang="scss">
.canvas-root {
    position: relative;
    overflow: hidden;
    isolation: isolate;

    .canvas-stage {
        background: bg-mix(40%);
        position: relative;


        .canvas-node {
            position: absolute;
        }
    }
}
</style>
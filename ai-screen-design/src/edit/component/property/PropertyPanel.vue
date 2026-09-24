<template>
    <div>
        <NodeProperty v-if="selectedNode"></NodeProperty>
        <CanvasProperty v-else></CanvasProperty>
    </div>
</template>

<script setup lang="ts">
import { useEditorStore } from '@/stores/editor.ts';
import CanvasProperty from './components/CanvasProperty.vue';
import NodeProperty from './components/NodeProperty.vue';
import { storeToRefs } from 'pinia';

const editorStore = useEditorStore()
const {selectedNode} = storeToRefs(editorStore)
</script>

<style scoped lang="scss">

</style>
<template>
    <ScreenRender :page="page"></ScreenRender>
</template>

<script setup lang="ts">
import ScreenRender from '@/components/ScreenRender/ScreenRender.vue';
import { useEditorStore } from '@/stores/editor';
import { storeToRefs } from 'pinia';

/**
 * 点击预览从editorStore获取page数据，传给ScreenRender组件渲染
*/
const editorStore = useEditorStore()
const { page } = storeToRefs(editorStore)


</script>


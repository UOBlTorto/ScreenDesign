<template>
    <div>
        <el-form class="m-20" label-width="60" size="small">
            <el-form-item label="宽度">
                <el-input-number v-model="canvas.width"></el-input-number>
            </el-form-item>
            <el-form-item label="高度">
                <el-input-number v-model="canvas.height"></el-input-number>
            </el-form-item>
            <el-form-item label="背景色">
                <el-color-picker v-model="canvas.backgroundColor"></el-color-picker>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { useEditorStore } from '@/stores/editor';
import { storeToRefs } from 'pinia';

const editorStore = useEditorStore()
const { canvas } = storeToRefs(editorStore)
</script>

<style scoped lang="scss">

</style>
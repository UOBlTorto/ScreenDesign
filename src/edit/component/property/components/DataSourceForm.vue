<template>
    <div>
        <el-form class="p-20">
            <el-form-item label="数据源">
                <el-select v-model="selectedNode.dataID" placeholder="选择数据类型">
                    <el-option v-for="dataItem in dataSources" :key="dataItem.id" :label="dataItem.name" :value="dataItem.id"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { useEditorStore } from '@/stores/editor';
import { storeToRefs } from 'pinia';

const editorStore = useEditorStore()
const { dataSources, selectedNode } = storeToRefs(editorStore)
</script>

<style scoped></style>
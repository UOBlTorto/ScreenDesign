<template>
    <div>
        <el-form class="m-20" size="small" label-width="60">
            <el-row>
                <el-col  v-for="setter in setters" :key="setter.key" :span="setter.span||24">
                    <el-form-item :label="setter.label">
                        <component :is="componentMap[setter.type]" :modelValue="getValue(selectedNode, setter.key)"
                            @update:modelValue="(val) => applyChange(selectedNode, setter.key, val)"
                            @focus="startBatch" @blur="commitBatch"
                            v-bind="setter.props"
                            ></component>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { useUndoRedo } from '@/composables/useUndoRedo';
import { getValue } from '@/utils';

const {applyChange, startBatch, commitBatch} = useUndoRedo()

const props = defineProps(['setters', 'selectedNode'])
const componentMap = {
    'input': ElInput,
    'color': ElColorPicker,
    'number': ElInputNumber,
    'checkbox':ElCheckbox,
    'select':ElSelect
}
</script>

<style scoped></style>
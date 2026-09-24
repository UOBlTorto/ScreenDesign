<template>
    <div class="flex gap-20 toolbar-left">
        <span :class="{ active: editorStore.panelVisible.material }"
            @click="() => editorStore.panelVisible.material = !editorStore.panelVisible.material">
            <Icon icon="mynaui:panel-left-solid"></Icon>
        </span>
        <span :class="{ active: editorStore.panelVisible.property }"
            @click="() => editorStore.panelVisible.property = !editorStore.panelVisible.property">

            <Icon icon="mynaui:panel-right-solid"></Icon>
        </span>
        <span :class="{ active: editorStore.panelVisible.layer }"
            @click="() => editorStore.panelVisible.layer = !editorStore.panelVisible.layer">

            <Icon icon="fe:layer"></Icon>
        </span>
        <span @click="undo" :class="{disabled:!canUndo}">
            <Icon icon="circum:undo"></Icon>
        </span>
        <span @click="redo" :class="{disabled:!canRedo}">
            <Icon icon="circum:redo"></Icon>
        </span>
    </div>
</template>

<script lang="ts" setup>
import { useUndoRedo } from '@/composables/useUndoRedo';
import { useEditorStore } from '@/stores/editor.ts';

const {undo,redo,canRedo,canUndo} = useUndoRedo()
const editorStore = useEditorStore()

</script>

<style lang="scss" scoped>
.toolbar-left {
    span {
        border: 1px solid #ccc;
        border-radius: 4px;
        cursor: pointer;

        &.active {
            background-color: #912e2e;
        }

        &.disabled {
            opacity: 0.4;
            cursor: not-allowed;
        }
    }
}
</style>
<template>
    <div class="material-item" draggable="true" @dragstart="onDragStart">
        <div class="title">{{ material.name }}</div>
        <div class="icon">
            <Icon :icon="material.icon" width="80"></Icon>
        </div>
    </div>
</template>

<script setup lang="ts">
const props=defineProps(['material'])

function onDragStart(e: DragEvent) {
    e.dataTransfer.setData('schema', JSON.stringify(props.material.schema))
}
</script>

<style scoped lang="scss">
.material-item{
    background-color: bg-mix(40%);
    padding: 10px 20px;
    height: 120px;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    cursor: pointer;
    &:hover{
        transform: translateY(-2px);
        border-color: aquamarine;
    }
    transition: all 300ms;
    .title{
        height: 20px;
        font-size: 12px;
        font-weight: 16px;
    }
    .icon{
        flex:1;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        display: flex;
        justify-content: center;
    }
}
</style>
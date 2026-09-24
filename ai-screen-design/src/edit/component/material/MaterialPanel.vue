<template>
    <div class="material-panel flex">
        <div class="nav w-56">
            <div v-for="item in groups" :key="item.name" :class="{active:activeGroup===item.key}" @click="()=>activeGroup=item.key">
                <span>
                    <Icon :icon="item.icon"></Icon>
                </span>
                <span>{{ item.name }}</span>
            </div>
            
        </div>
        <div class="material-list flex-1 p-10 overflow-auto">
            <MaterialItem class="mt-10" v-for="item in activeMaterial" :key="item.name" :material="item"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getGroups, getMaterialsByGroup } from '@/materials/index.ts';
import MaterialItem from './components/MaterialItem.vue';
const groups=getGroups()
const activeGroup = ref('charts')
const activeMaterial = computed(()=>getMaterialsByGroup(activeGroup.value))
</script>

<style scoped lang="scss">
.material-panel {
    background: bg-mix(20%);

    .nav {
        border-right: 1px solid var(--border-color);

        div {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 50px;
            font-size: 12px;
            cursor: pointer;

            &.active {
                background: bg-mix(70%);
            }
        }
    }
    .material-list{
        scrollbar-color: #446b6b transparent;
        scrollbar-width: auto;
    }
}
</style>
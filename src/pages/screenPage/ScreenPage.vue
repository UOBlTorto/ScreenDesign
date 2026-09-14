<template>
    <ScreenRender :page="page"></ScreenRender>
</template>

<script setup lang="ts">
import ScreenRender from '@/components/ScreenRender/ScreenRender.vue';
import { getScreenFromLocalStorage } from '@/utils/publish';
import { useRoute } from 'vue-router';

/**
 * 从本地存储获取屏幕数据
 */
const route = useRoute()
const screenId = route.query.id as string
const page = getScreenFromLocalStorage(screenId)
</script>
<template>
    <div class="flex gap-20 toolbar-right justify-end">
        <span @click="onPreview">
            <Icon icon="icon-park-outline:preview-open"></Icon>
        </span>
        <span @click="previewJSON">
            <Icon icon="si:json-duotone"></Icon>
        </span>
        <span @click="isshowDataManage = true">
            <Icon icon="dashicons:database"></Icon>
        </span>
        <span @click="onPublish">
            <Icon icon="entypo:publish"></Icon>
        </span>
        <span @click="onImport">
            <Icon icon="mdi:import"></Icon>
            <input type="file" v-show="false" @change="onChange" ref="inputRef">
        </span>
        <span @click="onExport">
            <Icon icon="mdi:export"></Icon>
        </span>
        <!-- JSON管理 -->
        <el-drawer destroy-on-close v-model="isShow" size="800" title="编辑 页面JSON">
            <MonacoEditor v-model="JSONText"></MonacoEditor>
            <template #footer>
                <el-button @click="isShow = false">no</el-button>
                <el-button @click="onConfirm">yes</el-button>
            </template>
        </el-drawer>
        <!-- 数据源管理 -->
        <el-dialog destroy-on-close title="数据源管理" v-model="isshowDataManage">
            <DataSourceManage ref="dataSourceManageRef"></DataSourceManage>
            <template #footer>
                <el-button @click="isshowDataManage = false">no</el-button>
                <el-button type="primary" @click="onSave">yes</el-button>
            </template>
        </el-dialog>
    </div>

</template>

<script lang="ts" setup>
import MonacoEditor from '@/components/MonacoEditor/MonacoEditor.vue';
import { useEditorStore } from '@/stores/editor';
import { Icon } from '@iconify/vue';
import { ElMessage } from 'element-plus';
import { storeToRefs } from 'pinia';
import DataSourceManage from './components/DataSourceManage.vue';
import { useRouter } from 'vue-router';
import { saveScreenToLocalStorage } from '@/utils/publish.ts';

const isshowDataManage = ref(false)

const dataSourceManageRef = ref()

const editorStore = useEditorStore()
const { page } = storeToRefs(editorStore)
const JSONText = ref('')
const isShow = ref(false)
function previewJSON() {
    isShow.value = true
    JSONText.value = JSON.stringify(page.value, null, 2)
}
function onConfirm() {
    const newPage = JSON.parse(JSONText.value)
    editorStore.setPage(newPage)
    isShow.value = false
}
function onExport() {
    // 获取JSON
    const json = JSON.stringify(page.value, null, 2)
    // 创建一个blob
    const blob = new Blob([json])
    // 创建一个URL
    const url = URL.createObjectURL(blob)

    // 初始化a标签
    const ele = document.createElement('a')
    ele.href = url
    ele.download = 'previewJson.json'

    // 为document.body添加a元素
    document.body.appendChild(ele)
    ele.click()
    document.body.removeChild(ele)

    // 销毁URL
    URL.revokeObjectURL(url)
}
const inputRef = ref()
function onImport() {
    // 点击导入按钮弹出file输入框
    inputRef.value.click()
}
async function onChange(e) {
    // 拿到事件对象,用text方法获取数据，存储在page
    const file: File = e.target.files[0]
    const text = await file.text()
    try {
        const newPage = JSON.parse(text)
        editorStore.setPage(newPage)
        ElMessage.success('导入成功')
    } catch (e) {
        ElMessage.error('请检查 JSON 是否合法！', e)
    }
}
// 点击确认写回（保存数据）
function onSave() {
    dataSourceManageRef.value.save()
    isshowDataManage.value = false
}
// 点击预览按钮，跳转到预览页面
const router = useRouter()
function onPreview() {
    router.push('/preview')
}
// 点击发布按钮(点击就发请求保存JSON到后端，目前用保存到localstorage的方式)
function onPublish() {
    const screenId = saveScreenToLocalStorage(page.value)
    // debugger
    router.push(`/screen?id=${screenId}`)
}
</script>

<style lang="scss" scoped>
.toolbar-right {
    span {
        border: 1px solid #ccc;
        border-radius: 4px;
        cursor: pointer;
    }
}
</style>
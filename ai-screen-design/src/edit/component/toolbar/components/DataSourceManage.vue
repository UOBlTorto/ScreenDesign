<template>
    <div class="data-source-container">
        <div class="data-source-sidebar">
            <el-button type="primary" @click="onAdd" class="m-10">新增</el-button>
            <div v-for="dataItem in data" :key="dataItem.id" class="data-item p-10 m-10" :class="{active:activeData?.id === dataItem.id}"
                @click="()=>onSelect(dataItem)"
            >
                {{ dataItem.name }}
                <span @click.stop="()=>removeData(dataItem.id)"><Icon icon="mdi:delete"></Icon></span>
            </div>
        </div>
        <div class="data-cource-content p-10">
            <el-form v-if="activeData">
                <el-form-item label="名称">
                    <el-input v-model="activeData.name"></el-input>
                </el-form-item>
                <el-form-item label="类型">
                    <el-radio-group v-model="activeData.type">
                        <el-radio-button label="静态" value="static"></el-radio-button>
                        <el-radio-button label="动态" value="api"></el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="activeData.type==='static'">
                    <monaco-editor v-model="activeData.data"></monaco-editor>
                </el-form-item>
                <div v-else>
                    <el-form label-width="70">
                        <el-form-item label="请求方法">
                            <el-radio-group v-model="activeData.method">
                                <el-radio-button label="GET" value="get"></el-radio-button>
                                <el-radio-button label="POST" value="post"></el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="请求地址">
                            <el-input v-model="activeData.url"></el-input>
                        </el-form-item>
                        <el-form-item label="轮询时间">
                            <el-input v-model="activeData.intervel"></el-input>
                        </el-form-item>
                        <el-form-item label="响应路径">
                            <el-input v-model="activeData.responsePath"></el-input>
                        </el-form-item>
                        <el-form-item label="请求预览">
                            <el-button type="primary" @click="onRequest">预览</el-button>
                        </el-form-item> 
                        <el-form-item label="请求预览" v-show="showPreview">
                            <MonacoEditor v-model="responesText"></MonacoEditor>
                        </el-form-item>                       
                        <el-form-item label="请求参数">
                            <monaco-editor v-model="activeData.params"></monaco-editor>
                        </el-form-item>

                    </el-form>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script setup lang="ts">
import MonacoEditor from '@/components/MonacoEditor/MonacoEditor.vue';
import { loadData } from '@/composables/useDataSource';
import { useEditorStore } from '@/stores/editor';
import { deepClone } from '@/utils';
import { storeToRefs } from 'pinia';

const editorStore = useEditorStore()
const { dataSources } = storeToRefs(editorStore)

const responesText = ref()

const data = ref(deepClone(dataSources.value).map(item=>{
    return {
        ...item,
        data:item.data?JSON.stringify(item.data,null,2):undefined,
        params: item.params?JSON.stringify(item.params,null,2):undefined
    }
}))

// 选中后激活并展示数据
const activeData = ref()
function onSelect(dataItem){
    activeData.value = dataItem
}
// 新添数据
function onAdd(){
    data.value.push({
        type:'static',
        name:'未命名',
        id:crypto.randomUUID(),
        data:'',
        params:'{}'
    })

    onSelect(data.value.at(-1))
}
// 移除数据
function removeData(dataID){
    data.value = data.value.filter(item=>item.id!==dataID)
    if (activeData.value?.id === dataID) {
        activeData.value = null // 或者 data.value.at(-1)
    }
}

// 预览请求
const showPreview = ref(false)
function onRequest(){
    showPreview.value =true
    loadData({
        ...activeData.value,
        params:activeData.value.params?JSON.parse(activeData.value.params):undefined
    })
    .then((res)=>responesText.value = JSON.stringify(res,null,2))
}
// 暴露的方法
defineExpose({
    save(){
        const _data = deepClone(data.value).map(dataItem=>{
            return {
                ...dataItem,
                data:dataItem.data?JSON.parse(dataItem.data):undefined,
                params:dataItem.params?JSON.parse(dataItem.params):undefined,
            }
        })
        editorStore.page.data = _data
    }
})
</script>

<style scoped lang="scss">
.data-source-container {
    display: flex;
    gap: 20px;
    height: 600px;
    font-size: 16px;
    font-weight: bold;

    .data-source-sidebar {
        overflow: auto;
        width: 200px;
        flex: none;
        border: 1px solid var(--border-color);
        .data-item{
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: bg-mix(50%);
            cursor: pointer;
            &.active{
                background-color: var(--el-color-primary);
            }
        }
    }

    .data-cource-content {
        flex: 1;
        border: 1px solid var(--border-color);
        overflow: auto;
    }
}
</style>
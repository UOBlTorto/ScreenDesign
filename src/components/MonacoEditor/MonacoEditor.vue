<template>
    <div class="editor-container" ref="editorElement">

    </div>
</template>

<script setup lang="ts">
import { editor } from 'monaco-editor';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

const editorElement = ref()
const props = defineProps<{lang?: string}>()
const modelValue = defineModel<string>()
let instance: editor.IStandaloneCodeEditor | null = null

onMounted(()=>{
    instance = editor.create(editorElement.value,{
        value:modelValue.value,
        theme:'vs-dark',
        fontSize:14,
        language:props.lang || 'json',
        tabSize:2,
        automaticLayout:true,//自适应父节点宽高
    })
    instance.onDidChangeModelContent(()=>{
        modelValue.value = instance.getValue()
    })
/**
- 以后你和这套编辑器打交道，只按遥控器：
- 你想知道里面现在有什么内容 → instance.getValue()
- 你想把外面别处的内容塞进去 → instance.setValue(...)
- 你希望"用户一打字就告诉我" → instance.onDidChangeModelContent(...)
- 不要这间房了 → instance.dispose()，装修公司把家具拆走、电线剪掉（释放内存）
 */
    onBeforeUnmount(()=>instance.dispose())
})

watch(modelValue, (val) => {
    if (instance && val !== instance.getValue()) {
        instance.setValue(val ?? '')
    }
})

window.MonacoEnvironment = {
    getWorker(_,label){
        if(label==='json') return new JsonWorker()
        if(label==='javascript' || label === 'typescript') return new TsWorker()
        return new EditorWorker()
    }
}

</script>

<style scoped lang="scss">
.editor-container{
    width: 100%;
    min-height: 400px;
    height: 100%;
}
</style>

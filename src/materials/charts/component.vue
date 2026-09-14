<template>
    <div class="chart-material w-full h-full" ref="chart"
        v-loading="loading"
    >
    </div>


</template>

<script setup lang="ts">
import { useDataSource } from '@/composables/useDataSource';
import type { MaterialSchema } from '@/schema/material';
import { init,type EChartsType } from 'echarts'
defineOptions({
    name: 'ChartMaterial'
})
const props = defineProps<{ schema: MaterialSchema }>()
const chartRef = useTemplateRef('chart')
let chart:EChartsType

const dataid = computed(()=>props.schema?.dataID)
const { dataList, loading, refresh }=useDataSource(dataid)
const option = computed(()=>{
    const _option = props.schema.props.option
    return {
        ..._option,
        dataset:{
            ..._option.dataset,
        source:dataList.value||_option.dataset.source
        }
    }
})



onMounted(() => {
    chart = init(chartRef.value)
    chart.setOption(option.value)

    const observer = new ResizeObserver(() => {
        chart.resize()

    })

    observer.observe(chartRef.value)

    onBeforeUnmount(()=>{
        observer.disconnect()
        chart.dispose()
    })
})
watch(option,(newVal)=>{
    chart.setOption(newVal)
},{deep:true})
defineExpose({
  refresh
})


</script>

<style scoped lang="scss">
.chart-material {}
</style>

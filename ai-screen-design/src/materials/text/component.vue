<template>
    <div :style="textStyle">
        {{ schema.props.content }}
    </div>
</template>

<script setup lang="ts">
defineOptions({
    name:'TextMaterial'
})
const props = defineProps(['schema'])
const textStyle = computed(()=>{
  return {
    ...props.schema.style,
    fontSize: props.schema.style.fontSize + 'px',
  }
})
</script>

<style scoped lang="scss">

</style>

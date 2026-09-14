import type { MaterialDefinition } from '@/schema/material.ts'
import TextMatetial from './component.vue'
const textMaterial: MaterialDefinition = {
  name: '文本',
  group: 'info',
  icon: 'solar:text-bold',
  // 。。。
  setters: [
    {
      key: 'props.content',
      type: 'input',
      label: '内容',
    },
    {
      key: 'style.color',
      type: 'color',
      label: '颜色',
    },
    {
      key: 'style.fontSize',
      type: 'number',
      label: '字号',
    },
  ],
  schema: {
    // dsl
    type: 'text',
    name: '普通文本',
    layout: {
      width: 500,
      height: 350,
      x: 0,
      y: 0,
    },
    style: {
      color: '#fff',
      fontSize: 18,
    },
    props: {
      content: 'hello',
    },
    events: [
      {
        // 点击事件
        type: 'click',
        name: 'fn',
        // code:'console.log(context)'
        // code:`
        // $node.props.content = '你好'
        // `
        code: ``,
        title: 'click',
      },
    ],
  },
  eventOptions: [
    {
      label: '点击事件',
      value: 'click',
    },
    {
      label: '双击事件',
      value: 'dblclick',
    },
    {
      label: '组件挂载',
      value: 'vnodeMounted',
    },
  ],
}
export function install(register) {
  register(textMaterial,TextMatetial)
}

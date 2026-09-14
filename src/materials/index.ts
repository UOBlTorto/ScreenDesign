import type { MaterialDefinition, MaterialSchema } from "@/schema/material"

// 拓展物料面板-物料
const materials:MaterialDefinition[] = []
/**
 * 扩展|注册 物料的方法
 *
 * 取|存组件componentMap
 * 类型text-->TextMaterial组件
 * 类型charts-->ChartsMaterial组件
 *
 * 取|存setters settersMap
 * 类型text--》物料text的setters
 */
const componentMap = new Map()
// const settersMap = new Map()
const materialMap = new Map()
function register(material:MaterialDefinition,component:Component){
    materials.push(material)
    componentMap.set(material.schema.type,component)
    // settersMap.set(material.schema.type,material.setters)
    materialMap.set(material.schema.type,material)

}
const materialModule = import.meta.glob('@/materials/*/index.ts',{eager:true})
for(const key in materialModule){
    const item = materialModule[key]
    // @ts-ignore
    item.install(register)
}

// 拓展物料面板-分类
const groups = [
  {
    name: '图表',
    icon: 'solar:chart-bold',
    key: 'charts',
  },
  {
    name: '详情',
    icon: 'ant-design:form-outlined',
    key: 'info',
  },
]

/**
 * 查物料
 */
export function getMaterialsByGroup(activeGroup: string) {
  return materials.filter((item) => item.group === activeGroup)
}
/**
 * 查所有组
 */
export function getGroups() {
  return groups
}

/**
 * 查物料对应组件
 */
export function getComponent(type:string){
  return componentMap.get(type)
}
/**
 * 查物料对应setters
 */
export function getSetters(type:string){
  return materialMap.get(type)?.setters || []
}

/**
 * 创建物料节点
 */
export function createnode(node:MaterialSchema){
    return {
        ...node,
        id:crypto.randomUUID()
    }
}

export function getMaterialEventOptions(type:string){
  return materialMap.get(type)?.eventOptions || []
  }


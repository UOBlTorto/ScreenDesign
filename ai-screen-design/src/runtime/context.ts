import type { MaterialSchema } from "@/schema/material";
import type { PageSchema } from '@/schema/page.ts'
import { setValue } from '@/utils'

interface RuntimeContext {
    getNode(id: string): MaterialSchema | undefined;
    setAttribute(id: string,key:string, value: any | undefined): void;
//     更新节点的props
  setProp(id: string,key:string, value: any | undefined): void;
  setStyle(id: string,key:string, value: any | undefined): void;
//   注册组件实例的方法
  registerNodeInstance(instance:Record<string, any>):void
//   c触发节点的方法
  trigger(id:string,name:string,...args):void
//   通过dataid 刷新node
  refreshNodesByDataId(id:string):void
//   联动事件
  dispatch(id:string,name:string,...args:any[]):void
}

// const context: RuntimeContext = {}
export function createRuntiemContext(page:Ref<PageSchema>): RuntimeContext {
  const getNode:RuntimeContext['getNode'] = (id: string) => {

    return page.value.nodes.find((node) => node.id === id);
  }
  const  setAttribute:RuntimeContext['setAttribute'] = (id:string,key:string, value: any | undefined) => {
    const node = getNode(id);
    if (!node) {
      console.error(`Cannot set attribute for node ${id}`);
      return;
    }
    setValue(node, key, value);
  }
  const setProp: RuntimeContext['setProp'] = (id: string,key:string, value: any) => {
    setAttribute(id,`props.${key}`, value);
  }
  const setStyle: RuntimeContext['setStyle'] = (id:string,key:string, value: any | undefined) => {
    // debugger
    setAttribute(id,`style.${key}`, value);
  }

  let instanceMap = {}
  const registerNodeInstance:RuntimeContext['registerNodeInstance'] = (instance:Record<string, any>) => {
    instanceMap = instance;
  }
  const trigger:RuntimeContext['trigger']=(id:string,name:string,...args):void =>{
    const instance = instanceMap[id];
    if (!instance) {
      console.error(`Cannot set attribute for node ${id}`);
    }
    instance[name]?.(...args)
  }
  const refreshNodesByDataId:RuntimeContext['refreshNodesByDataId'] = (dataid:string,...args) => {
    const nodes = page.value.nodes.filter(node=>node.dataID===dataid);
    nodes.forEach((node:any) => {
      trigger(node.id,'refresh',...args)
    })
  }
  const dispatch:RuntimeContext['dispatch'] = (id:string,name:string,...args):void =>{
  //   执行事件
    const node = getNode(id);
    if(!node) {
      console.error(`Cannot set attribute for node ${id}`);
      return;
    }
    const event=node.events.find(event=>event.name===name)
    if(event){
      event.handler(...args)
    }
  }

  return {
    getNode,
    setAttribute,
    setProp,
    setStyle,
    registerNodeInstance,
    trigger,
    refreshNodesByDataId,
    dispatch,
  }
}

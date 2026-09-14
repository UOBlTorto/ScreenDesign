interface Layout {
        x:number
        y:number
        width: number
        height: number
}

export interface MaterialSchema {
    type: string
    name: string
    id: string
    locked?:boolean
    layout: Layout
    style?: Record<string, any>
    props: Record<string, any>
    dataID?:string
  events?:MaterialEvent[]
}

export interface SetterSchema{
    key:string
    label:string
    type:string
    [key:string]:any

}

export interface MaterialEvent {
//   事件类型
  type: string
  // 事件名 函数名
  name: string
//   函数体
  code:string
//   拿到事件
  handler?:Function
  title:string
}
interface EventOption {
  label:string,
  value:string,
}
export interface MaterialDefinition {
    // region 物料元数据
    name: string
    group: string
    icon: string
    setters:SetterSchema[]
    eventOptions: EventOption[]
    // endregion
    schema: Omit<MaterialSchema,'id'>
}

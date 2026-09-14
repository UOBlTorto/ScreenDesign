import type { MaterialSchema } from '@/schema/material'

interface CanvasSchema {
  width: number
  height: number
  backgroundColor: string
}
export interface DataSource {
  type: 'static'|'api'
  name:string
  id:string
  data:any
  url?:string
  method?:'get'|'post'
  intervel?:number
  params?:Record<string,any>
  responsePath?:string
}
export interface PageSchema {
  id?:string
  canvas: CanvasSchema
  nodes: MaterialSchema[]
  data: DataSource[]
}

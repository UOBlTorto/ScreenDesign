import { useUndoRedo } from '@/composables/useUndoRedo'
import type { MaterialSchema } from '@/schema/material'
import { useEditorStore } from '@/stores/editor'
import { type OnDrag, type OnDragGroup, type OnResize, type OnResizeGroup } from 'vue3-moveable'

export function useMoveable(moveableRef) {
  const editorStore = useEditorStore()

  watch(()=>editorStore.nodes.map(node=>node.layout),()=>{
    moveableRef.value.updateRect(undefined,true)
  },{flush:'post'})

  const {applyChange,startBatch,commitBatch} = useUndoRedo()
  function onStart(){
    startBatch()
  }
  function onEnd(){
    commitBatch()
  }

  function getNodeStyle(node: MaterialSchema, index: number) {
    return {
      width: node.layout.width + 'px',
      height: node.layout.height + 'px',
      top: node.layout.y + 'px',
      left: node.layout.x + 'px',
      zIndex: index + 1,
    }
  }
  function onDrag(e: OnDrag) {
    e.target.style.left = e.left + 'px'
    e.target.style.top = e.top + 'px'
    const node = getNodeByTarget(e.target as HTMLElement)
    // node.layout.x = e.left
    // node.layout.y = e.top
    applyChange(node,'layout',{
      ...node?.layout,
      x:e.left,
      y:e.top
    })
  }
  function onResize(e: OnResize) {
    e.target.style.width = e.width + 'px'
    e.target.style.height = e.height + 'px'
    const node = getNodeByTarget(e.target as HTMLElement)
    // node.layout.width = e.width
    // node.layout.height = e.height
    applyChange(node,'layout',{
      ...node.layout,
      width:e.width,
      height:e.height

    })
    onDrag(e.drag)
  }

  function getNodeByTarget(ele: HTMLElement) {
    const id = ele.getAttribute('data-node-id')
    const node = editorStore.findNode(id)
    return node
  }
  function onDragGroup(e: OnDragGroup) {
    e.events.forEach(onDrag)
  }
  function onResizeGroup(e: OnResizeGroup) {
    e.events.forEach(onResize)
  }
  return {
    getNodeStyle,
    onDrag,
    onResize,
    onDragGroup,
    onResizeGroup,
    onStart,
    onEnd
  }
}

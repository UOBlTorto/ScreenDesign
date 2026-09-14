import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'

export function useSelector(stageRef) {
  const editorStore = useEditorStore()
  const {selectedIDList} = storeToRefs(editorStore)

  const selectedTarget = shallowRef<HTMLElement[]>()

  watch(
    selectedIDList,
    (idList) => {
      selectedTarget.value = idList.map((id) =>
        stageRef.value.querySelector(`[data-node-id='${id}']:not([data-node-locked='true'])`),
      )
    },
    { deep: true, flush: 'post' },
  )

  function onSelectEnd(e) {
    selectedTarget.value = e.selected
    const ids = e.selected.map((ele) => ele.getAttribute('data-node-id'))
    editorStore.selectNodes(ids)
  }
  return {
    onSelectEnd,
    selectedTarget,
  }
}

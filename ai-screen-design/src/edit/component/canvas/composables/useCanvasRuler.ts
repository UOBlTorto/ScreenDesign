import { useEditorStore } from "@/stores/editor"
import { storeToRefs } from "pinia"
import { debounce } from '@/utils/index.ts'


export function useCanvasRuler({canvasRootRef,moveableRef}) {
  const editorStore = useEditorStore()
  const { canvas } = storeToRefs(editorStore)
  /**
   * 标尺卡功能
   */
  const palette = {
    bgColor: '#1f2937',
    longfgColor: '#6b7280',
    fontColor: '#9ca3af',
    fontShadowColor: '#0e8da7',
    shadowColor: 'rgba(14, 141, 167, 0.14)',
    lineColor: '#22c55e',
    lineType: 'solid',
    lockLineColor: '#4b5563',
    borderColor: '#374151',
    hoverBg: '#111827',
    hoverColor: '#ffffff',
  }
  const lines = ref({ h: [], v: [] })
  const scale = ref(1)
  const canvasRootWidth = ref(1000)
  const canvasRootHeight = ref(800)

  const canvasWidth = computed(()=>canvas.value.width)
  const canvasHeight = computed(()=>canvas.value.height)
  const canvasStyle = computed(() => {
    return {
      width: canvasWidth.value + 'px',
      height: canvasHeight.value + 'px',
      backgroundColor: canvas.value.backgroundColor,
    }
  })
  const onRootResize = debounce((rect) => {
    canvasRootWidth.value = rect.width
    canvasRootHeight.value = rect.height
  }, 300)
  onMounted(() => {
    canvasRootWidth.value = canvasRootRef.value.getBoundingClientRect().width
    canvasRootHeight.value = canvasRootRef.value.getBoundingClientRect().height

    //  监听dom属性的变化API
    const ob = new ResizeObserver((entries) => {
      const entry = entries[0]
      const rect = entry.contentRect
      onRootResize(rect)
    })
    ob.observe(canvasRootRef.value)

    onUnmounted(() => {
      ob.disconnect()
    })
  })
  // 移动画布让选框也跟着动
  function onZoomChange() {
    moveableRef.value.updateRect() //更新选框的方法
  }
  return {
    canvasStyle,
    canvasWidth,
    canvasHeight,
    canvasRootWidth,
    canvasRootHeight,
    lines,
    scale,
    palette,
    onZoomChange

  }
}

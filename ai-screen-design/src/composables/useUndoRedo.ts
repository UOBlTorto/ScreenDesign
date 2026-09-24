import { getValue, setValue } from '@/utils'

const MAX_HISTORY_LENGTH = 1000

const undoStack = shallowReactive([]),
  redoStack = shallowReactive([])

export function useUndoRedo() {
  const canUndo = computed(() => undoStack.length > 0)
  const canRedo = computed(() => redoStack.length > 0)

  let activeBatch = null

  function pushRecord(record){
    undoStack.push(record)
    if (undoStack.length > MAX_HISTORY_LENGTH) {
      undoStack.shift()
    }
}

  function startBatch() {
    if (!activeBatch) activeBatch = []
  }
  function commitBatch() {
    if (activeBatch?.length) {
      pushRecord(activeBatch)
    }
    activeBatch = null
  }

  function applyChange(t, k, v) {
    const newVal = v,
      oldVal = getValue(t, k),
      record = { t, k, oldVal, newVal }
    setValue(t, k, newVal)

    if (activeBatch) {
      const _record = activeBatch.find((item) => item.t === t && item.k === k)
      if (_record) {
        _record.newVal = newVal
      } else {
        activeBatch.push(record)
      }
    } else {
      pushRecord([record])
    }
    redoStack.length = 0
  }
  function undo() {
    // commitBatch()
    const records = undoStack.pop()
    if (!records) return
    records.toReversed().forEach((record) => {
      const { t, k, oldVal } = record
      setValue(t, k, oldVal)
    })
    redoStack.push(records)
  }
  function redo() {
    // commitBatch()
    const records = redoStack.pop()
    if (!records) return
    records.forEach((record) => {
      const { t, k, newVal } = record
      setValue(t, k, newVal)
    })
    pushRecord(records)
  }
  return {
    applyChange,
    redo,
    undo,
    canRedo,
    canUndo,
    startBatch,
    commitBatch,
  }
}

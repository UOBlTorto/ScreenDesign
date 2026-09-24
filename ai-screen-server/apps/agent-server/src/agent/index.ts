import { END, START, StateGraph } from '@langchain/langgraph'
import { state } from './state.js'
import { handleMessageTask } from './task-nodes/message.js'
import { handleEditTask, handlePageTask, handleEditResult, handlePlanEdit } from './task-nodes/index.js'
import { classifyTask } from './classification.js'

const builder = new StateGraph(state)
  .addNode('classifyTask', classifyTask)
  .addNode('handleMessageTask', handleMessageTask)
  .addNode('handlePageTask', handlePageTask)
  .addNode('handleEditTask', handleEditTask)
  .addNode('handlePlanEdit', handlePlanEdit)
  .addNode('handleEditResult', handleEditResult)
  .addEdge(START, 'classifyTask')
  .addConditionalEdges('classifyTask',state=>state.classification.task,{
    message:'handleMessageTask',
    page:'handlePageTask',
    edit:'handlePlanEdit'
  })
  .addConditionalEdges('handlePlanEdit',state=>state.editPlan?.length?'handleEditTask':END,{
    handleEditTask:'handleEditTask',
    [END]:END
  })
  .addConditionalEdges('handleEditTask',state=>state.actions?.length?'handleEditResult':END,{
    handleEditResult:'handleEditResult',
    [END]:END
  })
  .addEdge('handlePageTask', END)
  .addEdge('handleEditResult', END)
  .addEdge('handleMessageTask', END)

export const graph = builder.compile()

graph.name = 'ScreenDesignAgent'

import { z } from 'zod'
import { createChatModel } from '../ai/model.js'
import { SystemMessage } from '@langchain/core/messages'

// 结构化输出的schema
export const ClassificationSchema = z.object({
  task: z
    .enum(['message', 'page', 'edit'])
    .describe(
      '一级任务分类：message = 普通问答，page = 创建完整页面，edit = 修改当前页面'
    ),
})

// 节点
export async function classifyTask(state) {
  const chatModel = createChatModel({
    disableStreaming: true,
  })

  const model = chatModel.withStructuredOutput(ClassificationSchema, {
    name: 'task_classification',
    method: 'jsonSchema',
  })

  const response = await model.invoke(
    [
      new SystemMessage(`
      你是一个 AI 大屏设计器的意图识别助手，请根据用户输入返回一级任务分类。

      一级任务分类：
      - message: 普通问答，用户只是想问一些问题，或者获取一些信息，不涉及对页面的任何改动。
      - page: 创建完整页面，用户想用一句话或者一段综合描述生成一整张大屏。
      - edit: 修改当前页面，包括新增节点、修改节点或者删除节点。

      说明：
      - 一个或多个节点的新增、修改、删除，以及这些操作的组合，都属于 edit。
      - 只要用户要求创建/新增具体的组件（文本、图表等），无论数量多少，都是 edit；page 只用于生成一整张完整大屏。

      示例：
      - “当前页面有几个节点？” → message
      - “当前选中的组件显示了什么内容？” → message
      - “帮我生成一个销售数据大屏” → page
      - “帮我创建一个文本节点，内容为死鬼” → edit
      - “新增两个文本节点，一个内容为你好，另一个是hello” → edit
      - “把当前选中的文本改成紫色” → edit
      - “删除选中的节点” → edit
    `),
      ...state.messages,
    ],
    {
      tags: ['nostream'],
    }
  )

  return {
    classification: {
      task: response.task,
    },
  }
}

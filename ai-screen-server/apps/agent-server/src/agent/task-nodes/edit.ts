// 一句话 修改 大屏（第十三节：按 editPlan 逐项生成 actions）

import { HumanMessage, SystemMessage } from '@langchain/core/messages'
import { createNonStreamingModel } from '../../ai/model.js'
import { z } from 'zod'

const ADD_NODE = 'add_node'
const UPDATE_NODE = 'update_node'
const REMOVE_NODE = 'remove_node'

// 新增节点：用选中物料的 Schema 生成完整节点，id/type 由程序钉死
async function generateNode(materialSchema, prompt) {
  const schema = z.fromJSONSchema(materialSchema.configSchema) as z.ZodObject

  const model = createNonStreamingModel().withStructuredOutput(
    schema.extend({
      id: z.literal(crypto.randomUUID()).describe('节点的唯一标识符。'),
      type: z.literal(materialSchema.type).describe('节点的类型。'),
    }),
    {
      name: 'material_node',
      method: 'jsonSchema',
    }
  )

  return model.invoke([
    new SystemMessage(`
      你是一个 AI 大屏设计器的节点生成助手。
      请根据用户要求生成一个完整的 ${materialSchema.name} 节点。
      必须遵守结构化输出 Schema。
      对于可选属性，如果用户没有明确要求，可以留空。
    `),
    new HumanMessage(prompt),
  ])
}

// 修改节点：模型只能改 props/layout/style 等，id/type 强制恢复原值
async function updateNode(currentNode, materialSchema, prompt) {
  const schema = z.fromJSONSchema(materialSchema.configSchema) as z.ZodObject

  const model = createNonStreamingModel().withStructuredOutput(schema, {
    name: 'material_node',
    method: 'jsonSchema',
  })

  const res = await model.invoke([
    new SystemMessage(`
      你是一个 AI 大屏设计器的节点修改助手。
      当前选中的节点是 ${materialSchema.name}，请根据用户的要求修改该节点。
      必须遵守结构化输出 Schema。
      对于可选属性，如果用户没有明确要求，可以留空。

      规则：
       - 只能修改当前节点的 props、layout、style 等属性。
       - 禁止修改节点的 id、type 等属性。

      当前节点的内容：

      ${JSON.stringify(currentNode, null, 2)}
    `),
    new HumanMessage(prompt),
  ])

  return {
    ...res,
    id: currentNode.id,
    type: currentNode.type,
  }
}

// 按 editPlan 顺序逐项执行，产出 actions；任一步找不到物料或目标节点则返回空 actions
export async function handleEditTask(state) {
  const plans = state.editPlan
  const actions = []

  for (const plan of plans) {
    const { type, id, action, prompt } = plan
    const schema = state.schema.material.find(m => m.type === type)
    if (!schema) {
      return { actions: [] }
    }

    if (action === ADD_NODE) {
      const node = await generateNode(schema, prompt)
      actions.push({ node, type: ADD_NODE })
      continue
    }

    const currentNode = state.page.nodes.find(node => node.id === id)
    if (!currentNode) {
      return { actions: [] }
    }

    if (action === UPDATE_NODE) {
      const node = await updateNode(currentNode, schema, prompt)
      actions.push({ node, type: UPDATE_NODE })
    }

    if (action === REMOVE_NODE) {
      actions.push({ node: currentNode, type: REMOVE_NODE })
    }
  }

  return { actions }
}

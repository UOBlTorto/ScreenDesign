import { AIMessage, SystemMessage } from '@langchain/core/messages'
import { createNonStreamingModel } from '../../ai/model.js'
import { z } from 'zod'

export const PlanEditSchema = z.object({
  action: z.enum(['add_node', 'update_node', 'remove_node']),
  type: z.string().describe('节点的物料类型，必须来自可用物料。'),
  id: z
    .string()
    .nullable()
    .describe(
      '要操作的节点的唯一标识，比如用户要修改，那就是要修改节点的 id，删除节点就是要删除节点的 id，新增的时候为 null'
    ),
  prompt: z
    .string()
    .describe('传给节点生成或修改模型的提示词，包括内容、样式和布局要求等。'),
})

export async function handlePlanEdit(state) {
  const materials = state.schema.material.map((item) => {
    return {
      type: item.type,
      name: item.name,
    }
  })
  const nodes = state.page.nodes

  const model = createNonStreamingModel().withStructuredOutput(
    z.object({
      editPlan: z.array(
        PlanEditSchema.extend({
          type: z
            .enum(materials.map((item) => item.type))
            .describe('节点的类型，必须是可用物料中的类型'),
        })
      ),
      message: z
        .string()
        .nullable()
        .describe('给用户的消息，告诉用户缺少哪些信息'),
    }),
    {
      name: 'edit_plan',
      method: 'jsonSchema',
    }
  )

  const result = await model.invoke([
    new SystemMessage(`
      请把用户要求整理成按执行顺序排列的 editPlan，每项只处理一个节点。
      add_node 的 id 为 null。
      update_node 和 remove_node 必须复制已有节点的真实 id 和 type。
      每项 prompt 必须能独立说明该节点的内容、样式和布局要求。
      用户未明确给出的布局、样式，请根据画布尺寸合理编排（例如上下排开、适中字号），不要因此追问。
      只有当用户的目标本身无法理解（例如没说要做什么）时，才返回空 editPlan，并通过 message 一次问清楚；可以完成规划时 message 返回 null。

      示例：用户说“新增两个文本节点，第一个内容为标题，第二个内容为说明”
      应返回：
      {
        "editPlan": [
          { "action": "add_node", "type": "text", "id": null, "prompt": "新增一个文本节点，内容为“标题”，位置靠上，字号较大" },
          { "action": "add_node", "type": "text", "id": null, "prompt": "新增一个文本节点，内容为“说明”，位置在标题下方，字号适中" }
        ],
        "message": null
      }

      可用物料：${JSON.stringify(materials, null, 2)}
      已有节点：${JSON.stringify(nodes, null, 2)}
      selectedNodeIds：${JSON.stringify(state.selectedNodeIds, null, 2)}
      画布尺寸：${JSON.stringify(state.page.canvas, null, 2)}
    `),
    ...state.messages,
  ])

  if (!result.editPlan?.length) {
    return {
      // 清空上一轮可能残留的 editPlan，避免条件边按旧计划路由进 handleEditTask
      editPlan: [],
      messages: [
        new AIMessage(result.message || '请明确要操作的节点和具体要求。'),
      ],
    }
  }

  return {
    editPlan: result.editPlan,
  }
}

import { createChatModel } from '../../ai/model.js'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'

export const handleMessageTask = async state => {
  const bigmodel = createChatModel()
  const { page, selectedNodeIds, messages } = state
  const { nodes, canvas } = page
  const _messages = [...messages]
  const lastMessage = _messages.pop()
  const result = await bigmodel.invoke([
    new SystemMessage('你是一个AI大屏设计器助手，帮助用户设计大屏页面'),
    ..._messages,
    new HumanMessage(`
      用户问题: ${lastMessage.text}
      
      以下是当前设计器的状态:
      ${JSON.stringify({ nodes, canvas, selectedNodeIds }, null, 2)}
      
      其中:
      - nodes: 当前页面所有节点的信息
      - canvas: 当前页面画布的信息
      - selectedNodeIds: 当前选中的节点ID列表
    `),
  ])
  return {
    messages: [result],
  }
}

import {
  MessagesValue,
  StateSchema,
} from '@langchain/langgraph'
import { z } from 'zod'
import { ClassificationSchema } from './classification.js'
import { PlanEditSchema } from './task-nodes/planEdit.js'

export const state = new StateSchema({
  messages: MessagesValue,
  page: z.record(z.string(), z.json()),
  selectedNodeIds: z.array(z.string()),
  schema: z.object({
    material: z.array(z.record(z.string(), z.json())),
    canvas: z.record(z.string(), z.json()),
  }),
  classification: ClassificationSchema,
  editPlan: z.array(PlanEditSchema).default([]),
  actions: z.array(
    z.object({
      type: z.enum(['add_node', 'update_node', 'remove_node']),
      node: z.record(z.string(), z.json()),
    })
  ).default([]),
})

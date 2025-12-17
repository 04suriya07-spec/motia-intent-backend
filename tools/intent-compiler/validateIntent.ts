import { z } from 'zod'
import type { Intent } from './types'

// Zod Schema Definition
const FieldSchema = z.object({
  type: z.enum(['string', 'number', 'boolean']),
  required: z.boolean().optional(),
  unique: z.boolean().optional(),
})

const DatabaseSchema = z.object({
  type: z.literal('mongodb'),
  collection: z.string().min(1),
})

const OperationsSchema = z.object({
  create: z.boolean().optional(),
  get_all: z.boolean().optional(),
  get_by: z.array(z.string()).optional(),
})

const IntentSchema = z.object({
  entity: z.string().min(1),
  database: DatabaseSchema,
  fields: z.record(FieldSchema),
  operations: OperationsSchema,
})

export function validateIntent(intent: any): Intent {
  // 1. Structural Validation
  const result = IntentSchema.safeParse(intent)

  if (!result.success) {
    const errorMsg = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('\n')
    throw new Error(`Intent Validation Failed:\n${errorMsg}`)
  }

  const validIntent = result.data as Intent

  // 2. Logic Validation
  // Check if get_by fields actually exist
  if (validIntent.operations.get_by) {
    for (const field of validIntent.operations.get_by) {
      if (!validIntent.fields[field]) {
        throw new Error(`Validation Error: 'get_by' operation references unknown field '${field}'.`)
      }
    }
  }

  return validIntent
}

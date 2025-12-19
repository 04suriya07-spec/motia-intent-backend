export interface Intent {
  entity: string
  database: DatabaseConfig
  fields: Record<string, FieldDefinition>
  operations: OperationsConfig
  jobs?: JobConfig[]
}

export interface JobConfig {
  name: string
  schedule: string
  description?: string
}

export interface DatabaseConfig {
  type: 'mongodb'
  collection: string
}

export interface FieldDefinition {
  type: 'string' | 'number' | 'boolean'
  required?: boolean
  unique?: boolean
}

export interface OperationsConfig {
  create?: boolean
  get_all?: boolean
  get_by?: string[]
}

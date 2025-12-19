import type { Intent } from './types'

export interface GeneratedFile {
  fileName: string
  content: string
}

export function generateSteps(intent: Intent): GeneratedFile[] {
  const files: GeneratedFile[] = []
  const entityNameLower = intent.entity.toLowerCase()
  const collection = intent.database.collection

  const header = `/**
 * Generated from intent.yaml
 * This is a standard Motia Step and can be edited safely.
 * No runtime dependency on the intent generator.
 */
import { db } from '../db'; // Shared DB connector
`

  // 1. Create Operation
  if (intent.operations.create) {
    const content = `${header}
export const config = {
  name: 'Create${intent.entity}',
  type: 'api',
  path: '/${collection}',
  method: 'POST'
};

export const handler = async (req: any, { emit }: any) => {
  const doc = req.body;
  
  // Basic validation (generated)
  // In a real version, we'd add Zod checks here based on fields
  
  const result = await db.collection('${collection}').insertOne(doc);
  
  return {
    status: 201,
    body: {
      id: result.insertedId,
      ...doc
    }
  };
};
`
    files.push({ fileName: `${entityNameLower}.create.step.ts`, content })
  }

  // 2. Get All Operation
  if (intent.operations.get_all) {
    const content = `${header}
export const config = {
  name: 'Get${intent.entity}List',
  type: 'api',
  path: '/${collection}',
  method: 'GET'
};

export const handler = async (req: any) => {
  const limit = 100; // Safe default
  const docs = await db.collection('${collection}').find({}).limit(limit).toArray();
  
  return {
    status: 200,
    body: docs
  };
};
`
    files.push({ fileName: `${entityNameLower}.list.step.ts`, content })
  }

  // 3. Get By Operation
  if (intent.operations.get_by) {
    for (const field of intent.operations.get_by) {
      const fieldNameCap = field.charAt(0).toUpperCase() + field.slice(1)
      const content = `${header}
export const config = {
  name: 'Get${intent.entity}By${fieldNameCap}',
  type: 'api',
  path: '/${collection}/by-${field}', // e.g. /users/by-email
  method: 'GET'
};

export const handler = async (req: any) => {
  const value = req.query.get('${field}');
  
  if (!value) {
    return { status: 400, body: { error: "Missing '${field}' query param" } };
  }

  const doc = await db.collection('${collection}').findOne({ ${field}: value });
  
  if (!doc) {
    return { status: 404, body: { error: "${intent.entity} not found" } };
  }

  return {
    status: 200,
    body: doc
  };
};
`
      files.push({ fileName: `${entityNameLower}.getBy${fieldNameCap}.step.ts`, content })
    }
  }

  // 4. Background Jobs
  if (intent.jobs && intent.jobs.length > 0) {
    for (const job of intent.jobs) {
      const jobNameCap = job.name.charAt(0).toUpperCase() + job.name.slice(1)
      const content = `${header}
/**
 * Background Job: ${job.description || job.name}
 * Schedule: ${job.schedule}
 */
export const config = {
  name: '${jobNameCap}Job',
  type: 'cron',
  cron: '${job.schedule}',
}

export const handler = async ({ logger }: any) => {
  logger.info('Executing background job: ${job.name}')

  // Demonstration: Pulling sample data to show DB access works in Jobs too
  const result = await db.collection('${collection}').find({}).limit(10).toArray()

  logger.info(\`Job ${job.name} found \${result.length} records to process.\`)

  return { status: 200, body: { ok: true, processed: result.length } }
}
`
      files.push({ fileName: `${entityNameLower}.job.${job.name.toLowerCase()}.step.ts`, content })
    }
  }

  return files
}

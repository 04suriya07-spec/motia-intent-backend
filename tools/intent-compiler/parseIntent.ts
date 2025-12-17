import * as fs from 'fs'
import * as yaml from 'js-yaml'
import type { Intent } from './types'

export function parseIntent(filePath: string): Intent {
  const fileContent = fs.readFileSync(filePath, 'utf8')
  const parsed = yaml.load(fileContent) as any

  // Basic structure check is handled by validator, but we return typed object here
  return parsed as Intent
}

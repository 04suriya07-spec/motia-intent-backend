import * as fs from 'fs'
import * as path from 'path'
import { generateSteps } from './generateSteps'
import { parseIntent } from './parseIntent'
import { validateIntent } from './validateIntent'

function main() {
  const args = process.argv.slice(2)

  // Help
  if (args.includes('--help') || args.length === 0) {
    console.log(`
Motia Intent Generator
----------------------
Usage: intent-gen generate <intent-file> [options]

Options:
  --force     Overwrite existing files
  --dry-run   Show what would be generated without writing to disk

Example:
  intent-gen generate intent.yaml
`)
    return
  }

  // Parse Command
  const command = args[0]
  if (command !== 'generate') {
    console.error(`Unknown command: ${command}`)
    process.exit(1)
  }

  const intentFile = args[1]
  if (!intentFile) {
    console.error('Error: output file required.')
    process.exit(1)
  }

  const force = args.includes('--force')
  const dryRun = args.includes('--dry-run')

  try {
    const absolutIntentPath = path.resolve(process.cwd(), intentFile)
    if (!fs.existsSync(absolutIntentPath)) {
      console.error(`Error: File not found: ${absolutIntentPath}`)
      process.exit(1)
    }

    // 1. Parse & Validate
    console.log(`Reading ${intentFile}...`)
    const rawIntent = parseIntent(absolutIntentPath)
    const intent = validateIntent(rawIntent)

    // 2. Generate
    console.log(`Generating steps for entity: ${intent.entity}...`)
    const files = generateSteps(intent)

    // 3. Write
    const outputDir = path.join(path.dirname(absolutIntentPath), 'generated')
    if (!fs.existsSync(outputDir) && !dryRun) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    for (const file of files) {
      const filePath = path.join(outputDir, file.fileName)

      if (dryRun) {
        console.log(`[DRY-RUN] Will write: ${filePath}`)
        // console.log(file.content); // Optional: verbose mode
        continue
      }

      if (fs.existsSync(filePath) && !force) {
        console.warn(`[SKIP] File exists: ${filePath} (use --force to overwrite)`)
        continue
      }

      fs.writeFileSync(filePath, file.content)
      console.log(`[OK] Created: ${filePath}`)
    }

    if (dryRun) {
      console.log('\nDry run complete. No files changed.')
    } else {
      console.log('\nSuccess! standard Motia steps generated.')
    }
  } catch (err: any) {
    console.error('\nError:', err.message)
    process.exit(1)
  }
}

main()

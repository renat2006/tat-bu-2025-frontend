#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const TARGETS = [
  '.next',
  'out',
  'build',
  'node_modules/.cache',
  'public/_optimized',
]

async function rimraf(target) {
  try {
    await fs.promises.rm(target, { recursive: true, force: true })
  } catch {}
}

async function main() {
  await Promise.all(TARGETS.map((rel) => rimraf(path.join(ROOT, rel))))
  console.log('Cleaned:', TARGETS.join(', '))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUBLIC_DIR = path.resolve(__dirname, '..', 'public');
const INPUT_DIR = PUBLIC_DIR;
const OUTPUT_DIR = path.join(PUBLIC_DIR, '_optimized');

const supportedExt = new Set(['.jpg', '.jpeg', '.png']);

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

async function* walk(dir) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '_optimized') continue;
      yield* walk(fullPath);
    } else {
      yield fullPath;
    }
  }
}

async function processImage(inputPath) {
  const rel = path.relative(INPUT_DIR, inputPath);
  const ext = path.extname(rel).toLowerCase();
  if (!supportedExt.has(ext)) return;

  const base = rel.slice(0, -ext.length);
  const outDir = path.join(OUTPUT_DIR, path.dirname(rel));
  await ensureDir(outDir);

  const src = sharp(inputPath).rotate();

  const webpPath = path.join(outDir, `${path.basename(base)}.webp`);
  const avifPath = path.join(outDir, `${path.basename(base)}.avif`);

  await Promise.all([
    src.clone().webp({ quality: 75 }).toFile(webpPath),
    src.clone().avif({ quality: 50 }).toFile(avifPath),
  ]);

  const stat = await fs.promises.stat(inputPath);
  await fs.promises.utimes(webpPath, stat.atime, stat.mtime);
  await fs.promises.utimes(avifPath, stat.atime, stat.mtime);
}

async function main() {
  await ensureDir(OUTPUT_DIR);
  const tasks = [];
  for await (const file of walk(INPUT_DIR)) {
    tasks.push(processImage(file));
  }
  await Promise.all(tasks);
  console.log('Images optimized to', path.relative(process.cwd(), OUTPUT_DIR));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});



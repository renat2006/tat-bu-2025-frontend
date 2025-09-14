const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

async function main() {
  const srcSvg = path.resolve(__dirname, '..', 'public', 'logo_wbg.svg')
  const outDir = path.resolve(__dirname, '..', 'public', 'icons')
  if (!fs.existsSync(srcSvg)) {
    throw new Error('Source SVG not found: ' + srcSvg)
  }
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir)

  const tasks = [
    { size: 16, name: 'favicon-16.png' },
    { size: 32, name: 'favicon-32.png' },
    { size: 180, name: 'apple-touch-icon-180.png' },
    { size: 192, name: 'icon-192.png' },
    { size: 256, name: 'icon-256.png' },
    { size: 384, name: 'icon-384.png' },
    { size: 512, name: 'icon-512.png' },
  ]

  await Promise.all(
    tasks.map(async ({ size, name }) => {
      const outPath = path.join(outDir, name)
      await sharp(srcSvg)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 },
        })
        .png({ compressionLevel: 9 })
        .toFile(outPath)
    }),
  )
  // Copy a default apple-touch-icon.png at 180
  fs.copyFileSync(
    path.join(outDir, 'apple-touch-icon-180.png'),
    path.join(outDir, 'apple-touch-icon.png'),
  )
  console.log('Icons generated in', outDir)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

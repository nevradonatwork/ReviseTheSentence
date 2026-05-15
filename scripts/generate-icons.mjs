// Generates PWA icons from SVG using sharp (if available) or a simple PNG fallback
import { createCanvas } from 'canvas'
import { writeFileSync } from 'fs'

function generateIcon(size, path) {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')

  // Background
  ctx.fillStyle = '#2563eb'
  const r = size * 0.15
  ctx.beginPath()
  ctx.moveTo(r, 0)
  ctx.lineTo(size - r, 0)
  ctx.quadraticCurveTo(size, 0, size, r)
  ctx.lineTo(size, size - r)
  ctx.quadraticCurveTo(size, size, size - r, size)
  ctx.lineTo(r, size)
  ctx.quadraticCurveTo(0, size, 0, size - r)
  ctx.lineTo(0, r)
  ctx.quadraticCurveTo(0, 0, r, 0)
  ctx.closePath()
  ctx.fill()

  // Pencil emoji
  ctx.font = `${size * 0.55}px serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('✏', size / 2, size / 2 + size * 0.04)

  writeFileSync(path, canvas.toBuffer('image/png'))
  console.log(`Generated ${path}`)
}

generateIcon(192, 'public/icons/icon-192.png')
generateIcon(512, 'public/icons/icon-512.png')

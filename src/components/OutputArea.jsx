import { useState } from 'react'

export function OutputArea({ text }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    if (!text) return
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="panel">
      <div className="panel-label-row">
        <label className="panel-label">Revised sentence</label>
        {text && (
          <button className="btn btn-ghost copy-btn" onClick={handleCopy}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        )}
      </div>
      <div className={`output-box ${!text ? 'output-empty' : ''}`}>
        {text || 'Revised text will appear here…'}
      </div>
    </div>
  )
}

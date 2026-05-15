import { useState, useCallback, useEffect } from 'react'
import { StatusIndicator } from './components/StatusIndicator'
import { ModelLoader } from './components/ModelLoader'
import { InputArea } from './components/InputArea'
import { OutputArea } from './components/OutputArea'
import { useOnlineStatus } from './hooks/useOnlineStatus'
import { loadModel, reviseSentence } from './services/revisionService'

// Model status: 'idle' | 'loading' | 'ready' | 'error'
export default function App() {
  const isOnline = useOnlineStatus()
  const [modelStatus, setModelStatus] = useState('idle')
  const [loadProgress, setLoadProgress] = useState(null)
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [revising, setRevising] = useState(false)
  const [error, setError] = useState('')

  // Auto-load model on mount
  useEffect(() => {
    setModelStatus('loading')
    loadModel((p) => setLoadProgress(p))
      .then(() => {
        setModelStatus('ready')
        setLoadProgress(null)
      })
      .catch((err) => {
        console.error('Model load failed:', err)
        setModelStatus('error')
        setError(err.message)
      })
  }, [])

  const handleRevise = useCallback(async () => {
    if (!input.trim() || modelStatus !== 'ready') return
    setRevising(true)
    setError('')
    try {
      const result = await reviseSentence(input.trim())
      setOutput(result)
    } catch (err) {
      setError('Revision failed: ' + err.message)
    } finally {
      setRevising(false)
    }
  }, [input, modelStatus])

  const isLoading = modelStatus === 'loading'

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <h1 className="app-title">
            <span className="title-icon">✏️</span> Revise The Sentence
          </h1>
          <StatusIndicator isOnline={isOnline} modelStatus={modelStatus} />
        </div>
        <p className="app-subtitle">
          Offline AI-powered English sentence revision — your text never leaves this device.
        </p>
      </header>

      <main className="app-main">
        {isLoading && (
          <ModelLoader progress={loadProgress} />
        )}

        {modelStatus === 'error' && (
          <div className="error-banner">
            <strong>Model failed to load.</strong> {error}
            <br />
            Make sure you are online for the first-time model download, then try reloading.
          </div>
        )}

        <div className="panels">
          <InputArea
            value={input}
            onChange={setInput}
            onRevise={handleRevise}
            disabled={modelStatus !== 'ready' || revising}
            revising={revising}
          />
          <OutputArea text={output} />
        </div>

        {error && modelStatus === 'ready' && (
          <div className="error-banner">{error}</div>
        )}
      </main>

      <footer className="app-footer">
        Powered by&nbsp;
        <a href="https://huggingface.co/Xenova/flan-t5-base" target="_blank" rel="noreferrer">
          Xenova/flan-t5-base
        </a>
        &nbsp;via Transformers.js — runs entirely in your browser.
      </footer>
    </div>
  )
}

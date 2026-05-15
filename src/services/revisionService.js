let worker = null
let pendingCallbacks = new Map()
let callId = 0

function getWorker() {
  if (!worker) {
    worker = new Worker(new URL('../workers/revision.worker.js', import.meta.url), {
      type: 'module',
    })
    worker.addEventListener('message', (event) => {
      const { type, id, payload } = event.data
      const cb = pendingCallbacks.get(id)
      if (!cb) return

      if (type === 'PROGRESS') {
        cb.onProgress?.(payload)
      } else if (type === 'LOAD_DONE') {
        cb.resolve()
        pendingCallbacks.delete(id)
      } else if (type === 'REVISE_DONE') {
        cb.resolve(payload.revised)
        pendingCallbacks.delete(id)
      } else if (type === 'ERROR') {
        cb.reject(new Error(payload))
        pendingCallbacks.delete(id)
      }
    })
  }
  return worker
}

export function loadModel(onProgress) {
  const id = ++callId
  return new Promise((resolve, reject) => {
    pendingCallbacks.set(id, { resolve, reject, onProgress })
    getWorker().postMessage({ type: 'LOAD', id })
  })
}

export function reviseSentence(sentence, onProgress) {
  const id = ++callId
  return new Promise((resolve, reject) => {
    pendingCallbacks.set(id, { resolve, reject, onProgress })
    getWorker().postMessage({ type: 'REVISE', id, payload: { sentence } })
  })
}

import { pipeline, env } from '@huggingface/transformers'

// Allow loading from Hugging Face hub; use browser cache
env.allowLocalModels = false
env.useBrowserCache = true

const MODEL_ID = 'Xenova/flan-t5-base'
const TASK = 'text2text-generation'

let pipe = null

async function loadModel(onProgress) {
  if (pipe) return pipe

  pipe = await pipeline(TASK, MODEL_ID, {
    progress_callback: (progress) => {
      onProgress(progress)
    },
    dtype: 'q8',
  })

  return pipe
}

self.addEventListener('message', async (event) => {
  const { type, id, payload } = event.data

  if (type === 'LOAD') {
    try {
      await loadModel((progress) => {
        self.postMessage({ type: 'PROGRESS', id, payload: progress })
      })
      self.postMessage({ type: 'LOAD_DONE', id })
    } catch (err) {
      self.postMessage({ type: 'ERROR', id, payload: err.message })
    }
    return
  }

  if (type === 'REVISE') {
    try {
      const { sentence } = payload
      const generator = await loadModel((progress) => {
        self.postMessage({ type: 'PROGRESS', id, payload: progress })
      })

      const prompt =
        `Fix all grammar, spelling, punctuation, and capitalization errors in this sentence. ` +
        `Keep the original meaning. Output only the corrected sentence:\n${sentence}`

      const result = await generator(prompt, {
        max_new_tokens: 200,
        do_sample: false,
        num_beams: 5,
        no_repeat_ngram_size: 3,
        repetition_penalty: 1.3,
        early_stopping: true,
      })

      const revised = result[0]?.generated_text ?? sentence
      self.postMessage({ type: 'REVISE_DONE', id, payload: { revised } })
    } catch (err) {
      self.postMessage({ type: 'ERROR', id, payload: err.message })
    }
  }
})

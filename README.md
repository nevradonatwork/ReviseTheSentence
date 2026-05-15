# Revise The Sentence

An offline-first Progressive Web App that revises and corrects English sentences using a local AI model running entirely in the browser. Your text never leaves your device.

## Features

- **100 % offline** after the first model download
- **Local AI** — uses [Xenova/flan-t5-small](https://huggingface.co/Xenova/flan-t5-small) via [Transformers.js](https://github.com/xenova/transformers.js)
- Installable as a PWA on desktop and mobile (Chrome, Edge, Safari, Firefox)
- Input sentence → revised output in seconds
- One-click copy of the result
- Online / offline status indicator

## Tech stack

| Layer | Choice |
|---|---|
| UI framework | React 18 + Vite |
| AI inference | @huggingface/transformers (Transformers.js) |
| Model | Xenova/flan-t5-small (Q8, ~130 MB download) |
| PWA / Service Worker | vite-plugin-pwa (Workbox) |
| Offline caching | Workbox CacheFirst for model files |

## Project structure

```
src/
  components/
    InputArea.jsx        – sentence input + Revise button
    OutputArea.jsx       – revised text + Copy button
    ModelLoader.jsx      – download progress UI
    StatusIndicator.jsx  – online / model-ready badges
  hooks/
    useOnlineStatus.js   – navigator.onLine listener
  services/
    revisionService.js   – Worker message bus (load / revise)
  workers/
    revision.worker.js   – Transformers.js pipeline (runs off main thread)
  App.jsx                – top-level state + layout
  main.jsx               – React entry point
  index.css              – all styles
scripts/
  generate-icons.mjs     – generates public/icons/icon-{192,512}.png
```

## Setup

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Development

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. On first load the browser downloads the model (~130 MB); progress is shown in the UI. Subsequent loads use the cached model — no internet required.

### Production build

```bash
npm run build      # outputs to dist/
npm run preview    # serves dist/ locally
```

Deploy the `dist/` folder to any static host (Netlify, Vercel, GitHub Pages, nginx, etc.).

> **HTTPS required for PWA installation.** Most static hosts provide this automatically.

## PWA installation

1. Open the app in Chrome, Edge, or Safari.
2. Click "Install" in the browser address bar (desktop) or "Add to Home Screen" in the share menu (mobile).
3. The app will appear as a standalone icon and work fully offline after the first launch.

## Model notes

| Property | Value |
|---|---|
| Model | `Xenova/flan-t5-small` |
| Task | `text2text-generation` |
| Quantization | 8-bit (Q8) |
| Download size | ~130 MB (one-time) |
| Runtime | WebAssembly (ONNX Runtime Web) |

The model runs in a Web Worker so the UI stays responsive during inference. Model files are cached in the browser's Cache Storage via the service worker; they persist across sessions and are available completely offline.

### Upgrading the model

To use a larger / higher-quality model edit one line in `src/workers/revision.worker.js`:

```js
const MODEL_ID = 'Xenova/flan-t5-base'   // ~250 MB, noticeably better
// or
const MODEL_ID = 'Xenova/flan-t5-large'  // ~750 MB, best quality
```

## Offline behaviour

| Scenario | Result |
|---|---|
| First visit (online) | App loads; model downloads and caches |
| Subsequent visits (online) | App loads from cache; model from cache |
| Visit while offline | App loads from cache; model from cache |
| First visit while offline | App loads; model unavailable — error shown |

## Privacy

No data is sent anywhere. All processing happens locally:

- The React app is static HTML/JS/CSS served from your host.
- The AI model is downloaded from Hugging Face once and then cached locally.
- Sentence text is processed in a browser Web Worker — it never touches a network socket.

## License

MIT

export function ModelLoader({ progress, onLoad }) {
  const pct = progress?.progress != null ? Math.round(progress.progress) : null
  const name = progress?.file ?? ''

  return (
    <div className="model-loader">
      <p className="loader-headline">
        Loading AI model for the first time — this may take a few minutes.
        <br />
        After the initial download the model is cached and works offline.
      </p>
      {pct != null && (
        <div className="progress-wrap">
          <div className="progress-bar" style={{ width: `${pct}%` }} />
          <span className="progress-label">
            {name && <span className="file-name">{name}</span>}
            {pct}%
          </span>
        </div>
      )}
      {pct == null && (
        <p className="loader-sub">Initialising…</p>
      )}
    </div>
  )
}

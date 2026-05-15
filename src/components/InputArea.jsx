export function InputArea({ value, onChange, onRevise, disabled, revising }) {
  function handleKey(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') onRevise()
  }

  return (
    <div className="panel">
      <label className="panel-label" htmlFor="input-sentence">
        Your sentence
      </label>
      <textarea
        id="input-sentence"
        className="sentence-textarea"
        placeholder="Type or paste an English sentence here…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKey}
        disabled={disabled}
        rows={5}
        spellCheck
      />
      <div className="input-footer">
        <span className="hint">Ctrl + Enter to revise</span>
        <button
          className="btn btn-primary"
          onClick={onRevise}
          disabled={disabled || !value.trim()}
        >
          {revising ? (
            <>
              <span className="spinner" /> Revising…
            </>
          ) : (
            'Revise'
          )}
        </button>
      </div>
    </div>
  )
}

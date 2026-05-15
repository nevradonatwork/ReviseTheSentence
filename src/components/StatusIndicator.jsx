export function StatusIndicator({ isOnline, modelStatus }) {
  return (
    <div className="status-bar">
      <span className={`online-badge ${isOnline ? 'online' : 'offline'}`}>
        <span className="dot" />
        {isOnline ? 'Online' : 'Offline'}
      </span>
      <span className={`model-badge model-${modelStatus}`}>
        {modelStatus === 'idle' && 'Model not loaded'}
        {modelStatus === 'loading' && 'Loading model…'}
        {modelStatus === 'ready' && '✓ Model ready'}
        {modelStatus === 'error' && '✗ Model error'}
      </span>
    </div>
  )
}

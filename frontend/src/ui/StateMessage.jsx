import LoadingSpinner from './LoadingSpinner';

export function StateMessage({
  variant = 'info', // 'error' | 'empty' | 'info'
  title,
  message,
  children,
}) {
  const className =
    variant === 'error'
      ? 'ui-alert ui-alertError'
      : variant === 'empty'
        ? 'ui-alert ui-alertEmpty'
        : 'ui-alert ui-alertInfo';

  return (
    <div className={className} role={variant === 'error' ? 'alert' : 'status'}>
      <div style={{ paddingTop: 1, minWidth: 22 }} aria-hidden="true">
        {variant === 'error' ? '⛔' : variant === 'empty' ? '🧩' : 'ℹ️'}
      </div>
      <div>
        {title ? <strong>{title}</strong> : null}
        {message ? <div style={{ color: 'var(--text2)', fontSize: 13 }}>{message}</div> : null}
        {children}
      </div>
    </div>
  );
}

export function FullOverlayLoading({ children }) {
  return (
    <div className="ui-heatmapOverlay" style={{ flexDirection: 'column', gap: 12 }}>
      <LoadingSpinner size={44} />
      {children}
    </div>
  );
}


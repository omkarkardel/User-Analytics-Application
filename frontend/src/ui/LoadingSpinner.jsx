export default function LoadingSpinner({ size = 40 }) {
  return (
    <div
      aria-label="Loading"
      role="status"
      className="ui-spinner"
      style={{ width: size, height: size }}
    />
  );
}


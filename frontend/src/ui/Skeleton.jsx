export function SkeletonBlock({
  height = 14,
  radius = 12,
  style = {},
}) {
  return (
    <div
      className="ui-skeleton"
      style={{
        height,
        borderRadius: radius,
        ...style,
      }}
    />
  );
}

export function SkeletonRow({
  titleWidth = '55%',
  metaWidth = '30%',
  rowHeight = 14,
}) {
  return (
    <div
      className="ui-row"
      style={{
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 12,
      }}
    >
      <SkeletonBlock height={rowHeight} radius={10} style={{ width: titleWidth }} />
      <SkeletonBlock height={rowHeight} radius={10} style={{ width: metaWidth }} />
    </div>
  );
}


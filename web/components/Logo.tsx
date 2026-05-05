interface Props {
  size?: number;
}

export function Logo({ size = 32 }: Props) {
  const tile = (size - 2) / 2;
  const tiles: { x: number; y: number; color: string }[] = [
    { x: 0, y: 0, color: "var(--neon)" },
    { x: tile + 2, y: 0, color: "var(--violet)" },
    { x: 0, y: tile + 2, color: "var(--amber)" },
    { x: tile + 2, y: tile + 2, color: "var(--hot)" },
  ];

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="Color Dash logo"
      className="inline-block shrink-0"
    >
      <defs>
        <filter id="cd-logo-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {tiles.map((t, i) => (
        <rect
          key={i}
          x={t.x}
          y={t.y}
          width={tile}
          height={tile}
          rx={3}
          ry={3}
          fill={t.color}
          opacity={0.95}
          filter="url(#cd-logo-glow)"
        />
      ))}
    </svg>
  );
}

interface Props {
  width: number;
  height: number;
  radius?: number;
}

export function ShimmerBlock({ width, height, radius = 6 }: Props) {
  return (
    <div className="shimmer" style={{ width, height, borderRadius: radius }} />
  );
}

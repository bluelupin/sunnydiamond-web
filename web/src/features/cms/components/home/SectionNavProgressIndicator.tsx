type SectionNavProgressIndicatorProps = {
  progress: number;
  isActive: boolean;
  isComplete: boolean;
};

const SIZE = 16;
const CENTER = 8;
const RADIUS = 7.5;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const TRACK_COLOR = "#DECAA0";
const ACTIVE_COLOR = "#AB863B";

export function SectionNavProgressIndicator({
  progress,
  isActive,
  isComplete,
}: SectionNavProgressIndicatorProps) {
  const fillProgress = isComplete ? 1 : isActive ? progress : 0;
  const showRing = isActive || isComplete;
  const dashOffset = CIRCUMFERENCE * (1 - fillProgress);

  if (!showRing) {
    return (
      <span
        aria-hidden
        className="box-border size-4 rounded-full border border-[#DECAA0] bg-transparent transition-colors duration-300 group-hover/nav:border-linkGold"
      />
    );
  }

  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="size-4"
    >
      <circle
        cx={CENTER}
        cy={CENTER}
        r={RADIUS}
        fill="none"
        stroke={TRACK_COLOR}
        strokeWidth={1}
      />
      <circle
        cx={CENTER}
        cy={CENTER}
        r={RADIUS}
        fill="none"
        stroke={ACTIVE_COLOR}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={dashOffset}
        transform={`rotate(-90 ${CENTER} ${CENTER})`}
      />
      <circle cx={CENTER} cy={CENTER} r={3} fill={ACTIVE_COLOR} />
    </svg>
  );
}

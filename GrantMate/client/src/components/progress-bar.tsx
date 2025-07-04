interface ProgressBarProps {
  progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">Proposal Progress</span>
        <span className="text-xs text-muted-foreground">{progress}% Complete</span>
      </div>
      <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
        <div
          className={`bg-foreground h-1 transition-all duration-500 ease-out rounded-full ${
            progress > 0 ? 'animate-shimmer' : ''
          } ${progress === 100 ? 'animate-pulse-glow' : ''}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

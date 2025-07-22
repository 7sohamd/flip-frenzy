import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

// Casino-themed Loader with animation
function Loader({ className }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center ${className || ''}`}>
      {/* Animated coin or shimmer */}
      <div className="w-16 h-16 mb-2 animate-spin rounded-full border-4 border-casino-gold border-t-transparent"></div>
      <Skeleton className="w-32 h-4 mb-1" />
      <Skeleton className="w-24 h-4" />
      <span className="text-xs text-casino-gold/80 mt-2 font-retro tracking-wide">Loading...</span>
    </div>
  );
}

export { Skeleton, Loader }

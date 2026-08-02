import { cn } from "@/lib/utils"
import { CircleCheck } from "lucide-react"
import type { OrderTimelineEntry } from "@/types"

interface TimelineProps {
  entries: OrderTimelineEntry[]
  className?: string
}

export function Timeline({ entries, className }: TimelineProps) {
  return (
    <div className={cn("space-y-0", className)}>
      {entries.map((entry, index) => {
        const isLast = index === entries.length - 1
        return (
          <div key={entry.status} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full",
                  entry.completed
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {entry.completed ? (
                  <CircleCheck className="size-4" />
                ) : (
                  <div className="size-2.5 rounded-full bg-current" />
                )}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "min-h-6 w-0.5 flex-1",
                    entry.completed ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
            <div className="pb-6">
              <p
                className={cn(
                  "text-sm font-medium",
                  entry.completed ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {entry.label}
              </p>
              {entry.time && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {entry.time}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { formatPriceShort } from "@/constants/site"

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  icon: LucideIcon
  isCurrency?: boolean
  className?: string
}

export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  isCurrency = false,
  className,
}: StatCardProps) {
  const formattedValue = isCurrency
    ? formatPriceShort(typeof value === "string" ? parseFloat(value) : value)
    : value

  return (
    <div
      className={cn("rounded-2xl border border-border bg-card p-5", className)}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="size-5 text-primary" />
        </div>
      </div>
      <p className="mt-2 text-2xl font-bold">{formattedValue}</p>
      {change !== undefined && (
        <div className="mt-1 flex items-center gap-1">
          {change >= 0 ? (
            <TrendingUp className="size-3.5 text-green-600" />
          ) : (
            <TrendingDown className="size-3.5 text-red-600" />
          )}
          <span
            className={cn(
              "text-xs font-medium",
              change >= 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            )}
          >
            {change > 0 ? "+" : ""}
            {change}%
          </span>
          <span className="text-xs text-muted-foreground">vs last week</span>
        </div>
      )}
    </div>
  )
}

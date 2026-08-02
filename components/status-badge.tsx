import { cn } from "@/lib/utils"
import type { OrderStatus } from "@/types"

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  pending: {
    label: "Pending",
    color:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  preparing: {
    label: "Preparing",
    color:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  },
  ready: {
    label: "Ready",
    color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  },
  picked_up: {
    label: "Picked Up",
    color:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  },
  on_the_way: {
    label: "On The Way",
    color:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
  delivered: {
    label: "Delivered",
    color:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
}

interface StatusBadgeProps {
  status: OrderStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  )
}

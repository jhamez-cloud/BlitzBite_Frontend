import { cn } from "@/lib/utils"

interface QuantitySelectorProps {
  quantity: number
  onIncrease: () => void
  onDecrease: () => void
  min?: number
  max?: number
  size?: "sm" | "md"
  className?: string
}

export function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
  max = 99,
  size = "md",
  className,
}: QuantitySelectorProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-0 rounded-full border border-border",
        className
      )}
    >
      <button
        onClick={onDecrease}
        disabled={quantity <= min}
        className={cn(
          "flex items-center justify-center rounded-l-full transition-colors hover:bg-muted disabled:opacity-50",
          size === "sm" ? "size-7 text-sm" : "size-9"
        )}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span
        className={cn(
          "flex items-center justify-center font-semibold tabular-nums",
          size === "sm" ? "w-7 text-sm" : "w-10"
        )}
      >
        {quantity}
      </span>
      <button
        onClick={onIncrease}
        disabled={quantity >= max}
        className={cn(
          "flex items-center justify-center rounded-r-full transition-colors hover:bg-muted disabled:opacity-50",
          size === "sm" ? "size-7 text-sm" : "size-9"
        )}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  )
}

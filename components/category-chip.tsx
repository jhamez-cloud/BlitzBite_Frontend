import { cn } from "@/lib/utils"

interface CategoryChipProps {
  label: string
  icon?: string
  isActive?: boolean
  onClick?: () => void
  className?: string
}

export function CategoryChip({
  label,
  icon,
  isActive = false,
  onClick,
  className,
}: CategoryChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all",
        isActive
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground",
        className
      )}
    >
      {icon && <span className="text-base">{icon}</span>}
      {label}
    </button>
  )
}

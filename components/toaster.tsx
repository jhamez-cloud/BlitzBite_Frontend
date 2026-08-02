"use client"

import { CircleCheck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex flex-col items-center gap-2 px-4 md:bottom-6">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          aria-live="polite"
          className="pointer-events-auto flex animate-in items-center gap-2.5 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium shadow-lg fade-in-0 slide-in-from-bottom-2"
        >
          <CircleCheck className="size-4 text-primary" />
          {t.message}
        </div>
      ))}
    </div>
  )
}

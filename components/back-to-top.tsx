"use client"

import { ArrowUp } from "lucide-react"
import { useScroll } from "@/hooks/use-scroll"
import { cn } from "@/lib/utils"

export function BackToTop() {
  const { scrollY, scrollToTop } = useScroll()
  const visible = scrollY > 400

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "fixed right-4 bottom-20 z-40 flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-300 hover:scale-110 md:bottom-8",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      )}
      aria-label="Back to top"
    >
      <ArrowUp className="size-5" />
    </button>
  )
}

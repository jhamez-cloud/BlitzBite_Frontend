"use client"

import { useScroll } from "@/hooks/use-scroll"

export function ScrollProgress() {
  const { scrollProgress } = useScroll()

  if (scrollProgress <= 0) return null

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-0.5">
      <div
        className="h-full bg-primary transition-[width] duration-150"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  )
}

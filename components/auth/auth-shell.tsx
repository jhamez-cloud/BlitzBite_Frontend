import Link from "next/link"
import { Zap } from "lucide-react"
import { SITE_NAME } from "@/constants/site"

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-[calc(100svh-4rem)] items-center justify-center overflow-hidden px-4 py-10">
      {/* Blurred decorative backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 size-96 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute -right-24 -bottom-24 size-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute top-1/3 left-1/2 size-72 -translate-x-1/2 rounded-full bg-chart-1/20 blur-3xl" />
        <div className="absolute inset-0 backdrop-blur-2xl" />
      </div>

      <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card/80 p-6 shadow-xl backdrop-blur-xl sm:p-8">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 text-xl font-bold tracking-tight"
        >
          <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Zap className="size-5" />
          </span>
          {SITE_NAME}
        </Link>

        {children}
      </div>
    </div>
  )
}

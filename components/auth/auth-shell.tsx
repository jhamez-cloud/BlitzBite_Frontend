"use client"

import Link from "next/link"
import { Zap } from "lucide-react"
import { SITE_NAME } from "@/constants/site"
import { DEMO_ACCOUNT } from "@/lib/services/auth"

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
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

        <div className="mt-6 text-center">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>

        <div className="mt-6">{children}</div>

        {/* Demo credentials hint */}
        <div className="mt-6 rounded-xl border border-dashed border-border bg-muted/40 p-3 text-center text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">Demo credentials</p>
          <p className="mt-1">
            {DEMO_ACCOUNT.email} · {DEMO_ACCOUNT.password}
          </p>
        </div>
      </div>
    </div>
  )
}

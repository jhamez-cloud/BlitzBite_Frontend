"use client"

import { useState } from "react"
import { TicketPercent, Copy, CircleCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/empty-state"
import { coupons as initialCoupons } from "@/mock-data/coupons"

export default function CouponsPage() {
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const activeCoupons = initialCoupons.filter((c) => !c.isUsed)
  const usedCoupons = initialCoupons.filter((c) => c.isUsed)

  const copyCode = (id: number, code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <h1 className="text-2xl font-bold">My Coupons</h1>

      {activeCoupons.length === 0 && usedCoupons.length === 0 ? (
        <EmptyState
          icon={TicketPercent}
          title="No coupons"
          description="Keep an eye out for promotions and special offers!"
        />
      ) : (
        <>
          {activeCoupons.length > 0 && (
            <div className="mt-6 space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground">
                Available ({activeCoupons.length})
              </h2>
              {activeCoupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                    <TicketPercent className="size-6 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        {coupon.discount}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium">
                      {coupon.description}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Valid until {coupon.validUntil} · Min. order ₵
                      {coupon.minimumOrder}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyCode(coupon.id, coupon.code)}
                    className="shrink-0"
                  >
                    {copiedId === coupon.id ? (
                      <>
                        <CircleCheck className="mr-1 size-3.5" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="mr-1 size-3.5" />
                        {coupon.code}
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}

          {usedCoupons.length > 0 && (
            <div className="mt-8 space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground">
                Used ({usedCoupons.length})
              </h2>
              {usedCoupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 opacity-60"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
                    <TicketPercent className="size-6 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{coupon.description}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Used · {coupon.code}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

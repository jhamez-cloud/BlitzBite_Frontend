"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { Promotion } from "@/types"

interface PromotionsCarouselProps {
  promotions: Promotion[]
}

export function PromotionsCarousel({ promotions }: PromotionsCarouselProps) {
  const [current, setCurrent] = useState(0)

  const next = () => setCurrent((c) => (c + 1) % promotions.length)
  const prev = () =>
    setCurrent((c) => (c - 1 + promotions.length) % promotions.length)

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 className="text-xl font-bold sm:text-2xl">Deals & Promotions</h2>
      <div className="relative mt-4">
        <div className="overflow-hidden rounded-2xl">
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {promotions.map((promo) => (
              <div key={promo.id} className="w-full shrink-0">
                <div
                  className={cn(
                    "relative flex min-h-[200px] items-center overflow-hidden rounded-2xl bg-gradient-to-r p-6 sm:p-8",
                    promo.backgroundColor
                  )}
                >
                  <div className="relative z-10 max-w-md">
                    <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-sm font-semibold text-white">
                      {promo.discount}
                    </span>
                    <h3 className="mt-3 text-2xl font-bold text-white">
                      {promo.title}
                    </h3>
                    <p className="mt-2 text-sm text-white/80">
                      {promo.description}
                    </p>
                    {promo.code && (
                      <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-2 font-mono text-sm font-semibold text-white">
                        {promo.code}
                      </div>
                    )}
                  </div>
                  <div className="absolute -top-8 -right-8 size-48 opacity-20">
                    <Image
                      src={promo.image}
                      alt=""
                      fill
                      className="rounded-full object-cover"
                      sizes="192px"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button
          variant="outline"
          size="icon-sm"
          className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-background/80 shadow-lg backdrop-blur-sm"
          onClick={prev}
          aria-label="Previous promotion"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-background/80 shadow-lg backdrop-blur-sm"
          onClick={next}
          aria-label="Next promotion"
        >
          <ChevronRight className="size-4" />
        </Button>

        <div className="mt-3 flex justify-center gap-1.5">
          {promotions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === current
                  ? "w-6 bg-primary"
                  : "w-1.5 bg-muted-foreground/30"
              )}
              aria-label={`Go to promotion ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

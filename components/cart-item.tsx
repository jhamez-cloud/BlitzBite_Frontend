"use client"

import Image from "next/image"
import { Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { QuantitySelector } from "@/components/quantity-selector"
import { formatPriceShort } from "@/constants/site"
import type { CartItem as CartItemType } from "@/types"

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (quantity: number) => void
  onRemove: () => void
  className?: string
}

export function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  className,
}: CartItemProps) {
  const itemTotal =
    (item.price +
      item.selectedAddons.reduce((sum, addon) => sum + addon.price, 0)) *
    item.quantity

  return (
    <div className={cn("flex gap-3 py-3", className)}>
      <div className="relative size-16 shrink-0 overflow-hidden rounded-xl">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold">{item.name}</h4>
            {item.selectedAddons.length > 0 && (
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                + {item.selectedAddons.map((a) => a.name).join(", ")}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onRemove}
            aria-label={`Remove ${item.name}`}
          >
            <Trash2 className="size-3.5 text-muted-foreground" />
          </Button>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <QuantitySelector
            quantity={item.quantity}
            onIncrease={() => onUpdateQuantity(item.quantity + 1)}
            onDecrease={() => onUpdateQuantity(item.quantity - 1)}
            size="sm"
          />
          <span className="text-sm font-semibold">
            {formatPriceShort(itemTotal)}
          </span>
        </div>
      </div>
    </div>
  )
}

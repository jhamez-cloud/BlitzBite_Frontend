"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Plus, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { QuantitySelector } from "@/components/quantity-selector"
import { useCart } from "@/hooks/use-cart"
import { formatPriceShort } from "@/constants/site"
import type { MenuItem, Addon } from "@/types"

interface MenuItemModalProps {
  item: MenuItem
  restaurantId: number
  onClose: () => void
}

export function MenuItemModal({
  item,
  restaurantId,
  onClose,
}: MenuItemModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([])
  const [notes, setNotes] = useState("")
  const { addItem } = useCart()

  const toggleAddon = (addon: Addon) => {
    setSelectedAddons((prev) =>
      prev.find((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon]
    )
  }

  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0)
  const itemTotal = (item.price + addonsTotal) * quantity

  const handleAddToCart = () => {
    addItem({
      menuItemId: item.id,
      restaurantId,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity,
      selectedAddons,
      specialInstructions: notes || undefined,
    })
    onClose()
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-x-4 bottom-4 top-auto z-50 max-h-[85vh] overflow-y-auto rounded-2xl bg-background shadow-2xl sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-full sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2">
        <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 512px"
          />
          <button
            onClick={onClose}
            className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="p-5">
          <h2 className="text-xl font-bold">{item.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {item.description}
          </p>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-lg font-bold text-primary">
              {formatPriceShort(item.price)}
            </span>
            {item.calories > 0 && (
              <span className="text-sm text-muted-foreground">
                {item.calories} cal
              </span>
            )}
          </div>

          {item.addons.length > 0 && (
            <div className="mt-5">
              <h3 className="text-sm font-semibold">Add extras</h3>
              <div className="mt-2 space-y-2">
                {item.addons.map((addon) => {
                  const isSelected = selectedAddons.some(
                    (a) => a.id === addon.id
                  )
                  return (
                    <button
                      key={addon.id}
                      onClick={() => toggleAddon(addon)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl border p-3 text-sm transition-colors",
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <span className="font-medium">{addon.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          +{formatPriceShort(addon.price)}
                        </span>
                        <div
                          className={cn(
                            "flex size-5 items-center justify-center rounded-full border-2 transition-colors",
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground/30"
                          )}
                        >
                          {isSelected && <Plus className="size-3" />}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <div className="mt-5">
            <h3 className="text-sm font-semibold">Special instructions</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requests? (e.g., no onions)"
              className="mt-2 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              rows={2}
            />
          </div>

          <div className="mt-5 flex items-center gap-4">
            <QuantitySelector
              quantity={quantity}
              onIncrease={() => setQuantity((q) => q + 1)}
              onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
            />
            <Button
              onClick={handleAddToCart}
              className="flex-1"
              size="lg"
              disabled={!item.available}
            >
              Add to Cart · {formatPriceShort(itemTotal)}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

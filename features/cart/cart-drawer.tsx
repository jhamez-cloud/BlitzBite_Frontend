"use client"

import { ShoppingCart, Trash2, ArrowRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CartItem } from "@/components/cart-item"
import { EmptyState } from "@/components/empty-state"
import { useCart } from "@/hooks/use-cart"
import { formatPriceShort } from "@/constants/site"

interface CartDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, clearCart, subtotal, itemCount } =
    useCart()

  const deliveryFee = items.length > 0 ? 8 : 0
  const total = subtotal + deliveryFee

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => onOpenChange(false)}
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-background shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="size-5" />
            <h2 className="text-lg font-semibold">Your Cart</h2>
            {itemCount > 0 && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                {itemCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="mr-1 size-3.5" />
                Clear
              </Button>
            )}
            <button
              onClick={() => onOpenChange(false)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Close
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <EmptyState
              icon={ShoppingCart}
              title="Your cart is empty"
              description="Add items from a restaurant to get started"
              actionLabel="Browse Restaurants"
              onAction={() => onOpenChange(false)}
            />
          ) : (
            <div className="divide-y divide-border">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={(qty) => {
                    if (qty < 1) {
                      removeItem(item.id)
                    } else {
                      updateQuantity(item.id, qty)
                    }
                  }}
                  onRemove={() => removeItem(item.id)}
                />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPriceShort(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span>{formatPriceShort(deliveryFee)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
                <span>Total</span>
                <span>{formatPriceShort(total)}</span>
              </div>
            </div>
            <Link href="/checkout" onClick={() => onOpenChange(false)}>
              <Button className="mt-4 w-full" size="lg">
                Checkout
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  )
}

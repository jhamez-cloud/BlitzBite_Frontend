"use client"

import Image from "next/image"
import { MapPin, Phone, Clock3 } from "lucide-react"
import { Timeline } from "@/components/timeline"
import { StatusBadge } from "@/components/status-badge"
import { formatPriceShort } from "@/constants/site"
import type { Order } from "@/types"

interface OrderTrackingClientProps {
  order: Order
}

export function OrderTrackingClient({ order }: OrderTrackingClientProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Order #{order.id}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {order.restaurantName}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock3 className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Estimated arrival</span>
              </div>
              <span className="font-semibold">
                {new Date(order.estimatedDelivery).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold">Order Progress</h3>
              <div className="mt-4">
                <Timeline entries={order.timeline} />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 p-12">
            <div className="text-center">
              <MapPin className="mx-auto size-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Live map tracking coming soon
              </p>
            </div>
          </div>

          {order.courier && (
            <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
              <div className="relative size-12 overflow-hidden rounded-full">
                <Image
                  src={order.courier.avatar}
                  alt={order.courier.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{order.courier.name}</p>
                <p className="text-sm text-muted-foreground">
                  {order.courier.vehicle} · ★ {order.courier.rating}
                </p>
              </div>
              <a
                href={`tel:${order.courier.phone}`}
                className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary"
              >
                <Phone className="size-4" />
              </a>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-4">
            <h3 className="font-semibold">Order Summary</h3>
            <div className="mt-3 space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <span>{formatPriceShort(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-1.5 border-t border-border pt-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPriceShort(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span>{formatPriceShort(order.deliveryFee)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatPriceShort(order.discount)}</span>
                </div>
              )}
              {order.tip > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tip</span>
                  <span>{formatPriceShort(order.tip)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-border pt-2 font-semibold">
                <span>Total</span>
                <span>{formatPriceShort(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <h3 className="font-semibold">Delivery Details</h3>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {order.deliveryAddress}
                </span>
              </div>
              <p className="text-muted-foreground">
                Payment: {order.paymentMethod}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

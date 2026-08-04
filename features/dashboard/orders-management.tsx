"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import {
  Package,
  Clock3,
  CircleDollarSign,
  ReceiptText,
  Search,
  ChevronDown,
  Eye,
  EyeOff,
  MapPin,
  Banknote,
  Timer,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { StatCard } from "@/components/stat-card"
import { StatusBadge } from "@/components/status-badge"
import { Timeline } from "@/components/timeline"
import { PageHeader } from "@/components/dashboard/page-header"
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog"
import { inputClass } from "@/components/dashboard/form-field"
import { useDashboard } from "@/features/dashboard/dashboard-store"
import { useToast } from "@/hooks/use-toast"
import { formatPriceShort } from "@/constants/site"
import type { Order, OrderStatus } from "@/types"

const STATUS_FILTERS: { key: OrderStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "preparing", label: "Preparing" },
  { key: "ready", label: "Ready" },
  { key: "picked_up", label: "Picked Up" },
  { key: "on_the_way", label: "On The Way" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
]

const STATUS_OPTIONS: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "picked_up",
  "on_the_way",
  "delivered",
  "cancelled",
]

export function OrdersManagement() {
  const { myOrders, updateOrderStatus, cancelOrder } = useDashboard()
  const { toast } = useToast()

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all")
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [cancelling, setCancelling] = useState<Order | null>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return myOrders
      .filter((o) => {
        if (statusFilter !== "all" && o.status !== statusFilter) return false
        if (!q) return true
        return (
          String(o.id).includes(q) ||
          o.restaurantName.toLowerCase().includes(q) ||
          o.deliveryAddress.toLowerCase().includes(q) ||
          o.paymentMethod.toLowerCase().includes(q)
        )
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
  }, [myOrders, search, statusFilter])

  const stats = useMemo(() => {
    const active = myOrders.filter(
      (o) => o.status !== "delivered" && o.status !== "cancelled"
    )
    const settled = myOrders.filter((o) => o.status !== "cancelled")
    const revenue = settled.reduce((sum, o) => sum + o.total, 0)
    return {
      total: myOrders.length,
      active: active.length,
      revenue,
      avg: settled.length ? revenue / settled.length : 0,
    }
  }, [myOrders])

  const countFor = (key: OrderStatus | "all") =>
    key === "all"
      ? myOrders.length
      : myOrders.filter((o) => o.status === key).length

  const handleStatus = (order: Order, status: OrderStatus) => {
    if (status === order.status) return
    updateOrderStatus(order.id, status)
    toast(`Order #${order.id} → ${status.replace(/_/g, " ")}`)
  }

  const handleCancel = () => {
    if (!cancelling) return
    cancelOrder(cancelling.id)
    toast(`Order #${cancelling.id} cancelled`)
    setCancelling(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        subtitle="Orders for your restaurant — update statuses and keep customers in the loop."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Orders" value={stats.total} icon={Package} />
        <StatCard title="Active Orders" value={stats.active} icon={Clock3} />
        <StatCard
          title="Revenue"
          value={stats.revenue}
          icon={CircleDollarSign}
          isCurrency
        />
        <StatCard
          title="Avg Order Value"
          value={stats.avg}
          icon={ReceiptText}
          isCurrency
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order id, restaurant, address..."
            className={cn(inputClass, "py-2.5 pr-4 pl-10")}
          />
        </div>
      </div>

      <div className="flex scrollbar-none gap-2 overflow-x-auto pb-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setStatusFilter(f.key)}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all",
              statusFilter === f.key
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
            )}
          >
            {f.label}
            <span className="text-xs opacity-70">{countFor(f.key)}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card/50 px-4 py-16 text-center">
          <Package className="size-8 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium">No orders found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <div
              key={order.id}
              className="overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="flex flex-wrap items-center gap-4 p-4">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={order.restaurantLogo}
                    alt={order.restaurantName}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">#{order.id}</p>
                    <span className="truncate text-sm text-muted-foreground">
                      {order.restaurantName}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleString([], {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}{" "}
                    · {order.items.length} item
                    {order.items.length !== 1 ? "s" : ""} ·{" "}
                    {order.deliveryAddress}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold">
                    {formatPriceShort(order.total)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {order.paymentMethod}
                  </p>
                </div>

                <div className="flex w-full items-center gap-2 sm:w-auto">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatus(order, e.target.value as OrderStatus)
                    }
                    disabled={order.status === "cancelled"}
                    className={cn(
                      inputClass,
                      "w-auto flex-1 py-2 text-xs disabled:opacity-50 sm:flex-none"
                    )}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() =>
                      setExpandedId(expandedId === order.id ? null : order.id)
                    }
                    aria-label="Toggle details"
                    className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {expandedId === order.id ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>

                  {order.status !== "cancelled" &&
                    order.status !== "delivered" && (
                      <button
                        onClick={() => setCancelling(order)}
                        className="flex shrink-0 items-center gap-1 rounded-xl border border-destructive/30 px-3 py-2 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
                      >
                        Cancel
                      </button>
                    )}
                </div>
              </div>

              <AnimatePresence initial={false}>
                {expandedId === order.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-border"
                  >
                    <div className="grid gap-6 bg-muted/30 p-4 sm:p-5 lg:grid-cols-2">
                      <div>
                        <h4 className="text-sm font-semibold">
                          Order progress
                        </h4>
                        <div className="mt-4">
                          <Timeline entries={order.timeline} />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold">Items</h4>
                          <div className="mt-2 space-y-1.5">
                            {order.items.map((item, i) => (
                              <div
                                key={i}
                                className="flex items-start justify-between gap-3 text-sm"
                              >
                                <span className="text-muted-foreground">
                                  {item.quantity}x {item.name}
                                  {item.addons.length > 0 && (
                                    <span className="text-xs text-muted-foreground/70">
                                      {" "}
                                      + {item.addons.join(", ")}
                                    </span>
                                  )}
                                </span>
                                <span className="shrink-0 font-medium">
                                  {formatPriceShort(item.price * item.quantity)}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="mt-3 space-y-1 border-t border-border pt-3 text-sm">
                            <div className="flex justify-between text-muted-foreground">
                              <span>Subtotal</span>
                              <span>{formatPriceShort(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                              <span>Delivery fee</span>
                              <span>{formatPriceShort(order.deliveryFee)}</span>
                            </div>
                            {order.discount > 0 && (
                              <div className="flex justify-between text-green-600">
                                <span>Discount</span>
                                <span>-{formatPriceShort(order.discount)}</span>
                              </div>
                            )}
                            <div className="flex justify-between font-semibold">
                              <span>Total</span>
                              <span>{formatPriceShort(order.total)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1.5 text-sm">
                          <p className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="size-4 shrink-0" />
                            {order.deliveryAddress}
                          </p>
                          <p className="flex items-center gap-2 text-muted-foreground">
                            <Banknote className="size-4 shrink-0" />
                            {order.paymentMethod}
                          </p>
                          <p className="flex items-center gap-2 text-muted-foreground">
                            <Timer className="size-4 shrink-0" />
                            Est. delivery{" "}
                            {new Date(
                              order.estimatedDelivery
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>

                        {order.courier && (
                          <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
                            <div className="relative size-9 overflow-hidden rounded-full">
                              <Image
                                src={order.courier.avatar}
                                alt={order.courier.name}
                                fill
                                className="object-cover"
                                sizes="36px"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium">
                                {order.courier.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {order.courier.vehicle} · ★{" "}
                                {order.courier.rating}
                              </p>
                            </div>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <ChevronDown className="size-3" />
                              {order.courier.phone}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(cancelling)}
        onClose={() => setCancelling(null)}
        onConfirm={handleCancel}
        title={`Cancel order #${cancelling?.id ?? ""}?`}
        description="The customer will be notified and the payment refunded to their wallet. This action cannot be undone."
        confirmLabel="Cancel order"
      />
    </div>
  )
}

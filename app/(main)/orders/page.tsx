import Link from "next/link"
import Image from "next/image"
import { ClipboardList, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/status-badge"
import { EmptyState } from "@/components/empty-state"
import { formatPriceShort } from "@/constants/site"
import { getOrders } from "@/lib/services/order"

export const metadata = { title: "Orders" }

export default async function OrdersPage() {
  const orders = await getOrders()

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <EmptyState
          icon={ClipboardList}
          title="No orders yet"
          description="When you place an order, it will appear here."
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <h1 className="text-2xl font-bold">My Orders</h1>
      <div className="mt-6 space-y-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/orders/${order.id}`}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-shadow hover:shadow-md"
          >
            <div className="relative size-14 shrink-0 overflow-hidden rounded-xl">
              <Image
                src={order.restaurantLogo}
                alt={order.restaurantName}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="truncate font-semibold">
                  {order.restaurantName}
                </h3>
                <StatusBadge status={order.status} />
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Order #{order.id} ·{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-sm font-semibold">
                  {formatPriceShort(order.total)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {order.items.length} item
                  {order.items.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

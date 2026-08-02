import Image from "next/image"
import { Package, DollarSign, Users, Star } from "lucide-react"
import { StatCard } from "@/components/stat-card"
import { StatusBadge } from "@/components/status-badge"
import { formatPriceShort } from "@/constants/site"
import {
  getDashboardStats,
  getRevenueData,
  getOrdersData,
  getTopRestaurants,
  getTopMeals,
  getTopCustomers,
} from "@/lib/services/dashboard"
import { getOrders } from "@/lib/services/order"
import { getReviews } from "@/lib/services/review"

export const metadata = { title: "Dashboard" }

export default async function DashboardPage() {
  const [
    stats,
    revenueData,
    ordersData,
    topRestaurants,
    topMeals,
    topCustomers,
    orders,
    reviews,
  ] = await Promise.all([
    getDashboardStats(),
    getRevenueData(),
    getOrdersData(),
    getTopRestaurants(),
    getTopMeals(),
    getTopCustomers(),
    getOrders(),
    getReviews(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back. Here&apos;s what&apos;s happening.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          change={stats.ordersChange}
          icon={Package}
        />
        <StatCard
          title="Revenue"
          value={stats.totalRevenue}
          change={stats.revenueChange}
          icon={DollarSign}
          isCurrency
        />
        <StatCard
          title="Customers"
          value={stats.totalCustomers}
          change={stats.customersChange}
          icon={Users}
        />
        <StatCard
          title="Avg Rating"
          value={stats.averageRating}
          change={stats.ratingChange}
          icon={Star}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="font-semibold">Revenue (This Week)</h3>
          <div className="mt-4 space-y-2">
            {revenueData.map((d) => (
              <div key={d.label} className="flex items-center gap-3">
                <span className="w-8 text-xs text-muted-foreground">
                  {d.label}
                </span>
                <div className="h-6 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary/80 transition-all"
                    style={{
                      width: `${(d.value / 20000) * 100}%`,
                    }}
                  />
                </div>
                <span className="w-16 text-right text-xs font-medium">
                  {formatPriceShort(d.value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="font-semibold">Orders (This Week)</h3>
          <div className="mt-4 space-y-2">
            {ordersData.map((d) => (
              <div key={d.label} className="flex items-center gap-3">
                <span className="w-8 text-xs text-muted-foreground">
                  {d.label}
                </span>
                <div className="h-6 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-green-500/80 transition-all"
                    style={{
                      width: `${(d.value / 250) * 100}%`,
                    }}
                  />
                </div>
                <span className="w-10 text-right text-xs font-medium">
                  {d.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="font-semibold">Top Restaurants</h3>
          <div className="mt-4 space-y-3">
            {topRestaurants.map((r, i) => (
              <div key={r.id} className="flex items-center gap-3">
                <span className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                  {i + 1}
                </span>
                <div className="relative size-8 overflow-hidden rounded-lg">
                  <Image
                    src={r.image}
                    alt={r.name}
                    fill
                    className="object-cover"
                    sizes="32px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{r.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">
                    {formatPriceShort(r.revenue)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {r.orders} orders
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="font-semibold">Top Customers</h3>
          <div className="mt-4 space-y-3">
            {topCustomers.map((c, i) => (
              <div key={c.id} className="flex items-center gap-3">
                <span className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                  {i + 1}
                </span>
                <div className="relative size-8 overflow-hidden rounded-full">
                  <Image
                    src={c.avatar}
                    alt={c.name}
                    fill
                    className="object-cover"
                    sizes="32px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{c.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">
                    {formatPriceShort(c.totalSpent)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {c.orders} orders
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="font-semibold">Latest Orders</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pr-4 pb-3 font-medium">Order</th>
                <th className="pr-4 pb-3 font-medium">Restaurant</th>
                <th className="pr-4 pb-3 font-medium">Status</th>
                <th className="pr-4 pb-3 font-medium">Date</th>
                <th className="pb-3 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="py-3 pr-4 font-medium">#{order.id}</td>
                  <td className="py-3 pr-4">{order.restaurantName}</td>
                  <td className="py-3 pr-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 text-right font-medium">
                    {formatPriceShort(order.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

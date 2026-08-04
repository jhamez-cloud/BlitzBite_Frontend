"use client"

import { useMemo } from "react"
import Image from "next/image"
import {
  Package,
  CircleDollarSign,
  ReceiptText,
  Star,
  Flame,
  ChartNoAxesColumn,
  Users,
} from "lucide-react"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import { StatCard } from "@/components/stat-card"
import { PageHeader } from "@/components/dashboard/page-header"
import { useDashboard } from "@/features/dashboard/dashboard-store"
import { formatPriceShort } from "@/constants/site"
import {
  dashboardStats,
  revenueData,
  ordersData,
  topCustomers,
} from "@/mock-data/dashboard"

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

function PriceTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-border bg-popover px-3 py-2 text-xs shadow-lg">
      <p className="font-medium">{label}</p>
      <p className="mt-0.5 font-semibold">
        {formatPriceShort(payload[0].value)}
      </p>
    </div>
  )
}

function NumberTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-border bg-popover px-3 py-2 text-xs shadow-lg">
      <p className="font-medium">{label}</p>
      <p className="mt-0.5 font-semibold">{payload[0].value}</p>
    </div>
  )
}

function RankBar({
  item,
  index,
  max,
  isCurrency = true,
  detail,
}: {
  item: { name: string; value: number }
  index: number
  max: number
  isCurrency?: boolean
  detail?: string
}) {
  const color = CHART_COLORS[index % CHART_COLORS.length]
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="truncate font-medium">{item.name}</span>
        <span className="ml-3 shrink-0 font-semibold">
          {isCurrency ? formatPriceShort(item.value) : item.value}
          {detail && (
            <span className="ml-1.5 text-xs font-normal text-muted-foreground">
              {detail}
            </span>
          )}
        </span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${max > 0 ? (item.value / max) * 100 : 0}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  )
}

export function AnalyticsPanel() {
  const { myOrders, myReviews, ownerRestaurant } = useDashboard()

  const live = useMemo(() => {
    const settled = myOrders.filter((o) => o.status !== "cancelled")
    const revenue = settled.reduce((s, o) => s + o.total, 0)
    const avg = settled.length ? revenue / settled.length : 0
    const rating =
      myReviews.length > 0
        ? myReviews.reduce((s, r) => s + r.rating, 0) / myReviews.length
        : 0
    return { totalOrders: myOrders.length, revenue, avg, rating }
  }, [myOrders, myReviews])

  const topMeals = useMemo(() => {
    const map = new Map<
      string,
      { name: string; revenue: number; orders: number }
    >()
    for (const order of myOrders) {
      for (const item of order.items) {
        const current = map.get(item.name) ?? {
          name: item.name,
          revenue: 0,
          orders: 0,
        }
        current.revenue += item.price * item.quantity
        current.orders += 1
        map.set(item.name, current)
      }
    }
    return [...map.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 5)
  }, [myOrders])

  const statusBreakdown = useMemo(() => {
    const active = myOrders.filter(
      (o) => o.status !== "delivered" && o.status !== "cancelled"
    ).length
    const delivered = myOrders.filter((o) => o.status === "delivered").length
    const cancelled = myOrders.filter((o) => o.status === "cancelled").length
    return [
      { name: "Delivered", value: delivered },
      { name: "Active", value: active },
      { name: "Cancelled", value: cancelled },
    ]
  }, [myOrders])

  const maxMealRevenue = useMemo(
    () => (topMeals.length ? Math.max(...topMeals.map((m) => m.revenue)) : 0),
    [topMeals]
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        subtitle={`Performance for ${ownerRestaurant.name} — scoped to your restaurant.`}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Orders"
          value={live.totalOrders}
          change={dashboardStats.ordersChange}
          icon={Package}
        />
        <StatCard
          title="Revenue"
          value={live.revenue}
          change={dashboardStats.revenueChange}
          icon={CircleDollarSign}
          isCurrency
        />
        <StatCard
          title="Avg Order Value"
          value={live.avg}
          icon={ReceiptText}
          isCurrency
        />
        <StatCard
          title="Avg Rating"
          value={live.rating > 0 ? live.rating.toFixed(1) : "—"}
          change={live.rating > 0 ? dashboardStats.ratingChange : undefined}
          icon={Star}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Revenue</h3>
              <p className="text-xs text-muted-foreground">This week</p>
            </div>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              {formatPriceShort(revenueData.reduce((s, d) => s + d.value, 0))}
            </span>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ left: 0, right: 4 }}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--primary)"
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--primary)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  width={44}
                  tickFormatter={(v: number) =>
                    v >= 1000 ? `${Math.round(v / 1000)}k` : String(v)
                  }
                />
                <Tooltip
                  content={<PriceTooltip />}
                  cursor={{ stroke: "var(--border)" }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--primary)"
                  strokeWidth={2.5}
                  fill="url(#revenueFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Orders</h3>
              <p className="text-xs text-muted-foreground">This week</p>
            </div>
            <span className="rounded-full bg-chart-1/10 px-2.5 py-1 text-xs font-semibold text-chart-1">
              {ordersData.reduce((s, d) => s + d.value, 0)} orders
            </span>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ordersData} margin={{ left: 0, right: 4 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />
                <Tooltip
                  content={<NumberTooltip />}
                  cursor={{ fill: "var(--border)", opacity: 0.4 }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={36}>
                  {ordersData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={CHART_COLORS[i % CHART_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <Flame className="size-4 text-chart-2" />
            <h3 className="font-semibold">Top Meals</h3>
          </div>
          {topMeals.length === 0 ? (
            <p className="mt-4 rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No orders yet — top meals will appear here.
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {topMeals.map((meal, i) => (
                <RankBar
                  key={meal.name}
                  item={{ name: meal.name, value: meal.revenue }}
                  index={i}
                  max={maxMealRevenue}
                  detail={`${meal.orders} order${meal.orders !== 1 ? "s" : ""}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <ChartNoAxesColumn className="size-4 text-chart-3" />
            <h3 className="font-semibold">Order Status</h3>
          </div>
          <div className="relative mt-2 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusBreakdown}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {statusBreakdown.map((entry, i) => (
                    <Cell
                      key={entry.name}
                      fill={CHART_COLORS[i % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<NumberTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-2xl font-bold">{myOrders.length}</p>
              <p className="text-xs text-muted-foreground">orders</p>
            </div>
          </div>
          <div className="mt-2 space-y-1.5">
            {statusBreakdown.map((s, i) => (
              <div key={s.name} className="flex items-center gap-2 text-sm">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{
                    backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                  }}
                />
                <span className="flex-1 text-muted-foreground">{s.name}</span>
                <span className="font-medium">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <Users className="size-4 text-chart-4" />
            <h3 className="font-semibold">Top Customers</h3>
          </div>
          <div className="mt-4 space-y-3">
            {topCustomers.slice(0, 5).map((customer, i) => (
              <div key={customer.id} className="flex items-center gap-3">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold">
                  {i + 1}
                </span>
                <div className="relative size-9 shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={customer.avatar}
                    alt={customer.name}
                    fill
                    className="object-cover"
                    sizes="36px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {customer.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {customer.orders} orders
                  </p>
                </div>
                <span className="shrink-0 text-sm font-semibold">
                  {formatPriceShort(customer.totalSpent)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

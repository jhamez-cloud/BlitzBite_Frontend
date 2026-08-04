"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import {
  Users,
  UserCheck,
  UserX,
  CircleDollarSign,
  Search,
  Eye,
  Ban,
  Trash2,
  MapPin,
  Phone,
  CalendarDays,
  Heart,
  ShoppingBag,
  ShieldCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { StatCard } from "@/components/stat-card"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/dashboard/page-header"
import { Modal } from "@/components/dashboard/modal"
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog"
import { inputClass } from "@/components/dashboard/form-field"
import { useDashboard } from "@/features/dashboard/dashboard-store"
import { useToast } from "@/hooks/use-toast"
import { formatPriceShort } from "@/constants/site"
import type { DashboardCustomer } from "@/types"

type StatusFilter = "all" | "active" | "suspended"

export function CustomersManagement() {
  const { customers, restaurants, toggleCustomerStatus, deleteCustomer } =
    useDashboard()
  const { toast } = useToast()

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [viewing, setViewing] = useState<DashboardCustomer | null>(null)
  const [deleting, setDeleting] = useState<DashboardCustomer | null>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return customers.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false
      if (!q) return true
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q)
      )
    })
  }, [customers, search, statusFilter])

  const stats = useMemo(() => {
    const active = customers.filter((c) => c.status === "active").length
    const suspended = customers.length - active
    const spent = customers.reduce((s, c) => s + c.totalSpent, 0)
    return { total: customers.length, active, suspended, spent }
  }, [customers])

  const restaurantName = (id: number) =>
    restaurants.find((r) => r.id === id)?.name ?? `Restaurant #${id}`

  const handleDelete = () => {
    if (!deleting) return
    deleteCustomer(deleting.id)
    toast(`${deleting.name}'s account deleted`)
    setDeleting(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        subtitle="View your customer base and manage accounts."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Customers" value={stats.total} icon={Users} />
        <StatCard title="Active" value={stats.active} icon={UserCheck} />
        <StatCard title="Suspended" value={stats.suspended} icon={UserX} />
        <StatCard
          title="Total Spent"
          value={stats.spent}
          icon={CircleDollarSign}
          isCurrency
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, location..."
            className={cn(inputClass, "py-2.5 pr-4 pl-10")}
          />
        </div>

        <div className="flex gap-1 rounded-full border border-border bg-card p-1">
          {(["all", "active", "suspended"] as StatusFilter[]).map((key) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors",
                statusFilter === key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card/50 px-4 py-16 text-center">
          <Users className="size-8 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium">No customers found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((customer) => (
            <div
              key={customer.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-4"
            >
              <div className="relative size-11 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={customer.avatar}
                  alt={customer.name}
                  fill
                  className="object-cover"
                  sizes="44px"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{customer.name}</p>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                      customer.status === "active"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    )}
                  >
                    {customer.status === "active" ? "Active" : "Suspended"}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {customer.email} · {customer.location}
                </p>
              </div>

              <div className="text-right text-sm">
                <p className="font-semibold">
                  {formatPriceShort(customer.totalSpent)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {customer.totalOrders} orders
                </p>
              </div>

              <div className="flex w-full items-center gap-2 sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  onClick={() => setViewing(customer)}
                >
                  <Eye className="size-3.5" />
                  View
                </Button>
                <Button
                  variant={
                    customer.status === "active" ? "destructive" : "secondary"
                  }
                  size="sm"
                  className="rounded-xl"
                  onClick={() => {
                    toggleCustomerStatus(customer.id)
                    toast(
                      customer.status === "active"
                        ? `${customer.name} suspended`
                        : `${customer.name} reactivated`
                    )
                  }}
                >
                  <Ban className="size-3.5" />
                  {customer.status === "active" ? "Suspend" : "Activate"}
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
                  aria-label={`Delete ${customer.name}`}
                  onClick={() => setDeleting(customer)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewing && (
        <Modal
          open
          onClose={() => setViewing(null)}
          title="Customer profile"
          description={`Joined ${new Date(viewing.joinedDate).toLocaleDateString([], { month: "long", year: "numeric" })}`}
          size="md"
          footer={
            <>
              <Button
                variant={
                  viewing.status === "active" ? "destructive" : "secondary"
                }
                onClick={() => {
                  toggleCustomerStatus(viewing.id)
                  toast(
                    viewing.status === "active"
                      ? `${viewing.name} suspended`
                      : `${viewing.name} reactivated`
                  )
                  setViewing(null)
                }}
              >
                <Ban className="size-4" />
                {viewing.status === "active"
                  ? "Suspend account"
                  : "Activate account"}
              </Button>
              <Button onClick={() => setViewing(null)}>Done</Button>
            </>
          }
        >
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={viewing.avatar}
                  alt={viewing.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-semibold">{viewing.name}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {viewing.email}
                </p>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Phone className="size-3" /> {viewing.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3" /> {viewing.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDays className="size-3" /> {viewing.joinedDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-border p-3 text-center">
                <ShoppingBag className="mx-auto size-4 text-muted-foreground" />
                <p className="mt-1.5 text-lg font-bold">
                  {viewing.totalOrders}
                </p>
                <p className="text-xs text-muted-foreground">Orders</p>
              </div>
              <div className="rounded-xl border border-border p-3 text-center">
                <CircleDollarSign className="mx-auto size-4 text-muted-foreground" />
                <p className="mt-1.5 text-lg font-bold">
                  {formatPriceShort(viewing.totalSpent)}
                </p>
                <p className="text-xs text-muted-foreground">Spent</p>
              </div>
              <div className="rounded-xl border border-border p-3 text-center">
                <Heart className="mx-auto size-4 text-muted-foreground" />
                <p className="mt-1.5 text-lg font-bold">
                  {viewing.favoriteRestaurants.length}
                </p>
                <p className="text-xs text-muted-foreground">Favorites</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold">Favorite restaurants</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {viewing.favoriteRestaurants.length === 0 ? (
                  <p className="text-sm text-muted-foreground">None yet</p>
                ) : (
                  viewing.favoriteRestaurants.map((id) => (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium"
                    >
                      <Heart className="size-3 text-primary" />
                      {restaurantName(id)}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-muted/50 p-3 text-xs text-muted-foreground">
              <ShieldCheck className="size-4 shrink-0 text-primary" />
              {viewing.status === "active"
                ? "Account is in good standing."
                : "This account is currently suspended and cannot place orders."}
            </div>
          </div>
        </Modal>
      )}

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title={`Delete ${deleting?.name}'s account?`}
        description="The customer account, order history and favorites will be permanently removed. This action cannot be undone."
        confirmLabel="Delete account"
      />
    </div>
  )
}

"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  User,
  Wallet as WalletIcon,
  ClipboardList,
  Bell,
  MapPin,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  TicketPercent,
  Star,
  Settings,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { StatusBadge } from "@/components/status-badge"
import { EmptyState } from "@/components/empty-state"
import { WalletPanel } from "@/features/wallet/wallet-panel"
import { useAuth } from "@/hooks/use-auth"
import { formatPriceShort } from "@/constants/site"
import type {
  User as UserType,
  Wallet,
  Order,
  Notification,
  NotificationType,
} from "@/types"

type TabKey =
  "profile" | "wallet" | "orders" | "notifications" | "addresses" | "payments"

const tabs: { key: TabKey; label: string; icon: LucideIcon }[] = [
  { key: "profile", label: "Profile", icon: User },
  { key: "wallet", label: "Wallet", icon: WalletIcon },
  { key: "orders", label: "Orders", icon: ClipboardList },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "addresses", label: "Addresses", icon: MapPin },
  { key: "payments", label: "Payment Methods", icon: CreditCard },
]

const notificationIcons: Record<NotificationType, LucideIcon> = {
  order: ShoppingCart,
  promotion: TicketPercent,
  review: Star,
  system: Settings,
}

interface ProfileTabsProps {
  user: UserType
  wallet: Wallet
  orders: Order[]
  notifications: Notification[]
}

export function ProfileTabs({
  user,
  wallet,
  orders,
  notifications,
}: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("profile")
  const { user: sessionUser } = useAuth()

  const activeIndex = tabs.findIndex((t) => t.key === activeTab)
  const goPrev = () => {
    if (activeIndex > 0) setActiveTab(tabs[activeIndex - 1].key)
  }
  const goNext = () => {
    if (activeIndex < tabs.length - 1) setActiveTab(tabs[activeIndex + 1].key)
  }

  return (
    <div>
      {/* Mini-navbar pagination */}
      <div className="mt-6 flex items-center gap-2">
        <button
          onClick={goPrev}
          disabled={activeIndex === 0}
          aria-label="Previous section"
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeft className="size-5" />
        </button>

        <div className="flex flex-1 scrollbar-none gap-1.5 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = tab.key === activeTab
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        <button
          onClick={goNext}
          disabled={activeIndex === tabs.length - 1}
          aria-label="Next section"
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      {/* Active section */}
      <div className="mt-6">
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
              <div className="relative size-16 overflow-hidden rounded-full">
                <Image
                  src={user.avatar}
                  alt={sessionUser?.name ?? user.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div>
                <h2 className="text-lg font-semibold">
                  {sessionUser?.name ?? user.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {sessionUser?.email ?? user.email}
                </p>
                <p className="text-sm text-muted-foreground">{user.phone}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border bg-card p-4 text-center">
                <p className="text-2xl font-bold">{user.totalOrders}</p>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4 text-center">
                <p className="text-2xl font-bold">
                  {formatPriceShort(user.totalSpent)}
                </p>
                <p className="text-sm text-muted-foreground">Total Spent</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "wallet" && <WalletPanel wallet={wallet} />}

        {activeTab === "orders" &&
          (orders.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="No orders yet"
              description="When you place an order, it will appear here."
            />
          ) : (
            <div className="space-y-4">
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
          ))}

        {activeTab === "notifications" &&
          (notifications.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No notifications"
              description="You're all caught up! Check back later."
            />
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => {
                const Icon = notificationIcons[notification.type]
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex items-start gap-3 rounded-2xl border p-4",
                      notification.isRead
                        ? "border-border bg-card"
                        : "border-primary/20 bg-primary/5"
                    )}
                  >
                    <div
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-xl",
                        notification.isRead
                          ? "bg-muted text-muted-foreground"
                          : "bg-primary/10 text-primary"
                      )}
                    >
                      <Icon className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3
                          className={cn(
                            "text-sm",
                            notification.isRead
                              ? "font-medium"
                              : "font-semibold"
                          )}
                        >
                          {notification.title}
                        </h3>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {notification.time}
                        </span>
                      </div>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="mt-2 size-2 shrink-0 rounded-full bg-primary" />
                    )}
                  </div>
                )
              })}
            </div>
          ))}

        {activeTab === "addresses" && (
          <div className="space-y-2">
            {user.addresses.map((address) => (
              <div
                key={address.id}
                className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium">{address.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {address.address}
                  </p>
                </div>
                {address.isDefault && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    Default
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "payments" && (
          <div className="space-y-2">
            {user.paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium">{method.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {method.details}
                  </p>
                </div>
                {method.isDefault && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    Default
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

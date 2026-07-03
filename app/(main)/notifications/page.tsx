"use client"

import { useState } from "react"
import {
  Bell,
  ShoppingCart,
  TicketPercent,
  Star,
  Settings,
  CircleCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { EmptyState } from "@/components/empty-state"
import { notifications as initialNotifications } from "@/mock-data/notifications"
import type { NotificationType } from "@/types"

const typeIcons: Record<NotificationType, typeof Bell> = {
  order: ShoppingCart,
  promotion: TicketPercent,
  review: Star,
  system: Settings,
}

const tabs: { key: NotificationType | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "order", label: "Orders" },
  { key: "promotion", label: "Promos" },
  { key: "system", label: "System" },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [activeTab, setActiveTab] = useState<NotificationType | "all">("all")

  const filtered =
    activeTab === "all"
      ? notifications
      : notifications.filter((n) => n.type === activeTab)

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
  }

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-sm font-medium text-primary hover:underline"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="mt-4 flex gap-1 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab.key
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You're all caught up! Check back later."
        />
      ) : (
        <div className="mt-4 space-y-2">
          {filtered.map((notification) => {
            const Icon = typeIcons[notification.type]
            return (
              <button
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-colors",
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
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

import { Palette, ClipboardList, Heart, Bell, ChevronRight } from "lucide-react"
import Link from "next/link"
import { getUser } from "@/lib/services/user"
import { getWallet } from "@/lib/services/wallet"
import { getOrders } from "@/lib/services/order"
import { getNotifications } from "@/lib/services/notification"
import { AuthGuard } from "@/components/auth/auth-guard"
import { ProfileTabs } from "@/features/profile/profile-tabs"

export const metadata = { title: "Profile" }

export default async function ProfilePage() {
  const [user, wallet, orders, notifications] = await Promise.all([
    getUser(),
    getWallet(),
    getOrders(),
    getNotifications(),
  ])

  const quickLinks = [
    {
      label: "My Orders",
      href: "/orders",
      icon: ClipboardList,
      value: `${user.totalOrders} orders`,
    },
    {
      label: "Favorites",
      href: "/favorites",
      icon: Heart,
      value: `${user.favoriteRestaurants.length} restaurants`,
    },
    { label: "Notifications", href: "/notifications", icon: Bell, value: "" },
    {
      label: "Appearance",
      href: "#",
      icon: Palette,
      value: user.preferences.theme,
    },
  ]

  return (
    <AuthGuard next="/profile">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <h1 className="text-2xl font-bold">Profile</h1>

        <ProfileTabs
          user={user}
          wallet={wallet}
          orders={orders}
          notifications={notifications}
        />

        <div className="mt-8">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Quick Links
          </h3>
          <div className="mt-2 space-y-1">
            {quickLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex items-center justify-between rounded-xl px-4 py-3 transition-colors hover:bg-muted"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="size-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{link.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {link.value && (
                      <span className="text-xs text-muted-foreground">
                        {link.value}
                      </span>
                    )}
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}

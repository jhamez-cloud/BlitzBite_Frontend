import Image from "next/image"
import {
  User,
  MapPin,
  CreditCard,
  Bell,
  Palette,
  ClipboardList,
  Heart,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { getUser } from "@/lib/services/user"
import { formatPriceShort } from "@/constants/site"

export const metadata = { title: "Profile" }

export default async function ProfilePage() {
  const user = await getUser()

  const sections = [
    {
      title: "Saved Addresses",
      icon: MapPin,
      items: user.addresses.map((a) => ({
        label: a.label,
        value: a.address,
        badge: a.isDefault ? "Default" : undefined,
      })),
    },
    {
      title: "Payment Methods",
      icon: CreditCard,
      items: user.paymentMethods.map((p) => ({
        label: p.label,
        value: p.details,
        badge: p.isDefault ? "Default" : undefined,
      })),
    },
  ]

  const quickLinks = [
    { label: "My Orders", href: "/orders", icon: ClipboardList, value: `${user.totalOrders} orders` },
    { label: "Favorites", href: "/favorites", icon: Heart, value: `${user.favoriteRestaurants.length} restaurants` },
    { label: "Notifications", href: "/notifications", icon: Bell, value: "" },
    { label: "Appearance", href: "#", icon: Palette, value: user.preferences.theme },
  ]

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      <div className="mt-6 flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
        <div className="relative size-16 overflow-hidden rounded-full">
          <Image
            src={user.avatar}
            alt={user.name}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
        <div>
          <h2 className="text-lg font-semibold">{user.name}</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <p className="text-sm text-muted-foreground">{user.phone}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
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

      {sections.map((section) => {
        const Icon = section.icon
        return (
          <div key={section.title} className="mt-6">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Icon className="size-4" />
              {section.title}
            </h3>
            <div className="mt-2 space-y-2">
              {section.items.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.value}
                    </p>
                  </div>
                  {item.badge && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {item.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })}

      <div className="mt-6">
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
  )
}

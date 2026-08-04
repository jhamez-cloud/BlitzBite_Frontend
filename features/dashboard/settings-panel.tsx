"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Store,
  Clock3,
  BellRing,
  Megaphone,
  AlertTriangle,
  LogOut,
  Save,
  RotateCcw,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/dashboard/page-header"
import {
  FormField,
  inputClass,
  textareaClass,
} from "@/components/dashboard/form-field"
import { useDashboard } from "@/features/dashboard/dashboard-store"
import { useAdminAuth } from "@/hooks/use-admin-auth"
import { useToast } from "@/hooks/use-toast"
import { categories as categoryOptions } from "@/mock-data/categories"
import { ownerRestaurant as seedOwnerRestaurant } from "@/mock-data/settings"
import type { OpeningHours, OwnerPreferences } from "@/types"

const LOGO_PRESETS = [
  "https://images.unsplash.com/photo-1550547660-d9450f859349?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=100&h=100&fit=crop",
]

const BANNER_PRESETS = [
  "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=400&fit=crop",
]

function Toggle({
  checked,
  onChange,
  label,
  description,
  icon: Icon,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  description: string
  icon: typeof BellRing
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border p-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-primary" : "bg-muted"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform",
            checked && "translate-x-5"
          )}
        />
      </button>
    </div>
  )
}

function SectionCard({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string
  description: string
  icon: typeof Store
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="size-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  )
}

export function SettingsPanel() {
  const router = useRouter()
  const { admin, logout } = useAdminAuth()
  const {
    ownerRestaurant,
    ownerPreferences,
    updateRestaurantProfile,
    setOpeningHours,
    updatePreferences,
    resetSettings,
  } = useDashboard()
  const { toast } = useToast()

  const [profile, setProfile] = useState(ownerRestaurant)
  const [hours, setHours] = useState<OpeningHours[]>(
    ownerRestaurant.openingHours
  )

  const set = <K extends keyof typeof profile>(
    key: K,
    value: (typeof profile)[K]
  ) => setProfile((prev) => ({ ...prev, [key]: value }))

  const toggleCategory = (name: string) =>
    set(
      "categories",
      profile.categories.includes(name)
        ? profile.categories.filter((c) => c !== name)
        : [...profile.categories, name]
    )

  const setHour = (day: string, patch: Partial<OpeningHours>) =>
    setHours((prev) =>
      prev.map((h) => (h.day === day ? { ...h, ...patch } : h))
    )

  const handleSaveProfile = () => {
    updateRestaurantProfile(profile)
    toast("Restaurant profile saved")
  }

  const handleSaveHours = () => {
    setOpeningHours(hours)
    toast("Opening hours saved")
  }

  const handleReset = () => {
    resetSettings()
    setProfile(seedOwnerRestaurant)
    setHours(seedOwnerRestaurant.openingHours)
    toast("Settings restored to defaults")
  }

  const handlePref = (key: keyof OwnerPreferences, value: boolean) => {
    updatePreferences({ [key]: value })
    toast(value ? "Preference enabled" : "Preference disabled")
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Manage your account, restaurant profile and preferences."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Account */}
        <SectionCard
          title="Account"
          description="Your owner account on BlitzBite."
          icon={Store}
        >
          <div className="flex items-center gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
              {admin?.name
                .split(" ")
                .map((p) => p[0])
                .filter(Boolean)
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="font-semibold">{admin?.name}</p>
              <p className="truncate text-sm text-muted-foreground">
                {admin?.email}
              </p>
              <p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                <Store className="size-3" />
                {admin?.restaurantName}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="mt-5 w-full rounded-xl"
            onClick={() => {
              logout()
              router.replace("/login?role=admin")
            }}
          >
            <LogOut className="size-4" />
            Sign out
          </Button>
        </SectionCard>

        {/* Preferences */}
        <SectionCard
          title="Notifications & preferences"
          description="Control how you hear about activity in your restaurant."
          icon={BellRing}
        >
          <div className="space-y-2.5">
            <Toggle
              checked={ownerPreferences.newOrderNotifications}
              onChange={(v) => handlePref("newOrderNotifications", v)}
              label="New order notifications"
              description="Get notified the moment a new order arrives."
              icon={BellRing}
            />
            <Toggle
              checked={ownerPreferences.lowStockAlerts}
              onChange={(v) => handlePref("lowStockAlerts", v)}
              label="Low stock alerts"
              description="Alerts when menu items are running out."
              icon={AlertTriangle}
            />
            <Toggle
              checked={ownerPreferences.autoAcceptOrders}
              onChange={(v) => handlePref("autoAcceptOrders", v)}
              label="Auto-accept orders"
              description="Orders are accepted without manual confirmation."
              icon={Check}
            />
            <Toggle
              checked={ownerPreferences.marketingEmails}
              onChange={(v) => handlePref("marketingEmails", v)}
              label="Marketing emails"
              description="Tips and updates from the BlitzBite team."
              icon={Megaphone}
            />
          </div>
        </SectionCard>

        {/* Restaurant profile */}
        <SectionCard
          title="Restaurant profile"
          description="This is what customers see when they find your restaurant."
          icon={Store}
        >
          <div className="space-y-4">
            <FormField label="Restaurant name" htmlFor="settings-name">
              <input
                id="settings-name"
                value={profile.name}
                onChange={(e) => set("name", e.target.value)}
                className={inputClass}
              />
            </FormField>

            <FormField label="Description" htmlFor="settings-description">
              <textarea
                id="settings-description"
                value={profile.description}
                onChange={(e) => set("description", e.target.value)}
                rows={3}
                className={textareaClass}
              />
            </FormField>

            <div className="grid gap-3 sm:grid-cols-2">
              <FormField label="Phone" htmlFor="settings-phone">
                <input
                  id="settings-phone"
                  value={profile.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  className={inputClass}
                />
              </FormField>
              <FormField label="Address" htmlFor="settings-address">
                <input
                  id="settings-address"
                  value={profile.address}
                  onChange={(e) => set("address", e.target.value)}
                  className={inputClass}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <FormField label="Delivery time" htmlFor="settings-delivery-time">
                <input
                  id="settings-delivery-time"
                  value={profile.deliveryTime}
                  onChange={(e) => set("deliveryTime", e.target.value)}
                  className={inputClass}
                />
              </FormField>
              <FormField
                label="Delivery fee (₵)"
                htmlFor="settings-delivery-fee"
              >
                <input
                  id="settings-delivery-fee"
                  type="number"
                  min={0}
                  value={profile.deliveryFee}
                  onChange={(e) =>
                    set("deliveryFee", Number(e.target.value) || 0)
                  }
                  className={inputClass}
                />
              </FormField>
              <FormField label="Min order (₵)" htmlFor="settings-min-order">
                <input
                  id="settings-min-order"
                  type="number"
                  min={0}
                  value={profile.minimumOrder}
                  onChange={(e) =>
                    set("minimumOrder", Number(e.target.value) || 0)
                  }
                  className={inputClass}
                />
              </FormField>
            </div>

            <FormField label="Categories">
              <div className="flex flex-wrap gap-1.5">
                {categoryOptions.map((cat) => {
                  const selected = profile.categories.includes(cat.name)
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.name)}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                        selected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      )}
                    >
                      {cat.icon} {cat.name}
                    </button>
                  )
                })}
              </div>
            </FormField>

            <FormField label="Logo">
              <div className="flex flex-wrap gap-2">
                {LOGO_PRESETS.map((url) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => set("logo", url)}
                    className={cn(
                      "relative size-11 overflow-hidden rounded-xl border-2 transition-all",
                      profile.logo === url
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-border hover:border-primary/40"
                    )}
                  >
                    <Image
                      src={url}
                      alt="Logo option"
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  </button>
                ))}
              </div>
            </FormField>

            <FormField label="Banner">
              <div className="flex flex-wrap gap-2">
                {BANNER_PRESETS.map((url) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => set("banner", url)}
                    className={cn(
                      "relative h-12 w-20 overflow-hidden rounded-xl border-2 transition-all",
                      profile.banner === url
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-border hover:border-primary/40"
                    )}
                  >
                    <Image
                      src={url}
                      alt="Banner option"
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            </FormField>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="size-4" />
                Reset
              </Button>
              <Button onClick={handleSaveProfile}>
                <Save className="size-4" />
                Save profile
              </Button>
            </div>
          </div>
        </SectionCard>

        {/* Opening hours */}
        <SectionCard
          title="Opening hours"
          description="Set when your restaurant is available for orders."
          icon={Clock3}
        >
          <div className="space-y-2">
            {hours.map((h) => (
              <div
                key={h.day}
                className="flex items-center gap-3 rounded-xl border border-border px-3 py-2"
              >
                <span className="w-28 shrink-0 text-sm font-medium">
                  {h.day}
                </span>
                <input
                  type="time"
                  value={h.open}
                  onChange={(e) => setHour(h.day, { open: e.target.value })}
                  className={cn(inputClass, "flex-1")}
                />
                <span className="text-xs text-muted-foreground">to</span>
                <input
                  type="time"
                  value={h.close}
                  onChange={(e) => setHour(h.day, { close: e.target.value })}
                  className={cn(inputClass, "flex-1")}
                />
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={handleSaveHours}>
              <Save className="size-4" />
              Save hours
            </Button>
          </div>
        </SectionCard>
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5">
        <h3 className="flex items-center gap-2 font-semibold text-destructive">
          <AlertTriangle className="size-4" />
          Danger zone
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Restore the demo restaurant profile and preferences to their original
          values. Your sign-in stays intact.
        </p>
        <Button
          variant="destructive"
          className="mt-4 rounded-xl"
          onClick={handleReset}
        >
          <RotateCcw className="size-4" />
          Reset demo data
        </Button>
      </div>
    </div>
  )
}

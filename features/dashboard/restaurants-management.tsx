"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Star,
  UtensilsCrossed,
  Pencil,
  Clock3,
  Sparkles,
  Flame,
  Plus,
  MessageSquareQuote,
  Check,
  X,
  Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { StatCard } from "@/components/stat-card"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/dashboard/page-header"
import { Modal } from "@/components/dashboard/modal"
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog"
import {
  FormField,
  inputClass,
  textareaClass,
} from "@/components/dashboard/form-field"
import { useDashboard } from "@/features/dashboard/dashboard-store"
import { useToast } from "@/hooks/use-toast"
import { formatPriceShort } from "@/constants/site"
import { categories as categoryOptions } from "@/mock-data/categories"
import type { Addon, MenuItem, Restaurant } from "@/types"

const LOGO_PRESETS = [
  "https://images.unsplash.com/photo-1550547660-d9450f859349?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1561651188-d207bbec4ec3?w=100&h=100&fit=crop",
]

const BANNER_PRESETS = [
  "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=400&fit=crop",
]

const MENU_IMAGE_PRESETS = [
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400&h=300&fit=crop",
]

interface RestaurantForm {
  name: string
  description: string
  address: string
  phone: string
  deliveryTime: string
  deliveryFee: number | ""
  minimumOrder: number | ""
  categories: string[]
  logo: string
  banner: string
  isOpen: boolean
  isFeatured: boolean
  isTrending: boolean
}

interface MenuItemForm {
  name: string
  description: string
  price: number | ""
  category: string
  calories: number | ""
  available: boolean
  isPopular: boolean
  image: string
  addons: Addon[]
}

const emptyMenuItemForm: MenuItemForm = {
  name: "",
  description: "",
  price: "",
  category: "Popular",
  calories: "",
  available: true,
  isPopular: false,
  image: MENU_IMAGE_PRESETS[0],
  addons: [],
}

function FlagPill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
      )}
    >
      {children}
    </button>
  )
}

export function RestaurantsManagement() {
  const { ownerRestaurant, myMenuItems, myReviews, updateRestaurantProfile } =
    useDashboard()
  const { toast } = useToast()

  const [editOpen, setEditOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const myItems = myMenuItems
  const myReviewCount = myReviews.length

  const toggleFlag = (field: "isOpen" | "isFeatured" | "isTrending") => {
    updateRestaurantProfile({ [field]: !ownerRestaurant[field] })
    toast(
      field === "isOpen"
        ? ownerRestaurant.isOpen
          ? "Restaurant marked closed"
          : "Restaurant marked open"
        : `${ownerRestaurant.name} updated`
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Restaurant"
        subtitle="Manage your restaurant's profile and menu — scoped to the restaurant you own."
      />

      {/* Hero card */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="relative h-40 sm:h-52">
          <Image
            src={ownerRestaurant.banner}
            alt={ownerRestaurant.name}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          {!ownerRestaurant.isOpen && (
            <span className="absolute top-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              Closed for orders
            </span>
          )}
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-start gap-4">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl border-2 border-background shadow-lg sm:size-20">
              <Image
                src={ownerRestaurant.logo}
                alt={ownerRestaurant.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold">{ownerRestaurant.name}</h2>
                <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-semibold">
                  <Star className="size-3 fill-yellow-400 text-yellow-400" />
                  {ownerRestaurant.rating.toFixed(1)}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {ownerRestaurant.categories.join(" · ") || "Uncategorized"}
              </p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span>⏱ {ownerRestaurant.deliveryTime}</span>
                <span>
                  {formatPriceShort(ownerRestaurant.deliveryFee)} delivery
                </span>
                <span>
                  min {formatPriceShort(ownerRestaurant.minimumOrder)}
                </span>
                <span>{ownerRestaurant.reviewCount} reviews</span>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                <FlagPill
                  active={ownerRestaurant.isOpen}
                  onClick={() => toggleFlag("isOpen")}
                >
                  <Clock3 className="size-3" />
                  {ownerRestaurant.isOpen ? "Open" : "Closed"}
                </FlagPill>
                <FlagPill
                  active={ownerRestaurant.isFeatured}
                  onClick={() => toggleFlag("isFeatured")}
                >
                  <Sparkles className="size-3" />
                  Featured
                </FlagPill>
                <FlagPill
                  active={ownerRestaurant.isTrending}
                  onClick={() => toggleFlag("isTrending")}
                >
                  <Flame className="size-3" />
                  Trending
                </FlagPill>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button onClick={() => setEditOpen(true)} className="rounded-xl">
              <Pencil className="size-4" />
              Edit profile
            </Button>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setMenuOpen(true)}
            >
              <UtensilsCrossed className="size-4" />
              Manage menu ({myItems.length})
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Rating"
          value={ownerRestaurant.rating.toFixed(1)}
          icon={Star}
        />
        <StatCard
          title="Menu Items"
          value={myItems.length}
          icon={UtensilsCrossed}
        />
        <StatCard
          title="Reviews"
          value={myReviewCount}
          icon={MessageSquareQuote}
        />
      </div>

      {/* Menu preview */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold">Your menu</h3>
            <p className="text-xs text-muted-foreground">
              The items customers can order from your restaurant.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 rounded-xl"
            onClick={() => setMenuOpen(true)}
          >
            <Plus className="size-3.5" />
            Add item
          </Button>
        </div>

        {myItems.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No menu items yet. Add your first item to start taking orders.
          </p>
        ) : (
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {myItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-xl border border-border p-3"
              >
                <div className="relative size-10 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "truncate text-sm font-medium",
                      !item.available && "text-muted-foreground line-through"
                    )}
                  >
                    {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.category} · {formatPriceShort(item.price)}
                  </p>
                </div>
                <span
                  className={cn(
                    "flex size-2.5 shrink-0 rounded-full",
                    item.available ? "bg-green-500" : "bg-muted-foreground/40"
                  )}
                  title={item.available ? "Available" : "Unavailable"}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {editOpen && (
        <RestaurantFormModal
          restaurant={ownerRestaurant}
          onClose={() => setEditOpen(false)}
          onSave={(form) => {
            updateRestaurantProfile({
              ...form,
              deliveryFee: Number(form.deliveryFee) || 0,
              minimumOrder: Number(form.minimumOrder) || 0,
            })
            toast("Restaurant profile updated")
            setEditOpen(false)
          }}
        />
      )}

      {menuOpen && (
        <MenuManagerModal
          restaurant={ownerRestaurant}
          items={myItems}
          onClose={() => setMenuOpen(false)}
        />
      )}
    </div>
  )
}

function RestaurantFormModal({
  restaurant,
  onClose,
  onSave,
}: {
  restaurant: Restaurant
  onClose: () => void
  onSave: (form: RestaurantForm) => void
}) {
  const [form, setForm] = useState<RestaurantForm>({
    name: restaurant.name,
    description: restaurant.description,
    address: restaurant.address,
    phone: restaurant.phone,
    deliveryTime: restaurant.deliveryTime,
    deliveryFee: restaurant.deliveryFee,
    minimumOrder: restaurant.minimumOrder,
    categories: restaurant.categories,
    logo: restaurant.logo,
    banner: restaurant.banner,
    isOpen: restaurant.isOpen,
    isFeatured: restaurant.isFeatured,
    isTrending: restaurant.isTrending,
  })

  const set = <K extends keyof RestaurantForm>(
    key: K,
    value: RestaurantForm[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }))

  const toggleCategory = (name: string) =>
    set(
      "categories",
      form.categories.includes(name)
        ? form.categories.filter((c) => c !== name)
        : [...form.categories, name]
    )

  const valid = form.name.trim().length > 0

  return (
    <Modal
      open
      onClose={onClose}
      title={`Edit ${restaurant.name}`}
      description="Update the public information customers see about your restaurant."
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => valid && onSave(form)} disabled={!valid}>
            Save changes
          </Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Name"
          htmlFor="restaurant-name"
          className="sm:col-span-2"
        >
          <input
            id="restaurant-name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Mensah's Kitchen"
            className={inputClass}
          />
        </FormField>

        <FormField
          label="Description"
          htmlFor="restaurant-description"
          className="sm:col-span-2"
        >
          <textarea
            id="restaurant-description"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="What makes your restaurant special?"
            rows={2}
            className={textareaClass}
          />
        </FormField>

        <FormField label="Address" htmlFor="restaurant-address">
          <input
            id="restaurant-address"
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
            placeholder="12 Oxford Street, Osu, Accra"
            className={inputClass}
          />
        </FormField>

        <FormField label="Phone" htmlFor="restaurant-phone">
          <input
            id="restaurant-phone"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="+233 20 000 0000"
            className={inputClass}
          />
        </FormField>

        <FormField label="Delivery time" htmlFor="restaurant-delivery-time">
          <input
            id="restaurant-delivery-time"
            value={form.deliveryTime}
            onChange={(e) => set("deliveryTime", e.target.value)}
            placeholder="20-30 mins"
            className={inputClass}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Delivery fee (₵)" htmlFor="restaurant-delivery-fee">
            <input
              id="restaurant-delivery-fee"
              type="number"
              min={0}
              value={form.deliveryFee}
              onChange={(e) =>
                set(
                  "deliveryFee",
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              className={inputClass}
            />
          </FormField>
          <FormField label="Min order (₵)" htmlFor="restaurant-min-order">
            <input
              id="restaurant-min-order"
              type="number"
              min={0}
              value={form.minimumOrder}
              onChange={(e) =>
                set(
                  "minimumOrder",
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              className={inputClass}
            />
          </FormField>
        </div>

        <FormField label="Categories" className="sm:col-span-2">
          <div className="flex flex-wrap gap-1.5">
            {categoryOptions.map((cat) => {
              const selected = form.categories.includes(cat.name)
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

        <FormField label="Logo" className="sm:col-span-2">
          <div className="flex flex-wrap gap-2">
            {LOGO_PRESETS.map((url) => (
              <button
                key={url}
                type="button"
                onClick={() => set("logo", url)}
                className={cn(
                  "relative size-12 overflow-hidden rounded-xl border-2 transition-all",
                  form.logo === url
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-border hover:border-primary/40"
                )}
              >
                <Image
                  src={url}
                  alt="Logo option"
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </button>
            ))}
          </div>
        </FormField>

        <FormField label="Banner" className="sm:col-span-2">
          <div className="flex flex-wrap gap-2">
            {BANNER_PRESETS.map((url) => (
              <button
                key={url}
                type="button"
                onClick={() => set("banner", url)}
                className={cn(
                  "relative h-12 w-20 overflow-hidden rounded-xl border-2 transition-all",
                  form.banner === url
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

        <div className="flex flex-wrap gap-4 sm:col-span-2">
          {(
            [
              ["isOpen", "Open for orders"],
              ["isFeatured", "Featured on home"],
              ["isTrending", "Trending badge"],
            ] as const
          ).map(([key, label]) => (
            <label
              key={key}
              className="flex cursor-pointer items-center gap-2 text-sm"
            >
              <input
                type="checkbox"
                checked={form[key]}
                onChange={(e) => set(key, e.target.checked)}
                className="size-4 accent-[var(--primary)]"
              />
              {label}
            </label>
          ))}
        </div>
      </div>
    </Modal>
  )
}

function MenuManagerModal({
  restaurant,
  items,
  onClose,
}: {
  restaurant: Restaurant
  items: MenuItem[]
  onClose: () => void
}) {
  const { addMenuItem, updateMenuItem, deleteMenuItem } = useDashboard()
  const { toast } = useToast()
  const [itemModal, setItemModal] = useState<{
    mode: "add" | "edit"
    item?: MenuItem
  } | null>(null)
  const [deletingItem, setDeletingItem] = useState<MenuItem | null>(null)

  return (
    <Modal
      open
      onClose={onClose}
      title={`${restaurant.name} — Menu`}
      description={`${items.length} item${items.length !== 1 ? "s" : ""}`}
      size="lg"
      footer={
        <Button onClick={() => setItemModal({ mode: "add" })}>
          <Plus className="size-4" />
          Add item
        </Button>
      }
    >
      <div className="space-y-2">
        {items.length === 0 && (
          <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No menu items yet. Add your first item to get started.
          </p>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-xl border border-border p-3"
          >
            <div className="relative size-11 shrink-0 overflow-hidden rounded-lg">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                sizes="44px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "truncate text-sm font-medium",
                  !item.available && "text-muted-foreground line-through"
                )}
              >
                {item.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {item.category} · {formatPriceShort(item.price)}
                {item.addons.length > 0 &&
                  ` · ${item.addons.length} addon${
                    item.addons.length !== 1 ? "s" : ""
                  }`}
              </p>
            </div>
            <button
              onClick={() => {
                updateMenuItem(item.id, { available: !item.available })
                toast(
                  item.available
                    ? `${item.name} hidden from menu`
                    : `${item.name} back on the menu`
                )
              }}
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-lg border transition-colors",
                item.available
                  ? "border-green-500/40 text-green-600 hover:bg-green-500/10"
                  : "border-border text-muted-foreground hover:bg-muted"
              )}
              aria-label={
                item.available ? "Mark unavailable" : "Mark available"
              }
            >
              {item.available ? (
                <Check className="size-4" />
              ) : (
                <X className="size-4" />
              )}
            </button>
            <button
              onClick={() => setItemModal({ mode: "edit", item })}
              className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Edit item"
            >
              <Pencil className="size-3.5" />
            </button>
            <button
              onClick={() => setDeletingItem(item)}
              className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-destructive/30 text-destructive transition-colors hover:bg-destructive/10"
              aria-label="Delete item"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}
      </div>

      {itemModal && (
        <MenuItemFormModal
          mode={itemModal.mode}
          item={itemModal.item}
          onClose={() => setItemModal(null)}
          onSave={(form) => {
            if (itemModal.mode === "add") {
              addMenuItem(restaurant.id, {
                ...form,
                price: Number(form.price) || 0,
                calories: Number(form.calories) || 0,
              })
              toast("Menu item added")
            } else if (itemModal.item) {
              updateMenuItem(itemModal.item.id, {
                ...form,
                price: Number(form.price) || 0,
                calories: Number(form.calories) || 0,
              })
              toast("Menu item updated")
            }
            setItemModal(null)
          }}
        />
      )}

      <ConfirmDialog
        open={Boolean(deletingItem)}
        onClose={() => setDeletingItem(null)}
        onConfirm={() => {
          if (deletingItem) {
            deleteMenuItem(deletingItem.id)
            toast(`"${deletingItem.name}" removed from menu`)
          }
          setDeletingItem(null)
        }}
        title={`Delete "${deletingItem?.name}"?`}
        description="This menu item will be permanently removed from your restaurant's menu."
        confirmLabel="Delete item"
      />
    </Modal>
  )
}

function MenuItemFormModal({
  mode,
  item,
  onClose,
  onSave,
}: {
  mode: "add" | "edit"
  item?: MenuItem
  onClose: () => void
  onSave: (form: MenuItemForm) => void
}) {
  const [form, setForm] = useState<MenuItemForm>(
    item
      ? {
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category,
          calories: item.calories,
          available: item.available,
          isPopular: item.isPopular,
          image: item.image,
          addons: item.addons,
        }
      : emptyMenuItemForm
  )

  const set = <K extends keyof MenuItemForm>(key: K, value: MenuItemForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const setAddon = (index: number, patch: Partial<Addon>) =>
    set(
      "addons",
      form.addons.map((a, i) => (i === index ? { ...a, ...patch } : a))
    )

  const valid = form.name.trim().length > 0

  return (
    <Modal
      open
      onClose={onClose}
      title={mode === "add" ? "Add menu item" : `Edit ${item?.name}`}
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => valid && onSave(form)} disabled={!valid}>
            {mode === "add" ? "Add item" : "Save changes"}
          </Button>
        </>
      }
    >
      <div className="grid gap-4">
        <FormField label="Name" htmlFor="item-name">
          <input
            id="item-name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Jollof Rice & Chicken"
            className={inputClass}
          />
        </FormField>

        <FormField label="Description" htmlFor="item-description">
          <textarea
            id="item-description"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={2}
            placeholder="Short appetizing description"
            className={textareaClass}
          />
        </FormField>

        <div className="grid grid-cols-3 gap-3">
          <FormField label="Price (₵)" htmlFor="item-price">
            <input
              id="item-price"
              type="number"
              min={0}
              value={form.price}
              onChange={(e) =>
                set(
                  "price",
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              className={inputClass}
            />
          </FormField>
          <FormField label="Calories" htmlFor="item-calories">
            <input
              id="item-calories"
              type="number"
              min={0}
              value={form.calories}
              onChange={(e) =>
                set(
                  "calories",
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              className={inputClass}
            />
          </FormField>
          <FormField label="Category" htmlFor="item-category">
            <input
              id="item-category"
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              placeholder="Popular"
              className={inputClass}
            />
          </FormField>
        </div>

        <FormField label="Image">
          <div className="flex flex-wrap gap-2">
            {MENU_IMAGE_PRESETS.map((url) => (
              <button
                key={url}
                type="button"
                onClick={() => set("image", url)}
                className={cn(
                  "relative h-12 w-16 overflow-hidden rounded-lg border-2 transition-all",
                  form.image === url
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-border hover:border-primary/40"
                )}
              >
                <Image
                  src={url}
                  alt="Image option"
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        </FormField>

        <FormField
          label="Add-ons"
          hint="Optional extras customers can add to this item."
        >
          <div className="space-y-2">
            {form.addons.map((addon, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  value={addon.name}
                  onChange={(e) => setAddon(index, { name: e.target.value })}
                  placeholder="Add-on name"
                  className={cn(inputClass, "flex-1")}
                />
                <input
                  type="number"
                  min={0}
                  value={addon.price}
                  onChange={(e) =>
                    setAddon(index, { price: Number(e.target.value) || 0 })
                  }
                  placeholder="₵"
                  className={cn(inputClass, "w-24")}
                />
                <button
                  type="button"
                  onClick={() =>
                    set(
                      "addons",
                      form.addons.filter((_, i) => i !== index)
                    )
                  }
                  className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-destructive/30 text-destructive transition-colors hover:bg-destructive/10"
                  aria-label="Remove add-on"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl"
              onClick={() =>
                set("addons", [
                  ...form.addons,
                  { id: Date.now(), name: "", price: 0 },
                ])
              }
            >
              <Plus className="size-3.5" />
              Add add-on
            </Button>
          </div>
        </FormField>

        <div className="flex flex-wrap gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.available}
              onChange={(e) => set("available", e.target.checked)}
              className="size-4 accent-[var(--primary)]"
            />
            Available
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isPopular}
              onChange={(e) => set("isPopular", e.target.checked)}
              className="size-4 accent-[var(--primary)]"
            />
            Popular
          </label>
        </div>
      </div>
    </Modal>
  )
}

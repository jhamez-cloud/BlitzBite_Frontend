"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { Clock3, Bike, MapPin, Phone, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { RatingBadge } from "@/components/rating-badge"
import { FoodCard } from "@/components/food-card"
import { ReviewCard } from "@/components/review-card"
import { CategoryChip } from "@/components/category-chip"
import { MenuItemModal } from "@/features/restaurant-detail/menu-item-modal"
import { formatPriceShort } from "@/constants/site"
import { useCart } from "@/hooks/use-cart"
import type { Restaurant, MenuItem, Review } from "@/types"

interface RestaurantDetailClientProps {
  restaurant: Restaurant
  menuItems: MenuItem[]
  reviews: Review[]
}

type Tab = "menu" | "reviews" | "info"

export function RestaurantDetailClient({
  restaurant,
  menuItems,
  reviews,
}: RestaurantDetailClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>("menu")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const { addItem } = useCart()

  const menuCategories = useMemo(() => {
    const cats = [...new Set(menuItems.map((m) => m.category))]
    return cats
  }, [menuItems])

  const filteredMenu = useMemo(() => {
    if (!selectedCategory) return menuItems
    return menuItems.filter((m) => m.category === selectedCategory)
  }, [menuItems, selectedCategory])

  const tabs: { key: Tab; label: string }[] = [
    { key: "menu", label: "Menu" },
    { key: "reviews", label: `Reviews (${reviews.length})` },
    { key: "info", label: "Information" },
  ]

  return (
    <div>
      <div className="relative h-48 sm:h-64 lg:h-80">
        <Image
          src={restaurant.banner}
          alt={restaurant.name}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="-mt-12 relative z-10 rounded-2xl border border-border bg-card p-4 shadow-lg sm:p-6">
          <div className="flex items-start gap-4">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border-2 border-background shadow sm:size-20">
              <Image
                src={restaurant.logo}
                alt={restaurant.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-xl font-bold sm:text-2xl">
                    {restaurant.name}
                  </h1>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {restaurant.categories.join(" · ")}
                  </p>
                </div>
                <RatingBadge
                  rating={restaurant.rating}
                  reviewCount={restaurant.reviewCount}
                />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock3 className="size-4" />
                  {restaurant.deliveryTime}
                </span>
                <span className="flex items-center gap-1">
                  <Bike className="size-4" />
                  {formatPriceShort(restaurant.deliveryFee)} delivery
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-4" />
                  {restaurant.address}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-1 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "px-4 py-2.5 text-sm font-medium transition-colors",
                activeTab === tab.key
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="py-6">
          {activeTab === "menu" && (
            <div>
              <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                <CategoryChip
                  label="All"
                  isActive={!selectedCategory}
                  onClick={() => setSelectedCategory(null)}
                />
                {menuCategories.map((cat) => (
                  <CategoryChip
                    key={cat}
                    label={cat}
                    isActive={selectedCategory === cat}
                    onClick={() =>
                      setSelectedCategory(
                        selectedCategory === cat ? null : cat
                      )
                    }
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {filteredMenu.map((item) => (
                  <FoodCard
                    key={item.id}
                    item={item}
                    onCardClick={() => setSelectedItem(item)}
                    onAddToCart={() =>
                      addItem({
                        menuItemId: item.id,
                        restaurantId: restaurant.id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        quantity: 1,
                        selectedAddons: [],
                      })
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
                <div className="text-center">
                  <p className="text-4xl font-bold">{restaurant.rating}</p>
                  <div className="mt-1 flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "size-4",
                          i < Math.round(restaurant.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-muted text-muted"
                        )}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {restaurant.reviewCount} reviews
                  </p>
                </div>
              </div>
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}

          {activeTab === "info" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold">About</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {restaurant.description}
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Opening Hours</h3>
                <div className="mt-2 space-y-1.5">
                  {restaurant.openingHours.map((h) => (
                    <div
                      key={h.day}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-muted-foreground">{h.day}</span>
                      <span>
                        {h.open} - {h.close}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Contact</h3>
                <div className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <MapPin className="size-4" />
                    {restaurant.address}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="size-4" />
                    {restaurant.phone}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedItem && (
        <MenuItemModal
          item={selectedItem}
          restaurantId={restaurant.id}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  )
}

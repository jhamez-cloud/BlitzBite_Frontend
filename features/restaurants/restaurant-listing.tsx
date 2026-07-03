"use client"

import { useState, useMemo } from "react"
import { SlidersHorizontal, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RestaurantCard } from "@/components/restaurant-card"
import { CategoryChip } from "@/components/category-chip"
import { EmptyState } from "@/components/empty-state"
import type { Restaurant, RestaurantCategory } from "@/types"

interface RestaurantListingClientProps {
  restaurants: Restaurant[]
  categories: RestaurantCategory[]
}

type SortOption = "rating" | "delivery_time" | "delivery_fee"

export function RestaurantListingClient({
  restaurants,
  categories,
}: RestaurantListingClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>("rating")
  const [openOnly, setOpenOnly] = useState(false)

  const filtered = useMemo(() => {
    let result = [...restaurants]

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.categories.some((c) => c.toLowerCase().includes(q))
      )
    }

    if (selectedCategory) {
      result = result.filter((r) =>
        r.categories.some(
          (c) => c.toLowerCase() === selectedCategory.toLowerCase()
        )
      )
    }

    if (openOnly) {
      result = result.filter((r) => r.isOpen)
    }

    result.sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating
      if (sortBy === "delivery_fee") return a.deliveryFee - b.deliveryFee
      return 0
    })

    return result
  }, [restaurants, searchQuery, selectedCategory, sortBy, openOnly])

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold sm:text-3xl">All Restaurants</h1>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search restaurants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
          >
            <option value="rating">Top Rated</option>
            <option value="delivery_fee">Lowest Fee</option>
            <option value="delivery_time">Fastest</option>
          </select>

          <Button
            variant={openOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setOpenOnly(!openOnly)}
            className="rounded-xl"
          >
            Open Now
          </Button>

          <Button variant="outline" size="icon" className="rounded-xl">
            <SlidersHorizontal className="size-4" />
          </Button>
        </div>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <CategoryChip
          label="All"
          isActive={!selectedCategory}
          onClick={() => setSelectedCategory(null)}
        />
        {categories.map((cat) => (
          <CategoryChip
            key={cat.id}
            label={cat.name}
            icon={cat.icon}
            isActive={selectedCategory === cat.name}
            onClick={() =>
              setSelectedCategory(
                selectedCategory === cat.name ? null : cat.name
              )
            }
          />
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="No restaurants found"
          description="Try adjusting your search or filters to find what you're looking for."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery("")
            setSelectedCategory(null)
            setOpenOnly(false)
          }}
        />
      )}
    </div>
  )
}

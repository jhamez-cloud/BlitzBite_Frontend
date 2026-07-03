"use client"

import { useState, useEffect, useMemo } from "react"
import { Search as SearchIcon, Clock3, TrendingUp, X } from "lucide-react"
import Link from "next/link"
import { RestaurantCard } from "@/components/restaurant-card"
import { FoodCard } from "@/components/food-card"
import { EmptyState } from "@/components/empty-state"
import { restaurants } from "@/mock-data/restaurants"
import { menuItems } from "@/mock-data/menu"

const trendingSearches = [
  "Jollof Rice",
  "Burger",
  "Pizza",
  "Shawarma",
  "Smoothie",
  "Tilapia",
]

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Burger House",
    "Jollof Rice",
  ])

  const results = useMemo(() => {
    if (!query.trim()) return null
    const q = query.toLowerCase()
    return {
      restaurants: restaurants.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.categories.some((c) => c.toLowerCase().includes(q))
      ),
      meals: menuItems.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q)
      ),
    }
  }, [query])

  const handleSearch = (term: string) => {
    setQuery(term)
    if (!recentSearches.includes(term)) {
      setRecentSearches((prev) => [term, ...prev.slice(0, 4)])
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for restaurants or food..."
          className="w-full rounded-2xl border border-border bg-card py-3.5 pl-12 pr-10 text-base outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {!results && (
        <div className="mt-8 space-y-8">
          {recentSearches.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Clock3 className="size-4" />
                Recent Searches
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {recentSearches.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSearch(s)}
                    className="rounded-full border border-border bg-card px-4 py-1.5 text-sm transition-colors hover:border-primary/50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <TrendingUp className="size-4" />
              Trending Searches
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {trendingSearches.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSearch(s)}
                  className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {results && (
        <div className="mt-6 space-y-8">
          {results.restaurants.length === 0 && results.meals.length === 0 && (
            <EmptyState
              icon={SearchIcon}
              title="No results found"
              description={`We couldn't find anything matching "${query}". Try a different search.`}
              actionLabel="Clear Search"
              onAction={() => setQuery("")}
            />
          )}

          {results.restaurants.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold">
                Restaurants ({results.restaurants.length})
              </h3>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {results.restaurants.map((r) => (
                  <RestaurantCard key={r.id} restaurant={r} />
                ))}
              </div>
            </div>
          )}

          {results.meals.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold">
                Menu Items ({results.meals.length})
              </h3>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {results.meals.map((m) => (
                  <FoodCard key={m.id} item={m} onCardClick={() => {}} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

"use client"

import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { FoodCard } from "@/components/food-card"
import type { MenuItem } from "@/types"

interface PopularMealsProps {
  meals: MenuItem[]
}

export function PopularMeals({ meals }: PopularMealsProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold sm:text-2xl">Popular Right Now</h2>
        <Link
          href="/restaurants"
          className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View all
          <ChevronRight className="size-4" />
        </Link>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {meals.slice(0, 8).map((meal) => (
          <FoodCard
            key={meal.id}
            item={meal}
            onCardClick={() => {}}
          />
        ))}
      </div>
    </section>
  )
}

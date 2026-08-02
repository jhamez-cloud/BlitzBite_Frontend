"use client"

import Link from "next/link"
import { CategoryChip } from "@/components/category-chip"
import type { RestaurantCategory } from "@/types"

interface CategoriesSectionProps {
  categories: RestaurantCategory[]
}

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 className="text-xl font-bold sm:text-2xl">What are you craving?</h2>
      <div className="mt-4 flex scrollbar-none gap-3 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <Link key={cat.id} href={`/restaurants?category=${cat.slug}`}>
            <CategoryChip label={cat.name} icon={cat.icon} />
          </Link>
        ))}
      </div>
    </section>
  )
}

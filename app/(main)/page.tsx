import { HeroSection } from "@/features/home/hero-section"
import { CategoriesSection } from "@/features/home/categories-section"
import { FeaturedRestaurants } from "@/features/home/featured-restaurants"
import { PromotionsCarousel } from "@/features/home/promotions-carousel"
import { PopularMeals } from "@/features/home/popular-meals"
import { TrendingRestaurants } from "@/features/home/trending-restaurants"
import { WhyChooseUs } from "@/features/home/why-choose-us"
import { Testimonials } from "@/features/home/testimonials"
import {
  getFeaturedRestaurants,
  getTrendingRestaurants,
} from "@/lib/services/restaurant"
import { getPopularMenuItems } from "@/lib/services/menu"
import { getPromotions } from "@/lib/services/promotion"
import { getCategories } from "@/lib/services/category"
import { getReviews } from "@/lib/services/review"

export default async function HomePage() {
  const [
    featuredRestaurants,
    trendingRestaurants,
    popularMeals,
    promotions,
    categories,
    reviews,
  ] = await Promise.all([
    getFeaturedRestaurants(),
    getTrendingRestaurants(),
    getPopularMenuItems(),
    getPromotions(),
    getCategories(),
    getReviews(),
  ])

  return (
    <div className="space-y-12 pb-12 md:space-y-16">
      <HeroSection />
      <CategoriesSection categories={categories} />
      <PromotionsCarousel promotions={promotions} />
      <FeaturedRestaurants restaurants={featuredRestaurants} />
      <PopularMeals meals={popularMeals} />
      <TrendingRestaurants restaurants={trendingRestaurants} />
      <WhyChooseUs />
      <Testimonials reviews={reviews} />
    </div>
  )
}

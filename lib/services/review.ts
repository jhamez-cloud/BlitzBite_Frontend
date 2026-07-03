import { reviews, reviewSummary } from "@/mock-data/reviews"
import type { Review, ReviewSummary } from "@/types"

export async function getReviews(
  restaurantId?: number
): Promise<Review[]> {
  if (restaurantId) {
    return reviews.filter((r) => r.restaurantId === restaurantId)
  }
  return reviews
}

export async function getReviewSummary(): Promise<ReviewSummary> {
  return reviewSummary
}

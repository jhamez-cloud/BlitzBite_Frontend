export interface Review {
  id: number
  userId: number
  userName: string
  userAvatar: string
  restaurantId: number
  rating: number
  comment: string
  date: string
  images?: string[]
}

export interface ReviewSummary {
  average: number
  total: number
  breakdown: RatingBreakdown[]
}

export interface RatingBreakdown {
  stars: number
  count: number
  percentage: number
}

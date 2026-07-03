import { ReviewCard } from "@/components/review-card"
import type { Review } from "@/types"

interface TestimonialsProps {
  reviews: Review[]
}

export function Testimonials({ reviews }: TestimonialsProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-xl font-bold sm:text-2xl">
          What Our Customers Say
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
          Real reviews from real food lovers.
        </p>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.slice(0, 6).map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  )
}

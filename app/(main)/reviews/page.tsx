import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { ReviewCard } from "@/components/review-card"
import { getReviews, getReviewSummary } from "@/lib/services/review"

export const metadata = { title: "Reviews" }

export default async function ReviewsPage() {
  const [reviews, summary] = await Promise.all([
    getReviews(),
    getReviewSummary(),
  ])

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <h1 className="text-2xl font-bold">Reviews</h1>

      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-4xl font-bold">{summary.average}</p>
            <div className="mt-1 flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "size-4",
                    i < Math.round(summary.average)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-muted text-muted"
                  )}
                />
              ))}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {summary.total} reviews
            </p>
          </div>

          <div className="flex-1 space-y-1.5">
            {summary.breakdown.map((b) => (
              <div key={b.stars} className="flex items-center gap-2">
                <span className="w-3 text-xs text-muted-foreground">
                  {b.stars}
                </span>
                <Star className="size-3 fill-yellow-400 text-yellow-400" />
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-yellow-400"
                    style={{ width: `${b.percentage}%` }}
                  />
                </div>
                <span className="w-8 text-right text-xs text-muted-foreground">
                  {b.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  )
}

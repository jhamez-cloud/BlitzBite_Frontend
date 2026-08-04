"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import {
  Star,
  MessageSquareQuote,
  EyeOff,
  Eye,
  Trash2,
  Search,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { PageHeader } from "@/components/dashboard/page-header"
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog"
import { inputClass } from "@/components/dashboard/form-field"
import { useDashboard } from "@/features/dashboard/dashboard-store"
import { useToast } from "@/hooks/use-toast"

export function ReviewsManagement() {
  const { myReviews, ownerRestaurant, deleteReview, toggleReviewHidden } =
    useDashboard()
  const { toast } = useToast()

  const [search, setSearch] = useState("")
  const [ratingFilter, setRatingFilter] = useState<number | null>(null)
  const [showHidden, setShowHidden] = useState(true)
  const [deleting, setDeleting] = useState<(typeof myReviews)[number] | null>(
    null
  )

  const summary = useMemo(() => {
    const total = myReviews.length
    const average =
      total > 0 ? myReviews.reduce((s, r) => s + r.rating, 0) / total : 0
    const breakdown = [5, 4, 3, 2, 1].map((stars) => {
      const count = myReviews.filter((r) => r.rating === stars).length
      return {
        stars,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      }
    })
    return { total, average, breakdown }
  }, [myReviews])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return myReviews.filter((r) => {
      if (!showHidden && r.hidden) return false
      if (ratingFilter !== null && r.rating !== ratingFilter) return false
      if (!q) return true
      return (
        r.userName.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q)
      )
    })
  }, [myReviews, search, ratingFilter, showHidden])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reviews"
        subtitle={`Ratings and feedback for ${ownerRestaurant.name} — scoped to your restaurant.`}
      />

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* Summary card */}
        <div className="h-fit rounded-2xl border border-border bg-card p-5">
          <div className="text-center">
            <p className="text-4xl font-bold">{summary.average.toFixed(1)}</p>
            <div className="mt-1 flex items-center justify-center gap-0.5">
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
            <p className="mt-1 text-xs text-muted-foreground">
              {summary.total} review{summary.total !== 1 ? "s" : ""} for{" "}
              {ownerRestaurant.name}
            </p>
          </div>

          <div className="mt-5 space-y-2">
            {summary.breakdown.map((row) => (
              <div key={row.stars} className="flex items-center gap-2 text-sm">
                <span className="flex w-6 items-center gap-0.5 text-xs font-medium">
                  {row.stars}
                  <Star className="size-3 fill-yellow-400 text-yellow-400" />
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-yellow-400 transition-all"
                    style={{ width: `${row.percentage}%` }}
                  />
                </div>
                <span className="w-8 text-right text-xs text-muted-foreground">
                  {row.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Review list */}
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search reviews..."
                className={cn(inputClass, "py-2.5 pr-4 pl-10")}
              />
            </div>

            <div className="flex gap-1 rounded-full border border-border bg-card p-1">
              <button
                onClick={() => setRatingFilter(null)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                  ratingFilter === null
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                All
              </button>
              {[5, 4, 3, 2, 1].map((n) => (
                <button
                  key={n}
                  onClick={() => setRatingFilter(ratingFilter === n ? null : n)}
                  className={cn(
                    "flex items-center gap-0.5 rounded-full px-2.5 py-1.5 text-sm font-medium transition-colors",
                    ratingFilter === n
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {n}
                  <Star
                    className={cn(
                      "size-3",
                      ratingFilter === n
                        ? "fill-primary-foreground"
                        : "fill-yellow-400 text-yellow-400"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <label className="flex w-fit cursor-pointer items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={showHidden}
              onChange={(e) => setShowHidden(e.target.checked)}
              className="size-4 accent-[var(--primary)]"
            />
            Show hidden reviews
          </label>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card/50 px-4 py-16 text-center">
              <MessageSquareQuote className="size-8 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium">No reviews found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filters.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((review) => (
                <div
                  key={review.id}
                  className={cn(
                    "rounded-2xl border bg-card p-4",
                    review.hidden
                      ? "border-dashed border-border opacity-70"
                      : "border-border"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
                      <Image
                        src={review.userAvatar}
                        alt={review.userName}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <p className="text-sm font-semibold">
                          {review.userName}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          on {ownerRestaurant.name}
                        </span>
                        {review.hidden && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                            <EyeOff className="size-3" />
                            Hidden
                          </span>
                        )}
                      </div>

                      <div className="mt-0.5 flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "size-3.5",
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-muted text-muted"
                            )}
                          />
                        ))}
                        <span className="ml-1 text-xs text-muted-foreground">
                          {review.date}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-muted-foreground">
                        {review.comment}
                      </p>
                    </div>

                    <div className="flex shrink-0 gap-1.5">
                      <button
                        onClick={() => {
                          toggleReviewHidden(review.id)
                          toast(
                            review.hidden
                              ? "Review restored"
                              : "Review hidden from customers"
                          )
                        }}
                        className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label={
                          review.hidden ? "Show review" : "Hide review"
                        }
                      >
                        {review.hidden ? (
                          <Eye className="size-3.5" />
                        ) : (
                          <EyeOff className="size-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => setDeleting(review)}
                        className="flex size-8 items-center justify-center rounded-lg border border-destructive/30 text-destructive transition-colors hover:bg-destructive/10"
                        aria-label="Delete review"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) {
            deleteReview(deleting.id)
            toast("Review deleted")
          }
          setDeleting(null)
        }}
        title="Delete this review?"
        description="The review will be permanently removed and can no longer be seen by customers."
        confirmLabel="Delete review"
      />
    </div>
  )
}

import Link from "next/link"
import { Search, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SITE_NAME } from "@/constants/site"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-primary/5 via-background to-orange-50/50 dark:from-primary/10 dark:via-background dark:to-orange-950/20">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <MapPin className="size-3.5" />
            Delivering across Accra
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Delicious Food&nbsp;,&nbsp;
            
            <span className="bg-linear-to-r from-primary to-orange-500 bg-clip-text text-transparent">
              Delivered Fast
            </span>
          </h1>

          <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
            Order from the best restaurants in Accra. Fresh meals at your
            doorstep in minutes with {SITE_NAME}.
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
            <Link href="/search" className="flex-1">
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm transition-shadow hover:shadow-md">
                <Search className="size-5 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Search for restaurants or food...
                </span>
              </div>
            </Link>

            <Link href="/restaurants">
              <Button size="lg" className="rounded-2xl px-6">
                Browse All
              </Button>
            </Link>
          </div>

          <div className="mt-8 flex w-full items-center justify-between gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30">
                ⚡
              </div>
              <span>20 min avg</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30">
                🏪
              </div>
              <span>200+ restaurants</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30">
                ⭐
              </div>
              <span>4.8 avg rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

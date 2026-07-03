import { Bike, Clock3, ShieldCheck, Headphones } from "lucide-react"

const features = [
  {
    icon: Bike,
    title: "Lightning Fast Delivery",
    description:
      "Average delivery time of 20 minutes. Your food arrives hot and fresh.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Guaranteed",
    description:
      "Every restaurant is vetted for quality. We only partner with the best.",
  },
  {
    icon: Clock3,
    title: "Real-Time Tracking",
    description:
      "Track your order every step of the way from kitchen to your door.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description:
      "Our support team is always here to help with any issues or questions.",
  },
]

export function WhyChooseUs() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-xl font-bold sm:text-2xl">
          Why Choose BlitzBite?
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
          We make food delivery simple, fast, and reliable.
        </p>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <div
              key={feature.title}
              className="rounded-2xl border border-border bg-card p-6 text-center transition-shadow hover:shadow-md"
            >
              <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10">
                <Icon className="size-6 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

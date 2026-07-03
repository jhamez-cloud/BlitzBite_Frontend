"use client"

import { cn } from "@/lib/utils"
import { CircleCheck } from "lucide-react"

interface CheckoutStepperProps {
  steps: string[]
  currentStep: number
  className?: string
}

export function CheckoutStepper({
  steps,
  currentStep,
  className,
}: CheckoutStepperProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={cn(
                "flex size-8 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                index < currentStep
                  ? "bg-primary text-primary-foreground"
                  : index === currentStep
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                    : "bg-muted text-muted-foreground"
              )}
            >
              {index < currentStep ? (
                <CircleCheck className="size-5" />
              ) : (
                index + 1
              )}
            </div>
            <span
              className={cn(
                "text-xs font-medium",
                index <= currentStep
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "mx-2 h-0.5 w-8 sm:w-16",
                index < currentStep ? "bg-primary" : "bg-muted"
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}

"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAdminAuth } from "@/hooks/use-admin-auth"

interface AdminSignupValues {
  name: string
  restaurantName: string
  email: string
  password: string
}

const inputClass =
  "w-full rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"

export function AdminSignupForm({ next }: { next: string }) {
  const router = useRouter()
  const { signup } = useAdminAuth()
  const [formError, setFormError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminSignupValues>({
    defaultValues: { name: "", restaurantName: "", email: "", password: "" },
  })

  const onSubmit = handleSubmit((values) => {
    setFormError(null)
    const result = signup(
      values.name,
      values.email,
      values.password,
      values.restaurantName
    )
    if (!result.ok) {
      setFormError(result.error ?? "Something went wrong.")
      return
    }
    // Signup does not auto-login — send to login (admin mode) with a flag.
    const params = new URLSearchParams({
      role: "admin",
      next,
      created: "1",
    })
    router.push(`/login?${params.toString()}`)
  })

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <label htmlFor="admin-name" className="text-sm font-medium">
          Your name
        </label>
        <input
          id="admin-name"
          type="text"
          autoComplete="name"
          placeholder="Kwame Mensah"
          className={cn(inputClass, errors.name && "border-destructive")}
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="admin-restaurant" className="text-sm font-medium">
          Restaurant name
        </label>
        <input
          id="admin-restaurant"
          type="text"
          autoComplete="organization"
          placeholder="Mensah's Kitchen"
          className={cn(
            inputClass,
            errors.restaurantName && "border-destructive"
          )}
          {...register("restaurantName", {
            required: "Restaurant name is required",
          })}
        />
        {errors.restaurantName && (
          <p className="text-xs text-destructive">
            {errors.restaurantName.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="admin-email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="admin-email"
          type="email"
          autoComplete="email"
          placeholder="owner@restaurant.com"
          className={cn(inputClass, errors.email && "border-destructive")}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email",
            },
          })}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="admin-password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 6 characters"
          className={cn(inputClass, errors.password && "border-destructive")}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      {formError && (
        <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {formError}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        Create restaurant account
      </Button>
    </form>
  )
}

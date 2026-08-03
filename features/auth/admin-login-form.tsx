"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAdminAuth } from "@/hooks/use-admin-auth"

interface AdminLoginValues {
  email: string
  password: string
}

const inputClass =
  "w-full rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"

export function AdminLoginForm({ next }: { next: string }) {
  const router = useRouter()
  const { login } = useAdminAuth()
  const [formError, setFormError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginValues>({
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = handleSubmit((values) => {
    setFormError(null)
    const result = login(values.email, values.password)
    if (!result.ok) {
      setFormError(result.error ?? "Something went wrong.")
      return
    }
    router.push(next)
  })

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
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
          {...register("email", { required: "Email is required" })}
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
          autoComplete="current-password"
          placeholder="••••••••"
          className={cn(inputClass, errors.password && "border-destructive")}
          {...register("password", { required: "Password is required" })}
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
        Sign in to dashboard
      </Button>
    </form>
  )
}

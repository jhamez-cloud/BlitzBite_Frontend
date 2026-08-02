"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

interface SignupValues {
  name: string
  email: string
  password: string
}

const inputClass =
  "w-full rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"

export function SignupForm({ next }: { next: string }) {
  const router = useRouter()
  const { signup } = useAuth()
  const [formError, setFormError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    defaultValues: { name: "", email: "", password: "" },
  })

  const onSubmit = handleSubmit((values) => {
    setFormError(null)
    const result = signup(values.name, values.email, values.password)
    if (!result.ok) {
      setFormError(result.error ?? "Something went wrong.")
      return
    }
    // Signup does not auto-login — send to login with a success flag.
    router.push(`/login?next=${encodeURIComponent(next)}&created=1`)
  })

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <label htmlFor="name" className="text-sm font-medium">
          Full name
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="Ama Serwaa"
          className={cn(inputClass, errors.name && "border-destructive")}
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@email.com"
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
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="password"
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
        Create account
      </Button>

      <Link
        href={`/login?next=${encodeURIComponent(next)}`}
        className="block text-center text-sm text-muted-foreground hover:text-foreground"
      >
        Already have an account?{" "}
        <span className="font-medium text-primary">Sign in</span>
      </Link>
    </form>
  )
}

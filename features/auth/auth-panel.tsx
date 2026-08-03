"use client"

import { useState } from "react"
import { User, Store } from "lucide-react"
import { cn } from "@/lib/utils"
import { LoginForm } from "@/features/auth/login-form"
import { SignupForm } from "@/features/auth/signup-form"
import { AdminLoginForm } from "@/features/auth/admin-login-form"
import { AdminSignupForm } from "@/features/auth/admin-signup-form"
import { DEMO_ACCOUNT } from "@/lib/services/auth"
import { DEMO_ADMIN } from "@/lib/services/admin-auth"

type Role = "user" | "admin"
type Mode = "login" | "signup"

const roles: { key: Role; label: string; icon: typeof User }[] = [
  { key: "user", label: "Customer", icon: User },
  { key: "admin", label: "Restaurant Owner", icon: Store },
]

const copy: Record<Role, Record<Mode, { title: string; subtitle: string }>> = {
  user: {
    login: {
      title: "Welcome back",
      subtitle: "Sign in to your account to continue",
    },
    signup: {
      title: "Get started",
      subtitle: "Create your account to order in seconds",
    },
  },
  admin: {
    login: {
      title: "Owner sign in",
      subtitle: "Access your restaurant dashboard",
    },
    signup: {
      title: "Register your restaurant",
      subtitle: "Create an owner account to manage your restaurant",
    },
  },
}

export function AuthPanel({
  next,
  initialRole = "user",
  initialMode = "login",
  showCreated = false,
}: {
  next: string
  initialRole?: Role
  initialMode?: Mode
  showCreated?: boolean
}) {
  const [role, setRole] = useState<Role>(initialRole)
  const [mode, setMode] = useState<Mode>(initialMode)

  // The user side defaults to "/"; admins always land on the dashboard.
  const target =
    role === "admin" && (next === "/" || !next) ? "/dashboard" : next
  const demo = role === "admin" ? DEMO_ADMIN : DEMO_ACCOUNT
  const { title, subtitle } = copy[role][mode]

  return (
    <div>
      {/* Role toggle */}
      <div className="mt-6 grid grid-cols-2 gap-1 rounded-full border border-border bg-muted/50 p-1">
        {roles.map((r) => {
          const Icon = r.icon
          const isActive = r.key === role
          return (
            <button
              key={r.key}
              type="button"
              onClick={() => setRole(r.key)}
              className={cn(
                "flex items-center justify-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="size-4" />
              {r.label}
            </button>
          )
        })}
      </div>

      <div className="mt-6 text-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>

      {showCreated && mode === "login" && (
        <p className="mt-6 rounded-xl bg-primary/10 px-3 py-2 text-center text-sm font-medium text-primary">
          Account created — please sign in.
        </p>
      )}

      <div className="mt-6">
        {role === "user" && mode === "login" && <LoginForm next={target} />}
        {role === "user" && mode === "signup" && <SignupForm next={target} />}
        {role === "admin" && mode === "login" && (
          <AdminLoginForm next={target} />
        )}
        {role === "admin" && mode === "signup" && (
          <AdminSignupForm next={target} />
        )}
      </div>

      {/* Mode switch */}
      <button
        type="button"
        onClick={() => setMode(mode === "login" ? "signup" : "login")}
        className="mt-4 block w-full text-center text-sm text-muted-foreground hover:text-foreground"
      >
        {mode === "login" ? (
          <>
            {role === "admin" ? "New restaurant?" : "New to us?"}{" "}
            <span className="font-medium text-primary">
              {role === "admin" ? "Register" : "Create an account"}
            </span>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <span className="font-medium text-primary">Sign in</span>
          </>
        )}
      </button>

      {/* Demo credentials hint */}
      <div className="mt-6 rounded-xl border border-dashed border-border bg-muted/40 p-3 text-center text-xs text-muted-foreground">
        <p className="font-semibold text-foreground">
          Demo {role === "admin" ? "owner" : "customer"} credentials
        </p>
        <p className="mt-1">
          {demo.email} · {demo.password}
        </p>
      </div>
    </div>
  )
}

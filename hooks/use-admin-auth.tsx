"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { useRouter } from "next/navigation"
import type { AdminUser } from "@/types"
import {
  addAdminAccount,
  adminEmailExists,
  clearAdminSession,
  findAdminAccount,
  readAdminAccounts,
  readAdminSession,
  seedDemoAdmin,
  writeAdminSession,
} from "@/lib/services/admin-auth"

type AuthStatus = "loading" | "authenticated" | "unauthenticated"

interface AuthResult {
  ok: boolean
  error?: string
}

interface AdminAuthContextValue {
  admin: AdminUser | null
  status: AuthStatus
  login: (email: string, password: string) => AuthResult
  signup: (
    name: string,
    email: string,
    password: string,
    restaurantName: string
  ) => AuthResult
  logout: () => void
  requireAdmin: (next?: string) => boolean
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null)

interface AdminAuthState {
  admin: AdminUser | null
  status: AuthStatus
}

function adminFromEmail(email: string): AdminUser | null {
  const account = readAdminAccounts().find(
    (a) => a.email.trim().toLowerCase() === email.trim().toLowerCase()
  )
  if (!account) return null
  return {
    name: account.name,
    email: account.email,
    restaurantName: account.restaurantName,
  }
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [state, setState] = useState<AdminAuthState>({
    admin: null,
    status: "loading",
  })
  const { admin, status } = state

  useEffect(() => {
    // One-time hydration from localStorage (client-only external store).
    seedDemoAdmin()
    const session = readAdminSession()
    const hydrated = session ? adminFromEmail(session) : null
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing React with the localStorage session on mount
    setState(
      hydrated
        ? { admin: hydrated, status: "authenticated" }
        : { admin: null, status: "unauthenticated" }
    )
  }, [])

  const login = useCallback((email: string, password: string): AuthResult => {
    const account = findAdminAccount(email, password)
    if (!account) {
      return { ok: false, error: "Invalid email or password." }
    }
    writeAdminSession(account.email)
    setState({
      admin: {
        name: account.name,
        email: account.email,
        restaurantName: account.restaurantName,
      },
      status: "authenticated",
    })
    return { ok: true }
  }, [])

  const signup = useCallback(
    (
      name: string,
      email: string,
      password: string,
      restaurantName: string
    ): AuthResult => {
      if (adminEmailExists(email)) {
        return {
          ok: false,
          error: "An admin account with this email already exists.",
        }
      }
      addAdminAccount({
        name: name.trim(),
        email: email.trim(),
        password,
        restaurantName: restaurantName.trim(),
      })
      // Intentionally does not log the admin in — they sign in afterwards.
      return { ok: true }
    },
    []
  )

  const logout = useCallback(() => {
    clearAdminSession()
    setState({ admin: null, status: "unauthenticated" })
  }, [])

  const requireAdmin = useCallback(
    (next?: string): boolean => {
      if (status === "authenticated") return true
      const params = new URLSearchParams({ role: "admin" })
      if (next) params.set("next", next)
      router.push(`/login?${params.toString()}`)
      return false
    },
    [status, router]
  )

  return (
    <AdminAuthContext.Provider
      value={{ admin, status, login, signup, logout, requireAdmin }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider")
  }
  return context
}

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
import type { AuthUser } from "@/types"
import {
  addAccount,
  clearSession,
  emailExists,
  findAccount,
  readAccounts,
  readSession,
  seedDemoAccount,
  writeSession,
} from "@/lib/services/auth"

type AuthStatus = "loading" | "authenticated" | "unauthenticated"

interface AuthResult {
  ok: boolean
  error?: string
}

interface AuthContextValue {
  user: AuthUser | null
  status: AuthStatus
  login: (email: string, password: string) => AuthResult
  signup: (name: string, email: string, password: string) => AuthResult
  logout: () => void
  requireAuth: (next?: string) => boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

interface AuthState {
  user: AuthUser | null
  status: AuthStatus
}

function userFromEmail(email: string): AuthUser | null {
  const account = readAccounts().find(
    (a) => a.email.trim().toLowerCase() === email.trim().toLowerCase()
  )
  if (!account) return null
  return { name: account.name, email: account.email }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [state, setState] = useState<AuthState>({
    user: null,
    status: "loading",
  })
  const { user, status } = state

  useEffect(() => {
    // One-time hydration from localStorage (client-only external store).
    seedDemoAccount()
    const session = readSession()
    const hydrated = session ? userFromEmail(session) : null
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing React with the localStorage session on mount
    setState(
      hydrated
        ? { user: hydrated, status: "authenticated" }
        : { user: null, status: "unauthenticated" }
    )
  }, [])

  const login = useCallback((email: string, password: string): AuthResult => {
    const account = findAccount(email, password)
    if (!account) {
      return { ok: false, error: "Invalid email or password." }
    }
    writeSession(account.email)
    setState({
      user: { name: account.name, email: account.email },
      status: "authenticated",
    })
    return { ok: true }
  }, [])

  const signup = useCallback(
    (name: string, email: string, password: string): AuthResult => {
      if (emailExists(email)) {
        return {
          ok: false,
          error: "An account with this email already exists.",
        }
      }
      addAccount({ name: name.trim(), email: email.trim(), password })
      // Intentionally does not log the user in — they sign in afterwards.
      return { ok: true }
    },
    []
  )

  const logout = useCallback(() => {
    clearSession()
    setState({ user: null, status: "unauthenticated" })
  }, [])

  const requireAuth = useCallback(
    (next?: string): boolean => {
      if (status === "authenticated") return true
      const query = next ? `?next=${encodeURIComponent(next)}` : ""
      router.push(`/login${query}`)
      return false
    },
    [status, router]
  )

  return (
    <AuthContext.Provider
      value={{ user, status, login, signup, logout, requireAuth }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

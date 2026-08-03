import type { AdminAccount } from "@/types"

const ADMIN_ACCOUNTS_KEY = "blitzbite:admin-accounts"
const ADMIN_SESSION_KEY = "blitzbite:admin-session"

// Demo admin seeded on first load so the dashboard is testable immediately.
export const DEMO_ADMIN: AdminAccount = {
  name: "Kwame Mensah",
  email: "owner@blitzbite.com",
  password: "admin1234",
  restaurantName: "Mensah's Kitchen",
}

function isBrowser() {
  return typeof window !== "undefined"
}

export function readAdminAccounts(): AdminAccount[] {
  if (!isBrowser()) return []
  try {
    const raw = window.localStorage.getItem(ADMIN_ACCOUNTS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as AdminAccount[]) : []
  } catch {
    return []
  }
}

export function writeAdminAccounts(accounts: AdminAccount[]) {
  if (!isBrowser()) return
  window.localStorage.setItem(ADMIN_ACCOUNTS_KEY, JSON.stringify(accounts))
}

// Ensures the demo admin exists exactly once. Safe to call repeatedly.
export function seedDemoAdmin() {
  if (!isBrowser()) return
  const accounts = readAdminAccounts()
  if (!accounts.some((a) => a.email === DEMO_ADMIN.email)) {
    writeAdminAccounts([DEMO_ADMIN, ...accounts])
  }
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export function adminEmailExists(email: string): boolean {
  const target = normalizeEmail(email)
  return readAdminAccounts().some((a) => normalizeEmail(a.email) === target)
}

export function findAdminAccount(
  email: string,
  password: string
): AdminAccount | null {
  const target = normalizeEmail(email)
  return (
    readAdminAccounts().find(
      (a) => normalizeEmail(a.email) === target && a.password === password
    ) ?? null
  )
}

export function addAdminAccount(account: AdminAccount) {
  writeAdminAccounts([...readAdminAccounts(), account])
}

export function readAdminSession(): string | null {
  if (!isBrowser()) return null
  return window.localStorage.getItem(ADMIN_SESSION_KEY)
}

export function writeAdminSession(email: string) {
  if (!isBrowser()) return
  window.localStorage.setItem(ADMIN_SESSION_KEY, email)
}

export function clearAdminSession() {
  if (!isBrowser()) return
  window.localStorage.removeItem(ADMIN_SESSION_KEY)
}

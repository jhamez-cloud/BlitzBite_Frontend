import type { AuthAccount } from "@/types"

const ACCOUNTS_KEY = "blitzbite:accounts"
const SESSION_KEY = "blitzbite:session"

// Demo account seeded on first load so the app is testable immediately.
// Matches mock-data/user.ts so the profile page stays coherent.
export const DEMO_ACCOUNT: AuthAccount = {
  name: "Ama Serwaa",
  email: "ama.serwaa@email.com",
  password: "demo1234",
}

function isBrowser() {
  return typeof window !== "undefined"
}

export function readAccounts(): AuthAccount[] {
  if (!isBrowser()) return []
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as AuthAccount[]) : []
  } catch {
    return []
  }
}

export function writeAccounts(accounts: AuthAccount[]) {
  if (!isBrowser()) return
  window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
}

// Ensures the demo account exists exactly once. Safe to call repeatedly.
export function seedDemoAccount() {
  if (!isBrowser()) return
  const accounts = readAccounts()
  if (!accounts.some((a) => a.email === DEMO_ACCOUNT.email)) {
    writeAccounts([DEMO_ACCOUNT, ...accounts])
  }
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export function emailExists(email: string): boolean {
  const target = normalizeEmail(email)
  return readAccounts().some((a) => normalizeEmail(a.email) === target)
}

export function findAccount(
  email: string,
  password: string
): AuthAccount | null {
  const target = normalizeEmail(email)
  return (
    readAccounts().find(
      (a) => normalizeEmail(a.email) === target && a.password === password
    ) ?? null
  )
}

export function addAccount(account: AuthAccount) {
  writeAccounts([...readAccounts(), account])
}

export function readSession(): string | null {
  if (!isBrowser()) return null
  return window.localStorage.getItem(SESSION_KEY)
}

export function writeSession(email: string) {
  if (!isBrowser()) return
  window.localStorage.setItem(SESSION_KEY, email)
}

export function clearSession() {
  if (!isBrowser()) return
  window.localStorage.removeItem(SESSION_KEY)
}

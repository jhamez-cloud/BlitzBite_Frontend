import { AuthShell } from "@/components/auth/auth-shell"
import { AuthPanel } from "@/features/auth/auth-panel"

export const metadata = { title: "Create account" }

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; role?: string }>
}) {
  const { next, role } = await searchParams
  const target = next && next.startsWith("/") ? next : "/"
  const initialRole = role === "admin" ? "admin" : "user"

  return (
    <AuthShell>
      <AuthPanel next={target} initialRole={initialRole} initialMode="signup" />
    </AuthShell>
  )
}

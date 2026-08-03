import { AuthShell } from "@/components/auth/auth-shell"
import { AuthPanel } from "@/features/auth/auth-panel"

export const metadata = { title: "Sign in" }

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; created?: string; role?: string }>
}) {
  const { next, created, role } = await searchParams
  const target = next && next.startsWith("/") ? next : "/"
  const initialRole = role === "admin" ? "admin" : "user"

  return (
    <AuthShell>
      <AuthPanel
        next={target}
        initialRole={initialRole}
        initialMode="login"
        showCreated={Boolean(created)}
      />
    </AuthShell>
  )
}

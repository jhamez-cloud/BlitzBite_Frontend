import { AuthShell } from "@/components/auth/auth-shell"
import { LoginForm } from "@/features/auth/login-form"

export const metadata = { title: "Sign in" }

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; created?: string }>
}) {
  const { next, created } = await searchParams
  const target = next && next.startsWith("/") ? next : "/"

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your account to continue"
    >
      {created && (
        <p className="mb-4 rounded-xl bg-primary/10 px-3 py-2 text-center text-sm font-medium text-primary">
          Account created — please sign in.
        </p>
      )}
      <LoginForm next={target} />
    </AuthShell>
  )
}

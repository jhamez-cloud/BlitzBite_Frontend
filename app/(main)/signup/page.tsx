import { AuthShell } from "@/components/auth/auth-shell"
import { SignupForm } from "@/features/auth/signup-form"

export const metadata = { title: "Create account" }

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams
  const target = next && next.startsWith("/") ? next : "/"

  return (
    <AuthShell
      title="Get started"
      subtitle="Create your account to order in seconds"
    >
      <SignupForm next={target} />
    </AuthShell>
  )
}

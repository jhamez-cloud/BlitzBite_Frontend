import { redirect } from "next/navigation"

// The wallet now lives inside the profile page.
export default function WalletPage() {
  redirect("/profile")
}

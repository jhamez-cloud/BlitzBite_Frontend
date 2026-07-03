import { currentUser } from "@/mock-data/user"
import type { User } from "@/types"

export async function getUser(): Promise<User> {
  return currentUser
}

import { wallet } from "@/mock-data/wallet"
import type { Wallet, WalletTransaction } from "@/types"

export async function getWallet(): Promise<Wallet> {
  return wallet
}

export async function getTransactions(): Promise<WalletTransaction[]> {
  return wallet.transactions
}

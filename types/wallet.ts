export type TransactionType = "credit" | "debit" | "refund" | "reward"

export interface WalletTransaction {
  id: number
  type: TransactionType
  description: string
  amount: number
  date: string
  reference: string
}

export interface Wallet {
  balance: number
  currency: string
  promotionalCredits: number
  rewardPoints: number
  transactions: WalletTransaction[]
}

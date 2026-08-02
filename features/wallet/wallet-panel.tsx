import {
  ArrowUpRight,
  ArrowDownRight,
  RotateCcw,
  Gift,
  Star,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatPriceShort, CURRENCY_SYMBOL } from "@/constants/site"
import type { TransactionType, Wallet } from "@/types"

const txTypeConfig: Record<
  TransactionType,
  { icon: typeof ArrowUpRight; color: string; label: string }
> = {
  credit: {
    icon: ArrowDownRight,
    color: "text-green-600 bg-green-100 dark:bg-green-900/30",
    label: "Credit",
  },
  debit: {
    icon: ArrowUpRight,
    color: "text-red-600 bg-red-100 dark:bg-red-900/30",
    label: "Debit",
  },
  refund: {
    icon: RotateCcw,
    color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
    label: "Refund",
  },
  reward: {
    icon: Gift,
    color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30",
    label: "Reward",
  },
}

export function WalletPanel({ wallet }: { wallet: Wallet }) {
  return (
    <div>
      <div className="rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground">
        <p className="text-sm opacity-80">Available Balance</p>
        <p className="mt-1 text-3xl font-bold">
          {formatPriceShort(wallet.balance)}
        </p>
        <div className="mt-4 flex gap-6 text-sm">
          <div>
            <p className="opacity-70">Promo Credits</p>
            <p className="font-semibold">
              {formatPriceShort(wallet.promotionalCredits)}
            </p>
          </div>
          <div>
            <p className="opacity-70">Reward Points</p>
            <p className="flex items-center gap-1 font-semibold">
              <Star className="size-3.5" />
              {wallet.rewardPoints}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {wallet.transactions.map((tx) => {
          const config = txTypeConfig[tx.type]
          const Icon = config.icon
          return (
            <div
              key={tx.id}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
            >
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-xl",
                  config.color
                )}
              >
                <Icon className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{tx.description}</p>
                <p className="text-xs text-muted-foreground">{tx.date}</p>
              </div>
              <span
                className={cn(
                  "font-semibold",
                  tx.amount >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                )}
              >
                {tx.amount >= 0 ? "+" : ""}
                {CURRENCY_SYMBOL}
                {Math.abs(tx.amount)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

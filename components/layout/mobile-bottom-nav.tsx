"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { mobileNavLinks } from "@/constants/navigation"

export function MobileBottomNav({ onCartOpen }: { onCartOpen: () => void }) {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-lg md:hidden">
      <div className="flex items-center justify-around py-2">
        {mobileNavLinks.map((link) => {
          const Icon = link.icon
          const isCart = link.href === "#cart"
          const isActive = !isCart && pathname === link.href

          if (isCart) {
            return (
              <button
                key={link.href}
                onClick={onCartOpen}
                className="flex flex-col items-center gap-0.5 px-3 py-1 text-muted-foreground"
              >
                <Icon className="size-5" />
                <span className="text-[10px] font-medium">{link.label}</span>
              </button>
            )
          }

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="size-5" />
              <span className="text-[10px] font-medium">{link.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

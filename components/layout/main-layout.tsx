"use client"

import { useState } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"
import { CartDrawer } from "@/features/cart/cart-drawer"
import { BackToTop } from "@/components/back-to-top"
import { ScrollProgress } from "@/components/scroll-progress"

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <>
      <ScrollProgress />
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <main className="min-h-[calc(100svh-4rem)] pb-16 md:pb-0">
        {children}
      </main>
      <Footer />
      <MobileBottomNav onCartOpen={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
      <BackToTop />
    </>
  )
}

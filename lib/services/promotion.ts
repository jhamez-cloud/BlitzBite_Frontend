import { promotions } from "@/mock-data/promotions"
import { coupons } from "@/mock-data/coupons"
import type { Promotion, Coupon } from "@/types"

export async function getPromotions(): Promise<Promotion[]> {
  return promotions
}

export async function getCoupons(): Promise<Coupon[]> {
  return coupons
}

export async function getActiveCoupons(): Promise<Coupon[]> {
  return coupons.filter((c) => !c.isUsed)
}

export interface Promotion {
  id: number
  title: string
  description: string
  image: string
  code?: string
  discount: string
  validUntil: string
  backgroundColor: string
  textColor: string
}

export interface Coupon {
  id: number
  code: string
  description: string
  discount: string
  discountType: "percentage" | "fixed"
  discountValue: number
  minimumOrder: number
  validUntil: string
  isUsed: boolean
  maxUses: number
  usedCount: number
}

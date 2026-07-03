export const SITE_NAME = "BlitzBite"
export const SITE_DESCRIPTION =
  "Premium food delivery — fast, fresh, and right to your door."
export const CURRENCY_SYMBOL = "₵"
export const CURRENCY_CODE = "GHS"

export function formatPrice(amount: number): string {
  return `${CURRENCY_SYMBOL}${amount.toFixed(2)}`
}

export function formatPriceShort(amount: number): string {
  return `${CURRENCY_SYMBOL}${amount % 1 === 0 ? amount : amount.toFixed(2)}`
}

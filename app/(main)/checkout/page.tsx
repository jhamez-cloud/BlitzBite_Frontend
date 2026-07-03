"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, CreditCard, CircleCheck, ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CheckoutStepper } from "@/components/checkout-stepper"
import { useCart } from "@/hooks/use-cart"
import { formatPriceShort } from "@/constants/site"
import { currentUser } from "@/mock-data/user"

const steps = ["Address", "Payment", "Review", "Confirm"]

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedAddress, setSelectedAddress] = useState(
    currentUser.addresses[0].id
  )
  const [selectedPayment, setSelectedPayment] = useState(
    currentUser.paymentMethods[0].id
  )
  const { items, subtotal, clearCart } = useCart()
  const router = useRouter()

  const deliveryFee = 8
  const total = subtotal + deliveryFee

  const address = currentUser.addresses.find((a) => a.id === selectedAddress)
  const payment = currentUser.paymentMethods.find(
    (p) => p.id === selectedPayment
  )

  const handleConfirm = () => {
    setCurrentStep(3)
  }

  if (currentStep === 3) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <CircleCheck className="size-10 text-green-600" />
        </div>
        <h1 className="mt-6 text-2xl font-bold">Order Confirmed!</h1>
        <p className="mt-2 text-muted-foreground">
          Your order has been placed successfully. You can track it in your
          orders page.
        </p>
        <p className="mt-4 text-lg font-semibold">
          Order #1006 · {formatPriceShort(total)}
        </p>
        <div className="mt-8 flex gap-3">
          <Button
            variant="outline"
            onClick={() => {
              clearCart()
              router.push("/orders")
            }}
          >
            View Orders
          </Button>
          <Button
            onClick={() => {
              clearCart()
              router.push("/orders/1001")
            }}
          >
            Track Order
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      <CheckoutStepper
        steps={steps}
        currentStep={currentStep}
        className="mt-6"
      />

      <div className="mt-8">
        {currentStep === 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Delivery Address</h2>
            {currentUser.addresses.map((addr) => (
              <button
                key={addr.id}
                onClick={() => setSelectedAddress(addr.id)}
                className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-colors ${
                  selectedAddress === addr.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <MapPin className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                <div>
                  <p className="font-medium">{addr.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {addr.address}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Payment Method</h2>
            {currentUser.paymentMethods.map((pm) => (
              <button
                key={pm.id}
                onClick={() => setSelectedPayment(pm.id)}
                className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-colors ${
                  selectedPayment === pm.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <CreditCard className="size-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{pm.label}</p>
                  <p className="text-sm text-muted-foreground">{pm.details}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <div className="rounded-2xl border border-border p-4">
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span>
                      {formatPriceShort(
                        (item.price +
                          item.selectedAddons.reduce(
                            (s, a) => s + a.price,
                            0
                          )) *
                          item.quantity
                      )}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPriceShort(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span>{formatPriceShort(deliveryFee)}</span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-2 border-t border-border">
                  <span>Total</span>
                  <span>{formatPriceShort(total)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Deliver to</span>
                <span className="font-medium">{address?.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pay with</span>
                <span className="font-medium">{payment?.label}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex gap-3">
        {currentStep > 0 && (
          <Button
            variant="outline"
            onClick={() => setCurrentStep((s) => s - 1)}
          >
            <ArrowLeft className="mr-2 size-4" />
            Back
          </Button>
        )}
        <Button
          className="flex-1"
          onClick={() => {
            if (currentStep < 2) setCurrentStep((s) => s + 1)
            else handleConfirm()
          }}
        >
          {currentStep === 2 ? "Place Order" : "Continue"}
          <ArrowRight className="ml-2 size-4" />
        </Button>
      </div>
    </div>
  )
}

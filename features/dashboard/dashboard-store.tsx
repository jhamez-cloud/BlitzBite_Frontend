"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { restaurants as seedRestaurants } from "@/mock-data/restaurants"
import { menuItems as seedMenuItems } from "@/mock-data/menu"
import { orders as seedOrders } from "@/mock-data/orders"
import { reviews as seedReviews } from "@/mock-data/reviews"
import { customers as seedCustomers } from "@/mock-data/customers"
import {
  ownerRestaurant as seedRestaurant,
  ownerPreferences as seedPreferences,
} from "@/mock-data/settings"
import type {
  Restaurant,
  MenuItem,
  Order,
  OrderStatus,
  Review,
  OpeningHours,
  DashboardCustomer,
  OwnerPreferences,
} from "@/types"

export type ManagedReview = Review & { hidden?: boolean }

interface DashboardContextValue {
  restaurants: Restaurant[]
  menuItems: MenuItem[]
  orders: Order[]
  reviews: ManagedReview[]
  customers: DashboardCustomer[]
  ownerRestaurant: Restaurant
  ownerPreferences: OwnerPreferences

  // Everything below is scoped to the authenticated owner's restaurant.
  myOrders: Order[]
  myReviews: ManagedReview[]
  myMenuItems: MenuItem[]

  // Menu items
  addMenuItem: (
    restaurantId: number,
    data: Omit<MenuItem, "id" | "restaurantId">
  ) => void
  updateMenuItem: (id: number, patch: Partial<MenuItem>) => void
  deleteMenuItem: (id: number) => void

  // Orders
  updateOrderStatus: (id: number, status: OrderStatus) => void
  cancelOrder: (id: number) => void

  // Reviews
  deleteReview: (id: number) => void
  toggleReviewHidden: (id: number) => void

  // Customers
  toggleCustomerStatus: (id: number) => void
  deleteCustomer: (id: number) => void

  // Settings
  updateRestaurantProfile: (patch: Partial<Restaurant>) => void
  setOpeningHours: (hours: OpeningHours[]) => void
  updatePreferences: (patch: Partial<OwnerPreferences>) => void
  resetSettings: () => void
}

const DashboardContext = createContext<DashboardContextValue | null>(null)

const nextId = (ids: number[]) => (ids.length ? Math.max(...ids) + 1 : 1)

const STATUS_FLOW: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "picked_up",
  "on_the_way",
  "delivered",
]

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Order Placed",
  confirmed: "Order Confirmed",
  preparing: "Preparing",
  ready: "Ready for Pickup",
  picked_up: "Picked Up",
  on_the_way: "On The Way",
  delivered: "Delivered",
  cancelled: "Cancelled",
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function advanceTimeline(order: Order, status: OrderStatus): Order {
  const now = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })
  const targetIndex = STATUS_FLOW.indexOf(status)
  let timeline = order.timeline.map((entry) => {
    const entryIndex = STATUS_FLOW.indexOf(entry.status)
    if (status === "cancelled") {
      // Keep prior progress intact; only mark the cancelled step.
      if (entry.status === "cancelled") {
        return { ...entry, completed: true, time: entry.time ?? now }
      }
      return entry
    }
    if (entry.status === "cancelled") return { ...entry, completed: false }
    if (entryIndex === -1 || entryIndex > targetIndex) {
      return { ...entry, completed: false, time: null }
    }
    return { ...entry, completed: true, time: entry.time ?? now }
  })

  if (
    status === "cancelled" &&
    !timeline.some((e) => e.status === "cancelled")
  ) {
    timeline = [
      ...timeline,
      {
        status: "cancelled",
        label: STATUS_LABELS.cancelled,
        time: now,
        completed: true,
      },
    ]
  }
  if (status !== "cancelled" && !timeline.some((e) => e.status === status)) {
    timeline = [
      ...timeline,
      { status, label: STATUS_LABELS[status], time: now, completed: true },
    ]
  }
  return { ...order, status, timeline }
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(seedRestaurants)
  const [menuItems, setMenuItems] = useState<MenuItem[]>(seedMenuItems)
  const [orders, setOrders] = useState<Order[]>(seedOrders)
  const [reviews, setReviews] = useState<ManagedReview[]>(seedReviews)
  const [customers, setCustomers] = useState<DashboardCustomer[]>(seedCustomers)
  const [ownerRestaurant, setOwnerRestaurant] =
    useState<Restaurant>(seedRestaurant)
  const [ownerPreferences, setOwnerPreferences] =
    useState<OwnerPreferences>(seedPreferences)

  // ---------- Owner-scoped derived data ----------
  const ownerId = ownerRestaurant.id
  const myOrders = useMemo(
    () => orders.filter((o) => o.restaurantId === ownerId),
    [orders, ownerId]
  )
  const myReviews = useMemo(
    () => reviews.filter((r) => r.restaurantId === ownerId),
    [reviews, ownerId]
  )
  const myMenuItems = useMemo(
    () => menuItems.filter((m) => m.restaurantId === ownerId),
    [menuItems, ownerId]
  )

  // ---------- Menu items ----------
  const addMenuItem = useCallback(
    (restaurantId: number, data: Omit<MenuItem, "id" | "restaurantId">) => {
      setMenuItems((prev) => {
        const id = nextId(prev.map((m) => m.id))
        return [...prev, { ...data, id, restaurantId }]
      })
    },
    []
  )

  const updateMenuItem = useCallback((id: number, patch: Partial<MenuItem>) => {
    setMenuItems((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...patch } : m))
    )
  }, [])

  const deleteMenuItem = useCallback((id: number) => {
    setMenuItems((prev) => prev.filter((m) => m.id !== id))
  }, [])

  // ---------- Orders ----------
  const updateOrderStatus = useCallback((id: number, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? advanceTimeline(o, status) : o))
    )
  }, [])

  const cancelOrder = useCallback((id: number) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? advanceTimeline(o, "cancelled") : o))
    )
  }, [])

  // ---------- Reviews ----------
  const deleteReview = useCallback((id: number) => {
    setReviews((prev) => prev.filter((r) => r.id !== id))
  }, [])

  const toggleReviewHidden = useCallback((id: number) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, hidden: !r.hidden } : r))
    )
  }, [])

  // ---------- Customers ----------
  const toggleCustomerStatus = useCallback((id: number) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "active" ? "suspended" : "active" }
          : c
      )
    )
  }, [])

  const deleteCustomer = useCallback((id: number) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id))
  }, [])

  // ---------- Settings ----------
  const updateRestaurantProfile = useCallback((patch: Partial<Restaurant>) => {
    setOwnerRestaurant((prev) => ({
      ...prev,
      ...patch,
      slug: patch.name ? slugify(patch.name) : prev.slug,
    }))
  }, [])

  const setOpeningHours = useCallback((hours: OpeningHours[]) => {
    setOwnerRestaurant((prev) => ({ ...prev, openingHours: hours }))
  }, [])

  const updatePreferences = useCallback((patch: Partial<OwnerPreferences>) => {
    setOwnerPreferences((prev) => ({ ...prev, ...patch }))
  }, [])

  const resetSettings = useCallback(() => {
    setOwnerRestaurant(seedRestaurant)
    setOwnerPreferences(seedPreferences)
  }, [])

  const value = useMemo<DashboardContextValue>(
    () => ({
      restaurants,
      menuItems,
      orders,
      reviews,
      customers,
      ownerRestaurant,
      ownerPreferences,
      myOrders,
      myReviews,
      myMenuItems,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      updateOrderStatus,
      cancelOrder,
      deleteReview,
      toggleReviewHidden,
      toggleCustomerStatus,
      deleteCustomer,
      updateRestaurantProfile,
      setOpeningHours,
      updatePreferences,
      resetSettings,
    }),
    [
      restaurants,
      menuItems,
      orders,
      reviews,
      customers,
      ownerRestaurant,
      ownerPreferences,
      myOrders,
      myReviews,
      myMenuItems,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      updateOrderStatus,
      cancelOrder,
      deleteReview,
      toggleReviewHidden,
      toggleCustomerStatus,
      deleteCustomer,
      updateRestaurantProfile,
      setOpeningHours,
      updatePreferences,
      resetSettings,
    ]
  )

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider")
  }
  return context
}

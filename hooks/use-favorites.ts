"use client"

import { useState, useCallback } from "react"

export function useFavorites(initial: number[] = []) {
  const [favorites, setFavorites] = useState<number[]>(initial)

  const toggleFavorite = useCallback((id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    )
  }, [])

  const isFavorite = useCallback(
    (id: number) => favorites.includes(id),
    [favorites]
  )

  return { favorites, toggleFavorite, isFavorite }
}

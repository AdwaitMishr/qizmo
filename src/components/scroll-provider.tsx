"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface ScrollContextType {
  scrollY: number
  scrollDirection: "up" | "down" | null
  scrolled: boolean
}

const ScrollContext = createContext<ScrollContextType>({
  scrollY: 0,
  scrollDirection: null,
  scrolled: false,
})

export const useScroll = () => useContext(ScrollContext)

export function ScrollProvider({ children }: { children: ReactNode }) {
  const [scrollY, setScrollY] = useState(0)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Determine scroll direction
      if (currentScrollY > lastScrollY) {
        setScrollDirection("down")
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection("up")
      }

      // Update scroll position
      setScrollY(currentScrollY)
      setLastScrollY(currentScrollY)

      // Set scrolled state for header effects
      setScrolled(currentScrollY > 50)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return <ScrollContext.Provider value={{ scrollY, scrollDirection, scrolled }}>{children}</ScrollContext.Provider>
}


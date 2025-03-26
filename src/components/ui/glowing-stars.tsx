"use client"

import { useRef, useEffect } from "react"

export function GlowingStars() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const stars = Array.from({ length: 20 }).map(() => {
      const star = document.createElement("div")
      star.className = "absolute rounded-full bg-white"

      // Random size
      const size = Math.random() * 2 + 1
      star.style.width = `${size}px`
      star.style.height = `${size}px`

      // Random position
      star.style.left = `${Math.random() * 100}%`
      star.style.top = `${Math.random() * 100}%`

      // Random opacity
      star.style.opacity = `${Math.random() * 0.7 + 0.3}`

      // Random animation
      const duration = Math.random() * 3 + 2
      star.style.animation = `pulse ${duration}s infinite alternate`

      return star
    })

    stars.forEach((star) => containerRef.current?.appendChild(star))

    return () => {
      stars.forEach((star) => star.remove())
    }
  }, [])

  return (
    <>
      <style jsx global>{`
        @keyframes pulse {
          0% {
            opacity: 0.3;
            transform: scale(1);
          }
          100% {
            opacity: 0.7;
            transform: scale(1.5);
          }
        }
      `}</style>
      <div ref={containerRef} className="absolute inset-0 overflow-hidden" />
    </>
  )
}


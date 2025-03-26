"use client"

import type { ReactNode } from "react"
import { motion } from "motion/react"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  index: number
  isInView: boolean
}

export function FeatureCard({ icon, title, description, index, isInView }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{
        y: -5,
        boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.1), 0 8px 10px -6px rgba(124, 58, 237, 0.1)",
      }}
      className="bg-purple-50 rounded-xl p-6 transition-all duration-300 hover:bg-purple-100"
    >
      <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mb-4 shadow-sm">{icon}</div>
      <h3 className="text-xl font-bold text-purple-800 mb-2">{title}</h3>
      <p className="text-purple-600">{description}</p>
    </motion.div>
  )
}


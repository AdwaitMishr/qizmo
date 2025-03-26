"use client"

import { motion } from "motion/react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

interface TechCardProps {
  name: string
  description: string
  icon: string
  color: string
  index: number
  isInView: boolean
}

export function TechCard({ name, description, icon, color, index, isInView }: TechCardProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{
            y: -10,
            boxShadow: "0 20px 25px -5px rgba(124, 58, 237, 0.1), 0 10px 10px -5px rgba(124, 58, 237, 0.04)",
          }}
          className="bg-white rounded-xl p-8 text-center cursor-pointer shadow-sm transition-all duration-300"
        >
          <div className="flex flex-col items-center justify-center h-full">
            <div
              className="text-4xl mb-4 w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${color}20` }}
            >
              {icon}
            </div>
            <h3 className="font-bold text-xl text-purple-800">{name}</h3>
          </div>
        </motion.div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-4">
        <div className="space-y-2">
          <h4 className="text-lg font-semibold">{name}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}


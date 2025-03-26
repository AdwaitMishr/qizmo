"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { TechCard } from "./ui/tech-card"

const techStacks = [
  {
    name: "Next.js",
    description:
      "The React framework for production that enables server-side rendering and static site generation for improved performance and SEO.",
    icon: "▲",
    color: "#000000",
  },
  {
    name: "Tailwind CSS",
    description:
      "A utility-first CSS framework that allows for rapid UI development with highly customizable design systems.",
    icon: "🌊",
    color: "#38bdf8",
  },
  {
    name: "TanStack Query",
    description:
      "Powerful asynchronous state management for fetching, caching, synchronizing and updating server state in your applications.",
    icon: "🔄",
    color: "#ef4444",
  },
  {
    name: "tRPC",
    description:
      "End-to-end typesafe APIs made easy, enabling you to build and consume fully typed APIs without schemas or code generation.",
    icon: "🔌",
    color: "#398ccb",
  },
]

export default function TechStack() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })

  return (
    <section id="tech-stack" className="py-20 bg-gradient-to-r from-[#afaaff] to-[#f7ccff]" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Powered by Modern Technology</h2>
          <p className="text-purple-900 max-w-2xl mx-auto">
            Our platform is built with cutting-edge technologies to provide the best experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {techStacks.map((tech, index) => (
            <TechCard
              key={index}
              name={tech.name}
              description={tech.description}
              icon={tech.icon}
              color={tech.color}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center bg-white/20 rounded-full px-4 py-2">
            <span className="text-white text-sm">End-to-end type safety from database to UI</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}


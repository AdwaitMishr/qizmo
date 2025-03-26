"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Brain, Zap, Trophy, CheckCircle } from "lucide-react"
import { FeatureCard } from "./ui/feature-card"

const features = [
  {
    icon: <Brain className="w-10 h-10 text-purple-600" />,
    title: "AI-Powered Question Generation",
    description: "Generate high-quality MCQs automatically with our advanced AI algorithms.",
  },
  {
    icon: <Zap className="w-10 h-10 text-purple-600" />,
    title: "Real-time Performance Analytics",
    description: "Track progress and identify areas for improvement with detailed analytics.",
  },
  {
    icon: <Trophy className="w-10 h-10 text-purple-600" />,
    title: "Gamified Learning Experience",
    description: "Earn points, badges, and compete on leaderboards to stay motivated.",
  },
  {
    icon: <CheckCircle className="w-10 h-10 text-purple-600" />,
    title: "Customizable Quiz Templates",
    description: "Choose from a variety of templates or create your own custom quiz design.",
  },
  {
    icon: <CheckCircle className="w-10 h-10 text-purple-600" />,
    title: "Collaborative Quiz Creation",
    description: "Work together with team members to create comprehensive quiz sets.",
  },
  {
    icon: <CheckCircle className="w-10 h-10 text-purple-600" />,
    title: "Cross-platform Accessibility",
    description: "Access your quizzes on any device, anytime, anywhere.",
  },
]

export default function Features() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })

  return (
    <section id="features" className="py-20 bg-white" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-purple-800 mb-4">
            Powerful Features for Quiz Enthusiasts
          </h2>
          <p className="text-purple-600 max-w-2xl mx-auto">
            Our platform offers everything you need to create, share, and master knowledge through interactive quizzes.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  )
}


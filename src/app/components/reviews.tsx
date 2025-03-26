"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "motion/react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ReviewCard } from "./ui/review-card"

const reviews = [
  {
    name: "Sarah Johnson",
    role: "High School Teacher",
    content:
      "Qizmo has transformed how I assess my students. The AI-generated questions save me hours of preparation time, and my students love the interactive format!",
    rating: 5,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    name: "Michael Chen",
    role: "University Student",
    content:
      "I use Qizmo to prepare for exams, and it's been a game-changer. The analytics help me identify weak areas, and the gamification keeps me motivated.",
    rating: 5,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    name: "Dr. Emily Rodriguez",
    role: "Medical Educator",
    content:
      "As a medical educator, I need reliable and accurate assessment tools. Qizmo delivers with its customizable templates and collaborative features.",
    rating: 4,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    name: "David Wilson",
    role: "Corporate Trainer",
    content:
      "We've implemented Qizmo across our training programs, and the results have been outstanding. Engagement is up, and knowledge retention has improved significantly.",
    rating: 5,
    image: "/placeholder.svg?height=80&width=80",
  },
]

export default function Reviews() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })
  const [activeIndex, setActiveIndex] = useState(0)
  const [showForm, setShowForm] = useState(false)

  const nextReview = () => {
    setActiveIndex((prev) => (prev + 1) % reviews.length)
  }

  const prevReview = () => {
    setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
  }

  return (
    <section id="reviews" className="py-20 bg-white" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-purple-800 mb-4">What Our Users Say</h2>
          <p className="text-purple-600 max-w-2xl mx-auto">
            Discover how Qizmo has helped educators, students, and professionals enhance their learning experience.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="relative">
            <div className="overflow-hidden">
              <motion.div
                className="flex"
                initial={{ x: 0 }}
                animate={{ x: `-${activeIndex * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {reviews.map((review, index) => (
                  <ReviewCard key={index} review={review} />
                ))}
              </motion.div>
            </div>

            <button
              onClick={prevReview}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-md text-purple-700 hover:text-purple-900 z-10"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextReview}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-md text-purple-700 hover:text-purple-900 z-10"
              aria-label="Next review"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="flex justify-center mt-6 space-x-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full ${activeIndex === index ? "bg-purple-600" : "bg-purple-200"}`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>

          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button onClick={() => setShowForm(!showForm)} className="bg-purple-600 hover:bg-purple-700 text-white">
              {showForm ? "Cancel" : "Share Your Experience"}
            </Button>
          </motion.div>

          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-8 bg-purple-50 rounded-xl p-6 max-w-2xl mx-auto"
            >
              <h3 className="text-xl font-bold text-purple-800 mb-4">Submit Your Review</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-purple-700">
                      Name
                    </label>
                    <Input id="name" placeholder="Your name" className="border-purple-200 focus:border-purple-500" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="role" className="text-sm font-medium text-purple-700">
                      Role
                    </label>
                    <Input
                      id="role"
                      placeholder="Student, Teacher, etc."
                      className="border-purple-200 focus:border-purple-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="review" className="text-sm font-medium text-purple-700">
                    Your Review
                  </label>
                  <Textarea
                    id="review"
                    placeholder="Share your experience with Qizmo..."
                    rows={4}
                    className="border-purple-200 focus:border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-purple-700">Rating</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button key={rating} type="button" className="text-yellow-400 hover:text-yellow-500">
                        <Star className="w-6 h-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">Submit Review</Button>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}


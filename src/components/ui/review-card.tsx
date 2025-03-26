"use client"

import Image from "next/image"
import { Star, Quote } from "lucide-react"

interface ReviewCardProps {
  review: {
    name: string
    role: string
    content: string
    rating: number
    image: string
  }
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="min-w-full px-4">
      <div className="bg-purple-50 rounded-xl p-8 relative">
        <Quote className="absolute top-4 right-4 w-10 h-10 text-purple-200" />

        <div className="flex items-center mb-4">
          <div className="mr-4">
            <Image
              src={review.image || "/placeholder.svg"}
              alt={review.name}
              width={60}
              height={60}
              className="rounded-full"
            />
          </div>
          <div>
            <h4 className="font-bold text-purple-800">{review.name}</h4>
            <p className="text-purple-600 text-sm">{review.role}</p>
          </div>
        </div>

        <div className="flex mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
            />
          ))}
        </div>

        <p className="text-purple-700">{review.content}</p>
      </div>
    </div>
  )
}


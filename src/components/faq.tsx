"use client"

import { useRef } from "react"
import { motion, useInView } from "motion/react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "Is Qizmo free to use?",
    answer:
      "Yes, Qizmo offers a free tier with basic features. We also offer premium plans with advanced features for educators and organizations.",
  },
  {
    question: "Can I create my own custom quizzes?",
    answer:
      "You can create custom quizzes from scratch or use our AI-powered question generator to help you get started quickly.",
  },
  {
    question: "How does the AI question generation work?",
    answer:
      "Our AI analyzes your content or topic and generates relevant multiple-choice questions based on key concepts and learning objectives. You can edit and refine the generated questions as needed.",
  },
  {
    question: "Can I share my quizzes with others?",
    answer:
      "Yes, you can share your quizzes via a link, embed them on your website, or invite specific users via email. You can also control privacy settings for each quiz.",
  },
  {
    question: "Is there a mobile app available?",
    answer:
      "Yes, Qizmo is available as a web application and native mobile apps for iOS and Android devices, allowing you to create and take quizzes on the go.",
  },
]

export default function Faq() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })

  return (
    <section id="faq" className="py-20 bg-white" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-purple-800 mb-4">Frequently Asked Questions</h2>
          <p className="text-purple-600 max-w-2xl mx-auto">
            Find answers to common questions about our MCQ quiz platform.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <AccordionItem value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-purple-800 hover:text-purple-600">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-purple-600">{faq.answer}</AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}


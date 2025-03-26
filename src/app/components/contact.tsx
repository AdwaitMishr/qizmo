"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })

  return (
    <section id="contact" className="py-20 bg-gradient-to-r from-[#afaaff] to-[#f7ccff]" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get in Touch</h2>
          <p className="text-purple-900 max-w-2xl mx-auto">Have questions or feedback? We'd love to hear from you!</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <motion.div
            className="bg-white rounded-xl p-8 shadow-lg"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold text-purple-800 mb-6">Contact Us</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-purple-700">
                    Name
                  </label>
                  <Input id="name" placeholder="Your name" className="border-purple-200 focus:border-purple-500" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-purple-700">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Your email"
                    className="border-purple-200 focus:border-purple-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-purple-700">
                  Subject
                </label>
                <Input id="subject" placeholder="Subject" className="border-purple-200 focus:border-purple-500" />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-purple-700">
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Your message"
                  rows={5}
                  className="border-purple-200 focus:border-purple-500"
                />
              </div>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">Send Message</Button>
            </form>
          </motion.div>

          <motion.div
            className="flex flex-col justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-8 mb-6">
              <h4 className="text-xl font-bold text-white mb-4">Our Office</h4>
              <p className="text-purple-900 mb-2">123 Quiz Avenue</p>
              <p className="text-purple-900 mb-2">Knowledge City, QZ 12345</p>
              <p className="text-purple-900">United States</p>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-8">
              <h4 className="text-xl font-bold text-white mb-4">Contact Information</h4>
              <p className="text-purple-900 mb-2">Email: hello@quizgenius.com</p>
              <p className="text-purple-900 mb-2">Phone: +1 (555) 123-4567</p>
              <p className="text-purple-900">Support Hours: 24/7</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}


"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { Brain } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-purple-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <motion.div
              className="flex items-center mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-full p-1 mr-2">
                <div className="bg-purple-600 rounded-full w-6 h-6 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
              </div>
              <span className="font-bold text-xl">Qizmo</span>
            </motion.div>
            <motion.p
              className="text-purple-200 mb-4 max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Qizmo is the ultimate platform for creating, sharing, and mastering knowledge through interactive MCQ
              quizzes.
            </motion.p>
            <motion.div
              className="flex space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {["Twitter", "Facebook", "Instagram", "LinkedIn"].map((social, index) => (
                <Link key={index} href="#" className="text-purple-200 hover:text-white transition-colors">
                  {social}
                </Link>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["Home", "Features", "Tech Stack", "Reviews", "FAQ"].map((link, index) => (
                <li key={index}>
                  <Link
                    href={`#${link.toLowerCase().replace(" ", "-")}`}
                    className="text-purple-200 hover:text-white transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h4 className="font-bold text-lg mb-4">Legal</h4>
            <ul className="space-y-2">
              {["Terms of Service", "Privacy Policy", "Cookie Policy", "GDPR"].map((link, index) => (
                <li key={index}>
                  <Link href="#" className="text-purple-200 hover:text-white transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className="border-t border-purple-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-purple-200 text-sm">&copy; {new Date().getFullYear()} Qizmo. All rights reserved.</p>
          <div className="flex items-center mt-4 md:mt-0">
            <div className="bg-white rounded-full p-1 mr-2">
              <div className="bg-purple-600 rounded-full w-6 h-6 flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
            </div>
            <span className="font-bold">Qizmo</span>
          </div>
        </div>
      </div>
    </footer>
  )
}


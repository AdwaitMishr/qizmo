"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useScroll } from "./scroll-provider"

export default function Header() {
  const { scrolled } = useScroll()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-white/80 backdrop-blur-md shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <motion.div
          className="flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-purple-600 rounded-full p-1 mr-2">
            <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
              <Brain className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <span className={`font-bold text-xl ${scrolled ? "text-purple-700" : "text-white"}`}>Qizmo</span>
        </motion.div>

        <div className="hidden md:flex items-center space-x-4">
          <nav className="flex items-center mr-4 space-x-6">
            {["Features", "Tech Stack", "Reviews", "FAQ", "Contact"].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  className={`text-sm font-medium hover:text-purple-500 transition-colors ${
                    scrolled ? "text-purple-700" : "text-white"
                  }`}
                >
                  {item}
                </Link>
              </motion.div>
            ))}
          </nav>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="flex items-center space-x-3"
          >
            <Button
              variant={scrolled ? "outline" : "secondary"}
              className={`rounded-full transition-all duration-300 ${
                scrolled ? "hover:bg-purple-100" : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              Login
            </Button>
            <Button
              className={`rounded-full transition-all duration-300 ${
                scrolled
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-white text-purple-700 hover:bg-purple-50"
              }`}
            >
              Sign Up
            </Button>
          </motion.div>
        </div>

        <button
          className={`md:hidden ${scrolled ? "text-purple-700" : "text-white"}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden bg-white shadow-lg p-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-col space-y-4">
              {["Features", "Tech Stack", "Reviews", "FAQ", "Contact"].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  className="text-purple-700 hover:text-purple-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
              <div className="pt-4 flex flex-col space-y-2">
                <Button variant="outline" className="w-full">
                  Login
                </Button>
                <Button className="w-full">Sign Up</Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}


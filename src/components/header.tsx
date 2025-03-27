"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, Menu, X, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useScroll } from "@/components/scroll-provider"
import { useSession, signOut } from "@/lib/auth-client"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const { scrolled } = useScroll()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { data: session, isPending } = useSession()

  const isAuthenticated = session?.user
  const isLoading = isPending

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!session?.user?.name) return '?'
    return session.user.name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Failed to sign out:', error)
    }
  }

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 w-full z-50 py-4 ${
        scrolled ? "bg-white/70 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Brain className={`h-6 w-6 ${scrolled ? "text-purple-700" : "text-white"}`} />
            </motion.div>
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className={`font-bold text-xl ${scrolled ? "text-purple-700" : "text-white"}`}
            >
              Qizmo
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="flex items-center space-x-3"
            >
              {isLoading ? (
                <div className="h-10 w-24 animate-pulse bg-gray-200 rounded-full" />
              ) : isAuthenticated ? (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className={`rounded-full p-0 h-10 w-10 cursor-pointer transition-all duration-300 ${
                          scrolled
                            ? "bg-purple-600 hover:bg-purple-700 text-white"
                            : "bg-white text-purple-700 hover:bg-purple-50"
                        }`}
                      >
                        <Avatar className="h-9 w-9">
                          <AvatarFallback
                            className={`${
                              scrolled ? "bg-purple-600 text-white" : "bg-white text-purple-700"
                            }`}
                          >
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href="/teacher/dashboard" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Link href="/signIn">
                    <Button
                      variant={scrolled ? "outline" : "secondary"}
                      className={`rounded-full cursor-pointer transition-all duration-300 ${
                        scrolled ? "hover:bg-purple-100" : "bg-white/20 text-white hover:bg-white/30"
                      }`}
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signUp">
                    <Button
                      className={`rounded-full cursor-pointer transition-all duration-300 ${
                        scrolled
                          ? "bg-purple-600 hover:bg-purple-700 text-white"
                          : "bg-white text-purple-700 hover:bg-purple-50"
                      }`}
                    >
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden ${scrolled ? "text-purple-700" : "text-white"}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-4 bg-white rounded-lg shadow-lg p-4"
            >
              <div className="flex flex-col space-y-3">
                {isLoading ? (
                  <div className="h-10 w-full animate-pulse bg-gray-200 rounded-full" />
                ) : isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-3 p-2">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-purple-600 text-white">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-gray-900">
                        {session.user.name || 'User'}
                      </span>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center space-x-2 p-2 hover:bg-purple-50 rounded-md transition-colors"
                      onClick={closeMobileMenu}
                    >
                      <User className="h-5 w-5 text-purple-600" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut().catch(error => {
                          console.error('Error signing out:', error)
                        })
                        closeMobileMenu()
                      }}
                      className="flex items-center space-x-2 p-2 hover:bg-purple-50 rounded-md transition-colors text-left w-full"
                    >
                      <LogOut className="h-5 w-5 text-purple-600" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/signIn"
                      className="w-full"
                      onClick={closeMobileMenu}
                    >
                      <Button
                        variant="outline"
                        className="w-full rounded-full"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link
                      href="/signUp"
                      className="w-full"
                      onClick={closeMobileMenu}
                    >
                      <Button
                        className="w-full rounded-full bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
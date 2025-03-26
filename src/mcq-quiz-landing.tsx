"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { CheckCircle, Brain, Zap, Trophy, Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function MCQQuizLanding() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const techStacks = [
    { name: "React", description: "Frontend library for building user interfaces", icon: "⚛️" },
    { name: "Next.js", description: "React framework with server-side rendering", icon: "▲" },
    { name: "TypeScript", description: "Typed superset of JavaScript", icon: "TS" },
    { name: "Tailwind CSS", description: "Utility-first CSS framework", icon: "🌊" },
    { name: "Shadcn UI", description: "Beautifully designed components", icon: "🎨" },
    { name: "Vercel", description: "Platform for frontend frameworks and static sites", icon: "▲" },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-[#afaaff] to-[#f7ccff]">
      {/* Fixed Blur Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/80 backdrop-blur-md shadow-md py-2" : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-purple-600 rounded-full p-1 mr-2">
              <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
                <Brain className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <span className={`font-bold text-xl ${scrolled ? "text-purple-700" : "text-white"}`}>Qizmo</span>
          </div>

          <div className="hidden md:flex items-center space-x-4">
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
          </div>

          <button className="md:hidden text-purple-700" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg p-4">
            <nav className="flex flex-col space-y-4">
              <Link href="#features" className="text-purple-700 hover:text-purple-900">
                Features
              </Link>
              <Link href="#tech-stack" className="text-purple-700 hover:text-purple-900">
                Tech Stack
              </Link>
              <Link href="#faq" className="text-purple-700 hover:text-purple-900">
                FAQ
              </Link>
              <Link href="#contact" className="text-purple-700 hover:text-purple-900">
                Contact
              </Link>
              <div className="pt-4 flex flex-col space-y-2">
                <Button variant="outline" className="w-full">
                  Login
                </Button>
                <Button className="w-full">Sign Up</Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section with Animations */}
      <section className="pt-32 pb-20 px-4 md:pt-40 md:pb-32">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center md:text-left"
            >
              <div className="inline-flex items-center bg-white/30 rounded-full px-3 py-1 mb-6">
                <Zap className="w-4 h-4 text-purple-800 mr-2" />
                <span className="text-purple-900 text-sm font-medium">Smart Quiz Platform</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Elevate Your Learning with Interactive MCQ Quizzes
              </h1>

              <p className="text-purple-900 mb-8 text-lg max-w-lg mx-auto md:mx-0">
                Create, share, and master knowledge with our intelligent quiz platform designed for students, educators,
                and lifelong learners.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                <Button size="lg" className="bg-white text-purple-700 hover:bg-purple-50 rounded-full px-8">
                  Start for Free
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white/20 rounded-full px-8"
                >
                  Take a Tour
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              {/* Quiz Card Preview */}
              <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-purple-800">Biology Quiz</h3>
                  <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Question 3/10</div>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-medium text-gray-800 mb-4">
                    Which of the following is NOT a function of the skeletal system?
                  </h4>

                  <div className="space-y-3">
                    {[
                      "Support and protection of body organs",
                      "Production of blood cells",
                      "Storage of minerals",
                      "Regulation of blood glucose levels",
                    ].map((option, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className={`p-3 rounded-lg border ${
                          index === 3 ? "border-purple-300 bg-purple-50" : "border-gray-200 hover:border-purple-300"
                        } cursor-pointer transition-colors`}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${
                              index === 3 ? "bg-purple-600" : "border border-gray-300"
                            }`}
                          >
                            {index === 3 && <CheckCircle className="w-4 h-4 text-white" />}
                          </div>
                          <span>{option}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                  <Button size="sm">Next Question</Button>
                </div>
              </div>

              {/* Decorative Elements */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 5,
                  ease: "easeInOut",
                }}
                className="absolute -top-10 -right-10 bg-purple-300 rounded-full w-20 h-20 opacity-50"
              />
              <motion.div
                animate={{
                  y: [0, 10, 0],
                  rotate: [0, -5, 0],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 4,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute -bottom-10 -left-10 bg-pink-300 rounded-full w-16 h-16 opacity-50"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-purple-800 mb-4">
              Powerful Features for Quiz Enthusiasts
            </h2>
            <p className="text-purple-600 max-w-2xl mx-auto">
              Our platform offers everything you need to create, share, and master knowledge through interactive
              quizzes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
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
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-purple-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mb-4 shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-purple-800 mb-2">{feature.title}</h3>
                <p className="text-purple-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech-stack" className="py-20 bg-gradient-to-r from-[#afaaff] to-[#f7ccff]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Powered by Modern Technology</h2>
            <p className="text-purple-900 max-w-2xl mx-auto">
              Hover over each technology to learn more about our tech stack.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-4xl mx-auto">
            {techStacks.map((tech, index) => (
              <HoverCard key={index}>
                <HoverCardTrigger asChild>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl p-6 text-center cursor-pointer shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="text-3xl mb-2">{tech.icon}</div>
                    <h3 className="font-medium text-purple-800">{tech.name}</h3>
                  </motion.div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="flex justify-between space-x-4">
                    <div>
                      <h4 className="text-sm font-semibold">{tech.name}</h4>
                      <p className="text-sm text-muted-foreground">{tech.description}</p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-purple-800 mb-4">Frequently Asked Questions</h2>
            <p className="text-purple-600 max-w-2xl mx-auto">
              Find answers to common questions about our MCQ quiz platform.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {[
                {
                  question: "Is QuizGenius free to use?",
                  answer:
                    "Yes, QuizGenius offers a free tier with basic features. We also offer premium plans with advanced features for educators and organizations.",
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
                    "Yes, QuizGenius is available as a web application and native mobile apps for iOS and Android devices, allowing you to create and take quizzes on the go.",
                },
              ].map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-purple-800 hover:text-purple-600">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-purple-600">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-r from-[#afaaff] to-[#f7ccff]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get in Touch</h2>
            <p className="text-purple-900 max-w-2xl mx-auto">Have questions or feedback? We would love to hear from you!</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-lg">
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
            </div>

            <div className="flex flex-col justify-center">
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
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-purple-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="bg-white rounded-full p-1 mr-2">
                  <div className="bg-purple-600 rounded-full w-6 h-6 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                </div>
                <span className="font-bold text-xl">QuizGenius</span>
              </div>
              <p className="text-purple-200 mb-4 max-w-md">
                QuizGenius is the ultimate platform for creating, sharing, and mastering knowledge through interactive
                MCQ quizzes.
              </p>
              <div className="flex space-x-4">
                {["Twitter", "Facebook", "Instagram", "LinkedIn"].map((social, index) => (
                  <Link key={index} href="#" className="text-purple-200 hover:text-white transition-colors">
                    {social}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {["Home", "Features", "Pricing", "Blog", "About Us"].map((link, index) => (
                  <li key={index}>
                    <Link href="#" className="text-purple-200 hover:text-white transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
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
            </div>
          </div>

          <div className="border-t border-purple-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-purple-200 text-sm">
              &copy; {new Date().getFullYear()} QuizGenius. All rights reserved.
            </p>
            <div className="flex items-center mt-4 md:mt-0">
              <div className="bg-white rounded-full p-1 mr-2">
                <div className="bg-purple-600 rounded-full w-6 h-6 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
              </div>
              <span className="font-bold">QuizGenius</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}


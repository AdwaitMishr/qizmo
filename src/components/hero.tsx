"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Zap, CheckCircle, User } from "lucide-react";
import { GlowingStars } from "@/components/ui/glowing-stars";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";

// Local interface to extend session type
interface CustomSession {
  user?: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string | null;
    createdAt: Date;
    updatedAt: Date;
    isTeacher?: boolean; // Added isTeacher
  };
}

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const { data: session, isPending } = useSession();

  return (
    <section
      ref={ref}
      className="relative pt-32 pb-20 px-4 md:pt-40 md:pb-32 overflow-hidden bg-gradient-to-r from-purple-200 to-purple-800"
    >
      <GlowingStars />

      <div className="container mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div style={{ opacity }} className="text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center bg-white/30 rounded-full px-3 py-1 mb-6"
            >
              <Zap className="w-4 h-4 text-purple-800 mr-2" />
              <span className="text-purple-900 text-sm font-medium">Smart Quiz Platform</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Elevate Your Learning with Interactive MCQ Quizzes
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-purple-100 mb-8 text-lg max-w-lg mx-auto md:mx-0"
            >
              Create, share, and master knowledge with our intelligent quiz platform designed for students, educators,
              and lifelong learners.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4"
            >
              {isPending ? (
                <Button size="lg" disabled className="bg-white text-purple-700 rounded-full px-8">
                  Loading...
                </Button>
              ) : session?.user ? (
                <>
                  {(session as CustomSession)?.user?.isTeacher ? (
                    <Button
                      size="lg"
                      className="bg-white text-purple-700 hover:bg-purple-50 rounded-full px-8"
                      asChild
                    >
                      <Link href="/teacher/dashboard">Go to Dashboard</Link>
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      className="bg-white text-purple-700 hover:bg-purple-50 rounded-full px-8"
                      asChild
                    >
                      <Link href="/join-quiz">Join Quiz</Link>
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button
                    size="lg"
                    className="bg-white text-purple-700 hover:bg-purple-50 rounded-full px-8"
                    asChild
                  >
                    <Link href="/signUp">Start Now</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-white text-white hover:bg-white/20 rounded-full px-8"
                    asChild
                  >
                    <Link href="/#">Take a tour</Link>
                  </Button>
                </>
              )}
            </motion.div>
          </motion.div>

          <motion.div
            style={{ y }}
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
                      whileHover={{ scale: 1.02, x: 5 }}
                      className={`p-3 rounded-lg border flex items-center ${
                        index === 3 ? "border-purple-300 bg-purple-50" : "border-gray-200 hover:border-purple-300"
                      } cursor-pointer transition-colors`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${
                          index === 3 ? "bg-purple-600" : "border border-gray-300"
                        }`}
                      >
                        {index === 3 && <CheckCircle className="w-4 h-4 text-white" />}
                      </div>
                      <span className="text-gray-800 flex-1">{option}</span>
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
              className="absolute -bottom-10 -left-10 bg-purple-300 rounded-full w-16 h-16 opacity-50"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
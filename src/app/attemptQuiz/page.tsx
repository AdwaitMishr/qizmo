"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Clock, ChevronRight, ChevronLeft } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Define interfaces for type safety
interface QuizOption {
  id: string;
  text: string;
}

interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
  correctAnswer: string;
}

interface Quiz {
  id: string;
  title: string;
  topic: string;
  difficulty: string;
  duration: number;
  totalQuestions: number;
  questions: QuizQuestion[];
}

// Mock quiz data - in a real app, this would come from your API
const mockQuiz: Quiz = {
  id: "quiz-123",
  title: "Introduction to Biology",
  topic: "Biology",
  difficulty: "Medium",
  duration: 30, // in minutes
  totalQuestions: 10,
  questions: Array.from({ length: 10 }, (_, i) => ({
    id: `q-${i + 1}`,
    text: `This is question ${i + 1} about biology. What is the correct answer?`,
    options: [
      { id: `q${i + 1}-a`, text: "Answer option A" },
      { id: `q${i + 1}-b`, text: "Answer option B" },
      { id: `q${i + 1}-c`, text: "Answer option C" },
      { id: `q${i + 1}-d`, text: "Answer option D" },
    ],
    correctAnswer: `q${i + 1}-a`, // In a real app, don't send this to the client!
  })),
}

export default function AttemptQuiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(mockQuiz.duration * 60) // Convert minutes to seconds
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [showWarning, setShowWarning] = useState(false)

  // Null check to prevent undefined errors
  const currentQuestion = mockQuiz.questions[currentQuestionIndex] ?? null
  const questionsAttempted = Object.keys(userAnswers).length

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0 || quizSubmitted) {
      handleSubmitQuiz()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)

      // Show warning when 2 minutes left
      if (timeLeft === 120) {
        setShowWarning(true)
        setTimeout(() => setShowWarning(false), 5000)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, quizSubmitted])

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerSelect = (value: string) => {
    // Check if currentQuestion is not null before updating
    if (currentQuestion) {
      setUserAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: value,
      }))
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < mockQuiz.totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const handleSubmitQuiz = () => {
    // In a real app, you would send the answers to your backend
    setQuizSubmitted(true)
    // Redirect to results page or show results
    console.log("Quiz submitted with answers:", userAnswers)
  }

  if (quizSubmitted) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Quiz Submitted</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">Your answers have been submitted successfully.</p>
            <p>
              You attempted {questionsAttempted} out of {mockQuiz.totalQuestions} questions.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => (window.location.href = "/")}>Return to Dashboard</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Early return if no current question (added as an extra safety check)
  if (!currentQuestion) {
    return <div>No questions available</div>
  }

  return (
    <div className="container mx-auto py-4 px-4 min-h-screen flex flex-col">
      {/* Timer and Quiz Info Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center">
          <Clock className="mr-2 h-5 w-5 text-primary" />
          <span className={`text-xl font-bold ${timeLeft < 300 ? "text-red-500" : ""}`}>{formatTime(timeLeft)}</span>
        </div>

        <div className="flex flex-col sm:items-end">
          <h2 className="text-lg font-semibold">{mockQuiz.title}</h2>
          <div className="flex flex-wrap gap-2 mt-1">
            <Badge variant="outline">{mockQuiz.topic}</Badge>
            <Badge variant="outline">{mockQuiz.difficulty}</Badge>
            <Badge variant="outline">{mockQuiz.duration} min</Badge>
          </div>
        </div>
      </div>

      {/* Warning Alert */}
      {showWarning && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Time is running out!</AlertTitle>
          <AlertDescription>You have less than 2 minutes remaining to complete this quiz.</AlertDescription>
        </Alert>
      )}

      {/* Question Card */}
      <Card className="flex-grow">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Question {currentQuestionIndex + 1}</CardTitle>
            <Badge>
              {questionsAttempted}/{mockQuiz.totalQuestions} Answered
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <p className="text-lg mb-4">{currentQuestion.text}</p>
            <RadioGroup
              value={currentQuestion ? (userAnswers[currentQuestion.id] || "") : ""}
              onValueChange={handleAnswerSelect}
              className="space-y-3"
            >
              {currentQuestion.options.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted transition-colors"
                >
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="flex-grow cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
            <ChevronLeft className="mr-1 h-4 w-4" /> Previous
          </Button>

          <div className="flex gap-2">
            {currentQuestionIndex === mockQuiz.totalQuestions - 1 ? (
              <Button onClick={handleSubmitQuiz}>Submit Quiz</Button>
            ) : (
              <Button onClick={handleNextQuestion}>
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Question Navigation */}
      <div className="mt-6 grid grid-cols-5 sm:grid-cols-10 gap-2">
        {mockQuiz.questions.map((_, index) => {
          const question = mockQuiz.questions[index]
          return question ? (
            <Button
              key={index}
              variant={
                index === currentQuestionIndex
                  ? "default"
                  : userAnswers[question.id]
                    ? "secondary"
                    : "outline"
              }
              className="h-10 w-10"
              onClick={() => setCurrentQuestionIndex(index)}
            >
              {index + 1}
            </Button>
          ) : null
        })}
      </div>
    </div>
  )
}


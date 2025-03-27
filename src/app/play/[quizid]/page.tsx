"use client";
import React, { useState, useEffect } from "react";
import { api } from "@/trpc/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Clock } from "lucide-react";
import { toast } from "sonner";

type Question = {
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: "a" | "b" | "c" | "d";
  points: number;
};

type Response = {
  questionIndex: number;
  selectedOption: "a" | "b" | "c" | "d";
};

const QuizPlayPage = () => {
  const searchParams = useSearchParams();
  const [duration, setDuration] = useState(10); // Default to 10 minutes
  const quizId = parseInt(searchParams.get("quiz_id") ?? "0", 10);
  const code = searchParams.get("code") ?? "";
  const nickname = searchParams.get("nickname") ?? "";
  const router = useRouter();

  const { data, isFetching, refetch } = api.participation.getQuizByCode.useQuery(
    { code },
    {
      enabled: false,
      retry: false,
    }
  );

  const isValidCode = code.length === 8;

  const { data: quiz, isLoading, error, isFetched } = api.participation.getQuizByCode.useQuery(
    { code },
    {
      enabled: isValidCode && !!nickname,
      retry: false,
        // Set duration from the quiz data when it's successfully fetche
    }
  );
useEffect(() => {
  setDuration(data?.durationMinutes)
},[data])
  

  const [responses, setResponses] = useState<Response[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert minutes to seconds

  // Update timeLeft when duration changes
  useEffect(() => {
    setTimeLeft(duration * 60);
  }, [duration]);

  const submitAttempt = api.participation.submitQuizAttempt.useMutation({
    onSuccess: (data) => {
      toast(`Quiz submitted! Your score: ${data.score}`);
      router.push("/result");
    },
    onError: (err) => toast(`Error: ${err.message}`),
  });

  // Timer effect
  useEffect(() => {
    // If timer runs out or quiz is completed, stop the timer
    if (timeLeft <= 0 || currentQuestionIndex === (quiz?.questions.length ?? 0) - 1) {
      if (timeLeft <= 0) {
        toast("Time's up! Submitting your quiz.");
        submitAttempt.mutate({
          quizId,
          nickname,
          responses,
        });
      }
      return;
    }

    // Set up the interval
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    // Clean up the interval
    return () => clearInterval(timerId);
  }, [timeLeft, currentQuestionIndex, quiz, submitAttempt, quizId, nickname, responses]);

  // Format time to MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isLoading || !isFetched) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!quiz) {
    return null;
  }

  const questions: Question[] = quiz.questions as Question[];
  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>This quiz has no questions. Please contact the teacher.</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Invalid question index. Please try again.</p>
      </div>
    );
  }

  const handleAnswer = (option: "a" | "b" | "c" | "d") => {
    const newResponse = { questionIndex: currentQuestionIndex, selectedOption: option };
    const updatedResponses = [
      ...responses.filter((r) => r.questionIndex !== currentQuestionIndex),
      newResponse,
    ];
    setResponses(updatedResponses);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      submitAttempt.mutate({
        quizId,
        nickname,
        responses: updatedResponses,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative">
      {/* Timer in top left corner */}
      <div className="absolute top-4 left-4 flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
        <Clock className={`w-5 h-5 ${timeLeft <= 60 ? 'text-red-500' : 'text-gray-600'}`} />
        <span className={`font-semibold ${timeLeft <= 60 ? 'text-red-500' : 'text-gray-800'}`}>
          {formatTime(timeLeft)}
        </span>
      </div>

      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>
            {quiz.name} - Question {currentQuestionIndex + 1}/{questions.length}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-4">{currentQuestion.text}</p>
          <div className="grid grid-cols-2 gap-4">
            {(["a", "b", "c", "d"] as const).map((option) => (
              <Button
                key={option}
                onClick={() => handleAnswer(option)}
                variant={
                  responses.some(
                    (r) => r.questionIndex === currentQuestionIndex && r.selectedOption === option
                  )
                    ? "default"
                    : "outline"
                }
                disabled={submitAttempt.isPending}
              >
                {option.toUpperCase()}: {currentQuestion[`option${option.toUpperCase()}` as keyof Question]}
              </Button>
            ))}
          </div>
          {submitAttempt.isPending && (
            <div className="mt-4 flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizPlayPage;
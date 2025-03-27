// app/play/[quizId]/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { api } from "@/trpc/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
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
  const quizId = parseInt(searchParams.get("quiz_id") ??   "0", 10);

  const code = searchParams.get("code") ?? "";
  const nickname = searchParams.get("nickname") ?? "";
  const router = useRouter();

  const [responses, setResponses] = useState<Response[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const isValidCode = code.length === 8;

  console.log("QuizPlayPage: QuizId:", quizId, "Code:", code, "Nickname:", nickname, "IsValidCode:", isValidCode);

  const { data: quiz, isLoading, error, isFetched } = api.participation.getQuizByCode.useQuery(
    { code },
    {
      enabled: isValidCode && !!nickname,
      retry: false,
    }
  );

  const submitAttempt = api.participation.submitQuizAttempt.useMutation({
    onSuccess: (data) => {
      toast(`Quiz submitted! Your score: ${data.score}`);
      router.push("/result");
    },
    onError: (err) => toast(`Error: ${err.message}`),
  });

//   useEffect(() => {
//     console.log("QuizPlayPage: Quiz:", quiz, "IsLoading:", isLoading, "IsFetched:", isFetched, "Error:", error);
//     if (isFetched && !isLoading) {
//       if (!quiz) {
//         toast("Error: Quiz not found or not active");
//         router.push("/join");
//       } else if (quiz.id !== quizId) {
//         toast("Error: Quiz ID mismatch");
//         router.push("/join");
//       } else if (error) {
//         toast(`Error: ${error.message}`);
//         router.push("/join");
//       }
//     }
//     if (!isValidCode || !nickname) {
//       toast("Error: Invalid quiz code or missing nickname");
//       router.push("/join");
//     }
//   }, [quiz, isLoading, isFetched, error, isValidCode, nickname, quizId, router]);

  if (isLoading || !isFetched) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!quiz) {
    return null; // Let useEffect handle redirect
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
    <div className="flex items-center justify-center min-h-screen">
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
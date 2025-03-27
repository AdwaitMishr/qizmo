// app/teacher/dashboard/page.tsx
"use client";

import React, { useState } from "react";
import { api } from "@/trpc/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Trash2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

type CorrectOption = "a" | "b" | "c" | "d";

type Question = {
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: CorrectOption;
  points: number;
  difficulty: "easy" | "medium" | "hard";
};

const isCorrectOption = (value: string): value is CorrectOption =>
  ["a", "b", "c", "d"].includes(value);

const CreateQuizDialog: React.FC<{ open: boolean; onOpenChange: (open: boolean) => void }> = ({
  open,
  onOpenChange,
}) => {
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("15");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    text: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctOption: "a",
    points: 1,
    difficulty: "medium",
  });

  const { mutate, isPending } = api.quiz.createQuiz.useMutation({
    onSuccess: (data) => {
      toast(`Quiz created with code: ${data.code}`);
      resetForm();
      onOpenChange(false);
    },
    onError: (err) => toast(`Error: ${err.message}`),
  });

  const resetForm = () => {
    setName("");
    setTopic("");
    setDurationMinutes("15");
    setQuestions([]);
    setCurrentQuestion({
      text: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctOption: "a",
      points: 1,
      difficulty: "medium",
    });
  };

  const addQuestion = () => {
    if (
      !currentQuestion.text ||
      !currentQuestion.optionA ||
      !currentQuestion.optionB ||
      !currentQuestion.optionC ||
      !currentQuestion.optionD
    ) {
      toast("Error: All question fields are required");
      return;
    }
    setQuestions((prev) => [...prev, currentQuestion]);
    setCurrentQuestion({
      text: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctOption: "a",
      points: 1,
      difficulty: "medium",
    });
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAIClick = async () => {
    try {
      const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!GEMINI_API_KEY) throw new Error("Gemini API key is not defined");

      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Generate a JSON object with multiple-choice questions for topic "${topic}":
      - "questions" array containing:
        - "text": string
        - "optionA", "optionB", "optionC", "optionD": string
        - "correctOption": "a" | "b" | "c" | "d"
        - "points": 1
        - "difficulty": "easy" | "medium" | "hard"`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text().replace(/```(json)?/g, "").trim();
      const parsedData = JSON.parse(responseText) as { questions: Question[] };

      setQuestions(parsedData.questions);
    } catch (err) {
      console.error("Error generating questions:", err);
      toast(`Failed to generate questions: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  };

  const handleSubmit = () => {
    if (!name) {
      toast("Error: Quiz name is required");
      return;
    }
    if (!topic) {
      toast("Error: Quiz topic is required");
      return;
    }
    if (questions.length === 0) {
      toast("Error: At least one question is required");
      return;
    }
    mutate({
      name,
      questions: questions.map((q) => ({
        ...q,
        points: parseInt(q.points.toString(), 10),
      })),
      durationMinutes: parseInt(durationMinutes, 10),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] flex flex-col bg-white">
        <DialogHeader className="shrink-0 border-b pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-800">Create New Quiz</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700">Quiz Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter quiz name"
              disabled={isPending}
              className="border-gray-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="topic" className="text-gray-700">Quiz Topic</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter topic"
              disabled={isPending}
              className="border-gray-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration" className="text-gray-700">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              placeholder="Duration in minutes"
              disabled={isPending}
              className="border-gray-300"
            />
          </div>
          <div className="space-y-4 border-t pt-4">
            <Label className="text-gray-700 text-lg font-semibold">Add Question</Label>
            <Input
              value={currentQuestion.text}
              onChange={(e) => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
              placeholder="Enter question text"
              disabled={isPending}
              className="border-gray-300"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                value={currentQuestion.optionA}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, optionA: e.target.value })}
                placeholder="Option A"
                disabled={isPending}
                className="border-gray-300"
              />
              <Input
                value={currentQuestion.optionB}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, optionB: e.target.value })}
                placeholder="Option B"
                disabled={isPending}
                className="border-gray-300"
              />
              <Input
                value={currentQuestion.optionC}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, optionC: e.target.value })}
                placeholder="Option C"
                disabled={isPending}
                className="border-gray-300"
              />
              <Input
                value={currentQuestion.optionD}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, optionD: e.target.value })}
                placeholder="Option D"
                disabled={isPending}
                className="border-gray-300"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-700">Correct Option</Label>
                <Select
                  value={currentQuestion.correctOption}
                  onValueChange={(value) =>
                    isCorrectOption(value)
                      ? setCurrentQuestion({ ...currentQuestion, correctOption: value })
                      : toast("Error: Invalid correct option")
                  }
                  disabled={isPending}
                >
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a">A</SelectItem>
                    <SelectItem value="b">B</SelectItem>
                    <SelectItem value="c">C</SelectItem>
                    <SelectItem value="d">D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-700">Points</Label>
                <Input
                  type="number"
                  value={currentQuestion.points}
                  onChange={(e) =>
                    setCurrentQuestion({ ...currentQuestion, points: parseInt(e.target.value, 10) || 1 })
                  }
                  placeholder="Points"
                  disabled={isPending}
                  className="border-gray-300"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700">Difficulty</Label>
              <Select
                value={currentQuestion.difficulty}
                onValueChange={(value) =>
                  setCurrentQuestion({
                    ...currentQuestion,
                    difficulty: value as "easy" | "medium" | "hard",
                  })
                }
                disabled={isPending}
              >
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              onClick={addQuestion}
              disabled={isPending}
              className="bg-purple-700 hover:bg-purple-800 text-white"
            >
              Add Question
            </Button>
          </div>
          {questions.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Added Questions ({questions.length})
              </h3>
              <ul className="space-y-3 max-h-52 overflow-y-auto border rounded-md p-3 bg-gray-50">
                {questions.map((q, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between items-center text-sm text-gray-700 bg-white p-3 rounded shadow-sm"
                  >
                    <span>{q.text}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeQuestion(idx)}
                      disabled={isPending}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="shrink-0 flex justify-between items-center px-6 py-4 border-t">
          <Button
            type="button"
            onClick={handleAIClick}
            disabled={isPending || !topic}
            className="bg-purple-700 hover:bg-purple-800 text-white"
          >
            Generate AI Questions
          </Button>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              className="bg-purple-700 hover:bg-purple-800 text-white"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Quiz"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const TeacherDashboard = () => {
  const { data: session, isPending } = useSession();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: quizzes, isLoading, refetch } = api.quiz.getTeacherQuizzes.useQuery(undefined, {
    enabled: !isPending,
  });

  const toggleActive = api.quiz.toggleQuizActive.useMutation({
    onSuccess: () => refetch(),
    onError: (err) => toast(`Error: ${err.message}`),
  });

  if (isPending || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-200 to-purple-700">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-200 to-purple-700">
        <p className="text-white text-lg">Please log in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-bl from-purple-200 to-purple-700 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-white">Teacher Dashboard</h1>
          <Button
            onClick={() => setDialogOpen(true)}
            size="lg"
            className="bg-white text-black hover:bg-gray-200"
          >
            Create New Quiz
          </Button>
        </div>

        <CreateQuizDialog open={dialogOpen} onOpenChange={setDialogOpen} />

        {quizzes?.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white text-xl">You haven’t created any quizzes yet.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {quizzes?.map((quiz) => (
              <Card
                key={quiz.id}
                className="bg-white border-gray-200 hover:shadow-md transition-shadow"
              >
                <CardHeader className="border-b">
                  <CardTitle className="text-gray-800 text-lg">{quiz.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <p className="text-gray-600">
                    Code: <span className="font-mono text-gray-800">{quiz.code}</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <Label className="text-gray-700">Active:</Label>
                    <Switch
                      checked={quiz.active}
                      onCheckedChange={(active) =>
                        toggleActive.mutate({ quizId: quiz.id, active })
                      }
                      disabled={toggleActive.isPending}
                      className="data-[state=checked]:bg-purple-700"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Link href={`/teacher/viewresults/${quiz.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-purple-200 text-black border-none hover:bg-gray-200"
                      >
                        View Results
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
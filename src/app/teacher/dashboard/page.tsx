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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

// Correct Typing
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
      onOpenChange(false);
    },
    onError: (err) => {
      toast(`Error: ${err.message}`);
    },
  });

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
    setQuestions([...questions, currentQuestion]);
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

  const handleAIClick = async () => {
    try {
      const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

      if (!GEMINI_API_KEY) {
        throw new Error("Gemini API key is not defined");
      }

      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Generate a JSON object with multiple-choice questions and difficulty should be there for every question with the following structure:
      - Topic: "${topic}"
      - "questions" array containing:
        - "text": string
        - "optionA", "optionB", "optionC", "optionD": string
        - "correctOption": "a" | "b" | "c" | "d"
        - "points": 1
        - "difficulty": "easy" | "medium" | "hard"
      `;

      const resultResponse = await model.generateContent(prompt);
      const responseText = resultResponse.response.text();

      // Clean and parse JSON safely
      const cleanedResponse = responseText.replace(/```(json)?/g, "").trim();
      const parsedData = JSON.parse(cleanedResponse) as { questions: Question[] };

      console.log("AI Generated Questions:", parsedData.questions);
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Quiz</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Quiz Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter quiz name"
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="topic">Quiz Topic</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter topic"
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              placeholder="Duration in minutes"
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label>Question</Label>
            <Input
              value={currentQuestion.text}
              onChange={(e) => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
              placeholder="Enter question text"
              disabled={isPending}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input
              value={currentQuestion.optionA}
              onChange={(e) => setCurrentQuestion({ ...currentQuestion, optionA: e.target.value })}
              placeholder="Option A"
              disabled={isPending}
            />
            <Input
              value={currentQuestion.optionB}
              onChange={(e) => setCurrentQuestion({ ...currentQuestion, optionB: e.target.value })}
              placeholder="Option B"
              disabled={isPending}
            />
            <Input
              value={currentQuestion.optionC}
              onChange={(e) => setCurrentQuestion({ ...currentQuestion, optionC: e.target.value })}
              placeholder="Option C"
              disabled={isPending}
            />
            <Input
              value={currentQuestion.optionD}
              onChange={(e) => setCurrentQuestion({ ...currentQuestion, optionD: e.target.value })}
              placeholder="Option D"
              disabled={isPending}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Correct Option</Label>
              <Select
                value={currentQuestion.correctOption}
                onValueChange={(value) => {
                  if (isCorrectOption(value)) {
                    setCurrentQuestion({ ...currentQuestion, correctOption: value });
                  } else {
                    toast("Error: Invalid correct option selected");
                  }
                }}
                disabled={isPending}
              >
                <SelectTrigger>
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
              <Label>Points</Label>
              <Input
                type="number"
                value={currentQuestion.points}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, points: parseInt(e.target.value, 10) || 1 })}
                placeholder="Points"
                disabled={isPending}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Difficulty</Label>
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
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="button" onClick={addQuestion} disabled={isPending}>
            Add Question
          </Button>
          <Button type="button" onClick={handleAIClick} disabled={isPending || !topic}>
            Generate AI Questions
          </Button>
          {questions.length > 0 && (
            <div className="max-h-32 overflow-y-auto">
              <h3 className="text-sm font-semibold">Questions:</h3>
              <ul className="space-y-1">
                {questions.map((q, idx) => (
                  <li key={idx} className="text-sm">{q.text}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isPending}>
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

// TeacherDashboard as the actual page component
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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Please log in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
        <Button onClick={() => setDialogOpen(true)}>Create New Quiz</Button>
      </div>

      <CreateQuizDialog open={dialogOpen} onOpenChange={setDialogOpen} />

      {quizzes?.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-500">You haven’t created any quizzes yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quizzes?.map((quiz) => (
            <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{quiz.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Code: <span className="font-mono">{quiz.code}</span></p>
                <div className="flex items-center gap-2 mt-2">
                  <Label>Active:</Label>
                  <Switch
                    checked={quiz.active}
                    onCheckedChange={(active) =>
                      toggleActive.mutate({ quizId: quiz.id, active })
                    }
                    disabled={toggleActive.isPending}
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <Link href={`/quiz/${quiz.id}`}>
                    <Button variant="outline" size="sm">
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
  );
};

export default TeacherDashboard;
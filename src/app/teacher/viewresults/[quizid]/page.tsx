// app/quiz/[id]/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { api } from "@/trpc/react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";

// Define types based on the tRPC endpoint response
type Attempt = {
    nickname: string;
    score: number;
    startTime: string;
    endTime: string | null;
  };
  
  // Define the Question type based on CreateQuizDialog
  type Question = {
    text: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctOption: "a" | "b" | "c" | "d"; // Assuming these are the valid values
    points: number;
    difficulty: "easy" | "medium" | "hard";
  };
  
  type QuizAnalyticsData = {
    quiz: {
      id: number;
      name: string;
      questions: Question[]; // Replaced 'any' with specific type
      durationMinutes: number;
      active: boolean;
    };
    analytics: {
      avgScore: string;
      highestScore: number;
      lowestScore: number;
      stdDeviation: string;
      avgTimeTaken: string;
      totalAttempts: number;
    };
    attempts: Attempt[];
  };

type ScoreData = {
  nickname: string;
  score: number;
};

type TimeData = {
  name: string;
  value: number;
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const QuizAnalytics = () => {
  const params = useParams<{ quizid: string }>();
  const quizId = Number(params.quizid);
  const router = useRouter();
  console.log(quizId);

  const { data, isLoading, isError, error } = api.analytics.getQuizAnalytics.useQuery(
    { quizId },
    {
      enabled: !isNaN(quizId),
    }
  );

  const [scoreData, setScoreData] = useState<ScoreData[]>([]);
  const [timeData, setTimeData] = useState<TimeData[]>([]);

  useEffect(() => {
    if (data && data.attempts.length > 0) {
      // Prepare score data for bar chart
      const scoreDist: ScoreData[] = data.attempts.map((a) => ({
        nickname: a.nickname,
        score: a.score,
      }));

      // Use Map for time ranges
      const timeRanges = new Map<string, number>([
        ["<10 min", 0],
        ["10-20 min", 0],
        ["20-30 min", 0],
        [">30 min", 0],
      ]);

      data.attempts.forEach((a) => {
        if (a.startTime && a.endTime) {
          const start = new Date(a.startTime).getTime();
          const end = new Date(a.endTime).getTime();
          const durationMinutes = (end - start) / (1000 * 60);

          if (durationMinutes < 10) {
            timeRanges.set("<10 min", (timeRanges.get("<10 min") ?? 0) + 1);
          } else if (durationMinutes < 20) {
            timeRanges.set("10-20 min", (timeRanges.get("10-20 min") ?? 0) + 1);
          } else if (durationMinutes < 30) {
            timeRanges.set("20-30 min", (timeRanges.get("20-30 min") ?? 0) + 1);
          } else {
            timeRanges.set(">30 min", (timeRanges.get(">30 min") ?? 0) + 1);
          }
        }
      });

      const timeChartData: TimeData[] = Array.from(timeRanges.entries())
        .filter(([, value]) => value > 0)
        .map(([name, value]) => ({
          name,
          value,
        }));

      setScoreData(scoreDist);
      setTimeData(timeChartData);
    }
  }, [data]);

//   useEffect(() => {
//     if (isError) {
//       toast.error(`Failed to load analytics: ${error?.message || "Unknown error"}`);
//       router.push("/teacher/dashboard");
//     }
//     if (isNaN(quizId)) {
//       toast.error("Invalid quiz ID");
//       router.push("/teacher/dashboard");
//     }
//   }, [isError, error, quizId, router]);

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Quiz Info and Stats */}
      <Card className="bg-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">{data.quiz.name} - Analytics</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p>
              <strong>Duration:</strong> {data.quiz.durationMinutes} min
            </p>
            <p>
              <strong>Total Attempts:</strong> {data.analytics.totalAttempts}
            </p>
            <p>
              <strong>Average Time Taken:</strong> {data.analytics.avgTimeTaken}
            </p>
          </div>
          <div className="space-y-2">
            <p>
              <strong>Average Score:</strong> {data.analytics.avgScore}
            </p>
            <p>
              <strong>Highest Score:</strong> {data.analytics.highestScore}
            </p>
            <p>
              <strong>Lowest Score:</strong> {data.analytics.lowestScore}
            </p>
            <p>
              <strong>Std Deviation:</strong> {data.analytics.stdDeviation}
            </p>
          </div>
        </CardContent>
      </Card>

      {data.attempts.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>No attempts recorded for this quiz yet.</p>
        </div>
      ) : (
        <>
          {/* Score Bar Chart */}
          <Card className="bg-gray-900 text-white">
            <CardHeader>
              <CardTitle>Score Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={scoreData}>
                  <XAxis dataKey="nickname" stroke="#ccc" tick={{ fill: "#ccc" }} />
                  <YAxis stroke="#ccc" tick={{ fill: "#ccc" }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#333", border: "none" }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Bar dataKey="score" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Time Taken Pie Chart */}
          <Card className="bg-gray-900 text-white">
            <CardHeader>
              <CardTitle>Time Taken Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={timeData} dataKey="value" nameKey="name" outerRadius={120}>
                    {timeData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#333", border: "none" }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Legend wrapperStyle={{ color: "#ccc" }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default QuizAnalytics;
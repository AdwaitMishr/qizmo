"use client";
import React, { useEffect, useState } from "react";
import { api } from "@/trpc/react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TrendingUp, Clock, Trophy } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Keep existing type definitions
type Attempt = {
  nickname: string;
  score: number;
  startTime: string;
  endTime: string | null;
};

type Question = {
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: "a" | "b" | "c" | "d";
  points: number;
  difficulty: "easy" | "medium" | "hard";
};

type QuizAnalyticsData = {
  quiz: {
    id: number;
    name: string;
    questions: Question[];
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

const QuizAnalytics: React.FC = () => {
  const params = useParams<{ quizid: string }>();
  const quizId = Number(params.quizid);
  const router = useRouter();

  const { data, isLoading, isError } = api.analytics.getQuizAnalytics.useQuery(
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

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="px-16 py-24 space-y-8 w-screen mx-auto overflow-y-hidden bg-gradient-to-bl from-purple-200 to-purple-700">
      {/* Quiz Info and Stats */}
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">{data.quiz.name} Analytics</CardTitle>
          <Badge variant="secondary" className="uppercase">Quiz Report</Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Duration: {data.quiz.durationMinutes} min</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span>Total Attempts: {data.analytics.totalAttempts}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="h-4 w-4 text-muted-foreground" />
                <span>Average Time: {data.analytics.avgTimeTaken}</span>
              </div>
            </div>
            <div className="space-y-2 text-right">
              <div>
                <strong>Average Score:</strong> {data.analytics.avgScore}
              </div>
              <div>
                <strong>Highest Score:</strong> {data.analytics.highestScore}
              </div>
              <div>
                <strong>Lowest Score:</strong> {data.analytics.lowestScore}
              </div>
              <div>
                <strong>Std Deviation:</strong> {data.analytics.stdDeviation}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {data.attempts.length === 0 ? (
        <div className="text-center text-white">
          <p>No attempts recorded for this quiz yet.</p>
        </div>
      ) : (
        <>
          <Separator className="my-4" />
          {/* Score Bar Chart */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Score Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={scoreData}>
                  <XAxis 
                    dataKey="nickname" 
                    className="text-xs" 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    className="text-xs" 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="score" fill="#00C49F" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Time Taken Pie Chart */}
          <Card className="w-full" >
            <CardHeader>
              <CardTitle>Time Taken Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie 
                    data={timeData} 
                    dataKey="value" 
                    nameKey="name" 
                    innerRadius={60} 
                    outerRadius={100}
                  >
                    {timeData.map((_, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                        className="hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '8px', 
                      backgroundColor: 'var(--background)', 
                      border: '1px solid var(--border)' 
                    }} 
                  />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center" 
                    wrapperStyle={{ paddingTop: '10px' }} 
                  />
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
"use client";
import React, { useState, useEffect } from "react";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";

const JoinQuizPage = () => {
  const [code, setCode] = useState("");
  const [nickname, setNickname] = useState<string>("");
  const [duration, setDuration] = useState<number>(0);
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if(!session.isPending){
      setNickname(session.data?.user?.name ?? "")
    }
    
    
  }, [session])


  
  

  const { data, isFetching, refetch, error } = api.participation.getQuizByCode.useQuery(
    { code },
    {
      enabled: false,
      retry: false,
    }
  );

  useEffect(() => {
    if (data) {
      // Ensure durationMinutes is a number before setting state
      const quizDuration = data.durationMinutes ?? 0;
      setDuration(quizDuration);

      
      router.push(
        `/play/0?code=${encodeURIComponent(code)}&nickname=${encodeURIComponent(nickname)}&quiz_id=${encodeURIComponent(data.id)}`
      );
    }
    if (error) {
      toast(`Error: ${error.message}`);
    }
  }, [data, error, code, nickname, router]);

  const handleJoin = async () => {
    if (!code || code.length !== 8) {
      toast("Error: Please enter a valid 8-character quiz code");
      return;
    }
    console.log(nickname);
    
    console.log("JoinQuizPage: Attempting join with code:", code, "nickname:", nickname);
    await refetch();
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Join a Quiz</h1>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Quiz Code</Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter 8-character code"
              maxLength={8}
              disabled={isFetching}
            />
          </div>
          
          <Button
            onClick={handleJoin}
            disabled={isFetching}
            className="w-full"
          >
            {isFetching ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Joining...
              </>
            ) : (
              "Join Quiz"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JoinQuizPage;
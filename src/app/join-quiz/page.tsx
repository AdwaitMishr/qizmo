"use client";
import React, { useState, useEffect } from "react";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const JoinQuizPage = () => {
  const [code, setCode] = useState("");
  const [nickname, setNickname] = useState("");
  const router = useRouter();

  const { data, isFetching, refetch, error } = api.participation.getQuizByCode.useQuery(
    { code },
    {
      enabled: false,
      retry: false,
    }
  );

  useEffect(() => {
    if (data) {
      console.log("JoinQuizPage: Quiz found:", data);
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
    if (!nickname) {
      toast("Error: Please enter a nickname");
      return;
    }
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
              onChange={(e) => setCode(e.target.value)} // Uppercase for consistency
              placeholder="Enter 8-character code"
              maxLength={8}
              disabled={isFetching}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nickname">Nickname</Label>
            <Input
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Enter your nickname"
              maxLength={50}
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
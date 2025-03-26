'use client';

import React, { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

// Extend the existing SignUpEmailInput interface to include isTeacher
interface SignUpEmailInput {
  email: string;
  password: string;
  name: string;
  callbackURL?: string;
  isTeacher?: boolean;
}

const SignupForm: React.FC = () => {
  const router = useRouter();
  // State variables to store user input
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isTeacher, setIsTeacher] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent page refresh on form submission

    const signUpData: SignUpEmailInput = {
      email,
      password,
      name,
      isTeacher,
      callbackURL: "/",
    };

    const { data, error } = await authClient.signUp.email(signUpData);

    if (error) {
      console.error("Sign-up error:", error);
      return; // Handle error (e.g., show error message to user)
    }

    console.log("Sign-up successful:", data);
    router.push("/")
  };

  return (
    <Card className="max-w-md mx-auto flex justify-center mt-[10%] p-6 shadow-md rounded-lg">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full"
          />

          {/* Email Input */}
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full"
          />

          {/* Password Input */}
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full"
          />

          {/* Teacher Checkbox */}
          <label className="flex items-center text-sm">
            <input
              type="checkbox"
              checked={isTeacher}
              onChange={(e) => setIsTeacher(e.target.checked)}
              className="mr-2"
            />
            Are you a teacher?
          </label>

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignupForm;

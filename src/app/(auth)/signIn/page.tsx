'use client';

import React, { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const SignInForm: React.FC = () => {
  // State variables for email and password input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent page refresh on form submission

    const signInData = { email, password };

    const { data, error } = await authClient.signIn.email(signInData);

    if (error) {
      console.error("Sign-in error:", error);
    }


    console.log("Sign-in successful:", data);
    router.push("/")
  };

  return (<div className="h-screen w-full flex items-center justify-center shadow-md bg-linear-to-t from-purple-100 to-purple-500">
    <Card className="w-120  mx-auto flex justify-center   shadow-md bg-purple-200  rounded-lg">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Enter your email below to login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <CardDescription className="font-bold">Email</CardDescription>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full bg-white h-12"
          />
          {/* Password Input */}
          
          <CardDescription className="font-bold" >Password</CardDescription>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full bg-white h-12"
          />

          {/* Submit Button */}
          <Button type="submit" className="w-full bg-purple-500 text-white hover:bg-purple-900">
            Sign In
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-center">
        {"Don't have an account ? "} 
          <Link href = "./signUp" >  <CardDescription className=" p-2 text-base  text-purple-400 hover:text-purple-900" >Sign Up</CardDescription>
          </Link>
         </CardFooter>
    </Card>
  </div>
    
  );
};

export default SignInForm;
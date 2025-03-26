'use client';
import Link from "next/link";
import React, { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
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

  return ( <div className="h-screen w-full flex items-center justify-center shadow-md bg-linear-to-t from-purple-100 to-purple-500">
<Card className="w-120 mx-auto flex justify-center  p-6 shadow-md bg-purple-200 rounded-lg">
      <CardHeader>
        <CardTitle className="text-xl" >Sign Up</CardTitle>
         <CardDescription> Enter your information to create an account </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <CardDescription className="font-bold" >Name</CardDescription>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full bg-white h-12"
          />

          {/* Email Input */}
          <CardDescription className="font-bold" >Email</CardDescription>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full bg-white h-12 "
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
          <Button type="submit" className="w-full bg-purple-500 text-white hover:bg-purple-900">
            Sign Up
          </Button>
          <CardFooter> {"Already have an account ?"}
            <Link href ="./signIn"> <CardDescription className=" p-2 text-base text-purple-400 hover:text-purple-900" > Sign In</CardDescription> </Link> 
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  
  </div>
    );
};

export default SignupForm;



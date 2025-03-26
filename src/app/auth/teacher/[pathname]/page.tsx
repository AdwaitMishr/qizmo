'use client'

import React, { useState } from "react";
import { authClient } from "@/lib/auth-client";

// Extend the existing SignUpEmailInput interface to include isTeacher
interface SignUpEmailInput {
    email: string;
    password: string;
    name: string;
    callbackURL?: string;
    isTeacher?: boolean;
}

const AuthenticationForm: React.FC = () => {
  // State variables to store user input
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isTeacher, setIsTeacher] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();  // Prevent page refresh on form submission

    // Cast the input to the extended interface
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
      // Handle error (e.g., show error message to user)
      return;
    }

    console.log("Sign-up successful:", data);

    // Log the collected data (can be sent to backend here)
    console.log("Email:", email);
    console.log("Name:", name);
    console.log("Is Teacher:", isTeacher);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-80">
        <h2 className="text-xl font-semibold mb-4 text-center">Authentication Form</h2>

        {/* Name Input */}
        <label className="block mb-2 text-sm font-medium">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full border rounded-lg p-2 mb-4"
        />

        {/* Email Input */}
        <label className="block mb-2 text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full border rounded-lg p-2 mb-4"
        />

        {/* Password Input */}
        <label className="block mb-2 text-sm font-medium">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="w-full border rounded-lg p-2 mb-4"
        />

        {/* Teacher Checkbox */}
        <label className="block mb-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={isTeacher}
            onChange={(e) => setIsTeacher(e.target.checked)}
            className="mr-2"
          />
          Are you a teacher?
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg mt-4"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AuthenticationForm; 
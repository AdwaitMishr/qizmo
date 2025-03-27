"use client"
import React from 'react'
import {Card, CardHeader, CardTitle, CardContent, CardFooter} from "@/components/ui/card"
import { Button } from '@/components/ui/button'

const page = () => {
  return (
    <div className="container mx-auto py-8 px-4">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Quiz Submitted</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">Your answers have been submitted successfully.</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => (window.location.href = "/")}>Return to home</Button>
          </CardFooter>
        </Card>
      </div>
  )
}

export default page

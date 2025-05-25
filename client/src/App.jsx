import React from "react";
import { Button } from "@/components/ui/button"; // Adjust the import path as needed

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Raise It</h1>
        <p className="text-gray-600 mb-8">
          Empower your ideas. Fund your dreams. Join the Raise It community and
          start your journey today!
        </p>
        <Button className="w-full">Get Started</Button>
      </div>
    </div>
  );
}

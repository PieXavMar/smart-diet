"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/app/components/card";
import Button from "@/app/components/button";

export default function DashboardPage() {
  const router = useRouter();

  // Go to AI page when user clicks the button
  const handleGoToAI = () => {
    router.push("/ai");
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-xl">
        <h1 className="text-3xl font-bold text-green-700 mb-4">
          Dashboard
        </h1>

        <p className="text-gray-700 mb-2">
          You are now logged in with 2FA.
        </p>

        <Button
          onClick={handleGoToAI}
          className="bg-green-700 w-full"
        >
          Go to AI Assistant
        </Button>
      </Card>
    </div>
  );
}

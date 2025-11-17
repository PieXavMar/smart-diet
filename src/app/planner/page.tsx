/*Planner page where the app will spit out a 7-day meal plan based on user inputs.
*/
"use client";
//use components for UI overhaul
import Button from "@/app/components/button";
import { Card } from "@/app/components/card";
import { useState } from "react";

export default function PlannerPage() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<any>(null);

  async function generatePlan() {
    setLoading(true);
    const res = await fetch("/api/ai/plan", { method: "POST" });
    const json = await res.json();
    setPlan(json);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-green-50 px-4 py-6">
      <h1 className="text-4xl font-bold text-green-700 mb-6">Meal Planner</h1>

      <Button onClick={generatePlan}>
        {loading ? "Generating..." : "Generate 7-Day Meal Plan"}
      </Button>

      <div className="mt-8 space-y-6">
        {plan?.days?.map((day: any) => (
          <Card key={day.day}>
            <h2 className="text-2xl font-bold text-green-700 mb-4">Day {day.day}</h2>

            <div className="space-y-4">
              {day.meals.map((m: any, i: number) => (
                <Card key={i} className="border border-green-200 p-4">

                  <h3 className="text-xl font-semibold mb-1">{m.name}</h3>
                  <p className="text-gray-600 mb-3">{m.description}</p>

                  {/* NUTRITION */}
                  <div className="flex gap-4 text-sm text-gray-700 mb-3">
                    <span>🔥 {m.calories} cal</span>
                    <span>🥩 {m.protein}g protein</span>
                    <span>🍞 {m.carbs}g carbs</span>
                    <span>🧈 {m.fat}g fat</span>
                  </div>

                  {/* TIME + COST */}
                  <div className="flex justify-between text-sm text-green-700 font-medium mb-3">
                    <span>⏱ Prep Time: {m.time || "20 mins"}</span>
                    <span>💲 Estimated Cost: ${m.cost || "3.50"}</span>
                  </div>

                  {/* RECIPE INSTRUCTIONS */}
                  <h4 className="text-green-700 font-semibold mb-1">Recipe:</h4>
                  <ul className="list-disc ml-6 text-gray-700 text-sm space-y-1">
                    {m.instructions?.map((step: string, idx: number) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>

                  {/* COST SAVING + ACCESSIBILITY */}
                  <div className="mt-4">
                    <h4 className="text-green-700 font-semibold mb-1">Budget Tip:</h4>
                    <p className="text-gray-700 text-sm">
                      {m.costSaving || "Use frozen veggies or store-brand products to reduce cost."}
                    </p>
                  </div>

                </Card>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

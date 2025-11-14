'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Meal ={
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type DayPlan ={
  day: number;
  meals: Meal[];
};

export default function PlannerPage(){
  const router = useRouter();
  const [plan, setPlan] = useState<{ days: DayPlan[] } | null>(null);
  const [loading, setLoading] = useState(false);

  async function generatePlan(){
    //log to see if function is called
    setLoading(true);
    console.log("🧠 Calling /api/ai/plan...");
    const res = await fetch('/api/ai/plan', { method: 'POST' });

    if(!res.ok){
      const error = await res.text();
      //log error
      console.error('❌ Plan generation failed:', error);
      setLoading(false);
      return;
    }

    const data = await res.json();
    console.log("📦 Got plan:", data);
    setPlan(data);
    setLoading(false);
  }
  //logging plan state
  useEffect(() =>{
    console.log("📦 Current plan state:", plan);
  }, [plan]);
  //formatting
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your AI Meal Plan</h1>

      {!plan && (
        <button
          onClick={generatePlan}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {loading ? 'Generating...' : 'Generate Plan'}
        </button>
      )}

      {plan && (
        <div className="mt-6 space-y-4">
          {plan.days.map((day) => (
            <div key={day.day} className="border p-4 rounded bg-white shadow">
              <h2 className="text-xl font-semibold">Day {day.day}</h2>
              {day.meals.map((meal, idx) => (
                <div key={idx} className="mt-2">
                  <h3 className="font-medium">{meal.name}</h3>
                  <p className="text-sm text-gray-700">{meal.description}</p>
                  <p className="text-xs text-gray-500">
                    {meal.calories} kcal | P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fat}g
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

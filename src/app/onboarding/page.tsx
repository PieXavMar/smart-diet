/*Onboarding page where users will be able to input information
such as height, weight, gender, activity level, dietary preferences, and allergies.
*/
"use client";
//use components for UI overhaul
import { useState } from "react";
import Button from "@/app/components/button";
import { Card } from "@/app/components/card";
import { useRouter } from "next/navigation";

export default function Onboarding() {
  const router = useRouter();

  // state
  const [diet, setDiet] = useState<string[]>([]);
  const [activity, setActivity] = useState("");
  const [goal, setGoal] = useState("");
  const [allergies, setAllergies] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");

  // helpers
  const toggleDiet = (type: string) => {
    setDiet((prev) =>
      prev.includes(type) ? prev.filter((d) => d !== type) : [...prev, type]
    );
  };

  const handleContinue = async () => {
    const parsedAllergies = parseAllergies(allergies);

    await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        height,
        weight,
        age,
        activity,
        goal,
        diet,
        allergies: parsedAllergies,
      }),
    });

    router.push("/2fa");
  };

  return (
    <div className="min-h-screen bg-green-50 flex justify-center items-center px-4 py-10">
      <Card className="w-full max-w-lg bg-white shadow-xl p-8 rounded-3xl">

        <h1 className="text-3xl font-bold text-green-700 mb-8 text-center">
          Set Up Your Profile
        </h1>

        {/* Height / Weight / Age in text inputs*/}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Input
            label="Height (cm)"
            placeholder="170"
            value={height}
            onChange={(e: any) => setHeight(e.target.value)}
          />
          <Input
            label="Weight (kg)"
            placeholder="70"
            value={weight}
            onChange={(e: any) => setWeight(e.target.value)}
          />
          <Input
            label="Age"
            placeholder="30"
            value={age}
            onChange={(e: any) => setAge(e.target.value)}
          />
        </div>

        {/* Activity in button group*/}
        <SectionTitle title="Activity Level" />
        <ButtonGroup
          options={["Low", "Moderate", "High"]}
          selected={activity}
          onSelect={setActivity}
        />

        {/* Goalin button group*/}
        <SectionTitle title="Goal" className="mt-6" />
        <ButtonGroup
          options={["Lose Weight", "Maintain Weight", "Gain Weight"]}
          selected={goal}
          onSelect={setGoal}
        />

        {/* Diet in tags*/}
        <SectionTitle title="Diet Type" className="mt-6" />
        <MultiTagGroup
          options={[
            "Vegan",
            "Vegetarian",
            "Pescatarian",
            "Halal",
            "Kosher",
            "Gluten-Free",
            "Dairy-Free",
            "Nut-Free",
            "Low-FODMAP",
            "Diabetic-Friendly",
            "Low-Carb",
            "Mediterranean",
          ]}
          selected={diet}
          onToggle={toggleDiet}
        />

        {/* Allergies in text input */}
        <SectionTitle title="Allergies" className="mt-6" />
        <Input
          label="Allergies (comma separated)"
          placeholder="e.g. peanuts, shellfish"
          value={allergies}
          onChange={(e: any) => setAllergies(e.target.value)}
        />

        <div className="mt-8 flex justify-end">
          <Button onClick={handleContinue}>Continue</Button>
        </div>

      </Card>
    </div>
  );
}
//components
function Input({ label, placeholder, value, onChange }: any) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-700 mb-1 block">
        {label}
      </label>
      <input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-xl px-3 py-3 
                   text-gray-900 placeholder-gray-400
                   focus:ring-2 focus:ring-green-500 focus:border-green-500"
      />
    </div>
  );
}

function ButtonGroup({ options, selected, onSelect }: any) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((opt: string) => (
        <button
          key={opt}
          onClick={() => onSelect(opt)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition
          ${
            selected === opt
              ? "bg-green-600 text-white shadow-md"
              : "bg-green-100 text-green-700 hover:bg-green-200"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function MultiTagGroup({ options, selected, onToggle }: any) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((opt: string) => (
        <button
          key={opt}
          onClick={() => onToggle(opt)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition
          ${
            selected.includes(opt)
              ? "bg-green-600 text-white shadow-md"
              : "bg-green-100 text-green-700 hover:bg-green-200"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function SectionTitle({ title, className = "" }: any) {
  return (
    <h2 className={`text-lg font-bold text-gray-800 mb-2 mt-4 ${className}`}>
      {title}
    </h2>
  );
}
//helper to parse allergies
function parseAllergies(input: string) {
  return input
    .split(",")
    .map((a) => a.trim().toLowerCase())
    .filter((a) => a.length > 0);
}

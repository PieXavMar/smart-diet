'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();
  //ask for basic info from user
  const [form, setForm] = useState({
    age: '',
    heightCm: '',
    weightKg: '',
    sex: 'male',
    activityLevel: 'moderate',
    goal: 'maintain',
    dietType: 'none',
    allergies: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      ...form,
      age: Number(form.age),
      heightCm: Number(form.heightCm),
      weightKg: Number(form.weightKg),
      allergies: form.allergies
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean),
    };

    await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    router.push('/planner');
  }
  //formatting
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow max-w-md w-full space-y-4"
      >
        <h1 className="text-xl font-semibold text-center">Set up your profile</h1>

        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Age"
            className="border px-3 py-2 rounded w-1/2"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
          />
          <input
            type="number"
            placeholder="Height (cm)"
            className="border px-3 py-2 rounded w-1/2"
            value={form.heightCm}
            onChange={(e) => setForm({ ...form, heightCm: e.target.value })}
          />
        </div>

        <input
          type="number"
          placeholder="Weight (kg)"
          className="border px-3 py-2 rounded w-full"
          value={form.weightKg}
          onChange={(e) => setForm({ ...form, weightKg: e.target.value })}
        />

        <select
          className="border px-3 py-2 rounded w-full"
          value={form.sex}
          onChange={(e) => setForm({ ...form, sex: e.target.value })}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <select
          className="border px-3 py-2 rounded w-full"
          value={form.activityLevel}
          onChange={(e) => setForm({ ...form, activityLevel: e.target.value })}
        >
          <option value="low">Low activity</option>
          <option value="moderate">Moderate</option>
          <option value="high">High activity</option>
        </select>

        <select
          className="border px-3 py-2 rounded w-full"
          value={form.goal}
          onChange={(e) => setForm({ ...form, goal: e.target.value })}
        >
          <option value="lose">Lose weight</option>
          <option value="maintain">Maintain weight</option>
          <option value="gain">Gain weight</option>
        </select>

        <select
          className="border px-3 py-2 rounded w-full"
          value={form.dietType}
          onChange={(e) => setForm({ ...form, dietType: e.target.value })}
        >
          <option value="none">No special diet</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="halal">Halal</option>
          <option value="kosher">Kosher</option>
          <option value="pescatarian">Pescatarian</option>
        </select>

        <input
          type="text"
          placeholder="Allergies (comma separated)"
          className="border px-3 py-2 rounded w-full"
          value={form.allergies}
          onChange={(e) => setForm({ ...form, allergies: e.target.value })}
        />

        <button
          type="submit"
          className="w-full py-2 rounded bg-indigo-600 text-white font-medium mt-2"
        >
          Save and generate plan
        </button>
      </form>
    </main>
  );
}
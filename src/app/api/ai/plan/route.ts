import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import mongoose from "mongoose";

// helper to extract JSON from GPT
function extractJSON(text: string): any | null {
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1) {
    console.warn("Could not find JSON braces in response.");
    return null;
  }

  const jsonString = text.slice(firstBrace, lastBrace + 1);

  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error("JSON parsing error:", e);
    return null;
  }
}

export async function POST() {
  console.log("API route hit: /api/ai/plan");

  // connect DB
  const dbClient = await connectDB();

  // find user profile using userId field (now exists in schema)
  const profile = await User.findOne({ userId: "demo-user" });


  if (!profile) {
    return NextResponse.json(
      { error: "No profile found" },
      { status: 400 }
    );
  }

  // SYSTEM PROMPT
  const systemPrompt = `
You are a culturally-inclusive, affordability-focused nutrition assistant.

Your goal is to generate healthy meal plans that are:
- affordable
- culturally diverse
- beginner-friendly
- free of fad diet nonsense

Return ONLY JSON:
{
  "days": [
    {
      "day": number,
      "meals": [
        {
          "name": string,
          "description": string,
          "calories": number,
          "protein": number,
          "carbs": number,
          "fat": number,
          "time": string,
          "cost": string,
          "costSaving": string,
          "instructions": string[]
        }
      ]
    }
  ]
}
`;

  // USER PROMPT
  const userPrompt = `
User profile:
Age: ${profile.age}
Height: ${profile.heightCm} cm
Weight: ${profile.weightKg} kg
Goal: ${profile.goal}
Activity Level: ${profile.activityLevel}
Diet Type: ${profile.dietType}
Allergies: ${profile.allergies?.join(", ") || "None"}

Generate a 7-day meal plan following the structure.
`;

  // CALL GPT API
  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
    }),
  });

  const json = await resp.json();

  if (!json.choices?.[0]?.message?.content) {
    console.error("GPT error:", json);
    return NextResponse.json(
      { error: "GPT returned no content" },
      { status: 500 }
    );
  }

  const raw = json.choices[0].message.content;
  const plan = extractJSON(raw);

  if (!plan) {
    return NextResponse.json(
      { error: "Invalid JSON from GPT" },
      { status: 500 }
    );
  }

  // SAVE PLAN
  try {
    const db =
      (dbClient as any)?.connection?.db ??
      mongoose.connection.db;

    if (!db) {
      console.error("No DB available to save plan; skipping save.");
    } else {
      await db.collection("plans").insertOne({
        userId: profile.userId,
        createdAt: new Date(),
        plan,
      });
    }
  } catch (e) {
    console.error("Failed to save plan:", e);
  }

  return NextResponse.json(plan);
}



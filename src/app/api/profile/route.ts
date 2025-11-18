import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  // TEMP: demo-user for SmartDiet
  const userId = "demo-user";

  await User.updateOne(
    { userId },        // <<< FIXED (no _id)
    {
      userId,
      heightCm: body.height,
      weightKg: body.weight,
      age: body.age,
      goal: body.goal,
      activityLevel: body.activity,
      dietType: body.diet,
      allergies: body.allergies
    },
    { upsert: true }
  );

  return NextResponse.json({ ok: true });
}

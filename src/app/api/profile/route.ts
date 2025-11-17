import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const db = await getDb();
  const userId = 'demo-user';
  //modified to store user profile data
  await db.collection("profiles").updateOne(
  { userId: "demo-user" },
  {
    $set: {
      heightCm: body.height,
      weightKg: body.weight,
      age: body.age,
      activityLevel: body.activity,
      goal: body.goal,
      dietType: body.diet,
      allergies: body.allergies ?? [],
    },
  },
  { upsert: true }
);

  return NextResponse.json({ success: true });
}

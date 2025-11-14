import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const db = await getDb();
  const userId = 'demo-user';

  await db.collection('profiles').updateOne(
    { userId },
    { $set: { ...body, userId } },
    { upsert: true }
  );

  return NextResponse.json({ success: true });
}

import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

//extract JSON from GPT response
function extractJSON(text: string): any | null {
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');

  if (firstBrace === -1 || lastBrace === -1) {
    console.warn('Could not find JSON braces in response.');
    return null;
  }

  const jsonString = text.slice(firstBrace, lastBrace + 1);
  console.log('Extracted JSON string:\n', jsonString); //log the extracted portion
  //parse JSON
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error('JSON parsing error:', e);
    return null;
  }
}

export async function POST() {
  console.log("API route hit: /api/ai/plan");

  const db = await getDb();
  const profile = await db.collection('profiles').findOne({ userId: 'demo-user' });

  if (!profile) {
    return NextResponse.json({ error: 'No profile found' }, { status: 400 });
  }
//prompts for GPT
  const systemPrompt = `
You are a helpful nutrition assistant. Return ONLY valid JSON with no explanation or formatting. It must match this structure:

{
  "days": [
    {
      "day": 1,
      "meals": [
        {
          "name": "Meal Name",
          "description": "Short description",
          "calories": 400,
          "protein": 30,
          "carbs": 45,
          "fat": 15
        }
      ]
    }
  ]
}
`;

  const userPrompt = `
User profile:
Age: ${profile.age}
Height: ${profile.heightCm} cm
Weight: ${profile.weightKg} kg
Sex: ${profile.sex}
Goal: ${profile.goal}
Activity Level: ${profile.activityLevel}
Diet Type: ${profile.dietType}
Allergies: ${profile.allergies?.join(', ') || 'None'}
Generate a 7-day meal plan tailored to these needs.
`;
//call to GPT API
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
    }),
  });

  const json = await resp.json();
  if (!json.choices || !json.choices[0]?.message?.content) {
    console.error(' GPT API error response:', json);
    return NextResponse.json({ error: 'No response from GPT' }, { status: 500 });
  }
  const raw = json.choices[0].message.content;

  console.log('📦 Raw GPT response:', raw);

  const plan = extractJSON(raw);

  if (!plan) {
    console.error(' Failed to parse GPT response:', raw);
    return NextResponse.json({ error: 'Invalid JSON from GPT' }, { status: 500 });
  }

  console.log('Parsed GPT plan:', plan);

  // persist plan to DB
  try {
    const saved = await db.collection('plans').insertOne({
      userId: profile.userId, // or session.user.id if you switch to auth
      createdAt: new Date(),
      plan
    });
    console.log('Saved plan to DB with ID:', saved.insertedId);
  } catch (e) {
    console.error('Failed to save plan to DB:', e);
    // proceed to return the plan even if saving fails
  }

  return NextResponse.json(plan);
}

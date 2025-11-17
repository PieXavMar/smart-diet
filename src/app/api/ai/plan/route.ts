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
//modified prompt to uphold the apps values of affordability and inclusivity
  const systemPrompt = `
You are a culturally-inclusive, affordability-focused nutrition assistant.

Your goal is to generate healthy meal plans that are:
- affordable for people without access to high-end grocery stores
- low-cost and accessible for students, low-income users, food deserts
- free from fad-diet misinformation and influencer pseudoscience
- inclusive of multiple cultures and cuisines
- based on evidence-backed dietary guidelines

Return ONLY valid JSON matching this structure:
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

          "time": string,          // example: "15 mins"
          "cost": string,          // example: "3.50"
          "costSaving": string,    // budget-friendly tips
          "instructions": string[] // recipe steps
        }
      ]
    }
  ]
}
  Rules:
1. Use only ingredients available at Walmart, Aldi, H-E-B, Kroger, or similar stores.
2. Keep meals budget-friendly: aim for no more than 10 dollars per meal.
3. Include cost-saving swaps (frozen vegetables, store brands, beans/legumes, etc.).
4. Include culturally diverse meals (Latin American, African, Asian, Mediterranean, Caribbean, Southern US, etc.).
5. Avoid class-biased assumptions like expensive supplements, organic-only, or specialty stores.
6. Avoid any form of fad diets (keto influencers, detox tea, extreme fasting, etc.).
7. Keep recipe steps simple and friendly for beginners.
8. You MUST avoid all allergens listed above in every meal, every ingredient, and every recipe step. If an allergy is common (peanuts, shellfish, milk, soy, wheat), you must recommend alternative ingredients.
9. Keep JSON strictly valid—never return text outside JSON.
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

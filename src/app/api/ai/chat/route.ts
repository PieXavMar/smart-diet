import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();

        const fakeReplies = [
            "A quick tip: picking whole-grain versions usually adds more fiber. For example, whole-grain bread instead of white bread.",
            "If you’re unsure which option to pick, checking the nutrition label for added sugars and sodium can help you choose a healthier product.",
            "It depends on the cereal, but many regular cereals have a lot of added sugar. A simple healthier swap is choosing something higher in fiber or lower in sugar, like bran-based cereal or oatmeal.",
        ];

        const reply = "Probably wrong but here it is: " +
            fakeReplies[Math.floor(Math.random() * fakeReplies.length)];

        return NextResponse.json({ reply });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: "Fake AI error" },
            { status: 500 }
        );
    }
}

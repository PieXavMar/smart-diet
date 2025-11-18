"use client";

import { useState } from "react";

export default function AIPage() {
    const [prompt, setPrompt] = useState("");
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);

    const askAI = async () => {
        setLoading(true);
        setAnswer("");

        const res = await fetch("/api/ai/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt })
        });

        const data = await res.json();
        setLoading(false);

        setAnswer(data.reply || "No response");
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            {/* green title */}
            <h1 className="text-3xl font-bold mb-6 text-green-700">
                AI Assistant
            </h1>

            <textarea
                placeholder="Ask something..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-40 p-3 border rounded mb-4 text-black"
            />

            {/* Moral note */}
            <p className="text-sm text-gray-600 mt-3">
                Note: AI is not perfect, verify important info yourself!!!
            </p>

            <button
                onClick={askAI}
                className="px-4 py-2 bg-green-600 text-white rounded"
                disabled={loading}
            >
                {loading ? "Thinking..." : "Ask AI"}
            </button>

            {/* Answer box */}
            <div className="mt-6 p-4 bg-white shadow rounded text-black">
                {answer}
            </div>

        </div>
    );
}

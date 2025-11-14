'use client';

import { useState } from 'react';
type ChatMessage = { role: 'user' | 'assistant'; content: string };
//chat bot with the goal of helping user while shopping
export default function ShoppingPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  //able to scan barcode and provide nutritional info and possible recipe combinations
  const [barcode, setBarcode] = useState('');

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);

    const res = await fetch('/api/ai/shopping-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input, barcode: barcode || undefined }),
    });
    const data = await res.json();

    setMessages([...newMessages, { role: 'assistant', content: data.answer } as ChatMessage]);
    setInput('');
  }
  //formatting
  return (
    <main className="min-h-screen flex flex-col bg-slate-100">
      <div className="max-w-2xl mx-auto flex-1 flex flex-col p-4">
        <h1 className="text-2xl font-semibold mb-2">Shopping Assistant</h1>

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="Mock barcode, try 123456 or 987654"
            className="border px-3 py-2 rounded w-1/2"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
          />
        </div>

        <div className="flex-1 bg-white rounded-xl shadow p-3 overflow-y-auto space-y-2">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`max-w-[80%] px-3 py-2 rounded ${
                m.role === 'user'
                  ? 'bg-indigo-600 text-white ml-auto'
                  : 'bg-slate-200 text-gray-900'
              }`}
            >
              {m.content}
            </div>
          ))}
        </div>

        <form onSubmit={sendMessage} className="mt-3 flex gap-2">
          <input
            type="text"
            placeholder="Ask about this product..."
            className="flex-1 border px-3 py-2 rounded"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-2 rounded bg-indigo-600 text-white font-medium"
          >
            Send
          </button>
        </form>
      </div>
    </main>
  );
}

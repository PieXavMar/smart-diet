'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TwoFA() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch('/api/verify-2fa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });

    if (res.ok) {
      router.push('/onboarding');
    } else {
      setError('Incorrect code, try 123456 for demo');
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow max-w-sm w-full space-y-4"
      >
        <h1 className="text-xl font-semibold text-center">
          Two-factor verification
        </h1>
        <p className="text-sm text-gray-600 text-center">
          Enter your 6-digit code. For demo, the correct code is 123456.
        </p>
        <input
          type="text"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="border w-full px-3 py-2 rounded"
          placeholder="123456"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full py-2 rounded bg-indigo-600 text-white font-medium"
        >
          Verify
        </button>
      </form>
    </main>
  );
}

"use client";
import { useEffect, useState } from "react";
import Button from "@/app/components/button";
import { Card } from "@/app/components/card";
import { useRouter } from "next/navigation";

export default function VerifyTOTP() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem('tempUserId');
    
    if (!storedUserId) {
      router.push('/login');
      return;
    }
    
    setUserId(storedUserId);
  }, [router]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (code.length !== 6) {
      setError('Code must be 6 digits');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth?action=2fa_verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          code: code,
          isSetup: false
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      
      localStorage.removeItem('tempUserId');
      router.push('/onboarding');
      
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex justify-center items-center px-4">
      <Card className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-green-700 mb-6">
          Enter Verification Code
        </h1>
        
        <p className="text-gray-600 mb-6 text-center">
          Enter the 6-digit code from your authenticator app
        </p>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify}>
          <div className="mb-6">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-2xl text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <Button 
            onClick={handleVerify}
            className="bg-green-700"
            disabled={loading || code.length !== 6}
          >
            {loading ? 'Verifying...' : 'Verify'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => router.push('/2fa_verify')}
            className="text-green-600 hover:text-green-700 text-sm"
          >
            Back to options
          </button>
        </div>
      </Card>
    </div>
  );
}

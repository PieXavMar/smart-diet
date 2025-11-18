"use client";
import { useEffect, useState } from "react";
import Button from "@/app/components/button";
import { Card } from "@/app/components/card";
import { useRouter } from "next/navigation";

export default function SetupTOTP() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const initializeTOTP = async () => {
      const storedUserId = localStorage.getItem('tempUserId');
      
      if (!storedUserId) {
        router.push('/login');
        return;
      }
      
      setUserId(storedUserId);

      // Generate 2FA QR code
      try {
        const response = await fetch('/api/auth?action=2fa_generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: storedUserId })
        });

        if (response.ok) {
          const data = await response.json();
          setQrCode(data.qrCode);
          setSecret(data.secret);
        } else {
          setError('Failed to generate QR code');
        }
      } catch (err) {
        console.error('Error generating 2FA:', err);
        setError('Something went wrong');
      }
      
      setLoading(false);
    };

    initializeTOTP();
  }, [router]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (code.length !== 6) {
      setError('Code must be 6 digits');
      return;
    }

    setVerifying(true);

    try {
      const response = await fetch('/api/auth?action=2fa_verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          code: code,
          isSetup: true  // This is setup, not verification
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      // Setup successful
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      
      localStorage.removeItem('tempUserId');
      router.push('/dashboard');
      
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex justify-center items-center">
        <div className="text-green-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 flex justify-center items-center px-4">
      <Card className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-green-700 mb-6">
          Set Up TOTP
        </h1>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4 text-center">
            Scan this QR code with your authenticator app
          </p>
          
          {qrCode && (
            <div className="flex justify-center mb-4">
              <img src={qrCode} alt="QR Code" className="w-48 h-48" />
            </div>
          )}
          
          {secret && (
            <div className="bg-gray-100 p-3 rounded text-center mb-4">
              <p className="text-xs text-gray-600 mb-1">Or enter this code manually:</p>
              <code className="text-sm font-mono">{secret}</code>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify}>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Enter the 6-digit code to verify
            </label>
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
          >
            {verifying ? 'Verifying...' : 'Complete Setup'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => router.push('/2fa')}
            className="text-green-600 hover:text-green-700 text-sm"
          >
            Back to options
          </button>
        </div>
      </Card>
    </div>
  );
}

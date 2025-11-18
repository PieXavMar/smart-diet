"use client";
import { useEffect, useState } from "react";
import Button from "@/app/components/button";
import { Card } from "@/app/components/card";
import { useRouter } from "next/navigation";

export default function Verify2FA() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const initializeAuth = async () => {
      // Check if user has userId from login
      const storedUserId = localStorage.getItem('tempUserId');
      
      if (!storedUserId) {
        router.push('/login');
        return;
      }
      
      setUserId(storedUserId);
      setLoading(false);
    };

    initializeAuth();
  }, [router]);

  const handlePasskeyVerify = async () => {
    setError('');
    setVerifying(true);
    
    try {
      // TODO: Implement Passkey verification with WebAuthn API
      // For now, mock verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock success
      localStorage.setItem('authToken', 'mock-token-' + Date.now());
      localStorage.removeItem('tempUserId');
      router.push('/onboarding');
      
    } catch (err: any) {
      setError(err.message || 'Passkey verification failed');
      setVerifying(false);
    }
  };

  const handleTOTPVerify = () => {
    // Navigate to TOTP input page
    router.push('/2fa_verify/totp');
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
          Verify Authentication
        </h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <Button 
          onClick={handlePasskeyVerify} 
          className="mb-4"
          disabled={verifying}
        >
          {verifying ? '🔄 Verifying...' : '🔒 Verify with Passkey'}
        </Button>
        <Button 
          onClick={handleTOTPVerify} 
          className="bg-green-700"
          disabled={verifying}
        >
          ⏱️ Verify with TOTP
        </Button>
        <p className="text-gray-600 mt-6 text-center">
          Secure login with both passkey and verification code.
        </p>
      </Card>
    </div>
  );
}
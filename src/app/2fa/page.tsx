/*2fa page where users will be able to use their email
to set up either passkey or TOTP authentication methods.
Can use dummy 2fa if needed.
*/
"use client";
import { useEffect, useState } from "react";
import Button from "@/app/components/button";
import { Card } from "@/app/components/card";
import { useRouter } from "next/navigation";

export default function AuthSetup() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      // Check if user has userId from registration/login
      const storedUserId = localStorage.getItem('tempUserId');
      
      if (!storedUserId) {
        router.push('/login');
        return;
      }
      
      setUserId(storedUserId);

      // Check 2FA status
      try {
        const response = await fetch('/api/auth?action=2fa_setup_check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: storedUserId })
        });
        
        if (response.ok) {
          const data = await response.json();
          
          // If already set up, redirect to dashboard
          if (!data.needsSetup && data.has2FA) {
            router.push('/dashboard');
            return;
          }
        }
      } catch (err) {
        console.error('Error checking 2FA:', err);
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, [router]);

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
          Set Up Authentication
        </h1>
        <Button onClick={() => router.push("/2fa/passkey")} className="mb-4">
          🔒 Set Up Passkey
        </Button>
        <Button onClick={() => router.push("/2fa/totp")} className="bg-green-700">
          ⏱️ Set Up TOTP
        </Button>
        <p className="text-gray-600 mt-6 text-center">
          Secure login with both passkey and verification code.
        </p>
      </Card>
    </div>
  );
}

/*2fa page where users will be able to use their email
to set up either passkey or TOTP authentication methods.
Can use dummy 2fa if needed.
*/
"use client";
//use components for UI overhaul
import Button from "@/app/components/button";
import { Card } from "@/app/components/card";
import { useRouter } from "next/navigation";

export default function AuthSetup() {
  const router = useRouter();

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


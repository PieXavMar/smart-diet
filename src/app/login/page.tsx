'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTime, setLockTime] = useState<number | null>(null);

  const MAX_ATTEMPTS = 5;
  const LOCK_DURATION = 5 * 60 * 1000; // 5 minutes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check if account is locked
    if (isLocked && lockTime) {
      const remainingTime = Math.ceil((lockTime - Date.now()) / 1000 / 60);
      if (remainingTime > 0) {
        setError(`Too many attempts. Try again in ${remainingTime} minute${remainingTime > 1 ? 's' : ''}`);
        return;
      } else {
        // Lock expired
        setIsLocked(false);
        setLockTime(null);
        setAttemptCount(0);
      }
    }

    setLoading(true);

    try {
      // TODO: Backend connection point - /api/auth
      const response = await fetch('/api/auth?action=login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Track failed attempts
        const newAttemptCount = attemptCount + 1;
        setAttemptCount(newAttemptCount);

        if (newAttemptCount >= MAX_ATTEMPTS) {
          setIsLocked(true);
          const lockUntil = Date.now() + LOCK_DURATION;
          setLockTime(lockUntil);
          throw new Error(`Too many failed attempts. Account locked for ${LOCK_DURATION / 60000} minutes`);
        }

        throw new Error(data.message || `Invalid credentials (${newAttemptCount}/${MAX_ATTEMPTS})`);
      }

      // Login successful - check if 2FA is required
      if (data.requires2FA) {
        localStorage.setItem('tempUserId', data.userId);
        router.push('/2fa_verify');
      } else {
        // No 2FA, login complete
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }
        router.push('/onboarding');
      }

      setAttemptCount(0);
      
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '50px auto', 
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px'
    }}>
      <h1>Sign In</h1>
      
      {error && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#ffebee', 
          color: '#c62828',
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          {error}
        </div>
      )}

      {attemptCount > 0 && attemptCount < MAX_ATTEMPTS && !isLocked && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#fff3e0', 
          color: '#e65100',
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          Warning: {MAX_ATTEMPTS - attemptCount} attempt{MAX_ATTEMPTS - attemptCount > 1 ? 's' : ''} remaining
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
            disabled={isLocked}
            style={{ 
              width: '100%', 
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Password
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
            disabled={isLocked}
            style={{ 
              width: '100%', 
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px', textAlign: 'right' }}>
          <a 
            href="/password_forgot" 
            style={{ color: '#1976d2', textDecoration: 'none', fontSize: '14px' }}
          >
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={loading || isLocked}
          style={{ 
            width: '100%', 
            padding: '10px',
            backgroundColor: (loading || isLocked) ? '#ccc' : '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: (loading || isLocked) ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Signing In...' : isLocked ? 'Account Locked' : 'Sign In'}
        </button>
      </form>

      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        <a 
          href="/register" 
          style={{ color: '#1976d2', textDecoration: 'none' }}
        >
          Don't have an account? Sign up
        </a>
      </div>
    </div>
  );
}

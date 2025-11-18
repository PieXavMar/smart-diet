'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!formData.username.trim()) {
      setError('Username is required');
      return;
    }
    
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    
    if (!formData.password) {
      setError('Password is required');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      // Backend connection point - /api/auth
      const response = await fetch('/api/auth?action=register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          username: formData.username
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('tempUserId', data.userId);
      router.push('/2fa');
      
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--background)',
      padding: '20px'
    }}>
      <div style={{ 
        maxWidth: '500px',
        width: '100%',
        padding: '32px',
        border: '1px solid #333',
        borderRadius: '8px',
        backgroundColor: '#1a1a1a'
      }}>
        <h1 style={{ 
          fontSize: '28px',
          fontWeight: 'bold',
          marginBottom: '8px',
          color: 'var(--foreground)'
        }}>
          Create Account
        </h1>
        
        {error && (
          <div style={{ 
            padding: '12px', 
            backgroundColor: '#ffebee',
            color: '#c62828',
            borderRadius: '4px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              color: 'var(--foreground)',
              fontSize: '16px'
            }}>
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              style={{ 
                width: '100%', 
                padding: '12px',
                border: '1px solid #333',
                borderRadius: '4px',
                backgroundColor: '#0a0a0a',
                color: 'var(--foreground)',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              color: 'var(--foreground)',
              fontSize: '16px'
            }}>
              Email
            </label>
            <input
              type="text"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              style={{ 
                width: '100%', 
                padding: '12px',
                border: '1px solid #333',
                borderRadius: '4px',
                backgroundColor: '#0a0a0a',
                color: 'var(--foreground)',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              color: 'var(--foreground)',
              fontSize: '16px'
            }}>
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              style={{ 
                width: '100%', 
                padding: '12px',
                border: '1px solid #333',
                borderRadius: '4px',
                backgroundColor: '#0a0a0a',
                color: 'var(--foreground)',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              color: 'var(--foreground)',
              fontSize: '16px'
            }}>
              Confirm Password
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              style={{ 
                width: '100%', 
                padding: '12px',
                border: '1px solid #333',
                borderRadius: '4px',
                backgroundColor: '#0a0a0a',
                color: 'var(--foreground)',
                fontSize: '16px'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '14px',
              backgroundColor: loading ? '#555' : '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <a 
            href="/login" 
            style={{ 
              color: '#3b82f6', 
              textDecoration: 'none',
              fontSize: '15px'
            }}
          >
            Already have an account? Sign in
          </a>
        </div>
      </div>
    </div>
  );
}
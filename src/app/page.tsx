// src/app/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-green-700">
            Smart Diet
          </div>
          
          <div className="flex gap-4">
            <Link 
              href="/login"
              className="px-4 py-2 text-green-600 hover:text-green-700"
            >
              Sign In
            </Link>
            <Link 
              href="/register"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>
      
      <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Welcome to Smart Diet
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your personal nutrition companion
          </p>
          <Link 
            href="/register"
            className="inline-block px-8 py-4 bg-green-600 text-white text-lg rounded-lg hover:bg-green-700"
          >
            Start Your Journey
          </Link>
        </div>
      </div>
    </div>
  );
}
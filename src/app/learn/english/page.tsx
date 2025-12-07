'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EnglishMainPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to level selection
    router.push('/learn/english/levels');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-teal-300 to-blue-300 flex items-center justify-center">
      <div className="text-white text-2xl">Loading...</div>
    </div>
  );
}
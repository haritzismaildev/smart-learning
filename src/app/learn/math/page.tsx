'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MathPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to level selection
    router.push('/learn/math/levels');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-300 to-pink-300 flex items-center justify-center">
      <div className="text-white text-2xl">Memuat...</div>
    </div>
  );
}
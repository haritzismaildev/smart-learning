'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EnglishGrammarMainPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to comprehensive grammar guide
    router.push('/learn/english/grammar/comprehensive');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
      <div className="text-gray-700 text-2xl">Loading grammar guide...</div>
    </div>
  );
}
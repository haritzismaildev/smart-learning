'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Topic {
  id: number;
  level: string;
  category: string;
  topic_name: string;
  topic_name_arabic: string;
  description: string;
  mastery: {
    status: string;
    attempts: number;
    correct_count: number;
  };
}

export default function ArabicLearning() {
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedLevel, setSelectedLevel] = useState('beginner');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopics();
  }, [selectedLevel]);

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/questions/arabic?level=${selectedLevel}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await res.json();
      
      if (data.success) {
        setTopics(data.data.topics);
      }
    } catch (error) {
      console.error('Error fetching topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const startLearning = (topicId: number) => {
    router.push(`/learn/arabic/${topicId}`);
  };

  const getMasteryColor = (status: string) => {
    switch (status) {
      case 'mastered': return 'bg-green-100 text-green-700';
      case 'practiced': return 'bg-blue-100 text-blue-700';
      case 'learning': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      huruf_harokat: '📝',
      mufradat: '📚',
      qawaid: '📖',
      muhadatsah: '💬',
      qiraah: '📰',
      kitabah: '✍️',
      istima: '👂'
    };
    return icons[category] || '📕';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📚 Belajar Bahasa Arab
          </h1>
          <p className="text-gray-600">
            Dari dasar sampai mahir - Tingkatkan kemampuan bahasa Arab-mu!
          </p>
        </div>

        {/* Level Selector */}
        <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Pilih Level:
          </label>
          <select 
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full md:w-1/2 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 text-lg font-medium"
          >
            <option value="beginner">🌱 Beginner (Mubtadi) - Dasar</option>
            <option value="elementary">📖 Elementary (Ibtidai) - Pemula</option>
            <option value="intermediate">📚 Intermediate (Mutawassit) - Menengah</option>
            <option value="advanced">🎓 Advanced (Mutaqaddim) - Lanjut</option>
            <option value="expert">⭐ Expert (Mutamayiz) - Mahir</option>
          </select>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">Memuat materi...</p>
          </div>
        )}

        {/* Topics Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <div 
                key={topic.id} 
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border-t-4 border-green-500"
              >
                {/* Category Icon */}
                <div className="text-4xl mb-3">
                  {getCategoryIcon(topic.category)}
                </div>

                {/* Topic Name */}
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {topic.topic_name}
                </h3>

                {/* Arabic Name */}
                <p className="text-gray-600 text-sm mb-3 font-arabic text-right">
                  {topic.topic_name_arabic}
                </p>

                {/* Description */}
                <p className="text-gray-700 text-sm mb-4">
                  {topic.description}
                </p>

                {/* Mastery Badge */}
                <div className="mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getMasteryColor(topic.mastery.status)}`}>
                    {topic.mastery.status === 'mastered' && '✅ Dikuasai'}
                    {topic.mastery.status === 'practiced' && '💪 Berlatih'}
                    {topic.mastery.status === 'learning' && '📖 Belajar'}
                    {topic.mastery.status === 'not_started' && '🆕 Belum Mulai'}
                  </span>
                  {topic.mastery.attempts > 0 && (
                    <span className="ml-2 text-xs text-gray-500">
                      {topic.mastery.attempts}x latihan
                    </span>
                  )}
                </div>

                {/* Start Button */}
                <button 
                  onClick={() => startLearning(topic.id)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  {topic.mastery.status === 'mastered' ? '🔄 Ulangi' : '▶️ Mulai Belajar'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && topics.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-xl text-gray-600">
              Belum ada materi untuk level ini
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
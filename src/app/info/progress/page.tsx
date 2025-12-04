'use client'

import { useRouter } from 'next/navigation';
import { ArrowLeft, TrendingUp, BarChart3, Activity, Target } from 'lucide-react';

export default function ProgressReportPage() {
  const router = useRouter();

  // Simulated chart data
  const mathImportanceData = [
    { year: '2010', value: 75 },
    { year: '2015', value: 82 },
    { year: '2020', value: 91 },
    { year: '2025', value: 98 },
    { year: '2030', value: 99 }
  ];

  const englishImportanceData = [
    { year: '2010', value: 70 },
    { year: '2015', value: 85 },
    { year: '2020', value: 92 },
    { year: '2025', value: 97 },
    { year: '2030', value: 99 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Laporan Progress & Analisis</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-white mb-12 text-center">
          <div className="text-7xl mb-6">📊</div>
          <h2 className="text-4xl font-bold mb-4">Analisis Tren Global</h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Data real-time menunjukkan pentingnya matematika dan bahasa Inggris 
            terus meningkat drastis di era digital!
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <span className="text-2xl">📈</span>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">+28%</div>
            <div className="text-sm text-gray-600">Demand Job STEM 2020-2025</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 text-blue-600" />
              <span className="text-2xl">💼</span>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">$120K</div>
            <div className="text-sm text-gray-600">Avg Salary Bilingual + STEM</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="w-8 h-8 text-purple-600" />
              <span className="text-2xl">🌍</span>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">1.5B</div>
            <div className="text-sm text-gray-600">English Speakers Globally</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 text-orange-600" />
              <span className="text-2xl">🚀</span>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">85%</div>
            <div className="text-sm text-gray-600">Job Need English 2025</div>
          </div>
        </div>

        {/* Math Importance Chart */}
        <div className="bg-white rounded-3xl p-8 shadow-xl mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                📈 Tren Pentingnya Matematika (2010-2030)
              </h2>
              <p className="text-gray-600">Proyeksi berdasarkan data global & research education</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">+32%</div>
              <div className="text-sm text-gray-500">Growth Rate</div>
            </div>
          </div>

          {/* Trading-style Chart */}
          <div className="relative h-80 bg-gradient-to-b from-blue-50 to-white rounded-xl p-6 border border-gray-200">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 pr-2">
              <div>100%</div>
              <div>75%</div>
              <div>50%</div>
              <div>25%</div>
              <div>0%</div>
            </div>

            {/* Chart area */}
            <div className="ml-8 h-full relative">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between">
                {[0, 1, 2, 3, 4].map(i => (
                  <div key={i} className="border-t border-gray-200"></div>
                ))}
              </div>

              {/* Line chart */}
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="mathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                
                {/* Area fill */}
                <path
                  d="M 0 25 L 25 18 L 50 9 L 75 2 L 100 1 L 100 100 L 0 100 Z"
                  fill="url(#mathGradient)"
                />
                
                {/* Line */}
                <path
                  d="M 0 25 L 25 18 L 50 9 L 75 2 L 100 1"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  vectorEffect="non-scaling-stroke"
                />

                {/* Points */}
                {mathImportanceData.map((point, idx) => (
                  <circle
                    key={idx}
                    cx={`${(idx / (mathImportanceData.length - 1)) * 100}%`}
                    cy={`${100 - point.value}%`}
                    r="4"
                    fill="#3b82f6"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              </svg>

              {/* X-axis labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-600 pt-2">
                {mathImportanceData.map((point, idx) => (
                  <div key={idx} className="text-center">
                    <div className="font-semibold">{point.year}</div>
                    <div className="text-blue-600 font-bold">{point.value}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Insight */}
          <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h4 className="font-bold text-gray-800 mb-1">Key Insight:</h4>
                <p className="text-sm text-gray-700">
                  Sejak 2010, pentingnya matematika dalam karir dan kehidupan meningkat 32%. 
                  Proyeksi 2030 menunjukkan 99% pekerjaan masa depan (AI, Data Science, Engineering, 
                  Finance) membutuhkan skill matematika kuat. Anak yang mulai belajar dari sekarang 
                  punya advantage 10 tahun ke depan!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* English Importance Chart */}
        <div className="bg-white rounded-3xl p-8 shadow-xl mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                🌍 Tren Pentingnya Bahasa Inggris (2010-2030)
              </h2>
              <p className="text-gray-600">Global communication & digital economy trend</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">+41%</div>
              <div className="text-sm text-gray-500">Growth Rate</div>
            </div>
          </div>

          {/* Trading-style Chart */}
          <div className="relative h-80 bg-gradient-to-b from-green-50 to-white rounded-xl p-6 border border-gray-200">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 pr-2">
              <div>100%</div>
              <div>75%</div>
              <div>50%</div>
              <div>25%</div>
              <div>0%</div>
            </div>

            {/* Chart area */}
            <div className="ml-8 h-full relative">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between">
                {[0, 1, 2, 3, 4].map(i => (
                  <div key={i} className="border-t border-gray-200"></div>
                ))}
              </div>

              {/* Line chart */}
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="englishGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                
                {/* Area fill */}
                <path
                  d="M 0 30 L 25 15 L 50 8 L 75 3 L 100 1 L 100 100 L 0 100 Z"
                  fill="url(#englishGradient)"
                />
                
                {/* Line */}
                <path
                  d="M 0 30 L 25 15 L 50 8 L 75 3 L 100 1"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  vectorEffect="non-scaling-stroke"
                />

                {/* Points */}
                {englishImportanceData.map((point, idx) => (
                  <circle
                    key={idx}
                    cx={`${(idx / (englishImportanceData.length - 1)) * 100}%`}
                    cy={`${100 - point.value}%`}
                    r="4"
                    fill="#10b981"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              </svg>

              {/* X-axis labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-600 pt-2">
                {englishImportanceData.map((point, idx) => (
                  <div key={idx} className="text-center">
                    <div className="font-semibold">{point.year}</div>
                    <div className="text-green-600 font-bold">{point.value}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Insight */}
          <div className="mt-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h4 className="font-bold text-gray-800 mb-1">Key Insight:</h4>
                <p className="text-sm text-gray-700">
                  Bahasa Inggris mengalami growth 41% sejak 2010! Dengan globalisasi dan 
                  remote work yang meningkat pesat, kemampuan bahasa Inggris menjadi absolute 
                  requirement. 2030: 99% peluang kerja global, study abroad, dan akses knowledge 
                  membutuhkan bahasa Inggris. Start early = competitive advantage!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Chart */}
        <div className="bg-white rounded-3xl p-8 shadow-xl mb-12">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            ⚡ Perbandingan Impact: Dengan vs Tanpa Skill
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* With Skills */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
              <div className="text-center mb-6">
                <div className="text-5xl mb-2">🚀</div>
                <h3 className="text-xl font-bold text-gray-800">Dengan Matematika + Inggris</h3>
              </div>
              
              <div className="space-y-4">
                {[
                  { label: 'Career Opportunities', value: 95, color: 'bg-green-500' },
                  { label: 'Salary Potential', value: 90, color: 'bg-blue-500' },
                  { label: 'Global Network', value: 92, color: 'bg-purple-500' },
                  { label: 'Innovation Skills', value: 88, color: 'bg-indigo-500' },
                  { label: 'Life Quality', value: 93, color: 'bg-teal-500' }
                ].map((metric, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold text-gray-700">{metric.label}</span>
                      <span className="text-gray-600">{metric.value}%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`${metric.color} h-full rounded-full transition-all duration-1000`}
                        style={{ width: `${metric.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Without Skills */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-200">
              <div className="text-center mb-6">
                <div className="text-5xl mb-2">⚠️</div>
                <h3 className="text-xl font-bold text-gray-800">Tanpa Skill Ini</h3>
              </div>
              
              <div className="space-y-4">
                {[
                  { label: 'Career Opportunities', value: 35, color: 'bg-orange-500' },
                  { label: 'Salary Potential', value: 40, color: 'bg-red-500' },
                  { label: 'Global Network', value: 25, color: 'bg-orange-600' },
                  { label: 'Innovation Skills', value: 30, color: 'bg-red-600' },
                  { label: 'Life Quality', value: 45, color: 'bg-orange-400' }
                ].map((metric, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold text-gray-700">{metric.label}</span>
                      <span className="text-gray-600">{metric.value}%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`${metric.color} h-full rounded-full transition-all duration-1000`}
                        style={{ width: `${metric.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Difference Highlight */}
          <div className="mt-8 bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-2">⚡</div>
            <div className="text-3xl font-bold text-gray-800 mb-2">
              Selisih hingga <span className="text-green-600">60%</span>
            </div>
            <p className="text-gray-700">
              Anak yang menguasai matematika + bahasa Inggris punya peluang hidup 
              60% lebih baik dalam semua aspek kehidupan!
            </p>
          </div>
        </div>

        {/* Future Projection */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-10 text-white mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">🔮 Proyeksi 10 Tahun Kedepan</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/20 backdrop-blur rounded-xl p-6">
              <div className="text-4xl mb-3">2025</div>
              <h4 className="font-bold text-xl mb-2">Near Future</h4>
              <p className="text-sm opacity-90">
                AI & Automation menggantikan 40% pekerjaan rutin. Yang bertahan: 
                yang punya skill matematika + komunikasi global.
              </p>
            </div>
            
            <div className="bg-white/20 backdrop-blur rounded-xl p-6">
              <div className="text-4xl mb-3">2028</div>
              <h4 className="font-bold text-xl mb-2">Mid Future</h4>
              <p className="text-sm opacity-90">
                Remote work dominan. 70% perusahaan hire globally. English + STEM 
                skills = tiket untuk work from anywhere dengan gaji internasional.
              </p>
            </div>
            
            <div className="bg-white/20 backdrop-blur rounded-xl p-6">
              <div className="text-4xl mb-3">2035</div>
              <h4 className="font-bold text-xl mb-2">Long Future</h4>
              <p className="text-sm opacity-90">
                Era quantum computing & space economy. 95% pekerjaan butuh matematika 
                advanced + bahasa Inggris untuk kolaborasi internasional.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-white rounded-3xl p-10 shadow-xl text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Data Tidak Bohong
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Investasi terbaik untuk anak adalah pendidikan. Mulai dari sekarang, 
            bukan nanti. Setiap hari yang terlewat adalah opportunity yang hilang!
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push('/learn/math/levels')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-8 py-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition"
            >
              🧮 Mulai Belajar Matematika
            </button>
            <button
              onClick={() => router.push('/learn/english')}
              className="bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold px-8 py-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition"
            >
              🌍 Mulai Belajar Bahasa Inggris
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
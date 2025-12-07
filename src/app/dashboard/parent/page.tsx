'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getApiEndpoint } from '@/lib/config';
import { 
  TrendingUp, TrendingDown, Activity, Target, Award, 
  Calendar, Clock, Zap, Brain, AlertCircle, CheckCircle,
  BarChart3, Users, BookOpen, Trophy, Sparkles, ArrowRight
} from 'lucide-react';

interface ChildData {
  child: {
    id: number;
    full_name: string;
    age: number;
    grade_level: number;
  };
  overall_statistics: {
    total_sessions: number;
    total_questions: number;
    correct_answers: number;
    total_points: number;
    avg_accuracy: string;
  };
  subject_performance: Array<{
    subject: string;
    level: string;
    total_sessions: number;
    accuracy_rate: string;
    mastery_level: string;
  }>;
  weekly_progress: Array<{
    week_start_date: string;
    total_sessions: number;
    weekly_accuracy: string;
  }>;
  daily_activity: Array<{
    activity_date: string;
    total_questions: number;
    daily_accuracy: string;
  }>;
  kpis: {
    overall_progress: number;
    consistency_score: number;
    improvement_rate: number;
    learning_velocity: number;
    focus_score: number;
  };
  smart_recommendations: Array<{
    type: string;
    category: string;
    title: string;
    description: string;
    action: string;
    priority: number;
  }>;
}

export default function EnhancedParentDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState<ChildData[]>([]);
  const [selectedChild, setSelectedChild] = useState<ChildData | null>(null);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'subjects' | 'progress' | 'recommendations'>('overview');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'parent') {
      router.push('/dashboard/child');
      return;
    }

    fetchDashboardData(token);
  }, [router]);

  const fetchDashboardData = async (token: string) => {
    try {
      const response = await fetch(getApiEndpoint('progress/parent/dashboard'), {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setChildren(data.data.children || []);
        if (data.data.children.length > 0) {
          setSelectedChild(data.data.children[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-white text-2xl">Loading dashboard...</div>
      </div>
    );
  }

  if (!selectedChild) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-white text-2xl">No children data available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-1">Parent Dashboard</h1>
              <p className="text-white/80">Monitor & Guide Your Children's Learning Journey</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition backdrop-blur-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Children Selector */}
        {children.length > 1 && (
          <div className="mb-8">
            <div className="flex gap-4 overflow-x-auto pb-4">
              {children.map((child) => (
                <button
                  key={child.child.id}
                  onClick={() => setSelectedChild(child)}
                  className={`flex-shrink-0 px-6 py-4 rounded-2xl transition transform hover:scale-105 ${
                    selectedChild?.child.id === child.child.id
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl'
                      : 'bg-white text-gray-700 hover:shadow-lg'
                  }`}
                >
                  <div className="text-3xl mb-2">👦</div>
                  <div className="font-bold">{child.child.full_name}</div>
                  <div className="text-sm opacity-80">Kelas {child.child.grade_level}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-8 h-8" />
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold mb-1">
              {selectedChild.overall_statistics?.total_sessions || 0}
            </div>
            <div className="text-sm opacity-90">Total Sessions</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8" />
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold mb-1">
              {Number(selectedChild.overall_statistics?.avg_accuracy || 0).toFixed(1)}%
            </div>
            <div className="text-sm opacity-90">Avg Accuracy</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-8 h-8" />
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold mb-1">
              {selectedChild.overall_statistics?.total_points || 0}
            </div>
            <div className="text-sm opacity-90">Total Points</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-8 h-8" />
              <Activity className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold mb-1">
              {Number(selectedChild.kpis?.consistency_score || 0).toFixed(0)}%
            </div>
            <div className="text-sm opacity-90">Consistency</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-8">
          <div className="flex gap-2">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'subjects', label: 'By Subject', icon: BookOpen },
              { id: 'progress', label: 'Progress Chart', icon: TrendingUp },
              { id: 'recommendations', label: 'Recommendations', icon: Brain },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition ${
                  selectedTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {selectedTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <KPICard
                title="Overall Progress"
                value={selectedChild.kpis?.overall_progress || 0}
                max={100}
                unit="%"
                color="blue"
                icon={<Target className="w-6 h-6" />}
                description="Combined score based on activity and accuracy"
              />
              <KPICard
                title="Learning Velocity"
                value={selectedChild.kpis?.learning_velocity || 0}
                max={50}
                unit="q/day"
                color="green"
                icon={<Zap className="w-6 h-6" />}
                description="Average questions per day (last 7 days)"
              />
              <KPICard
                title="Focus Score"
                value={selectedChild.kpis?.focus_score || 0}
                max={100}
                unit="%"
                color="purple"
                icon={<Brain className="w-6 h-6" />}
                description="How balanced is the study across subjects"
              />
            </div>

            {/* Recent Activity Timeline */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-indigo-600" />
                Recent Activity (Last 7 Days)
              </h3>
              <div className="space-y-3">
                {(selectedChild.daily_activity || []).slice(0, 7).map((day, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                    <div className="flex-shrink-0 w-20 text-sm text-gray-600">
                      {new Date(day.activity_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-sm font-semibold text-gray-800">
                          {day.total_questions || 0} questions
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          Number(day.daily_accuracy) >= 80 ? 'bg-green-100 text-green-700' :
                          Number(day.daily_accuracy) >= 60 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {Number(day.daily_accuracy || 0).toFixed(1)}% accuracy
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(Number(day.daily_accuracy) || 0, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'subjects' && (
          <div className="space-y-6">
            {(selectedChild.subject_performance || []).map((subject, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                      subject.subject === 'math' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      {subject.subject === 'math' ? '🔢' : '🌍'}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 capitalize">{subject.subject}</h3>
                      <p className="text-sm text-gray-600">{subject.level}</p>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-full font-semibold ${
                    subject.mastery_level === 'expert' ? 'bg-purple-100 text-purple-700' :
                    subject.mastery_level === 'advanced' ? 'bg-blue-100 text-blue-700' :
                    subject.mastery_level === 'intermediate' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {subject.mastery_level}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">{subject.total_sessions || 0}</div>
                    <div className="text-xs text-gray-600">Sessions</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">
                      {Number(subject.accuracy_rate || 0).toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-600">Accuracy</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600">
                      {subject.mastery_level === 'expert' ? 'A+' :
                       subject.mastery_level === 'advanced' ? 'A' :
                       subject.mastery_level === 'intermediate' ? 'B' : 'C'}
                    </div>
                    <div className="text-xs text-gray-600">Grade</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">Progress to Next Level</div>
                  <div className="text-sm font-semibold text-indigo-600">
                    {Math.round((Number(subject.accuracy_rate) / 90) * 100)}%
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      subject.subject === 'math' 
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                        : 'bg-gradient-to-r from-green-500 to-emerald-500'
                    }`}
                    style={{ width: `${Math.min((Number(subject.accuracy_rate) / 90) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedTab === 'progress' && (
          <div className="space-y-8">
            {/* Weekly Progress Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
                Weekly Progress Trend
              </h3>
              <WeeklyProgressChart data={selectedChild.weekly_progress || []} />
            </div>

            {/* Accuracy Trend Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Activity className="w-6 h-6 text-green-600" />
                Daily Accuracy Trend (Last 14 Days)
              </h3>
              <AccuracyTrendChart data={(selectedChild.daily_activity || []).slice(0, 14)} />
            </div>
          </div>
        )}

        {selectedTab === 'recommendations' && (
          <div className="space-y-6">
            {(selectedChild.smart_recommendations || []).length > 0 ? (
              selectedChild.smart_recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl shadow-lg p-6 border-l-4 ${
                    rec.type === 'urgent' ? 'bg-red-50 border-red-500' :
                    rec.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                    rec.type === 'success' ? 'bg-green-50 border-green-500' :
                    'bg-blue-50 border-blue-500'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${
                      rec.type === 'urgent' ? 'bg-red-100' :
                      rec.type === 'warning' ? 'bg-yellow-100' :
                      rec.type === 'success' ? 'bg-green-100' :
                      'bg-blue-100'
                    }`}>
                      {rec.type === 'urgent' && <AlertCircle className="w-6 h-6 text-red-600" />}
                      {rec.type === 'warning' && <AlertCircle className="w-6 h-6 text-yellow-600" />}
                      {rec.type === 'success' && <CheckCircle className="w-6 h-6 text-green-600" />}
                      {rec.type === 'info' && <Brain className="w-6 h-6 text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 text-lg mb-2">{rec.title}</h4>
                      <p className="text-gray-700 mb-3">{rec.description}</p>
                      <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
                        <div className="flex items-start gap-2">
                          <ArrowRight className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="text-sm font-semibold text-gray-800 mb-1">Action Plan:</div>
                            <div className="text-sm text-gray-700">{rec.action}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-green-50 rounded-2xl p-8 text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Great Job!</h3>
                <p className="text-gray-600">Everything looks good! Keep up the excellent work.</p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl">
          <div className="text-center">
            <div className="mb-4">
              <div className="inline-block bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full px-6 py-2 mb-3">
                <span className="text-white font-bold text-sm">✨ SMART LEARNING 2025 ✨</span>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-gray-300 text-sm mb-2">Proudly Developed By</p>
              <h3 className="text-2xl font-bold text-white mb-1">Haritz</h3>
              <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                <span>©</span>
                <span className="font-mono">2025</span>
                <span>•</span>
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-semibold">
                  CreativeJawiProduction.prod
                </span>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-700">
              <p className="text-gray-500 text-xs">
                Made with ❤️ for Indonesian Children Education
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// COMPONENTS
// ============================================

function KPICard({ title, value, max, unit, color, icon, description }: any) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const colorClasses = {
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    purple: 'from-purple-500 to-pink-500',
    orange: 'from-orange-500 to-red-500',
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-gray-800">{title}</h4>
        <div className={`p-2 rounded-lg bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} text-white`}>
          {icon}
        </div>
      </div>
      <div className="text-4xl font-bold text-gray-800 mb-2">
        {Number(value || 0).toFixed(0)}<span className="text-xl text-gray-600">{unit}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
        <div
          className={`h-3 rounded-full bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses]} transition-all duration-1000`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-gray-600">{description}</p>
    </div>
  );
}

function WeeklyProgressChart({ data }: any) {
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-500 py-8">No data available</div>;
  }

  const maxSessions = Math.max(...data.map((d: any) => d.total_sessions || 0), 10);

  return (
    <div className="relative">
      <div className="flex items-end justify-between gap-2 h-64">
        {data.slice(0, 8).reverse().map((week: any, idx: number) => {
          const height = (week.total_sessions / maxSessions) * 100;
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2">
              <div className="text-xs font-semibold text-indigo-600">
                {week.total_sessions || 0}
              </div>
              <div
                className="w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-lg transition-all duration-1000 hover:from-indigo-700 hover:to-purple-600 cursor-pointer relative group"
                style={{ height: `${height}%` }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                  {Number(week.weekly_accuracy || 0).toFixed(1)}% accuracy
                </div>
              </div>
              <div className="text-xs text-gray-600 text-center">
                Week {idx + 1}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AccuracyTrendChart({ data }: any) {
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-500 py-8">No data available</div>;
  }

  const chartData = data.slice(0, 14).reverse();
  const maxAccuracy = 100;

  // Calculate SVG path for line chart
  const points = chartData.map((day: any, idx: number) => {
    const x = (idx / (chartData.length - 1)) * 100;
    const y = 100 - (Number(day.daily_accuracy || 0) / maxAccuracy) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="relative h-64">
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((val) => (
          <line
            key={val}
            x1="0"
            y1={100 - val}
            x2="100"
            y2={100 - val}
            stroke="#e5e7eb"
            strokeWidth="0.2"
          />
        ))}
        
        {/* Area fill */}
        <defs>
          <linearGradient id="accuracyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <polygon
          points={`0,100 ${points} 100,100`}
          fill="url(#accuracyGradient)"
        />
        
        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke="#10b981"
          strokeWidth="0.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Data points */}
        {chartData.map((day: any, idx: number) => {
          const x = (idx / (chartData.length - 1)) * 100;
          const y = 100 - (Number(day.daily_accuracy || 0) / maxAccuracy) * 100;
          return (
            <circle
              key={idx}
              cx={x}
              cy={y}
              r="1"
              fill="#10b981"
              className="hover:r-2 transition-all cursor-pointer"
            >
              <title>{Number(day.daily_accuracy || 0).toFixed(1)}%</title>
            </circle>
          );
        })}
      </svg>
      
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-600 -ml-8">
        <span>100%</span>
        <span>75%</span>
        <span>50%</span>
        <span>25%</span>
        <span>0%</span>
      </div>
      
      {/* X-axis labels */}
      <div className="flex justify-between mt-2 text-xs text-gray-600">
        {chartData.map((day: any, idx: number) => (
          idx % 2 === 0 && (
            <span key={idx}>
              {new Date(day.activity_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
            </span>
          )
        ))}
      </div>
    </div>
  );
}
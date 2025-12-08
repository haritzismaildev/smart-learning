'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, CheckCircle, XCircle, Eye, Mail, Phone,
  Clock, AlertCircle, Filter, Search, LogOut,
  FileText, Activity, Shield
} from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';

interface PendingRegistration {
  id: number;
  nik: string;
  full_name: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  children_data: Array<{
    full_name: string;
    age: number;
    grade_level: number;
  }>;
  number_of_children: number;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [pendingRegistrations, setPendingRegistrations] = useState<PendingRegistration[]>([]);
  const [selectedReg, setSelectedReg] = useState<PendingRegistration | null>(null);
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'approvals' | 'users' | 'audit'>('approvals');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userData);
    if (user.role !== 'admin' && user.role !== 'superadmin') {
      router.push('/login');
      return;
    }

    fetchPendingRegistrations(token);
  }, [router, filter]);

  const fetchPendingRegistrations = async (token: string) => {
    try {
      const response = await fetch(
        `/api/admin/pending-registrations?status=${filter}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPendingRegistrations(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (regId: number) => {
    if (!confirm('Yakin ingin menyetujui pendaftaran ini?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/approve-registration`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ registration_id: regId })
      });

      if (response.ok) {
        alert('Pendaftaran disetujui! Email telah dikirim ke parent.');
        fetchPendingRegistrations(token!);
        setSelectedReg(null);
      } else {
        const data = await response.json();
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error approving:', error);
      alert('Terjadi kesalahan');
    }
  };

  const handleReject = async (regId: number) => {
    const reason = prompt('Alasan penolakan:');
    if (!reason) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/reject-registration`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ registration_id: regId, reason })
      });

      if (response.ok) {
        alert('Pendaftaran ditolak. Email telah dikirim.');
        fetchPendingRegistrations(token!);
        setSelectedReg(null);
      }
    } catch (error) {
      console.error('Error rejecting:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const filteredRegistrations = pendingRegistrations.filter(reg =>
    reg.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.nik.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
              <p className="text-white/80">User Management & Approvals</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard/parent')}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
              >
                <Eye className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-8">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('approvals')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition ${
                activeTab === 'approvals'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <CheckCircle className="w-5 h-5" />
              Approvals
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition ${
                activeTab === 'users'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users className="w-5 h-5" />
              All Users
            </button>
            <button
              onClick={() => router.push('/dashboard/audit')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition text-gray-600 hover:bg-gray-100`}
            >
              <Activity className="w-5 h-5" />
              Audit Trail
            </button>
          </div>
        </div>

        {/* Quick Actions - Audit Trail */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer"
                onClick={() => router.push('/dashboard/audit')}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Audit Trail</h3>
                    <p className="text-white/80 text-sm">Monitor all system activities and logs</p>
                  </div>
                </div>
                <div className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold flex items-center gap-2 shadow-lg">
                  <Eye className="w-5 h-5" />
                  View Logs
                </div>
              </div>
            </div>
          </div>

        {/* Approvals Tab */}
        {activeTab === 'approvals' && (
          <>
            {/* Filters & Search */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari nama, email, atau NIK..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="px-6 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending Only</option>
                  <option value="all">All Status</option>
                </select>
              </div>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-yellow-50 rounded-2xl p-6 border-l-4 border-yellow-500">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-6 h-6 text-yellow-600" />
                  <h3 className="font-bold text-gray-800">Pending</h3>
                </div>
                <div className="text-3xl font-bold text-yellow-600">
                  {pendingRegistrations.filter(r => r.status === 'pending').length}
                </div>
              </div>
              <div className="bg-green-50 rounded-2xl p-6 border-l-4 border-green-500">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h3 className="font-bold text-gray-800">Approved</h3>
                </div>
                <div className="text-3xl font-bold text-green-600">
                  {pendingRegistrations.filter(r => r.status === 'approved').length}
                </div>
              </div>
              <div className="bg-red-50 rounded-2xl p-6 border-l-4 border-red-500">
                <div className="flex items-center gap-3 mb-2">
                  <XCircle className="w-6 h-6 text-red-600" />
                  <h3 className="font-bold text-gray-800">Rejected</h3>
                </div>
                <div className="text-3xl font-bold text-red-600">
                  {pendingRegistrations.filter(r => r.status === 'rejected').length}
                </div>
              </div>
            </div>

            {/* Registrations List */}
            <div className="space-y-4">
              {filteredRegistrations.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Tidak ada data
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm ? 'Tidak ditemukan hasil pencarian' : 'Belum ada pendaftaran baru'}
                  </p>
                </div>
              ) : (
                filteredRegistrations.map((reg) => (
                  <div
                    key={reg.id}
                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-800">
                            {reg.full_name}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            reg.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            reg.status === 'approved' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {reg.status}
                          </span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            NIK: {reg.nik}
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {reg.email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {reg.phone}
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {reg.number_of_children} anak
                          </div>
                        </div>
                      </div>
                      
                      {reg.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedReg(reg)}
                            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleApprove(reg.id)}
                            className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleReject(reg.id)}
                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-gray-500">
                      Daftar: {new Date(reg.created_at).toLocaleString('id-ID')}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">All Users (View Only)</h2>
            <p className="text-gray-600">Feature coming soon...</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedReg && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Detail Pendaftaran</h2>
              <button
                onClick={() => setSelectedReg(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Parent Info */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-800 mb-4">Data Orang Tua</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">NIK:</span>
                    <p className="font-semibold">{selectedReg.nik}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Nama:</span>
                    <p className="font-semibold">{selectedReg.full_name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <p className="font-semibold">{selectedReg.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Telepon:</span>
                    <p className="font-semibold">{selectedReg.phone}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">WhatsApp:</span>
                    <p className="font-semibold">{selectedReg.whatsapp}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600">Alamat:</span>
                    <p className="font-semibold">{selectedReg.address}</p>
                  </div>
                </div>
              </div>

              {/* Children Info */}
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-800 mb-4">
                  Data Anak ({selectedReg.children_data.length})
                </h3>
                <div className="space-y-3">
                  {selectedReg.children_data.map((child, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-4">
                      <p className="font-semibold">{idx + 1}. {child.full_name}</p>
                      <p className="text-sm text-gray-600">
                        Umur: {child.age} tahun • Kelas: {child.grade_level}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              {selectedReg.status === 'pending' && (
                <div className="flex gap-4">
                  <button
                    onClick={() => handleApprove(selectedReg.id)}
                    className="flex-1 px-6 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition"
                  >
                    Setujui Pendaftaran
                  </button>
                  <button
                    onClick={() => handleReject(selectedReg.id)}
                    className="flex-1 px-6 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition"
                  >
                    Tolak Pendaftaran
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 bg-gradient-to-r from-gray-800 to-gray-900 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-400 text-sm">
          <p>© 2025 Smart Learning • CreativeJawiProduction.prod</p>
        </div>
      </div>
    </div>
  );
}
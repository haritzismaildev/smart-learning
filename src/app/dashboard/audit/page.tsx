'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield, Filter, Download, Trash2, Search, Calendar,
  Eye, Users, Activity, Database, AlertTriangle,
  ChevronLeft, ChevronRight, FileText, Clock, MapPin
} from 'lucide-react';

interface AuditLog {
  [key: string]: any;
}

export default function AuditTrailDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [userRole, setUserRole] = useState('');
  
  // Filters
  const [logType, setLogType] = useState('user_activities');
  const [userEmail, setUserEmail] = useState('');
  const [activityType, setActivityType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [successFilter, setSuccessFilter] = useState('all');
  const [severity, setSeverity] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const logsPerPage = 50;

  // Modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteForm, setDeleteForm] = useState({
    older_than_days: 90,
    confirmation_text: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUserRole(parsedUser.role);

    if (!['superadmin', 'admin'].includes(parsedUser.role)) {
      router.push('/dashboard');
      return;
    }

    fetchLogs(token);
  }, [router, currentPage, logType]);

  const fetchLogs = async (token: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: logsPerPage.toString(),
        log_type: logType,
      });

      if (userEmail) params.append('user_email', userEmail);
      if (activityType) params.append('activity_type', activityType);
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      if (successFilter !== 'all') params.append('success', successFilter);
      if (severity) params.append('severity', severity);

      const response = await fetch(`/api/audit/logs?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setLogs(data.data.logs);
        setTotalPages(data.data.pagination.total_pages);
        setStats(data.data.statistics);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const params = new URLSearchParams({
        log_type: logType,
      });
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);

      const response = await fetch(`/api/audit/export?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit_${logType}_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        alert('Export successful!');
      }
    } catch (error) {
      console.error('Error exporting logs:', error);
      alert('Failed to export logs');
    }
  };

  const handleDeleteOldLogs = async () => {
    if (deleteForm.confirmation_text !== 'DELETE AUDIT LOGS') {
      alert('Confirmation text does not match');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('/api/audit/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          log_type: logType,
          older_than_days: deleteForm.older_than_days,
          confirmation_text: deleteForm.confirmation_text
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Successfully deleted ${data.data.records_deleted} records`);
        setShowDeleteModal(false);
        setDeleteForm({ older_than_days: 90, confirmation_text: '' });
        fetchLogs(token);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting logs:', error);
      alert('Failed to delete logs');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const renderLogRow = (log: AuditLog, index: number) => {
    switch (logType) {
      case 'visitors':
        return (
          <tr key={index} className="hover:bg-gray-50">
            <td className="px-6 py-4 text-sm text-gray-900">{log.session_id?.substring(0, 8)}...</td>
            <td className="px-6 py-4 text-sm text-gray-900">{log.ip_address}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{log.country} - {log.city}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{log.page_url}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{log.device_type}</td>
            <td className="px-6 py-4 text-sm text-gray-600">
              {new Date(log.accessed_at).toLocaleString('id-ID')}
            </td>
          </tr>
        );

      case 'login_attempts':
        return (
          <tr key={index} className="hover:bg-gray-50">
            <td className="px-6 py-4 text-sm font-semibold text-gray-900">{log.email}</td>
            <td className="px-6 py-4">
              {log.success ? (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  Success
                </span>
              ) : (
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                  Failed
                </span>
              )}
            </td>
            <td className="px-6 py-4 text-sm text-red-600">{log.failure_reason || '-'}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{log.ip_address}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{log.country}</td>
            <td className="px-6 py-4 text-sm text-gray-600">
              {new Date(log.attempted_at).toLocaleString('id-ID')}
            </td>
          </tr>
        );

      case 'user_activities':
        return (
          <tr key={index} className="hover:bg-gray-50">
            <td className="px-6 py-4 text-sm font-semibold text-gray-900">{log.user_email}</td>
            <td className="px-6 py-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                {log.user_role}
              </span>
            </td>
            <td className="px-6 py-4 text-sm text-gray-900">{log.activity_type}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{log.activity_description}</td>
            <td className="px-6 py-4">
              {log.success ? (
                <span className="text-green-600">✓</span>
              ) : (
                <span className="text-red-600">✗</span>
              )}
            </td>
            <td className="px-6 py-4 text-sm text-gray-600">
              {new Date(log.started_at).toLocaleString('id-ID')}
            </td>
          </tr>
        );

      case 'data_changes':
        return (
          <tr key={index} className="hover:bg-gray-50">
            <td className="px-6 py-4 text-sm font-semibold text-gray-900">{log.user_email}</td>
            <td className="px-6 py-4 text-sm text-gray-900">{log.table_name}</td>
            <td className="px-6 py-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                log.operation === 'INSERT' ? 'bg-green-100 text-green-700' :
                log.operation === 'UPDATE' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {log.operation}
              </span>
            </td>
            <td className="px-6 py-4 text-sm text-gray-600">
              {log.changed_fields?.join(', ') || '-'}
            </td>
            <td className="px-6 py-4 text-sm text-gray-600">{log.change_reason || '-'}</td>
            <td className="px-6 py-4 text-sm text-gray-600">
              {new Date(log.changed_at).toLocaleString('id-ID')}
            </td>
          </tr>
        );

      case 'security_events':
        return (
          <tr key={index} className="hover:bg-gray-50">
            <td className="px-6 py-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                log.severity === 'critical' ? 'bg-red-100 text-red-700' :
                log.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                log.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {log.severity}
              </span>
            </td>
            <td className="px-6 py-4 text-sm font-semibold text-gray-900">{log.title}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{log.description}</td>
            <td className="px-6 py-4 text-sm text-gray-900">{log.email || '-'}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{log.ip_address}</td>
            <td className="px-6 py-4 text-sm text-gray-600">
              {new Date(log.detected_at).toLocaleString('id-ID')}
            </td>
          </tr>
        );

      default:
        return null;
    }
  };

  const getTableHeaders = () => {
    switch (logType) {
      case 'visitors':
        return ['Session ID', 'IP Address', 'Location', 'Page URL', 'Device', 'Accessed At'];
      case 'login_attempts':
        return ['Email', 'Status', 'Failure Reason', 'IP Address', 'Country', 'Attempted At'];
      case 'user_activities':
        return ['User Email', 'Role', 'Activity Type', 'Description', 'Success', 'Started At'];
      case 'data_changes':
        return ['User Email', 'Table', 'Operation', 'Changed Fields', 'Reason', 'Changed At'];
      case 'security_events':
        return ['Severity', 'Title', 'Description', 'Email', 'IP Address', 'Detected At'];
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-white text-2xl">Loading audit trail...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-10 h-10" />
                <h1 className="text-3xl font-bold">Audit Trail Dashboard</h1>
              </div>
              <p className="text-white/80">Comprehensive System Activity Monitoring</p>
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
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition">
              <div className="text-2xl font-bold text-indigo-600">{stat.count}</div>
              <div className="text-sm text-gray-600 capitalize">{stat.type.replace('_', ' ')}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Filter className="w-6 h-6" />
            Filters
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Log Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Log Type</label>
              <select
                value={logType}
                onChange={(e) => setLogType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="visitors">Visitors</option>
                <option value="login_attempts">Login Attempts</option>
                <option value="user_activities">User Activities</option>
                <option value="data_changes">Data Changes</option>
                <option value="security_events">Security Events</option>
              </select>
            </div>

            {/* User Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">User Email</label>
              <input
                type="text"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="Search by email..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                const token = localStorage.getItem('token');
                if (token) fetchLogs(token);
              }}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Apply Filters
            </button>

            <button
              onClick={handleExport}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export CSV
            </button>

            {userRole === 'superadmin' && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Delete Old Logs
              </button>
            )}
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 capitalize">
              {logType.replace('_', ' ')} ({logs.length} records)
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {getTableHeaders().map((header, idx) => (
                    <th key={idx} className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {logs.map((log, index) => renderLogRow(log, index))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-6 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

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

      {/* Delete Modal */}
      {showDeleteModal && (
        <DeleteOldLogsModal
          logType={logType}
          deleteForm={deleteForm}
          setDeleteForm={setDeleteForm}
          onConfirm={handleDeleteOldLogs}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
}

function DeleteOldLogsModal({ logType, deleteForm, setDeleteForm, onConfirm, onCancel }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 text-center mb-2">
            ⚠️ Delete Old Audit Logs
          </h3>
          <p className="text-gray-600 text-center mb-6">
            This is a HIGH-RISK action that will permanently delete old logs and create a CRITICAL security event.
          </p>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Delete logs older than (days)
              </label>
              <input
                type="number"
                min="90"
                value={deleteForm.older_than_days}
                onChange={(e) => setDeleteForm({ ...deleteForm, older_than_days: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum: 90 days for safety</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Type exactly: <span className="text-red-600 font-mono">DELETE AUDIT LOGS</span>
              </label>
              <input
                type="text"
                value={deleteForm.confirmation_text}
                onChange={(e) => setDeleteForm({ ...deleteForm, confirmation_text: e.target.value })}
                placeholder="Type confirmation text..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-sm text-red-700 font-semibold">Warning:</p>
              <ul className="text-sm text-red-600 mt-2 space-y-1 list-disc list-inside">
                <li>This action cannot be undone</li>
                <li>Will create CRITICAL security event</li>
                <li>Affects audit trail integrity</li>
                <li>Log type: <strong>{logType}</strong></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleteForm.confirmation_text !== 'DELETE AUDIT LOGS'}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete Logs
          </button>
        </div>
      </div>
    </div>
  );
}
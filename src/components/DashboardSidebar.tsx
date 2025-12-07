'use client';

import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Shield,
  UserCheck,
  FileText,
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  userRole: 'admin' | 'superadmin';
  onLogout: () => void;
}

export default function DashboardSidebar({ userRole, onLogout }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: `/dashboard/${userRole}`,
      roles: ['admin', 'superadmin']
    },
    {
      name: 'User Management',
      icon: Users,
      path: `/dashboard/${userRole}`,
      roles: ['superadmin'],
      description: 'Manage all users'
    },
    {
      name: 'Pending Registrations',
      icon: UserCheck,
      path: `/dashboard/${userRole}`,
      roles: ['admin', 'superadmin'],
      description: 'Approve/Reject users'
    },
    {
      name: 'Audit Trail',
      icon: Shield,
      path: '/dashboard/audit',
      roles: ['admin', 'superadmin'],
      highlight: true
    },
    {
      name: 'Reports',
      icon: FileText,
      path: '/dashboard/reports',
      roles: ['admin', 'superadmin'],
      disabled: true
    },
    {
      name: 'Settings',
      icon: Settings,
      path: '/dashboard/settings',
      roles: ['superadmin'],
      disabled: true
    }
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(userRole));

  const isActive = (path: string) => pathname === path;

  return (
    <div className="w-72 bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen p-6 shadow-2xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Smart Learning</h2>
            <p className="text-xs text-gray-400 capitalize">{userRole} Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-2 mb-8">
        {filteredMenu.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={index}
              onClick={() => !item.disabled && router.push(item.path)}
              disabled={item.disabled}
              className={`
                w-full px-4 py-3 rounded-xl flex items-center justify-between
                transition-all duration-200 group
                ${active 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg' 
                  : item.disabled
                    ? 'bg-gray-800/50 cursor-not-allowed opacity-50'
                    : 'hover:bg-gray-700/50'
                }
                ${item.highlight && !active ? 'ring-2 ring-indigo-500/50' : ''}
              `}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-400'}`} />
                <div className="text-left">
                  <div className={`text-sm font-semibold ${active ? 'text-white' : 'text-gray-300'}`}>
                    {item.name}
                  </div>
                  {item.description && (
                    <div className="text-xs text-gray-500">{item.description}</div>
                  )}
                </div>
              </div>
              {!item.disabled && (
                <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                  active ? 'text-white' : 'text-gray-500'
                }`} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-6 left-6 right-6">
        <button
          onClick={onLogout}
          className="w-full px-4 py-3 bg-red-600/20 hover:bg-red-600/30 rounded-xl flex items-center gap-3 transition text-red-400 hover:text-red-300"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-semibold">Logout</span>
        </button>
      </div>

      {/* Footer */}
      <div className="absolute bottom-20 left-6 right-6 text-center">
        <div className="text-xs text-gray-500">
          © 2025 Haritz
        </div>
        <div className="text-xs text-gray-600">
          CreativeJawiProduction.prod
        </div>
      </div>
    </div>
  );
}
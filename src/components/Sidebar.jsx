import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  List,
  ClipboardList,
  Calculator,
  Trophy,
  Settings,
  Database,
  LogOut
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const menu = [
  {
    name: 'Dashboard',
    path: '/',
    icon: <LayoutDashboard size={18} />
  },
  {
    name: 'Alternatif',
    path: '/alternatif',
    icon: <List size={18} />
  },
  {
    name: 'Kriteria',
    path: '/kriteria',
    icon: <ClipboardList size={18} />
  },
  {
    name: 'AHP',
    path: '/ahp',
    icon: <Calculator size={18} />
  },
  {
    name: 'TOPSIS',
    path: '/topsis',
    icon: <Trophy size={18} />
  },
  {
    name: 'Database',
    path: '/database',
    icon: <Database size={18} />
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: <Settings size={18} />
  }
]

export default function Sidebar() {
  const location = useLocation()
  const { admin, logout } = useAuth()
  const avatarSrc = admin?.avatar || '/logo.png'

  return (
    <div className="w-64 min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 text-white shadow-2xl fixed left-0 top-0 z-40 flex flex-col border-r border-blue-900/30">
      {/* Animated background in sidebar */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-1/4 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>
      </div>

      {/* Logo Section */}
      <div className="p-6 flex flex-col items-center border-b border-blue-900/40 relative z-10">
        <div className="w-20 h-20 rounded-full overflow-hidden border-[3px] border-blue-400/60 shadow-lg shadow-blue-500/30 animate-float">
          <img
            src={avatarSrc}
            alt="SPK Parfum Logo"
            className="w-full h-full rounded-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-2xl font-bold text-white">SP</div>';
            }}
          />
        </div>
        <h1 className="mt-3 text-lg font-bold text-center tracking-wide text-gradient">
          SPK Parfum
        </h1>
        <p className="text-xs text-blue-300/70 mt-1">Sistem Pendukung Keputusan</p>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 mt-4 px-3 space-y-2 relative z-10">
        {menu.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                isActive
                  ? 'text-white font-semibold'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              {/* Animated background for active item */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/80 to-cyan-500/60 rounded-xl -z-10 animate-pulse-slow"></div>
              )}
              
              <span className={`${isActive ? 'text-white' : 'text-blue-400 group-hover:text-cyan-300'} transition-colors duration-300 relative z-10`}>
                {item.icon}
              </span>
              <span className="text-sm relative z-10">{item.name}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full animate-scale-in"></div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Logout */}
      <div className="p-3 border-t border-blue-900/40 relative z-10">
        <button
          onClick={() => {
            if (window.confirm('Apakah Anda yakin ingin keluar?')) {
              logout();
              window.location.href = '/login';
            }
          }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-blue-300 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 group"
        >
          <LogOut size={18} className="group-hover:animate-slide-down" />
          <span className="text-sm">Keluar</span>
        </button>
      </div>
    </div>
  )
}
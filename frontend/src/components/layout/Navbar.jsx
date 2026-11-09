import React from 'react';
import { 
  Activity, 
  Bell, 
  ShieldAlert, 
  UserPlus, 
  Search, 
  Stethoscope, 
  Clock,
  Sparkles,
  LogIn
} from 'lucide-react';

export default function Navbar({ onOpenNewPatient, onOpenAuth, isAuthenticated, user, onToggleSidebar, isBackendConnected }) {
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm transition-all">
      <div className="px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Branding & Status */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onToggleSidebar} 
            className="p-2 -ml-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 lg:hidden"
            aria-label="Toggle menu"
          >
            <Activity className="w-5 h-5 text-hospital-600" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-hospital-700 to-hospital-500 flex items-center justify-center text-white shadow-md shadow-hospital-500/20">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg">Smart Triage <span className="text-hospital-600">AI</span></span>
                <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-hospital-700 uppercase tracking-wide">
                  <Sparkles className="w-2.5 h-2.5 text-hospital-600" /> v1.0
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 hidden sm:block">Healthcare Patient Triage & Decision Support</p>
            </div>
          </div>

          <div className="hidden xl:flex items-center gap-2 ml-4 pl-4 border-l border-slate-200">
            <span className="flex h-2.5 w-2.5 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isBackendConnected ? 'bg-emerald-400' : 'bg-blue-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isBackendConnected ? 'bg-emerald-500' : 'bg-blue-500'}`}></span>
            </span>
            <span className="text-xs font-semibold text-slate-700">
              {isBackendConnected ? 'API & MongoDB Connected' : 'ED Triage Live'}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> {currentTime}
            </span>
          </div>
        </div>

        {/* Center: Quick Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-2">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input 
              type="text" 
              placeholder="Search by Patient Name, MRN (e.g. MRN-2026-0419) or Symptom..." 
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-hospital-500 rounded-lg outline-none transition-all text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-hospital-100"
            />
          </div>
        </div>

        {/* Right: Actions, Alerts, & Staff Profile */}
        <div className="flex items-center gap-2.5">
          <button 
            onClick={onOpenNewPatient}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-hospital-600 hover:bg-hospital-700 active:bg-hospital-800 text-white text-xs font-semibold shadow-sm shadow-hospital-600/30 transition-all hover:scale-[1.01]"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">New Patient Intake</span>
          </button>

          <button 
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Critical Triage Alerts (2 Active)"
          >
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-hospital-100 border border-hospital-200 text-hospital-700 flex items-center justify-center font-bold text-xs">
                {user?.initials || 'DR'}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name || 'Dr. Rachel Vance'}</p>
                <p className="text-[10px] text-slate-500 leading-tight">{user?.role || 'Lead Triage Physician'}</p>
              </div>
            </div>
          ) : (
            <button 
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-hospital-700 bg-hospital-50 hover:bg-hospital-100 border border-hospital-200 rounded-lg transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Staff Login</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}

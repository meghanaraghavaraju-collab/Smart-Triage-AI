import React from 'react';
import { 
  LayoutDashboard, 
  UserPlus, 
  ClipboardCheck, 
  Activity, 
  BrainCircuit, 
  Building2, 
  History, 
  BarChart3, 
  FileText,
  ShieldAlert,
  Settings,
  HelpCircle
} from 'lucide-react';

export default function Sidebar({ currentView, onSelectView, isOpen, onClose }) {
  const menuItems = [
    { id: 'dashboard', label: 'Medical Dashboard', icon: LayoutDashboard, badge: 'Live' },
    { id: 'registration', label: 'Patient Registration', icon: UserPlus },
    { id: 'assessment', label: 'Patient Assessment', icon: ClipboardCheck },
    { id: 'vitals', label: 'Vital Signs Monitoring', icon: Activity, badge: '5 Alert' },
    { id: 'ai-triage', label: 'AI Triage Prediction', icon: BrainCircuit, highlight: true },
    { id: 'departments', label: 'Department Routing', icon: Building2 },
    { id: 'history', label: 'Patient History', icon: History },
    { id: 'analytics', label: 'Reports & Analytics', icon: BarChart3 },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-slate-900/40 z-30 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      <aside className={`
        fixed top-16 bottom-0 left-0 z-30 w-64 bg-white border-r border-slate-200 flex flex-col justify-between 
        transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 space-y-6 overflow-y-auto">
          {/* Section: Clinical Navigation */}
          <div>
            <div className="px-2.5 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Clinical Modules
            </div>
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectView(item.id);
                      if (onClose) onClose();
                    }}
                    className={`
                      w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group
                      ${isActive 
                        ? 'bg-hospital-50 text-hospital-700 shadow-xs border border-hospital-200/80' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-hospital-600 stroke-[2.2]' : 'text-slate-400 group-hover:text-slate-600'
                      }`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        item.badge.includes('Alert') 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-hospital-100 text-hospital-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}

                    {item.highlight && !item.badge && (
                      <span className="w-1.5 h-1.5 rounded-full bg-hospital-500 animate-ping"></span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Section: Triage Protocol Quick Reference */}
          <div className="p-3 bg-gradient-to-br from-hospital-50 to-blue-50/40 rounded-xl border border-hospital-100">
            <div className="flex items-center gap-2 mb-2 text-hospital-800 font-bold text-xs">
              <ShieldAlert className="w-4 h-4 text-hospital-600" />
              <span>ESI Triage Scale</span>
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between text-red-700 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span> Level 1-2
                </span>
                <span className="font-bold">High / Emergent</span>
              </div>
              <div className="flex items-center justify-between text-amber-800 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span> Level 3
                </span>
                <span className="font-bold">Urgent</span>
              </div>
              <div className="flex items-center justify-between text-emerald-700 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Level 4-5
                </span>
                <span className="font-bold">Routine</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info & system version */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/60">
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium px-2 py-1">
            <span>St. Jude Medical ED</span>
            <span className="font-mono text-[10px] text-slate-400">v1.0.0-rc</span>
          </div>
        </div>
      </aside>
    </>
  );
}

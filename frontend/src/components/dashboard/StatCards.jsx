import React from 'react';
import { 
  Users, 
  AlertTriangle, 
  Clock, 
  BedDouble, 
  Sparkles,
  TrendingUp,
  Activity
} from 'lucide-react';

export default function StatCards({ stats }) {
  const cards = [
    {
      title: 'Total Patients Today',
      value: stats.totalPatientsToday,
      subtext: '+12% from yesterday',
      icon: Users,
      trend: 'up',
      color: 'border-slate-200 bg-white text-slate-900',
      iconColor: 'bg-blue-50 text-hospital-600',
    },
    {
      title: 'High Risk (Critical)',
      value: stats.criticalPatients,
      subtext: 'ESI Level 1-2 immediate action',
      icon: AlertTriangle,
      badge: 'Action Required',
      color: 'border-red-200 bg-red-50/50 text-red-950',
      iconColor: 'bg-red-100 text-red-600',
      pulse: true,
    },
    {
      title: 'Medium Risk (Urgent)',
      value: stats.urgentPatients,
      subtext: 'ESI Level 3 multi-resource',
      icon: Activity,
      color: 'border-amber-200 bg-amber-50/40 text-amber-950',
      iconColor: 'bg-amber-100 text-amber-700',
    },
    {
      title: 'Average Triage Wait',
      value: `${stats.averageWaitMinutes} min`,
      subtext: 'Target < 20 min',
      icon: Clock,
      trend: 'optimal',
      color: 'border-slate-200 bg-white text-slate-900',
      iconColor: 'bg-slate-100 text-slate-700',
    },
    {
      title: 'Bed Availability',
      value: `${stats.availableBeds}/${stats.totalBeds}`,
      subtext: '70% Emergency Dept load',
      icon: BedDouble,
      color: 'border-slate-200 bg-white text-slate-900',
      iconColor: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'AI Triage Accuracy',
      value: `${stats.aiConfidenceAvg}%`,
      subtext: 'Physician validated',
      icon: Sparkles,
      color: 'border-hospital-200 bg-hospital-50/60 text-hospital-950',
      iconColor: 'bg-hospital-100 text-hospital-700',
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div 
            key={idx} 
            className={`p-4 rounded-2xl border ${card.color} shadow-xs transition-all hover:shadow-md flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-600 line-clamp-1">{card.title}</span>
              <div className={`p-1.5 rounded-lg ${card.iconColor}`}>
                <Icon className={`w-4 h-4 ${card.pulse ? 'animate-bounce' : ''}`} />
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black tracking-tight">{card.value}</span>
                {card.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-600 text-white animate-pulse">
                    {card.badge}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 font-medium mt-1 truncate">{card.subtext}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

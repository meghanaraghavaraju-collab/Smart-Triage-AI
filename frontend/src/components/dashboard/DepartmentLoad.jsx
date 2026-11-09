import React from 'react';
import { Building2, Clock, Users, ArrowUpRight } from 'lucide-react';

export default function DepartmentLoad({ departments }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Building2 className="w-4 h-4 text-hospital-600" />
            Hospital Department Capacity & Routing
          </h3>
          <p className="text-xs text-slate-500">Live bed utilization and queue wait times</p>
        </div>
        <span className="text-[11px] font-semibold text-hospital-700 bg-hospital-50 px-2.5 py-1 rounded-lg border border-hospital-200">
          7 Departments Active
        </span>
      </div>

      <div className="space-y-3">
        {departments.map((dept) => {
          const occupancyRate = Math.round((dept.occupied / dept.capacity) * 100);
          const isHigh = occupancyRate >= 80;
          const isMed = occupancyRate >= 60 && occupancyRate < 80;

          return (
            <div 
              key={dept.id} 
              className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-slate-900">{dept.name}</span>
                  <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                    {dept.code}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    isHigh 
                      ? 'bg-red-100 text-red-700' 
                      : isMed 
                        ? 'bg-amber-100 text-amber-700' 
                        : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {dept.status}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      isHigh ? 'bg-red-500' : isMed ? 'bg-amber-500' : 'bg-hospital-500'
                    }`}
                    style={{ width: `${occupancyRate}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-slate-500 text-[11px] shrink-0">
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-700">{dept.occupied}/{dept.capacity} Beds</span>
                  <span>({occupancyRate}%)</span>
                </div>

                <div className="flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-700 font-semibold">{dept.waitTime}</span> wait
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

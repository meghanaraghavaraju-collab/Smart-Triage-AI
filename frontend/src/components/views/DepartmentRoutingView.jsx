import React from 'react';
import { Building2, Users, Clock, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import DepartmentLoad from '../dashboard/DepartmentLoad';

export default function DepartmentRoutingView({ departments, onSelectDepartment }) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-slate-900">Hospital Department Capacity & Intelligent Routing</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-hospital-100 text-hospital-700">
              Live Allocation
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time bed utilization, unit wait times, and algorithmic patient dispatch recommendation
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => {
          const occupancyRate = Math.round((dept.occupied / dept.capacity) * 100);
          const isHigh = occupancyRate >= 80;

          return (
            <div 
              key={dept.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-hospital-50 border border-hospital-200 text-hospital-700 flex items-center justify-center font-black text-xs">
                      {dept.code}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">{dept.name}</h3>
                      <span className="text-[10px] text-slate-400 font-medium">Unit Code: {dept.code}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isHigh ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {dept.status}
                  </span>
                </div>

                {/* Occupancy stats */}
                <div className="space-y-2 my-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" /> Bed Utilization
                    </span>
                    <span>{dept.occupied} of {dept.capacity} ({occupancyRate}%)</span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        isHigh ? 'bg-red-500' : occupancyRate > 60 ? 'bg-amber-500' : 'bg-hospital-500'
                      }`}
                      style={{ width: `${occupancyRate}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs mb-4">
                  <span className="text-slate-500 flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> Est. Triage Wait
                  </span>
                  <span className="font-bold text-slate-900 font-mono">{dept.waitTime}</span>
                </div>
              </div>

              <button 
                onClick={() => alert(`Routing overview opened for ${dept.name}`)}
                className="w-full py-2 bg-slate-50 hover:bg-hospital-50 hover:text-hospital-700 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <span>View Department Queue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import RiskBadge from '../common/RiskBadge';
import { 
  Filter, 
  ChevronRight, 
  Heart, 
  Thermometer, 
  Wind, 
  Eye, 
  ArrowUpDown,
  Building,
  AlertCircle
} from 'lucide-react';

export default function TriageQueueTable({ patients, onSelectPatient }) {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const filteredPatients = patients.filter(patient => {
    const matchesFilter = filter === 'ALL' || patient.riskLevel === filter;
    const matchesSearch = 
      patient.name.toLowerCase().includes(search.toLowerCase()) ||
      patient.mrn.toLowerCase().includes(search.toLowerCase()) ||
      patient.chiefComplaint.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Table Header & Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-extrabold text-slate-900 text-base">Active Emergency Triage Queue</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-hospital-100 text-hospital-700">
              {filteredPatients.length} Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Real-time prioritized patient intake with AI risk assessment</p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl">
          {[
            { id: 'ALL', label: 'All Patients' },
            { id: 'HIGH', label: 'High Risk (Critical)', countColor: 'text-red-700' },
            { id: 'MEDIUM', label: 'Medium Risk', countColor: 'text-amber-700' },
            { id: 'LOW', label: 'Low Risk', countColor: 'text-emerald-700' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === tab.id 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Patients Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Patient / MRN</th>
              <th className="py-3 px-4">Arrival / Mode</th>
              <th className="py-3 px-4">Chief Complaint & Symptoms</th>
              <th className="py-3 px-4">Vitals Snapshot</th>
              <th className="py-3 px-4">Triage Risk</th>
              <th className="py-3 px-4">Recommended Dept</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredPatients.map((patient) => {
              const isHigh = patient.riskLevel === 'HIGH';
              return (
                <tr 
                  key={patient.id}
                  onClick={() => onSelectPatient(patient)}
                  className={`cursor-pointer transition-colors hover:bg-slate-50/80 ${
                    isHigh ? 'bg-red-50/20' : ''
                  }`}
                >
                  {/* Patient Info */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isHigh ? 'bg-red-100 text-red-700' : 'bg-hospital-100 text-hospital-700'
                      }`}>
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 hover:text-hospital-600 transition-colors">
                          {patient.name}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {patient.mrn} • {patient.age}y, {patient.gender[0]}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Arrival */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-700">{patient.arrivalTime}</div>
                    <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-medium">
                      {patient.arrivalMode}
                    </span>
                  </td>

                  {/* Chief Complaint */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="font-medium text-slate-800 line-clamp-2 leading-relaxed">
                      {patient.chiefComplaint}
                    </p>
                  </td>

                  {/* Vitals Snapshot */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="grid grid-cols-2 gap-1 text-[11px]">
                      <span className={`inline-flex items-center gap-1 font-mono font-medium ${
                        patient.vitals.heartRate > 100 ? 'text-red-600 font-bold' : 'text-slate-700'
                      }`}>
                        <Heart className="w-3 h-3 text-red-500" /> {patient.vitals.heartRate} bpm
                      </span>
                      <span className={`inline-flex items-center gap-1 font-mono font-medium ${
                        patient.vitals.spo2 < 95 ? 'text-red-600 font-bold' : 'text-slate-700'
                      }`}>
                        <Wind className="w-3 h-3 text-cyan-500" /> {patient.vitals.spo2}% SpO2
                      </span>
                      <span className="inline-flex items-center gap-1 font-mono text-slate-600">
                        BP {patient.vitals.bloodPressure}
                      </span>
                      <span className={`inline-flex items-center gap-1 font-mono ${
                        patient.vitals.temperature > 38 ? 'text-amber-700 font-bold' : 'text-slate-600'
                      }`}>
                        <Thermometer className="w-3 h-3 text-amber-500" /> {patient.vitals.temperature}°C
                      </span>
                    </div>
                  </td>

                  {/* Risk Badge */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <RiskBadge level={patient.riskLevel} esiLevel={patient.esiLevel} />
                    <div className="text-[10px] text-slate-400 mt-1 font-medium">
                      AI Conf: {patient.aiConfidence}%
                    </div>
                  </td>

                  {/* Recommended Department */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span>{patient.department}</span>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-right">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPatient(patient);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-hospital-700 bg-hospital-50 hover:bg-hospital-100 border border-hospital-200 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

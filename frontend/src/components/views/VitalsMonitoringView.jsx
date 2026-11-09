import React from 'react';
import { Activity, Heart, Wind, Thermometer, AlertCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import RiskBadge from '../common/RiskBadge';

export default function VitalsMonitoringView({ patients, onSelectPatient }) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-slate-900">Continuous Vital Signs & Early Warning Monitoring</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-hospital-100 text-hospital-700">
              Live Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time physiological telemetry, National Early Warning Score (NEWS2) triggers, and rapid alerts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            2 Critical Physiological Alerts
          </div>
        </div>
      </div>

      {/* Grid of Patient Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {patients.map((patient) => {
          const isTachy = patient.vitals.heartRate > 100;
          const isHypox = patient.vitals.spo2 < 95;
          const isFebrile = patient.vitals.temperature > 38.0;
          const hasVitalsAlert = isTachy || isHypox || isFebrile;

          return (
            <div 
              key={patient.id}
              onClick={() => onSelectPatient(patient)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
                hasVitalsAlert 
                  ? 'bg-red-50/20 border-red-200' 
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm">{patient.name}</span>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {patient.mrn}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{patient.department}</p>
                </div>
                <RiskBadge level={patient.riskLevel} esiLevel={patient.esiLevel} size="sm" />
              </div>

              {/* Vitals Display Bars */}
              <div className="grid grid-cols-2 gap-2 my-4">
                <div className={`p-2.5 rounded-xl border ${
                  isTachy ? 'bg-red-50 border-red-200 text-red-700' : 'bg-slate-50 border-slate-100 text-slate-800'
                }`}>
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-400 mb-0.5">
                    <span>Heart Rate</span>
                    <Heart className="w-3 h-3 text-red-500" />
                  </div>
                  <div className="text-base font-black font-mono">
                    {patient.vitals.heartRate} <span className="text-[10px] font-normal">BPM</span>
                  </div>
                  <span className="text-[9px] font-medium">{isTachy ? 'Tachycardia Alert' : 'Normal Sinus'}</span>
                </div>

                <div className={`p-2.5 rounded-xl border ${
                  isHypox ? 'bg-red-50 border-red-200 text-red-700' : 'bg-slate-50 border-slate-100 text-slate-800'
                }`}>
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-400 mb-0.5">
                    <span>SpO2 Oxygen</span>
                    <Wind className="w-3 h-3 text-blue-500" />
                  </div>
                  <div className="text-base font-black font-mono">
                    {patient.vitals.spo2}%
                  </div>
                  <span className="text-[9px] font-medium">{isHypox ? 'Hypoxia Warning' : 'Adequate Sat.'}</span>
                </div>

                <div className="p-2.5 rounded-xl border bg-slate-50 border-slate-100 text-slate-800">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-400 mb-0.5">
                    <span>Blood Pressure</span>
                    <Activity className="w-3 h-3 text-hospital-600" />
                  </div>
                  <div className="text-base font-black font-mono">
                    {patient.vitals.bloodPressure}
                  </div>
                  <span className="text-[9px] text-slate-400 font-medium">mmHg</span>
                </div>

                <div className={`p-2.5 rounded-xl border ${
                  isFebrile ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-slate-50 border-slate-100 text-slate-800'
                }`}>
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-400 mb-0.5">
                    <span>Temp</span>
                    <Thermometer className="w-3 h-3 text-amber-500" />
                  </div>
                  <div className="text-base font-black font-mono">
                    {patient.vitals.temperature}°C
                  </div>
                  <span className="text-[9px] font-medium">{isFebrile ? 'Pyrexia' : 'Afebrile'}</span>
                </div>
              </div>

              {/* Status Alert Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 truncate max-w-[180px]">
                  Pain Score: <strong>{patient.vitals.painScore}/10</strong>
                </span>
                <span className="text-hospital-600 font-semibold hover:underline">
                  Full Telemetry →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

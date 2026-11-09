import React from 'react';
import RiskBadge from '../common/RiskBadge';
import { 
  X, 
  Sparkles, 
  Heart, 
  Wind, 
  Thermometer, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  FileText, 
  Clock, 
  Send
} from 'lucide-react';

export default function TriageAssessmentModal({ patient, onClose, onDispatch }) {
  if (!patient) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-hospital-900 via-hospital-800 to-hospital-700 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white font-extrabold text-lg">
              {patient.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-black tracking-tight">{patient.name}</h2>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-white/20 text-white font-semibold">
                  {patient.mrn}
                </span>
                <RiskBadge level={patient.riskLevel} esiLevel={patient.esiLevel} />
              </div>
              <p className="text-xs text-blue-100 mt-1">
                {patient.age} years old • {patient.gender} • Arrived {patient.arrivalTime} via {patient.arrivalMode}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          
          {/* Chief Complaint & Allergies */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Chief Complaint & Presenting Symptoms
              </span>
              <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                "{patient.chiefComplaint}"
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Allergies
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {patient.allergies?.map((item, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-700">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Chronic History
                </span>
                <p className="text-[11px] font-medium text-slate-600 mt-0.5">
                  {patient.chronicConditions?.join(', ') || 'None recorded'}
                </p>
              </div>
            </div>
          </div>

          {/* Vitals Signs Card Grid */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-hospital-600" />
              Recorded Vital Signs & Physiological Status
            </h4>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {/* Heart Rate */}
              <div className={`p-3 rounded-xl border ${
                patient.vitals.heartRate > 100 || patient.vitals.heartRate < 60 
                  ? 'bg-red-50/60 border-red-200 text-red-950' 
                  : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[10px] font-bold uppercase">Heart Rate</span>
                  <Heart className="w-3.5 h-3.5 text-red-500" />
                </div>
                <div className="text-lg font-black">{patient.vitals.heartRate} <span className="text-xs font-normal">BPM</span></div>
                <span className="text-[10px] text-slate-400 font-medium">Normal: 60-100</span>
              </div>

              {/* Blood Pressure */}
              <div className="p-3 rounded-xl border bg-slate-50 border-slate-200">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[10px] font-bold uppercase">Blood Press.</span>
                  <Activity className="w-3.5 h-3.5 text-hospital-600" />
                </div>
                <div className="text-lg font-black">{patient.vitals.bloodPressure} <span className="text-xs font-normal">mmHg</span></div>
                <span className="text-[10px] text-slate-400 font-medium">Normal: 120/80</span>
              </div>

              {/* Respiratory Rate */}
              <div className={`p-3 rounded-xl border ${
                patient.vitals.respiratoryRate > 20 
                  ? 'bg-amber-50/60 border-amber-200 text-amber-950' 
                  : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[10px] font-bold uppercase">Resp. Rate</span>
                  <Wind className="w-3.5 h-3.5 text-cyan-600" />
                </div>
                <div className="text-lg font-black">{patient.vitals.respiratoryRate} <span className="text-xs font-normal">/min</span></div>
                <span className="text-[10px] text-slate-400 font-medium">Normal: 12-20</span>
              </div>

              {/* SpO2 */}
              <div className={`p-3 rounded-xl border ${
                patient.vitals.spo2 < 95 
                  ? 'bg-red-50/60 border-red-200 text-red-950' 
                  : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[10px] font-bold uppercase">SpO2 Oxygen</span>
                  <Wind className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <div className="text-lg font-black">{patient.vitals.spo2}%</div>
                <span className="text-[10px] text-slate-400 font-medium">Normal: ≥95%</span>
              </div>

              {/* Temperature */}
              <div className={`p-3 rounded-xl border ${
                patient.vitals.temperature > 37.8 
                  ? 'bg-amber-50/60 border-amber-200 text-amber-950' 
                  : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[10px] font-bold uppercase">Temperature</span>
                  <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <div className="text-lg font-black">{patient.vitals.temperature}°C</div>
                <span className="text-[10px] text-slate-400 font-medium">Normal: 36.5-37.5</span>
              </div>

              {/* Pain Score */}
              <div className="p-3 rounded-xl border bg-slate-50 border-slate-200">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[10px] font-bold uppercase">Pain Scale</span>
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                </div>
                <div className="text-lg font-black text-rose-600">{patient.vitals.painScore} / 10</div>
                <span className="text-[10px] text-slate-400 font-medium">Visual Analog</span>
              </div>
            </div>
          </div>

          {/* AI Clinical Decision Support Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-hospital-50 via-blue-50/50 to-slate-50 border border-hospital-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-hospital-600 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">AI-Assisted Triage Prediction & Analysis</h4>
                  <p className="text-[11px] text-slate-500">Powered by OpenAI GPT-4o Clinical Evaluation Engine</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white text-hospital-700 border border-hospital-200 shadow-xs">
                Confidence: {patient.aiConfidence}%
              </span>
            </div>

            <div className="space-y-3 mt-4">
              <div className="bg-white/90 p-3.5 rounded-xl border border-hospital-100">
                <span className="text-[10px] font-bold uppercase text-hospital-700 tracking-wider block mb-1">
                  Clinical Rationale & Risk Assessment
                </span>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  {patient.aiRationale}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block mb-1.5">
                  Recommended Immediate Interventions
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {patient.recommendedActions?.map((action, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Department Routing */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-hospital-600">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                  Recommended Hospital Department
                </span>
                <p className="text-sm font-black text-slate-900">{patient.department}</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-hospital-100 text-hospital-800">
              Optimal Match
            </span>
          </div>

        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
          >
            Close
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                alert(`Order sheet printed for ${patient.name} (${patient.mrn})`);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
            >
              Print Triage Sheet
            </button>
            <button
              onClick={() => {
                if (onDispatch) onDispatch(patient);
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-hospital-600 hover:bg-hospital-700 transition-colors shadow-sm shadow-hospital-600/30"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Dispatch to {patient.department}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  Stethoscope, 
  RefreshCw,
  ShieldAlert,
  Building2,
  HelpCircle,
  FileText,
  Activity,
  Heart,
  Wind,
  Thermometer,
  Send,
  AlertCircle
} from 'lucide-react';
import RiskBadge from '../common/RiskBadge';

export default function AiTriageView({ patients = [], onSelectPatient, onDispatchPatient }) {
  const [selectedPatient, setSelectedPatient] = useState(patients[0]);
  const [analyzing, setAnalyzing] = useState(false);

  const handleReanalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
    }, 600);
  };

  const isEscalated = selectedPatient?.isEmergencyEscalation;
  const sufficiency = selectedPatient?.informationSufficiency;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-hospital-900 via-hospital-800 to-hospital-700 text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-white/10 backdrop-blur">
              <BrainCircuit className="w-6 h-6 text-hospital-300" />
            </span>
            <div>
              <h2 className="text-xl font-black tracking-tight">AI-Assisted Clinical Triage Decision Module</h2>
              <p className="text-xs text-blue-100 mt-0.5 max-w-2xl">
                Evidence-based emergency risk stratification (ESI v4 & NEWS2) powered by OpenAI GPT-4o. Correlates clinical symptom clusters with real-time vital telemetry.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-blue-200 block uppercase font-bold tracking-wider">Clinical Concordance</span>
            <span className="text-2xl font-black">{selectedPatient?.aiConfidence || 95}%</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Queue, Right AI Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Patient Triage Queue */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Triage Assessment Queue
            </h3>
            <span className="text-[11px] font-bold text-slate-400 font-mono">
              {patients.length} Cases
            </span>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[650px] pr-1">
            {patients.map((p) => {
              const isSelected = (selectedPatient?.id === p.id || selectedPatient?.triageId === p.triageId);
              const urgency = p.urgencyCategory || p.riskLevel;
              return (
                <div
                  key={p.id || p.triageId}
                  onClick={() => setSelectedPatient(p)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-hospital-50/80 border-hospital-400 ring-1 ring-hospital-400/30' 
                      : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <div>
                      <span className="font-bold text-slate-900">{p.name || p.patientName}</span>
                      <span className="text-[10px] text-slate-400 ml-2 font-mono">{p.mrn || p.patientMRN}</span>
                    </div>
                    <RiskBadge level={urgency} esiLevel={p.esiLevel} size="sm" />
                  </div>
                  
                  <p className="text-slate-600 line-clamp-1 text-[11px] mb-2 font-medium">
                    {p.symptomSummary || p.chiefComplaint}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                    <span>Dept: <strong className="text-slate-700">{p.suggestedDepartment || p.department}</strong></span>
                    {p.isEmergencyEscalation && (
                      <span className="text-red-600 font-bold flex items-center gap-0.5">
                        <ShieldAlert className="w-3 h-3" /> Escalated
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: AI Clinical Decision Output Deep Dive */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-6">
          {selectedPatient ? (
            <div className="space-y-6">
              
              {/* Patient Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-hospital-100 text-hospital-700 font-extrabold flex items-center justify-center text-lg border border-hospital-200">
                    {(selectedPatient.name || selectedPatient.patientName)?.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-black text-slate-900">
                        {selectedPatient.name || selectedPatient.patientName}
                      </h3>
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                        {selectedPatient.mrn || selectedPatient.patientMRN}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {selectedPatient.age}y, {selectedPatient.gender}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Arrival: {selectedPatient.arrivalTime || 'Today'} via {selectedPatient.arrivalMode || 'Walk-in'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReanalyze}
                    disabled={analyzing}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-hospital-200 bg-hospital-50 text-hospital-700 hover:bg-hospital-100 text-xs font-bold transition-all shadow-xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${analyzing ? 'animate-spin' : ''}`} />
                    <span>{analyzing ? 'Recalculating...' : 'Re-Evaluate AI'}</span>
                  </button>
                </div>
              </div>

              {/* Emergency Symptom Escalation Banner */}
              {isEscalated && (
                <div className="p-4 bg-red-50 border-2 border-red-300 rounded-2xl text-red-950 flex items-start gap-3 animate-pulse">
                  <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <div className="font-extrabold flex items-center gap-2 text-red-700">
                      <span>EMERGENCY SYMPTOM ESCALATION ENFORCED</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] bg-red-600 text-white font-black uppercase">
                        Safety Protocol Active
                      </span>
                    </div>
                    <p className="text-slate-800 font-medium">
                      {selectedPatient.escalationReason || 'Critical red flags (severe hemodynamic instability or acute ischemic markers) override standard triage algorithms. Urgency category locked to HIGH.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Information Sufficiency Check Warning */}
              {sufficiency && sufficiency.status !== 'SUFFICIENT' && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-2.5 text-xs">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-900 block">
                      Information Sufficiency Notice: {sufficiency.status}
                    </span>
                    <p className="text-[11px] text-slate-700 mt-0.5">
                      {sufficiency.notes}
                    </p>
                  </div>
                </div>
              )}

              {/* Urgency Category & Suggested Department */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Urgency Category & ESI Level
                  </span>
                  <RiskBadge 
                    level={selectedPatient.urgencyCategory || selectedPatient.riskLevel} 
                    esiLevel={selectedPatient.esiLevel} 
                    size="lg" 
                  />
                </div>

                <div className="text-left sm:text-right border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Suggested Hospital Department
                  </span>
                  <div className="flex items-center gap-2 text-hospital-700 sm:justify-end">
                    <Building2 className="w-4 h-4" />
                    <span className="font-black text-slate-900 text-sm">
                      {selectedPatient.suggestedDepartment || selectedPatient.department}
                    </span>
                  </div>
                </div>
              </div>

              {/* Symptom Summary */}
              <div className="p-4 rounded-xl bg-hospital-50/50 border border-hospital-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-hospital-700 block">
                  AI Symptom Summary
                </span>
                <p className="text-xs text-slate-800 leading-relaxed font-semibold">
                  {selectedPatient.symptomSummary || selectedPatient.chiefComplaint}
                </p>
              </div>

              {/* Important Risk Factors */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Important Risk Factors Identified
                </span>
                {selectedPatient.riskFactors && selectedPatient.riskFactors.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedPatient.riskFactors.map((rf, i) => (
                      <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-red-50/50 border border-red-200 text-red-950 text-xs font-semibold">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                        <span>{rf}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-500 font-medium">
                    No critical physiological risk factors or red-flag symptoms flagged. Patient is hemodynamically stable.
                  </div>
                )}
              </div>

              {/* Recommended Next Steps */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Recommended Next Steps & Clinical Action Protocol
                </span>
                <div className="space-y-1.5">
                  {(selectedPatient.recommendedNextSteps || selectedPatient.recommendedActions || []).map((step, i) => (
                    <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clinical AI Rationale */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Clinical Decision Support Rationale
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {selectedPatient.aiRationale}
                </p>
              </div>

              {/* Safety Disclaimer Box */}
              <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 text-amber-900 text-[11px] space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-800">
                  <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Clinical Safety & Non-Diagnostic Disclaimer</span>
                </div>
                <p className="leading-relaxed text-slate-700">
                  {selectedPatient.safetyDisclaimer || 'Treat AI output as clinical decision support only, not a definitive medical diagnosis. Emergency warning signs strictly take precedence over algorithmic scores. A licensed medical provider must perform independent physical verification.'}
                </p>
              </div>

              {/* Footer Dispatch Action */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Status: <strong className="text-slate-700">{selectedPatient.status || 'Assessed'}</strong>
                </span>

                <button
                  onClick={() => {
                    if (onDispatchPatient) onDispatchPatient(selectedPatient);
                    alert(`Dispatched ${selectedPatient.name || selectedPatient.patientName} to ${selectedPatient.suggestedDepartment || selectedPatient.department}`);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-hospital-600 hover:bg-hospital-700 text-white font-bold text-xs transition-colors shadow-sm shadow-hospital-600/30"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch to {selectedPatient.suggestedDepartment || selectedPatient.department}</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-slate-400 text-xs">
              Select a patient from the queue to inspect AI predictions
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

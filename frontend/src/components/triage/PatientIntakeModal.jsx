import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  Heart, 
  Wind, 
  Thermometer, 
  Activity, 
  Sparkles, 
  AlertCircle,
  Building2,
  Stethoscope,
  ChevronRight
} from 'lucide-react';

export default function PatientIntakeModal({ isOpen, onClose, onAddPatient }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    arrivalMode: 'Walk-in',
    chiefComplaint: '',
    allergies: '',
    chronicConditions: '',
    heartRate: '75',
    systolicBP: '120',
    diastolicBP: '80',
    respiratoryRate: '16',
    spo2: '98',
    temperature: '37.0',
    painScore: '3',
  });

  const [isSimulatingAI, setIsSimulatingAI] = useState(false);
  const [aiPreview, setAiPreview] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSimulateAI = () => {
    setIsSimulatingAI(true);
    setTimeout(() => {
      // Evaluate rules & simulate AI prediction based on inputs
      const hr = parseInt(formData.heartRate) || 75;
      const spo2 = parseInt(formData.spo2) || 98;
      const pain = parseInt(formData.painScore) || 0;
      const complaint = (formData.chiefComplaint || '').toLowerCase();

      let risk = 'LOW';
      let esi = 4;
      let dept = 'General Outpatient & Triage';
      let rationale = 'Patient presents with stable vital signs and mild localized symptoms. Routine evaluation recommended.';

      if (complaint.includes('chest') || complaint.includes('heart') || hr > 110 || spo2 < 93) {
        risk = 'HIGH';
        esi = 1;
        dept = 'Cardiology Center';
        rationale = 'Critical presentation detected: Abnormal cardiopulmonary indicators or reported acute chest distress. Priority immediate triage protocol activated.';
      } else if (complaint.includes('stroke') || complaint.includes('slur') || complaint.includes('paralysis')) {
        risk = 'HIGH';
        esi = 1;
        dept = 'Neurology / Stroke Unit';
        rationale = 'Suspected acute neurological event. Immediate stroke team dispatch and non-contrast CT recommended.';
      } else if (complaint.includes('breath') || complaint.includes('asthma') || spo2 < 95) {
        risk = 'MEDIUM';
        esi = 3;
        dept = 'Pulmonology & Respiratory';
        rationale = 'Respiratory distress detected with compromised SpO2 saturation. Requires supplemental oxygenation and bronchodilator evaluation.';
      } else if (complaint.includes('pain') && pain >= 7 || complaint.includes('fever') || complaint.includes('abdomen')) {
        risk = 'MEDIUM';
        esi = 3;
        dept = 'Emergency & Trauma';
        rationale = 'Severe acute pain and systemic distress indicators. Requires urgent diagnostic workup and IV analgesia.';
      } else if (complaint.includes('fracture') || complaint.includes('sprain') || complaint.includes('fall')) {
        risk = 'LOW';
        esi = 4;
        dept = 'Orthopedics & Fracture';
        rationale = 'Stable peripheral trauma. Plain radiography indicated with pain management.';
      }

      setAiPreview({
        riskLevel: risk,
        esiLevel: esi,
        department: dept,
        confidence: 96,
        rationale: rationale,
      });
      setIsSimulatingAI(false);
    }, 600);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.chiefComplaint) {
      alert('Please fill in patient name and chief complaint.');
      return;
    }

    const calculatedRisk = aiPreview?.riskLevel || (
      parseInt(formData.heartRate) > 105 || parseInt(formData.spo2) < 94 ? 'HIGH' : 'LOW'
    );

    const newPatient = {
      id: `PT-${Math.floor(1000 + Math.random() * 9000)}`,
      mrn: `MRN-2026-0${Math.floor(424 + Math.random() * 100)}`,
      name: formData.name,
      age: parseInt(formData.age) || 30,
      gender: formData.gender,
      arrivalTime: 'Just now',
      arrivalMode: formData.arrivalMode,
      chiefComplaint: formData.chiefComplaint,
      riskLevel: calculatedRisk,
      esiLevel: aiPreview?.esiLevel || (calculatedRisk === 'HIGH' ? 1 : calculatedRisk === 'MEDIUM' ? 3 : 4),
      aiConfidence: aiPreview?.confidence || 95,
      department: aiPreview?.department || 'Emergency & Trauma',
      vitals: {
        heartRate: parseInt(formData.heartRate) || 75,
        bloodPressure: `${formData.systolicBP}/${formData.diastolicBP}`,
        respiratoryRate: parseInt(formData.respiratoryRate) || 16,
        spo2: parseInt(formData.spo2) || 98,
        temperature: parseFloat(formData.temperature) || 37.0,
        painScore: parseInt(formData.painScore) || 3,
      },
      status: 'Admitted to Queue',
      allergies: formData.allergies ? formData.allergies.split(',').map(s => s.trim()) : ['None recorded'],
      chronicConditions: formData.chronicConditions ? formData.chronicConditions.split(',').map(s => s.trim()) : ['None'],
      aiRationale: aiPreview?.rationale || 'Real-time intake assessment completed with initial vital signs validation.',
      recommendedActions: [
        'Vital signs confirmation every 15 minutes',
        'Patient assigned to initial triage queue',
        'Notify primary department attending'
      ]
    };

    onAddPatient(newPatient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-hospital-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-extrabold">New Patient Intake & Triage Assessment</h2>
              <p className="text-xs text-blue-100">Immediate clinical intake with AI risk stratification</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          
          {/* Section 1: Demographics */}
          <div>
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3 pb-1 border-b border-slate-100">
              1. Patient Demographics & Intake
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-700 block mb-1">Full Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange}
                  placeholder="e.g. Robert Caldwell"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-hospital-500 outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Age *</label>
                <input 
                  type="number" 
                  name="age" 
                  value={formData.age} 
                  onChange={handleChange}
                  placeholder="54" 
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-hospital-500 outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Gender</label>
                <select 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-hospital-500 outline-none"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-700 block mb-1">Arrival Mode</label>
                <select 
                  name="arrivalMode" 
                  value={formData.arrivalMode} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-hospital-500 outline-none"
                >
                  <option>Walk-in</option>
                  <option>Ambulance (EMS / Parameds)</option>
                  <option>Wheelchair Transfer</option>
                  <option>Hospital Transfer</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-700 block mb-1">Known Allergies</label>
                <input 
                  type="text" 
                  name="allergies" 
                  value={formData.allergies} 
                  onChange={handleChange}
                  placeholder="e.g. Penicillin, Latex, NSAIDs"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-hospital-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Symptoms & Complaint */}
          <div>
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3 pb-1 border-b border-slate-100">
              2. Chief Complaint & Presenting Symptoms
            </h3>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Clinical Description / Symptoms *
              </label>
              <textarea 
                name="chiefComplaint" 
                rows="2"
                value={formData.chiefComplaint}
                onChange={handleChange}
                placeholder="Describe presenting symptoms, onset time, radiation of pain, or distress level..."
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-hospital-500 outline-none resize-none"
              />
            </div>
          </div>

          {/* Section 3: Vital Signs Monitoring */}
          <div>
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3 pb-1 border-b border-slate-100 flex items-center justify-between">
              <span>3. Vital Signs Triage Entry</span>
              <span className="text-[10px] text-hospital-700 font-semibold lowercase">Required for early warning scoring</span>
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
              <div>
                <label className="font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                  <Heart className="w-3 h-3 text-red-500" /> HR (BPM)
                </label>
                <input 
                  type="number" 
                  name="heartRate"
                  value={formData.heartRate}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-hospital-600" /> Systolic
                </label>
                <input 
                  type="number" 
                  name="systolicBP"
                  value={formData.systolicBP}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-slate-400" /> Diastolic
                </label>
                <input 
                  type="number" 
                  name="diastolicBP"
                  value={formData.diastolicBP}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                  <Wind className="w-3 h-3 text-cyan-600" /> Resp. /min
                </label>
                <input 
                  type="number" 
                  name="respiratoryRate"
                  value={formData.respiratoryRate}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                  <Wind className="w-3 h-3 text-blue-500" /> SpO2 (%)
                </label>
                <input 
                  type="number" 
                  name="spo2"
                  value={formData.spo2}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-amber-500" /> Temp (°C)
                </label>
                <input 
                  type="number" 
                  step="0.1"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold focus:bg-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Live AI-Assisted Triage Simulation */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-hospital-50 to-blue-50/50 border border-hospital-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-hospital-600" />
                <span className="font-bold text-slate-900 text-xs">AI-Assisted Triage Analysis</span>
              </div>
              <button
                type="button"
                onClick={handleSimulateAI}
                disabled={isSimulatingAI}
                className="px-3 py-1 bg-white hover:bg-hospital-50 border border-hospital-300 text-hospital-700 rounded-lg font-bold text-xs transition-colors shadow-xs"
              >
                {isSimulatingAI ? 'Evaluating Clinical Data...' : 'Run AI Prediction'}
              </button>
            </div>

            {aiPreview ? (
              <div className="mt-3 p-3 bg-white rounded-lg border border-hospital-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700">Predicted Triage:</span>
                    <span className={`px-2 py-0.5 rounded font-extrabold text-xs ${
                      aiPreview.riskLevel === 'HIGH' ? 'bg-red-100 text-red-700' :
                      aiPreview.riskLevel === 'MEDIUM' ? 'bg-amber-100 text-amber-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {aiPreview.riskLevel} RISK (ESI-{aiPreview.esiLevel})
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">
                    Dept: <strong className="text-hospital-700">{aiPreview.department}</strong>
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                  {aiPreview.rationale}
                </p>
              </div>
            ) : (
              <p className="text-[11px] text-slate-500">
                Click "Run AI Prediction" to test clinical risk stratification and hospital department routing before submitting.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-hospital-600 hover:bg-hospital-700 shadow-sm shadow-hospital-600/30 transition-all flex items-center gap-1.5"
            >
              <span>Submit & Admit to Triage Queue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

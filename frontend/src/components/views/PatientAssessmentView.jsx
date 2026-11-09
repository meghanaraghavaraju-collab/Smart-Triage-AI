import React, { useState, useEffect } from 'react';
import { 
  ClipboardCheck, 
  User, 
  Search, 
  AlertTriangle, 
  Heart, 
  Wind, 
  Thermometer, 
  Activity, 
  Sparkles, 
  CheckCircle2, 
  Building2, 
  ShieldAlert, 
  ChevronRight, 
  Clock, 
  Plus, 
  X,
  FileText,
  AlertCircle,
  HelpCircle,
  CheckCircle
} from 'lucide-react';
import RiskBadge from '../common/RiskBadge';
import { api } from '../../services/api';

const COMMON_SYMPTOM_CATEGORIES = [
  {
    category: 'Cardiovascular',
    color: 'border-red-200 bg-red-50/40 text-red-900',
    items: ['Chest Pain', 'Palpitations', 'Irregular Pulse', 'Syncope / Fainting', 'Cold Sweats / Diaphoresis', 'Chest Tightness']
  },
  {
    category: 'Respiratory',
    color: 'border-cyan-200 bg-cyan-50/40 text-cyan-900',
    items: ['Shortness of Breath', 'Wheezing', 'Persistent Cough', 'Stridor', 'Hemoptysis (Coughing Blood)', 'Rapid Breathing']
  },
  {
    category: 'Neurological',
    color: 'border-indigo-200 bg-indigo-50/40 text-indigo-900',
    items: ['Severe Headache', 'Slurred Speech', 'Facial Droop / Asymmetry', 'Limb Weakness', 'Dizziness / Vertigo', 'Confusion / Disorientation', 'Seizure']
  },
  {
    category: 'Gastrointestinal',
    color: 'border-amber-200 bg-amber-50/40 text-amber-900',
    items: ['Severe Abdominal Pain', 'Nausea / Vomiting', 'Hematemesis (Vomiting Blood)', 'Acute Diarrhea', 'Right Lower Quadrant Pain']
  },
  {
    category: 'Musculoskeletal',
    color: 'border-emerald-200 bg-emerald-50/40 text-emerald-900',
    items: ['Joint / Limb Pain', 'Swelling / Edema', 'Inability to Bear Weight', 'Deformity / Fracture', 'Ankle Inversion Injury']
  },
  {
    category: 'General & Infectious',
    color: 'border-purple-200 bg-purple-50/40 text-purple-900',
    items: ['High Fever', 'Chills / Rigors', 'Extreme Fatigue', 'Allergic Rash / Hives', 'Facial / Lip Swelling']
  }
];

const COMORBIDITIES = [
  'Hypertension',
  'Type 2 Diabetes',
  'Bronchial Asthma / COPD',
  'Coronary Artery Disease (CAD)',
  'Atrial Fibrillation',
  'Previous Stroke / TIA',
  'Chronic Kidney Disease',
  'Heart Failure',
  'Immunocompromised'
];

export default function PatientAssessmentView({ 
  patients = [], 
  onAssessmentSaved, 
  onNavigateToAiTriage,
  onNavigateToQueue 
}) {
  // Patient Selection
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [patientSearch, setPatientSearch] = useState('');
  const [registeredPatients, setRegisteredPatients] = useState(patients);

  // Symptoms Selection
  const [selectedSymptoms, setSelectedSymptoms] = useState(['Chest Pain', 'Shortness of Breath']);
  const [customSymptom, setCustomSymptom] = useState('');
  const [symptomSeverity, setSymptomSeverity] = useState('Severe');
  const [symptomDuration, setSymptomDuration] = useState('1-4 hours');
  const [chiefComplaint, setChiefComplaint] = useState('Crushing substernal chest pressure with mild breathlessness starting while at rest.');

  // Vital Signs
  const [temperature, setTemperature] = useState('37.2');
  const [systolicBP, setSystolicBP] = useState('145');
  const [diastolicBP, setDiastolicBP] = useState('92');
  const [heartRate, setHeartRate] = useState('108');
  const [spo2, setSpo2] = useState('93');
  const [respiratoryRate, setRespiratoryRate] = useState('22');
  const [painScore, setPainScore] = useState(8);

  // Medical History & Notes
  const [medicalHistory, setMedicalHistory] = useState(['Hypertension']);
  const [additionalNotes, setAdditionalNotes] = useState('Patient appears anxious and pale. Diaphoretic forehead noted.');

  // State & Validation
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTriageRecord, setSubmittedTriageRecord] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  // Fetch registered patients from API or sync with props
  useEffect(() => {
    async function fetchLatestPatients() {
      try {
        const livePatients = await api.getPatients();
        if (livePatients && livePatients.length > 0) {
          setRegisteredPatients(livePatients);
          if (!selectedPatientId && livePatients[0]) {
            setSelectedPatientId(livePatients[0]._id || livePatients[0].id);
          }
        }
      } catch (e) {
        console.warn('Using local patients for assessment view:', e);
      }
    }
    fetchLatestPatients();
  }, []);

  const currentPatient = registeredPatients.find(p => (p._id === selectedPatientId || p.id === selectedPatientId)) || registeredPatients[0];

  // When patient selection changes, sync known chronic conditions
  useEffect(() => {
    if (currentPatient?.chronicConditions && currentPatient.chronicConditions.length > 0) {
      setMedicalHistory(currentPatient.chronicConditions);
    }
  }, [selectedPatientId]);

  // Live Red Flag Detection
  const hasEmergencyVital = 
    Number(spo2) > 0 && Number(spo2) < 92 ||
    Number(systolicBP) >= 180 || Number(diastolicBP) >= 115 ||
    (Number(systolicBP) > 0 && Number(systolicBP) < 90) ||
    Number(heartRate) > 125 ||
    (Number(heartRate) > 0 && Number(heartRate) < 50) ||
    Number(respiratoryRate) > 28;

  const hasCardiacOrStrokeSymptom = 
    selectedSymptoms.some(s => s.toLowerCase().includes('chest pain') || s.toLowerCase().includes('facial droop') || s.toLowerCase().includes('slurred speech') || s.toLowerCase().includes('weakness'));

  const isEmergencyWarningActive = hasEmergencyVital || hasCardiacOrStrokeSymptom || symptomSeverity === 'Critical';

  // Toggle Symptoms
  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  const handleAddCustomSymptom = (e) => {
    e.preventDefault();
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms(prev => [...prev, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

  const toggleComorbidity = (cond) => {
    setMedicalHistory(prev =>
      prev.includes(cond) ? prev.filter(c => c !== cond) : [...prev, cond]
    );
  };

  // Validation
  const validateForm = () => {
    const errs = {};

    if (!currentPatient) {
      errs.patient = 'Please select a registered patient.';
    }

    if (selectedSymptoms.length === 0 && (!chiefComplaint || chiefComplaint.trim().length < 4)) {
      errs.symptoms = 'Please select at least one symptom or describe the chief complaint.';
    }

    const t = Number(temperature);
    if (!temperature || isNaN(t) || t < 30 || t > 45) {
      errs.temperature = 'Valid temperature (30°C - 45°C) required.';
    }

    const s = Number(systolicBP);
    if (!systolicBP || isNaN(s) || s < 40 || s > 280) {
      errs.systolicBP = 'Systolic BP (40 - 280 mmHg) required.';
    }

    const d = Number(diastolicBP);
    if (!diastolicBP || isNaN(d) || d < 20 || d > 180) {
      errs.diastolicBP = 'Diastolic BP (20 - 180 mmHg) required.';
    }

    if (s && d && s <= d) {
      errs.diastolicBP = 'Diastolic BP must be less than Systolic BP.';
    }

    const hr = Number(heartRate);
    if (!heartRate || isNaN(hr) || hr < 20 || hr > 300) {
      errs.heartRate = 'Heart rate (20 - 300 BPM) required.';
    }

    const sp = Number(spo2);
    if (!spo2 || isNaN(sp) || sp < 50 || sp > 100) {
      errs.spo2 = 'SpO2 (50% - 100%) required.';
    }

    const rr = Number(respiratoryRate);
    if (!respiratoryRate || isNaN(rr) || rr < 4 || rr > 60) {
      errs.respiratoryRate = 'Respiratory rate (4 - 60 /min) required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submission handler
  const handleSubmitAssessment = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    const payload = {
      patientId: currentPatient._id || currentPatient.id,
      patientDetails: {
        name: currentPatient.name,
        mrn: currentPatient.mrn,
        age: currentPatient.age,
        gender: currentPatient.gender,
        arrivalMode: currentPatient.arrivalMode || 'Walk-in',
        allergies: currentPatient.allergies || [],
        chronicConditions: medicalHistory,
      },
      selectedSymptoms,
      symptomSeverity,
      symptomDuration,
      chiefComplaint: chiefComplaint || selectedSymptoms.join(', '),
      vitals: {
        temperature: Number(temperature),
        systolicBP: Number(systolicBP),
        diastolicBP: Number(diastolicBP),
        bloodPressure: `${systolicBP}/${diastolicBP}`,
        heartRate: Number(heartRate),
        spo2: Number(spo2),
        respiratoryRate: Number(respiratoryRate),
        painScore: Number(painScore),
      },
      medicalHistory,
      additionalNotes,
    };

    try {
      const savedRecord = await api.assessPatient(payload);
      setSubmittedTriageRecord(savedRecord);
      setShowConfirmationModal(true);

      if (onAssessmentSaved) {
        onAssessmentSaved(savedRecord);
      }
    } catch (err) {
      alert(`Submission error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPatients = registeredPatients.filter(p => 
    p.name?.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.mrn?.toLowerCase().includes(patientSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-hospital-50 text-hospital-700 rounded-xl border border-hospital-200">
              <ClipboardCheck className="w-5 h-5 text-hospital-600" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight">
                Patient Symptom & Vital Triage Assessment
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Standardized emergency intake form with AI-assisted clinical decision support
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-hospital-50 text-hospital-700 border border-hospital-200">
            Emergency Severity Index (ESI v4)
          </span>
        </div>
      </div>

      {/* Emergency Escalation Banner if red flags are active */}
      {isEmergencyWarningActive && (
        <div className="p-4 bg-red-50 border-2 border-red-300 rounded-2xl text-red-950 shadow-sm flex items-start gap-3 animate-pulse">
          <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="font-extrabold flex items-center gap-2 text-red-700">
              <span>CRITICAL EMERGENCY WARNING SIGNS DETECTED</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-red-600 text-white font-black uppercase">
                Safety Escalation Active
              </span>
            </div>
            <p className="text-slate-700 font-medium">
              High-risk acute indicators detected (e.g. SpO2 &lt; 92%, severe cardiac/neurological symptoms, or marked hypertension). Safety protocol will automatically prioritize patient as <strong>HIGH URGENCY</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Main Assessment Form */}
      <form onSubmit={handleSubmitAssessment} className="space-y-6">

        {/* 1. Patient Selection Module */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-hospital-600 text-white flex items-center justify-center font-bold text-xs">
                1
              </span>
              <h2 className="font-bold text-slate-900 text-sm">Select Registered Patient</h2>
            </div>
            <span className="text-[11px] text-slate-500">
              {registeredPatients.length} Patients registered in hospital system
            </span>
          </div>

          {errors.patient && (
            <div className="p-2.5 rounded-lg bg-red-50 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{errors.patient}</span>
            </div>
          )}

          {/* Search & Dropdown Picker */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Quick Patient Search
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input 
                  type="text" 
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  placeholder="Filter by name or MRN (e.g. Eleanor, MRN-2026-0419)..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-hospital-500 focus:ring-2 focus:ring-hospital-100"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Select Patient for Assessment *
              </label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-hospital-500"
              >
                {filteredPatients.map((p) => (
                  <option key={p._id || p.id} value={p._id || p.id}>
                    {p.name} ({p.mrn}) — {p.age}y, {p.gender}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Selected Patient Identity Card */}
          {currentPatient && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-hospital-50 to-blue-50/40 border border-hospital-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-hospital-600 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                  {currentPatient.name?.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm">{currentPatient.name}</span>
                    <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-white text-hospital-700 border border-hospital-200 font-semibold">
                      {currentPatient.mrn}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {currentPatient.age} years old • {currentPatient.gender}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-[11px] text-slate-600 font-medium">
                    <span>Arrival Mode: <strong>{currentPatient.arrivalMode || 'Walk-in'}</strong></span>
                    <span>•</span>
                    <span>Allergies: <strong className="text-red-700">{currentPatient.allergies?.join(', ') || 'None recorded'}</strong></span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white text-hospital-700 border border-hospital-200">
                  <CheckCircle className="w-3.5 h-3.5 text-hospital-600" />
                  Active In Hospital
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 2. Symptom Assessment & Multi-Select */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-hospital-600 text-white flex items-center justify-center font-bold text-xs">
                2
              </span>
              <h2 className="font-bold text-slate-900 text-sm">Presenting Symptoms & Multi-Symptom Selection</h2>
            </div>
            <span className="text-[11px] font-semibold text-hospital-700 bg-hospital-50 px-2.5 py-0.5 rounded-full border border-hospital-200">
              {selectedSymptoms.length} Selected
            </span>
          </div>

          {errors.symptoms && (
            <div className="p-2.5 rounded-lg bg-red-50 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{errors.symptoms}</span>
            </div>
          )}

          {/* Categorized Symptom Chips */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-slate-700 block">
              Click symptoms to add or remove (Grouped by clinical system):
            </span>

            <div className="space-y-2.5">
              {COMMON_SYMPTOM_CATEGORIES.map((cat, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    {cat.category}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.items.map((item, itemIdx) => {
                      const isSelected = selectedSymptoms.includes(item);
                      return (
                        <button
                          key={itemIdx}
                          type="button"
                          onClick={() => toggleSymptom(item)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                            isSelected 
                              ? 'bg-hospital-600 text-white border-hospital-600 shadow-xs scale-[1.02]' 
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                          }`}
                        >
                          {isSelected && '✓ '}
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Custom Symptom Tag */}
          <div className="flex items-center gap-2 pt-1">
            <input 
              type="text" 
              value={customSymptom}
              onChange={(e) => setCustomSymptom(e.target.value)}
              placeholder="Add other symptom (e.g. Tinnitus, photophobia)..."
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-hospital-500"
            />
            <button
              type="button"
              onClick={handleAddCustomSymptom}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {/* Symptom Severity and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Overall Symptom Severity Level *
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'Mild', color: 'hover:border-emerald-400', active: 'bg-emerald-600 text-white border-emerald-600' },
                  { id: 'Moderate', color: 'hover:border-blue-400', active: 'bg-hospital-600 text-white border-hospital-600' },
                  { id: 'Severe', color: 'hover:border-amber-400', active: 'bg-amber-600 text-white border-amber-600' },
                  { id: 'Critical', color: 'hover:border-red-400', active: 'bg-red-600 text-white border-red-600' },
                ].map(sev => (
                  <button
                    key={sev.id}
                    type="button"
                    onClick={() => setSymptomSeverity(sev.id)}
                    className={`py-2 px-1 text-xs font-bold rounded-xl border transition-all text-center ${
                      symptomSeverity === sev.id 
                        ? sev.active 
                        : `bg-slate-50 text-slate-700 border-slate-200 ${sev.color}`
                    }`}
                  >
                    {sev.id}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Symptom Duration / Time Since Onset *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['< 1 hour', '1-4 hours', '4-12 hours', '1-2 days', '3-7 days', '> 1 week'].map(dur => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setSymptomDuration(dur)}
                    className={`py-2 px-1 text-xs font-semibold rounded-xl border transition-all text-center ${
                      symptomDuration === dur 
                        ? 'bg-hospital-600 text-white border-hospital-600 font-bold' 
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {dur}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chief Complaint Detailed Description */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Chief Complaint & Clinical Narrative Description
            </label>
            <textarea
              rows="3"
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              placeholder="Describe presenting symptoms, pain radiation, onset triggers, and patient-reported distress..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-hospital-500 leading-relaxed"
            />
          </div>
        </div>

        {/* 3. Vital Signs Monitoring Inputs */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-hospital-600 text-white flex items-center justify-center font-bold text-xs">
                3
              </span>
              <h2 className="font-bold text-slate-900 text-sm">Vital Signs Monitoring Inputs</h2>
            </div>
            <span className="text-[11px] text-hospital-700 font-semibold">
              Early Warning Score Inputs (NEWS2)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            
            {/* Body Temperature */}
            <div className="p-3.5 rounded-xl border bg-slate-50/60 border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between text-slate-700 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-amber-500" /> Body Temp (°C) *
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Norm: 36.5-37.5</span>
              </div>
              <input 
                type="number"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                placeholder="37.0"
                className={`w-full px-3 py-2 bg-white border rounded-lg font-mono font-bold text-sm outline-none ${
                  errors.temperature ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200 focus:border-hospital-500'
                }`}
              />
              {errors.temperature && <span className="text-[10px] text-red-600 block">{errors.temperature}</span>}
            </div>

            {/* Systolic BP */}
            <div className="p-3.5 rounded-xl border bg-slate-50/60 border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between text-slate-700 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-hospital-600" /> Systolic BP (mmHg) *
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Norm: 100-130</span>
              </div>
              <input 
                type="number"
                value={systolicBP}
                onChange={(e) => setSystolicBP(e.target.value)}
                placeholder="120"
                className={`w-full px-3 py-2 bg-white border rounded-lg font-mono font-bold text-sm outline-none ${
                  errors.systolicBP ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200 focus:border-hospital-500'
                }`}
              />
              {errors.systolicBP && <span className="text-[10px] text-red-600 block">{errors.systolicBP}</span>}
            </div>

            {/* Diastolic BP */}
            <div className="p-3.5 rounded-xl border bg-slate-50/60 border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between text-slate-700 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-slate-400" /> Diastolic BP (mmHg) *
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Norm: 60-85</span>
              </div>
              <input 
                type="number"
                value={diastolicBP}
                onChange={(e) => setDiastolicBP(e.target.value)}
                placeholder="80"
                className={`w-full px-3 py-2 bg-white border rounded-lg font-mono font-bold text-sm outline-none ${
                  errors.diastolicBP ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200 focus:border-hospital-500'
                }`}
              />
              {errors.diastolicBP && <span className="text-[10px] text-red-600 block">{errors.diastolicBP}</span>}
            </div>

            {/* Heart Rate */}
            <div className="p-3.5 rounded-xl border bg-slate-50/60 border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between text-slate-700 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-red-500" /> Heart Rate (BPM) *
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Norm: 60-100</span>
              </div>
              <input 
                type="number"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                placeholder="75"
                className={`w-full px-3 py-2 bg-white border rounded-lg font-mono font-bold text-sm outline-none ${
                  errors.heartRate ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200 focus:border-hospital-500'
                }`}
              />
              {errors.heartRate && <span className="text-[10px] text-red-600 block">{errors.heartRate}</span>}
            </div>

            {/* SpO2 */}
            <div className="p-3.5 rounded-xl border bg-slate-50/60 border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between text-slate-700 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Wind className="w-4 h-4 text-blue-500" /> SpO2 Saturation (%) *
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Norm: ≥95%</span>
              </div>
              <input 
                type="number"
                value={spo2}
                onChange={(e) => setSpo2(e.target.value)}
                placeholder="98"
                className={`w-full px-3 py-2 bg-white border rounded-lg font-mono font-bold text-sm outline-none ${
                  errors.spo2 ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200 focus:border-hospital-500'
                }`}
              />
              {errors.spo2 && <span className="text-[10px] text-red-600 block">{errors.spo2}</span>}
            </div>

            {/* Respiratory Rate */}
            <div className="p-3.5 rounded-xl border bg-slate-50/60 border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between text-slate-700 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Wind className="w-4 h-4 text-cyan-600" /> Respiratory Rate (/min) *
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Norm: 12-20</span>
              </div>
              <input 
                type="number"
                value={respiratoryRate}
                onChange={(e) => setRespiratoryRate(e.target.value)}
                placeholder="16"
                className={`w-full px-3 py-2 bg-white border rounded-lg font-mono font-bold text-sm outline-none ${
                  errors.respiratoryRate ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200 focus:border-hospital-500'
                }`}
              />
              {errors.respiratoryRate && <span className="text-[10px] text-red-600 block">{errors.respiratoryRate}</span>}
            </div>

          </div>

          {/* Pain Scale Slider */}
          <div className="pt-2 p-3.5 rounded-xl border border-slate-200 bg-slate-50/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                Pain Scale Visual Analog (0 = No Pain, 10 = Maximum Pain)
              </span>
              <span className={`text-xs font-black font-mono px-2 py-0.5 rounded ${
                painScore >= 8 ? 'bg-red-100 text-red-700' :
                painScore >= 5 ? 'bg-amber-100 text-amber-800' :
                'bg-emerald-100 text-emerald-800'
              }`}>
                {painScore} / 10 ({painScore >= 8 ? 'Severe' : painScore >= 5 ? 'Moderate' : 'Mild / None'})
              </span>
            </div>
            <input 
              type="range"
              min="0"
              max="10"
              value={painScore}
              onChange={(e) => setPainScore(Number(e.target.value))}
              className="w-full accent-hospital-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>0 (No Pain)</span>
              <span>2 (Mild)</span>
              <span>5 (Moderate)</span>
              <span>8 (Severe)</span>
              <span>10 (Worst Pain)</span>
            </div>
          </div>
        </div>

        {/* 4. Medical History & Additional Notes */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-hospital-600 text-white flex items-center justify-center font-bold text-xs">
                4
              </span>
              <h2 className="font-bold text-slate-900 text-sm">Medical History & Additional Clinical Notes</h2>
            </div>
            <span className="text-[11px] text-slate-400">Comorbidities & Risk Context</span>
          </div>

          {/* Comorbidities checkboxes */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-2">
              Known Pre-Existing Conditions & Medical History:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {COMORBIDITIES.map((c, i) => {
                const isChecked = medicalHistory.includes(c);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleComorbidity(c)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-medium text-left transition-all ${
                      isChecked 
                        ? 'bg-hospital-50 border-hospital-300 text-hospital-800 font-semibold' 
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded flex items-center justify-center border ${
                      isChecked ? 'bg-hospital-600 border-hospital-600 text-white text-[10px]' : 'border-slate-300 bg-white'
                    }`}>
                      {isChecked && '✓'}
                    </span>
                    <span className="truncate">{c}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Additional Nursing Observations / Clinical Notes
            </label>
            <textarea
              rows="2"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="e.g. Patient walked in accompanied by family. GCS 15. Peripheral perfusion intact..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-hospital-500 leading-relaxed"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-[11px] text-slate-500">
            * All data is persisted to MongoDB and evaluated through the clinical ESI & AI decision engine.
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-hospital-600 hover:bg-hospital-700 active:bg-hospital-800 text-white font-bold text-xs shadow-md shadow-hospital-600/30 transition-all hover:scale-[1.01] disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Evaluating AI Triage & Saving...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Submit Assessment & Run AI Triage</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </form>

      {/* 5. Post-Submission Confirmation Modal */}
      {showConfirmationModal && submittedTriageRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div 
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`p-5 text-white flex items-center justify-between ${
              submittedTriageRecord.urgencyCategory === 'HIGH' || submittedTriageRecord.riskLevel === 'HIGH'
                ? 'bg-gradient-to-r from-red-700 to-red-600'
                : submittedTriageRecord.urgencyCategory === 'MEDIUM' || submittedTriageRecord.riskLevel === 'MEDIUM'
                  ? 'bg-gradient-to-r from-amber-700 to-amber-600'
                  : 'bg-gradient-to-r from-hospital-700 to-hospital-600'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-white font-black">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold">Assessment Recorded & AI Triage Complete</h3>
                  <p className="text-xs text-white/90">
                    Patient: {submittedTriageRecord.patientName} ({submittedTriageRecord.patientMRN})
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowConfirmationModal(false)}
                className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700">
              
              {/* Emergency Escalation Alert if active */}
              {submittedTriageRecord.isEmergencyEscalation && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-300 text-red-900 flex items-start gap-2.5">
                  <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-red-700 block uppercase">
                      Emergency Warning Override Enforced
                    </span>
                    <p className="text-[11px] text-slate-700 font-medium">
                      {submittedTriageRecord.escalationReason || 'Severe physiological instability or acute red flag detected. Locked to High Risk priority.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Triage Decision Tier & Department */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Urgency Classification
                  </span>
                  <RiskBadge 
                    level={submittedTriageRecord.urgencyCategory || submittedTriageRecord.riskLevel} 
                    esiLevel={submittedTriageRecord.esiLevel} 
                    size="lg" 
                  />
                </div>

                <div className="text-left sm:text-right border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Suggested Department
                  </span>
                  <span className="font-black text-slate-900 text-sm">
                    {submittedTriageRecord.suggestedDepartment || submittedTriageRecord.department}
                  </span>
                </div>
              </div>

              {/* Symptom Summary */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Symptom Summary
                </span>
                <p className="text-slate-800 font-medium leading-relaxed">
                  {submittedTriageRecord.symptomSummary || submittedTriageRecord.chiefComplaint}
                </p>
              </div>

              {/* Important Risk Factors */}
              {submittedTriageRecord.riskFactors && submittedTriageRecord.riskFactors.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Important Risk Factors Identified:
                  </span>
                  <div className="space-y-1">
                    {submittedTriageRecord.riskFactors.map((rf, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-red-50/60 border border-red-200 text-red-900 font-medium text-[11px]">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span>{rf}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Next Steps */}
              {submittedTriageRecord.recommendedNextSteps && submittedTriageRecord.recommendedNextSteps.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Recommended Next Steps & Clinical Orders:
                  </span>
                  <div className="space-y-1">
                    {submittedTriageRecord.recommendedNextSteps.map((step, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-medium text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Information Sufficiency & Safety Disclaimer */}
              <div className="p-3 rounded-xl bg-hospital-50/50 border border-hospital-100 text-[11px] text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-hospital-800">
                  <HelpCircle className="w-3.5 h-3.5 text-hospital-600" />
                  <span>Clinical Safety & Decision Support Notice</span>
                </div>
                <p className="leading-relaxed">
                  {submittedTriageRecord.safetyDisclaimer || 'CLINICAL DECISION SUPPORT ONLY: This assessment provides priority stratification for healthcare professionals and does NOT constitute a definitive medical diagnosis. Independent clinical validation required.'}
                </p>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <button
                onClick={() => {
                  setShowConfirmationModal(false);
                  // Reset form for new assessment
                  setChiefComplaint('');
                  setSelectedSymptoms([]);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors"
              >
                Assess Another Patient
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowConfirmationModal(false);
                    if (onNavigateToQueue) onNavigateToQueue();
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-xs"
                >
                  View in Emergency Queue
                </button>
                <button
                  onClick={() => {
                    setShowConfirmationModal(false);
                    if (onNavigateToAiTriage) onNavigateToAiTriage(submittedTriageRecord);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-hospital-600 hover:bg-hospital-700 shadow-sm transition-colors flex items-center gap-1"
                >
                  <span>Open AI Triage Analysis</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

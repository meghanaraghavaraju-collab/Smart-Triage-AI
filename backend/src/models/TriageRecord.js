import mongoose from 'mongoose';

const triageRecordSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
    index: true,
  },
  patientMRN: {
    type: String,
    required: true,
  },
  patientName: {
    type: String,
    required: true,
  },
  // Structured symptoms
  selectedSymptoms: {
    type: [String],
    default: [],
  },
  symptomSeverity: {
    type: String,
    enum: ['Mild', 'Moderate', 'Severe', 'Critical'],
    default: 'Moderate',
  },
  symptomDuration: {
    type: String,
    default: '1-4 hours',
  },
  chiefComplaint: {
    type: String,
    required: [true, 'Chief complaint or symptom description is required'],
  },
  // Vital signs
  vitals: {
    heartRate: { type: Number, required: true },
    systolicBP: { type: Number, default: 120 },
    diastolicBP: { type: Number, default: 80 },
    bloodPressure: { type: String, required: true }, // e.g. "120/80"
    respiratoryRate: { type: Number, required: true },
    spo2: { type: Number, required: true },
    temperature: { type: Number, required: true },
    painScore: { type: Number, default: 0, min: 0, max: 10 },
  },
  medicalHistory: {
    type: [String],
    default: [],
  },
  additionalNotes: {
    type: String,
    default: '',
  },
  // AI-Assisted Clinical Triage Output
  symptomSummary: {
    type: String,
    default: '',
  },
  riskLevel: {
    type: String,
    enum: ['HIGH', 'MEDIUM', 'LOW'],
    required: true,
    index: true,
  },
  urgencyCategory: {
    type: String,
    enum: ['HIGH', 'MEDIUM', 'LOW'],
    default: 'LOW',
  },
  esiLevel: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
    required: true,
  },
  riskFactors: {
    type: [String],
    default: [],
  },
  recommendedActions: {
    type: [String],
    default: [],
  },
  recommendedNextSteps: {
    type: [String],
    default: [],
  },
  department: {
    type: String,
    required: true,
  },
  suggestedDepartment: {
    type: String,
    default: '',
  },
  aiConfidence: {
    type: Number,
    default: 95,
  },
  aiRationale: {
    type: String,
    default: '',
  },
  // Safety & Clinical Governance
  isEmergencyEscalation: {
    type: Boolean,
    default: false,
  },
  escalationReason: {
    type: String,
    default: '',
  },
  safetyDisclaimer: {
    type: String,
    default: 'CLINICAL DECISION SUPPORT ONLY: This assessment provides priority stratification for healthcare professionals and does NOT constitute a definitive medical diagnosis. Independent clinical validation required.',
  },
  informationSufficiency: {
    status: { type: String, enum: ['SUFFICIENT', 'BORDERLINE', 'INSUFFICIENT'], default: 'SUFFICIENT' },
    missingFields: { type: [String], default: [] },
    notes: { type: String, default: '' },
  },
  assessedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    enum: ['Admitted to Queue', 'In Triage', 'Assessed', 'Dispatched', 'Resolved'],
    default: 'Assessed',
  }
}, {
  timestamps: true,
});

export const TriageRecord = mongoose.model('TriageRecord', triageRecordSchema);

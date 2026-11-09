import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { Department } from '../models/Department.js';
import { Patient } from '../models/Patient.js';
import { TriageRecord } from '../models/TriageRecord.js';
import { evaluateClinicalTriage } from '../services/triageRuleEngine.js';

dotenv.config();

const DEPARTMENTS = [
  { name: 'Emergency & Trauma', code: 'ED', capacity: 18, occupied: 15, waitTime: '12 min', status: 'High Load' },
  { name: 'Cardiology Center', code: 'CARD', capacity: 12, occupied: 9, waitTime: '25 min', status: 'Moderate' },
  { name: 'Neurology / Stroke Unit', code: 'NEURO', capacity: 10, occupied: 6, waitTime: '15 min', status: 'Normal' },
  { name: 'Pulmonology & Respiratory', code: 'PULM', capacity: 14, occupied: 11, waitTime: '30 min', status: 'Moderate' },
  { name: 'Orthopedics & Fracture', code: 'ORTHO', capacity: 16, occupied: 8, waitTime: '20 min', status: 'Normal' },
  { name: 'Pediatrics Urgent Care', code: 'PED', capacity: 20, occupied: 14, waitTime: '35 min', status: 'Moderate' },
  { name: 'General Outpatient & Triage', code: 'OPD', capacity: 25, occupied: 12, waitTime: '10 min', status: 'Normal' },
];

const SEED_PATIENTS = [
  {
    mrn: 'MRN-2026-0419',
    name: 'Eleanor Vance',
    age: 63,
    gender: 'Female',
    arrivalMode: 'Ambulance (EMS / Parameds)',
    allergies: ['Penicillin', 'Sulfa drugs'],
    chronicConditions: ['Hypertension', 'Type 2 Diabetes'],
    selectedSymptoms: ['Chest Pain', 'Shortness of Breath', 'Palpitations', 'Sweating / Diaphoresis'],
    symptomSeverity: 'Critical',
    symptomDuration: '< 1 hour',
    chiefComplaint: 'Crushing central chest pain radiating to left jaw, diaphoresis & dyspnea',
    vitals: { heartRate: 118, systolicBP: 168, diastolicBP: 102, bloodPressure: '168/102', respiratoryRate: 24, spo2: 91, temperature: 37.4, painScore: 9 },
    additionalNotes: 'Patient has history of uncontrolled hypertension and metformin usage. Pain began during breakfast.',
  },
  {
    mrn: 'MRN-2026-0420',
    name: 'Marcus Brody',
    age: 42,
    gender: 'Male',
    arrivalMode: 'Walk-in',
    allergies: ['None known'],
    chronicConditions: [],
    selectedSymptoms: ['Severe Abdominal Pain', 'Fever', 'Nausea / Vomiting'],
    symptomSeverity: 'Severe',
    symptomDuration: '4-12 hours',
    chiefComplaint: 'Acute onset severe right lower quadrant abdominal pain with fever and nausea',
    vitals: { heartRate: 94, systolicBP: 130, diastolicBP: 84, bloodPressure: '130/84', respiratoryRate: 18, spo2: 98, temperature: 38.6, painScore: 7 },
    additionalNotes: 'Local tenderness over McBurney point with positive rebound tenderness. No prior abdominal surgeries.',
  },
  {
    mrn: 'MRN-2026-0421',
    name: 'David Chen',
    age: 29,
    gender: 'Male',
    arrivalMode: 'Walk-in',
    allergies: ['Ibuprofen'],
    chronicConditions: [],
    selectedSymptoms: ['Joint / Limb Pain', 'Swelling / Edema'],
    symptomSeverity: 'Moderate',
    symptomDuration: '1-4 hours',
    chiefComplaint: 'Inversion ankle sprain playing soccer, moderate swelling and difficulty bearing weight',
    vitals: { heartRate: 74, systolicBP: 120, diastolicBP: 78, bloodPressure: '120/78', respiratoryRate: 15, spo2: 99, temperature: 36.8, painScore: 4 },
    additionalNotes: 'No open wounds. Lateral malleolus tender to palpation. Ottawa ankle criteria positive for radiography.',
  },
  {
    mrn: 'MRN-2026-0422',
    name: 'Sophia Martinez',
    age: 71,
    gender: 'Female',
    arrivalMode: 'Ambulance (EMS / Parameds)',
    allergies: ['Aspirin'],
    chronicConditions: ['Atrial Fibrillation', 'Hyperlipidemia'],
    selectedSymptoms: ['Neurological Weakness', 'Slurred Speech', 'Facial Droop / Asymmetry'],
    symptomSeverity: 'Critical',
    symptomDuration: '< 1 hour',
    chiefComplaint: 'Sudden onset facial asymmetry, slurred speech and left arm weakness started 40 min ago',
    vitals: { heartRate: 88, systolicBP: 185, diastolicBP: 110, bloodPressure: '185/110', respiratoryRate: 20, spo2: 95, temperature: 37.1, painScore: 2 },
    additionalNotes: 'Last known normal 45 minutes prior to arrival. Family confirms sudden onset speech difficulty. Emergency Code Stroke active.',
  },
  {
    mrn: 'MRN-2026-0423',
    name: 'Aisha Al-Mansoor',
    age: 35,
    gender: 'Female',
    arrivalMode: 'Walk-in',
    allergies: ['Latex'],
    chronicConditions: ['Bronchial Asthma'],
    selectedSymptoms: ['Shortness of Breath', 'Wheezing', 'Cough'],
    symptomSeverity: 'Severe',
    symptomDuration: '4-12 hours',
    chiefComplaint: 'Moderate wheezing, dry cough and shortness of breath for past 6 hours, history of asthma',
    vitals: { heartRate: 102, systolicBP: 126, diastolicBP: 82, bloodPressure: '126/82', respiratoryRate: 23, spo2: 94, temperature: 37.0, painScore: 3 },
    additionalNotes: 'Patient ran out of albuterol inhaler yesterday. Inspiratory and expiratory wheezes bilateral.',
  }
];

export const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart-triage-ai';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB for seeding');

    // Clean existing
    await Promise.all([
      User.deleteMany(),
      Department.deleteMany(),
      Patient.deleteMany(),
      TriageRecord.deleteMany(),
    ]);

    // Seed Users
    const doctor = await User.create({
      name: 'Dr. Rachel Vance',
      email: 'doctor.vance@hospital.org',
      password: 'password123',
      role: 'Emergency Physician',
      department: 'Emergency & Trauma',
    });

    const nurse = await User.create({
      name: 'Sarah Carter, RN',
      email: 'nurse.carter@hospital.org',
      password: 'password123',
      role: 'Triage Nurse',
      department: 'General Outpatient & Triage',
    });

    // Seed Departments
    await Department.insertMany(DEPARTMENTS);

    // Seed Patients and their enriched Triage Records
    for (const p of SEED_PATIENTS) {
      const patient = await Patient.create({
        mrn: p.mrn,
        name: p.name,
        age: p.age,
        gender: p.gender,
        arrivalMode: p.arrivalMode,
        allergies: p.allergies,
        chronicConditions: p.chronicConditions,
        status: 'Assessed',
      });

      const clinical = evaluateClinicalTriage({
        patientName: p.name,
        age: p.age,
        gender: p.gender,
        selectedSymptoms: p.selectedSymptoms,
        symptomSeverity: p.symptomSeverity,
        symptomDuration: p.symptomDuration,
        chiefComplaint: p.chiefComplaint,
        vitals: p.vitals,
        medicalHistory: p.chronicConditions,
        additionalNotes: p.additionalNotes,
      });

      await TriageRecord.create({
        patient: patient._id,
        patientMRN: patient.mrn,
        patientName: patient.name,
        selectedSymptoms: p.selectedSymptoms,
        symptomSeverity: p.symptomSeverity,
        symptomDuration: p.symptomDuration,
        chiefComplaint: p.chiefComplaint,
        vitals: p.vitals,
        medicalHistory: p.chronicConditions,
        additionalNotes: p.additionalNotes,
        symptomSummary: clinical.symptomSummary,
        riskLevel: clinical.urgencyCategory,
        urgencyCategory: clinical.urgencyCategory,
        esiLevel: clinical.esiLevel,
        riskFactors: clinical.riskFactors,
        recommendedActions: clinical.recommendedNextSteps,
        recommendedNextSteps: clinical.recommendedNextSteps,
        department: clinical.suggestedDepartment,
        suggestedDepartment: clinical.suggestedDepartment,
        aiConfidence: clinical.aiConfidence,
        aiRationale: clinical.aiRationale,
        isEmergencyEscalation: clinical.isEmergencyEscalation,
        escalationReason: clinical.escalationReason,
        safetyDisclaimer: clinical.safetyDisclaimer,
        informationSufficiency: clinical.informationSufficiency,
        assessedBy: doctor._id,
        status: 'Assessed',
      });
    }

    console.log('[Seed] Database successfully populated with clinical users, departments, and enriched patients!');
    return true;
  } catch (error) {
    console.error(`[Seed Error] ${error.message}`);
    return false;
  }
};

if (process.argv[1]?.endsWith('seedDatabase.js')) {
  seedDatabase().then(() => {
    mongoose.connection.close();
    process.exit(0);
  });
}

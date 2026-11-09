import { TriageRecord } from '../models/TriageRecord.js';
import { Patient } from '../models/Patient.js';
import { Department } from '../models/Department.js';
import { runAITriagePrediction } from '../services/triageAIService.js';

// Input validation helper
const validateAssessmentInputs = ({ vitals = {}, chiefComplaint, selectedSymptoms = [] }) => {
  const errors = [];

  // Symptoms validation
  if (selectedSymptoms.length === 0 && (!chiefComplaint || chiefComplaint.trim().length < 3)) {
    errors.push('Please select at least one symptom or provide a chief complaint description.');
  }

  // Temperature validation (Celsius: 30 - 45)
  const temp = Number(vitals.temperature);
  if (isNaN(temp) || temp < 30 || temp > 45) {
    errors.push('Body temperature must be between 30°C and 45°C.');
  }

  // Systolic BP validation (40 - 280 mmHg)
  const systolic = Number(vitals.systolicBP);
  if (isNaN(systolic) || systolic < 40 || systolic > 280) {
    errors.push('Systolic blood pressure must be between 40 and 280 mmHg.');
  }

  // Diastolic BP validation (20 - 180 mmHg)
  const diastolic = Number(vitals.diastolicBP);
  if (isNaN(diastolic) || diastolic < 20 || diastolic > 180) {
    errors.push('Diastolic blood pressure must be between 20 and 180 mmHg.');
  }

  if (systolic <= diastolic) {
    errors.push('Systolic blood pressure must be strictly greater than diastolic blood pressure.');
  }

  // Heart Rate validation (20 - 300 BPM)
  const hr = Number(vitals.heartRate);
  if (isNaN(hr) || hr < 20 || hr > 300) {
    errors.push('Heart rate must be between 20 and 300 BPM.');
  }

  // SpO2 validation (50 - 100 %)
  const spo2 = Number(vitals.spo2);
  if (isNaN(spo2) || spo2 < 50 || spo2 > 100) {
    errors.push('Oxygen saturation (SpO2) must be between 50% and 100%.');
  }

  // Respiratory Rate validation (4 - 60 /min)
  const rr = Number(vitals.respiratoryRate);
  if (isNaN(rr) || rr < 4 || rr > 60) {
    errors.push('Respiratory rate must be between 4 and 60 breaths/min.');
  }

  return errors;
};

// @desc    Perform AI-assisted patient triage assessment
// @route   POST /api/triage/assess
export const assessPatientTriage = async (req, res, next) => {
  try {
    const {
      patientId,
      patientDetails,
      selectedSymptoms = [],
      symptomSeverity = 'Moderate',
      symptomDuration = '1-4 hours',
      chiefComplaint = '',
      vitals = {},
      medicalHistory = [],
      additionalNotes = '',
    } = req.body;

    // Validate inputs
    const validationErrors = validateAssessmentInputs({ vitals, chiefComplaint, selectedSymptoms });
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: validationErrors.join(' | '),
        errors: validationErrors,
      });
    }

    // Resolve patient
    let patient;
    if (patientId) {
      patient = await Patient.findById(patientId);
    } else if (patientDetails && patientDetails.name) {
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      patient = await Patient.create({
        mrn: patientDetails.mrn || `MRN-2026-${randomCode}`,
        name: patientDetails.name,
        age: Number(patientDetails.age) || 30,
        gender: patientDetails.gender || 'Male',
        arrivalMode: patientDetails.arrivalMode || 'Walk-in',
        allergies: patientDetails.allergies || ['None known'],
        chronicConditions: patientDetails.chronicConditions || medicalHistory || [],
        status: 'In Triage',
      });
    }

    if (!patient) {
      return res.status(400).json({ success: false, message: 'Valid registered patient must be selected.' });
    }

    const bloodPressureString = `${vitals.systolicBP}/${vitals.diastolicBP}`;

    // Run AI Clinical Prediction Engine
    const aiResult = await runAITriagePrediction({
      patientName: patient.name,
      age: patient.age,
      gender: patient.gender,
      selectedSymptoms,
      symptomSeverity,
      symptomDuration,
      chiefComplaint: chiefComplaint || selectedSymptoms.join(', '),
      vitals: {
        ...vitals,
        bloodPressure: bloodPressureString,
      },
      medicalHistory: medicalHistory.length > 0 ? medicalHistory : patient.chronicConditions,
      additionalNotes,
    });

    // Save assessment record in MongoDB
    const triageRecord = await TriageRecord.create({
      patient: patient._id,
      patientMRN: patient.mrn,
      patientName: patient.name,
      selectedSymptoms,
      symptomSeverity,
      symptomDuration,
      chiefComplaint: chiefComplaint || selectedSymptoms.join(', '),
      vitals: {
        heartRate: Number(vitals.heartRate),
        systolicBP: Number(vitals.systolicBP),
        diastolicBP: Number(vitals.diastolicBP),
        bloodPressure: bloodPressureString,
        respiratoryRate: Number(vitals.respiratoryRate),
        spo2: Number(vitals.spo2),
        temperature: Number(vitals.temperature),
        painScore: Number(vitals.painScore || 0),
      },
      medicalHistory: medicalHistory.length > 0 ? medicalHistory : patient.chronicConditions,
      additionalNotes,
      symptomSummary: aiResult.symptomSummary,
      riskLevel: aiResult.urgencyCategory,
      urgencyCategory: aiResult.urgencyCategory,
      esiLevel: aiResult.esiLevel,
      riskFactors: aiResult.riskFactors,
      recommendedActions: aiResult.recommendedNextSteps,
      recommendedNextSteps: aiResult.recommendedNextSteps,
      department: aiResult.suggestedDepartment,
      suggestedDepartment: aiResult.suggestedDepartment,
      aiConfidence: aiResult.aiConfidence,
      aiRationale: aiResult.aiRationale,
      isEmergencyEscalation: aiResult.isEmergencyEscalation,
      escalationReason: aiResult.escalationReason,
      safetyDisclaimer: aiResult.safetyDisclaimer,
      informationSufficiency: aiResult.informationSufficiency,
      assessedBy: req.user ? req.user._id : null,
      status: 'Assessed',
    });

    // Update patient status in database
    patient.status = 'Assessed';
    await patient.save();

    res.status(201).json({
      success: true,
      message: 'Patient symptom assessment and AI triage successfully completed and saved.',
      data: triageRecord,
      patient,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get active prioritized emergency triage queue
// @route   GET /api/triage/queue
export const getTriageQueue = async (req, res, next) => {
  try {
    const { riskLevel, department } = req.query;
    let query = { status: { $ne: 'Resolved' } };

    if (riskLevel) {
      query.riskLevel = riskLevel.toUpperCase();
    }
    if (department) {
      query.department = department;
    }

    const records = await TriageRecord.find(query)
      .populate('patient')
      .sort({ createdAt: -1 });

    const riskPriority = { HIGH: 1, MEDIUM: 2, LOW: 3 };
    const sorted = records.sort((a, b) => {
      const pA = riskPriority[a.urgencyCategory || a.riskLevel] || 4;
      const pB = riskPriority[b.urgencyCategory || b.riskLevel] || 4;
      if (pA !== pB) return pA - pB;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.json({
      success: true,
      count: sorted.length,
      data: sorted,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single triage record by ID
// @route   GET /api/triage/:id
export const getTriageById = async (req, res, next) => {
  try {
    const record = await TriageRecord.findById(req.params.id).populate('patient assessedBy');
    if (!record) {
      return res.status(404).json({ success: false, message: 'Triage record not found' });
    }
    res.json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

// @desc    Dispatch patient to department
// @route   PATCH /api/triage/:id/dispatch
export const dispatchPatient = async (req, res, next) => {
  try {
    const { department } = req.body;
    const triage = await TriageRecord.findById(req.params.id);
    if (!triage) {
      return res.status(404).json({ success: false, message: 'Triage record not found' });
    }

    triage.status = 'Dispatched';
    if (department) {
      triage.department = department;
      triage.suggestedDepartment = department;
    }
    await triage.save();

    await Patient.findByIdAndUpdate(triage.patient, { status: 'Dispatched' });

    if (department) {
      await Department.findOneAndUpdate({ name: department }, { $inc: { occupied: 1 } });
    }

    res.json({ success: true, message: `Patient dispatched to ${triage.department}`, data: triage });
  } catch (error) {
    next(error);
  }
};

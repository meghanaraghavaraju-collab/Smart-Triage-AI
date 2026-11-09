import { Patient } from '../models/Patient.js';
import { TriageRecord } from '../models/TriageRecord.js';

// @desc    Get all patients with search/filter
// @route   GET /api/patients
export const getPatients = async (req, res, next) => {
  try {
    const { search, status } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { mrn: { $regex: search, $options: 'i' } }
      ];
    }

    const patients = await Patient.find(query).sort({ arrivalTime: -1 });
    res.json({ success: true, count: patients.length, data: patients });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single patient by ID or MRN with triage history
// @route   GET /api/patients/:id
export const getPatientById = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    const triageHistory = await TriageRecord.find({ patient: patient._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        ...patient.toObject(),
        triageHistory,
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new patient
// @route   POST /api/patients
export const createPatient = async (req, res, next) => {
  try {
    const { name, age, gender, arrivalMode, allergies, chronicConditions, emergencyContact } = req.body;

    // Generate unique MRN (e.g. MRN-2026-XXXX)
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const mrn = req.body.mrn || `MRN-2026-${randomCode}`;

    const patient = await Patient.create({
      mrn,
      name,
      age: Number(age),
      gender,
      arrivalMode: arrivalMode || 'Walk-in',
      allergies: Array.isArray(allergies) ? allergies : (allergies ? allergies.split(',').map(s => s.trim()) : []),
      chronicConditions: Array.isArray(chronicConditions) ? chronicConditions : (chronicConditions ? chronicConditions.split(',').map(s => s.trim()) : []),
      emergencyContact,
      status: 'In Queue',
    });

    res.status(201).json({ success: true, data: patient });
  } catch (error) {
    next(error);
  }
};

// @desc    Update patient status
// @route   PATCH /api/patients/:id/status
export const updatePatientStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    res.json({ success: true, data: patient });
  } catch (error) {
    next(error);
  }
};

import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  mrn: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true,
  },
  age: {
    type: Number,
    required: [true, 'Patient age is required'],
    min: 0,
    max: 125,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true,
  },
  arrivalMode: {
    type: String,
    enum: ['Walk-in', 'Ambulance (EMS / Parameds)', 'Wheelchair Transfer', 'Hospital Transfer'],
    default: 'Walk-in',
  },
  arrivalTime: {
    type: Date,
    default: Date.now,
  },
  allergies: {
    type: [String],
    default: ['None known'],
  },
  chronicConditions: {
    type: [String],
    default: [],
  },
  emergencyContact: {
    name: String,
    phone: String,
    relation: String,
  },
  status: {
    type: String,
    enum: ['In Queue', 'In Triage', 'Assessed', 'Under Treatment', 'Dispatched', 'Discharged'],
    default: 'In Queue',
  }
}, {
  timestamps: true,
});

export const Patient = mongoose.model('Patient', patientSchema);

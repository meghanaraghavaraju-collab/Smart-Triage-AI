import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  code: {
    type: String,
    required: true,
    uppercase: true,
  },
  capacity: {
    type: Number,
    required: true,
    default: 20,
  },
  occupied: {
    type: Number,
    default: 0,
  },
  waitTime: {
    type: String,
    default: '15 min',
  },
  status: {
    type: String,
    enum: ['Normal', 'Moderate', 'High Load', 'Critical / Full'],
    default: 'Normal',
  },
  specialties: [String],
}, {
  timestamps: true,
});

export const Department = mongoose.model('Department', departmentSchema);

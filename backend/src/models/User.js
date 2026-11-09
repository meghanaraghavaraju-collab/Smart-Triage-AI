import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Staff name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Staff email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['Triage Nurse', 'Emergency Physician', 'Clinical Supervisor', 'Department Administrator'],
    default: 'Triage Nurse',
  },
  department: {
    type: String,
    default: 'Emergency Department',
  },
  initials: {
    type: String,
    default: function() {
      return this.name ? this.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'MD';
    }
  }
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);

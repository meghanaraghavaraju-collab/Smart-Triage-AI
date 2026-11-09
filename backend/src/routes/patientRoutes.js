import express from 'express';
import { getPatients, getPatientById, createPatient, updatePatientStatus } from '../controllers/patientController.js';

const router = express.Router();

router.route('/')
  .get(getPatients)
  .post(createPatient);

router.route('/:id')
  .get(getPatientById);

router.route('/:id/status')
  .patch(updatePatientStatus);

export default router;

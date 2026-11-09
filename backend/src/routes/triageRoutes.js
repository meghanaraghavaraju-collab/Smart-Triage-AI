import express from 'express';
import { assessPatientTriage, getTriageQueue, getTriageById, dispatchPatient } from '../controllers/triageController.js';

const router = express.Router();

router.post('/assess', assessPatientTriage);
router.get('/queue', getTriageQueue);
router.get('/:id', getTriageById);
router.patch('/:id/dispatch', dispatchPatient);

export default router;

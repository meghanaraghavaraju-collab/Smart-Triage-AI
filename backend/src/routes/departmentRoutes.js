import express from 'express';
import { getDepartments, updateDepartment } from '../controllers/departmentController.js';

const router = express.Router();

router.route('/')
  .get(getDepartments);

router.route('/:id')
  .put(updateDepartment);

export default router;

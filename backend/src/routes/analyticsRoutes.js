import express from 'express';
import { getOverviewStats, getChartAnalytics } from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/overview', getOverviewStats);
router.get('/charts', getChartAnalytics);

export default router;

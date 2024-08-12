import { adminAuthMiddleware } from '../../../middleware/auth';
import { getDailyLoginReportByRole } from '../controller/getDailyReport';
import { getMonthlyLoginReportByRole } from '../controller/getMonthlyReport';
import { getWeeklyLoginReportByRole } from '../controller/getWeeklyReports';
import { getLoginReportByRole } from '../controller/getYearlyReports';
import express from 'express';
const router = express.Router();
router.get(
  '/getDailyLoginReportByRole',
  adminAuthMiddleware,
  getDailyLoginReportByRole,
);
router.get(
  '/getWeeklyLoginReportByRole',
  adminAuthMiddleware,
  getWeeklyLoginReportByRole,
);
router.get(
  '/getMonthlyLoginReportByRole',
  adminAuthMiddleware,
  getMonthlyLoginReportByRole,
);
router.get('/getLoginReportByRole', adminAuthMiddleware, getLoginReportByRole);
export default router;

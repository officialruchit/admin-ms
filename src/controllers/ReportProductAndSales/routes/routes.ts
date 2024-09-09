import express from 'express';
import { topSellingProducts } from '../controller/productReport'
import { salesReport } from '../controller/salesReport'

const router = express.Router();

// Route to get top-selling products for a specific period (daily, weekly, monthly)
router.get('/top-selling-products/:period', topSellingProducts);

// Route to get sales report for a specific period (daily, weekly, monthly)
router.get('/sales-report/:period', salesReport);

export default router;

import { Router } from 'express';
import { salesReport } from '../controller/salesReport';
import { topSellingProducts } from '../controller/productReport';
const router = Router();

router.get('/sales-report/:period', salesReport);

router.get('/top-products/:period', topSellingProducts);
export default router;

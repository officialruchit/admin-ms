import express from 'express';
const router = express.Router();

import bundleRoutes from '../controllers/bundle/routes/bundleRoutes';
import categoryRoutes from '../controllers/category/routes/categoryRoutes';
import discountRoutes from '../controllers/discount/routes/discountRout';
import productRoutes from '../controllers/Product/routes/productRoutes';
import reportRoutes from '../controllers/report/routes/report';
import userRoutes from '../controllers/user/routes/userRoutes';
import { signin } from '../controllers/signin';
import { signup } from '../controllers/signup';

router.post('/signup', signup);
router.post('/login', signin);
router.use('/', bundleRoutes);
router.use('/', categoryRoutes);
router.use('/', discountRoutes);
router.use('/', productRoutes);
router.use('/', reportRoutes);
router.use('/', userRoutes);

export default router;

import { adminAuthMiddleware } from '../../../middleware/auth';
import { blockProduct } from '../controller/blockProduct';
import { getAllProducts } from '../controller/GetAllProduct';
import { getAllProductsById } from '../controller/getProductById';
import { unblockProduct } from '../controller/unblockProduct';
import express from 'express';
const router = express.Router();
router.get('/getAllProductsById/:id', adminAuthMiddleware, getAllProductsById);
router.get('/getAllProducts', adminAuthMiddleware, getAllProducts);
router.put('/blockProduct/:id', adminAuthMiddleware, blockProduct);
router.put('/unblockProduct/:id', adminAuthMiddleware, unblockProduct);

export default router;

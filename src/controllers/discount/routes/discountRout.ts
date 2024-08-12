import { adminAuthMiddleware } from '../../../middleware/auth';
import { applyDiscount } from '../controller/applyDiscountInProduct';
import { createDiscount } from '../controller/createDiscount';
import { deleteDiscount } from '../controller/deleteDiscount';
import { getAllDiscounts } from '../controller/getAllDiscount';
import { updateDiscount } from '../controller/updateDiscount';
import express from 'express';
const router = express.Router();

router.get('/getAllDiscounts', adminAuthMiddleware, getAllDiscounts);
router.post('/createDiscount', adminAuthMiddleware, createDiscount);
router.put('/updateDiscount/:id', adminAuthMiddleware, updateDiscount);
router.delete('/deleteDiscount/:id', adminAuthMiddleware, deleteDiscount);
export default router;

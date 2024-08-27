import { adminAuthMiddleware } from '../../../middleware/auth';
import { addProductToDiscount } from '../controller/applyDiscountInProduct';
import { createDiscount } from '../controller/createDiscount';
import { deleteDiscount } from '../controller/deleteDiscount';
import { getAllDiscounts } from '../controller/getAllDiscount';
import { getByIdDiscount } from '../controller/getDiscountBuId';
import { removeProductFromDiscount } from '../controller/removeDiscount';
import { updateDiscount } from '../controller/updateDiscount';
import express from 'express';
const router = express.Router();

router.get('/getAllDiscounts', adminAuthMiddleware, getAllDiscounts);
router.get('/getByIdDiscount/:id', adminAuthMiddleware, getByIdDiscount);
router.post('/createDiscount', adminAuthMiddleware, createDiscount);
router.put('/updateDiscount/:id', adminAuthMiddleware, updateDiscount);
router.delete('/deleteDiscount/:id', adminAuthMiddleware, deleteDiscount);
router.patch(
  '/addProductToDiscount/:discountId',
  adminAuthMiddleware,
  addProductToDiscount,
);
router.patch(
  '/removeProductFromDiscount/:discountId',
  adminAuthMiddleware,
  removeProductFromDiscount,
);
export default router;

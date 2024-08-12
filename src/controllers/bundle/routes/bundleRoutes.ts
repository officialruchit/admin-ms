import express from 'express';
const router = express.Router();

import { blockBundleProduct } from '../controller/blockBundle';
import { unblockBundleProduct } from '../controller/unblockBundle';
import { adminAuthMiddleware } from '../../../middleware/auth';
import { addProductToBundle } from '../controller/addProductInBundle';
import { deleteBundleProduct } from '../controller/deleteBundle';
import { getAllBundle } from '../controller/getALlBundle';
import { createBundleProduct } from '../controller/addBundle';
import { removeProductFromBundle } from '../controller/removeProductFromBundle';

router.get('/getAllBundle', adminAuthMiddleware, getAllBundle);
router.post('/createBundleProduct', adminAuthMiddleware, createBundleProduct);
router.patch(
  '/unblockBundleProduct/:id',
  adminAuthMiddleware,
  unblockBundleProduct,
);
router.patch(
  '/blockBundleProduct/:id',
  adminAuthMiddleware,
  blockBundleProduct,
);
router.patch(
  '/bundle/:bundleId/product/:productId',
  adminAuthMiddleware,
  addProductToBundle,
);

router.delete('/bundle/:bundleId', adminAuthMiddleware, deleteBundleProduct);
export default router;

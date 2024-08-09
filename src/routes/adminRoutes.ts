import express from 'express';
const router = express.Router();
import { signin } from '../controllers/signin';
import { signup } from '../controllers/signup';
import { getAllUsers } from '../controllers/getAllUserInfo';
import { getUserInfo } from '../controllers/getUserInfo';
import { blockUser } from '../controllers/blockUser';
import { unblockUser } from '../controllers/unblockeuser';
import { getAllProducts } from '../controllers/GetAllProduct';
import { getAllProductsById } from '../controllers/getProductById';
import { blockProduct } from '../controllers/blockProduct';
import { unblockProduct } from '../controllers/unblockProduct';
import { getAllProductCategories } from '../controllers/getAllCategory';
import { getProductCategoryById } from '../controllers/getCategoryByid';
import { createProductCategory } from '../controllers/addCategory';
import { updateProductCategory } from '../controllers/updateCategory';
import { deleteProductCategory } from '../controllers/deleteCategory';
import { blockBundleProduct } from '../controllers/blockBundle';
import { unblockBundleProduct } from '../controllers/unblockBundle';
import { createDiscount } from '../controllers/createDiscount';
import { deleteDiscount } from '../controllers/deleteDiscount';
import { getAllDiscounts } from '../controllers/getAllDiscount';
import { updateDiscount } from '../controllers/updateDiscount';
import { adminAuthMiddleware } from '../middleware/auth';
import { createBundleProduct } from '../controllers/addBundle';
import { addProductToBundle } from '../controllers/addProductInBundle';
import { deleteBundleProduct } from '../controllers/deleteBundle';
import { getAllBundle } from '../controllers/getALlBundle';
import { getDailyLoginReportByRole } from '../controllers/getDailyReport';
import { getWeeklyLoginReportByRole } from '../controllers/getWeeklyReports';

router.get('/getDailyLoginReportByRole', getDailyLoginReportByRole);
router.get('/getWeeklyLoginReportByRole', getWeeklyLoginReportByRole);

router.get('/getAllBundle', getAllBundle);
router.get('/getAllDiscounts', getAllDiscounts);
router.get('/getAllProductCategories', getAllProductCategories);
router.get('/getProductCategoryById/:id', getProductCategoryById);
router.get('/getAllProductsById/:id', getAllProductsById);
router.get('/getUserInfo/:id', getUserInfo);
router.get('/getAllProducts', getAllProducts);
router.get('/getAllUsers', adminAuthMiddleware, getAllUsers);
router.post('/signup', signup);
router.post('/login', signin);
router.post('/createBundleProduct', adminAuthMiddleware, createBundleProduct);
router.post('/createDiscount', createDiscount);
router.post('/createProductCategory', createProductCategory);
router.put('/updateProductCategory/:id', updateProductCategory);
router.patch('/unblockBundleProduct/:id', unblockBundleProduct);
router.patch('/blockBundleProduct/:id', blockBundleProduct);
router.patch(
  '/bundle/:bundleId/product/:productId',
  adminAuthMiddleware,
  addProductToBundle,
);
router.put('/blockUser/:id', blockUser);
router.put('/updateDiscount/:id', updateDiscount);
router.put('/unblockUser/:id', unblockUser);
router.put('/blockProduct/:id', blockProduct);
router.put('/unblockProduct/:id', unblockProduct);
router.delete('/deleteProductCategory/:id', deleteProductCategory);
router.delete('/deleteDiscount/:id', deleteDiscount);
router.delete('/bundle/:bundleId', deleteBundleProduct);
export default router;

import express from 'express';
const router = express.Router();
import { createProductCategory } from '../controller/addCategory';
import { deleteProductCategory } from '../controller/deleteCategory';
import { getAllProductCategories } from '../controller/getAllCategory';
import { getProductCategoryById } from '../controller/getCategoryByid';
import { updateProductCategory } from '../controller/updateCategory';
import { adminAuthMiddleware } from '../../../middleware/auth';

router.get(
  '/getAllProductCategories',
  adminAuthMiddleware,
  getAllProductCategories,
);
router.get(
  '/getProductCategoryById/:id',
  adminAuthMiddleware,
  getProductCategoryById,
);

router.post(
  '/createProductCategory',
  adminAuthMiddleware,
  createProductCategory,
);
router.put(
  '/updateProductCategory/:id',
  adminAuthMiddleware,
  updateProductCategory,
);
router.delete(
  '/deleteProductCategory/:id',
  adminAuthMiddleware,
  deleteProductCategory,
);
export default router;

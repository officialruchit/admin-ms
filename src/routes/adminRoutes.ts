import express from 'express';
const router = express.Router();
import {loginAdmin }from '../controllers/signin';
import {signUpAdmin}from '../controllers/signup';
import{getAllUsers} from '../controllers/getAllUserInfo'
import {getUserInfo} from '../controllers/getUserInfo'
import {blockUser} from '../controllers/blockUser'
import {unblockUser} from '../controllers/unblockeuser'
import {getAllProducts} from '../controllers/GetAllProduct'
import {getAllProductsById} from '../controllers/getProductById'
import {blockProduct} from '../controllers/blockProduct'
import {unblockProduct} from '../controllers/unblockProduct'
import{getAllProductCategories} from '../controllers/getAllCategory'
import{getProductCategoryById} from '../controllers/getCategoryByid'
import{createProductCategory} from '../controllers/addCategory'
import{updateProductCategory} from '../controllers/updateCategory'
import{deleteProductCategory} from '../controllers/deleteCategory'
import{blockBundleProduct} from '../controllers/blockBundle'
import{unblockBundleProduct} from '../controllers/unblockBundle'

router.get('/getAllProductCategories',getAllProductCategories)
router.get('/getProductCategoryById/:id',getProductCategoryById)
router.get('/getAllProductsById/:id',getAllProductsById)
router.get('/getUserInfo/:id',getUserInfo)
router.get('/getAllProducts',getAllProducts)
router.get('/getAllUsers',getAllUsers)
router.post('/signup', signUpAdmin);
router.post('/login', loginAdmin);
router.post('/createProductCategory', createProductCategory);
router.put('/updateProductCategory/:id',updateProductCategory);
router.patch('/unblockBundleProduct/:id',unblockBundleProduct)
router.patch('/blockBundleProduct/:id',blockBundleProduct)
router.put('/blockUser/:id',blockUser)
router.put('/unblockUser/:id',unblockUser)
router.put('/blockProduct/:id',blockProduct)
router.put('/unblockProduct/:id',unblockProduct)
router.delete('/deleteProductCategory/:id', deleteProductCategory);
export default router;

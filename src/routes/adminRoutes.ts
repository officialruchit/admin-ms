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
router.get('/getAllProductsById/:id',getAllProductsById)
router.get('/getUserInfo/:id',getUserInfo)
router.get('/getAllProducts',getAllProducts)
router.get('/getAllUsers',getAllUsers)

router.post('/signup', signUpAdmin);
router.post('/login', loginAdmin);
router.put('/blockUser/:id',blockUser)
router.put('/unblockUser/:id',unblockUser)
router.put('/blockProduct/:id',blockProduct)
router.put('/unblockProduct/:id',unblockProduct)
export default router;

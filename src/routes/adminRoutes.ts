import express from 'express';
const router = express.Router();
import {loginAdmin }from '../controllers/signin';
import {signUpAdmin}from '../controllers/signup';


router.post('/signup', signUpAdmin);
router.post('/login', loginAdmin);

export default router;

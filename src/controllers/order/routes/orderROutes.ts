import express from 'express';
import { markOrderDelivered } from '../controller/deliviedOrder';
import { getAllOrders } from '../controller/getAllOrder';
import { markOrderShipped } from '../controller/shippedOrder';
const router = express.Router();

router.get('/getAllOrders', getAllOrders);
router.patch('/markOrderDelivered', markOrderDelivered);
router.patch('/markOrderShipped', markOrderShipped);
export default router;

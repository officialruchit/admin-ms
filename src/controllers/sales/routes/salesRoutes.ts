import { Router } from 'express';
const routes = Router();
import { createSales } from '../controller/createSales';
import { adminAuthMiddleware } from '../../../middleware/auth';
import { addProductToSale } from '../controller/addProduct';
import { removeProductFromSale } from '../controller/removeProduct';
import { getSaleDetails } from '../controller/getSales';
import { getAllSales } from '../controller/getAllSales';
import { deleteSale } from '../controller/deleteSale';

routes.get('/getSaleDetails/:id', adminAuthMiddleware, getSaleDetails);
routes.get('/getAllSales', adminAuthMiddleware, getAllSales);
routes.post('/createSales', adminAuthMiddleware, createSales);
routes.patch('/addProductToSale/:id', adminAuthMiddleware, addProductToSale);
//routes.patch('/removeProductFromSale/:id',adminAuthMiddleware,removeProductFromSale)
//routes.delete('/deleteSale/:id',adminAuthMiddleware,deleteSale)
export default routes;

import { Router } from 'express';
import billingService from '../services/billingService.js';

const billingRouter = Router();

billingRouter.route('/')
    .get(billingService.ListBillsByUser)
    .post(billingService.CreateBill); 

billingRouter.route('/:uuid')
    .get(billingService.GetBillById) 
    .put(billingService.UpdateBillStatus) 
    .delete(billingService.DeleteBill); 

billingRouter.route('/user/:userUuid')
    .get(billingService.ListBillsByUser);

billingRouter.route('/check')
    .get(billingService.RouteCheck);

export default billingRouter;

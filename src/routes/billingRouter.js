import { Router } from 'express';
import billingService from '../services/billingService.js';

const billingRouter = Router();

billingRouter.route('/')
    .post(billingService.CreateBill)
    .get(billingService.ListBillsByUser);

billingRouter.route('/:uuid')
    .get(billingService.GetBillById) 
    .patch(billingService.UpdateBillStatus) 
    .delete(billingService.DeleteBill); 
  
export default billingRouter;

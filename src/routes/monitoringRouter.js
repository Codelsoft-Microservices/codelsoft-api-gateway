import { Router } from 'express';
import monitoringService from '../services/monitoringService.js';

const monitoringRouter = Router();

monitoringRouter.route('/acciones')
    .get(monitoringService.GetAllActions)

monitoringRouter.route('/errores')
    .get(monitoringService.GetAllErrors);

export default monitoringRouter;
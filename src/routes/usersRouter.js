import { Router } from 'express';
import usersService from '../services/usersService.js';

const usersRouter = Router();

usersRouter.route('/')
    .get(usersService.GetAllUsers)
    .post(usersService.CreateUser);

usersRouter.route('/:uuid')
    .get(usersService.GetUserByUUID)
    .patch(usersService.UpdateUser)
    .delete(usersService.DeleteUser);

export default usersRouter;
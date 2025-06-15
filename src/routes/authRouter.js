import { Router } from 'express';
import { authCheck, login, updatePassword} from '../services/authService.js';
const authRouter = Router();

authRouter.get("/", authCheck);
authRouter.post("/login", login);
authRouter.patch("/usuarios/:uuid", updatePassword);
// authRouter.post("/logout", logout);

export default authRouter;
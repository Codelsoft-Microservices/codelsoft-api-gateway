import { Router } from 'express';
import socialService from '../services/socialService.js'; 

const socialRouter = Router();

socialRouter.route('/:uuid')
    .get(socialService.GetVideoLikesAndCommentsRequest)

socialRouter.route('/:uuid/likes')
    .post(socialService.LikeVideo);

socialRouter.route('/:uuid/comentarios')
    .post(socialService.CommentVideo);

export default socialRouter;
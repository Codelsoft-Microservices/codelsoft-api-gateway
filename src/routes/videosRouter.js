import { Router } from 'express';
import videoService from '../services/videosService.js';

const videosRouter = Router();

videosRouter.route('/')
    .post(videoService.UploadVideo)
    .get(videoService.ListVideos);

videosRouter.route('/:uuid')
    .get(videoService.GetVideoByID) 
    .patcht(videoService.UpdateVideo) 
    .delete(videoService.DeleteVideo); 


export default videosRouter;

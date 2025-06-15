import { Router } from 'express';
import videoService from '../services/videosService.js';

const videosRouter = Router();

videosRouter.route('/check')
    .get(videoService.VideoCheck);

videosRouter.route('/')
    .post(videoService.UploadVideo)
    .get(videoService.ListVideos);

videosRouter.route('/:uuid')
    .get(videoService.GetVideoByID) 
    .put(videoService.UpdateVideo) 
    .delete(videoService.DeleteVideo); 


export default videosRouter;

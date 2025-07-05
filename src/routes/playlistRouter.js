import { Router } from 'express';
import playlistService from '../services/playlistService.js';

const playlistRouter = Router();

playlistRouter.route('/')
    .get(playlistService.GetPlaylists)
    .post(playlistService.CreatePlaylist);

playlistRouter.route('/:id')
    .delete(playlistService.DeletePlaylist);

playlistRouter.route('/:id/videos')
    .get(playlistService.GetPlaylistVideos)
    .post(playlistService.AddVideoToPlaylist)
    .delete(playlistService.RemoveVideoFromPlaylist);

export default playlistRouter;

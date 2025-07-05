import catchAsync from '../utils/catchAsync.js';

const RouteCheck = catchAsync(async (req, res, next) => {
    const playlistClient = req.app.locals.playlistClient;
    
    playlistClient.RouteCheck({}, (err, response) => {
        if (err) return next(err);
        return res.status(200).json(response);
    });
});

const CreatePlaylist = catchAsync(async (req, res, next) => {
    const playlistClient = req.app.locals.playlistClient;
    
    playlistClient.CreatePlaylist(req.body, (err, response) => {
        if (err) return next(err);
        return res.status(201).json(response);
    });
});

const AddVideoToPlaylist = catchAsync(async (req, res, next) => {
    const playlistClient = req.app.locals.playlistClient;
    const { playlistId } = req.params;
    
    playlistClient.AddVideoToPlaylist({ playlistId, ...req.body }, (err, response) => {
        if (err) return next(err);
        return res.status(200).json(response);
    });
});

const RemoveVideoFromPlaylist = catchAsync(async (req, res, next) => {
    const playlistClient = req.app.locals.playlistClient;
    const { playlistId, videoId } = req.params;
    
    playlistClient.RemoveVideoFromPlaylist({ playlistId, videoId }, (err, response) => {
        if (err) return next(err);
        return res.status(200).json(response);
    });
});

const GetPlaylists = catchAsync(async (req, res, next) => {
    const playlistClient = req.app.locals.playlistClient;
    
    playlistClient.GetPlaylists(req.query, (err, response) => {
        if (err) return next(err);
        return res.status(200).json(response);
    });
});

const GetPlaylistVideos = catchAsync(async (req, res, next) => {
    const playlistClient = req.app.locals.playlistClient;
    const { playlistId } = req.params;
    
    playlistClient.GetPlaylistVideos({ playlistId }, (err, response) => {
        if (err) return next(err);
        return res.status(200).json(response);
    });
});

const DeletePlaylist = catchAsync(async (req, res, next) => {
    const playlistClient = req.app.locals.playlistClient;
    const { playlistId } = req.params;
    
    playlistClient.DeletePlaylist({ playlistId }, (err, response) => {
        if (err) return next(err);
        return res.status(200).json(response);
    });
});

export default {
    RouteCheck,
    CreatePlaylist,
    AddVideoToPlaylist,
    RemoveVideoFromPlaylist,
    GetPlaylists,
    GetPlaylistVideos,
    DeletePlaylist
};

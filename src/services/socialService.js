import catchAsync from '../utils/catchAsync.js';

const LikeVideo = catchAsync(async (req, res, next) => {
    const socialClient = req.app.locals.socialClient;

    socialClient.LikeVideo({}, (err, response) => {
        if (err) return next(err);
        return res.status(200).json(response);
    });
});

const CommentVideo = catchAsync(async (req, res, next) => {
    const socialClient = req.app.locals.socialClient;

    socialClient.CommentVideo({}, (err, response) => {
        if (err) return next(err);
        return res.status(200).json(response);
    });
});

const GetVideoLikesAndCommentsRequest = catchAsync(async (req, res, next) => {
    const socialClient = req.app.locals.socialClient;

    socialClient.GetVideoLikesAndCommentsRequest({}, (err, response) => {
        if (err) return next(err);
        return res.status(200).json(response);
    });
});

export default {
    LikeVideo,
    CommentVideo,
    GetVideoLikesAndCommentsRequest,
};
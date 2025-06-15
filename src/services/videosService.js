import catchAsync from '../utils/catchAsync.js';

const VideoCheck = catchAsync(async (req, res, next) => {
    console.log("VideoCheck fue llamado!");
    const videoClient = req.app.locals.videoClient;

    videoClient.VideoCheck({}, (err, response) => {
        if (err) return next(err);
        return res.status(200).json(response);
    });
});

const UploadVideo = catchAsync(async (req, res, next) => {
  const videoClient = req.app.locals.videoClient;

  videoClient.UploadVideo(req.body, (err, response) => {
    if (err) return next(err);
    return res.status(201).json(response);
  });
});

const GetVideoByID = catchAsync(async (req, res, next) => {
  const { uuid } = req.params;
  const videoClient = req.app.locals.videoClient;

  videoClient.GetVideoByID({ uuid: uuid }, (err, response) => {
    if (err) return next(err);
    return res.status(200).json(response);
  });
});

const UpdateVideo = catchAsync(async (req, res, next) => {
  const { uuid } = req.params;
  const { billStatus } = req.body;
  const videoClient = req.app.locals.videoClient;

  videoClient.UpdateVideo({ uuid: uuid, billStatus }, (err, response) => {
    if (err) return next(err);
    return res.status(200).json(response);
  });
});

const DeleteVideo = catchAsync(async (req, res, next) => {
  const { uuid } = req.params;
  const videoClient = req.app.locals.videoClient;

  videoClient.DeleteVideo({ uuid: uuid }, (err, response) => {
    if (err) return next(err);
    return res.status(200).json(response);
  });
});

const ListVideos = catchAsync(async (req, res, next) => {
  const videoClient = req.app.locals.videoClient;
  const { userUuid } = req.params;
  const { billStatus } = req.query;

  videoClient.ListVideos({ userUuid, billStatus }, (err, response) => {
    if (err) return next(err);
    return res.status(200).json(response);
  });
});

export default {
    VideoCheck,
    UploadVideo,
    GetVideoByID,
    UpdateVideo,
    DeleteVideo,
    ListVideos,
};

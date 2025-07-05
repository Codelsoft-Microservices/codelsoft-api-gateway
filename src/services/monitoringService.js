import catchAsync from '../utils/catchAsync.js';

const GetAllActions = catchAsync(async (req, res, next) => {
    const monitoringClient = req.app.locals.monitoringClient;

    monitoringClient.GetAllActions({}, (err, response) => {
        if (err) return next(err);
        return res.status(200).json(response);
    });
});

const GetAllErrors = catchAsync(async (req, res, next) => {
    const monitoringClient = req.app.locals.monitoringClient;

    monitoringClient.GetAllErrors({}, (err, response) => {
        if (err) return next(err);
        return res.status(200).json(response);
    });
});

export default {
    GetAllActions,
    GetAllErrors
};

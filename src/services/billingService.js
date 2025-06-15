import catchAsync from '../utils/catchAsync.js';

const RouteCheck = (req, res) => {
    res.status(200).send("OK Billing Check");
};

const CreateBill = catchAsync(async (req, res, next) => {
  const billingClient = req.app.locals.billingClient;

  billingClient.CreateBill(req.body, (err, response) => {
    if (err) return next(err);
    return res.status(201).json(response);
  });
});

const GetBillById = catchAsync(async (req, res, next) => {
  const { uuid } = req.params;
  const billingClient = req.app.locals.billingClient;

  billingClient.GetBillById({ uuid: uuid }, (err, response) => {
    if (err) return next(err);
    return res.status(200).json(response);
  });
});

const UpdateBillStatus = catchAsync(async (req, res, next) => {
  const { uuid } = req.params;
  const { billStatus } = req.body;
  const billingClient = req.app.locals.billingClient;

  billingClient.UpdateBillStatus({ uuid: uuid, billStatus }, (err, response) => {
    if (err) return next(err);
    return res.status(200).json(response);
  });
});

const DeleteBill = catchAsync(async (req, res, next) => {
  const { uuid } = req.params;
  const billingClient = req.app.locals.billingClient;

  billingClient.DeleteBill({ uuid: uuid }, (err, response) => {
    if (err) return next(err);
    return res.status(200).json(response);
  });
});

const ListBillsByUser = catchAsync(async (req, res, next) => {
  const billingClient = req.app.locals.billingClient;
  const { userUuid } = req.params;
  const { billStatus } = req.query;

  billingClient.ListBillsByUser({ userUuid, billStatus }, (err, response) => {
    if (err) return next(err);
    return res.status(200).json(response);
  });
});

export default {
    RouteCheck,
    CreateBill,
    GetBillById,
    UpdateBillStatus,
    DeleteBill,
    ListBillsByUser,
};

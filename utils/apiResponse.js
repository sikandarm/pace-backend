exports.errorResponse = (res, code, errorMessage, e = null) =>
  res.status(code).json({
    success: false,
    message: errorMessage,
    error: e?.toString()
  });
// message = 'Successful'; // if required to send meesage just pass this as arg and send in res
exports.successResponse = (res, code, data, message = 'Successful') =>
  res.status(code).json({
    success: true,
    message,
    data
  });

const jwt = require("jsonwebtoken");
const { errorResponse, successResponse } = require("../utils/apiResponse");

const verifyJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return errorResponse(res, 401, "Unauthorized");
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return errorResponse(res, 403, "Forbidden", err);
    req.user = decoded;

    next();
  });
};

module.exports = verifyJWT;

const { User, Role, DeviceToken, Permission } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { errorResponse, successResponse } = require("../utils/apiResponse");

exports.login = async (req, res) => {
  try {
    const { email, password, fcm_token } = req.body;
    if (!email || !password) {
      return errorResponse(res, 400, "All fields are required");
    }

    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Role,
          as: "roles",
          include: [{ model: Permission, as: "permissions" }],
        },
      ],
    });
    const comparePwd = await bcrypt.compare(password, user.password);
    if (!comparePwd) {
      return errorResponse(res, 401, "Invalid credentials");
    }

    if (!user || !user.isActive) {
      return errorResponse(res, 401, "User does not exist");
    }

    const roles = user.roles.map((role) => role.name); // Extract role names into an array

    const permissions = [];
    user.roles.forEach((role) => {
      role.permissions.forEach((permission) => {
        permissions.push(permission.slug); // Assuming the permission model has a 'name' attribute
      });
    });
    // Check if fcm_token is provided and it's different from the existing one (if any)
    if (fcm_token) {
      const existingDeviceToken = await DeviceToken.findOne({
        where: { userId: user.id },
      });

      if (
        !existingDeviceToken ||
        existingDeviceToken.token !== fcm_token.trim()
      ) {
        const trimmedFcmToken = fcm_token.trim();
        if (existingDeviceToken) {
          await DeviceToken.update(
            { token: trimmedFcmToken },
            { where: { userId: user.id } }
          );
        } else {
          await DeviceToken.create({ userId: user.id, token: trimmedFcmToken });
        }
      }
    }

    const tokenPayload = {
      iat: Date.now(),
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles,
      permissions, // Adding permissions to the token payload
    };

    const token = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    return successResponse(res, 200, { token }, "Login successful!");
  } catch (err) {
    return errorResponse(res, 400, "Something went wrong", err);
  }
};

exports.logout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return successResponse(res, 204, {}, "No content");

  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  return successResponse(res, 200, {}, "Logged out successfully!");
};

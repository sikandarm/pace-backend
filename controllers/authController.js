const {
  User,
  Role,
  DeviceToken,
  Permission,
  sequelize,
  UserRole,
} = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { errorResponse, successResponse } = require("../utils/apiResponse");

exports.login = async (req, res) => {
  try {
    const { email, password, fcm_token } = req.body;

    if (!email || !password) {
      return errorResponse(res, 400, "All fields are required");
    }

    // Assuming you have Sequelize models defined, replace 'DeviceToken' with your actual Sequelize model name

    // Check if fcm_token exists
    if (fcm_token) {
      try {
        // Find a record in the DeviceToken table with the given fcm_token
        const tokenCheck = await DeviceToken.findOne({
          where: {
            token: fcm_token,
          },
        });

        // Check if a record was found and it has a valid id
        if (tokenCheck && tokenCheck.id) {
          // Remove the record from the DeviceToken table based on the id
          await DeviceToken.destroy({
            where: {
              id: tokenCheck.id,
            },
          });

          console.log("DeviceToken record removed successfully.");
        } else {
          console.log("No matching DeviceToken record found.");
        }
      } catch (error) {
        console.error("Error while removing DeviceToken record:", error);
      }
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
    let comparePwd;
    if (user) {
      comparePwd = await bcrypt.compare(password, user.password);
    }
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
    return errorResponse(res, 400, "Something went wrongs", err);
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

exports.socialLogin = async (req, res) => {
  try {
    const { email, Uid, name, roleId, phone, fcm_token } = req.body;

    if (!email || !Uid) {
      return errorResponse(res, 400, "All fields are required");
    }
    // Assuming you have Sequelize models defined, replace 'DeviceToken' with your actual Sequelize model name

    // Check if fcm_token exists
    if (fcm_token) {
      try {
        // Find a record in the DeviceToken table with the given fcm_token
        const tokenCheck = await DeviceToken.findOne({
          where: {
            token: fcm_token,
          },
        });

        // Check if a record was found and it has a valid id
        if (tokenCheck && tokenCheck.id) {
          // Remove the record from the DeviceToken table based on the id
          await DeviceToken.destroy({
            where: {
              id: tokenCheck.id,
            },
          });

          console.log("DeviceToken record removed successfully.");
        } else {
          console.log("No matching DeviceToken record found.");
        }
      } catch (error) {
        console.error("Error while removing DeviceToken record:", error);
      }
    }

    const users = await User.findOne({
      where: { email },
      include: [
        {
          model: Role,
          as: "roles",
          include: [{ model: Permission, as: "permissions" }],
        },
      ],
    });

    if (users === null) {
      const usercreate = await User.create({
        firstName: name,
        lastName: name,
        email: email,
        phone: phone,
        Uid: Uid,
        password: Uid,
      });

      if (roleId) {
        await usercreate.addRole(roleId);
      }
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

    const compareUid = Uid;
    if (compareUid != user.Uid) {
      return errorResponse(res, 401, "Invalid credentials");
    }

    if (!user || !user.isActive) {
      return errorResponse(res, 401, "User was Created but is not Active Yet!");
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

exports.checkuserrole = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findAll({
      where: {
        email: email,
      },
    });
    if (user.length > 0) {
      const role = await UserRole.findAll({
        where: {
          userId: user[0]?.id,
        },
      });
      if (role.length > 0) {
        return successResponse(res, 200, true, "User Exist in Role");
      } else {
        return successResponse(res, 200, false, "User Not Exist any Role");
      }
    } else {
      return successResponse(res, 200, false, "User Not Found");
    }
  } catch (error) {
    return errorResponse(res, 400, "Something went wrong", error);
  }
};

exports.checkuserphone = async (req, res) => {
  try {
    const email = req.params.email;
    const users = await User.findAll({
      where: {
        email: email,
      },
    });

    if (users.length > 0) {
      const user = users[0];
      const checkphone = await User.findAll({
        where: {
          email: user.email,
          phone: user.phone,
        },
        attributes: ["phone"],
      });

      if (checkphone[0]?.phone != "") {
        return successResponse(
          res,
          200,
          checkphone[0].phone,
          "User Phone Exist"
        );
      } else {
        return successResponse(res, 200, false, "User Phone Not Exist");
      }
    } else {
      return successResponse(res, 200, null, "User Phone Not Exist");
    }
  } catch (error) {
    return errorResponse(res, 400, "Something went wrong", error);
  }
};

exports.checkfbData = async (req, res) => {
  try {
    const Uid = req.params.Uid;
    const users = await User.findAll({
      where: {
        Uid: Uid,
      },
    });

    if (users.length > 0) {
      const user = users[0];
      const checkphone = await User.findAll({
        where: {
          email: user.email,
          phone: user.phone,
        },
        attributes: ["phone", "email"],
      });
      const role = await UserRole.findAll({
        where: {
          userId: user.id,
        },
      });

      if (checkphone[0]?.phone != "" && role.length > 0) {
        const data = {
          fbdata: checkphone[0],
          assignrole: true,
        };
        return successResponse(res, 200, data, "User Data Exist");
      } else {
        const data = {
          fbdata: {
            phone: null,
            email: null,
          },
          assignrole: false,
        };
        return successResponse(res, 200, data, "User Data Not Exist");
      }
    } else {
      const data = {
        fbdata: {
          phone: null,
          email: null,
        },
        assignrole: false,
      };
      return successResponse(res, 200, data, "User Data Not Exist");
    }
  } catch (error) {
    return errorResponse(res, 400, "Something went wrong", error);
  }
};

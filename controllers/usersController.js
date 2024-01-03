const { User, sequelize, Role, Permission } = require("../models");
const bcrypt = require("bcrypt");
const { errorResponse, successResponse } = require("../utils/apiResponse");
const QueryHelper = require("../utils/queryHelper");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const filterSortPaginate = require("../utils/queryUtil");

exports.createUser = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      address,
      city,
      state,
      zip,
      isActive,
      ratePerHour,
      roleId,
    } = req.body;

    const duplicate = await User.findOne({ where: { email } });

    if (duplicate) {
      return errorResponse(res, 409, "Email already exist");
    }

    const hashPwd = await bcrypt.hash(password, 10); //salt rounds

    const user = await User.create(
      {
        firstName,
        lastName,
        email,
        password: hashPwd,
        phone,
        address,
        city,
        state,
        zip,
        isActive,
        ratePerHour,
      },
      { transaction }
    );

    if (roleId) {
      await user.addRole(roleId, { transaction });
    }

    await transaction.commit();

    return successResponse(res, 201, { user }, "User created successfully!");
  } catch (err) {
    await transaction.rollback();
    return errorResponse(res, 400, "Something went wrong!", err);
  }
};

exports.updateUser = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const id = req.params.id;

    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zip,
      isActive,
      ratePerHour,
      roleId,
    } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return errorResponse(res, 409, "User not found.");
    }

    const updatedUser = await user.update(
      {
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        state,
        zip,
        isActive,
        ratePerHour,
      },
      { transaction }
    );

    if (updatedUser) {
      if (roleId) {
        await user.setRoles(roleId, { transaction });
      }
      await transaction.commit();
      return successResponse(
        res,
        201,
        { updatedUser },
        "User updated successfully!"
      );
    }

    await transaction.rollback();
    return errorResponse(res, 400, "Update Failed!");
  } catch (err) {
    await transaction.rollback();
    return errorResponse(res, 400, "Something went wrong!", err);
  }
};

exports.getAllUsers = async (req, res) => {
  const include = [
    {
      model: Role,
      as: "roles",
      attributes: ["id", "name"],
      through: {
        attributes: [],
      },
    },
  ];
  try {
    const users = await filterSortPaginate(
      User,
      req.query,
      (includePagination = false),
      include
    );

    if (!users || users.length === 0 || users.count === 0) {
      return successResponse(
        res,
        200,
        { users: { data: [] } },
        "No users found"
      );
    }

    return successResponse(res, 200, { users });
  } catch (err) {
    console.log(err);
    return errorResponse(res, 500, "Something went wrong!", err);
  }
};

exports.getUser = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await User.findByPk(id, {
      include: {
        model: Role,
        as: "roles",
        through: {
          attributes: [],
        },
        include: {
          model: Permission,
          as: "permissions",
          through: {
            attributes: [],
          },
          attributes: ["id", "name", "slug"],
        },
      },
    });

    if (!user) {
      return successResponse(res, 200, {}, "No user found");
    }

    const userObj = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      city: user.city,
      state: user.state,
      zip: user.zip,
      isActive: user.isActive,
      ratePerHour: user.ratePerHour,
      roles: user.roles.map((role) => ({
        id: role.id,
        name: role.name,
      })),
      permissions: user.roles.flatMap((role) => role.permissions),
    };

    return successResponse(res, 200, { user: userObj }, "Successful");
  } catch (err) {
    return errorResponse(res, 400, "Something went wrong!", err);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await User.findByPk(id);

    if (!user) {
      return successResponse(res, 200, {}, "No user found");
    }

    const isDeleted = await user.destroy({ force: true });
    if (isDeleted) {
      return successResponse(res, 200, {}, "Deleted successfully");
    }
  } catch (err) {
    return errorResponse(res, 400, "Something went wrong!", err);
  }
};

exports.userSignup = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { firstName, lastName, email, password, phone, ratePerHour, roleId } =
      req.body;
    if (req.isAuthenticated()) {
      // If req.isAuthenticated() is true, it means the user is authenticated via Facebook
      // You can handle additional logic for Facebook signup if needed
      // ...

      // You might want to redirect or respond appropriately for Facebook signup
      return successResponse(
        res,
        200,
        { user: req.user },
        "Facebook Signup successful!"
      );
    }
    const duplicate = await User.findOne({ where: { email } });

    if (duplicate) {
      return errorResponse(res, 409, "Email already exist");
    }

    const hashPwd = await bcrypt.hash(password, 10); //salt rounds

    const user = await User.create(
      {
        firstName,
        lastName,
        email,
        password: hashPwd,
        phone,
        isActive: false,
        ratePerHour,
      },
      { transaction }
    );

    if (roleId) {
      await user.addRole(roleId, { transaction });
    }

    await transaction.commit();

    return successResponse(res, 201, { user }, "Signup successful!");
  } catch (err) {
    await transaction.rollback();
    return errorResponse(res, 400, "Something went wrong!", err);
  }
};

exports.forgetPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return errorResponse(res, 404, "User not found");
  }

  const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetToken = resetToken;

  await user.save();

  const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE || "gmail",
    auth: {
      user: process.env.SMTP_MAIL || "pacep8633@gmail.com",
      pass: process.env.SMTP_PASS || "zexyoyycvhpdnhea",
    },
  });
  const mailOptions = {
    from: process.env.SMTP_MAIL || "pacep8633@gmail.com",
    to: email,
    subject: "Password Reset",
    text: `Your OTP for password reset: ${resetToken}`,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to send OTP" });
    }

    return res
      .status(200)
      .json({ success: true, message: "OTP sent successfully!" });
  });
};

exports.verifyOTP = async (req, res) => {
  const { otp } = req.body;

  const user = await User.findOne({ where: { resetToken: otp } });
  if (!user) {
    return errorResponse(res, 404, "Invalid OTP");
  }

  user.resetToken = null;
  return res.status(200).json({ success: true, message: "OTP Verified" });
};

exports.resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return errorResponse(res, 404, "User not found");
    }

    const hashPwd = await bcrypt.hash(password, 10);
    user.password = hashPwd;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while reseting the password",
    });
  }
};

exports.facebookLogin = async (req, res) => {
  try {
    const { email, Uid, name, fcm_token } = req.body;

    if (!email || !Uid) {
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

    if (!user) {
      const usercreate = await User.create({
        firstName: name,
        lastName: name,
        email: email,
        Uid: Uid,
        password: Uid,
      });
      if (usercreate) {
        return successResponse(res, 200, "User Created successful!");
      }
    }

    const comparefbid = Uid;
    if (comparefbid != user.Uid) {
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

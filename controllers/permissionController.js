const { Permission } = require('../models');

const {
  successResponse,
  errorResponse,
} = require('../utils/apiResponse');
const { createSlug } = require('../utils/helperFunctions');

exports.getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    if (!permissions?.length) {
      return successResponse(
        res,
        200,
        { permissions: [] },
        "No permissions found"
      );
    }
    return successResponse(res, 200, { permissions });
  } catch (err) {
    return errorResponse(res, 400, "Something went wrong", err);
  }
};

exports.getPermission = async (req, res) => {
  try {
    const id = req.params.id;

    const permission = await Permission.findByPk(id, {
      where: { isActive: true },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    if (!permission) {
      return successResponse(
        res,
        200,
        { permission: {} },
        "No permission found"
      );
    }

    return successResponse(res, 200, { permission });
  } catch (err) {
    return errorResponse(res, 400, "Something went wrong!", err);
  }
};

exports.createPermission = async (req, res) => {
  try {
    let { name, isActive } = req.body;
    name = name.trim();
    const duplicate = await Permission.findOne({
      where: { name },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    if (duplicate) {
      return errorResponse(
        res,
        409,
        `Permission already exist with this name : ${name} `
      );
    }
    const permission = await Permission.create({
      name,
      slug: createSlug(name),
      isActive,
    });

    return successResponse(
      res,
      201,
      { permission },
      "Permission added successfully"
    );
  } catch (err) {
    return errorResponse(res, 400, "Something went wrong", err);
  }
};

exports.updatePermission = async (req, res) => {
  try {
    const id = req.params.id;

    const permission = await Permission.findOne({
      where: { id },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    if (!permission) {
      return errorResponse(res, 404, "No permission found");
    }
    let { name, isActive } = req.body;
    name = name.trim();
    const updatedPermission = await permission.update({
      name,
      isActive,
    });

    return successResponse(
      res,
      201,
      { updatedPermission },
      "Updated successfully!"
    );
  } catch (err) {
    return errorResponse(res, 400, "Something went wrong", err);
  }
};

exports.deletePermission = async (req, res) => {
  try {
    const id = req.params.id;
    const permission = await Permission.findOne({ where: { id } });

    if (!permission) {
      return errorResponse(res, 404, 'Permission does not exist');
    }

    const isDeleted = await permission.destroy();
    if (isDeleted) {
      return successResponse(res, 200, {}, 'Deleted successfully');
    }
  } catch (err) {
    return errorResponse(res, 400, 'Something went wrong', err);
  }
};
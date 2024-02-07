const fs = require("fs");
const path = require("path");

const { Role, Permission, sequelize } = require("../models");
const { errorResponse, successResponse } = require("../utils/apiResponse");

exports.createRole = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    let { name, permissions, isNotification } = req.body;
    name = name.trim();

    const existingRole = await Role.findOne({
      where: { name },
      attributes: ["id"],
      raw: true,
    });

    if (existingRole) {
      return errorResponse(
        res,
        409,
        `Role already exist with this name : ${name} `
      );
    }
    const role = await Role.create(
      {
        name,
        isNotification,
      },
      { transaction }
    );
    // Check if the role should be added to the targetRoles configuration
    if (isNotification) {
      const targetRolesFilePath = path.join(
        __dirname,
        "../config/targetRoles.json"
      );
      try {
        let targetRoles = [];
        if (fs.existsSync(targetRolesFilePath)) {
          // If the file exists, read its contents
          const targetRolesData = fs.readFileSync(targetRolesFilePath, "utf8");
          targetRoles = JSON.parse(targetRolesData);
        }

        // Check if the role name is already present in the targetRoles array
        if (!targetRoles.includes(name)) {
          // Add the role name to the targetRoles array
          targetRoles.push(name);

          // Save the updated targetRoles back to the file
          fs.writeFileSync(
            targetRolesFilePath,
            JSON.stringify(targetRoles),
            "utf8"
          );
        }
      } catch (err) {
        console.error("Error while updating targetRoles file:", err);
      }
    }

    if (permissions.length > 0) {
      await role.setPermissions(permissions, { transaction });
    }

    await transaction.commit();
    return successResponse(res, 201, { role }, "Role added successfully");
  } catch (err) {
    await transaction.rollback();
    return errorResponse(res, 400, "Something went wrong", err);
  }
};

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: {
        model: Permission,
        as: "permissions",
        attributes: ["id", "name"],
        through: {
          attributes: [],
        },
      },
    });
    if (!roles?.length) {
      return successResponse(res, 200, { roles: [] }, "No roles found");
    }
    return successResponse(res, 200, { roles });
  } catch (err) {
    console.log(err);
    return errorResponse(res, 400, "Something went wrong", err);
  }
};

exports.getRole = async (req, res) => {
  try {
    const id = req.params.id;

    const role = await Role.findByPk(id, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: {
        model: Permission,
        as: "permissions",
        attributes: ["id", "name"],
        through: {
          attributes: [],
        },
      },
    });

    if (!role) {
      return successResponse(res, 200, { role: {} }, "No role found");
    }

    return successResponse(res, 200, { role });
  } catch (err) {
    return errorResponse(res, 400, "Something went wrong!", err);
  }
};

exports.updateRole = async (req, res) => {
  // const transaction = await sequelize.transaction();
  try {
    const id = req.params.id;

    const role = await Role.findOne({
      where: { id },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: {
        model: Permission,
        as: "permissions",
        attributes: ["id", "name"],
        through: {
          attributes: [],
        },
      },
    });

    if (!role) {
      return errorResponse(res, 404, "No roles found");
    }
    let { name, permissions, isNotification } = req.body;
    name = name.trim();
    const targetRolesFilePath = path.join(
      __dirname,
      "../config/targetRoles.json"
    );
    let targetRoles = [];
    try {
      if (fs.existsSync(targetRolesFilePath)) {
        const targetRolesData = fs.readFileSync(targetRolesFilePath, "utf8");
        targetRoles = JSON.parse(targetRolesData);
      }
    } catch (err) {
      console.error("Error while reading targetRoles file:", err);
    }

    // Check if the role is updated with isNotification set to false and remove from file if needed
    if (role.isNotification && !isNotification) {
      targetRoles = targetRoles.filter((roleName) => roleName !== role.name);
    }

    // Check if the role is updated with isNotification set to true and add to file if needed
    if (!role.isNotification && isNotification) {
      if (!targetRoles.includes(role.name)) {
        targetRoles.push(role.name);
      }
    }

    try {
      fs.writeFileSync(
        targetRolesFilePath,
        JSON.stringify(targetRoles),
        "utf8"
      );
    } catch (err) {
      console.error("Error while updating targetRoles file:", err);
    }
    const updatedRole = await role.update(
      {
        name,
        isNotification,
      }
      // ,
      // { transaction }
    );

    if (updatedRole) {
      if (permissions.length > 0) {
        await updatedRole.setPermissions(permissions);
      } else {
        // Remove all permissions associated with the role
        await updatedRole.setPermissions([]);
      }

      // await transaction.commit();

      const updatedPermissions = await Permission.findAll({
        where: { id: permissions },
        attributes: ["id", "name"],
      });

      const response = {
        id: updatedRole.id,
        name: updatedRole.name,
        permissions: updatedPermissions,
        isNotification: updatedRole.isNotification,
      };
      return successResponse(
        res,
        201,
        { updatedRole: response },
        "Role updated successfully!"
      );
    }

    // await transaction.rollback();
    return errorResponse(res, 400, "Update Failed!");
  } catch (err) {
    return errorResponse(res, 400, "Something went wrong", err);
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const id = req.params.id;
    const role = await Role.findOne({ where: { id } });

    if (!role) {
      return errorResponse(res, 404, "Role does not exist");
    }

    const isDeleted = await role.destroy();
    if (isDeleted) {
      return successResponse(res, 200, {}, "Deleted successfully");
    }
  } catch (err) {
    return errorResponse(res, 400, "Something went wrong", err);
  }
};

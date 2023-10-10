const { Permission, Role, RoutePermission, User } = require('../models');

const { errorResponse } = require('../utils/apiResponse');

module.exports = async (req, res, next) => {
  let path = req.path;
  for (let param of Object.keys(req.params)) {
    path = path.replace(req.params[param], '');
  }
  path = path.slice(-1) === '/' ? path.slice(0, -1) : path;

  const route = req.baseUrl + path;
  const operation = req.method.toLowerCase();

  const routePermission = await RoutePermission.findOne({
    where: {
      route,
      operation,
    },
  });

  if (!routePermission) {
    return errorResponse(res, 403, 'You are not authorize to access this');
  }

  const user = await User.findOne({
    attributes: ['id', 'nic'],
    where: { nic: req.user },
    include: [
      {
        attributes: ['id', 'name'],
        model: Role,
        as: 'roles',
        include: [
          {
            attributes: ['id', 'name'],
            model: Permission,
            as: 'permissions',
            //     attributes: {
            //   exclude: ['permission_id', 'permissionId'],
            // },
          },
        ],
      },
    ],
  });

  const roles = user.roles.map((role) => role);
  const hasPermission = roles.find((role) =>
    role.permissions.find((p) => p.id === routePermission.permissionId)
  );

  if (!hasPermission) {
    return errorResponse(res, 403, 'You are not authorize to access this');
  }

  next();
};

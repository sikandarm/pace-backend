const userRouter = require("./usersRoutes");
const authRouter = require("./authRoutes");
const roleRouter = require("./roleRoutes");
const permissionRouter = require("./permissionRoutes");
const inventoryRouter = require("./inventoryRoutes");
const jobRouter = require("./jobRoutes");
const contactRouter = require("./contactRoutes");
const taskRouter = require("./taskRoutes");
const rejectedReasonRouter = require("./rejectedReasonRoutes");
const caReportRouter = require("./caReportRoutes");
const notificationrouter = require("./notificationRoutes");

exports.apiRoutes = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/role", roleRouter);
  app.use("/api/permission", permissionRouter);
  app.use("/api/inventory", inventoryRouter);
  app.use("/api/job", jobRouter);
  app.use("/api/contact", contactRouter);
  app.use("/api/task", taskRouter);
  app.use("/api/rejected-reasons", rejectedReasonRouter);
  app.use("/api/CA-report", caReportRouter);
  app.use("/api/notifications", notificationrouter);
};

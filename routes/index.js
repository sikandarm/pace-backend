const rejectedReasonRouter = require("./rejectedReasonRoutes");
const purchaseOrderRoutes = require("./purchaseOrderRoutes");
const notificationrouter = require("./notificationRoutes");
const permissionRouter = require("./permissionRoutes");
const inventoryRouter = require("./inventoryRoutes");
const caReportRouter = require("./caReportRoutes");
const contactRouter = require("./contactRoutes");
const userRouter = require("./usersRoutes");
const authRouter = require("./authRoutes");
const taskRouter = require("./taskRoutes");
const roleRouter = require("./roleRoutes");
const jobRouter = require("./jobRoutes");

exports.apiRoutes = (app) => {
  app.use("/api/rejected-reasons", rejectedReasonRouter);
  app.use("/api/purchaseOrder", purchaseOrderRoutes);
  app.use("/api/notifications", notificationrouter);
  app.use("/api/permission", permissionRouter);
  app.use("/api/inventory", inventoryRouter);
  app.use("/api/CA-report", caReportRouter);
  app.use("/api/contact", contactRouter);
  app.use("/api/task", taskRouter);
  app.use("/api/user", userRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/role", roleRouter);
  app.use("/api/job", jobRouter);
};

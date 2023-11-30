const rejectedReasonRouter = require("./rejectedReasonRoutes");
const purchaseOrderRoutes = require("./purchaseOrderRoutes");
const notificationrouter = require("./notificationRoutes");
const purchaseOrderItems = require("./purchaseOrderItemRoute");
const permissionRouter = require("./permissionRoutes");
const inventoryRouter = require("./inventoryRoutes");
const caReportRouter = require("./caReportRoutes");
const companyRouter = require("./companiesRoutes");
const contactRouter = require("./contactRoutes");
const userRouter = require("./usersRoutes");
const vendorRouter = require("./vendorRouter");
const authRouter = require("./authRoutes");
const taskRouter = require("./taskRoutes");
const roleRouter = require("./roleRoutes");
const jobRouter = require("./jobRoutes");
const sequenceRouter = require("./sequenceRoutes");
const sequencetaskRouter = require("./sequencetaskRoute");

exports.apiRoutes = (app) => {
  app.use("/api/rejected-reasons", rejectedReasonRouter);
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
  app.use("/api/purchaseorderitem", purchaseOrderItems);
  app.use("/api/purchaseorder", purchaseOrderRoutes);
  app.use("/api/vendor", vendorRouter);
  app.use("/api/company", companyRouter);
  app.use("/api/sequences", sequenceRouter);
  app.use("/api/sequencestask", sequencetaskRouter);

};

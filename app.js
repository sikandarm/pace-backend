require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const expressFileUpload = require("express-fileupload");
const corsOptions = require("./config/corsOptions");
const { sequelize } = require("./models");
const { apiRoutes } = require("./routes");

const app = express();

const PORT = process.env.PORT || 3500;

//Middlewares
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(expressFileUpload());
app.use("/uploads", express.static("./uploads"));
app.use("/uploads", express.static("./uploads/task_images"));

// Routes
apiRoutes(app);

const connectDb = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database Connected!");
  } catch (err) {
    console.log("Database connection failed", err);
    process.exit(1);
  }
};

(async () => {
  await connectDb();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();

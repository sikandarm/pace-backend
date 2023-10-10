const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost",
  "http://206.81.5.26",
  "https://206.81.5.26",
  "http://192.168.18.239:3000",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not Allowed"));
    }
  },
  credentials: true,
  optionSuccessStatus: 200,
};

module.exports = corsOptions;

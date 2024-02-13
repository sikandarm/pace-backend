const path = require("path");
const uuid = require("uuid");
const fs = require("fs");
const { sendErrorResponse } = require("../utils/sendResponse");
class FileUpload {
  constructor(req) {
    this.req = req;
    this.files = {};
  }

  async upload() {
    const req = this.req;
    try {
      const filesPaths = {};
      const files = req.files;
      if (files) {
        for (let fileKey of Object.keys(files)) {
          const file = files[fileKey];
          const fileExtName = path.extname(file.name);
          const fileName = uuid.v1() + fileExtName;
          const filePath = path.resolve(__dirname, "../uploads", fileName);
          filesPaths[fileKey] = fileName;
          await file.mv(filePath);
        }
      }

      this.files = filesPaths;
      return this.files;
    } catch (err) {
      return sendErrorResponse(res, 500, "Something went wrong..", err);
    }
  }

  rollback() {
    for (let fileKey of Object.keys(this.files)) {
      fs.rmSync(path.resolve(__dirname, "../uploads", this.files[fileKey]));
    }
  }
}

module.exports = {
  FileUpload,
};

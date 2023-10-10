const { validationResult } = require("express-validator");

const validate = (validators) => {
  return async (req, res, next) => {
    await Promise.all(validators.map((validator) => validator.run(req)));
    const errors = validationResult(req).array();
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors[0].param + " " + errors[0].msg,
      });
    }
    return next();
  };
};

module.exports = validate;

const { isValid, format } = require("date-fns");

function parseDate(dateString) {
  // Parse the date

  let date = new Date(dateString);
  // Check if the date is valid or not
  if (isValid(date)) {
    // Format the date in the required format for Sequelize
    return format(date, "yyyy-MM-dd HH:mm:ss");
  } else {
    // If the date is invalid, return null
    return null;
  }
}

module.exports = parseDate;

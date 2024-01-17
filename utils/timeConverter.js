exports.formatTime = (totaltime) => {
  const seconds = Math.floor(totaltime / 1000);
  const minutes = seconds / 60;
  const hours = minutes / 60;

  const formattedHours = Math.floor(hours);
  const formattedMinutes = minutes % 60;

  return `${formattedHours} hours, ${formattedMinutes.toFixed(1)} minutes`;
};

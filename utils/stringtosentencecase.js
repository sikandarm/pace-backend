 exports.toSentenceCase = (str) => {
  if (!str) return ''; // handle empty or undefined input
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
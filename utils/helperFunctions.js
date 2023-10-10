exports.createSlug = (str) => {
  return str.trim().replaceAll(" ", '_').toLowerCase();
}
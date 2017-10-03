export default (value, length) => {
  length = parseInt(length)
  if (value === undefined || value === null) {
    return false;
  }
  return String(value).length >= length;
};

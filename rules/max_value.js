export default (value, max) => {
  max = parseInt(max)
  if (Array.isArray(value) || value === null || value === undefined || value === '') {
    return false;
  }

  return Number(value) <= max;
};

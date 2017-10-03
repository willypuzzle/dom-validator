export default (value) => {
  if (Array.isArray(value)) {
    return !! value.length;
  }

  if (value === undefined || value === null || value === false) {
    return false;
  }

  if(value === true){
    return true;
  }

  return !! String(value).trim().length;
};

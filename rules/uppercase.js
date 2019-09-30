export default (value) => {
  if(!value){
    return true
  }
  return value === value.toUpperCase()
};

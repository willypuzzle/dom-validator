export default (value, param) => {
  var length = param || 8;

  value = String(value)

  if(value.length < length){
    return false;
  }

  if(!/[A-Z]/.test(value)){
    return false;
  }

  if( !(/[0-9]/.test(value) || /[\@\#\!\&\+\_\-]/.test(value)) ){
    return false;
  }

  return true;
};

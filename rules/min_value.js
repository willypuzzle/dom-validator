import {parseFloatLocale} from '../utilities/number'

export default (value, min, scope, otherComponentsInScope, validator, fieldName, locale) => {
  min = parseInt(min)
  if (Array.isArray(value) || value === null || value === undefined || value === '') {
    return false;
  }



  return Number(parseFloatLocale(value, locale)) >= min;
};

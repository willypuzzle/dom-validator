import {parseFloatLocale} from '../utilities/number'

export default (value, max, scope, otherComponentsInScope, validator, fieldName, locale) => {
  max = parseInt(max)
  if (Array.isArray(value) || value === null || value === undefined || value === '') {
    return false;
  }

  return Number(parseFloatLocale(value, locale)) <= max;
};

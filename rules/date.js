import isDate from 'validator/lib/isDate';
import {parseDateIntoString} from '../utilities/date'
let moment = require('moment');

let check = (value, params, scope, otherComponentsInScope, obj, fieldName, locale) => {
    if(params && !Array.isArray(params)){
        params = [params]
    }

    let date = parseDateIntoString(value, params, locale);
    if(date === false){
        return false;
    }

    let itIsDate = isDate(date)

    if(params && params.length < 2){
        return itIsDate
    }

    if(params.length < 3){
        throw "Dom-validator: date rule require more parameters in this case";
    }

    if(!itIsDate){
        return false;
    }

    let operator = params[1];
    let delta = params[2];

    return dateCheck(date, operator, delta);

};

let dateCheck = (date, operator, delta) => {
    date = moment(date).format('YYYY-MM-DD');;
    let second = null
    if(delta === 'now'){
        second = moment().format('YYYY-MM-DD')
    }else {
        second = buildSecond(delta)
    }


    switch (operator){
        case '>':
            return date > second;
        case '<':
            return date < second;
        case '>=':
            return date >= second;
        case '<=':
            return date <= second;
        case '=':
            return date = second;
        default:
            throw 'Dom-validator: date rule, invalid operator \'' + operator + '\''
    }
}

let buildSecond = (deltax) => {
    let delta = deltax.split('-');
    if(delta.length !== 3){
        throw `Dom-validator: date rule invalid delta '${deltax}', it has to be in the format 'rule-value-unit' for example 'before-20-years' or 'now'`
    }
    let rule = delta[0];
    let value = delta[1];
    let unit = delta[2];

    switch (rule){
        case 'before':
            return moment().subtract(parseInt(value), unit).format('YYYY-MM-DD');
        case 'after':
            return moment().add(parseInt(value), unit).format('YYYY-MM-DD');
        default:
            throw `Dom-validator: date rule invalid delta '${deltax}', first segment has to be 'before' or after`

    }
}

export default check;

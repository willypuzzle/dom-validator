import isDate from 'validator/lib/isDate';
import {parseDateIntoString} from '../utilities/date'
let moment = require('moment');
let Holidays = require('date-holidays')

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
    let option = params[3] || null;

    return dateCheck(date, operator, delta, option, params, locale, otherComponentsInScope);

};

let dateCheck = (date, operator, delta, option, params, locale, otherComponentsInScope) => {
    let operatorArray = operator.split('-')
    let op = operatorArray[0];
    let field = null;
    if(operatorArray.length > 1){
        field = operatorArray[1];
    }

    let dateRegex = /^(\d{4}\-\d{2}\-\d{2})$/g;
    let dateMatch = dateRegex.exec(delta);
    date = moment(date).format('YYYY-MM-DD');;
    let second = null
    if(delta === 'now'){
        second = moment().format('YYYY-MM-DD')
    }else if(dateMatch){//date
        let date = dateMatch[1];
        second = moment(date).format('YYYY-MM-DD')
    }else{
        second = buildSecond(params, locale, delta, field, otherComponentsInScope)
    }

    if(!second){
        return false;
    }

    if(second === true){
        return true;
    }

    let optionCheckValue = optionCheck(option, date);

    if(!optionCheckValue){
        return false;
    }

    switch (op){
        case '>':
            return date > second;
        case '<':
            return date < second;
        case '>=':
            return date >= second;
        case '<=':
            return date <= second;
        case '=':
            return date === second;
        default:
            throw 'Dom-validator: date rule, invalid operator \'' + operator + '\''
    }
}

let buildSecond = (params, locale, deltax, field, otherComponentsInScope) => {
    let delta = deltax.split('-');
    if(delta.length !== 3 && delta.length === 1 && delta[0] !== 'it'){
        throw `Dom-validator: date rule invalid delta '${deltax}', it has to be in the format 'rule-value-unit' for example 'before-20-years', 'now' or 'it'`
    }
    let rule = delta[0];
    let value = delta[1] || null;
    let unit = delta[2] || null;

    let referringTime = buildReferringTime(params, locale, field, otherComponentsInScope)
    if(!referringTime){
        return false;
    }

    if(referringTime === true){
        return true;
    }

    switch (rule){
        case 'before':
            return moment(referringTime).subtract(parseInt(value), unit).format('YYYY-MM-DD');
        case 'after':
            return moment(referringTime).add(parseInt(value), unit).format('YYYY-MM-DD');
        case 'it':
            return moment(referringTime).format('YYYY-MM-DD');
        default:
            throw `Dom-validator: date rule invalid delta '${deltax}', first segment has to be 'before' or after`

    }
}

let buildReferringTime = (params, locale, field, otherComponentsInScope) => {
    if(!field){
        return moment().format('YYYY-MM-DD')
    }

    for(let index in otherComponentsInScope){
        if(index === field){
            let val = otherComponentsInScope[index].component.inputValue || otherComponentsInScope[index].component.lazyValue;
            if(!val){
                return true;
            }
            val = parseDateIntoString(val, params, locale);
            if(val){
                return moment(val).format('YYYY-MM-DD')
            }else{
                return false;
            }
        }
    }

    throw `Dom-validator: date rule: field '${field}' does not exist`
}

let optionCheck = (option, date) => {
    if(!option){
        return true;
    }
    let options = String(option).split('_');

    date = moment(date);

    let opt = options[0];
    let par1 = options[1] || null;

    let myRegexp = /\((.*?)\)$/g;
    let match = myRegexp.exec(opt);
    let par2 = null;
    if(match && match.length > 1){
        par2 = match[1];
        opt = opt.replace(`(${par2})`, '');
    }


    if(opt === 'working'){
        if(!par2){
            par2 = 'IT'
        }
        let hd = new Holidays(par2)
        if(par1 === 'with-sat'){
            return date.day() !== 0 && !hd.isHoliday(new Date(date.format('YYYY-MM-DD')));
        }

        return date.day() !== 6 && date.day() !== 0 && !hd.isHoliday(new Date(date.format('YYYY-MM-DD')));
    }

    return false
}

export default check;

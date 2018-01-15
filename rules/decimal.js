export default (value,params,scope, otherComponentsInScope, validator, fieldName, locale) => {
    let decimal = params ? params : '*';
    let regex = '';
    switch (locale){
        case 'it':
            if(decimal === '*'){
                regex = `(?:^\\d{1,3}(?:\\.?\\d{3})*(?:,\\d+)?$)`
            }else{
                regex = `(?:^\\d{1,3}(?:\\.?\\d{3})*(?:,\\d{${decimal}})?$)`
            }
        break;
        default:
            return !!parseFloat(String(value))
    }



    let r = new RegExp(regex)

    return r.test(value)
};
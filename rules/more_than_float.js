let transformFunction = (val) => {
    let c = val.replace(',', '.')
    c = parseFloat(c);
    return isNaN(c) ? 0 : c;
}

export default (value, params, scope, otherComponentsInScope, ownValidator, fieldName) => {
    // value = String(value);
    //
    //     for(let index in otherComponentsInScope){
    //         if(index === params){
    //             let val = otherComponentsInScope[index].component.inputValue || otherComponentsInScope[index].component.lazyValue;
    //             return transformFunction(val) < transformFunction(value);
    //         }
    //     }
    //
    // return false;

    value = String(value);

    let lockStringKey = 'moreThanLocked' + params[1];


    if(!ownValidator[lockStringKey]){
        ownValidator[lockStringKey] = true;
        for(let index in otherComponentsInScope){
            if(index === params[0]){
                if(_.indexOf(params, 'referenced') !== -1) {
                    ownValidator.validate(index, scope).then(() => {
                        setTimeout(() => {
                            ownValidator[lockStringKey] = false
                        })
                    })
                }else{
                    ownValidator[lockStringKey] = false;
                }
                let val = otherComponentsInScope[index].component.inputValue || otherComponentsInScope[index].component.lazyValue;
                ownValidator.moreThanValue = transformFunction(val) < transformFunction(value);
                return ownValidator.moreThanValue
            }
        }
        return false;
    }else{
        setTimeout(() => {
            ownValidator[lockStringKey] = false;
        })
        return ownValidator.moreThanValue
    }
};
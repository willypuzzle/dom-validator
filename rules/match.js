export default (value, params, scope, otherComponentsInScope, ownValidator, fieldName) => {
    value = String(value);

    let lockStringKey = 'matchLocked' + params[1];

    if(!ownValidator[lockStringKey]){
        ownValidator[lockStringKey] = true;
        for(let index in otherComponentsInScope){
            if(index === params[0]){
                if(_.indexOf(params, 'referenced') !== -1) {
                    ownValidator.validate(index, scope)
                }else{
                    ownValidator[lockStringKey] = false;
                }
                ownValidator.matchValue = otherComponentsInScope[index].component.value === value;
                return ownValidator.matchValue
            }
        }
        return false;
    }else{
        setTimeout(() => {
            ownValidator[lockStringKey] = false;
        })
        return ownValidator.matchValue
    }

};

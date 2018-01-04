let parseDateIntoString = (value, params, locale) => {
    value = String(value)
    let type = locale;
    if(params){
        type = params[0]
        if(type === 'null' || type === 'locale'){
            type = locale;
        }
    }
    let day = null;
    let month = null;
    let year = null;
    let regex = null;
    let match = null;

    switch (type){
        case 'it':
            regex = /^(\d{2})(?:\/|\-)(\d{2})(?:\/|\-)(\d{4})$/g;
            match = regex.exec(value)
            if(match){
                day = match[1];
                month = match[2];
                year = match[3];
            }
            break;
        case 'en':
            regex = /^(\d{4})(?:\/|\-)(\d{2})(?:\/|\-)(\d{2})$/g;
            match = regex.exec(value)
            if(match){
                day = match[3];
                month = match[2];
                year = match[1];
            }
            break;
        default:
            regex = /^(\d{2})(?:\/|\-)(\d{2})(?:\/|\-)(\d{4})$/g;
            match = regex.exec(value)
            if(match){
                day = match[1];
                month = match[2];
                year = match[3];
            }
    }

    if(day === null || month === null || year === null){
        return false;
    }

    return `${year}-${month}-${day}`;
}

export {
    parseDateIntoString
}
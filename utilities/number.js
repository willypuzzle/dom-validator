let parseFloatLocale = (value, locale) => {
    switch (locale){
        case 'it':
            value = String(value).replace(/\./g,'').replace(',','.')
            break;
        default:
            value = String(value).replace(/,/g,'').replace(',','');
    }

    return parseFloat(value);
}

export {
    parseFloatLocale
}
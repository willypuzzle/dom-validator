let parseFloatLocale = (value, locale) => {
    switch (locale){
        case 'it':
            value = String(value).replace('.','').replace(',','.')
            break;
        default:
            value = String(value).replace(',','');
    }

    return parseFloat(value);
}

export {
    parseFloatLocale
}
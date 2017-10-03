export default (value,params) => {
    let decimal = params ? params : '*';
    let regex = '';
    if(decimal === '*'){
        regex = `(?:^\\d{1,3}(?:\\.?\\d{3})*(?:,\\d+)?$)`
    }else{
        regex = `(?:^\\d{1,3}(?:\\.?\\d{3})*(?:,\\d{${decimal}})?$)`
    }


    let r = new RegExp(regex)

    return r.test(value)
};
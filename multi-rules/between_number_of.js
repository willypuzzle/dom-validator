export default (value, params) => {
    let min = params[0];
    let max = params[1];

    return value.length >= parseInt(min) && value.length <= parseInt(max);
};
export default (value, params) => {
    let min = params;

    return value.length >= parseInt(min);
};
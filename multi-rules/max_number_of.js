export default (value, params) => {
    let max = params;

    return value.length <= parseInt(max);
};
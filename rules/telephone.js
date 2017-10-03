export default (value) => {
    value = String(value);

    return /^\+{0,1}\d{7,15}$/.test(value)
}

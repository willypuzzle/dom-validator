export default (value, options) => {
    if(Array.isArray(options)){
        for(let index1 in value){
            for (let index2 in options){
                if(value[index1] === options[index2]){
                    return true;
                }
            }
        }
        return false;
    }

    return !! value.filter(v => v == options).length;

} // eslint-disable-line

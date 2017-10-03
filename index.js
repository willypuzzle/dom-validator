import makeMixin from './mixin';
import makeDirective from './directive';
import { assign } from './utils';
//import Validator from './validator';

let ValidatorPlugin = {
    install: function (Vue, options) {
        let defaultOptions = {};

        const config = assign({}, defaultOptions, options);

        Vue.mixin(makeMixin(Vue, config));
        //Vue.prototype.$validator = new Validator(config);
        Vue.directive('validate', makeDirective(config));
    }
}

export default ValidatorPlugin
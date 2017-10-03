const Mz2oValidator = {
    install(Vue, options) {
        Vue.prototype.$Mz2oValidator = function (options) {
            this.initValidator();
        };

        Vue.mixin({
            data(){
                return {
                    mz2o: {
                        rules: {
                            required(value, checkbox){
                                return checkbox ? _.filter(value, function (o) {
                                        return o.checked;
                                    }).length > 0 : !!value;
                            },
                            min_length(value, min){
                                return (value || '').trim().length >= min;
                            },
                            max_length(value, max){
                                return (value || '').trim().length <= max;
                            },
                            email(value){
                                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/.test(value);
                            },
                            number(value){
                                return /^\d+$/.test(value);
                            },
                            fiscal_code(value){
                                return /^[a-zA-Z]{6}[0-9]{2}[a-zA-Z][0-9]{2}[a-zA-Z][0-9]{3}[a-zA-Z]$/.test(value);
                            }
                        },
                        rulers: [],
                        messages: [],
                        errors: {}
                    }
                }
            },
            methods: {
                validInput(value, input, rules, validating){
                    let self = this;
                    let response = true;
                    self.mz2o.messages[input] = [];
                    self.mz2oConfig[input].error = false;
                    if (self.mz2oConfig[input].optional)
                        return true;
                    _.forEach(rules, function (rule, key) {
                        if (self.mz2o.rules[rule.name]) {
                            let valid = self.mz2o.rules[rule.name](value, ...rule.params);
                            if (!valid && !self.mz2o.messages[input].length) {
                                self.mz2o.messages[input].push(self.mz2oConfig[input].messages[key]);
                                self.mz2oConfig[input].error = true;
                                if (validating) {
                                    response = false;
                                }
                            }
                        }
                    });
                    return response;
                },
                initValidator(){
                    let self = this;
                    _.forEach(this.mz2oConfig, function (config, input) {
                        if (!self.mz2o.rulers[input]) {
                            self.mz2o.rulers[input] = [];
                            _.forEach(config.rules, function (val, key) {
                                let rule = _.split(val, '|');
                                let params = _.slice(rule, 1);
                                self.mz2o.rulers[input].push({
                                    name: rule[0],
                                    params: params
                                })
                            });
                            self.$watch('mz2oConfig.' + input + '.value', function (value) {
                                self.validInput(value, input, self.mz2o.rulers[input]);
                            },{
                                deep :  !!config.selection
                            });

                        }
                    });
                },
                checkValidator(){
                    let self = this;
                    let response = true;
                    console.log(this.mz2oConfig)
                    _.forEach(this.mz2oConfig, function (rules, input) {
                        if (self.mz2o.rulers[input]) {
                            if (!self.validInput(self.mz2oConfig[input].value, input, self.mz2o.rulers[input], true)) {
                                response = false;
                            }
                        }
                    });
                    return response;
                }
            }
        });
    }
};

export default Mz2oValidator;
import Validator from './validator';

export default (Vue, options) => {
  const mixin = {};

  mixin.beforeCreate = function beforeCreate () {
    this.$validator = new Validator(this, options)
  };

  return mixin;
};

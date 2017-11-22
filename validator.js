import Rules from './rules';
import MultipleElementRules from './multi-rules';
import { warn, isObject, getDataAttribute, getComponentType, ComponentTypes } from './utils';
import messages from './messages';


export default class Validator {
  constructor (owner, options) {
      this.scopes = {}
      this.locale = options.locale
      this.owner = owner
      this.message_file_suffix = options.xs_small_messages ? '_xs' : '';
  }

  attach(fieldName, component, binding, type, scope = '__global__', siblings = [] ){
      if(!isObject(this.scopes[scope])){
          this.scopes[scope] = {}
      }

      this.scopes[scope][fieldName] = {
          component: component,
          binding: binding,
          type: type,
          siblings: siblings

      }
  }

  detach(fieldName, scope = '__global__'){
      if(isObject(this.scopes[scope]) && isObject(this.scopes[scope][fieldName])){
          delete this.scopes[scope][fieldName];
      }
  }

  validateAll(){
      let promises = [];
      var scopes = this.scopes;
      for(let index1 in scopes){
          let fieldNames = scopes[index1];
          for(let index2 in fieldNames){
              promises.push(this.validate(index2, index1))
          }
      }

      return Promise.all(promises)
          .then((result) => {
              let resultx = {};
              for(let index in result){
                  let el = result[index];
                  if(!el){
                      return false;
                  }else{
                      resultx[el.field] = el.value;
                  }
              }

              return {
                  data: resultx
              };
          })
  }

  validate(fieldName, scope = '__global__'){
      if(!this.scopes[scope] || !this.scopes[scope][fieldName]){
          warn("Validator.validate, no scope found!")
          return;
      }

      let scopex = this.scopes[scope][fieldName];
      let component = scopex.component;
      let type = scopex.type
      let siblings = scopex.siblings;


      return this._validate(fieldName, type, component, scopex.binding, siblings, scope);
  }

  setErrors(errorsObj, scope = '__global__'){
      let errors = errorsObj.errors;
      for(let fieldName in errors){
          let fieldErrorValues = errors[fieldName];
          let scopex = this.scopes[scope][fieldName];
          let component = scopex.component;

          this._setComponentForValidation(component, fieldErrorValues)
      }
  }

  _validate(fieldName, componentTag, component, binding, siblings, scope){
      return new Promise((resolve, refuse) => {
          setTimeout(() => {
              let otherComponentsInScope = this.scopes[scope];
              let rules = this.getRules(binding.value)
              let r = rules.rules
              let errors = [];
              let requiredController = this._checkForRequired(r, componentTag, component);
              let mainValue = null;
              for(let index in r){
                  let a = r[index];
                  let param  = a && Array.isArray(a) && a.length > 0 ? (a.length > 1 ? a : a[0]) : a;
                  if(param instanceof RegExp){
                      param = [param];
                  }
                  let value = '';
                  let checkFunction = null;
                  switch (componentTag){
                      case ComponentTypes.TEXT_FIELD:
                          value = component.lazyValue;
                          checkFunction = Rules[index];
                          break;
                      case ComponentTypes.SELECT:
                          let selectItemArray = component.selectedItems;
                          value = selectItemArray.length ? selectItemArray[0][component.itemValue] : '';
                          checkFunction = Rules[index]
                          break;
                      case ComponentTypes.CHECK_BOX:
                          value = component.inputValue;
                          checkFunction = MultipleElementRules[index]
                          break;
                      case ComponentTypes.RADIO:
                          value = component.inputValue;
                          checkFunction = MultipleElementRules[index]
                          break;
                      case ComponentTypes.SWITCH:
                          value = component.inputValue;
                          checkFunction = MultipleElementRules[index]
                          break;
                      default:
                          warn(`Validator.validate, ${componentTag} vuetify component not binded`)
                  }
                  if(requiredController && errors.length === 0 && !checkFunction(value, param, scope, otherComponentsInScope, this, fieldName)){
                      this._addComponentToGlobalArray(component)
                      let fieldNamex = getDataAttribute(component.$el, 'as') ? getDataAttribute(component.$el, 'as') : fieldName;
                      let m = messages[this.locale ? this.locale + this.message_file_suffix : 'it_xs'];
                      if(!m){
                          m = messages['it_xs'];
                      }
                      let c = m[index]
                      if(!Array.isArray(param)){
                          param = [String(param)]
                      }
                      errors.push((c ? c: m['_default'])(fieldNamex, param))
                  }

                  mainValue = value;
              }

              let ctrl = errors.length === 0;

              this._setComponentForValidation(component, errors);

              if(!ctrl){
                  for(let index in siblings){
                      this._setComponentForValidation(siblings[index], ['']);
                  }
              }else{
                  for(let index in siblings){
                      this._setComponentForValidation(siblings[index], []);
                  }
              }

              if(!ctrl){
                  resolve(ctrl)
              }else{
                  resolve({
                      field: fieldName,
                      value: mainValue
                  });
              }
          })
      })

  }

  _setComponentForValidation(component, errors){
      let ctrl = errors.length > 0;

      component.shouldValidate = ctrl;

      component.errorBucket = errors;

      component.$emit('update:error', ctrl)
  }

  _checkForRequired(rules, componentTag, component){
      let value = '';
      switch (componentTag){
          case ComponentTypes.TEXT_FIELD:
              value = component.lazyValue;
              break;
          case ComponentTypes.SELECT:
              let selectItemArray = component.selectedItems;
              value = selectItemArray.length ? selectItemArray[0][component.itemValue] : '';
              break;
          case ComponentTypes.CHECK_BOX:
              value = component.inputValue;
              break;
          case ComponentTypes.RADIO:
              value = component.inputValue;
              break;
          case ComponentTypes.SWITCH:
              value = component.inputValue;
              break;
          default:
              warn(`Validator._checkForRequired, ${componentTag} vuetify component not binded(2)`)
      }

      let ctrl = false;
      for(let index in rules){
          if(index === 'required' && rules[index]){
              ctrl = true;
          }
      }

      if(ctrl){
          return true;
      }else{
          return value && String(value).trim() !== ''
      }
  }

  getRules(validatorParam){
      if(isObject(validatorParam)){
          return validatorParam;
      }

      let rules = (validatorParam || '').split('|');

      if(rules.length ===1 && rules[0].trim() === ''){
          return {
              rules: {}
          }
      }

      let validator = {};
      for(let index in rules){
          let rule = rules[index].split(':');
          let params = true;
          if(rule.length > 1){
              params = rule[1].split(',');
          }
          validator[rule[0]] = params
      }

      return {
          rules: validator
      }
  }

  scroll(offset = 130){
      let components = this.owner.$root.$validator.globalValidationFailedComponentArray || [];

      let pos = 1000000000;
      let obj = null
      for(let index in components){
          let c = components[index];
          let coords = this.getCoords(c.$el)
          if(coords.top < pos){
              pos = coords.top;
              obj = c.$el
          }
      }

      if(obj){
          //window.scrollTo(0, pos - offset);
          $('html, body').animate({
              scrollTop: pos - offset
              //$("#elementtoScrollToID").offset().top
          }, 2000);
      }
  }

  prepareForScroll(){
      this.owner.$root.$validator.globalValidationFailedComponentArray = [];
  }

  getCoords(elem) { // crossbrowser version
        var box = elem.getBoundingClientRect();

        var body = document.body;
        var docEl = document.documentElement;

        var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

        var clientTop = docEl.clientTop || body.clientTop || 0;
        var clientLeft = docEl.clientLeft || body.clientLeft || 0;

        var top  = box.top +  scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;

        return { top: Math.round(top), left: Math.round(left) };
  }

    _addComponentToGlobalArray(component){
        if(!this.owner.$root.$validator.globalValidationFailedComponentArray){
            this.owner.$root.$validator.globalValidationFailedComponentArray = [];
        }

        let a = this.owner.$root.$validator.globalValidationFailedComponentArray;
        a.push(component)
    }

    _removeComponentFromGlobalArray(component){
        if(!this.owner.$root.$validator.globalValidationFailedComponentArray){
            return;
        }

        let a = this.owner.$root.$validator.globalValidationFailedComponentArray;
        for(let index in a){
            if(component === a[index]){
                a.splice(index, 1);
                return;
            }
        }
    }
}

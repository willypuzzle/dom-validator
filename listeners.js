//import ClassManager from './classes';
import { getScope,  getDataAttribute, isObject, getComponentType, ComponentTypes, assign } from './utils';
//import config from './config';

export default class ListenerGenerator {
  constructor (el, binding, vnode, options) {
    this.unwatch = undefined;
    this.callbacks = [];
    this.el = el;
    this.scope = (isObject(binding.value) ? binding.value.scope : getScope(el)) || '__global__';
    this.binding = binding;
    this.vm = vnode.context;
    this.component = vnode.child;
    this.type = getComponentType(this.component)
    this.options = assign({}, options);
    this.fieldName = this._resolveFieldName();
    this.siblings = [];

    this.componentListener = () => {
      setTimeout(() => {
          this.vm.$validator.validate(this.fieldName, this.scope)
      }, 50)
    }
  }

  /**
   * Resolves the field name to trigger validations.
   * @return {String} The field name.
   */
  _resolveFieldName ($el) {
      if (this.component) {
          return getDataAttribute(this.el, 'name') || this.component.name || this.el.getAttribute('name') || this.component.$attrs.name;
      }

      return getDataAttribute(this.el, 'name') || this.el.name;
  }

  /**
   * Attaches the Event Listeners.
   */
  attach () {
    if(this.type === ComponentTypes.TEXT_FIELD || this.type === ComponentTypes.SELECT){
        this.vm.$validator.attach(
            this.fieldName,
            this.component,
            this.binding,
            this.type,
            this.scope,
        );

        // if(this.type === ComponentTypes.TEXT_FIELD){
        //     $(this.component.$el).find('input').on('keyup', (key) => {
        //         console.log(key)
        //         this.componentListener()
        //     });
        // }
        this.component.$on('input', this.componentListener);


        this.component.$on('blur', this.componentListener);
    }else{
      setTimeout(() => {
          let children = this.vm.$children;
          let choosenChildren = [];
          for(let index in children){
              let c = children[index];
              if((c.$el.getAttribute('name') === this.fieldName || c.$attrs.name === this.fieldName)  && getComponentType(c) === this.type){
                  choosenChildren.push(c)
              }
          }
          let siblings = [];
          for(let index in choosenChildren){
              if(choosenChildren[index] !== this.component){
                  siblings.push(choosenChildren[index]);
              }
          }

          this.siblings = siblings;

          this.vm.$validator.attach(
              this.fieldName,
              this.component,
              this.binding,
              this.type,
              this.scope,
              this.siblings
          );

          for(let index in choosenChildren){
            let c= choosenChildren[index]
            c.$on("change", this.componentListener)
          }
      })
    }
  }

  /**
   * Removes all attached event listeners.
   */
  detach () {
    this.vm.$validator.detach(this.fieldName, this.scope);
    if(this.type === ComponentTypes.TEXT_FIELD || this.type === ComponentTypes.SELECT) {
        if (this.component) {
            this.component.$off('input', this.componentListener);
            this.component.$off('blur', this.componentListener);
        }
    }else{
        if (this.component) {
            this.component.$off('input', this.componentListener);
        }
        for(let index in this.siblings){
            let c = this.siblings[index];
            c.$off('input', this.componentListener);
        }
    }
  }
}

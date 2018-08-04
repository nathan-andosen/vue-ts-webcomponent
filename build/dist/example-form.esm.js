import Vue from 'vue';
import VueCustomElement from 'vue-custom-element';

// Polyfill for Object.values
var valuesPolyfill = function (obj) {
    var res = [];
    for (var i in obj) {
        if (obj.hasOwnProperty(i))
            res.push(obj[i]);
    }
    return res;
};
if (!Object.values)
    Object.values = valuesPolyfill;

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var vueClassComponent_common = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Vue$$1 = _interopDefault(Vue);

var hasProto = { __proto__: [] } instanceof Array;
function createDecorator(factory) {
    return function (target, key, index) {
        var Ctor = typeof target === 'function'
            ? target
            : target.constructor;
        if (!Ctor.__decorators__) {
            Ctor.__decorators__ = [];
        }
        if (typeof index !== 'number') {
            index = undefined;
        }
        Ctor.__decorators__.push(function (options) { return factory(options, key, index); });
    };
}
function mixins() {
    var Ctors = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        Ctors[_i] = arguments[_i];
    }
    return Vue$$1.extend({ mixins: Ctors });
}
function isPrimitive(value) {
    var type = typeof value;
    return value == null || (type !== "object" && type !== "function");
}

function collectDataFromConstructor(vm, Component) {
    // override _init to prevent to init as Vue instance
    var originalInit = Component.prototype._init;
    Component.prototype._init = function () {
        var _this = this;
        // proxy to actual vm
        var keys = Object.getOwnPropertyNames(vm);
        // 2.2.0 compat (props are no longer exposed as self properties)
        if (vm.$options.props) {
            for (var key in vm.$options.props) {
                if (!vm.hasOwnProperty(key)) {
                    keys.push(key);
                }
            }
        }
        keys.forEach(function (key) {
            if (key.charAt(0) !== '_') {
                Object.defineProperty(_this, key, {
                    get: function () { return vm[key]; },
                    set: function (value) { return vm[key] = value; },
                    configurable: true
                });
            }
        });
    };
    // should be acquired class property values
    var data = new Component();
    // restore original _init to avoid memory leak (#209)
    Component.prototype._init = originalInit;
    // create plain data object
    var plainData = {};
    Object.keys(data).forEach(function (key) {
        if (data[key] !== undefined) {
            plainData[key] = data[key];
        }
    });
    return plainData;
}

var $internalHooks = [
    'data',
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeDestroy',
    'destroyed',
    'beforeUpdate',
    'updated',
    'activated',
    'deactivated',
    'render',
    'errorCaptured' // 2.5
];
function componentFactory(Component, options) {
    if (options === void 0) { options = {}; }
    options.name = options.name || Component._componentTag || Component.name;
    // prototype props.
    var proto = Component.prototype;
    Object.getOwnPropertyNames(proto).forEach(function (key) {
        if (key === 'constructor') {
            return;
        }
        // hooks
        if ($internalHooks.indexOf(key) > -1) {
            options[key] = proto[key];
            return;
        }
        var descriptor = Object.getOwnPropertyDescriptor(proto, key);
        if (typeof descriptor.value === 'function') {
            // methods
            (options.methods || (options.methods = {}))[key] = descriptor.value;
        }
        else if (descriptor.get || descriptor.set) {
            // computed properties
            (options.computed || (options.computed = {}))[key] = {
                get: descriptor.get,
                set: descriptor.set
            };
        }
    });
    (options.mixins || (options.mixins = [])).push({
        data: function () {
            return collectDataFromConstructor(this, Component);
        }
    });
    // decorate options
    var decorators = Component.__decorators__;
    if (decorators) {
        decorators.forEach(function (fn) { return fn(options); });
        delete Component.__decorators__;
    }
    // find super
    var superProto = Object.getPrototypeOf(Component.prototype);
    var Super = superProto instanceof Vue$$1
        ? superProto.constructor
        : Vue$$1;
    var Extended = Super.extend(options);
    forwardStaticMembers(Extended, Component, Super);
    return Extended;
}
function forwardStaticMembers(Extended, Original, Super) {
    // We have to use getOwnPropertyNames since Babel registers methods as non-enumerable
    Object.getOwnPropertyNames(Original).forEach(function (key) {
        // `prototype` should not be overwritten
        if (key === 'prototype') {
            return;
        }
        // Some browsers does not allow reconfigure built-in properties
        var extendedDescriptor = Object.getOwnPropertyDescriptor(Extended, key);
        if (extendedDescriptor && !extendedDescriptor.configurable) {
            return;
        }
        var descriptor = Object.getOwnPropertyDescriptor(Original, key);
        // If the user agent does not support `__proto__` or its family (IE <= 10),
        // the sub class properties may be inherited properties from the super class in TypeScript.
        // We need to exclude such properties to prevent to overwrite
        // the component options object which stored on the extended constructor (See #192).
        // If the value is a referenced value (object or function),
        // we can check equality of them and exclude it if they have the same reference.
        // If it is a primitive value, it will be forwarded for safety.
        if (!hasProto) {
            // Only `cid` is explicitly exluded from property forwarding
            // because we cannot detect whether it is a inherited property or not
            // on the no `__proto__` environment even though the property is reserved.
            if (key === 'cid') {
                return;
            }
            var superDescriptor = Object.getOwnPropertyDescriptor(Super, key);
            if (!isPrimitive(descriptor.value)
                && superDescriptor
                && superDescriptor.value === descriptor.value) {
                return;
            }
        }
        Object.defineProperty(Extended, key, descriptor);
    });
}

function Component(options) {
    if (typeof options === 'function') {
        return componentFactory(options);
    }
    return function (Component) {
        return componentFactory(Component, options);
    };
}
(function (Component) {
    function registerHooks(keys) {
        $internalHooks.push.apply($internalHooks, keys);
    }
    Component.registerHooks = registerHooks;
})(Component || (Component = {}));
var Component$1 = Component;

exports.default = Component$1;
exports.createDecorator = createDecorator;
exports.mixins = mixins;
});

var Component = unwrapExports(vueClassComponent_common);
var vueClassComponent_common_1 = vueClassComponent_common.createDecorator;
var vueClassComponent_common_2 = vueClassComponent_common.mixins;

/** vue-property-decorator verson 7.0.0 MIT LICENSE copyright 2018 kaorun343 */
/**
 * decorator of a prop
 * @param  options the options for the prop
 * @return PropertyDecorator | void
 */
function Prop(options) {
    if (options === void 0) { options = {}; }
    return vueClassComponent_common_1(function (componentOptions, k) {
        (componentOptions.props || (componentOptions.props = {}))[k] = options;
    });
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

var FooterComponent = /** @class */ (function (_super) {
    __extends(FooterComponent, _super);
    function FooterComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Prop()
    ], FooterComponent.prototype, "msg", void 0);
    FooterComponent = __decorate([
        Component
    ], FooterComponent);
    return FooterComponent;
}(Vue));

/* script */
            const __vue_script__ = FooterComponent;
            
/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _vm._m(0)
};
var __vue_staticRenderFns__ = [
  function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "footer" }, [
      _c("p", [_vm._v("This is the footer")])
    ])
  }
];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-4f1a3037_0", { source: "\n.footer[data-v-4f1a3037] {\n  border-top: 1px solid #eee;\n  padding-top: 15px;\n  margin-top: 15px;\n}\n\n/*# sourceMappingURL=footer.component.vue.map */", map: {"version":3,"sources":["/Users/nathananderson/Sites/repos/vue-ts-webcomponent/src/components/footer/footer.component.vue","footer.component.vue"],"names":[],"mappings":";AAgBA;EACA,2BAAA;EACA,kBAAA;EACA,iBAAA;CACA;;ACfA,gDAAgD","file":"footer.component.vue","sourcesContent":[null,".footer {\n  border-top: 1px solid #eee;\n  padding-top: 15px;\n  margin-top: 15px; }\n\n/*# sourceMappingURL=footer.component.vue.map */"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = "data-v-4f1a3037";
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* component normalizer */
  function __vue_normalize__(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "/Users/nathananderson/Sites/repos/vue-ts-webcomponent/src/components/footer/footer.component.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    {
      let hook;
      if (style) {
        hook = function(context) {
          style.call(this, createInjector(context));
        };
      }

      if (hook !== undefined) {
        if (component.functional) {
          // register for functional component in vue file
          const originalRender = component.render;
          component.render = function renderWithStyleInjection(h, context) {
            hook.call(context);
            return originalRender(h, context)
          };
        } else {
          // inject component registration as beforeCreate hook
          const existing = component.beforeCreate;
          component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
      }
    }

    return component
  }
  /* style inject */
  function __vue_create_injector__() {
    const head = document.head || document.getElementsByTagName('head')[0];
    const styles = __vue_create_injector__.styles || (__vue_create_injector__.styles = {});
    const isOldIE =
      typeof navigator !== 'undefined' &&
      /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

    return function addStyle(id, css) {
      if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) return // SSR styles are present.

      const group = isOldIE ? css.media || 'default' : id;
      const style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

      if (!style.ids.includes(id)) {
        let code = css.source;
        let index = style.ids.length;

        style.ids.push(id);

        if (isOldIE) {
          style.element = style.element || document.querySelector('style[data-group=' + group + ']');
        }

        if (!style.element) {
          const el = style.element = document.createElement('style');
          el.type = 'text/css';

          if (css.media) el.setAttribute('media', css.media);
          if (isOldIE) {
            el.setAttribute('data-group', group);
            el.setAttribute('data-next-index', '0');
          }

          head.appendChild(el);
        }

        if (isOldIE) {
          index = parseInt(style.element.getAttribute('data-next-index'));
          style.element.setAttribute('data-next-index', index + 1);
        }

        if (style.element.styleSheet) {
          style.parts.push(code);
          style.element.styleSheet.cssText = style.parts
            .filter(Boolean)
            .join('\n');
        } else {
          const textNode = document.createTextNode(code);
          const nodes = style.element.childNodes;
          if (nodes[index]) style.element.removeChild(nodes[index]);
          if (nodes.length) style.element.insertBefore(textNode, nodes[index]);
          else style.element.appendChild(textNode);
        }
      }
    }
  }
  /* style inject SSR */
  

  
  var FooterComponent$1 = __vue_normalize__(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    __vue_create_injector__,
    undefined
  );

var ExampleFormComponent = /** @class */ (function (_super) {
    __extends(ExampleFormComponent, _super);
    function ExampleFormComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ExampleFormComponent = __decorate([
        Component({
            components: {
                'footer-component': FooterComponent$1
            }
        })
    ], ExampleFormComponent);
    return ExampleFormComponent;
}(Vue));

/* script */
            const __vue_script__$1 = ExampleFormComponent;
            
/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "example-form" },
    [
      _c("div", { staticClass: "logo" }),
      _vm._v(" "),
      _c("p", { staticClass: "txt" }, [_vm._v("It Works!!!")]),
      _vm._v(" "),
      _c("div", { staticClass: "mdc-card" }, [_vm._v("\n    Simple\n  ")]),
      _vm._v(" "),
      _vm._m(0),
      _vm._v(" "),
      _c("div", { staticClass: "testing" }),
      _vm._v(" "),
      _c("footer-component")
    ],
    1
  )
};
var __vue_staticRenderFns__$1 = [
  function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", [_c("span", { staticClass: "icomoon-phone" })])
  }
];
__vue_render__$1._withStripped = true;

  /* style */
  const __vue_inject_styles__$1 = function (inject) {
    if (!inject) return
    inject("data-v-37fc3f36_0", { source: "\n.testing[data-v-37fc3f36] {\n  background-image: url(\"./bright_squares.png\");\n  height: 100px;\n  width: 100px;\n}\n.example-form .txt[data-v-37fc3f36] {\n  color: #ff0000;\n}\n.example-form .logo[data-v-37fc3f36] {\n  background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAEsCAMAAADaaRXwAAACvlBMVEUjJ1z///8jJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1z0VDn5AAAA6XRSTlMAAAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmKCkqKywtLi8wMTIzNDU3ODk6Ozw9Pj9AQUNERUZHSElKTE1OUFFSU1RVVldYWVpbXF1eX2FiY2RlZmdoaWprbm9wcXJzdHV2d3h5ent8fX5/gIGCg4SFhoeIi4yNjo+QkZOWl5iZm5yd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\");\n  height: 300px;\n  width: 400px;\n}\n", map: undefined, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$1 = "data-v-37fc3f36";
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* component normalizer */
  function __vue_normalize__$1(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "/Users/nathananderson/Sites/repos/vue-ts-webcomponent/src/example-form.component.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    {
      let hook;
      if (style) {
        hook = function(context) {
          style.call(this, createInjector(context));
        };
      }

      if (hook !== undefined) {
        if (component.functional) {
          // register for functional component in vue file
          const originalRender = component.render;
          component.render = function renderWithStyleInjection(h, context) {
            hook.call(context);
            return originalRender(h, context)
          };
        } else {
          // inject component registration as beforeCreate hook
          const existing = component.beforeCreate;
          component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
      }
    }

    return component
  }
  /* style inject */
  function __vue_create_injector__$1() {
    const head = document.head || document.getElementsByTagName('head')[0];
    const styles = __vue_create_injector__$1.styles || (__vue_create_injector__$1.styles = {});
    const isOldIE =
      typeof navigator !== 'undefined' &&
      /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

    return function addStyle(id, css) {
      if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) return // SSR styles are present.

      const group = isOldIE ? css.media || 'default' : id;
      const style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

      if (!style.ids.includes(id)) {
        let code = css.source;
        let index = style.ids.length;

        style.ids.push(id);

        if (isOldIE) {
          style.element = style.element || document.querySelector('style[data-group=' + group + ']');
        }

        if (!style.element) {
          const el = style.element = document.createElement('style');
          el.type = 'text/css';

          if (css.media) el.setAttribute('media', css.media);
          if (isOldIE) {
            el.setAttribute('data-group', group);
            el.setAttribute('data-next-index', '0');
          }

          head.appendChild(el);
        }

        if (isOldIE) {
          index = parseInt(style.element.getAttribute('data-next-index'));
          style.element.setAttribute('data-next-index', index + 1);
        }

        if (style.element.styleSheet) {
          style.parts.push(code);
          style.element.styleSheet.cssText = style.parts
            .filter(Boolean)
            .join('\n');
        } else {
          const textNode = document.createTextNode(code);
          const nodes = style.element.childNodes;
          if (nodes[index]) style.element.removeChild(nodes[index]);
          if (nodes.length) style.element.insertBefore(textNode, nodes[index]);
          else style.element.appendChild(textNode);
        }
      }
    }
  }
  /* style inject SSR */
  

  
  var ExampleFormComponent$1 = __vue_normalize__$1(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    __vue_create_injector__$1,
    undefined
  );

var component = ExampleFormComponent$1;
var componentName = 'example-form';
Vue.use(VueCustomElement);
/**
 * Load the web component
 *
 */
var loadWebComponent = function () {
    // for some reason rollupjs plugin rollup-plugin-vue does not output the 
    // same as webpack, so the component is inside a property called components
    if (component['components']) {
        var compKey = Object.keys(component['components'])[0];
        var c = new component['components'][compKey]();
        Vue.customElement(componentName, c.$options);
    }
    else {
        // handle webpack build
        var c = new component();
        Vue.customElement(componentName, c.$options);
    }
};
// check if customElements is supported, if not, we need to download the 
// polyfill
if (!window.customElements || !window.customElements.define
    || !window.customElements.get || !window.customElements.whenDefined) {
    if (window.documentRegisterElementScriptPath) {
        // customElements not natively supported, we have to download the polyfill
        var fileref = document.createElement('script');
        fileref.setAttribute("type", "text/javascript");
        fileref.setAttribute("src", window.documentRegisterElementScriptPath);
        fileref.onload = function () {
            loadWebComponent();
        };
        document.getElementsByTagName("head")[0].appendChild(fileref);
    }
    else {
        throw new Error('customElements is not supported, please use the ' +
            'document-register-element polyfill');
    }
}
else {
    loadWebComponent();
}
import Vue from 'vue';
import VueCustomElement from 'vue-custom-element';
import 'jquery/dist/jquery.slim.js';
import 'popper.js';
import 'bootstrap';
import 'bootstrap/scss/bootstrap.scss';

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
      _c("p", [_vm._v("This is the footer, its a separate component.")])
    ])
  }
];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-8a269256_0", { source: "\n.footer[data-v-8a269256] {\n  border-top: 1px solid #eee;\n  padding-top: 15px;\n  margin-top: 15px;\n  text-align: center;\n  font-style: italic;\n}\n.footer p[data-v-8a269256] {\n    color: #999;\n}\n\n/*# sourceMappingURL=footer.component.vue.map */", map: {"version":3,"sources":["/Users/nathananderson/Sites/repos/vue-ts-webcomponent/src/components/footer/footer.component.vue","footer.component.vue"],"names":[],"mappings":";AAgBA;EACA,2BAAA;EACA,kBAAA;EACA,iBAAA;EACA,mBAAA;EACA,mBAAA;CAKA;AAVA;IAQA,YAAA;CACA;;AChBA,gDAAgD","file":"footer.component.vue","sourcesContent":[null,".footer {\n  border-top: 1px solid #eee;\n  padding-top: 15px;\n  margin-top: 15px;\n  text-align: center;\n  font-style: italic; }\n  .footer p {\n    color: #999; }\n\n/*# sourceMappingURL=footer.component.vue.map */"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = "data-v-8a269256";
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

// the name of the component, this is also the name of the custom element that
// gets created
var COMPONENT_NAME = 'example-form';
var ExampleFormComponent = /** @class */ (function (_super) {
    __extends(ExampleFormComponent, _super);
    /**
     * Creates an instance of ExampleFormComponent.
     *
     * @memberof ExampleFormComponent
     */
    function ExampleFormComponent() {
        var _this = _super.call(this) || this;
        _this.email = "";
        _this.password = "";
        _this.rememberMe = false;
        if (typeof _this.data === 'string') {
            _this.data = JSON.parse(_this.data);
        }
        _this.data = (_this.data) ? _this.data : {};
        _this.title = (_this.title) ? _this.title : 'Welcome!';
        return _this;
    }
    /**
     * Get the data as a json object
     *
     * @private
     * @returns {iData}
     * @memberof ExampleFormComponent
     */
    ExampleFormComponent.prototype.getData = function () {
        return JSON.parse(JSON.stringify(this.data));
    };
    /**
     * This function will be exposed onto the custom element
     *
     * @private
     * @param {iData} data
     * @memberof ExampleFormComponent
     */
    ExampleFormComponent.prototype.passData = function (data) {
        this.data = data;
    };
    /**
     * Submit the form
     *
     * @memberof ExampleFormComponent
     */
    ExampleFormComponent.prototype.submitForm = function () {
        this.$emit('example-form-submit', this.getData());
    };
    __decorate([
        Prop()
    ], ExampleFormComponent.prototype, "title", void 0);
    ExampleFormComponent = __decorate([
        Component({
            name: COMPONENT_NAME,
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
      _c("h2", [_vm._v(_vm._s(_vm.title))]),
      _vm._v(" "),
      _c("div", [
        _c("div", { staticClass: "form-group" }, [
          _c("label", { attrs: { for: "exampleInputEmail1" } }, [
            _vm._v("Email address")
          ]),
          _vm._v(" "),
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.data.email,
                expression: "data.email"
              }
            ],
            staticClass: "form-control",
            attrs: {
              type: "email",
              id: "exampleInputEmail1",
              "aria-describedby": "emailHelp",
              placeholder: "Enter email"
            },
            domProps: { value: _vm.data.email },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.$set(_vm.data, "email", $event.target.value);
              }
            }
          }),
          _vm._v(" "),
          _c(
            "small",
            { staticClass: "form-text text-muted", attrs: { id: "emailHelp" } },
            [_vm._v("We'll never share your email with anyone else.")]
          )
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "form-group" }, [
          _c("label", { attrs: { for: "exampleInputPassword1" } }, [
            _vm._v("Password")
          ]),
          _vm._v(" "),
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.data.password,
                expression: "data.password"
              }
            ],
            staticClass: "form-control",
            attrs: {
              type: "password",
              id: "exampleInputPassword1",
              placeholder: "Password"
            },
            domProps: { value: _vm.data.password },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.$set(_vm.data, "password", $event.target.value);
              }
            }
          })
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "form-group" }, [
          _c("div", { staticClass: "form-check" }, [
            _c("input", {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.data.rememberMe,
                  expression: "data.rememberMe"
                }
              ],
              staticClass: "form-check-input",
              attrs: { type: "checkbox", id: "exampleCheck1" },
              domProps: {
                checked: Array.isArray(_vm.data.rememberMe)
                  ? _vm._i(_vm.data.rememberMe, null) > -1
                  : _vm.data.rememberMe
              },
              on: {
                change: function($event) {
                  var $$a = _vm.data.rememberMe,
                    $$el = $event.target,
                    $$c = $$el.checked ? true : false;
                  if (Array.isArray($$a)) {
                    var $$v = null,
                      $$i = _vm._i($$a, $$v);
                    if ($$el.checked) {
                      $$i < 0 &&
                        _vm.$set(_vm.data, "rememberMe", $$a.concat([$$v]));
                    } else {
                      $$i > -1 &&
                        _vm.$set(
                          _vm.data,
                          "rememberMe",
                          $$a.slice(0, $$i).concat($$a.slice($$i + 1))
                        );
                    }
                  } else {
                    _vm.$set(_vm.data, "rememberMe", $$c);
                  }
                }
              }
            }),
            _vm._v(" "),
            _c(
              "label",
              {
                staticClass: "form-check-label",
                attrs: { for: "exampleCheck1" }
              },
              [_vm._v("Remember me")]
            )
          ])
        ]),
        _vm._v(" "),
        _c(
          "button",
          { staticClass: "btn btn-primary", on: { click: _vm.submitForm } },
          [_vm._v("Submit")]
        )
      ]),
      _vm._v(" "),
      _vm._m(0),
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
    return _c("div", { staticClass: "phone-num" }, [
      _c("span", { staticClass: "icomoon-phone" }),
      _vm._v("\n    1800 000 111\n  ")
    ])
  }
];
__vue_render__$1._withStripped = true;

  /* style */
  const __vue_inject_styles__$1 = function (inject) {
    if (!inject) return
    inject("data-v-6a8d6434_0", { source: "\n@font-face {\n  font-family: 'icomoon';\n  src: url(\"data:font/ttf;base64,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\") format(\"truetype\"), url(\"data:font/woff;base64,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\") format(\"woff\"), url(\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiID4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8bWV0YWRhdGE+R2VuZXJhdGVkIGJ5IEljb01vb248L21ldGFkYXRhPgo8ZGVmcz4KPGZvbnQgaWQ9Imljb21vb24iIGhvcml6LWFkdi14PSIxMDI0Ij4KPGZvbnQtZmFjZSB1bml0cy1wZXItZW09IjEwMjQiIGFzY2VudD0iOTYwIiBkZXNjZW50PSItNjQiIC8+CjxtaXNzaW5nLWdseXBoIGhvcml6LWFkdi14PSIxMDI0IiAvPgo8Z2x5cGggdW5pY29kZT0iJiN4MjA7IiBob3Jpei1hZHYteD0iNTEyIiBkPSIiIC8+CjxnbHlwaCB1bmljb2RlPSImI3hlMGNkOyIgZ2x5cGgtbmFtZT0icGhvbmUiIGQ9Ik0yODIgNDc4LjY2N2M2Mi0xMjAgMTYyLTIyMCAyODItMjgybDk0IDk0YzEyIDEyIDMwIDE2IDQ0IDEwIDQ4LTE2IDEwMC0yNCAxNTItMjQgMjQgMCA0Mi0xOCA0Mi00MnYtMTUwYzAtMjQtMTgtNDItNDItNDItNDAwIDAtNzI2IDMyNi03MjYgNzI2IDAgMjQgMTggNDIgNDIgNDJoMTUwYzI0IDAgNDItMTggNDItNDIgMC01NCA4LTEwNCAyNC0xNTIgNC0xNCAyLTMyLTEwLTQ0eiIgLz4KPGdseXBoIHVuaWNvZGU9IiYjeGUwZTE7IiBnbHlwaC1uYW1lPSJtYWlsX291dGxpbmUiIGQ9Ik01MTIgNDY4LjY2N2wzNDIgMjE0aC02ODR6TTg1NCAxNzAuNjY3djQyNmwtMzQyLTIxMi0zNDIgMjEydi00MjZoNjg0ek04NTQgNzY4LjY2N2M0NiAwIDg0LTQwIDg0LTg2di01MTJjMC00Ni0zOC04Ni04NC04NmgtNjg0Yy00NiAwLTg0IDQwLTg0IDg2djUxMmMwIDQ2IDM4IDg2IDg0IDg2aDY4NHoiIC8+CjxnbHlwaCB1bmljb2RlPSImI3hlNTVlOyIgZ2x5cGgtbmFtZT0icGluX2Ryb3AiIGQ9Ik0yMTQgODQuNjY3aDU5NnYtODRoLTU5NnY4NHpNNDI2IDU5Ni42NjdjMC00NiA0MC04NCA4Ni04NCA0OCAwIDg2IDM4IDg2IDg0cy00MCA4Ni04NiA4Ni04Ni00MC04Ni04NnpNNzY4IDU5Ni42NjdjMC0xOTItMjU2LTQ2OC0yNTYtNDY4cy0yNTYgMjc2LTI1NiA0NjhjMCAxNDIgMTE0IDI1NiAyNTYgMjU2czI1Ni0xMTQgMjU2LTI1NnoiIC8+CjxnbHlwaCB1bmljb2RlPSImI3hlNWM0OyIgZ2x5cGgtbmFtZT0iYXJyb3dfYmFjayIgZD0iTTg1NCA0NjguNjY3di04NGgtNTIwbDIzOC0yNDAtNjAtNjAtMzQyIDM0MiAzNDIgMzQyIDYwLTYwLTIzOC0yNDBoNTIweiIgLz4KPGdseXBoIHVuaWNvZGU9IiYjeGU1Yzg7IiBnbHlwaC1uYW1lPSJhcnJvd19mb3J3YXJkIiBkPSJNNTEyIDc2OC42NjdsMzQyLTM0Mi0zNDItMzQyLTYwIDYwIDIzOCAyNDBoLTUyMHY4NGg1MjBsLTIzOCAyNDB6IiAvPgo8Z2x5cGggdW5pY29kZT0iJiN4ZTVjYTsiIGdseXBoLW5hbWU9ImNoZWNrIiBkPSJNMzg0IDI0OC42NjdsNDUyIDQ1MiA2MC02MC01MTItNTEyLTIzOCAyMzggNjAgNjB6IiAvPgo8Z2x5cGggdW5pY29kZT0iJiN4ZTVjZDsiIGdseXBoLW5hbWU9ImNsb3NlIiBkPSJNODEwIDY2NC42NjdsLTIzOC0yMzggMjM4LTIzOC02MC02MC0yMzggMjM4LTIzOC0yMzgtNjAgNjAgMjM4IDIzOC0yMzggMjM4IDYwIDYwIDIzOC0yMzggMjM4IDIzOHoiIC8+CjxnbHlwaCB1bmljb2RlPSImI3hlNWNlOyIgZ2x5cGgtbmFtZT0iZXhwYW5kX2xlc3MiIGQ9Ik01MTIgNTk2LjY2N2wyNTYtMjU2LTYwLTYwLTE5NiAxOTYtMTk2LTE5Ni02MCA2MHoiIC8+CjxnbHlwaCB1bmljb2RlPSImI3hlNWNmOyIgZ2x5cGgtbmFtZT0iZXhwYW5kX21vcmUiIGQ9Ik03MDggNTcyLjY2N2w2MC02MC0yNTYtMjU2LTI1NiAyNTYgNjAgNjAgMTk2LTE5NnoiIC8+CjxnbHlwaCB1bmljb2RlPSImI3hlNWQyOyIgZ2x5cGgtbmFtZT0ibWVudSIgZD0iTTEyOCA2ODIuNjY3aDc2OHYtODZoLTc2OHY4NnpNMTI4IDM4NC42Njd2ODRoNzY4di04NGgtNzY4ek0xMjggMTcwLjY2N3Y4Nmg3Njh2LTg2aC03Njh6IiAvPgo8L2ZvbnQ+PC9kZWZzPjwvc3ZnPg==\") format(\"svg\");\n  font-weight: normal;\n  font-style: normal;\n}\n[class^=\"icomoon-\"][data-v-6a8d6434], [class*=\" icomoon-\"][data-v-6a8d6434] {\n  /* use !important to prevent issues with browser extensions that change fonts */\n  font-family: 'icomoon' !important;\n  speak: none;\n  font-style: normal;\n  font-weight: normal;\n  font-variant: normal;\n  text-transform: none;\n  line-height: 1;\n  /* Better Font Rendering =========== */\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.icomoon-arrow_back[data-v-6a8d6434]:before {\n  content: \"\\e5c4\";\n}\n.icomoon-arrow_forward[data-v-6a8d6434]:before {\n  content: \"\\e5c8\";\n}\n.icomoon-phone[data-v-6a8d6434]:before {\n  content: \"\\e0cd\";\n}\n.icomoon-check[data-v-6a8d6434]:before {\n  content: \"\\e5ca\";\n}\n.icomoon-close[data-v-6a8d6434]:before {\n  content: \"\\e5cd\";\n}\n.icomoon-expand_less[data-v-6a8d6434]:before {\n  content: \"\\e5ce\";\n}\n.icomoon-expand_more[data-v-6a8d6434]:before {\n  content: \"\\e5cf\";\n}\n.icomoon-mail_outline[data-v-6a8d6434]:before {\n  content: \"\\e0e1\";\n}\n.icomoon-menu[data-v-6a8d6434]:before {\n  content: \"\\e5d2\";\n}\n.icomoon-pin_drop[data-v-6a8d6434]:before {\n  content: \"\\e55e\";\n}\n.example-form[data-v-6a8d6434] {\n  display: block;\n  width: 400px;\n  margin: 0 auto;\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,  Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;\n}\n.example-form .logo[data-v-6a8d6434] {\n    background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAEsCAMAAADaaRXwAAACvlBMVEUjJ1z///8jJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1z0VDn5AAAA6XRSTlMAAAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmKCkqKywtLi8wMTIzNDU3ODk6Ozw9Pj9AQUNERUZHSElKTE1OUFFSU1RVVldYWVpbXF1eX2FiY2RlZmdoaWprbm9wcXJzdHV2d3h5ent8fX5/gIGCg4SFhoeIi4yNjo+QkZOWl5iZm5yd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\");\n    height: 300px;\n    width: 400px;\n}\n.example-form .phone-num[data-v-6a8d6434] {\n    padding-top: 15px;\n    color: #999;\n}\n", map: undefined, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$1 = "data-v-6a8d6434";
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
Vue.use(VueCustomElement);
/**
 * Load the web component
 *
 */
var loadWebComponent = function () {
    var element;
    // for some reason rollupjs plugin rollup-plugin-vue does not output the 
    // same as webpack, so the component is inside a property called components
    if (component['components']) {
        var c = new component['components'][COMPONENT_NAME]();
        element = Vue.customElement(COMPONENT_NAME, c.$options);
    }
    else {
        // handle webpack build
        var c = new component();
        element = Vue.customElement(COMPONENT_NAME, c.$options);
    }
    // create your own custom methods on the custum element
    element.prototype.passData = function (data) {
        this.getVueInstance().passData(data);
    };
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

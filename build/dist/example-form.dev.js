(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (factory());
}(this, (function () { 'use strict';

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

  /*!
   * Vue.js v2.5.16
   * (c) 2014-2018 Evan You
   * Released under the MIT License.
   */
  /*  */

  var emptyObject = Object.freeze({});

  // these helpers produces better vm code in JS engines due to their
  // explicitness and function inlining
  function isUndef (v) {
    return v === undefined || v === null
  }

  function isDef (v) {
    return v !== undefined && v !== null
  }

  function isTrue (v) {
    return v === true
  }

  function isFalse (v) {
    return v === false
  }

  /**
   * Check if value is primitive
   */
  function isPrimitive (value) {
    return (
      typeof value === 'string' ||
      typeof value === 'number' ||
      // $flow-disable-line
      typeof value === 'symbol' ||
      typeof value === 'boolean'
    )
  }

  /**
   * Quick object check - this is primarily used to tell
   * Objects from primitive values when we know the value
   * is a JSON-compliant type.
   */
  function isObject (obj) {
    return obj !== null && typeof obj === 'object'
  }

  /**
   * Get the raw type string of a value e.g. [object Object]
   */
  var _toString = Object.prototype.toString;

  function toRawType (value) {
    return _toString.call(value).slice(8, -1)
  }

  /**
   * Strict object type check. Only returns true
   * for plain JavaScript objects.
   */
  function isPlainObject (obj) {
    return _toString.call(obj) === '[object Object]'
  }

  function isRegExp (v) {
    return _toString.call(v) === '[object RegExp]'
  }

  /**
   * Check if val is a valid array index.
   */
  function isValidArrayIndex (val) {
    var n = parseFloat(String(val));
    return n >= 0 && Math.floor(n) === n && isFinite(val)
  }

  /**
   * Convert a value to a string that is actually rendered.
   */
  function toString (val) {
    return val == null
      ? ''
      : typeof val === 'object'
        ? JSON.stringify(val, null, 2)
        : String(val)
  }

  /**
   * Convert a input value to a number for persistence.
   * If the conversion fails, return original string.
   */
  function toNumber (val) {
    var n = parseFloat(val);
    return isNaN(n) ? val : n
  }

  /**
   * Make a map and return a function for checking if a key
   * is in that map.
   */
  function makeMap (
    str,
    expectsLowerCase
  ) {
    var map = Object.create(null);
    var list = str.split(',');
    for (var i = 0; i < list.length; i++) {
      map[list[i]] = true;
    }
    return expectsLowerCase
      ? function (val) { return map[val.toLowerCase()]; }
      : function (val) { return map[val]; }
  }

  /**
   * Check if a tag is a built-in tag.
   */
  var isBuiltInTag = makeMap('slot,component', true);

  /**
   * Check if a attribute is a reserved attribute.
   */
  var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

  /**
   * Remove an item from an array
   */
  function remove (arr, item) {
    if (arr.length) {
      var index = arr.indexOf(item);
      if (index > -1) {
        return arr.splice(index, 1)
      }
    }
  }

  /**
   * Check whether the object has the property.
   */
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  function hasOwn (obj, key) {
    return hasOwnProperty.call(obj, key)
  }

  /**
   * Create a cached version of a pure function.
   */
  function cached (fn) {
    var cache = Object.create(null);
    return (function cachedFn (str) {
      var hit = cache[str];
      return hit || (cache[str] = fn(str))
    })
  }

  /**
   * Camelize a hyphen-delimited string.
   */
  var camelizeRE = /-(\w)/g;
  var camelize = cached(function (str) {
    return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
  });

  /**
   * Capitalize a string.
   */
  var capitalize = cached(function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  });

  /**
   * Hyphenate a camelCase string.
   */
  var hyphenateRE = /\B([A-Z])/g;
  var hyphenate = cached(function (str) {
    return str.replace(hyphenateRE, '-$1').toLowerCase()
  });

  /**
   * Simple bind polyfill for environments that do not support it... e.g.
   * PhantomJS 1.x. Technically we don't need this anymore since native bind is
   * now more performant in most browsers, but removing it would be breaking for
   * code that was able to run in PhantomJS 1.x, so this must be kept for
   * backwards compatibility.
   */

  /* istanbul ignore next */
  function polyfillBind (fn, ctx) {
    function boundFn (a) {
      var l = arguments.length;
      return l
        ? l > 1
          ? fn.apply(ctx, arguments)
          : fn.call(ctx, a)
        : fn.call(ctx)
    }

    boundFn._length = fn.length;
    return boundFn
  }

  function nativeBind (fn, ctx) {
    return fn.bind(ctx)
  }

  var bind = Function.prototype.bind
    ? nativeBind
    : polyfillBind;

  /**
   * Convert an Array-like object to a real Array.
   */
  function toArray (list, start) {
    start = start || 0;
    var i = list.length - start;
    var ret = new Array(i);
    while (i--) {
      ret[i] = list[i + start];
    }
    return ret
  }

  /**
   * Mix properties into target object.
   */
  function extend (to, _from) {
    for (var key in _from) {
      to[key] = _from[key];
    }
    return to
  }

  /**
   * Merge an Array of Objects into a single Object.
   */
  function toObject (arr) {
    var res = {};
    for (var i = 0; i < arr.length; i++) {
      if (arr[i]) {
        extend(res, arr[i]);
      }
    }
    return res
  }

  /**
   * Perform no operation.
   * Stubbing args to make Flow happy without leaving useless transpiled code
   * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/)
   */
  function noop (a, b, c) {}

  /**
   * Always return false.
   */
  var no = function (a, b, c) { return false; };

  /**
   * Return same value
   */
  var identity = function (_) { return _; };

  /**
   * Generate a static keys string from compiler modules.
   */


  /**
   * Check if two values are loosely equal - that is,
   * if they are plain objects, do they have the same shape?
   */
  function looseEqual (a, b) {
    if (a === b) { return true }
    var isObjectA = isObject(a);
    var isObjectB = isObject(b);
    if (isObjectA && isObjectB) {
      try {
        var isArrayA = Array.isArray(a);
        var isArrayB = Array.isArray(b);
        if (isArrayA && isArrayB) {
          return a.length === b.length && a.every(function (e, i) {
            return looseEqual(e, b[i])
          })
        } else if (!isArrayA && !isArrayB) {
          var keysA = Object.keys(a);
          var keysB = Object.keys(b);
          return keysA.length === keysB.length && keysA.every(function (key) {
            return looseEqual(a[key], b[key])
          })
        } else {
          /* istanbul ignore next */
          return false
        }
      } catch (e) {
        /* istanbul ignore next */
        return false
      }
    } else if (!isObjectA && !isObjectB) {
      return String(a) === String(b)
    } else {
      return false
    }
  }

  function looseIndexOf (arr, val) {
    for (var i = 0; i < arr.length; i++) {
      if (looseEqual(arr[i], val)) { return i }
    }
    return -1
  }

  /**
   * Ensure a function is called only once.
   */
  function once (fn) {
    var called = false;
    return function () {
      if (!called) {
        called = true;
        fn.apply(this, arguments);
      }
    }
  }

  var SSR_ATTR = 'data-server-rendered';

  var ASSET_TYPES = [
    'component',
    'directive',
    'filter'
  ];

  var LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed',
    'activated',
    'deactivated',
    'errorCaptured'
  ];

  /*  */

  var config = ({
    /**
     * Option merge strategies (used in core/util/options)
     */
    // $flow-disable-line
    optionMergeStrategies: Object.create(null),

    /**
     * Whether to suppress warnings.
     */
    silent: false,

    /**
     * Show production mode tip message on boot?
     */
    productionTip: "production" !== 'production',

    /**
     * Whether to enable devtools
     */
    devtools: "production" !== 'production',

    /**
     * Whether to record perf
     */
    performance: false,

    /**
     * Error handler for watcher errors
     */
    errorHandler: null,

    /**
     * Warn handler for watcher warns
     */
    warnHandler: null,

    /**
     * Ignore certain custom elements
     */
    ignoredElements: [],

    /**
     * Custom user key aliases for v-on
     */
    // $flow-disable-line
    keyCodes: Object.create(null),

    /**
     * Check if a tag is reserved so that it cannot be registered as a
     * component. This is platform-dependent and may be overwritten.
     */
    isReservedTag: no,

    /**
     * Check if an attribute is reserved so that it cannot be used as a component
     * prop. This is platform-dependent and may be overwritten.
     */
    isReservedAttr: no,

    /**
     * Check if a tag is an unknown element.
     * Platform-dependent.
     */
    isUnknownElement: no,

    /**
     * Get the namespace of an element
     */
    getTagNamespace: noop,

    /**
     * Parse the real tag name for the specific platform.
     */
    parsePlatformTagName: identity,

    /**
     * Check if an attribute must be bound using property, e.g. value
     * Platform-dependent.
     */
    mustUseProp: no,

    /**
     * Exposed for legacy reasons
     */
    _lifecycleHooks: LIFECYCLE_HOOKS
  });

  /*  */

  /**
   * Check if a string starts with $ or _
   */
  function isReserved (str) {
    var c = (str + '').charCodeAt(0);
    return c === 0x24 || c === 0x5F
  }

  /**
   * Define a property.
   */
  function def (obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
      value: val,
      enumerable: !!enumerable,
      writable: true,
      configurable: true
    });
  }

  /**
   * Parse simple path.
   */
  var bailRE = /[^\w.$]/;
  function parsePath (path) {
    if (bailRE.test(path)) {
      return
    }
    var segments = path.split('.');
    return function (obj) {
      for (var i = 0; i < segments.length; i++) {
        if (!obj) { return }
        obj = obj[segments[i]];
      }
      return obj
    }
  }

  /*  */

  // can we use __proto__?
  var hasProto = '__proto__' in {};

  // Browser environment sniffing
  var inBrowser = typeof window !== 'undefined';
  var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
  var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
  var UA = inBrowser && window.navigator.userAgent.toLowerCase();
  var isIE = UA && /msie|trident/.test(UA);
  var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
  var isEdge = UA && UA.indexOf('edge/') > 0;
  var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
  var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
  var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

  // Firefox has a "watch" function on Object.prototype...
  var nativeWatch = ({}).watch;

  var supportsPassive = false;
  if (inBrowser) {
    try {
      var opts = {};
      Object.defineProperty(opts, 'passive', ({
        get: function get () {
          /* istanbul ignore next */
          supportsPassive = true;
        }
      })); // https://github.com/facebook/flow/issues/285
      window.addEventListener('test-passive', null, opts);
    } catch (e) {}
  }

  // this needs to be lazy-evaled because vue may be required before
  // vue-server-renderer can set VUE_ENV
  var _isServer;
  var isServerRendering = function () {
    if (_isServer === undefined) {
      /* istanbul ignore if */
      if (!inBrowser && !inWeex && typeof global !== 'undefined') {
        // detect presence of vue-server-renderer and avoid
        // Webpack shimming the process
        _isServer = global['process'].env.VUE_ENV === 'server';
      } else {
        _isServer = false;
      }
    }
    return _isServer
  };

  // detect devtools
  var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

  /* istanbul ignore next */
  function isNative (Ctor) {
    return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
  }

  var hasSymbol =
    typeof Symbol !== 'undefined' && isNative(Symbol) &&
    typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

  var _Set;
  /* istanbul ignore if */ // $flow-disable-line
  if (typeof Set !== 'undefined' && isNative(Set)) {
    // use native Set when available.
    _Set = Set;
  } else {
    // a non-standard Set polyfill that only works with primitive keys.
    _Set = (function () {
      function Set () {
        this.set = Object.create(null);
      }
      Set.prototype.has = function has (key) {
        return this.set[key] === true
      };
      Set.prototype.add = function add (key) {
        this.set[key] = true;
      };
      Set.prototype.clear = function clear () {
        this.set = Object.create(null);
      };

      return Set;
    }());
  }

  /*  */

  var warn = noop;

  /*  */


  var uid = 0;

  /**
   * A dep is an observable that can have multiple
   * directives subscribing to it.
   */
  var Dep = function Dep () {
    this.id = uid++;
    this.subs = [];
  };

  Dep.prototype.addSub = function addSub (sub) {
    this.subs.push(sub);
  };

  Dep.prototype.removeSub = function removeSub (sub) {
    remove(this.subs, sub);
  };

  Dep.prototype.depend = function depend () {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  };

  Dep.prototype.notify = function notify () {
    // stabilize the subscriber list first
    var subs = this.subs.slice();
    for (var i = 0, l = subs.length; i < l; i++) {
      subs[i].update();
    }
  };

  // the current target watcher being evaluated.
  // this is globally unique because there could be only one
  // watcher being evaluated at any time.
  Dep.target = null;
  var targetStack = [];

  function pushTarget (_target) {
    if (Dep.target) { targetStack.push(Dep.target); }
    Dep.target = _target;
  }

  function popTarget () {
    Dep.target = targetStack.pop();
  }

  /*  */

  var VNode = function VNode (
    tag,
    data,
    children,
    text,
    elm,
    context,
    componentOptions,
    asyncFactory
  ) {
    this.tag = tag;
    this.data = data;
    this.children = children;
    this.text = text;
    this.elm = elm;
    this.ns = undefined;
    this.context = context;
    this.fnContext = undefined;
    this.fnOptions = undefined;
    this.fnScopeId = undefined;
    this.key = data && data.key;
    this.componentOptions = componentOptions;
    this.componentInstance = undefined;
    this.parent = undefined;
    this.raw = false;
    this.isStatic = false;
    this.isRootInsert = true;
    this.isComment = false;
    this.isCloned = false;
    this.isOnce = false;
    this.asyncFactory = asyncFactory;
    this.asyncMeta = undefined;
    this.isAsyncPlaceholder = false;
  };

  var prototypeAccessors = { child: { configurable: true } };

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  prototypeAccessors.child.get = function () {
    return this.componentInstance
  };

  Object.defineProperties( VNode.prototype, prototypeAccessors );

  var createEmptyVNode = function (text) {
    if ( text === void 0 ) text = '';

    var node = new VNode();
    node.text = text;
    node.isComment = true;
    return node
  };

  function createTextVNode (val) {
    return new VNode(undefined, undefined, undefined, String(val))
  }

  // optimized shallow clone
  // used for static nodes and slot nodes because they may be reused across
  // multiple renders, cloning them avoids errors when DOM manipulations rely
  // on their elm reference.
  function cloneVNode (vnode) {
    var cloned = new VNode(
      vnode.tag,
      vnode.data,
      vnode.children,
      vnode.text,
      vnode.elm,
      vnode.context,
      vnode.componentOptions,
      vnode.asyncFactory
    );
    cloned.ns = vnode.ns;
    cloned.isStatic = vnode.isStatic;
    cloned.key = vnode.key;
    cloned.isComment = vnode.isComment;
    cloned.fnContext = vnode.fnContext;
    cloned.fnOptions = vnode.fnOptions;
    cloned.fnScopeId = vnode.fnScopeId;
    cloned.isCloned = true;
    return cloned
  }

  /*
   * not type checking this file because flow doesn't play well with
   * dynamically accessing methods on Array prototype
   */

  var arrayProto = Array.prototype;
  var arrayMethods = Object.create(arrayProto);

  var methodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
  ];

  /**
   * Intercept mutating methods and emit events
   */
  methodsToPatch.forEach(function (method) {
    // cache original method
    var original = arrayProto[method];
    def(arrayMethods, method, function mutator () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var result = original.apply(this, args);
      var ob = this.__ob__;
      var inserted;
      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break
        case 'splice':
          inserted = args.slice(2);
          break
      }
      if (inserted) { ob.observeArray(inserted); }
      // notify change
      ob.dep.notify();
      return result
    });
  });

  /*  */

  var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

  /**
   * In some cases we may want to disable observation inside a component's
   * update computation.
   */
  var shouldObserve = true;

  function toggleObserving (value) {
    shouldObserve = value;
  }

  /**
   * Observer class that is attached to each observed
   * object. Once attached, the observer converts the target
   * object's property keys into getter/setters that
   * collect dependencies and dispatch updates.
   */
  var Observer = function Observer (value) {
    this.value = value;
    this.dep = new Dep();
    this.vmCount = 0;
    def(value, '__ob__', this);
    if (Array.isArray(value)) {
      var augment = hasProto
        ? protoAugment
        : copyAugment;
      augment(value, arrayMethods, arrayKeys);
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  };

  /**
   * Walk through each property and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  Observer.prototype.walk = function walk (obj) {
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i]);
    }
  };

  /**
   * Observe a list of Array items.
   */
  Observer.prototype.observeArray = function observeArray (items) {
    for (var i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  };

  // helpers

  /**
   * Augment an target Object or Array by intercepting
   * the prototype chain using __proto__
   */
  function protoAugment (target, src, keys) {
    /* eslint-disable no-proto */
    target.__proto__ = src;
    /* eslint-enable no-proto */
  }

  /**
   * Augment an target Object or Array by defining
   * hidden properties.
   */
  /* istanbul ignore next */
  function copyAugment (target, src, keys) {
    for (var i = 0, l = keys.length; i < l; i++) {
      var key = keys[i];
      def(target, key, src[key]);
    }
  }

  /**
   * Attempt to create an observer instance for a value,
   * returns the new observer if successfully observed,
   * or the existing observer if the value already has one.
   */
  function observe (value, asRootData) {
    if (!isObject(value) || value instanceof VNode) {
      return
    }
    var ob;
    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
      ob = value.__ob__;
    } else if (
      shouldObserve &&
      !isServerRendering() &&
      (Array.isArray(value) || isPlainObject(value)) &&
      Object.isExtensible(value) &&
      !value._isVue
    ) {
      ob = new Observer(value);
    }
    if (asRootData && ob) {
      ob.vmCount++;
    }
    return ob
  }

  /**
   * Define a reactive property on an Object.
   */
  function defineReactive (
    obj,
    key,
    val,
    customSetter,
    shallow
  ) {
    var dep = new Dep();

    var property = Object.getOwnPropertyDescriptor(obj, key);
    if (property && property.configurable === false) {
      return
    }

    // cater for pre-defined getter/setters
    var getter = property && property.get;
    if (!getter && arguments.length === 2) {
      val = obj[key];
    }
    var setter = property && property.set;

    var childOb = !shallow && observe(val);
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function reactiveGetter () {
        var value = getter ? getter.call(obj) : val;
        if (Dep.target) {
          dep.depend();
          if (childOb) {
            childOb.dep.depend();
            if (Array.isArray(value)) {
              dependArray(value);
            }
          }
        }
        return value
      },
      set: function reactiveSetter (newVal) {
        var value = getter ? getter.call(obj) : val;
        /* eslint-disable no-self-compare */
        if (newVal === value || (newVal !== newVal && value !== value)) {
          return
        }
        if (setter) {
          setter.call(obj, newVal);
        } else {
          val = newVal;
        }
        childOb = !shallow && observe(newVal);
        dep.notify();
      }
    });
  }

  /**
   * Set a property on an object. Adds the new property and
   * triggers change notification if the property doesn't
   * already exist.
   */
  function set (target, key, val) {
    if (Array.isArray(target) && isValidArrayIndex(key)) {
      target.length = Math.max(target.length, key);
      target.splice(key, 1, val);
      return val
    }
    if (key in target && !(key in Object.prototype)) {
      target[key] = val;
      return val
    }
    var ob = (target).__ob__;
    if (target._isVue || (ob && ob.vmCount)) {
      return val
    }
    if (!ob) {
      target[key] = val;
      return val
    }
    defineReactive(ob.value, key, val);
    ob.dep.notify();
    return val
  }

  /**
   * Delete a property and trigger change if necessary.
   */
  function del (target, key) {
    if (Array.isArray(target) && isValidArrayIndex(key)) {
      target.splice(key, 1);
      return
    }
    var ob = (target).__ob__;
    if (target._isVue || (ob && ob.vmCount)) {
      return
    }
    if (!hasOwn(target, key)) {
      return
    }
    delete target[key];
    if (!ob) {
      return
    }
    ob.dep.notify();
  }

  /**
   * Collect dependencies on array elements when the array is touched, since
   * we cannot intercept array element access like property getters.
   */
  function dependArray (value) {
    for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
      e = value[i];
      e && e.__ob__ && e.__ob__.dep.depend();
      if (Array.isArray(e)) {
        dependArray(e);
      }
    }
  }

  /*  */

  /**
   * Option overwriting strategies are functions that handle
   * how to merge a parent option value and a child option
   * value into the final value.
   */
  var strats = config.optionMergeStrategies;

  /**
   * Helper that recursively merges two data objects together.
   */
  function mergeData (to, from) {
    if (!from) { return to }
    var key, toVal, fromVal;
    var keys = Object.keys(from);
    for (var i = 0; i < keys.length; i++) {
      key = keys[i];
      toVal = to[key];
      fromVal = from[key];
      if (!hasOwn(to, key)) {
        set(to, key, fromVal);
      } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
        mergeData(toVal, fromVal);
      }
    }
    return to
  }

  /**
   * Data
   */
  function mergeDataOrFn (
    parentVal,
    childVal,
    vm
  ) {
    if (!vm) {
      // in a Vue.extend merge, both should be functions
      if (!childVal) {
        return parentVal
      }
      if (!parentVal) {
        return childVal
      }
      // when parentVal & childVal are both present,
      // we need to return a function that returns the
      // merged result of both functions... no need to
      // check if parentVal is a function here because
      // it has to be a function to pass previous merges.
      return function mergedDataFn () {
        return mergeData(
          typeof childVal === 'function' ? childVal.call(this, this) : childVal,
          typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
        )
      }
    } else {
      return function mergedInstanceDataFn () {
        // instance merge
        var instanceData = typeof childVal === 'function'
          ? childVal.call(vm, vm)
          : childVal;
        var defaultData = typeof parentVal === 'function'
          ? parentVal.call(vm, vm)
          : parentVal;
        if (instanceData) {
          return mergeData(instanceData, defaultData)
        } else {
          return defaultData
        }
      }
    }
  }

  strats.data = function (
    parentVal,
    childVal,
    vm
  ) {
    if (!vm) {
      if (childVal && typeof childVal !== 'function') {

        return parentVal
      }
      return mergeDataOrFn(parentVal, childVal)
    }

    return mergeDataOrFn(parentVal, childVal, vm)
  };

  /**
   * Hooks and props are merged as arrays.
   */
  function mergeHook (
    parentVal,
    childVal
  ) {
    return childVal
      ? parentVal
        ? parentVal.concat(childVal)
        : Array.isArray(childVal)
          ? childVal
          : [childVal]
      : parentVal
  }

  LIFECYCLE_HOOKS.forEach(function (hook) {
    strats[hook] = mergeHook;
  });

  /**
   * Assets
   *
   * When a vm is present (instance creation), we need to do
   * a three-way merge between constructor options, instance
   * options and parent options.
   */
  function mergeAssets (
    parentVal,
    childVal,
    vm,
    key
  ) {
    var res = Object.create(parentVal || null);
    if (childVal) {
      return extend(res, childVal)
    } else {
      return res
    }
  }

  ASSET_TYPES.forEach(function (type) {
    strats[type + 's'] = mergeAssets;
  });

  /**
   * Watchers.
   *
   * Watchers hashes should not overwrite one
   * another, so we merge them as arrays.
   */
  strats.watch = function (
    parentVal,
    childVal,
    vm,
    key
  ) {
    // work around Firefox's Object.prototype.watch...
    if (parentVal === nativeWatch) { parentVal = undefined; }
    if (childVal === nativeWatch) { childVal = undefined; }
    /* istanbul ignore if */
    if (!childVal) { return Object.create(parentVal || null) }
    if (!parentVal) { return childVal }
    var ret = {};
    extend(ret, parentVal);
    for (var key$1 in childVal) {
      var parent = ret[key$1];
      var child = childVal[key$1];
      if (parent && !Array.isArray(parent)) {
        parent = [parent];
      }
      ret[key$1] = parent
        ? parent.concat(child)
        : Array.isArray(child) ? child : [child];
    }
    return ret
  };

  /**
   * Other object hashes.
   */
  strats.props =
  strats.methods =
  strats.inject =
  strats.computed = function (
    parentVal,
    childVal,
    vm,
    key
  ) {
    if (childVal && "production" !== 'production') {
      assertObjectType(key, childVal, vm);
    }
    if (!parentVal) { return childVal }
    var ret = Object.create(null);
    extend(ret, parentVal);
    if (childVal) { extend(ret, childVal); }
    return ret
  };
  strats.provide = mergeDataOrFn;

  /**
   * Default strategy.
   */
  var defaultStrat = function (parentVal, childVal) {
    return childVal === undefined
      ? parentVal
      : childVal
  };

  /**
   * Ensure all props option syntax are normalized into the
   * Object-based format.
   */
  function normalizeProps (options, vm) {
    var props = options.props;
    if (!props) { return }
    var res = {};
    var i, val, name;
    if (Array.isArray(props)) {
      i = props.length;
      while (i--) {
        val = props[i];
        if (typeof val === 'string') {
          name = camelize(val);
          res[name] = { type: null };
        }
      }
    } else if (isPlainObject(props)) {
      for (var key in props) {
        val = props[key];
        name = camelize(key);
        res[name] = isPlainObject(val)
          ? val
          : { type: val };
      }
    }
    options.props = res;
  }

  /**
   * Normalize all injections into Object-based format
   */
  function normalizeInject (options, vm) {
    var inject = options.inject;
    if (!inject) { return }
    var normalized = options.inject = {};
    if (Array.isArray(inject)) {
      for (var i = 0; i < inject.length; i++) {
        normalized[inject[i]] = { from: inject[i] };
      }
    } else if (isPlainObject(inject)) {
      for (var key in inject) {
        var val = inject[key];
        normalized[key] = isPlainObject(val)
          ? extend({ from: key }, val)
          : { from: val };
      }
    }
  }

  /**
   * Normalize raw function directives into object format.
   */
  function normalizeDirectives (options) {
    var dirs = options.directives;
    if (dirs) {
      for (var key in dirs) {
        var def = dirs[key];
        if (typeof def === 'function') {
          dirs[key] = { bind: def, update: def };
        }
      }
    }
  }

  function assertObjectType (name, value, vm) {
    if (!isPlainObject(value)) {
      warn(
        "Invalid value for option \"" + name + "\": expected an Object, " +
        "but got " + (toRawType(value)) + ".",
        vm
      );
    }
  }

  /**
   * Merge two option objects into a new one.
   * Core utility used in both instantiation and inheritance.
   */
  function mergeOptions (
    parent,
    child,
    vm
  ) {

    if (typeof child === 'function') {
      child = child.options;
    }

    normalizeProps(child, vm);
    normalizeInject(child, vm);
    normalizeDirectives(child);
    var extendsFrom = child.extends;
    if (extendsFrom) {
      parent = mergeOptions(parent, extendsFrom, vm);
    }
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
    var options = {};
    var key;
    for (key in parent) {
      mergeField(key);
    }
    for (key in child) {
      if (!hasOwn(parent, key)) {
        mergeField(key);
      }
    }
    function mergeField (key) {
      var strat = strats[key] || defaultStrat;
      options[key] = strat(parent[key], child[key], vm, key);
    }
    return options
  }

  /**
   * Resolve an asset.
   * This function is used because child instances need access
   * to assets defined in its ancestor chain.
   */
  function resolveAsset (
    options,
    type,
    id,
    warnMissing
  ) {
    /* istanbul ignore if */
    if (typeof id !== 'string') {
      return
    }
    var assets = options[type];
    // check local registration variations first
    if (hasOwn(assets, id)) { return assets[id] }
    var camelizedId = camelize(id);
    if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
    var PascalCaseId = capitalize(camelizedId);
    if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
    // fallback to prototype chain
    var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
    return res
  }

  /*  */

  function validateProp (
    key,
    propOptions,
    propsData,
    vm
  ) {
    var prop = propOptions[key];
    var absent = !hasOwn(propsData, key);
    var value = propsData[key];
    // boolean casting
    var booleanIndex = getTypeIndex(Boolean, prop.type);
    if (booleanIndex > -1) {
      if (absent && !hasOwn(prop, 'default')) {
        value = false;
      } else if (value === '' || value === hyphenate(key)) {
        // only cast empty string / same name to boolean if
        // boolean has higher priority
        var stringIndex = getTypeIndex(String, prop.type);
        if (stringIndex < 0 || booleanIndex < stringIndex) {
          value = true;
        }
      }
    }
    // check default value
    if (value === undefined) {
      value = getPropDefaultValue(vm, prop, key);
      // since the default value is a fresh copy,
      // make sure to observe it.
      var prevShouldObserve = shouldObserve;
      toggleObserving(true);
      observe(value);
      toggleObserving(prevShouldObserve);
    }
    return value
  }

  /**
   * Get the default value of a prop.
   */
  function getPropDefaultValue (vm, prop, key) {
    // no default, return undefined
    if (!hasOwn(prop, 'default')) {
      return undefined
    }
    var def = prop.default;
    // the raw prop value was also undefined from previous render,
    // return previous default value to avoid unnecessary watcher trigger
    if (vm && vm.$options.propsData &&
      vm.$options.propsData[key] === undefined &&
      vm._props[key] !== undefined
    ) {
      return vm._props[key]
    }
    // call factory function for non-Function types
    // a value is Function if its prototype is function even across different execution context
    return typeof def === 'function' && getType(prop.type) !== 'Function'
      ? def.call(vm)
      : def
  }

  /**
   * Use function string name to check built-in types,
   * because a simple equality check will fail when running
   * across different vms / iframes.
   */
  function getType (fn) {
    var match = fn && fn.toString().match(/^\s*function (\w+)/);
    return match ? match[1] : ''
  }

  function isSameType (a, b) {
    return getType(a) === getType(b)
  }

  function getTypeIndex (type, expectedTypes) {
    if (!Array.isArray(expectedTypes)) {
      return isSameType(expectedTypes, type) ? 0 : -1
    }
    for (var i = 0, len = expectedTypes.length; i < len; i++) {
      if (isSameType(expectedTypes[i], type)) {
        return i
      }
    }
    return -1
  }

  /*  */

  function handleError (err, vm, info) {
    if (vm) {
      var cur = vm;
      while ((cur = cur.$parent)) {
        var hooks = cur.$options.errorCaptured;
        if (hooks) {
          for (var i = 0; i < hooks.length; i++) {
            try {
              var capture = hooks[i].call(cur, err, vm, info) === false;
              if (capture) { return }
            } catch (e) {
              globalHandleError(e, cur, 'errorCaptured hook');
            }
          }
        }
      }
    }
    globalHandleError(err, vm, info);
  }

  function globalHandleError (err, vm, info) {
    if (config.errorHandler) {
      try {
        return config.errorHandler.call(null, err, vm, info)
      } catch (e) {
        logError(e, null, 'config.errorHandler');
      }
    }
    logError(err, vm, info);
  }

  function logError (err, vm, info) {
    /* istanbul ignore else */
    if ((inBrowser || inWeex) && typeof console !== 'undefined') {
      console.error(err);
    } else {
      throw err
    }
  }

  /*  */
  /* globals MessageChannel */

  var callbacks = [];
  var pending = false;

  function flushCallbacks () {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks.length = 0;
    for (var i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }

  // Here we have async deferring wrappers using both microtasks and (macro) tasks.
  // In < 2.4 we used microtasks everywhere, but there are some scenarios where
  // microtasks have too high a priority and fire in between supposedly
  // sequential events (e.g. #4521, #6690) or even between bubbling of the same
  // event (#6566). However, using (macro) tasks everywhere also has subtle problems
  // when state is changed right before repaint (e.g. #6813, out-in transitions).
  // Here we use microtask by default, but expose a way to force (macro) task when
  // needed (e.g. in event handlers attached by v-on).
  var microTimerFunc;
  var macroTimerFunc;
  var useMacroTask = false;

  // Determine (macro) task defer implementation.
  // Technically setImmediate should be the ideal choice, but it's only available
  // in IE. The only polyfill that consistently queues the callback after all DOM
  // events triggered in the same loop is by using MessageChannel.
  /* istanbul ignore if */
  if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
    macroTimerFunc = function () {
      setImmediate(flushCallbacks);
    };
  } else if (typeof MessageChannel !== 'undefined' && (
    isNative(MessageChannel) ||
    // PhantomJS
    MessageChannel.toString() === '[object MessageChannelConstructor]'
  )) {
    var channel = new MessageChannel();
    var port = channel.port2;
    channel.port1.onmessage = flushCallbacks;
    macroTimerFunc = function () {
      port.postMessage(1);
    };
  } else {
    /* istanbul ignore next */
    macroTimerFunc = function () {
      setTimeout(flushCallbacks, 0);
    };
  }

  // Determine microtask defer implementation.
  /* istanbul ignore next, $flow-disable-line */
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
    var p = Promise.resolve();
    microTimerFunc = function () {
      p.then(flushCallbacks);
      // in problematic UIWebViews, Promise.then doesn't completely break, but
      // it can get stuck in a weird state where callbacks are pushed into the
      // microtask queue but the queue isn't being flushed, until the browser
      // needs to do some other work, e.g. handle a timer. Therefore we can
      // "force" the microtask queue to be flushed by adding an empty timer.
      if (isIOS) { setTimeout(noop); }
    };
  } else {
    // fallback to macro
    microTimerFunc = macroTimerFunc;
  }

  /**
   * Wrap a function so that if any code inside triggers state change,
   * the changes are queued using a (macro) task instead of a microtask.
   */
  function withMacroTask (fn) {
    return fn._withTask || (fn._withTask = function () {
      useMacroTask = true;
      var res = fn.apply(null, arguments);
      useMacroTask = false;
      return res
    })
  }

  function nextTick (cb, ctx) {
    var _resolve;
    callbacks.push(function () {
      if (cb) {
        try {
          cb.call(ctx);
        } catch (e) {
          handleError(e, ctx, 'nextTick');
        }
      } else if (_resolve) {
        _resolve(ctx);
      }
    });
    if (!pending) {
      pending = true;
      if (useMacroTask) {
        macroTimerFunc();
      } else {
        microTimerFunc();
      }
    }
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
      return new Promise(function (resolve) {
        _resolve = resolve;
      })
    }
  }

  /*  */

  var seenObjects = new _Set();

  /**
   * Recursively traverse an object to evoke all converted
   * getters, so that every nested property inside the object
   * is collected as a "deep" dependency.
   */
  function traverse (val) {
    _traverse(val, seenObjects);
    seenObjects.clear();
  }

  function _traverse (val, seen) {
    var i, keys;
    var isA = Array.isArray(val);
    if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
      return
    }
    if (val.__ob__) {
      var depId = val.__ob__.dep.id;
      if (seen.has(depId)) {
        return
      }
      seen.add(depId);
    }
    if (isA) {
      i = val.length;
      while (i--) { _traverse(val[i], seen); }
    } else {
      keys = Object.keys(val);
      i = keys.length;
      while (i--) { _traverse(val[keys[i]], seen); }
    }
  }

  /*  */

  var normalizeEvent = cached(function (name) {
    var passive = name.charAt(0) === '&';
    name = passive ? name.slice(1) : name;
    var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
    name = once$$1 ? name.slice(1) : name;
    var capture = name.charAt(0) === '!';
    name = capture ? name.slice(1) : name;
    return {
      name: name,
      once: once$$1,
      capture: capture,
      passive: passive
    }
  });

  function createFnInvoker (fns) {
    function invoker () {
      var arguments$1 = arguments;

      var fns = invoker.fns;
      if (Array.isArray(fns)) {
        var cloned = fns.slice();
        for (var i = 0; i < cloned.length; i++) {
          cloned[i].apply(null, arguments$1);
        }
      } else {
        // return handler return value for single handlers
        return fns.apply(null, arguments)
      }
    }
    invoker.fns = fns;
    return invoker
  }

  function updateListeners (
    on,
    oldOn,
    add,
    remove$$1,
    vm
  ) {
    var name, def, cur, old, event;
    for (name in on) {
      def = cur = on[name];
      old = oldOn[name];
      event = normalizeEvent(name);
      /* istanbul ignore if */
      if (isUndef(cur)) ; else if (isUndef(old)) {
        if (isUndef(cur.fns)) {
          cur = on[name] = createFnInvoker(cur);
        }
        add(event.name, cur, event.once, event.capture, event.passive, event.params);
      } else if (cur !== old) {
        old.fns = cur;
        on[name] = old;
      }
    }
    for (name in oldOn) {
      if (isUndef(on[name])) {
        event = normalizeEvent(name);
        remove$$1(event.name, oldOn[name], event.capture);
      }
    }
  }

  /*  */

  function mergeVNodeHook (def, hookKey, hook) {
    if (def instanceof VNode) {
      def = def.data.hook || (def.data.hook = {});
    }
    var invoker;
    var oldHook = def[hookKey];

    function wrappedHook () {
      hook.apply(this, arguments);
      // important: remove merged hook to ensure it's called only once
      // and prevent memory leak
      remove(invoker.fns, wrappedHook);
    }

    if (isUndef(oldHook)) {
      // no existing hook
      invoker = createFnInvoker([wrappedHook]);
    } else {
      /* istanbul ignore if */
      if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
        // already a merged invoker
        invoker = oldHook;
        invoker.fns.push(wrappedHook);
      } else {
        // existing plain hook
        invoker = createFnInvoker([oldHook, wrappedHook]);
      }
    }

    invoker.merged = true;
    def[hookKey] = invoker;
  }

  /*  */

  function extractPropsFromVNodeData (
    data,
    Ctor,
    tag
  ) {
    // we are only extracting raw values here.
    // validation and default values are handled in the child
    // component itself.
    var propOptions = Ctor.options.props;
    if (isUndef(propOptions)) {
      return
    }
    var res = {};
    var attrs = data.attrs;
    var props = data.props;
    if (isDef(attrs) || isDef(props)) {
      for (var key in propOptions) {
        var altKey = hyphenate(key);
        checkProp(res, props, key, altKey, true) ||
        checkProp(res, attrs, key, altKey, false);
      }
    }
    return res
  }

  function checkProp (
    res,
    hash,
    key,
    altKey,
    preserve
  ) {
    if (isDef(hash)) {
      if (hasOwn(hash, key)) {
        res[key] = hash[key];
        if (!preserve) {
          delete hash[key];
        }
        return true
      } else if (hasOwn(hash, altKey)) {
        res[key] = hash[altKey];
        if (!preserve) {
          delete hash[altKey];
        }
        return true
      }
    }
    return false
  }

  /*  */

  // The template compiler attempts to minimize the need for normalization by
  // statically analyzing the template at compile time.
  //
  // For plain HTML markup, normalization can be completely skipped because the
  // generated render function is guaranteed to return Array<VNode>. There are
  // two cases where extra normalization is needed:

  // 1. When the children contains components - because a functional component
  // may return an Array instead of a single root. In this case, just a simple
  // normalization is needed - if any child is an Array, we flatten the whole
  // thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
  // because functional components already normalize their own children.
  function simpleNormalizeChildren (children) {
    for (var i = 0; i < children.length; i++) {
      if (Array.isArray(children[i])) {
        return Array.prototype.concat.apply([], children)
      }
    }
    return children
  }

  // 2. When the children contains constructs that always generated nested Arrays,
  // e.g. <template>, <slot>, v-for, or when the children is provided by user
  // with hand-written render functions / JSX. In such cases a full normalization
  // is needed to cater to all possible types of children values.
  function normalizeChildren (children) {
    return isPrimitive(children)
      ? [createTextVNode(children)]
      : Array.isArray(children)
        ? normalizeArrayChildren(children)
        : undefined
  }

  function isTextNode (node) {
    return isDef(node) && isDef(node.text) && isFalse(node.isComment)
  }

  function normalizeArrayChildren (children, nestedIndex) {
    var res = [];
    var i, c, lastIndex, last;
    for (i = 0; i < children.length; i++) {
      c = children[i];
      if (isUndef(c) || typeof c === 'boolean') { continue }
      lastIndex = res.length - 1;
      last = res[lastIndex];
      //  nested
      if (Array.isArray(c)) {
        if (c.length > 0) {
          c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
          // merge adjacent text nodes
          if (isTextNode(c[0]) && isTextNode(last)) {
            res[lastIndex] = createTextVNode(last.text + (c[0]).text);
            c.shift();
          }
          res.push.apply(res, c);
        }
      } else if (isPrimitive(c)) {
        if (isTextNode(last)) {
          // merge adjacent text nodes
          // this is necessary for SSR hydration because text nodes are
          // essentially merged when rendered to HTML strings
          res[lastIndex] = createTextVNode(last.text + c);
        } else if (c !== '') {
          // convert primitive to vnode
          res.push(createTextVNode(c));
        }
      } else {
        if (isTextNode(c) && isTextNode(last)) {
          // merge adjacent text nodes
          res[lastIndex] = createTextVNode(last.text + c.text);
        } else {
          // default key for nested array children (likely generated by v-for)
          if (isTrue(children._isVList) &&
            isDef(c.tag) &&
            isUndef(c.key) &&
            isDef(nestedIndex)) {
            c.key = "__vlist" + nestedIndex + "_" + i + "__";
          }
          res.push(c);
        }
      }
    }
    return res
  }

  /*  */

  function ensureCtor (comp, base) {
    if (
      comp.__esModule ||
      (hasSymbol && comp[Symbol.toStringTag] === 'Module')
    ) {
      comp = comp.default;
    }
    return isObject(comp)
      ? base.extend(comp)
      : comp
  }

  function createAsyncPlaceholder (
    factory,
    data,
    context,
    children,
    tag
  ) {
    var node = createEmptyVNode();
    node.asyncFactory = factory;
    node.asyncMeta = { data: data, context: context, children: children, tag: tag };
    return node
  }

  function resolveAsyncComponent (
    factory,
    baseCtor,
    context
  ) {
    if (isTrue(factory.error) && isDef(factory.errorComp)) {
      return factory.errorComp
    }

    if (isDef(factory.resolved)) {
      return factory.resolved
    }

    if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
      return factory.loadingComp
    }

    if (isDef(factory.contexts)) {
      // already pending
      factory.contexts.push(context);
    } else {
      var contexts = factory.contexts = [context];
      var sync = true;

      var forceRender = function () {
        for (var i = 0, l = contexts.length; i < l; i++) {
          contexts[i].$forceUpdate();
        }
      };

      var resolve = once(function (res) {
        // cache resolved
        factory.resolved = ensureCtor(res, baseCtor);
        // invoke callbacks only if this is not a synchronous resolve
        // (async resolves are shimmed as synchronous during SSR)
        if (!sync) {
          forceRender();
        }
      });

      var reject = once(function (reason) {
        if (isDef(factory.errorComp)) {
          factory.error = true;
          forceRender();
        }
      });

      var res = factory(resolve, reject);

      if (isObject(res)) {
        if (typeof res.then === 'function') {
          // () => Promise
          if (isUndef(factory.resolved)) {
            res.then(resolve, reject);
          }
        } else if (isDef(res.component) && typeof res.component.then === 'function') {
          res.component.then(resolve, reject);

          if (isDef(res.error)) {
            factory.errorComp = ensureCtor(res.error, baseCtor);
          }

          if (isDef(res.loading)) {
            factory.loadingComp = ensureCtor(res.loading, baseCtor);
            if (res.delay === 0) {
              factory.loading = true;
            } else {
              setTimeout(function () {
                if (isUndef(factory.resolved) && isUndef(factory.error)) {
                  factory.loading = true;
                  forceRender();
                }
              }, res.delay || 200);
            }
          }

          if (isDef(res.timeout)) {
            setTimeout(function () {
              if (isUndef(factory.resolved)) {
                reject(
                  null
                );
              }
            }, res.timeout);
          }
        }
      }

      sync = false;
      // return in case resolved synchronously
      return factory.loading
        ? factory.loadingComp
        : factory.resolved
    }
  }

  /*  */

  function isAsyncPlaceholder (node) {
    return node.isComment && node.asyncFactory
  }

  /*  */

  function getFirstComponentChild (children) {
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; i++) {
        var c = children[i];
        if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
          return c
        }
      }
    }
  }

  /*  */

  /*  */

  function initEvents (vm) {
    vm._events = Object.create(null);
    vm._hasHookEvent = false;
    // init parent attached events
    var listeners = vm.$options._parentListeners;
    if (listeners) {
      updateComponentListeners(vm, listeners);
    }
  }

  var target;

  function add (event, fn, once) {
    if (once) {
      target.$once(event, fn);
    } else {
      target.$on(event, fn);
    }
  }

  function remove$1 (event, fn) {
    target.$off(event, fn);
  }

  function updateComponentListeners (
    vm,
    listeners,
    oldListeners
  ) {
    target = vm;
    updateListeners(listeners, oldListeners || {}, add, remove$1, vm);
    target = undefined;
  }

  function eventsMixin (Vue) {
    var hookRE = /^hook:/;
    Vue.prototype.$on = function (event, fn) {
      var this$1 = this;

      var vm = this;
      if (Array.isArray(event)) {
        for (var i = 0, l = event.length; i < l; i++) {
          this$1.$on(event[i], fn);
        }
      } else {
        (vm._events[event] || (vm._events[event] = [])).push(fn);
        // optimize hook:event cost by using a boolean flag marked at registration
        // instead of a hash lookup
        if (hookRE.test(event)) {
          vm._hasHookEvent = true;
        }
      }
      return vm
    };

    Vue.prototype.$once = function (event, fn) {
      var vm = this;
      function on () {
        vm.$off(event, on);
        fn.apply(vm, arguments);
      }
      on.fn = fn;
      vm.$on(event, on);
      return vm
    };

    Vue.prototype.$off = function (event, fn) {
      var this$1 = this;

      var vm = this;
      // all
      if (!arguments.length) {
        vm._events = Object.create(null);
        return vm
      }
      // array of events
      if (Array.isArray(event)) {
        for (var i = 0, l = event.length; i < l; i++) {
          this$1.$off(event[i], fn);
        }
        return vm
      }
      // specific event
      var cbs = vm._events[event];
      if (!cbs) {
        return vm
      }
      if (!fn) {
        vm._events[event] = null;
        return vm
      }
      if (fn) {
        // specific handler
        var cb;
        var i$1 = cbs.length;
        while (i$1--) {
          cb = cbs[i$1];
          if (cb === fn || cb.fn === fn) {
            cbs.splice(i$1, 1);
            break
          }
        }
      }
      return vm
    };

    Vue.prototype.$emit = function (event) {
      var vm = this;
      var cbs = vm._events[event];
      if (cbs) {
        cbs = cbs.length > 1 ? toArray(cbs) : cbs;
        var args = toArray(arguments, 1);
        for (var i = 0, l = cbs.length; i < l; i++) {
          try {
            cbs[i].apply(vm, args);
          } catch (e) {
            handleError(e, vm, ("event handler for \"" + event + "\""));
          }
        }
      }
      return vm
    };
  }

  /*  */



  /**
   * Runtime helper for resolving raw children VNodes into a slot object.
   */
  function resolveSlots (
    children,
    context
  ) {
    var slots = {};
    if (!children) {
      return slots
    }
    for (var i = 0, l = children.length; i < l; i++) {
      var child = children[i];
      var data = child.data;
      // remove slot attribute if the node is resolved as a Vue slot node
      if (data && data.attrs && data.attrs.slot) {
        delete data.attrs.slot;
      }
      // named slots should only be respected if the vnode was rendered in the
      // same context.
      if ((child.context === context || child.fnContext === context) &&
        data && data.slot != null
      ) {
        var name = data.slot;
        var slot = (slots[name] || (slots[name] = []));
        if (child.tag === 'template') {
          slot.push.apply(slot, child.children || []);
        } else {
          slot.push(child);
        }
      } else {
        (slots.default || (slots.default = [])).push(child);
      }
    }
    // ignore slots that contains only whitespace
    for (var name$1 in slots) {
      if (slots[name$1].every(isWhitespace)) {
        delete slots[name$1];
      }
    }
    return slots
  }

  function isWhitespace (node) {
    return (node.isComment && !node.asyncFactory) || node.text === ' '
  }

  function resolveScopedSlots (
    fns, // see flow/vnode
    res
  ) {
    res = res || {};
    for (var i = 0; i < fns.length; i++) {
      if (Array.isArray(fns[i])) {
        resolveScopedSlots(fns[i], res);
      } else {
        res[fns[i].key] = fns[i].fn;
      }
    }
    return res
  }

  /*  */

  var activeInstance = null;

  function initLifecycle (vm) {
    var options = vm.$options;

    // locate first non-abstract parent
    var parent = options.parent;
    if (parent && !options.abstract) {
      while (parent.$options.abstract && parent.$parent) {
        parent = parent.$parent;
      }
      parent.$children.push(vm);
    }

    vm.$parent = parent;
    vm.$root = parent ? parent.$root : vm;

    vm.$children = [];
    vm.$refs = {};

    vm._watcher = null;
    vm._inactive = null;
    vm._directInactive = false;
    vm._isMounted = false;
    vm._isDestroyed = false;
    vm._isBeingDestroyed = false;
  }

  function lifecycleMixin (Vue) {
    Vue.prototype._update = function (vnode, hydrating) {
      var vm = this;
      if (vm._isMounted) {
        callHook(vm, 'beforeUpdate');
      }
      var prevEl = vm.$el;
      var prevVnode = vm._vnode;
      var prevActiveInstance = activeInstance;
      activeInstance = vm;
      vm._vnode = vnode;
      // Vue.prototype.__patch__ is injected in entry points
      // based on the rendering backend used.
      if (!prevVnode) {
        // initial render
        vm.$el = vm.__patch__(
          vm.$el, vnode, hydrating, false /* removeOnly */,
          vm.$options._parentElm,
          vm.$options._refElm
        );
        // no need for the ref nodes after initial patch
        // this prevents keeping a detached DOM tree in memory (#5851)
        vm.$options._parentElm = vm.$options._refElm = null;
      } else {
        // updates
        vm.$el = vm.__patch__(prevVnode, vnode);
      }
      activeInstance = prevActiveInstance;
      // update __vue__ reference
      if (prevEl) {
        prevEl.__vue__ = null;
      }
      if (vm.$el) {
        vm.$el.__vue__ = vm;
      }
      // if parent is an HOC, update its $el as well
      if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
        vm.$parent.$el = vm.$el;
      }
      // updated hook is called by the scheduler to ensure that children are
      // updated in a parent's updated hook.
    };

    Vue.prototype.$forceUpdate = function () {
      var vm = this;
      if (vm._watcher) {
        vm._watcher.update();
      }
    };

    Vue.prototype.$destroy = function () {
      var vm = this;
      if (vm._isBeingDestroyed) {
        return
      }
      callHook(vm, 'beforeDestroy');
      vm._isBeingDestroyed = true;
      // remove self from parent
      var parent = vm.$parent;
      if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
        remove(parent.$children, vm);
      }
      // teardown watchers
      if (vm._watcher) {
        vm._watcher.teardown();
      }
      var i = vm._watchers.length;
      while (i--) {
        vm._watchers[i].teardown();
      }
      // remove reference from data ob
      // frozen object may not have observer.
      if (vm._data.__ob__) {
        vm._data.__ob__.vmCount--;
      }
      // call the last hook...
      vm._isDestroyed = true;
      // invoke destroy hooks on current rendered tree
      vm.__patch__(vm._vnode, null);
      // fire destroyed hook
      callHook(vm, 'destroyed');
      // turn off all instance listeners.
      vm.$off();
      // remove __vue__ reference
      if (vm.$el) {
        vm.$el.__vue__ = null;
      }
      // release circular reference (#6759)
      if (vm.$vnode) {
        vm.$vnode.parent = null;
      }
    };
  }

  function mountComponent (
    vm,
    el,
    hydrating
  ) {
    vm.$el = el;
    if (!vm.$options.render) {
      vm.$options.render = createEmptyVNode;
    }
    callHook(vm, 'beforeMount');

    var updateComponent;
    /* istanbul ignore if */
    {
      updateComponent = function () {
        vm._update(vm._render(), hydrating);
      };
    }

    // we set this to vm._watcher inside the watcher's constructor
    // since the watcher's initial patch may call $forceUpdate (e.g. inside child
    // component's mounted hook), which relies on vm._watcher being already defined
    new Watcher(vm, updateComponent, noop, null, true /* isRenderWatcher */);
    hydrating = false;

    // manually mounted instance, call mounted on self
    // mounted is called for render-created child components in its inserted hook
    if (vm.$vnode == null) {
      vm._isMounted = true;
      callHook(vm, 'mounted');
    }
    return vm
  }

  function updateChildComponent (
    vm,
    propsData,
    listeners,
    parentVnode,
    renderChildren
  ) {

    // determine whether component has slot children
    // we need to do this before overwriting $options._renderChildren
    var hasChildren = !!(
      renderChildren ||               // has new static slots
      vm.$options._renderChildren ||  // has old static slots
      parentVnode.data.scopedSlots || // has new scoped slots
      vm.$scopedSlots !== emptyObject // has old scoped slots
    );

    vm.$options._parentVnode = parentVnode;
    vm.$vnode = parentVnode; // update vm's placeholder node without re-render

    if (vm._vnode) { // update child tree's parent
      vm._vnode.parent = parentVnode;
    }
    vm.$options._renderChildren = renderChildren;

    // update $attrs and $listeners hash
    // these are also reactive so they may trigger child update if the child
    // used them during render
    vm.$attrs = parentVnode.data.attrs || emptyObject;
    vm.$listeners = listeners || emptyObject;

    // update props
    if (propsData && vm.$options.props) {
      toggleObserving(false);
      var props = vm._props;
      var propKeys = vm.$options._propKeys || [];
      for (var i = 0; i < propKeys.length; i++) {
        var key = propKeys[i];
        var propOptions = vm.$options.props; // wtf flow?
        props[key] = validateProp(key, propOptions, propsData, vm);
      }
      toggleObserving(true);
      // keep a copy of raw propsData
      vm.$options.propsData = propsData;
    }

    // update listeners
    listeners = listeners || emptyObject;
    var oldListeners = vm.$options._parentListeners;
    vm.$options._parentListeners = listeners;
    updateComponentListeners(vm, listeners, oldListeners);

    // resolve slots + force update if has children
    if (hasChildren) {
      vm.$slots = resolveSlots(renderChildren, parentVnode.context);
      vm.$forceUpdate();
    }
  }

  function isInInactiveTree (vm) {
    while (vm && (vm = vm.$parent)) {
      if (vm._inactive) { return true }
    }
    return false
  }

  function activateChildComponent (vm, direct) {
    if (direct) {
      vm._directInactive = false;
      if (isInInactiveTree(vm)) {
        return
      }
    } else if (vm._directInactive) {
      return
    }
    if (vm._inactive || vm._inactive === null) {
      vm._inactive = false;
      for (var i = 0; i < vm.$children.length; i++) {
        activateChildComponent(vm.$children[i]);
      }
      callHook(vm, 'activated');
    }
  }

  function deactivateChildComponent (vm, direct) {
    if (direct) {
      vm._directInactive = true;
      if (isInInactiveTree(vm)) {
        return
      }
    }
    if (!vm._inactive) {
      vm._inactive = true;
      for (var i = 0; i < vm.$children.length; i++) {
        deactivateChildComponent(vm.$children[i]);
      }
      callHook(vm, 'deactivated');
    }
  }

  function callHook (vm, hook) {
    // #7573 disable dep collection when invoking lifecycle hooks
    pushTarget();
    var handlers = vm.$options[hook];
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        try {
          handlers[i].call(vm);
        } catch (e) {
          handleError(e, vm, (hook + " hook"));
        }
      }
    }
    if (vm._hasHookEvent) {
      vm.$emit('hook:' + hook);
    }
    popTarget();
  }

  var queue = [];
  var activatedChildren = [];
  var has = {};
  var waiting = false;
  var flushing = false;
  var index = 0;

  /**
   * Reset the scheduler's state.
   */
  function resetSchedulerState () {
    index = queue.length = activatedChildren.length = 0;
    has = {};
    waiting = flushing = false;
  }

  /**
   * Flush both queues and run the watchers.
   */
  function flushSchedulerQueue () {
    flushing = true;
    var watcher, id;

    // Sort queue before flush.
    // This ensures that:
    // 1. Components are updated from parent to child. (because parent is always
    //    created before the child)
    // 2. A component's user watchers are run before its render watcher (because
    //    user watchers are created before the render watcher)
    // 3. If a component is destroyed during a parent component's watcher run,
    //    its watchers can be skipped.
    queue.sort(function (a, b) { return a.id - b.id; });

    // do not cache length because more watchers might be pushed
    // as we run existing watchers
    for (index = 0; index < queue.length; index++) {
      watcher = queue[index];
      id = watcher.id;
      has[id] = null;
      watcher.run();
    }

    // keep copies of post queues before resetting state
    var activatedQueue = activatedChildren.slice();
    var updatedQueue = queue.slice();

    resetSchedulerState();

    // call component updated and activated hooks
    callActivatedHooks(activatedQueue);
    callUpdatedHooks(updatedQueue);

    // devtool hook
    /* istanbul ignore if */
    if (devtools && config.devtools) {
      devtools.emit('flush');
    }
  }

  function callUpdatedHooks (queue) {
    var i = queue.length;
    while (i--) {
      var watcher = queue[i];
      var vm = watcher.vm;
      if (vm._watcher === watcher && vm._isMounted) {
        callHook(vm, 'updated');
      }
    }
  }

  /**
   * Queue a kept-alive component that was activated during patch.
   * The queue will be processed after the entire tree has been patched.
   */
  function queueActivatedComponent (vm) {
    // setting _inactive to false here so that a render function can
    // rely on checking whether it's in an inactive tree (e.g. router-view)
    vm._inactive = false;
    activatedChildren.push(vm);
  }

  function callActivatedHooks (queue) {
    for (var i = 0; i < queue.length; i++) {
      queue[i]._inactive = true;
      activateChildComponent(queue[i], true /* true */);
    }
  }

  /**
   * Push a watcher into the watcher queue.
   * Jobs with duplicate IDs will be skipped unless it's
   * pushed when the queue is being flushed.
   */
  function queueWatcher (watcher) {
    var id = watcher.id;
    if (has[id] == null) {
      has[id] = true;
      if (!flushing) {
        queue.push(watcher);
      } else {
        // if already flushing, splice the watcher based on its id
        // if already past its id, it will be run next immediately.
        var i = queue.length - 1;
        while (i > index && queue[i].id > watcher.id) {
          i--;
        }
        queue.splice(i + 1, 0, watcher);
      }
      // queue the flush
      if (!waiting) {
        waiting = true;
        nextTick(flushSchedulerQueue);
      }
    }
  }

  /*  */

  var uid$1 = 0;

  /**
   * A watcher parses an expression, collects dependencies,
   * and fires callback when the expression value changes.
   * This is used for both the $watch() api and directives.
   */
  var Watcher = function Watcher (
    vm,
    expOrFn,
    cb,
    options,
    isRenderWatcher
  ) {
    this.vm = vm;
    if (isRenderWatcher) {
      vm._watcher = this;
    }
    vm._watchers.push(this);
    // options
    if (options) {
      this.deep = !!options.deep;
      this.user = !!options.user;
      this.lazy = !!options.lazy;
      this.sync = !!options.sync;
    } else {
      this.deep = this.user = this.lazy = this.sync = false;
    }
    this.cb = cb;
    this.id = ++uid$1; // uid for batching
    this.active = true;
    this.dirty = this.lazy; // for lazy watchers
    this.deps = [];
    this.newDeps = [];
    this.depIds = new _Set();
    this.newDepIds = new _Set();
    this.expression = '';
    // parse expression for getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn;
    } else {
      this.getter = parsePath(expOrFn);
      if (!this.getter) {
        this.getter = function () {};
      }
    }
    this.value = this.lazy
      ? undefined
      : this.get();
  };

  /**
   * Evaluate the getter, and re-collect dependencies.
   */
  Watcher.prototype.get = function get () {
    pushTarget(this);
    var value;
    var vm = this.vm;
    try {
      value = this.getter.call(vm, vm);
    } catch (e) {
      if (this.user) {
        handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
      } else {
        throw e
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        traverse(value);
      }
      popTarget();
      this.cleanupDeps();
    }
    return value
  };

  /**
   * Add a dependency to this directive.
   */
  Watcher.prototype.addDep = function addDep (dep) {
    var id = dep.id;
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id);
      this.newDeps.push(dep);
      if (!this.depIds.has(id)) {
        dep.addSub(this);
      }
    }
  };

  /**
   * Clean up for dependency collection.
   */
  Watcher.prototype.cleanupDeps = function cleanupDeps () {
      var this$1 = this;

    var i = this.deps.length;
    while (i--) {
      var dep = this$1.deps[i];
      if (!this$1.newDepIds.has(dep.id)) {
        dep.removeSub(this$1);
      }
    }
    var tmp = this.depIds;
    this.depIds = this.newDepIds;
    this.newDepIds = tmp;
    this.newDepIds.clear();
    tmp = this.deps;
    this.deps = this.newDeps;
    this.newDeps = tmp;
    this.newDeps.length = 0;
  };

  /**
   * Subscriber interface.
   * Will be called when a dependency changes.
   */
  Watcher.prototype.update = function update () {
    /* istanbul ignore else */
    if (this.lazy) {
      this.dirty = true;
    } else if (this.sync) {
      this.run();
    } else {
      queueWatcher(this);
    }
  };

  /**
   * Scheduler job interface.
   * Will be called by the scheduler.
   */
  Watcher.prototype.run = function run () {
    if (this.active) {
      var value = this.get();
      if (
        value !== this.value ||
        // Deep watchers and watchers on Object/Arrays should fire even
        // when the value is the same, because the value may
        // have mutated.
        isObject(value) ||
        this.deep
      ) {
        // set new value
        var oldValue = this.value;
        this.value = value;
        if (this.user) {
          try {
            this.cb.call(this.vm, value, oldValue);
          } catch (e) {
            handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
          }
        } else {
          this.cb.call(this.vm, value, oldValue);
        }
      }
    }
  };

  /**
   * Evaluate the value of the watcher.
   * This only gets called for lazy watchers.
   */
  Watcher.prototype.evaluate = function evaluate () {
    this.value = this.get();
    this.dirty = false;
  };

  /**
   * Depend on all deps collected by this watcher.
   */
  Watcher.prototype.depend = function depend () {
      var this$1 = this;

    var i = this.deps.length;
    while (i--) {
      this$1.deps[i].depend();
    }
  };

  /**
   * Remove self from all dependencies' subscriber list.
   */
  Watcher.prototype.teardown = function teardown () {
      var this$1 = this;

    if (this.active) {
      // remove self from vm's watcher list
      // this is a somewhat expensive operation so we skip it
      // if the vm is being destroyed.
      if (!this.vm._isBeingDestroyed) {
        remove(this.vm._watchers, this);
      }
      var i = this.deps.length;
      while (i--) {
        this$1.deps[i].removeSub(this$1);
      }
      this.active = false;
    }
  };

  /*  */

  var sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
  };

  function proxy (target, sourceKey, key) {
    sharedPropertyDefinition.get = function proxyGetter () {
      return this[sourceKey][key]
    };
    sharedPropertyDefinition.set = function proxySetter (val) {
      this[sourceKey][key] = val;
    };
    Object.defineProperty(target, key, sharedPropertyDefinition);
  }

  function initState (vm) {
    vm._watchers = [];
    var opts = vm.$options;
    if (opts.props) { initProps(vm, opts.props); }
    if (opts.methods) { initMethods(vm, opts.methods); }
    if (opts.data) {
      initData(vm);
    } else {
      observe(vm._data = {}, true /* asRootData */);
    }
    if (opts.computed) { initComputed(vm, opts.computed); }
    if (opts.watch && opts.watch !== nativeWatch) {
      initWatch(vm, opts.watch);
    }
  }

  function initProps (vm, propsOptions) {
    var propsData = vm.$options.propsData || {};
    var props = vm._props = {};
    // cache prop keys so that future props updates can iterate using Array
    // instead of dynamic object key enumeration.
    var keys = vm.$options._propKeys = [];
    var isRoot = !vm.$parent;
    // root instance props should be converted
    if (!isRoot) {
      toggleObserving(false);
    }
    var loop = function ( key ) {
      keys.push(key);
      var value = validateProp(key, propsOptions, propsData, vm);
      /* istanbul ignore else */
      {
        defineReactive(props, key, value);
      }
      // static props are already proxied on the component's prototype
      // during Vue.extend(). We only need to proxy props defined at
      // instantiation here.
      if (!(key in vm)) {
        proxy(vm, "_props", key);
      }
    };

    for (var key in propsOptions) loop( key );
    toggleObserving(true);
  }

  function initData (vm) {
    var data = vm.$options.data;
    data = vm._data = typeof data === 'function'
      ? getData(data, vm)
      : data || {};
    if (!isPlainObject(data)) {
      data = {};
    }
    // proxy data on instance
    var keys = Object.keys(data);
    var props = vm.$options.props;
    var methods = vm.$options.methods;
    var i = keys.length;
    while (i--) {
      var key = keys[i];
      if (props && hasOwn(props, key)) ; else if (!isReserved(key)) {
        proxy(vm, "_data", key);
      }
    }
    // observe data
    observe(data, true /* asRootData */);
  }

  function getData (data, vm) {
    // #7573 disable dep collection when invoking data getters
    pushTarget();
    try {
      return data.call(vm, vm)
    } catch (e) {
      handleError(e, vm, "data()");
      return {}
    } finally {
      popTarget();
    }
  }

  var computedWatcherOptions = { lazy: true };

  function initComputed (vm, computed) {
    // $flow-disable-line
    var watchers = vm._computedWatchers = Object.create(null);
    // computed properties are just getters during SSR
    var isSSR = isServerRendering();

    for (var key in computed) {
      var userDef = computed[key];
      var getter = typeof userDef === 'function' ? userDef : userDef.get;

      if (!isSSR) {
        // create internal watcher for the computed property.
        watchers[key] = new Watcher(
          vm,
          getter || noop,
          noop,
          computedWatcherOptions
        );
      }

      // component-defined computed properties are already defined on the
      // component prototype. We only need to define computed properties defined
      // at instantiation here.
      if (!(key in vm)) {
        defineComputed(vm, key, userDef);
      }
    }
  }

  function defineComputed (
    target,
    key,
    userDef
  ) {
    var shouldCache = !isServerRendering();
    if (typeof userDef === 'function') {
      sharedPropertyDefinition.get = shouldCache
        ? createComputedGetter(key)
        : userDef;
      sharedPropertyDefinition.set = noop;
    } else {
      sharedPropertyDefinition.get = userDef.get
        ? shouldCache && userDef.cache !== false
          ? createComputedGetter(key)
          : userDef.get
        : noop;
      sharedPropertyDefinition.set = userDef.set
        ? userDef.set
        : noop;
    }
    Object.defineProperty(target, key, sharedPropertyDefinition);
  }

  function createComputedGetter (key) {
    return function computedGetter () {
      var watcher = this._computedWatchers && this._computedWatchers[key];
      if (watcher) {
        if (watcher.dirty) {
          watcher.evaluate();
        }
        if (Dep.target) {
          watcher.depend();
        }
        return watcher.value
      }
    }
  }

  function initMethods (vm, methods) {
    var props = vm.$options.props;
    for (var key in methods) {
      vm[key] = methods[key] == null ? noop : bind(methods[key], vm);
    }
  }

  function initWatch (vm, watch) {
    for (var key in watch) {
      var handler = watch[key];
      if (Array.isArray(handler)) {
        for (var i = 0; i < handler.length; i++) {
          createWatcher(vm, key, handler[i]);
        }
      } else {
        createWatcher(vm, key, handler);
      }
    }
  }

  function createWatcher (
    vm,
    expOrFn,
    handler,
    options
  ) {
    if (isPlainObject(handler)) {
      options = handler;
      handler = handler.handler;
    }
    if (typeof handler === 'string') {
      handler = vm[handler];
    }
    return vm.$watch(expOrFn, handler, options)
  }

  function stateMixin (Vue) {
    // flow somehow has problems with directly declared definition object
    // when using Object.defineProperty, so we have to procedurally build up
    // the object here.
    var dataDef = {};
    dataDef.get = function () { return this._data };
    var propsDef = {};
    propsDef.get = function () { return this._props };
    Object.defineProperty(Vue.prototype, '$data', dataDef);
    Object.defineProperty(Vue.prototype, '$props', propsDef);

    Vue.prototype.$set = set;
    Vue.prototype.$delete = del;

    Vue.prototype.$watch = function (
      expOrFn,
      cb,
      options
    ) {
      var vm = this;
      if (isPlainObject(cb)) {
        return createWatcher(vm, expOrFn, cb, options)
      }
      options = options || {};
      options.user = true;
      var watcher = new Watcher(vm, expOrFn, cb, options);
      if (options.immediate) {
        cb.call(vm, watcher.value);
      }
      return function unwatchFn () {
        watcher.teardown();
      }
    };
  }

  /*  */

  function initProvide (vm) {
    var provide = vm.$options.provide;
    if (provide) {
      vm._provided = typeof provide === 'function'
        ? provide.call(vm)
        : provide;
    }
  }

  function initInjections (vm) {
    var result = resolveInject(vm.$options.inject, vm);
    if (result) {
      toggleObserving(false);
      Object.keys(result).forEach(function (key) {
        /* istanbul ignore else */
        {
          defineReactive(vm, key, result[key]);
        }
      });
      toggleObserving(true);
    }
  }

  function resolveInject (inject, vm) {
    if (inject) {
      // inject is :any because flow is not smart enough to figure out cached
      var result = Object.create(null);
      var keys = hasSymbol
        ? Reflect.ownKeys(inject).filter(function (key) {
          /* istanbul ignore next */
          return Object.getOwnPropertyDescriptor(inject, key).enumerable
        })
        : Object.keys(inject);

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var provideKey = inject[key].from;
        var source = vm;
        while (source) {
          if (source._provided && hasOwn(source._provided, provideKey)) {
            result[key] = source._provided[provideKey];
            break
          }
          source = source.$parent;
        }
        if (!source) {
          if ('default' in inject[key]) {
            var provideDefault = inject[key].default;
            result[key] = typeof provideDefault === 'function'
              ? provideDefault.call(vm)
              : provideDefault;
          }
        }
      }
      return result
    }
  }

  /*  */

  /**
   * Runtime helper for rendering v-for lists.
   */
  function renderList (
    val,
    render
  ) {
    var ret, i, l, keys, key;
    if (Array.isArray(val) || typeof val === 'string') {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = render(val[i], i);
      }
    } else if (typeof val === 'number') {
      ret = new Array(val);
      for (i = 0; i < val; i++) {
        ret[i] = render(i + 1, i);
      }
    } else if (isObject(val)) {
      keys = Object.keys(val);
      ret = new Array(keys.length);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[i] = render(val[key], key, i);
      }
    }
    if (isDef(ret)) {
      (ret)._isVList = true;
    }
    return ret
  }

  /*  */

  /**
   * Runtime helper for rendering <slot>
   */
  function renderSlot (
    name,
    fallback,
    props,
    bindObject
  ) {
    var scopedSlotFn = this.$scopedSlots[name];
    var nodes;
    if (scopedSlotFn) { // scoped slot
      props = props || {};
      if (bindObject) {
        props = extend(extend({}, bindObject), props);
      }
      nodes = scopedSlotFn(props) || fallback;
    } else {
      var slotNodes = this.$slots[name];
      // warn duplicate slot usage
      if (slotNodes) {
        slotNodes._rendered = true;
      }
      nodes = slotNodes || fallback;
    }

    var target = props && props.slot;
    if (target) {
      return this.$createElement('template', { slot: target }, nodes)
    } else {
      return nodes
    }
  }

  /*  */

  /**
   * Runtime helper for resolving filters
   */
  function resolveFilter (id) {
    return resolveAsset(this.$options, 'filters', id, true) || identity
  }

  /*  */

  function isKeyNotMatch (expect, actual) {
    if (Array.isArray(expect)) {
      return expect.indexOf(actual) === -1
    } else {
      return expect !== actual
    }
  }

  /**
   * Runtime helper for checking keyCodes from config.
   * exposed as Vue.prototype._k
   * passing in eventKeyName as last argument separately for backwards compat
   */
  function checkKeyCodes (
    eventKeyCode,
    key,
    builtInKeyCode,
    eventKeyName,
    builtInKeyName
  ) {
    var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
    if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
      return isKeyNotMatch(builtInKeyName, eventKeyName)
    } else if (mappedKeyCode) {
      return isKeyNotMatch(mappedKeyCode, eventKeyCode)
    } else if (eventKeyName) {
      return hyphenate(eventKeyName) !== key
    }
  }

  /*  */

  /**
   * Runtime helper for merging v-bind="object" into a VNode's data.
   */
  function bindObjectProps (
    data,
    tag,
    value,
    asProp,
    isSync
  ) {
    if (value) {
      if (!isObject(value)) ; else {
        if (Array.isArray(value)) {
          value = toObject(value);
        }
        var hash;
        var loop = function ( key ) {
          if (
            key === 'class' ||
            key === 'style' ||
            isReservedAttribute(key)
          ) {
            hash = data;
          } else {
            var type = data.attrs && data.attrs.type;
            hash = asProp || config.mustUseProp(tag, type, key)
              ? data.domProps || (data.domProps = {})
              : data.attrs || (data.attrs = {});
          }
          if (!(key in hash)) {
            hash[key] = value[key];

            if (isSync) {
              var on = data.on || (data.on = {});
              on[("update:" + key)] = function ($event) {
                value[key] = $event;
              };
            }
          }
        };

        for (var key in value) loop( key );
      }
    }
    return data
  }

  /*  */

  /**
   * Runtime helper for rendering static trees.
   */
  function renderStatic (
    index,
    isInFor
  ) {
    var cached = this._staticTrees || (this._staticTrees = []);
    var tree = cached[index];
    // if has already-rendered static tree and not inside v-for,
    // we can reuse the same tree.
    if (tree && !isInFor) {
      return tree
    }
    // otherwise, render a fresh tree.
    tree = cached[index] = this.$options.staticRenderFns[index].call(
      this._renderProxy,
      null,
      this // for render fns generated for functional component templates
    );
    markStatic(tree, ("__static__" + index), false);
    return tree
  }

  /**
   * Runtime helper for v-once.
   * Effectively it means marking the node as static with a unique key.
   */
  function markOnce (
    tree,
    index,
    key
  ) {
    markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
    return tree
  }

  function markStatic (
    tree,
    key,
    isOnce
  ) {
    if (Array.isArray(tree)) {
      for (var i = 0; i < tree.length; i++) {
        if (tree[i] && typeof tree[i] !== 'string') {
          markStaticNode(tree[i], (key + "_" + i), isOnce);
        }
      }
    } else {
      markStaticNode(tree, key, isOnce);
    }
  }

  function markStaticNode (node, key, isOnce) {
    node.isStatic = true;
    node.key = key;
    node.isOnce = isOnce;
  }

  /*  */

  function bindObjectListeners (data, value) {
    if (value) {
      if (!isPlainObject(value)) ; else {
        var on = data.on = data.on ? extend({}, data.on) : {};
        for (var key in value) {
          var existing = on[key];
          var ours = value[key];
          on[key] = existing ? [].concat(existing, ours) : ours;
        }
      }
    }
    return data
  }

  /*  */

  function installRenderHelpers (target) {
    target._o = markOnce;
    target._n = toNumber;
    target._s = toString;
    target._l = renderList;
    target._t = renderSlot;
    target._q = looseEqual;
    target._i = looseIndexOf;
    target._m = renderStatic;
    target._f = resolveFilter;
    target._k = checkKeyCodes;
    target._b = bindObjectProps;
    target._v = createTextVNode;
    target._e = createEmptyVNode;
    target._u = resolveScopedSlots;
    target._g = bindObjectListeners;
  }

  /*  */

  function FunctionalRenderContext (
    data,
    props,
    children,
    parent,
    Ctor
  ) {
    var options = Ctor.options;
    // ensure the createElement function in functional components
    // gets a unique context - this is necessary for correct named slot check
    var contextVm;
    if (hasOwn(parent, '_uid')) {
      contextVm = Object.create(parent);
      // $flow-disable-line
      contextVm._original = parent;
    } else {
      // the context vm passed in is a functional context as well.
      // in this case we want to make sure we are able to get a hold to the
      // real context instance.
      contextVm = parent;
      // $flow-disable-line
      parent = parent._original;
    }
    var isCompiled = isTrue(options._compiled);
    var needNormalization = !isCompiled;

    this.data = data;
    this.props = props;
    this.children = children;
    this.parent = parent;
    this.listeners = data.on || emptyObject;
    this.injections = resolveInject(options.inject, parent);
    this.slots = function () { return resolveSlots(children, parent); };

    // support for compiled functional template
    if (isCompiled) {
      // exposing $options for renderStatic()
      this.$options = options;
      // pre-resolve slots for renderSlot()
      this.$slots = this.slots();
      this.$scopedSlots = data.scopedSlots || emptyObject;
    }

    if (options._scopeId) {
      this._c = function (a, b, c, d) {
        var vnode = createElement(contextVm, a, b, c, d, needNormalization);
        if (vnode && !Array.isArray(vnode)) {
          vnode.fnScopeId = options._scopeId;
          vnode.fnContext = parent;
        }
        return vnode
      };
    } else {
      this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
    }
  }

  installRenderHelpers(FunctionalRenderContext.prototype);

  function createFunctionalComponent (
    Ctor,
    propsData,
    data,
    contextVm,
    children
  ) {
    var options = Ctor.options;
    var props = {};
    var propOptions = options.props;
    if (isDef(propOptions)) {
      for (var key in propOptions) {
        props[key] = validateProp(key, propOptions, propsData || emptyObject);
      }
    } else {
      if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
      if (isDef(data.props)) { mergeProps(props, data.props); }
    }

    var renderContext = new FunctionalRenderContext(
      data,
      props,
      children,
      contextVm,
      Ctor
    );

    var vnode = options.render.call(null, renderContext._c, renderContext);

    if (vnode instanceof VNode) {
      return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options)
    } else if (Array.isArray(vnode)) {
      var vnodes = normalizeChildren(vnode) || [];
      var res = new Array(vnodes.length);
      for (var i = 0; i < vnodes.length; i++) {
        res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options);
      }
      return res
    }
  }

  function cloneAndMarkFunctionalResult (vnode, data, contextVm, options) {
    // #7817 clone node before setting fnContext, otherwise if the node is reused
    // (e.g. it was from a cached normal slot) the fnContext causes named slots
    // that should not be matched to match.
    var clone = cloneVNode(vnode);
    clone.fnContext = contextVm;
    clone.fnOptions = options;
    if (data.slot) {
      (clone.data || (clone.data = {})).slot = data.slot;
    }
    return clone
  }

  function mergeProps (to, from) {
    for (var key in from) {
      to[camelize(key)] = from[key];
    }
  }

  /*  */




  // Register the component hook to weex native render engine.
  // The hook will be triggered by native, not javascript.


  // Updates the state of the component to weex native render engine.

  /*  */

  // https://github.com/Hanks10100/weex-native-directive/tree/master/component

  // listening on native callback

  /*  */

  /*  */

  // inline hooks to be invoked on component VNodes during patch
  var componentVNodeHooks = {
    init: function init (
      vnode,
      hydrating,
      parentElm,
      refElm
    ) {
      if (
        vnode.componentInstance &&
        !vnode.componentInstance._isDestroyed &&
        vnode.data.keepAlive
      ) {
        // kept-alive components, treat as a patch
        var mountedNode = vnode; // work around flow
        componentVNodeHooks.prepatch(mountedNode, mountedNode);
      } else {
        var child = vnode.componentInstance = createComponentInstanceForVnode(
          vnode,
          activeInstance,
          parentElm,
          refElm
        );
        child.$mount(hydrating ? vnode.elm : undefined, hydrating);
      }
    },

    prepatch: function prepatch (oldVnode, vnode) {
      var options = vnode.componentOptions;
      var child = vnode.componentInstance = oldVnode.componentInstance;
      updateChildComponent(
        child,
        options.propsData, // updated props
        options.listeners, // updated listeners
        vnode, // new parent vnode
        options.children // new children
      );
    },

    insert: function insert (vnode) {
      var context = vnode.context;
      var componentInstance = vnode.componentInstance;
      if (!componentInstance._isMounted) {
        componentInstance._isMounted = true;
        callHook(componentInstance, 'mounted');
      }
      if (vnode.data.keepAlive) {
        if (context._isMounted) {
          // vue-router#1212
          // During updates, a kept-alive component's child components may
          // change, so directly walking the tree here may call activated hooks
          // on incorrect children. Instead we push them into a queue which will
          // be processed after the whole patch process ended.
          queueActivatedComponent(componentInstance);
        } else {
          activateChildComponent(componentInstance, true /* direct */);
        }
      }
    },

    destroy: function destroy (vnode) {
      var componentInstance = vnode.componentInstance;
      if (!componentInstance._isDestroyed) {
        if (!vnode.data.keepAlive) {
          componentInstance.$destroy();
        } else {
          deactivateChildComponent(componentInstance, true /* direct */);
        }
      }
    }
  };

  var hooksToMerge = Object.keys(componentVNodeHooks);

  function createComponent (
    Ctor,
    data,
    context,
    children,
    tag
  ) {
    if (isUndef(Ctor)) {
      return
    }

    var baseCtor = context.$options._base;

    // plain options object: turn it into a constructor
    if (isObject(Ctor)) {
      Ctor = baseCtor.extend(Ctor);
    }

    // if at this stage it's not a constructor or an async component factory,
    // reject.
    if (typeof Ctor !== 'function') {
      return
    }

    // async component
    var asyncFactory;
    if (isUndef(Ctor.cid)) {
      asyncFactory = Ctor;
      Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context);
      if (Ctor === undefined) {
        // return a placeholder node for async component, which is rendered
        // as a comment node but preserves all the raw information for the node.
        // the information will be used for async server-rendering and hydration.
        return createAsyncPlaceholder(
          asyncFactory,
          data,
          context,
          children,
          tag
        )
      }
    }

    data = data || {};

    // resolve constructor options in case global mixins are applied after
    // component constructor creation
    resolveConstructorOptions(Ctor);

    // transform component v-model data into props & events
    if (isDef(data.model)) {
      transformModel(Ctor.options, data);
    }

    // extract props
    var propsData = extractPropsFromVNodeData(data, Ctor, tag);

    // functional component
    if (isTrue(Ctor.options.functional)) {
      return createFunctionalComponent(Ctor, propsData, data, context, children)
    }

    // extract listeners, since these needs to be treated as
    // child component listeners instead of DOM listeners
    var listeners = data.on;
    // replace with listeners with .native modifier
    // so it gets processed during parent component patch.
    data.on = data.nativeOn;

    if (isTrue(Ctor.options.abstract)) {
      // abstract components do not keep anything
      // other than props & listeners & slot

      // work around flow
      var slot = data.slot;
      data = {};
      if (slot) {
        data.slot = slot;
      }
    }

    // install component management hooks onto the placeholder node
    installComponentHooks(data);

    // return a placeholder vnode
    var name = Ctor.options.name || tag;
    var vnode = new VNode(
      ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
      data, undefined, undefined, undefined, context,
      { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
      asyncFactory
    );

    // Weex specific: invoke recycle-list optimized @render function for
    // extracting cell-slot template.
    // https://github.com/Hanks10100/weex-native-directive/tree/master/component
    /* istanbul ignore if */
    return vnode
  }

  function createComponentInstanceForVnode (
    vnode, // we know it's MountedComponentVNode but flow doesn't
    parent, // activeInstance in lifecycle state
    parentElm,
    refElm
  ) {
    var options = {
      _isComponent: true,
      parent: parent,
      _parentVnode: vnode,
      _parentElm: parentElm || null,
      _refElm: refElm || null
    };
    // check inline-template render functions
    var inlineTemplate = vnode.data.inlineTemplate;
    if (isDef(inlineTemplate)) {
      options.render = inlineTemplate.render;
      options.staticRenderFns = inlineTemplate.staticRenderFns;
    }
    return new vnode.componentOptions.Ctor(options)
  }

  function installComponentHooks (data) {
    var hooks = data.hook || (data.hook = {});
    for (var i = 0; i < hooksToMerge.length; i++) {
      var key = hooksToMerge[i];
      hooks[key] = componentVNodeHooks[key];
    }
  }

  // transform component v-model info (value and callback) into
  // prop and event handler respectively.
  function transformModel (options, data) {
    var prop = (options.model && options.model.prop) || 'value';
    var event = (options.model && options.model.event) || 'input';(data.props || (data.props = {}))[prop] = data.model.value;
    var on = data.on || (data.on = {});
    if (isDef(on[event])) {
      on[event] = [data.model.callback].concat(on[event]);
    } else {
      on[event] = data.model.callback;
    }
  }

  /*  */

  var SIMPLE_NORMALIZE = 1;
  var ALWAYS_NORMALIZE = 2;

  // wrapper function for providing a more flexible interface
  // without getting yelled at by flow
  function createElement (
    context,
    tag,
    data,
    children,
    normalizationType,
    alwaysNormalize
  ) {
    if (Array.isArray(data) || isPrimitive(data)) {
      normalizationType = children;
      children = data;
      data = undefined;
    }
    if (isTrue(alwaysNormalize)) {
      normalizationType = ALWAYS_NORMALIZE;
    }
    return _createElement(context, tag, data, children, normalizationType)
  }

  function _createElement (
    context,
    tag,
    data,
    children,
    normalizationType
  ) {
    if (isDef(data) && isDef((data).__ob__)) {
      return createEmptyVNode()
    }
    // object syntax in v-bind
    if (isDef(data) && isDef(data.is)) {
      tag = data.is;
    }
    if (!tag) {
      // in case of component :is set to falsy value
      return createEmptyVNode()
    }
    // support single function children as default scoped slot
    if (Array.isArray(children) &&
      typeof children[0] === 'function'
    ) {
      data = data || {};
      data.scopedSlots = { default: children[0] };
      children.length = 0;
    }
    if (normalizationType === ALWAYS_NORMALIZE) {
      children = normalizeChildren(children);
    } else if (normalizationType === SIMPLE_NORMALIZE) {
      children = simpleNormalizeChildren(children);
    }
    var vnode, ns;
    if (typeof tag === 'string') {
      var Ctor;
      ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
      if (config.isReservedTag(tag)) {
        // platform built-in elements
        vnode = new VNode(
          config.parsePlatformTagName(tag), data, children,
          undefined, undefined, context
        );
      } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
        // component
        vnode = createComponent(Ctor, data, context, children, tag);
      } else {
        // unknown or unlisted namespaced elements
        // check at runtime because it may get assigned a namespace when its
        // parent normalizes children
        vnode = new VNode(
          tag, data, children,
          undefined, undefined, context
        );
      }
    } else {
      // direct component options / constructor
      vnode = createComponent(tag, data, context, children);
    }
    if (Array.isArray(vnode)) {
      return vnode
    } else if (isDef(vnode)) {
      if (isDef(ns)) { applyNS(vnode, ns); }
      if (isDef(data)) { registerDeepBindings(data); }
      return vnode
    } else {
      return createEmptyVNode()
    }
  }

  function applyNS (vnode, ns, force) {
    vnode.ns = ns;
    if (vnode.tag === 'foreignObject') {
      // use default namespace inside foreignObject
      ns = undefined;
      force = true;
    }
    if (isDef(vnode.children)) {
      for (var i = 0, l = vnode.children.length; i < l; i++) {
        var child = vnode.children[i];
        if (isDef(child.tag) && (
          isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
          applyNS(child, ns, force);
        }
      }
    }
  }

  // ref #5318
  // necessary to ensure parent re-render when deep bindings like :style and
  // :class are used on slot nodes
  function registerDeepBindings (data) {
    if (isObject(data.style)) {
      traverse(data.style);
    }
    if (isObject(data.class)) {
      traverse(data.class);
    }
  }

  /*  */

  function initRender (vm) {
    vm._vnode = null; // the root of the child tree
    vm._staticTrees = null; // v-once cached trees
    var options = vm.$options;
    var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
    var renderContext = parentVnode && parentVnode.context;
    vm.$slots = resolveSlots(options._renderChildren, renderContext);
    vm.$scopedSlots = emptyObject;
    // bind the createElement fn to this instance
    // so that we get proper render context inside it.
    // args order: tag, data, children, normalizationType, alwaysNormalize
    // internal version is used by render functions compiled from templates
    vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
    // normalization is always applied for the public version, used in
    // user-written render functions.
    vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

    // $attrs & $listeners are exposed for easier HOC creation.
    // they need to be reactive so that HOCs using them are always updated
    var parentData = parentVnode && parentVnode.data;

    /* istanbul ignore else */
    {
      defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true);
      defineReactive(vm, '$listeners', options._parentListeners || emptyObject, null, true);
    }
  }

  function renderMixin (Vue) {
    // install runtime convenience helpers
    installRenderHelpers(Vue.prototype);

    Vue.prototype.$nextTick = function (fn) {
      return nextTick(fn, this)
    };

    Vue.prototype._render = function () {
      var vm = this;
      var ref = vm.$options;
      var render = ref.render;
      var _parentVnode = ref._parentVnode;

      if (_parentVnode) {
        vm.$scopedSlots = _parentVnode.data.scopedSlots || emptyObject;
      }

      // set parent vnode. this allows render functions to have access
      // to the data on the placeholder node.
      vm.$vnode = _parentVnode;
      // render self
      var vnode;
      try {
        vnode = render.call(vm._renderProxy, vm.$createElement);
      } catch (e) {
        handleError(e, vm, "render");
        // return error render result,
        // or previous vnode to prevent render error causing blank component
        /* istanbul ignore else */
        {
          vnode = vm._vnode;
        }
      }
      // return empty vnode in case the render function errored out
      if (!(vnode instanceof VNode)) {
        vnode = createEmptyVNode();
      }
      // set parent
      vnode.parent = _parentVnode;
      return vnode
    };
  }

  /*  */

  var uid$3 = 0;

  function initMixin (Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      // a uid
      vm._uid = uid$3++;

      // a flag to avoid this being observed
      vm._isVue = true;
      // merge options
      if (options && options._isComponent) {
        // optimize internal component instantiation
        // since dynamic options merging is pretty slow, and none of the
        // internal component options needs special treatment.
        initInternalComponent(vm, options);
      } else {
        vm.$options = mergeOptions(
          resolveConstructorOptions(vm.constructor),
          options || {},
          vm
        );
      }
      /* istanbul ignore else */
      {
        vm._renderProxy = vm;
      }
      // expose real self
      vm._self = vm;
      initLifecycle(vm);
      initEvents(vm);
      initRender(vm);
      callHook(vm, 'beforeCreate');
      initInjections(vm); // resolve injections before data/props
      initState(vm);
      initProvide(vm); // resolve provide after data/props
      callHook(vm, 'created');

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };
  }

  function initInternalComponent (vm, options) {
    var opts = vm.$options = Object.create(vm.constructor.options);
    // doing this because it's faster than dynamic enumeration.
    var parentVnode = options._parentVnode;
    opts.parent = options.parent;
    opts._parentVnode = parentVnode;
    opts._parentElm = options._parentElm;
    opts._refElm = options._refElm;

    var vnodeComponentOptions = parentVnode.componentOptions;
    opts.propsData = vnodeComponentOptions.propsData;
    opts._parentListeners = vnodeComponentOptions.listeners;
    opts._renderChildren = vnodeComponentOptions.children;
    opts._componentTag = vnodeComponentOptions.tag;

    if (options.render) {
      opts.render = options.render;
      opts.staticRenderFns = options.staticRenderFns;
    }
  }

  function resolveConstructorOptions (Ctor) {
    var options = Ctor.options;
    if (Ctor.super) {
      var superOptions = resolveConstructorOptions(Ctor.super);
      var cachedSuperOptions = Ctor.superOptions;
      if (superOptions !== cachedSuperOptions) {
        // super option changed,
        // need to resolve new options.
        Ctor.superOptions = superOptions;
        // check if there are any late-modified/attached options (#4976)
        var modifiedOptions = resolveModifiedOptions(Ctor);
        // update base extend options
        if (modifiedOptions) {
          extend(Ctor.extendOptions, modifiedOptions);
        }
        options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
        if (options.name) {
          options.components[options.name] = Ctor;
        }
      }
    }
    return options
  }

  function resolveModifiedOptions (Ctor) {
    var modified;
    var latest = Ctor.options;
    var extended = Ctor.extendOptions;
    var sealed = Ctor.sealedOptions;
    for (var key in latest) {
      if (latest[key] !== sealed[key]) {
        if (!modified) { modified = {}; }
        modified[key] = dedupe(latest[key], extended[key], sealed[key]);
      }
    }
    return modified
  }

  function dedupe (latest, extended, sealed) {
    // compare latest and sealed to ensure lifecycle hooks won't be duplicated
    // between merges
    if (Array.isArray(latest)) {
      var res = [];
      sealed = Array.isArray(sealed) ? sealed : [sealed];
      extended = Array.isArray(extended) ? extended : [extended];
      for (var i = 0; i < latest.length; i++) {
        // push original options and not sealed options to exclude duplicated options
        if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
          res.push(latest[i]);
        }
      }
      return res
    } else {
      return latest
    }
  }

  function Vue (options) {
    this._init(options);
  }

  initMixin(Vue);
  stateMixin(Vue);
  eventsMixin(Vue);
  lifecycleMixin(Vue);
  renderMixin(Vue);

  /*  */

  function initUse (Vue) {
    Vue.use = function (plugin) {
      var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
      if (installedPlugins.indexOf(plugin) > -1) {
        return this
      }

      // additional parameters
      var args = toArray(arguments, 1);
      args.unshift(this);
      if (typeof plugin.install === 'function') {
        plugin.install.apply(plugin, args);
      } else if (typeof plugin === 'function') {
        plugin.apply(null, args);
      }
      installedPlugins.push(plugin);
      return this
    };
  }

  /*  */

  function initMixin$1 (Vue) {
    Vue.mixin = function (mixin) {
      this.options = mergeOptions(this.options, mixin);
      return this
    };
  }

  /*  */

  function initExtend (Vue) {
    /**
     * Each instance constructor, including Vue, has a unique
     * cid. This enables us to create wrapped "child
     * constructors" for prototypal inheritance and cache them.
     */
    Vue.cid = 0;
    var cid = 1;

    /**
     * Class inheritance
     */
    Vue.extend = function (extendOptions) {
      extendOptions = extendOptions || {};
      var Super = this;
      var SuperId = Super.cid;
      var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
      if (cachedCtors[SuperId]) {
        return cachedCtors[SuperId]
      }

      var name = extendOptions.name || Super.options.name;

      var Sub = function VueComponent (options) {
        this._init(options);
      };
      Sub.prototype = Object.create(Super.prototype);
      Sub.prototype.constructor = Sub;
      Sub.cid = cid++;
      Sub.options = mergeOptions(
        Super.options,
        extendOptions
      );
      Sub['super'] = Super;

      // For props and computed properties, we define the proxy getters on
      // the Vue instances at extension time, on the extended prototype. This
      // avoids Object.defineProperty calls for each instance created.
      if (Sub.options.props) {
        initProps$1(Sub);
      }
      if (Sub.options.computed) {
        initComputed$1(Sub);
      }

      // allow further extension/mixin/plugin usage
      Sub.extend = Super.extend;
      Sub.mixin = Super.mixin;
      Sub.use = Super.use;

      // create asset registers, so extended classes
      // can have their private assets too.
      ASSET_TYPES.forEach(function (type) {
        Sub[type] = Super[type];
      });
      // enable recursive self-lookup
      if (name) {
        Sub.options.components[name] = Sub;
      }

      // keep a reference to the super options at extension time.
      // later at instantiation we can check if Super's options have
      // been updated.
      Sub.superOptions = Super.options;
      Sub.extendOptions = extendOptions;
      Sub.sealedOptions = extend({}, Sub.options);

      // cache constructor
      cachedCtors[SuperId] = Sub;
      return Sub
    };
  }

  function initProps$1 (Comp) {
    var props = Comp.options.props;
    for (var key in props) {
      proxy(Comp.prototype, "_props", key);
    }
  }

  function initComputed$1 (Comp) {
    var computed = Comp.options.computed;
    for (var key in computed) {
      defineComputed(Comp.prototype, key, computed[key]);
    }
  }

  /*  */

  function initAssetRegisters (Vue) {
    /**
     * Create asset registration methods.
     */
    ASSET_TYPES.forEach(function (type) {
      Vue[type] = function (
        id,
        definition
      ) {
        if (!definition) {
          return this.options[type + 's'][id]
        } else {
          if (type === 'component' && isPlainObject(definition)) {
            definition.name = definition.name || id;
            definition = this.options._base.extend(definition);
          }
          if (type === 'directive' && typeof definition === 'function') {
            definition = { bind: definition, update: definition };
          }
          this.options[type + 's'][id] = definition;
          return definition
        }
      };
    });
  }

  /*  */

  function getComponentName (opts) {
    return opts && (opts.Ctor.options.name || opts.tag)
  }

  function matches (pattern, name) {
    if (Array.isArray(pattern)) {
      return pattern.indexOf(name) > -1
    } else if (typeof pattern === 'string') {
      return pattern.split(',').indexOf(name) > -1
    } else if (isRegExp(pattern)) {
      return pattern.test(name)
    }
    /* istanbul ignore next */
    return false
  }

  function pruneCache (keepAliveInstance, filter) {
    var cache = keepAliveInstance.cache;
    var keys = keepAliveInstance.keys;
    var _vnode = keepAliveInstance._vnode;
    for (var key in cache) {
      var cachedNode = cache[key];
      if (cachedNode) {
        var name = getComponentName(cachedNode.componentOptions);
        if (name && !filter(name)) {
          pruneCacheEntry(cache, key, keys, _vnode);
        }
      }
    }
  }

  function pruneCacheEntry (
    cache,
    key,
    keys,
    current
  ) {
    var cached$$1 = cache[key];
    if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
      cached$$1.componentInstance.$destroy();
    }
    cache[key] = null;
    remove(keys, key);
  }

  var patternTypes = [String, RegExp, Array];

  var KeepAlive = {
    name: 'keep-alive',
    abstract: true,

    props: {
      include: patternTypes,
      exclude: patternTypes,
      max: [String, Number]
    },

    created: function created () {
      this.cache = Object.create(null);
      this.keys = [];
    },

    destroyed: function destroyed () {
      var this$1 = this;

      for (var key in this$1.cache) {
        pruneCacheEntry(this$1.cache, key, this$1.keys);
      }
    },

    mounted: function mounted () {
      var this$1 = this;

      this.$watch('include', function (val) {
        pruneCache(this$1, function (name) { return matches(val, name); });
      });
      this.$watch('exclude', function (val) {
        pruneCache(this$1, function (name) { return !matches(val, name); });
      });
    },

    render: function render () {
      var slot = this.$slots.default;
      var vnode = getFirstComponentChild(slot);
      var componentOptions = vnode && vnode.componentOptions;
      if (componentOptions) {
        // check pattern
        var name = getComponentName(componentOptions);
        var ref = this;
        var include = ref.include;
        var exclude = ref.exclude;
        if (
          // not included
          (include && (!name || !matches(include, name))) ||
          // excluded
          (exclude && name && matches(exclude, name))
        ) {
          return vnode
        }

        var ref$1 = this;
        var cache = ref$1.cache;
        var keys = ref$1.keys;
        var key = vnode.key == null
          // same constructor may get registered as different local components
          // so cid alone is not enough (#3269)
          ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
          : vnode.key;
        if (cache[key]) {
          vnode.componentInstance = cache[key].componentInstance;
          // make current key freshest
          remove(keys, key);
          keys.push(key);
        } else {
          cache[key] = vnode;
          keys.push(key);
          // prune oldest entry
          if (this.max && keys.length > parseInt(this.max)) {
            pruneCacheEntry(cache, keys[0], keys, this._vnode);
          }
        }

        vnode.data.keepAlive = true;
      }
      return vnode || (slot && slot[0])
    }
  };

  var builtInComponents = {
    KeepAlive: KeepAlive
  };

  /*  */

  function initGlobalAPI (Vue) {
    // config
    var configDef = {};
    configDef.get = function () { return config; };
    Object.defineProperty(Vue, 'config', configDef);

    // exposed util methods.
    // NOTE: these are not considered part of the public API - avoid relying on
    // them unless you are aware of the risk.
    Vue.util = {
      warn: warn,
      extend: extend,
      mergeOptions: mergeOptions,
      defineReactive: defineReactive
    };

    Vue.set = set;
    Vue.delete = del;
    Vue.nextTick = nextTick;

    Vue.options = Object.create(null);
    ASSET_TYPES.forEach(function (type) {
      Vue.options[type + 's'] = Object.create(null);
    });

    // this is used to identify the "base" constructor to extend all plain-object
    // components with in Weex's multi-instance scenarios.
    Vue.options._base = Vue;

    extend(Vue.options.components, builtInComponents);

    initUse(Vue);
    initMixin$1(Vue);
    initExtend(Vue);
    initAssetRegisters(Vue);
  }

  initGlobalAPI(Vue);

  Object.defineProperty(Vue.prototype, '$isServer', {
    get: isServerRendering
  });

  Object.defineProperty(Vue.prototype, '$ssrContext', {
    get: function get () {
      /* istanbul ignore next */
      return this.$vnode && this.$vnode.ssrContext
    }
  });

  // expose FunctionalRenderContext for ssr runtime helper installation
  Object.defineProperty(Vue, 'FunctionalRenderContext', {
    value: FunctionalRenderContext
  });

  Vue.version = '2.5.16';

  /*  */

  // these are reserved for web because they are directly compiled away
  // during template compilation
  var isReservedAttr = makeMap('style,class');

  // attributes that should be using props for binding
  var acceptValue = makeMap('input,textarea,option,select,progress');
  var mustUseProp = function (tag, type, attr) {
    return (
      (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
      (attr === 'selected' && tag === 'option') ||
      (attr === 'checked' && tag === 'input') ||
      (attr === 'muted' && tag === 'video')
    )
  };

  var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

  var isBooleanAttr = makeMap(
    'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
    'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
    'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
    'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
    'required,reversed,scoped,seamless,selected,sortable,translate,' +
    'truespeed,typemustmatch,visible'
  );

  var xlinkNS = 'http://www.w3.org/1999/xlink';

  var isXlink = function (name) {
    return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
  };

  var getXlinkProp = function (name) {
    return isXlink(name) ? name.slice(6, name.length) : ''
  };

  var isFalsyAttrValue = function (val) {
    return val == null || val === false
  };

  /*  */

  function genClassForVnode (vnode) {
    var data = vnode.data;
    var parentNode = vnode;
    var childNode = vnode;
    while (isDef(childNode.componentInstance)) {
      childNode = childNode.componentInstance._vnode;
      if (childNode && childNode.data) {
        data = mergeClassData(childNode.data, data);
      }
    }
    while (isDef(parentNode = parentNode.parent)) {
      if (parentNode && parentNode.data) {
        data = mergeClassData(data, parentNode.data);
      }
    }
    return renderClass(data.staticClass, data.class)
  }

  function mergeClassData (child, parent) {
    return {
      staticClass: concat(child.staticClass, parent.staticClass),
      class: isDef(child.class)
        ? [child.class, parent.class]
        : parent.class
    }
  }

  function renderClass (
    staticClass,
    dynamicClass
  ) {
    if (isDef(staticClass) || isDef(dynamicClass)) {
      return concat(staticClass, stringifyClass(dynamicClass))
    }
    /* istanbul ignore next */
    return ''
  }

  function concat (a, b) {
    return a ? b ? (a + ' ' + b) : a : (b || '')
  }

  function stringifyClass (value) {
    if (Array.isArray(value)) {
      return stringifyArray(value)
    }
    if (isObject(value)) {
      return stringifyObject(value)
    }
    if (typeof value === 'string') {
      return value
    }
    /* istanbul ignore next */
    return ''
  }

  function stringifyArray (value) {
    var res = '';
    var stringified;
    for (var i = 0, l = value.length; i < l; i++) {
      if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
        if (res) { res += ' '; }
        res += stringified;
      }
    }
    return res
  }

  function stringifyObject (value) {
    var res = '';
    for (var key in value) {
      if (value[key]) {
        if (res) { res += ' '; }
        res += key;
      }
    }
    return res
  }

  /*  */

  var namespaceMap = {
    svg: 'http://www.w3.org/2000/svg',
    math: 'http://www.w3.org/1998/Math/MathML'
  };

  var isHTMLTag = makeMap(
    'html,body,base,head,link,meta,style,title,' +
    'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
    'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
    'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
    's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
    'embed,object,param,source,canvas,script,noscript,del,ins,' +
    'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
    'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
    'output,progress,select,textarea,' +
    'details,dialog,menu,menuitem,summary,' +
    'content,element,shadow,template,blockquote,iframe,tfoot'
  );

  // this map is intentionally selective, only covering SVG elements that may
  // contain child elements.
  var isSVG = makeMap(
    'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
    'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
    'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
    true
  );



  var isReservedTag = function (tag) {
    return isHTMLTag(tag) || isSVG(tag)
  };

  function getTagNamespace (tag) {
    if (isSVG(tag)) {
      return 'svg'
    }
    // basic support for MathML
    // note it doesn't support other MathML elements being component roots
    if (tag === 'math') {
      return 'math'
    }
  }

  var unknownElementCache = Object.create(null);
  function isUnknownElement (tag) {
    /* istanbul ignore if */
    if (!inBrowser) {
      return true
    }
    if (isReservedTag(tag)) {
      return false
    }
    tag = tag.toLowerCase();
    /* istanbul ignore if */
    if (unknownElementCache[tag] != null) {
      return unknownElementCache[tag]
    }
    var el = document.createElement(tag);
    if (tag.indexOf('-') > -1) {
      // http://stackoverflow.com/a/28210364/1070244
      return (unknownElementCache[tag] = (
        el.constructor === window.HTMLUnknownElement ||
        el.constructor === window.HTMLElement
      ))
    } else {
      return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
    }
  }

  var isTextInputType = makeMap('text,number,password,search,email,tel,url');

  /*  */

  /**
   * Query an element selector if it's not an element already.
   */
  function query (el) {
    if (typeof el === 'string') {
      var selected = document.querySelector(el);
      if (!selected) {
        return document.createElement('div')
      }
      return selected
    } else {
      return el
    }
  }

  /*  */

  function createElement$1 (tagName, vnode) {
    var elm = document.createElement(tagName);
    if (tagName !== 'select') {
      return elm
    }
    // false or null will remove the attribute but undefined will not
    if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
      elm.setAttribute('multiple', 'multiple');
    }
    return elm
  }

  function createElementNS (namespace, tagName) {
    return document.createElementNS(namespaceMap[namespace], tagName)
  }

  function createTextNode (text) {
    return document.createTextNode(text)
  }

  function createComment (text) {
    return document.createComment(text)
  }

  function insertBefore (parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
  }

  function removeChild (node, child) {
    node.removeChild(child);
  }

  function appendChild (node, child) {
    node.appendChild(child);
  }

  function parentNode (node) {
    return node.parentNode
  }

  function nextSibling (node) {
    return node.nextSibling
  }

  function tagName (node) {
    return node.tagName
  }

  function setTextContent (node, text) {
    node.textContent = text;
  }

  function setStyleScope (node, scopeId) {
    node.setAttribute(scopeId, '');
  }


  var nodeOps = Object.freeze({
  	createElement: createElement$1,
  	createElementNS: createElementNS,
  	createTextNode: createTextNode,
  	createComment: createComment,
  	insertBefore: insertBefore,
  	removeChild: removeChild,
  	appendChild: appendChild,
  	parentNode: parentNode,
  	nextSibling: nextSibling,
  	tagName: tagName,
  	setTextContent: setTextContent,
  	setStyleScope: setStyleScope
  });

  /*  */

  var ref = {
    create: function create (_, vnode) {
      registerRef(vnode);
    },
    update: function update (oldVnode, vnode) {
      if (oldVnode.data.ref !== vnode.data.ref) {
        registerRef(oldVnode, true);
        registerRef(vnode);
      }
    },
    destroy: function destroy (vnode) {
      registerRef(vnode, true);
    }
  };

  function registerRef (vnode, isRemoval) {
    var key = vnode.data.ref;
    if (!isDef(key)) { return }

    var vm = vnode.context;
    var ref = vnode.componentInstance || vnode.elm;
    var refs = vm.$refs;
    if (isRemoval) {
      if (Array.isArray(refs[key])) {
        remove(refs[key], ref);
      } else if (refs[key] === ref) {
        refs[key] = undefined;
      }
    } else {
      if (vnode.data.refInFor) {
        if (!Array.isArray(refs[key])) {
          refs[key] = [ref];
        } else if (refs[key].indexOf(ref) < 0) {
          // $flow-disable-line
          refs[key].push(ref);
        }
      } else {
        refs[key] = ref;
      }
    }
  }

  /**
   * Virtual DOM patching algorithm based on Snabbdom by
   * Simon Friis Vindum (@paldepind)
   * Licensed under the MIT License
   * https://github.com/paldepind/snabbdom/blob/master/LICENSE
   *
   * modified by Evan You (@yyx990803)
   *
   * Not type-checking this because this file is perf-critical and the cost
   * of making flow understand it is not worth it.
   */

  var emptyNode = new VNode('', {}, []);

  var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

  function sameVnode (a, b) {
    return (
      a.key === b.key && (
        (
          a.tag === b.tag &&
          a.isComment === b.isComment &&
          isDef(a.data) === isDef(b.data) &&
          sameInputType(a, b)
        ) || (
          isTrue(a.isAsyncPlaceholder) &&
          a.asyncFactory === b.asyncFactory &&
          isUndef(b.asyncFactory.error)
        )
      )
    )
  }

  function sameInputType (a, b) {
    if (a.tag !== 'input') { return true }
    var i;
    var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
    var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
    return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
  }

  function createKeyToOldIdx (children, beginIdx, endIdx) {
    var i, key;
    var map = {};
    for (i = beginIdx; i <= endIdx; ++i) {
      key = children[i].key;
      if (isDef(key)) { map[key] = i; }
    }
    return map
  }

  function createPatchFunction (backend) {
    var i, j;
    var cbs = {};

    var modules = backend.modules;
    var nodeOps = backend.nodeOps;

    for (i = 0; i < hooks.length; ++i) {
      cbs[hooks[i]] = [];
      for (j = 0; j < modules.length; ++j) {
        if (isDef(modules[j][hooks[i]])) {
          cbs[hooks[i]].push(modules[j][hooks[i]]);
        }
      }
    }

    function emptyNodeAt (elm) {
      return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
    }

    function createRmCb (childElm, listeners) {
      function remove () {
        if (--remove.listeners === 0) {
          removeNode(childElm);
        }
      }
      remove.listeners = listeners;
      return remove
    }

    function removeNode (el) {
      var parent = nodeOps.parentNode(el);
      // element may have already been removed due to v-html / v-text
      if (isDef(parent)) {
        nodeOps.removeChild(parent, el);
      }
    }

    function createElm (
      vnode,
      insertedVnodeQueue,
      parentElm,
      refElm,
      nested,
      ownerArray,
      index
    ) {
      if (isDef(vnode.elm) && isDef(ownerArray)) {
        // This vnode was used in a previous render!
        // now it's used as a new node, overwriting its elm would cause
        // potential patch errors down the road when it's used as an insertion
        // reference node. Instead, we clone the node on-demand before creating
        // associated DOM element for it.
        vnode = ownerArray[index] = cloneVNode(vnode);
      }

      vnode.isRootInsert = !nested; // for transition enter check
      if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
        return
      }

      var data = vnode.data;
      var children = vnode.children;
      var tag = vnode.tag;
      if (isDef(tag)) {

        vnode.elm = vnode.ns
          ? nodeOps.createElementNS(vnode.ns, tag)
          : nodeOps.createElement(tag, vnode);
        setScope(vnode);

        /* istanbul ignore if */
        {
          createChildren(vnode, children, insertedVnodeQueue);
          if (isDef(data)) {
            invokeCreateHooks(vnode, insertedVnodeQueue);
          }
          insert(parentElm, vnode.elm, refElm);
        }
      } else if (isTrue(vnode.isComment)) {
        vnode.elm = nodeOps.createComment(vnode.text);
        insert(parentElm, vnode.elm, refElm);
      } else {
        vnode.elm = nodeOps.createTextNode(vnode.text);
        insert(parentElm, vnode.elm, refElm);
      }
    }

    function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
      var i = vnode.data;
      if (isDef(i)) {
        var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
        if (isDef(i = i.hook) && isDef(i = i.init)) {
          i(vnode, false /* hydrating */, parentElm, refElm);
        }
        // after calling the init hook, if the vnode is a child component
        // it should've created a child instance and mounted it. the child
        // component also has set the placeholder vnode's elm.
        // in that case we can just return the element and be done.
        if (isDef(vnode.componentInstance)) {
          initComponent(vnode, insertedVnodeQueue);
          if (isTrue(isReactivated)) {
            reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
          }
          return true
        }
      }
    }

    function initComponent (vnode, insertedVnodeQueue) {
      if (isDef(vnode.data.pendingInsert)) {
        insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
        vnode.data.pendingInsert = null;
      }
      vnode.elm = vnode.componentInstance.$el;
      if (isPatchable(vnode)) {
        invokeCreateHooks(vnode, insertedVnodeQueue);
        setScope(vnode);
      } else {
        // empty component root.
        // skip all element-related modules except for ref (#3455)
        registerRef(vnode);
        // make sure to invoke the insert hook
        insertedVnodeQueue.push(vnode);
      }
    }

    function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
      var i;
      // hack for #4339: a reactivated component with inner transition
      // does not trigger because the inner node's created hooks are not called
      // again. It's not ideal to involve module-specific logic in here but
      // there doesn't seem to be a better way to do it.
      var innerNode = vnode;
      while (innerNode.componentInstance) {
        innerNode = innerNode.componentInstance._vnode;
        if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
          for (i = 0; i < cbs.activate.length; ++i) {
            cbs.activate[i](emptyNode, innerNode);
          }
          insertedVnodeQueue.push(innerNode);
          break
        }
      }
      // unlike a newly created component,
      // a reactivated keep-alive component doesn't insert itself
      insert(parentElm, vnode.elm, refElm);
    }

    function insert (parent, elm, ref$$1) {
      if (isDef(parent)) {
        if (isDef(ref$$1)) {
          if (ref$$1.parentNode === parent) {
            nodeOps.insertBefore(parent, elm, ref$$1);
          }
        } else {
          nodeOps.appendChild(parent, elm);
        }
      }
    }

    function createChildren (vnode, children, insertedVnodeQueue) {
      if (Array.isArray(children)) {
        for (var i = 0; i < children.length; ++i) {
          createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i);
        }
      } else if (isPrimitive(vnode.text)) {
        nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)));
      }
    }

    function isPatchable (vnode) {
      while (vnode.componentInstance) {
        vnode = vnode.componentInstance._vnode;
      }
      return isDef(vnode.tag)
    }

    function invokeCreateHooks (vnode, insertedVnodeQueue) {
      for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
        cbs.create[i$1](emptyNode, vnode);
      }
      i = vnode.data.hook; // Reuse variable
      if (isDef(i)) {
        if (isDef(i.create)) { i.create(emptyNode, vnode); }
        if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
      }
    }

    // set scope id attribute for scoped CSS.
    // this is implemented as a special case to avoid the overhead
    // of going through the normal attribute patching process.
    function setScope (vnode) {
      var i;
      if (isDef(i = vnode.fnScopeId)) {
        nodeOps.setStyleScope(vnode.elm, i);
      } else {
        var ancestor = vnode;
        while (ancestor) {
          if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
            nodeOps.setStyleScope(vnode.elm, i);
          }
          ancestor = ancestor.parent;
        }
      }
      // for slot content they should also get the scopeId from the host instance.
      if (isDef(i = activeInstance) &&
        i !== vnode.context &&
        i !== vnode.fnContext &&
        isDef(i = i.$options._scopeId)
      ) {
        nodeOps.setStyleScope(vnode.elm, i);
      }
    }

    function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
      for (; startIdx <= endIdx; ++startIdx) {
        createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm, false, vnodes, startIdx);
      }
    }

    function invokeDestroyHook (vnode) {
      var i, j;
      var data = vnode.data;
      if (isDef(data)) {
        if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
        for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
      }
      if (isDef(i = vnode.children)) {
        for (j = 0; j < vnode.children.length; ++j) {
          invokeDestroyHook(vnode.children[j]);
        }
      }
    }

    function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
      for (; startIdx <= endIdx; ++startIdx) {
        var ch = vnodes[startIdx];
        if (isDef(ch)) {
          if (isDef(ch.tag)) {
            removeAndInvokeRemoveHook(ch);
            invokeDestroyHook(ch);
          } else { // Text node
            removeNode(ch.elm);
          }
        }
      }
    }

    function removeAndInvokeRemoveHook (vnode, rm) {
      if (isDef(rm) || isDef(vnode.data)) {
        var i;
        var listeners = cbs.remove.length + 1;
        if (isDef(rm)) {
          // we have a recursively passed down rm callback
          // increase the listeners count
          rm.listeners += listeners;
        } else {
          // directly removing
          rm = createRmCb(vnode.elm, listeners);
        }
        // recursively invoke hooks on child component root node
        if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
          removeAndInvokeRemoveHook(i, rm);
        }
        for (i = 0; i < cbs.remove.length; ++i) {
          cbs.remove[i](vnode, rm);
        }
        if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
          i(vnode, rm);
        } else {
          rm();
        }
      } else {
        removeNode(vnode.elm);
      }
    }

    function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
      var oldStartIdx = 0;
      var newStartIdx = 0;
      var oldEndIdx = oldCh.length - 1;
      var oldStartVnode = oldCh[0];
      var oldEndVnode = oldCh[oldEndIdx];
      var newEndIdx = newCh.length - 1;
      var newStartVnode = newCh[0];
      var newEndVnode = newCh[newEndIdx];
      var oldKeyToIdx, idxInOld, vnodeToMove, refElm;

      // removeOnly is a special flag used only by <transition-group>
      // to ensure removed elements stay in correct relative positions
      // during leaving transitions
      var canMove = !removeOnly;

      while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (isUndef(oldStartVnode)) {
          oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
        } else if (isUndef(oldEndVnode)) {
          oldEndVnode = oldCh[--oldEndIdx];
        } else if (sameVnode(oldStartVnode, newStartVnode)) {
          patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
          oldStartVnode = oldCh[++oldStartIdx];
          newStartVnode = newCh[++newStartIdx];
        } else if (sameVnode(oldEndVnode, newEndVnode)) {
          patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
          oldEndVnode = oldCh[--oldEndIdx];
          newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
          patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
          canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
          oldStartVnode = oldCh[++oldStartIdx];
          newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
          patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
          canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
          oldEndVnode = oldCh[--oldEndIdx];
          newStartVnode = newCh[++newStartIdx];
        } else {
          if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
          idxInOld = isDef(newStartVnode.key)
            ? oldKeyToIdx[newStartVnode.key]
            : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
          if (isUndef(idxInOld)) { // New element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
          } else {
            vnodeToMove = oldCh[idxInOld];
            if (sameVnode(vnodeToMove, newStartVnode)) {
              patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue);
              oldCh[idxInOld] = undefined;
              canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
            } else {
              // same key but different element. treat as new element
              createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
            }
          }
          newStartVnode = newCh[++newStartIdx];
        }
      }
      if (oldStartIdx > oldEndIdx) {
        refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
        addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
      } else if (newStartIdx > newEndIdx) {
        removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
      }
    }

    function findIdxInOld (node, oldCh, start, end) {
      for (var i = start; i < end; i++) {
        var c = oldCh[i];
        if (isDef(c) && sameVnode(node, c)) { return i }
      }
    }

    function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
      if (oldVnode === vnode) {
        return
      }

      var elm = vnode.elm = oldVnode.elm;

      if (isTrue(oldVnode.isAsyncPlaceholder)) {
        if (isDef(vnode.asyncFactory.resolved)) {
          hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
        } else {
          vnode.isAsyncPlaceholder = true;
        }
        return
      }

      // reuse element for static trees.
      // note we only do this if the vnode is cloned -
      // if the new node is not cloned it means the render functions have been
      // reset by the hot-reload-api and we need to do a proper re-render.
      if (isTrue(vnode.isStatic) &&
        isTrue(oldVnode.isStatic) &&
        vnode.key === oldVnode.key &&
        (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
      ) {
        vnode.componentInstance = oldVnode.componentInstance;
        return
      }

      var i;
      var data = vnode.data;
      if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
        i(oldVnode, vnode);
      }

      var oldCh = oldVnode.children;
      var ch = vnode.children;
      if (isDef(data) && isPatchable(vnode)) {
        for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
        if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
      }
      if (isUndef(vnode.text)) {
        if (isDef(oldCh) && isDef(ch)) {
          if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
        } else if (isDef(ch)) {
          if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
          addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
        } else if (isDef(oldCh)) {
          removeVnodes(elm, oldCh, 0, oldCh.length - 1);
        } else if (isDef(oldVnode.text)) {
          nodeOps.setTextContent(elm, '');
        }
      } else if (oldVnode.text !== vnode.text) {
        nodeOps.setTextContent(elm, vnode.text);
      }
      if (isDef(data)) {
        if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
      }
    }

    function invokeInsertHook (vnode, queue, initial) {
      // delay insert hooks for component root nodes, invoke them after the
      // element is really inserted
      if (isTrue(initial) && isDef(vnode.parent)) {
        vnode.parent.data.pendingInsert = queue;
      } else {
        for (var i = 0; i < queue.length; ++i) {
          queue[i].data.hook.insert(queue[i]);
        }
      }
    }
    // list of modules that can skip create hook during hydration because they
    // are already rendered on the client or has no need for initialization
    // Note: style is excluded because it relies on initial clone for future
    // deep updates (#7063).
    var isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key');

    // Note: this is a browser-only function so we can assume elms are DOM nodes.
    function hydrate (elm, vnode, insertedVnodeQueue, inVPre) {
      var i;
      var tag = vnode.tag;
      var data = vnode.data;
      var children = vnode.children;
      inVPre = inVPre || (data && data.pre);
      vnode.elm = elm;

      if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
        vnode.isAsyncPlaceholder = true;
        return true
      }
      if (isDef(data)) {
        if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
        if (isDef(i = vnode.componentInstance)) {
          // child component. it should have hydrated its own tree.
          initComponent(vnode, insertedVnodeQueue);
          return true
        }
      }
      if (isDef(tag)) {
        if (isDef(children)) {
          // empty element, allow client to pick up and populate children
          if (!elm.hasChildNodes()) {
            createChildren(vnode, children, insertedVnodeQueue);
          } else {
            // v-html and domProps: innerHTML
            if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
              if (i !== elm.innerHTML) {
                return false
              }
            } else {
              // iterate and compare children lists
              var childrenMatch = true;
              var childNode = elm.firstChild;
              for (var i$1 = 0; i$1 < children.length; i$1++) {
                if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue, inVPre)) {
                  childrenMatch = false;
                  break
                }
                childNode = childNode.nextSibling;
              }
              // if childNode is not null, it means the actual childNodes list is
              // longer than the virtual children list.
              if (!childrenMatch || childNode) {
                return false
              }
            }
          }
        }
        if (isDef(data)) {
          var fullInvoke = false;
          for (var key in data) {
            if (!isRenderedModule(key)) {
              fullInvoke = true;
              invokeCreateHooks(vnode, insertedVnodeQueue);
              break
            }
          }
          if (!fullInvoke && data['class']) {
            // ensure collecting deps for deep class bindings for future updates
            traverse(data['class']);
          }
        }
      } else if (elm.data !== vnode.text) {
        elm.data = vnode.text;
      }
      return true
    }

    return function patch (oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
      if (isUndef(vnode)) {
        if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
        return
      }

      var isInitialPatch = false;
      var insertedVnodeQueue = [];

      if (isUndef(oldVnode)) {
        // empty mount (likely as component), create new root element
        isInitialPatch = true;
        createElm(vnode, insertedVnodeQueue, parentElm, refElm);
      } else {
        var isRealElement = isDef(oldVnode.nodeType);
        if (!isRealElement && sameVnode(oldVnode, vnode)) {
          // patch existing root node
          patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
        } else {
          if (isRealElement) {
            // mounting to a real element
            // check if this is server-rendered content and if we can perform
            // a successful hydration.
            if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
              oldVnode.removeAttribute(SSR_ATTR);
              hydrating = true;
            }
            if (isTrue(hydrating)) {
              if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
                invokeInsertHook(vnode, insertedVnodeQueue, true);
                return oldVnode
              }
            }
            // either not server-rendered, or hydration failed.
            // create an empty node and replace it
            oldVnode = emptyNodeAt(oldVnode);
          }

          // replacing existing element
          var oldElm = oldVnode.elm;
          var parentElm$1 = nodeOps.parentNode(oldElm);

          // create new node
          createElm(
            vnode,
            insertedVnodeQueue,
            // extremely rare edge case: do not insert if old element is in a
            // leaving transition. Only happens when combining transition +
            // keep-alive + HOCs. (#4590)
            oldElm._leaveCb ? null : parentElm$1,
            nodeOps.nextSibling(oldElm)
          );

          // update parent placeholder node element, recursively
          if (isDef(vnode.parent)) {
            var ancestor = vnode.parent;
            var patchable = isPatchable(vnode);
            while (ancestor) {
              for (var i = 0; i < cbs.destroy.length; ++i) {
                cbs.destroy[i](ancestor);
              }
              ancestor.elm = vnode.elm;
              if (patchable) {
                for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                  cbs.create[i$1](emptyNode, ancestor);
                }
                // #6513
                // invoke insert hooks that may have been merged by create hooks.
                // e.g. for directives that uses the "inserted" hook.
                var insert = ancestor.data.hook.insert;
                if (insert.merged) {
                  // start at index 1 to avoid re-invoking component mounted hook
                  for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
                    insert.fns[i$2]();
                  }
                }
              } else {
                registerRef(ancestor);
              }
              ancestor = ancestor.parent;
            }
          }

          // destroy old node
          if (isDef(parentElm$1)) {
            removeVnodes(parentElm$1, [oldVnode], 0, 0);
          } else if (isDef(oldVnode.tag)) {
            invokeDestroyHook(oldVnode);
          }
        }
      }

      invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
      return vnode.elm
    }
  }

  /*  */

  var directives = {
    create: updateDirectives,
    update: updateDirectives,
    destroy: function unbindDirectives (vnode) {
      updateDirectives(vnode, emptyNode);
    }
  };

  function updateDirectives (oldVnode, vnode) {
    if (oldVnode.data.directives || vnode.data.directives) {
      _update(oldVnode, vnode);
    }
  }

  function _update (oldVnode, vnode) {
    var isCreate = oldVnode === emptyNode;
    var isDestroy = vnode === emptyNode;
    var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
    var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

    var dirsWithInsert = [];
    var dirsWithPostpatch = [];

    var key, oldDir, dir;
    for (key in newDirs) {
      oldDir = oldDirs[key];
      dir = newDirs[key];
      if (!oldDir) {
        // new directive, bind
        callHook$1(dir, 'bind', vnode, oldVnode);
        if (dir.def && dir.def.inserted) {
          dirsWithInsert.push(dir);
        }
      } else {
        // existing directive, update
        dir.oldValue = oldDir.value;
        callHook$1(dir, 'update', vnode, oldVnode);
        if (dir.def && dir.def.componentUpdated) {
          dirsWithPostpatch.push(dir);
        }
      }
    }

    if (dirsWithInsert.length) {
      var callInsert = function () {
        for (var i = 0; i < dirsWithInsert.length; i++) {
          callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
        }
      };
      if (isCreate) {
        mergeVNodeHook(vnode, 'insert', callInsert);
      } else {
        callInsert();
      }
    }

    if (dirsWithPostpatch.length) {
      mergeVNodeHook(vnode, 'postpatch', function () {
        for (var i = 0; i < dirsWithPostpatch.length; i++) {
          callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
        }
      });
    }

    if (!isCreate) {
      for (key in oldDirs) {
        if (!newDirs[key]) {
          // no longer present, unbind
          callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
        }
      }
    }
  }

  var emptyModifiers = Object.create(null);

  function normalizeDirectives$1 (
    dirs,
    vm
  ) {
    var res = Object.create(null);
    if (!dirs) {
      // $flow-disable-line
      return res
    }
    var i, dir;
    for (i = 0; i < dirs.length; i++) {
      dir = dirs[i];
      if (!dir.modifiers) {
        // $flow-disable-line
        dir.modifiers = emptyModifiers;
      }
      res[getRawDirName(dir)] = dir;
      dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
    }
    // $flow-disable-line
    return res
  }

  function getRawDirName (dir) {
    return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
  }

  function callHook$1 (dir, hook, vnode, oldVnode, isDestroy) {
    var fn = dir.def && dir.def[hook];
    if (fn) {
      try {
        fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
      } catch (e) {
        handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook"));
      }
    }
  }

  var baseModules = [
    ref,
    directives
  ];

  /*  */

  function updateAttrs (oldVnode, vnode) {
    var opts = vnode.componentOptions;
    if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
      return
    }
    if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
      return
    }
    var key, cur, old;
    var elm = vnode.elm;
    var oldAttrs = oldVnode.data.attrs || {};
    var attrs = vnode.data.attrs || {};
    // clone observed objects, as the user probably wants to mutate it
    if (isDef(attrs.__ob__)) {
      attrs = vnode.data.attrs = extend({}, attrs);
    }

    for (key in attrs) {
      cur = attrs[key];
      old = oldAttrs[key];
      if (old !== cur) {
        setAttr(elm, key, cur);
      }
    }
    // #4391: in IE9, setting type can reset value for input[type=radio]
    // #6666: IE/Edge forces progress value down to 1 before setting a max
    /* istanbul ignore if */
    if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {
      setAttr(elm, 'value', attrs.value);
    }
    for (key in oldAttrs) {
      if (isUndef(attrs[key])) {
        if (isXlink(key)) {
          elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
        } else if (!isEnumeratedAttr(key)) {
          elm.removeAttribute(key);
        }
      }
    }
  }

  function setAttr (el, key, value) {
    if (el.tagName.indexOf('-') > -1) {
      baseSetAttr(el, key, value);
    } else if (isBooleanAttr(key)) {
      // set attribute for blank value
      // e.g. <option disabled>Select one</option>
      if (isFalsyAttrValue(value)) {
        el.removeAttribute(key);
      } else {
        // technically allowfullscreen is a boolean attribute for <iframe>,
        // but Flash expects a value of "true" when used on <embed> tag
        value = key === 'allowfullscreen' && el.tagName === 'EMBED'
          ? 'true'
          : key;
        el.setAttribute(key, value);
      }
    } else if (isEnumeratedAttr(key)) {
      el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
    } else if (isXlink(key)) {
      if (isFalsyAttrValue(value)) {
        el.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else {
        el.setAttributeNS(xlinkNS, key, value);
      }
    } else {
      baseSetAttr(el, key, value);
    }
  }

  function baseSetAttr (el, key, value) {
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // #7138: IE10 & 11 fires input event when setting placeholder on
      // <textarea>... block the first input event and remove the blocker
      // immediately.
      /* istanbul ignore if */
      if (
        isIE && !isIE9 &&
        el.tagName === 'TEXTAREA' &&
        key === 'placeholder' && !el.__ieph
      ) {
        var blocker = function (e) {
          e.stopImmediatePropagation();
          el.removeEventListener('input', blocker);
        };
        el.addEventListener('input', blocker);
        // $flow-disable-line
        el.__ieph = true; /* IE placeholder patched */
      }
      el.setAttribute(key, value);
    }
  }

  var attrs = {
    create: updateAttrs,
    update: updateAttrs
  };

  /*  */

  function updateClass (oldVnode, vnode) {
    var el = vnode.elm;
    var data = vnode.data;
    var oldData = oldVnode.data;
    if (
      isUndef(data.staticClass) &&
      isUndef(data.class) && (
        isUndef(oldData) || (
          isUndef(oldData.staticClass) &&
          isUndef(oldData.class)
        )
      )
    ) {
      return
    }

    var cls = genClassForVnode(vnode);

    // handle transition classes
    var transitionClass = el._transitionClasses;
    if (isDef(transitionClass)) {
      cls = concat(cls, stringifyClass(transitionClass));
    }

    // set the class
    if (cls !== el._prevClass) {
      el.setAttribute('class', cls);
      el._prevClass = cls;
    }
  }

  var klass = {
    create: updateClass,
    update: updateClass
  };

  /*  */

  /*  */









  // add a raw attr (use this in preTransforms)








  // note: this only removes the attr from the Array (attrsList) so that it
  // doesn't get processed by processAttrs.
  // By default it does NOT remove it from the map (attrsMap) because the map is
  // needed during codegen.

  /*  */

  /**
   * Cross-platform code generation for component v-model
   */


  /**
   * Cross-platform codegen helper for generating v-model value assignment code.
   */

  /*  */

  // in some cases, the event used has to be determined at runtime
  // so we used some reserved tokens during compile.
  var RANGE_TOKEN = '__r';
  var CHECKBOX_RADIO_TOKEN = '__c';

  /*  */

  // normalize v-model event tokens that can only be determined at runtime.
  // it's important to place the event as the first in the array because
  // the whole point is ensuring the v-model callback gets called before
  // user-attached handlers.
  function normalizeEvents (on) {
    /* istanbul ignore if */
    if (isDef(on[RANGE_TOKEN])) {
      // IE input[type=range] only supports `change` event
      var event = isIE ? 'change' : 'input';
      on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
      delete on[RANGE_TOKEN];
    }
    // This was originally intended to fix #4521 but no longer necessary
    // after 2.5. Keeping it for backwards compat with generated code from < 2.4
    /* istanbul ignore if */
    if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
      on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
      delete on[CHECKBOX_RADIO_TOKEN];
    }
  }

  var target$1;

  function createOnceHandler (handler, event, capture) {
    var _target = target$1; // save current target element in closure
    return function onceHandler () {
      var res = handler.apply(null, arguments);
      if (res !== null) {
        remove$2(event, onceHandler, capture, _target);
      }
    }
  }

  function add$1 (
    event,
    handler,
    once$$1,
    capture,
    passive
  ) {
    handler = withMacroTask(handler);
    if (once$$1) { handler = createOnceHandler(handler, event, capture); }
    target$1.addEventListener(
      event,
      handler,
      supportsPassive
        ? { capture: capture, passive: passive }
        : capture
    );
  }

  function remove$2 (
    event,
    handler,
    capture,
    _target
  ) {
    (_target || target$1).removeEventListener(
      event,
      handler._withTask || handler,
      capture
    );
  }

  function updateDOMListeners (oldVnode, vnode) {
    if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
      return
    }
    var on = vnode.data.on || {};
    var oldOn = oldVnode.data.on || {};
    target$1 = vnode.elm;
    normalizeEvents(on);
    updateListeners(on, oldOn, add$1, remove$2, vnode.context);
    target$1 = undefined;
  }

  var events = {
    create: updateDOMListeners,
    update: updateDOMListeners
  };

  /*  */

  function updateDOMProps (oldVnode, vnode) {
    if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
      return
    }
    var key, cur;
    var elm = vnode.elm;
    var oldProps = oldVnode.data.domProps || {};
    var props = vnode.data.domProps || {};
    // clone observed objects, as the user probably wants to mutate it
    if (isDef(props.__ob__)) {
      props = vnode.data.domProps = extend({}, props);
    }

    for (key in oldProps) {
      if (isUndef(props[key])) {
        elm[key] = '';
      }
    }
    for (key in props) {
      cur = props[key];
      // ignore children if the node has textContent or innerHTML,
      // as these will throw away existing DOM nodes and cause removal errors
      // on subsequent patches (#3360)
      if (key === 'textContent' || key === 'innerHTML') {
        if (vnode.children) { vnode.children.length = 0; }
        if (cur === oldProps[key]) { continue }
        // #6601 work around Chrome version <= 55 bug where single textNode
        // replaced by innerHTML/textContent retains its parentNode property
        if (elm.childNodes.length === 1) {
          elm.removeChild(elm.childNodes[0]);
        }
      }

      if (key === 'value') {
        // store value as _value as well since
        // non-string values will be stringified
        elm._value = cur;
        // avoid resetting cursor position when value is the same
        var strCur = isUndef(cur) ? '' : String(cur);
        if (shouldUpdateValue(elm, strCur)) {
          elm.value = strCur;
        }
      } else {
        elm[key] = cur;
      }
    }
  }

  // check platforms/web/util/attrs.js acceptValue


  function shouldUpdateValue (elm, checkVal) {
    return (!elm.composing && (
      elm.tagName === 'OPTION' ||
      isNotInFocusAndDirty(elm, checkVal) ||
      isDirtyWithModifiers(elm, checkVal)
    ))
  }

  function isNotInFocusAndDirty (elm, checkVal) {
    // return true when textbox (.number and .trim) loses focus and its value is
    // not equal to the updated value
    var notInFocus = true;
    // #6157
    // work around IE bug when accessing document.activeElement in an iframe
    try { notInFocus = document.activeElement !== elm; } catch (e) {}
    return notInFocus && elm.value !== checkVal
  }

  function isDirtyWithModifiers (elm, newVal) {
    var value = elm.value;
    var modifiers = elm._vModifiers; // injected by v-model runtime
    if (isDef(modifiers)) {
      if (modifiers.lazy) {
        // inputs with lazy should only be updated when not in focus
        return false
      }
      if (modifiers.number) {
        return toNumber(value) !== toNumber(newVal)
      }
      if (modifiers.trim) {
        return value.trim() !== newVal.trim()
      }
    }
    return value !== newVal
  }

  var domProps = {
    create: updateDOMProps,
    update: updateDOMProps
  };

  /*  */

  var parseStyleText = cached(function (cssText) {
    var res = {};
    var listDelimiter = /;(?![^(]*\))/g;
    var propertyDelimiter = /:(.+)/;
    cssText.split(listDelimiter).forEach(function (item) {
      if (item) {
        var tmp = item.split(propertyDelimiter);
        tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
      }
    });
    return res
  });

  // merge static and dynamic style data on the same vnode
  function normalizeStyleData (data) {
    var style = normalizeStyleBinding(data.style);
    // static style is pre-processed into an object during compilation
    // and is always a fresh object, so it's safe to merge into it
    return data.staticStyle
      ? extend(data.staticStyle, style)
      : style
  }

  // normalize possible array / string values into Object
  function normalizeStyleBinding (bindingStyle) {
    if (Array.isArray(bindingStyle)) {
      return toObject(bindingStyle)
    }
    if (typeof bindingStyle === 'string') {
      return parseStyleText(bindingStyle)
    }
    return bindingStyle
  }

  /**
   * parent component style should be after child's
   * so that parent component's style could override it
   */
  function getStyle (vnode, checkChild) {
    var res = {};
    var styleData;

    if (checkChild) {
      var childNode = vnode;
      while (childNode.componentInstance) {
        childNode = childNode.componentInstance._vnode;
        if (
          childNode && childNode.data &&
          (styleData = normalizeStyleData(childNode.data))
        ) {
          extend(res, styleData);
        }
      }
    }

    if ((styleData = normalizeStyleData(vnode.data))) {
      extend(res, styleData);
    }

    var parentNode = vnode;
    while ((parentNode = parentNode.parent)) {
      if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
        extend(res, styleData);
      }
    }
    return res
  }

  /*  */

  var cssVarRE = /^--/;
  var importantRE = /\s*!important$/;
  var setProp = function (el, name, val) {
    /* istanbul ignore if */
    if (cssVarRE.test(name)) {
      el.style.setProperty(name, val);
    } else if (importantRE.test(val)) {
      el.style.setProperty(name, val.replace(importantRE, ''), 'important');
    } else {
      var normalizedName = normalize(name);
      if (Array.isArray(val)) {
        // Support values array created by autoprefixer, e.g.
        // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
        // Set them one by one, and the browser will only set those it can recognize
        for (var i = 0, len = val.length; i < len; i++) {
          el.style[normalizedName] = val[i];
        }
      } else {
        el.style[normalizedName] = val;
      }
    }
  };

  var vendorNames = ['Webkit', 'Moz', 'ms'];

  var emptyStyle;
  var normalize = cached(function (prop) {
    emptyStyle = emptyStyle || document.createElement('div').style;
    prop = camelize(prop);
    if (prop !== 'filter' && (prop in emptyStyle)) {
      return prop
    }
    var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
    for (var i = 0; i < vendorNames.length; i++) {
      var name = vendorNames[i] + capName;
      if (name in emptyStyle) {
        return name
      }
    }
  });

  function updateStyle (oldVnode, vnode) {
    var data = vnode.data;
    var oldData = oldVnode.data;

    if (isUndef(data.staticStyle) && isUndef(data.style) &&
      isUndef(oldData.staticStyle) && isUndef(oldData.style)
    ) {
      return
    }

    var cur, name;
    var el = vnode.elm;
    var oldStaticStyle = oldData.staticStyle;
    var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

    // if static style exists, stylebinding already merged into it when doing normalizeStyleData
    var oldStyle = oldStaticStyle || oldStyleBinding;

    var style = normalizeStyleBinding(vnode.data.style) || {};

    // store normalized style under a different key for next diff
    // make sure to clone it if it's reactive, since the user likely wants
    // to mutate it.
    vnode.data.normalizedStyle = isDef(style.__ob__)
      ? extend({}, style)
      : style;

    var newStyle = getStyle(vnode, true);

    for (name in oldStyle) {
      if (isUndef(newStyle[name])) {
        setProp(el, name, '');
      }
    }
    for (name in newStyle) {
      cur = newStyle[name];
      if (cur !== oldStyle[name]) {
        // ie9 setting to null has no effect, must use empty string
        setProp(el, name, cur == null ? '' : cur);
      }
    }
  }

  var style = {
    create: updateStyle,
    update: updateStyle
  };

  /*  */

  /**
   * Add class with compatibility for SVG since classList is not supported on
   * SVG elements in IE
   */
  function addClass (el, cls) {
    /* istanbul ignore if */
    if (!cls || !(cls = cls.trim())) {
      return
    }

    /* istanbul ignore else */
    if (el.classList) {
      if (cls.indexOf(' ') > -1) {
        cls.split(/\s+/).forEach(function (c) { return el.classList.add(c); });
      } else {
        el.classList.add(cls);
      }
    } else {
      var cur = " " + (el.getAttribute('class') || '') + " ";
      if (cur.indexOf(' ' + cls + ' ') < 0) {
        el.setAttribute('class', (cur + cls).trim());
      }
    }
  }

  /**
   * Remove class with compatibility for SVG since classList is not supported on
   * SVG elements in IE
   */
  function removeClass (el, cls) {
    /* istanbul ignore if */
    if (!cls || !(cls = cls.trim())) {
      return
    }

    /* istanbul ignore else */
    if (el.classList) {
      if (cls.indexOf(' ') > -1) {
        cls.split(/\s+/).forEach(function (c) { return el.classList.remove(c); });
      } else {
        el.classList.remove(cls);
      }
      if (!el.classList.length) {
        el.removeAttribute('class');
      }
    } else {
      var cur = " " + (el.getAttribute('class') || '') + " ";
      var tar = ' ' + cls + ' ';
      while (cur.indexOf(tar) >= 0) {
        cur = cur.replace(tar, ' ');
      }
      cur = cur.trim();
      if (cur) {
        el.setAttribute('class', cur);
      } else {
        el.removeAttribute('class');
      }
    }
  }

  /*  */

  function resolveTransition (def) {
    if (!def) {
      return
    }
    /* istanbul ignore else */
    if (typeof def === 'object') {
      var res = {};
      if (def.css !== false) {
        extend(res, autoCssTransition(def.name || 'v'));
      }
      extend(res, def);
      return res
    } else if (typeof def === 'string') {
      return autoCssTransition(def)
    }
  }

  var autoCssTransition = cached(function (name) {
    return {
      enterClass: (name + "-enter"),
      enterToClass: (name + "-enter-to"),
      enterActiveClass: (name + "-enter-active"),
      leaveClass: (name + "-leave"),
      leaveToClass: (name + "-leave-to"),
      leaveActiveClass: (name + "-leave-active")
    }
  });

  var hasTransition = inBrowser && !isIE9;
  var TRANSITION = 'transition';
  var ANIMATION = 'animation';

  // Transition property/event sniffing
  var transitionProp = 'transition';
  var transitionEndEvent = 'transitionend';
  var animationProp = 'animation';
  var animationEndEvent = 'animationend';
  if (hasTransition) {
    /* istanbul ignore if */
    if (window.ontransitionend === undefined &&
      window.onwebkittransitionend !== undefined
    ) {
      transitionProp = 'WebkitTransition';
      transitionEndEvent = 'webkitTransitionEnd';
    }
    if (window.onanimationend === undefined &&
      window.onwebkitanimationend !== undefined
    ) {
      animationProp = 'WebkitAnimation';
      animationEndEvent = 'webkitAnimationEnd';
    }
  }

  // binding to window is necessary to make hot reload work in IE in strict mode
  var raf = inBrowser
    ? window.requestAnimationFrame
      ? window.requestAnimationFrame.bind(window)
      : setTimeout
    : /* istanbul ignore next */ function (fn) { return fn(); };

  function nextFrame (fn) {
    raf(function () {
      raf(fn);
    });
  }

  function addTransitionClass (el, cls) {
    var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
    if (transitionClasses.indexOf(cls) < 0) {
      transitionClasses.push(cls);
      addClass(el, cls);
    }
  }

  function removeTransitionClass (el, cls) {
    if (el._transitionClasses) {
      remove(el._transitionClasses, cls);
    }
    removeClass(el, cls);
  }

  function whenTransitionEnds (
    el,
    expectedType,
    cb
  ) {
    var ref = getTransitionInfo(el, expectedType);
    var type = ref.type;
    var timeout = ref.timeout;
    var propCount = ref.propCount;
    if (!type) { return cb() }
    var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
    var ended = 0;
    var end = function () {
      el.removeEventListener(event, onEnd);
      cb();
    };
    var onEnd = function (e) {
      if (e.target === el) {
        if (++ended >= propCount) {
          end();
        }
      }
    };
    setTimeout(function () {
      if (ended < propCount) {
        end();
      }
    }, timeout + 1);
    el.addEventListener(event, onEnd);
  }

  var transformRE = /\b(transform|all)(,|$)/;

  function getTransitionInfo (el, expectedType) {
    var styles = window.getComputedStyle(el);
    var transitionDelays = styles[transitionProp + 'Delay'].split(', ');
    var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
    var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
    var animationDelays = styles[animationProp + 'Delay'].split(', ');
    var animationDurations = styles[animationProp + 'Duration'].split(', ');
    var animationTimeout = getTimeout(animationDelays, animationDurations);

    var type;
    var timeout = 0;
    var propCount = 0;
    /* istanbul ignore if */
    if (expectedType === TRANSITION) {
      if (transitionTimeout > 0) {
        type = TRANSITION;
        timeout = transitionTimeout;
        propCount = transitionDurations.length;
      }
    } else if (expectedType === ANIMATION) {
      if (animationTimeout > 0) {
        type = ANIMATION;
        timeout = animationTimeout;
        propCount = animationDurations.length;
      }
    } else {
      timeout = Math.max(transitionTimeout, animationTimeout);
      type = timeout > 0
        ? transitionTimeout > animationTimeout
          ? TRANSITION
          : ANIMATION
        : null;
      propCount = type
        ? type === TRANSITION
          ? transitionDurations.length
          : animationDurations.length
        : 0;
    }
    var hasTransform =
      type === TRANSITION &&
      transformRE.test(styles[transitionProp + 'Property']);
    return {
      type: type,
      timeout: timeout,
      propCount: propCount,
      hasTransform: hasTransform
    }
  }

  function getTimeout (delays, durations) {
    /* istanbul ignore next */
    while (delays.length < durations.length) {
      delays = delays.concat(delays);
    }

    return Math.max.apply(null, durations.map(function (d, i) {
      return toMs(d) + toMs(delays[i])
    }))
  }

  function toMs (s) {
    return Number(s.slice(0, -1)) * 1000
  }

  /*  */

  function enter (vnode, toggleDisplay) {
    var el = vnode.elm;

    // call leave callback now
    if (isDef(el._leaveCb)) {
      el._leaveCb.cancelled = true;
      el._leaveCb();
    }

    var data = resolveTransition(vnode.data.transition);
    if (isUndef(data)) {
      return
    }

    /* istanbul ignore if */
    if (isDef(el._enterCb) || el.nodeType !== 1) {
      return
    }

    var css = data.css;
    var type = data.type;
    var enterClass = data.enterClass;
    var enterToClass = data.enterToClass;
    var enterActiveClass = data.enterActiveClass;
    var appearClass = data.appearClass;
    var appearToClass = data.appearToClass;
    var appearActiveClass = data.appearActiveClass;
    var beforeEnter = data.beforeEnter;
    var enter = data.enter;
    var afterEnter = data.afterEnter;
    var enterCancelled = data.enterCancelled;
    var beforeAppear = data.beforeAppear;
    var appear = data.appear;
    var afterAppear = data.afterAppear;
    var appearCancelled = data.appearCancelled;
    var duration = data.duration;

    // activeInstance will always be the <transition> component managing this
    // transition. One edge case to check is when the <transition> is placed
    // as the root node of a child component. In that case we need to check
    // <transition>'s parent for appear check.
    var context = activeInstance;
    var transitionNode = activeInstance.$vnode;
    while (transitionNode && transitionNode.parent) {
      transitionNode = transitionNode.parent;
      context = transitionNode.context;
    }

    var isAppear = !context._isMounted || !vnode.isRootInsert;

    if (isAppear && !appear && appear !== '') {
      return
    }

    var startClass = isAppear && appearClass
      ? appearClass
      : enterClass;
    var activeClass = isAppear && appearActiveClass
      ? appearActiveClass
      : enterActiveClass;
    var toClass = isAppear && appearToClass
      ? appearToClass
      : enterToClass;

    var beforeEnterHook = isAppear
      ? (beforeAppear || beforeEnter)
      : beforeEnter;
    var enterHook = isAppear
      ? (typeof appear === 'function' ? appear : enter)
      : enter;
    var afterEnterHook = isAppear
      ? (afterAppear || afterEnter)
      : afterEnter;
    var enterCancelledHook = isAppear
      ? (appearCancelled || enterCancelled)
      : enterCancelled;

    var explicitEnterDuration = toNumber(
      isObject(duration)
        ? duration.enter
        : duration
    );

    var expectsCSS = css !== false && !isIE9;
    var userWantsControl = getHookArgumentsLength(enterHook);

    var cb = el._enterCb = once(function () {
      if (expectsCSS) {
        removeTransitionClass(el, toClass);
        removeTransitionClass(el, activeClass);
      }
      if (cb.cancelled) {
        if (expectsCSS) {
          removeTransitionClass(el, startClass);
        }
        enterCancelledHook && enterCancelledHook(el);
      } else {
        afterEnterHook && afterEnterHook(el);
      }
      el._enterCb = null;
    });

    if (!vnode.data.show) {
      // remove pending leave element on enter by injecting an insert hook
      mergeVNodeHook(vnode, 'insert', function () {
        var parent = el.parentNode;
        var pendingNode = parent && parent._pending && parent._pending[vnode.key];
        if (pendingNode &&
          pendingNode.tag === vnode.tag &&
          pendingNode.elm._leaveCb
        ) {
          pendingNode.elm._leaveCb();
        }
        enterHook && enterHook(el, cb);
      });
    }

    // start enter transition
    beforeEnterHook && beforeEnterHook(el);
    if (expectsCSS) {
      addTransitionClass(el, startClass);
      addTransitionClass(el, activeClass);
      nextFrame(function () {
        removeTransitionClass(el, startClass);
        if (!cb.cancelled) {
          addTransitionClass(el, toClass);
          if (!userWantsControl) {
            if (isValidDuration(explicitEnterDuration)) {
              setTimeout(cb, explicitEnterDuration);
            } else {
              whenTransitionEnds(el, type, cb);
            }
          }
        }
      });
    }

    if (vnode.data.show) {
      toggleDisplay && toggleDisplay();
      enterHook && enterHook(el, cb);
    }

    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }

  function leave (vnode, rm) {
    var el = vnode.elm;

    // call enter callback now
    if (isDef(el._enterCb)) {
      el._enterCb.cancelled = true;
      el._enterCb();
    }

    var data = resolveTransition(vnode.data.transition);
    if (isUndef(data) || el.nodeType !== 1) {
      return rm()
    }

    /* istanbul ignore if */
    if (isDef(el._leaveCb)) {
      return
    }

    var css = data.css;
    var type = data.type;
    var leaveClass = data.leaveClass;
    var leaveToClass = data.leaveToClass;
    var leaveActiveClass = data.leaveActiveClass;
    var beforeLeave = data.beforeLeave;
    var leave = data.leave;
    var afterLeave = data.afterLeave;
    var leaveCancelled = data.leaveCancelled;
    var delayLeave = data.delayLeave;
    var duration = data.duration;

    var expectsCSS = css !== false && !isIE9;
    var userWantsControl = getHookArgumentsLength(leave);

    var explicitLeaveDuration = toNumber(
      isObject(duration)
        ? duration.leave
        : duration
    );

    var cb = el._leaveCb = once(function () {
      if (el.parentNode && el.parentNode._pending) {
        el.parentNode._pending[vnode.key] = null;
      }
      if (expectsCSS) {
        removeTransitionClass(el, leaveToClass);
        removeTransitionClass(el, leaveActiveClass);
      }
      if (cb.cancelled) {
        if (expectsCSS) {
          removeTransitionClass(el, leaveClass);
        }
        leaveCancelled && leaveCancelled(el);
      } else {
        rm();
        afterLeave && afterLeave(el);
      }
      el._leaveCb = null;
    });

    if (delayLeave) {
      delayLeave(performLeave);
    } else {
      performLeave();
    }

    function performLeave () {
      // the delayed leave may have already been cancelled
      if (cb.cancelled) {
        return
      }
      // record leaving element
      if (!vnode.data.show) {
        (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
      }
      beforeLeave && beforeLeave(el);
      if (expectsCSS) {
        addTransitionClass(el, leaveClass);
        addTransitionClass(el, leaveActiveClass);
        nextFrame(function () {
          removeTransitionClass(el, leaveClass);
          if (!cb.cancelled) {
            addTransitionClass(el, leaveToClass);
            if (!userWantsControl) {
              if (isValidDuration(explicitLeaveDuration)) {
                setTimeout(cb, explicitLeaveDuration);
              } else {
                whenTransitionEnds(el, type, cb);
              }
            }
          }
        });
      }
      leave && leave(el, cb);
      if (!expectsCSS && !userWantsControl) {
        cb();
      }
    }
  }

  function isValidDuration (val) {
    return typeof val === 'number' && !isNaN(val)
  }

  /**
   * Normalize a transition hook's argument length. The hook may be:
   * - a merged hook (invoker) with the original in .fns
   * - a wrapped component method (check ._length)
   * - a plain function (.length)
   */
  function getHookArgumentsLength (fn) {
    if (isUndef(fn)) {
      return false
    }
    var invokerFns = fn.fns;
    if (isDef(invokerFns)) {
      // invoker
      return getHookArgumentsLength(
        Array.isArray(invokerFns)
          ? invokerFns[0]
          : invokerFns
      )
    } else {
      return (fn._length || fn.length) > 1
    }
  }

  function _enter (_, vnode) {
    if (vnode.data.show !== true) {
      enter(vnode);
    }
  }

  var transition = inBrowser ? {
    create: _enter,
    activate: _enter,
    remove: function remove$$1 (vnode, rm) {
      /* istanbul ignore else */
      if (vnode.data.show !== true) {
        leave(vnode, rm);
      } else {
        rm();
      }
    }
  } : {};

  var platformModules = [
    attrs,
    klass,
    events,
    domProps,
    style,
    transition
  ];

  /*  */

  // the directive module should be applied last, after all
  // built-in modules have been applied.
  var modules = platformModules.concat(baseModules);

  var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

  /**
   * Not type checking this file because flow doesn't like attaching
   * properties to Elements.
   */

  /* istanbul ignore if */
  if (isIE9) {
    // http://www.matts411.com/post/internet-explorer-9-oninput/
    document.addEventListener('selectionchange', function () {
      var el = document.activeElement;
      if (el && el.vmodel) {
        trigger(el, 'input');
      }
    });
  }

  var directive = {
    inserted: function inserted (el, binding, vnode, oldVnode) {
      if (vnode.tag === 'select') {
        // #6903
        if (oldVnode.elm && !oldVnode.elm._vOptions) {
          mergeVNodeHook(vnode, 'postpatch', function () {
            directive.componentUpdated(el, binding, vnode);
          });
        } else {
          setSelected(el, binding, vnode.context);
        }
        el._vOptions = [].map.call(el.options, getValue);
      } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
        el._vModifiers = binding.modifiers;
        if (!binding.modifiers.lazy) {
          el.addEventListener('compositionstart', onCompositionStart);
          el.addEventListener('compositionend', onCompositionEnd);
          // Safari < 10.2 & UIWebView doesn't fire compositionend when
          // switching focus before confirming composition choice
          // this also fixes the issue where some browsers e.g. iOS Chrome
          // fires "change" instead of "input" on autocomplete.
          el.addEventListener('change', onCompositionEnd);
          /* istanbul ignore if */
          if (isIE9) {
            el.vmodel = true;
          }
        }
      }
    },

    componentUpdated: function componentUpdated (el, binding, vnode) {
      if (vnode.tag === 'select') {
        setSelected(el, binding, vnode.context);
        // in case the options rendered by v-for have changed,
        // it's possible that the value is out-of-sync with the rendered options.
        // detect such cases and filter out values that no longer has a matching
        // option in the DOM.
        var prevOptions = el._vOptions;
        var curOptions = el._vOptions = [].map.call(el.options, getValue);
        if (curOptions.some(function (o, i) { return !looseEqual(o, prevOptions[i]); })) {
          // trigger change event if
          // no matching option found for at least one value
          var needReset = el.multiple
            ? binding.value.some(function (v) { return hasNoMatchingOption(v, curOptions); })
            : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions);
          if (needReset) {
            trigger(el, 'change');
          }
        }
      }
    }
  };

  function setSelected (el, binding, vm) {
    actuallySetSelected(el, binding, vm);
    /* istanbul ignore if */
    if (isIE || isEdge) {
      setTimeout(function () {
        actuallySetSelected(el, binding, vm);
      }, 0);
    }
  }

  function actuallySetSelected (el, binding, vm) {
    var value = binding.value;
    var isMultiple = el.multiple;
    if (isMultiple && !Array.isArray(value)) {
      return
    }
    var selected, option;
    for (var i = 0, l = el.options.length; i < l; i++) {
      option = el.options[i];
      if (isMultiple) {
        selected = looseIndexOf(value, getValue(option)) > -1;
        if (option.selected !== selected) {
          option.selected = selected;
        }
      } else {
        if (looseEqual(getValue(option), value)) {
          if (el.selectedIndex !== i) {
            el.selectedIndex = i;
          }
          return
        }
      }
    }
    if (!isMultiple) {
      el.selectedIndex = -1;
    }
  }

  function hasNoMatchingOption (value, options) {
    return options.every(function (o) { return !looseEqual(o, value); })
  }

  function getValue (option) {
    return '_value' in option
      ? option._value
      : option.value
  }

  function onCompositionStart (e) {
    e.target.composing = true;
  }

  function onCompositionEnd (e) {
    // prevent triggering an input event for no reason
    if (!e.target.composing) { return }
    e.target.composing = false;
    trigger(e.target, 'input');
  }

  function trigger (el, type) {
    var e = document.createEvent('HTMLEvents');
    e.initEvent(type, true, true);
    el.dispatchEvent(e);
  }

  /*  */

  // recursively search for possible transition defined inside the component root
  function locateNode (vnode) {
    return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
      ? locateNode(vnode.componentInstance._vnode)
      : vnode
  }

  var show = {
    bind: function bind (el, ref, vnode) {
      var value = ref.value;

      vnode = locateNode(vnode);
      var transition$$1 = vnode.data && vnode.data.transition;
      var originalDisplay = el.__vOriginalDisplay =
        el.style.display === 'none' ? '' : el.style.display;
      if (value && transition$$1) {
        vnode.data.show = true;
        enter(vnode, function () {
          el.style.display = originalDisplay;
        });
      } else {
        el.style.display = value ? originalDisplay : 'none';
      }
    },

    update: function update (el, ref, vnode) {
      var value = ref.value;
      var oldValue = ref.oldValue;

      /* istanbul ignore if */
      if (!value === !oldValue) { return }
      vnode = locateNode(vnode);
      var transition$$1 = vnode.data && vnode.data.transition;
      if (transition$$1) {
        vnode.data.show = true;
        if (value) {
          enter(vnode, function () {
            el.style.display = el.__vOriginalDisplay;
          });
        } else {
          leave(vnode, function () {
            el.style.display = 'none';
          });
        }
      } else {
        el.style.display = value ? el.__vOriginalDisplay : 'none';
      }
    },

    unbind: function unbind (
      el,
      binding,
      vnode,
      oldVnode,
      isDestroy
    ) {
      if (!isDestroy) {
        el.style.display = el.__vOriginalDisplay;
      }
    }
  };

  var platformDirectives = {
    model: directive,
    show: show
  };

  /*  */

  // Provides transition support for a single element/component.
  // supports transition mode (out-in / in-out)

  var transitionProps = {
    name: String,
    appear: Boolean,
    css: Boolean,
    mode: String,
    type: String,
    enterClass: String,
    leaveClass: String,
    enterToClass: String,
    leaveToClass: String,
    enterActiveClass: String,
    leaveActiveClass: String,
    appearClass: String,
    appearActiveClass: String,
    appearToClass: String,
    duration: [Number, String, Object]
  };

  // in case the child is also an abstract component, e.g. <keep-alive>
  // we want to recursively retrieve the real component to be rendered
  function getRealChild (vnode) {
    var compOptions = vnode && vnode.componentOptions;
    if (compOptions && compOptions.Ctor.options.abstract) {
      return getRealChild(getFirstComponentChild(compOptions.children))
    } else {
      return vnode
    }
  }

  function extractTransitionData (comp) {
    var data = {};
    var options = comp.$options;
    // props
    for (var key in options.propsData) {
      data[key] = comp[key];
    }
    // events.
    // extract listeners and pass them directly to the transition methods
    var listeners = options._parentListeners;
    for (var key$1 in listeners) {
      data[camelize(key$1)] = listeners[key$1];
    }
    return data
  }

  function placeholder (h, rawChild) {
    if (/\d-keep-alive$/.test(rawChild.tag)) {
      return h('keep-alive', {
        props: rawChild.componentOptions.propsData
      })
    }
  }

  function hasParentTransition (vnode) {
    while ((vnode = vnode.parent)) {
      if (vnode.data.transition) {
        return true
      }
    }
  }

  function isSameChild (child, oldChild) {
    return oldChild.key === child.key && oldChild.tag === child.tag
  }

  var Transition = {
    name: 'transition',
    props: transitionProps,
    abstract: true,

    render: function render (h) {
      var this$1 = this;

      var children = this.$slots.default;
      if (!children) {
        return
      }

      // filter out text nodes (possible whitespaces)
      children = children.filter(function (c) { return c.tag || isAsyncPlaceholder(c); });
      /* istanbul ignore if */
      if (!children.length) {
        return
      }

      var mode = this.mode;

      var rawChild = children[0];

      // if this is a component root node and the component's
      // parent container node also has transition, skip.
      if (hasParentTransition(this.$vnode)) {
        return rawChild
      }

      // apply transition data to child
      // use getRealChild() to ignore abstract components e.g. keep-alive
      var child = getRealChild(rawChild);
      /* istanbul ignore if */
      if (!child) {
        return rawChild
      }

      if (this._leaving) {
        return placeholder(h, rawChild)
      }

      // ensure a key that is unique to the vnode type and to this transition
      // component instance. This key will be used to remove pending leaving nodes
      // during entering.
      var id = "__transition-" + (this._uid) + "-";
      child.key = child.key == null
        ? child.isComment
          ? id + 'comment'
          : id + child.tag
        : isPrimitive(child.key)
          ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
          : child.key;

      var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
      var oldRawChild = this._vnode;
      var oldChild = getRealChild(oldRawChild);

      // mark v-show
      // so that the transition module can hand over the control to the directive
      if (child.data.directives && child.data.directives.some(function (d) { return d.name === 'show'; })) {
        child.data.show = true;
      }

      if (
        oldChild &&
        oldChild.data &&
        !isSameChild(child, oldChild) &&
        !isAsyncPlaceholder(oldChild) &&
        // #6687 component root is a comment node
        !(oldChild.componentInstance && oldChild.componentInstance._vnode.isComment)
      ) {
        // replace old child transition data with fresh one
        // important for dynamic transitions!
        var oldData = oldChild.data.transition = extend({}, data);
        // handle transition mode
        if (mode === 'out-in') {
          // return placeholder node and queue update when leave finishes
          this._leaving = true;
          mergeVNodeHook(oldData, 'afterLeave', function () {
            this$1._leaving = false;
            this$1.$forceUpdate();
          });
          return placeholder(h, rawChild)
        } else if (mode === 'in-out') {
          if (isAsyncPlaceholder(child)) {
            return oldRawChild
          }
          var delayedLeave;
          var performLeave = function () { delayedLeave(); };
          mergeVNodeHook(data, 'afterEnter', performLeave);
          mergeVNodeHook(data, 'enterCancelled', performLeave);
          mergeVNodeHook(oldData, 'delayLeave', function (leave) { delayedLeave = leave; });
        }
      }

      return rawChild
    }
  };

  /*  */

  // Provides transition support for list items.
  // supports move transitions using the FLIP technique.

  // Because the vdom's children update algorithm is "unstable" - i.e.
  // it doesn't guarantee the relative positioning of removed elements,
  // we force transition-group to update its children into two passes:
  // in the first pass, we remove all nodes that need to be removed,
  // triggering their leaving transition; in the second pass, we insert/move
  // into the final desired state. This way in the second pass removed
  // nodes will remain where they should be.

  var props = extend({
    tag: String,
    moveClass: String
  }, transitionProps);

  delete props.mode;

  var TransitionGroup = {
    props: props,

    render: function render (h) {
      var tag = this.tag || this.$vnode.data.tag || 'span';
      var map = Object.create(null);
      var prevChildren = this.prevChildren = this.children;
      var rawChildren = this.$slots.default || [];
      var children = this.children = [];
      var transitionData = extractTransitionData(this);

      for (var i = 0; i < rawChildren.length; i++) {
        var c = rawChildren[i];
        if (c.tag) {
          if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
            children.push(c);
            map[c.key] = c
            ;(c.data || (c.data = {})).transition = transitionData;
          }
        }
      }

      if (prevChildren) {
        var kept = [];
        var removed = [];
        for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
          var c$1 = prevChildren[i$1];
          c$1.data.transition = transitionData;
          c$1.data.pos = c$1.elm.getBoundingClientRect();
          if (map[c$1.key]) {
            kept.push(c$1);
          } else {
            removed.push(c$1);
          }
        }
        this.kept = h(tag, null, kept);
        this.removed = removed;
      }

      return h(tag, null, children)
    },

    beforeUpdate: function beforeUpdate () {
      // force removing pass
      this.__patch__(
        this._vnode,
        this.kept,
        false, // hydrating
        true // removeOnly (!important, avoids unnecessary moves)
      );
      this._vnode = this.kept;
    },

    updated: function updated () {
      var children = this.prevChildren;
      var moveClass = this.moveClass || ((this.name || 'v') + '-move');
      if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
        return
      }

      // we divide the work into three loops to avoid mixing DOM reads and writes
      // in each iteration - which helps prevent layout thrashing.
      children.forEach(callPendingCbs);
      children.forEach(recordPosition);
      children.forEach(applyTranslation);

      // force reflow to put everything in position
      // assign to this to avoid being removed in tree-shaking
      // $flow-disable-line
      this._reflow = document.body.offsetHeight;

      children.forEach(function (c) {
        if (c.data.moved) {
          var el = c.elm;
          var s = el.style;
          addTransitionClass(el, moveClass);
          s.transform = s.WebkitTransform = s.transitionDuration = '';
          el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
            if (!e || /transform$/.test(e.propertyName)) {
              el.removeEventListener(transitionEndEvent, cb);
              el._moveCb = null;
              removeTransitionClass(el, moveClass);
            }
          });
        }
      });
    },

    methods: {
      hasMove: function hasMove (el, moveClass) {
        /* istanbul ignore if */
        if (!hasTransition) {
          return false
        }
        /* istanbul ignore if */
        if (this._hasMove) {
          return this._hasMove
        }
        // Detect whether an element with the move class applied has
        // CSS transitions. Since the element may be inside an entering
        // transition at this very moment, we make a clone of it and remove
        // all other transition classes applied to ensure only the move class
        // is applied.
        var clone = el.cloneNode();
        if (el._transitionClasses) {
          el._transitionClasses.forEach(function (cls) { removeClass(clone, cls); });
        }
        addClass(clone, moveClass);
        clone.style.display = 'none';
        this.$el.appendChild(clone);
        var info = getTransitionInfo(clone);
        this.$el.removeChild(clone);
        return (this._hasMove = info.hasTransform)
      }
    }
  };

  function callPendingCbs (c) {
    /* istanbul ignore if */
    if (c.elm._moveCb) {
      c.elm._moveCb();
    }
    /* istanbul ignore if */
    if (c.elm._enterCb) {
      c.elm._enterCb();
    }
  }

  function recordPosition (c) {
    c.data.newPos = c.elm.getBoundingClientRect();
  }

  function applyTranslation (c) {
    var oldPos = c.data.pos;
    var newPos = c.data.newPos;
    var dx = oldPos.left - newPos.left;
    var dy = oldPos.top - newPos.top;
    if (dx || dy) {
      c.data.moved = true;
      var s = c.elm.style;
      s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
      s.transitionDuration = '0s';
    }
  }

  var platformComponents = {
    Transition: Transition,
    TransitionGroup: TransitionGroup
  };

  /*  */

  // install platform specific utils
  Vue.config.mustUseProp = mustUseProp;
  Vue.config.isReservedTag = isReservedTag;
  Vue.config.isReservedAttr = isReservedAttr;
  Vue.config.getTagNamespace = getTagNamespace;
  Vue.config.isUnknownElement = isUnknownElement;

  // install platform runtime directives & components
  extend(Vue.options.directives, platformDirectives);
  extend(Vue.options.components, platformComponents);

  // install platform patch function
  Vue.prototype.__patch__ = inBrowser ? patch : noop;

  // public mount method
  Vue.prototype.$mount = function (
    el,
    hydrating
  ) {
    el = el && inBrowser ? query(el) : undefined;
    return mountComponent(this, el, hydrating)
  };

  // devtools global hook
  /* istanbul ignore next */
  if (inBrowser) {
    setTimeout(function () {
      if (config.devtools) {
        if (devtools) {
          devtools.emit('init', Vue);
        }
      }
    }, 0);
  }

  var vue_runtime_esm = /*#__PURE__*/Object.freeze({
    default: Vue
  });

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var require$$0 = ( vue_runtime_esm && Vue ) || vue_runtime_esm;

  var vueClassComponent_common = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, '__esModule', { value: true });

  function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

  var Vue = _interopDefault(require$$0);

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
      return Vue.extend({ mixins: Ctors });
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
      var Super = superProto instanceof Vue
          ? superProto.constructor
          : Vue;
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

  /**
    * vue-custom-element v3.2.1
    * (c) 2018 Karol Fabjańczuk
    * @license MIT
    */
  /**
   * ES6 Object.getPrototypeOf Polyfill
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf
   */

  Object.setPrototypeOf = Object.setPrototypeOf || setPrototypeOf;

  function setPrototypeOf(obj, proto) {
    obj.__proto__ = proto;
    return obj;
  }

  var setPrototypeOf_1 = setPrototypeOf.bind(Object);

  function isES2015() {
    if (typeof Symbol === 'undefined' || typeof Reflect === 'undefined') return false;

    return true;
  }

  var isES2015$1 = isES2015();

  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  function _CustomElement() {
    return Reflect.construct(HTMLElement, [], this.__proto__.constructor);
  }


  Object.setPrototypeOf(_CustomElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(_CustomElement, HTMLElement);
  function registerCustomElement(tag) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (typeof customElements === 'undefined') {
      return;
    }

    function constructorCallback() {
      if (options.shadow === true && HTMLElement.prototype.attachShadow) {
        this.attachShadow({ mode: 'open' });
      }
      typeof options.constructorCallback === 'function' && options.constructorCallback.call(this);
    }
    function connectedCallback() {
      typeof options.connectedCallback === 'function' && options.connectedCallback.call(this);
    }

    function disconnectedCallback() {
      typeof options.disconnectedCallback === 'function' && options.disconnectedCallback.call(this);
    }

    function attributeChangedCallback(name, oldValue, value) {
      typeof options.attributeChangedCallback === 'function' && options.attributeChangedCallback.call(this, name, oldValue, value);
    }

    if (isES2015$1) {
      var CustomElement = function (_CustomElement2) {
        _inherits(CustomElement, _CustomElement2);

        function CustomElement(self) {
          var _ret;

          _classCallCheck(this, CustomElement);

          var _this = _possibleConstructorReturn(this, (CustomElement.__proto__ || Object.getPrototypeOf(CustomElement)).call(this));

          var me = self ? HTMLElement.call(self) : _this;

          constructorCallback.call(me);
          return _ret = me, _possibleConstructorReturn(_this, _ret);
        }

        _createClass(CustomElement, null, [{
          key: 'observedAttributes',
          get: function get() {
            return options.observedAttributes || [];
          }
        }]);

        return CustomElement;
      }(_CustomElement);

      CustomElement.prototype.connectedCallback = connectedCallback;
      CustomElement.prototype.disconnectedCallback = disconnectedCallback;
      CustomElement.prototype.attributeChangedCallback = attributeChangedCallback;

      customElements.define(tag, CustomElement);
      return CustomElement;
    } else {
      var _CustomElement3 = function _CustomElement3(self) {
        var me = self ? HTMLElement.call(self) : this;

        constructorCallback.call(me);
        return me;
      };

      _CustomElement3.observedAttributes = options.observedAttributes || [];

      _CustomElement3.prototype = Object.create(HTMLElement.prototype, {
        constructor: {
          configurable: true,
          writable: true,
          value: _CustomElement3
        }
      });

      _CustomElement3.prototype.connectedCallback = connectedCallback;
      _CustomElement3.prototype.disconnectedCallback = disconnectedCallback;
      _CustomElement3.prototype.attributeChangedCallback = attributeChangedCallback;

      customElements.define(tag, _CustomElement3);
      return _CustomElement3;
    }
  }

  var camelizeRE$1 = /-(\w)/g;
  var camelize$1 = function camelize(str) {
    return str.replace(camelizeRE$1, function (_, c) {
      return c ? c.toUpperCase() : '';
    });
  };
  var hyphenateRE$2 = /([^-])([A-Z])/g;
  var hyphenate$2 = function hyphenate(str) {
    return str.replace(hyphenateRE$2, '$1-$2').replace(hyphenateRE$2, '$1-$2').toLowerCase();
  };

  function toArray$1(list) {
    var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    var i = list.length - start;
    var ret = new Array(i);
    while (i--) {
      ret[i] = list[i + start];
    }
    return ret;
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

  function convertAttributeValue(value, overrideType) {
    var propsValue = value;
    var isBoolean = ['true', 'false'].indexOf(value) > -1;
    var valueParsed = parseFloat(propsValue, 10);
    var isNumber = !isNaN(valueParsed) && isFinite(propsValue) && typeof propsValue === 'string' && !propsValue.match(/^0+[^.]\d*$/g);

    if (overrideType && overrideType !== Boolean) {
      propsValue = overrideType(value);
    } else if (isBoolean || overrideType === Boolean) {
      propsValue = propsValue === 'true';
    } else if (isNumber) {
      propsValue = valueParsed;
    }

    return propsValue;
  }

  function extractProps(collection, props) {
    if (collection && collection.length) {
      collection.forEach(function (prop) {
        var camelCaseProp = camelize$1(prop);
        props.camelCase.indexOf(camelCaseProp) === -1 && props.camelCase.push(camelCaseProp);
      });
    } else if (collection && (typeof collection === 'undefined' ? 'undefined' : _typeof(collection)) === 'object') {
      for (var prop in collection) {
        var camelCaseProp = camelize$1(prop);
        props.camelCase.indexOf(camelCaseProp) === -1 && props.camelCase.push(camelCaseProp);

        if (collection[camelCaseProp] && collection[camelCaseProp].type) {
          props.types[prop] = [].concat(collection[camelCaseProp].type)[0];
        }
      }
    }
  }

  function getProps() {
    var componentDefinition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var props = {
      camelCase: [],
      hyphenate: [],
      types: {}
    };

    if (componentDefinition.mixins) {
      componentDefinition.mixins.forEach(function (mixin) {
        extractProps(mixin.props, props);
      });
    }

    if (componentDefinition.extends && componentDefinition.extends.props) {
      var parentProps = componentDefinition.extends.props;


      extractProps(parentProps, props);
    }

    extractProps(componentDefinition.props, props);

    props.camelCase.forEach(function (prop) {
      props.hyphenate.push(hyphenate$2(prop));
    });

    return props;
  }

  function reactiveProps(element, props) {
    props.camelCase.forEach(function (name, index) {
      Object.defineProperty(element, name, {
        get: function get() {
          return this.__vue_custom_element__[name];
        },
        set: function set(value) {
          if (((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' || typeof value === 'function') && this.__vue_custom_element__) {
            var propName = props.camelCase[index];
            this.__vue_custom_element__[propName] = value;
          } else {
            var type = props.types[props.camelCase[index]];
            this.setAttribute(props.hyphenate[index], convertAttributeValue(value, type));
          }
        }
      });
    });
  }

  function getPropsData(element, componentDefinition, props) {
    var propsData = componentDefinition.propsData || {};

    props.hyphenate.forEach(function (name, index) {
      var propCamelCase = props.camelCase[index];
      var propValue = element.attributes[name] || element[propCamelCase];

      var type = null;
      if (props.types[propCamelCase]) {
        type = props.types[propCamelCase];
      }

      propsData[propCamelCase] = propValue instanceof Attr ? convertAttributeValue(propValue.value, type) : propValue;
    });

    return propsData;
  }

  function getAttributes(children) {
    var attributes = {};

    toArray$1(children.attributes).forEach(function (attribute) {
      attributes[attribute.nodeName === 'vue-slot' ? 'slot' : attribute.nodeName] = attribute.nodeValue;
    });

    return attributes;
  }

  function getChildNodes(element) {
    if (element.childNodes.length) return element.childNodes;
    if (element.content && element.content.childNodes && element.content.childNodes.length) {
      return element.content.childNodes;
    }

    var placeholder = document.createElement('div');

    placeholder.innerHTML = element.innerHTML;

    return placeholder.childNodes;
  }

  function templateElement(createElement, element, elementOptions) {
    var templateChildren = getChildNodes(element);

    var vueTemplateChildren = toArray$1(templateChildren).map(function (child) {
      if (child.nodeName === '#text') return child.nodeValue;

      return createElement(child.tagName, {
        attrs: getAttributes(child),
        domProps: {
          innerHTML: child.innerHTML
        }
      });
    });

    elementOptions.slot = element.id;

    return createElement('template', elementOptions, vueTemplateChildren);
  }

  function getSlots() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var createElement = arguments[1];

    var slots = [];
    toArray$1(children).forEach(function (child) {
      if (child.nodeName === '#text') {
        if (child.nodeValue.trim()) {
          slots.push(createElement('span', child.nodeValue));
        }
      } else if (child.nodeName !== '#comment') {
        var attributes = getAttributes(child);
        var elementOptions = {
          attrs: attributes,
          domProps: {
            innerHTML: child.innerHTML === '' ? child.innerText : child.innerHTML
          }
        };

        if (attributes.slot) {
          elementOptions.slot = attributes.slot;
          attributes.slot = undefined;
        }

        var slotVueElement = child.tagName === 'TEMPLATE' ? templateElement(createElement, child, elementOptions) : createElement(child.tagName, elementOptions);

        slots.push(slotVueElement);
      }
    });

    return slots;
  }

  function customEvent(eventName, detail) {
    var params = { bubbles: false, cancelable: false, detail: detail };
    var event = void 0;
    if (typeof window.CustomEvent === 'function') {
      event = new CustomEvent(eventName, params);
    } else {
      event = document.createEvent('CustomEvent');
      event.initCustomEvent(eventName, params.bubbles, params.cancelable, params.detail);
    }
    return event;
  }

  function customEmit(element, eventName) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    var event = customEvent(eventName, [].concat(args));
    element.dispatchEvent(event);
  }

  function createVueInstance(element, Vue, componentDefinition, props, options) {
    if (!element.__vue_custom_element__) {
      var beforeCreate = function beforeCreate() {
        this.$emit = function emit() {
          var _proto__$$emit;

          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          customEmit.apply(undefined, [element].concat(args));
          this.__proto__ && (_proto__$$emit = this.__proto__.$emit).call.apply(_proto__$$emit, [this].concat(args));
        };
      };

      var ComponentDefinition = Vue.util.extend({}, componentDefinition);
      var propsData = getPropsData(element, ComponentDefinition, props);
      var vueVersion = Vue.version && parseInt(Vue.version.split('.')[0], 10) || 0;

      ComponentDefinition.beforeCreate = [].concat(ComponentDefinition.beforeCreate || [], beforeCreate);

      if (ComponentDefinition._compiled) {
        var ctorOptions = {};
        if (ComponentDefinition._Ctor) {
          ctorOptions = Object.values(ComponentDefinition._Ctor)[0].options;
        }
        ctorOptions.beforeCreate = ComponentDefinition.beforeCreate;
      }

      var rootElement = void 0;

      if (vueVersion >= 2) {
        var elementOriginalChildren = element.cloneNode(true).childNodes;
        rootElement = {
          propsData: propsData,
          props: props.camelCase,
          computed: {
            reactiveProps: function reactiveProps$$1() {
              var _this = this;

              var reactivePropsList = {};
              props.camelCase.forEach(function (prop) {
                reactivePropsList[prop] = _this[prop];
              });

              return reactivePropsList;
            }
          },
          render: function render(createElement) {
            var data = {
              props: this.reactiveProps
            };

            return createElement(ComponentDefinition, data, getSlots(elementOriginalChildren, createElement));
          }
        };
      } else if (vueVersion === 1) {
        rootElement = ComponentDefinition;
        rootElement.propsData = propsData;
      } else {
        rootElement = ComponentDefinition;
        var propsWithDefault = {};
        Object.keys(propsData).forEach(function (prop) {
          propsWithDefault[prop] = { default: propsData[prop] };
        });
        rootElement.props = propsWithDefault;
      }

      var elementInnerHtml = vueVersion >= 2 ? '<div></div>' : ('<div>' + element.innerHTML + '</div>').replace(/vue-slot=/g, 'slot=');
      if (options.shadow && element.shadowRoot) {
        element.shadowRoot.innerHTML = elementInnerHtml;
        rootElement.el = element.shadowRoot.children[0];
      } else {
        element.innerHTML = elementInnerHtml;
        rootElement.el = element.children[0];
      }

      reactiveProps(element, props);

      if (typeof options.beforeCreateVueInstance === 'function') {
        rootElement = options.beforeCreateVueInstance(rootElement) || rootElement;
      }

      element.__vue_custom_element__ = new Vue(rootElement);
      element.__vue_custom_element_props__ = props;
      element.getVueInstance = function () {
        return element.__vue_custom_element__.$children[0];
      };

      if (options.shadow && options.shadowCss && element.shadowRoot) {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(options.shadowCss));

        element.shadowRoot.appendChild(style);
      }
      element.removeAttribute('vce-cloak');
      element.setAttribute('vce-ready', '');
      customEmit(element, 'vce-ready');
    }
  }

  function install(Vue) {
    Vue.customElement = function vueCustomElement(tag, componentDefinition) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var isAsyncComponent = typeof componentDefinition === 'function';
      var optionsProps = isAsyncComponent && { props: options.props || [] };
      var props = getProps(isAsyncComponent ? optionsProps : componentDefinition);

      var CustomElement = registerCustomElement(tag, {
        constructorCallback: function constructorCallback() {
          typeof options.constructorCallback === 'function' && options.constructorCallback.call(this);
        },
        connectedCallback: function connectedCallback() {
          var _this = this;

          var asyncComponentPromise = isAsyncComponent && componentDefinition();
          var isAsyncComponentPromise = asyncComponentPromise && asyncComponentPromise.then && typeof asyncComponentPromise.then === 'function';

          typeof options.connectedCallback === 'function' && options.connectedCallback.call(this);

          if (isAsyncComponent && !isAsyncComponentPromise) {
            throw new Error('Async component ' + tag + ' do not returns Promise');
          }
          if (!this.__detached__) {
            if (isAsyncComponentPromise) {
              asyncComponentPromise.then(function (lazyLoadedComponent) {
                var lazyLoadedComponentProps = getProps(lazyLoadedComponent);
                createVueInstance(_this, Vue, lazyLoadedComponent, lazyLoadedComponentProps, options);
              });
            } else {
              createVueInstance(this, Vue, componentDefinition, props, options);
            }
          }

          this.__detached__ = false;
        },
        disconnectedCallback: function disconnectedCallback() {
          var _this2 = this;

          this.__detached__ = true;
          typeof options.disconnectedCallback === 'function' && options.disconnectedCallback.call(this);

          setTimeout(function () {
            if (_this2.__detached__ && _this2.__vue_custom_element__) {
              _this2.__vue_custom_element__.$destroy(true);
              delete _this2.__vue_custom_element__;
              delete _this2.__vue_custom_element_props__;
            }
          }, options.destroyTimeout || 3000);
        },
        attributeChangedCallback: function attributeChangedCallback(name, oldValue, value) {
          if (this.__vue_custom_element__ && typeof value !== 'undefined') {
            var nameCamelCase = camelize$1(name);
            typeof options.attributeChangedCallback === 'function' && options.attributeChangedCallback.call(this, name, oldValue, value);
            var type = this.__vue_custom_element_props__.types[nameCamelCase];
            this.__vue_custom_element__[nameCamelCase] = convertAttributeValue(value, type);
          }
        },


        observedAttributes: props.hyphenate,

        shadow: !!options.shadow && !!HTMLElement.prototype.attachShadow
      });

      return CustomElement;
    };
  }

  if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(install);
    if (install.installed) {
      install.installed = false;
    }
  }

  var card = createCommonjsModule(function (module, exports) {
  (function webpackUniversalModuleDefinition(root, factory) {
  	module.exports = factory();
  })(window, function() {
  return /******/ (function(modules) { // webpackBootstrap
  /******/ 	// The module cache
  /******/ 	var installedModules = {};
  /******/
  /******/ 	// The require function
  /******/ 	function __webpack_require__(moduleId) {
  /******/
  /******/ 		// Check if module is in cache
  /******/ 		if(installedModules[moduleId]) {
  /******/ 			return installedModules[moduleId].exports;
  /******/ 		}
  /******/ 		// Create a new module (and put it into the cache)
  /******/ 		var module = installedModules[moduleId] = {
  /******/ 			i: moduleId,
  /******/ 			l: false,
  /******/ 			exports: {}
  /******/ 		};
  /******/
  /******/ 		// Execute the module function
  /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
  /******/
  /******/ 		// Flag the module as loaded
  /******/ 		module.l = true;
  /******/
  /******/ 		// Return the exports of the module
  /******/ 		return module.exports;
  /******/ 	}
  /******/
  /******/
  /******/ 	// expose the modules object (__webpack_modules__)
  /******/ 	__webpack_require__.m = modules;
  /******/
  /******/ 	// expose the module cache
  /******/ 	__webpack_require__.c = installedModules;
  /******/
  /******/ 	// define getter function for harmony exports
  /******/ 	__webpack_require__.d = function(exports, name, getter) {
  /******/ 		if(!__webpack_require__.o(exports, name)) {
  /******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
  /******/ 		}
  /******/ 	};
  /******/
  /******/ 	// define __esModule on exports
  /******/ 	__webpack_require__.r = function(exports) {
  /******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
  /******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
  /******/ 		}
  /******/ 		Object.defineProperty(exports, '__esModule', { value: true });
  /******/ 	};
  /******/
  /******/ 	// create a fake namespace object
  /******/ 	// mode & 1: value is a module id, require it
  /******/ 	// mode & 2: merge all properties of value into the ns
  /******/ 	// mode & 4: return value when already ns object
  /******/ 	// mode & 8|1: behave like require
  /******/ 	__webpack_require__.t = function(value, mode) {
  /******/ 		if(mode & 1) value = __webpack_require__(value);
  /******/ 		if(mode & 8) return value;
  /******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
  /******/ 		var ns = Object.create(null);
  /******/ 		__webpack_require__.r(ns);
  /******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
  /******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
  /******/ 		return ns;
  /******/ 	};
  /******/
  /******/ 	// getDefaultExport function for compatibility with non-harmony modules
  /******/ 	__webpack_require__.n = function(module) {
  /******/ 		var getter = module && module.__esModule ?
  /******/ 			function getDefault() { return module['default']; } :
  /******/ 			function getModuleExports() { return module; };
  /******/ 		__webpack_require__.d(getter, 'a', getter);
  /******/ 		return getter;
  /******/ 	};
  /******/
  /******/ 	// Object.prototype.hasOwnProperty.call
  /******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
  /******/
  /******/ 	// __webpack_public_path__
  /******/ 	__webpack_require__.p = "";
  /******/
  /******/
  /******/ 	// Load entry module and return exports
  /******/ 	return __webpack_require__(__webpack_require__.s = "./components/card/index.js");
  /******/ })
  /************************************************************************/
  /******/ ({

  /***/ "./components/base/baseComponentMixin.js":
  /*!***********************************************!*\
    !*** ./components/base/baseComponentMixin.js ***!
    \***********************************************/
  /*! exports provided: baseComponentMixin */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"baseComponentMixin\", function() { return baseComponentMixin; });\nvar baseComponentMixin = {\n  inheritAttrs: false\n};\n\n//# sourceURL=webpack:///./components/base/baseComponentMixin.js?");

  /***/ }),

  /***/ "./components/base/index.js":
  /*!**********************************!*\
    !*** ./components/base/index.js ***!
    \**********************************/
  /*! exports provided: baseComponentMixin, themeClassMixin */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _baseComponentMixin_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./baseComponentMixin.js */ \"./components/base/baseComponentMixin.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"baseComponentMixin\", function() { return _baseComponentMixin_js__WEBPACK_IMPORTED_MODULE_0__[\"baseComponentMixin\"]; });\n\n/* harmony import */ var _themeClassMixin_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./themeClassMixin.js */ \"./components/base/themeClassMixin.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"themeClassMixin\", function() { return _themeClassMixin_js__WEBPACK_IMPORTED_MODULE_1__[\"themeClassMixin\"]; });\n\n\n\n\n//# sourceURL=webpack:///./components/base/index.js?");

  /***/ }),

  /***/ "./components/base/themeClassMixin.js":
  /*!********************************************!*\
    !*** ./components/base/themeClassMixin.js ***!
    \********************************************/
  /*! exports provided: themeClassMixin */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"themeClassMixin\", function() { return themeClassMixin; });\nvar themeProps = ['primary', 'secondary', 'background', 'surface', 'on-primary', 'on-secondary', 'on-surface', 'primary-bg', 'secondary-bg', 'text-primary-on-light', 'text-secondary-on-light', 'text-hint-on-light', 'text-disabled-on-light', 'text-icon-on-light', 'text-primary-on-dark', 'text-secondary-on-dark', 'text-hint-on-dark', 'text-disabled-on-dark', 'text-icon-on-dark'];\nvar themeClassMixin = {\n  props: {\n    theming: {\n      type: String,\n      default: ''\n    }\n  },\n  mounted: function mounted() {\n    if (themeProps.indexOf(this.theming) > -1) {\n      this.$el.classList.add('mdc-theme--' + this.theming);\n    }\n  }\n};\n\n//# sourceURL=webpack:///./components/base/themeClassMixin.js?");

  /***/ }),

  /***/ "./components/card/Card.vue":
  /*!**********************************!*\
    !*** ./components/card/Card.vue ***!
    \**********************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Card_vue_vue_type_template_id_fcf656b8__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Card.vue?vue&type=template&id=fcf656b8 */ \"./components/card/Card.vue?vue&type=template&id=fcf656b8\");\n/* harmony import */ var _Card_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Card.vue?vue&type=script&lang=js */ \"./components/card/Card.vue?vue&type=script&lang=js\");\n/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ \"./node_modules/vue-loader/lib/runtime/componentNormalizer.js\");\n\n\n\n\n\n/* normalize component */\n\nvar component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(\n  _Card_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  _Card_vue_vue_type_template_id_fcf656b8__WEBPACK_IMPORTED_MODULE_0__[\"render\"],\n  _Card_vue_vue_type_template_id_fcf656b8__WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"],\n  false,\n  null,\n  null,\n  null\n  \n)\n\n/* hot reload */\nif (false) { var api; }\ncomponent.options.__file = \"components/card/Card.vue\"\n/* harmony default export */ __webpack_exports__[\"default\"] = (component.exports);\n\n//# sourceURL=webpack:///./components/card/Card.vue?");

  /***/ }),

  /***/ "./components/card/Card.vue?vue&type=script&lang=js":
  /*!**********************************************************!*\
    !*** ./components/card/Card.vue?vue&type=script&lang=js ***!
    \**********************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_1_node_modules_vue_loader_lib_index_js_vue_loader_options_Card_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib??ref--1!../../node_modules/vue-loader/lib??vue-loader-options!./Card.vue?vue&type=script&lang=js */ \"./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./components/card/Card.vue?vue&type=script&lang=js\");\n/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__[\"default\"] = (_node_modules_babel_loader_lib_index_js_ref_1_node_modules_vue_loader_lib_index_js_vue_loader_options_Card_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]); \n\n//# sourceURL=webpack:///./components/card/Card.vue?");

  /***/ }),

  /***/ "./components/card/Card.vue?vue&type=template&id=fcf656b8":
  /*!****************************************************************!*\
    !*** ./components/card/Card.vue?vue&type=template&id=fcf656b8 ***!
    \****************************************************************/
  /*! exports provided: render, staticRenderFns */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Card_vue_vue_type_template_id_fcf656b8__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib??vue-loader-options!./Card.vue?vue&type=template&id=fcf656b8 */ \"./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./components/card/Card.vue?vue&type=template&id=fcf656b8\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Card_vue_vue_type_template_id_fcf656b8__WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Card_vue_vue_type_template_id_fcf656b8__WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"]; });\n\n\n\n//# sourceURL=webpack:///./components/card/Card.vue?");

  /***/ }),

  /***/ "./components/card/CardMedia.vue":
  /*!***************************************!*\
    !*** ./components/card/CardMedia.vue ***!
    \***************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _CardMedia_vue_vue_type_template_id_4386f5d0__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CardMedia.vue?vue&type=template&id=4386f5d0 */ \"./components/card/CardMedia.vue?vue&type=template&id=4386f5d0\");\n/* harmony import */ var _CardMedia_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CardMedia.vue?vue&type=script&lang=js */ \"./components/card/CardMedia.vue?vue&type=script&lang=js\");\n/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ \"./node_modules/vue-loader/lib/runtime/componentNormalizer.js\");\n\n\n\n\n\n/* normalize component */\n\nvar component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(\n  _CardMedia_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  _CardMedia_vue_vue_type_template_id_4386f5d0__WEBPACK_IMPORTED_MODULE_0__[\"render\"],\n  _CardMedia_vue_vue_type_template_id_4386f5d0__WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"],\n  false,\n  null,\n  null,\n  null\n  \n)\n\n/* hot reload */\nif (false) { var api; }\ncomponent.options.__file = \"components/card/CardMedia.vue\"\n/* harmony default export */ __webpack_exports__[\"default\"] = (component.exports);\n\n//# sourceURL=webpack:///./components/card/CardMedia.vue?");

  /***/ }),

  /***/ "./components/card/CardMedia.vue?vue&type=script&lang=js":
  /*!***************************************************************!*\
    !*** ./components/card/CardMedia.vue?vue&type=script&lang=js ***!
    \***************************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_1_node_modules_vue_loader_lib_index_js_vue_loader_options_CardMedia_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib??ref--1!../../node_modules/vue-loader/lib??vue-loader-options!./CardMedia.vue?vue&type=script&lang=js */ \"./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./components/card/CardMedia.vue?vue&type=script&lang=js\");\n/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__[\"default\"] = (_node_modules_babel_loader_lib_index_js_ref_1_node_modules_vue_loader_lib_index_js_vue_loader_options_CardMedia_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]); \n\n//# sourceURL=webpack:///./components/card/CardMedia.vue?");

  /***/ }),

  /***/ "./components/card/CardMedia.vue?vue&type=template&id=4386f5d0":
  /*!*********************************************************************!*\
    !*** ./components/card/CardMedia.vue?vue&type=template&id=4386f5d0 ***!
    \*********************************************************************/
  /*! exports provided: render, staticRenderFns */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CardMedia_vue_vue_type_template_id_4386f5d0__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib??vue-loader-options!./CardMedia.vue?vue&type=template&id=4386f5d0 */ \"./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./components/card/CardMedia.vue?vue&type=template&id=4386f5d0\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CardMedia_vue_vue_type_template_id_4386f5d0__WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CardMedia_vue_vue_type_template_id_4386f5d0__WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"]; });\n\n\n\n//# sourceURL=webpack:///./components/card/CardMedia.vue?");

  /***/ }),

  /***/ "./components/card/index.js":
  /*!**********************************!*\
    !*** ./components/card/index.js ***!
    \**********************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Card_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Card.vue */ \"./components/card/Card.vue\");\n/* harmony import */ var _CardMedia_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CardMedia.vue */ \"./components/card/CardMedia.vue\");\n/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./styles.scss */ \"./components/card/styles.scss\");\n/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_styles_scss__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../ */ \"./components/index.js\");\n\n\n\n\nvar plugin = {\n  install: function install(vm) {\n    vm.component('m-card', _Card_vue__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n    vm.component('m-card-media', _CardMedia_vue__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n  }\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = (plugin);\nObject(___WEBPACK_IMPORTED_MODULE_3__[\"initPlugin\"])(plugin);\n\n//# sourceURL=webpack:///./components/card/index.js?");

  /***/ }),

  /***/ "./components/card/styles.scss":
  /*!*************************************!*\
    !*** ./components/card/styles.scss ***!
    \*************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {

  eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./components/card/styles.scss?");

  /***/ }),

  /***/ "./components/debounce.js":
  /*!********************************!*\
    !*** ./components/debounce.js ***!
    \********************************/
  /*! exports provided: debounce */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"debounce\", function() { return debounce; });\nfunction debounce(fn, debounceDuration) {\n  debounceDuration = debounceDuration || 100;\n  return function () {\n    if (!fn.debouncing) {\n      var args = Array.prototype.slice.apply(arguments);\n      fn.lastReturnVal = fn.apply(window, args);\n      fn.debouncing = true;\n    }\n\n    clearTimeout(fn.debounceTimeout);\n    fn.debounceTimeout = setTimeout(function () {\n      fn.debouncing = false;\n    }, debounceDuration);\n    return fn.lastReturnVal;\n  };\n}\n\n//# sourceURL=webpack:///./components/debounce.js?");

  /***/ }),

  /***/ "./components/index.js":
  /*!*****************************!*\
    !*** ./components/index.js ***!
    \*****************************/
  /*! exports provided: debounce, initPlugin */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _debounce_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./debounce.js */ \"./components/debounce.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"debounce\", function() { return _debounce_js__WEBPACK_IMPORTED_MODULE_0__[\"debounce\"]; });\n\n/* harmony import */ var _initPlugin_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./initPlugin.js */ \"./components/initPlugin.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"initPlugin\", function() { return _initPlugin_js__WEBPACK_IMPORTED_MODULE_1__[\"initPlugin\"]; });\n\n\n\n\n//# sourceURL=webpack:///./components/index.js?");

  /***/ }),

  /***/ "./components/initPlugin.js":
  /*!**********************************!*\
    !*** ./components/initPlugin.js ***!
    \**********************************/
  /*! exports provided: initPlugin */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"initPlugin\", function() { return initPlugin; });\nfunction initPlugin(plugin) {\n  if (typeof window !== 'undefined' && window.Vue) {\n    window.Vue.use(plugin);\n  }\n}\n\n//# sourceURL=webpack:///./components/initPlugin.js?");

  /***/ }),

  /***/ "./node_modules/@material/base/component.js":
  /*!**************************************************!*\
    !*** ./node_modules/@material/base/component.js ***!
    \**************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _foundation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./foundation */ \"./node_modules/@material/base/foundation.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n/**\n * @license\n * Copyright 2016 Google Inc.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *   http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n/**\n * @template F\n */\n\nvar MDCComponent =\n/*#__PURE__*/\nfunction () {\n  _createClass(MDCComponent, null, [{\n    key: \"attachTo\",\n\n    /**\n     * @param {!Element} root\n     * @return {!MDCComponent}\n     */\n    value: function attachTo(root) {\n      // Subclasses which extend MDCBase should provide an attachTo() method that takes a root element and\n      // returns an instantiated component with its root set to that element. Also note that in the cases of\n      // subclasses, an explicit foundation class will not have to be passed in; it will simply be initialized\n      // from getDefaultFoundation().\n      return new MDCComponent(root, new _foundation__WEBPACK_IMPORTED_MODULE_0__[\"default\"]());\n    }\n    /**\n     * @param {!Element} root\n     * @param {F=} foundation\n     * @param {...?} args\n     */\n\n  }]);\n\n  function MDCComponent(root) {\n    var foundation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;\n\n    _classCallCheck(this, MDCComponent);\n\n    /** @protected {!Element} */\n    this.root_ = root;\n\n    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {\n      args[_key - 2] = arguments[_key];\n    }\n\n    this.initialize.apply(this, args); // Note that we initialize foundation here and not within the constructor's default param so that\n    // this.root_ is defined and can be used within the foundation class.\n\n    /** @protected {!F} */\n\n    this.foundation_ = foundation === undefined ? this.getDefaultFoundation() : foundation;\n    this.foundation_.init();\n    this.initialSyncWithDOM();\n  }\n\n  _createClass(MDCComponent, [{\n    key: \"initialize\",\n    value: function initialize()\n    /* ...args */\n    {} // Subclasses can override this to do any additional setup work that would be considered part of a\n    // \"constructor\". Essentially, it is a hook into the parent constructor before the foundation is\n    // initialized. Any additional arguments besides root and foundation will be passed in here.\n\n    /**\n     * @return {!F} foundation\n     */\n\n  }, {\n    key: \"getDefaultFoundation\",\n    value: function getDefaultFoundation() {\n      // Subclasses must override this method to return a properly configured foundation class for the\n      // component.\n      throw new Error('Subclasses must override getDefaultFoundation to return a properly configured ' + 'foundation class');\n    }\n  }, {\n    key: \"initialSyncWithDOM\",\n    value: function initialSyncWithDOM() {// Subclasses should override this method if they need to perform work to synchronize with a host DOM\n      // object. An example of this would be a form control wrapper that needs to synchronize its internal state\n      // to some property or attribute of the host DOM. Please note: this is *not* the place to perform DOM\n      // reads/writes that would cause layout / paint, as this is called synchronously from within the constructor.\n    }\n  }, {\n    key: \"destroy\",\n    value: function destroy() {\n      // Subclasses may implement this method to release any resources / deregister any listeners they have\n      // attached. An example of this might be deregistering a resize event from the window object.\n      this.foundation_.destroy();\n    }\n    /**\n     * Wrapper method to add an event listener to the component's root element. This is most useful when\n     * listening for custom events.\n     * @param {string} evtType\n     * @param {!Function} handler\n     */\n\n  }, {\n    key: \"listen\",\n    value: function listen(evtType, handler) {\n      this.root_.addEventListener(evtType, handler);\n    }\n    /**\n     * Wrapper method to remove an event listener to the component's root element. This is most useful when\n     * unlistening for custom events.\n     * @param {string} evtType\n     * @param {!Function} handler\n     */\n\n  }, {\n    key: \"unlisten\",\n    value: function unlisten(evtType, handler) {\n      this.root_.removeEventListener(evtType, handler);\n    }\n    /**\n     * Fires a cross-browser-compatible custom event from the component root of the given type,\n     * with the given data.\n     * @param {string} evtType\n     * @param {!Object} evtData\n     * @param {boolean=} shouldBubble\n     */\n\n  }, {\n    key: \"emit\",\n    value: function emit(evtType, evtData) {\n      var shouldBubble = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;\n      var evt;\n\n      if (typeof CustomEvent === 'function') {\n        evt = new CustomEvent(evtType, {\n          detail: evtData,\n          bubbles: shouldBubble\n        });\n      } else {\n        evt = document.createEvent('CustomEvent');\n        evt.initCustomEvent(evtType, shouldBubble, false, evtData);\n      }\n\n      this.root_.dispatchEvent(evt);\n    }\n  }]);\n\n  return MDCComponent;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MDCComponent);\n\n//# sourceURL=webpack:///./node_modules/@material/base/component.js?");

  /***/ }),

  /***/ "./node_modules/@material/base/foundation.js":
  /*!***************************************************!*\
    !*** ./node_modules/@material/base/foundation.js ***!
    \***************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n/**\n * @license\n * Copyright 2016 Google Inc.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *   http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n/**\n * @template A\n */\nvar MDCFoundation =\n/*#__PURE__*/\nfunction () {\n  _createClass(MDCFoundation, null, [{\n    key: \"cssClasses\",\n\n    /** @return enum{cssClasses} */\n    get: function get() {\n      // Classes extending MDCFoundation should implement this method to return an object which exports every\n      // CSS class the foundation class needs as a property. e.g. {ACTIVE: 'mdc-component--active'}\n      return {};\n    }\n    /** @return enum{strings} */\n\n  }, {\n    key: \"strings\",\n    get: function get() {\n      // Classes extending MDCFoundation should implement this method to return an object which exports all\n      // semantic strings as constants. e.g. {ARIA_ROLE: 'tablist'}\n      return {};\n    }\n    /** @return enum{numbers} */\n\n  }, {\n    key: \"numbers\",\n    get: function get() {\n      // Classes extending MDCFoundation should implement this method to return an object which exports all\n      // of its semantic numbers as constants. e.g. {ANIMATION_DELAY_MS: 350}\n      return {};\n    }\n    /** @return {!Object} */\n\n  }, {\n    key: \"defaultAdapter\",\n    get: function get() {\n      // Classes extending MDCFoundation may choose to implement this getter in order to provide a convenient\n      // way of viewing the necessary methods of an adapter. In the future, this could also be used for adapter\n      // validation.\n      return {};\n    }\n    /**\n     * @param {A=} adapter\n     */\n\n  }]);\n\n  function MDCFoundation() {\n    var adapter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};\n\n    _classCallCheck(this, MDCFoundation);\n\n    /** @protected {!A} */\n    this.adapter_ = adapter;\n  }\n\n  _createClass(MDCFoundation, [{\n    key: \"init\",\n    value: function init() {// Subclasses should override this method to perform initialization routines (registering events, etc.)\n    }\n  }, {\n    key: \"destroy\",\n    value: function destroy() {// Subclasses should override this method to perform de-initialization routines (de-registering events, etc.)\n    }\n  }]);\n\n  return MDCFoundation;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MDCFoundation);\n\n//# sourceURL=webpack:///./node_modules/@material/base/foundation.js?");

  /***/ }),

  /***/ "./node_modules/@material/ripple/adapter.js":
  /*!**************************************************!*\
    !*** ./node_modules/@material/ripple/adapter.js ***!
    \**************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n/**\n * @license\n * Copyright 2016 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n/* eslint no-unused-vars: [2, {\"args\": \"none\"}] */\n\n/**\n * Adapter for MDC Ripple. Provides an interface for managing\n * - classes\n * - dom\n * - CSS variables\n * - position\n * - dimensions\n * - scroll position\n * - event handlers\n * - unbounded, active and disabled states\n *\n * Additionally, provides type information for the adapter to the Closure\n * compiler.\n *\n * Implement this adapter for your framework of choice to delegate updates to\n * the component in your framework of choice. See architecture documentation\n * for more details.\n * https://github.com/material-components/material-components-web/blob/master/docs/code/architecture.md\n *\n * @record\n */\nvar MDCRippleAdapter =\n/*#__PURE__*/\nfunction () {\n  function MDCRippleAdapter() {\n    _classCallCheck(this, MDCRippleAdapter);\n  }\n\n  _createClass(MDCRippleAdapter, [{\n    key: \"browserSupportsCssVars\",\n\n    /** @return {boolean} */\n    value: function browserSupportsCssVars() {}\n    /** @return {boolean} */\n\n  }, {\n    key: \"isUnbounded\",\n    value: function isUnbounded() {}\n    /** @return {boolean} */\n\n  }, {\n    key: \"isSurfaceActive\",\n    value: function isSurfaceActive() {}\n    /** @return {boolean} */\n\n  }, {\n    key: \"isSurfaceDisabled\",\n    value: function isSurfaceDisabled() {}\n    /** @param {string} className */\n\n  }, {\n    key: \"addClass\",\n    value: function addClass(className) {}\n    /** @param {string} className */\n\n  }, {\n    key: \"removeClass\",\n    value: function removeClass(className) {}\n    /** @param {!EventTarget} target */\n\n  }, {\n    key: \"containsEventTarget\",\n    value: function containsEventTarget(target) {}\n    /**\n     * @param {string} evtType\n     * @param {!Function} handler\n     */\n\n  }, {\n    key: \"registerInteractionHandler\",\n    value: function registerInteractionHandler(evtType, handler) {}\n    /**\n     * @param {string} evtType\n     * @param {!Function} handler\n     */\n\n  }, {\n    key: \"deregisterInteractionHandler\",\n    value: function deregisterInteractionHandler(evtType, handler) {}\n    /**\n     * @param {string} evtType\n     * @param {!Function} handler\n     */\n\n  }, {\n    key: \"registerDocumentInteractionHandler\",\n    value: function registerDocumentInteractionHandler(evtType, handler) {}\n    /**\n     * @param {string} evtType\n     * @param {!Function} handler\n     */\n\n  }, {\n    key: \"deregisterDocumentInteractionHandler\",\n    value: function deregisterDocumentInteractionHandler(evtType, handler) {}\n    /**\n     * @param {!Function} handler\n     */\n\n  }, {\n    key: \"registerResizeHandler\",\n    value: function registerResizeHandler(handler) {}\n    /**\n     * @param {!Function} handler\n     */\n\n  }, {\n    key: \"deregisterResizeHandler\",\n    value: function deregisterResizeHandler(handler) {}\n    /**\n     * @param {string} varName\n     * @param {?number|string} value\n     */\n\n  }, {\n    key: \"updateCssVariable\",\n    value: function updateCssVariable(varName, value) {}\n    /** @return {!ClientRect} */\n\n  }, {\n    key: \"computeBoundingRect\",\n    value: function computeBoundingRect() {}\n    /** @return {{x: number, y: number}} */\n\n  }, {\n    key: \"getWindowPageOffset\",\n    value: function getWindowPageOffset() {}\n  }]);\n\n  return MDCRippleAdapter;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MDCRippleAdapter);\n\n//# sourceURL=webpack:///./node_modules/@material/ripple/adapter.js?");

  /***/ }),

  /***/ "./node_modules/@material/ripple/constants.js":
  /*!****************************************************!*\
    !*** ./node_modules/@material/ripple/constants.js ***!
    \****************************************************/
  /*! exports provided: cssClasses, strings, numbers */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"cssClasses\", function() { return cssClasses; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"strings\", function() { return strings; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"numbers\", function() { return numbers; });\n/**\n * @license\n * Copyright 2016 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\nvar cssClasses = {\n  // Ripple is a special case where the \"root\" component is really a \"mixin\" of sorts,\n  // given that it's an 'upgrade' to an existing component. That being said it is the root\n  // CSS class that all other CSS classes derive from.\n  ROOT: 'mdc-ripple-upgraded',\n  UNBOUNDED: 'mdc-ripple-upgraded--unbounded',\n  BG_FOCUSED: 'mdc-ripple-upgraded--background-focused',\n  FG_ACTIVATION: 'mdc-ripple-upgraded--foreground-activation',\n  FG_DEACTIVATION: 'mdc-ripple-upgraded--foreground-deactivation'\n};\nvar strings = {\n  VAR_LEFT: '--mdc-ripple-left',\n  VAR_TOP: '--mdc-ripple-top',\n  VAR_FG_SIZE: '--mdc-ripple-fg-size',\n  VAR_FG_SCALE: '--mdc-ripple-fg-scale',\n  VAR_FG_TRANSLATE_START: '--mdc-ripple-fg-translate-start',\n  VAR_FG_TRANSLATE_END: '--mdc-ripple-fg-translate-end'\n};\nvar numbers = {\n  PADDING: 10,\n  INITIAL_ORIGIN_SCALE: 0.6,\n  DEACTIVATION_TIMEOUT_MS: 225,\n  // Corresponds to $mdc-ripple-translate-duration (i.e. activation animation duration)\n  FG_DEACTIVATION_MS: 150,\n  // Corresponds to $mdc-ripple-fade-out-duration (i.e. deactivation animation duration)\n  TAP_DELAY_MS: 300 // Delay between touch and simulated mouse events on touch devices\n\n};\n\n\n//# sourceURL=webpack:///./node_modules/@material/ripple/constants.js?");

  /***/ }),

  /***/ "./node_modules/@material/ripple/foundation.js":
  /*!*****************************************************!*\
    !*** ./node_modules/@material/ripple/foundation.js ***!
    \*****************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _material_base_foundation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @material/base/foundation */ \"./node_modules/@material/base/foundation.js\");\n/* harmony import */ var _adapter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./adapter */ \"./node_modules/@material/ripple/adapter.js\");\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ \"./node_modules/@material/ripple/constants.js\");\n/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util */ \"./node_modules/@material/ripple/util.js\");\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\n/**\n * @license\n * Copyright 2016 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n\n\n\n/**\n * @typedef {{\n *   isActivated: (boolean|undefined),\n *   hasDeactivationUXRun: (boolean|undefined),\n *   wasActivatedByPointer: (boolean|undefined),\n *   wasElementMadeActive: (boolean|undefined),\n *   activationEvent: Event,\n *   isProgrammatic: (boolean|undefined)\n * }}\n */\n\nvar ActivationStateType;\n/**\n * @typedef {{\n *   activate: (string|undefined),\n *   deactivate: (string|undefined),\n *   focus: (string|undefined),\n *   blur: (string|undefined)\n * }}\n */\n\nvar ListenerInfoType;\n/**\n * @typedef {{\n *   activate: function(!Event),\n *   deactivate: function(!Event),\n *   focus: function(),\n *   blur: function()\n * }}\n */\n\nvar ListenersType;\n/**\n * @typedef {{\n *   x: number,\n *   y: number\n * }}\n */\n\nvar PointType; // Activation events registered on the root element of each instance for activation\n\nvar ACTIVATION_EVENT_TYPES = ['touchstart', 'pointerdown', 'mousedown', 'keydown']; // Deactivation events registered on documentElement when a pointer-related down event occurs\n\nvar POINTER_DEACTIVATION_EVENT_TYPES = ['touchend', 'pointerup', 'mouseup']; // Tracks activations that have occurred on the current frame, to avoid simultaneous nested activations\n\n/** @type {!Array<!EventTarget>} */\n\nvar activatedTargets = [];\n/**\n * @extends {MDCFoundation<!MDCRippleAdapter>}\n */\n\nvar MDCRippleFoundation =\n/*#__PURE__*/\nfunction (_MDCFoundation) {\n  _inherits(MDCRippleFoundation, _MDCFoundation);\n\n  _createClass(MDCRippleFoundation, null, [{\n    key: \"cssClasses\",\n    get: function get() {\n      return _constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"];\n    }\n  }, {\n    key: \"strings\",\n    get: function get() {\n      return _constants__WEBPACK_IMPORTED_MODULE_2__[\"strings\"];\n    }\n  }, {\n    key: \"numbers\",\n    get: function get() {\n      return _constants__WEBPACK_IMPORTED_MODULE_2__[\"numbers\"];\n    }\n  }, {\n    key: \"defaultAdapter\",\n    get: function get() {\n      return {\n        browserSupportsCssVars: function browserSupportsCssVars()\n        /* boolean - cached */\n        {},\n        isUnbounded: function isUnbounded()\n        /* boolean */\n        {},\n        isSurfaceActive: function isSurfaceActive()\n        /* boolean */\n        {},\n        isSurfaceDisabled: function isSurfaceDisabled()\n        /* boolean */\n        {},\n        addClass: function addClass()\n        /* className: string */\n        {},\n        removeClass: function removeClass()\n        /* className: string */\n        {},\n        containsEventTarget: function containsEventTarget()\n        /* target: !EventTarget */\n        {},\n        registerInteractionHandler: function registerInteractionHandler()\n        /* evtType: string, handler: EventListener */\n        {},\n        deregisterInteractionHandler: function deregisterInteractionHandler()\n        /* evtType: string, handler: EventListener */\n        {},\n        registerDocumentInteractionHandler: function registerDocumentInteractionHandler()\n        /* evtType: string, handler: EventListener */\n        {},\n        deregisterDocumentInteractionHandler: function deregisterDocumentInteractionHandler()\n        /* evtType: string, handler: EventListener */\n        {},\n        registerResizeHandler: function registerResizeHandler()\n        /* handler: EventListener */\n        {},\n        deregisterResizeHandler: function deregisterResizeHandler()\n        /* handler: EventListener */\n        {},\n        updateCssVariable: function updateCssVariable()\n        /* varName: string, value: string */\n        {},\n        computeBoundingRect: function computeBoundingRect()\n        /* ClientRect */\n        {},\n        getWindowPageOffset: function getWindowPageOffset()\n        /* {x: number, y: number} */\n        {}\n      };\n    }\n  }]);\n\n  function MDCRippleFoundation(adapter) {\n    var _this;\n\n    _classCallCheck(this, MDCRippleFoundation);\n\n    _this = _possibleConstructorReturn(this, _getPrototypeOf(MDCRippleFoundation).call(this, _extends(MDCRippleFoundation.defaultAdapter, adapter)));\n    /** @private {number} */\n\n    _this.layoutFrame_ = 0;\n    /** @private {!ClientRect} */\n\n    _this.frame_ =\n    /** @type {!ClientRect} */\n    {\n      width: 0,\n      height: 0\n    };\n    /** @private {!ActivationStateType} */\n\n    _this.activationState_ = _this.defaultActivationState_();\n    /** @private {number} */\n\n    _this.initialSize_ = 0;\n    /** @private {number} */\n\n    _this.maxRadius_ = 0;\n    /** @private {function(!Event)} */\n\n    _this.activateHandler_ = function (e) {\n      return _this.activate_(e);\n    };\n    /** @private {function(!Event)} */\n\n\n    _this.deactivateHandler_ = function (e) {\n      return _this.deactivate_(e);\n    };\n    /** @private {function(?Event=)} */\n\n\n    _this.focusHandler_ = function () {\n      return _this.handleFocus();\n    };\n    /** @private {function(?Event=)} */\n\n\n    _this.blurHandler_ = function () {\n      return _this.handleBlur();\n    };\n    /** @private {!Function} */\n\n\n    _this.resizeHandler_ = function () {\n      return _this.layout();\n    };\n    /** @private {{left: number, top:number}} */\n\n\n    _this.unboundedCoords_ = {\n      left: 0,\n      top: 0\n    };\n    /** @private {number} */\n\n    _this.fgScale_ = 0;\n    /** @private {number} */\n\n    _this.activationTimer_ = 0;\n    /** @private {number} */\n\n    _this.fgDeactivationRemovalTimer_ = 0;\n    /** @private {boolean} */\n\n    _this.activationAnimationHasEnded_ = false;\n    /** @private {!Function} */\n\n    _this.activationTimerCallback_ = function () {\n      _this.activationAnimationHasEnded_ = true;\n\n      _this.runDeactivationUXLogicIfReady_();\n    };\n    /** @private {?Event} */\n\n\n    _this.previousActivationEvent_ = null;\n    return _this;\n  }\n  /**\n   * We compute this property so that we are not querying information about the client\n   * until the point in time where the foundation requests it. This prevents scenarios where\n   * client-side feature-detection may happen too early, such as when components are rendered on the server\n   * and then initialized at mount time on the client.\n   * @return {boolean}\n   * @private\n   */\n\n\n  _createClass(MDCRippleFoundation, [{\n    key: \"isSupported_\",\n    value: function isSupported_() {\n      return this.adapter_.browserSupportsCssVars();\n    }\n    /**\n     * @return {!ActivationStateType}\n     */\n\n  }, {\n    key: \"defaultActivationState_\",\n    value: function defaultActivationState_() {\n      return {\n        isActivated: false,\n        hasDeactivationUXRun: false,\n        wasActivatedByPointer: false,\n        wasElementMadeActive: false,\n        activationEvent: null,\n        isProgrammatic: false\n      };\n    }\n    /** @override */\n\n  }, {\n    key: \"init\",\n    value: function init() {\n      var _this2 = this;\n\n      if (!this.isSupported_()) {\n        return;\n      }\n\n      this.registerRootHandlers_();\n      var _MDCRippleFoundation$ = MDCRippleFoundation.cssClasses,\n          ROOT = _MDCRippleFoundation$.ROOT,\n          UNBOUNDED = _MDCRippleFoundation$.UNBOUNDED;\n      requestAnimationFrame(function () {\n        _this2.adapter_.addClass(ROOT);\n\n        if (_this2.adapter_.isUnbounded()) {\n          _this2.adapter_.addClass(UNBOUNDED); // Unbounded ripples need layout logic applied immediately to set coordinates for both shade and ripple\n\n\n          _this2.layoutInternal_();\n        }\n      });\n    }\n    /** @override */\n\n  }, {\n    key: \"destroy\",\n    value: function destroy() {\n      var _this3 = this;\n\n      if (!this.isSupported_()) {\n        return;\n      }\n\n      if (this.activationTimer_) {\n        clearTimeout(this.activationTimer_);\n        this.activationTimer_ = 0;\n        var FG_ACTIVATION = MDCRippleFoundation.cssClasses.FG_ACTIVATION;\n        this.adapter_.removeClass(FG_ACTIVATION);\n      }\n\n      this.deregisterRootHandlers_();\n      this.deregisterDeactivationHandlers_();\n      var _MDCRippleFoundation$2 = MDCRippleFoundation.cssClasses,\n          ROOT = _MDCRippleFoundation$2.ROOT,\n          UNBOUNDED = _MDCRippleFoundation$2.UNBOUNDED;\n      requestAnimationFrame(function () {\n        _this3.adapter_.removeClass(ROOT);\n\n        _this3.adapter_.removeClass(UNBOUNDED);\n\n        _this3.removeCssVars_();\n      });\n    }\n    /** @private */\n\n  }, {\n    key: \"registerRootHandlers_\",\n    value: function registerRootHandlers_() {\n      var _this4 = this;\n\n      ACTIVATION_EVENT_TYPES.forEach(function (type) {\n        _this4.adapter_.registerInteractionHandler(type, _this4.activateHandler_);\n      });\n      this.adapter_.registerInteractionHandler('focus', this.focusHandler_);\n      this.adapter_.registerInteractionHandler('blur', this.blurHandler_);\n\n      if (this.adapter_.isUnbounded()) {\n        this.adapter_.registerResizeHandler(this.resizeHandler_);\n      }\n    }\n    /**\n     * @param {!Event} e\n     * @private\n     */\n\n  }, {\n    key: \"registerDeactivationHandlers_\",\n    value: function registerDeactivationHandlers_(e) {\n      var _this5 = this;\n\n      if (e.type === 'keydown') {\n        this.adapter_.registerInteractionHandler('keyup', this.deactivateHandler_);\n      } else {\n        POINTER_DEACTIVATION_EVENT_TYPES.forEach(function (type) {\n          _this5.adapter_.registerDocumentInteractionHandler(type, _this5.deactivateHandler_);\n        });\n      }\n    }\n    /** @private */\n\n  }, {\n    key: \"deregisterRootHandlers_\",\n    value: function deregisterRootHandlers_() {\n      var _this6 = this;\n\n      ACTIVATION_EVENT_TYPES.forEach(function (type) {\n        _this6.adapter_.deregisterInteractionHandler(type, _this6.activateHandler_);\n      });\n      this.adapter_.deregisterInteractionHandler('focus', this.focusHandler_);\n      this.adapter_.deregisterInteractionHandler('blur', this.blurHandler_);\n\n      if (this.adapter_.isUnbounded()) {\n        this.adapter_.deregisterResizeHandler(this.resizeHandler_);\n      }\n    }\n    /** @private */\n\n  }, {\n    key: \"deregisterDeactivationHandlers_\",\n    value: function deregisterDeactivationHandlers_() {\n      var _this7 = this;\n\n      this.adapter_.deregisterInteractionHandler('keyup', this.deactivateHandler_);\n      POINTER_DEACTIVATION_EVENT_TYPES.forEach(function (type) {\n        _this7.adapter_.deregisterDocumentInteractionHandler(type, _this7.deactivateHandler_);\n      });\n    }\n    /** @private */\n\n  }, {\n    key: \"removeCssVars_\",\n    value: function removeCssVars_() {\n      var _this8 = this;\n\n      var strings = MDCRippleFoundation.strings;\n      Object.keys(strings).forEach(function (k) {\n        if (k.indexOf('VAR_') === 0) {\n          _this8.adapter_.updateCssVariable(strings[k], null);\n        }\n      });\n    }\n    /**\n     * @param {?Event} e\n     * @private\n     */\n\n  }, {\n    key: \"activate_\",\n    value: function activate_(e) {\n      var _this9 = this;\n\n      if (this.adapter_.isSurfaceDisabled()) {\n        return;\n      }\n\n      var activationState = this.activationState_;\n\n      if (activationState.isActivated) {\n        return;\n      } // Avoid reacting to follow-on events fired by touch device after an already-processed user interaction\n\n\n      var previousActivationEvent = this.previousActivationEvent_;\n      var isSameInteraction = previousActivationEvent && e && previousActivationEvent.type !== e.type;\n\n      if (isSameInteraction) {\n        return;\n      }\n\n      activationState.isActivated = true;\n      activationState.isProgrammatic = e === null;\n      activationState.activationEvent = e;\n      activationState.wasActivatedByPointer = activationState.isProgrammatic ? false : e.type === 'mousedown' || e.type === 'touchstart' || e.type === 'pointerdown';\n      var hasActivatedChild = e && activatedTargets.length > 0 && activatedTargets.some(function (target) {\n        return _this9.adapter_.containsEventTarget(target);\n      });\n\n      if (hasActivatedChild) {\n        // Immediately reset activation state, while preserving logic that prevents touch follow-on events\n        this.resetActivationState_();\n        return;\n      }\n\n      if (e) {\n        activatedTargets.push(\n        /** @type {!EventTarget} */\n        e.target);\n        this.registerDeactivationHandlers_(e);\n      }\n\n      activationState.wasElementMadeActive = this.checkElementMadeActive_(e);\n\n      if (activationState.wasElementMadeActive) {\n        this.animateActivation_();\n      }\n\n      requestAnimationFrame(function () {\n        // Reset array on next frame after the current event has had a chance to bubble to prevent ancestor ripples\n        activatedTargets = [];\n\n        if (!activationState.wasElementMadeActive && (e.key === ' ' || e.keyCode === 32)) {\n          // If space was pressed, try again within an rAF call to detect :active, because different UAs report\n          // active states inconsistently when they're called within event handling code:\n          // - https://bugs.chromium.org/p/chromium/issues/detail?id=635971\n          // - https://bugzilla.mozilla.org/show_bug.cgi?id=1293741\n          // We try first outside rAF to support Edge, which does not exhibit this problem, but will crash if a CSS\n          // variable is set within a rAF callback for a submit button interaction (#2241).\n          activationState.wasElementMadeActive = _this9.checkElementMadeActive_(e);\n\n          if (activationState.wasElementMadeActive) {\n            _this9.animateActivation_();\n          }\n        }\n\n        if (!activationState.wasElementMadeActive) {\n          // Reset activation state immediately if element was not made active.\n          _this9.activationState_ = _this9.defaultActivationState_();\n        }\n      });\n    }\n    /**\n     * @param {?Event} e\n     * @private\n     */\n\n  }, {\n    key: \"checkElementMadeActive_\",\n    value: function checkElementMadeActive_(e) {\n      return e && e.type === 'keydown' ? this.adapter_.isSurfaceActive() : true;\n    }\n    /**\n     * @param {?Event=} event Optional event containing position information.\n     */\n\n  }, {\n    key: \"activate\",\n    value: function activate() {\n      var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;\n      this.activate_(event);\n    }\n    /** @private */\n\n  }, {\n    key: \"animateActivation_\",\n    value: function animateActivation_() {\n      var _this10 = this;\n\n      var _MDCRippleFoundation$3 = MDCRippleFoundation.strings,\n          VAR_FG_TRANSLATE_START = _MDCRippleFoundation$3.VAR_FG_TRANSLATE_START,\n          VAR_FG_TRANSLATE_END = _MDCRippleFoundation$3.VAR_FG_TRANSLATE_END;\n      var _MDCRippleFoundation$4 = MDCRippleFoundation.cssClasses,\n          FG_DEACTIVATION = _MDCRippleFoundation$4.FG_DEACTIVATION,\n          FG_ACTIVATION = _MDCRippleFoundation$4.FG_ACTIVATION;\n      var DEACTIVATION_TIMEOUT_MS = MDCRippleFoundation.numbers.DEACTIVATION_TIMEOUT_MS;\n      this.layoutInternal_();\n      var translateStart = '';\n      var translateEnd = '';\n\n      if (!this.adapter_.isUnbounded()) {\n        var _this$getFgTranslatio = this.getFgTranslationCoordinates_(),\n            startPoint = _this$getFgTranslatio.startPoint,\n            endPoint = _this$getFgTranslatio.endPoint;\n\n        translateStart = \"\".concat(startPoint.x, \"px, \").concat(startPoint.y, \"px\");\n        translateEnd = \"\".concat(endPoint.x, \"px, \").concat(endPoint.y, \"px\");\n      }\n\n      this.adapter_.updateCssVariable(VAR_FG_TRANSLATE_START, translateStart);\n      this.adapter_.updateCssVariable(VAR_FG_TRANSLATE_END, translateEnd); // Cancel any ongoing activation/deactivation animations\n\n      clearTimeout(this.activationTimer_);\n      clearTimeout(this.fgDeactivationRemovalTimer_);\n      this.rmBoundedActivationClasses_();\n      this.adapter_.removeClass(FG_DEACTIVATION); // Force layout in order to re-trigger the animation.\n\n      this.adapter_.computeBoundingRect();\n      this.adapter_.addClass(FG_ACTIVATION);\n      this.activationTimer_ = setTimeout(function () {\n        return _this10.activationTimerCallback_();\n      }, DEACTIVATION_TIMEOUT_MS);\n    }\n    /**\n     * @private\n     * @return {{startPoint: PointType, endPoint: PointType}}\n     */\n\n  }, {\n    key: \"getFgTranslationCoordinates_\",\n    value: function getFgTranslationCoordinates_() {\n      var _this$activationState = this.activationState_,\n          activationEvent = _this$activationState.activationEvent,\n          wasActivatedByPointer = _this$activationState.wasActivatedByPointer;\n      var startPoint;\n\n      if (wasActivatedByPointer) {\n        startPoint = Object(_util__WEBPACK_IMPORTED_MODULE_3__[\"getNormalizedEventCoords\"])(\n        /** @type {!Event} */\n        activationEvent, this.adapter_.getWindowPageOffset(), this.adapter_.computeBoundingRect());\n      } else {\n        startPoint = {\n          x: this.frame_.width / 2,\n          y: this.frame_.height / 2\n        };\n      } // Center the element around the start point.\n\n\n      startPoint = {\n        x: startPoint.x - this.initialSize_ / 2,\n        y: startPoint.y - this.initialSize_ / 2\n      };\n      var endPoint = {\n        x: this.frame_.width / 2 - this.initialSize_ / 2,\n        y: this.frame_.height / 2 - this.initialSize_ / 2\n      };\n      return {\n        startPoint: startPoint,\n        endPoint: endPoint\n      };\n    }\n    /** @private */\n\n  }, {\n    key: \"runDeactivationUXLogicIfReady_\",\n    value: function runDeactivationUXLogicIfReady_() {\n      var _this11 = this;\n\n      // This method is called both when a pointing device is released, and when the activation animation ends.\n      // The deactivation animation should only run after both of those occur.\n      var FG_DEACTIVATION = MDCRippleFoundation.cssClasses.FG_DEACTIVATION;\n      var _this$activationState2 = this.activationState_,\n          hasDeactivationUXRun = _this$activationState2.hasDeactivationUXRun,\n          isActivated = _this$activationState2.isActivated;\n      var activationHasEnded = hasDeactivationUXRun || !isActivated;\n\n      if (activationHasEnded && this.activationAnimationHasEnded_) {\n        this.rmBoundedActivationClasses_();\n        this.adapter_.addClass(FG_DEACTIVATION);\n        this.fgDeactivationRemovalTimer_ = setTimeout(function () {\n          _this11.adapter_.removeClass(FG_DEACTIVATION);\n        }, _constants__WEBPACK_IMPORTED_MODULE_2__[\"numbers\"].FG_DEACTIVATION_MS);\n      }\n    }\n    /** @private */\n\n  }, {\n    key: \"rmBoundedActivationClasses_\",\n    value: function rmBoundedActivationClasses_() {\n      var FG_ACTIVATION = MDCRippleFoundation.cssClasses.FG_ACTIVATION;\n      this.adapter_.removeClass(FG_ACTIVATION);\n      this.activationAnimationHasEnded_ = false;\n      this.adapter_.computeBoundingRect();\n    }\n  }, {\n    key: \"resetActivationState_\",\n    value: function resetActivationState_() {\n      var _this12 = this;\n\n      this.previousActivationEvent_ = this.activationState_.activationEvent;\n      this.activationState_ = this.defaultActivationState_(); // Touch devices may fire additional events for the same interaction within a short time.\n      // Store the previous event until it's safe to assume that subsequent events are for new interactions.\n\n      setTimeout(function () {\n        return _this12.previousActivationEvent_ = null;\n      }, MDCRippleFoundation.numbers.TAP_DELAY_MS);\n    }\n    /**\n     * @param {?Event} e\n     * @private\n     */\n\n  }, {\n    key: \"deactivate_\",\n    value: function deactivate_(e) {\n      var _this13 = this;\n\n      var activationState = this.activationState_; // This can happen in scenarios such as when you have a keyup event that blurs the element.\n\n      if (!activationState.isActivated) {\n        return;\n      }\n\n      var state =\n      /** @type {!ActivationStateType} */\n      _extends({}, activationState);\n\n      if (activationState.isProgrammatic) {\n        var evtObject = null;\n        requestAnimationFrame(function () {\n          return _this13.animateDeactivation_(evtObject, state);\n        });\n        this.resetActivationState_();\n      } else {\n        this.deregisterDeactivationHandlers_();\n        requestAnimationFrame(function () {\n          _this13.activationState_.hasDeactivationUXRun = true;\n\n          _this13.animateDeactivation_(e, state);\n\n          _this13.resetActivationState_();\n        });\n      }\n    }\n    /**\n     * @param {?Event=} event Optional event containing position information.\n     */\n\n  }, {\n    key: \"deactivate\",\n    value: function deactivate() {\n      var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;\n      this.deactivate_(event);\n    }\n    /**\n     * @param {Event} e\n     * @param {!ActivationStateType} options\n     * @private\n     */\n\n  }, {\n    key: \"animateDeactivation_\",\n    value: function animateDeactivation_(e, _ref) {\n      var wasActivatedByPointer = _ref.wasActivatedByPointer,\n          wasElementMadeActive = _ref.wasElementMadeActive;\n\n      if (wasActivatedByPointer || wasElementMadeActive) {\n        this.runDeactivationUXLogicIfReady_();\n      }\n    }\n  }, {\n    key: \"layout\",\n    value: function layout() {\n      var _this14 = this;\n\n      if (this.layoutFrame_) {\n        cancelAnimationFrame(this.layoutFrame_);\n      }\n\n      this.layoutFrame_ = requestAnimationFrame(function () {\n        _this14.layoutInternal_();\n\n        _this14.layoutFrame_ = 0;\n      });\n    }\n    /** @private */\n\n  }, {\n    key: \"layoutInternal_\",\n    value: function layoutInternal_() {\n      var _this15 = this;\n\n      this.frame_ = this.adapter_.computeBoundingRect();\n      var maxDim = Math.max(this.frame_.height, this.frame_.width); // Surface diameter is treated differently for unbounded vs. bounded ripples.\n      // Unbounded ripple diameter is calculated smaller since the surface is expected to already be padded appropriately\n      // to extend the hitbox, and the ripple is expected to meet the edges of the padded hitbox (which is typically\n      // square). Bounded ripples, on the other hand, are fully expected to expand beyond the surface's longest diameter\n      // (calculated based on the diagonal plus a constant padding), and are clipped at the surface's border via\n      // `overflow: hidden`.\n\n      var getBoundedRadius = function getBoundedRadius() {\n        var hypotenuse = Math.sqrt(Math.pow(_this15.frame_.width, 2) + Math.pow(_this15.frame_.height, 2));\n        return hypotenuse + MDCRippleFoundation.numbers.PADDING;\n      };\n\n      this.maxRadius_ = this.adapter_.isUnbounded() ? maxDim : getBoundedRadius(); // Ripple is sized as a fraction of the largest dimension of the surface, then scales up using a CSS scale transform\n\n      this.initialSize_ = maxDim * MDCRippleFoundation.numbers.INITIAL_ORIGIN_SCALE;\n      this.fgScale_ = this.maxRadius_ / this.initialSize_;\n      this.updateLayoutCssVars_();\n    }\n    /** @private */\n\n  }, {\n    key: \"updateLayoutCssVars_\",\n    value: function updateLayoutCssVars_() {\n      var _MDCRippleFoundation$5 = MDCRippleFoundation.strings,\n          VAR_FG_SIZE = _MDCRippleFoundation$5.VAR_FG_SIZE,\n          VAR_LEFT = _MDCRippleFoundation$5.VAR_LEFT,\n          VAR_TOP = _MDCRippleFoundation$5.VAR_TOP,\n          VAR_FG_SCALE = _MDCRippleFoundation$5.VAR_FG_SCALE;\n      this.adapter_.updateCssVariable(VAR_FG_SIZE, \"\".concat(this.initialSize_, \"px\"));\n      this.adapter_.updateCssVariable(VAR_FG_SCALE, this.fgScale_);\n\n      if (this.adapter_.isUnbounded()) {\n        this.unboundedCoords_ = {\n          left: Math.round(this.frame_.width / 2 - this.initialSize_ / 2),\n          top: Math.round(this.frame_.height / 2 - this.initialSize_ / 2)\n        };\n        this.adapter_.updateCssVariable(VAR_LEFT, \"\".concat(this.unboundedCoords_.left, \"px\"));\n        this.adapter_.updateCssVariable(VAR_TOP, \"\".concat(this.unboundedCoords_.top, \"px\"));\n      }\n    }\n    /** @param {boolean} unbounded */\n\n  }, {\n    key: \"setUnbounded\",\n    value: function setUnbounded(unbounded) {\n      var UNBOUNDED = MDCRippleFoundation.cssClasses.UNBOUNDED;\n\n      if (unbounded) {\n        this.adapter_.addClass(UNBOUNDED);\n      } else {\n        this.adapter_.removeClass(UNBOUNDED);\n      }\n    }\n  }, {\n    key: \"handleFocus\",\n    value: function handleFocus() {\n      var _this16 = this;\n\n      requestAnimationFrame(function () {\n        return _this16.adapter_.addClass(MDCRippleFoundation.cssClasses.BG_FOCUSED);\n      });\n    }\n  }, {\n    key: \"handleBlur\",\n    value: function handleBlur() {\n      var _this17 = this;\n\n      requestAnimationFrame(function () {\n        return _this17.adapter_.removeClass(MDCRippleFoundation.cssClasses.BG_FOCUSED);\n      });\n    }\n  }]);\n\n  return MDCRippleFoundation;\n}(_material_base_foundation__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MDCRippleFoundation);\n\n//# sourceURL=webpack:///./node_modules/@material/ripple/foundation.js?");

  /***/ }),

  /***/ "./node_modules/@material/ripple/index.js":
  /*!************************************************!*\
    !*** ./node_modules/@material/ripple/index.js ***!
    \************************************************/
  /*! exports provided: MDCRipple, MDCRippleFoundation, RippleCapableSurface, util */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MDCRipple\", function() { return MDCRipple; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RippleCapableSurface\", function() { return RippleCapableSurface; });\n/* harmony import */ var _material_base_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @material/base/component */ \"./node_modules/@material/base/component.js\");\n/* harmony import */ var _adapter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./adapter */ \"./node_modules/@material/ripple/adapter.js\");\n/* harmony import */ var _foundation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./foundation */ \"./node_modules/@material/ripple/foundation.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"MDCRippleFoundation\", function() { return _foundation__WEBPACK_IMPORTED_MODULE_2__[\"default\"]; });\n\n/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util */ \"./node_modules/@material/ripple/util.js\");\n/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, \"util\", function() { return _util__WEBPACK_IMPORTED_MODULE_3__; });\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\n/**\n * @license\n * Copyright 2016 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n\n\n\n/**\n * @extends MDCComponent<!MDCRippleFoundation>\n */\n\nvar MDCRipple =\n/*#__PURE__*/\nfunction (_MDCComponent) {\n  _inherits(MDCRipple, _MDCComponent);\n\n  /** @param {...?} args */\n  function MDCRipple() {\n    var _getPrototypeOf2;\n\n    var _this;\n\n    _classCallCheck(this, MDCRipple);\n\n    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {\n      args[_key] = arguments[_key];\n    }\n\n    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(MDCRipple)).call.apply(_getPrototypeOf2, [this].concat(args)));\n    /** @type {boolean} */\n\n    _this.disabled = false;\n    /** @private {boolean} */\n\n    _this.unbounded_;\n    return _this;\n  }\n  /**\n   * @param {!Element} root\n   * @param {{isUnbounded: (boolean|undefined)}=} options\n   * @return {!MDCRipple}\n   */\n\n\n  _createClass(MDCRipple, [{\n    key: \"setUnbounded_\",\n\n    /**\n     * Closure Compiler throws an access control error when directly accessing a\n     * protected or private property inside a getter/setter, like unbounded above.\n     * By accessing the protected property inside a method, we solve that problem.\n     * That's why this function exists.\n     * @private\n     */\n    value: function setUnbounded_() {\n      this.foundation_.setUnbounded(this.unbounded_);\n    }\n  }, {\n    key: \"activate\",\n    value: function activate() {\n      this.foundation_.activate();\n    }\n  }, {\n    key: \"deactivate\",\n    value: function deactivate() {\n      this.foundation_.deactivate();\n    }\n  }, {\n    key: \"layout\",\n    value: function layout() {\n      this.foundation_.layout();\n    }\n    /**\n     * @return {!MDCRippleFoundation}\n     * @override\n     */\n\n  }, {\n    key: \"getDefaultFoundation\",\n    value: function getDefaultFoundation() {\n      return new _foundation__WEBPACK_IMPORTED_MODULE_2__[\"default\"](MDCRipple.createAdapter(this));\n    }\n    /** @override */\n\n  }, {\n    key: \"initialSyncWithDOM\",\n    value: function initialSyncWithDOM() {\n      this.unbounded = 'mdcRippleIsUnbounded' in this.root_.dataset;\n    }\n  }, {\n    key: \"unbounded\",\n\n    /** @return {boolean} */\n    get: function get() {\n      return this.unbounded_;\n    }\n    /** @param {boolean} unbounded */\n    ,\n    set: function set(unbounded) {\n      this.unbounded_ = Boolean(unbounded);\n      this.setUnbounded_();\n    }\n  }], [{\n    key: \"attachTo\",\n    value: function attachTo(root) {\n      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},\n          _ref$isUnbounded = _ref.isUnbounded,\n          isUnbounded = _ref$isUnbounded === void 0 ? undefined : _ref$isUnbounded;\n\n      var ripple = new MDCRipple(root); // Only override unbounded behavior if option is explicitly specified\n\n      if (isUnbounded !== undefined) {\n        ripple.unbounded =\n        /** @type {boolean} */\n        isUnbounded;\n      }\n\n      return ripple;\n    }\n    /**\n     * @param {!RippleCapableSurface} instance\n     * @return {!MDCRippleAdapter}\n     */\n\n  }, {\n    key: \"createAdapter\",\n    value: function createAdapter(instance) {\n      var MATCHES = _util__WEBPACK_IMPORTED_MODULE_3__[\"getMatchesProperty\"](HTMLElement.prototype);\n      return {\n        browserSupportsCssVars: function browserSupportsCssVars() {\n          return _util__WEBPACK_IMPORTED_MODULE_3__[\"supportsCssVariables\"](window);\n        },\n        isUnbounded: function isUnbounded() {\n          return instance.unbounded;\n        },\n        isSurfaceActive: function isSurfaceActive() {\n          return instance.root_[MATCHES](':active');\n        },\n        isSurfaceDisabled: function isSurfaceDisabled() {\n          return instance.disabled;\n        },\n        addClass: function addClass(className) {\n          return instance.root_.classList.add(className);\n        },\n        removeClass: function removeClass(className) {\n          return instance.root_.classList.remove(className);\n        },\n        containsEventTarget: function containsEventTarget(target) {\n          return instance.root_.contains(target);\n        },\n        registerInteractionHandler: function registerInteractionHandler(evtType, handler) {\n          return instance.root_.addEventListener(evtType, handler, _util__WEBPACK_IMPORTED_MODULE_3__[\"applyPassive\"]());\n        },\n        deregisterInteractionHandler: function deregisterInteractionHandler(evtType, handler) {\n          return instance.root_.removeEventListener(evtType, handler, _util__WEBPACK_IMPORTED_MODULE_3__[\"applyPassive\"]());\n        },\n        registerDocumentInteractionHandler: function registerDocumentInteractionHandler(evtType, handler) {\n          return document.documentElement.addEventListener(evtType, handler, _util__WEBPACK_IMPORTED_MODULE_3__[\"applyPassive\"]());\n        },\n        deregisterDocumentInteractionHandler: function deregisterDocumentInteractionHandler(evtType, handler) {\n          return document.documentElement.removeEventListener(evtType, handler, _util__WEBPACK_IMPORTED_MODULE_3__[\"applyPassive\"]());\n        },\n        registerResizeHandler: function registerResizeHandler(handler) {\n          return window.addEventListener('resize', handler);\n        },\n        deregisterResizeHandler: function deregisterResizeHandler(handler) {\n          return window.removeEventListener('resize', handler);\n        },\n        updateCssVariable: function updateCssVariable(varName, value) {\n          return instance.root_.style.setProperty(varName, value);\n        },\n        computeBoundingRect: function computeBoundingRect() {\n          return instance.root_.getBoundingClientRect();\n        },\n        getWindowPageOffset: function getWindowPageOffset() {\n          return {\n            x: window.pageXOffset,\n            y: window.pageYOffset\n          };\n        }\n      };\n    }\n  }]);\n\n  return MDCRipple;\n}(_material_base_component__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n/**\n * See Material Design spec for more details on when to use ripples.\n * https://material.io/guidelines/motion/choreography.html#choreography-creation\n * @record\n */\n\n\nvar RippleCapableSurface = function RippleCapableSurface() {\n  _classCallCheck(this, RippleCapableSurface);\n};\n/** @protected {!Element} */\n\n\nRippleCapableSurface.prototype.root_;\n/**\n * Whether or not the ripple bleeds out of the bounds of the element.\n * @type {boolean|undefined}\n */\n\nRippleCapableSurface.prototype.unbounded;\n/**\n * Whether or not the ripple is attached to a disabled component.\n * @type {boolean|undefined}\n */\n\nRippleCapableSurface.prototype.disabled;\n\n\n//# sourceURL=webpack:///./node_modules/@material/ripple/index.js?");

  /***/ }),

  /***/ "./node_modules/@material/ripple/util.js":
  /*!***********************************************!*\
    !*** ./node_modules/@material/ripple/util.js ***!
    \***********************************************/
  /*! exports provided: supportsCssVariables, applyPassive, getMatchesProperty, getNormalizedEventCoords */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"supportsCssVariables\", function() { return supportsCssVariables; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"applyPassive\", function() { return applyPassive; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getMatchesProperty\", function() { return getMatchesProperty; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getNormalizedEventCoords\", function() { return getNormalizedEventCoords; });\n/**\n * @license\n * Copyright 2016 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n/**\n * Stores result from supportsCssVariables to avoid redundant processing to detect CSS custom variable support.\n * @private {boolean|undefined}\n */\nvar supportsCssVariables_;\n/**\n * Stores result from applyPassive to avoid redundant processing to detect passive event listener support.\n * @private {boolean|undefined}\n */\n\nvar supportsPassive_;\n/**\n * @param {!Window} windowObj\n * @return {boolean}\n */\n\nfunction detectEdgePseudoVarBug(windowObj) {\n  // Detect versions of Edge with buggy var() support\n  // See: https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/11495448/\n  var document = windowObj.document;\n  var node = document.createElement('div');\n  node.className = 'mdc-ripple-surface--test-edge-var-bug';\n  document.body.appendChild(node); // The bug exists if ::before style ends up propagating to the parent element.\n  // Additionally, getComputedStyle returns null in iframes with display: \"none\" in Firefox,\n  // but Firefox is known to support CSS custom properties correctly.\n  // See: https://bugzilla.mozilla.org/show_bug.cgi?id=548397\n\n  var computedStyle = windowObj.getComputedStyle(node);\n  var hasPseudoVarBug = computedStyle !== null && computedStyle.borderTopStyle === 'solid';\n  node.remove();\n  return hasPseudoVarBug;\n}\n/**\n * @param {!Window} windowObj\n * @param {boolean=} forceRefresh\n * @return {boolean|undefined}\n */\n\n\nfunction supportsCssVariables(windowObj) {\n  var forceRefresh = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;\n  var supportsCssVariables = supportsCssVariables_;\n\n  if (typeof supportsCssVariables_ === 'boolean' && !forceRefresh) {\n    return supportsCssVariables;\n  }\n\n  var supportsFunctionPresent = windowObj.CSS && typeof windowObj.CSS.supports === 'function';\n\n  if (!supportsFunctionPresent) {\n    return;\n  }\n\n  var explicitlySupportsCssVars = windowObj.CSS.supports('--css-vars', 'yes'); // See: https://bugs.webkit.org/show_bug.cgi?id=154669\n  // See: README section on Safari\n\n  var weAreFeatureDetectingSafari10plus = windowObj.CSS.supports('(--css-vars: yes)') && windowObj.CSS.supports('color', '#00000000');\n\n  if (explicitlySupportsCssVars || weAreFeatureDetectingSafari10plus) {\n    supportsCssVariables = !detectEdgePseudoVarBug(windowObj);\n  } else {\n    supportsCssVariables = false;\n  }\n\n  if (!forceRefresh) {\n    supportsCssVariables_ = supportsCssVariables;\n  }\n\n  return supportsCssVariables;\n} //\n\n/**\n * Determine whether the current browser supports passive event listeners, and if so, use them.\n * @param {!Window=} globalObj\n * @param {boolean=} forceRefresh\n * @return {boolean|{passive: boolean}}\n */\n\n\nfunction applyPassive() {\n  var globalObj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;\n  var forceRefresh = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;\n\n  if (supportsPassive_ === undefined || forceRefresh) {\n    var isSupported = false;\n\n    try {\n      globalObj.document.addEventListener('test', null, {\n        get passive() {\n          isSupported = true;\n        }\n\n      });\n    } catch (e) {}\n\n    supportsPassive_ = isSupported;\n  }\n\n  return supportsPassive_ ? {\n    passive: true\n  } : false;\n}\n/**\n * @param {!Object} HTMLElementPrototype\n * @return {!Array<string>}\n */\n\n\nfunction getMatchesProperty(HTMLElementPrototype) {\n  return ['webkitMatchesSelector', 'msMatchesSelector', 'matches'].filter(function (p) {\n    return p in HTMLElementPrototype;\n  }).pop();\n}\n/**\n * @param {!Event} ev\n * @param {{x: number, y: number}} pageOffset\n * @param {!ClientRect} clientRect\n * @return {{x: number, y: number}}\n */\n\n\nfunction getNormalizedEventCoords(ev, pageOffset, clientRect) {\n  var x = pageOffset.x,\n      y = pageOffset.y;\n  var documentX = x + clientRect.left;\n  var documentY = y + clientRect.top;\n  var normalizedX;\n  var normalizedY; // Determine touch point relative to the ripple container.\n\n  if (ev.type === 'touchstart') {\n    normalizedX = ev.changedTouches[0].pageX - documentX;\n    normalizedY = ev.changedTouches[0].pageY - documentY;\n  } else {\n    normalizedX = ev.pageX - documentX;\n    normalizedY = ev.pageY - documentY;\n  }\n\n  return {\n    x: normalizedX,\n    y: normalizedY\n  };\n}\n\n\n\n//# sourceURL=webpack:///./node_modules/@material/ripple/util.js?");

  /***/ }),

  /***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./components/card/Card.vue?vue&type=script&lang=js":
  /*!****************************************************************************************************************************************************!*\
    !*** ./node_modules/babel-loader/lib??ref--1!./node_modules/vue-loader/lib??vue-loader-options!./components/card/Card.vue?vue&type=script&lang=js ***!
    \****************************************************************************************************************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _material_ripple__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @material/ripple */ \"./node_modules/@material/ripple/index.js\");\n/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../base */ \"./components/base/index.js\");\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  mixins: [_base__WEBPACK_IMPORTED_MODULE_1__[\"baseComponentMixin\"], _base__WEBPACK_IMPORTED_MODULE_1__[\"themeClassMixin\"]],\n  props: {\n    outlined: {\n      type: Boolean,\n      default: false\n    },\n    fullBleedAction: {\n      type: Boolean,\n      default: false\n    },\n    primaryAction: {\n      type: Boolean,\n      default: false\n    }\n  },\n  data: function data() {\n    return {\n      slotObserver: undefined,\n      mdcRipple: undefined\n    };\n  },\n  computed: {\n    classes: function classes() {\n      return {\n        'mdc-card--outlined': this.outlined\n      };\n    },\n    contentClasses: function contentClasses() {\n      return {\n        'mdc-card__primary-action': this.primaryAction\n      };\n    },\n    actionClasses: function actionClasses() {\n      return {\n        'mdc-card__actions--full-bleed': this.fullBleedAction\n      };\n    }\n  },\n  watch: {\n    primaryAction: function primaryAction(value) {\n      value ? this.mdcRipple = _material_ripple__WEBPACK_IMPORTED_MODULE_0__[\"MDCRipple\"].attachTo(this.$refs.content) : this.mdcRipple.destroy();\n    }\n  },\n  mounted: function mounted() {\n    var _this = this;\n\n    this.updateSlots();\n    this.slotObserver = new MutationObserver(function () {\n      return _this.updateSlots();\n    });\n    this.slotObserver.observe(this.$el, {\n      childList: true,\n      subtree: true\n    });\n\n    if (this.primaryAction) {\n      this.mdcRipple = _material_ripple__WEBPACK_IMPORTED_MODULE_0__[\"MDCRipple\"].attachTo(this.$refs.content);\n    }\n  },\n  beforeDestroy: function beforeDestroy() {\n    this.slotObserver.disconnect();\n\n    if (typeof this.mdcRipple !== 'undefined') {\n      this.mdcRipple.destroy();\n    }\n  },\n  methods: {\n    updateSlots: function updateSlots() {\n      if (this.$slots.actionButtons) {\n        this.$slots.actionButtons.map(function (n) {\n          n.elm.classList.add('mdc-card__action');\n          n.elm.classList.add('mdc-card__action--button');\n        });\n      }\n\n      if (this.$slots.actionIcons) {\n        this.$slots.actionIcons.map(function (n) {\n          n.elm.classList.add('mdc-card__action');\n          n.elm.classList.add('mdc-card__action--icon');\n          n.elm.setAttribute('tabindex', '0');\n          n.elm.setAttribute('role', 'button');\n        });\n      }\n    }\n  }\n});\n\n//# sourceURL=webpack:///./components/card/Card.vue?./node_modules/babel-loader/lib??ref--1!./node_modules/vue-loader/lib??vue-loader-options");

  /***/ }),

  /***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./components/card/CardMedia.vue?vue&type=script&lang=js":
  /*!*********************************************************************************************************************************************************!*\
    !*** ./node_modules/babel-loader/lib??ref--1!./node_modules/vue-loader/lib??vue-loader-options!./components/card/CardMedia.vue?vue&type=script&lang=js ***!
    \*********************************************************************************************************************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base */ \"./components/base/index.js\");\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  mixins: [_base__WEBPACK_IMPORTED_MODULE_0__[\"baseComponentMixin\"], _base__WEBPACK_IMPORTED_MODULE_0__[\"themeClassMixin\"]],\n  props: {\n    square: {\n      type: Boolean,\n      default: true\n    },\n    sixteenNine: {\n      type: Boolean,\n      default: false\n    }\n  },\n  computed: {\n    classes: function classes() {\n      return {\n        'mdc-card__media--square': this.square,\n        'mdc-card__media--16-9': this.sixteenNine\n      };\n    }\n  }\n});\n\n//# sourceURL=webpack:///./components/card/CardMedia.vue?./node_modules/babel-loader/lib??ref--1!./node_modules/vue-loader/lib??vue-loader-options");

  /***/ }),

  /***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./components/card/Card.vue?vue&type=template&id=fcf656b8":
  /*!**********************************************************************************************************************************************************************************************!*\
    !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./components/card/Card.vue?vue&type=template&id=fcf656b8 ***!
    \**********************************************************************************************************************************************************************************************/
  /*! exports provided: render, staticRenderFns */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return staticRenderFns; });\nvar render = function() {\n  var _vm = this\n  var _h = _vm.$createElement\n  var _c = _vm._self._c || _h\n  return _c(\"div\", { staticClass: \"mdc-card\", class: _vm.classes }, [\n    _c(\n      \"div\",\n      { ref: \"content\", class: _vm.contentClasses },\n      [_vm._t(\"media\"), _vm._v(\" \"), _vm._t(\"default\")],\n      2\n    ),\n    _vm._v(\" \"),\n    _vm.$slots[\"actionButtons\"] || _vm.$slots[\"actionIcons\"]\n      ? _c(\n          \"div\",\n          { staticClass: \"mdc-card__actions\", class: _vm.actionClasses },\n          [\n            _vm.$slots[\"actionButtons\"]\n              ? _c(\n                  \"div\",\n                  { staticClass: \"mdc-card__action-buttons\" },\n                  [_vm._t(\"actionButtons\")],\n                  2\n                )\n              : _vm._e(),\n            _vm._v(\" \"),\n            _vm.$slots[\"actionIcons\"]\n              ? _c(\n                  \"div\",\n                  { staticClass: \"mdc-card__action-icons\" },\n                  [_vm._t(\"actionIcons\")],\n                  2\n                )\n              : _vm._e()\n          ]\n        )\n      : _vm._e()\n  ])\n}\nvar staticRenderFns = []\nrender._withStripped = true\n\n\n\n//# sourceURL=webpack:///./components/card/Card.vue?./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options");

  /***/ }),

  /***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./components/card/CardMedia.vue?vue&type=template&id=4386f5d0":
  /*!***************************************************************************************************************************************************************************************************!*\
    !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./components/card/CardMedia.vue?vue&type=template&id=4386f5d0 ***!
    \***************************************************************************************************************************************************************************************************/
  /*! exports provided: render, staticRenderFns */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return staticRenderFns; });\nvar render = function() {\n  var _vm = this\n  var _h = _vm.$createElement\n  var _c = _vm._self._c || _h\n  return _c(\"div\", { staticClass: \"mdc-card__media\", class: _vm.classes }, [\n    _c(\n      \"div\",\n      { staticClass: \"mdc-card__media-content\" },\n      [_vm._t(\"default\")],\n      2\n    )\n  ])\n}\nvar staticRenderFns = []\nrender._withStripped = true\n\n\n\n//# sourceURL=webpack:///./components/card/CardMedia.vue?./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options");

  /***/ }),

  /***/ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js":
  /*!********************************************************************!*\
    !*** ./node_modules/vue-loader/lib/runtime/componentNormalizer.js ***!
    \********************************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return normalizeComponent; });\n/* globals __VUE_SSR_CONTEXT__ */\n\n// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).\n// This module is a runtime utility for cleaner component module output and will\n// be included in the final webpack user bundle.\n\nfunction normalizeComponent (\n  scriptExports,\n  render,\n  staticRenderFns,\n  functionalTemplate,\n  injectStyles,\n  scopeId,\n  moduleIdentifier, /* server only */\n  shadowMode /* vue-cli only */\n) {\n  // Vue.extend constructor export interop\n  var options = typeof scriptExports === 'function'\n    ? scriptExports.options\n    : scriptExports\n\n  // render functions\n  if (render) {\n    options.render = render\n    options.staticRenderFns = staticRenderFns\n    options._compiled = true\n  }\n\n  // functional template\n  if (functionalTemplate) {\n    options.functional = true\n  }\n\n  // scopedId\n  if (scopeId) {\n    options._scopeId = 'data-v-' + scopeId\n  }\n\n  var hook\n  if (moduleIdentifier) { // server build\n    hook = function (context) {\n      // 2.3 injection\n      context =\n        context || // cached call\n        (this.$vnode && this.$vnode.ssrContext) || // stateful\n        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional\n      // 2.2 with runInNewContext: true\n      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {\n        context = __VUE_SSR_CONTEXT__\n      }\n      // inject component styles\n      if (injectStyles) {\n        injectStyles.call(this, context)\n      }\n      // register component module identifier for async chunk inferrence\n      if (context && context._registeredComponents) {\n        context._registeredComponents.add(moduleIdentifier)\n      }\n    }\n    // used by ssr in case component is cached and beforeCreate\n    // never gets called\n    options._ssrRegister = hook\n  } else if (injectStyles) {\n    hook = shadowMode\n      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }\n      : injectStyles\n  }\n\n  if (hook) {\n    if (options.functional) {\n      // for template-only hot-reload because in that case the render fn doesn't\n      // go through the normalizer\n      options._injectStyles = hook\n      // register for functioal component in vue file\n      var originalRender = options.render\n      options.render = function renderWithStyleInjection (h, context) {\n        hook.call(context)\n        return originalRender(h, context)\n      }\n    } else {\n      // inject component registration as beforeCreate hook\n      var existing = options.beforeCreate\n      options.beforeCreate = existing\n        ? [].concat(existing, hook)\n        : [hook]\n    }\n  }\n\n  return {\n    exports: scriptExports,\n    options: options\n  }\n}\n\n\n//# sourceURL=webpack:///./node_modules/vue-loader/lib/runtime/componentNormalizer.js?");

  /***/ })

  /******/ });
  });
  });

  var Card = unwrapExports(card);

  var button = createCommonjsModule(function (module, exports) {
  (function webpackUniversalModuleDefinition(root, factory) {
  	module.exports = factory();
  })(window, function() {
  return /******/ (function(modules) { // webpackBootstrap
  /******/ 	// The module cache
  /******/ 	var installedModules = {};
  /******/
  /******/ 	// The require function
  /******/ 	function __webpack_require__(moduleId) {
  /******/
  /******/ 		// Check if module is in cache
  /******/ 		if(installedModules[moduleId]) {
  /******/ 			return installedModules[moduleId].exports;
  /******/ 		}
  /******/ 		// Create a new module (and put it into the cache)
  /******/ 		var module = installedModules[moduleId] = {
  /******/ 			i: moduleId,
  /******/ 			l: false,
  /******/ 			exports: {}
  /******/ 		};
  /******/
  /******/ 		// Execute the module function
  /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
  /******/
  /******/ 		// Flag the module as loaded
  /******/ 		module.l = true;
  /******/
  /******/ 		// Return the exports of the module
  /******/ 		return module.exports;
  /******/ 	}
  /******/
  /******/
  /******/ 	// expose the modules object (__webpack_modules__)
  /******/ 	__webpack_require__.m = modules;
  /******/
  /******/ 	// expose the module cache
  /******/ 	__webpack_require__.c = installedModules;
  /******/
  /******/ 	// define getter function for harmony exports
  /******/ 	__webpack_require__.d = function(exports, name, getter) {
  /******/ 		if(!__webpack_require__.o(exports, name)) {
  /******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
  /******/ 		}
  /******/ 	};
  /******/
  /******/ 	// define __esModule on exports
  /******/ 	__webpack_require__.r = function(exports) {
  /******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
  /******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
  /******/ 		}
  /******/ 		Object.defineProperty(exports, '__esModule', { value: true });
  /******/ 	};
  /******/
  /******/ 	// create a fake namespace object
  /******/ 	// mode & 1: value is a module id, require it
  /******/ 	// mode & 2: merge all properties of value into the ns
  /******/ 	// mode & 4: return value when already ns object
  /******/ 	// mode & 8|1: behave like require
  /******/ 	__webpack_require__.t = function(value, mode) {
  /******/ 		if(mode & 1) value = __webpack_require__(value);
  /******/ 		if(mode & 8) return value;
  /******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
  /******/ 		var ns = Object.create(null);
  /******/ 		__webpack_require__.r(ns);
  /******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
  /******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
  /******/ 		return ns;
  /******/ 	};
  /******/
  /******/ 	// getDefaultExport function for compatibility with non-harmony modules
  /******/ 	__webpack_require__.n = function(module) {
  /******/ 		var getter = module && module.__esModule ?
  /******/ 			function getDefault() { return module['default']; } :
  /******/ 			function getModuleExports() { return module; };
  /******/ 		__webpack_require__.d(getter, 'a', getter);
  /******/ 		return getter;
  /******/ 	};
  /******/
  /******/ 	// Object.prototype.hasOwnProperty.call
  /******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
  /******/
  /******/ 	// __webpack_public_path__
  /******/ 	__webpack_require__.p = "";
  /******/
  /******/
  /******/ 	// Load entry module and return exports
  /******/ 	return __webpack_require__(__webpack_require__.s = "./components/button/index.js");
  /******/ })
  /************************************************************************/
  /******/ ({

  /***/ "./components/base/baseComponentMixin.js":
  /*!***********************************************!*\
    !*** ./components/base/baseComponentMixin.js ***!
    \***********************************************/
  /*! exports provided: baseComponentMixin */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"baseComponentMixin\", function() { return baseComponentMixin; });\nvar baseComponentMixin = {\n  inheritAttrs: false\n};\n\n//# sourceURL=webpack:///./components/base/baseComponentMixin.js?");

  /***/ }),

  /***/ "./components/base/index.js":
  /*!**********************************!*\
    !*** ./components/base/index.js ***!
    \**********************************/
  /*! exports provided: baseComponentMixin, themeClassMixin */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _baseComponentMixin_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./baseComponentMixin.js */ \"./components/base/baseComponentMixin.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"baseComponentMixin\", function() { return _baseComponentMixin_js__WEBPACK_IMPORTED_MODULE_0__[\"baseComponentMixin\"]; });\n\n/* harmony import */ var _themeClassMixin_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./themeClassMixin.js */ \"./components/base/themeClassMixin.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"themeClassMixin\", function() { return _themeClassMixin_js__WEBPACK_IMPORTED_MODULE_1__[\"themeClassMixin\"]; });\n\n\n\n\n//# sourceURL=webpack:///./components/base/index.js?");

  /***/ }),

  /***/ "./components/base/themeClassMixin.js":
  /*!********************************************!*\
    !*** ./components/base/themeClassMixin.js ***!
    \********************************************/
  /*! exports provided: themeClassMixin */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"themeClassMixin\", function() { return themeClassMixin; });\nvar themeProps = ['primary', 'secondary', 'background', 'surface', 'on-primary', 'on-secondary', 'on-surface', 'primary-bg', 'secondary-bg', 'text-primary-on-light', 'text-secondary-on-light', 'text-hint-on-light', 'text-disabled-on-light', 'text-icon-on-light', 'text-primary-on-dark', 'text-secondary-on-dark', 'text-hint-on-dark', 'text-disabled-on-dark', 'text-icon-on-dark'];\nvar themeClassMixin = {\n  props: {\n    theming: {\n      type: String,\n      default: ''\n    }\n  },\n  mounted: function mounted() {\n    if (themeProps.indexOf(this.theming) > -1) {\n      this.$el.classList.add('mdc-theme--' + this.theming);\n    }\n  }\n};\n\n//# sourceURL=webpack:///./components/base/themeClassMixin.js?");

  /***/ }),

  /***/ "./components/button/Button.vue":
  /*!**************************************!*\
    !*** ./components/button/Button.vue ***!
    \**************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Button_vue_vue_type_template_id_6bba9fb8__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Button.vue?vue&type=template&id=6bba9fb8 */ \"./components/button/Button.vue?vue&type=template&id=6bba9fb8\");\n/* harmony import */ var _Button_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Button.vue?vue&type=script&lang=js */ \"./components/button/Button.vue?vue&type=script&lang=js\");\n/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ \"./node_modules/vue-loader/lib/runtime/componentNormalizer.js\");\n\n\n\n\n\n/* normalize component */\n\nvar component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(\n  _Button_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  _Button_vue_vue_type_template_id_6bba9fb8__WEBPACK_IMPORTED_MODULE_0__[\"render\"],\n  _Button_vue_vue_type_template_id_6bba9fb8__WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"],\n  false,\n  null,\n  null,\n  null\n  \n)\n\n/* hot reload */\nif (false) { var api; }\ncomponent.options.__file = \"components/button/Button.vue\"\n/* harmony default export */ __webpack_exports__[\"default\"] = (component.exports);\n\n//# sourceURL=webpack:///./components/button/Button.vue?");

  /***/ }),

  /***/ "./components/button/Button.vue?vue&type=script&lang=js":
  /*!**************************************************************!*\
    !*** ./components/button/Button.vue?vue&type=script&lang=js ***!
    \**************************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_1_node_modules_vue_loader_lib_index_js_vue_loader_options_Button_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib??ref--1!../../node_modules/vue-loader/lib??vue-loader-options!./Button.vue?vue&type=script&lang=js */ \"./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./components/button/Button.vue?vue&type=script&lang=js\");\n/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__[\"default\"] = (_node_modules_babel_loader_lib_index_js_ref_1_node_modules_vue_loader_lib_index_js_vue_loader_options_Button_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]); \n\n//# sourceURL=webpack:///./components/button/Button.vue?");

  /***/ }),

  /***/ "./components/button/Button.vue?vue&type=template&id=6bba9fb8":
  /*!********************************************************************!*\
    !*** ./components/button/Button.vue?vue&type=template&id=6bba9fb8 ***!
    \********************************************************************/
  /*! exports provided: render, staticRenderFns */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Button_vue_vue_type_template_id_6bba9fb8__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib??vue-loader-options!./Button.vue?vue&type=template&id=6bba9fb8 */ \"./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./components/button/Button.vue?vue&type=template&id=6bba9fb8\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Button_vue_vue_type_template_id_6bba9fb8__WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Button_vue_vue_type_template_id_6bba9fb8__WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"]; });\n\n\n\n//# sourceURL=webpack:///./components/button/Button.vue?");

  /***/ }),

  /***/ "./components/button/index.js":
  /*!************************************!*\
    !*** ./components/button/index.js ***!
    \************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Button_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Button.vue */ \"./components/button/Button.vue\");\n/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./styles.scss */ \"./components/button/styles.scss\");\n/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_scss__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../ */ \"./components/index.js\");\n\n\n\nvar plugin = {\n  install: function install(vm) {\n    vm.component('m-button', _Button_vue__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n  }\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = (plugin);\nObject(___WEBPACK_IMPORTED_MODULE_2__[\"initPlugin\"])(plugin);\n\n//# sourceURL=webpack:///./components/button/index.js?");

  /***/ }),

  /***/ "./components/button/styles.scss":
  /*!***************************************!*\
    !*** ./components/button/styles.scss ***!
    \***************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {

  eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./components/button/styles.scss?");

  /***/ }),

  /***/ "./components/debounce.js":
  /*!********************************!*\
    !*** ./components/debounce.js ***!
    \********************************/
  /*! exports provided: debounce */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"debounce\", function() { return debounce; });\nfunction debounce(fn, debounceDuration) {\n  debounceDuration = debounceDuration || 100;\n  return function () {\n    if (!fn.debouncing) {\n      var args = Array.prototype.slice.apply(arguments);\n      fn.lastReturnVal = fn.apply(window, args);\n      fn.debouncing = true;\n    }\n\n    clearTimeout(fn.debounceTimeout);\n    fn.debounceTimeout = setTimeout(function () {\n      fn.debouncing = false;\n    }, debounceDuration);\n    return fn.lastReturnVal;\n  };\n}\n\n//# sourceURL=webpack:///./components/debounce.js?");

  /***/ }),

  /***/ "./components/index.js":
  /*!*****************************!*\
    !*** ./components/index.js ***!
    \*****************************/
  /*! exports provided: debounce, initPlugin */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _debounce_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./debounce.js */ \"./components/debounce.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"debounce\", function() { return _debounce_js__WEBPACK_IMPORTED_MODULE_0__[\"debounce\"]; });\n\n/* harmony import */ var _initPlugin_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./initPlugin.js */ \"./components/initPlugin.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"initPlugin\", function() { return _initPlugin_js__WEBPACK_IMPORTED_MODULE_1__[\"initPlugin\"]; });\n\n\n\n\n//# sourceURL=webpack:///./components/index.js?");

  /***/ }),

  /***/ "./components/initPlugin.js":
  /*!**********************************!*\
    !*** ./components/initPlugin.js ***!
    \**********************************/
  /*! exports provided: initPlugin */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"initPlugin\", function() { return initPlugin; });\nfunction initPlugin(plugin) {\n  if (typeof window !== 'undefined' && window.Vue) {\n    window.Vue.use(plugin);\n  }\n}\n\n//# sourceURL=webpack:///./components/initPlugin.js?");

  /***/ }),

  /***/ "./node_modules/@material/base/component.js":
  /*!**************************************************!*\
    !*** ./node_modules/@material/base/component.js ***!
    \**************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _foundation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./foundation */ \"./node_modules/@material/base/foundation.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n/**\n * @license\n * Copyright 2016 Google Inc.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *   http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n/**\n * @template F\n */\n\nvar MDCComponent =\n/*#__PURE__*/\nfunction () {\n  _createClass(MDCComponent, null, [{\n    key: \"attachTo\",\n\n    /**\n     * @param {!Element} root\n     * @return {!MDCComponent}\n     */\n    value: function attachTo(root) {\n      // Subclasses which extend MDCBase should provide an attachTo() method that takes a root element and\n      // returns an instantiated component with its root set to that element. Also note that in the cases of\n      // subclasses, an explicit foundation class will not have to be passed in; it will simply be initialized\n      // from getDefaultFoundation().\n      return new MDCComponent(root, new _foundation__WEBPACK_IMPORTED_MODULE_0__[\"default\"]());\n    }\n    /**\n     * @param {!Element} root\n     * @param {F=} foundation\n     * @param {...?} args\n     */\n\n  }]);\n\n  function MDCComponent(root) {\n    var foundation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;\n\n    _classCallCheck(this, MDCComponent);\n\n    /** @protected {!Element} */\n    this.root_ = root;\n\n    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {\n      args[_key - 2] = arguments[_key];\n    }\n\n    this.initialize.apply(this, args); // Note that we initialize foundation here and not within the constructor's default param so that\n    // this.root_ is defined and can be used within the foundation class.\n\n    /** @protected {!F} */\n\n    this.foundation_ = foundation === undefined ? this.getDefaultFoundation() : foundation;\n    this.foundation_.init();\n    this.initialSyncWithDOM();\n  }\n\n  _createClass(MDCComponent, [{\n    key: \"initialize\",\n    value: function initialize()\n    /* ...args */\n    {} // Subclasses can override this to do any additional setup work that would be considered part of a\n    // \"constructor\". Essentially, it is a hook into the parent constructor before the foundation is\n    // initialized. Any additional arguments besides root and foundation will be passed in here.\n\n    /**\n     * @return {!F} foundation\n     */\n\n  }, {\n    key: \"getDefaultFoundation\",\n    value: function getDefaultFoundation() {\n      // Subclasses must override this method to return a properly configured foundation class for the\n      // component.\n      throw new Error('Subclasses must override getDefaultFoundation to return a properly configured ' + 'foundation class');\n    }\n  }, {\n    key: \"initialSyncWithDOM\",\n    value: function initialSyncWithDOM() {// Subclasses should override this method if they need to perform work to synchronize with a host DOM\n      // object. An example of this would be a form control wrapper that needs to synchronize its internal state\n      // to some property or attribute of the host DOM. Please note: this is *not* the place to perform DOM\n      // reads/writes that would cause layout / paint, as this is called synchronously from within the constructor.\n    }\n  }, {\n    key: \"destroy\",\n    value: function destroy() {\n      // Subclasses may implement this method to release any resources / deregister any listeners they have\n      // attached. An example of this might be deregistering a resize event from the window object.\n      this.foundation_.destroy();\n    }\n    /**\n     * Wrapper method to add an event listener to the component's root element. This is most useful when\n     * listening for custom events.\n     * @param {string} evtType\n     * @param {!Function} handler\n     */\n\n  }, {\n    key: \"listen\",\n    value: function listen(evtType, handler) {\n      this.root_.addEventListener(evtType, handler);\n    }\n    /**\n     * Wrapper method to remove an event listener to the component's root element. This is most useful when\n     * unlistening for custom events.\n     * @param {string} evtType\n     * @param {!Function} handler\n     */\n\n  }, {\n    key: \"unlisten\",\n    value: function unlisten(evtType, handler) {\n      this.root_.removeEventListener(evtType, handler);\n    }\n    /**\n     * Fires a cross-browser-compatible custom event from the component root of the given type,\n     * with the given data.\n     * @param {string} evtType\n     * @param {!Object} evtData\n     * @param {boolean=} shouldBubble\n     */\n\n  }, {\n    key: \"emit\",\n    value: function emit(evtType, evtData) {\n      var shouldBubble = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;\n      var evt;\n\n      if (typeof CustomEvent === 'function') {\n        evt = new CustomEvent(evtType, {\n          detail: evtData,\n          bubbles: shouldBubble\n        });\n      } else {\n        evt = document.createEvent('CustomEvent');\n        evt.initCustomEvent(evtType, shouldBubble, false, evtData);\n      }\n\n      this.root_.dispatchEvent(evt);\n    }\n  }]);\n\n  return MDCComponent;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MDCComponent);\n\n//# sourceURL=webpack:///./node_modules/@material/base/component.js?");

  /***/ }),

  /***/ "./node_modules/@material/base/foundation.js":
  /*!***************************************************!*\
    !*** ./node_modules/@material/base/foundation.js ***!
    \***************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n/**\n * @license\n * Copyright 2016 Google Inc.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *   http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n/**\n * @template A\n */\nvar MDCFoundation =\n/*#__PURE__*/\nfunction () {\n  _createClass(MDCFoundation, null, [{\n    key: \"cssClasses\",\n\n    /** @return enum{cssClasses} */\n    get: function get() {\n      // Classes extending MDCFoundation should implement this method to return an object which exports every\n      // CSS class the foundation class needs as a property. e.g. {ACTIVE: 'mdc-component--active'}\n      return {};\n    }\n    /** @return enum{strings} */\n\n  }, {\n    key: \"strings\",\n    get: function get() {\n      // Classes extending MDCFoundation should implement this method to return an object which exports all\n      // semantic strings as constants. e.g. {ARIA_ROLE: 'tablist'}\n      return {};\n    }\n    /** @return enum{numbers} */\n\n  }, {\n    key: \"numbers\",\n    get: function get() {\n      // Classes extending MDCFoundation should implement this method to return an object which exports all\n      // of its semantic numbers as constants. e.g. {ANIMATION_DELAY_MS: 350}\n      return {};\n    }\n    /** @return {!Object} */\n\n  }, {\n    key: \"defaultAdapter\",\n    get: function get() {\n      // Classes extending MDCFoundation may choose to implement this getter in order to provide a convenient\n      // way of viewing the necessary methods of an adapter. In the future, this could also be used for adapter\n      // validation.\n      return {};\n    }\n    /**\n     * @param {A=} adapter\n     */\n\n  }]);\n\n  function MDCFoundation() {\n    var adapter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};\n\n    _classCallCheck(this, MDCFoundation);\n\n    /** @protected {!A} */\n    this.adapter_ = adapter;\n  }\n\n  _createClass(MDCFoundation, [{\n    key: \"init\",\n    value: function init() {// Subclasses should override this method to perform initialization routines (registering events, etc.)\n    }\n  }, {\n    key: \"destroy\",\n    value: function destroy() {// Subclasses should override this method to perform de-initialization routines (de-registering events, etc.)\n    }\n  }]);\n\n  return MDCFoundation;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MDCFoundation);\n\n//# sourceURL=webpack:///./node_modules/@material/base/foundation.js?");

  /***/ }),

  /***/ "./node_modules/@material/ripple/adapter.js":
  /*!**************************************************!*\
    !*** ./node_modules/@material/ripple/adapter.js ***!
    \**************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n/**\n * @license\n * Copyright 2016 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n/* eslint no-unused-vars: [2, {\"args\": \"none\"}] */\n\n/**\n * Adapter for MDC Ripple. Provides an interface for managing\n * - classes\n * - dom\n * - CSS variables\n * - position\n * - dimensions\n * - scroll position\n * - event handlers\n * - unbounded, active and disabled states\n *\n * Additionally, provides type information for the adapter to the Closure\n * compiler.\n *\n * Implement this adapter for your framework of choice to delegate updates to\n * the component in your framework of choice. See architecture documentation\n * for more details.\n * https://github.com/material-components/material-components-web/blob/master/docs/code/architecture.md\n *\n * @record\n */\nvar MDCRippleAdapter =\n/*#__PURE__*/\nfunction () {\n  function MDCRippleAdapter() {\n    _classCallCheck(this, MDCRippleAdapter);\n  }\n\n  _createClass(MDCRippleAdapter, [{\n    key: \"browserSupportsCssVars\",\n\n    /** @return {boolean} */\n    value: function browserSupportsCssVars() {}\n    /** @return {boolean} */\n\n  }, {\n    key: \"isUnbounded\",\n    value: function isUnbounded() {}\n    /** @return {boolean} */\n\n  }, {\n    key: \"isSurfaceActive\",\n    value: function isSurfaceActive() {}\n    /** @return {boolean} */\n\n  }, {\n    key: \"isSurfaceDisabled\",\n    value: function isSurfaceDisabled() {}\n    /** @param {string} className */\n\n  }, {\n    key: \"addClass\",\n    value: function addClass(className) {}\n    /** @param {string} className */\n\n  }, {\n    key: \"removeClass\",\n    value: function removeClass(className) {}\n    /** @param {!EventTarget} target */\n\n  }, {\n    key: \"containsEventTarget\",\n    value: function containsEventTarget(target) {}\n    /**\n     * @param {string} evtType\n     * @param {!Function} handler\n     */\n\n  }, {\n    key: \"registerInteractionHandler\",\n    value: function registerInteractionHandler(evtType, handler) {}\n    /**\n     * @param {string} evtType\n     * @param {!Function} handler\n     */\n\n  }, {\n    key: \"deregisterInteractionHandler\",\n    value: function deregisterInteractionHandler(evtType, handler) {}\n    /**\n     * @param {string} evtType\n     * @param {!Function} handler\n     */\n\n  }, {\n    key: \"registerDocumentInteractionHandler\",\n    value: function registerDocumentInteractionHandler(evtType, handler) {}\n    /**\n     * @param {string} evtType\n     * @param {!Function} handler\n     */\n\n  }, {\n    key: \"deregisterDocumentInteractionHandler\",\n    value: function deregisterDocumentInteractionHandler(evtType, handler) {}\n    /**\n     * @param {!Function} handler\n     */\n\n  }, {\n    key: \"registerResizeHandler\",\n    value: function registerResizeHandler(handler) {}\n    /**\n     * @param {!Function} handler\n     */\n\n  }, {\n    key: \"deregisterResizeHandler\",\n    value: function deregisterResizeHandler(handler) {}\n    /**\n     * @param {string} varName\n     * @param {?number|string} value\n     */\n\n  }, {\n    key: \"updateCssVariable\",\n    value: function updateCssVariable(varName, value) {}\n    /** @return {!ClientRect} */\n\n  }, {\n    key: \"computeBoundingRect\",\n    value: function computeBoundingRect() {}\n    /** @return {{x: number, y: number}} */\n\n  }, {\n    key: \"getWindowPageOffset\",\n    value: function getWindowPageOffset() {}\n  }]);\n\n  return MDCRippleAdapter;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MDCRippleAdapter);\n\n//# sourceURL=webpack:///./node_modules/@material/ripple/adapter.js?");

  /***/ }),

  /***/ "./node_modules/@material/ripple/constants.js":
  /*!****************************************************!*\
    !*** ./node_modules/@material/ripple/constants.js ***!
    \****************************************************/
  /*! exports provided: cssClasses, strings, numbers */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"cssClasses\", function() { return cssClasses; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"strings\", function() { return strings; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"numbers\", function() { return numbers; });\n/**\n * @license\n * Copyright 2016 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\nvar cssClasses = {\n  // Ripple is a special case where the \"root\" component is really a \"mixin\" of sorts,\n  // given that it's an 'upgrade' to an existing component. That being said it is the root\n  // CSS class that all other CSS classes derive from.\n  ROOT: 'mdc-ripple-upgraded',\n  UNBOUNDED: 'mdc-ripple-upgraded--unbounded',\n  BG_FOCUSED: 'mdc-ripple-upgraded--background-focused',\n  FG_ACTIVATION: 'mdc-ripple-upgraded--foreground-activation',\n  FG_DEACTIVATION: 'mdc-ripple-upgraded--foreground-deactivation'\n};\nvar strings = {\n  VAR_LEFT: '--mdc-ripple-left',\n  VAR_TOP: '--mdc-ripple-top',\n  VAR_FG_SIZE: '--mdc-ripple-fg-size',\n  VAR_FG_SCALE: '--mdc-ripple-fg-scale',\n  VAR_FG_TRANSLATE_START: '--mdc-ripple-fg-translate-start',\n  VAR_FG_TRANSLATE_END: '--mdc-ripple-fg-translate-end'\n};\nvar numbers = {\n  PADDING: 10,\n  INITIAL_ORIGIN_SCALE: 0.6,\n  DEACTIVATION_TIMEOUT_MS: 225,\n  // Corresponds to $mdc-ripple-translate-duration (i.e. activation animation duration)\n  FG_DEACTIVATION_MS: 150,\n  // Corresponds to $mdc-ripple-fade-out-duration (i.e. deactivation animation duration)\n  TAP_DELAY_MS: 300 // Delay between touch and simulated mouse events on touch devices\n\n};\n\n\n//# sourceURL=webpack:///./node_modules/@material/ripple/constants.js?");

  /***/ }),

  /***/ "./node_modules/@material/ripple/foundation.js":
  /*!*****************************************************!*\
    !*** ./node_modules/@material/ripple/foundation.js ***!
    \*****************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _material_base_foundation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @material/base/foundation */ \"./node_modules/@material/base/foundation.js\");\n/* harmony import */ var _adapter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./adapter */ \"./node_modules/@material/ripple/adapter.js\");\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ \"./node_modules/@material/ripple/constants.js\");\n/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util */ \"./node_modules/@material/ripple/util.js\");\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\n/**\n * @license\n * Copyright 2016 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n\n\n\n/**\n * @typedef {{\n *   isActivated: (boolean|undefined),\n *   hasDeactivationUXRun: (boolean|undefined),\n *   wasActivatedByPointer: (boolean|undefined),\n *   wasElementMadeActive: (boolean|undefined),\n *   activationEvent: Event,\n *   isProgrammatic: (boolean|undefined)\n * }}\n */\n\nvar ActivationStateType;\n/**\n * @typedef {{\n *   activate: (string|undefined),\n *   deactivate: (string|undefined),\n *   focus: (string|undefined),\n *   blur: (string|undefined)\n * }}\n */\n\nvar ListenerInfoType;\n/**\n * @typedef {{\n *   activate: function(!Event),\n *   deactivate: function(!Event),\n *   focus: function(),\n *   blur: function()\n * }}\n */\n\nvar ListenersType;\n/**\n * @typedef {{\n *   x: number,\n *   y: number\n * }}\n */\n\nvar PointType; // Activation events registered on the root element of each instance for activation\n\nvar ACTIVATION_EVENT_TYPES = ['touchstart', 'pointerdown', 'mousedown', 'keydown']; // Deactivation events registered on documentElement when a pointer-related down event occurs\n\nvar POINTER_DEACTIVATION_EVENT_TYPES = ['touchend', 'pointerup', 'mouseup']; // Tracks activations that have occurred on the current frame, to avoid simultaneous nested activations\n\n/** @type {!Array<!EventTarget>} */\n\nvar activatedTargets = [];\n/**\n * @extends {MDCFoundation<!MDCRippleAdapter>}\n */\n\nvar MDCRippleFoundation =\n/*#__PURE__*/\nfunction (_MDCFoundation) {\n  _inherits(MDCRippleFoundation, _MDCFoundation);\n\n  _createClass(MDCRippleFoundation, null, [{\n    key: \"cssClasses\",\n    get: function get() {\n      return _constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"];\n    }\n  }, {\n    key: \"strings\",\n    get: function get() {\n      return _constants__WEBPACK_IMPORTED_MODULE_2__[\"strings\"];\n    }\n  }, {\n    key: \"numbers\",\n    get: function get() {\n      return _constants__WEBPACK_IMPORTED_MODULE_2__[\"numbers\"];\n    }\n  }, {\n    key: \"defaultAdapter\",\n    get: function get() {\n      return {\n        browserSupportsCssVars: function browserSupportsCssVars()\n        /* boolean - cached */\n        {},\n        isUnbounded: function isUnbounded()\n        /* boolean */\n        {},\n        isSurfaceActive: function isSurfaceActive()\n        /* boolean */\n        {},\n        isSurfaceDisabled: function isSurfaceDisabled()\n        /* boolean */\n        {},\n        addClass: function addClass()\n        /* className: string */\n        {},\n        removeClass: function removeClass()\n        /* className: string */\n        {},\n        containsEventTarget: function containsEventTarget()\n        /* target: !EventTarget */\n        {},\n        registerInteractionHandler: function registerInteractionHandler()\n        /* evtType: string, handler: EventListener */\n        {},\n        deregisterInteractionHandler: function deregisterInteractionHandler()\n        /* evtType: string, handler: EventListener */\n        {},\n        registerDocumentInteractionHandler: function registerDocumentInteractionHandler()\n        /* evtType: string, handler: EventListener */\n        {},\n        deregisterDocumentInteractionHandler: function deregisterDocumentInteractionHandler()\n        /* evtType: string, handler: EventListener */\n        {},\n        registerResizeHandler: function registerResizeHandler()\n        /* handler: EventListener */\n        {},\n        deregisterResizeHandler: function deregisterResizeHandler()\n        /* handler: EventListener */\n        {},\n        updateCssVariable: function updateCssVariable()\n        /* varName: string, value: string */\n        {},\n        computeBoundingRect: function computeBoundingRect()\n        /* ClientRect */\n        {},\n        getWindowPageOffset: function getWindowPageOffset()\n        /* {x: number, y: number} */\n        {}\n      };\n    }\n  }]);\n\n  function MDCRippleFoundation(adapter) {\n    var _this;\n\n    _classCallCheck(this, MDCRippleFoundation);\n\n    _this = _possibleConstructorReturn(this, _getPrototypeOf(MDCRippleFoundation).call(this, _extends(MDCRippleFoundation.defaultAdapter, adapter)));\n    /** @private {number} */\n\n    _this.layoutFrame_ = 0;\n    /** @private {!ClientRect} */\n\n    _this.frame_ =\n    /** @type {!ClientRect} */\n    {\n      width: 0,\n      height: 0\n    };\n    /** @private {!ActivationStateType} */\n\n    _this.activationState_ = _this.defaultActivationState_();\n    /** @private {number} */\n\n    _this.initialSize_ = 0;\n    /** @private {number} */\n\n    _this.maxRadius_ = 0;\n    /** @private {function(!Event)} */\n\n    _this.activateHandler_ = function (e) {\n      return _this.activate_(e);\n    };\n    /** @private {function(!Event)} */\n\n\n    _this.deactivateHandler_ = function (e) {\n      return _this.deactivate_(e);\n    };\n    /** @private {function(?Event=)} */\n\n\n    _this.focusHandler_ = function () {\n      return _this.handleFocus();\n    };\n    /** @private {function(?Event=)} */\n\n\n    _this.blurHandler_ = function () {\n      return _this.handleBlur();\n    };\n    /** @private {!Function} */\n\n\n    _this.resizeHandler_ = function () {\n      return _this.layout();\n    };\n    /** @private {{left: number, top:number}} */\n\n\n    _this.unboundedCoords_ = {\n      left: 0,\n      top: 0\n    };\n    /** @private {number} */\n\n    _this.fgScale_ = 0;\n    /** @private {number} */\n\n    _this.activationTimer_ = 0;\n    /** @private {number} */\n\n    _this.fgDeactivationRemovalTimer_ = 0;\n    /** @private {boolean} */\n\n    _this.activationAnimationHasEnded_ = false;\n    /** @private {!Function} */\n\n    _this.activationTimerCallback_ = function () {\n      _this.activationAnimationHasEnded_ = true;\n\n      _this.runDeactivationUXLogicIfReady_();\n    };\n    /** @private {?Event} */\n\n\n    _this.previousActivationEvent_ = null;\n    return _this;\n  }\n  /**\n   * We compute this property so that we are not querying information about the client\n   * until the point in time where the foundation requests it. This prevents scenarios where\n   * client-side feature-detection may happen too early, such as when components are rendered on the server\n   * and then initialized at mount time on the client.\n   * @return {boolean}\n   * @private\n   */\n\n\n  _createClass(MDCRippleFoundation, [{\n    key: \"isSupported_\",\n    value: function isSupported_() {\n      return this.adapter_.browserSupportsCssVars();\n    }\n    /**\n     * @return {!ActivationStateType}\n     */\n\n  }, {\n    key: \"defaultActivationState_\",\n    value: function defaultActivationState_() {\n      return {\n        isActivated: false,\n        hasDeactivationUXRun: false,\n        wasActivatedByPointer: false,\n        wasElementMadeActive: false,\n        activationEvent: null,\n        isProgrammatic: false\n      };\n    }\n    /** @override */\n\n  }, {\n    key: \"init\",\n    value: function init() {\n      var _this2 = this;\n\n      if (!this.isSupported_()) {\n        return;\n      }\n\n      this.registerRootHandlers_();\n      var _MDCRippleFoundation$ = MDCRippleFoundation.cssClasses,\n          ROOT = _MDCRippleFoundation$.ROOT,\n          UNBOUNDED = _MDCRippleFoundation$.UNBOUNDED;\n      requestAnimationFrame(function () {\n        _this2.adapter_.addClass(ROOT);\n\n        if (_this2.adapter_.isUnbounded()) {\n          _this2.adapter_.addClass(UNBOUNDED); // Unbounded ripples need layout logic applied immediately to set coordinates for both shade and ripple\n\n\n          _this2.layoutInternal_();\n        }\n      });\n    }\n    /** @override */\n\n  }, {\n    key: \"destroy\",\n    value: function destroy() {\n      var _this3 = this;\n\n      if (!this.isSupported_()) {\n        return;\n      }\n\n      if (this.activationTimer_) {\n        clearTimeout(this.activationTimer_);\n        this.activationTimer_ = 0;\n        var FG_ACTIVATION = MDCRippleFoundation.cssClasses.FG_ACTIVATION;\n        this.adapter_.removeClass(FG_ACTIVATION);\n      }\n\n      this.deregisterRootHandlers_();\n      this.deregisterDeactivationHandlers_();\n      var _MDCRippleFoundation$2 = MDCRippleFoundation.cssClasses,\n          ROOT = _MDCRippleFoundation$2.ROOT,\n          UNBOUNDED = _MDCRippleFoundation$2.UNBOUNDED;\n      requestAnimationFrame(function () {\n        _this3.adapter_.removeClass(ROOT);\n\n        _this3.adapter_.removeClass(UNBOUNDED);\n\n        _this3.removeCssVars_();\n      });\n    }\n    /** @private */\n\n  }, {\n    key: \"registerRootHandlers_\",\n    value: function registerRootHandlers_() {\n      var _this4 = this;\n\n      ACTIVATION_EVENT_TYPES.forEach(function (type) {\n        _this4.adapter_.registerInteractionHandler(type, _this4.activateHandler_);\n      });\n      this.adapter_.registerInteractionHandler('focus', this.focusHandler_);\n      this.adapter_.registerInteractionHandler('blur', this.blurHandler_);\n\n      if (this.adapter_.isUnbounded()) {\n        this.adapter_.registerResizeHandler(this.resizeHandler_);\n      }\n    }\n    /**\n     * @param {!Event} e\n     * @private\n     */\n\n  }, {\n    key: \"registerDeactivationHandlers_\",\n    value: function registerDeactivationHandlers_(e) {\n      var _this5 = this;\n\n      if (e.type === 'keydown') {\n        this.adapter_.registerInteractionHandler('keyup', this.deactivateHandler_);\n      } else {\n        POINTER_DEACTIVATION_EVENT_TYPES.forEach(function (type) {\n          _this5.adapter_.registerDocumentInteractionHandler(type, _this5.deactivateHandler_);\n        });\n      }\n    }\n    /** @private */\n\n  }, {\n    key: \"deregisterRootHandlers_\",\n    value: function deregisterRootHandlers_() {\n      var _this6 = this;\n\n      ACTIVATION_EVENT_TYPES.forEach(function (type) {\n        _this6.adapter_.deregisterInteractionHandler(type, _this6.activateHandler_);\n      });\n      this.adapter_.deregisterInteractionHandler('focus', this.focusHandler_);\n      this.adapter_.deregisterInteractionHandler('blur', this.blurHandler_);\n\n      if (this.adapter_.isUnbounded()) {\n        this.adapter_.deregisterResizeHandler(this.resizeHandler_);\n      }\n    }\n    /** @private */\n\n  }, {\n    key: \"deregisterDeactivationHandlers_\",\n    value: function deregisterDeactivationHandlers_() {\n      var _this7 = this;\n\n      this.adapter_.deregisterInteractionHandler('keyup', this.deactivateHandler_);\n      POINTER_DEACTIVATION_EVENT_TYPES.forEach(function (type) {\n        _this7.adapter_.deregisterDocumentInteractionHandler(type, _this7.deactivateHandler_);\n      });\n    }\n    /** @private */\n\n  }, {\n    key: \"removeCssVars_\",\n    value: function removeCssVars_() {\n      var _this8 = this;\n\n      var strings = MDCRippleFoundation.strings;\n      Object.keys(strings).forEach(function (k) {\n        if (k.indexOf('VAR_') === 0) {\n          _this8.adapter_.updateCssVariable(strings[k], null);\n        }\n      });\n    }\n    /**\n     * @param {?Event} e\n     * @private\n     */\n\n  }, {\n    key: \"activate_\",\n    value: function activate_(e) {\n      var _this9 = this;\n\n      if (this.adapter_.isSurfaceDisabled()) {\n        return;\n      }\n\n      var activationState = this.activationState_;\n\n      if (activationState.isActivated) {\n        return;\n      } // Avoid reacting to follow-on events fired by touch device after an already-processed user interaction\n\n\n      var previousActivationEvent = this.previousActivationEvent_;\n      var isSameInteraction = previousActivationEvent && e && previousActivationEvent.type !== e.type;\n\n      if (isSameInteraction) {\n        return;\n      }\n\n      activationState.isActivated = true;\n      activationState.isProgrammatic = e === null;\n      activationState.activationEvent = e;\n      activationState.wasActivatedByPointer = activationState.isProgrammatic ? false : e.type === 'mousedown' || e.type === 'touchstart' || e.type === 'pointerdown';\n      var hasActivatedChild = e && activatedTargets.length > 0 && activatedTargets.some(function (target) {\n        return _this9.adapter_.containsEventTarget(target);\n      });\n\n      if (hasActivatedChild) {\n        // Immediately reset activation state, while preserving logic that prevents touch follow-on events\n        this.resetActivationState_();\n        return;\n      }\n\n      if (e) {\n        activatedTargets.push(\n        /** @type {!EventTarget} */\n        e.target);\n        this.registerDeactivationHandlers_(e);\n      }\n\n      activationState.wasElementMadeActive = this.checkElementMadeActive_(e);\n\n      if (activationState.wasElementMadeActive) {\n        this.animateActivation_();\n      }\n\n      requestAnimationFrame(function () {\n        // Reset array on next frame after the current event has had a chance to bubble to prevent ancestor ripples\n        activatedTargets = [];\n\n        if (!activationState.wasElementMadeActive && (e.key === ' ' || e.keyCode === 32)) {\n          // If space was pressed, try again within an rAF call to detect :active, because different UAs report\n          // active states inconsistently when they're called within event handling code:\n          // - https://bugs.chromium.org/p/chromium/issues/detail?id=635971\n          // - https://bugzilla.mozilla.org/show_bug.cgi?id=1293741\n          // We try first outside rAF to support Edge, which does not exhibit this problem, but will crash if a CSS\n          // variable is set within a rAF callback for a submit button interaction (#2241).\n          activationState.wasElementMadeActive = _this9.checkElementMadeActive_(e);\n\n          if (activationState.wasElementMadeActive) {\n            _this9.animateActivation_();\n          }\n        }\n\n        if (!activationState.wasElementMadeActive) {\n          // Reset activation state immediately if element was not made active.\n          _this9.activationState_ = _this9.defaultActivationState_();\n        }\n      });\n    }\n    /**\n     * @param {?Event} e\n     * @private\n     */\n\n  }, {\n    key: \"checkElementMadeActive_\",\n    value: function checkElementMadeActive_(e) {\n      return e && e.type === 'keydown' ? this.adapter_.isSurfaceActive() : true;\n    }\n    /**\n     * @param {?Event=} event Optional event containing position information.\n     */\n\n  }, {\n    key: \"activate\",\n    value: function activate() {\n      var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;\n      this.activate_(event);\n    }\n    /** @private */\n\n  }, {\n    key: \"animateActivation_\",\n    value: function animateActivation_() {\n      var _this10 = this;\n\n      var _MDCRippleFoundation$3 = MDCRippleFoundation.strings,\n          VAR_FG_TRANSLATE_START = _MDCRippleFoundation$3.VAR_FG_TRANSLATE_START,\n          VAR_FG_TRANSLATE_END = _MDCRippleFoundation$3.VAR_FG_TRANSLATE_END;\n      var _MDCRippleFoundation$4 = MDCRippleFoundation.cssClasses,\n          FG_DEACTIVATION = _MDCRippleFoundation$4.FG_DEACTIVATION,\n          FG_ACTIVATION = _MDCRippleFoundation$4.FG_ACTIVATION;\n      var DEACTIVATION_TIMEOUT_MS = MDCRippleFoundation.numbers.DEACTIVATION_TIMEOUT_MS;\n      this.layoutInternal_();\n      var translateStart = '';\n      var translateEnd = '';\n\n      if (!this.adapter_.isUnbounded()) {\n        var _this$getFgTranslatio = this.getFgTranslationCoordinates_(),\n            startPoint = _this$getFgTranslatio.startPoint,\n            endPoint = _this$getFgTranslatio.endPoint;\n\n        translateStart = \"\".concat(startPoint.x, \"px, \").concat(startPoint.y, \"px\");\n        translateEnd = \"\".concat(endPoint.x, \"px, \").concat(endPoint.y, \"px\");\n      }\n\n      this.adapter_.updateCssVariable(VAR_FG_TRANSLATE_START, translateStart);\n      this.adapter_.updateCssVariable(VAR_FG_TRANSLATE_END, translateEnd); // Cancel any ongoing activation/deactivation animations\n\n      clearTimeout(this.activationTimer_);\n      clearTimeout(this.fgDeactivationRemovalTimer_);\n      this.rmBoundedActivationClasses_();\n      this.adapter_.removeClass(FG_DEACTIVATION); // Force layout in order to re-trigger the animation.\n\n      this.adapter_.computeBoundingRect();\n      this.adapter_.addClass(FG_ACTIVATION);\n      this.activationTimer_ = setTimeout(function () {\n        return _this10.activationTimerCallback_();\n      }, DEACTIVATION_TIMEOUT_MS);\n    }\n    /**\n     * @private\n     * @return {{startPoint: PointType, endPoint: PointType}}\n     */\n\n  }, {\n    key: \"getFgTranslationCoordinates_\",\n    value: function getFgTranslationCoordinates_() {\n      var _this$activationState = this.activationState_,\n          activationEvent = _this$activationState.activationEvent,\n          wasActivatedByPointer = _this$activationState.wasActivatedByPointer;\n      var startPoint;\n\n      if (wasActivatedByPointer) {\n        startPoint = Object(_util__WEBPACK_IMPORTED_MODULE_3__[\"getNormalizedEventCoords\"])(\n        /** @type {!Event} */\n        activationEvent, this.adapter_.getWindowPageOffset(), this.adapter_.computeBoundingRect());\n      } else {\n        startPoint = {\n          x: this.frame_.width / 2,\n          y: this.frame_.height / 2\n        };\n      } // Center the element around the start point.\n\n\n      startPoint = {\n        x: startPoint.x - this.initialSize_ / 2,\n        y: startPoint.y - this.initialSize_ / 2\n      };\n      var endPoint = {\n        x: this.frame_.width / 2 - this.initialSize_ / 2,\n        y: this.frame_.height / 2 - this.initialSize_ / 2\n      };\n      return {\n        startPoint: startPoint,\n        endPoint: endPoint\n      };\n    }\n    /** @private */\n\n  }, {\n    key: \"runDeactivationUXLogicIfReady_\",\n    value: function runDeactivationUXLogicIfReady_() {\n      var _this11 = this;\n\n      // This method is called both when a pointing device is released, and when the activation animation ends.\n      // The deactivation animation should only run after both of those occur.\n      var FG_DEACTIVATION = MDCRippleFoundation.cssClasses.FG_DEACTIVATION;\n      var _this$activationState2 = this.activationState_,\n          hasDeactivationUXRun = _this$activationState2.hasDeactivationUXRun,\n          isActivated = _this$activationState2.isActivated;\n      var activationHasEnded = hasDeactivationUXRun || !isActivated;\n\n      if (activationHasEnded && this.activationAnimationHasEnded_) {\n        this.rmBoundedActivationClasses_();\n        this.adapter_.addClass(FG_DEACTIVATION);\n        this.fgDeactivationRemovalTimer_ = setTimeout(function () {\n          _this11.adapter_.removeClass(FG_DEACTIVATION);\n        }, _constants__WEBPACK_IMPORTED_MODULE_2__[\"numbers\"].FG_DEACTIVATION_MS);\n      }\n    }\n    /** @private */\n\n  }, {\n    key: \"rmBoundedActivationClasses_\",\n    value: function rmBoundedActivationClasses_() {\n      var FG_ACTIVATION = MDCRippleFoundation.cssClasses.FG_ACTIVATION;\n      this.adapter_.removeClass(FG_ACTIVATION);\n      this.activationAnimationHasEnded_ = false;\n      this.adapter_.computeBoundingRect();\n    }\n  }, {\n    key: \"resetActivationState_\",\n    value: function resetActivationState_() {\n      var _this12 = this;\n\n      this.previousActivationEvent_ = this.activationState_.activationEvent;\n      this.activationState_ = this.defaultActivationState_(); // Touch devices may fire additional events for the same interaction within a short time.\n      // Store the previous event until it's safe to assume that subsequent events are for new interactions.\n\n      setTimeout(function () {\n        return _this12.previousActivationEvent_ = null;\n      }, MDCRippleFoundation.numbers.TAP_DELAY_MS);\n    }\n    /**\n     * @param {?Event} e\n     * @private\n     */\n\n  }, {\n    key: \"deactivate_\",\n    value: function deactivate_(e) {\n      var _this13 = this;\n\n      var activationState = this.activationState_; // This can happen in scenarios such as when you have a keyup event that blurs the element.\n\n      if (!activationState.isActivated) {\n        return;\n      }\n\n      var state =\n      /** @type {!ActivationStateType} */\n      _extends({}, activationState);\n\n      if (activationState.isProgrammatic) {\n        var evtObject = null;\n        requestAnimationFrame(function () {\n          return _this13.animateDeactivation_(evtObject, state);\n        });\n        this.resetActivationState_();\n      } else {\n        this.deregisterDeactivationHandlers_();\n        requestAnimationFrame(function () {\n          _this13.activationState_.hasDeactivationUXRun = true;\n\n          _this13.animateDeactivation_(e, state);\n\n          _this13.resetActivationState_();\n        });\n      }\n    }\n    /**\n     * @param {?Event=} event Optional event containing position information.\n     */\n\n  }, {\n    key: \"deactivate\",\n    value: function deactivate() {\n      var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;\n      this.deactivate_(event);\n    }\n    /**\n     * @param {Event} e\n     * @param {!ActivationStateType} options\n     * @private\n     */\n\n  }, {\n    key: \"animateDeactivation_\",\n    value: function animateDeactivation_(e, _ref) {\n      var wasActivatedByPointer = _ref.wasActivatedByPointer,\n          wasElementMadeActive = _ref.wasElementMadeActive;\n\n      if (wasActivatedByPointer || wasElementMadeActive) {\n        this.runDeactivationUXLogicIfReady_();\n      }\n    }\n  }, {\n    key: \"layout\",\n    value: function layout() {\n      var _this14 = this;\n\n      if (this.layoutFrame_) {\n        cancelAnimationFrame(this.layoutFrame_);\n      }\n\n      this.layoutFrame_ = requestAnimationFrame(function () {\n        _this14.layoutInternal_();\n\n        _this14.layoutFrame_ = 0;\n      });\n    }\n    /** @private */\n\n  }, {\n    key: \"layoutInternal_\",\n    value: function layoutInternal_() {\n      var _this15 = this;\n\n      this.frame_ = this.adapter_.computeBoundingRect();\n      var maxDim = Math.max(this.frame_.height, this.frame_.width); // Surface diameter is treated differently for unbounded vs. bounded ripples.\n      // Unbounded ripple diameter is calculated smaller since the surface is expected to already be padded appropriately\n      // to extend the hitbox, and the ripple is expected to meet the edges of the padded hitbox (which is typically\n      // square). Bounded ripples, on the other hand, are fully expected to expand beyond the surface's longest diameter\n      // (calculated based on the diagonal plus a constant padding), and are clipped at the surface's border via\n      // `overflow: hidden`.\n\n      var getBoundedRadius = function getBoundedRadius() {\n        var hypotenuse = Math.sqrt(Math.pow(_this15.frame_.width, 2) + Math.pow(_this15.frame_.height, 2));\n        return hypotenuse + MDCRippleFoundation.numbers.PADDING;\n      };\n\n      this.maxRadius_ = this.adapter_.isUnbounded() ? maxDim : getBoundedRadius(); // Ripple is sized as a fraction of the largest dimension of the surface, then scales up using a CSS scale transform\n\n      this.initialSize_ = maxDim * MDCRippleFoundation.numbers.INITIAL_ORIGIN_SCALE;\n      this.fgScale_ = this.maxRadius_ / this.initialSize_;\n      this.updateLayoutCssVars_();\n    }\n    /** @private */\n\n  }, {\n    key: \"updateLayoutCssVars_\",\n    value: function updateLayoutCssVars_() {\n      var _MDCRippleFoundation$5 = MDCRippleFoundation.strings,\n          VAR_FG_SIZE = _MDCRippleFoundation$5.VAR_FG_SIZE,\n          VAR_LEFT = _MDCRippleFoundation$5.VAR_LEFT,\n          VAR_TOP = _MDCRippleFoundation$5.VAR_TOP,\n          VAR_FG_SCALE = _MDCRippleFoundation$5.VAR_FG_SCALE;\n      this.adapter_.updateCssVariable(VAR_FG_SIZE, \"\".concat(this.initialSize_, \"px\"));\n      this.adapter_.updateCssVariable(VAR_FG_SCALE, this.fgScale_);\n\n      if (this.adapter_.isUnbounded()) {\n        this.unboundedCoords_ = {\n          left: Math.round(this.frame_.width / 2 - this.initialSize_ / 2),\n          top: Math.round(this.frame_.height / 2 - this.initialSize_ / 2)\n        };\n        this.adapter_.updateCssVariable(VAR_LEFT, \"\".concat(this.unboundedCoords_.left, \"px\"));\n        this.adapter_.updateCssVariable(VAR_TOP, \"\".concat(this.unboundedCoords_.top, \"px\"));\n      }\n    }\n    /** @param {boolean} unbounded */\n\n  }, {\n    key: \"setUnbounded\",\n    value: function setUnbounded(unbounded) {\n      var UNBOUNDED = MDCRippleFoundation.cssClasses.UNBOUNDED;\n\n      if (unbounded) {\n        this.adapter_.addClass(UNBOUNDED);\n      } else {\n        this.adapter_.removeClass(UNBOUNDED);\n      }\n    }\n  }, {\n    key: \"handleFocus\",\n    value: function handleFocus() {\n      var _this16 = this;\n\n      requestAnimationFrame(function () {\n        return _this16.adapter_.addClass(MDCRippleFoundation.cssClasses.BG_FOCUSED);\n      });\n    }\n  }, {\n    key: \"handleBlur\",\n    value: function handleBlur() {\n      var _this17 = this;\n\n      requestAnimationFrame(function () {\n        return _this17.adapter_.removeClass(MDCRippleFoundation.cssClasses.BG_FOCUSED);\n      });\n    }\n  }]);\n\n  return MDCRippleFoundation;\n}(_material_base_foundation__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MDCRippleFoundation);\n\n//# sourceURL=webpack:///./node_modules/@material/ripple/foundation.js?");

  /***/ }),

  /***/ "./node_modules/@material/ripple/index.js":
  /*!************************************************!*\
    !*** ./node_modules/@material/ripple/index.js ***!
    \************************************************/
  /*! exports provided: MDCRipple, MDCRippleFoundation, RippleCapableSurface, util */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MDCRipple\", function() { return MDCRipple; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RippleCapableSurface\", function() { return RippleCapableSurface; });\n/* harmony import */ var _material_base_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @material/base/component */ \"./node_modules/@material/base/component.js\");\n/* harmony import */ var _adapter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./adapter */ \"./node_modules/@material/ripple/adapter.js\");\n/* harmony import */ var _foundation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./foundation */ \"./node_modules/@material/ripple/foundation.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"MDCRippleFoundation\", function() { return _foundation__WEBPACK_IMPORTED_MODULE_2__[\"default\"]; });\n\n/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util */ \"./node_modules/@material/ripple/util.js\");\n/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, \"util\", function() { return _util__WEBPACK_IMPORTED_MODULE_3__; });\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\n/**\n * @license\n * Copyright 2016 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n\n\n\n/**\n * @extends MDCComponent<!MDCRippleFoundation>\n */\n\nvar MDCRipple =\n/*#__PURE__*/\nfunction (_MDCComponent) {\n  _inherits(MDCRipple, _MDCComponent);\n\n  /** @param {...?} args */\n  function MDCRipple() {\n    var _getPrototypeOf2;\n\n    var _this;\n\n    _classCallCheck(this, MDCRipple);\n\n    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {\n      args[_key] = arguments[_key];\n    }\n\n    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(MDCRipple)).call.apply(_getPrototypeOf2, [this].concat(args)));\n    /** @type {boolean} */\n\n    _this.disabled = false;\n    /** @private {boolean} */\n\n    _this.unbounded_;\n    return _this;\n  }\n  /**\n   * @param {!Element} root\n   * @param {{isUnbounded: (boolean|undefined)}=} options\n   * @return {!MDCRipple}\n   */\n\n\n  _createClass(MDCRipple, [{\n    key: \"setUnbounded_\",\n\n    /**\n     * Closure Compiler throws an access control error when directly accessing a\n     * protected or private property inside a getter/setter, like unbounded above.\n     * By accessing the protected property inside a method, we solve that problem.\n     * That's why this function exists.\n     * @private\n     */\n    value: function setUnbounded_() {\n      this.foundation_.setUnbounded(this.unbounded_);\n    }\n  }, {\n    key: \"activate\",\n    value: function activate() {\n      this.foundation_.activate();\n    }\n  }, {\n    key: \"deactivate\",\n    value: function deactivate() {\n      this.foundation_.deactivate();\n    }\n  }, {\n    key: \"layout\",\n    value: function layout() {\n      this.foundation_.layout();\n    }\n    /**\n     * @return {!MDCRippleFoundation}\n     * @override\n     */\n\n  }, {\n    key: \"getDefaultFoundation\",\n    value: function getDefaultFoundation() {\n      return new _foundation__WEBPACK_IMPORTED_MODULE_2__[\"default\"](MDCRipple.createAdapter(this));\n    }\n    /** @override */\n\n  }, {\n    key: \"initialSyncWithDOM\",\n    value: function initialSyncWithDOM() {\n      this.unbounded = 'mdcRippleIsUnbounded' in this.root_.dataset;\n    }\n  }, {\n    key: \"unbounded\",\n\n    /** @return {boolean} */\n    get: function get() {\n      return this.unbounded_;\n    }\n    /** @param {boolean} unbounded */\n    ,\n    set: function set(unbounded) {\n      this.unbounded_ = Boolean(unbounded);\n      this.setUnbounded_();\n    }\n  }], [{\n    key: \"attachTo\",\n    value: function attachTo(root) {\n      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},\n          _ref$isUnbounded = _ref.isUnbounded,\n          isUnbounded = _ref$isUnbounded === void 0 ? undefined : _ref$isUnbounded;\n\n      var ripple = new MDCRipple(root); // Only override unbounded behavior if option is explicitly specified\n\n      if (isUnbounded !== undefined) {\n        ripple.unbounded =\n        /** @type {boolean} */\n        isUnbounded;\n      }\n\n      return ripple;\n    }\n    /**\n     * @param {!RippleCapableSurface} instance\n     * @return {!MDCRippleAdapter}\n     */\n\n  }, {\n    key: \"createAdapter\",\n    value: function createAdapter(instance) {\n      var MATCHES = _util__WEBPACK_IMPORTED_MODULE_3__[\"getMatchesProperty\"](HTMLElement.prototype);\n      return {\n        browserSupportsCssVars: function browserSupportsCssVars() {\n          return _util__WEBPACK_IMPORTED_MODULE_3__[\"supportsCssVariables\"](window);\n        },\n        isUnbounded: function isUnbounded() {\n          return instance.unbounded;\n        },\n        isSurfaceActive: function isSurfaceActive() {\n          return instance.root_[MATCHES](':active');\n        },\n        isSurfaceDisabled: function isSurfaceDisabled() {\n          return instance.disabled;\n        },\n        addClass: function addClass(className) {\n          return instance.root_.classList.add(className);\n        },\n        removeClass: function removeClass(className) {\n          return instance.root_.classList.remove(className);\n        },\n        containsEventTarget: function containsEventTarget(target) {\n          return instance.root_.contains(target);\n        },\n        registerInteractionHandler: function registerInteractionHandler(evtType, handler) {\n          return instance.root_.addEventListener(evtType, handler, _util__WEBPACK_IMPORTED_MODULE_3__[\"applyPassive\"]());\n        },\n        deregisterInteractionHandler: function deregisterInteractionHandler(evtType, handler) {\n          return instance.root_.removeEventListener(evtType, handler, _util__WEBPACK_IMPORTED_MODULE_3__[\"applyPassive\"]());\n        },\n        registerDocumentInteractionHandler: function registerDocumentInteractionHandler(evtType, handler) {\n          return document.documentElement.addEventListener(evtType, handler, _util__WEBPACK_IMPORTED_MODULE_3__[\"applyPassive\"]());\n        },\n        deregisterDocumentInteractionHandler: function deregisterDocumentInteractionHandler(evtType, handler) {\n          return document.documentElement.removeEventListener(evtType, handler, _util__WEBPACK_IMPORTED_MODULE_3__[\"applyPassive\"]());\n        },\n        registerResizeHandler: function registerResizeHandler(handler) {\n          return window.addEventListener('resize', handler);\n        },\n        deregisterResizeHandler: function deregisterResizeHandler(handler) {\n          return window.removeEventListener('resize', handler);\n        },\n        updateCssVariable: function updateCssVariable(varName, value) {\n          return instance.root_.style.setProperty(varName, value);\n        },\n        computeBoundingRect: function computeBoundingRect() {\n          return instance.root_.getBoundingClientRect();\n        },\n        getWindowPageOffset: function getWindowPageOffset() {\n          return {\n            x: window.pageXOffset,\n            y: window.pageYOffset\n          };\n        }\n      };\n    }\n  }]);\n\n  return MDCRipple;\n}(_material_base_component__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n/**\n * See Material Design spec for more details on when to use ripples.\n * https://material.io/guidelines/motion/choreography.html#choreography-creation\n * @record\n */\n\n\nvar RippleCapableSurface = function RippleCapableSurface() {\n  _classCallCheck(this, RippleCapableSurface);\n};\n/** @protected {!Element} */\n\n\nRippleCapableSurface.prototype.root_;\n/**\n * Whether or not the ripple bleeds out of the bounds of the element.\n * @type {boolean|undefined}\n */\n\nRippleCapableSurface.prototype.unbounded;\n/**\n * Whether or not the ripple is attached to a disabled component.\n * @type {boolean|undefined}\n */\n\nRippleCapableSurface.prototype.disabled;\n\n\n//# sourceURL=webpack:///./node_modules/@material/ripple/index.js?");

  /***/ }),

  /***/ "./node_modules/@material/ripple/util.js":
  /*!***********************************************!*\
    !*** ./node_modules/@material/ripple/util.js ***!
    \***********************************************/
  /*! exports provided: supportsCssVariables, applyPassive, getMatchesProperty, getNormalizedEventCoords */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"supportsCssVariables\", function() { return supportsCssVariables; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"applyPassive\", function() { return applyPassive; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getMatchesProperty\", function() { return getMatchesProperty; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getNormalizedEventCoords\", function() { return getNormalizedEventCoords; });\n/**\n * @license\n * Copyright 2016 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n/**\n * Stores result from supportsCssVariables to avoid redundant processing to detect CSS custom variable support.\n * @private {boolean|undefined}\n */\nvar supportsCssVariables_;\n/**\n * Stores result from applyPassive to avoid redundant processing to detect passive event listener support.\n * @private {boolean|undefined}\n */\n\nvar supportsPassive_;\n/**\n * @param {!Window} windowObj\n * @return {boolean}\n */\n\nfunction detectEdgePseudoVarBug(windowObj) {\n  // Detect versions of Edge with buggy var() support\n  // See: https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/11495448/\n  var document = windowObj.document;\n  var node = document.createElement('div');\n  node.className = 'mdc-ripple-surface--test-edge-var-bug';\n  document.body.appendChild(node); // The bug exists if ::before style ends up propagating to the parent element.\n  // Additionally, getComputedStyle returns null in iframes with display: \"none\" in Firefox,\n  // but Firefox is known to support CSS custom properties correctly.\n  // See: https://bugzilla.mozilla.org/show_bug.cgi?id=548397\n\n  var computedStyle = windowObj.getComputedStyle(node);\n  var hasPseudoVarBug = computedStyle !== null && computedStyle.borderTopStyle === 'solid';\n  node.remove();\n  return hasPseudoVarBug;\n}\n/**\n * @param {!Window} windowObj\n * @param {boolean=} forceRefresh\n * @return {boolean|undefined}\n */\n\n\nfunction supportsCssVariables(windowObj) {\n  var forceRefresh = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;\n  var supportsCssVariables = supportsCssVariables_;\n\n  if (typeof supportsCssVariables_ === 'boolean' && !forceRefresh) {\n    return supportsCssVariables;\n  }\n\n  var supportsFunctionPresent = windowObj.CSS && typeof windowObj.CSS.supports === 'function';\n\n  if (!supportsFunctionPresent) {\n    return;\n  }\n\n  var explicitlySupportsCssVars = windowObj.CSS.supports('--css-vars', 'yes'); // See: https://bugs.webkit.org/show_bug.cgi?id=154669\n  // See: README section on Safari\n\n  var weAreFeatureDetectingSafari10plus = windowObj.CSS.supports('(--css-vars: yes)') && windowObj.CSS.supports('color', '#00000000');\n\n  if (explicitlySupportsCssVars || weAreFeatureDetectingSafari10plus) {\n    supportsCssVariables = !detectEdgePseudoVarBug(windowObj);\n  } else {\n    supportsCssVariables = false;\n  }\n\n  if (!forceRefresh) {\n    supportsCssVariables_ = supportsCssVariables;\n  }\n\n  return supportsCssVariables;\n} //\n\n/**\n * Determine whether the current browser supports passive event listeners, and if so, use them.\n * @param {!Window=} globalObj\n * @param {boolean=} forceRefresh\n * @return {boolean|{passive: boolean}}\n */\n\n\nfunction applyPassive() {\n  var globalObj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;\n  var forceRefresh = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;\n\n  if (supportsPassive_ === undefined || forceRefresh) {\n    var isSupported = false;\n\n    try {\n      globalObj.document.addEventListener('test', null, {\n        get passive() {\n          isSupported = true;\n        }\n\n      });\n    } catch (e) {}\n\n    supportsPassive_ = isSupported;\n  }\n\n  return supportsPassive_ ? {\n    passive: true\n  } : false;\n}\n/**\n * @param {!Object} HTMLElementPrototype\n * @return {!Array<string>}\n */\n\n\nfunction getMatchesProperty(HTMLElementPrototype) {\n  return ['webkitMatchesSelector', 'msMatchesSelector', 'matches'].filter(function (p) {\n    return p in HTMLElementPrototype;\n  }).pop();\n}\n/**\n * @param {!Event} ev\n * @param {{x: number, y: number}} pageOffset\n * @param {!ClientRect} clientRect\n * @return {{x: number, y: number}}\n */\n\n\nfunction getNormalizedEventCoords(ev, pageOffset, clientRect) {\n  var x = pageOffset.x,\n      y = pageOffset.y;\n  var documentX = x + clientRect.left;\n  var documentY = y + clientRect.top;\n  var normalizedX;\n  var normalizedY; // Determine touch point relative to the ripple container.\n\n  if (ev.type === 'touchstart') {\n    normalizedX = ev.changedTouches[0].pageX - documentX;\n    normalizedY = ev.changedTouches[0].pageY - documentY;\n  } else {\n    normalizedX = ev.pageX - documentX;\n    normalizedY = ev.pageY - documentY;\n  }\n\n  return {\n    x: normalizedX,\n    y: normalizedY\n  };\n}\n\n\n\n//# sourceURL=webpack:///./node_modules/@material/ripple/util.js?");

  /***/ }),

  /***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./components/button/Button.vue?vue&type=script&lang=js":
  /*!********************************************************************************************************************************************************!*\
    !*** ./node_modules/babel-loader/lib??ref--1!./node_modules/vue-loader/lib??vue-loader-options!./components/button/Button.vue?vue&type=script&lang=js ***!
    \********************************************************************************************************************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _material_ripple__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @material/ripple */ \"./node_modules/@material/ripple/index.js\");\n/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../base */ \"./components/base/index.js\");\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  mixins: [_base__WEBPACK_IMPORTED_MODULE_1__[\"baseComponentMixin\"], _base__WEBPACK_IMPORTED_MODULE_1__[\"themeClassMixin\"]],\n  props: {\n    raised: {\n      type: Boolean,\n      default: false\n    },\n    unelevated: {\n      type: Boolean,\n      default: false\n    },\n    outlined: {\n      type: Boolean,\n      default: false\n    },\n    dense: {\n      type: Boolean,\n      default: false\n    },\n    href: {\n      type: String,\n      default: ''\n    }\n  },\n  data: function data() {\n    return {\n      mdcRipple: undefined,\n      slotObserver: undefined\n    };\n  },\n  computed: {\n    classes: function classes() {\n      return {\n        'mdc-button--raised': this.raised,\n        'mdc-button--unelevated': this.unelevated,\n        'mdc-button--outlined': this.outlined,\n        'mdc-button--dense': this.dense\n      };\n    }\n  },\n  watch: {\n    classes: function classes() {\n      this.mdcRipple.destroy();\n      this.mdcRipple = _material_ripple__WEBPACK_IMPORTED_MODULE_0__[\"MDCRipple\"].attachTo(this.$el);\n    }\n  },\n  mounted: function mounted() {\n    var _this = this;\n\n    this.updateSlot();\n    this.slotObserver = new MutationObserver(function () {\n      return _this.updateSlot();\n    });\n    this.slotObserver.observe(this.$el, {\n      childList: true,\n      subtree: true\n    });\n    this.mdcRipple = _material_ripple__WEBPACK_IMPORTED_MODULE_0__[\"MDCRipple\"].attachTo(this.$el);\n  },\n  beforeDestroy: function beforeDestroy() {\n    this.slotObserver.disconnect();\n\n    if (typeof this.mdcRipple !== 'undefined') {\n      this.mdcRipple.destroy();\n    }\n  },\n  methods: {\n    updateSlot: function updateSlot() {\n      if (this.$slots.icon) {\n        this.$slots.icon.map(function (n) {\n          n.elm.classList.add('mdc-button__icon');\n          n.elm.setAttribute('aria-hidden', 'true');\n        });\n      }\n    }\n  }\n});\n\n//# sourceURL=webpack:///./components/button/Button.vue?./node_modules/babel-loader/lib??ref--1!./node_modules/vue-loader/lib??vue-loader-options");

  /***/ }),

  /***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./components/button/Button.vue?vue&type=template&id=6bba9fb8":
  /*!**************************************************************************************************************************************************************************************************!*\
    !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./components/button/Button.vue?vue&type=template&id=6bba9fb8 ***!
    \**************************************************************************************************************************************************************************************************/
  /*! exports provided: render, staticRenderFns */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return staticRenderFns; });\nvar render = function() {\n  var _vm = this\n  var _h = _vm.$createElement\n  var _c = _vm._self._c || _h\n  return _vm.href\n    ? _c(\n        \"a\",\n        _vm._g(\n          _vm._b(\n            {\n              staticClass: \"mdc-button\",\n              class: _vm.classes,\n              attrs: { href: _vm.href, role: \"button\" }\n            },\n            \"a\",\n            _vm.$attrs,\n            false\n          ),\n          _vm.$listeners\n        ),\n        [_vm._t(\"icon\"), _vm._v(\" \"), _vm._t(\"default\")],\n        2\n      )\n    : _c(\n        \"button\",\n        _vm._g(\n          _vm._b(\n            { staticClass: \"mdc-button\", class: _vm.classes },\n            \"button\",\n            _vm.$attrs,\n            false\n          ),\n          _vm.$listeners\n        ),\n        [_vm._t(\"icon\"), _vm._v(\" \"), _vm._t(\"default\")],\n        2\n      )\n}\nvar staticRenderFns = []\nrender._withStripped = true\n\n\n\n//# sourceURL=webpack:///./components/button/Button.vue?./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options");

  /***/ }),

  /***/ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js":
  /*!********************************************************************!*\
    !*** ./node_modules/vue-loader/lib/runtime/componentNormalizer.js ***!
    \********************************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return normalizeComponent; });\n/* globals __VUE_SSR_CONTEXT__ */\n\n// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).\n// This module is a runtime utility for cleaner component module output and will\n// be included in the final webpack user bundle.\n\nfunction normalizeComponent (\n  scriptExports,\n  render,\n  staticRenderFns,\n  functionalTemplate,\n  injectStyles,\n  scopeId,\n  moduleIdentifier, /* server only */\n  shadowMode /* vue-cli only */\n) {\n  // Vue.extend constructor export interop\n  var options = typeof scriptExports === 'function'\n    ? scriptExports.options\n    : scriptExports\n\n  // render functions\n  if (render) {\n    options.render = render\n    options.staticRenderFns = staticRenderFns\n    options._compiled = true\n  }\n\n  // functional template\n  if (functionalTemplate) {\n    options.functional = true\n  }\n\n  // scopedId\n  if (scopeId) {\n    options._scopeId = 'data-v-' + scopeId\n  }\n\n  var hook\n  if (moduleIdentifier) { // server build\n    hook = function (context) {\n      // 2.3 injection\n      context =\n        context || // cached call\n        (this.$vnode && this.$vnode.ssrContext) || // stateful\n        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional\n      // 2.2 with runInNewContext: true\n      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {\n        context = __VUE_SSR_CONTEXT__\n      }\n      // inject component styles\n      if (injectStyles) {\n        injectStyles.call(this, context)\n      }\n      // register component module identifier for async chunk inferrence\n      if (context && context._registeredComponents) {\n        context._registeredComponents.add(moduleIdentifier)\n      }\n    }\n    // used by ssr in case component is cached and beforeCreate\n    // never gets called\n    options._ssrRegister = hook\n  } else if (injectStyles) {\n    hook = shadowMode\n      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }\n      : injectStyles\n  }\n\n  if (hook) {\n    if (options.functional) {\n      // for template-only hot-reload because in that case the render fn doesn't\n      // go through the normalizer\n      options._injectStyles = hook\n      // register for functioal component in vue file\n      var originalRender = options.render\n      options.render = function renderWithStyleInjection (h, context) {\n        hook.call(context)\n        return originalRender(h, context)\n      }\n    } else {\n      // inject component registration as beforeCreate hook\n      var existing = options.beforeCreate\n      options.beforeCreate = existing\n        ? [].concat(existing, hook)\n        : [hook]\n    }\n  }\n\n  return {\n    exports: scriptExports,\n    options: options\n  }\n}\n\n\n//# sourceURL=webpack:///./node_modules/vue-loader/lib/runtime/componentNormalizer.js?");

  /***/ })

  /******/ });
  });
  });

  var Button = unwrapExports(button);

  var textfield = createCommonjsModule(function (module, exports) {
  (function webpackUniversalModuleDefinition(root, factory) {
  	module.exports = factory();
  })(window, function() {
  return /******/ (function(modules) { // webpackBootstrap
  /******/ 	// The module cache
  /******/ 	var installedModules = {};
  /******/
  /******/ 	// The require function
  /******/ 	function __webpack_require__(moduleId) {
  /******/
  /******/ 		// Check if module is in cache
  /******/ 		if(installedModules[moduleId]) {
  /******/ 			return installedModules[moduleId].exports;
  /******/ 		}
  /******/ 		// Create a new module (and put it into the cache)
  /******/ 		var module = installedModules[moduleId] = {
  /******/ 			i: moduleId,
  /******/ 			l: false,
  /******/ 			exports: {}
  /******/ 		};
  /******/
  /******/ 		// Execute the module function
  /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
  /******/
  /******/ 		// Flag the module as loaded
  /******/ 		module.l = true;
  /******/
  /******/ 		// Return the exports of the module
  /******/ 		return module.exports;
  /******/ 	}
  /******/
  /******/
  /******/ 	// expose the modules object (__webpack_modules__)
  /******/ 	__webpack_require__.m = modules;
  /******/
  /******/ 	// expose the module cache
  /******/ 	__webpack_require__.c = installedModules;
  /******/
  /******/ 	// define getter function for harmony exports
  /******/ 	__webpack_require__.d = function(exports, name, getter) {
  /******/ 		if(!__webpack_require__.o(exports, name)) {
  /******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
  /******/ 		}
  /******/ 	};
  /******/
  /******/ 	// define __esModule on exports
  /******/ 	__webpack_require__.r = function(exports) {
  /******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
  /******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
  /******/ 		}
  /******/ 		Object.defineProperty(exports, '__esModule', { value: true });
  /******/ 	};
  /******/
  /******/ 	// create a fake namespace object
  /******/ 	// mode & 1: value is a module id, require it
  /******/ 	// mode & 2: merge all properties of value into the ns
  /******/ 	// mode & 4: return value when already ns object
  /******/ 	// mode & 8|1: behave like require
  /******/ 	__webpack_require__.t = function(value, mode) {
  /******/ 		if(mode & 1) value = __webpack_require__(value);
  /******/ 		if(mode & 8) return value;
  /******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
  /******/ 		var ns = Object.create(null);
  /******/ 		__webpack_require__.r(ns);
  /******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
  /******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
  /******/ 		return ns;
  /******/ 	};
  /******/
  /******/ 	// getDefaultExport function for compatibility with non-harmony modules
  /******/ 	__webpack_require__.n = function(module) {
  /******/ 		var getter = module && module.__esModule ?
  /******/ 			function getDefault() { return module['default']; } :
  /******/ 			function getModuleExports() { return module; };
  /******/ 		__webpack_require__.d(getter, 'a', getter);
  /******/ 		return getter;
  /******/ 	};
  /******/
  /******/ 	// Object.prototype.hasOwnProperty.call
  /******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
  /******/
  /******/ 	// __webpack_public_path__
  /******/ 	__webpack_require__.p = "";
  /******/
  /******/
  /******/ 	// Load entry module and return exports
  /******/ 	return __webpack_require__(__webpack_require__.s = "./components/textfield/index.js");
  /******/ })
  /************************************************************************/
  /******/ ({

  /***/ "./components/base/baseComponentMixin.js":
  /*!***********************************************!*\
    !*** ./components/base/baseComponentMixin.js ***!
    \***********************************************/
  /*! exports provided: baseComponentMixin */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"baseComponentMixin\", function() { return baseComponentMixin; });\nvar baseComponentMixin = {\n  inheritAttrs: false\n};\n\n//# sourceURL=webpack:///./components/base/baseComponentMixin.js?");

  /***/ }),

  /***/ "./components/base/index.js":
  /*!**********************************!*\
    !*** ./components/base/index.js ***!
    \**********************************/
  /*! exports provided: baseComponentMixin, themeClassMixin */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _baseComponentMixin_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./baseComponentMixin.js */ \"./components/base/baseComponentMixin.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"baseComponentMixin\", function() { return _baseComponentMixin_js__WEBPACK_IMPORTED_MODULE_0__[\"baseComponentMixin\"]; });\n\n/* harmony import */ var _themeClassMixin_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./themeClassMixin.js */ \"./components/base/themeClassMixin.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"themeClassMixin\", function() { return _themeClassMixin_js__WEBPACK_IMPORTED_MODULE_1__[\"themeClassMixin\"]; });\n\n\n\n\n//# sourceURL=webpack:///./components/base/index.js?");

  /***/ }),

  /***/ "./components/base/themeClassMixin.js":
  /*!********************************************!*\
    !*** ./components/base/themeClassMixin.js ***!
    \********************************************/
  /*! exports provided: themeClassMixin */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"themeClassMixin\", function() { return themeClassMixin; });\nvar themeProps = ['primary', 'secondary', 'background', 'surface', 'on-primary', 'on-secondary', 'on-surface', 'primary-bg', 'secondary-bg', 'text-primary-on-light', 'text-secondary-on-light', 'text-hint-on-light', 'text-disabled-on-light', 'text-icon-on-light', 'text-primary-on-dark', 'text-secondary-on-dark', 'text-hint-on-dark', 'text-disabled-on-dark', 'text-icon-on-dark'];\nvar themeClassMixin = {\n  props: {\n    theming: {\n      type: String,\n      default: ''\n    }\n  },\n  mounted: function mounted() {\n    if (themeProps.indexOf(this.theming) > -1) {\n      this.$el.classList.add('mdc-theme--' + this.theming);\n    }\n  }\n};\n\n//# sourceURL=webpack:///./components/base/themeClassMixin.js?");

  /***/ }),

  /***/ "./components/debounce.js":
  /*!********************************!*\
    !*** ./components/debounce.js ***!
    \********************************/
  /*! exports provided: debounce */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"debounce\", function() { return debounce; });\nfunction debounce(fn, debounceDuration) {\n  debounceDuration = debounceDuration || 100;\n  return function () {\n    if (!fn.debouncing) {\n      var args = Array.prototype.slice.apply(arguments);\n      fn.lastReturnVal = fn.apply(window, args);\n      fn.debouncing = true;\n    }\n\n    clearTimeout(fn.debounceTimeout);\n    fn.debounceTimeout = setTimeout(function () {\n      fn.debouncing = false;\n    }, debounceDuration);\n    return fn.lastReturnVal;\n  };\n}\n\n//# sourceURL=webpack:///./components/debounce.js?");

  /***/ }),

  /***/ "./components/index.js":
  /*!*****************************!*\
    !*** ./components/index.js ***!
    \*****************************/
  /*! exports provided: debounce, initPlugin */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _debounce_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./debounce.js */ \"./components/debounce.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"debounce\", function() { return _debounce_js__WEBPACK_IMPORTED_MODULE_0__[\"debounce\"]; });\n\n/* harmony import */ var _initPlugin_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./initPlugin.js */ \"./components/initPlugin.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"initPlugin\", function() { return _initPlugin_js__WEBPACK_IMPORTED_MODULE_1__[\"initPlugin\"]; });\n\n\n\n\n//# sourceURL=webpack:///./components/index.js?");

  /***/ }),

  /***/ "./components/initPlugin.js":
  /*!**********************************!*\
    !*** ./components/initPlugin.js ***!
    \**********************************/
  /*! exports provided: initPlugin */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"initPlugin\", function() { return initPlugin; });\nfunction initPlugin(plugin) {\n  if (typeof window !== 'undefined' && window.Vue) {\n    window.Vue.use(plugin);\n  }\n}\n\n//# sourceURL=webpack:///./components/initPlugin.js?");

  /***/ }),

  /***/ "./components/textfield/Textfield.vue":
  /*!********************************************!*\
    !*** ./components/textfield/Textfield.vue ***!
    \********************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Textfield_vue_vue_type_template_id_1997cfc0__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Textfield.vue?vue&type=template&id=1997cfc0 */ \"./components/textfield/Textfield.vue?vue&type=template&id=1997cfc0\");\n/* harmony import */ var _Textfield_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Textfield.vue?vue&type=script&lang=js */ \"./components/textfield/Textfield.vue?vue&type=script&lang=js\");\n/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ \"./node_modules/vue-loader/lib/runtime/componentNormalizer.js\");\n\n\n\n\n\n/* normalize component */\n\nvar component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(\n  _Textfield_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  _Textfield_vue_vue_type_template_id_1997cfc0__WEBPACK_IMPORTED_MODULE_0__[\"render\"],\n  _Textfield_vue_vue_type_template_id_1997cfc0__WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"],\n  false,\n  null,\n  null,\n  null\n  \n)\n\n/* hot reload */\nif (false) { var api; }\ncomponent.options.__file = \"components/textfield/Textfield.vue\"\n/* harmony default export */ __webpack_exports__[\"default\"] = (component.exports);\n\n//# sourceURL=webpack:///./components/textfield/Textfield.vue?");

  /***/ }),

  /***/ "./components/textfield/Textfield.vue?vue&type=script&lang=js":
  /*!********************************************************************!*\
    !*** ./components/textfield/Textfield.vue?vue&type=script&lang=js ***!
    \********************************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_1_node_modules_vue_loader_lib_index_js_vue_loader_options_Textfield_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib??ref--1!../../node_modules/vue-loader/lib??vue-loader-options!./Textfield.vue?vue&type=script&lang=js */ \"./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./components/textfield/Textfield.vue?vue&type=script&lang=js\");\n/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__[\"default\"] = (_node_modules_babel_loader_lib_index_js_ref_1_node_modules_vue_loader_lib_index_js_vue_loader_options_Textfield_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]); \n\n//# sourceURL=webpack:///./components/textfield/Textfield.vue?");

  /***/ }),

  /***/ "./components/textfield/Textfield.vue?vue&type=template&id=1997cfc0":
  /*!**************************************************************************!*\
    !*** ./components/textfield/Textfield.vue?vue&type=template&id=1997cfc0 ***!
    \**************************************************************************/
  /*! exports provided: render, staticRenderFns */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Textfield_vue_vue_type_template_id_1997cfc0__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib??vue-loader-options!./Textfield.vue?vue&type=template&id=1997cfc0 */ \"./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./components/textfield/Textfield.vue?vue&type=template&id=1997cfc0\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Textfield_vue_vue_type_template_id_1997cfc0__WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Textfield_vue_vue_type_template_id_1997cfc0__WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"]; });\n\n\n\n//# sourceURL=webpack:///./components/textfield/Textfield.vue?");

  /***/ }),

  /***/ "./components/textfield/TextfieldHelptext.vue":
  /*!****************************************************!*\
    !*** ./components/textfield/TextfieldHelptext.vue ***!
    \****************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _TextfieldHelptext_vue_vue_type_template_id_e6013e64__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TextfieldHelptext.vue?vue&type=template&id=e6013e64 */ \"./components/textfield/TextfieldHelptext.vue?vue&type=template&id=e6013e64\");\n/* harmony import */ var _TextfieldHelptext_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TextfieldHelptext.vue?vue&type=script&lang=js */ \"./components/textfield/TextfieldHelptext.vue?vue&type=script&lang=js\");\n/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ \"./node_modules/vue-loader/lib/runtime/componentNormalizer.js\");\n\n\n\n\n\n/* normalize component */\n\nvar component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(\n  _TextfieldHelptext_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  _TextfieldHelptext_vue_vue_type_template_id_e6013e64__WEBPACK_IMPORTED_MODULE_0__[\"render\"],\n  _TextfieldHelptext_vue_vue_type_template_id_e6013e64__WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"],\n  false,\n  null,\n  null,\n  null\n  \n)\n\n/* hot reload */\nif (false) { var api; }\ncomponent.options.__file = \"components/textfield/TextfieldHelptext.vue\"\n/* harmony default export */ __webpack_exports__[\"default\"] = (component.exports);\n\n//# sourceURL=webpack:///./components/textfield/TextfieldHelptext.vue?");

  /***/ }),

  /***/ "./components/textfield/TextfieldHelptext.vue?vue&type=script&lang=js":
  /*!****************************************************************************!*\
    !*** ./components/textfield/TextfieldHelptext.vue?vue&type=script&lang=js ***!
    \****************************************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_1_node_modules_vue_loader_lib_index_js_vue_loader_options_TextfieldHelptext_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib??ref--1!../../node_modules/vue-loader/lib??vue-loader-options!./TextfieldHelptext.vue?vue&type=script&lang=js */ \"./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./components/textfield/TextfieldHelptext.vue?vue&type=script&lang=js\");\n/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__[\"default\"] = (_node_modules_babel_loader_lib_index_js_ref_1_node_modules_vue_loader_lib_index_js_vue_loader_options_TextfieldHelptext_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]); \n\n//# sourceURL=webpack:///./components/textfield/TextfieldHelptext.vue?");

  /***/ }),

  /***/ "./components/textfield/TextfieldHelptext.vue?vue&type=template&id=e6013e64":
  /*!**********************************************************************************!*\
    !*** ./components/textfield/TextfieldHelptext.vue?vue&type=template&id=e6013e64 ***!
    \**********************************************************************************/
  /*! exports provided: render, staticRenderFns */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TextfieldHelptext_vue_vue_type_template_id_e6013e64__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib??vue-loader-options!./TextfieldHelptext.vue?vue&type=template&id=e6013e64 */ \"./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./components/textfield/TextfieldHelptext.vue?vue&type=template&id=e6013e64\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TextfieldHelptext_vue_vue_type_template_id_e6013e64__WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TextfieldHelptext_vue_vue_type_template_id_e6013e64__WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"]; });\n\n\n\n//# sourceURL=webpack:///./components/textfield/TextfieldHelptext.vue?");

  /***/ }),

  /***/ "./components/textfield/index.js":
  /*!***************************************!*\
    !*** ./components/textfield/index.js ***!
    \***************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Textfield_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Textfield.vue */ \"./components/textfield/Textfield.vue\");\n/* harmony import */ var _TextfieldHelptext_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TextfieldHelptext.vue */ \"./components/textfield/TextfieldHelptext.vue\");\n/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./styles.scss */ \"./components/textfield/styles.scss\");\n/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_styles_scss__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../ */ \"./components/index.js\");\n\n\n\n\nvar plugin = {\n  install: function install(vm) {\n    vm.component('m-textfield', _Textfield_vue__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n    vm.component('m-textfield-helptext', _TextfieldHelptext_vue__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n  }\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = (plugin);\nObject(___WEBPACK_IMPORTED_MODULE_3__[\"initPlugin\"])(plugin);\n\n//# sourceURL=webpack:///./components/textfield/index.js?");

  /***/ }),

  /***/ "./components/textfield/styles.scss":
  /*!******************************************!*\
    !*** ./components/textfield/styles.scss ***!
    \******************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {

  eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./components/textfield/styles.scss?");

  /***/ }),

  /***/ "./node_modules/@material/base/component.js":
  /*!**************************************************!*\
    !*** ./node_modules/@material/base/component.js ***!
    \**************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _foundation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./foundation */ \"./node_modules/@material/base/foundation.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n/**\n * @license\n * Copyright 2016 Google Inc.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *   http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n/**\n * @template F\n */\n\nvar MDCComponent =\n/*#__PURE__*/\nfunction () {\n  _createClass(MDCComponent, null, [{\n    key: \"attachTo\",\n\n    /**\n     * @param {!Element} root\n     * @return {!MDCComponent}\n     */\n    value: function attachTo(root) {\n      // Subclasses which extend MDCBase should provide an attachTo() method that takes a root element and\n      // returns an instantiated component with its root set to that element. Also note that in the cases of\n      // subclasses, an explicit foundation class will not have to be passed in; it will simply be initialized\n      // from getDefaultFoundation().\n      return new MDCComponent(root, new _foundation__WEBPACK_IMPORTED_MODULE_0__[\"default\"]());\n    }\n    /**\n     * @param {!Element} root\n     * @param {F=} foundation\n     * @param {...?} args\n     */\n\n  }]);\n\n  function MDCComponent(root) {\n    var foundation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;\n\n    _classCallCheck(this, MDCComponent);\n\n    /** @protected {!Element} */\n    this.root_ = root;\n\n    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {\n      args[_key - 2] = arguments[_key];\n    }\n\n    this.initialize.apply(this, args); // Note that we initialize foundation here and not within the constructor's default param so that\n    // this.root_ is defined and can be used within the foundation class.\n\n    /** @protected {!F} */\n\n    this.foundation_ = foundation === undefined ? this.getDefaultFoundation() : foundation;\n    this.foundation_.init();\n    this.initialSyncWithDOM();\n  }\n\n  _createClass(MDCComponent, [{\n    key: \"initialize\",\n    value: function initialize()\n    /* ...args */\n    {} // Subclasses can override this to do any additional setup work that would be considered part of a\n    // \"constructor\". Essentially, it is a hook into the parent constructor before the foundation is\n    // initialized. Any additional arguments besides root and foundation will be passed in here.\n\n    /**\n     * @return {!F} foundation\n     */\n\n  }, {\n    key: \"getDefaultFoundation\",\n    value: function getDefaultFoundation() {\n      // Subclasses must override this method to return a properly configured foundation class for the\n      // component.\n      throw new Error('Subclasses must override getDefaultFoundation to return a properly configured ' + 'foundation class');\n    }\n  }, {\n    key: \"initialSyncWithDOM\",\n    value: function initialSyncWithDOM() {// Subclasses should override this method if they need to perform work to synchronize with a host DOM\n      // object. An example of this would be a form control wrapper that needs to synchronize its internal state\n      // to some property or attribute of the host DOM. Please note: this is *not* the place to perform DOM\n      // reads/writes that would cause layout / paint, as this is called synchronously from within the constructor.\n    }\n  }, {\n    key: \"destroy\",\n    value: function destroy() {\n      // Subclasses may implement this method to release any resources / deregister any listeners they have\n      // attached. An example of this might be deregistering a resize event from the window object.\n      this.foundation_.destroy();\n    }\n    /**\n     * Wrapper method to add an event listener to the component's root element. This is most useful when\n     * listening for custom events.\n     * @param {string} evtType\n     * @param {!Function} handler\n     */\n\n  }, {\n    key: \"listen\",\n    value: function listen(evtType, handler) {\n      this.root_.addEventListener(evtType, handler);\n    }\n    /**\n     * Wrapper method to remove an event listener to the component's root element. This is most useful when\n     * unlistening for custom events.\n     * @param {string} evtType\n     * @param {!Function} handler\n     */\n\n  }, {\n    key: \"unlisten\",\n    value: function unlisten(evtType, handler) {\n      this.root_.removeEventListener(evtType, handler);\n    }\n    /**\n     * Fires a cross-browser-compatible custom event from the component root of the given type,\n     * with the given data.\n     * @param {string} evtType\n     * @param {!Object} evtData\n     * @param {boolean=} shouldBubble\n     */\n\n  }, {\n    key: \"emit\",\n    value: function emit(evtType, evtData) {\n      var shouldBubble = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;\n      var evt;\n\n      if (typeof CustomEvent === 'function') {\n        evt = new CustomEvent(evtType, {\n          detail: evtData,\n          bubbles: shouldBubble\n        });\n      } else {\n        evt = document.createEvent('CustomEvent');\n        evt.initCustomEvent(evtType, shouldBubble, false, evtData);\n      }\n\n      this.root_.dispatchEvent(evt);\n    }\n  }]);\n\n  return MDCComponent;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MDCComponent);\n\n//# sourceURL=webpack:///./node_modules/@material/base/component.js?");

  /***/ }),

  /***/ "./node_modules/@material/base/foundation.js":
  /*!***************************************************!*\
    !*** ./node_modules/@material/base/foundation.js ***!
    \***************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n/**\n * @license\n * Copyright 2016 Google Inc.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *   http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n/**\n * @template A\n */\nvar MDCFoundation =\n/*#__PURE__*/\nfunction () {\n  _createClass(MDCFoundation, null, [{\n    key: \"cssClasses\",\n\n    /** @return enum{cssClasses} */\n    get: function get() {\n      // Classes extending MDCFoundation should implement this method to return an object which exports every\n      // CSS class the foundation class needs as a property. e.g. {ACTIVE: 'mdc-component--active'}\n      return {};\n    }\n    /** @return enum{strings} */\n\n  }, {\n    key: \"strings\",\n    get: function get() {\n      // Classes extending MDCFoundation should implement this method to return an object which exports all\n      // semantic strings as constants. e.g. {ARIA_ROLE: 'tablist'}\n      return {};\n    }\n    /** @return enum{numbers} */\n\n  }, {\n    key: \"numbers\",\n    get: function get() {\n      // Classes extending MDCFoundation should implement this method to return an object which exports all\n      // of its semantic numbers as constants. e.g. {ANIMATION_DELAY_MS: 350}\n      return {};\n    }\n    /** @return {!Object} */\n\n  }, {\n    key: \"defaultAdapter\",\n    get: function get() {\n      // Classes extending MDCFoundation may choose to implement this getter in order to provide a convenient\n      // way of viewing the necessary methods of an adapter. In the future, this could also be used for adapter\n      // validation.\n      return {};\n    }\n    /**\n     * @param {A=} adapter\n     */\n\n  }]);\n\n  function MDCFoundation() {\n    var adapter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};\n\n    _classCallCheck(this, MDCFoundation);\n\n    /** @protected {!A} */\n    this.adapter_ = adapter;\n  }\n\n  _createClass(MDCFoundation, [{\n    key: \"init\",\n    value: function init() {// Subclasses should override this method to perform initialization routines (registering events, etc.)\n    }\n  }, {\n    key: \"destroy\",\n    value: function destroy() {// Subclasses should override this method to perform de-initialization routines (de-registering events, etc.)\n    }\n  }]);\n\n  return MDCFoundation;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MDCFoundation);\n\n//# sourceURL=webpack:///./node_modules/@material/base/foundation.js?");

  /***/ }),

  /***/ "./node_modules/@material/floating-label/adapter.js":
  /*!**********************************************************!*\
    !*** ./node_modules/@material/floating-label/adapter.js ***!
    \**********************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n/**\n * @license\n * Copyright 2017 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n/* eslint no-unused-vars: [2, {\"args\": \"none\"}] */\n\n/**\n * Adapter for MDC Floating Label.\n *\n * Defines the shape of the adapter expected by the foundation. Implement this\n * adapter to integrate the floating label into your framework. See\n * https://github.com/material-components/material-components-web/blob/master/docs/authoring-components.md\n * for more information.\n *\n * @record\n */\nvar MDCFloatingLabelAdapter =\n/*#__PURE__*/\nfunction () {\n  function MDCFloatingLabelAdapter() {\n    _classCallCheck(this, MDCFloatingLabelAdapter);\n  }\n\n  _createClass(MDCFloatingLabelAdapter, [{\n    key: \"addClass\",\n\n    /**\n     * Adds a class to the label element.\n     * @param {string} className\n     */\n    value: function addClass(className) {}\n    /**\n     * Removes a class from the label element.\n     * @param {string} className\n     */\n\n  }, {\n    key: \"removeClass\",\n    value: function removeClass(className) {}\n    /**\n     * Returns the width of the label element.\n     * @return {number}\n     */\n\n  }, {\n    key: \"getWidth\",\n    value: function getWidth() {}\n    /**\n     * Registers an event listener on the root element for a given event.\n     * @param {string} evtType\n     * @param {function(!Event): undefined} handler\n     */\n\n  }, {\n    key: \"registerInteractionHandler\",\n    value: function registerInteractionHandler(evtType, handler) {}\n    /**\n     * Deregisters an event listener on the root element for a given event.\n     * @param {string} evtType\n     * @param {function(!Event): undefined} handler\n     */\n\n  }, {\n    key: \"deregisterInteractionHandler\",\n    value: function deregisterInteractionHandler(evtType, handler) {}\n  }]);\n\n  return MDCFloatingLabelAdapter;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MDCFloatingLabelAdapter);\n\n//# sourceURL=webpack:///./node_modules/@material/floating-label/adapter.js?");

  /***/ }),

  /***/ "./node_modules/@material/floating-label/constants.js":
  /*!************************************************************!*\
    !*** ./node_modules/@material/floating-label/constants.js ***!
    \************************************************************/
  /*! exports provided: cssClasses */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"cssClasses\", function() { return cssClasses; });\n/**\n * @license\n * Copyright 2016 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n/** @enum {string} */\nvar cssClasses = {\n  LABEL_FLOAT_ABOVE: 'mdc-floating-label--float-above',\n  LABEL_SHAKE: 'mdc-floating-label--shake'\n};\n\n\n//# sourceURL=webpack:///./node_modules/@material/floating-label/constants.js?");

  /***/ }),

  /***/ "./node_modules/@material/floating-label/foundation.js":
  /*!*************************************************************!*\
    !*** ./node_modules/@material/floating-label/foundation.js ***!
    \*************************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _material_base_foundation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @material/base/foundation */ \"./node_modules/@material/base/foundation.js\");\n/* harmony import */ var _adapter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./adapter */ \"./node_modules/@material/floating-label/adapter.js\");\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ \"./node_modules/@material/floating-label/constants.js\");\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\n/**\n * @license\n * Copyright 2016 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n\n\n/**\n * @extends {MDCFoundation<!MDCFloatingLabelAdapter>}\n * @final\n */\n\nvar MDCFloatingLabelFoundation =\n/*#__PURE__*/\nfunction (_MDCFoundation) {\n  _inherits(MDCFloatingLabelFoundation, _MDCFoundation);\n\n  _createClass(MDCFloatingLabelFoundation, null, [{\n    key: \"cssClasses\",\n\n    /** @return enum {string} */\n    get: function get() {\n      return _constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"];\n    }\n    /**\n     * {@see MDCFloatingLabelAdapter} for typing information on parameters and return\n     * types.\n     * @return {!MDCFloatingLabelAdapter}\n     */\n\n  }, {\n    key: \"defaultAdapter\",\n    get: function get() {\n      return (\n        /** @type {!MDCFloatingLabelAdapter} */\n        {\n          addClass: function addClass() {},\n          removeClass: function removeClass() {},\n          getWidth: function getWidth() {},\n          registerInteractionHandler: function registerInteractionHandler() {},\n          deregisterInteractionHandler: function deregisterInteractionHandler() {}\n        }\n      );\n    }\n    /**\n     * @param {!MDCFloatingLabelAdapter} adapter\n     */\n\n  }]);\n\n  function MDCFloatingLabelFoundation(adapter) {\n    var _this;\n\n    _classCallCheck(this, MDCFloatingLabelFoundation);\n\n    _this = _possibleConstructorReturn(this, _getPrototypeOf(MDCFloatingLabelFoundation).call(this, _extends(MDCFloatingLabelFoundation.defaultAdapter, adapter)));\n    /** @private {function(!Event): undefined} */\n\n    _this.shakeAnimationEndHandler_ = function () {\n      return _this.handleShakeAnimationEnd_();\n    };\n\n    return _this;\n  }\n\n  _createClass(MDCFloatingLabelFoundation, [{\n    key: \"init\",\n    value: function init() {\n      this.adapter_.registerInteractionHandler('animationend', this.shakeAnimationEndHandler_);\n    }\n  }, {\n    key: \"destroy\",\n    value: function destroy() {\n      this.adapter_.deregisterInteractionHandler('animationend', this.shakeAnimationEndHandler_);\n    }\n    /**\n     * Returns the width of the label element.\n     * @return {number}\n     */\n\n  }, {\n    key: \"getWidth\",\n    value: function getWidth() {\n      return this.adapter_.getWidth();\n    }\n    /**\n     * Styles the label to produce the label shake for errors.\n     * @param {boolean} shouldShake adds shake class if true,\n     * otherwise removes shake class.\n     */\n\n  }, {\n    key: \"shake\",\n    value: function shake(shouldShake) {\n      var LABEL_SHAKE = MDCFloatingLabelFoundation.cssClasses.LABEL_SHAKE;\n\n      if (shouldShake) {\n        this.adapter_.addClass(LABEL_SHAKE);\n      } else {\n        this.adapter_.removeClass(LABEL_SHAKE);\n      }\n    }\n    /**\n     * Styles the label to float or dock.\n     * @param {boolean} shouldFloat adds float class if true, otherwise remove\n     * float and shake class to dock label.\n     */\n\n  }, {\n    key: \"float\",\n    value: function float(shouldFloat) {\n      var _MDCFloatingLabelFoun = MDCFloatingLabelFoundation.cssClasses,\n          LABEL_FLOAT_ABOVE = _MDCFloatingLabelFoun.LABEL_FLOAT_ABOVE,\n          LABEL_SHAKE = _MDCFloatingLabelFoun.LABEL_SHAKE;\n\n      if (shouldFloat) {\n        this.adapter_.addClass(LABEL_FLOAT_ABOVE);\n      } else {\n        this.adapter_.removeClass(LABEL_FLOAT_ABOVE);\n        this.adapter_.removeClass(LABEL_SHAKE);\n      }\n    }\n    /**\n     * Handles an interaction event on the root element.\n     */\n\n  }, {\n    key: \"handleShakeAnimationEnd_\",\n    value: function handleShakeAnimationEnd_() {\n      var LABEL_SHAKE = MDCFloatingLabelFoundation.cssClasses.LABEL_SHAKE;\n      this.adapter_.removeClass(LABEL_SHAKE);\n    }\n  }]);\n\n  return MDCFloatingLabelFoundation;\n}(_material_base_foundation__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MDCFloatingLabelFoundation);\n\n//# sourceURL=webpack:///./node_modules/@material/floating-label/foundation.js?");

  /***/ }),

  /***/ "./node_modules/@material/floating-label/index.js":
  /*!********************************************************!*\
    !*** ./node_modules/@material/floating-label/index.js ***!
    \********************************************************/
  /*! exports provided: MDCFloatingLabel, MDCFloatingLabelFoundation */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MDCFloatingLabel\", function() { return MDCFloatingLabel; });\n/* harmony import */ var _material_base_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @material/base/component */ \"./node_modules/@material/base/component.js\");\n/* harmony import */ var _adapter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./adapter */ \"./node_modules/@material/floating-label/adapter.js\");\n/* harmony import */ var _foundation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./foundation */ \"./node_modules/@material/floating-label/foundation.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"MDCFloatingLabelFoundation\", function() { return _foundation__WEBPACK_IMPORTED_MODULE_2__[\"default\"]; });\n\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\n/**\n * @license\n * Copyright 2016 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n\n\n/**\n * @extends {MDCComponent<!MDCFloatingLabelFoundation>}\n * @final\n */\n\nvar MDCFloatingLabel =\n/*#__PURE__*/\nfunction (_MDCComponent) {\n  _inherits(MDCFloatingLabel, _MDCComponent);\n\n  function MDCFloatingLabel() {\n    _classCallCheck(this, MDCFloatingLabel);\n\n    return _possibleConstructorReturn(this, _getPrototypeOf(MDCFloatingLabel).apply(this, arguments));\n  }\n\n  _createClass(MDCFloatingLabel, [{\n    key: \"shake\",\n\n    /**\n     * Styles the label to produce the label shake for errors.\n     * @param {boolean} shouldShake styles the label to shake by adding shake class\n     * if true, otherwise will stop shaking by removing shake class.\n     */\n    value: function shake(shouldShake) {\n      this.foundation_.shake(shouldShake);\n    }\n    /**\n     * Styles label to float/dock.\n     * @param {boolean} shouldFloat styles the label to float by adding float class\n     * if true, otherwise docks the label by removing the float class.\n     */\n\n  }, {\n    key: \"float\",\n    value: function float(shouldFloat) {\n      this.foundation_.float(shouldFloat);\n    }\n    /**\n     * @return {number}\n     */\n\n  }, {\n    key: \"getWidth\",\n    value: function getWidth() {\n      return this.foundation_.getWidth();\n    }\n    /**\n     * @return {!MDCFloatingLabelFoundation}\n     */\n\n  }, {\n    key: \"getDefaultFoundation\",\n    value: function getDefaultFoundation() {\n      var _this = this;\n\n      return new _foundation__WEBPACK_IMPORTED_MODULE_2__[\"default\"]({\n        addClass: function addClass(className) {\n          return _this.root_.classList.add(className);\n        },\n        removeClass: function removeClass(className) {\n          return _this.root_.classList.remove(className);\n        },\n        getWidth: function getWidth() {\n          return _this.root_.offsetWidth;\n        },\n        registerInteractionHandler: function registerInteractionHandler(evtType, handler) {\n          return _this.root_.addEventListener(evtType, handler);\n        },\n        deregisterInteractionHandler: function deregisterInteractionHandler(evtType, handler) {\n          return _this.root_.removeEventListener(evtType, handler);\n        }\n      });\n    }\n  }], [{\n    key: \"attachTo\",\n\n    /**\n     * @param {!Element} root\n     * @return {!MDCFloatingLabel}\n     */\n    value: function attachTo(root) {\n      return new MDCFloatingLabel(root);\n    }\n  }]);\n\n  return MDCFloatingLabel;\n}(_material_base_component__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n\n\n\n//# sourceURL=webpack:///./node_modules/@material/floating-label/index.js?");

  /***/ }),

  /***/ "./node_modules/@material/line-ripple/adapter.js":
  /*!*******************************************************!*\
    !*** ./node_modules/@material/line-ripple/adapter.js ***!
    \*******************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n/**\n * @license\n * Copyright 2018 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n/* eslint no-unused-vars: [2, {\"args\": \"none\"}] */\n\n/**\n * Adapter for MDC TextField Line Ripple.\n *\n * Defines the shape of the adapter expected by the foundation. Implement this\n * adapter to integrate the line ripple into your framework. See\n * https://github.com/material-components/material-components-web/blob/master/docs/authoring-components.md\n * for more information.\n *\n * @record\n */\nvar MDCLineRippleAdapter =\n/*#__PURE__*/\nfunction () {\n  function MDCLineRippleAdapter() {\n    _classCallCheck(this, MDCLineRippleAdapter);\n  }\n\n  _createClass(MDCLineRippleAdapter, [{\n    key: \"addClass\",\n\n    /**\n     * Adds a class to the line ripple element.\n     * @param {string} className\n     */\n    value: function addClass(className) {}\n    /**\n     * Removes a class from the line ripple element.\n     * @param {string} className\n     */\n\n  }, {\n    key: \"removeClass\",\n    value: function removeClass(className) {}\n    /**\n     * @param {string} className\n     * @return {boolean}\n     */\n\n  }, {\n    key: \"hasClass\",\n    value: function hasClass(className) {}\n    /**\n     * Sets the style property with propertyName to value on the root element.\n     * @param {string} propertyName\n     * @param {string} value\n     */\n\n  }, {\n    key: \"setStyle\",\n    value: function setStyle(propertyName, value) {}\n    /**\n     * Registers an event listener on the line ripple element for a given event.\n     * @param {string} evtType\n     * @param {function(!Event): undefined} handler\n     */\n\n  }, {\n    key: \"registerEventHandler\",\n    value: function registerEventHandler(evtType, handler) {}\n    /**\n     * Deregisters an event listener on the line ripple element for a given event.\n     * @param {string} evtType\n     * @param {function(!Event): undefined} handler\n     */\n\n  }, {\n    key: \"deregisterEventHandler\",\n    value: function deregisterEventHandler(evtType, handler) {}\n  }]);\n\n  return MDCLineRippleAdapter;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MDCLineRippleAdapter);\n\n//# sourceURL=webpack:///./node_modules/@material/line-ripple/adapter.js?");

  /***/ }),

  /***/ "./node_modules/@material/line-ripple/constants.js":
  /*!*********************************************************!*\
    !*** ./node_modules/@material/line-ripple/constants.js ***!
    \*********************************************************/
  /*! exports provided: cssClasses */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"cssClasses\", function() { return cssClasses; });\n/**\n * @license\n * Copyright 2018 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n/** @enum {string} */\nvar cssClasses = {\n  LINE_RIPPLE_ACTIVE: 'mdc-line-ripple--active',\n  LINE_RIPPLE_DEACTIVATING: 'mdc-line-ripple--deactivating'\n};\n\n\n//# sourceURL=webpack:///./node_modules/@material/line-ripple/constants.js?");

  /***/ }),

  /***/ "./node_modules/@material/line-ripple/foundation.js":
  /*!**********************************************************!*\
    !*** ./node_modules/@material/line-ripple/foundation.js ***!
    \**********************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _material_base_foundation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @material/base/foundation */ \"./node_modules/@material/base/foundation.js\");\n/* harmony import */ var _adapter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./adapter */ \"./node_modules/@material/line-ripple/adapter.js\");\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ \"./node_modules/@material/line-ripple/constants.js\");\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\n/**\n * @license\n * Copyright 2018 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n\n\n/**\n * @extends {MDCFoundation<!MDCLineRippleAdapter>}\n * @final\n */\n\nvar MDCLineRippleFoundation =\n/*#__PURE__*/\nfunction (_MDCFoundation) {\n  _inherits(MDCLineRippleFoundation, _MDCFoundation);\n\n  _createClass(MDCLineRippleFoundation, null, [{\n    key: \"cssClasses\",\n\n    /** @return enum {string} */\n    get: function get() {\n      return _constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"];\n    }\n    /**\n     * {@see MDCLineRippleAdapter} for typing information on parameters and return\n     * types.\n     * @return {!MDCLineRippleAdapter}\n     */\n\n  }, {\n    key: \"defaultAdapter\",\n    get: function get() {\n      return (\n        /** @type {!MDCLineRippleAdapter} */\n        {\n          addClass: function addClass() {},\n          removeClass: function removeClass() {},\n          hasClass: function hasClass() {},\n          setStyle: function setStyle() {},\n          registerEventHandler: function registerEventHandler() {},\n          deregisterEventHandler: function deregisterEventHandler() {}\n        }\n      );\n    }\n    /**\n     * @param {!MDCLineRippleAdapter=} adapter\n     */\n\n  }]);\n\n  function MDCLineRippleFoundation() {\n    var _this;\n\n    var adapter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] :\n    /** @type {!MDCLineRippleAdapter} */\n    {};\n\n    _classCallCheck(this, MDCLineRippleFoundation);\n\n    _this = _possibleConstructorReturn(this, _getPrototypeOf(MDCLineRippleFoundation).call(this, _extends(MDCLineRippleFoundation.defaultAdapter, adapter)));\n    /** @private {function(!Event): undefined} */\n\n    _this.transitionEndHandler_ = function (evt) {\n      return _this.handleTransitionEnd(evt);\n    };\n\n    return _this;\n  }\n\n  _createClass(MDCLineRippleFoundation, [{\n    key: \"init\",\n    value: function init() {\n      this.adapter_.registerEventHandler('transitionend', this.transitionEndHandler_);\n    }\n  }, {\n    key: \"destroy\",\n    value: function destroy() {\n      this.adapter_.deregisterEventHandler('transitionend', this.transitionEndHandler_);\n    }\n    /**\n     * Activates the line ripple\n     */\n\n  }, {\n    key: \"activate\",\n    value: function activate() {\n      this.adapter_.removeClass(_constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"].LINE_RIPPLE_DEACTIVATING);\n      this.adapter_.addClass(_constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"].LINE_RIPPLE_ACTIVE);\n    }\n    /**\n     * Sets the center of the ripple animation to the given X coordinate.\n     * @param {number} xCoordinate\n     */\n\n  }, {\n    key: \"setRippleCenter\",\n    value: function setRippleCenter(xCoordinate) {\n      this.adapter_.setStyle('transform-origin', \"\".concat(xCoordinate, \"px center\"));\n    }\n    /**\n     * Deactivates the line ripple\n     */\n\n  }, {\n    key: \"deactivate\",\n    value: function deactivate() {\n      this.adapter_.addClass(_constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"].LINE_RIPPLE_DEACTIVATING);\n    }\n    /**\n     * Handles a transition end event\n     * @param {!Event} evt\n     */\n\n  }, {\n    key: \"handleTransitionEnd\",\n    value: function handleTransitionEnd(evt) {\n      // Wait for the line ripple to be either transparent or opaque\n      // before emitting the animation end event\n      var isDeactivating = this.adapter_.hasClass(_constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"].LINE_RIPPLE_DEACTIVATING);\n\n      if (evt.propertyName === 'opacity') {\n        if (isDeactivating) {\n          this.adapter_.removeClass(_constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"].LINE_RIPPLE_ACTIVE);\n          this.adapter_.removeClass(_constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"].LINE_RIPPLE_DEACTIVATING);\n        }\n      }\n    }\n  }]);\n\n  return MDCLineRippleFoundation;\n}(_material_base_foundation__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MDCLineRippleFoundation);\n\n//# sourceURL=webpack:///./node_modules/@material/line-ripple/foundation.js?");

  /***/ }),

  /***/ "./node_modules/@material/line-ripple/index.js":
  /*!*****************************************************!*\
    !*** ./node_modules/@material/line-ripple/index.js ***!
    \*****************************************************/
  /*! exports provided: MDCLineRipple, MDCLineRippleFoundation */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MDCLineRipple\", function() { return MDCLineRipple; });\n/* harmony import */ var _material_base_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @material/base/component */ \"./node_modules/@material/base/component.js\");\n/* harmony import */ var _adapter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./adapter */ \"./node_modules/@material/line-ripple/adapter.js\");\n/* harmony import */ var _foundation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./foundation */ \"./node_modules/@material/line-ripple/foundation.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"MDCLineRippleFoundation\", function() { return _foundation__WEBPACK_IMPORTED_MODULE_2__[\"default\"]; });\n\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\n/**\n * @license\n * Copyright 2018 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n\n\n/**\n * @extends {MDCComponent<!MDCLineRippleFoundation>}\n * @final\n */\n\nvar MDCLineRipple =\n/*#__PURE__*/\nfunction (_MDCComponent) {\n  _inherits(MDCLineRipple, _MDCComponent);\n\n  function MDCLineRipple() {\n    _classCallCheck(this, MDCLineRipple);\n\n    return _possibleConstructorReturn(this, _getPrototypeOf(MDCLineRipple).apply(this, arguments));\n  }\n\n  _createClass(MDCLineRipple, [{\n    key: \"activate\",\n\n    /**\n     * Activates the line ripple\n     */\n    value: function activate() {\n      this.foundation_.activate();\n    }\n    /**\n     * Deactivates the line ripple\n     */\n\n  }, {\n    key: \"deactivate\",\n    value: function deactivate() {\n      this.foundation_.deactivate();\n    }\n    /**\n     * Sets the transform origin given a user's click location. The `rippleCenter` is the\n     * x-coordinate of the middle of the ripple.\n     * @param {number} xCoordinate\n     */\n\n  }, {\n    key: \"setRippleCenter\",\n    value: function setRippleCenter(xCoordinate) {\n      this.foundation_.setRippleCenter(xCoordinate);\n    }\n    /**\n     * @return {!MDCLineRippleFoundation}\n     */\n\n  }, {\n    key: \"getDefaultFoundation\",\n    value: function getDefaultFoundation() {\n      var _this = this;\n\n      return new _foundation__WEBPACK_IMPORTED_MODULE_2__[\"default\"](\n      /** @type {!MDCLineRippleAdapter} */\n      _extends({\n        addClass: function addClass(className) {\n          return _this.root_.classList.add(className);\n        },\n        removeClass: function removeClass(className) {\n          return _this.root_.classList.remove(className);\n        },\n        hasClass: function hasClass(className) {\n          return _this.root_.classList.contains(className);\n        },\n        setStyle: function setStyle(propertyName, value) {\n          return _this.root_.style[propertyName] = value;\n        },\n        registerEventHandler: function registerEventHandler(evtType, handler) {\n          return _this.root_.addEventListener(evtType, handler);\n        },\n        deregisterEventHandler: function deregisterEventHandler(evtType, handler) {\n          return _this.root_.removeEventListener(evtType, handler);\n        }\n      }));\n    }\n  }], [{\n    key: \"attachTo\",\n\n    /**\n     * @param {!Element} root\n     * @return {!MDCLineRipple}\n     */\n    value: function attachTo(root) {\n      return new MDCLineRipple(root);\n    }\n  }]);\n\n  return MDCLineRipple;\n}(_material_base_component__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n\n\n\n//# sourceURL=webpack:///./node_modules/@material/line-ripple/index.js?");

  /***/ }),

  /***/ "./node_modules/@material/notched-outline/adapter.js":
  /*!***********************************************************!*\
    !*** ./node_modules/@material/notched-outline/adapter.js ***!
    \***********************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n/**\n * @license\n * Copyright 2017 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n/* eslint no-unused-vars: [2, {\"args\": \"none\"}] */\n\n/**\n * Adapter for MDC Notched Outline.\n *\n * Defines the shape of the adapter expected by the foundation. Implement this\n * adapter to integrate the Notched Outline into your framework. See\n * https://github.com/material-components/material-components-web/blob/master/docs/authoring-components.md\n * for more information.\n *\n * @record\n */\nvar MDCNotchedOutlineAdapter =\n/*#__PURE__*/\nfunction () {\n  function MDCNotchedOutlineAdapter() {\n    _classCallCheck(this, MDCNotchedOutlineAdapter);\n  }\n\n  _createClass(MDCNotchedOutlineAdapter, [{\n    key: \"getWidth\",\n\n    /**\n     * Returns the width of the root element.\n     * @return {number}\n     */\n    value: function getWidth() {}\n    /**\n     * Returns the height of the root element.\n     * @return {number}\n     */\n\n  }, {\n    key: \"getHeight\",\n    value: function getHeight() {}\n    /**\n     * Adds a class to the root element.\n     * @param {string} className\n     */\n\n  }, {\n    key: \"addClass\",\n    value: function addClass(className) {}\n    /**\n     * Removes a class from the root element.\n     * @param {string} className\n     */\n\n  }, {\n    key: \"removeClass\",\n    value: function removeClass(className) {}\n    /**\n     * Sets the \"d\" attribute of the outline element's SVG path.\n     * @param {string} value\n     */\n\n  }, {\n    key: \"setOutlinePathAttr\",\n    value: function setOutlinePathAttr(value) {}\n    /**\n     * Returns the idle outline element's computed style value of the given css property `propertyName`.\n     * We achieve this via `getComputedStyle(...).getPropertyValue(propertyName)`.\n     * @param {string} propertyName\n     * @return {string}\n     */\n\n  }, {\n    key: \"getIdleOutlineStyleValue\",\n    value: function getIdleOutlineStyleValue(propertyName) {}\n  }]);\n\n  return MDCNotchedOutlineAdapter;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MDCNotchedOutlineAdapter);\n\n//# sourceURL=webpack:///./node_modules/@material/notched-outline/adapter.js?");

  /***/ }),

  /***/ "./node_modules/@material/notched-outline/constants.js":
  /*!*************************************************************!*\
    !*** ./node_modules/@material/notched-outline/constants.js ***!
    \*************************************************************/
  /*! exports provided: cssClasses, strings */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"cssClasses\", function() { return cssClasses; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"strings\", function() { return strings; });\n/**\n * @license\n * Copyright 2018 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n/** @enum {string} */\nvar strings = {\n  PATH_SELECTOR: '.mdc-notched-outline__path',\n  IDLE_OUTLINE_SELECTOR: '.mdc-notched-outline__idle'\n};\n/** @enum {string} */\n\nvar cssClasses = {\n  OUTLINE_NOTCHED: 'mdc-notched-outline--notched'\n};\n\n\n//# sourceURL=webpack:///./node_modules/@material/notched-outline/constants.js?");

  /***/ }),

  /***/ "./node_modules/@material/notched-outline/foundation.js":
  /*!**************************************************************!*\
    !*** ./node_modules/@material/notched-outline/foundation.js ***!
    \**************************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _material_base_foundation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @material/base/foundation */ \"./node_modules/@material/base/foundation.js\");\n/* harmony import */ var _adapter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./adapter */ \"./node_modules/@material/notched-outline/adapter.js\");\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ \"./node_modules/@material/notched-outline/constants.js\");\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\n/**\n * @license\n * Copyright 2017 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n\n\n/**\n * @extends {MDCFoundation<!MDCNotchedOutlineAdapter>}\n * @final\n */\n\nvar MDCNotchedOutlineFoundation =\n/*#__PURE__*/\nfunction (_MDCFoundation) {\n  _inherits(MDCNotchedOutlineFoundation, _MDCFoundation);\n\n  _createClass(MDCNotchedOutlineFoundation, null, [{\n    key: \"strings\",\n\n    /** @return enum {string} */\n    get: function get() {\n      return _constants__WEBPACK_IMPORTED_MODULE_2__[\"strings\"];\n    }\n    /** @return enum {string} */\n\n  }, {\n    key: \"cssClasses\",\n    get: function get() {\n      return _constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"];\n    }\n    /**\n     * {@see MDCNotchedOutlineAdapter} for typing information on parameters and return\n     * types.\n     * @return {!MDCNotchedOutlineAdapter}\n     */\n\n  }, {\n    key: \"defaultAdapter\",\n    get: function get() {\n      return (\n        /** @type {!MDCNotchedOutlineAdapter} */\n        {\n          getWidth: function getWidth() {},\n          getHeight: function getHeight() {},\n          addClass: function addClass() {},\n          removeClass: function removeClass() {},\n          setOutlinePathAttr: function setOutlinePathAttr() {},\n          getIdleOutlineStyleValue: function getIdleOutlineStyleValue() {}\n        }\n      );\n    }\n    /**\n     * @param {!MDCNotchedOutlineAdapter} adapter\n     */\n\n  }]);\n\n  function MDCNotchedOutlineFoundation(adapter) {\n    _classCallCheck(this, MDCNotchedOutlineFoundation);\n\n    return _possibleConstructorReturn(this, _getPrototypeOf(MDCNotchedOutlineFoundation).call(this, _extends(MDCNotchedOutlineFoundation.defaultAdapter, adapter)));\n  }\n  /**\n   * Adds the outline notched selector and updates the notch width\n   * calculated based off of notchWidth and isRtl.\n   * @param {number} notchWidth\n   * @param {boolean=} isRtl\n   */\n\n\n  _createClass(MDCNotchedOutlineFoundation, [{\n    key: \"notch\",\n    value: function notch(notchWidth) {\n      var isRtl = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;\n      var OUTLINE_NOTCHED = MDCNotchedOutlineFoundation.cssClasses.OUTLINE_NOTCHED;\n      this.adapter_.addClass(OUTLINE_NOTCHED);\n      this.updateSvgPath_(notchWidth, isRtl);\n    }\n    /**\n     * Removes notched outline selector to close the notch in the outline.\n     */\n\n  }, {\n    key: \"closeNotch\",\n    value: function closeNotch() {\n      var OUTLINE_NOTCHED = MDCNotchedOutlineFoundation.cssClasses.OUTLINE_NOTCHED;\n      this.adapter_.removeClass(OUTLINE_NOTCHED);\n    }\n    /**\n     * Updates the SVG path of the focus outline element based on the notchWidth\n     * and the RTL context.\n     * @param {number} notchWidth\n     * @param {boolean=} isRtl\n     * @private\n     */\n\n  }, {\n    key: \"updateSvgPath_\",\n    value: function updateSvgPath_(notchWidth, isRtl) {\n      // Fall back to reading a specific corner's style because Firefox doesn't report the style on border-radius.\n      var radiusStyleValue = this.adapter_.getIdleOutlineStyleValue('border-radius') || this.adapter_.getIdleOutlineStyleValue('border-top-left-radius');\n      var radius = parseFloat(radiusStyleValue);\n      var width = this.adapter_.getWidth();\n      var height = this.adapter_.getHeight();\n      var cornerWidth = radius + 1.2;\n      var leadingStrokeLength = Math.abs(11 - cornerWidth);\n      var paddedNotchWidth = notchWidth + 8; // The right, bottom, and left sides of the outline follow the same SVG path.\n\n      var pathMiddle = 'a' + radius + ',' + radius + ' 0 0 1 ' + radius + ',' + radius + 'v' + (height - 2 * cornerWidth) + 'a' + radius + ',' + radius + ' 0 0 1 ' + -radius + ',' + radius + 'h' + (-width + 2 * cornerWidth) + 'a' + radius + ',' + radius + ' 0 0 1 ' + -radius + ',' + -radius + 'v' + (-height + 2 * cornerWidth) + 'a' + radius + ',' + radius + ' 0 0 1 ' + radius + ',' + -radius;\n      var path;\n\n      if (!isRtl) {\n        path = 'M' + (cornerWidth + leadingStrokeLength + paddedNotchWidth) + ',' + 1 + 'h' + (width - 2 * cornerWidth - paddedNotchWidth - leadingStrokeLength) + pathMiddle + 'h' + leadingStrokeLength;\n      } else {\n        path = 'M' + (width - cornerWidth - leadingStrokeLength) + ',' + 1 + 'h' + leadingStrokeLength + pathMiddle + 'h' + (width - 2 * cornerWidth - paddedNotchWidth - leadingStrokeLength);\n      }\n\n      this.adapter_.setOutlinePathAttr(path);\n    }\n  }]);\n\n  return MDCNotchedOutlineFoundation;\n}(_material_base_foundation__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MDCNotchedOutlineFoundation);\n\n//# sourceURL=webpack:///./node_modules/@material/notched-outline/foundation.js?");

  /***/ }),

  /***/ "./node_modules/@material/notched-outline/index.js":
  /*!*********************************************************!*\
    !*** ./node_modules/@material/notched-outline/index.js ***!
    \*********************************************************/
  /*! exports provided: MDCNotchedOutline, MDCNotchedOutlineFoundation */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MDCNotchedOutline\", function() { return MDCNotchedOutline; });\n/* harmony import */ var _material_base_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @material/base/component */ \"./node_modules/@material/base/component.js\");\n/* harmony import */ var _adapter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./adapter */ \"./node_modules/@material/notched-outline/adapter.js\");\n/* harmony import */ var _foundation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./foundation */ \"./node_modules/@material/notched-outline/foundation.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"MDCNotchedOutlineFoundation\", function() { return _foundation__WEBPACK_IMPORTED_MODULE_2__[\"default\"]; });\n\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constants */ \"./node_modules/@material/notched-outline/constants.js\");\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\n/**\n * @license\n * Copyright 2017 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n\n\n\n/**\n * @extends {MDCComponent<!MDCNotchedOutlineFoundation>}\n * @final\n */\n\nvar MDCNotchedOutline =\n/*#__PURE__*/\nfunction (_MDCComponent) {\n  _inherits(MDCNotchedOutline, _MDCComponent);\n\n  function MDCNotchedOutline() {\n    _classCallCheck(this, MDCNotchedOutline);\n\n    return _possibleConstructorReturn(this, _getPrototypeOf(MDCNotchedOutline).apply(this, arguments));\n  }\n\n  _createClass(MDCNotchedOutline, [{\n    key: \"notch\",\n\n    /**\n      * Updates outline selectors and SVG path to open notch.\n      * @param {number} notchWidth The notch width in the outline.\n      * @param {boolean=} isRtl Determines if outline is rtl. If rtl is true, notch\n      * will be right justified in outline path, otherwise left justified.\n      */\n    value: function notch(notchWidth, isRtl) {\n      this.foundation_.notch(notchWidth, isRtl);\n    }\n    /**\n     * Updates the outline selectors to close notch and return it to idle state.\n     */\n\n  }, {\n    key: \"closeNotch\",\n    value: function closeNotch() {\n      this.foundation_.closeNotch();\n    }\n    /**\n     * @return {!MDCNotchedOutlineFoundation}\n     */\n\n  }, {\n    key: \"getDefaultFoundation\",\n    value: function getDefaultFoundation() {\n      var _this = this;\n\n      return new _foundation__WEBPACK_IMPORTED_MODULE_2__[\"default\"]({\n        getWidth: function getWidth() {\n          return _this.root_.offsetWidth;\n        },\n        getHeight: function getHeight() {\n          return _this.root_.offsetHeight;\n        },\n        addClass: function addClass(className) {\n          return _this.root_.classList.add(className);\n        },\n        removeClass: function removeClass(className) {\n          return _this.root_.classList.remove(className);\n        },\n        setOutlinePathAttr: function setOutlinePathAttr(value) {\n          var path = _this.root_.querySelector(_constants__WEBPACK_IMPORTED_MODULE_3__[\"strings\"].PATH_SELECTOR);\n\n          path.setAttribute('d', value);\n        },\n        getIdleOutlineStyleValue: function getIdleOutlineStyleValue(propertyName) {\n          var idleOutlineElement = _this.root_.parentNode.querySelector(_constants__WEBPACK_IMPORTED_MODULE_3__[\"strings\"].IDLE_OUTLINE_SELECTOR);\n\n          return window.getComputedStyle(idleOutlineElement).getPropertyValue(propertyName);\n        }\n      });\n    }\n  }], [{\n    key: \"attachTo\",\n\n    /**\n     * @param {!Element} root\n     * @return {!MDCNotchedOutline}\n     */\n    value: function attachTo(root) {\n      return new MDCNotchedOutline(root);\n    }\n  }]);\n\n  return MDCNotchedOutline;\n}(_material_base_component__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n\n\n\n//# sourceURL=webpack:///./node_modules/@material/notched-outline/index.js?");

  /***/ }),

  /***/ "./node_modules/@material/ripple/adapter.js":
  /*!**************************************************!*\
    !*** ./node_modules/@material/ripple/adapter.js ***!
    \**************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n/**\n * @license\n * Copyright 2016 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n/* eslint no-unused-vars: [2, {\"args\": \"none\"}] */\n\n/**\n * Adapter for MDC Ripple. Provides an interface for managing\n * - classes\n * - dom\n * - CSS variables\n * - position\n * - dimensions\n * - scroll position\n * - event handlers\n * - unbounded, active and disabled states\n *\n * Additionally, provides type information for the adapter to the Closure\n * compiler.\n *\n * Implement this adapter for your framework of choice to delegate updates to\n * the component in your framework of choice. See architecture documentation\n * for more details.\n * https://github.com/material-components/material-components-web/blob/master/docs/code/architecture.md\n *\n * @record\n */\nvar MDCRippleAdapter =\n/*#__PURE__*/\nfunction () {\n  function MDCRippleAdapter() {\n    _classCallCheck(this, MDCRippleAdapter);\n  }\n\n  _createClass(MDCRippleAdapter, [{\n    key: \"browserSupportsCssVars\",\n\n    /** @return {boolean} */\n    value: function browserSupportsCssVars() {}\n    /** @return {boolean} */\n\n  }, {\n    key: \"isUnbounded\",\n    value: function isUnbounded() {}\n    /** @return {boolean} */\n\n  }, {\n    key: \"isSurfaceActive\",\n    value: function isSurfaceActive() {}\n    /** @return {boolean} */\n\n  }, {\n    key: \"isSurfaceDisabled\",\n    value: function isSurfaceDisabled() {}\n    /** @param {string} className */\n\n  }, {\n    key: \"addClass\",\n    value: function addClass(className) {}\n    /** @param {string} className */\n\n  }, {\n    key: \"removeClass\",\n    value: function removeClass(className) {}\n    /** @param {!EventTarget} target */\n\n  }, {\n    key: \"containsEventTarget\",\n    value: function containsEventTarget(target) {}\n    /**\n     * @param {string} evtType\n     * @param {!Function} handler\n     */\n\n  }, {\n    key: \"registerInteractionHandler\",\n    value: function registerInteractionHandler(evtType, handler) {}\n    /**\n     * @param {string} evtType\n     * @param {!Function} handler\n     */\n\n  }, {\n    key: \"deregisterInteractionHandler\",\n    value: function deregisterInteractionHandler(evtType, handler) {}\n    /**\n     * @param {string} evtType\n     * @param {!Function} handler\n     */\n\n  }, {\n    key: \"registerDocumentInteractionHandler\",\n    value: function registerDocumentInteractionHandler(evtType, handler) {}\n    /**\n     * @param {string} evtType\n     * @param {!Function} handler\n     */\n\n  }, {\n    key: \"deregisterDocumentInteractionHandler\",\n    value: function deregisterDocumentInteractionHandler(evtType, handler) {}\n    /**\n     * @param {!Function} handler\n     */\n\n  }, {\n    key: \"registerResizeHandler\",\n    value: function registerResizeHandler(handler) {}\n    /**\n     * @param {!Function} handler\n     */\n\n  }, {\n    key: \"deregisterResizeHandler\",\n    value: function deregisterResizeHandler(handler) {}\n    /**\n     * @param {string} varName\n     * @param {?number|string} value\n     */\n\n  }, {\n    key: \"updateCssVariable\",\n    value: function updateCssVariable(varName, value) {}\n    /** @return {!ClientRect} */\n\n  }, {\n    key: \"computeBoundingRect\",\n    value: function computeBoundingRect() {}\n    /** @return {{x: number, y: number}} */\n\n  }, {\n    key: \"getWindowPageOffset\",\n    value: function getWindowPageOffset() {}\n  }]);\n\n  return MDCRippleAdapter;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MDCRippleAdapter);\n\n//# sourceURL=webpack:///./node_modules/@material/ripple/adapter.js?");

  /***/ }),

  /***/ "./node_modules/@material/ripple/constants.js":
  /*!****************************************************!*\
    !*** ./node_modules/@material/ripple/constants.js ***!
    \****************************************************/
  /*! exports provided: cssClasses, strings, numbers */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"cssClasses\", function() { return cssClasses; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"strings\", function() { return strings; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"numbers\", function() { return numbers; });\n/**\n * @license\n * Copyright 2016 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\nvar cssClasses = {\n  // Ripple is a special case where the \"root\" component is really a \"mixin\" of sorts,\n  // given that it's an 'upgrade' to an existing component. That being said it is the root\n  // CSS class that all other CSS classes derive from.\n  ROOT: 'mdc-ripple-upgraded',\n  UNBOUNDED: 'mdc-ripple-upgraded--unbounded',\n  BG_FOCUSED: 'mdc-ripple-upgraded--background-focused',\n  FG_ACTIVATION: 'mdc-ripple-upgraded--foreground-activation',\n  FG_DEACTIVATION: 'mdc-ripple-upgraded--foreground-deactivation'\n};\nvar strings = {\n  VAR_LEFT: '--mdc-ripple-left',\n  VAR_TOP: '--mdc-ripple-top',\n  VAR_FG_SIZE: '--mdc-ripple-fg-size',\n  VAR_FG_SCALE: '--mdc-ripple-fg-scale',\n  VAR_FG_TRANSLATE_START: '--mdc-ripple-fg-translate-start',\n  VAR_FG_TRANSLATE_END: '--mdc-ripple-fg-translate-end'\n};\nvar numbers = {\n  PADDING: 10,\n  INITIAL_ORIGIN_SCALE: 0.6,\n  DEACTIVATION_TIMEOUT_MS: 225,\n  // Corresponds to $mdc-ripple-translate-duration (i.e. activation animation duration)\n  FG_DEACTIVATION_MS: 150,\n  // Corresponds to $mdc-ripple-fade-out-duration (i.e. deactivation animation duration)\n  TAP_DELAY_MS: 300 // Delay between touch and simulated mouse events on touch devices\n\n};\n\n\n//# sourceURL=webpack:///./node_modules/@material/ripple/constants.js?");

  /***/ }),

  /***/ "./node_modules/@material/ripple/foundation.js":
  /*!*****************************************************!*\
    !*** ./node_modules/@material/ripple/foundation.js ***!
    \*****************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _material_base_foundation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @material/base/foundation */ \"./node_modules/@material/base/foundation.js\");\n/* harmony import */ var _adapter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./adapter */ \"./node_modules/@material/ripple/adapter.js\");\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ \"./node_modules/@material/ripple/constants.js\");\n/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util */ \"./node_modules/@material/ripple/util.js\");\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\n/**\n * @license\n * Copyright 2016 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n\n\n\n/**\n * @typedef {{\n *   isActivated: (boolean|undefined),\n *   hasDeactivationUXRun: (boolean|undefined),\n *   wasActivatedByPointer: (boolean|undefined),\n *   wasElementMadeActive: (boolean|undefined),\n *   activationEvent: Event,\n *   isProgrammatic: (boolean|undefined)\n * }}\n */\n\nvar ActivationStateType;\n/**\n * @typedef {{\n *   activate: (string|undefined),\n *   deactivate: (string|undefined),\n *   focus: (string|undefined),\n *   blur: (string|undefined)\n * }}\n */\n\nvar ListenerInfoType;\n/**\n * @typedef {{\n *   activate: function(!Event),\n *   deactivate: function(!Event),\n *   focus: function(),\n *   blur: function()\n * }}\n */\n\nvar ListenersType;\n/**\n * @typedef {{\n *   x: number,\n *   y: number\n * }}\n */\n\nvar PointType; // Activation events registered on the root element of each instance for activation\n\nvar ACTIVATION_EVENT_TYPES = ['touchstart', 'pointerdown', 'mousedown', 'keydown']; // Deactivation events registered on documentElement when a pointer-related down event occurs\n\nvar POINTER_DEACTIVATION_EVENT_TYPES = ['touchend', 'pointerup', 'mouseup']; // Tracks activations that have occurred on the current frame, to avoid simultaneous nested activations\n\n/** @type {!Array<!EventTarget>} */\n\nvar activatedTargets = [];\n/**\n * @extends {MDCFoundation<!MDCRippleAdapter>}\n */\n\nvar MDCRippleFoundation =\n/*#__PURE__*/\nfunction (_MDCFoundation) {\n  _inherits(MDCRippleFoundation, _MDCFoundation);\n\n  _createClass(MDCRippleFoundation, null, [{\n    key: \"cssClasses\",\n    get: function get() {\n      return _constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"];\n    }\n  }, {\n    key: \"strings\",\n    get: function get() {\n      return _constants__WEBPACK_IMPORTED_MODULE_2__[\"strings\"];\n    }\n  }, {\n    key: \"numbers\",\n    get: function get() {\n      return _constants__WEBPACK_IMPORTED_MODULE_2__[\"numbers\"];\n    }\n  }, {\n    key: \"defaultAdapter\",\n    get: function get() {\n      return {\n        browserSupportsCssVars: function browserSupportsCssVars()\n        /* boolean - cached */\n        {},\n        isUnbounded: function isUnbounded()\n        /* boolean */\n        {},\n        isSurfaceActive: function isSurfaceActive()\n        /* boolean */\n        {},\n        isSurfaceDisabled: function isSurfaceDisabled()\n        /* boolean */\n        {},\n        addClass: function addClass()\n        /* className: string */\n        {},\n        removeClass: function removeClass()\n        /* className: string */\n        {},\n        containsEventTarget: function containsEventTarget()\n        /* target: !EventTarget */\n        {},\n        registerInteractionHandler: function registerInteractionHandler()\n        /* evtType: string, handler: EventListener */\n        {},\n        deregisterInteractionHandler: function deregisterInteractionHandler()\n        /* evtType: string, handler: EventListener */\n        {},\n        registerDocumentInteractionHandler: function registerDocumentInteractionHandler()\n        /* evtType: string, handler: EventListener */\n        {},\n        deregisterDocumentInteractionHandler: function deregisterDocumentInteractionHandler()\n        /* evtType: string, handler: EventListener */\n        {},\n        registerResizeHandler: function registerResizeHandler()\n        /* handler: EventListener */\n        {},\n        deregisterResizeHandler: function deregisterResizeHandler()\n        /* handler: EventListener */\n        {},\n        updateCssVariable: function updateCssVariable()\n        /* varName: string, value: string */\n        {},\n        computeBoundingRect: function computeBoundingRect()\n        /* ClientRect */\n        {},\n        getWindowPageOffset: function getWindowPageOffset()\n        /* {x: number, y: number} */\n        {}\n      };\n    }\n  }]);\n\n  function MDCRippleFoundation(adapter) {\n    var _this;\n\n    _classCallCheck(this, MDCRippleFoundation);\n\n    _this = _possibleConstructorReturn(this, _getPrototypeOf(MDCRippleFoundation).call(this, _extends(MDCRippleFoundation.defaultAdapter, adapter)));\n    /** @private {number} */\n\n    _this.layoutFrame_ = 0;\n    /** @private {!ClientRect} */\n\n    _this.frame_ =\n    /** @type {!ClientRect} */\n    {\n      width: 0,\n      height: 0\n    };\n    /** @private {!ActivationStateType} */\n\n    _this.activationState_ = _this.defaultActivationState_();\n    /** @private {number} */\n\n    _this.initialSize_ = 0;\n    /** @private {number} */\n\n    _this.maxRadius_ = 0;\n    /** @private {function(!Event)} */\n\n    _this.activateHandler_ = function (e) {\n      return _this.activate_(e);\n    };\n    /** @private {function(!Event)} */\n\n\n    _this.deactivateHandler_ = function (e) {\n      return _this.deactivate_(e);\n    };\n    /** @private {function(?Event=)} */\n\n\n    _this.focusHandler_ = function () {\n      return _this.handleFocus();\n    };\n    /** @private {function(?Event=)} */\n\n\n    _this.blurHandler_ = function () {\n      return _this.handleBlur();\n    };\n    /** @private {!Function} */\n\n\n    _this.resizeHandler_ = function () {\n      return _this.layout();\n    };\n    /** @private {{left: number, top:number}} */\n\n\n    _this.unboundedCoords_ = {\n      left: 0,\n      top: 0\n    };\n    /** @private {number} */\n\n    _this.fgScale_ = 0;\n    /** @private {number} */\n\n    _this.activationTimer_ = 0;\n    /** @private {number} */\n\n    _this.fgDeactivationRemovalTimer_ = 0;\n    /** @private {boolean} */\n\n    _this.activationAnimationHasEnded_ = false;\n    /** @private {!Function} */\n\n    _this.activationTimerCallback_ = function () {\n      _this.activationAnimationHasEnded_ = true;\n\n      _this.runDeactivationUXLogicIfReady_();\n    };\n    /** @private {?Event} */\n\n\n    _this.previousActivationEvent_ = null;\n    return _this;\n  }\n  /**\n   * We compute this property so that we are not querying information about the client\n   * until the point in time where the foundation requests it. This prevents scenarios where\n   * client-side feature-detection may happen too early, such as when components are rendered on the server\n   * and then initialized at mount time on the client.\n   * @return {boolean}\n   * @private\n   */\n\n\n  _createClass(MDCRippleFoundation, [{\n    key: \"isSupported_\",\n    value: function isSupported_() {\n      return this.adapter_.browserSupportsCssVars();\n    }\n    /**\n     * @return {!ActivationStateType}\n     */\n\n  }, {\n    key: \"defaultActivationState_\",\n    value: function defaultActivationState_() {\n      return {\n        isActivated: false,\n        hasDeactivationUXRun: false,\n        wasActivatedByPointer: false,\n        wasElementMadeActive: false,\n        activationEvent: null,\n        isProgrammatic: false\n      };\n    }\n    /** @override */\n\n  }, {\n    key: \"init\",\n    value: function init() {\n      var _this2 = this;\n\n      if (!this.isSupported_()) {\n        return;\n      }\n\n      this.registerRootHandlers_();\n      var _MDCRippleFoundation$ = MDCRippleFoundation.cssClasses,\n          ROOT = _MDCRippleFoundation$.ROOT,\n          UNBOUNDED = _MDCRippleFoundation$.UNBOUNDED;\n      requestAnimationFrame(function () {\n        _this2.adapter_.addClass(ROOT);\n\n        if (_this2.adapter_.isUnbounded()) {\n          _this2.adapter_.addClass(UNBOUNDED); // Unbounded ripples need layout logic applied immediately to set coordinates for both shade and ripple\n\n\n          _this2.layoutInternal_();\n        }\n      });\n    }\n    /** @override */\n\n  }, {\n    key: \"destroy\",\n    value: function destroy() {\n      var _this3 = this;\n\n      if (!this.isSupported_()) {\n        return;\n      }\n\n      if (this.activationTimer_) {\n        clearTimeout(this.activationTimer_);\n        this.activationTimer_ = 0;\n        var FG_ACTIVATION = MDCRippleFoundation.cssClasses.FG_ACTIVATION;\n        this.adapter_.removeClass(FG_ACTIVATION);\n      }\n\n      this.deregisterRootHandlers_();\n      this.deregisterDeactivationHandlers_();\n      var _MDCRippleFoundation$2 = MDCRippleFoundation.cssClasses,\n          ROOT = _MDCRippleFoundation$2.ROOT,\n          UNBOUNDED = _MDCRippleFoundation$2.UNBOUNDED;\n      requestAnimationFrame(function () {\n        _this3.adapter_.removeClass(ROOT);\n\n        _this3.adapter_.removeClass(UNBOUNDED);\n\n        _this3.removeCssVars_();\n      });\n    }\n    /** @private */\n\n  }, {\n    key: \"registerRootHandlers_\",\n    value: function registerRootHandlers_() {\n      var _this4 = this;\n\n      ACTIVATION_EVENT_TYPES.forEach(function (type) {\n        _this4.adapter_.registerInteractionHandler(type, _this4.activateHandler_);\n      });\n      this.adapter_.registerInteractionHandler('focus', this.focusHandler_);\n      this.adapter_.registerInteractionHandler('blur', this.blurHandler_);\n\n      if (this.adapter_.isUnbounded()) {\n        this.adapter_.registerResizeHandler(this.resizeHandler_);\n      }\n    }\n    /**\n     * @param {!Event} e\n     * @private\n     */\n\n  }, {\n    key: \"registerDeactivationHandlers_\",\n    value: function registerDeactivationHandlers_(e) {\n      var _this5 = this;\n\n      if (e.type === 'keydown') {\n        this.adapter_.registerInteractionHandler('keyup', this.deactivateHandler_);\n      } else {\n        POINTER_DEACTIVATION_EVENT_TYPES.forEach(function (type) {\n          _this5.adapter_.registerDocumentInteractionHandler(type, _this5.deactivateHandler_);\n        });\n      }\n    }\n    /** @private */\n\n  }, {\n    key: \"deregisterRootHandlers_\",\n    value: function deregisterRootHandlers_() {\n      var _this6 = this;\n\n      ACTIVATION_EVENT_TYPES.forEach(function (type) {\n        _this6.adapter_.deregisterInteractionHandler(type, _this6.activateHandler_);\n      });\n      this.adapter_.deregisterInteractionHandler('focus', this.focusHandler_);\n      this.adapter_.deregisterInteractionHandler('blur', this.blurHandler_);\n\n      if (this.adapter_.isUnbounded()) {\n        this.adapter_.deregisterResizeHandler(this.resizeHandler_);\n      }\n    }\n    /** @private */\n\n  }, {\n    key: \"deregisterDeactivationHandlers_\",\n    value: function deregisterDeactivationHandlers_() {\n      var _this7 = this;\n\n      this.adapter_.deregisterInteractionHandler('keyup', this.deactivateHandler_);\n      POINTER_DEACTIVATION_EVENT_TYPES.forEach(function (type) {\n        _this7.adapter_.deregisterDocumentInteractionHandler(type, _this7.deactivateHandler_);\n      });\n    }\n    /** @private */\n\n  }, {\n    key: \"removeCssVars_\",\n    value: function removeCssVars_() {\n      var _this8 = this;\n\n      var strings = MDCRippleFoundation.strings;\n      Object.keys(strings).forEach(function (k) {\n        if (k.indexOf('VAR_') === 0) {\n          _this8.adapter_.updateCssVariable(strings[k], null);\n        }\n      });\n    }\n    /**\n     * @param {?Event} e\n     * @private\n     */\n\n  }, {\n    key: \"activate_\",\n    value: function activate_(e) {\n      var _this9 = this;\n\n      if (this.adapter_.isSurfaceDisabled()) {\n        return;\n      }\n\n      var activationState = this.activationState_;\n\n      if (activationState.isActivated) {\n        return;\n      } // Avoid reacting to follow-on events fired by touch device after an already-processed user interaction\n\n\n      var previousActivationEvent = this.previousActivationEvent_;\n      var isSameInteraction = previousActivationEvent && e && previousActivationEvent.type !== e.type;\n\n      if (isSameInteraction) {\n        return;\n      }\n\n      activationState.isActivated = true;\n      activationState.isProgrammatic = e === null;\n      activationState.activationEvent = e;\n      activationState.wasActivatedByPointer = activationState.isProgrammatic ? false : e.type === 'mousedown' || e.type === 'touchstart' || e.type === 'pointerdown';\n      var hasActivatedChild = e && activatedTargets.length > 0 && activatedTargets.some(function (target) {\n        return _this9.adapter_.containsEventTarget(target);\n      });\n\n      if (hasActivatedChild) {\n        // Immediately reset activation state, while preserving logic that prevents touch follow-on events\n        this.resetActivationState_();\n        return;\n      }\n\n      if (e) {\n        activatedTargets.push(\n        /** @type {!EventTarget} */\n        e.target);\n        this.registerDeactivationHandlers_(e);\n      }\n\n      activationState.wasElementMadeActive = this.checkElementMadeActive_(e);\n\n      if (activationState.wasElementMadeActive) {\n        this.animateActivation_();\n      }\n\n      requestAnimationFrame(function () {\n        // Reset array on next frame after the current event has had a chance to bubble to prevent ancestor ripples\n        activatedTargets = [];\n\n        if (!activationState.wasElementMadeActive && (e.key === ' ' || e.keyCode === 32)) {\n          // If space was pressed, try again within an rAF call to detect :active, because different UAs report\n          // active states inconsistently when they're called within event handling code:\n          // - https://bugs.chromium.org/p/chromium/issues/detail?id=635971\n          // - https://bugzilla.mozilla.org/show_bug.cgi?id=1293741\n          // We try first outside rAF to support Edge, which does not exhibit this problem, but will crash if a CSS\n          // variable is set within a rAF callback for a submit button interaction (#2241).\n          activationState.wasElementMadeActive = _this9.checkElementMadeActive_(e);\n\n          if (activationState.wasElementMadeActive) {\n            _this9.animateActivation_();\n          }\n        }\n\n        if (!activationState.wasElementMadeActive) {\n          // Reset activation state immediately if element was not made active.\n          _this9.activationState_ = _this9.defaultActivationState_();\n        }\n      });\n    }\n    /**\n     * @param {?Event} e\n     * @private\n     */\n\n  }, {\n    key: \"checkElementMadeActive_\",\n    value: function checkElementMadeActive_(e) {\n      return e && e.type === 'keydown' ? this.adapter_.isSurfaceActive() : true;\n    }\n    /**\n     * @param {?Event=} event Optional event containing position information.\n     */\n\n  }, {\n    key: \"activate\",\n    value: function activate() {\n      var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;\n      this.activate_(event);\n    }\n    /** @private */\n\n  }, {\n    key: \"animateActivation_\",\n    value: function animateActivation_() {\n      var _this10 = this;\n\n      var _MDCRippleFoundation$3 = MDCRippleFoundation.strings,\n          VAR_FG_TRANSLATE_START = _MDCRippleFoundation$3.VAR_FG_TRANSLATE_START,\n          VAR_FG_TRANSLATE_END = _MDCRippleFoundation$3.VAR_FG_TRANSLATE_END;\n      var _MDCRippleFoundation$4 = MDCRippleFoundation.cssClasses,\n          FG_DEACTIVATION = _MDCRippleFoundation$4.FG_DEACTIVATION,\n          FG_ACTIVATION = _MDCRippleFoundation$4.FG_ACTIVATION;\n      var DEACTIVATION_TIMEOUT_MS = MDCRippleFoundation.numbers.DEACTIVATION_TIMEOUT_MS;\n      this.layoutInternal_();\n      var translateStart = '';\n      var translateEnd = '';\n\n      if (!this.adapter_.isUnbounded()) {\n        var _this$getFgTranslatio = this.getFgTranslationCoordinates_(),\n            startPoint = _this$getFgTranslatio.startPoint,\n            endPoint = _this$getFgTranslatio.endPoint;\n\n        translateStart = \"\".concat(startPoint.x, \"px, \").concat(startPoint.y, \"px\");\n        translateEnd = \"\".concat(endPoint.x, \"px, \").concat(endPoint.y, \"px\");\n      }\n\n      this.adapter_.updateCssVariable(VAR_FG_TRANSLATE_START, translateStart);\n      this.adapter_.updateCssVariable(VAR_FG_TRANSLATE_END, translateEnd); // Cancel any ongoing activation/deactivation animations\n\n      clearTimeout(this.activationTimer_);\n      clearTimeout(this.fgDeactivationRemovalTimer_);\n      this.rmBoundedActivationClasses_();\n      this.adapter_.removeClass(FG_DEACTIVATION); // Force layout in order to re-trigger the animation.\n\n      this.adapter_.computeBoundingRect();\n      this.adapter_.addClass(FG_ACTIVATION);\n      this.activationTimer_ = setTimeout(function () {\n        return _this10.activationTimerCallback_();\n      }, DEACTIVATION_TIMEOUT_MS);\n    }\n    /**\n     * @private\n     * @return {{startPoint: PointType, endPoint: PointType}}\n     */\n\n  }, {\n    key: \"getFgTranslationCoordinates_\",\n    value: function getFgTranslationCoordinates_() {\n      var _this$activationState = this.activationState_,\n          activationEvent = _this$activationState.activationEvent,\n          wasActivatedByPointer = _this$activationState.wasActivatedByPointer;\n      var startPoint;\n\n      if (wasActivatedByPointer) {\n        startPoint = Object(_util__WEBPACK_IMPORTED_MODULE_3__[\"getNormalizedEventCoords\"])(\n        /** @type {!Event} */\n        activationEvent, this.adapter_.getWindowPageOffset(), this.adapter_.computeBoundingRect());\n      } else {\n        startPoint = {\n          x: this.frame_.width / 2,\n          y: this.frame_.height / 2\n        };\n      } // Center the element around the start point.\n\n\n      startPoint = {\n        x: startPoint.x - this.initialSize_ / 2,\n        y: startPoint.y - this.initialSize_ / 2\n      };\n      var endPoint = {\n        x: this.frame_.width / 2 - this.initialSize_ / 2,\n        y: this.frame_.height / 2 - this.initialSize_ / 2\n      };\n      return {\n        startPoint: startPoint,\n        endPoint: endPoint\n      };\n    }\n    /** @private */\n\n  }, {\n    key: \"runDeactivationUXLogicIfReady_\",\n    value: function runDeactivationUXLogicIfReady_() {\n      var _this11 = this;\n\n      // This method is called both when a pointing device is released, and when the activation animation ends.\n      // The deactivation animation should only run after both of those occur.\n      var FG_DEACTIVATION = MDCRippleFoundation.cssClasses.FG_DEACTIVATION;\n      var _this$activationState2 = this.activationState_,\n          hasDeactivationUXRun = _this$activationState2.hasDeactivationUXRun,\n          isActivated = _this$activationState2.isActivated;\n      var activationHasEnded = hasDeactivationUXRun || !isActivated;\n\n      if (activationHasEnded && this.activationAnimationHasEnded_) {\n        this.rmBoundedActivationClasses_();\n        this.adapter_.addClass(FG_DEACTIVATION);\n        this.fgDeactivationRemovalTimer_ = setTimeout(function () {\n          _this11.adapter_.removeClass(FG_DEACTIVATION);\n        }, _constants__WEBPACK_IMPORTED_MODULE_2__[\"numbers\"].FG_DEACTIVATION_MS);\n      }\n    }\n    /** @private */\n\n  }, {\n    key: \"rmBoundedActivationClasses_\",\n    value: function rmBoundedActivationClasses_() {\n      var FG_ACTIVATION = MDCRippleFoundation.cssClasses.FG_ACTIVATION;\n      this.adapter_.removeClass(FG_ACTIVATION);\n      this.activationAnimationHasEnded_ = false;\n      this.adapter_.computeBoundingRect();\n    }\n  }, {\n    key: \"resetActivationState_\",\n    value: function resetActivationState_() {\n      var _this12 = this;\n\n      this.previousActivationEvent_ = this.activationState_.activationEvent;\n      this.activationState_ = this.defaultActivationState_(); // Touch devices may fire additional events for the same interaction within a short time.\n      // Store the previous event until it's safe to assume that subsequent events are for new interactions.\n\n      setTimeout(function () {\n        return _this12.previousActivationEvent_ = null;\n      }, MDCRippleFoundation.numbers.TAP_DELAY_MS);\n    }\n    /**\n     * @param {?Event} e\n     * @private\n     */\n\n  }, {\n    key: \"deactivate_\",\n    value: function deactivate_(e) {\n      var _this13 = this;\n\n      var activationState = this.activationState_; // This can happen in scenarios such as when you have a keyup event that blurs the element.\n\n      if (!activationState.isActivated) {\n        return;\n      }\n\n      var state =\n      /** @type {!ActivationStateType} */\n      _extends({}, activationState);\n\n      if (activationState.isProgrammatic) {\n        var evtObject = null;\n        requestAnimationFrame(function () {\n          return _this13.animateDeactivation_(evtObject, state);\n        });\n        this.resetActivationState_();\n      } else {\n        this.deregisterDeactivationHandlers_();\n        requestAnimationFrame(function () {\n          _this13.activationState_.hasDeactivationUXRun = true;\n\n          _this13.animateDeactivation_(e, state);\n\n          _this13.resetActivationState_();\n        });\n      }\n    }\n    /**\n     * @param {?Event=} event Optional event containing position information.\n     */\n\n  }, {\n    key: \"deactivate\",\n    value: function deactivate() {\n      var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;\n      this.deactivate_(event);\n    }\n    /**\n     * @param {Event} e\n     * @param {!ActivationStateType} options\n     * @private\n     */\n\n  }, {\n    key: \"animateDeactivation_\",\n    value: function animateDeactivation_(e, _ref) {\n      var wasActivatedByPointer = _ref.wasActivatedByPointer,\n          wasElementMadeActive = _ref.wasElementMadeActive;\n\n      if (wasActivatedByPointer || wasElementMadeActive) {\n        this.runDeactivationUXLogicIfReady_();\n      }\n    }\n  }, {\n    key: \"layout\",\n    value: function layout() {\n      var _this14 = this;\n\n      if (this.layoutFrame_) {\n        cancelAnimationFrame(this.layoutFrame_);\n      }\n\n      this.layoutFrame_ = requestAnimationFrame(function () {\n        _this14.layoutInternal_();\n\n        _this14.layoutFrame_ = 0;\n      });\n    }\n    /** @private */\n\n  }, {\n    key: \"layoutInternal_\",\n    value: function layoutInternal_() {\n      var _this15 = this;\n\n      this.frame_ = this.adapter_.computeBoundingRect();\n      var maxDim = Math.max(this.frame_.height, this.frame_.width); // Surface diameter is treated differently for unbounded vs. bounded ripples.\n      // Unbounded ripple diameter is calculated smaller since the surface is expected to already be padded appropriately\n      // to extend the hitbox, and the ripple is expected to meet the edges of the padded hitbox (which is typically\n      // square). Bounded ripples, on the other hand, are fully expected to expand beyond the surface's longest diameter\n      // (calculated based on the diagonal plus a constant padding), and are clipped at the surface's border via\n      // `overflow: hidden`.\n\n      var getBoundedRadius = function getBoundedRadius() {\n        var hypotenuse = Math.sqrt(Math.pow(_this15.frame_.width, 2) + Math.pow(_this15.frame_.height, 2));\n        return hypotenuse + MDCRippleFoundation.numbers.PADDING;\n      };\n\n      this.maxRadius_ = this.adapter_.isUnbounded() ? maxDim : getBoundedRadius(); // Ripple is sized as a fraction of the largest dimension of the surface, then scales up using a CSS scale transform\n\n      this.initialSize_ = maxDim * MDCRippleFoundation.numbers.INITIAL_ORIGIN_SCALE;\n      this.fgScale_ = this.maxRadius_ / this.initialSize_;\n      this.updateLayoutCssVars_();\n    }\n    /** @private */\n\n  }, {\n    key: \"updateLayoutCssVars_\",\n    value: function updateLayoutCssVars_() {\n      var _MDCRippleFoundation$5 = MDCRippleFoundation.strings,\n          VAR_FG_SIZE = _MDCRippleFoundation$5.VAR_FG_SIZE,\n          VAR_LEFT = _MDCRippleFoundation$5.VAR_LEFT,\n          VAR_TOP = _MDCRippleFoundation$5.VAR_TOP,\n          VAR_FG_SCALE = _MDCRippleFoundation$5.VAR_FG_SCALE;\n      this.adapter_.updateCssVariable(VAR_FG_SIZE, \"\".concat(this.initialSize_, \"px\"));\n      this.adapter_.updateCssVariable(VAR_FG_SCALE, this.fgScale_);\n\n      if (this.adapter_.isUnbounded()) {\n        this.unboundedCoords_ = {\n          left: Math.round(this.frame_.width / 2 - this.initialSize_ / 2),\n          top: Math.round(this.frame_.height / 2 - this.initialSize_ / 2)\n        };\n        this.adapter_.updateCssVariable(VAR_LEFT, \"\".concat(this.unboundedCoords_.left, \"px\"));\n        this.adapter_.updateCssVariable(VAR_TOP, \"\".concat(this.unboundedCoords_.top, \"px\"));\n      }\n    }\n    /** @param {boolean} unbounded */\n\n  }, {\n    key: \"setUnbounded\",\n    value: function setUnbounded(unbounded) {\n      var UNBOUNDED = MDCRippleFoundation.cssClasses.UNBOUNDED;\n\n      if (unbounded) {\n        this.adapter_.addClass(UNBOUNDED);\n      } else {\n        this.adapter_.removeClass(UNBOUNDED);\n      }\n    }\n  }, {\n    key: \"handleFocus\",\n    value: function handleFocus() {\n      var _this16 = this;\n\n      requestAnimationFrame(function () {\n        return _this16.adapter_.addClass(MDCRippleFoundation.cssClasses.BG_FOCUSED);\n      });\n    }\n  }, {\n    key: \"handleBlur\",\n    value: function handleBlur() {\n      var _this17 = this;\n\n      requestAnimationFrame(function () {\n        return _this17.adapter_.removeClass(MDCRippleFoundation.cssClasses.BG_FOCUSED);\n      });\n    }\n  }]);\n\n  return MDCRippleFoundation;\n}(_material_base_foundation__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MDCRippleFoundation);\n\n//# sourceURL=webpack:///./node_modules/@material/ripple/foundation.js?");

  /***/ }),

  /***/ "./node_modules/@material/ripple/index.js":
  /*!************************************************!*\
    !*** ./node_modules/@material/ripple/index.js ***!
    \************************************************/
  /*! exports provided: MDCRipple, MDCRippleFoundation, RippleCapableSurface, util */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MDCRipple\", function() { return MDCRipple; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RippleCapableSurface\", function() { return RippleCapableSurface; });\n/* harmony import */ var _material_base_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @material/base/component */ \"./node_modules/@material/base/component.js\");\n/* harmony import */ var _adapter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./adapter */ \"./node_modules/@material/ripple/adapter.js\");\n/* harmony import */ var _foundation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./foundation */ \"./node_modules/@material/ripple/foundation.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"MDCRippleFoundation\", function() { return _foundation__WEBPACK_IMPORTED_MODULE_2__[\"default\"]; });\n\n/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util */ \"./node_modules/@material/ripple/util.js\");\n/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, \"util\", function() { return _util__WEBPACK_IMPORTED_MODULE_3__; });\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\n/**\n * @license\n * Copyright 2016 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n\n\n\n/**\n * @extends MDCComponent<!MDCRippleFoundation>\n */\n\nvar MDCRipple =\n/*#__PURE__*/\nfunction (_MDCComponent) {\n  _inherits(MDCRipple, _MDCComponent);\n\n  /** @param {...?} args */\n  function MDCRipple() {\n    var _getPrototypeOf2;\n\n    var _this;\n\n    _classCallCheck(this, MDCRipple);\n\n    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {\n      args[_key] = arguments[_key];\n    }\n\n    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(MDCRipple)).call.apply(_getPrototypeOf2, [this].concat(args)));\n    /** @type {boolean} */\n\n    _this.disabled = false;\n    /** @private {boolean} */\n\n    _this.unbounded_;\n    return _this;\n  }\n  /**\n   * @param {!Element} root\n   * @param {{isUnbounded: (boolean|undefined)}=} options\n   * @return {!MDCRipple}\n   */\n\n\n  _createClass(MDCRipple, [{\n    key: \"setUnbounded_\",\n\n    /**\n     * Closure Compiler throws an access control error when directly accessing a\n     * protected or private property inside a getter/setter, like unbounded above.\n     * By accessing the protected property inside a method, we solve that problem.\n     * That's why this function exists.\n     * @private\n     */\n    value: function setUnbounded_() {\n      this.foundation_.setUnbounded(this.unbounded_);\n    }\n  }, {\n    key: \"activate\",\n    value: function activate() {\n      this.foundation_.activate();\n    }\n  }, {\n    key: \"deactivate\",\n    value: function deactivate() {\n      this.foundation_.deactivate();\n    }\n  }, {\n    key: \"layout\",\n    value: function layout() {\n      this.foundation_.layout();\n    }\n    /**\n     * @return {!MDCRippleFoundation}\n     * @override\n     */\n\n  }, {\n    key: \"getDefaultFoundation\",\n    value: function getDefaultFoundation() {\n      return new _foundation__WEBPACK_IMPORTED_MODULE_2__[\"default\"](MDCRipple.createAdapter(this));\n    }\n    /** @override */\n\n  }, {\n    key: \"initialSyncWithDOM\",\n    value: function initialSyncWithDOM() {\n      this.unbounded = 'mdcRippleIsUnbounded' in this.root_.dataset;\n    }\n  }, {\n    key: \"unbounded\",\n\n    /** @return {boolean} */\n    get: function get() {\n      return this.unbounded_;\n    }\n    /** @param {boolean} unbounded */\n    ,\n    set: function set(unbounded) {\n      this.unbounded_ = Boolean(unbounded);\n      this.setUnbounded_();\n    }\n  }], [{\n    key: \"attachTo\",\n    value: function attachTo(root) {\n      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},\n          _ref$isUnbounded = _ref.isUnbounded,\n          isUnbounded = _ref$isUnbounded === void 0 ? undefined : _ref$isUnbounded;\n\n      var ripple = new MDCRipple(root); // Only override unbounded behavior if option is explicitly specified\n\n      if (isUnbounded !== undefined) {\n        ripple.unbounded =\n        /** @type {boolean} */\n        isUnbounded;\n      }\n\n      return ripple;\n    }\n    /**\n     * @param {!RippleCapableSurface} instance\n     * @return {!MDCRippleAdapter}\n     */\n\n  }, {\n    key: \"createAdapter\",\n    value: function createAdapter(instance) {\n      var MATCHES = _util__WEBPACK_IMPORTED_MODULE_3__[\"getMatchesProperty\"](HTMLElement.prototype);\n      return {\n        browserSupportsCssVars: function browserSupportsCssVars() {\n          return _util__WEBPACK_IMPORTED_MODULE_3__[\"supportsCssVariables\"](window);\n        },\n        isUnbounded: function isUnbounded() {\n          return instance.unbounded;\n        },\n        isSurfaceActive: function isSurfaceActive() {\n          return instance.root_[MATCHES](':active');\n        },\n        isSurfaceDisabled: function isSurfaceDisabled() {\n          return instance.disabled;\n        },\n        addClass: function addClass(className) {\n          return instance.root_.classList.add(className);\n        },\n        removeClass: function removeClass(className) {\n          return instance.root_.classList.remove(className);\n        },\n        containsEventTarget: function containsEventTarget(target) {\n          return instance.root_.contains(target);\n        },\n        registerInteractionHandler: function registerInteractionHandler(evtType, handler) {\n          return instance.root_.addEventListener(evtType, handler, _util__WEBPACK_IMPORTED_MODULE_3__[\"applyPassive\"]());\n        },\n        deregisterInteractionHandler: function deregisterInteractionHandler(evtType, handler) {\n          return instance.root_.removeEventListener(evtType, handler, _util__WEBPACK_IMPORTED_MODULE_3__[\"applyPassive\"]());\n        },\n        registerDocumentInteractionHandler: function registerDocumentInteractionHandler(evtType, handler) {\n          return document.documentElement.addEventListener(evtType, handler, _util__WEBPACK_IMPORTED_MODULE_3__[\"applyPassive\"]());\n        },\n        deregisterDocumentInteractionHandler: function deregisterDocumentInteractionHandler(evtType, handler) {\n          return document.documentElement.removeEventListener(evtType, handler, _util__WEBPACK_IMPORTED_MODULE_3__[\"applyPassive\"]());\n        },\n        registerResizeHandler: function registerResizeHandler(handler) {\n          return window.addEventListener('resize', handler);\n        },\n        deregisterResizeHandler: function deregisterResizeHandler(handler) {\n          return window.removeEventListener('resize', handler);\n        },\n        updateCssVariable: function updateCssVariable(varName, value) {\n          return instance.root_.style.setProperty(varName, value);\n        },\n        computeBoundingRect: function computeBoundingRect() {\n          return instance.root_.getBoundingClientRect();\n        },\n        getWindowPageOffset: function getWindowPageOffset() {\n          return {\n            x: window.pageXOffset,\n            y: window.pageYOffset\n          };\n        }\n      };\n    }\n  }]);\n\n  return MDCRipple;\n}(_material_base_component__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n/**\n * See Material Design spec for more details on when to use ripples.\n * https://material.io/guidelines/motion/choreography.html#choreography-creation\n * @record\n */\n\n\nvar RippleCapableSurface = function RippleCapableSurface() {\n  _classCallCheck(this, RippleCapableSurface);\n};\n/** @protected {!Element} */\n\n\nRippleCapableSurface.prototype.root_;\n/**\n * Whether or not the ripple bleeds out of the bounds of the element.\n * @type {boolean|undefined}\n */\n\nRippleCapableSurface.prototype.unbounded;\n/**\n * Whether or not the ripple is attached to a disabled component.\n * @type {boolean|undefined}\n */\n\nRippleCapableSurface.prototype.disabled;\n\n\n//# sourceURL=webpack:///./node_modules/@material/ripple/index.js?");

  /***/ }),

  /***/ "./node_modules/@material/ripple/util.js":
  /*!***********************************************!*\
    !*** ./node_modules/@material/ripple/util.js ***!
    \***********************************************/
  /*! exports provided: supportsCssVariables, applyPassive, getMatchesProperty, getNormalizedEventCoords */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"supportsCssVariables\", function() { return supportsCssVariables; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"applyPassive\", function() { return applyPassive; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getMatchesProperty\", function() { return getMatchesProperty; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getNormalizedEventCoords\", function() { return getNormalizedEventCoords; });\n/**\n * @license\n * Copyright 2016 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n/**\n * Stores result from supportsCssVariables to avoid redundant processing to detect CSS custom variable support.\n * @private {boolean|undefined}\n */\nvar supportsCssVariables_;\n/**\n * Stores result from applyPassive to avoid redundant processing to detect passive event listener support.\n * @private {boolean|undefined}\n */\n\nvar supportsPassive_;\n/**\n * @param {!Window} windowObj\n * @return {boolean}\n */\n\nfunction detectEdgePseudoVarBug(windowObj) {\n  // Detect versions of Edge with buggy var() support\n  // See: https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/11495448/\n  var document = windowObj.document;\n  var node = document.createElement('div');\n  node.className = 'mdc-ripple-surface--test-edge-var-bug';\n  document.body.appendChild(node); // The bug exists if ::before style ends up propagating to the parent element.\n  // Additionally, getComputedStyle returns null in iframes with display: \"none\" in Firefox,\n  // but Firefox is known to support CSS custom properties correctly.\n  // See: https://bugzilla.mozilla.org/show_bug.cgi?id=548397\n\n  var computedStyle = windowObj.getComputedStyle(node);\n  var hasPseudoVarBug = computedStyle !== null && computedStyle.borderTopStyle === 'solid';\n  node.remove();\n  return hasPseudoVarBug;\n}\n/**\n * @param {!Window} windowObj\n * @param {boolean=} forceRefresh\n * @return {boolean|undefined}\n */\n\n\nfunction supportsCssVariables(windowObj) {\n  var forceRefresh = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;\n  var supportsCssVariables = supportsCssVariables_;\n\n  if (typeof supportsCssVariables_ === 'boolean' && !forceRefresh) {\n    return supportsCssVariables;\n  }\n\n  var supportsFunctionPresent = windowObj.CSS && typeof windowObj.CSS.supports === 'function';\n\n  if (!supportsFunctionPresent) {\n    return;\n  }\n\n  var explicitlySupportsCssVars = windowObj.CSS.supports('--css-vars', 'yes'); // See: https://bugs.webkit.org/show_bug.cgi?id=154669\n  // See: README section on Safari\n\n  var weAreFeatureDetectingSafari10plus = windowObj.CSS.supports('(--css-vars: yes)') && windowObj.CSS.supports('color', '#00000000');\n\n  if (explicitlySupportsCssVars || weAreFeatureDetectingSafari10plus) {\n    supportsCssVariables = !detectEdgePseudoVarBug(windowObj);\n  } else {\n    supportsCssVariables = false;\n  }\n\n  if (!forceRefresh) {\n    supportsCssVariables_ = supportsCssVariables;\n  }\n\n  return supportsCssVariables;\n} //\n\n/**\n * Determine whether the current browser supports passive event listeners, and if so, use them.\n * @param {!Window=} globalObj\n * @param {boolean=} forceRefresh\n * @return {boolean|{passive: boolean}}\n */\n\n\nfunction applyPassive() {\n  var globalObj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;\n  var forceRefresh = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;\n\n  if (supportsPassive_ === undefined || forceRefresh) {\n    var isSupported = false;\n\n    try {\n      globalObj.document.addEventListener('test', null, {\n        get passive() {\n          isSupported = true;\n        }\n\n      });\n    } catch (e) {}\n\n    supportsPassive_ = isSupported;\n  }\n\n  return supportsPassive_ ? {\n    passive: true\n  } : false;\n}\n/**\n * @param {!Object} HTMLElementPrototype\n * @return {!Array<string>}\n */\n\n\nfunction getMatchesProperty(HTMLElementPrototype) {\n  return ['webkitMatchesSelector', 'msMatchesSelector', 'matches'].filter(function (p) {\n    return p in HTMLElementPrototype;\n  }).pop();\n}\n/**\n * @param {!Event} ev\n * @param {{x: number, y: number}} pageOffset\n * @param {!ClientRect} clientRect\n * @return {{x: number, y: number}}\n */\n\n\nfunction getNormalizedEventCoords(ev, pageOffset, clientRect) {\n  var x = pageOffset.x,\n      y = pageOffset.y;\n  var documentX = x + clientRect.left;\n  var documentY = y + clientRect.top;\n  var normalizedX;\n  var normalizedY; // Determine touch point relative to the ripple container.\n\n  if (ev.type === 'touchstart') {\n    normalizedX = ev.changedTouches[0].pageX - documentX;\n    normalizedY = ev.changedTouches[0].pageY - documentY;\n  } else {\n    normalizedX = ev.pageX - documentX;\n    normalizedY = ev.pageY - documentY;\n  }\n\n  return {\n    x: normalizedX,\n    y: normalizedY\n  };\n}\n\n\n\n//# sourceURL=webpack:///./node_modules/@material/ripple/util.js?");

  /***/ }),

  /***/ "./node_modules/@material/textfield/adapter.js":
  /*!*****************************************************!*\
    !*** ./node_modules/@material/textfield/adapter.js ***!
    \*****************************************************/
  /*! exports provided: MDCTextFieldAdapter, NativeInputType, FoundationMapType */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MDCTextFieldAdapter\", function() { return MDCTextFieldAdapter; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"NativeInputType\", function() { return NativeInputType; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"FoundationMapType\", function() { return FoundationMapType; });\n/* harmony import */ var _helper_text_foundation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helper-text/foundation */ \"./node_modules/@material/textfield/helper-text/foundation.js\");\n/* harmony import */ var _icon_foundation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./icon/foundation */ \"./node_modules/@material/textfield/icon/foundation.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n/**\n * @license\n * Copyright 2017 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n/* eslint-disable no-unused-vars */\n\n\n/* eslint no-unused-vars: [2, {\"args\": \"none\"}] */\n\n/**\n * @typedef {{\n *   value: string,\n *   disabled: boolean,\n *   badInput: boolean,\n *   validity: {\n *     badInput: boolean,\n *     valid: boolean,\n *   },\n * }}\n */\n\nvar NativeInputType;\n/**\n * @typedef {{\n *   helperText: (!MDCTextFieldHelperTextFoundation|undefined),\n *   icon: (!MDCTextFieldIconFoundation|undefined),\n * }}\n */\n\nvar FoundationMapType;\n/**\n * Adapter for MDC Text Field.\n *\n * Defines the shape of the adapter expected by the foundation. Implement this\n * adapter to integrate the Text Field into your framework. See\n * https://github.com/material-components/material-components-web/blob/master/docs/authoring-components.md\n * for more information.\n *\n * @record\n */\n\nvar MDCTextFieldAdapter =\n/*#__PURE__*/\nfunction () {\n  function MDCTextFieldAdapter() {\n    _classCallCheck(this, MDCTextFieldAdapter);\n  }\n\n  _createClass(MDCTextFieldAdapter, [{\n    key: \"addClass\",\n\n    /**\n     * Adds a class to the root Element.\n     * @param {string} className\n     */\n    value: function addClass(className) {}\n    /**\n     * Removes a class from the root Element.\n     * @param {string} className\n     */\n\n  }, {\n    key: \"removeClass\",\n    value: function removeClass(className) {}\n    /**\n     * Returns true if the root element contains the given class name.\n     * @param {string} className\n     * @return {boolean}\n     */\n\n  }, {\n    key: \"hasClass\",\n    value: function hasClass(className) {}\n    /**\n     * Registers an event handler on the root element for a given event.\n     * @param {string} type\n     * @param {function(!Event): undefined} handler\n     */\n\n  }, {\n    key: \"registerTextFieldInteractionHandler\",\n    value: function registerTextFieldInteractionHandler(type, handler) {}\n    /**\n     * Deregisters an event handler on the root element for a given event.\n     * @param {string} type\n     * @param {function(!Event): undefined} handler\n     */\n\n  }, {\n    key: \"deregisterTextFieldInteractionHandler\",\n    value: function deregisterTextFieldInteractionHandler(type, handler) {}\n    /**\n     * Registers an event listener on the native input element for a given event.\n     * @param {string} evtType\n     * @param {function(!Event): undefined} handler\n     */\n\n  }, {\n    key: \"registerInputInteractionHandler\",\n    value: function registerInputInteractionHandler(evtType, handler) {}\n    /**\n     * Deregisters an event listener on the native input element for a given event.\n     * @param {string} evtType\n     * @param {function(!Event): undefined} handler\n     */\n\n  }, {\n    key: \"deregisterInputInteractionHandler\",\n    value: function deregisterInputInteractionHandler(evtType, handler) {}\n    /**\n     * Registers a validation attribute change listener on the input element.\n     * Handler accepts list of attribute names.\n     * @param {function(!Array<string>): undefined} handler\n     * @return {!MutationObserver}\n     */\n\n  }, {\n    key: \"registerValidationAttributeChangeHandler\",\n    value: function registerValidationAttributeChangeHandler(handler) {}\n    /**\n     * Disconnects a validation attribute observer on the input element.\n     * @param {!MutationObserver} observer\n     */\n\n  }, {\n    key: \"deregisterValidationAttributeChangeHandler\",\n    value: function deregisterValidationAttributeChangeHandler(observer) {}\n    /**\n     * Returns an object representing the native text input element, with a\n     * similar API shape. The object returned should include the value, disabled\n     * and badInput properties, as well as the checkValidity() function. We never\n     * alter the value within our code, however we do update the disabled\n     * property, so if you choose to duck-type the return value for this method\n     * in your implementation it's important to keep this in mind. Also note that\n     * this method can return null, which the foundation will handle gracefully.\n     * @return {?Element|?NativeInputType}\n     */\n\n  }, {\n    key: \"getNativeInput\",\n    value: function getNativeInput() {}\n    /**\n     * Returns true if the textfield is focused.\n     * We achieve this via `document.activeElement === this.root_`.\n     * @return {boolean}\n     */\n\n  }, {\n    key: \"isFocused\",\n    value: function isFocused() {}\n    /**\n     * Returns true if the direction of the root element is set to RTL.\n     * @return {boolean}\n     */\n\n  }, {\n    key: \"isRtl\",\n    value: function isRtl() {}\n    /**\n     * Activates the line ripple.\n     */\n\n  }, {\n    key: \"activateLineRipple\",\n    value: function activateLineRipple() {}\n    /**\n     * Deactivates the line ripple.\n     */\n\n  }, {\n    key: \"deactivateLineRipple\",\n    value: function deactivateLineRipple() {}\n    /**\n     * Sets the transform origin of the line ripple.\n     * @param {number} normalizedX\n     */\n\n  }, {\n    key: \"setLineRippleTransformOrigin\",\n    value: function setLineRippleTransformOrigin(normalizedX) {}\n    /**\n     * Only implement if label exists.\n     * Shakes label if shouldShake is true.\n     * @param {boolean} shouldShake\n     */\n\n  }, {\n    key: \"shakeLabel\",\n    value: function shakeLabel(shouldShake) {}\n    /**\n     * Only implement if label exists.\n     * Floats the label above the input element if shouldFloat is true.\n     * @param {boolean} shouldFloat\n     */\n\n  }, {\n    key: \"floatLabel\",\n    value: function floatLabel(shouldFloat) {}\n    /**\n     * Returns true if label element exists, false if it doesn't.\n     * @return {boolean}\n     */\n\n  }, {\n    key: \"hasLabel\",\n    value: function hasLabel() {}\n    /**\n     * Only implement if label exists.\n     * Returns width of label in pixels.\n     * @return {number}\n     */\n\n  }, {\n    key: \"getLabelWidth\",\n    value: function getLabelWidth() {}\n    /**\n     * Returns true if outline element exists, false if it doesn't.\n     * @return {boolean}\n     */\n\n  }, {\n    key: \"hasOutline\",\n    value: function hasOutline() {}\n    /**\n     * Only implement if outline element exists.\n     * Updates SVG Path and outline element based on the\n     * label element width and RTL context.\n     * @param {number} labelWidth\n     * @param {boolean=} isRtl\n     */\n\n  }, {\n    key: \"notchOutline\",\n    value: function notchOutline(labelWidth, isRtl) {}\n    /**\n     * Only implement if outline element exists.\n     * Closes notch in outline element.\n     */\n\n  }, {\n    key: \"closeOutline\",\n    value: function closeOutline() {}\n  }]);\n\n  return MDCTextFieldAdapter;\n}();\n\n\n\n//# sourceURL=webpack:///./node_modules/@material/textfield/adapter.js?");

  /***/ }),

  /***/ "./node_modules/@material/textfield/constants.js":
  /*!*******************************************************!*\
    !*** ./node_modules/@material/textfield/constants.js ***!
    \*******************************************************/
  /*! exports provided: cssClasses, strings, numbers, VALIDATION_ATTR_WHITELIST */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"cssClasses\", function() { return cssClasses; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"strings\", function() { return strings; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"numbers\", function() { return numbers; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"VALIDATION_ATTR_WHITELIST\", function() { return VALIDATION_ATTR_WHITELIST; });\n/**\n * @license\n * Copyright 2016 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n/** @enum {string} */\nvar strings = {\n  ARIA_CONTROLS: 'aria-controls',\n  INPUT_SELECTOR: '.mdc-text-field__input',\n  LABEL_SELECTOR: '.mdc-floating-label',\n  ICON_SELECTOR: '.mdc-text-field__icon',\n  OUTLINE_SELECTOR: '.mdc-notched-outline',\n  LINE_RIPPLE_SELECTOR: '.mdc-line-ripple'\n};\n/** @enum {string} */\n\nvar cssClasses = {\n  ROOT: 'mdc-text-field',\n  UPGRADED: 'mdc-text-field--upgraded',\n  DISABLED: 'mdc-text-field--disabled',\n  DENSE: 'mdc-text-field--dense',\n  FOCUSED: 'mdc-text-field--focused',\n  INVALID: 'mdc-text-field--invalid',\n  BOX: 'mdc-text-field--box',\n  OUTLINED: 'mdc-text-field--outlined'\n};\n/** @enum {number} */\n\nvar numbers = {\n  LABEL_SCALE: 0.75,\n  DENSE_LABEL_SCALE: 0.923\n}; // whitelist based off of https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation\n// under section: `Validation-related attributes`\n\nvar VALIDATION_ATTR_WHITELIST = ['pattern', 'min', 'max', 'required', 'step', 'minlength', 'maxlength'];\n\n\n//# sourceURL=webpack:///./node_modules/@material/textfield/constants.js?");

  /***/ }),

  /***/ "./node_modules/@material/textfield/foundation.js":
  /*!********************************************************!*\
    !*** ./node_modules/@material/textfield/foundation.js ***!
    \********************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _material_base_foundation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @material/base/foundation */ \"./node_modules/@material/base/foundation.js\");\n/* harmony import */ var _helper_text_foundation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helper-text/foundation */ \"./node_modules/@material/textfield/helper-text/foundation.js\");\n/* harmony import */ var _icon_foundation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./icon/foundation */ \"./node_modules/@material/textfield/icon/foundation.js\");\n/* harmony import */ var _adapter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./adapter */ \"./node_modules/@material/textfield/adapter.js\");\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./constants */ \"./node_modules/@material/textfield/constants.js\");\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\n/**\n * @license\n * Copyright 2016 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n/* eslint-disable no-unused-vars */\n\n\n\n/* eslint-enable no-unused-vars */\n\n\n\n/**\n * @extends {MDCFoundation<!MDCTextFieldAdapter>}\n * @final\n */\n\nvar MDCTextFieldFoundation =\n/*#__PURE__*/\nfunction (_MDCFoundation) {\n  _inherits(MDCTextFieldFoundation, _MDCFoundation);\n\n  _createClass(MDCTextFieldFoundation, [{\n    key: \"shouldShake\",\n\n    /** @return {boolean} */\n    get: function get() {\n      return !this.isValid() && !this.isFocused_;\n    }\n    /** @return {boolean} */\n\n  }, {\n    key: \"shouldFloat\",\n    get: function get() {\n      return this.isFocused_ || !!this.getValue() || this.isBadInput_();\n    }\n    /**\n     * {@see MDCTextFieldAdapter} for typing information on parameters and return\n     * types.\n     * @return {!MDCTextFieldAdapter}\n     */\n\n  }], [{\n    key: \"cssClasses\",\n\n    /** @return enum {string} */\n    get: function get() {\n      return _constants__WEBPACK_IMPORTED_MODULE_4__[\"cssClasses\"];\n    }\n    /** @return enum {string} */\n\n  }, {\n    key: \"strings\",\n    get: function get() {\n      return _constants__WEBPACK_IMPORTED_MODULE_4__[\"strings\"];\n    }\n    /** @return enum {string} */\n\n  }, {\n    key: \"numbers\",\n    get: function get() {\n      return _constants__WEBPACK_IMPORTED_MODULE_4__[\"numbers\"];\n    }\n  }, {\n    key: \"defaultAdapter\",\n    get: function get() {\n      return (\n        /** @type {!MDCTextFieldAdapter} */\n        {\n          addClass: function addClass() {},\n          removeClass: function removeClass() {},\n          hasClass: function hasClass() {},\n          registerTextFieldInteractionHandler: function registerTextFieldInteractionHandler() {},\n          deregisterTextFieldInteractionHandler: function deregisterTextFieldInteractionHandler() {},\n          registerInputInteractionHandler: function registerInputInteractionHandler() {},\n          deregisterInputInteractionHandler: function deregisterInputInteractionHandler() {},\n          registerValidationAttributeChangeHandler: function registerValidationAttributeChangeHandler() {},\n          deregisterValidationAttributeChangeHandler: function deregisterValidationAttributeChangeHandler() {},\n          getNativeInput: function getNativeInput() {},\n          isFocused: function isFocused() {},\n          isRtl: function isRtl() {},\n          activateLineRipple: function activateLineRipple() {},\n          deactivateLineRipple: function deactivateLineRipple() {},\n          setLineRippleTransformOrigin: function setLineRippleTransformOrigin() {},\n          shakeLabel: function shakeLabel() {},\n          floatLabel: function floatLabel() {},\n          hasLabel: function hasLabel() {},\n          getLabelWidth: function getLabelWidth() {},\n          hasOutline: function hasOutline() {},\n          notchOutline: function notchOutline() {},\n          closeOutline: function closeOutline() {}\n        }\n      );\n    }\n    /**\n     * @param {!MDCTextFieldAdapter} adapter\n     * @param {!FoundationMapType=} foundationMap Map from subcomponent names to their subfoundations.\n     */\n\n  }]);\n\n  function MDCTextFieldFoundation(adapter) {\n    var _this;\n\n    var foundationMap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] :\n    /** @type {!FoundationMapType} */\n    {};\n\n    _classCallCheck(this, MDCTextFieldFoundation);\n\n    _this = _possibleConstructorReturn(this, _getPrototypeOf(MDCTextFieldFoundation).call(this, _extends(MDCTextFieldFoundation.defaultAdapter, adapter)));\n    /** @type {!MDCTextFieldHelperTextFoundation|undefined} */\n\n    _this.helperText_ = foundationMap.helperText;\n    /** @type {!MDCTextFieldIconFoundation|undefined} */\n\n    _this.icon_ = foundationMap.icon;\n    /** @private {boolean} */\n\n    _this.isFocused_ = false;\n    /** @private {boolean} */\n\n    _this.receivedUserInput_ = false;\n    /** @private {boolean} */\n\n    _this.useCustomValidityChecking_ = false;\n    /** @private {boolean} */\n\n    _this.isValid_ = true;\n    /** @private {function(): undefined} */\n\n    _this.inputFocusHandler_ = function () {\n      return _this.activateFocus();\n    };\n    /** @private {function(): undefined} */\n\n\n    _this.inputBlurHandler_ = function () {\n      return _this.deactivateFocus();\n    };\n    /** @private {function(): undefined} */\n\n\n    _this.inputInputHandler_ = function () {\n      return _this.autoCompleteFocus();\n    };\n    /** @private {function(!Event): undefined} */\n\n\n    _this.setPointerXOffset_ = function (evt) {\n      return _this.setTransformOrigin(evt);\n    };\n    /** @private {function(!Event): undefined} */\n\n\n    _this.textFieldInteractionHandler_ = function () {\n      return _this.handleTextFieldInteraction();\n    };\n    /** @private {function(!Array): undefined} */\n\n\n    _this.validationAttributeChangeHandler_ = function (attributesList) {\n      return _this.handleValidationAttributeChange(attributesList);\n    };\n    /** @private {!MutationObserver} */\n\n\n    _this.validationObserver_;\n    return _this;\n  }\n\n  _createClass(MDCTextFieldFoundation, [{\n    key: \"init\",\n    value: function init() {\n      var _this2 = this;\n\n      this.adapter_.addClass(MDCTextFieldFoundation.cssClasses.UPGRADED); // Ensure label does not collide with any pre-filled value.\n\n      if (this.adapter_.hasLabel() && (this.getValue() || this.isBadInput_())) {\n        this.adapter_.floatLabel(this.shouldFloat);\n        this.notchOutline(this.shouldFloat);\n      }\n\n      if (this.adapter_.isFocused()) {\n        this.inputFocusHandler_();\n      }\n\n      this.adapter_.registerInputInteractionHandler('focus', this.inputFocusHandler_);\n      this.adapter_.registerInputInteractionHandler('blur', this.inputBlurHandler_);\n      this.adapter_.registerInputInteractionHandler('input', this.inputInputHandler_);\n      ['mousedown', 'touchstart'].forEach(function (evtType) {\n        _this2.adapter_.registerInputInteractionHandler(evtType, _this2.setPointerXOffset_);\n      });\n      ['click', 'keydown'].forEach(function (evtType) {\n        _this2.adapter_.registerTextFieldInteractionHandler(evtType, _this2.textFieldInteractionHandler_);\n      });\n      this.validationObserver_ = this.adapter_.registerValidationAttributeChangeHandler(this.validationAttributeChangeHandler_);\n    }\n  }, {\n    key: \"destroy\",\n    value: function destroy() {\n      var _this3 = this;\n\n      this.adapter_.removeClass(MDCTextFieldFoundation.cssClasses.UPGRADED);\n      this.adapter_.deregisterInputInteractionHandler('focus', this.inputFocusHandler_);\n      this.adapter_.deregisterInputInteractionHandler('blur', this.inputBlurHandler_);\n      this.adapter_.deregisterInputInteractionHandler('input', this.inputInputHandler_);\n      ['mousedown', 'touchstart'].forEach(function (evtType) {\n        _this3.adapter_.deregisterInputInteractionHandler(evtType, _this3.setPointerXOffset_);\n      });\n      ['click', 'keydown'].forEach(function (evtType) {\n        _this3.adapter_.deregisterTextFieldInteractionHandler(evtType, _this3.textFieldInteractionHandler_);\n      });\n      this.adapter_.deregisterValidationAttributeChangeHandler(this.validationObserver_);\n    }\n    /**\n     * Handles user interactions with the Text Field.\n     */\n\n  }, {\n    key: \"handleTextFieldInteraction\",\n    value: function handleTextFieldInteraction() {\n      if (this.adapter_.getNativeInput().disabled) {\n        return;\n      }\n\n      this.receivedUserInput_ = true;\n    }\n    /**\n     * Handles validation attribute changes\n     * @param {!Array<string>} attributesList\n     */\n\n  }, {\n    key: \"handleValidationAttributeChange\",\n    value: function handleValidationAttributeChange(attributesList) {\n      var _this4 = this;\n\n      attributesList.some(function (attributeName) {\n        if (_constants__WEBPACK_IMPORTED_MODULE_4__[\"VALIDATION_ATTR_WHITELIST\"].indexOf(attributeName) > -1) {\n          _this4.styleValidity_(true);\n\n          return true;\n        }\n      });\n    }\n    /**\n     * Opens/closes the notched outline.\n     * @param {boolean} openNotch\n     */\n\n  }, {\n    key: \"notchOutline\",\n    value: function notchOutline(openNotch) {\n      if (!this.adapter_.hasOutline() || !this.adapter_.hasLabel()) {\n        return;\n      }\n\n      if (openNotch) {\n        var isDense = this.adapter_.hasClass(_constants__WEBPACK_IMPORTED_MODULE_4__[\"cssClasses\"].DENSE);\n        var labelScale = isDense ? _constants__WEBPACK_IMPORTED_MODULE_4__[\"numbers\"].DENSE_LABEL_SCALE : _constants__WEBPACK_IMPORTED_MODULE_4__[\"numbers\"].LABEL_SCALE;\n        var labelWidth = this.adapter_.getLabelWidth() * labelScale;\n        var isRtl = this.adapter_.isRtl();\n        this.adapter_.notchOutline(labelWidth, isRtl);\n      } else {\n        this.adapter_.closeOutline();\n      }\n    }\n    /**\n     * Activates the text field focus state.\n     */\n\n  }, {\n    key: \"activateFocus\",\n    value: function activateFocus() {\n      this.isFocused_ = true;\n      this.styleFocused_(this.isFocused_);\n      this.adapter_.activateLineRipple();\n      this.notchOutline(this.shouldFloat);\n\n      if (this.adapter_.hasLabel()) {\n        this.adapter_.shakeLabel(this.shouldShake);\n        this.adapter_.floatLabel(this.shouldFloat);\n      }\n\n      if (this.helperText_) {\n        this.helperText_.showToScreenReader();\n      }\n    }\n    /**\n     * Sets the line ripple's transform origin, so that the line ripple activate\n     * animation will animate out from the user's click location.\n     * @param {!Event} evt\n     */\n\n  }, {\n    key: \"setTransformOrigin\",\n    value: function setTransformOrigin(evt) {\n      var targetClientRect = evt.target.getBoundingClientRect();\n      var evtCoords = {\n        x: evt.clientX,\n        y: evt.clientY\n      };\n      var normalizedX = evtCoords.x - targetClientRect.left;\n      this.adapter_.setLineRippleTransformOrigin(normalizedX);\n    }\n    /**\n     * Activates the Text Field's focus state in cases when the input value\n     * changes without user input (e.g. programatically).\n     */\n\n  }, {\n    key: \"autoCompleteFocus\",\n    value: function autoCompleteFocus() {\n      if (!this.receivedUserInput_) {\n        this.activateFocus();\n      }\n    }\n    /**\n     * Deactivates the Text Field's focus state.\n     */\n\n  }, {\n    key: \"deactivateFocus\",\n    value: function deactivateFocus() {\n      this.isFocused_ = false;\n      this.adapter_.deactivateLineRipple();\n      var input = this.getNativeInput_();\n      var shouldRemoveLabelFloat = !input.value && !this.isBadInput_();\n      var isValid = this.isValid();\n      this.styleValidity_(isValid);\n      this.styleFocused_(this.isFocused_);\n\n      if (this.adapter_.hasLabel()) {\n        this.adapter_.shakeLabel(this.shouldShake);\n        this.adapter_.floatLabel(this.shouldFloat);\n        this.notchOutline(this.shouldFloat);\n      }\n\n      if (shouldRemoveLabelFloat) {\n        this.receivedUserInput_ = false;\n      }\n    }\n    /**\n     * @return {string} The value of the input Element.\n     */\n\n  }, {\n    key: \"getValue\",\n    value: function getValue() {\n      return this.getNativeInput_().value;\n    }\n    /**\n     * @param {string} value The value to set on the input Element.\n     */\n\n  }, {\n    key: \"setValue\",\n    value: function setValue(value) {\n      this.getNativeInput_().value = value;\n      var isValid = this.isValid();\n      this.styleValidity_(isValid);\n\n      if (this.adapter_.hasLabel()) {\n        this.adapter_.shakeLabel(this.shouldShake);\n        this.adapter_.floatLabel(this.shouldFloat);\n        this.notchOutline(this.shouldFloat);\n      }\n    }\n    /**\n     * @return {boolean} If a custom validity is set, returns that value.\n     *     Otherwise, returns the result of native validity checks.\n     */\n\n  }, {\n    key: \"isValid\",\n    value: function isValid() {\n      return this.useCustomValidityChecking_ ? this.isValid_ : this.isNativeInputValid_();\n    }\n    /**\n     * @param {boolean} isValid Sets the validity state of the Text Field.\n     */\n\n  }, {\n    key: \"setValid\",\n    value: function setValid(isValid) {\n      this.useCustomValidityChecking_ = true;\n      this.isValid_ = isValid; // Retrieve from the getter to ensure correct logic is applied.\n\n      isValid = this.isValid();\n      this.styleValidity_(isValid);\n\n      if (this.adapter_.hasLabel()) {\n        this.adapter_.shakeLabel(this.shouldShake);\n      }\n    }\n    /**\n     * @return {boolean} True if the Text Field is disabled.\n     */\n\n  }, {\n    key: \"isDisabled\",\n    value: function isDisabled() {\n      return this.getNativeInput_().disabled;\n    }\n    /**\n     * @param {boolean} disabled Sets the text-field disabled or enabled.\n     */\n\n  }, {\n    key: \"setDisabled\",\n    value: function setDisabled(disabled) {\n      this.getNativeInput_().disabled = disabled;\n      this.styleDisabled_(disabled);\n    }\n    /**\n     * @param {string} content Sets the content of the helper text.\n     */\n\n  }, {\n    key: \"setHelperTextContent\",\n    value: function setHelperTextContent(content) {\n      if (this.helperText_) {\n        this.helperText_.setContent(content);\n      }\n    }\n    /**\n     * Sets the aria label of the icon.\n     * @param {string} label\n     */\n\n  }, {\n    key: \"setIconAriaLabel\",\n    value: function setIconAriaLabel(label) {\n      if (this.icon_) {\n        this.icon_.setAriaLabel(label);\n      }\n    }\n    /**\n     * Sets the text content of the icon.\n     * @param {string} content\n     */\n\n  }, {\n    key: \"setIconContent\",\n    value: function setIconContent(content) {\n      if (this.icon_) {\n        this.icon_.setContent(content);\n      }\n    }\n    /**\n     * @return {boolean} True if the Text Field input fails in converting the\n     *     user-supplied value.\n     * @private\n     */\n\n  }, {\n    key: \"isBadInput_\",\n    value: function isBadInput_() {\n      return this.getNativeInput_().validity.badInput;\n    }\n    /**\n     * @return {boolean} The result of native validity checking\n     *     (ValidityState.valid).\n     */\n\n  }, {\n    key: \"isNativeInputValid_\",\n    value: function isNativeInputValid_() {\n      return this.getNativeInput_().validity.valid;\n    }\n    /**\n     * Styles the component based on the validity state.\n     * @param {boolean} isValid\n     * @private\n     */\n\n  }, {\n    key: \"styleValidity_\",\n    value: function styleValidity_(isValid) {\n      var INVALID = MDCTextFieldFoundation.cssClasses.INVALID;\n\n      if (isValid) {\n        this.adapter_.removeClass(INVALID);\n      } else {\n        this.adapter_.addClass(INVALID);\n      }\n\n      if (this.helperText_) {\n        this.helperText_.setValidity(isValid);\n      }\n    }\n    /**\n     * Styles the component based on the focused state.\n     * @param {boolean} isFocused\n     * @private\n     */\n\n  }, {\n    key: \"styleFocused_\",\n    value: function styleFocused_(isFocused) {\n      var FOCUSED = MDCTextFieldFoundation.cssClasses.FOCUSED;\n\n      if (isFocused) {\n        this.adapter_.addClass(FOCUSED);\n      } else {\n        this.adapter_.removeClass(FOCUSED);\n      }\n    }\n    /**\n     * Styles the component based on the disabled state.\n     * @param {boolean} isDisabled\n     * @private\n     */\n\n  }, {\n    key: \"styleDisabled_\",\n    value: function styleDisabled_(isDisabled) {\n      var _MDCTextFieldFoundati = MDCTextFieldFoundation.cssClasses,\n          DISABLED = _MDCTextFieldFoundati.DISABLED,\n          INVALID = _MDCTextFieldFoundati.INVALID;\n\n      if (isDisabled) {\n        this.adapter_.addClass(DISABLED);\n        this.adapter_.removeClass(INVALID);\n      } else {\n        this.adapter_.removeClass(DISABLED);\n      }\n\n      if (this.icon_) {\n        this.icon_.setDisabled(isDisabled);\n      }\n    }\n    /**\n     * @return {!Element|!NativeInputType} The native text input from the\n     * host environment, or a dummy if none exists.\n     * @private\n     */\n\n  }, {\n    key: \"getNativeInput_\",\n    value: function getNativeInput_() {\n      return this.adapter_.getNativeInput() ||\n      /** @type {!NativeInputType} */\n      {\n        value: '',\n        disabled: false,\n        validity: {\n          badInput: false,\n          valid: true\n        }\n      };\n    }\n  }]);\n\n  return MDCTextFieldFoundation;\n}(_material_base_foundation__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MDCTextFieldFoundation);\n\n//# sourceURL=webpack:///./node_modules/@material/textfield/foundation.js?");

  /***/ }),

  /***/ "./node_modules/@material/textfield/helper-text/adapter.js":
  /*!*****************************************************************!*\
    !*** ./node_modules/@material/textfield/helper-text/adapter.js ***!
    \*****************************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n/**\n * @license\n * Copyright 2017 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n/* eslint no-unused-vars: [2, {\"args\": \"none\"}] */\n\n/**\n * Adapter for MDC Text Field Helper Text.\n *\n * Defines the shape of the adapter expected by the foundation. Implement this\n * adapter to integrate the TextField helper text into your framework. See\n * https://github.com/material-components/material-components-web/blob/master/docs/authoring-components.md\n * for more information.\n *\n * @record\n */\nvar MDCTextFieldHelperTextAdapter =\n/*#__PURE__*/\nfunction () {\n  function MDCTextFieldHelperTextAdapter() {\n    _classCallCheck(this, MDCTextFieldHelperTextAdapter);\n  }\n\n  _createClass(MDCTextFieldHelperTextAdapter, [{\n    key: \"addClass\",\n\n    /**\n     * Adds a class to the helper text element.\n     * @param {string} className\n     */\n    value: function addClass(className) {}\n    /**\n     * Removes a class from the helper text element.\n     * @param {string} className\n     */\n\n  }, {\n    key: \"removeClass\",\n    value: function removeClass(className) {}\n    /**\n     * Returns whether or not the helper text element contains the given class.\n     * @param {string} className\n     * @return {boolean}\n     */\n\n  }, {\n    key: \"hasClass\",\n    value: function hasClass(className) {}\n    /**\n     * Sets an attribute with a given value on the helper text element.\n     * @param {string} attr\n     * @param {string} value\n     */\n\n  }, {\n    key: \"setAttr\",\n    value: function setAttr(attr, value) {}\n    /**\n     * Removes an attribute from the helper text element.\n     * @param {string} attr\n     */\n\n  }, {\n    key: \"removeAttr\",\n    value: function removeAttr(attr) {}\n    /**\n     * Sets the text content for the helper text element.\n     * @param {string} content\n     */\n\n  }, {\n    key: \"setContent\",\n    value: function setContent(content) {}\n  }]);\n\n  return MDCTextFieldHelperTextAdapter;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MDCTextFieldHelperTextAdapter);\n\n//# sourceURL=webpack:///./node_modules/@material/textfield/helper-text/adapter.js?");

  /***/ }),

  /***/ "./node_modules/@material/textfield/helper-text/constants.js":
  /*!*******************************************************************!*\
    !*** ./node_modules/@material/textfield/helper-text/constants.js ***!
    \*******************************************************************/
  /*! exports provided: strings, cssClasses */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"strings\", function() { return strings; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"cssClasses\", function() { return cssClasses; });\n/**\n * @license\n * Copyright 2016 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n/** @enum {string} */\nvar strings = {\n  ARIA_HIDDEN: 'aria-hidden',\n  ROLE: 'role'\n};\n/** @enum {string} */\n\nvar cssClasses = {\n  HELPER_TEXT_PERSISTENT: 'mdc-text-field-helper-text--persistent',\n  HELPER_TEXT_VALIDATION_MSG: 'mdc-text-field-helper-text--validation-msg'\n};\n\n\n//# sourceURL=webpack:///./node_modules/@material/textfield/helper-text/constants.js?");

  /***/ }),

  /***/ "./node_modules/@material/textfield/helper-text/foundation.js":
  /*!********************************************************************!*\
    !*** ./node_modules/@material/textfield/helper-text/foundation.js ***!
    \********************************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _material_base_foundation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @material/base/foundation */ \"./node_modules/@material/base/foundation.js\");\n/* harmony import */ var _adapter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./adapter */ \"./node_modules/@material/textfield/helper-text/adapter.js\");\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ \"./node_modules/@material/textfield/helper-text/constants.js\");\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\n/**\n * @license\n * Copyright 2017 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n\n\n/**\n * @extends {MDCFoundation<!MDCTextFieldHelperTextAdapter>}\n * @final\n */\n\nvar MDCTextFieldHelperTextFoundation =\n/*#__PURE__*/\nfunction (_MDCFoundation) {\n  _inherits(MDCTextFieldHelperTextFoundation, _MDCFoundation);\n\n  _createClass(MDCTextFieldHelperTextFoundation, null, [{\n    key: \"cssClasses\",\n\n    /** @return enum {string} */\n    get: function get() {\n      return _constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"];\n    }\n    /** @return enum {string} */\n\n  }, {\n    key: \"strings\",\n    get: function get() {\n      return _constants__WEBPACK_IMPORTED_MODULE_2__[\"strings\"];\n    }\n    /**\n     * {@see MDCTextFieldHelperTextAdapter} for typing information on parameters and return\n     * types.\n     * @return {!MDCTextFieldHelperTextAdapter}\n     */\n\n  }, {\n    key: \"defaultAdapter\",\n    get: function get() {\n      return (\n        /** @type {!MDCTextFieldHelperTextAdapter} */\n        {\n          addClass: function addClass() {},\n          removeClass: function removeClass() {},\n          hasClass: function hasClass() {},\n          setAttr: function setAttr() {},\n          removeAttr: function removeAttr() {},\n          setContent: function setContent() {}\n        }\n      );\n    }\n    /**\n     * @param {!MDCTextFieldHelperTextAdapter} adapter\n     */\n\n  }]);\n\n  function MDCTextFieldHelperTextFoundation(adapter) {\n    _classCallCheck(this, MDCTextFieldHelperTextFoundation);\n\n    return _possibleConstructorReturn(this, _getPrototypeOf(MDCTextFieldHelperTextFoundation).call(this, _extends(MDCTextFieldHelperTextFoundation.defaultAdapter, adapter)));\n  }\n  /**\n   * Sets the content of the helper text field.\n   * @param {string} content\n   */\n\n\n  _createClass(MDCTextFieldHelperTextFoundation, [{\n    key: \"setContent\",\n    value: function setContent(content) {\n      this.adapter_.setContent(content);\n    }\n    /** @param {boolean} isPersistent Sets the persistency of the helper text. */\n\n  }, {\n    key: \"setPersistent\",\n    value: function setPersistent(isPersistent) {\n      if (isPersistent) {\n        this.adapter_.addClass(_constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"].HELPER_TEXT_PERSISTENT);\n      } else {\n        this.adapter_.removeClass(_constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"].HELPER_TEXT_PERSISTENT);\n      }\n    }\n    /**\n     * @param {boolean} isValidation True to make the helper text act as an\n     *   error validation message.\n     */\n\n  }, {\n    key: \"setValidation\",\n    value: function setValidation(isValidation) {\n      if (isValidation) {\n        this.adapter_.addClass(_constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"].HELPER_TEXT_VALIDATION_MSG);\n      } else {\n        this.adapter_.removeClass(_constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"].HELPER_TEXT_VALIDATION_MSG);\n      }\n    }\n    /** Makes the helper text visible to the screen reader. */\n\n  }, {\n    key: \"showToScreenReader\",\n    value: function showToScreenReader() {\n      this.adapter_.removeAttr(_constants__WEBPACK_IMPORTED_MODULE_2__[\"strings\"].ARIA_HIDDEN);\n    }\n    /**\n     * Sets the validity of the helper text based on the input validity.\n     * @param {boolean} inputIsValid\n     */\n\n  }, {\n    key: \"setValidity\",\n    value: function setValidity(inputIsValid) {\n      var helperTextIsPersistent = this.adapter_.hasClass(_constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"].HELPER_TEXT_PERSISTENT);\n      var helperTextIsValidationMsg = this.adapter_.hasClass(_constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"].HELPER_TEXT_VALIDATION_MSG);\n      var validationMsgNeedsDisplay = helperTextIsValidationMsg && !inputIsValid;\n\n      if (validationMsgNeedsDisplay) {\n        this.adapter_.setAttr(_constants__WEBPACK_IMPORTED_MODULE_2__[\"strings\"].ROLE, 'alert');\n      } else {\n        this.adapter_.removeAttr(_constants__WEBPACK_IMPORTED_MODULE_2__[\"strings\"].ROLE);\n      }\n\n      if (!helperTextIsPersistent && !validationMsgNeedsDisplay) {\n        this.hide_();\n      }\n    }\n    /**\n     * Hides the help text from screen readers.\n     * @private\n     */\n\n  }, {\n    key: \"hide_\",\n    value: function hide_() {\n      this.adapter_.setAttr(_constants__WEBPACK_IMPORTED_MODULE_2__[\"strings\"].ARIA_HIDDEN, 'true');\n    }\n  }]);\n\n  return MDCTextFieldHelperTextFoundation;\n}(_material_base_foundation__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MDCTextFieldHelperTextFoundation);\n\n//# sourceURL=webpack:///./node_modules/@material/textfield/helper-text/foundation.js?");

  /***/ }),

  /***/ "./node_modules/@material/textfield/helper-text/index.js":
  /*!***************************************************************!*\
    !*** ./node_modules/@material/textfield/helper-text/index.js ***!
    \***************************************************************/
  /*! exports provided: MDCTextFieldHelperText, MDCTextFieldHelperTextFoundation */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MDCTextFieldHelperText\", function() { return MDCTextFieldHelperText; });\n/* harmony import */ var _material_base_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @material/base/component */ \"./node_modules/@material/base/component.js\");\n/* harmony import */ var _adapter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./adapter */ \"./node_modules/@material/textfield/helper-text/adapter.js\");\n/* harmony import */ var _foundation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./foundation */ \"./node_modules/@material/textfield/helper-text/foundation.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"MDCTextFieldHelperTextFoundation\", function() { return _foundation__WEBPACK_IMPORTED_MODULE_2__[\"default\"]; });\n\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\n/**\n * @license\n * Copyright 2017 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n\n\n/**\n * @extends {MDCComponent<!MDCTextFieldHelperTextFoundation>}\n * @final\n */\n\nvar MDCTextFieldHelperText =\n/*#__PURE__*/\nfunction (_MDCComponent) {\n  _inherits(MDCTextFieldHelperText, _MDCComponent);\n\n  function MDCTextFieldHelperText() {\n    _classCallCheck(this, MDCTextFieldHelperText);\n\n    return _possibleConstructorReturn(this, _getPrototypeOf(MDCTextFieldHelperText).apply(this, arguments));\n  }\n\n  _createClass(MDCTextFieldHelperText, [{\n    key: \"getDefaultFoundation\",\n\n    /**\n     * @return {!MDCTextFieldHelperTextFoundation}\n     */\n    value: function getDefaultFoundation() {\n      var _this = this;\n\n      return new _foundation__WEBPACK_IMPORTED_MODULE_2__[\"default\"](\n      /** @type {!MDCTextFieldHelperTextAdapter} */\n      _extends({\n        addClass: function addClass(className) {\n          return _this.root_.classList.add(className);\n        },\n        removeClass: function removeClass(className) {\n          return _this.root_.classList.remove(className);\n        },\n        hasClass: function hasClass(className) {\n          return _this.root_.classList.contains(className);\n        },\n        setAttr: function setAttr(attr, value) {\n          return _this.root_.setAttribute(attr, value);\n        },\n        removeAttr: function removeAttr(attr) {\n          return _this.root_.removeAttribute(attr);\n        },\n        setContent: function setContent(content) {\n          _this.root_.textContent = content;\n        }\n      }));\n    }\n  }, {\n    key: \"foundation\",\n\n    /**\n     * @return {!MDCTextFieldHelperTextFoundation}\n     */\n    get: function get() {\n      return this.foundation_;\n    }\n  }], [{\n    key: \"attachTo\",\n\n    /**\n     * @param {!Element} root\n     * @return {!MDCTextFieldHelperText}\n     */\n    value: function attachTo(root) {\n      return new MDCTextFieldHelperText(root);\n    }\n  }]);\n\n  return MDCTextFieldHelperText;\n}(_material_base_component__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n\n\n\n//# sourceURL=webpack:///./node_modules/@material/textfield/helper-text/index.js?");

  /***/ }),

  /***/ "./node_modules/@material/textfield/icon/adapter.js":
  /*!**********************************************************!*\
    !*** ./node_modules/@material/textfield/icon/adapter.js ***!
    \**********************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n/**\n * @license\n * Copyright 2017 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n/* eslint no-unused-vars: [2, {\"args\": \"none\"}] */\n\n/**\n * Adapter for MDC Text Field Icon.\n *\n * Defines the shape of the adapter expected by the foundation. Implement this\n * adapter to integrate the text field icon into your framework. See\n * https://github.com/material-components/material-components-web/blob/master/docs/authoring-components.md\n * for more information.\n *\n * @record\n */\nvar MDCTextFieldIconAdapter =\n/*#__PURE__*/\nfunction () {\n  function MDCTextFieldIconAdapter() {\n    _classCallCheck(this, MDCTextFieldIconAdapter);\n  }\n\n  _createClass(MDCTextFieldIconAdapter, [{\n    key: \"getAttr\",\n\n    /**\n     * Gets the value of an attribute on the icon element.\n     * @param {string} attr\n     * @return {string}\n     */\n    value: function getAttr(attr) {}\n    /**\n     * Sets an attribute on the icon element.\n     * @param {string} attr\n     * @param {string} value\n     */\n\n  }, {\n    key: \"setAttr\",\n    value: function setAttr(attr, value) {}\n    /**\n     * Removes an attribute from the icon element.\n     * @param {string} attr\n     */\n\n  }, {\n    key: \"removeAttr\",\n    value: function removeAttr(attr) {}\n    /**\n     * Sets the text content of the icon element.\n     * @param {string} content\n     */\n\n  }, {\n    key: \"setContent\",\n    value: function setContent(content) {}\n    /**\n     * Registers an event listener on the icon element for a given event.\n     * @param {string} evtType\n     * @param {function(!Event): undefined} handler\n     */\n\n  }, {\n    key: \"registerInteractionHandler\",\n    value: function registerInteractionHandler(evtType, handler) {}\n    /**\n     * Deregisters an event listener on the icon element for a given event.\n     * @param {string} evtType\n     * @param {function(!Event): undefined} handler\n     */\n\n  }, {\n    key: \"deregisterInteractionHandler\",\n    value: function deregisterInteractionHandler(evtType, handler) {}\n    /**\n     * Emits a custom event \"MDCTextField:icon\" denoting a user has clicked the icon.\n     */\n\n  }, {\n    key: \"notifyIconAction\",\n    value: function notifyIconAction() {}\n  }]);\n\n  return MDCTextFieldIconAdapter;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MDCTextFieldIconAdapter);\n\n//# sourceURL=webpack:///./node_modules/@material/textfield/icon/adapter.js?");

  /***/ }),

  /***/ "./node_modules/@material/textfield/icon/constants.js":
  /*!************************************************************!*\
    !*** ./node_modules/@material/textfield/icon/constants.js ***!
    \************************************************************/
  /*! exports provided: strings */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"strings\", function() { return strings; });\n/**\n * @license\n * Copyright 2016 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n/** @enum {string} */\nvar strings = {\n  ICON_EVENT: 'MDCTextField:icon',\n  ICON_ROLE: 'button'\n};\n\n\n//# sourceURL=webpack:///./node_modules/@material/textfield/icon/constants.js?");

  /***/ }),

  /***/ "./node_modules/@material/textfield/icon/foundation.js":
  /*!*************************************************************!*\
    !*** ./node_modules/@material/textfield/icon/foundation.js ***!
    \*************************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _material_base_foundation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @material/base/foundation */ \"./node_modules/@material/base/foundation.js\");\n/* harmony import */ var _adapter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./adapter */ \"./node_modules/@material/textfield/icon/adapter.js\");\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ \"./node_modules/@material/textfield/icon/constants.js\");\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\n/**\n * @license\n * Copyright 2017 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n\n\n/**\n * @extends {MDCFoundation<!MDCTextFieldIconAdapter>}\n * @final\n */\n\nvar MDCTextFieldIconFoundation =\n/*#__PURE__*/\nfunction (_MDCFoundation) {\n  _inherits(MDCTextFieldIconFoundation, _MDCFoundation);\n\n  _createClass(MDCTextFieldIconFoundation, null, [{\n    key: \"strings\",\n\n    /** @return enum {string} */\n    get: function get() {\n      return _constants__WEBPACK_IMPORTED_MODULE_2__[\"strings\"];\n    }\n    /**\n     * {@see MDCTextFieldIconAdapter} for typing information on parameters and return\n     * types.\n     * @return {!MDCTextFieldIconAdapter}\n     */\n\n  }, {\n    key: \"defaultAdapter\",\n    get: function get() {\n      return (\n        /** @type {!MDCTextFieldIconAdapter} */\n        {\n          getAttr: function getAttr() {},\n          setAttr: function setAttr() {},\n          removeAttr: function removeAttr() {},\n          setContent: function setContent() {},\n          registerInteractionHandler: function registerInteractionHandler() {},\n          deregisterInteractionHandler: function deregisterInteractionHandler() {},\n          notifyIconAction: function notifyIconAction() {}\n        }\n      );\n    }\n    /**\n     * @param {!MDCTextFieldIconAdapter} adapter\n     */\n\n  }]);\n\n  function MDCTextFieldIconFoundation(adapter) {\n    var _this;\n\n    _classCallCheck(this, MDCTextFieldIconFoundation);\n\n    _this = _possibleConstructorReturn(this, _getPrototypeOf(MDCTextFieldIconFoundation).call(this, _extends(MDCTextFieldIconFoundation.defaultAdapter, adapter)));\n    /** @private {string?} */\n\n    _this.savedTabIndex_ = null;\n    /** @private {function(!Event): undefined} */\n\n    _this.interactionHandler_ = function (evt) {\n      return _this.handleInteraction(evt);\n    };\n\n    return _this;\n  }\n\n  _createClass(MDCTextFieldIconFoundation, [{\n    key: \"init\",\n    value: function init() {\n      var _this2 = this;\n\n      this.savedTabIndex_ = this.adapter_.getAttr('tabindex');\n      ['click', 'keydown'].forEach(function (evtType) {\n        _this2.adapter_.registerInteractionHandler(evtType, _this2.interactionHandler_);\n      });\n    }\n  }, {\n    key: \"destroy\",\n    value: function destroy() {\n      var _this3 = this;\n\n      ['click', 'keydown'].forEach(function (evtType) {\n        _this3.adapter_.deregisterInteractionHandler(evtType, _this3.interactionHandler_);\n      });\n    }\n    /** @param {boolean} disabled */\n\n  }, {\n    key: \"setDisabled\",\n    value: function setDisabled(disabled) {\n      if (!this.savedTabIndex_) {\n        return;\n      }\n\n      if (disabled) {\n        this.adapter_.setAttr('tabindex', '-1');\n        this.adapter_.removeAttr('role');\n      } else {\n        this.adapter_.setAttr('tabindex', this.savedTabIndex_);\n        this.adapter_.setAttr('role', _constants__WEBPACK_IMPORTED_MODULE_2__[\"strings\"].ICON_ROLE);\n      }\n    }\n    /** @param {string} label */\n\n  }, {\n    key: \"setAriaLabel\",\n    value: function setAriaLabel(label) {\n      this.adapter_.setAttr('aria-label', label);\n    }\n    /** @param {string} content */\n\n  }, {\n    key: \"setContent\",\n    value: function setContent(content) {\n      this.adapter_.setContent(content);\n    }\n    /**\n     * Handles an interaction event\n     * @param {!Event} evt\n     */\n\n  }, {\n    key: \"handleInteraction\",\n    value: function handleInteraction(evt) {\n      if (evt.type === 'click' || evt.key === 'Enter' || evt.keyCode === 13) {\n        this.adapter_.notifyIconAction();\n      }\n    }\n  }]);\n\n  return MDCTextFieldIconFoundation;\n}(_material_base_foundation__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MDCTextFieldIconFoundation);\n\n//# sourceURL=webpack:///./node_modules/@material/textfield/icon/foundation.js?");

  /***/ }),

  /***/ "./node_modules/@material/textfield/icon/index.js":
  /*!********************************************************!*\
    !*** ./node_modules/@material/textfield/icon/index.js ***!
    \********************************************************/
  /*! exports provided: MDCTextFieldIcon, MDCTextFieldIconFoundation */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MDCTextFieldIcon\", function() { return MDCTextFieldIcon; });\n/* harmony import */ var _material_base_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @material/base/component */ \"./node_modules/@material/base/component.js\");\n/* harmony import */ var _adapter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./adapter */ \"./node_modules/@material/textfield/icon/adapter.js\");\n/* harmony import */ var _foundation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./foundation */ \"./node_modules/@material/textfield/icon/foundation.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"MDCTextFieldIconFoundation\", function() { return _foundation__WEBPACK_IMPORTED_MODULE_2__[\"default\"]; });\n\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\n/**\n * @license\n * Copyright 2017 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n\n\n/**\n * @extends {MDCComponent<!MDCTextFieldIconFoundation>}\n * @final\n */\n\nvar MDCTextFieldIcon =\n/*#__PURE__*/\nfunction (_MDCComponent) {\n  _inherits(MDCTextFieldIcon, _MDCComponent);\n\n  function MDCTextFieldIcon() {\n    _classCallCheck(this, MDCTextFieldIcon);\n\n    return _possibleConstructorReturn(this, _getPrototypeOf(MDCTextFieldIcon).apply(this, arguments));\n  }\n\n  _createClass(MDCTextFieldIcon, [{\n    key: \"getDefaultFoundation\",\n\n    /**\n     * @return {!MDCTextFieldIconFoundation}\n     */\n    value: function getDefaultFoundation() {\n      var _this = this;\n\n      return new _foundation__WEBPACK_IMPORTED_MODULE_2__[\"default\"](\n      /** @type {!MDCTextFieldIconAdapter} */\n      _extends({\n        getAttr: function getAttr(attr) {\n          return _this.root_.getAttribute(attr);\n        },\n        setAttr: function setAttr(attr, value) {\n          return _this.root_.setAttribute(attr, value);\n        },\n        removeAttr: function removeAttr(attr) {\n          return _this.root_.removeAttribute(attr);\n        },\n        setContent: function setContent(content) {\n          _this.root_.textContent = content;\n        },\n        registerInteractionHandler: function registerInteractionHandler(evtType, handler) {\n          return _this.root_.addEventListener(evtType, handler);\n        },\n        deregisterInteractionHandler: function deregisterInteractionHandler(evtType, handler) {\n          return _this.root_.removeEventListener(evtType, handler);\n        },\n        notifyIconAction: function notifyIconAction() {\n          return _this.emit(_foundation__WEBPACK_IMPORTED_MODULE_2__[\"default\"].strings.ICON_EVENT, {}\n          /* evtData */\n          , true\n          /* shouldBubble */\n          );\n        }\n      }));\n    }\n  }, {\n    key: \"foundation\",\n\n    /**\n     * @return {!MDCTextFieldIconFoundation}\n     */\n    get: function get() {\n      return this.foundation_;\n    }\n  }], [{\n    key: \"attachTo\",\n\n    /**\n     * @param {!Element} root\n     * @return {!MDCTextFieldIcon}\n     */\n    value: function attachTo(root) {\n      return new MDCTextFieldIcon(root);\n    }\n  }]);\n\n  return MDCTextFieldIcon;\n}(_material_base_component__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n\n\n\n//# sourceURL=webpack:///./node_modules/@material/textfield/icon/index.js?");

  /***/ }),

  /***/ "./node_modules/@material/textfield/index.js":
  /*!***************************************************!*\
    !*** ./node_modules/@material/textfield/index.js ***!
    \***************************************************/
  /*! exports provided: MDCTextField, MDCTextFieldFoundation, MDCTextFieldHelperText, MDCTextFieldHelperTextFoundation, MDCTextFieldIcon, MDCTextFieldIconFoundation */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MDCTextField\", function() { return MDCTextField; });\n/* harmony import */ var _material_base_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @material/base/component */ \"./node_modules/@material/base/component.js\");\n/* harmony import */ var _material_ripple_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @material/ripple/index */ \"./node_modules/@material/ripple/index.js\");\n/* harmony import */ var _material_ripple_util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @material/ripple/util */ \"./node_modules/@material/ripple/util.js\");\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constants */ \"./node_modules/@material/textfield/constants.js\");\n/* harmony import */ var _adapter__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./adapter */ \"./node_modules/@material/textfield/adapter.js\");\n/* harmony import */ var _foundation__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./foundation */ \"./node_modules/@material/textfield/foundation.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"MDCTextFieldFoundation\", function() { return _foundation__WEBPACK_IMPORTED_MODULE_5__[\"default\"]; });\n\n/* harmony import */ var _material_line_ripple_index__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @material/line-ripple/index */ \"./node_modules/@material/line-ripple/index.js\");\n/* harmony import */ var _helper_text_index__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./helper-text/index */ \"./node_modules/@material/textfield/helper-text/index.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"MDCTextFieldHelperText\", function() { return _helper_text_index__WEBPACK_IMPORTED_MODULE_7__[\"MDCTextFieldHelperText\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"MDCTextFieldHelperTextFoundation\", function() { return _helper_text_index__WEBPACK_IMPORTED_MODULE_7__[\"MDCTextFieldHelperTextFoundation\"]; });\n\n/* harmony import */ var _icon_index__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./icon/index */ \"./node_modules/@material/textfield/icon/index.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"MDCTextFieldIcon\", function() { return _icon_index__WEBPACK_IMPORTED_MODULE_8__[\"MDCTextFieldIcon\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"MDCTextFieldIconFoundation\", function() { return _icon_index__WEBPACK_IMPORTED_MODULE_8__[\"MDCTextFieldIconFoundation\"]; });\n\n/* harmony import */ var _material_floating_label_index__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @material/floating-label/index */ \"./node_modules/@material/floating-label/index.js\");\n/* harmony import */ var _material_notched_outline_index__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @material/notched-outline/index */ \"./node_modules/@material/notched-outline/index.js\");\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _get(target, property, receiver) { if (typeof Reflect !== \"undefined\" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }\n\nfunction _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\n/**\n * @license\n * Copyright 2016 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n/* eslint-disable no-unused-vars */\n\n\n/* eslint-enable no-unused-vars */\n\n\n\n\n\n/* eslint-disable no-unused-vars */\n\n\n\n\n\n\n/* eslint-enable no-unused-vars */\n\n/**\n * @extends {MDCComponent<!MDCTextFieldFoundation>}\n * @final\n */\n\nvar MDCTextField =\n/*#__PURE__*/\nfunction (_MDCComponent) {\n  _inherits(MDCTextField, _MDCComponent);\n\n  /**\n   * @param {...?} args\n   */\n  function MDCTextField() {\n    var _getPrototypeOf2;\n\n    var _this;\n\n    _classCallCheck(this, MDCTextField);\n\n    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {\n      args[_key] = arguments[_key];\n    }\n\n    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(MDCTextField)).call.apply(_getPrototypeOf2, [this].concat(args)));\n    /** @private {?Element} */\n\n    _this.input_;\n    /** @type {?MDCRipple} */\n\n    _this.ripple;\n    /** @private {?MDCLineRipple} */\n\n    _this.lineRipple_;\n    /** @private {?MDCTextFieldHelperText} */\n\n    _this.helperText_;\n    /** @private {?MDCTextFieldIcon} */\n\n    _this.icon_;\n    /** @private {?MDCFloatingLabel} */\n\n    _this.label_;\n    /** @private {?MDCNotchedOutline} */\n\n    _this.outline_;\n    return _this;\n  }\n  /**\n   * @param {!Element} root\n   * @return {!MDCTextField}\n   */\n\n\n  _createClass(MDCTextField, [{\n    key: \"initialize\",\n\n    /**\n     * @param {(function(!Element): !MDCRipple)=} rippleFactory A function which\n     * creates a new MDCRipple.\n     * @param {(function(!Element): !MDCLineRipple)=} lineRippleFactory A function which\n     * creates a new MDCLineRipple.\n     * @param {(function(!Element): !MDCTextFieldHelperText)=} helperTextFactory A function which\n     * creates a new MDCTextFieldHelperText.\n     * @param {(function(!Element): !MDCTextFieldIcon)=} iconFactory A function which\n     * creates a new MDCTextFieldIcon.\n     * @param {(function(!Element): !MDCFloatingLabel)=} labelFactory A function which\n     * creates a new MDCFloatingLabel.\n     * @param {(function(!Element): !MDCNotchedOutline)=} outlineFactory A function which\n     * creates a new MDCNotchedOutline.\n     */\n    value: function initialize() {\n      var _this2 = this;\n\n      var rippleFactory = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (el, foundation) {\n        return new _material_ripple_index__WEBPACK_IMPORTED_MODULE_1__[\"MDCRipple\"](el, foundation);\n      };\n      var lineRippleFactory = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (el) {\n        return new _material_line_ripple_index__WEBPACK_IMPORTED_MODULE_6__[\"MDCLineRipple\"](el);\n      };\n      var helperTextFactory = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (el) {\n        return new _helper_text_index__WEBPACK_IMPORTED_MODULE_7__[\"MDCTextFieldHelperText\"](el);\n      };\n      var iconFactory = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function (el) {\n        return new _icon_index__WEBPACK_IMPORTED_MODULE_8__[\"MDCTextFieldIcon\"](el);\n      };\n      var labelFactory = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : function (el) {\n        return new _material_floating_label_index__WEBPACK_IMPORTED_MODULE_9__[\"MDCFloatingLabel\"](el);\n      };\n      var outlineFactory = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : function (el) {\n        return new _material_notched_outline_index__WEBPACK_IMPORTED_MODULE_10__[\"MDCNotchedOutline\"](el);\n      };\n      this.input_ = this.root_.querySelector(_constants__WEBPACK_IMPORTED_MODULE_3__[\"strings\"].INPUT_SELECTOR);\n      var labelElement = this.root_.querySelector(_constants__WEBPACK_IMPORTED_MODULE_3__[\"strings\"].LABEL_SELECTOR);\n\n      if (labelElement) {\n        this.label_ = labelFactory(labelElement);\n      }\n\n      var lineRippleElement = this.root_.querySelector(_constants__WEBPACK_IMPORTED_MODULE_3__[\"strings\"].LINE_RIPPLE_SELECTOR);\n\n      if (lineRippleElement) {\n        this.lineRipple_ = lineRippleFactory(lineRippleElement);\n      }\n\n      var outlineElement = this.root_.querySelector(_constants__WEBPACK_IMPORTED_MODULE_3__[\"strings\"].OUTLINE_SELECTOR);\n\n      if (outlineElement) {\n        this.outline_ = outlineFactory(outlineElement);\n      }\n\n      if (this.input_.hasAttribute(_constants__WEBPACK_IMPORTED_MODULE_3__[\"strings\"].ARIA_CONTROLS)) {\n        var helperTextElement = document.getElementById(this.input_.getAttribute(_constants__WEBPACK_IMPORTED_MODULE_3__[\"strings\"].ARIA_CONTROLS));\n\n        if (helperTextElement) {\n          this.helperText_ = helperTextFactory(helperTextElement);\n        }\n      }\n\n      var iconElement = this.root_.querySelector(_constants__WEBPACK_IMPORTED_MODULE_3__[\"strings\"].ICON_SELECTOR);\n\n      if (iconElement) {\n        this.icon_ = iconFactory(iconElement);\n      }\n\n      this.ripple = null;\n\n      if (this.root_.classList.contains(_constants__WEBPACK_IMPORTED_MODULE_3__[\"cssClasses\"].BOX)) {\n        var MATCHES = Object(_material_ripple_util__WEBPACK_IMPORTED_MODULE_2__[\"getMatchesProperty\"])(HTMLElement.prototype);\n\n        var adapter = _extends(_material_ripple_index__WEBPACK_IMPORTED_MODULE_1__[\"MDCRipple\"].createAdapter(\n        /** @type {!RippleCapableSurface} */\n        this), {\n          isSurfaceActive: function isSurfaceActive() {\n            return _this2.input_[MATCHES](':active');\n          },\n          registerInteractionHandler: function registerInteractionHandler(type, handler) {\n            return _this2.input_.addEventListener(type, handler);\n          },\n          deregisterInteractionHandler: function deregisterInteractionHandler(type, handler) {\n            return _this2.input_.removeEventListener(type, handler);\n          }\n        });\n\n        var foundation = new _material_ripple_index__WEBPACK_IMPORTED_MODULE_1__[\"MDCRippleFoundation\"](adapter);\n        this.ripple = rippleFactory(this.root_, foundation);\n      }\n    }\n  }, {\n    key: \"destroy\",\n    value: function destroy() {\n      if (this.ripple) {\n        this.ripple.destroy();\n      }\n\n      if (this.lineRipple_) {\n        this.lineRipple_.destroy();\n      }\n\n      if (this.helperText_) {\n        this.helperText_.destroy();\n      }\n\n      if (this.icon_) {\n        this.icon_.destroy();\n      }\n\n      if (this.label_) {\n        this.label_.destroy();\n      }\n\n      if (this.outline_) {\n        this.outline_.destroy();\n      }\n\n      _get(_getPrototypeOf(MDCTextField.prototype), \"destroy\", this).call(this);\n    }\n    /**\n     * Initiliazes the Text Field's internal state based on the environment's\n     * state.\n     */\n\n  }, {\n    key: \"initialSyncWithDom\",\n    value: function initialSyncWithDom() {\n      this.disabled = this.input_.disabled;\n    }\n    /**\n     * @return {string} The value of the input.\n     */\n\n  }, {\n    key: \"layout\",\n\n    /**\n     * Recomputes the outline SVG path for the outline element.\n     */\n    value: function layout() {\n      var openNotch = this.foundation_.shouldFloat;\n      this.foundation_.notchOutline(openNotch);\n    }\n    /**\n     * @return {!MDCTextFieldFoundation}\n     */\n\n  }, {\n    key: \"getDefaultFoundation\",\n    value: function getDefaultFoundation() {\n      var _this3 = this;\n\n      return new _foundation__WEBPACK_IMPORTED_MODULE_5__[\"default\"](\n      /** @type {!MDCTextFieldAdapter} */\n      _extends({\n        addClass: function addClass(className) {\n          return _this3.root_.classList.add(className);\n        },\n        removeClass: function removeClass(className) {\n          return _this3.root_.classList.remove(className);\n        },\n        hasClass: function hasClass(className) {\n          return _this3.root_.classList.contains(className);\n        },\n        registerTextFieldInteractionHandler: function registerTextFieldInteractionHandler(evtType, handler) {\n          return _this3.root_.addEventListener(evtType, handler);\n        },\n        deregisterTextFieldInteractionHandler: function deregisterTextFieldInteractionHandler(evtType, handler) {\n          return _this3.root_.removeEventListener(evtType, handler);\n        },\n        registerValidationAttributeChangeHandler: function registerValidationAttributeChangeHandler(handler) {\n          var getAttributesList = function getAttributesList(mutationsList) {\n            return mutationsList.map(function (mutation) {\n              return mutation.attributeName;\n            });\n          };\n\n          var observer = new MutationObserver(function (mutationsList) {\n            return handler(getAttributesList(mutationsList));\n          });\n\n          var targetNode = _this3.root_.querySelector(_constants__WEBPACK_IMPORTED_MODULE_3__[\"strings\"].INPUT_SELECTOR);\n\n          var config = {\n            attributes: true\n          };\n          observer.observe(targetNode, config);\n          return observer;\n        },\n        deregisterValidationAttributeChangeHandler: function deregisterValidationAttributeChangeHandler(observer) {\n          return observer.disconnect();\n        },\n        isFocused: function isFocused() {\n          return document.activeElement === _this3.root_.querySelector(_constants__WEBPACK_IMPORTED_MODULE_3__[\"strings\"].INPUT_SELECTOR);\n        },\n        isRtl: function isRtl() {\n          return window.getComputedStyle(_this3.root_).getPropertyValue('direction') === 'rtl';\n        }\n      }, this.getInputAdapterMethods_(), this.getLabelAdapterMethods_(), this.getLineRippleAdapterMethods_(), this.getOutlineAdapterMethods_()), this.getFoundationMap_());\n    }\n    /**\n     * @return {!{\n     *   shakeLabel: function(boolean): undefined,\n     *   floatLabel: function(boolean): undefined,\n     *   hasLabel: function(): boolean,\n     *   getLabelWidth: function(): number,\n     * }}\n     */\n\n  }, {\n    key: \"getLabelAdapterMethods_\",\n    value: function getLabelAdapterMethods_() {\n      var _this4 = this;\n\n      return {\n        shakeLabel: function shakeLabel(shouldShake) {\n          return _this4.label_.shake(shouldShake);\n        },\n        floatLabel: function floatLabel(shouldFloat) {\n          return _this4.label_.float(shouldFloat);\n        },\n        hasLabel: function hasLabel() {\n          return !!_this4.label_;\n        },\n        getLabelWidth: function getLabelWidth() {\n          return _this4.label_.getWidth();\n        }\n      };\n    }\n    /**\n     * @return {!{\n     *   activateLineRipple: function(): undefined,\n     *   deactivateLineRipple: function(): undefined,\n     *   setLineRippleTransformOrigin: function(number): undefined,\n     * }}\n     */\n\n  }, {\n    key: \"getLineRippleAdapterMethods_\",\n    value: function getLineRippleAdapterMethods_() {\n      var _this5 = this;\n\n      return {\n        activateLineRipple: function activateLineRipple() {\n          if (_this5.lineRipple_) {\n            _this5.lineRipple_.activate();\n          }\n        },\n        deactivateLineRipple: function deactivateLineRipple() {\n          if (_this5.lineRipple_) {\n            _this5.lineRipple_.deactivate();\n          }\n        },\n        setLineRippleTransformOrigin: function setLineRippleTransformOrigin(normalizedX) {\n          if (_this5.lineRipple_) {\n            _this5.lineRipple_.setRippleCenter(normalizedX);\n          }\n        }\n      };\n    }\n    /**\n     * @return {!{\n     *   notchOutline: function(number, boolean): undefined,\n     *   hasOutline: function(): boolean,\n     * }}\n     */\n\n  }, {\n    key: \"getOutlineAdapterMethods_\",\n    value: function getOutlineAdapterMethods_() {\n      var _this6 = this;\n\n      return {\n        notchOutline: function notchOutline(labelWidth, isRtl) {\n          return _this6.outline_.notch(labelWidth, isRtl);\n        },\n        closeOutline: function closeOutline() {\n          return _this6.outline_.closeNotch();\n        },\n        hasOutline: function hasOutline() {\n          return !!_this6.outline_;\n        }\n      };\n    }\n    /**\n     * @return {!{\n     *   registerInputInteractionHandler: function(string, function()): undefined,\n     *   deregisterInputInteractionHandler: function(string, function()): undefined,\n     *   getNativeInput: function(): ?Element,\n     * }}\n     */\n\n  }, {\n    key: \"getInputAdapterMethods_\",\n    value: function getInputAdapterMethods_() {\n      var _this7 = this;\n\n      return {\n        registerInputInteractionHandler: function registerInputInteractionHandler(evtType, handler) {\n          return _this7.input_.addEventListener(evtType, handler);\n        },\n        deregisterInputInteractionHandler: function deregisterInputInteractionHandler(evtType, handler) {\n          return _this7.input_.removeEventListener(evtType, handler);\n        },\n        getNativeInput: function getNativeInput() {\n          return _this7.input_;\n        }\n      };\n    }\n    /**\n     * Returns a map of all subcomponents to subfoundations.\n     * @return {!FoundationMapType}\n     */\n\n  }, {\n    key: \"getFoundationMap_\",\n    value: function getFoundationMap_() {\n      return {\n        helperText: this.helperText_ ? this.helperText_.foundation : undefined,\n        icon: this.icon_ ? this.icon_.foundation : undefined\n      };\n    }\n  }, {\n    key: \"value\",\n    get: function get() {\n      return this.foundation_.getValue();\n    }\n    /**\n     * @param {string} value The value to set on the input.\n     */\n    ,\n    set: function set(value) {\n      this.foundation_.setValue(value);\n    }\n    /**\n     * @return {boolean} True if the Text Field is disabled.\n     */\n\n  }, {\n    key: \"disabled\",\n    get: function get() {\n      return this.foundation_.isDisabled();\n    }\n    /**\n     * @param {boolean} disabled Sets the Text Field disabled or enabled.\n     */\n    ,\n    set: function set(disabled) {\n      this.foundation_.setDisabled(disabled);\n    }\n    /**\n     * @return {boolean} valid True if the Text Field is valid.\n     */\n\n  }, {\n    key: \"valid\",\n    get: function get() {\n      return this.foundation_.isValid();\n    }\n    /**\n     * @param {boolean} valid Sets the Text Field valid or invalid.\n     */\n    ,\n    set: function set(valid) {\n      this.foundation_.setValid(valid);\n    }\n    /**\n     * @return {boolean} True if the Text Field is required.\n     */\n\n  }, {\n    key: \"required\",\n    get: function get() {\n      return this.input_.required;\n    }\n    /**\n     * @param {boolean} required Sets the Text Field to required.\n     */\n    ,\n    set: function set(required) {\n      this.input_.required = required;\n    }\n    /**\n     * @return {string} The input element's validation pattern.\n     */\n\n  }, {\n    key: \"pattern\",\n    get: function get() {\n      return this.input_.pattern;\n    }\n    /**\n     * @param {string} pattern Sets the input element's validation pattern.\n     */\n    ,\n    set: function set(pattern) {\n      this.input_.pattern = pattern;\n    }\n    /**\n     * @return {number} The input element's minLength.\n     */\n\n  }, {\n    key: \"minLength\",\n    get: function get() {\n      return this.input_.minLength;\n    }\n    /**\n     * @param {number} minLength Sets the input element's minLength.\n     */\n    ,\n    set: function set(minLength) {\n      this.input_.minLength = minLength;\n    }\n    /**\n     * @return {number} The input element's maxLength.\n     */\n\n  }, {\n    key: \"maxLength\",\n    get: function get() {\n      return this.input_.maxLength;\n    }\n    /**\n     * @param {number} maxLength Sets the input element's maxLength.\n     */\n    ,\n    set: function set(maxLength) {\n      // Chrome throws exception if maxLength is set < 0\n      if (maxLength < 0) {\n        this.input_.removeAttribute('maxLength');\n      } else {\n        this.input_.maxLength = maxLength;\n      }\n    }\n    /**\n     * @return {string} The input element's min.\n     */\n\n  }, {\n    key: \"min\",\n    get: function get() {\n      return this.input_.min;\n    }\n    /**\n     * @param {string} min Sets the input element's min.\n     */\n    ,\n    set: function set(min) {\n      this.input_.min = min;\n    }\n    /**\n     * @return {string} The input element's max.\n     */\n\n  }, {\n    key: \"max\",\n    get: function get() {\n      return this.input_.max;\n    }\n    /**\n     * @param {string} max Sets the input element's max.\n     */\n    ,\n    set: function set(max) {\n      this.input_.max = max;\n    }\n    /**\n     * @return {string} The input element's step.\n     */\n\n  }, {\n    key: \"step\",\n    get: function get() {\n      return this.input_.step;\n    }\n    /**\n     * @param {string} step Sets the input element's step.\n     */\n    ,\n    set: function set(step) {\n      this.input_.step = step;\n    }\n    /**\n     * Sets the helper text element content.\n     * @param {string} content\n     */\n\n  }, {\n    key: \"helperTextContent\",\n    set: function set(content) {\n      this.foundation_.setHelperTextContent(content);\n    }\n    /**\n     * Sets the aria label of the icon.\n     * @param {string} label\n     */\n\n  }, {\n    key: \"iconAriaLabel\",\n    set: function set(label) {\n      this.foundation_.setIconAriaLabel(label);\n    }\n    /**\n     * Sets the text content of the icon.\n     * @param {string} content\n     */\n\n  }, {\n    key: \"iconContent\",\n    set: function set(content) {\n      this.foundation_.setIconContent(content);\n    }\n  }], [{\n    key: \"attachTo\",\n    value: function attachTo(root) {\n      return new MDCTextField(root);\n    }\n  }]);\n\n  return MDCTextField;\n}(_material_base_component__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n\n\n\n//# sourceURL=webpack:///./node_modules/@material/textfield/index.js?");

  /***/ }),

  /***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./components/textfield/Textfield.vue?vue&type=script&lang=js":
  /*!**************************************************************************************************************************************************************!*\
    !*** ./node_modules/babel-loader/lib??ref--1!./node_modules/vue-loader/lib??vue-loader-options!./components/textfield/Textfield.vue?vue&type=script&lang=js ***!
    \**************************************************************************************************************************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _material_textfield__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @material/textfield */ \"./node_modules/@material/textfield/index.js\");\n/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ */ \"./components/index.js\");\n/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../base */ \"./components/base/index.js\");\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  mixins: [_base__WEBPACK_IMPORTED_MODULE_2__[\"baseComponentMixin\"], _base__WEBPACK_IMPORTED_MODULE_2__[\"themeClassMixin\"]],\n  props: {\n    value: {\n      type: String,\n      default: ''\n    },\n    disabled: {\n      type: Boolean,\n      default: false\n    },\n    upgraded: {\n      type: Boolean,\n      default: false\n    },\n    fullWidth: {\n      type: Boolean,\n      default: false\n    },\n    box: {\n      type: Boolean,\n      default: false\n    },\n    outlined: {\n      type: Boolean,\n      default: false\n    },\n    dense: {\n      type: Boolean,\n      default: false\n    },\n    focused: {\n      type: Boolean,\n      default: false\n    },\n    textarea: {\n      type: Boolean,\n      default: false\n    }\n  },\n  data: function data() {\n    return {\n      mdcTextField: undefined,\n      mdcRipple: undefined,\n      slotObserver: undefined\n    };\n  },\n  computed: {\n    classes: function classes() {\n      return {\n        'mdc-text-field--disabled': this.disabled,\n        'mdc-text-field--upgraded': this.upgraded,\n        'mdc-text-field--fullwidth': this.fullWidth,\n        'mdc-text-field--box': this.box,\n        'mdc-text-field--with-leading-icon': this.$slots.leadingIcon,\n        'mdc-text-field--with-trailing-icon': this.$slots.trailingIcon,\n        'mdc-text-field--outlined': this.outlined,\n        'mdc-text-field--dense': this.dense,\n        'mdc-text-field--focused': this.focused,\n        'mdc-text-field--textarea': this.textarea\n      };\n    }\n  },\n  mounted: function mounted() {\n    var _this = this;\n\n    this.updateSlots();\n    this.slotObserver = new MutationObserver(function () {\n      return _this.updateSlots();\n    });\n    this.slotObserver.observe(this.$el, {\n      childList: true,\n      subtree: true\n    });\n    this.mdcTextField = _material_textfield__WEBPACK_IMPORTED_MODULE_0__[\"MDCTextField\"].attachTo(this.$el);\n  },\n  beforeDestroy: function beforeDestroy() {\n    this.slotObserver.disconnect();\n    this.mdcTextField.destroy();\n\n    if (typeof this.mdcRipple !== 'undefined') {\n      this.mdcRipple.destroy();\n    }\n  },\n  methods: {\n    updateSlots: function updateSlots() {\n      if (this.$slots.leadingIcon) {\n        this.$slots.leadingIcon.map(function (n) {\n          n.elm.classList.add('mdc-text-field__icon');\n          n.elm.setAttribute('tabindex', '0');\n          n.elm.setAttribute('role', 'button');\n        });\n      }\n\n      if (this.$slots.trailingIcon) {\n        this.$slots.trailingIcon.map(function (n) {\n          n.elm.classList.add('mdc-text-field__icon');\n          n.elm.setAttribute('tabindex', '0');\n          n.elm.setAttribute('role', 'button');\n        });\n      }\n    },\n    onInput: function onInput(event) {\n      Object(___WEBPACK_IMPORTED_MODULE_1__[\"debounce\"])(this.$emit('input', event.target.value));\n    }\n  }\n});\n\n//# sourceURL=webpack:///./components/textfield/Textfield.vue?./node_modules/babel-loader/lib??ref--1!./node_modules/vue-loader/lib??vue-loader-options");

  /***/ }),

  /***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./components/textfield/TextfieldHelptext.vue?vue&type=script&lang=js":
  /*!**********************************************************************************************************************************************************************!*\
    !*** ./node_modules/babel-loader/lib??ref--1!./node_modules/vue-loader/lib??vue-loader-options!./components/textfield/TextfieldHelptext.vue?vue&type=script&lang=js ***!
    \**********************************************************************************************************************************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base */ \"./components/base/index.js\");\n//\n//\n//\n//\n//\n//\n//\n//\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  mixins: [_base__WEBPACK_IMPORTED_MODULE_0__[\"baseComponentMixin\"], _base__WEBPACK_IMPORTED_MODULE_0__[\"themeClassMixin\"]],\n  props: {\n    persistent: {\n      type: Boolean,\n      default: false\n    },\n    validationMsg: {\n      type: Boolean,\n      default: false\n    }\n  },\n  computed: {\n    classes: function classes() {\n      return {\n        'mdc-textfield-helper-text--persistent': this.persistent,\n        'mdc-textfield-helper-text--validation-msg': this.validationMsg\n      };\n    }\n  }\n});\n\n//# sourceURL=webpack:///./components/textfield/TextfieldHelptext.vue?./node_modules/babel-loader/lib??ref--1!./node_modules/vue-loader/lib??vue-loader-options");

  /***/ }),

  /***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./components/textfield/Textfield.vue?vue&type=template&id=1997cfc0":
  /*!********************************************************************************************************************************************************************************************************!*\
    !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./components/textfield/Textfield.vue?vue&type=template&id=1997cfc0 ***!
    \********************************************************************************************************************************************************************************************************/
  /*! exports provided: render, staticRenderFns */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return staticRenderFns; });\nvar render = function() {\n  var _vm = this\n  var _h = _vm.$createElement\n  var _c = _vm._self._c || _h\n  return _c(\n    \"div\",\n    { staticClass: \"mdc-text-field\", class: _vm.classes },\n    [\n      _vm._t(\"leadingIcon\"),\n      _vm._v(\" \"),\n      !_vm.textarea\n        ? _c(\n            \"input\",\n            _vm._b(\n              {\n                staticClass: \"mdc-text-field__input\",\n                domProps: { value: _vm.value },\n                on: { input: _vm.onInput }\n              },\n              \"input\",\n              _vm.$attrs,\n              false\n            )\n          )\n        : _vm._e(),\n      _vm._v(\" \"),\n      _vm.textarea\n        ? _c(\n            \"textarea\",\n            _vm._b(\n              {\n                staticClass: \"mdc-text-field__input\",\n                domProps: { value: _vm.value },\n                on: { input: _vm.onInput }\n              },\n              \"textarea\",\n              _vm.$attrs,\n              false\n            )\n          )\n        : _vm._e(),\n      _vm._v(\" \"),\n      _vm.$slots[\"default\"] && !_vm.fullWidth ? _vm._t(\"default\") : _vm._e(),\n      _vm._v(\" \"),\n      _vm._t(\"trailingIcon\"),\n      _vm._v(\" \"),\n      _vm._t(\"bottomLine\")\n    ],\n    2\n  )\n}\nvar staticRenderFns = []\nrender._withStripped = true\n\n\n\n//# sourceURL=webpack:///./components/textfield/Textfield.vue?./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options");

  /***/ }),

  /***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./components/textfield/TextfieldHelptext.vue?vue&type=template&id=e6013e64":
  /*!****************************************************************************************************************************************************************************************************************!*\
    !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./components/textfield/TextfieldHelptext.vue?vue&type=template&id=e6013e64 ***!
    \****************************************************************************************************************************************************************************************************************/
  /*! exports provided: render, staticRenderFns */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return staticRenderFns; });\nvar render = function() {\n  var _vm = this\n  var _h = _vm.$createElement\n  var _c = _vm._self._c || _h\n  return _c(\n    \"p\",\n    { staticClass: \"mdc-text-field-helper-text\", class: _vm.classes },\n    [_vm._t(\"default\")],\n    2\n  )\n}\nvar staticRenderFns = []\nrender._withStripped = true\n\n\n\n//# sourceURL=webpack:///./components/textfield/TextfieldHelptext.vue?./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options");

  /***/ }),

  /***/ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js":
  /*!********************************************************************!*\
    !*** ./node_modules/vue-loader/lib/runtime/componentNormalizer.js ***!
    \********************************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return normalizeComponent; });\n/* globals __VUE_SSR_CONTEXT__ */\n\n// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).\n// This module is a runtime utility for cleaner component module output and will\n// be included in the final webpack user bundle.\n\nfunction normalizeComponent (\n  scriptExports,\n  render,\n  staticRenderFns,\n  functionalTemplate,\n  injectStyles,\n  scopeId,\n  moduleIdentifier, /* server only */\n  shadowMode /* vue-cli only */\n) {\n  // Vue.extend constructor export interop\n  var options = typeof scriptExports === 'function'\n    ? scriptExports.options\n    : scriptExports\n\n  // render functions\n  if (render) {\n    options.render = render\n    options.staticRenderFns = staticRenderFns\n    options._compiled = true\n  }\n\n  // functional template\n  if (functionalTemplate) {\n    options.functional = true\n  }\n\n  // scopedId\n  if (scopeId) {\n    options._scopeId = 'data-v-' + scopeId\n  }\n\n  var hook\n  if (moduleIdentifier) { // server build\n    hook = function (context) {\n      // 2.3 injection\n      context =\n        context || // cached call\n        (this.$vnode && this.$vnode.ssrContext) || // stateful\n        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional\n      // 2.2 with runInNewContext: true\n      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {\n        context = __VUE_SSR_CONTEXT__\n      }\n      // inject component styles\n      if (injectStyles) {\n        injectStyles.call(this, context)\n      }\n      // register component module identifier for async chunk inferrence\n      if (context && context._registeredComponents) {\n        context._registeredComponents.add(moduleIdentifier)\n      }\n    }\n    // used by ssr in case component is cached and beforeCreate\n    // never gets called\n    options._ssrRegister = hook\n  } else if (injectStyles) {\n    hook = shadowMode\n      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }\n      : injectStyles\n  }\n\n  if (hook) {\n    if (options.functional) {\n      // for template-only hot-reload because in that case the render fn doesn't\n      // go through the normalizer\n      options._injectStyles = hook\n      // register for functioal component in vue file\n      var originalRender = options.render\n      options.render = function renderWithStyleInjection (h, context) {\n        hook.call(context)\n        return originalRender(h, context)\n      }\n    } else {\n      // inject component registration as beforeCreate hook\n      var existing = options.beforeCreate\n      options.beforeCreate = existing\n        ? [].concat(existing, hook)\n        : [hook]\n    }\n  }\n\n  return {\n    exports: scriptExports,\n    options: options\n  }\n}\n\n\n//# sourceURL=webpack:///./node_modules/vue-loader/lib/runtime/componentNormalizer.js?");

  /***/ })

  /******/ });
  });
  });

  var TextField = unwrapExports(textfield);

  var floatingLabel = createCommonjsModule(function (module, exports) {
  (function webpackUniversalModuleDefinition(root, factory) {
  	module.exports = factory();
  })(window, function() {
  return /******/ (function(modules) { // webpackBootstrap
  /******/ 	// The module cache
  /******/ 	var installedModules = {};
  /******/
  /******/ 	// The require function
  /******/ 	function __webpack_require__(moduleId) {
  /******/
  /******/ 		// Check if module is in cache
  /******/ 		if(installedModules[moduleId]) {
  /******/ 			return installedModules[moduleId].exports;
  /******/ 		}
  /******/ 		// Create a new module (and put it into the cache)
  /******/ 		var module = installedModules[moduleId] = {
  /******/ 			i: moduleId,
  /******/ 			l: false,
  /******/ 			exports: {}
  /******/ 		};
  /******/
  /******/ 		// Execute the module function
  /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
  /******/
  /******/ 		// Flag the module as loaded
  /******/ 		module.l = true;
  /******/
  /******/ 		// Return the exports of the module
  /******/ 		return module.exports;
  /******/ 	}
  /******/
  /******/
  /******/ 	// expose the modules object (__webpack_modules__)
  /******/ 	__webpack_require__.m = modules;
  /******/
  /******/ 	// expose the module cache
  /******/ 	__webpack_require__.c = installedModules;
  /******/
  /******/ 	// define getter function for harmony exports
  /******/ 	__webpack_require__.d = function(exports, name, getter) {
  /******/ 		if(!__webpack_require__.o(exports, name)) {
  /******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
  /******/ 		}
  /******/ 	};
  /******/
  /******/ 	// define __esModule on exports
  /******/ 	__webpack_require__.r = function(exports) {
  /******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
  /******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
  /******/ 		}
  /******/ 		Object.defineProperty(exports, '__esModule', { value: true });
  /******/ 	};
  /******/
  /******/ 	// create a fake namespace object
  /******/ 	// mode & 1: value is a module id, require it
  /******/ 	// mode & 2: merge all properties of value into the ns
  /******/ 	// mode & 4: return value when already ns object
  /******/ 	// mode & 8|1: behave like require
  /******/ 	__webpack_require__.t = function(value, mode) {
  /******/ 		if(mode & 1) value = __webpack_require__(value);
  /******/ 		if(mode & 8) return value;
  /******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
  /******/ 		var ns = Object.create(null);
  /******/ 		__webpack_require__.r(ns);
  /******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
  /******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
  /******/ 		return ns;
  /******/ 	};
  /******/
  /******/ 	// getDefaultExport function for compatibility with non-harmony modules
  /******/ 	__webpack_require__.n = function(module) {
  /******/ 		var getter = module && module.__esModule ?
  /******/ 			function getDefault() { return module['default']; } :
  /******/ 			function getModuleExports() { return module; };
  /******/ 		__webpack_require__.d(getter, 'a', getter);
  /******/ 		return getter;
  /******/ 	};
  /******/
  /******/ 	// Object.prototype.hasOwnProperty.call
  /******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
  /******/
  /******/ 	// __webpack_public_path__
  /******/ 	__webpack_require__.p = "";
  /******/
  /******/
  /******/ 	// Load entry module and return exports
  /******/ 	return __webpack_require__(__webpack_require__.s = "./components/floating-label/index.js");
  /******/ })
  /************************************************************************/
  /******/ ({

  /***/ "./components/base/baseComponentMixin.js":
  /*!***********************************************!*\
    !*** ./components/base/baseComponentMixin.js ***!
    \***********************************************/
  /*! exports provided: baseComponentMixin */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"baseComponentMixin\", function() { return baseComponentMixin; });\nvar baseComponentMixin = {\n  inheritAttrs: false\n};\n\n//# sourceURL=webpack:///./components/base/baseComponentMixin.js?");

  /***/ }),

  /***/ "./components/base/index.js":
  /*!**********************************!*\
    !*** ./components/base/index.js ***!
    \**********************************/
  /*! exports provided: baseComponentMixin, themeClassMixin */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _baseComponentMixin_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./baseComponentMixin.js */ \"./components/base/baseComponentMixin.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"baseComponentMixin\", function() { return _baseComponentMixin_js__WEBPACK_IMPORTED_MODULE_0__[\"baseComponentMixin\"]; });\n\n/* harmony import */ var _themeClassMixin_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./themeClassMixin.js */ \"./components/base/themeClassMixin.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"themeClassMixin\", function() { return _themeClassMixin_js__WEBPACK_IMPORTED_MODULE_1__[\"themeClassMixin\"]; });\n\n\n\n\n//# sourceURL=webpack:///./components/base/index.js?");

  /***/ }),

  /***/ "./components/base/themeClassMixin.js":
  /*!********************************************!*\
    !*** ./components/base/themeClassMixin.js ***!
    \********************************************/
  /*! exports provided: themeClassMixin */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"themeClassMixin\", function() { return themeClassMixin; });\nvar themeProps = ['primary', 'secondary', 'background', 'surface', 'on-primary', 'on-secondary', 'on-surface', 'primary-bg', 'secondary-bg', 'text-primary-on-light', 'text-secondary-on-light', 'text-hint-on-light', 'text-disabled-on-light', 'text-icon-on-light', 'text-primary-on-dark', 'text-secondary-on-dark', 'text-hint-on-dark', 'text-disabled-on-dark', 'text-icon-on-dark'];\nvar themeClassMixin = {\n  props: {\n    theming: {\n      type: String,\n      default: ''\n    }\n  },\n  mounted: function mounted() {\n    if (themeProps.indexOf(this.theming) > -1) {\n      this.$el.classList.add('mdc-theme--' + this.theming);\n    }\n  }\n};\n\n//# sourceURL=webpack:///./components/base/themeClassMixin.js?");

  /***/ }),

  /***/ "./components/debounce.js":
  /*!********************************!*\
    !*** ./components/debounce.js ***!
    \********************************/
  /*! exports provided: debounce */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"debounce\", function() { return debounce; });\nfunction debounce(fn, debounceDuration) {\n  debounceDuration = debounceDuration || 100;\n  return function () {\n    if (!fn.debouncing) {\n      var args = Array.prototype.slice.apply(arguments);\n      fn.lastReturnVal = fn.apply(window, args);\n      fn.debouncing = true;\n    }\n\n    clearTimeout(fn.debounceTimeout);\n    fn.debounceTimeout = setTimeout(function () {\n      fn.debouncing = false;\n    }, debounceDuration);\n    return fn.lastReturnVal;\n  };\n}\n\n//# sourceURL=webpack:///./components/debounce.js?");

  /***/ }),

  /***/ "./components/floating-label/FloatingLabel.vue":
  /*!*****************************************************!*\
    !*** ./components/floating-label/FloatingLabel.vue ***!
    \*****************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _FloatingLabel_vue_vue_type_template_id_1cf96df2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FloatingLabel.vue?vue&type=template&id=1cf96df2 */ \"./components/floating-label/FloatingLabel.vue?vue&type=template&id=1cf96df2\");\n/* harmony import */ var _FloatingLabel_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FloatingLabel.vue?vue&type=script&lang=js */ \"./components/floating-label/FloatingLabel.vue?vue&type=script&lang=js\");\n/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ \"./node_modules/vue-loader/lib/runtime/componentNormalizer.js\");\n\n\n\n\n\n/* normalize component */\n\nvar component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(\n  _FloatingLabel_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  _FloatingLabel_vue_vue_type_template_id_1cf96df2__WEBPACK_IMPORTED_MODULE_0__[\"render\"],\n  _FloatingLabel_vue_vue_type_template_id_1cf96df2__WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"],\n  false,\n  null,\n  null,\n  null\n  \n)\n\n/* hot reload */\nif (false) { var api; }\ncomponent.options.__file = \"components/floating-label/FloatingLabel.vue\"\n/* harmony default export */ __webpack_exports__[\"default\"] = (component.exports);\n\n//# sourceURL=webpack:///./components/floating-label/FloatingLabel.vue?");

  /***/ }),

  /***/ "./components/floating-label/FloatingLabel.vue?vue&type=script&lang=js":
  /*!*****************************************************************************!*\
    !*** ./components/floating-label/FloatingLabel.vue?vue&type=script&lang=js ***!
    \*****************************************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_1_node_modules_vue_loader_lib_index_js_vue_loader_options_FloatingLabel_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib??ref--1!../../node_modules/vue-loader/lib??vue-loader-options!./FloatingLabel.vue?vue&type=script&lang=js */ \"./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./components/floating-label/FloatingLabel.vue?vue&type=script&lang=js\");\n/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__[\"default\"] = (_node_modules_babel_loader_lib_index_js_ref_1_node_modules_vue_loader_lib_index_js_vue_loader_options_FloatingLabel_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]); \n\n//# sourceURL=webpack:///./components/floating-label/FloatingLabel.vue?");

  /***/ }),

  /***/ "./components/floating-label/FloatingLabel.vue?vue&type=template&id=1cf96df2":
  /*!***********************************************************************************!*\
    !*** ./components/floating-label/FloatingLabel.vue?vue&type=template&id=1cf96df2 ***!
    \***********************************************************************************/
  /*! exports provided: render, staticRenderFns */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FloatingLabel_vue_vue_type_template_id_1cf96df2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib??vue-loader-options!./FloatingLabel.vue?vue&type=template&id=1cf96df2 */ \"./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./components/floating-label/FloatingLabel.vue?vue&type=template&id=1cf96df2\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FloatingLabel_vue_vue_type_template_id_1cf96df2__WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FloatingLabel_vue_vue_type_template_id_1cf96df2__WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"]; });\n\n\n\n//# sourceURL=webpack:///./components/floating-label/FloatingLabel.vue?");

  /***/ }),

  /***/ "./components/floating-label/index.js":
  /*!********************************************!*\
    !*** ./components/floating-label/index.js ***!
    \********************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _FloatingLabel_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FloatingLabel.vue */ \"./components/floating-label/FloatingLabel.vue\");\n/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./styles.scss */ \"./components/floating-label/styles.scss\");\n/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_scss__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../ */ \"./components/index.js\");\n\n\n\nvar plugin = {\n  install: function install(vm) {\n    vm.component('m-floating-label', _FloatingLabel_vue__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n  }\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = (plugin);\nObject(___WEBPACK_IMPORTED_MODULE_2__[\"initPlugin\"])(plugin);\n\n//# sourceURL=webpack:///./components/floating-label/index.js?");

  /***/ }),

  /***/ "./components/floating-label/styles.scss":
  /*!***********************************************!*\
    !*** ./components/floating-label/styles.scss ***!
    \***********************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {

  eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./components/floating-label/styles.scss?");

  /***/ }),

  /***/ "./components/index.js":
  /*!*****************************!*\
    !*** ./components/index.js ***!
    \*****************************/
  /*! exports provided: debounce, initPlugin */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _debounce_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./debounce.js */ \"./components/debounce.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"debounce\", function() { return _debounce_js__WEBPACK_IMPORTED_MODULE_0__[\"debounce\"]; });\n\n/* harmony import */ var _initPlugin_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./initPlugin.js */ \"./components/initPlugin.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"initPlugin\", function() { return _initPlugin_js__WEBPACK_IMPORTED_MODULE_1__[\"initPlugin\"]; });\n\n\n\n\n//# sourceURL=webpack:///./components/index.js?");

  /***/ }),

  /***/ "./components/initPlugin.js":
  /*!**********************************!*\
    !*** ./components/initPlugin.js ***!
    \**********************************/
  /*! exports provided: initPlugin */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"initPlugin\", function() { return initPlugin; });\nfunction initPlugin(plugin) {\n  if (typeof window !== 'undefined' && window.Vue) {\n    window.Vue.use(plugin);\n  }\n}\n\n//# sourceURL=webpack:///./components/initPlugin.js?");

  /***/ }),

  /***/ "./node_modules/@material/base/component.js":
  /*!**************************************************!*\
    !*** ./node_modules/@material/base/component.js ***!
    \**************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _foundation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./foundation */ \"./node_modules/@material/base/foundation.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n/**\n * @license\n * Copyright 2016 Google Inc.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *   http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n/**\n * @template F\n */\n\nvar MDCComponent =\n/*#__PURE__*/\nfunction () {\n  _createClass(MDCComponent, null, [{\n    key: \"attachTo\",\n\n    /**\n     * @param {!Element} root\n     * @return {!MDCComponent}\n     */\n    value: function attachTo(root) {\n      // Subclasses which extend MDCBase should provide an attachTo() method that takes a root element and\n      // returns an instantiated component with its root set to that element. Also note that in the cases of\n      // subclasses, an explicit foundation class will not have to be passed in; it will simply be initialized\n      // from getDefaultFoundation().\n      return new MDCComponent(root, new _foundation__WEBPACK_IMPORTED_MODULE_0__[\"default\"]());\n    }\n    /**\n     * @param {!Element} root\n     * @param {F=} foundation\n     * @param {...?} args\n     */\n\n  }]);\n\n  function MDCComponent(root) {\n    var foundation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;\n\n    _classCallCheck(this, MDCComponent);\n\n    /** @protected {!Element} */\n    this.root_ = root;\n\n    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {\n      args[_key - 2] = arguments[_key];\n    }\n\n    this.initialize.apply(this, args); // Note that we initialize foundation here and not within the constructor's default param so that\n    // this.root_ is defined and can be used within the foundation class.\n\n    /** @protected {!F} */\n\n    this.foundation_ = foundation === undefined ? this.getDefaultFoundation() : foundation;\n    this.foundation_.init();\n    this.initialSyncWithDOM();\n  }\n\n  _createClass(MDCComponent, [{\n    key: \"initialize\",\n    value: function initialize()\n    /* ...args */\n    {} // Subclasses can override this to do any additional setup work that would be considered part of a\n    // \"constructor\". Essentially, it is a hook into the parent constructor before the foundation is\n    // initialized. Any additional arguments besides root and foundation will be passed in here.\n\n    /**\n     * @return {!F} foundation\n     */\n\n  }, {\n    key: \"getDefaultFoundation\",\n    value: function getDefaultFoundation() {\n      // Subclasses must override this method to return a properly configured foundation class for the\n      // component.\n      throw new Error('Subclasses must override getDefaultFoundation to return a properly configured ' + 'foundation class');\n    }\n  }, {\n    key: \"initialSyncWithDOM\",\n    value: function initialSyncWithDOM() {// Subclasses should override this method if they need to perform work to synchronize with a host DOM\n      // object. An example of this would be a form control wrapper that needs to synchronize its internal state\n      // to some property or attribute of the host DOM. Please note: this is *not* the place to perform DOM\n      // reads/writes that would cause layout / paint, as this is called synchronously from within the constructor.\n    }\n  }, {\n    key: \"destroy\",\n    value: function destroy() {\n      // Subclasses may implement this method to release any resources / deregister any listeners they have\n      // attached. An example of this might be deregistering a resize event from the window object.\n      this.foundation_.destroy();\n    }\n    /**\n     * Wrapper method to add an event listener to the component's root element. This is most useful when\n     * listening for custom events.\n     * @param {string} evtType\n     * @param {!Function} handler\n     */\n\n  }, {\n    key: \"listen\",\n    value: function listen(evtType, handler) {\n      this.root_.addEventListener(evtType, handler);\n    }\n    /**\n     * Wrapper method to remove an event listener to the component's root element. This is most useful when\n     * unlistening for custom events.\n     * @param {string} evtType\n     * @param {!Function} handler\n     */\n\n  }, {\n    key: \"unlisten\",\n    value: function unlisten(evtType, handler) {\n      this.root_.removeEventListener(evtType, handler);\n    }\n    /**\n     * Fires a cross-browser-compatible custom event from the component root of the given type,\n     * with the given data.\n     * @param {string} evtType\n     * @param {!Object} evtData\n     * @param {boolean=} shouldBubble\n     */\n\n  }, {\n    key: \"emit\",\n    value: function emit(evtType, evtData) {\n      var shouldBubble = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;\n      var evt;\n\n      if (typeof CustomEvent === 'function') {\n        evt = new CustomEvent(evtType, {\n          detail: evtData,\n          bubbles: shouldBubble\n        });\n      } else {\n        evt = document.createEvent('CustomEvent');\n        evt.initCustomEvent(evtType, shouldBubble, false, evtData);\n      }\n\n      this.root_.dispatchEvent(evt);\n    }\n  }]);\n\n  return MDCComponent;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MDCComponent);\n\n//# sourceURL=webpack:///./node_modules/@material/base/component.js?");

  /***/ }),

  /***/ "./node_modules/@material/base/foundation.js":
  /*!***************************************************!*\
    !*** ./node_modules/@material/base/foundation.js ***!
    \***************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n/**\n * @license\n * Copyright 2016 Google Inc.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *   http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n/**\n * @template A\n */\nvar MDCFoundation =\n/*#__PURE__*/\nfunction () {\n  _createClass(MDCFoundation, null, [{\n    key: \"cssClasses\",\n\n    /** @return enum{cssClasses} */\n    get: function get() {\n      // Classes extending MDCFoundation should implement this method to return an object which exports every\n      // CSS class the foundation class needs as a property. e.g. {ACTIVE: 'mdc-component--active'}\n      return {};\n    }\n    /** @return enum{strings} */\n\n  }, {\n    key: \"strings\",\n    get: function get() {\n      // Classes extending MDCFoundation should implement this method to return an object which exports all\n      // semantic strings as constants. e.g. {ARIA_ROLE: 'tablist'}\n      return {};\n    }\n    /** @return enum{numbers} */\n\n  }, {\n    key: \"numbers\",\n    get: function get() {\n      // Classes extending MDCFoundation should implement this method to return an object which exports all\n      // of its semantic numbers as constants. e.g. {ANIMATION_DELAY_MS: 350}\n      return {};\n    }\n    /** @return {!Object} */\n\n  }, {\n    key: \"defaultAdapter\",\n    get: function get() {\n      // Classes extending MDCFoundation may choose to implement this getter in order to provide a convenient\n      // way of viewing the necessary methods of an adapter. In the future, this could also be used for adapter\n      // validation.\n      return {};\n    }\n    /**\n     * @param {A=} adapter\n     */\n\n  }]);\n\n  function MDCFoundation() {\n    var adapter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};\n\n    _classCallCheck(this, MDCFoundation);\n\n    /** @protected {!A} */\n    this.adapter_ = adapter;\n  }\n\n  _createClass(MDCFoundation, [{\n    key: \"init\",\n    value: function init() {// Subclasses should override this method to perform initialization routines (registering events, etc.)\n    }\n  }, {\n    key: \"destroy\",\n    value: function destroy() {// Subclasses should override this method to perform de-initialization routines (de-registering events, etc.)\n    }\n  }]);\n\n  return MDCFoundation;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MDCFoundation);\n\n//# sourceURL=webpack:///./node_modules/@material/base/foundation.js?");

  /***/ }),

  /***/ "./node_modules/@material/floating-label/adapter.js":
  /*!**********************************************************!*\
    !*** ./node_modules/@material/floating-label/adapter.js ***!
    \**********************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n/**\n * @license\n * Copyright 2017 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n/* eslint no-unused-vars: [2, {\"args\": \"none\"}] */\n\n/**\n * Adapter for MDC Floating Label.\n *\n * Defines the shape of the adapter expected by the foundation. Implement this\n * adapter to integrate the floating label into your framework. See\n * https://github.com/material-components/material-components-web/blob/master/docs/authoring-components.md\n * for more information.\n *\n * @record\n */\nvar MDCFloatingLabelAdapter =\n/*#__PURE__*/\nfunction () {\n  function MDCFloatingLabelAdapter() {\n    _classCallCheck(this, MDCFloatingLabelAdapter);\n  }\n\n  _createClass(MDCFloatingLabelAdapter, [{\n    key: \"addClass\",\n\n    /**\n     * Adds a class to the label element.\n     * @param {string} className\n     */\n    value: function addClass(className) {}\n    /**\n     * Removes a class from the label element.\n     * @param {string} className\n     */\n\n  }, {\n    key: \"removeClass\",\n    value: function removeClass(className) {}\n    /**\n     * Returns the width of the label element.\n     * @return {number}\n     */\n\n  }, {\n    key: \"getWidth\",\n    value: function getWidth() {}\n    /**\n     * Registers an event listener on the root element for a given event.\n     * @param {string} evtType\n     * @param {function(!Event): undefined} handler\n     */\n\n  }, {\n    key: \"registerInteractionHandler\",\n    value: function registerInteractionHandler(evtType, handler) {}\n    /**\n     * Deregisters an event listener on the root element for a given event.\n     * @param {string} evtType\n     * @param {function(!Event): undefined} handler\n     */\n\n  }, {\n    key: \"deregisterInteractionHandler\",\n    value: function deregisterInteractionHandler(evtType, handler) {}\n  }]);\n\n  return MDCFloatingLabelAdapter;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MDCFloatingLabelAdapter);\n\n//# sourceURL=webpack:///./node_modules/@material/floating-label/adapter.js?");

  /***/ }),

  /***/ "./node_modules/@material/floating-label/constants.js":
  /*!************************************************************!*\
    !*** ./node_modules/@material/floating-label/constants.js ***!
    \************************************************************/
  /*! exports provided: cssClasses */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"cssClasses\", function() { return cssClasses; });\n/**\n * @license\n * Copyright 2016 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n/** @enum {string} */\nvar cssClasses = {\n  LABEL_FLOAT_ABOVE: 'mdc-floating-label--float-above',\n  LABEL_SHAKE: 'mdc-floating-label--shake'\n};\n\n\n//# sourceURL=webpack:///./node_modules/@material/floating-label/constants.js?");

  /***/ }),

  /***/ "./node_modules/@material/floating-label/foundation.js":
  /*!*************************************************************!*\
    !*** ./node_modules/@material/floating-label/foundation.js ***!
    \*************************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _material_base_foundation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @material/base/foundation */ \"./node_modules/@material/base/foundation.js\");\n/* harmony import */ var _adapter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./adapter */ \"./node_modules/@material/floating-label/adapter.js\");\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ \"./node_modules/@material/floating-label/constants.js\");\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\n/**\n * @license\n * Copyright 2016 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n\n\n/**\n * @extends {MDCFoundation<!MDCFloatingLabelAdapter>}\n * @final\n */\n\nvar MDCFloatingLabelFoundation =\n/*#__PURE__*/\nfunction (_MDCFoundation) {\n  _inherits(MDCFloatingLabelFoundation, _MDCFoundation);\n\n  _createClass(MDCFloatingLabelFoundation, null, [{\n    key: \"cssClasses\",\n\n    /** @return enum {string} */\n    get: function get() {\n      return _constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"];\n    }\n    /**\n     * {@see MDCFloatingLabelAdapter} for typing information on parameters and return\n     * types.\n     * @return {!MDCFloatingLabelAdapter}\n     */\n\n  }, {\n    key: \"defaultAdapter\",\n    get: function get() {\n      return (\n        /** @type {!MDCFloatingLabelAdapter} */\n        {\n          addClass: function addClass() {},\n          removeClass: function removeClass() {},\n          getWidth: function getWidth() {},\n          registerInteractionHandler: function registerInteractionHandler() {},\n          deregisterInteractionHandler: function deregisterInteractionHandler() {}\n        }\n      );\n    }\n    /**\n     * @param {!MDCFloatingLabelAdapter} adapter\n     */\n\n  }]);\n\n  function MDCFloatingLabelFoundation(adapter) {\n    var _this;\n\n    _classCallCheck(this, MDCFloatingLabelFoundation);\n\n    _this = _possibleConstructorReturn(this, _getPrototypeOf(MDCFloatingLabelFoundation).call(this, _extends(MDCFloatingLabelFoundation.defaultAdapter, adapter)));\n    /** @private {function(!Event): undefined} */\n\n    _this.shakeAnimationEndHandler_ = function () {\n      return _this.handleShakeAnimationEnd_();\n    };\n\n    return _this;\n  }\n\n  _createClass(MDCFloatingLabelFoundation, [{\n    key: \"init\",\n    value: function init() {\n      this.adapter_.registerInteractionHandler('animationend', this.shakeAnimationEndHandler_);\n    }\n  }, {\n    key: \"destroy\",\n    value: function destroy() {\n      this.adapter_.deregisterInteractionHandler('animationend', this.shakeAnimationEndHandler_);\n    }\n    /**\n     * Returns the width of the label element.\n     * @return {number}\n     */\n\n  }, {\n    key: \"getWidth\",\n    value: function getWidth() {\n      return this.adapter_.getWidth();\n    }\n    /**\n     * Styles the label to produce the label shake for errors.\n     * @param {boolean} shouldShake adds shake class if true,\n     * otherwise removes shake class.\n     */\n\n  }, {\n    key: \"shake\",\n    value: function shake(shouldShake) {\n      var LABEL_SHAKE = MDCFloatingLabelFoundation.cssClasses.LABEL_SHAKE;\n\n      if (shouldShake) {\n        this.adapter_.addClass(LABEL_SHAKE);\n      } else {\n        this.adapter_.removeClass(LABEL_SHAKE);\n      }\n    }\n    /**\n     * Styles the label to float or dock.\n     * @param {boolean} shouldFloat adds float class if true, otherwise remove\n     * float and shake class to dock label.\n     */\n\n  }, {\n    key: \"float\",\n    value: function float(shouldFloat) {\n      var _MDCFloatingLabelFoun = MDCFloatingLabelFoundation.cssClasses,\n          LABEL_FLOAT_ABOVE = _MDCFloatingLabelFoun.LABEL_FLOAT_ABOVE,\n          LABEL_SHAKE = _MDCFloatingLabelFoun.LABEL_SHAKE;\n\n      if (shouldFloat) {\n        this.adapter_.addClass(LABEL_FLOAT_ABOVE);\n      } else {\n        this.adapter_.removeClass(LABEL_FLOAT_ABOVE);\n        this.adapter_.removeClass(LABEL_SHAKE);\n      }\n    }\n    /**\n     * Handles an interaction event on the root element.\n     */\n\n  }, {\n    key: \"handleShakeAnimationEnd_\",\n    value: function handleShakeAnimationEnd_() {\n      var LABEL_SHAKE = MDCFloatingLabelFoundation.cssClasses.LABEL_SHAKE;\n      this.adapter_.removeClass(LABEL_SHAKE);\n    }\n  }]);\n\n  return MDCFloatingLabelFoundation;\n}(_material_base_foundation__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MDCFloatingLabelFoundation);\n\n//# sourceURL=webpack:///./node_modules/@material/floating-label/foundation.js?");

  /***/ }),

  /***/ "./node_modules/@material/floating-label/index.js":
  /*!********************************************************!*\
    !*** ./node_modules/@material/floating-label/index.js ***!
    \********************************************************/
  /*! exports provided: MDCFloatingLabel, MDCFloatingLabelFoundation */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MDCFloatingLabel\", function() { return MDCFloatingLabel; });\n/* harmony import */ var _material_base_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @material/base/component */ \"./node_modules/@material/base/component.js\");\n/* harmony import */ var _adapter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./adapter */ \"./node_modules/@material/floating-label/adapter.js\");\n/* harmony import */ var _foundation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./foundation */ \"./node_modules/@material/floating-label/foundation.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"MDCFloatingLabelFoundation\", function() { return _foundation__WEBPACK_IMPORTED_MODULE_2__[\"default\"]; });\n\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\n/**\n * @license\n * Copyright 2016 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n\n\n/**\n * @extends {MDCComponent<!MDCFloatingLabelFoundation>}\n * @final\n */\n\nvar MDCFloatingLabel =\n/*#__PURE__*/\nfunction (_MDCComponent) {\n  _inherits(MDCFloatingLabel, _MDCComponent);\n\n  function MDCFloatingLabel() {\n    _classCallCheck(this, MDCFloatingLabel);\n\n    return _possibleConstructorReturn(this, _getPrototypeOf(MDCFloatingLabel).apply(this, arguments));\n  }\n\n  _createClass(MDCFloatingLabel, [{\n    key: \"shake\",\n\n    /**\n     * Styles the label to produce the label shake for errors.\n     * @param {boolean} shouldShake styles the label to shake by adding shake class\n     * if true, otherwise will stop shaking by removing shake class.\n     */\n    value: function shake(shouldShake) {\n      this.foundation_.shake(shouldShake);\n    }\n    /**\n     * Styles label to float/dock.\n     * @param {boolean} shouldFloat styles the label to float by adding float class\n     * if true, otherwise docks the label by removing the float class.\n     */\n\n  }, {\n    key: \"float\",\n    value: function float(shouldFloat) {\n      this.foundation_.float(shouldFloat);\n    }\n    /**\n     * @return {number}\n     */\n\n  }, {\n    key: \"getWidth\",\n    value: function getWidth() {\n      return this.foundation_.getWidth();\n    }\n    /**\n     * @return {!MDCFloatingLabelFoundation}\n     */\n\n  }, {\n    key: \"getDefaultFoundation\",\n    value: function getDefaultFoundation() {\n      var _this = this;\n\n      return new _foundation__WEBPACK_IMPORTED_MODULE_2__[\"default\"]({\n        addClass: function addClass(className) {\n          return _this.root_.classList.add(className);\n        },\n        removeClass: function removeClass(className) {\n          return _this.root_.classList.remove(className);\n        },\n        getWidth: function getWidth() {\n          return _this.root_.offsetWidth;\n        },\n        registerInteractionHandler: function registerInteractionHandler(evtType, handler) {\n          return _this.root_.addEventListener(evtType, handler);\n        },\n        deregisterInteractionHandler: function deregisterInteractionHandler(evtType, handler) {\n          return _this.root_.removeEventListener(evtType, handler);\n        }\n      });\n    }\n  }], [{\n    key: \"attachTo\",\n\n    /**\n     * @param {!Element} root\n     * @return {!MDCFloatingLabel}\n     */\n    value: function attachTo(root) {\n      return new MDCFloatingLabel(root);\n    }\n  }]);\n\n  return MDCFloatingLabel;\n}(_material_base_component__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n\n\n\n//# sourceURL=webpack:///./node_modules/@material/floating-label/index.js?");

  /***/ }),

  /***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./components/floating-label/FloatingLabel.vue?vue&type=script&lang=js":
  /*!***********************************************************************************************************************************************************************!*\
    !*** ./node_modules/babel-loader/lib??ref--1!./node_modules/vue-loader/lib??vue-loader-options!./components/floating-label/FloatingLabel.vue?vue&type=script&lang=js ***!
    \***********************************************************************************************************************************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _material_floating_label__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @material/floating-label */ \"./node_modules/@material/floating-label/index.js\");\n/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../base */ \"./components/base/index.js\");\n//\n//\n//\n//\n//\n//\n//\n//\n//\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  mixins: [_base__WEBPACK_IMPORTED_MODULE_1__[\"baseComponentMixin\"], _base__WEBPACK_IMPORTED_MODULE_1__[\"themeClassMixin\"]],\n  props: {\n    floatAbove: {\n      type: Boolean,\n      default: false\n    },\n    shake: {\n      type: Boolean,\n      default: false\n    }\n  },\n  data: function data() {\n    return {\n      mdcFloatingLabel: undefined\n    };\n  },\n  computed: {\n    classes: function classes() {\n      return {\n        'mdc-floating-label--float-above': this.floatAbove,\n        'mdc-floating-label--shake': this.shake\n      };\n    }\n  },\n  mounted: function mounted() {\n    this.mdcFloatingLabel = _material_floating_label__WEBPACK_IMPORTED_MODULE_0__[\"MDCFloatingLabel\"].attachTo(this.$el);\n  },\n  beforeDestroy: function beforeDestroy() {\n    this.mdcFloatingLabel.destroy();\n  }\n});\n\n//# sourceURL=webpack:///./components/floating-label/FloatingLabel.vue?./node_modules/babel-loader/lib??ref--1!./node_modules/vue-loader/lib??vue-loader-options");

  /***/ }),

  /***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./components/floating-label/FloatingLabel.vue?vue&type=template&id=1cf96df2":
  /*!*****************************************************************************************************************************************************************************************************************!*\
    !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./components/floating-label/FloatingLabel.vue?vue&type=template&id=1cf96df2 ***!
    \*****************************************************************************************************************************************************************************************************************/
  /*! exports provided: render, staticRenderFns */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return staticRenderFns; });\nvar render = function() {\n  var _vm = this\n  var _h = _vm.$createElement\n  var _c = _vm._self._c || _h\n  return _c(\n    \"label\",\n    _vm._b(\n      { staticClass: \"mdc-floating-label\", class: _vm.classes },\n      \"label\",\n      _vm.$attrs,\n      false\n    ),\n    [_vm._t(\"default\")],\n    2\n  )\n}\nvar staticRenderFns = []\nrender._withStripped = true\n\n\n\n//# sourceURL=webpack:///./components/floating-label/FloatingLabel.vue?./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options");

  /***/ }),

  /***/ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js":
  /*!********************************************************************!*\
    !*** ./node_modules/vue-loader/lib/runtime/componentNormalizer.js ***!
    \********************************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return normalizeComponent; });\n/* globals __VUE_SSR_CONTEXT__ */\n\n// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).\n// This module is a runtime utility for cleaner component module output and will\n// be included in the final webpack user bundle.\n\nfunction normalizeComponent (\n  scriptExports,\n  render,\n  staticRenderFns,\n  functionalTemplate,\n  injectStyles,\n  scopeId,\n  moduleIdentifier, /* server only */\n  shadowMode /* vue-cli only */\n) {\n  // Vue.extend constructor export interop\n  var options = typeof scriptExports === 'function'\n    ? scriptExports.options\n    : scriptExports\n\n  // render functions\n  if (render) {\n    options.render = render\n    options.staticRenderFns = staticRenderFns\n    options._compiled = true\n  }\n\n  // functional template\n  if (functionalTemplate) {\n    options.functional = true\n  }\n\n  // scopedId\n  if (scopeId) {\n    options._scopeId = 'data-v-' + scopeId\n  }\n\n  var hook\n  if (moduleIdentifier) { // server build\n    hook = function (context) {\n      // 2.3 injection\n      context =\n        context || // cached call\n        (this.$vnode && this.$vnode.ssrContext) || // stateful\n        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional\n      // 2.2 with runInNewContext: true\n      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {\n        context = __VUE_SSR_CONTEXT__\n      }\n      // inject component styles\n      if (injectStyles) {\n        injectStyles.call(this, context)\n      }\n      // register component module identifier for async chunk inferrence\n      if (context && context._registeredComponents) {\n        context._registeredComponents.add(moduleIdentifier)\n      }\n    }\n    // used by ssr in case component is cached and beforeCreate\n    // never gets called\n    options._ssrRegister = hook\n  } else if (injectStyles) {\n    hook = shadowMode\n      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }\n      : injectStyles\n  }\n\n  if (hook) {\n    if (options.functional) {\n      // for template-only hot-reload because in that case the render fn doesn't\n      // go through the normalizer\n      options._injectStyles = hook\n      // register for functioal component in vue file\n      var originalRender = options.render\n      options.render = function renderWithStyleInjection (h, context) {\n        hook.call(context)\n        return originalRender(h, context)\n      }\n    } else {\n      // inject component registration as beforeCreate hook\n      var existing = options.beforeCreate\n      options.beforeCreate = existing\n        ? [].concat(existing, hook)\n        : [hook]\n    }\n  }\n\n  return {\n    exports: scriptExports,\n    options: options\n  }\n}\n\n\n//# sourceURL=webpack:///./node_modules/vue-loader/lib/runtime/componentNormalizer.js?");

  /***/ })

  /******/ });
  });
  });

  var FloatingLabel = unwrapExports(floatingLabel);

  var lineRipple = createCommonjsModule(function (module, exports) {
  (function webpackUniversalModuleDefinition(root, factory) {
  	module.exports = factory();
  })(window, function() {
  return /******/ (function(modules) { // webpackBootstrap
  /******/ 	// The module cache
  /******/ 	var installedModules = {};
  /******/
  /******/ 	// The require function
  /******/ 	function __webpack_require__(moduleId) {
  /******/
  /******/ 		// Check if module is in cache
  /******/ 		if(installedModules[moduleId]) {
  /******/ 			return installedModules[moduleId].exports;
  /******/ 		}
  /******/ 		// Create a new module (and put it into the cache)
  /******/ 		var module = installedModules[moduleId] = {
  /******/ 			i: moduleId,
  /******/ 			l: false,
  /******/ 			exports: {}
  /******/ 		};
  /******/
  /******/ 		// Execute the module function
  /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
  /******/
  /******/ 		// Flag the module as loaded
  /******/ 		module.l = true;
  /******/
  /******/ 		// Return the exports of the module
  /******/ 		return module.exports;
  /******/ 	}
  /******/
  /******/
  /******/ 	// expose the modules object (__webpack_modules__)
  /******/ 	__webpack_require__.m = modules;
  /******/
  /******/ 	// expose the module cache
  /******/ 	__webpack_require__.c = installedModules;
  /******/
  /******/ 	// define getter function for harmony exports
  /******/ 	__webpack_require__.d = function(exports, name, getter) {
  /******/ 		if(!__webpack_require__.o(exports, name)) {
  /******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
  /******/ 		}
  /******/ 	};
  /******/
  /******/ 	// define __esModule on exports
  /******/ 	__webpack_require__.r = function(exports) {
  /******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
  /******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
  /******/ 		}
  /******/ 		Object.defineProperty(exports, '__esModule', { value: true });
  /******/ 	};
  /******/
  /******/ 	// create a fake namespace object
  /******/ 	// mode & 1: value is a module id, require it
  /******/ 	// mode & 2: merge all properties of value into the ns
  /******/ 	// mode & 4: return value when already ns object
  /******/ 	// mode & 8|1: behave like require
  /******/ 	__webpack_require__.t = function(value, mode) {
  /******/ 		if(mode & 1) value = __webpack_require__(value);
  /******/ 		if(mode & 8) return value;
  /******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
  /******/ 		var ns = Object.create(null);
  /******/ 		__webpack_require__.r(ns);
  /******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
  /******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
  /******/ 		return ns;
  /******/ 	};
  /******/
  /******/ 	// getDefaultExport function for compatibility with non-harmony modules
  /******/ 	__webpack_require__.n = function(module) {
  /******/ 		var getter = module && module.__esModule ?
  /******/ 			function getDefault() { return module['default']; } :
  /******/ 			function getModuleExports() { return module; };
  /******/ 		__webpack_require__.d(getter, 'a', getter);
  /******/ 		return getter;
  /******/ 	};
  /******/
  /******/ 	// Object.prototype.hasOwnProperty.call
  /******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
  /******/
  /******/ 	// __webpack_public_path__
  /******/ 	__webpack_require__.p = "";
  /******/
  /******/
  /******/ 	// Load entry module and return exports
  /******/ 	return __webpack_require__(__webpack_require__.s = "./components/line-ripple/index.js");
  /******/ })
  /************************************************************************/
  /******/ ({

  /***/ "./components/base/baseComponentMixin.js":
  /*!***********************************************!*\
    !*** ./components/base/baseComponentMixin.js ***!
    \***********************************************/
  /*! exports provided: baseComponentMixin */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"baseComponentMixin\", function() { return baseComponentMixin; });\nvar baseComponentMixin = {\n  inheritAttrs: false\n};\n\n//# sourceURL=webpack:///./components/base/baseComponentMixin.js?");

  /***/ }),

  /***/ "./components/base/index.js":
  /*!**********************************!*\
    !*** ./components/base/index.js ***!
    \**********************************/
  /*! exports provided: baseComponentMixin, themeClassMixin */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _baseComponentMixin_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./baseComponentMixin.js */ \"./components/base/baseComponentMixin.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"baseComponentMixin\", function() { return _baseComponentMixin_js__WEBPACK_IMPORTED_MODULE_0__[\"baseComponentMixin\"]; });\n\n/* harmony import */ var _themeClassMixin_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./themeClassMixin.js */ \"./components/base/themeClassMixin.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"themeClassMixin\", function() { return _themeClassMixin_js__WEBPACK_IMPORTED_MODULE_1__[\"themeClassMixin\"]; });\n\n\n\n\n//# sourceURL=webpack:///./components/base/index.js?");

  /***/ }),

  /***/ "./components/base/themeClassMixin.js":
  /*!********************************************!*\
    !*** ./components/base/themeClassMixin.js ***!
    \********************************************/
  /*! exports provided: themeClassMixin */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"themeClassMixin\", function() { return themeClassMixin; });\nvar themeProps = ['primary', 'secondary', 'background', 'surface', 'on-primary', 'on-secondary', 'on-surface', 'primary-bg', 'secondary-bg', 'text-primary-on-light', 'text-secondary-on-light', 'text-hint-on-light', 'text-disabled-on-light', 'text-icon-on-light', 'text-primary-on-dark', 'text-secondary-on-dark', 'text-hint-on-dark', 'text-disabled-on-dark', 'text-icon-on-dark'];\nvar themeClassMixin = {\n  props: {\n    theming: {\n      type: String,\n      default: ''\n    }\n  },\n  mounted: function mounted() {\n    if (themeProps.indexOf(this.theming) > -1) {\n      this.$el.classList.add('mdc-theme--' + this.theming);\n    }\n  }\n};\n\n//# sourceURL=webpack:///./components/base/themeClassMixin.js?");

  /***/ }),

  /***/ "./components/debounce.js":
  /*!********************************!*\
    !*** ./components/debounce.js ***!
    \********************************/
  /*! exports provided: debounce */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"debounce\", function() { return debounce; });\nfunction debounce(fn, debounceDuration) {\n  debounceDuration = debounceDuration || 100;\n  return function () {\n    if (!fn.debouncing) {\n      var args = Array.prototype.slice.apply(arguments);\n      fn.lastReturnVal = fn.apply(window, args);\n      fn.debouncing = true;\n    }\n\n    clearTimeout(fn.debounceTimeout);\n    fn.debounceTimeout = setTimeout(function () {\n      fn.debouncing = false;\n    }, debounceDuration);\n    return fn.lastReturnVal;\n  };\n}\n\n//# sourceURL=webpack:///./components/debounce.js?");

  /***/ }),

  /***/ "./components/index.js":
  /*!*****************************!*\
    !*** ./components/index.js ***!
    \*****************************/
  /*! exports provided: debounce, initPlugin */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _debounce_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./debounce.js */ \"./components/debounce.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"debounce\", function() { return _debounce_js__WEBPACK_IMPORTED_MODULE_0__[\"debounce\"]; });\n\n/* harmony import */ var _initPlugin_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./initPlugin.js */ \"./components/initPlugin.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"initPlugin\", function() { return _initPlugin_js__WEBPACK_IMPORTED_MODULE_1__[\"initPlugin\"]; });\n\n\n\n\n//# sourceURL=webpack:///./components/index.js?");

  /***/ }),

  /***/ "./components/initPlugin.js":
  /*!**********************************!*\
    !*** ./components/initPlugin.js ***!
    \**********************************/
  /*! exports provided: initPlugin */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"initPlugin\", function() { return initPlugin; });\nfunction initPlugin(plugin) {\n  if (typeof window !== 'undefined' && window.Vue) {\n    window.Vue.use(plugin);\n  }\n}\n\n//# sourceURL=webpack:///./components/initPlugin.js?");

  /***/ }),

  /***/ "./components/line-ripple/LineRipple.vue":
  /*!***********************************************!*\
    !*** ./components/line-ripple/LineRipple.vue ***!
    \***********************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _LineRipple_vue_vue_type_template_id_4cd4e505__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./LineRipple.vue?vue&type=template&id=4cd4e505 */ \"./components/line-ripple/LineRipple.vue?vue&type=template&id=4cd4e505\");\n/* harmony import */ var _LineRipple_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./LineRipple.vue?vue&type=script&lang=js */ \"./components/line-ripple/LineRipple.vue?vue&type=script&lang=js\");\n/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ \"./node_modules/vue-loader/lib/runtime/componentNormalizer.js\");\n\n\n\n\n\n/* normalize component */\n\nvar component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(\n  _LineRipple_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  _LineRipple_vue_vue_type_template_id_4cd4e505__WEBPACK_IMPORTED_MODULE_0__[\"render\"],\n  _LineRipple_vue_vue_type_template_id_4cd4e505__WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"],\n  false,\n  null,\n  null,\n  null\n  \n)\n\n/* hot reload */\nif (false) { var api; }\ncomponent.options.__file = \"components/line-ripple/LineRipple.vue\"\n/* harmony default export */ __webpack_exports__[\"default\"] = (component.exports);\n\n//# sourceURL=webpack:///./components/line-ripple/LineRipple.vue?");

  /***/ }),

  /***/ "./components/line-ripple/LineRipple.vue?vue&type=script&lang=js":
  /*!***********************************************************************!*\
    !*** ./components/line-ripple/LineRipple.vue?vue&type=script&lang=js ***!
    \***********************************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_1_node_modules_vue_loader_lib_index_js_vue_loader_options_LineRipple_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib??ref--1!../../node_modules/vue-loader/lib??vue-loader-options!./LineRipple.vue?vue&type=script&lang=js */ \"./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./components/line-ripple/LineRipple.vue?vue&type=script&lang=js\");\n/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__[\"default\"] = (_node_modules_babel_loader_lib_index_js_ref_1_node_modules_vue_loader_lib_index_js_vue_loader_options_LineRipple_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]); \n\n//# sourceURL=webpack:///./components/line-ripple/LineRipple.vue?");

  /***/ }),

  /***/ "./components/line-ripple/LineRipple.vue?vue&type=template&id=4cd4e505":
  /*!*****************************************************************************!*\
    !*** ./components/line-ripple/LineRipple.vue?vue&type=template&id=4cd4e505 ***!
    \*****************************************************************************/
  /*! exports provided: render, staticRenderFns */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_LineRipple_vue_vue_type_template_id_4cd4e505__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib??vue-loader-options!./LineRipple.vue?vue&type=template&id=4cd4e505 */ \"./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./components/line-ripple/LineRipple.vue?vue&type=template&id=4cd4e505\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_LineRipple_vue_vue_type_template_id_4cd4e505__WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_LineRipple_vue_vue_type_template_id_4cd4e505__WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"]; });\n\n\n\n//# sourceURL=webpack:///./components/line-ripple/LineRipple.vue?");

  /***/ }),

  /***/ "./components/line-ripple/index.js":
  /*!*****************************************!*\
    !*** ./components/line-ripple/index.js ***!
    \*****************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _LineRipple_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./LineRipple.vue */ \"./components/line-ripple/LineRipple.vue\");\n/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./styles.scss */ \"./components/line-ripple/styles.scss\");\n/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_scss__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../ */ \"./components/index.js\");\n\n\n\nvar plugin = {\n  install: function install(vm) {\n    vm.component('m-line-ripple', _LineRipple_vue__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n  }\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = (plugin);\nObject(___WEBPACK_IMPORTED_MODULE_2__[\"initPlugin\"])(plugin);\n\n//# sourceURL=webpack:///./components/line-ripple/index.js?");

  /***/ }),

  /***/ "./components/line-ripple/styles.scss":
  /*!********************************************!*\
    !*** ./components/line-ripple/styles.scss ***!
    \********************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {

  eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./components/line-ripple/styles.scss?");

  /***/ }),

  /***/ "./node_modules/@material/base/component.js":
  /*!**************************************************!*\
    !*** ./node_modules/@material/base/component.js ***!
    \**************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _foundation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./foundation */ \"./node_modules/@material/base/foundation.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n/**\n * @license\n * Copyright 2016 Google Inc.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *   http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n/**\n * @template F\n */\n\nvar MDCComponent =\n/*#__PURE__*/\nfunction () {\n  _createClass(MDCComponent, null, [{\n    key: \"attachTo\",\n\n    /**\n     * @param {!Element} root\n     * @return {!MDCComponent}\n     */\n    value: function attachTo(root) {\n      // Subclasses which extend MDCBase should provide an attachTo() method that takes a root element and\n      // returns an instantiated component with its root set to that element. Also note that in the cases of\n      // subclasses, an explicit foundation class will not have to be passed in; it will simply be initialized\n      // from getDefaultFoundation().\n      return new MDCComponent(root, new _foundation__WEBPACK_IMPORTED_MODULE_0__[\"default\"]());\n    }\n    /**\n     * @param {!Element} root\n     * @param {F=} foundation\n     * @param {...?} args\n     */\n\n  }]);\n\n  function MDCComponent(root) {\n    var foundation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;\n\n    _classCallCheck(this, MDCComponent);\n\n    /** @protected {!Element} */\n    this.root_ = root;\n\n    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {\n      args[_key - 2] = arguments[_key];\n    }\n\n    this.initialize.apply(this, args); // Note that we initialize foundation here and not within the constructor's default param so that\n    // this.root_ is defined and can be used within the foundation class.\n\n    /** @protected {!F} */\n\n    this.foundation_ = foundation === undefined ? this.getDefaultFoundation() : foundation;\n    this.foundation_.init();\n    this.initialSyncWithDOM();\n  }\n\n  _createClass(MDCComponent, [{\n    key: \"initialize\",\n    value: function initialize()\n    /* ...args */\n    {} // Subclasses can override this to do any additional setup work that would be considered part of a\n    // \"constructor\". Essentially, it is a hook into the parent constructor before the foundation is\n    // initialized. Any additional arguments besides root and foundation will be passed in here.\n\n    /**\n     * @return {!F} foundation\n     */\n\n  }, {\n    key: \"getDefaultFoundation\",\n    value: function getDefaultFoundation() {\n      // Subclasses must override this method to return a properly configured foundation class for the\n      // component.\n      throw new Error('Subclasses must override getDefaultFoundation to return a properly configured ' + 'foundation class');\n    }\n  }, {\n    key: \"initialSyncWithDOM\",\n    value: function initialSyncWithDOM() {// Subclasses should override this method if they need to perform work to synchronize with a host DOM\n      // object. An example of this would be a form control wrapper that needs to synchronize its internal state\n      // to some property or attribute of the host DOM. Please note: this is *not* the place to perform DOM\n      // reads/writes that would cause layout / paint, as this is called synchronously from within the constructor.\n    }\n  }, {\n    key: \"destroy\",\n    value: function destroy() {\n      // Subclasses may implement this method to release any resources / deregister any listeners they have\n      // attached. An example of this might be deregistering a resize event from the window object.\n      this.foundation_.destroy();\n    }\n    /**\n     * Wrapper method to add an event listener to the component's root element. This is most useful when\n     * listening for custom events.\n     * @param {string} evtType\n     * @param {!Function} handler\n     */\n\n  }, {\n    key: \"listen\",\n    value: function listen(evtType, handler) {\n      this.root_.addEventListener(evtType, handler);\n    }\n    /**\n     * Wrapper method to remove an event listener to the component's root element. This is most useful when\n     * unlistening for custom events.\n     * @param {string} evtType\n     * @param {!Function} handler\n     */\n\n  }, {\n    key: \"unlisten\",\n    value: function unlisten(evtType, handler) {\n      this.root_.removeEventListener(evtType, handler);\n    }\n    /**\n     * Fires a cross-browser-compatible custom event from the component root of the given type,\n     * with the given data.\n     * @param {string} evtType\n     * @param {!Object} evtData\n     * @param {boolean=} shouldBubble\n     */\n\n  }, {\n    key: \"emit\",\n    value: function emit(evtType, evtData) {\n      var shouldBubble = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;\n      var evt;\n\n      if (typeof CustomEvent === 'function') {\n        evt = new CustomEvent(evtType, {\n          detail: evtData,\n          bubbles: shouldBubble\n        });\n      } else {\n        evt = document.createEvent('CustomEvent');\n        evt.initCustomEvent(evtType, shouldBubble, false, evtData);\n      }\n\n      this.root_.dispatchEvent(evt);\n    }\n  }]);\n\n  return MDCComponent;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MDCComponent);\n\n//# sourceURL=webpack:///./node_modules/@material/base/component.js?");

  /***/ }),

  /***/ "./node_modules/@material/base/foundation.js":
  /*!***************************************************!*\
    !*** ./node_modules/@material/base/foundation.js ***!
    \***************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n/**\n * @license\n * Copyright 2016 Google Inc.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *   http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n/**\n * @template A\n */\nvar MDCFoundation =\n/*#__PURE__*/\nfunction () {\n  _createClass(MDCFoundation, null, [{\n    key: \"cssClasses\",\n\n    /** @return enum{cssClasses} */\n    get: function get() {\n      // Classes extending MDCFoundation should implement this method to return an object which exports every\n      // CSS class the foundation class needs as a property. e.g. {ACTIVE: 'mdc-component--active'}\n      return {};\n    }\n    /** @return enum{strings} */\n\n  }, {\n    key: \"strings\",\n    get: function get() {\n      // Classes extending MDCFoundation should implement this method to return an object which exports all\n      // semantic strings as constants. e.g. {ARIA_ROLE: 'tablist'}\n      return {};\n    }\n    /** @return enum{numbers} */\n\n  }, {\n    key: \"numbers\",\n    get: function get() {\n      // Classes extending MDCFoundation should implement this method to return an object which exports all\n      // of its semantic numbers as constants. e.g. {ANIMATION_DELAY_MS: 350}\n      return {};\n    }\n    /** @return {!Object} */\n\n  }, {\n    key: \"defaultAdapter\",\n    get: function get() {\n      // Classes extending MDCFoundation may choose to implement this getter in order to provide a convenient\n      // way of viewing the necessary methods of an adapter. In the future, this could also be used for adapter\n      // validation.\n      return {};\n    }\n    /**\n     * @param {A=} adapter\n     */\n\n  }]);\n\n  function MDCFoundation() {\n    var adapter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};\n\n    _classCallCheck(this, MDCFoundation);\n\n    /** @protected {!A} */\n    this.adapter_ = adapter;\n  }\n\n  _createClass(MDCFoundation, [{\n    key: \"init\",\n    value: function init() {// Subclasses should override this method to perform initialization routines (registering events, etc.)\n    }\n  }, {\n    key: \"destroy\",\n    value: function destroy() {// Subclasses should override this method to perform de-initialization routines (de-registering events, etc.)\n    }\n  }]);\n\n  return MDCFoundation;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MDCFoundation);\n\n//# sourceURL=webpack:///./node_modules/@material/base/foundation.js?");

  /***/ }),

  /***/ "./node_modules/@material/line-ripple/adapter.js":
  /*!*******************************************************!*\
    !*** ./node_modules/@material/line-ripple/adapter.js ***!
    \*******************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n/**\n * @license\n * Copyright 2018 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n/* eslint no-unused-vars: [2, {\"args\": \"none\"}] */\n\n/**\n * Adapter for MDC TextField Line Ripple.\n *\n * Defines the shape of the adapter expected by the foundation. Implement this\n * adapter to integrate the line ripple into your framework. See\n * https://github.com/material-components/material-components-web/blob/master/docs/authoring-components.md\n * for more information.\n *\n * @record\n */\nvar MDCLineRippleAdapter =\n/*#__PURE__*/\nfunction () {\n  function MDCLineRippleAdapter() {\n    _classCallCheck(this, MDCLineRippleAdapter);\n  }\n\n  _createClass(MDCLineRippleAdapter, [{\n    key: \"addClass\",\n\n    /**\n     * Adds a class to the line ripple element.\n     * @param {string} className\n     */\n    value: function addClass(className) {}\n    /**\n     * Removes a class from the line ripple element.\n     * @param {string} className\n     */\n\n  }, {\n    key: \"removeClass\",\n    value: function removeClass(className) {}\n    /**\n     * @param {string} className\n     * @return {boolean}\n     */\n\n  }, {\n    key: \"hasClass\",\n    value: function hasClass(className) {}\n    /**\n     * Sets the style property with propertyName to value on the root element.\n     * @param {string} propertyName\n     * @param {string} value\n     */\n\n  }, {\n    key: \"setStyle\",\n    value: function setStyle(propertyName, value) {}\n    /**\n     * Registers an event listener on the line ripple element for a given event.\n     * @param {string} evtType\n     * @param {function(!Event): undefined} handler\n     */\n\n  }, {\n    key: \"registerEventHandler\",\n    value: function registerEventHandler(evtType, handler) {}\n    /**\n     * Deregisters an event listener on the line ripple element for a given event.\n     * @param {string} evtType\n     * @param {function(!Event): undefined} handler\n     */\n\n  }, {\n    key: \"deregisterEventHandler\",\n    value: function deregisterEventHandler(evtType, handler) {}\n  }]);\n\n  return MDCLineRippleAdapter;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MDCLineRippleAdapter);\n\n//# sourceURL=webpack:///./node_modules/@material/line-ripple/adapter.js?");

  /***/ }),

  /***/ "./node_modules/@material/line-ripple/constants.js":
  /*!*********************************************************!*\
    !*** ./node_modules/@material/line-ripple/constants.js ***!
    \*********************************************************/
  /*! exports provided: cssClasses */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"cssClasses\", function() { return cssClasses; });\n/**\n * @license\n * Copyright 2018 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n/** @enum {string} */\nvar cssClasses = {\n  LINE_RIPPLE_ACTIVE: 'mdc-line-ripple--active',\n  LINE_RIPPLE_DEACTIVATING: 'mdc-line-ripple--deactivating'\n};\n\n\n//# sourceURL=webpack:///./node_modules/@material/line-ripple/constants.js?");

  /***/ }),

  /***/ "./node_modules/@material/line-ripple/foundation.js":
  /*!**********************************************************!*\
    !*** ./node_modules/@material/line-ripple/foundation.js ***!
    \**********************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _material_base_foundation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @material/base/foundation */ \"./node_modules/@material/base/foundation.js\");\n/* harmony import */ var _adapter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./adapter */ \"./node_modules/@material/line-ripple/adapter.js\");\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ \"./node_modules/@material/line-ripple/constants.js\");\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\n/**\n * @license\n * Copyright 2018 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n\n\n/**\n * @extends {MDCFoundation<!MDCLineRippleAdapter>}\n * @final\n */\n\nvar MDCLineRippleFoundation =\n/*#__PURE__*/\nfunction (_MDCFoundation) {\n  _inherits(MDCLineRippleFoundation, _MDCFoundation);\n\n  _createClass(MDCLineRippleFoundation, null, [{\n    key: \"cssClasses\",\n\n    /** @return enum {string} */\n    get: function get() {\n      return _constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"];\n    }\n    /**\n     * {@see MDCLineRippleAdapter} for typing information on parameters and return\n     * types.\n     * @return {!MDCLineRippleAdapter}\n     */\n\n  }, {\n    key: \"defaultAdapter\",\n    get: function get() {\n      return (\n        /** @type {!MDCLineRippleAdapter} */\n        {\n          addClass: function addClass() {},\n          removeClass: function removeClass() {},\n          hasClass: function hasClass() {},\n          setStyle: function setStyle() {},\n          registerEventHandler: function registerEventHandler() {},\n          deregisterEventHandler: function deregisterEventHandler() {}\n        }\n      );\n    }\n    /**\n     * @param {!MDCLineRippleAdapter=} adapter\n     */\n\n  }]);\n\n  function MDCLineRippleFoundation() {\n    var _this;\n\n    var adapter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] :\n    /** @type {!MDCLineRippleAdapter} */\n    {};\n\n    _classCallCheck(this, MDCLineRippleFoundation);\n\n    _this = _possibleConstructorReturn(this, _getPrototypeOf(MDCLineRippleFoundation).call(this, _extends(MDCLineRippleFoundation.defaultAdapter, adapter)));\n    /** @private {function(!Event): undefined} */\n\n    _this.transitionEndHandler_ = function (evt) {\n      return _this.handleTransitionEnd(evt);\n    };\n\n    return _this;\n  }\n\n  _createClass(MDCLineRippleFoundation, [{\n    key: \"init\",\n    value: function init() {\n      this.adapter_.registerEventHandler('transitionend', this.transitionEndHandler_);\n    }\n  }, {\n    key: \"destroy\",\n    value: function destroy() {\n      this.adapter_.deregisterEventHandler('transitionend', this.transitionEndHandler_);\n    }\n    /**\n     * Activates the line ripple\n     */\n\n  }, {\n    key: \"activate\",\n    value: function activate() {\n      this.adapter_.removeClass(_constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"].LINE_RIPPLE_DEACTIVATING);\n      this.adapter_.addClass(_constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"].LINE_RIPPLE_ACTIVE);\n    }\n    /**\n     * Sets the center of the ripple animation to the given X coordinate.\n     * @param {number} xCoordinate\n     */\n\n  }, {\n    key: \"setRippleCenter\",\n    value: function setRippleCenter(xCoordinate) {\n      this.adapter_.setStyle('transform-origin', \"\".concat(xCoordinate, \"px center\"));\n    }\n    /**\n     * Deactivates the line ripple\n     */\n\n  }, {\n    key: \"deactivate\",\n    value: function deactivate() {\n      this.adapter_.addClass(_constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"].LINE_RIPPLE_DEACTIVATING);\n    }\n    /**\n     * Handles a transition end event\n     * @param {!Event} evt\n     */\n\n  }, {\n    key: \"handleTransitionEnd\",\n    value: function handleTransitionEnd(evt) {\n      // Wait for the line ripple to be either transparent or opaque\n      // before emitting the animation end event\n      var isDeactivating = this.adapter_.hasClass(_constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"].LINE_RIPPLE_DEACTIVATING);\n\n      if (evt.propertyName === 'opacity') {\n        if (isDeactivating) {\n          this.adapter_.removeClass(_constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"].LINE_RIPPLE_ACTIVE);\n          this.adapter_.removeClass(_constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"].LINE_RIPPLE_DEACTIVATING);\n        }\n      }\n    }\n  }]);\n\n  return MDCLineRippleFoundation;\n}(_material_base_foundation__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MDCLineRippleFoundation);\n\n//# sourceURL=webpack:///./node_modules/@material/line-ripple/foundation.js?");

  /***/ }),

  /***/ "./node_modules/@material/line-ripple/index.js":
  /*!*****************************************************!*\
    !*** ./node_modules/@material/line-ripple/index.js ***!
    \*****************************************************/
  /*! exports provided: MDCLineRipple, MDCLineRippleFoundation */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MDCLineRipple\", function() { return MDCLineRipple; });\n/* harmony import */ var _material_base_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @material/base/component */ \"./node_modules/@material/base/component.js\");\n/* harmony import */ var _adapter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./adapter */ \"./node_modules/@material/line-ripple/adapter.js\");\n/* harmony import */ var _foundation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./foundation */ \"./node_modules/@material/line-ripple/foundation.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"MDCLineRippleFoundation\", function() { return _foundation__WEBPACK_IMPORTED_MODULE_2__[\"default\"]; });\n\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\n/**\n * @license\n * Copyright 2018 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n\n\n/**\n * @extends {MDCComponent<!MDCLineRippleFoundation>}\n * @final\n */\n\nvar MDCLineRipple =\n/*#__PURE__*/\nfunction (_MDCComponent) {\n  _inherits(MDCLineRipple, _MDCComponent);\n\n  function MDCLineRipple() {\n    _classCallCheck(this, MDCLineRipple);\n\n    return _possibleConstructorReturn(this, _getPrototypeOf(MDCLineRipple).apply(this, arguments));\n  }\n\n  _createClass(MDCLineRipple, [{\n    key: \"activate\",\n\n    /**\n     * Activates the line ripple\n     */\n    value: function activate() {\n      this.foundation_.activate();\n    }\n    /**\n     * Deactivates the line ripple\n     */\n\n  }, {\n    key: \"deactivate\",\n    value: function deactivate() {\n      this.foundation_.deactivate();\n    }\n    /**\n     * Sets the transform origin given a user's click location. The `rippleCenter` is the\n     * x-coordinate of the middle of the ripple.\n     * @param {number} xCoordinate\n     */\n\n  }, {\n    key: \"setRippleCenter\",\n    value: function setRippleCenter(xCoordinate) {\n      this.foundation_.setRippleCenter(xCoordinate);\n    }\n    /**\n     * @return {!MDCLineRippleFoundation}\n     */\n\n  }, {\n    key: \"getDefaultFoundation\",\n    value: function getDefaultFoundation() {\n      var _this = this;\n\n      return new _foundation__WEBPACK_IMPORTED_MODULE_2__[\"default\"](\n      /** @type {!MDCLineRippleAdapter} */\n      _extends({\n        addClass: function addClass(className) {\n          return _this.root_.classList.add(className);\n        },\n        removeClass: function removeClass(className) {\n          return _this.root_.classList.remove(className);\n        },\n        hasClass: function hasClass(className) {\n          return _this.root_.classList.contains(className);\n        },\n        setStyle: function setStyle(propertyName, value) {\n          return _this.root_.style[propertyName] = value;\n        },\n        registerEventHandler: function registerEventHandler(evtType, handler) {\n          return _this.root_.addEventListener(evtType, handler);\n        },\n        deregisterEventHandler: function deregisterEventHandler(evtType, handler) {\n          return _this.root_.removeEventListener(evtType, handler);\n        }\n      }));\n    }\n  }], [{\n    key: \"attachTo\",\n\n    /**\n     * @param {!Element} root\n     * @return {!MDCLineRipple}\n     */\n    value: function attachTo(root) {\n      return new MDCLineRipple(root);\n    }\n  }]);\n\n  return MDCLineRipple;\n}(_material_base_component__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n\n\n\n//# sourceURL=webpack:///./node_modules/@material/line-ripple/index.js?");

  /***/ }),

  /***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./components/line-ripple/LineRipple.vue?vue&type=script&lang=js":
  /*!*****************************************************************************************************************************************************************!*\
    !*** ./node_modules/babel-loader/lib??ref--1!./node_modules/vue-loader/lib??vue-loader-options!./components/line-ripple/LineRipple.vue?vue&type=script&lang=js ***!
    \*****************************************************************************************************************************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _material_line_ripple__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @material/line-ripple */ \"./node_modules/@material/line-ripple/index.js\");\n/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../base */ \"./components/base/index.js\");\n//\n//\n//\n//\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  mixins: [_base__WEBPACK_IMPORTED_MODULE_1__[\"baseComponentMixin\"], _base__WEBPACK_IMPORTED_MODULE_1__[\"themeClassMixin\"]],\n  data: function data() {\n    return {\n      mdcLineRipple: undefined\n    };\n  },\n  mounted: function mounted() {\n    this.mdcLineRipple = _material_line_ripple__WEBPACK_IMPORTED_MODULE_0__[\"MDCLineRipple\"].attachTo(this.$el);\n  },\n  methods: {\n    activate: function activate() {\n      this.mdcLineRipple.activate();\n    },\n    deactivate: function deactivate() {\n      this.mdcLineRipple.deactivate();\n    },\n    setRippleCenter: function setRippleCenter(xCoordinate) {\n      this.mdcLineRipple.setRippleCenter(xCoordinate);\n    }\n  }\n});\n\n//# sourceURL=webpack:///./components/line-ripple/LineRipple.vue?./node_modules/babel-loader/lib??ref--1!./node_modules/vue-loader/lib??vue-loader-options");

  /***/ }),

  /***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./components/line-ripple/LineRipple.vue?vue&type=template&id=4cd4e505":
  /*!***********************************************************************************************************************************************************************************************************!*\
    !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./components/line-ripple/LineRipple.vue?vue&type=template&id=4cd4e505 ***!
    \***********************************************************************************************************************************************************************************************************/
  /*! exports provided: render, staticRenderFns */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return staticRenderFns; });\nvar render = function() {\n  var _vm = this\n  var _h = _vm.$createElement\n  var _c = _vm._self._c || _h\n  return _c(\"div\", { staticClass: \"mdc-line-ripple\" })\n}\nvar staticRenderFns = []\nrender._withStripped = true\n\n\n\n//# sourceURL=webpack:///./components/line-ripple/LineRipple.vue?./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options");

  /***/ }),

  /***/ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js":
  /*!********************************************************************!*\
    !*** ./node_modules/vue-loader/lib/runtime/componentNormalizer.js ***!
    \********************************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return normalizeComponent; });\n/* globals __VUE_SSR_CONTEXT__ */\n\n// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).\n// This module is a runtime utility for cleaner component module output and will\n// be included in the final webpack user bundle.\n\nfunction normalizeComponent (\n  scriptExports,\n  render,\n  staticRenderFns,\n  functionalTemplate,\n  injectStyles,\n  scopeId,\n  moduleIdentifier, /* server only */\n  shadowMode /* vue-cli only */\n) {\n  // Vue.extend constructor export interop\n  var options = typeof scriptExports === 'function'\n    ? scriptExports.options\n    : scriptExports\n\n  // render functions\n  if (render) {\n    options.render = render\n    options.staticRenderFns = staticRenderFns\n    options._compiled = true\n  }\n\n  // functional template\n  if (functionalTemplate) {\n    options.functional = true\n  }\n\n  // scopedId\n  if (scopeId) {\n    options._scopeId = 'data-v-' + scopeId\n  }\n\n  var hook\n  if (moduleIdentifier) { // server build\n    hook = function (context) {\n      // 2.3 injection\n      context =\n        context || // cached call\n        (this.$vnode && this.$vnode.ssrContext) || // stateful\n        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional\n      // 2.2 with runInNewContext: true\n      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {\n        context = __VUE_SSR_CONTEXT__\n      }\n      // inject component styles\n      if (injectStyles) {\n        injectStyles.call(this, context)\n      }\n      // register component module identifier for async chunk inferrence\n      if (context && context._registeredComponents) {\n        context._registeredComponents.add(moduleIdentifier)\n      }\n    }\n    // used by ssr in case component is cached and beforeCreate\n    // never gets called\n    options._ssrRegister = hook\n  } else if (injectStyles) {\n    hook = shadowMode\n      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }\n      : injectStyles\n  }\n\n  if (hook) {\n    if (options.functional) {\n      // for template-only hot-reload because in that case the render fn doesn't\n      // go through the normalizer\n      options._injectStyles = hook\n      // register for functioal component in vue file\n      var originalRender = options.render\n      options.render = function renderWithStyleInjection (h, context) {\n        hook.call(context)\n        return originalRender(h, context)\n      }\n    } else {\n      // inject component registration as beforeCreate hook\n      var existing = options.beforeCreate\n      options.beforeCreate = existing\n        ? [].concat(existing, hook)\n        : [hook]\n    }\n  }\n\n  return {\n    exports: scriptExports,\n    options: options\n  }\n}\n\n\n//# sourceURL=webpack:///./node_modules/vue-loader/lib/runtime/componentNormalizer.js?");

  /***/ })

  /******/ });
  });
  });

  var LineRipple = unwrapExports(lineRipple);

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

  // import {MDCTextField} from '@material/textfield';
  var ExampleFormComponent = /** @class */ (function (_super) {
      __extends(ExampleFormComponent, _super);
      function ExampleFormComponent() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.text = "Testing";
          return _this;
      }
      ExampleFormComponent.prototype.mounted = function () {
      };
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
        _c("m-card", [_c("div")]),
        _vm._v(" "),
        _c(
          "m-textfield",
          {
            attrs: { id: "textfield" },
            model: {
              value: _vm.text,
              callback: function($$v) {
                _vm.text = $$v;
              },
              expression: "text"
            }
          },
          [
            _c("m-floating-label", { attrs: { for: "textfield" } }, [
              _vm._v("Textfield label")
            ]),
            _vm._v(" "),
            _c("m-line-ripple", {
              attrs: { slot: "bottomLine" },
              slot: "bottomLine"
            })
          ],
          1
        ),
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
      return _c("div", [_c("span", { staticClass: "icomoon-phone" })])
    }
  ];
  __vue_render__$1._withStripped = true;

    /* style */
    const __vue_inject_styles__$1 = function (inject) {
      if (!inject) return
      inject("data-v-3079414e_0", { source: "\n.mdc-card[data-v-3079414e] {\n  background-color: #fff;\n  /* @alternate */\n  background-color: var(--mdc-theme-surface, #fff);\n  border-radius: 2px;\n  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);\n  display: flex;\n  flex-direction: column;\n  box-sizing: border-box;\n}\n.mdc-card--outlined[data-v-3079414e] {\n  box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.2), 0px 0px 0px 0px rgba(0, 0, 0, 0.14), 0px 0px 0px 0px rgba(0, 0, 0, 0.12);\n  border: 1px solid #e0e0e0;\n}\n.mdc-card__media[data-v-3079414e] {\n  position: relative;\n  box-sizing: border-box;\n  background-repeat: no-repeat;\n  background-position: center;\n  background-size: cover;\n}\n.mdc-card__media[data-v-3079414e]::before {\n    display: block;\n    content: \"\";\n}\n.mdc-card__media[data-v-3079414e]:first-child {\n  border-top-left-radius: inherit;\n  border-top-right-radius: inherit;\n}\n.mdc-card__media[data-v-3079414e]:last-child {\n  border-bottom-left-radius: inherit;\n  border-bottom-right-radius: inherit;\n}\n.mdc-card__media--square[data-v-3079414e]::before {\n  margin-top: 100%;\n}\n.mdc-card__media--16-9[data-v-3079414e]::before {\n  margin-top: 56.25%;\n}\n.mdc-card__media-content[data-v-3079414e] {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  box-sizing: border-box;\n}\n.mdc-card__primary-action[data-v-3079414e] {\n  --mdc-ripple-fg-size: 0;\n  --mdc-ripple-left: 0;\n  --mdc-ripple-top: 0;\n  --mdc-ripple-fg-scale: 1;\n  --mdc-ripple-fg-translate-end: 0;\n  --mdc-ripple-fg-translate-start: 0;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  will-change: transform, opacity;\n  display: flex;\n  flex-direction: column;\n  box-sizing: border-box;\n  position: relative;\n  outline: none;\n  color: inherit;\n  text-decoration: none;\n  cursor: pointer;\n  overflow: hidden;\n}\n.mdc-card__primary-action[data-v-3079414e]::before, .mdc-card__primary-action[data-v-3079414e]::after {\n    position: absolute;\n    border-radius: 50%;\n    opacity: 0;\n    pointer-events: none;\n    content: \"\";\n}\n.mdc-card__primary-action[data-v-3079414e]::before {\n    transition: opacity 15ms linear;\n    z-index: 1;\n}\n.mdc-card__primary-action.mdc-ripple-upgraded[data-v-3079414e]::before {\n    transform: scale(var(--mdc-ripple-fg-scale, 1));\n}\n.mdc-card__primary-action.mdc-ripple-upgraded[data-v-3079414e]::after {\n    top: 0;\n    /* @noflip */\n    left: 0;\n    transform: scale(0);\n    transform-origin: center center;\n}\n.mdc-card__primary-action.mdc-ripple-upgraded--unbounded[data-v-3079414e]::after {\n    top: var(--mdc-ripple-top, 0);\n    /* @noflip */\n    left: var(--mdc-ripple-left, 0);\n}\n.mdc-card__primary-action.mdc-ripple-upgraded--foreground-activation[data-v-3079414e]::after {\n    animation: 225ms mdc-ripple-fg-radius-in-data-v-3079414e forwards,75ms mdc-ripple-fg-opacity-in-data-v-3079414e forwards;\n}\n.mdc-card__primary-action.mdc-ripple-upgraded--foreground-deactivation[data-v-3079414e]::after {\n    animation: 150ms mdc-ripple-fg-opacity-out-data-v-3079414e;\n    transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n}\n.mdc-card__primary-action[data-v-3079414e]::before, .mdc-card__primary-action[data-v-3079414e]::after {\n    top: calc(50% - 100%);\n    /* @noflip */\n    left: calc(50% - 100%);\n    width: 200%;\n    height: 200%;\n}\n.mdc-card__primary-action.mdc-ripple-upgraded[data-v-3079414e]::after {\n    width: var(--mdc-ripple-fg-size, 100%);\n    height: var(--mdc-ripple-fg-size, 100%);\n}\n.mdc-card__primary-action[data-v-3079414e]::before, .mdc-card__primary-action[data-v-3079414e]::after {\n    background-color: black;\n}\n.mdc-card__primary-action[data-v-3079414e]:hover::before {\n    opacity: 0.04;\n}\n.mdc-card__primary-action[data-v-3079414e]:not(.mdc-ripple-upgraded):focus::before, .mdc-card__primary-action.mdc-ripple-upgraded--background-focused[data-v-3079414e]::before {\n    transition-duration: 75ms;\n    opacity: 0.12;\n}\n.mdc-card__primary-action[data-v-3079414e]:not(.mdc-ripple-upgraded)::after {\n    transition: opacity 150ms linear;\n}\n.mdc-card__primary-action[data-v-3079414e]:not(.mdc-ripple-upgraded):active::after {\n    transition-duration: 75ms;\n    opacity: 0.16;\n}\n.mdc-card__primary-action.mdc-ripple-upgraded[data-v-3079414e] {\n    --mdc-ripple-fg-opacity: 0.16;\n}\n.mdc-card__primary-action[data-v-3079414e]:first-child {\n  border-top-left-radius: inherit;\n  border-top-right-radius: inherit;\n}\n.mdc-card__primary-action[data-v-3079414e]:last-child {\n  border-bottom-left-radius: inherit;\n  border-bottom-right-radius: inherit;\n}\n.mdc-card__actions[data-v-3079414e] {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  box-sizing: border-box;\n  min-height: 52px;\n  padding: 8px;\n}\n.mdc-card__actions--full-bleed[data-v-3079414e] {\n  padding: 0;\n}\n.mdc-card__action-buttons[data-v-3079414e],\n.mdc-card__action-icons[data-v-3079414e] {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  box-sizing: border-box;\n}\n.mdc-card__action-icons[data-v-3079414e] {\n  color: rgba(0, 0, 0, 0.38);\n  /* @alternate */\n  color: var(--mdc-theme-text-icon-on-background, rgba(0, 0, 0, 0.38));\n  flex-grow: 1;\n  justify-content: flex-end;\n}\n.mdc-card__action-buttons + .mdc-card__action-icons[data-v-3079414e] {\n  /* @noflip */\n  margin-left: 16px;\n  /* @noflip */\n  margin-right: 0;\n}\n[dir=\"rtl\"] .mdc-card__action-buttons + .mdc-card__action-icons[data-v-3079414e], .mdc-card__action-buttons + .mdc-card__action-icons[dir=\"rtl\"][data-v-3079414e] {\n    /* @noflip */\n    margin-left: 0;\n    /* @noflip */\n    margin-right: 16px;\n}\n.mdc-card__action[data-v-3079414e] {\n  display: inline-flex;\n  flex-direction: row;\n  align-items: center;\n  box-sizing: border-box;\n  justify-content: center;\n  cursor: pointer;\n  user-select: none;\n}\n.mdc-card__action[data-v-3079414e]:focus {\n    outline: none;\n}\n.mdc-card__action--button[data-v-3079414e] {\n  /* @noflip */\n  margin-left: 0;\n  /* @noflip */\n  margin-right: 8px;\n  padding: 0 8px;\n}\n[dir=\"rtl\"] .mdc-card__action--button[data-v-3079414e], .mdc-card__action--button[dir=\"rtl\"][data-v-3079414e] {\n    /* @noflip */\n    margin-left: 8px;\n    /* @noflip */\n    margin-right: 0;\n}\n.mdc-card__action--button[data-v-3079414e]:last-child {\n    /* @noflip */\n    margin-left: 0;\n    /* @noflip */\n    margin-right: 0;\n}\n[dir=\"rtl\"] .mdc-card__action--button[data-v-3079414e]:last-child, .mdc-card__action--button:last-child[dir=\"rtl\"][data-v-3079414e] {\n      /* @noflip */\n      margin-left: 0;\n      /* @noflip */\n      margin-right: 0;\n}\n.mdc-card__actions--full-bleed .mdc-card__action--button[data-v-3079414e] {\n  justify-content: space-between;\n  width: 100%;\n  height: auto;\n  max-height: none;\n  margin: 0;\n  padding: 8px 16px;\n  text-align: left;\n}\n[dir=\"rtl\"] .mdc-card__actions--full-bleed .mdc-card__action--button[data-v-3079414e], .mdc-card__actions--full-bleed .mdc-card__action--button[dir=\"rtl\"][data-v-3079414e] {\n    text-align: right;\n}\n.mdc-card__action--icon[data-v-3079414e] {\n  margin: -6px 0;\n  padding: 12px;\n}\n.mdc-card__action--icon[data-v-3079414e]:not(:disabled) {\n  color: rgba(0, 0, 0, 0.38);\n  /* @alternate */\n  color: var(--mdc-theme-text-icon-on-background, rgba(0, 0, 0, 0.38));\n}\n@keyframes mdc-ripple-fg-radius-in-data-v-3079414e {\nfrom {\n    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    transform: translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1);\n}\nto {\n    transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n}\n}\n@keyframes mdc-ripple-fg-opacity-in-data-v-3079414e {\nfrom {\n    animation-timing-function: linear;\n    opacity: 0;\n}\nto {\n    opacity: var(--mdc-ripple-fg-opacity, 0);\n}\n}\n@keyframes mdc-ripple-fg-opacity-out-data-v-3079414e {\nfrom {\n    animation-timing-function: linear;\n    opacity: var(--mdc-ripple-fg-opacity, 0);\n}\nto {\n    opacity: 0;\n}\n}\n.mdc-ripple-surface--test-edge-var-bug[data-v-3079414e] {\n  --mdc-ripple-surface-test-edge-var: 1px solid #000;\n  visibility: hidden;\n}\n.mdc-ripple-surface--test-edge-var-bug[data-v-3079414e]::before {\n    border: var(--mdc-ripple-surface-test-edge-var);\n}\n.mdc-button[data-v-3079414e] {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 2.25rem;\n  font-weight: 500;\n  letter-spacing: 0.08929em;\n  text-decoration: none;\n  text-transform: uppercase;\n  --mdc-ripple-fg-size: 0;\n  --mdc-ripple-left: 0;\n  --mdc-ripple-top: 0;\n  --mdc-ripple-fg-scale: 1;\n  --mdc-ripple-fg-translate-end: 0;\n  --mdc-ripple-fg-translate-start: 0;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  will-change: transform, opacity;\n  padding: 0 8px 0 8px;\n  display: inline-flex;\n  position: relative;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n  min-width: 64px;\n  height: 36px;\n  border: none;\n  outline: none;\n  /* @alternate */\n  line-height: inherit;\n  user-select: none;\n  -webkit-appearance: none;\n  overflow: hidden;\n  vertical-align: middle;\n  border-radius: 2px;\n}\n.mdc-button[data-v-3079414e]::before, .mdc-button[data-v-3079414e]::after {\n    position: absolute;\n    border-radius: 50%;\n    opacity: 0;\n    pointer-events: none;\n    content: \"\";\n}\n.mdc-button[data-v-3079414e]::before {\n    transition: opacity 15ms linear;\n    z-index: 1;\n}\n.mdc-button.mdc-ripple-upgraded[data-v-3079414e]::before {\n    transform: scale(var(--mdc-ripple-fg-scale, 1));\n}\n.mdc-button.mdc-ripple-upgraded[data-v-3079414e]::after {\n    top: 0;\n    /* @noflip */\n    left: 0;\n    transform: scale(0);\n    transform-origin: center center;\n}\n.mdc-button.mdc-ripple-upgraded--unbounded[data-v-3079414e]::after {\n    top: var(--mdc-ripple-top, 0);\n    /* @noflip */\n    left: var(--mdc-ripple-left, 0);\n}\n.mdc-button.mdc-ripple-upgraded--foreground-activation[data-v-3079414e]::after {\n    animation: 225ms mdc-ripple-fg-radius-in-data-v-3079414e forwards,75ms mdc-ripple-fg-opacity-in-data-v-3079414e forwards;\n}\n.mdc-button.mdc-ripple-upgraded--foreground-deactivation[data-v-3079414e]::after {\n    animation: 150ms mdc-ripple-fg-opacity-out-data-v-3079414e;\n    transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n}\n.mdc-button[data-v-3079414e]::before, .mdc-button[data-v-3079414e]::after {\n    top: calc(50% - 100%);\n    /* @noflip */\n    left: calc(50% - 100%);\n    width: 200%;\n    height: 200%;\n}\n.mdc-button.mdc-ripple-upgraded[data-v-3079414e]::after {\n    width: var(--mdc-ripple-fg-size, 100%);\n    height: var(--mdc-ripple-fg-size, 100%);\n}\n.mdc-button[data-v-3079414e]::-moz-focus-inner {\n    padding: 0;\n    border: 0;\n}\n.mdc-button[data-v-3079414e]:active {\n    outline: none;\n}\n.mdc-button[data-v-3079414e]:hover {\n    cursor: pointer;\n}\n.mdc-button[data-v-3079414e]:disabled {\n    background-color: transparent;\n    color: rgba(0, 0, 0, 0.37);\n    cursor: default;\n    pointer-events: none;\n}\n.mdc-button[data-v-3079414e]:not(:disabled) {\n    background-color: transparent;\n}\n.mdc-button[data-v-3079414e]:not(:disabled) {\n    color: #6200ee;\n    /* @alternate */\n    color: var(--mdc-theme-primary, #6200ee);\n}\n.mdc-button[data-v-3079414e]::before, .mdc-button[data-v-3079414e]::after {\n    background-color: #6200ee;\n}\n@supports not (-ms-ime-align: auto) {\n.mdc-button[data-v-3079414e]::before, .mdc-button[data-v-3079414e]::after {\n        /* @alternate */\n        background-color: var(--mdc-theme-primary, #6200ee);\n}\n}\n.mdc-button[data-v-3079414e]:hover::before {\n    opacity: 0.04;\n}\n.mdc-button[data-v-3079414e]:not(.mdc-ripple-upgraded):focus::before, .mdc-button.mdc-ripple-upgraded--background-focused[data-v-3079414e]::before {\n    transition-duration: 75ms;\n    opacity: 0.12;\n}\n.mdc-button[data-v-3079414e]:not(.mdc-ripple-upgraded)::after {\n    transition: opacity 150ms linear;\n}\n.mdc-button[data-v-3079414e]:not(.mdc-ripple-upgraded):active::after {\n    transition-duration: 75ms;\n    opacity: 0.16;\n}\n.mdc-button.mdc-ripple-upgraded[data-v-3079414e] {\n    --mdc-ripple-fg-opacity: 0.16;\n}\n.mdc-button .mdc-button__icon[data-v-3079414e] {\n    /* @noflip */\n    margin-left: 0;\n    /* @noflip */\n    margin-right: 8px;\n    display: inline-block;\n    width: 18px;\n    height: 18px;\n    font-size: 18px;\n    vertical-align: top;\n}\n[dir=\"rtl\"] .mdc-button .mdc-button__icon[data-v-3079414e], .mdc-button .mdc-button__icon[dir=\"rtl\"][data-v-3079414e] {\n      /* @noflip */\n      margin-left: 8px;\n      /* @noflip */\n      margin-right: 0;\n}\n.mdc-button svg.mdc-button__icon[data-v-3079414e] {\n    fill: currentColor;\n}\n.mdc-button--raised .mdc-button__icon[data-v-3079414e],\n.mdc-button--unelevated .mdc-button__icon[data-v-3079414e],\n.mdc-button--outlined .mdc-button__icon[data-v-3079414e] {\n  /* @noflip */\n  margin-left: -4px;\n  /* @noflip */\n  margin-right: 8px;\n}\n[dir=\"rtl\"] .mdc-button--raised .mdc-button__icon[data-v-3079414e], .mdc-button--raised .mdc-button__icon[dir=\"rtl\"][data-v-3079414e], [dir=\"rtl\"]\n  .mdc-button--unelevated .mdc-button__icon[data-v-3079414e],\n  .mdc-button--unelevated .mdc-button__icon[dir=\"rtl\"][data-v-3079414e], [dir=\"rtl\"]\n  .mdc-button--outlined .mdc-button__icon[data-v-3079414e],\n  .mdc-button--outlined .mdc-button__icon[dir=\"rtl\"][data-v-3079414e] {\n    /* @noflip */\n    margin-left: 8px;\n    /* @noflip */\n    margin-right: -4px;\n}\n.mdc-button--raised[data-v-3079414e],\n.mdc-button--unelevated[data-v-3079414e] {\n  padding: 0 16px 0 16px;\n}\n.mdc-button--raised[data-v-3079414e]:disabled,\n  .mdc-button--unelevated[data-v-3079414e]:disabled {\n    background-color: rgba(0, 0, 0, 0.12);\n    color: rgba(0, 0, 0, 0.37);\n}\n.mdc-button--raised[data-v-3079414e]:not(:disabled),\n  .mdc-button--unelevated[data-v-3079414e]:not(:disabled) {\n    background-color: #6200ee;\n}\n@supports not (-ms-ime-align: auto) {\n.mdc-button--raised[data-v-3079414e]:not(:disabled),\n      .mdc-button--unelevated[data-v-3079414e]:not(:disabled) {\n        /* @alternate */\n        background-color: var(--mdc-theme-primary, #6200ee);\n}\n}\n.mdc-button--raised[data-v-3079414e]:not(:disabled),\n  .mdc-button--unelevated[data-v-3079414e]:not(:disabled) {\n    color: #fff;\n    /* @alternate */\n    color: var(--mdc-theme-on-primary, #fff);\n}\n.mdc-button--raised[data-v-3079414e]::before, .mdc-button--raised[data-v-3079414e]::after,\n  .mdc-button--unelevated[data-v-3079414e]::before,\n  .mdc-button--unelevated[data-v-3079414e]::after {\n    background-color: #fff;\n}\n@supports not (-ms-ime-align: auto) {\n.mdc-button--raised[data-v-3079414e]::before, .mdc-button--raised[data-v-3079414e]::after,\n      .mdc-button--unelevated[data-v-3079414e]::before,\n      .mdc-button--unelevated[data-v-3079414e]::after {\n        /* @alternate */\n        background-color: var(--mdc-theme-on-primary, #fff);\n}\n}\n.mdc-button--raised[data-v-3079414e]:hover::before,\n  .mdc-button--unelevated[data-v-3079414e]:hover::before {\n    opacity: 0.08;\n}\n.mdc-button--raised[data-v-3079414e]:not(.mdc-ripple-upgraded):focus::before, .mdc-button--raised.mdc-ripple-upgraded--background-focused[data-v-3079414e]::before,\n  .mdc-button--unelevated[data-v-3079414e]:not(.mdc-ripple-upgraded):focus::before,\n  .mdc-button--unelevated.mdc-ripple-upgraded--background-focused[data-v-3079414e]::before {\n    transition-duration: 75ms;\n    opacity: 0.24;\n}\n.mdc-button--raised[data-v-3079414e]:not(.mdc-ripple-upgraded)::after,\n  .mdc-button--unelevated[data-v-3079414e]:not(.mdc-ripple-upgraded)::after {\n    transition: opacity 150ms linear;\n}\n.mdc-button--raised[data-v-3079414e]:not(.mdc-ripple-upgraded):active::after,\n  .mdc-button--unelevated[data-v-3079414e]:not(.mdc-ripple-upgraded):active::after {\n    transition-duration: 75ms;\n    opacity: 0.32;\n}\n.mdc-button--raised.mdc-ripple-upgraded[data-v-3079414e],\n  .mdc-button--unelevated.mdc-ripple-upgraded[data-v-3079414e] {\n    --mdc-ripple-fg-opacity: 0.32;\n}\n.mdc-button--raised[data-v-3079414e] {\n  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);\n  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n.mdc-button--raised[data-v-3079414e]:hover, .mdc-button--raised[data-v-3079414e]:focus {\n    box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);\n}\n.mdc-button--raised[data-v-3079414e]:active {\n    box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12);\n}\n.mdc-button--raised[data-v-3079414e]:disabled {\n    box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.2), 0px 0px 0px 0px rgba(0, 0, 0, 0.14), 0px 0px 0px 0px rgba(0, 0, 0, 0.12);\n}\n.mdc-button--outlined[data-v-3079414e] {\n  border-style: solid;\n  padding: 0 14px 0 14px;\n  border-width: 2px;\n}\n.mdc-button--outlined[data-v-3079414e]:disabled {\n    border-color: rgba(0, 0, 0, 0.37);\n}\n.mdc-button--outlined[data-v-3079414e]:not(:disabled) {\n    border-color: #6200ee;\n    /* @alternate */\n    border-color: var(--mdc-theme-primary, #6200ee);\n}\n.mdc-button--dense[data-v-3079414e] {\n  height: 32px;\n  font-size: .8125rem;\n}\n.mdc-floating-label[data-v-3079414e] {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 1.75rem;\n  font-weight: 400;\n  letter-spacing: 0.00937em;\n  text-decoration: inherit;\n  text-transform: inherit;\n  position: absolute;\n  bottom: 8px;\n  left: 0;\n  transform-origin: left top;\n  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  line-height: 1.15rem;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  cursor: text;\n  overflow: hidden;\n  will-change: transform;\n}\n[dir=\"rtl\"] .mdc-floating-label[data-v-3079414e], .mdc-floating-label[dir=\"rtl\"][data-v-3079414e] {\n    /* @noflip */\n    right: 0;\n    /* @noflip */\n    left: auto;\n    /* @noflip */\n    transform-origin: right top;\n}\n.mdc-floating-label--float-above[data-v-3079414e] {\n  cursor: auto;\n}\n.mdc-floating-label--float-above[data-v-3079414e] {\n  transform: translateY(-100%) scale(0.75);\n}\n.mdc-floating-label--shake[data-v-3079414e] {\n  animation: mdc-floating-label-shake-float-above-standard-data-v-3079414e 250ms 1;\n}\n@keyframes mdc-floating-label-shake-float-above-standard-data-v-3079414e {\n0% {\n    transform: translateX(calc(0 - 0%)) translateY(-100%) scale(0.75);\n}\n33% {\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    transform: translateX(calc(4% - 0%)) translateY(-100%) scale(0.75);\n}\n66% {\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    transform: translateX(calc(-4% - 0%)) translateY(-100%) scale(0.75);\n}\n100% {\n    transform: translateX(calc(0 - 0%)) translateY(-100%) scale(0.75);\n}\n}\n.mdc-line-ripple[data-v-3079414e] {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  height: 2px;\n  transform: scaleX(0);\n  transition: transform 180ms cubic-bezier(0.4, 0, 0.2, 1), opacity 180ms cubic-bezier(0.4, 0, 0.2, 1);\n  opacity: 0;\n  z-index: 2;\n}\n.mdc-line-ripple--active[data-v-3079414e] {\n  transform: scaleX(1);\n  opacity: 1;\n}\n.mdc-line-ripple--deactivating[data-v-3079414e] {\n  opacity: 0;\n}\n.mdc-notched-outline[data-v-3079414e] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: calc(100% - 1px);\n  height: calc(100% - 2px);\n  transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  opacity: 0;\n  overflow: hidden;\n}\n.mdc-notched-outline svg[data-v-3079414e] {\n    position: absolute;\n    width: 100%;\n    height: 100%;\n}\n.mdc-notched-outline__idle[data-v-3079414e] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: calc(100% - 4px);\n  height: calc(100% - 4px);\n  transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1), border-color 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  border: 1px solid;\n  opacity: 1;\n}\n.mdc-notched-outline__path[data-v-3079414e] {\n  stroke-width: 1px;\n  transition: stroke 150ms cubic-bezier(0.4, 0, 0.2, 1), stroke-width 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  fill: transparent;\n}\n.mdc-notched-outline--notched[data-v-3079414e] {\n  opacity: 1;\n}\n.mdc-notched-outline--notched ~ .mdc-notched-outline__idle[data-v-3079414e] {\n  opacity: 0;\n}\n.mdc-text-field-helper-text[data-v-3079414e] {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.75rem;\n  line-height: 1.25rem;\n  font-weight: 400;\n  letter-spacing: 0.03333em;\n  text-decoration: inherit;\n  text-transform: inherit;\n  margin: 0;\n  transition: opacity 180ms cubic-bezier(0.4, 0, 0.2, 1);\n  opacity: 0;\n  will-change: opacity;\n}\n.mdc-text-field + .mdc-text-field-helper-text[data-v-3079414e] {\n    margin-bottom: 8px;\n}\n.mdc-text-field-helper-text--persistent[data-v-3079414e] {\n  transition: none;\n  opacity: 1;\n  will-change: initial;\n}\n.mdc-text-field--with-leading-icon .mdc-text-field__icon[data-v-3079414e],\n.mdc-text-field--with-trailing-icon .mdc-text-field__icon[data-v-3079414e] {\n  position: absolute;\n  bottom: 16px;\n  cursor: pointer;\n}\n.mdc-text-field__icon[data-v-3079414e]:not([tabindex]),\n.mdc-text-field__icon[tabindex=\"-1\"][data-v-3079414e] {\n  cursor: default;\n  pointer-events: none;\n}\n.mdc-text-field[data-v-3079414e] {\n  display: inline-block;\n  position: relative;\n  margin-bottom: 8px;\n  will-change: opacity, transform, color;\n}\n.mdc-text-field:not(.mdc-text-field--disabled):not(.mdc-text-field--outlined):not(.mdc-text-field--textarea) .mdc-text-field__input[data-v-3079414e] {\n    border-bottom-color: rgba(0, 0, 0, 0.42);\n}\n.mdc-text-field:not(.mdc-text-field--disabled):not(.mdc-text-field--outlined):not(.mdc-text-field--textarea) .mdc-text-field__input[data-v-3079414e]:hover {\n    border-bottom-color: rgba(0, 0, 0, 0.87);\n}\n.mdc-text-field .mdc-line-ripple[data-v-3079414e] {\n    background-color: #6200ee;\n    /* @alternate */\n    background-color: var(--mdc-theme-primary, #6200ee);\n}\n.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__input[data-v-3079414e] {\n    color: rgba(0, 0, 0, 0.87);\n}\n.mdc-text-field:not(.mdc-text-field--disabled) .mdc-floating-label[data-v-3079414e] {\n    color: rgba(0, 0, 0, 0.6);\n}\n.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__input[data-v-3079414e]::placeholder {\n    color: rgba(0, 0, 0, 0.6);\n}\n.mdc-text-field:not(.mdc-text-field--disabled) + .mdc-text-field-helper-text[data-v-3079414e] {\n    color: rgba(0, 0, 0, 0.6);\n}\n.mdc-text-field[data-v-3079414e]:not(.mdc-text-field--disabled):not(.mdc-text-field--textarea) {\n    border-bottom-color: rgba(0, 0, 0, 0.12);\n}\n.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__icon[data-v-3079414e] {\n    color: rgba(0, 0, 0, 0.54);\n}\n.mdc-text-field .mdc-text-field__input[data-v-3079414e] {\n    caret-color: #6200ee;\n    /* @alternate */\n    caret-color: var(--mdc-theme-primary, #6200ee);\n}\n.mdc-text-field__input[data-v-3079414e] {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 1.75rem;\n  font-weight: 400;\n  letter-spacing: 0.00937em;\n  text-decoration: inherit;\n  text-transform: inherit;\n  width: 100%;\n  height: 30px;\n  padding: 20px 0 1px;\n  transition: opacity 180ms cubic-bezier(0.4, 0, 0.2, 1);\n  border: none;\n  border-bottom: 1px solid;\n  border-radius: 0;\n  background: none;\n  appearance: none;\n}\n.mdc-text-field__input[data-v-3079414e]::placeholder {\n    transition: color 180ms cubic-bezier(0.4, 0, 0.2, 1);\n    opacity: 1;\n}\n.mdc-text-field__input[data-v-3079414e]:focus {\n    outline: none;\n}\n.mdc-text-field__input[data-v-3079414e]:invalid {\n    box-shadow: none;\n}\n.mdc-text-field__input:-webkit-autofill + .mdc-floating-label[data-v-3079414e] {\n    transform: translateY(-100%) scale(0.75);\n    cursor: auto;\n}\n.mdc-text-field--outlined[data-v-3079414e] {\n  height: 56px;\n  border: none;\n}\n.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__idle[data-v-3079414e] {\n    border-color: rgba(0, 0, 0, 0.24);\n}\n.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__path[data-v-3079414e] {\n    stroke: rgba(0, 0, 0, 0.24);\n}\n.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover ~ .mdc-notched-outline__idle[data-v-3079414e],\n  .mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover ~ .mdc-notched-outline__idle[data-v-3079414e] {\n    border-color: rgba(0, 0, 0, 0.87);\n}\n.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover ~ .mdc-notched-outline .mdc-notched-outline__path[data-v-3079414e],\n  .mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover ~ .mdc-notched-outline .mdc-notched-outline__path[data-v-3079414e] {\n    stroke: rgba(0, 0, 0, 0.87);\n}\n.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__path[data-v-3079414e] {\n    stroke: #6200ee;\n    /* @alternate */\n    stroke: var(--mdc-theme-primary, #6200ee);\n}\n.mdc-text-field--outlined .mdc-floating-label--float-above[data-v-3079414e] {\n    transform: translateY(-130%) scale(0.75);\n}\n.mdc-text-field--outlined .mdc-floating-label--shake[data-v-3079414e] {\n    animation: mdc-floating-label-shake-float-above-text-field-outlined-data-v-3079414e 250ms 1;\n}\n.mdc-text-field--outlined .mdc-notched-outline[data-v-3079414e] {\n    border-radius: 4px;\n}\n.mdc-text-field--outlined .mdc-notched-outline__idle[data-v-3079414e] {\n    border-radius: 4px;\n}\n.mdc-text-field--outlined .mdc-text-field__input[data-v-3079414e] {\n    display: flex;\n    padding: 12px;\n    border: none !important;\n    background-color: transparent;\n    z-index: 1;\n}\n.mdc-text-field--outlined .mdc-floating-label[data-v-3079414e] {\n    /* @noflip */\n    left: 16px;\n    /* @noflip */\n    right: initial;\n    position: absolute;\n    bottom: 20px;\n}\n[dir=\"rtl\"] .mdc-text-field--outlined .mdc-floating-label[data-v-3079414e], .mdc-text-field--outlined .mdc-floating-label[dir=\"rtl\"][data-v-3079414e] {\n      /* @noflip */\n      left: initial;\n      /* @noflip */\n      right: 16px;\n}\n.mdc-text-field--outlined .mdc-text-field__icon[data-v-3079414e] {\n    z-index: 2;\n}\n.mdc-text-field--outlined.mdc-text-field--focused .mdc-notched-outline__path[data-v-3079414e] {\n  stroke-width: 2px;\n}\n.mdc-text-field--outlined.mdc-text-field--disabled .mdc-text-field__input[data-v-3079414e] {\n  color: rgba(0, 0, 0, 0.6);\n}\n.mdc-text-field--outlined.mdc-text-field--disabled .mdc-notched-outline__idle[data-v-3079414e] {\n  border-color: rgba(0, 0, 0, 0.06);\n}\n.mdc-text-field--outlined.mdc-text-field--disabled .mdc-notched-outline__path[data-v-3079414e] {\n  stroke: rgba(0, 0, 0, 0.06);\n}\n.mdc-text-field--outlined.mdc-text-field--disabled .mdc-text-field__input[data-v-3079414e] {\n  border-bottom: none;\n}\n.mdc-text-field--outlined.mdc-text-field--dense[data-v-3079414e] {\n  height: 48px;\n}\n.mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label--float-above[data-v-3079414e] {\n    transform: translateY(-110%) scale(0.923);\n}\n.mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label--shake[data-v-3079414e] {\n    animation: mdc-floating-label-shake-float-above-text-field-outlined-dense-data-v-3079414e 250ms 1;\n}\n.mdc-text-field--outlined.mdc-text-field--dense .mdc-text-field__input[data-v-3079414e] {\n    padding: 12px 12px 7px;\n}\n.mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label[data-v-3079414e] {\n    bottom: 16px;\n}\n.mdc-text-field--outlined.mdc-text-field--dense .mdc-text-field__icon[data-v-3079414e] {\n    top: 12px;\n}\n.mdc-text-field--box[data-v-3079414e] {\n  --mdc-ripple-fg-size: 0;\n  --mdc-ripple-left: 0;\n  --mdc-ripple-top: 0;\n  --mdc-ripple-fg-scale: 1;\n  --mdc-ripple-fg-translate-end: 0;\n  --mdc-ripple-fg-translate-start: 0;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  will-change: transform, opacity;\n  border-radius: 4px 4px 0 0;\n  display: inline-flex;\n  position: relative;\n  height: 56px;\n  margin-top: 16px;\n  overflow: hidden;\n}\n.mdc-text-field--box[data-v-3079414e]::before, .mdc-text-field--box[data-v-3079414e]::after {\n    position: absolute;\n    border-radius: 50%;\n    opacity: 0;\n    pointer-events: none;\n    content: \"\";\n}\n.mdc-text-field--box[data-v-3079414e]::before {\n    transition: opacity 15ms linear;\n    z-index: 1;\n}\n.mdc-text-field--box.mdc-ripple-upgraded[data-v-3079414e]::before {\n    transform: scale(var(--mdc-ripple-fg-scale, 1));\n}\n.mdc-text-field--box.mdc-ripple-upgraded[data-v-3079414e]::after {\n    top: 0;\n    /* @noflip */\n    left: 0;\n    transform: scale(0);\n    transform-origin: center center;\n}\n.mdc-text-field--box.mdc-ripple-upgraded--unbounded[data-v-3079414e]::after {\n    top: var(--mdc-ripple-top, 0);\n    /* @noflip */\n    left: var(--mdc-ripple-left, 0);\n}\n.mdc-text-field--box.mdc-ripple-upgraded--foreground-activation[data-v-3079414e]::after {\n    animation: 225ms mdc-ripple-fg-radius-in-data-v-3079414e forwards,75ms mdc-ripple-fg-opacity-in-data-v-3079414e forwards;\n}\n.mdc-text-field--box.mdc-ripple-upgraded--foreground-deactivation[data-v-3079414e]::after {\n    animation: 150ms mdc-ripple-fg-opacity-out-data-v-3079414e;\n    transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n}\n.mdc-text-field--box[data-v-3079414e]::before, .mdc-text-field--box[data-v-3079414e]::after {\n    background-color: rgba(0, 0, 0, 0.87);\n}\n.mdc-text-field--box[data-v-3079414e]:hover::before {\n    opacity: 0.04;\n}\n.mdc-text-field--box[data-v-3079414e]:not(.mdc-ripple-upgraded):focus::before, .mdc-text-field--box[data-v-3079414e]:not(.mdc-ripple-upgraded):focus-within::before, .mdc-text-field--box.mdc-ripple-upgraded--background-focused[data-v-3079414e]::before {\n    transition-duration: 75ms;\n    opacity: 0.12;\n}\n.mdc-text-field--box[data-v-3079414e]::before, .mdc-text-field--box[data-v-3079414e]::after {\n    top: calc(50% - 100%);\n    /* @noflip */\n    left: calc(50% - 100%);\n    width: 200%;\n    height: 200%;\n}\n.mdc-text-field--box.mdc-ripple-upgraded[data-v-3079414e]::after {\n    width: var(--mdc-ripple-fg-size, 100%);\n    height: var(--mdc-ripple-fg-size, 100%);\n}\n.mdc-text-field--box[data-v-3079414e]:not(.mdc-text-field--disabled) {\n    background-color: whitesmoke;\n}\n.mdc-text-field--box .mdc-floating-label--float-above[data-v-3079414e] {\n    transform: translateY(-50%) scale(0.75);\n}\n.mdc-text-field--box .mdc-floating-label--shake[data-v-3079414e] {\n    animation: mdc-floating-label-shake-float-above-text-field-box-data-v-3079414e 250ms 1;\n}\n.mdc-text-field--box .mdc-text-field__input[data-v-3079414e] {\n    align-self: flex-end;\n    box-sizing: border-box;\n    height: 100%;\n    padding: 20px 16px 0;\n}\n.mdc-text-field--box .mdc-floating-label[data-v-3079414e] {\n    /* @noflip */\n    left: 16px;\n    /* @noflip */\n    right: initial;\n    position: absolute;\n    bottom: 20px;\n    width: calc(100% - 48px);\n    text-overflow: ellipsis;\n    white-space: nowrap;\n    pointer-events: none;\n    overflow: hidden;\n    will-change: transform;\n}\n[dir=\"rtl\"] .mdc-text-field--box .mdc-floating-label[data-v-3079414e], .mdc-text-field--box .mdc-floating-label[dir=\"rtl\"][data-v-3079414e] {\n      /* @noflip */\n      left: initial;\n      /* @noflip */\n      right: 16px;\n}\n.mdc-text-field--box.mdc-text-field--disabled[data-v-3079414e] {\n  background-color: #fafafa;\n  border-bottom: none;\n}\n.mdc-text-field--box.mdc-text-field--disabled .mdc-text-field__input[data-v-3079414e] {\n    border-bottom-color: rgba(0, 0, 0, 0.06);\n}\n.mdc-text-field--box.mdc-text-field--disabled:not(.mdc-text-field--disabled) .mdc-floating-label[data-v-3079414e] {\n    color: rgba(0, 0, 0, 0.37);\n}\n.mdc-text-field--box.mdc-text-field--disabled:not(.mdc-text-field--disabled) .mdc-text-field__input[data-v-3079414e]::placeholder {\n    color: rgba(0, 0, 0, 0.37);\n}\n.mdc-text-field--box.mdc-text-field--dense .mdc-floating-label--float-above[data-v-3079414e] {\n  transform: translateY(-70%) scale(0.923);\n}\n.mdc-text-field--box.mdc-text-field--dense .mdc-floating-label--shake[data-v-3079414e] {\n  animation: mdc-floating-label-shake-float-above-text-field-box-dense-data-v-3079414e 250ms 1;\n}\n.mdc-text-field--box.mdc-text-field--dense .mdc-text-field__input[data-v-3079414e] {\n  padding: 12px 12px 0;\n}\n.mdc-text-field--with-leading-icon .mdc-text-field__icon[data-v-3079414e] {\n  /* @noflip */\n  left: 15px;\n  /* @noflip */\n  right: initial;\n}\n[dir=\"rtl\"] .mdc-text-field--with-leading-icon .mdc-text-field__icon[data-v-3079414e], .mdc-text-field--with-leading-icon .mdc-text-field__icon[dir=\"rtl\"][data-v-3079414e] {\n    /* @noflip */\n    left: initial;\n    /* @noflip */\n    right: 15px;\n}\n.mdc-text-field--with-leading-icon .mdc-text-field__input[data-v-3079414e] {\n  /* @noflip */\n  padding-left: 48px;\n  /* @noflip */\n  padding-right: 15px;\n}\n[dir=\"rtl\"] .mdc-text-field--with-leading-icon .mdc-text-field__input[data-v-3079414e], .mdc-text-field--with-leading-icon .mdc-text-field__input[dir=\"rtl\"][data-v-3079414e] {\n    /* @noflip */\n    padding-left: 15px;\n    /* @noflip */\n    padding-right: 48px;\n}\n.mdc-text-field--with-leading-icon .mdc-floating-label[data-v-3079414e] {\n  /* @noflip */\n  left: 48px;\n  /* @noflip */\n  right: initial;\n}\n[dir=\"rtl\"] .mdc-text-field--with-leading-icon .mdc-floating-label[data-v-3079414e], .mdc-text-field--with-leading-icon .mdc-floating-label[dir=\"rtl\"][data-v-3079414e] {\n    /* @noflip */\n    left: initial;\n    /* @noflip */\n    right: 48px;\n}\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--float-above[data-v-3079414e] {\n  transform: translateY(-130%) translateX(-32px) scale(0.75);\n}\n[dir=\"rtl\"] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--float-above[data-v-3079414e], .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--float-above[dir=\"rtl\"][data-v-3079414e] {\n    transform: translateY(-130%) translateX(32px) scale(0.75);\n}\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--shake[data-v-3079414e] {\n  animation: mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-data-v-3079414e 250ms 1;\n}\n[dir=\"rtl\"] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--shake[data-v-3079414e], .mdc-text-field--with-leading-icon.mdc-text-field--outlined[dir=\"rtl\"] .mdc-floating-label--shake[data-v-3079414e] {\n  animation: mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-rtl-data-v-3079414e 250ms 1;\n}\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label--float-above[data-v-3079414e] {\n  transform: translateY(-110%) translateX(-21px) scale(0.923);\n}\n[dir=\"rtl\"] .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label--float-above[data-v-3079414e], .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label--float-above[dir=\"rtl\"][data-v-3079414e] {\n    transform: translateY(-110%) translateX(21px) scale(0.923);\n}\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label--shake[data-v-3079414e] {\n  animation: mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-dense-data-v-3079414e 250ms 1;\n}\n[dir=\"rtl\"] .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label--shake[data-v-3079414e], .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense[dir=\"rtl\"] .mdc-floating-label--shake[data-v-3079414e] {\n  animation: mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-dense-rtl-data-v-3079414e 250ms 1;\n}\n.mdc-text-field--with-trailing-icon .mdc-text-field__icon[data-v-3079414e] {\n  /* @noflip */\n  left: initial;\n  /* @noflip */\n  right: 15px;\n}\n[dir=\"rtl\"] .mdc-text-field--with-trailing-icon .mdc-text-field__icon[data-v-3079414e], .mdc-text-field--with-trailing-icon .mdc-text-field__icon[dir=\"rtl\"][data-v-3079414e] {\n    /* @noflip */\n    left: 15px;\n    /* @noflip */\n    right: initial;\n}\n.mdc-text-field--with-trailing-icon .mdc-text-field__input[data-v-3079414e] {\n  /* @noflip */\n  padding-left: 15px;\n  /* @noflip */\n  padding-right: 48px;\n}\n[dir=\"rtl\"] .mdc-text-field--with-trailing-icon .mdc-text-field__input[data-v-3079414e], .mdc-text-field--with-trailing-icon .mdc-text-field__input[dir=\"rtl\"][data-v-3079414e] {\n    /* @noflip */\n    padding-left: 48px;\n    /* @noflip */\n    padding-right: 15px;\n}\n.mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-text-field__icon[data-v-3079414e],\n.mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__icon[data-v-3079414e] {\n  bottom: 16px;\n  transform: scale(0.8);\n}\n.mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-text-field__icon[data-v-3079414e] {\n  /* @noflip */\n  left: 12px;\n  /* @noflip */\n  right: initial;\n}\n[dir=\"rtl\"] .mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-text-field__icon[data-v-3079414e], .mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-text-field__icon[dir=\"rtl\"][data-v-3079414e] {\n    /* @noflip */\n    left: initial;\n    /* @noflip */\n    right: 12px;\n}\n.mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-text-field__input[data-v-3079414e] {\n  /* @noflip */\n  padding-left: 38px;\n  /* @noflip */\n  padding-right: 12px;\n}\n[dir=\"rtl\"] .mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-text-field__input[data-v-3079414e], .mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-text-field__input[dir=\"rtl\"][data-v-3079414e] {\n    /* @noflip */\n    padding-left: 12px;\n    /* @noflip */\n    padding-right: 38px;\n}\n.mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-floating-label[data-v-3079414e] {\n  /* @noflip */\n  left: 38px;\n  /* @noflip */\n  right: initial;\n}\n[dir=\"rtl\"] .mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-floating-label[data-v-3079414e], .mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-floating-label[dir=\"rtl\"][data-v-3079414e] {\n    /* @noflip */\n    left: initial;\n    /* @noflip */\n    right: 38px;\n}\n.mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__icon[data-v-3079414e] {\n  /* @noflip */\n  left: initial;\n  /* @noflip */\n  right: 12px;\n}\n[dir=\"rtl\"] .mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__icon[data-v-3079414e], .mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__icon[dir=\"rtl\"][data-v-3079414e] {\n    /* @noflip */\n    left: 12px;\n    /* @noflip */\n    right: initial;\n}\n.mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__input[data-v-3079414e] {\n  /* @noflip */\n  padding-left: 12px;\n  /* @noflip */\n  padding-right: 38px;\n}\n[dir=\"rtl\"] .mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__input[data-v-3079414e], .mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__input[dir=\"rtl\"][data-v-3079414e] {\n    /* @noflip */\n    padding-left: 38px;\n    /* @noflip */\n    padding-right: 12px;\n}\n.mdc-text-field--upgraded[data-v-3079414e]:not(.mdc-text-field--fullwidth):not(.mdc-text-field--box) {\n  display: inline-flex;\n  position: relative;\n  align-items: flex-end;\n  box-sizing: border-box;\n  margin-top: 16px;\n}\n.mdc-text-field--upgraded[data-v-3079414e]:not(.mdc-text-field--fullwidth):not(.mdc-text-field--box):not(.mdc-text-field--textarea):not(.mdc-text-field--outlined) {\n    height: 48px;\n}\n.mdc-text-field--dense[data-v-3079414e] {\n  margin-top: 12px;\n  margin-bottom: 4px;\n}\n.mdc-text-field--dense .mdc-floating-label--float-above[data-v-3079414e] {\n    transform: translateY(-110%) scale(0.923);\n}\n.mdc-text-field--dense .mdc-floating-label[data-v-3079414e] {\n    font-size: .813rem;\n}\n.mdc-text-field__input:required + .mdc-floating-label[data-v-3079414e]::after {\n  margin-left: 1px;\n  content: \"*\";\n}\n.mdc-text-field--textarea[data-v-3079414e] {\n  border-radius: 4px;\n  display: flex;\n  width: fit-content;\n  height: initial;\n  transition: none;\n  border: 1px solid;\n  overflow: hidden;\n}\n.mdc-text-field--textarea .mdc-floating-label[data-v-3079414e] {\n    border-radius: 4px 4px 0 0;\n}\n.mdc-text-field--textarea .mdc-text-field__input[data-v-3079414e] {\n    border-radius: 2px;\n}\n.mdc-text-field--textarea[data-v-3079414e]:not(.mdc-text-field--disabled) {\n    border-color: rgba(0, 0, 0, 0.73);\n}\n.mdc-text-field--textarea:not(.mdc-text-field--disabled) .mdc-text-field__input[data-v-3079414e]:focus {\n      border-color: rgba(0, 0, 0, 0.73);\n}\n.mdc-text-field--textarea .mdc-floating-label--float-above[data-v-3079414e] {\n    transform: translateY(-50%) scale(0.923);\n}\n.mdc-text-field--textarea .mdc-floating-label--shake[data-v-3079414e] {\n    animation: mdc-floating-label-shake-float-above-textarea-data-v-3079414e 250ms 1;\n}\n.mdc-text-field--textarea .mdc-text-field__input[data-v-3079414e] {\n    height: auto;\n    margin: 0;\n    padding: 16px;\n    padding-top: 32px;\n    border: 1px solid transparent;\n}\n.mdc-text-field--textarea .mdc-floating-label[data-v-3079414e] {\n    background-color: white;\n    /* @noflip */\n    left: 1px;\n    /* @noflip */\n    right: 0;\n    /* @noflip */\n    margin-left: 8px;\n    /* @noflip */\n    margin-right: 0;\n    top: 18px;\n    bottom: auto;\n    margin-top: 2px;\n    padding: 12px 8px 8px 8px;\n    line-height: 1.15;\n    pointer-events: none;\n}\n[dir=\"rtl\"] .mdc-text-field--textarea .mdc-floating-label[data-v-3079414e], .mdc-text-field--textarea .mdc-floating-label[dir=\"rtl\"][data-v-3079414e] {\n      /* @noflip */\n      left: 0;\n      /* @noflip */\n      right: 1px;\n}\n[dir=\"rtl\"] .mdc-text-field--textarea .mdc-floating-label[data-v-3079414e], .mdc-text-field--textarea .mdc-floating-label[dir=\"rtl\"][data-v-3079414e] {\n      /* @noflip */\n      margin-left: 0;\n      /* @noflip */\n      margin-right: 8px;\n}\n.mdc-text-field--fullwidth[data-v-3079414e] {\n  width: 100%;\n}\n.mdc-text-field--fullwidth .mdc-text-field__input[data-v-3079414e] {\n    resize: vertical;\n}\n.mdc-text-field--fullwidth[data-v-3079414e]:not(.mdc-text-field--textarea) {\n    display: block;\n    box-sizing: border-box;\n    height: 56px;\n    margin: 0;\n    border: none;\n    border-bottom: 1px solid;\n    outline: none;\n}\n.mdc-text-field--fullwidth:not(.mdc-text-field--textarea) .mdc-text-field__input[data-v-3079414e] {\n      width: 100%;\n      height: 100%;\n      padding: 0;\n      resize: none;\n      border: none !important;\n}\n.mdc-text-field--fullwidth.mdc-text-field--invalid[data-v-3079414e]:not(.mdc-text-field--disabled):not(.mdc-text-field--textarea) {\n  border-bottom-color: #b00020;\n}\n.mdc-text-field--dense + .mdc-text-field-helper-text[data-v-3079414e] {\n  margin-bottom: 4px;\n}\n.mdc-text-field--box + .mdc-text-field-helper-text[data-v-3079414e],\n.mdc-text-field--outlined + .mdc-text-field-helper-text[data-v-3079414e] {\n  margin-right: 16px;\n  margin-left: 16px;\n}\n.mdc-form-field > .mdc-text-field + label[data-v-3079414e] {\n  align-self: flex-start;\n}\n.mdc-text-field--focused:not(.mdc-text-field--disabled) .mdc-floating-label[data-v-3079414e] {\n  color: rgba(98, 0, 238, 0.87);\n}\n.mdc-text-field--focused:not(.mdc-text-field--disabled) .mdc-text-field__input[data-v-3079414e]::placeholder {\n  color: rgba(98, 0, 238, 0.87);\n}\n.mdc-text-field--focused .mdc-text-field__input:required + .mdc-floating-label[data-v-3079414e]::after {\n  color: #b00020;\n}\n.mdc-text-field--focused + .mdc-text-field-helper-text[data-v-3079414e]:not(.mdc-text-field-helper-text--validation-msg) {\n  opacity: 1;\n}\n.mdc-text-field--textarea.mdc-text-field--focused[data-v-3079414e]:not(.mdc-text-field--disabled) {\n  border-color: #6200ee;\n  /* @alternate */\n  border-color: var(--mdc-theme-primary, #6200ee);\n}\n.mdc-text-field--textarea.mdc-text-field--focused:not(.mdc-text-field--disabled) .mdc-text-field__input[data-v-3079414e]:focus {\n    border-color: #6200ee;\n    /* @alternate */\n    border-color: var(--mdc-theme-primary, #6200ee);\n}\n.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--outlined):not(.mdc-text-field--textarea) .mdc-text-field__input[data-v-3079414e] {\n  border-bottom-color: #b00020;\n}\n.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--outlined):not(.mdc-text-field--textarea) .mdc-text-field__input[data-v-3079414e]:hover {\n  border-bottom-color: #b00020;\n}\n.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-line-ripple[data-v-3079414e] {\n  background-color: #b00020;\n}\n.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-floating-label[data-v-3079414e] {\n  color: #b00020;\n}\n.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-text-field__input[data-v-3079414e]::placeholder {\n  color: #b00020;\n}\n.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--invalid + .mdc-text-field-helper-text--validation-msg[data-v-3079414e] {\n  color: #b00020;\n}\n.mdc-text-field--invalid .mdc-text-field__input[data-v-3079414e] {\n  caret-color: #b00020;\n}\n.mdc-text-field--invalid.mdc-text-field--with-trailing-icon:not(.mdc-text-field--disabled) .mdc-text-field__icon[data-v-3079414e] {\n  color: #b00020;\n}\n.mdc-text-field--invalid + .mdc-text-field-helper-text--validation-msg[data-v-3079414e] {\n  opacity: 1;\n}\n.mdc-text-field--textarea.mdc-text-field--invalid[data-v-3079414e]:not(.mdc-text-field--disabled) {\n  border-color: #b00020;\n}\n.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-text-field__input[data-v-3079414e]:focus {\n    border-color: #b00020;\n}\n.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__idle[data-v-3079414e] {\n  border-color: #b00020;\n}\n.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__path[data-v-3079414e] {\n  stroke: #b00020;\n}\n.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover ~ .mdc-notched-outline__idle[data-v-3079414e],\n.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover ~ .mdc-notched-outline__idle[data-v-3079414e] {\n  border-color: #b00020;\n}\n.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover ~ .mdc-notched-outline .mdc-notched-outline__path[data-v-3079414e],\n.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover ~ .mdc-notched-outline .mdc-notched-outline__path[data-v-3079414e] {\n  stroke: #b00020;\n}\n.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__path[data-v-3079414e] {\n  stroke: #b00020;\n}\n.mdc-text-field--disabled[data-v-3079414e] {\n  pointer-events: none;\n}\n.mdc-text-field--disabled .mdc-text-field__input[data-v-3079414e] {\n    border-bottom-color: rgba(35, 31, 32, 0.26);\n}\n.mdc-text-field--disabled .mdc-text-field__input[data-v-3079414e] {\n    color: rgba(0, 0, 0, 0.37);\n}\n.mdc-text-field--disabled .mdc-floating-label[data-v-3079414e] {\n    color: rgba(0, 0, 0, 0.37);\n}\n.mdc-text-field--disabled .mdc-text-field__input[data-v-3079414e]::placeholder {\n    color: rgba(0, 0, 0, 0.37);\n}\n.mdc-text-field--disabled + .mdc-text-field-helper-text[data-v-3079414e] {\n    color: rgba(0, 0, 0, 0.37);\n}\n.mdc-text-field--disabled .mdc-text-field__icon[data-v-3079414e] {\n    color: rgba(0, 0, 0, 0.3);\n}\n.mdc-text-field--disabled[data-v-3079414e]:not(.mdc-text-field--textarea) {\n    border-bottom-color: rgba(0, 0, 0, 0.12);\n}\n.mdc-text-field--disabled .mdc-text-field__input[data-v-3079414e] {\n    border-bottom: 1px dotted;\n}\n.mdc-text-field--disabled .mdc-floating-label[data-v-3079414e] {\n    cursor: default;\n}\n.mdc-text-field--textarea.mdc-text-field--disabled[data-v-3079414e] {\n  border-color: rgba(35, 31, 32, 0.26);\n  background-color: #f9f9f9;\n  border-style: solid;\n}\n.mdc-text-field--textarea.mdc-text-field--disabled .mdc-text-field__input[data-v-3079414e]:focus {\n    border-color: rgba(35, 31, 32, 0.26);\n}\n.mdc-text-field--textarea.mdc-text-field--disabled .mdc-text-field__input[data-v-3079414e] {\n    border: 1px solid transparent;\n}\n.mdc-text-field--textarea.mdc-text-field--disabled .mdc-floating-label[data-v-3079414e] {\n    background-color: #f9f9f9;\n}\n@keyframes mdc-floating-label-shake-float-above-text-field-box-data-v-3079414e {\n0% {\n    transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75);\n}\n33% {\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    transform: translateX(calc(4% - 0%)) translateY(-50%) scale(0.75);\n}\n66% {\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    transform: translateX(calc(-4% - 0%)) translateY(-50%) scale(0.75);\n}\n100% {\n    transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75);\n}\n}\n@keyframes mdc-floating-label-shake-float-above-text-field-box-dense-data-v-3079414e {\n0% {\n    transform: translateX(calc(0 - 0%)) translateY(-70%) scale(0.923);\n}\n33% {\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    transform: translateX(calc(4% - 0%)) translateY(-70%) scale(0.923);\n}\n66% {\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    transform: translateX(calc(-4% - 0%)) translateY(-70%) scale(0.923);\n}\n100% {\n    transform: translateX(calc(0 - 0%)) translateY(-70%) scale(0.923);\n}\n}\n@keyframes mdc-floating-label-shake-float-above-text-field-outlined-data-v-3079414e {\n0% {\n    transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75);\n}\n33% {\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    transform: translateX(calc(4% - 0%)) translateY(-130%) scale(0.75);\n}\n66% {\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    transform: translateX(calc(-4% - 0%)) translateY(-130%) scale(0.75);\n}\n100% {\n    transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75);\n}\n}\n@keyframes mdc-floating-label-shake-float-above-text-field-outlined-dense-data-v-3079414e {\n0% {\n    transform: translateX(calc(0 - 0%)) translateY(-110%) scale(0.923);\n}\n33% {\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    transform: translateX(calc(4% - 0%)) translateY(-110%) scale(0.923);\n}\n66% {\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    transform: translateX(calc(-4% - 0%)) translateY(-110%) scale(0.923);\n}\n100% {\n    transform: translateX(calc(0 - 0%)) translateY(-110%) scale(0.923);\n}\n}\n@keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-data-v-3079414e {\n0% {\n    transform: translateX(calc(0 - 32px)) translateY(-130%) scale(0.75);\n}\n33% {\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    transform: translateX(calc(4% - 32px)) translateY(-130%) scale(0.75);\n}\n66% {\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    transform: translateX(calc(-4% - 32px)) translateY(-130%) scale(0.75);\n}\n100% {\n    transform: translateX(calc(0 - 32px)) translateY(-130%) scale(0.75);\n}\n}\n@keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-dense-data-v-3079414e {\n0% {\n    transform: translateX(calc(0 - 21px)) translateY(-110%) scale(0.923);\n}\n33% {\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    transform: translateX(calc(4% - 21px)) translateY(-110%) scale(0.923);\n}\n66% {\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    transform: translateX(calc(-4% - 21px)) translateY(-110%) scale(0.923);\n}\n100% {\n    transform: translateX(calc(0 - 21px)) translateY(-110%) scale(0.923);\n}\n}\n@keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-rtl-data-v-3079414e {\n0% {\n    transform: translateX(calc(0 - -32px)) translateY(-130%) scale(0.75);\n}\n33% {\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    transform: translateX(calc(4% - -32px)) translateY(-130%) scale(0.75);\n}\n66% {\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    transform: translateX(calc(-4% - -32px)) translateY(-130%) scale(0.75);\n}\n100% {\n    transform: translateX(calc(0 - -32px)) translateY(-130%) scale(0.75);\n}\n}\n@keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-dense-rtl-data-v-3079414e {\n0% {\n    transform: translateX(calc(0 - -21px)) translateY(-110%) scale(0.923);\n}\n33% {\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    transform: translateX(calc(4% - -21px)) translateY(-110%) scale(0.923);\n}\n66% {\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    transform: translateX(calc(-4% - -21px)) translateY(-110%) scale(0.923);\n}\n100% {\n    transform: translateX(calc(0 - -21px)) translateY(-110%) scale(0.923);\n}\n}\n@keyframes mdc-floating-label-shake-float-above-textarea-data-v-3079414e {\n0% {\n    transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.923);\n}\n33% {\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    transform: translateX(calc(4% - 0%)) translateY(-50%) scale(0.923);\n}\n66% {\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    transform: translateX(calc(-4% - 0%)) translateY(-50%) scale(0.923);\n}\n100% {\n    transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.923);\n}\n}\n@font-face {\n  font-family: 'icomoon';\n  src: url(\"data:font/ttf;base64,AAEAAAALAIAAAwAwT1MvMg8SAs0AAAC8AAAAYGNtYXCSp5LOAAABHAAAAIxnYXNwAAAAEAAAAagAAAAIZ2x5ZhF4ANcAAAGwAAAC3GhlYWQRgdXmAAAEjAAAADZoaGVhB2wDzwAABMQAAAAkaG10eC4ABugAAAToAAAAOGxvY2EFXgTEAAAFIAAAAB5tYXhwABIALgAABUAAAAAgbmFtZZlKCfsAAAVgAAABhnBvc3QAAwAAAAAG6AAAACAAAwPRAZAABQAAApkCzAAAAI8CmQLMAAAB6wAzAQkAAAAAAAAAAAAAAAAAAAABEAAAAAAAAAAAAAAAAAAAAABAAADl0gPA/8AAQAPAAEAAAAABAAAAAAAAAAAAAAAgAAAAAAADAAAAAwAAABwAAQADAAAAHAADAAEAAAAcAAQAcAAAABgAEAADAAgAAQAg4M3g4eVe5cTlyOXK5c/l0v/9//8AAAAAACDgzeDh5V7lxOXI5crlzeXS//3//wAB/+MfNx8kGqgaQxpAGj8aPRo7AAMAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAH//wAPAAEAAAAAAAAAAAACAAA3OQEAAAAAAQAAAAAAAAAAAAIAADc5AQAAAAABAAAAAAAAAAAAAgAANzkBAAAAAAEAgAArA4ADKwApAAABFhceARcWFzc+ARceATMyFh0BFAYjIicuAScmNTQ2OwEyFhUUFhcWBgcBGhceHkgpKS1eCRgLJE0nEhgYEpaEhMY5ORgSlhIYDAwDBAkB3y0pKUgeHhdeCQUEDAwYEpYSGDk5xYSFlhIYGBIpSyQLGAkAAwBWAFUDqgMBAAIABwAXAAABJSEBEQUlEQEyFhURFAYjISImNRE0NjMCAAFW/VQCrP6q/qoCrCIyMSP9VCIyMSMB1db+AAGq1NT+VgJWNCL+ACMzMyMCACI0AAADANYAAQMqA1UAAwAPACsAADchFSETFBYzMjY1NCYjIgYFFAcOAQcGMTAnLgEnJjU0Nz4BNzYzMhceARcW1gJU/azUMyMkMjMjIjQBVigoYCgoKChgKCgUFEUvLzU1Ly9FFBRVVAJUIzExIyI0NCJIUlOLLi4uLotTUkg1Ly5GFBQUFEYuLwAAAQCqAFUDVgMBAAgAAAEVIRcHCQEXBwNW/fjuPP6qAVY87gHVVPA8AVYBVjzwAAAAAQCqAFUDVgMBAAgAAAkCJzchNSEnAgABVv6qPO79+AII7gMB/qr+qjzwVPAAAAAAAQCSAIEDgAK9AAUAACUBFwEnNwGAAcQ8/gDuPPkBxDz+AO48AAAAAAEA1gCBAyoC1QALAAABBxcHJwcnNyc3FzcDKu7uPO7uPO7uPO7uApnu7jzu7jzu7jzu7gABAQABGQMAAlUABQAACQEHJwcnAgABADzExDwCVf8APMTEPAABAQABAQMAAj0ABQAAARcJATcXAsQ8/wD/ADzEAj08/wABADzEAAAAAwCAAKsDgAKrAAMABwALAAATIRUhFTUhFQU1IRWAAwD9AAMA/QADAAKrVtRUVNZWVgAAAAEAAAABAAAMfP09Xw889QALBAAAAAAA11zIygAAAADXXMjKAAAAAAOqA1UAAAAIAAIAAAAAAAAAAQAAA8D/wAAABAAAAAAAA6oAAQAAAAAAAAAAAAAAAAAAAA4EAAAAAAAAAAAAAAACAAAABAAAgAQAAFYEAADWBAAAqgQAAKoEAACSBAAA1gQAAQAEAAEABAAAgAAAAAAACgAUAB4AXgCMANAA6AEAARQBLgFAAVQBbgAAAAEAAAAOACwAAwAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAOAK4AAQAAAAAAAQAHAAAAAQAAAAAAAgAHAGAAAQAAAAAAAwAHADYAAQAAAAAABAAHAHUAAQAAAAAABQALABUAAQAAAAAABgAHAEsAAQAAAAAACgAaAIoAAwABBAkAAQAOAAcAAwABBAkAAgAOAGcAAwABBAkAAwAOAD0AAwABBAkABAAOAHwAAwABBAkABQAWACAAAwABBAkABgAOAFIAAwABBAkACgA0AKRpY29tb29uAGkAYwBvAG0AbwBvAG5WZXJzaW9uIDEuMABWAGUAcgBzAGkAbwBuACAAMQAuADBpY29tb29uAGkAYwBvAG0AbwBvAG5pY29tb29uAGkAYwBvAG0AbwBvAG5SZWd1bGFyAFIAZQBnAHUAbABhAHJpY29tb29uAGkAYwBvAG0AbwBvAG5Gb250IGdlbmVyYXRlZCBieSBJY29Nb29uLgBGAG8AbgB0ACAAZwBlAG4AZQByAGEAdABlAGQAIABiAHkAIABJAGMAbwBNAG8AbwBuAC4AAAADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\") format(\"truetype\"), url(\"data:font/woff;base64,d09GRgABAAAAAAdUAAsAAAAABwgAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABPUy8yAAABCAAAAGAAAABgDxICzWNtYXAAAAFoAAAAjAAAAIySp5LOZ2FzcAAAAfQAAAAIAAAACAAAABBnbHlmAAAB/AAAAtwAAALcEXgA12hlYWQAAATYAAAANgAAADYRgdXmaGhlYQAABRAAAAAkAAAAJAdsA89obXR4AAAFNAAAADgAAAA4LgAG6GxvY2EAAAVsAAAAHgAAAB4FXgTEbWF4cAAABYwAAAAgAAAAIAASAC5uYW1lAAAFrAAAAYYAAAGGmUoJ+3Bvc3QAAAc0AAAAIAAAACAAAwAAAAMD0QGQAAUAAAKZAswAAACPApkCzAAAAesAMwEJAAAAAAAAAAAAAAAAAAAAARAAAAAAAAAAAAAAAAAAAAAAQAAA5dIDwP/AAEADwABAAAAAAQAAAAAAAAAAAAAAIAAAAAAAAwAAAAMAAAAcAAEAAwAAABwAAwABAAAAHAAEAHAAAAAYABAAAwAIAAEAIODN4OHlXuXE5cjlyuXP5dL//f//AAAAAAAg4M3g4eVe5cTlyOXK5c3l0v/9//8AAf/jHzcfJBqoGkMaQBo/Gj0aOwADAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAB//8ADwABAAAAAAAAAAAAAgAANzkBAAAAAAEAAAAAAAAAAAACAAA3OQEAAAAAAQAAAAAAAAAAAAIAADc5AQAAAAABAIAAKwOAAysAKQAAARYXHgEXFhc3PgEXHgEzMhYdARQGIyInLgEnJjU0NjsBMhYVFBYXFgYHARoXHh5IKSktXgkYCyRNJxIYGBKWhITGOTkYEpYSGAwMAwQJAd8tKSlIHh4XXgkFBAwMGBKWEhg5OcWEhZYSGBgSKUskCxgJAAMAVgBVA6oDAQACAAcAFwAAASUhAREFJREBMhYVERQGIyEiJjURNDYzAgABVv1UAqz+qv6qAqwiMjEj/VQiMjEjAdXW/gABqtTU/lYCVjQi/gAjMzMjAgAiNAAAAwDWAAEDKgNVAAMADwArAAA3IRUhExQWMzI2NTQmIyIGBRQHDgEHBjEwJy4BJyY1NDc+ATc2MzIXHgEXFtYCVP2s1DMjJDIzIyI0AVYoKGAoKCgoYCgoFBRFLy81NS8vRRQUVVQCVCMxMSMiNDQiSFJTiy4uLi6LU1JINS8uRhQUFBRGLi8AAAEAqgBVA1YDAQAIAAABFSEXBwkBFwcDVv347jz+qgFWPO4B1VTwPAFWAVY88AAAAAEAqgBVA1YDAQAIAAAJAic3ITUhJwIAAVb+qjzu/fgCCO4DAf6q/qo88FTwAAAAAAEAkgCBA4ACvQAFAAAlARcBJzcBgAHEPP4A7jz5AcQ8/gDuPAAAAAABANYAgQMqAtUACwAAAQcXBycHJzcnNxc3Ayru7jzu7jzu7jzu7gKZ7u487u487u487u4AAQEAARkDAAJVAAUAAAkBBycHJwIAAQA8xMQ8AlX/ADzExDwAAQEAAQEDAAI9AAUAAAEXCQE3FwLEPP8A/wA8xAI9PP8AAQA8xAAAAAMAgACrA4ACqwADAAcACwAAEyEVIRU1IRUFNSEVgAMA/QADAP0AAwACq1bUVFTWVlYAAAABAAAAAQAADHz9PV8PPPUACwQAAAAAANdcyMoAAAAA11zIygAAAAADqgNVAAAACAACAAAAAAAAAAEAAAPA/8AAAAQAAAAAAAOqAAEAAAAAAAAAAAAAAAAAAAAOBAAAAAAAAAAAAAAAAgAAAAQAAIAEAABWBAAA1gQAAKoEAACqBAAAkgQAANYEAAEABAABAAQAAIAAAAAAAAoAFAAeAF4AjADQAOgBAAEUAS4BQAFUAW4AAAABAAAADgAsAAMAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAADgCuAAEAAAAAAAEABwAAAAEAAAAAAAIABwBgAAEAAAAAAAMABwA2AAEAAAAAAAQABwB1AAEAAAAAAAUACwAVAAEAAAAAAAYABwBLAAEAAAAAAAoAGgCKAAMAAQQJAAEADgAHAAMAAQQJAAIADgBnAAMAAQQJAAMADgA9AAMAAQQJAAQADgB8AAMAAQQJAAUAFgAgAAMAAQQJAAYADgBSAAMAAQQJAAoANACkaWNvbW9vbgBpAGMAbwBtAG8AbwBuVmVyc2lvbiAxLjAAVgBlAHIAcwBpAG8AbgAgADEALgAwaWNvbW9vbgBpAGMAbwBtAG8AbwBuaWNvbW9vbgBpAGMAbwBtAG8AbwBuUmVndWxhcgBSAGUAZwB1AGwAYQByaWNvbW9vbgBpAGMAbwBtAG8AbwBuRm9udCBnZW5lcmF0ZWQgYnkgSWNvTW9vbi4ARgBvAG4AdAAgAGcAZQBuAGUAcgBhAHQAZQBkACAAYgB5ACAASQBjAG8ATQBvAG8AbgAuAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==\") format(\"woff\"), url(\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiID4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8bWV0YWRhdGE+R2VuZXJhdGVkIGJ5IEljb01vb248L21ldGFkYXRhPgo8ZGVmcz4KPGZvbnQgaWQ9Imljb21vb24iIGhvcml6LWFkdi14PSIxMDI0Ij4KPGZvbnQtZmFjZSB1bml0cy1wZXItZW09IjEwMjQiIGFzY2VudD0iOTYwIiBkZXNjZW50PSItNjQiIC8+CjxtaXNzaW5nLWdseXBoIGhvcml6LWFkdi14PSIxMDI0IiAvPgo8Z2x5cGggdW5pY29kZT0iJiN4MjA7IiBob3Jpei1hZHYteD0iNTEyIiBkPSIiIC8+CjxnbHlwaCB1bmljb2RlPSImI3hlMGNkOyIgZ2x5cGgtbmFtZT0icGhvbmUiIGQ9Ik0yODIgNDc4LjY2N2M2Mi0xMjAgMTYyLTIyMCAyODItMjgybDk0IDk0YzEyIDEyIDMwIDE2IDQ0IDEwIDQ4LTE2IDEwMC0yNCAxNTItMjQgMjQgMCA0Mi0xOCA0Mi00MnYtMTUwYzAtMjQtMTgtNDItNDItNDItNDAwIDAtNzI2IDMyNi03MjYgNzI2IDAgMjQgMTggNDIgNDIgNDJoMTUwYzI0IDAgNDItMTggNDItNDIgMC01NCA4LTEwNCAyNC0xNTIgNC0xNCAyLTMyLTEwLTQ0eiIgLz4KPGdseXBoIHVuaWNvZGU9IiYjeGUwZTE7IiBnbHlwaC1uYW1lPSJtYWlsX291dGxpbmUiIGQ9Ik01MTIgNDY4LjY2N2wzNDIgMjE0aC02ODR6TTg1NCAxNzAuNjY3djQyNmwtMzQyLTIxMi0zNDIgMjEydi00MjZoNjg0ek04NTQgNzY4LjY2N2M0NiAwIDg0LTQwIDg0LTg2di01MTJjMC00Ni0zOC04Ni04NC04NmgtNjg0Yy00NiAwLTg0IDQwLTg0IDg2djUxMmMwIDQ2IDM4IDg2IDg0IDg2aDY4NHoiIC8+CjxnbHlwaCB1bmljb2RlPSImI3hlNTVlOyIgZ2x5cGgtbmFtZT0icGluX2Ryb3AiIGQ9Ik0yMTQgODQuNjY3aDU5NnYtODRoLTU5NnY4NHpNNDI2IDU5Ni42NjdjMC00NiA0MC04NCA4Ni04NCA0OCAwIDg2IDM4IDg2IDg0cy00MCA4Ni04NiA4Ni04Ni00MC04Ni04NnpNNzY4IDU5Ni42NjdjMC0xOTItMjU2LTQ2OC0yNTYtNDY4cy0yNTYgMjc2LTI1NiA0NjhjMCAxNDIgMTE0IDI1NiAyNTYgMjU2czI1Ni0xMTQgMjU2LTI1NnoiIC8+CjxnbHlwaCB1bmljb2RlPSImI3hlNWM0OyIgZ2x5cGgtbmFtZT0iYXJyb3dfYmFjayIgZD0iTTg1NCA0NjguNjY3di04NGgtNTIwbDIzOC0yNDAtNjAtNjAtMzQyIDM0MiAzNDIgMzQyIDYwLTYwLTIzOC0yNDBoNTIweiIgLz4KPGdseXBoIHVuaWNvZGU9IiYjeGU1Yzg7IiBnbHlwaC1uYW1lPSJhcnJvd19mb3J3YXJkIiBkPSJNNTEyIDc2OC42NjdsMzQyLTM0Mi0zNDItMzQyLTYwIDYwIDIzOCAyNDBoLTUyMHY4NGg1MjBsLTIzOCAyNDB6IiAvPgo8Z2x5cGggdW5pY29kZT0iJiN4ZTVjYTsiIGdseXBoLW5hbWU9ImNoZWNrIiBkPSJNMzg0IDI0OC42NjdsNDUyIDQ1MiA2MC02MC01MTItNTEyLTIzOCAyMzggNjAgNjB6IiAvPgo8Z2x5cGggdW5pY29kZT0iJiN4ZTVjZDsiIGdseXBoLW5hbWU9ImNsb3NlIiBkPSJNODEwIDY2NC42NjdsLTIzOC0yMzggMjM4LTIzOC02MC02MC0yMzggMjM4LTIzOC0yMzgtNjAgNjAgMjM4IDIzOC0yMzggMjM4IDYwIDYwIDIzOC0yMzggMjM4IDIzOHoiIC8+CjxnbHlwaCB1bmljb2RlPSImI3hlNWNlOyIgZ2x5cGgtbmFtZT0iZXhwYW5kX2xlc3MiIGQ9Ik01MTIgNTk2LjY2N2wyNTYtMjU2LTYwLTYwLTE5NiAxOTYtMTk2LTE5Ni02MCA2MHoiIC8+CjxnbHlwaCB1bmljb2RlPSImI3hlNWNmOyIgZ2x5cGgtbmFtZT0iZXhwYW5kX21vcmUiIGQ9Ik03MDggNTcyLjY2N2w2MC02MC0yNTYtMjU2LTI1NiAyNTYgNjAgNjAgMTk2LTE5NnoiIC8+CjxnbHlwaCB1bmljb2RlPSImI3hlNWQyOyIgZ2x5cGgtbmFtZT0ibWVudSIgZD0iTTEyOCA2ODIuNjY3aDc2OHYtODZoLTc2OHY4NnpNMTI4IDM4NC42Njd2ODRoNzY4di04NGgtNzY4ek0xMjggMTcwLjY2N3Y4Nmg3Njh2LTg2aC03Njh6IiAvPgo8L2ZvbnQ+PC9kZWZzPjwvc3ZnPg==\") format(\"svg\");\n  font-weight: normal;\n  font-style: normal;\n}\n[class^=\"icomoon-\"][data-v-3079414e], [class*=\" icomoon-\"][data-v-3079414e] {\n  /* use !important to prevent issues with browser extensions that change fonts */\n  font-family: 'icomoon' !important;\n  speak: none;\n  font-style: normal;\n  font-weight: normal;\n  font-variant: normal;\n  text-transform: none;\n  line-height: 1;\n  /* Better Font Rendering =========== */\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.icomoon-arrow_back[data-v-3079414e]:before {\n  content: \"\\e5c4\";\n}\n.icomoon-arrow_forward[data-v-3079414e]:before {\n  content: \"\\e5c8\";\n}\n.icomoon-phone[data-v-3079414e]:before {\n  content: \"\\e0cd\";\n}\n.icomoon-check[data-v-3079414e]:before {\n  content: \"\\e5ca\";\n}\n.icomoon-close[data-v-3079414e]:before {\n  content: \"\\e5cd\";\n}\n.icomoon-expand_less[data-v-3079414e]:before {\n  content: \"\\e5ce\";\n}\n.icomoon-expand_more[data-v-3079414e]:before {\n  content: \"\\e5cf\";\n}\n.icomoon-mail_outline[data-v-3079414e]:before {\n  content: \"\\e0e1\";\n}\n.icomoon-menu[data-v-3079414e]:before {\n  content: \"\\e5d2\";\n}\n.icomoon-pin_drop[data-v-3079414e]:before {\n  content: \"\\e55e\";\n}\n.example-form[data-v-3079414e] {\n  width: 400px;\n  margin: 0 auto;\n}\n.example-form .txt[data-v-3079414e] {\n    color: #ff0000;\n}\n.example-form .logo[data-v-3079414e] {\n    background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAEsCAMAAADaaRXwAAACvlBMVEUjJ1z///8jJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1wjJ1z0VDn5AAAA6XRSTlMAAAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmKCkqKywtLi8wMTIzNDU3ODk6Ozw9Pj9AQUNERUZHSElKTE1OUFFSU1RVVldYWVpbXF1eX2FiY2RlZmdoaWprbm9wcXJzdHV2d3h5ent8fX5/gIGCg4SFhoeIi4yNjo+QkZOWl5iZm5ydnp+goaSlpqeoqaqrra+wsbKztLa3uLm6u7y9vr/AwcLExcbHyMnKy8zNzs/Q0dLT1NXW2Nna29zd3t/g4eLj5Obn6Onr7O3u7/Dx8vP09fb3+Pn6+/z9/tkdvo4AAAyzSURBVHhe7NEBDQAADAKgv39pa7gJFbivwkyIEIQIQYgQhAhBCEKEIEQIQoQgRAhCECIEIUIQIgQhQhCCECEIEYIQIQgRghCECEGIEIQIQYgQhCBECEKEIEQIQoQgBCFCECIEIUIQIgQhCBGCECEIEYIQIQhBiBCECEGIEIQIQYgQhCBECEKEIERIiDPjGmlCGIpzFrCABBzgAAk4wAICUIACJCABB7XwXHyZbzJ099g7OsmRedk/tpt917382mkJ6pRDUFLxVwPMZShVZGUVJZQtBFBx6o78YUKNWm6xqG9xh8T19WXBSn8GpFJXUpUy3jEbEgFFdJeMkikiWaVcQlZi2d6jVcqGSl5scoB5C4VAHNyQ/isgBg7iEvQYFKiO8jISKyeRKsCegW7innIUp7cSIO2Vee1iIBseWalx3S+lL3YWAWr8gT1AehpppT1lX7MY8mIgHpp9CE8CoaActBKqpYvCYNPSJiDw6q5afu9nLQXy+txNzT0IJNBRi+LmTm1QqImbZg+QcNMwVVZPYiCpj4jCQ0C4piJ93nGqnz6DPilYFRuPlYVxAiJylP5bgfta7HdHru9x7LJMDsqMggl0xAvfFiA8kTX8x9UDmFrnbG1Pl1XlKjMyEGkq3ejn3TUC+MZ47nQHI8rk8LJAtsRAJt92ILn+eJSoAECfF99SBhsKC+O89uqFYygSWjQ/H2vqYupoOFEmB4ZnYRjI5Nu79nJrWJjPQKBYPHMUHbZc2Lk2gpVWDpbLHc3LgUyERJkceOCUesYr3wmEFf4CCA+Pnicg4eOhWsNek8Qf5tiFRjgOBA6WyaizpQBAWHfIKhMDCTQsDGTybZ4hPXHhT4rEPFgtKhXbYFPTyjgDkTlYppdPRCiq9QxZZWIgmvxZYAxk8u0Gwj9YI4gX33H0aIkLf8Pauz5QCLastQaAfJTZf8qPrb0VrCY+DGsNe1ZN46V3KxAtMs8d0dMdIAb2QP8gEAPefDys+ADtabDJ9UEgs1p5X0D0HSCq5uP1IJBE0/8iUMn5+ir5HrcBsVzeAVroQXgJyKtbQDwszJNA3qail5ZTIAoXmwazDwgVfQ31JDU5DIweUe46g05VPQjkfVQynoUMhs+jn4Yt9yG2Uz4MifcbkSl551zs5NVdIBF+xA/ch3x7SCVSMrV2BZrrccuNoa8EUOXeEpvQ7t0YnoEmjm/fGP5jz95NAABhAArqTNnA/RdxC2vtFMQP97qU4SBNHvqpCwgQAQEiIEAEBIiACAgQAQEiIEAEBEiUrolxLA6Nd26wDFK3pD9OlpMlIAICRECACAgQAQEiIEAERECACAgQAQHS2DvTryyLNoDzPiwiiy+ESygEimVqCkpJZEhkiVlqC6RkJkEbCnrULHl9tagUA9TcMDwmqeWSG2ioSCoh4IYCIvmAiCgIzn/ROUUhONcsz9yznFPXZx8vfud3P8/cM3PNNU4ywycq8Yu8IxXXmhFCbQ2Xindmp00ZYnEOt7D4pRv2lFY3IoRaGmtKdq1ZEPuIPgIhIdEIG9aghMzZfA7hwr53yXgXa3L4Ts080YpDqMtLDlFIYL6QsM/LECnsuVPdRXMMSj3cTspxcmGQEgLzhfillCF6NGSNEsjh/ub+e9QUHfkTpROYLyQkqwUxxqFJNsdy9Pv0GmOKokmyCQwXErS+HXFEsSOPsF9GM0eKw6MlE5gsxGtFK+KM3Y9z5nD90M6XoX2Vh2QCY4VMuoL4oy3djSfHU6f5U5SHsxLEChAYJ8T7G+RYnB7JPun4rAM5Ij1JNoGBQkaXI0fj9juMOYJPOJpijatkAuOETL+FBCKL6Wcr5rrjGXZ6yiYwS0gaEos93vQcs++KZDjgKZvAJCEZSDSO+dByLBTMcMBdNoEGITCNdCOLhTN8Z5NNYIqQ/yEr4ijxN2UuEo8M6QRmCElG1sQOwhpwvCUZ4qQTmCAkmjrWij/BEbctSXBjqHQC/UIG1SPLYhq0mFhjUYIiF9kE2oW4HETWhR2/g2H7wbIM86UTqBAiOti2VpUeP3WBZVa3D/silMgioK6y5ERZIy1BS7B0Ar1CHqVsHdwryogNdv6TvO/TKflNFB7cIkoA7UPXtyaH9/kzh/9LmVXEBNukE+gVsosIc35BQA98j/ifiDj1mGbteWTl21/uvu5iiyH8UZWvyyfQKSSWBHNhFnZFL2IfiWfVAzmiiPxbR+BSHMeT1SS6KiDQKMT2Cwxz9zNwXyiuDsZpe2BcLyTAl0/AZ3BOw+wz/ZbmoYZAn5BXYJraSIJI/8MwT04P9hcRHBvgvcBxtT2ompf5qiLQJ6QIpCn1J280rQVx7gzojr4fBO/4iLh3cr7bY7t6gEICXUKegdfZ/CgqbdkgT3o38DDYxwxyisALXQP/xmClBLqEbIJoLvWjDz/bIZzqbrPpLBA7kZZimL0TKH+EagI9QnygOUgzyya51xmIJ/Y+avcbEPWX9BST/8A5GKGeQI+QBATEB0w+Q1uhofo+6GngT4orQ4q1CJ18QQeBHiE7oHI+xnrEpQCO3a2LeQtUVTCMqRj70Gs2PQQ6hLhDRQGsVVAetQBPVNfCH7R89H9iAv0EOoTEQHNn4Z2tFV2zCQC4jlwToZ9Ah5BlAE4EM44nUBRa+DfwAgB4MTmBfgIdQvYCxzKc2OMrYID4exDJB/4B7aVUP4EGIcDeQxoHzpMIH2F/8VbjefNoCfQTqBcSgPAxlAPHBtQ2J3Ti+gK402kJ9BOoFzIRT3PRiSfWA2MieWWjjXq+QD+BeiFz8DhbuHDeJf8nM/C0P+P2KNJZY7ASAvVCluNx5nHhjCW/Zi1iXzVJQawRrYRAvZAcPM7LXDj/xeNUdNJ+jaedLSZECYF6IdvwOJwn+vAzkfpO2lzgGRcTooRAvZDdeJxBfDiV+C2eTtjvgdcgMSFKCNQLOYTH8eXDOYXXSs7RT0yIEgJjhPTiwyl0RIinmBAlBP+ob4j3v98Q9jEkgA/nHHEMOYCH7S8mRAmBMW9ZoXw4DfBbFry2+JiYECUExsxDXuGi8QXmIeQahOfFhCghMGamnsqFEw7Mc8mL20liQpQQGLOWtZUL5z3yctI8PG22mBAlBMas9lZx4WwE1krJNSelYkKUEJizH8LT3ce5lrwfEgqcQBggJEQJgTk7hgs5cCIoO4ZuwGnMZCEhSgjM2VM/w4GzmranfhqomxISooTAoKqTCcw03k20qpMcIEeoiBAVBCbVZeUz46RQ67JmAjk2iwhRQWBU5WIkI02femrloj8AfG+MgBAVBEbV9h515m1ZA9f2FgPEBSzVt4AQFQRmVb/PZytpaoer3+k9gOYKCJFPYNj5kDtjWT5dznI+ZCgkpDVcQIh0AtNOUNUMpNK4/Mh2gqoAgr46WECIbALjzhiW9qfR5DKeMYyHz/QHCgiRS2DgKdyyICKN+7esp3B71YDcNcMFhEglMPGcev1zBJqAYwiMHPbeMDfjiD7eAIRIJzCzk0PHSi/oU7Ouc3Ry8LqK4MiFB6uQbQgQIp3A1F4nl9/GFnBEF/D1Okki5Wj6GF+TMGJdG4KEyCYwuBvQlcXBPZ/3hALebkCu5G7vNzPH9bThn3SENFOXTWC5kHRqpLB3mzqWMXnIX92mItN2NTvQLysSUeLiuoRRHp1j7fC4lSUsSycCBMr7ZdGjypF+bHaHO8plIoaoLS8pPlvLvJYlj0CLELU9F3ufRRZGtOSei1qEKO5KOvKWBCGSupLqEaK6b2+cdT4q/KT27dUkRHln60+s8nExUGpna11ClPd+t2Vb4+P8YLm933UJUX87gm2TJb9XgXJvR9AmRNbtG5K/I4V95d4fok+Ijht2bMLjSF5vuTfsaBSi5w6qeKEcHamS76DSKUTTLW1PVDju4/Kzkm9p0ypE1z2Gng4PJLm+cu8x1CxE302fMZWO6LgyWfJdpWYKcfJUcBdu70VNvDla0oGdJgkEmoRovS364czbXA9wToDs26L1C9F8n/rAFcx3ft5YFaToPnX9QuD7+n/lvK+fPzzfKmDRcfx9aH4jgUC/EDjCPi8jsthzp7o7CUZQamEHEaAknVInJE5gnhA4QuZsPodH2btkvIuTJfHQq5nF2EG4o3zdTFodnTiBiBDYmMzwiUr8Iu9IxbVmhFBbw6XindlpU4ZYnMNtTPzSDXtKqxsRQu2NdWUHtyyfHeGljeD39uiYBgAAhAEY+DeNBL5lR2uhf0gUvSEIEYIQIQgRghAhCEGIEIQIQYgQhAhBCEKEIEQIQoQgRAhCECIEIUIQIgQhQhCCECEIEYIQIQgRghCECEGIEIQIQYgQhCBECEKEIEQIQoQghANfiepMnkalgQAAAABJRU5ErkJggg==\");\n    height: 300px;\n    width: 400px;\n}\n", map: undefined, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$1 = "data-v-3079414e";
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

  console.log(Card);
  Vue.use(Card);
  Vue.use(Button);
  Vue.use(TextField);
  Vue.use(FloatingLabel);
  Vue.use(LineRipple);
  var component = ExampleFormComponent$1;
  var componentName = 'example-form';
  Vue.use(install);
  /**
   * Load the web component
   *
   */
  var loadWebComponent = function () {
      // for some reason rollupjs plugin rollup-plugin-vue does not output the 
      // same as webpack, so the component is inside a property called components
      if (component['components']) {
          var c = new component['components'].ExampleFormComponent();
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

})));
//# sourceMappingURL=example-form.dev.js.map

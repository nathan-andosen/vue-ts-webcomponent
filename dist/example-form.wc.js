(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("vue"));
	else if(typeof define === 'function' && define.amd)
		define(["vue"], factory);
	else if(typeof exports === 'object')
		exports["ExampleForm"] = factory(require("vue"));
	else
		root["ExampleForm"] = factory(root["Vue"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE_vue__) {
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
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/css-loader/index.js??ref--4-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sass-loader/lib/loader.js??ref--4-2!./src/example-form.component.scss?vue&type=style&index=0&id=957945c8&lang=scss&scoped=true":
/*!**************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader??ref--4-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sass-loader/lib/loader.js??ref--4-2!./src/example-form.component.scss?vue&type=style&index=0&id=957945c8&lang=scss&scoped=true ***!
  \**************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(true);
// imports


// module
exports.push([module.i, "\n.mdc-card[data-v-957945c8] {\n  background-color: #fff;\n  /* @alternate */\n  background-color: var(--mdc-theme-surface, #fff);\n  border-radius: 2px;\n  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);\n  display: flex;\n  flex-direction: column;\n  box-sizing: border-box;\n}\n.mdc-card--outlined[data-v-957945c8] {\n  box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.2), 0px 0px 0px 0px rgba(0, 0, 0, 0.14), 0px 0px 0px 0px rgba(0, 0, 0, 0.12);\n  border: 1px solid #e0e0e0;\n}\n.mdc-card__media[data-v-957945c8] {\n  position: relative;\n  box-sizing: border-box;\n  background-repeat: no-repeat;\n  background-position: center;\n  background-size: cover;\n}\n.mdc-card__media[data-v-957945c8]::before {\n    display: block;\n    content: \"\";\n}\n.mdc-card__media[data-v-957945c8]:first-child {\n  border-top-left-radius: inherit;\n  border-top-right-radius: inherit;\n}\n.mdc-card__media[data-v-957945c8]:last-child {\n  border-bottom-left-radius: inherit;\n  border-bottom-right-radius: inherit;\n}\n.mdc-card__media--square[data-v-957945c8]::before {\n  margin-top: 100%;\n}\n.mdc-card__media--16-9[data-v-957945c8]::before {\n  margin-top: 56.25%;\n}\n.mdc-card__media-content[data-v-957945c8] {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  box-sizing: border-box;\n}\n.mdc-card__primary-action[data-v-957945c8] {\n  --mdc-ripple-fg-size: 0;\n  --mdc-ripple-left: 0;\n  --mdc-ripple-top: 0;\n  --mdc-ripple-fg-scale: 1;\n  --mdc-ripple-fg-translate-end: 0;\n  --mdc-ripple-fg-translate-start: 0;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  will-change: transform, opacity;\n  display: flex;\n  flex-direction: column;\n  box-sizing: border-box;\n  position: relative;\n  outline: none;\n  color: inherit;\n  text-decoration: none;\n  cursor: pointer;\n  overflow: hidden;\n}\n.mdc-card__primary-action[data-v-957945c8]::before, .mdc-card__primary-action[data-v-957945c8]::after {\n    position: absolute;\n    border-radius: 50%;\n    opacity: 0;\n    pointer-events: none;\n    content: \"\";\n}\n.mdc-card__primary-action[data-v-957945c8]::before {\n    transition: opacity 15ms linear;\n    z-index: 1;\n}\n.mdc-card__primary-action.mdc-ripple-upgraded[data-v-957945c8]::before {\n    transform: scale(var(--mdc-ripple-fg-scale, 1));\n}\n.mdc-card__primary-action.mdc-ripple-upgraded[data-v-957945c8]::after {\n    top: 0;\n    /* @noflip */\n    left: 0;\n    transform: scale(0);\n    transform-origin: center center;\n}\n.mdc-card__primary-action.mdc-ripple-upgraded--unbounded[data-v-957945c8]::after {\n    top: var(--mdc-ripple-top, 0);\n    /* @noflip */\n    left: var(--mdc-ripple-left, 0);\n}\n.mdc-card__primary-action.mdc-ripple-upgraded--foreground-activation[data-v-957945c8]::after {\n    animation: 225ms mdc-ripple-fg-radius-in forwards, 75ms mdc-ripple-fg-opacity-in forwards;\n}\n.mdc-card__primary-action.mdc-ripple-upgraded--foreground-deactivation[data-v-957945c8]::after {\n    animation: 150ms mdc-ripple-fg-opacity-out;\n    transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n}\n.mdc-card__primary-action[data-v-957945c8]::before, .mdc-card__primary-action[data-v-957945c8]::after {\n    top: calc(50% - 100%);\n    /* @noflip */\n    left: calc(50% - 100%);\n    width: 200%;\n    height: 200%;\n}\n.mdc-card__primary-action.mdc-ripple-upgraded[data-v-957945c8]::after {\n    width: var(--mdc-ripple-fg-size, 100%);\n    height: var(--mdc-ripple-fg-size, 100%);\n}\n.mdc-card__primary-action[data-v-957945c8]::before, .mdc-card__primary-action[data-v-957945c8]::after {\n    background-color: black;\n}\n.mdc-card__primary-action[data-v-957945c8]:hover::before {\n    opacity: 0.04;\n}\n.mdc-card__primary-action[data-v-957945c8]:not(.mdc-ripple-upgraded):focus::before, .mdc-card__primary-action.mdc-ripple-upgraded--background-focused[data-v-957945c8]::before {\n    transition-duration: 75ms;\n    opacity: 0.12;\n}\n.mdc-card__primary-action[data-v-957945c8]:not(.mdc-ripple-upgraded)::after {\n    transition: opacity 150ms linear;\n}\n.mdc-card__primary-action[data-v-957945c8]:not(.mdc-ripple-upgraded):active::after {\n    transition-duration: 75ms;\n    opacity: 0.16;\n}\n.mdc-card__primary-action.mdc-ripple-upgraded[data-v-957945c8] {\n    --mdc-ripple-fg-opacity: 0.16;\n}\n.mdc-card__primary-action[data-v-957945c8]:first-child {\n  border-top-left-radius: inherit;\n  border-top-right-radius: inherit;\n}\n.mdc-card__primary-action[data-v-957945c8]:last-child {\n  border-bottom-left-radius: inherit;\n  border-bottom-right-radius: inherit;\n}\n.mdc-card__actions[data-v-957945c8] {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  box-sizing: border-box;\n  min-height: 52px;\n  padding: 8px;\n}\n.mdc-card__actions--full-bleed[data-v-957945c8] {\n  padding: 0;\n}\n.mdc-card__action-buttons[data-v-957945c8],\n.mdc-card__action-icons[data-v-957945c8] {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  box-sizing: border-box;\n}\n.mdc-card__action-icons[data-v-957945c8] {\n  color: rgba(0, 0, 0, 0.38);\n  /* @alternate */\n  color: var(--mdc-theme-text-icon-on-background, rgba(0, 0, 0, 0.38));\n  flex-grow: 1;\n  justify-content: flex-end;\n}\n.mdc-card__action-buttons + .mdc-card__action-icons[data-v-957945c8] {\n  /* @noflip */\n  margin-left: 16px;\n  /* @noflip */\n  margin-right: 0;\n}\n[dir=\"rtl\"] .mdc-card__action-buttons + .mdc-card__action-icons[data-v-957945c8], .mdc-card__action-buttons + .mdc-card__action-icons[dir=\"rtl\"][data-v-957945c8] {\n    /* @noflip */\n    margin-left: 0;\n    /* @noflip */\n    margin-right: 16px;\n}\n.mdc-card__action[data-v-957945c8] {\n  display: inline-flex;\n  flex-direction: row;\n  align-items: center;\n  box-sizing: border-box;\n  justify-content: center;\n  cursor: pointer;\n  user-select: none;\n}\n.mdc-card__action[data-v-957945c8]:focus {\n    outline: none;\n}\n.mdc-card__action--button[data-v-957945c8] {\n  /* @noflip */\n  margin-left: 0;\n  /* @noflip */\n  margin-right: 8px;\n  padding: 0 8px;\n}\n[dir=\"rtl\"] .mdc-card__action--button[data-v-957945c8], .mdc-card__action--button[dir=\"rtl\"][data-v-957945c8] {\n    /* @noflip */\n    margin-left: 8px;\n    /* @noflip */\n    margin-right: 0;\n}\n.mdc-card__action--button[data-v-957945c8]:last-child {\n    /* @noflip */\n    margin-left: 0;\n    /* @noflip */\n    margin-right: 0;\n}\n[dir=\"rtl\"] .mdc-card__action--button[data-v-957945c8]:last-child, .mdc-card__action--button:last-child[dir=\"rtl\"][data-v-957945c8] {\n      /* @noflip */\n      margin-left: 0;\n      /* @noflip */\n      margin-right: 0;\n}\n.mdc-card__actions--full-bleed .mdc-card__action--button[data-v-957945c8] {\n  justify-content: space-between;\n  width: 100%;\n  height: auto;\n  max-height: none;\n  margin: 0;\n  padding: 8px 16px;\n  text-align: left;\n}\n[dir=\"rtl\"] .mdc-card__actions--full-bleed .mdc-card__action--button[data-v-957945c8], .mdc-card__actions--full-bleed .mdc-card__action--button[dir=\"rtl\"][data-v-957945c8] {\n    text-align: right;\n}\n.mdc-card__action--icon[data-v-957945c8] {\n  margin: -6px 0;\n  padding: 12px;\n}\n.mdc-card__action--icon[data-v-957945c8]:not(:disabled) {\n  color: rgba(0, 0, 0, 0.38);\n  /* @alternate */\n  color: var(--mdc-theme-text-icon-on-background, rgba(0, 0, 0, 0.38));\n}\n.example-form .txt[data-v-957945c8] {\n  color: #ff0000;\n}\n", "", {"version":3,"sources":["E:/repos/vue-ts-webcomponent/src/E:/repos/vue-ts-webcomponent/node_modules/@material/card/mdc-card.scss","E:/repos/vue-ts-webcomponent/src/E:/repos/vue-ts-webcomponent/node_modules/@material/theme/_mixins.scss","E:/repos/vue-ts-webcomponent/src/E:/repos/vue-ts-webcomponent/node_modules/@material/theme/_variables.scss","E:/repos/vue-ts-webcomponent/src/E:/repos/vue-ts-webcomponent/node_modules/@material/card/_mixins.scss","E:/repos/vue-ts-webcomponent/src/E:/repos/vue-ts-webcomponent/node_modules/@material/elevation/_mixins.scss","E:/repos/vue-ts-webcomponent/src/E:/repos/vue-ts-webcomponent/node_modules/@material/elevation/_variables.scss","E:/repos/vue-ts-webcomponent/src/E:/repos/vue-ts-webcomponent/node_modules/@material/card/_variables.scss","E:/repos/vue-ts-webcomponent/src/E:/repos/vue-ts-webcomponent/node_modules/@material/ripple/_mixins.scss","E:/repos/vue-ts-webcomponent/src/E:/repos/vue-ts-webcomponent/node_modules/@material/ripple/_variables.scss","E:/repos/vue-ts-webcomponent/src/E:/repos/vue-ts-webcomponent/node_modules/@material/rtl/_mixins.scss","E:/repos/vue-ts-webcomponent/src/example-form.component.scss","E:/repos/vue-ts-webcomponent/src/E:/repos/vue-ts-webcomponent/src/example-form.component.scss"],"names":[],"mappings":";AAyBA;ECiCM,uBCxBkB;EDwChB,gBAAgB;EAChB,iDAA4D;EE3ClE,mBHLmC;EIenC,0HCxBkC;EF6BlC,cAAa;EACb,uBAAsB;EACtB,uBAAsB;CHnBvB;AAED;EIUE,yHCxBkC;EFUlC,0BGVgG;CNiBjG;AAMD;EAGE,mBAAkB;EAClB,uBAAsB;EACtB,6BAA4B;EAC5B,4BAA2B;EAC3B,uBAAsB;CACvB;AARD;IGoBI,eAAc;IACd,YAAW;CACZ;AHZH;EACE,gCAA+B;EAC/B,iCAAgC;CACjC;AAED;EACE,mCAAkC;EAClC,oCAAmC;CACpC;AAED;EGvBI,iBAA+B;CAChC;AH0BH;EG3BI,mBAA+B;CAChC;AH8BH;EACE,mBAAkB;EAClB,OAAM;EACN,SAAQ;EACR,UAAS;EACT,QAAO;EACP,uBAAsB;CACvB;AAMD;EO5DE,wBAAqB;EACrB,qBAAkB;EAClB,oBAAiB;EACjB,yBAAsB;EACtB,iCAA8B;EAC9B,mCAAgC;EAEhC,8CAA6C;EAC7C,gCAA+B;EJiB/B,cAAa;EACb,uBAAsB;EACtB,uBAAsB;EHuCtB,mBAAkB;EAClB,cAAa;EACb,eAAc;EACd,sBAAqB;EACrB,gBAAe;EACf,iBAAgB;CACjB;AAZD;IOhDI,mBAAkB;IAClB,mBAAkB;IAClB,WAAU;IACV,qBAAoB;IACpB,YAAW;CACZ;AP2CH;IOxCI,gCAAoD;IACpD,WAAU;CACX;APsCH;IOjCI,gDAA+C;CAChD;APgCH;IO7BI,OAAM;IAEN,aAAa;IACb,QAAO;IACP,oBAAmB;IACnB,gCAA+B;CAChC;APuBH;IOpBI,8BAA6B;IAE7B,aAAa;IACb,gCAA+B;CAChC;APgBH;IObI,0FAEgE;CACjE;APUH;IOPI,2CAAkE;IAElE,iGAAgG;CACjG;APIH;IOgGI,sBAA2B;IAE3B,aAAa;IACb,uBAA4B;IAC5B,YAAkB;IAClB,aAAmB;CACpB;APtGH;IOyGI,uCAAyC;IACzC,wCAA0C;CAC3C;AP3GH;ICtDM,wBMgHyB;CApD5B;APNH;IOYI,cCxEQ;CDyET;APbH;IO+BI,0BAAyB;IACzB,cC3FQ;CD4FT;APjCH;IO0CM,iCAAwD;CACzD;AP3CL;IO8CM,0BChH4B;IDiH5B,cCzGM;CD0GP;APhDL;IOoDI,8BAAwB;CACzB;APvCH;EACE,gCAA+B;EAC/B,iCAAgC;CACjC;AAED;EACE,mCAAkC;EAClC,oCAAmC;CACpC;AAMD;EGzDE,cAD4C;EAE5C,oBAAmB;EACnB,oBAAmB;EACnB,uBAAsB;EHyDtB,iBAAgB;EAChB,aAAY;CACb;AAED;EACE,WAAU;CACX;AAED;;EGpEE,cAD4C;EAE5C,oBAAmB;EACnB,oBAAmB;EACnB,uBAAsB;CHoEvB;AAED;ECpEM,2BCXc;ED2BZ,gBAAgB;EAChB,qEAA4D;EDsDlE,aAAY;EACZ,0BAAyB;CAC1B;AAED;ESgHE,aAAa;EACb,kBThHiD;ESkHjD,aAAa;EACb,gBArHe;CTGhB;AUiBC;IDoGE,aAAa;IACb,eAzHa;IA2Hb,aAAa;IACb,mBT1H+C;CS7D9C;AToEL;EGxFE,qBHyF6C;EGxF7C,oBAAmB;EACnB,oBAAmB;EACnB,uBAAsB;EHwFtB,wBAAuB;EACvB,gBAAe;EACf,kBAAiB;CAKlB;AAVD;IAQI,cAAa;CACd;AAOH;ESwFE,aAAa;EACb,eA/GgB;EAiHhB,aAAa;EACb,kBT3FiD;EAEjD,eAAc;CAKf;AUUC;ID6EE,aAAa;IACb,iBT/F+C;ISiG/C,aAAa;IACb,gBAzHc;CA9Db;AToFL;ISwFE,aAAa;IACb,eA/GgB;IAiHhB,aAAa;IACb,gBTtFiD;CAChD;AUqBC;MDmEA,aAAa;MACb,eT1F+C;MS4F/C,aAAa;MACb,gBAzHc;CA9Db;AT8FL;EACE,+BAA8B;EAC9B,YAAW;EACX,aAAY;EACZ,iBAAgB;EAChB,UAAS;EACT,kBAAiB;EACjB,iBAAgB;CAKjB;AUoBC;IVtBE,kBAAiB;CSxGhB;ATgHL;EAEE,eAAc;EAGd,cAAa;CACd;AAED;ECvIM,2BCXc;ED2BZ,gBAAgB;EAChB,qEAA4D;CDwHnE;AWjMD;EAEI,eAAc;CACf","file":"example-form.component.scss?vue&type=style&index=0&id=957945c8&lang=scss&scoped=true","sourcesContent":["//\n// Copyright 2016 Google Inc. All Rights Reserved.\n//\n// Licensed under the Apache License, Version 2.0 (the \"License\");\n// you may not use this file except in compliance with the License.\n// You may obtain a copy of the License at\n//\n//      http://www.apache.org/licenses/LICENSE-2.0\n//\n// Unless required by applicable law or agreed to in writing, software\n// distributed under the License is distributed on an \"AS IS\" BASIS,\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n// See the License for the specific language governing permissions and\n// limitations under the License.\n//\n\n@import \"@material/elevation/mixins\";\n@import \"@material/theme/mixins\";\n@import \"@material/ripple/mixins\";\n@import \"@material/rtl/mixins\";\n@import \"./mixins\";\n@import \"./variables\";\n\n// postcss-bem-linter: define card\n\n.mdc-card {\n  @include mdc-card-fill-color(surface);\n  @include mdc-card-corner-radius(2px);\n  @include mdc-elevation(2);\n  @include mdc-card-container-layout_;\n}\n\n.mdc-card--outlined {\n  @include mdc-elevation(0);\n  @include mdc-card-outline($mdc-card-outline-color);\n}\n\n//\n// Media\n//\n\n.mdc-card__media {\n  @include mdc-card-media-aspect-ratio-base_;\n\n  position: relative; // Child element `__media-content` has `position: absolute`\n  box-sizing: border-box;\n  background-repeat: no-repeat;\n  background-position: center;\n  background-size: cover;\n}\n\n.mdc-card__media:first-child {\n  border-top-left-radius: inherit;\n  border-top-right-radius: inherit;\n}\n\n.mdc-card__media:last-child {\n  border-bottom-left-radius: inherit;\n  border-bottom-right-radius: inherit;\n}\n\n.mdc-card__media--square {\n  @include mdc-card-media-aspect-ratio(1, 1);\n}\n\n.mdc-card__media--16-9 {\n  @include mdc-card-media-aspect-ratio(16, 9);\n}\n\n.mdc-card__media-content {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  box-sizing: border-box;\n}\n\n//\n// Primary action\n//\n\n.mdc-card__primary-action {\n  @include mdc-ripple-surface;\n  @include mdc-ripple-radius-bounded;\n  @include mdc-states;\n  @include mdc-card-container-layout_;\n\n  position: relative; // Needed to prevent the ripple wash from overflowing the container in IE and Edge\n  outline: none;\n  color: inherit;\n  text-decoration: none;\n  cursor: pointer;\n  overflow: hidden;\n}\n\n.mdc-card__primary-action:first-child {\n  border-top-left-radius: inherit;\n  border-top-right-radius: inherit;\n}\n\n.mdc-card__primary-action:last-child {\n  border-bottom-left-radius: inherit;\n  border-bottom-right-radius: inherit;\n}\n\n//\n// Action row\n//\n\n.mdc-card__actions {\n  @include mdc-card-actions-layout_;\n\n  min-height: 52px;\n  padding: 8px;\n}\n\n.mdc-card__actions--full-bleed {\n  padding: 0;\n}\n\n.mdc-card__action-buttons,\n.mdc-card__action-icons {\n  @include mdc-card-actions-layout_;\n}\n\n.mdc-card__action-icons {\n  @include mdc-theme-prop(color, text-icon-on-background);\n\n  flex-grow: 1;\n  justify-content: flex-end;\n}\n\n.mdc-card__action-buttons + .mdc-card__action-icons {\n  @include mdc-rtl-reflexive-box(margin, left, 16px);\n}\n\n//\n// Action items\n//\n\n.mdc-card__action {\n  @include mdc-card-actions-layout_(inline-flex);\n\n  justify-content: center;\n  cursor: pointer;\n  user-select: none;\n\n  &:focus {\n    outline: none;\n  }\n}\n\n//\n// Action buttons\n//\n\n.mdc-card__action--button {\n  @include mdc-rtl-reflexive-box(margin, right, 8px);\n\n  padding: 0 8px;\n\n  &:last-child {\n    @include mdc-rtl-reflexive-box(margin, right, 0);\n  }\n}\n\n.mdc-card__actions--full-bleed .mdc-card__action--button {\n  justify-content: space-between;\n  width: 100%;\n  height: auto;\n  max-height: none;\n  margin: 0;\n  padding: 8px 16px;\n  text-align: left;\n\n  @include mdc-rtl {\n    text-align: right;\n  }\n}\n\n//\n// Action icons\n//\n\n.mdc-card__action--icon {\n  // Icon toggles are taller than buttons, so we need to adjust their margins to prevent the action row from expanding.\n  margin: -6px 0;\n\n  // Same padding as mdc-icon-button.\n  padding: 12px;\n}\n\n.mdc-card__action--icon:not(:disabled) {\n  @include mdc-theme-prop(color, text-icon-on-background);\n}\n\n// postcss-bem-linter: end\n","//\n// Copyright 2017 Google Inc. All Rights Reserved.\n//\n// Licensed under the Apache License, Version 2.0 (the \"License\");\n// you may not use this file except in compliance with the License.\n// You may obtain a copy of the License at\n//\n//      http://www.apache.org/licenses/LICENSE-2.0\n//\n// Unless required by applicable law or agreed to in writing, software\n// distributed under the License is distributed on an \"AS IS\" BASIS,\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n// See the License for the specific language governing permissions and\n// limitations under the License.\n//\n\n@import \"./variables\";\n\n// Applies the correct theme color style to the specified property.\n// $property is typically color or background-color, but can be any CSS property that accepts color values.\n// $style should be one of the map keys in $mdc-theme-property-values (_variables.scss), or a literal color value.\n// $edgeOptOut controls whether to feature-detect around Edge to avoid emitting CSS variables for it,\n// intended for use in cases where interactions with pseudo-element styles cause problems due to Edge bugs.\n@mixin mdc-theme-prop($property, $style, $important: false, $edgeOptOut: false) {\n  @if type-of($style) == \"color\" or $style == \"currentColor\" {\n    @if $important {\n      #{$property}: $style !important;\n    } @else {\n      #{$property}: $style;\n    }\n  } @else {\n    @if not map-has-key($mdc-theme-property-values, $style) {\n      @error \"Invalid style: '#{$style}'. Choose one of: #{map-keys($mdc-theme-property-values)}\";\n    }\n\n    $value: map-get($mdc-theme-property-values, $style);\n\n    @if $important {\n      #{$property}: $value !important;\n\n      @if $edgeOptOut {\n        // stylelint-disable max-nesting-depth\n        @at-root {\n          @supports not (-ms-ime-align:auto) {\n            // stylelint-disable scss/selector-no-redundant-nesting-selector\n            & {\n              /* @alternate */\n              #{$property}: var(--mdc-theme-#{$style}, $value) !important;\n            }\n            // stylelint-enable scss/selector-no-redundant-nesting-selector\n          }\n        }\n        // stylelint-enable max-nesting-depth\n      } @else {\n        /* @alternate */\n        #{$property}: var(--mdc-theme-#{$style}, $value) !important;\n      }\n    } @else {\n      #{$property}: $value;\n\n      @if $edgeOptOut {\n        // stylelint-disable max-nesting-depth\n        @at-root {\n          @supports not (-ms-ime-align:auto) {\n            // stylelint-disable scss/selector-no-redundant-nesting-selector\n            & {\n              /* @alternate */\n              #{$property}: var(--mdc-theme-#{$style}, $value);\n            }\n            // stylelint-enable scss/selector-no-redundant-nesting-selector\n          }\n        }\n        // stylelint-enable max-nesting-depth\n      } @else {\n        /* @alternate */\n        #{$property}: var(--mdc-theme-#{$style}, $value);\n      }\n    }\n  }\n}\n","//\n// Copyright 2017 Google Inc. All Rights Reserved.\n//\n// Licensed under the Apache License, Version 2.0 (the \"License\");\n// you may not use this file except in compliance with the License.\n// You may obtain a copy of the License at\n//\n//      http://www.apache.org/licenses/LICENSE-2.0\n//\n// Unless required by applicable law or agreed to in writing, software\n// distributed under the License is distributed on an \"AS IS\" BASIS,\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n// See the License for the specific language governing permissions and\n// limitations under the License.\n//\n\n@import \"./functions\";\n\n//\n// Main theme colors for your brand.\n//\n// If you're a user customizing your color scheme in SASS, these are probably the only variables you need to change.\n//\n\n$mdc-theme-primary: #6200ee !default; // baseline purple, 500 tone\n$mdc-theme-on-primary: if(mdc-theme-contrast-tone($mdc-theme-primary) == \"dark\", #000, #fff) !default;\n\n// The $mdc-theme-accent variable is DEPRECATED - it exists purely for backward compatibility.\n// The $mdc-theme-secondary* variables should be used for all new projects.\n$mdc-theme-accent: #018786 !default; // baseline teal, 600 tone\n$mdc-theme-secondary: $mdc-theme-accent !default;\n$mdc-theme-on-secondary: if(mdc-theme-contrast-tone($mdc-theme-secondary) == \"dark\", #000, #fff) !default;\n$mdc-theme-background: #fff !default; // White\n\n$mdc-theme-surface: #fff !default;\n$mdc-theme-on-surface: if(mdc-theme-contrast-tone($mdc-theme-surface) == \"dark\", #000, #fff) !default;\n\n//\n// Text colors according to light vs dark and text type.\n//\n\n$mdc-theme-text-colors: (\n  dark: (\n    primary: rgba(black, .87),\n    secondary: rgba(black, .54),\n    hint: rgba(black, .38),\n    disabled: rgba(black, .38),\n    icon: rgba(black, .38)\n  ),\n  light: (\n    primary: white,\n    secondary: rgba(white, .7),\n    hint: rgba(white, .5),\n    disabled: rgba(white, .5),\n    icon: rgba(white, .5)\n  )\n) !default;\n\n@function mdc-theme-ink-color-for-fill_($text-style, $fill-color) {\n  $contrast-tone: mdc-theme-contrast-tone($fill-color);\n\n  @return map-get(map-get($mdc-theme-text-colors, $contrast-tone), $text-style);\n}\n\n//\n// Primary text colors for each of the theme colors.\n//\n\n$mdc-theme-property-values: (\n  // Primary\n  primary: $mdc-theme-primary,\n  // Secondary\n  secondary: $mdc-theme-secondary,\n  // Background\n  background: $mdc-theme-background,\n  // Surface\n  surface: $mdc-theme-surface,\n  on-primary: $mdc-theme-on-primary,\n  on-secondary: $mdc-theme-on-secondary,\n  on-surface: $mdc-theme-on-surface,\n  // Text-primary on \"background\" background\n  text-primary-on-background: mdc-theme-ink-color-for-fill_(primary, $mdc-theme-background),\n  text-secondary-on-background: mdc-theme-ink-color-for-fill_(secondary, $mdc-theme-background),\n  text-hint-on-background: mdc-theme-ink-color-for-fill_(hint, $mdc-theme-background),\n  text-disabled-on-background: mdc-theme-ink-color-for-fill_(disabled, $mdc-theme-background),\n  text-icon-on-background: mdc-theme-ink-color-for-fill_(icon, $mdc-theme-background),\n  // Text-primary on \"light\" background\n  text-primary-on-light: mdc-theme-ink-color-for-fill_(primary, light),\n  text-secondary-on-light: mdc-theme-ink-color-for-fill_(secondary, light),\n  text-hint-on-light: mdc-theme-ink-color-for-fill_(hint, light),\n  text-disabled-on-light: mdc-theme-ink-color-for-fill_(disabled, light),\n  text-icon-on-light: mdc-theme-ink-color-for-fill_(icon, light),\n  // Text-primary on \"dark\" background\n  text-primary-on-dark: mdc-theme-ink-color-for-fill_(primary, dark),\n  text-secondary-on-dark: mdc-theme-ink-color-for-fill_(secondary, dark),\n  text-hint-on-dark: mdc-theme-ink-color-for-fill_(hint, dark),\n  text-disabled-on-dark: mdc-theme-ink-color-for-fill_(disabled, dark),\n  text-icon-on-dark: mdc-theme-ink-color-for-fill_(icon, dark)\n);\n\n// If `$property` is a literal color value (e.g., `blue`, `#fff`), it is returned verbatim. Otherwise, the value of the\n// corresponding theme property (from `$mdc-theme-property-values`) is returned. If `$property` is not a color and no\n// such theme property exists, an error is thrown.\n//\n// This is mainly useful in situations where `mdc-theme-prop` cannot be used directly (e.g., `box-shadow`).\n//\n// Examples:\n//\n// 1. mdc-theme-prop-value(primary) => \"#3f51b5\"\n// 2. mdc-theme-prop-value(blue)    => \"blue\"\n//\n// NOTE: This function must be defined in _variables.scss instead of _functions.scss to avoid circular imports.\n@function mdc-theme-prop-value($property) {\n  @if type-of($property) == \"color\" or $property == \"currentColor\" {\n    @return $property;\n  }\n\n  @if not map-has-key($mdc-theme-property-values, $property) {\n    @error \"Invalid theme property: '#{$property}'. Choose one of: #{map-keys($mdc-theme-property-values)}\";\n  }\n\n  @return map-get($mdc-theme-property-values, $property);\n}\n\n// NOTE: This function must be defined in _variables.scss instead of _functions.scss to avoid circular imports.\n@function mdc-theme-accessible-ink-color($fill-color, $text-style: primary) {\n  $fill-color-value: mdc-theme-prop-value($fill-color);\n  $color-map-for-tone: map-get($mdc-theme-text-colors, mdc-theme-contrast-tone($fill-color-value));\n\n  @if not map-has-key($color-map-for-tone, $text-style) {\n    @error \"Invalid $text-style: '#{$text-style}'. Choose one of: #{map-keys($color-map-for-tone)}\";\n  }\n\n  @return map-get($color-map-for-tone, $text-style);\n}\n","//\n// Copyright 2017 Google Inc. All Rights Reserved.\n//\n// Licensed under the Apache License, Version 2.0 (the \"License\");\n// you may not use this file except in compliance with the License.\n// You may obtain a copy of the License at\n//\n//      http://www.apache.org/licenses/LICENSE-2.0\n//\n// Unless required by applicable law or agreed to in writing, software\n// distributed under the License is distributed on an \"AS IS\" BASIS,\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n// See the License for the specific language governing permissions and\n// limitations under the License.\n//\n\n@import \"@material/theme/mixins\";\n@import \"./variables\";\n\n//\n// Public\n//\n\n@mixin mdc-card-fill-color($color) {\n  @include mdc-theme-prop(background-color, $color);\n}\n\n@mixin mdc-card-outline($color, $thickness: $mdc-card-outline-width) {\n  border: $thickness solid mdc-theme-prop-value($color);\n}\n\n@mixin mdc-card-corner-radius($radius) {\n  border-radius: $radius;\n}\n\n@mixin mdc-card-media-aspect-ratio($x, $y) {\n  &::before {\n    // This clever trick brought to you by: http://www.mademyday.de/css-height-equals-width-with-pure-css.html\n    margin-top: percentage($y / $x);\n  }\n}\n\n//\n// Private\n//\n\n@mixin mdc-card-container-layout_ {\n  display: flex;\n  flex-direction: column;\n  box-sizing: border-box;\n}\n\n@mixin mdc-card-actions-layout_($display: flex) {\n  display: $display;\n  flex-direction: row;\n  align-items: center;\n  box-sizing: border-box;\n}\n\n@mixin mdc-card-media-aspect-ratio-base_ {\n  &::before {\n    display: block;\n    content: \"\";\n  }\n}\n","//\n// Copyright 2017 Google Inc. All Rights Reserved.\n//\n// Licensed under the Apache License, Version 2.0 (the \"License\");\n// you may not use this file except in compliance with the License.\n// You may obtain a copy of the License at\n//\n//      http://www.apache.org/licenses/LICENSE-2.0\n//\n// Unless required by applicable law or agreed to in writing, software\n// distributed under the License is distributed on an \"AS IS\" BASIS,\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n// See the License for the specific language governing permissions and\n// limitations under the License.\n//\n\n@import \"@material/theme/variables\";\n@import \"./variables\";\n\n// Applies the correct CSS rules to an element to give it the elevation specified by $z-value.\n// The $z-value must be between 0 and 24.\n// If $color has an alpha channel, it will be ignored and overridden. To increase the opacity of the shadow, use\n// $opacity-boost.\n@mixin mdc-elevation($z-value, $color: $mdc-elevation-baseline-color, $opacity-boost: 0) {\n  @if type-of($z-value) != number or not unitless($z-value) {\n    @error \"$z-value must be a unitless number, but received '#{$z-value}'\";\n  }\n\n  @if $z-value < 0 or $z-value > 24 {\n    @error \"$z-value must be between 0 and 24, but received '#{$z-value}'\";\n  }\n\n  $color: mdc-theme-prop-value($color);\n\n  $umbra-z-value: map-get($mdc-elevation-umbra-map, $z-value);\n  $penumbra-z-value: map-get($mdc-elevation-penumbra-map, $z-value);\n  $ambient-z-value: map-get($mdc-elevation-ambient-map, $z-value);\n\n  $umbra-color: rgba($color, $mdc-elevation-umbra-opacity + $opacity-boost);\n  $penumbra-color: rgba($color, $mdc-elevation-penumbra-opacity + $opacity-boost);\n  $ambient-color: rgba($color, $mdc-elevation-ambient-opacity + $opacity-boost);\n\n  box-shadow:\n    #{\"#{$umbra-z-value} #{$umbra-color}\"},\n    #{\"#{$penumbra-z-value} #{$penumbra-color}\"},\n    #{$ambient-z-value} $ambient-color;\n}\n\n// Returns a string that can be used as the value for a `transition` property for elevation.\n// Calling this function directly is useful in situations where a component needs to transition\n// more than one property.\n//\n// ```scss\n// .foo {\n//   transition: mdc-elevation-transition-value(), opacity 100ms ease;\n//   will-change: $mdc-elevation-property, opacity;\n// }\n// ```\n@function mdc-elevation-transition-value(\n  $duration: $mdc-elevation-transition-duration,\n  $easing: $mdc-elevation-transition-timing-function) {\n  @return #{$mdc-elevation-property} #{$duration} #{$easing};\n}\n","//\n// Copyright 2017 Google Inc. All Rights Reserved.\n//\n// Licensed under the Apache License, Version 2.0 (the \"License\");\n// you may not use this file except in compliance with the License.\n// You may obtain a copy of the License at\n//\n//      http://www.apache.org/licenses/LICENSE-2.0\n//\n// Unless required by applicable law or agreed to in writing, software\n// distributed under the License is distributed on an \"AS IS\" BASIS,\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n// See the License for the specific language governing permissions and\n// limitations under the License.\n//\n\n@import \"@material/animation/variables\";\n\n$mdc-elevation-baseline-color: black;\n$mdc-elevation-umbra-opacity: .2;\n$mdc-elevation-penumbra-opacity: .14;\n$mdc-elevation-ambient-opacity: .12;\n\n$mdc-elevation-umbra-map: (\n  0: \"0px 0px 0px 0px\",\n  1: \"0px 2px 1px -1px\",\n  2: \"0px 3px 1px -2px\",\n  3: \"0px 3px 3px -2px\",\n  4: \"0px 2px 4px -1px\",\n  5: \"0px 3px 5px -1px\",\n  6: \"0px 3px 5px -1px\",\n  7: \"0px 4px 5px -2px\",\n  8: \"0px 5px 5px -3px\",\n  9: \"0px 5px 6px -3px\",\n  10: \"0px 6px 6px -3px\",\n  11: \"0px 6px 7px -4px\",\n  12: \"0px 7px 8px -4px\",\n  13: \"0px 7px 8px -4px\",\n  14: \"0px 7px 9px -4px\",\n  15: \"0px 8px 9px -5px\",\n  16: \"0px 8px 10px -5px\",\n  17: \"0px 8px 11px -5px\",\n  18: \"0px 9px 11px -5px\",\n  19: \"0px 9px 12px -6px\",\n  20: \"0px 10px 13px -6px\",\n  21: \"0px 10px 13px -6px\",\n  22: \"0px 10px 14px -6px\",\n  23: \"0px 11px 14px -7px\",\n  24: \"0px 11px 15px -7px\"\n);\n\n$mdc-elevation-penumbra-map: (\n  0: \"0px 0px 0px 0px\",\n  1: \"0px 1px 1px 0px\",\n  2: \"0px 2px 2px 0px\",\n  3: \"0px 3px 4px 0px\",\n  4: \"0px 4px 5px 0px\",\n  5: \"0px 5px 8px 0px\",\n  6: \"0px 6px 10px 0px\",\n  7: \"0px 7px 10px 1px\",\n  8: \"0px 8px 10px 1px\",\n  9: \"0px 9px 12px 1px\",\n  10: \"0px 10px 14px 1px\",\n  11: \"0px 11px 15px 1px\",\n  12: \"0px 12px 17px 2px\",\n  13: \"0px 13px 19px 2px\",\n  14: \"0px 14px 21px 2px\",\n  15: \"0px 15px 22px 2px\",\n  16: \"0px 16px 24px 2px\",\n  17: \"0px 17px 26px 2px\",\n  18: \"0px 18px 28px 2px\",\n  19: \"0px 19px 29px 2px\",\n  20: \"0px 20px 31px 3px\",\n  21: \"0px 21px 33px 3px\",\n  22: \"0px 22px 35px 3px\",\n  23: \"0px 23px 36px 3px\",\n  24: \"0px 24px 38px 3px\"\n);\n\n$mdc-elevation-ambient-map: (\n  0: \"0px 0px 0px 0px\",\n  1: \"0px 1px 3px 0px\",\n  2: \"0px 1px 5px 0px\",\n  3: \"0px 1px 8px 0px\",\n  4: \"0px 1px 10px 0px\",\n  5: \"0px 1px 14px 0px\",\n  6: \"0px 1px 18px 0px\",\n  7: \"0px 2px 16px 1px\",\n  8: \"0px 3px 14px 2px\",\n  9: \"0px 3px 16px 2px\",\n  10: \"0px 4px 18px 3px\",\n  11: \"0px 4px 20px 3px\",\n  12: \"0px 5px 22px 4px\",\n  13: \"0px 5px 24px 4px\",\n  14: \"0px 5px 26px 4px\",\n  15: \"0px 6px 28px 5px\",\n  16: \"0px 6px 30px 5px\",\n  17: \"0px 6px 32px 5px\",\n  18: \"0px 7px 34px 6px\",\n  19: \"0px 7px 36px 6px\",\n  20: \"0px 8px 38px 7px\",\n  21: \"0px 8px 40px 7px\",\n  22: \"0px 8px 42px 7px\",\n  23: \"0px 9px 44px 8px\",\n  24: \"0px 9px 46px 8px\"\n);\n\n// The css property used for elevation. In most cases this should not be changed. It is exposed\n// as a variable for abstraction / easy use when needing to reference the property directly, for\n// example in a `will-change` rule.\n$mdc-elevation-property: box-shadow !default;\n\n// The default duration value for elevation transitions.\n$mdc-elevation-transition-duration: 280ms !default;\n\n// The default easing value for elevation transitions.\n$mdc-elevation-transition-timing-function: $mdc-animation-standard-curve-timing-function !default;\n","//\n// Copyright 2018 Google Inc. All Rights Reserved.\n//\n// Licensed under the Apache License, Version 2.0 (the \"License\");\n// you may not use this file except in compliance with the License.\n// You may obtain a copy of the License at\n//\n//      http://www.apache.org/licenses/LICENSE-2.0\n//\n// Unless required by applicable law or agreed to in writing, software\n// distributed under the License is distributed on an \"AS IS\" BASIS,\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n// See the License for the specific language governing permissions and\n// limitations under the License.\n//\n\n@import \"@material/theme/mixins\";\n\n$mdc-card-outline-color: mix(mdc-theme-prop-value(on-surface), mdc-theme-prop-value(surface), 12%);\n$mdc-card-outline-width: 1px;\n","//\n// Copyright 2016 Google Inc. All Rights Reserved.\n//\n// Licensed under the Apache License, Version 2.0 (the \"License\");\n// you may not use this file except in compliance with the License.\n// You may obtain a copy of the License at\n//\n//      http://www.apache.org/licenses/LICENSE-2.0\n//\n// Unless required by applicable law or agreed to in writing, software\n// distributed under the License is distributed on an \"AS IS\" BASIS,\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n// See the License for the specific language governing permissions and\n// limitations under the License.\n//\n\n@import \"@material/animation/variables\";\n@import \"@material/theme/mixins\";\n@import \"./functions\";\n@import \"./variables\";\n\n@mixin mdc-ripple-surface() {\n  --mdc-ripple-fg-size: 0;\n  --mdc-ripple-left: 0;\n  --mdc-ripple-top: 0;\n  --mdc-ripple-fg-scale: 1;\n  --mdc-ripple-fg-translate-end: 0;\n  --mdc-ripple-fg-translate-start: 0;\n\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  will-change: transform, opacity;\n\n  &::before,\n  &::after {\n    position: absolute;\n    border-radius: 50%;\n    opacity: 0;\n    pointer-events: none;\n    content: \"\";\n  }\n\n  &::before {\n    transition: opacity $mdc-states-wash-duration linear;\n    z-index: 1; // Ensure that the ripple wash for hover/focus states is displayed on top of positioned child elements\n  }\n\n  // Common styles for upgraded surfaces (some of these depend on custom properties set via JS or other mixins)\n\n  &.mdc-ripple-upgraded::before {\n    transform: scale(var(--mdc-ripple-fg-scale, 1));\n  }\n\n  &.mdc-ripple-upgraded::after {\n    top: 0;\n\n    /* @noflip */\n    left: 0;\n    transform: scale(0);\n    transform-origin: center center;\n  }\n\n  &.mdc-ripple-upgraded--unbounded::after {\n    top: var(--mdc-ripple-top, 0);\n\n    /* @noflip */\n    left: var(--mdc-ripple-left, 0);\n  }\n\n  &.mdc-ripple-upgraded--foreground-activation::after {\n    animation:\n      $mdc-ripple-translate-duration mdc-ripple-fg-radius-in forwards,\n      $mdc-ripple-fade-in-duration mdc-ripple-fg-opacity-in forwards;\n  }\n\n  &.mdc-ripple-upgraded--foreground-deactivation::after {\n    animation: $mdc-ripple-fade-out-duration mdc-ripple-fg-opacity-out;\n    // Retain transform from mdc-ripple-fg-radius-in activation\n    transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n  }\n}\n\n@mixin mdc-states-base-color($color) {\n  // Opacity styles are here (rather than in mdc-ripple-surface) to ensure that opacity is re-initialized for\n  // cases where this mixin is used to override another inherited use of itself,\n  // without needing to re-include mdc-ripple-surface.\n  &::before,\n  &::after {\n    @include mdc-theme-prop(background-color, $color, $edgeOptOut: true);\n  }\n}\n\n@mixin mdc-states-hover-opacity($opacity) {\n  // Background wash styles, for both CSS-only and upgraded stateful surfaces\n  &:hover::before {\n    opacity: $opacity;\n  }\n}\n\n@mixin mdc-states-focus-opacity($opacity, $has-nested-focusable-element: false) {\n  // Focus overrides hover by reusing the ::before pseudo-element.\n  // :focus-within generally works on non-MS browsers and matches when a *child* of the element has focus.\n  // It is useful for cases where a component has a focusable element within the root node, e.g. text field,\n  // but undesirable in general in case of nested stateful components.\n  // We use a modifier class for JS-enabled surfaces to support all use cases in all browsers.\n  $cssOnlyFocusSelector: if(\n    $has-nested-focusable-element,\n    \"&:not(.mdc-ripple-upgraded):focus::before, &:not(.mdc-ripple-upgraded):focus-within::before\",\n    \"&:not(.mdc-ripple-upgraded):focus::before\"\n  );\n\n  #{$cssOnlyFocusSelector},\n  &.mdc-ripple-upgraded--background-focused::before {\n    // Note that this duration is only effective on focus, not blur\n    transition-duration: 75ms;\n    opacity: $opacity;\n  }\n}\n\n@mixin mdc-states-press-opacity($opacity) {\n  // Styles for non-upgraded (CSS-only) stateful surfaces\n\n  &:not(.mdc-ripple-upgraded) {\n    // Apply press additively by using the ::after pseudo-element\n    &::after {\n      transition: opacity $mdc-ripple-fade-out-duration linear;\n    }\n\n    &:active::after {\n      transition-duration: $mdc-ripple-fade-in-duration;\n      opacity: $opacity;\n    }\n  }\n\n  &.mdc-ripple-upgraded {\n    --mdc-ripple-fg-opacity: #{$opacity};\n  }\n}\n\n// Simple mixin for base states which automatically selects opacity values based on whether the ink color is\n// light or dark.\n@mixin mdc-states($color: black, $has-nested-focusable-element: false) {\n  @include mdc-states-interactions_($color, $has-nested-focusable-element);\n}\n\n// Simple mixin for activated states which automatically selects opacity values based on whether the ink color is\n// light or dark.\n@mixin mdc-states-activated($color, $has-nested-focusable-element: false) {\n  $activated-opacity: mdc-states-opacity($color, activated);\n\n  &--activated {\n    // Stylelint seems to think that '&' qualifies as a type selector here?\n    // stylelint-disable-next-line selector-max-type\n    &::before {\n      opacity: $activated-opacity;\n    }\n\n    @include mdc-states-interactions_($color, $has-nested-focusable-element, $activated-opacity);\n  }\n}\n\n// Simple mixin for selected states which automatically selects opacity values based on whether the ink color is\n// light or dark.\n@mixin mdc-states-selected($color, $has-nested-focusable-element: false) {\n  $selected-opacity: mdc-states-opacity($color, selected);\n\n  &--selected {\n    // stylelint-disable-next-line selector-max-type\n    &::before {\n      opacity: $selected-opacity;\n    }\n\n    @include mdc-states-interactions_($color, $has-nested-focusable-element, $selected-opacity);\n  }\n}\n\n@mixin mdc-ripple-radius-bounded($radius: 100%) {\n  &::before,\n  &::after {\n    top: calc(50% - #{$radius});\n\n    /* @noflip */\n    left: calc(50% - #{$radius});\n    width: $radius * 2;\n    height: $radius * 2;\n  }\n\n  &.mdc-ripple-upgraded::after {\n    width: var(--mdc-ripple-fg-size, $radius);\n    height: var(--mdc-ripple-fg-size, $radius);\n  }\n}\n\n@mixin mdc-ripple-radius-unbounded($radius: 100%) {\n  &::before,\n  &::after {\n    top: calc(50% - #{$radius / 2});\n\n    /* @noflip */\n    left: calc(50% - #{$radius / 2});\n    width: $radius;\n    height: $radius;\n  }\n\n  &.mdc-ripple-upgraded::before,\n  &.mdc-ripple-upgraded::after {\n    top: var(--mdc-ripple-top, calc(50% - #{$radius / 2}));\n\n    /* @noflip */\n    left: var(--mdc-ripple-left, calc(50% - #{$radius / 2}));\n    width: var(--mdc-ripple-fg-size, $radius);\n    height: var(--mdc-ripple-fg-size, $radius);\n  }\n\n  &.mdc-ripple-upgraded::after {\n    width: var(--mdc-ripple-fg-size, $radius);\n    height: var(--mdc-ripple-fg-size, $radius);\n  }\n}\n\n@mixin mdc-states-interactions_($color, $has-nested-focusable-element, $opacity-modifier: 0) {\n  @include mdc-states-base-color($color);\n  @include mdc-states-hover-opacity(mdc-states-opacity($color, hover) + $opacity-modifier);\n  @include mdc-states-focus-opacity(\n    mdc-states-opacity($color, focus) + $opacity-modifier,\n    $has-nested-focusable-element\n  );\n  @include mdc-states-press-opacity(mdc-states-opacity($color, press) + $opacity-modifier);\n}\n","//\n// Copyright 2016 Google Inc. All Rights Reserved.\n//\n// Licensed under the Apache License, Version 2.0 (the \"License\");\n// you may not use this file except in compliance with the License.\n// You may obtain a copy of the License at\n//\n//      http://www.apache.org/licenses/LICENSE-2.0\n//\n// Unless required by applicable law or agreed to in writing, software\n// distributed under the License is distributed on an \"AS IS\" BASIS,\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n// See the License for the specific language governing permissions and\n// limitations under the License.\n//\n\n$mdc-ripple-fade-in-duration: 75ms;\n$mdc-ripple-fade-out-duration: 150ms;\n$mdc-ripple-translate-duration: 225ms;\n$mdc-states-wash-duration: 15ms;\n\n$mdc-ripple-dark-ink-opacities: (\n  hover: .04,\n  focus: .12,\n  press: .16,\n  selected: .08,\n  activated: .12\n) !default;\n\n$mdc-ripple-light-ink-opacities: (\n  hover: .08,\n  focus: .24,\n  press: .32,\n  selected: .16,\n  activated: .24\n) !default;\n\n// Legacy\n\n$mdc-ripple-pressed-dark-ink-opacity: .16;\n$mdc-ripple-pressed-light-ink-opacity: .32;\n","//\n// Copyright 2017 Google Inc. All Rights Reserved.\n//\n// Licensed under the Apache License, Version 2.0 (the \"License\");\n// you may not use this file except in compliance with the License.\n// You may obtain a copy of the License at\n//\n//      http://www.apache.org/licenses/LICENSE-2.0\n//\n// Unless required by applicable law or agreed to in writing, software\n// distributed under the License is distributed on an \"AS IS\" BASIS,\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n// See the License for the specific language governing permissions and\n// limitations under the License.\n//\n\n// Creates a rule that will be applied when an MDC Web component is within the context of an RTL layout.\n//\n// Usage Example:\n// ```scss\n// .mdc-foo {\n//   position: absolute;\n//   left: 0;\n//\n//   @include mdc-rtl {\n//     left: auto;\n//     right: 0;\n//   }\n//\n//   &__bar {\n//     margin-left: 4px;\n//     @include mdc-rtl(\".mdc-foo\") {\n//       margin-left: auto;\n//       margin-right: 4px;\n//     }\n//   }\n// }\n//\n// .mdc-foo--mod {\n//   padding-left: 4px;\n//\n//   @include mdc-rtl {\n//     padding-left: auto;\n//     padding-right: 4px;\n//   }\n// }\n// ```\n//\n// Note that this works by checking for [dir=\"rtl\"] on an ancestor element. While this will work\n// in most cases, it will in some cases lead to false negatives, e.g.\n//\n// ```html\n// <html dir=\"rtl\">\n//   <!-- ... -->\n//   <div dir=\"ltr\">\n//     <div class=\"mdc-foo\">Styled incorrectly as RTL!</div>\n//   </div>\n// </html>\n// ```\n//\n// In the future, selectors such as :dir (http://mdn.io/:dir) will help us mitigate this.\n@mixin mdc-rtl($root-selector: null) {\n  @if ($root-selector) {\n    @at-root {\n      #{$root-selector}[dir=\"rtl\"] &,\n      [dir=\"rtl\"] #{$root-selector} & {\n        @content;\n      }\n    }\n  } @else {\n    [dir=\"rtl\"] &,\n    &[dir=\"rtl\"] {\n      @content;\n    }\n  }\n}\n\n// Takes a base box-model property - e.g. margin / border / padding - along with a default\n// direction and value, and emits rules which apply the value to the\n// \"<base-property>-<default-direction>\" property by default, but flips the direction\n// when within an RTL context.\n//\n// For example:\n//\n// ```scss\n// .mdc-foo {\n//   @include mdc-rtl-reflexive-box(margin, left, 8px);\n// }\n// ```\n// is equivalent to:\n//\n// ```scss\n// .mdc-foo {\n//   margin-left: 8px;\n//\n//   @include mdc-rtl {\n//     margin-right: 8px;\n//     margin-left: 0;\n//   }\n// }\n// ```\n// whereas:\n//\n// ```scss\n// .mdc-foo {\n//   @include mdc-rtl-reflexive-box(margin, right, 8px);\n// }\n// ```\n// is equivalent to:\n//\n// ```scss\n// .mdc-foo {\n//   margin-right: 8px;\n//\n//   @include mdc-rtl {\n//     margin-right: 0;\n//     margin-left: 8px;\n//   }\n// }\n// ```\n//\n// You can also pass a 4th optional $root-selector argument which will be forwarded to `mdc-rtl`,\n// e.g. `@include mdc-rtl-reflexive-box(margin, left, 8px, \".mdc-component\")`.\n//\n// Note that this function will always zero out the original value in an RTL context. If you're\n// trying to flip the values, use mdc-rtl-reflexive-property().\n@mixin mdc-rtl-reflexive-box($base-property, $default-direction, $value, $root-selector: null) {\n  @if (index((right, left), $default-direction) == null) {\n    @error \"Invalid default direction: '#{$default-direction}'. Please specifiy either 'right' or 'left'.\";\n  }\n\n  $left-value: $value;\n  $right-value: 0;\n\n  @if ($default-direction == right) {\n    $left-value: 0;\n    $right-value: $value;\n  }\n\n  @include mdc-rtl-reflexive-property($base-property, $left-value, $right-value, $root-selector);\n}\n\n// Takes a base property and emits rules that assign <base-property>-left to <left-value> and\n// <base-property>-right to <right-value> in a LTR context, and vice versa in a RTL context.\n// For example:\n//\n// ```scss\n// .mdc-foo {\n//   @include mdc-rtl-reflexive-property(margin, auto, 12px);\n// }\n// ```\n// is equivalent to:\n//\n// ```scss\n// .mdc-foo {\n//   margin-left: auto;\n//   margin-right: 12px;\n//\n//   @include mdc-rtl {\n//     margin-left: 12px;\n//     margin-right: auto;\n//   }\n// }\n// ```\n//\n// A 4th optional $root-selector argument can be given, which will be passed to `mdc-rtl`.\n@mixin mdc-rtl-reflexive-property($base-property, $left-value, $right-value, $root-selector: null) {\n  $prop-left: #{$base-property}-left;\n  $prop-right: #{$base-property}-right;\n\n  @include mdc-rtl-reflexive($prop-left, $left-value, $prop-right, $right-value, $root-selector);\n}\n\n// Takes an argument specifying a horizontal position property (either \"left\" or \"right\") as well\n// as a value, and applies that value to the specified position in a LTR context, and flips it in a\n// RTL context. For example:\n//\n// ```scss\n// .mdc-foo {\n//   @include mdc-rtl-reflexive-position(left, 0);\n//   position: absolute;\n// }\n// ```\n// is equivalent to:\n//\n// ```scss\n//  .mdc-foo {\n//    position: absolute;\n//    left: 0;\n//    right: initial;\n//\n//    @include mdc-rtl {\n//      right: 0;\n//      left: initial;\n//    }\n//  }\n// ```\n// An optional third $root-selector argument may also be given, which is passed to `mdc-rtl`.\n@mixin mdc-rtl-reflexive-position($position-property, $value, $root-selector: null) {\n  @if (index((right, left), $position-property) == null) {\n    @error \"Invalid position #{position-property}. Please specifiy either right or left\";\n  }\n\n  $left-value: $value;\n  $right-value: initial;\n\n  @if ($position-property == right) {\n    $right-value: $value;\n    $left-value: initial;\n  }\n\n  @include mdc-rtl-reflexive(left, $left-value, right, $right-value, $root-selector);\n}\n\n// Takes pair of properties with values as arguments and flips it in RTL context.\n// For example:\n//\n// ```scss\n// .mdc-foo {\n//   @include mdc-rtl-reflexive(left, 2px, right, 5px);\n//   position: absolute;\n//  }\n//  ```\n//  is equivalent to:\n//\n//  ```scss\n//  .mdc-foo {\n//    position: absolute;\n//    left: 2px;\n//    right: 5px;\n//\n//    @include mdc-rtl {\n//      right: 2px;\n//      left: 5px;\n//    }\n//  }\n//  ```\n// An optional fifth $root-selector argument may also be given, which is passed to `mdc-rtl`.\n@mixin mdc-rtl-reflexive(\n  $left-property,\n  $left-value,\n  $right-property,\n  $right-value,\n  $root-selector: null\n) {\n  /* @noflip */\n  #{$left-property}: $left-value;\n\n  /* @noflip */\n  #{$right-property}: $right-value;\n\n  @include mdc-rtl($root-selector) {\n    /* @noflip */\n    #{$left-property}: $right-value;\n\n    /* @noflip */\n    #{$right-property}: $left-value;\n  }\n}\n",".mdc-card {\n  background-color: #fff;\n  /* @alternate */\n  background-color: var(--mdc-theme-surface, #fff);\n  border-radius: 2px;\n  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);\n  display: flex;\n  flex-direction: column;\n  box-sizing: border-box; }\n\n.mdc-card--outlined {\n  box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.2), 0px 0px 0px 0px rgba(0, 0, 0, 0.14), 0px 0px 0px 0px rgba(0, 0, 0, 0.12);\n  border: 1px solid #e0e0e0; }\n\n.mdc-card__media {\n  position: relative;\n  box-sizing: border-box;\n  background-repeat: no-repeat;\n  background-position: center;\n  background-size: cover; }\n  .mdc-card__media::before {\n    display: block;\n    content: \"\"; }\n\n.mdc-card__media:first-child {\n  border-top-left-radius: inherit;\n  border-top-right-radius: inherit; }\n\n.mdc-card__media:last-child {\n  border-bottom-left-radius: inherit;\n  border-bottom-right-radius: inherit; }\n\n.mdc-card__media--square::before {\n  margin-top: 100%; }\n\n.mdc-card__media--16-9::before {\n  margin-top: 56.25%; }\n\n.mdc-card__media-content {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  box-sizing: border-box; }\n\n.mdc-card__primary-action {\n  --mdc-ripple-fg-size: 0;\n  --mdc-ripple-left: 0;\n  --mdc-ripple-top: 0;\n  --mdc-ripple-fg-scale: 1;\n  --mdc-ripple-fg-translate-end: 0;\n  --mdc-ripple-fg-translate-start: 0;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  will-change: transform, opacity;\n  display: flex;\n  flex-direction: column;\n  box-sizing: border-box;\n  position: relative;\n  outline: none;\n  color: inherit;\n  text-decoration: none;\n  cursor: pointer;\n  overflow: hidden; }\n  .mdc-card__primary-action::before, .mdc-card__primary-action::after {\n    position: absolute;\n    border-radius: 50%;\n    opacity: 0;\n    pointer-events: none;\n    content: \"\"; }\n  .mdc-card__primary-action::before {\n    transition: opacity 15ms linear;\n    z-index: 1; }\n  .mdc-card__primary-action.mdc-ripple-upgraded::before {\n    transform: scale(var(--mdc-ripple-fg-scale, 1)); }\n  .mdc-card__primary-action.mdc-ripple-upgraded::after {\n    top: 0;\n    /* @noflip */\n    left: 0;\n    transform: scale(0);\n    transform-origin: center center; }\n  .mdc-card__primary-action.mdc-ripple-upgraded--unbounded::after {\n    top: var(--mdc-ripple-top, 0);\n    /* @noflip */\n    left: var(--mdc-ripple-left, 0); }\n  .mdc-card__primary-action.mdc-ripple-upgraded--foreground-activation::after {\n    animation: 225ms mdc-ripple-fg-radius-in forwards, 75ms mdc-ripple-fg-opacity-in forwards; }\n  .mdc-card__primary-action.mdc-ripple-upgraded--foreground-deactivation::after {\n    animation: 150ms mdc-ripple-fg-opacity-out;\n    transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1)); }\n  .mdc-card__primary-action::before, .mdc-card__primary-action::after {\n    top: calc(50% - 100%);\n    /* @noflip */\n    left: calc(50% - 100%);\n    width: 200%;\n    height: 200%; }\n  .mdc-card__primary-action.mdc-ripple-upgraded::after {\n    width: var(--mdc-ripple-fg-size, 100%);\n    height: var(--mdc-ripple-fg-size, 100%); }\n  .mdc-card__primary-action::before, .mdc-card__primary-action::after {\n    background-color: black; }\n  .mdc-card__primary-action:hover::before {\n    opacity: 0.04; }\n  .mdc-card__primary-action:not(.mdc-ripple-upgraded):focus::before, .mdc-card__primary-action.mdc-ripple-upgraded--background-focused::before {\n    transition-duration: 75ms;\n    opacity: 0.12; }\n  .mdc-card__primary-action:not(.mdc-ripple-upgraded)::after {\n    transition: opacity 150ms linear; }\n  .mdc-card__primary-action:not(.mdc-ripple-upgraded):active::after {\n    transition-duration: 75ms;\n    opacity: 0.16; }\n  .mdc-card__primary-action.mdc-ripple-upgraded {\n    --mdc-ripple-fg-opacity: 0.16; }\n\n.mdc-card__primary-action:first-child {\n  border-top-left-radius: inherit;\n  border-top-right-radius: inherit; }\n\n.mdc-card__primary-action:last-child {\n  border-bottom-left-radius: inherit;\n  border-bottom-right-radius: inherit; }\n\n.mdc-card__actions {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  box-sizing: border-box;\n  min-height: 52px;\n  padding: 8px; }\n\n.mdc-card__actions--full-bleed {\n  padding: 0; }\n\n.mdc-card__action-buttons,\n.mdc-card__action-icons {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  box-sizing: border-box; }\n\n.mdc-card__action-icons {\n  color: rgba(0, 0, 0, 0.38);\n  /* @alternate */\n  color: var(--mdc-theme-text-icon-on-background, rgba(0, 0, 0, 0.38));\n  flex-grow: 1;\n  justify-content: flex-end; }\n\n.mdc-card__action-buttons + .mdc-card__action-icons {\n  /* @noflip */\n  margin-left: 16px;\n  /* @noflip */\n  margin-right: 0; }\n  [dir=\"rtl\"] .mdc-card__action-buttons + .mdc-card__action-icons, .mdc-card__action-buttons + .mdc-card__action-icons[dir=\"rtl\"] {\n    /* @noflip */\n    margin-left: 0;\n    /* @noflip */\n    margin-right: 16px; }\n\n.mdc-card__action {\n  display: inline-flex;\n  flex-direction: row;\n  align-items: center;\n  box-sizing: border-box;\n  justify-content: center;\n  cursor: pointer;\n  user-select: none; }\n  .mdc-card__action:focus {\n    outline: none; }\n\n.mdc-card__action--button {\n  /* @noflip */\n  margin-left: 0;\n  /* @noflip */\n  margin-right: 8px;\n  padding: 0 8px; }\n  [dir=\"rtl\"] .mdc-card__action--button, .mdc-card__action--button[dir=\"rtl\"] {\n    /* @noflip */\n    margin-left: 8px;\n    /* @noflip */\n    margin-right: 0; }\n  .mdc-card__action--button:last-child {\n    /* @noflip */\n    margin-left: 0;\n    /* @noflip */\n    margin-right: 0; }\n    [dir=\"rtl\"] .mdc-card__action--button:last-child, .mdc-card__action--button:last-child[dir=\"rtl\"] {\n      /* @noflip */\n      margin-left: 0;\n      /* @noflip */\n      margin-right: 0; }\n\n.mdc-card__actions--full-bleed .mdc-card__action--button {\n  justify-content: space-between;\n  width: 100%;\n  height: auto;\n  max-height: none;\n  margin: 0;\n  padding: 8px 16px;\n  text-align: left; }\n  [dir=\"rtl\"] .mdc-card__actions--full-bleed .mdc-card__action--button, .mdc-card__actions--full-bleed .mdc-card__action--button[dir=\"rtl\"] {\n    text-align: right; }\n\n.mdc-card__action--icon {\n  margin: -6px 0;\n  padding: 12px; }\n\n.mdc-card__action--icon:not(:disabled) {\n  color: rgba(0, 0, 0, 0.38);\n  /* @alternate */\n  color: var(--mdc-theme-text-icon-on-background, rgba(0, 0, 0, 0.38)); }\n\n.example-form .txt {\n  color: #ff0000; }\n","@import \"@material/card/mdc-card\";\n\n.example-form {\n  .txt {\n    color: #ff0000;\n  }\n}"],"sourceRoot":""}]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/lib/css-base.js":
/*!*************************************************!*\
  !*** ./node_modules/css-loader/lib/css-base.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js??ref--4-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sass-loader/lib/loader.js??ref--4-2!./src/example-form.component.scss?vue&type=style&index=0&id=957945c8&lang=scss&scoped=true":
/*!******************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader??ref--4-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sass-loader/lib/loader.js??ref--4-2!./src/example-form.component.scss?vue&type=style&index=0&id=957945c8&lang=scss&scoped=true ***!
  \******************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../node_modules/css-loader??ref--4-1!../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../node_modules/sass-loader/lib/loader.js??ref--4-2!./example-form.component.scss?vue&type=style&index=0&id=957945c8&lang=scss&scoped=true */ "./node_modules/css-loader/index.js??ref--4-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sass-loader/lib/loader.js??ref--4-2!./src/example-form.component.scss?vue&type=style&index=0&id=957945c8&lang=scss&scoped=true");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./node_modules/style-loader/lib/addStyles.js":
/*!****************************************************!*\
  !*** ./node_modules/style-loader/lib/addStyles.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target) {
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(/*! ./urls */ "./node_modules/style-loader/lib/urls.js");

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),

/***/ "./node_modules/style-loader/lib/urls.js":
/*!***********************************************!*\
  !*** ./node_modules/style-loader/lib/urls.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),

/***/ "./node_modules/ts-loader/index.js??ref--1!./src/example-form.component.ts?vue&type=script&lang=ts":
/*!************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--1!./src/example-form.component.ts?vue&type=script&lang=ts ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var vue_property_decorator_1 = __webpack_require__(/*! vue-property-decorator */ "./node_modules/vue-property-decorator/lib/vue-property-decorator.js");
var ExampleFormComponent = /** @class */ (function (_super) {
    __extends(ExampleFormComponent, _super);
    function ExampleFormComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ExampleFormComponent = __decorate([
        vue_property_decorator_1.Component
    ], ExampleFormComponent);
    return ExampleFormComponent;
}(vue_property_decorator_1.Vue));
exports.default = ExampleFormComponent;


/***/ }),

/***/ "./node_modules/vue-class-component/dist/vue-class-component.common.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/vue-class-component/dist/vue-class-component.common.js ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
  * vue-class-component v6.2.0
  * (c) 2015-present Evan You
  * @license MIT
  */


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Vue = _interopDefault(__webpack_require__(/*! vue */ "vue"));

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
function warn(message) {
    if (typeof console !== 'undefined') {
        console.warn('[vue-class-component] ' + message);
    }
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
    if (true) {
        if (!(Component.prototype instanceof Vue) && Object.keys(plainData).length > 0) {
            warn('Component class must inherit Vue or its descendant class ' +
                'when class property is used.');
        }
    }
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
var reservedPropertyNames = [
    // Unique id
    'cid',
    // Super Vue constructor
    'super',
    // Component options that will be used by the component
    'options',
    'superOptions',
    'extendOptions',
    'sealedOptions',
    // Private assets
    'component',
    'directive',
    'filter'
];
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
        // Warn if the users manually declare reserved properties
        if ("development" !== 'production'
            && reservedPropertyNames.indexOf(key) >= 0) {
            warn("Static property name '" + key + "' declared on class '" + Original.name + "' " +
                'conflicts with reserved property name of Vue internal. ' +
                'It may cause unexpected behavior of the component. Consider renaming the property.');
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


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/example-form.component.vue?vue&type=template&id=957945c8&scoped=true":
/*!****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/example-form.component.vue?vue&type=template&id=957945c8&scoped=true ***!
  \****************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _vm._m(0)
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "example-form" }, [
      _c("p", { staticClass: "txt" }, [_vm._v("It Works!!!")]),
      _vm._v(" "),
      _c("div", { staticClass: "mdc-card" }, [_vm._v("\n    Simple\n  ")])
    ])
  }
]
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js":
/*!********************************************************************!*\
  !*** ./node_modules/vue-loader/lib/runtime/componentNormalizer.js ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),

/***/ "./node_modules/vue-property-decorator/lib/vue-property-decorator.js":
/*!***************************************************************************!*\
  !*** ./node_modules/vue-property-decorator/lib/vue-property-decorator.js ***!
  \***************************************************************************/
/*! exports provided: Component, Vue, Mixins, Inject, Provide, Model, Prop, Watch, Emit */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Inject", function() { return Inject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Provide", function() { return Provide; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Model", function() { return Model; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Prop", function() { return Prop; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Watch", function() { return Watch; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Emit", function() { return Emit; });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "vue");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vue__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (default from non-harmony) */ __webpack_require__.d(__webpack_exports__, "Vue", function() { return vue__WEBPACK_IMPORTED_MODULE_0___default.a; });
/* harmony import */ var vue_class_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-class-component */ "./node_modules/vue-class-component/dist/vue-class-component.common.js");
/* harmony import */ var vue_class_component__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(vue_class_component__WEBPACK_IMPORTED_MODULE_1__);
/* harmony reexport (default from non-harmony) */ __webpack_require__.d(__webpack_exports__, "Component", function() { return vue_class_component__WEBPACK_IMPORTED_MODULE_1___default.a; });
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Mixins", function() { return vue_class_component__WEBPACK_IMPORTED_MODULE_1__["mixins"]; });

/** vue-property-decorator verson 7.0.0 MIT LICENSE copyright 2018 kaorun343 */




/**
 * decorator of an inject
 * @param from key
 * @return PropertyDecorator
 */
function Inject(options) {
    return Object(vue_class_component__WEBPACK_IMPORTED_MODULE_1__["createDecorator"])(function (componentOptions, key) {
        if (typeof componentOptions.inject === 'undefined') {
            componentOptions.inject = {};
        }
        if (!Array.isArray(componentOptions.inject)) {
            componentOptions.inject[key] = options || key;
        }
    });
}
/**
 * decorator of a provide
 * @param key key
 * @return PropertyDecorator | void
 */
function Provide(key) {
    return Object(vue_class_component__WEBPACK_IMPORTED_MODULE_1__["createDecorator"])(function (componentOptions, k) {
        var provide = componentOptions.provide;
        if (typeof provide !== 'function' || !provide.managed) {
            var original_1 = componentOptions.provide;
            provide = componentOptions.provide = function () {
                var rv = Object.create((typeof original_1 === 'function' ? original_1.call(this) : original_1) || null);
                for (var i in provide.managed)
                    rv[provide.managed[i]] = this[i];
                return rv;
            };
            provide.managed = {};
        }
        provide.managed[k] = key || k;
    });
}
/**
 * decorator of model
 * @param  event event name
 * @param options options
 * @return PropertyDecorator
 */
function Model(event, options) {
    if (options === void 0) { options = {}; }
    return Object(vue_class_component__WEBPACK_IMPORTED_MODULE_1__["createDecorator"])(function (componentOptions, k) {
        (componentOptions.props || (componentOptions.props = {}))[k] = options;
        componentOptions.model = { prop: k, event: event || k };
    });
}
/**
 * decorator of a prop
 * @param  options the options for the prop
 * @return PropertyDecorator | void
 */
function Prop(options) {
    if (options === void 0) { options = {}; }
    return Object(vue_class_component__WEBPACK_IMPORTED_MODULE_1__["createDecorator"])(function (componentOptions, k) {
        (componentOptions.props || (componentOptions.props = {}))[k] = options;
    });
}
/**
 * decorator of a watch function
 * @param  path the path or the expression to observe
 * @param  WatchOption
 * @return MethodDecorator
 */
function Watch(path, options) {
    if (options === void 0) { options = {}; }
    var _a = options.deep, deep = _a === void 0 ? false : _a, _b = options.immediate, immediate = _b === void 0 ? false : _b;
    return Object(vue_class_component__WEBPACK_IMPORTED_MODULE_1__["createDecorator"])(function (componentOptions, handler) {
        if (typeof componentOptions.watch !== 'object') {
            componentOptions.watch = Object.create(null);
        }
        componentOptions.watch[path] = { handler: handler, deep: deep, immediate: immediate };
    });
}
// Code copied from Vue/src/shared/util.js
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = function (str) { return str.replace(hyphenateRE, '-$1').toLowerCase(); };
/**
 * decorator of an event-emitter function
 * @param  event The name of the event
 * @return MethodDecorator
 */
function Emit(event) {
    return function (target, key, descriptor) {
        key = hyphenate(key);
        var original = descriptor.value;
        descriptor.value = function emitter() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (original.apply(this, args) !== false)
                this.$emit.apply(this, [event || key].concat(args));
        };
    };
}


/***/ }),

/***/ "./src/example-form.component.scss?vue&type=style&index=0&id=957945c8&lang=scss&scoped=true":
/*!**************************************************************************************************!*\
  !*** ./src/example-form.component.scss?vue&type=style&index=0&id=957945c8&lang=scss&scoped=true ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_4_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_lib_loader_js_ref_4_2_example_form_component_scss_vue_type_style_index_0_id_957945c8_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../node_modules/style-loader!../node_modules/css-loader??ref--4-1!../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../node_modules/sass-loader/lib/loader.js??ref--4-2!./example-form.component.scss?vue&type=style&index=0&id=957945c8&lang=scss&scoped=true */ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js??ref--4-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sass-loader/lib/loader.js??ref--4-2!./src/example-form.component.scss?vue&type=style&index=0&id=957945c8&lang=scss&scoped=true");
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_4_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_lib_loader_js_ref_4_2_example_form_component_scss_vue_type_style_index_0_id_957945c8_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_4_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_lib_loader_js_ref_4_2_example_form_component_scss_vue_type_style_index_0_id_957945c8_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_4_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_lib_loader_js_ref_4_2_example_form_component_scss_vue_type_style_index_0_id_957945c8_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_4_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_lib_loader_js_ref_4_2_example_form_component_scss_vue_type_style_index_0_id_957945c8_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_4_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_lib_loader_js_ref_4_2_example_form_component_scss_vue_type_style_index_0_id_957945c8_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./src/example-form.component.ts?vue&type=script&lang=ts":
/*!***************************************************************!*\
  !*** ./src/example-form.component.ts?vue&type=script&lang=ts ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_1_example_form_component_ts_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../node_modules/ts-loader??ref--1!./example-form.component.ts?vue&type=script&lang=ts */ "./node_modules/ts-loader/index.js??ref--1!./src/example-form.component.ts?vue&type=script&lang=ts");
/* harmony import */ var _node_modules_ts_loader_index_js_ref_1_example_form_component_ts_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_ts_loader_index_js_ref_1_example_form_component_ts_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_ts_loader_index_js_ref_1_example_form_component_ts_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_ts_loader_index_js_ref_1_example_form_component_ts_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_1_example_form_component_ts_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./src/example-form.component.vue":
/*!****************************************!*\
  !*** ./src/example-form.component.vue ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _example_form_component_vue_vue_type_template_id_957945c8_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./example-form.component.vue?vue&type=template&id=957945c8&scoped=true */ "./src/example-form.component.vue?vue&type=template&id=957945c8&scoped=true");
/* harmony import */ var _example_form_component_ts_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./example-form.component.ts?vue&type=script&lang=ts */ "./src/example-form.component.ts?vue&type=script&lang=ts");
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _example_form_component_ts_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _example_form_component_ts_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _example_form_component_scss_vue_type_style_index_0_id_957945c8_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./example-form.component.scss?vue&type=style&index=0&id=957945c8&lang=scss&scoped=true */ "./src/example-form.component.scss?vue&type=style&index=0&id=957945c8&lang=scss&scoped=true");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _example_form_component_ts_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__["default"],
  _example_form_component_vue_vue_type_template_id_957945c8_scoped_true__WEBPACK_IMPORTED_MODULE_0__["render"],
  _example_form_component_vue_vue_type_template_id_957945c8_scoped_true__WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "957945c8",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src\\example-form.component.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/example-form.component.vue?vue&type=template&id=957945c8&scoped=true":
/*!**********************************************************************************!*\
  !*** ./src/example-form.component.vue?vue&type=template&id=957945c8&scoped=true ***!
  \**********************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_example_form_component_vue_vue_type_template_id_957945c8_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../node_modules/vue-loader/lib??vue-loader-options!./example-form.component.vue?vue&type=template&id=957945c8&scoped=true */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/example-form.component.vue?vue&type=template&id=957945c8&scoped=true");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_example_form_component_vue_vue_type_template_id_957945c8_scoped_true__WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_example_form_component_vue_vue_type_template_id_957945c8_scoped_true__WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(/*! ./polyfills */ "./src/polyfills.ts");
var vue_property_decorator_1 = __webpack_require__(/*! vue-property-decorator */ "./node_modules/vue-property-decorator/lib/vue-property-decorator.js");
var example_form_component_vue_1 = __webpack_require__(/*! ./example-form.component.vue */ "./src/example-form.component.vue");
var comp = new example_form_component_vue_1.default();
var loadComponent = function () {
    vue_property_decorator_1.Vue.customElement('example-form', comp.$options);
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
            loadComponent();
        };
        document.getElementsByTagName("head")[0].appendChild(fileref);
    }
    else {
        throw new Error('customElements is not supported, please use the ' +
            'document-register-element polyfill');
    }
}
else {
    loadComponent();
}


/***/ }),

/***/ "./src/polyfills.ts":
/*!**************************!*\
  !*** ./src/polyfills.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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


/***/ }),

/***/ "vue":
/*!******************************************************************************!*\
  !*** external {"commonjs":"vue","commonjs2":"vue","amd":"vue","root":"Vue"} ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_vue__;

/***/ })

/******/ });
});
//# sourceMappingURL=example-form.wc.js.map
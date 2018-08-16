import "./polyfills";
import { Vue } from "vue-property-decorator";
import VueCustomElement from 'vue-custom-element';

import "./main.scss";

// bootstrap dependency
import "jquery/dist/jquery.slim.js";
import "popper.js";
import "bootstrap";
// You could import bootstrap scss here, or in the main.scss file. Its better
// in the main.scss file as you can override styling
// import "bootstrap/scss/bootstrap.scss";

import ExampleFormComponent from './example-form.component.vue';
import { COMPONENT_NAME } from './example-form.component';
const component: any = ExampleFormComponent;
Vue.use(VueCustomElement);

/**
 * Load the web component
 *
 */
const loadWebComponent = () => {
  let element: any;
  // for some reason rollupjs plugin rollup-plugin-vue does not output the 
  // same as webpack, so the component is inside a property called components
  if(component['components']) {
    let c = new component['components'][COMPONENT_NAME]();
    element = Vue.customElement(COMPONENT_NAME, c.$options);
  } else {
    // handle webpack build
    let c = new component();
    element = Vue.customElement(COMPONENT_NAME, c.$options);
  }
  // create your own custom methods on the custum element
  element.prototype.passData = function(data) {
    this.getVueInstance().passData(data);
  };
};


// check if customElements is supported, if not, we need to download the 
// polyfill
if(!window.customElements || !window.customElements.define
|| !window.customElements.get || !window.customElements.whenDefined) {
  if(window.documentRegisterElementScriptPath) {
    // customElements not natively supported, we have to download the polyfill
    const fileref = document.createElement('script');
    fileref.setAttribute("type","text/javascript");
    fileref.setAttribute("src", window.documentRegisterElementScriptPath);
    fileref.onload = function() {
      loadWebComponent();
    };
    document.getElementsByTagName("head")[0].appendChild(fileref);
  } else {
    throw new Error('customElements is not supported, please use the ' +
    'document-register-element polyfill');
  }
} else {
  loadWebComponent();
}




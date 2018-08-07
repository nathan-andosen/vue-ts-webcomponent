import "./polyfills";
import { Vue } from "vue-property-decorator";
import VueCustomElement from 'vue-custom-element';
// require('bootstrap');
import "jquery/dist/jquery.slim.js";
import "popper.js";
import "bootstrap";

import ExampleFormComponent from './example-form.component.vue';
const component: any = ExampleFormComponent;
const componentName = 'example-form';
Vue.use(VueCustomElement);

/**
 * Load the web component
 *
 */
const loadWebComponent = () => {
  // for some reason rollupjs plugin rollup-plugin-vue does not output the 
  // same as webpack, so the component is inside a property called components
  if(component['components']) {
    let c = new component['components'].ExampleFormComponent();
    Vue.customElement(componentName, c.$options);
  } else {
    // handle webpack build
    let c = new component();
    Vue.customElement(componentName, c.$options);
  }
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




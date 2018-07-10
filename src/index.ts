import { Vue } from "vue-property-decorator";
import ExampleFormComponent from './example-form.component.vue';
let comp = new ExampleFormComponent();

const loadComponent = () => {
  Vue.customElement('example-form', comp.$options);
};

// check if customElements is supported, if not, we need to download the 
// polyfill
if(!window.customElements || !window.customElements.define
|| !window.customElements.get || !window.customElements.whenDefined) {
  if(window.documentRegisterElementScriptPath) {
    // customElements not natively supported, we have to download the polyfill
    var fileref = document.createElement('script');
    fileref.setAttribute("type","text/javascript");
    fileref.setAttribute("src", window.documentRegisterElementScriptPath);
    fileref.onload = function() {
      loadComponent();
    };
    document.getElementsByTagName("head")[0].appendChild(fileref);
  } else {
    throw new Error('customElements is not supported, please use the ' +
    'document-register-element polyfill');
  }
} else {
  loadComponent();
}




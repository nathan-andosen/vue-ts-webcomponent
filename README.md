
# Vue typescript web component

Seed app / example component to build a custom element web component using Typescript, Scss and Vue.js.

## Dependencies

* Vue.js - https://vuejs.org/
* vue-custom-element - https://github.com/karol-f/vue-custom-element
  * Used to create the custom element with IE11 support
  * You could use the offical component wrapper - https://github.com/vuejs/vue-web-component-wrapper
* vue-property-decorator - https://github.com/kaorun343/vue-property-decorator
* document-register-element - https://github.com/WebReflection/document-register-element
  * Polyfill, only downloaded if required.

## Features:

* Uses RollupJs to create different builds:
  * __.bundle.umd.min.js__ - UMD build that includes all dependencies (In this example seed app, we also use bootstrap, which is completely optional)
  * __.umd.min.js__ - UMD build excluding dependencies
  * __.esm.js__ - ES Module build to be used with a module bundler like webpack
* All assets are included into the one js file
  * css is injected into the head element as a style tag
  * font icons are base64 encoded into the css
  * images inside css are base64 encoded
  * ability to import css files from node_modules
* Code is written in Typescript
* Vue.js is used for ease of development
* Development process made easy, uses file watching and live reloading
* Icomoon is used for font icons - https://icomoon.io/
* Comprehensive seed app / example, this includes examples of how to do the following:
  * Include a third party library like Bootstrap 4 into the component
  * Use font icons
  * Ability to pass data to the custom element via attributes, properties or functions
  * Ability to listen to custom events being fired by the custom element
  * Use Typescript with Vue.js and vue-property-decorated

# Use cases:

_How to use the custom element component in different apps with different frameworks._

__IMPORTANT:__ In all use cases, you need to set the _documentRegisterElementScriptPath_ to the path where the polyfill can be found, example below:

```javascript
<script type="text/javascript">
  // incase the browser does not support custom elements, we need to know
  // where we can download the polyfill from
  window.documentRegisterElementScriptPath = './polyfills/document-register-element.js';
</script>
```

## Static script tag

You can use the component by simply include the js file in your html page via a script tag. Refer to the index .html files in the _/build_ directory for examples.

Simple the js file into your html page and use the custom element as you wish, example below:

```html
<!doctype html>
<html>
  <head>
    <script type="text/javascript">
      window.documentRegisterElementScriptPath = './polyfills/document-register-element.js';
    </script>
    <script src="./dist/firebase-chat.bundle.umd.min.js"></script>
  </head>
  <body>
    <!-- Use our custom element -->
    <example-form></example-form>
  </body>
</html>
```

## Angular

To use the custom element in Angular 2+, we need to tell Angular that we are using custom elements.

```javascript
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// simple import our custom element here which should have been installed
// via npm module
import "vue-ts-webcomponent";

@NgModule({
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule {}
```

# Development

__Starting a new web component:__

* Clone the repo
* Run ``npm install``
* Now you will want to change the name of the component, this will need to be done in a few places:
  * Change the file names under the directory _/src_
  * You will also need to update file url's and component names in the source files
  * Update the index .html files in the _/build_ directory. These are used for development, so you can change these to your needs.
  * Update the componentName in the _/config/rollup.config.js_ file.
  * Also update the package file properties: _name_, _main_ and _module_.
* You should be good to go, refer to the commands below.

__Commands:__

``npm run dev`` - Run this command when development on the component. It will start a server on http://localhost:9001/ and reload the server on any file changes.

``npm run build`` - Will build the distribution files.

# Known Issues:

1. Can not use cssnano to minify css injected into the head element. It gives
an asnyc error (Use process(css).then(cb) to work with async plugins).

2. Can not set an img in the html and expect the src to change to base64. This
only happens with images set in css.



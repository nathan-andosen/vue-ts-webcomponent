
# (Work in progress) Vue typescript webcomponent

Seed app to build a web component using typescript and VueJs.

# Currently working on:

* Create the web component that will contain:
  * Events that are fired externally
  * Font icons and an image
  * Another vue component
  * Use external css framework like material design??

# Tasks / Functionality required

* One JS file that contains all code (css, font icons, images and javascript)
* One build that outputs different formats.
  * Need a umd build, so it can be used directly in the browser or via npm, it 
  will include all dependencies expect vuejs
  * A umd build that excludes all the dependencies as they are peer dependencies
* Build as web component using vue-custom-element (so we have support for IE11)
* Scoped css
* Give examples of how to use with external events and functions
* Should be able to use other .vue components inside this component
* Give examples of using this component in the following scenarios:
  * Inside another VueJs application (using npm)
  * Inside an Angular application
  * Inside a static application with no js libraries (no npm)
* Unit tests and e2e tests
* How to use an external library like material design or bootstrap


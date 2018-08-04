
# (Work in progress) Vue typescript webcomponent

Seed app to build a web component using typescript and VueJs.

# Currently working on:

* Create the web component that will contain:
  * Events that are fired externally
  * Font icons and an image
  * Another vue component
  * Use external css framework like material design??

# Tasks / Functionality required

* (DONE) Setup a nice dev workflow
  * Uses grunt with livereload and starts an express server
* (DONE) One JS file that contains all code (css, font icons, images and javascript)
* (DONE) One build that outputs different formats.
  * UMD build with all code (including vuejs frameowrk)
  * UMD build without vuejs & vue-custom-element
  * ES build to be used in apps that are using another module bundler
* (DONE) Build as web component using vue-custom-element (so we have support for IE11)
* (DONE) Scoped css
* Give examples of how to use with external events and functions
* Should be able to use other .vue components inside this component
* Give examples of using this component in the following scenarios:
  * Inside another VueJs application (using npm)
  * Inside an Angular application
  * Inside a static application with no js libraries (no npm)
* Unit tests and e2e tests
* (DONE) How to use an external library like material design



# Size of component

* __Initial size:__ 15kb min
  * Bare bones, only displays simple text
* __Full component:__ ??kb min
  * Includes css framework (material design)
  * Some font icons

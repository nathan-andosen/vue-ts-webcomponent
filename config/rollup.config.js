import vue from 'rollup-plugin-vue';
import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import buble from 'rollup-plugin-buble';
import replace from 'rollup-plugin-replace';
import { uglify } from 'rollup-plugin-uglify';
import postcssUrl from 'postcss-url';
import postcssUrlEncode from 'postcss-url/src/lib/encode';
const fs = require('fs');
const klawSync = require('klaw-sync');
const mime = require('mime');
const path = require('path');
const isProd = (process.env.NODE_ENV === 'prod') ? true : false;

const moduleName = 'example-form';

/**
 * Encode a file url into base64
 *
 * @param {*} filePath
 * @returns
 */
const encodeUrl = function(filePath) {
  const file = fs.readFileSync(filePath);
  return postcssUrlEncode({
    path: filePath,
    contents: file,
    mimeType: mime.lookup(filePath)
  }, 'base64');
};


/**
 * Check if a file exists in a directory, if yes, return its base64 value
 *
 * @param {*} dirPath
 * @param {*} assetUrl
 * @returns
 */
const checkFileExists = function(dirPath, assetUrl) {
  var filePath = path.join(dirPath, assetUrl);
  // some file paths might have a query parameter at the end, lets remove it
  if(filePath.indexOf('?') > -1)
    filePath = filePath.substring(0, filePath.indexOf('?'));
  if(fs.existsSync(filePath)) {
    return encodeUrl(filePath);
  }
  return false;
};


/**
 * Handle the postcssUrl plugin callback to encode file path urls to base64
 * 
 * @returns
 */
const encodeUrlHandler = function(asset, dir, options, decl, warn, result) {
  // console.log(asset);
  if(fs.existsSync(asset.absolutePath)) {
    return encodeUrl(asset.absolutePath);
  } else if (options.basePath){
    for(var i = 0; i < options.basePath.length; i++) {
      const baseDir = path.join(process.cwd(), options.basePath[i]);
      const res = checkFileExists(baseDir, asset.url);
      if(res !== false) return res;
      const dirs = klawSync(baseDir, {nofile: true});
      // lets iterate each directory under the base path and see if we can find our file
      for(var j = 0; j < dirs.length; j++) {
        const res = checkFileExists(dirs[j].path, asset.url);
        if(res !== false) return res;
      }
    }
  }
};


// common rollup plugins
let rollupPlugins = [
  typescript({
    typescript: require('typescript'),
  }),
  vue({
    css: true,
    style: {
      preprocessOptions: {
        scss: {
          includePaths: ['node_modules']
        }
      },
      postcssPlugins: [
        postcssUrl({
          basePath: [
            './src',
            
            // if you have any node_modules that have css that include font or
            // image urls, add the node_module directory here
            // './node_modules/aaa'
          ],
          url: function(asset, dir, options, decl, warn, result) {
            return encodeUrlHandler(asset, dir, options, decl, warn, result);
          }
        })
      ]
    }
  }),
  resolve(),
  commonjs(),
  replace({
    'process.env.NODE_ENV': JSON.stringify( 'production' )
  })
];


// DEV BUILD
let devBuild = {
  input: 'src/index.ts',
  output: {
    file: 'build/dist/' + moduleName + '.dev.js',
    format: 'umd',
    sourcemap: true
  },
  plugins: rollupPlugins
};

// PROD UMD BUILD ALL
let prodBuildAll = {
  input: 'src/index.ts',
  output: {
    file: 'build/dist/' + moduleName + '.umd.min.js',
    format: 'umd'
  },
  plugins: rollupPlugins.concat([
    buble(),
    uglify()
  ])
};

// PROD UMD BUILD NO VUE
let prodBuildNoVue = {
  input: 'src/index.ts',
  output: {
    file: 'build/dist/' + moduleName + '.umd.novue.min.js',
    format: 'umd',
    globals: {
      'vue': 'Vue',
      'vue-custom-element': 'VueCustomElement'
    }
  },
  external: [
    'vue',
    'vue-custom-element'
  ],
  plugins: rollupPlugins.concat([
    buble(),
    // uglify()
  ])
};

// PROD BUILD ESM
let prodBuildEsm = {
  input: 'src/index.ts',
  output: {
    file: 'build/dist/' + moduleName + '.esm.js',
    format: 'esm',
    globals: {
      'vue': 'Vue',
      'vue-custom-element': 'VueCustomElement'
    }
  },
  external: [
    'vue',
    'vue-custom-element'
  ],
  plugins: rollupPlugins
};




let exportBuilds = [];
if(isProd) {
  exportBuilds = [
    prodBuildAll,
    prodBuildNoVue,
    prodBuildEsm
  ];
} else {
  // dev build
  exportBuilds = [
    devBuild 
  ];
}


// export the configs for rollup
export default exportBuilds;
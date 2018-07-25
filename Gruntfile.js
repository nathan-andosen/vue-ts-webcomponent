var isWindows = (process.platform === "win32");
var bashCmd = (isWindows) ? 'bash ' : '';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-exec');

  var init = {};

  // execute bash commands
  init.exec = {

  };

  // watch tasks
  init.watch = {
    dev: {
      files : [
        "src/**/*.ts"
      ],
      tasks : ["builddev"]
    }
  };

  grunt.initConfig(init);

  // our grunt commands
  grunt.registerTask("builddev", []);
  grunt.registerTask("dev", ["builddev", "watch:dev"]);
};
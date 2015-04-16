'use strict';

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt); // Load grunt tasks automatically

  var jsFiles = ['Gruntfile.js', 'tasks/*.js', 'test/**/*.js'];

  // Define the configuration for all the tasks
  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: true
      },
      all: jsFiles
    },

    jscs: {
      options: {
        config: '.jscsrc'
      },
      src: jsFiles
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      options: {
        // we don't want to lose the environment
        spawn: false
      },
      gruntfile: {
        files: ['Gruntfile.js']
        // no tasks, this automatically triggers a watch restart
      },
      js: {
        files: jsFiles,
        tasks: ['test']
      }
    },

    maildev: {
      run: {
        options: {
          httpPort: 1980,
          open: true,
          onNewMail: function(email) {console.log(email);}
        },
        keepAlive: true
      },
      relay: {
        options: {
          relay: {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            user: 'you@gmail.com',
            pass: 'your secret password'
          },
          keepAlive: true,
          open: true
        }
      },
      fail: {
        options: {
          onNewMail: 'rasdr'
        }
      }
    }
  });

  grunt.loadTasks('tasks');

  grunt.registerTask('build', [
    //'clean:stage',
    //'copy',
    //'compile',
    //'patch',
    //'symlink',
  ]);

  grunt.registerTask('test', [
    'jshint',
    'jscs'
  ]);

  grunt.registerTask('serve', [
    'watch'
  ]);

  grunt.registerTask('default', [
    'build',
    'test',
    'serve'
  ]);
};

'use strict';

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt); // Load grunt tasks automatically
  var semver = require('semver');

  var jsFiles = ['Gruntfile.js', 'tasks/*.js', 'test/**/*.js'];
  var currentVersion = grunt.file.readJSON('package.json').version;

  // Define the configuration for all the tasks
  grunt.initConfig({
    bump: {
      options: {
        pushTo: 'origin',
        tagName: '%VERSION%',
      }
    },

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

    maildev: {
      run: {
        options: {
          http: {
            port: 1980
          },
          onNewMail: function(email) {console.log(email);}
        },
        keepAlive: true,
        open: true
      },
      relay: {
        options: {
          smtp: {
            relay: {
              host: 'smtp.gmail.com',
              port: 465,
              secure: true,
              user: 'you@gmail.com',
              pass: 'your secret password'
            },
          },
          keepAlive: true,
          open: true
        }
      },
      fail: {
        options: {
          onNewMail: 'rasdr'
        }
      },
      http: {
        options: {
          http: {
            address: '0.0.0.0',
            port: 8880,
            user: 'user',
            password: 'secret',
          }
        }
      },
      test: {
        onNewMail: function(email) {console.log(email);},
        options: {
          smtp: {
            port: 1625
          },
          http: {
            port: 1680
          }
        }
      }
    },

    prompt: {
      bump: {
        options: {
          questions: [
            {
              config:  'bump.options.setVersion',
              type:    'list',
              message: 'Bump version from ' + currentVersion.cyan + ' to:',
              choices: [
                {
                  value: semver.inc(currentVersion, 'patch'),
                  // name:  'Patch:  '.yellow + semver.inc('<%= pkg.version %>', 'patch').yellow +
                  name:  ('Patch:  ' + semver.inc(currentVersion, 'patch')).yellow +
                    '   Backwards-compatible bug fixes.'
                },
                {
                  value: semver.inc(currentVersion, 'minor'),
                  name:  ('Minor:  ' + semver.inc(currentVersion, 'minor')).yellow +
                    '   Add functionality in a backwards-compatible manner.'
                },
                {
                  value: semver.inc(currentVersion, 'major'),
                  name:  ('Major:  ' + semver.inc(currentVersion, 'major')).yellow +
                    '   Incompatible API changes.'
                },
                {
                  value: 'custom',
                  name:  'Custom: ?.?.?'.yellow +
                    '   Specify version...'
                }
              ]
            },
            {
              config:   'bump.options.setVersion',
              type:     'input',
              message:  'What specific version would you like',
              when:     function(answers) {
                return answers['bump.increment'] === 'custom';
              },
              validate: function(value) {
                var valid = semver.valid(value) && true;
                return valid || 'Must be a valid semver, such as 1.2.3-rc1. See ' +
                  'http://semver.org/'.blue.underline + ' for more details.';
              }
            },
            {
              config:  'bump.files',
              type:    'checkbox',
              message: 'What should get the new version:',
              choices: [
                {
                  value:   'package',
                  name:    'package.json' +
                    (!grunt.file.isFile('package.json') ? ' file not found, will create one'.grey : ''),
                  checked: grunt.file.isFile('package.json')
                },
                {
                  value:   'bower',
                  name:    'bower.json' +
                    (!grunt.file.isFile('bower.json') ? ' file not found, will create one'.grey : ''),
                  checked: grunt.file.isFile('bower.json')
                },
                {
                  value:   'git',
                  name:    'git tag',
                  checked: grunt.file.isDir('.git')
                }
              ]
            }
          ]
        }
      }
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
  });

  grunt.loadTasks('tasks');

  grunt.registerTask('build', [
  ]);

  grunt.registerTask('test', [
    'jshint',
    'jscs'
  ]);

  grunt.registerTask('serve', [
    'watch'
  ]);

  grunt.registerTask('newRelease', 'Ready everything for new release', [
    'prompt:bump',
    'bump',
  ]);

  grunt.registerTask('default', [
    'build',
    'test',
    'serve'
  ]);
};

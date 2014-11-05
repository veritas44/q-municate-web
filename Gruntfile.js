'use strict';

var SERVER_PORT = 9000;

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // configurable paths
  var yeomanConfig = {
    app: 'app',
    dist: 'dist'
  };

  grunt.initConfig({
    yeoman: yeomanConfig,
    pkg: grunt.file.readJSON('bower.json'),
    banner: '/* <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n',

    clean: {
      dev: ['.sass-cache', '.tmp', '<%= yeoman.app %>/.css'],
      dist: ['.sass-cache', '.tmp', '<%= yeoman.app %>/.css', '<%= yeoman.dist %>/*']
    },

    compass: {
      options: {
        cssDir: '<%= yeoman.app %>/.css',
        sassDir: '<%= yeoman.app %>/styles',
        javascriptsDir: '<%= yeoman.app %>/scripts',
        imagesDir: '<%= yeoman.app %>/images',
        noLineComments: true,
        relativeAssets: true,
        raw: 'preferred_syntax = :scss\n'
      },
      dist: {
        options: {
          outputStyle: 'compressed'
        }
      },
      dev: {}
    },

    handlebars: {
      compile: {
        options: {
          namespace: 'JST',
          amd: true
        },
        files: {
          '.tmp/scripts/templates.js': ['<%= yeoman.app %>/scripts/templates/*.hbs']
        }
      }
    },

    // bower: {
    //   all: {
    //     rjsConfig: '<%= yeoman.app %>/scripts/main.js'
    //   }
    // },

    // requirejs: {
    //   dist: {
    //     // Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js

    //     options: {
    //       mainConfigFile: "<%= yeoman.app %>/scripts/main.js",
    //       baseUrl: '<%= yeoman.app %>/scripts',
    //       name: 'main',
    //       optimize: 'none',
    //       paths: {
    //         'templates': '../../.tmp/scripts/templates',
    //         'jquery': '../../<%= yeoman.app %>/bower_components/jquery/dist/jquery.min',
    //         'underscore': '../../<%= yeoman.app %>/bower_components/lodash/dist/lodash.min',
    //         'backbone': '../../<%= yeoman.app %>/bower_components/backbone/backbone'
    //       },
    //       out: "<%= yeoman.dist %>/scripts/main.min.js",
    //       preserveLicenseComments: false,
    //       useStrict: true
    //     }
    //   }
    // },

    watch: {
      options: {
        spawn: false
      },
      css: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.scss'],
        tasks: ['compass:dev']
      },
      // scripts: {
      //   files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
      //   tasks: []
      // },
      handlebars: {
        files: [
          '<%= yeoman.app %>/scripts/templates/*.hbs'
        ],
        tasks: ['handlebars']
      },
      test: {
        files: ['test/spec/**/*.js'],
        tasks: ['test:true']
      }
    },

    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },

    cssmin: {
      options: {
        banner: '<%= banner %>'
      }
    },

    uglify: {
      options: {
        banner: '<%= banner %>'
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,svg}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: '*.html',
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/scripts/{,*/}*.js',
            '<%= yeoman.dist %>/styles/{,*/}*.css',
            '<%= yeoman.dist %>/vendor/{,*/}*.js',
          ]
        }
      }
    },

    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      options: {
        dirs: ['<%= yeoman.dist %>']
      }
    },

    copy: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: [
            '*.{ico,png}',
            'audio/{,*/}*.*'
          ],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    connect: {
      options: {
        port: grunt.option('port') || SERVER_PORT,
        open: true,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      dev: {
        options: {
          base: [
            '.tmp',
            '<%= yeoman.app %>'
          ]
        }
      },
      test: {
        options: {
          port: 9001,
          open: false,
          base: [
            '.tmp',
            'test',
            '<%= yeoman.app %>'
          ]
        }
      },
      dist: {
        options: {
          protocol: 'https',
          base: '<%= yeoman.dist %>'
        }
      }
    },

    open: {
      test: {
        path: 'http://localhost:<%= connect.test.options.port %>'
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js',
        '!<%= yeoman.app %>/vendor/*',
        'test/spec/{,*/}*.js'
      ]
    },

    mocha: {
      all: {
        options: {
          run: true,
          urls: ['http://localhost:<%= connect.test.options.port %>/index.html']
        }
      }
    }
  });

  grunt.registerTask('createDefaultTemplate', function () {
    grunt.file.write('.tmp/scripts/templates.js', 'this.JST = this.JST || {};');
  });

  grunt.registerTask('server', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve' + (target ? ':' + target : '')]);
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    if (target === 'test') {
      return grunt.task.run([
        'clean:dev',
        'createDefaultTemplate',
        'handlebars',
        'connect:test',
        'open:test',
        'watch'
      ]);
    }

    grunt.task.run([
      'clean:dev',
      'compass:dev',
      'createDefaultTemplate',
      'handlebars',
      'connect:dev',
      'watch'
    ]);
  });

  grunt.registerTask('test', function (isConnected) {
    isConnected = Boolean(isConnected);
    var testTasks = [
        'jshint',
        'clean:dev',
        'createDefaultTemplate',
        'handlebars',
        'connect:test',
        'mocha'
      ];

    if(!isConnected) {
      return grunt.task.run(testTasks);
    } else {
      // already connected so not going to connect again, remove the connect:test task
      testTasks.splice(testTasks.indexOf('connect:test'), 1);
      return grunt.task.run(testTasks);
    }
  });

  grunt.registerTask('build', [
    'clean:dist',
    'compass:dist',
    'createDefaultTemplate',
    'handlebars',
    'useminPrepare',
    // 'requirejs',
    'concat',
    'cssmin',
    'uglify',
    'imagemin',
    'htmlmin',
    'rev',
    'usemin',
    'copy'
  ]);

  grunt.registerTask('default', [
    'test',
    'build'
  ]);
};

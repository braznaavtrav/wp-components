module.exports = function(grunt) {
  grunt.initConfig({

    jshint: {
      files: ['js/src/*.js'],
      options: {
        bitwise: true,
        curly: true,
        eqeqeq: true,
        forin: true,
        freeze: true,
        immed: true,
        indent: 2,
        latedef: true,
        newcap: true,
        noarg: true,
        nonbsp: true,
        plusplus: true,
        quotmark: 'single',
        undef: true,
        unused: false,
        strict: true,
        trailing: true,
        globals: {
          angular: true,
          console: true,
          module: true,
          document: true,
          window: true
        }
      }
    },

    uglify: {
      default: {
        files: {
          'js/app.js': ['js/src/*.js']
        },
        options: {
          mangle: false
        }
      }
    },

    less: {
      backend: {
        files: {
          'css/wp-components.css': 'css/less/wp-components.less'
        }
      }
    },

    watch: {
      configFiles: {
        files: [ 'Gruntfile.js' ],
        options: {
          reload: true
        }
      },
      theme: {
        files: ['*.php', 'views/*.twig', 'img/**/*']
      },
      javascripts: {
        files: ['js/src/*.js'],
        tasks: ['jshint', 'uglify:default']
      },
      less: {
        files: ['css/less/**'],
        tasks: ['less']
      },
      options: {
        livereload: true,
      }
    },

  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.registerTask('default', ['watch']);
}
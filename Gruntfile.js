/*
 * origami
 * https://github.com/Jon Schlinkert/origami
 * Copyright (c) 2014
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
'use strict';

  // Project configuration.
  grunt.initConfig({

    // Project metadata
    pkg   : grunt.file.readJSON('package.json'),
    vendor: grunt.file.readJSON('.bowerrc').directory,
    site  : grunt.file.readYAML('_config.yml'),
    bootstrap: '<%= vendor %>/bootstrap',


    // Before generating any new files, remove files from previous build.
    clean: {
      dest: ['<%= site.dest %>/*.html'],
    },

    // Lint JavaScript
    jshint: {
      all: ['Gruntfile.js', 'templates/helpers/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },


    // Build HTML from templates and data
    assemble: {
      options: {
        flatten: true,
        production: false,
        assets: '<%= site.assets %>',
        // postprocess: require('pretty'),

        // Metadata
        pkg: '<%= pkg %>',
        site: '<%= site %>',
        data: ['<%= site.data %>'],

        // Templates
        partials: '<%= site.includes %>',
        layoutdir: '<%= site.layouts %>',
        layout: '<%= site.layout %>',

        // Extensions
        helpers: '<%= site.helpers %>',
        plugins: '<%= site.plugins %>'
      },
      example: {
        files: {'<%= site.dest %>/': ['<%= site.templates %>/*.hbs']}
      }
    },


    // Compile LESS to CSS
    less: {
      options: {
        vendor: 'vendor',
        paths: [
          '<%= site.styles %>',
          '<%= site.styles %>/vendor/bootstrap',
          '<%= site.styles %>/components',
          '<%= site.styles %>/utils'
        ],
      },
      site: {
        src: ['<%= site.styles %>/site.less'],
        dest: '<%= site.assets %>/css/site.css'
      }
    },


    // Copy Bootstrap's assets to site assets
    copy: {
      once: {
        files: [
          {expand: true, cwd: '<%= bootstrap %>/less', src: ['*', '!{var*,mix*,util*}'], dest: '<%= site.styles %>/vendor/bootstrap/'},
          {expand: true, cwd: '<%= bootstrap %>/less', src: ['{util*,mix*}.less'], dest: '<%= site.styles %>/utils'},
          {expand: true, cwd: '<%= bootstrap %>/less', src: ['variables.less'], dest: '<%= site.styles %>/'},
        ]
      },
      // Keep this target as a getting started point
      assets: {
        files: [
          {expand: true, cwd: '<%= bootstrap %>/dist/fonts', src: ['*.*'], dest: '<%= site.assets %>/fonts/'},
          {expand: true, cwd: '<%= bootstrap %>/dist/js',    src: ['*.*'], dest: '<%= site.assets %>/js/'},
        ]
      }
    },

    watch: {
      all: {
        files: ['<%= jshint.all %>'],
        tasks: ['jshint', 'nodeunit']
      },
      site: {
        files: ['Gruntfile.js', '<%= less.options.paths %>/*.less', 'templates/**/*.hbs'],
        tasks: ['design']
      }
    }
  });

  // Load npm plugins to provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-readme');
  grunt.loadNpmTasks('grunt-sync-pkg');
  grunt.loadNpmTasks('assemble-less');
  grunt.loadNpmTasks('assemble');

  // Build HTML, compile LESS and watch for changes. You must first run "bower install"
  // or install Bootstrap to the "vendor" directory before running this command.
  grunt.registerTask('design', ['clean', 'assemble', 'less:site', 'watch:site']);

  // Build readme and sync package.json and bower.json files
  grunt.registerTask('docs', ['readme', 'sync']);

  // Use this going forward.
  // grunt.registerTask('default', ['clean', 'jshint', 'copy:assets', 'assemble', 'less', 'docs']);
  grunt.registerTask('default', ['jshint', 'assemble', 'less', 'sync']);
};
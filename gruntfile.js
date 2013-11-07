module.exports = function(grunt) {
	var
		tasks = { default:['core','docs','tests'] },
		
		config = {
			pkg: grunt.file.readJSON('package.json'),

			requirejs: {},
			jshint:    {},
			yuidoc:    {},
			watch:     { all: { files: ['gruntfile.js', 'package.json', 'sources/core/**'], tasks: 'default' } }
		}
	;




	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-yuidoc');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-requirejs');



	// Build kafe
	config.jshint.core = {
		src: ['builds/kafe/**/*.js'],
		options: {
			'-W061': true   // eval can be harmful
		}
	};
	tasks.core = ['jshint:core'];


	// Tests
	config.requirejs.test = {
		options: {
			baseUrl:  'sources/tests/',
			name:     'kafe',
			include:  [
				'date',               // 2 methods pending
//				'form',
//				'geolocation',        // difficult to automate
				'number',
				'storage',
				'string',
				'string-encrypt',
				'string-validate',
//				'style',
				'url',

//				'cms/drupal',
//				'cms/magento',
//				'cms/sitecore',

//				'ext/addthis',
//				'ext/bbq',
//				'ext/colorbox',
//				'ext/disqus',
//				'ext/facebook',
//				'ext/flickr',
//				'ext/googlemaps',
//				'ext/soundcloud',
//				'ext/twitter',
//				'ext/youtube',
//
//				'plugin/carousel',
//				'plugin/menu',
//				'plugin/qrcode',
//				'plugin/sticky',
			],
			out:      'tests/build.js',
			optimize: 'none',
			preserveLicenseComments: true,
			skipModuleInsertion:     true,
			findNestedDependencies:  true,
			pragmasOnSave:           { excludeRequire: true },
			onBuildRead: function (moduleName, path, contents) {
				if (/vendor/.test(path)) {
				
					// remove AMD requirement
					// if ( typeof define === "function" && define.amd ) {
					var pieces = contents.split(/\}\s*else\s*{/);
					for (var i in pieces) {
						pieces[i] = pieces[i].replace(/if\s*\(\s*typeof\s+define\s*\=\=\=\s*['"]function['"]\s*\&\&\s*define\.amd\s*\)\s*\{[\s\S]*/gi, 'if (false) { var x=false;');
					}
					return pieces.join('} else {');
				}
				
				return contents;
			},
		}
	};
	tasks.tests        = ['requirejs:test'];
	config.watch.tests = { files: ['sources/tests/**/*.js', '!sources/tests/libs/*'], tasks:'tests' };



	// Docs
	config.yuidoc.compile = {
		name: '<%= pkg.name %>',
		description: '<%= pkg.name %> RULZ',
		version: '<%= pkg.name %> v.<%= pkg.version %>',
		url: 'http://github.com/absolunet/<%= pkg.name %>',
		options: {
			paths: 'builds/kafe/',
			themedir: 'sources/docs/',
			outdir: 'docs/'
		}
	};
	tasks.docs = ['yuidoc:compile'];
	config.watch.docs = { files: ['sources/docs/*'], tasks: 'docs' };










	// --------------------------------
	// GRUNT
	// --------------------------------
	grunt.initConfig(config);

	// tasks
	for (var name in tasks) {
		grunt.registerTask(name, tasks[name]);
	}
};

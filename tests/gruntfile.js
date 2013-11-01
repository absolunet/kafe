module.exports = function(grunt) {
	var
		tasks = {},
		
		config = {
			pkg: grunt.file.readJSON('package.json'),

			requirejs: {},
			jshint:    {},
			watch:     { all: { files: ['gruntfile.js', 'package.json'], tasks: 'default' } }
		}
	;




	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-requirejs');

	// js hint
	config.jshint.core = {
		src: ['libs/kafe/**/*.js'],
		options: {
			'-W061': true   // eval can be harmful
		}
	};

	// requirejs
	config.requirejs.core = {
		options: {
			baseUrl:  './',
			name:     'files/test-core',
			include:  [
				'files/test-date',               // 2 methods pending
//				'files/test-form',
//				'files/test-geolocation',
				'files/test-number',
//				'files/test-storage',
				'files/test-string',
				'files/test-string-encrypt',
				'files/test-string-validate',
//				'files/test-style',
//				'files/test-url',

//				'files/test-cms-drupal',
//				'files/test-cms-magento',
//				'files/test-cms-sitecore',

//				'files/test-ext-addthis',
//				'files/test-ext-bbq',
//				'files/test-ext-colorbox',
//				'files/test-ext-disqus',
//				'files/test-ext-facebook',
//				'files/test-ext-flickr',
//				'files/test-ext-googlemaps',
//				'files/test-ext-soundcloud',
//				'files/test-ext-twitter',
//				'files/test-ext-youtube',
//
//				'files/test-plugin-carousel',
//				'files/test-plugin-menu',
//				'files/test-plugin-qrcode',
//				'files/test-plugin-sticky',
			],
			out:      'files/build.js',
			optimize: 'none',
			preserveLicenseComments: false,
			skipModuleInsertion:     true,
			findNestedDependencies:  true,
			pragmasOnSave:           { excludeRequire: true },
			onBuildRead: function (moduleName, path, contents) {
				if (/vendor/.test(path)) {
					return contents
						.replace("typeof define === 'function' && define.amd", 'false')
						.replace("define( ['jquery'], factory );", 'var x=0;')
					;
				}
				return contents;
			},
		}
	};


	// tasks
	tasks.default = ['jshint:core', 'requirejs:core' ];
	config.watch.test = { files: ['libs/**/*.js', 'files/tests.js', 'files/test-*.js'], tasks: 'default' };











	// --------------------------------
	// GRUNT
	// --------------------------------
	grunt.initConfig(config);

	// tasks
	for (var name in tasks) {
		grunt.registerTask(name, tasks[name]);
	}
};

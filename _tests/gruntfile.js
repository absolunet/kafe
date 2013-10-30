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
	config.jshint.core = { src: ['libsXYZ/**/*.js'] };

	// requirejs
	config.requirejs.core = {
		options: {
			baseUrl:  './',
			name:     'files/test',
			out:      'files/build.js',
			optimize: 'uglify', // 'none'
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
	config.watch.test = { files: ['libs/**/*.js', 'files/test.js'], tasks: 'default' };











	// --------------------------------
	// GRUNT
	// --------------------------------
	grunt.initConfig(config);

	// tasks
	for (var name in tasks) {
		grunt.registerTask(name, tasks[name]);
	}
};

module.exports = function(grunt) {
	var
		tasks = {},
		
		config = {
			pkg: grunt.file.readJSON('package.json'),

			yuidoc: {},
			watch:     { all: { files: ['gruntfile.js', 'package.json'], tasks: 'default' } }
		}
	;




	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-yuidoc');

	// yuidoc
	config.yuidoc.compile = {
		name: 'kafe',
		description: 'kafe RULZ',
		version: 'kafe version 2-alpha',
		url: 'http://github.com/absolunet/kafe',
		options: {
			paths: '../kafe/',
			themedir: 'theme/',
			outdir: 'builds/'
		}
	};


	// tasks
	tasks.default = ['yuidoc:compile' ];
	config.watch.test = { files: ['../kafe/**/*.js', 'theme/*'], tasks: 'default' };










	// --------------------------------
	// GRUNT
	// --------------------------------
	grunt.initConfig(config);

	// tasks
	for (var name in tasks) {
		grunt.registerTask(name, tasks[name]);
	}
};

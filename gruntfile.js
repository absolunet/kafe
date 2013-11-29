module.exports = function(grunt) {
	var
		_             = require('lodash'),
		request       = require('request'),
		async         = require('async'),
		src           = 'src',
		tmp           = src+'/.tmp-kafe',
		src_tasks     = src+'/tasks',
		src_tmpl      = src+'/tmpl',
		src_kafe      = src+'/kafe',
		src_resources = src+'/resources',
		src_yuidoc    = src+'/yuidoc',
		src_qunit     = src+'/qunit',
		out_root      = './',
		out_build     = 'dist',
		out_doc       = 'doc',
		out_test      = 'test',


		tasks = { default:['build', 'dependencies', 'doc', 'test'] },
		
		config = {
			pkg: grunt.file.readJSON('package.json'),

			watch: { all: { files: ['gruntfile.js'], tasks: 'default' } },
			clean: {
				placeholders: {src: [out_build+'/**/_*.js'],  options: { force:true }},
				tmp:          {src: [tmp],  options: { force:true }}
			},
			copy: {}
		}
	;

	grunt.template.addDelimiters('jscomment', '/* {%', '%} */');

	grunt.task.loadNpmTasks('grunt-contrib-watch');
	grunt.task.loadNpmTasks('grunt-contrib-clean');
	grunt.task.loadNpmTasks('grunt-contrib-copy');








	eval(
		grunt.file.read(src_tasks+'/build.js') + ' ' +
		grunt.file.read(src_tasks+'/dependencies.js') + ' ' +
		grunt.file.read(src_tasks+'/test.js') + ' ' +
		grunt.file.read(src_tasks+'/doc.js') + ' '
	);






	(function(name){
		for (var i in name) {
			tasks[name[i]].unshift('clean:tmp');
			tasks[name[i]].push('clean:tmp');
		}
	})(['doc','test']);



	// --------------------------------
	// GRUNT
	// --------------------------------
	grunt.initConfig(config);

	// tasks
	for (var name in tasks) {
		grunt.registerTask(name, tasks[name]);
	}
};

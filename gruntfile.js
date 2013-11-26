module.exports = function(grunt) {
	var
		src        = 'src',
		tmp        = src+'/.tmp-kafe',
		src_tasks  = src+'/tasks',
		src_tmpl   = src+'/tmpl',
		src_kafe   = src+'/kafe',
		src_vendor = src+'/vendor',
		src_yuidoc = src+'/yuidoc',
		src_qunit  = src+'/qunit',
		out_root   = './',
		out_build  = 'build',
		out_doc    = 'doc',
		out_test   = 'test',


		tasks = { default:['doc','test'] },
		
		config = {
			pkg: grunt.file.readJSON('package.json'),

			watch: { all: { files: ['gruntfile.js'], tasks: 'default' } },
			clean: {
				placeholders: {src: [out_build+'/**/_*.js'],  options: { force:true }},
				tmp:          {src: [tmp],  options: { force:true }}
			},
			copy: {}
		},

		merge = function (obj1,obj2) {
			var out = {};
			for (var i in obj1) { out[i] = obj1[i]; }
			for (var j in obj2) { out[j] = obj2[j]; }
			return out;
		}
	;

	grunt.template.addDelimiters('jscomment', '/* {%', '%} */');

	grunt.task.loadNpmTasks('grunt-contrib-watch');
	grunt.task.loadNpmTasks('grunt-contrib-clean');
	grunt.task.loadNpmTasks('grunt-contrib-copy');








	eval(
		grunt.file.read(src_tasks+'/build.js') + ' ' +
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

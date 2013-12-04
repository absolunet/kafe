module.exports = (grunt) ->
	path = grunt.config.get 'internal.path'
	util = grunt.config.get 'util'

	src = path.src.qunit
	out = path.out.test


	# config
	grunt.config.set name, data for name, data of {
		'includes.test':
			options: { includePath:src+'/', },
			src:  src+'/test.js',
			dest: out+'/test.js'
		
		'watch.test': 
			files: [src+'/**/*.js', '!'+src+'/libs/*']
			tasks: 'test'
	}


	# copy test
	grunt.task.registerTask 'copy_test', '', ()-> 
		util.copy src+'/', out+'/', '*.html'
		grunt.log.ok 'Test files copied.'


	# main task
	grunt.task.registerTask 'test', [
		'includes:test'
		'copy_test'
	]

module.exports = (grunt) ->
	grunt.log.ok 'config loaded'

	grunt.task.loadNpmTasks task for task in [
		'grunt-contrib-watch'
		'grunt-contrib-yuidoc'
		'grunt-contrib-less'
		'grunt-contrib-cssmin'
		'grunt-contrib-jshint'
		'grunt-includes'
		'grunt-contrib-uglify'
	]

	path = {
	 	tmp: 'src/.tmp-kafe'

		src:
			grunt:     'src/grunt'
			tmpl:      'src/tmpl'
			kafe:      'src/kafe'
			resources: 'src/resources'
			yuidoc:    'src/yuidoc'
			qunit:     'src/qunit'

		out:
			root: './'
			dist: 'dist'
			doc:  'doc'
			test: 'test'
	}

	util = {
		copy:   (src,dest,filter='**') -> grunt.file.copy src+file, dest+file for file in grunt.file.expand { cwd:src, filter:'isFile' }, filter
		
		delete: (src...) -> grunt.file.delete file, {force:true} for file in grunt.file.expand { src: pattern } for pattern in src
	}

	grunt.template.addDelimiters 'jscomment', '/* {%', '%} */'



	grunt.config.set name, data for name, data of {
		'util': util

		'internal': 
			path: path
			pkg:  grunt.file.readJSON 'package.json'
			info: grunt.file.readJSON path.src.kafe+'/~info.json'


		'includes.options':
			includeRegexp:  /^\s*\/\/\s@import\s'([^']+)'\s*$/
			duplicates:     false
			filenameSuffix: '.js'

		'watch.all':
			files: ['gruntfile.js']
			tasks: 'default'
	}


	# A FINALISER
	grunt.task.registerTask 'delete_tmp', '', ()-> util.delete tmp








	grunt.task.registerTask 'default', [
		'core'
		'vendor'
		'test'
		'doc'
	]


	###



	((cleanup_required) ->
		for name in cleanup_required
			tasks[name].unshift 'clean:tmp'
			tasks[name].push 'clean:tmp'
	)(['doc','test'])
	###

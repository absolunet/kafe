module.exports = (grunt) ->
	grunt.task.loadNpmTasks task for task in [
		'grunt-contrib-watch'
		'grunt-contrib-less'
		'grunt-contrib-cssmin'
		'grunt-contrib-jshint'
		'grunt-contrib-uglify'
		'grunt-includes'
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
		copy:      (src,dest,filter='**') -> grunt.file.copy src+file, dest+file for file in grunt.file.expand { cwd:src, filter:'isFile' }, filter		
		delete:    (src...) -> grunt.file.delete file, {force:true} for file in grunt.file.expand { cwd:path.out.root }, pattern for pattern in src
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

		'uglify.options':
			preserveComments:'some'
			compress: global_defs: DEBUG:false

		'watch.all':
			files: ['gruntfile.js']
			tasks: 'default'
	}




	grunt.task.registerTask 'default', [
		'core'
		'vendor'
		'test'
		'doc'
	]

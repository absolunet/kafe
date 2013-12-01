module.exports = (grunt) ->
	grunt.log.ok 'init loaded'

	grunt.task.loadNpmTasks task for task in [
		'grunt-contrib-watch'
		'grunt-contrib-clean'
		'grunt-contrib-yuidoc'
		'grunt-preprocess'
		'grunt-markdown'
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

	grunt.template.addDelimiters 'jscomment', '/* {%', '%} */'

	grunt.config.set name, data for name, data of {
		'util':
			copy:   (src,dest,filter='**') -> grunt.file.copy src+file, dest+file for file in grunt.file.expand { cwd:src, filter:'isFile' }, filter
			delete: (src...) -> grunt.file.delete file, {force:true} for file in src


		'internal': 
			path: path
			pkg:  grunt.file.readJSON 'package.json'

		'watch.all':
			files: ['gruntfile.js']
			tasks: 'default'

		'clean.placeholders':
			src: [path.out.dist+'/**/_*.js']
			options: force:true

		'clean.tmp':
			src: [path.tmp]
			options: force:true
	}

	grunt.task.registerTask 'default', [
		'core'
		'vendor'
		#'doc'
		#'test'
	]


	###



	((cleanup_required) ->
		for name in cleanup_required
			tasks[name].unshift 'clean:tmp'
			tasks[name].push 'clean:tmp'
	)(['doc','test'])
	###

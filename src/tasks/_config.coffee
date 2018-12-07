module.exports = (grunt) ->
	global.pkgVersion = '3.2.4'

	grunt.task.loadNpmTasks task for task in [
		'grunt-contrib-watch'
		'grunt-contrib-less'
		'grunt-contrib-cssmin'
		'grunt-contrib-jshint'
		'grunt-contrib-uglify'
		'grunt-includes'
	]

	path = {
		tmp_local: 'src/.tmp-kafe'

		src:
			kafe:      'src/kafe'
			qunit:     'src/qunit'
			resources: 'src/resources'
			tmpl:      'src/tmpl'
			yuidoc:    'src/yuidoc'

		out:
			root: '.'
			dist: 'dist'
			docs: 'docs'
			test: 'test'
	}

	util = {
		copy:   (src,dest,filter='**') -> grunt.file.copy src+file, dest+file for file in grunt.file.expand { cwd:src, filter:'isFile' }, filter
		delete: (src...) -> grunt.file.delete file, {force:true} for file in grunt.file.expand { cwd:path.out.root }, pattern for pattern in src
	}



	grunt.config.set name, data for name, data of {
		'util': util

		'internal':
			path: path
			pkg:  grunt.file.readJSON 'package.json'
			info: grunt.file.readJSON "#{path.src.kafe}/~info.json"


		'includes.options':
			includeRegexp:  /^\s*\/\/\=\srequire\s'([^']+)'\s*/
			duplicates:     false
			filenameSuffix: '.js'

		'uglify.options':
			preserveComments:'some'
			compress: global_defs: DEBUG:false

		'watch.all':
			files: ['gruntfile.js']
			tasks: 'default'
	}




	grunt.task.registerTask 'all', [
		'core'
		'docs'
	]

	grunt.task.registerTask 'default', '', () ->
		grunt.task.run 'core', 'docs'

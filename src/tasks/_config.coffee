module.exports = (grunt) ->
	inquirer = require 'inquirer'
	progress = require 'progress'

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
			doc:  'doc'
			test: 'test'
	}

	util = {
		copy:          (src,dest,filter='**') -> grunt.file.copy src+file, dest+file for file in grunt.file.expand { cwd:src, filter:'isFile' }, filter		
		delete:        (src...) -> grunt.file.delete file, {force:true} for file in grunt.file.expand { cwd:path.out.root }, pattern for pattern in src
		progress:      (action,nb) -> grunt.log.writeln "#{action} #{nb.toString().cyan} files..."; return new progress '[:bar] :percent (:elapseds)', { total:nb, width:20, incomplete:' ', clear:true }
		progress_done: (bar) -> bar.terminate(); grunt.log.ok "Completed in #{((new Date() - bar.start) / 1000).toFixed(1)}s"; grunt.log.writeln()
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
		'test'
		'doc'
	]

	grunt.task.registerTask 'default', '', () ->
		done = this.async()

		grunt.log.writeln()
		inquirer.prompt [
			name:    'task'
			message: 'What can I do for you today ?'
			type:    'list'
			choices: [
				{ name:'Build kafe core',        value:'core' }
				new inquirer.Separator()
				{ name:'Generate test',          value:'test' }
				{ name:'Generate documentation', value:'doc' }
				{ name:'Whole chebang',          value:'all' }
			]
		], (data) -> grunt.task.run data.task; done()

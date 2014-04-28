module.exports = (grunt) ->
	path = grunt.config.get 'internal.path'
	pkg  = grunt.config.get 'internal.pkg'
	util = grunt.config.get 'util'

	preprocess = require 'preprocess'

	src = path.src.kafe
	out = "#{path.out.dist}/#{pkg.name}"

	# config
	grunt.config.set name, data for name, data of {
		'jshint.dist_core':
			src: ["#{out}/**/*.js"]
			options:
				'-W061': true   # eval can be harmful
	}


	# task
	grunt.task.registerTask 'build_core', '', ()->
		info = grunt.config.get 'internal.info'

		util.delete out

		for file in grunt.file.expand "#{src}/**/*.js"

			parts        = file.split "#{src}/"
			filename     = parts[parts.length-1]
			name         = filename.replace(/[\/\-]/,'.').substr(0,filename.length-3)
			module       = name.split '.'
			finalName    = if name.substring(0,1) isnt '_' then module.pop() else ''
			finalNameCap = finalName.charAt(0).toUpperCase() + finalName.slice(1)
			contents     = grunt.file.read file
			version      = if name is pkg.name then pkg.version else info.versions[name]

			contents = preprocess.preprocess contents, {
				PACKAGE:     pkg.name
				DESCRIPTION: pkg.description
				DEFINITION:  pkg.definition
				HOMEPAGE:    pkg.homepage
				NAME:        name
				NAME_FULL:   pkg.name+'.'+name
				NAME_FINAL:  finalNameCap
				NAME_ATTR:   pkg.name+finalName
				NAME_JQUERY: pkg.name+finalNameCap
				MODULE:      pkg.name+( if module.length then '.'+module.join('.') else '' )
				VERSION:     version
			}

			contents = preprocess.preprocess contents, {
				header: "(function(global, undefined) { var #{pkg.name} = global.#{pkg.name}, $ = #{pkg.name}.dependencies.jQuery; #{pkg.name}.bonify({name:'#{name}', version:'#{version}', obj:(function(){"
				footer: "})()}); })(typeof window !== 'undefined' ? window : this);"
			}, 'js'

			grunt.file.write "#{out}/#{filename}", contents
		
		grunt.log.ok "#{pkg.name} core built."


	# main task
	grunt.task.registerTask 'core', [
		'build_core'
		'jshint:dist_core'
	]

module.exports = (grunt) ->
	grunt.log.ok 'dist-core loaded'

	path = grunt.config.get 'internal.path'
	pkg  = grunt.config.get 'internal.pkg'


	# config
	grunt.config.set name, data for name, data of {
		'clean.distcore': 
			src:     [path.out.dist+'/kafe']
			options: force:true

		'jshint.distcore':
			src: [path.out.dist+'/'+pkg.name+'/**/*.js']
			options:
				'-W061': true   # eval can be harmful
	}


	# task
	grunt.task.registerTask 'build_distcore', '', ()->

		versions = grunt.file.readJSON path.src.kafe+'/versions.json'
		files    = grunt.file.expand   path.src.kafe+'/**/*.js'

		for file in files
			parts        = file.split path.src.kafe+'/'
			filename     = parts[parts.length-1]
			name         = filename.replace(/[\/\-]/,'.').substr(0,filename.length-3)
			module       = name.split '.'
			pkgName      = pkg.name
			finalName    = if name.substring(0,1) isnt '_' then module.pop() else ''
			finalNameCap = finalName.charAt(0).toUpperCase() + finalName.slice(1)
			contents     = grunt.file.read file
			version      = if name is pkg.name then pkg.version else versions[name]

			contents = grunt.template.process contents, {
				data:
					PACKAGE:     pkgName
					DESCRIPTION: pkg.description
					DEFINITION:  pkg.definition
					HOMEPAGE:    pkg.homepage
					NAME:        name
					NAME_FULL:   pkgName+'.'+name
					NAME_FINAL:  finalNameCap
					NAME_ATTR:   pkgName+finalName
					NAME_JQUERY: pkgName+finalNameCap
					MODULE:      pkgName+( if module.length then '.'+module.join('.') else '' )
					VERSION:     version
			}

			contents = grunt.template.process contents, {
				delimiters: 'jscomment'
				data:
					HEADER: "window."+pkgName+".bonify({name:'"+name+"', version:'"+version+"', obj:(function("+pkgName+",undefined){\n\n\tvar $ = "+pkgName+".dependencies.jQuery;"
					FOOTER: "})(window."+pkgName+")});"
			}

			grunt.file.write path.out.dist+'/'+pkgName+'/'+filename, contents



	# main task
	grunt.task.registerTask 'dist_core', [
		'clean:distcore'
		'build_distcore'
		'jshint:distcore'
		'clean:placeholders'
	]

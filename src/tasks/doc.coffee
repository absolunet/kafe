module.exports = (grunt) ->
	fs         = require 'fs'
	preprocess = require 'preprocess'
	marked     = require 'marked'
	Y          = require 'yuidocjs'


	path = grunt.config.get 'internal.path'
	pkg  = JSON.parse(fs.readFileSync('./bower.json', 'utf-8'))
	util = grunt.config.get 'util'

	tmp_local = "#{path.tmp_local}/vendor"
	src       = path.src.yuidoc
	src_tmpl  = path.src.tmpl
	out       = path.out.docs
	out_root  = path.out.root
	out_libs  = "#{path.out.dist}"

	# doc data
	docdata = {
		package:      pkg.name
		version:      global.pkgVersion
		description:  pkg.description
		definition:   pkg.definition
		repo:         "https://github.com/absolunet/#{pkg.name}"
		repo_url:     "https://github.com/absolunet/#{pkg.name}/tree/master"
		repository:   pkg.repository.url
		bugs:         pkg.bugs.url
		license:      "https://github.com/absolunet/#{pkg.name}/blob/master/license"
		license_name: 'MIT'
		homepage:     pkg.homepage
		year:         grunt.template.today 'yyyy'
		author:       pkg.authors[0].name
		site:         pkg.authors[0].url
	}


	# config
	grunt.config.set name, data for name, data of {
		'less.docs': files: [
			src:  "#{src}/css/core.less"
			dest: "#{tmp_local}/docs-less.css"
		]

		'cssmin.docs': files: [
			src: [
				"#{src}/css/libs/reset.css"
				"#{src}/css/libs/normalize.css"
				"#{src}/css/libs/html5boilerplate.css"
				"#{tmp_local}/docs-less.css"
			]
			dest: "#{out}/assets/core.css"
		]


		'includes.docs':
			options: { includePath: "#{src}/js/" }
			files: [
				src:  "#{src}/js/core.js"
				dest: "#{tmp_local}/docs-core.js"
			]

		'uglify.docs': files: [
			src:  "#{tmp_local}/docs-core.js"
			dest: "#{out}/assets/core.js"
		]


		'watch.docs':
			files: [
				"#{src}/**/*"
				"!#{src}/tmpl/partials/index.handlebars"
				"#{src_tmpl}/*.tmpl"
			]
			tasks: 'docs'
	}









	# yuidoc
	grunt.task.registerTask 'yuidoc', '', ()->
		done = this.async()

		info = grunt.config.get 'internal.info'

		# homepage
		docdata.docs = true;

		grunt.file.write "#{src}/tmpl/partials/index.handlebars", '<div class="Home">' + marked( grunt.file.read("./readme.md").replace('### '+pkg.name, '# '+pkg.name) ) + '</div>'


		# module description
		preprocess.preprocessFileSync "#{src_tmpl}/module.tmpl", "#{out_libs}/#{module}/_#{module}.js", { MODULE: "#{pkg.name}.#{module}", DESCRIPTION:desc } for module, desc of info.modules


		# compiler
		options = {
			quiet:    true
			paths:    [out_libs]
			themedir: "#{src}/tmpl/"
			outdir:   "#{out}/"
			project:
				name:        pkg.name
				description: pkg.description
				version:     "#{pkg.name} #{global.pkgVersion}"
				url:         pkg.repository_url
		}

		json = new Y.YUIDoc(options).run()
		options = Y.Project.mix json, options

		new Y.DocBuilder(options, json).compile ()->
			util.delete ["#{out}/assets"]
			done()

			# base assets
			util.copy "#{src}/assets/", "#{out}/assets/"

			grunt.log.ok 'Full documentation generated.'



	# cleanup
	grunt.task.registerTask 'docs_cleanup', '', ()->
		util.delete [
			"#{out_libs}/**/_*.js"
			"#{src}/tmpl/partials/index.handlebars"
			"#{out}/api.js"
			"#{out}/data.json"
			tmp_local
		]

		grunt.log.ok 'Documentation cleaned.'





	# main task
	grunt.task.registerTask 'docs', [
		'yuidoc'
		'less:docs'
		'cssmin:docs'
		'includes:docs'
		'uglify:docs'
		'docs_cleanup'
	]

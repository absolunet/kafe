module.exports = (grunt) ->
	_          = require 'lodash'
	preprocess = require 'preprocess'
	marked     = require 'marked'
	Y          = require 'yuidocjs'
	less       = require 'less'


	path = grunt.config.get 'internal.path'
	pkg  = grunt.config.get 'internal.pkg'
	info = grunt.config.get 'internal.info'
	util = grunt.config.get 'util'

	tmp      = path.tmp+'/vendor'
	src      = path.src.yuidoc
	src_tmpl = path.src.tmpl
	out      = path.out.doc
	out_root = path.out.root
	out_libs = path.out.dist+'/'+pkg.name

	# read me
	readme = {
		tmpl: grunt.file.read src_tmpl+'/readme.tmpl'
		data:
			package:     pkg.name
			version:     pkg.version
			description: pkg.description
			definition:  pkg.definition
			repo:        'https://github.com/absolunet/'+pkg.name
			repo_url:    'https://github.com/absolunet/'+pkg.name+'/tree/master'
			homepage:    pkg.homepage
	}



	# config
	grunt.config.set name, data for name, data of {
		'less.doc': files: [ 
			src:  src+'/css/core.less'
			dest: tmp+'/doc-less.css'
		]

		'cssmin.doc': files: [
			src: [
				src+'/css/libs/reset.css'
				src+'/css/libs/normalize.css'
				src+'/css/libs/html5boilerplate.css'
				tmp+'/doc-less.css'
			]
			dest: out+'/assets/core.css'
		]


		'includes.doc':
			options: { includePath: src+'/js/' }
			files: [
				src:  src+'/js/core.js'
				dest: tmp+'/doc-core.js'
			]

		'uglify.doc': files: [
			src:  tmp+'/doc-core.js'
			dest: out+'/assets/core.js'
		]


		'watch.doc':
			files: [
				src+'/**/*', 
				'!'+src+'/tmpl/partials/index.handlebars',
				src_tmpl+'/readme.tmpl'
			]
			tasks: 'doc'
	}









	# readme
	grunt.task.registerTask 'readme', '', ()-> 
		grunt.file.write out_root+'/README.md', preprocess.preprocess(readme.tmpl, _.merge({},readme.data,{doc:false}))
		grunt.log.ok 'README.md generated.'


	# yuidoc
	grunt.task.registerTask 'yuidoc', '', ()->
		done = this.async()

		# homepage
		grunt.file.write src+'/tmpl/partials/index.handlebars', 
			'<div class="Home">' + 
				marked( preprocess.preprocess( readme.tmpl, _.merge({},readme.data,{doc:true}) ).replace('### '+pkg.name, '# '+pkg.name) ) +
			'</div>'

		# module description
		module_tmpl = grunt.file.read src_tmpl+'/module.tmpl'
		for module, desc of info.modules
			grunt.file.write out_libs+'/'+module+'/_'+module+'.js', grunt.template.process(module_tmpl, { data: { MODULE: pkg.name+'.'+module, DESCRIPTION:desc }})
		
		# compiler
		options = {
			quiet:    true
			paths:    [out_libs]
			themedir: src+'/tmpl/'
			outdir:   out+'/'
			project:
				name:        pkg.name
				description: pkg.description
				version:     pkg.name+' v'+pkg.version
				url:         pkg.repository_url
		}

		json = new Y.YUIDoc(options).run()
		options = Y.Project.mix json, options

		new Y.DocBuilder(options, json).compile ()->
			util.delete [out+'/assets']
			done()
			
			# base assets
			util.copy src+'/assets/', out+'/assets/'

			grunt.log.ok 'Documentation generated.'



	# cleanup
	grunt.task.registerTask 'doc_cleanup', '', ()->
		util.delete [
			out_libs+'/**/_*.js'
			src+'/tmpl/partials/index.handlebars'
			out+'/api.js'
			out+'/data.json'
			tmp
		]
	




	# main task
	grunt.task.registerTask 'doc', [
		'readme'
		'yuidoc'
		'less:doc'
		'cssmin:doc'
		'includes:doc'
		'uglify:doc'
		'doc_cleanup'
	]


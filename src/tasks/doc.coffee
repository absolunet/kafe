module.exports = (grunt) ->
	preprocess = require 'preprocess'
	marked     = require 'marked'
	Y          = require 'yuidocjs'


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

	# doc data
	docdata = {
		package:     pkg.name
		version:     pkg.version
		description: pkg.description
		definition:  pkg.definition
		repo:        'https://github.com/absolunet/'+pkg.name
		repo_url:    'https://github.com/absolunet/'+pkg.name+'/tree/master'
		homepage:    pkg.homepage
		year:        grunt.template.today 'yyyy'
		author:      pkg.author.name
		site:        pkg.author.url
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
				src_tmpl+'/*.tmpl'
			]
			tasks: 'doc'
	}









	# readme
	grunt.task.registerTask 'basedoc', '', ()-> 
		docdata.doc = false;

		preprocess.preprocessFileSync src_tmpl+'/readme.tmpl',  out_root+'/README.md', docdata
		preprocess.preprocessFileSync src_tmpl+'/license.tmpl', out_root+'/LICENSE.md', docdata
		grunt.file.copy src_tmpl+'/changelog.tmpl', out_root+'/CHANGELOG.md'
		grunt.log.ok 'Base documentation generated.'


	# yuidoc
	grunt.task.registerTask 'yuidoc', '', ()->
		done = this.async()

		# homepage
		docdata.doc = true;

		grunt.file.write src+'/tmpl/partials/index.handlebars', 
			'<div class="Home">' + 
				marked( preprocess.preprocess(grunt.file.read(src_tmpl+'/readme.tmpl'),docdata).replace('### '+pkg.name, '# '+pkg.name) ) +
			'</div>'


		# module description
		preprocess.preprocessFileSync src_tmpl+'/module.tmpl', out_libs+'/'+module+'/_'+module+'.js', { MODULE: pkg.name+'.'+module, DESCRIPTION:desc } for module, desc of info.modules

		
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

			grunt.log.ok 'Full documentation generated.'



	# cleanup
	grunt.task.registerTask 'doc_cleanup', '', ()->
		util.delete [
			out_libs+'/**/_*.js'
			src+'/tmpl/partials/index.handlebars'
			out+'/api.js'
			out+'/data.json'
			path.tmp
		]

		grunt.log.ok 'Documentation cleaned.'
	




	# main task
	grunt.task.registerTask 'doc', [
		'basedoc'
		'yuidoc'
		'less:doc'
		'cssmin:doc'
		'includes:doc'
		'uglify:doc'
		'doc_cleanup'
	]


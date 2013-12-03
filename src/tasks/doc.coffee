module.exports = (grunt) ->
	grunt.log.ok 'doc loaded'

	_          = require 'lodash'
	preprocess = require 'preprocess'
	marked     = require 'marked'

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


	# config
	grunt.config.set name, data for name, data of {
		'yuidoc.doc':
			name:        pkg.name
			description: pkg.description
			version:     pkg.name+' v'+pkg.version
			url:         pkg.repository_url
			options: 
				paths:    out_libs
				themedir: src+'/tmpl/'
				outdir:   out+'/'
	}


	#config.uglify = { options: { preserveComments:'some', compress:{ global_defs: { DEBUG:false } }}};

	# doc
	grunt.task.registerTask 'readme', '', ()->

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

		grunt.file.write out_root+'/README.md', preprocess.preprocess(readme.tmpl, _.merge({},readme.data,{doc:false}))

		grunt.file.write src+'/tmpl/partials/index.handlebars', 
			'<div class="Home">' + 
				marked preprocess.preprocess( readme.tmpl, _.merge({},readme.data,{doc:true}) ).replace('### '+pkg.name, '# '+pkg.name) +
			'</div>'


		# modules desc
		module_tmpl = grunt.file.read src_tmpl+'/module.tmpl'
		for module, desc of info.modules
			grunt.file.write out_libs+'/'+module+'/_'+module+'.js', grunt.template.process(module_tmpl, { data: { MODULE: pkg.name+'.'+module, DESCRIPTION:desc }})
		
			
		util.delete out_libs+'/**/_*.js'





	# main task
	grunt.task.registerTask 'doc', [
		'readme'
		#'yuidoc:doc'
	]



#	util.delete out+'/assets', out+'/api.js', out_+'/data.json'
#
#
#
#config.clean.docless = {src: [tmp+'/doc-less.css', tmp+'/readme-doc.md', src_yuidoc+'/tmpl/partials/index.handlebars'],  options: { force:true }};
#
#config.yuidoc.compile = {
#	name:        '<%= pkg.name %>',
#	description: '<%= pkg.description %>',
#	version:     '<%= pkg.name %> v<%= pkg.version %>',
#	url:         '<%= pkg.repository_url %>',
#	options: {
#		paths:    out_build+'/'+config.pkg.name+'/',
#		themedir: src_yuidoc+'/tmpl/',
#		outdir:   out_doc+'/'
#	}
#};
#
#
#
#
#config.copy.docassets = {
#	expand: true,
#	cwd:    src_yuidoc+'/assets/',
#	src:    '**',
#	dest:   out_doc+'/assets/',
#	filter: 'isFile'
#};
#
#config.less.doc = { files: [
#	{ src:src_yuidoc+'/css/core.less', dest:tmp+'/doc-less.css' }
#]};
#
#config.cssmin.doc = { files: [ { src: [
#	src_yuidoc+'/css/libs/reset.css',
#	src_yuidoc+'/css/libs/normalize.css',
#	src_yuidoc+'/css/libs/html5boilerplate.css',
#	tmp+'/doc-less.css'
#], dest: out_doc+'/assets/core.css'
#}]};
#
#config.includes.doc = {
#	options: { includePath: src_yuidoc+'/js/' },
#	files: [{
#		src:  src_yuidoc+'/js/core.js',
#		dest: tmp+'/doc-core.js'
#	}]
#};
#
#config.uglify.doc = { files: [ {
#	src:  tmp+'/doc-core.js',
#	dest: out_doc+'/assets/core.js'
#}]};
#
#
#
#tasks.doc = _.without(tasks.build,'clean:placeholders');
#tasks.doc.push(
#	'preprocess:readme', 'preprocess:readme_doc',
#	'markdown:doc', 'yuidoc:compile', 'clean:placeholders',
#	'clean:doc','copy:docassets','less:doc','cssmin:doc','includes:doc','uglify:doc','clean:docless'
#);
#config.watch.doc = { files: [src_yuidoc+'/**/*', '!'+src_yuidoc+'/tmpl/partials/index.handlebars', src_tmpl+'/readme.tmpl'], tasks: 'doc' };
#
module.exports = function(grunt) {
	var
		sources        = 'sources',
		tmp            = sources+'/.tmp-kafe',
		sources_tmpl   = sources+'/tmpl',
		sources_kafe   = sources+'/kafe',
		sources_vendor = sources+'/vendor',
		sources_docs   = sources+'/docs',
		sources_tests  = sources+'/tests',
		out_root       = './',
		out_builds     = 'builds',
		out_docs       = 'docs',
		out_tests      = 'tests',


		tasks = { default:['docs','tests'] },
		
		config = {
			pkg: grunt.file.readJSON('package.json'),

			requirejs: {},
			jshint:    {},
			yuidoc:    {},
			markdown:  {},
			less:      {},
			cssmin:    {},
			copy:      {},
			clean:     { placeholders:{src: [out_builds+'/**/_*.js'],  options: { force:true }} },
			watch:     { all: { files: ['gruntfile.js', 'package.json'], tasks: 'default' } }
		},

		processReadme = function(src,keep,remove) {
			var	parts = src.split(new RegExp("{{/?"+remove+"}}",'g'));
			for (var i=1; i<parts.length; i=i+2) {
				parts[i] = '';
			}
			return parts.join('').replace(new RegExp("{{/?"+keep+"}}",'g'),'');
		}
	;

	grunt.template.addDelimiters('jscomment', '/* {%', '%} */');


	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-yuidoc');
	grunt.loadNpmTasks('grunt-markdown');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-cssmin');










	// Build kafe
	config.clean.core = {
		src: [out_builds+'/*'],  options: { force:true }
	};


	grunt.task.registerTask('kafe_versioning', '', function() {
		var
			versions = grunt.file.readJSON(sources_kafe+'/versions.json'),
			files    = grunt.file.expand(sources_kafe+'/**/*.js')
		;

		for (var i in files) {
			var
				parts        = files[i].split(sources_kafe+'/'),
				filename     = parts[parts.length-1],
				name         = filename.replace(/[\/\-]/,'.').substr(0,filename.length-3),
				module       = name.split('.'),
				package      = config.pkg.name,
				finalName    = (name.substring(0,1) !== '_') ? module.pop() : '',
				finalNameCap = finalName.charAt(0).toUpperCase() + finalName.slice(1),
				contents     = grunt.file.read(files[i]),
				version      = (name === config.pkg.name) ? config.pkg.version : versions[name]
			;

			contents = grunt.template.process(contents,{ data:{
				PACKAGE:     package,
				DESCRIPTION: config.pkg.description,
				DEFINITION:  config.pkg.definition,
				HOMEPAGE:    config.pkg.homepage,
				NAME:        name,
				NAME_FULL:   package+'.'+name,
				NAME_FINAL:  finalNameCap,
				NAME_ATTR:   package+finalName,
				NAME_JQUERY: package+finalNameCap,
				MODULE:      package+((module.length) ? '.'+module.join('.') : ''),
				VERSION:     version
			}});

			contents = grunt.template.process(contents,{ delimiters:'jscomment', data:{
				HEADER: "window."+package+".bonify({name:'"+name+"', version:'"+version+"', obj:(function("+package+",undefined){\n\n\tvar $ = "+package+".dependencies.jQuery;",
				FOOTER: "})(window."+package+")});",
			}});

			grunt.file.write(out_builds+'/kafe/'+filename, contents);
		}
	});


	grunt.task.registerTask('kafe_vendor', '', function() {
		var files = grunt.file.expand(sources_vendor+'/**/*.js');

		for (var i in files) {
			var
				parts    = files[i].split(sources_vendor+'/'),
				filename = parts[parts.length-1],
				contents = grunt.file.read(files[i]),
				pieces   = contents.split(/\}\s*else\s*{/)
			;

			// remove AMD requirement
			// if ( typeof define === "function" && define.amd ) {
			for (var j in pieces) {
				pieces[j] = pieces[j].replace(/if\s*\(\s*typeof\s+define\s*\=\=\=\s*['"]function['"]\s*\&\&\s*define\.amd\s*\)\s*\{[\s\S]*/gi, '/* <kafe replacement> */ if (false) { var x=false; /* </kafe replacement> */');
			}
			contents = pieces.join('} else {');

			grunt.file.write(out_builds+'/vendor/'+filename, contents);
		}
	});

	config.copy.resources = {
		expand: true,
		cwd:    sources_vendor+'/resources/',
		src:    '**',
		dest:   out_builds+'/vendor-resources/',
		filter: 'isFile'
	};



	config.jshint.core = {
		src: [out_builds+'/kafe/**/*.js'],
		options: {
			'-W061': true   // eval can be harmful
		}
	};

	tasks.core_docs = ['clean:core','kafe_versioning','kafe_vendor','jshint:core','copy:resources'];
	tasks.core = tasks.core_docs.slice(0);
	tasks.core.push('clean:placeholders');










	// Tests
	config.requirejs.test = {
		options: {
			baseUrl:  sources_tests+'/',
			name:     'kafe',
			include:  [
				'date',               // 2 methods pending
//				'form',
//				'geolocation',        // difficult to automate
				'number',
				'storage',
				'string',
				'string-encrypt',
				'string-validate',
//				'style',
				'url',

//				'cms/drupal',
//				'cms/magento',
//				'cms/sitecore',

//				'ext/addthis',
//				'ext/bbq',
//				'ext/colorbox',
//				'ext/disqus',
//				'ext/facebook',
//				'ext/flickr',
//				'ext/googlemaps',
//				'ext/soundcloud',
//				'ext/twitter',
//				'ext/youtube',
//
//				'plugin/carousel',
//				'plugin/menu',
//				'plugin/qrcode',
//				'plugin/sticky',
			],
			out:      out_tests+'/tests.js',
			optimize: 'none',
			preserveLicenseComments: true,
			skipModuleInsertion:     true,
			findNestedDependencies:  true,
			pragmasOnSave:           { excludeRequire: true }
		}
	};
	
	config.copy.tests = {
		expand: true,
		cwd:    sources_tests+'/',
		src:    '*.html',
		dest:   out_tests+'/',
		filter: 'isFile'
	};

	tasks.tests        = ['requirejs:test', 'copy:tests'];
	config.watch.tests = { files: [sources_tests+'/**/*.js', '!'+sources_tests+'/libs/*'], tasks:'tests' };










	// Docs
	config.yuidoc.compile = {
		name:        '<%= pkg.name %>',
		description: '<%= pkg.description %>',
		version:     '<%= pkg.name %> v<%= pkg.version %>',
		url:         '<%= pkg.repository_url %>',
		options: {
			paths:    out_builds+'/kafe/',
			themedir: sources_docs+'/tmpl/',
			outdir:   out_docs+'/'
		}
	};

	grunt.task.registerTask('kafe_readme', '', function() {
		var content = grunt.template.process( grunt.file.read(sources_tmpl+'/readme.tmpl'), { data:{
			PACKAGE:     config.pkg.name,
			VERSION:     config.pkg.version,
			DESCRIPTION: config.pkg.description,
			DEFINITION:  config.pkg.definition,
			REPO:        'https://github.com/absolunet/'+config.pkg.name,
			REPO_URL:    'https://github.com/absolunet/'+config.pkg.name+'/tree/master',
			HOMEPAGE:    config.pkg.homepage
		}});

		grunt.file.write(out_root+'/README.md', processReadme(content,'MD','DOC'));
		grunt.file.write(tmp+'/readme-docs.md', processReadme(content,'DOC','MD'));
	});

	config.markdown.docs = {
		files:   [ { src: tmp+'/readme-docs.md', dest: sources_docs+'/tmpl/partials/index.handlebars'}],
		options: {
			preCompile: function(src, context) {
				return src.replace('### '+config.pkg.name, '# '+config.pkg.name);
			},
			template: sources_tmpl+'/doc-home.jst'
		}
	};

	config.clean.docs     = {src: [out_docs+'/assets',out_docs+'/api.js',out_docs+'/data.json'],  options: { force:true }};
	config.clean.docsless = {src: [tmp+'/docs-less.css', tmp+'/readme-docs.md', sources_docs+'/tmpl/partials/index.handlebars'],  options: { force:true }};

	config.copy.docsassets = {
		expand: true,
		cwd:    sources_docs+'/assets/',
		src:    '**',
		dest:   out_docs+'/assets/',
		filter: 'isFile'
	};

	config.less.docs = { files: [
		{ src:sources_docs+'/css/core.less', dest:tmp+'/docs-less.css' }
	]};

	config.cssmin.docs = { files: [ { src: [
		sources_docs+'/css/libs/reset.css',
		sources_docs+'/css/libs/normalize.css',
		sources_docs+'/css/libs/html5boilerplate.css',
		tmp+'/docs-less.css'
	], dest: out_docs+'/assets/core.css'
	}]};

	config.requirejs.docs = { options: {
		baseUrl:             sources_docs+'/js/',
		name:                'core',
		out:                 out_docs+'/assets/core.js',
		optimize:            'uglify',
		skipModuleInsertion: true,
		pragmasOnSave:       { excludeRequire: true }
	}};



	tasks.docs = ['kafe_readme','markdown:docs','core_docs','yuidoc:compile','clean:docs','copy:docsassets','less:docs','cssmin:docs','requirejs:docs','clean:docsless','clean:placeholders'];
	config.watch.docs = { files: [sources_docs+'/**/*', '!'+sources_docs+'/tmpl/partials/index.handlebars', sources_tmpl+'/readme.tmpl'], tasks: 'docs' };



	// --------------------------------
	// GRUNT
	// --------------------------------
	grunt.initConfig(config);

	// tasks
	for (var name in tasks) {
		grunt.registerTask(name, tasks[name]);
	}
};

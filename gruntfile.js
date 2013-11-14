module.exports = function(grunt) {
	var
		src        = 'src',
		tmp        = src+'/.tmp-kafe',
		src_tmpl   = src+'/tmpl',
		src_kafe   = src+'/kafe',
		src_vendor = src+'/vendor',
		src_yuidoc = src+'/yuidoc',
		src_qunit  = src+'/qunit',
		out_root   = './',
		out_build  = 'build',
		out_doc    = 'doc',
		out_test   = 'test',


		tasks = { default:['doc','test'] },
		
		config = {
			pkg: grunt.file.readJSON('package.json'),

			requirejs: {},
			jshint:    {},
			yuidoc:    {},
			markdown:  {},
			less:      {},
			cssmin:    {},
			copy:      {},
			clean:     { placeholders:{src: [out_build+'/**/_*.js'],  options: { force:true }} },
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
		src: [out_build+'/*'],  options: { force:true }
	};


	grunt.task.registerTask('kafe_core', '', function() {
		var
			versions = grunt.file.readJSON(src_kafe+'/versions.json'),
			files    = grunt.file.expand(src_kafe+'/**/*.js')
		;

		for (var i in files) {
			var
				parts        = files[i].split(src_kafe+'/'),
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

			grunt.file.write(out_build+'/kafe/'+filename, contents);
		}
	});


	grunt.task.registerTask('kafe_vendor', '', function() {
		var files = grunt.file.expand(src_vendor+'/**/*.js');

		for (var i in files) {
			var
				parts    = files[i].split(src_vendor+'/'),
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

			grunt.file.write(out_build+'/vendor/'+filename, contents);
		}
	});

	config.copy.resources = {
		expand: true,
		cwd:    src_vendor+'/resources/',
		src:    '**',
		dest:   out_build+'/vendor-resources/',
		filter: 'isFile'
	};



	config.jshint.core = {
		src: [out_build+'/kafe/**/*.js'],
		options: {
			'-W061': true   // eval can be harmful
		}
	};

	tasks.core_doc = ['clean:core','kafe_core','kafe_vendor','jshint:core','copy:resources'];
	tasks.core = tasks.core_doc.slice(0);
	tasks.core.push('clean:placeholders');










	// Test
	config.requirejs.test = {
		options: {
			baseUrl:  src_qunit+'/',
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
			out:      out_test+'/test.js',
			optimize: 'none',
			preserveLicenseComments: true,
			skipModuleInsertion:     true,
			findNestedDependencies:  true,
			pragmasOnSave:           { excludeRequire: true }
		}
	};
	
	config.copy.test = {
		expand: true,
		cwd:    src_qunit+'/',
		src:    '*.html',
		dest:   out_test+'/',
		filter: 'isFile'
	};

	tasks.test        = ['requirejs:test', 'copy:test'];
	config.watch.test = { files: [src_qunit+'/**/*.js', '!'+src_qunit+'/libs/*'], tasks:'test' };










	// Doc
	config.yuidoc.compile = {
		name:        '<%= pkg.name %>',
		description: '<%= pkg.description %>',
		version:     '<%= pkg.name %> v<%= pkg.version %>',
		url:         '<%= pkg.repository_url %>',
		options: {
			paths:    out_build+'/kafe/',
			themedir: src_yuidoc+'/tmpl/',
			outdir:   out_doc+'/'
		}
	};

	grunt.task.registerTask('kafe_readme', '', function() {
		var content = grunt.template.process( grunt.file.read(src_tmpl+'/readme.tmpl'), { data:{
			PACKAGE:     config.pkg.name,
			VERSION:     config.pkg.version,
			DESCRIPTION: config.pkg.description,
			DEFINITION:  config.pkg.definition,
			REPO:        'https://github.com/absolunet/'+config.pkg.name,
			REPO_URL:    'https://github.com/absolunet/'+config.pkg.name+'/tree/master',
			HOMEPAGE:    config.pkg.homepage
		}});

		grunt.file.write(out_root+'/README.md', processReadme(content,'MD','DOC'));
		grunt.file.write(tmp+'/readme-doc.md', processReadme(content,'DOC','MD'));
	});

	config.markdown.doc = {
		files:   [ { src: tmp+'/readme-doc.md', dest: src_yuidoc+'/tmpl/partials/index.handlebars'}],
		options: {
			preCompile: function(src, context) {
				return src.replace('### '+config.pkg.name, '# '+config.pkg.name);
			},
			template: src_tmpl+'/doc-home.jst'
		}
	};

	config.clean.doc     = {src: [out_doc+'/assets',out_doc+'/api.js',out_doc+'/data.json'],  options: { force:true }};
	config.clean.docless = {src: [tmp+'/doc-less.css', tmp+'/readme-doc.md', src_yuidoc+'/tmpl/partials/index.handlebars'],  options: { force:true }};

	config.copy.docassets = {
		expand: true,
		cwd:    src_yuidoc+'/assets/',
		src:    '**',
		dest:   out_doc+'/assets/',
		filter: 'isFile'
	};

	config.less.doc = { files: [
		{ src:src_yuidoc+'/css/core.less', dest:tmp+'/doc-less.css' }
	]};

	config.cssmin.doc = { files: [ { src: [
		src_yuidoc+'/css/libs/reset.css',
		src_yuidoc+'/css/libs/normalize.css',
		src_yuidoc+'/css/libs/html5boilerplate.css',
		tmp+'/doc-less.css'
	], dest: out_doc+'/assets/core.css'
	}]};

	config.requirejs.doc = { options: {
		baseUrl:             src_yuidoc+'/js/',
		name:                'core',
		out:                 out_doc+'/assets/core.js',
		optimize:            'uglify',
		skipModuleInsertion: true,
		pragmasOnSave:       { excludeRequire: true }
	}};



	tasks.doc = ['kafe_readme','markdown:doc','core_doc','yuidoc:compile','clean:doc','copy:docassets','less:doc','cssmin:doc','requirejs:doc','clean:docless','clean:placeholders'];
	config.watch.doc = { files: [src_yuidoc+'/**/*', '!'+src_yuidoc+'/tmpl/partials/index.handlebars', src_tmpl+'/readme.tmpl'], tasks: 'doc' };



	// --------------------------------
	// GRUNT
	// --------------------------------
	grunt.initConfig(config);

	// tasks
	for (var name in tasks) {
		grunt.registerTask(name, tasks[name]);
	}
};

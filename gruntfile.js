module.exports = function(grunt) {
	var
		tasks = { default:['docs','tests'] },
		
		config = {
			pkg: grunt.file.readJSON('package.json'),

			requirejs: {},
			jshint:    {},
			yuidoc:    {},
			copy:      {},
			clean:     { placeholders:{src: ['builds/**/_*.js'],  options: { force:true }} },
			watch:     { all: { files: ['gruntfile.js', 'package.json', 'sources/core/**'], tasks: 'default' } }
		}
	;

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-yuidoc');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-requirejs');

	grunt.template.addDelimiters('jscomment', '/* {%', '%} */');





	// Build kafe
	config.clean.core = {
		src: ['builds/*'],  options: { force:true }
	};


	grunt.task.registerTask('kafe_versioning', '', function() {
		var
			versions = grunt.file.readJSON('sources/core/versions.json'),
			files    = grunt.file.expand('sources/core/kafe/**/*.js')
		;

		for (var i in files) {
			var
				parts     = files[i].split('sources/core/kafe/'),
				filename  = parts[parts.length-1],
				name      = filename.replace(/[\/\-]/,'.').substr(0,filename.length-3),
				module    = name.split('.'),
				finalName = (name.substring(0,1) !== '_') ? module.pop() : '',
				contents  = grunt.file.read(files[i])
			;

			contents = grunt.template.process(contents,{ data:{
				PACKAGE:     config.pkg.name,
				NAME:        name,
				NAME_FULL:   config.pkg.name+'.'+name,
				NAME_FINAL:  finalName.charAt(0).toUpperCase() + finalName.slice(1),
				NAME_ATTR:   config.pkg.name+finalName,
				NAME_JQUERY: config.pkg.name+(finalName.charAt(0).toUpperCase() + finalName.slice(1)),
				MODULE:      config.pkg.name+((module.length) ? '.'+module.join('.') : ''),
				VERSION:     versions[name]
			}});

			contents = grunt.template.process(contents,{ delimiters:'jscomment', data:{
				HEADER: "window."+config.pkg.name+".bonify({name:'"+name+"', version:'"+versions[name]+"', obj:(function("+config.pkg.name+",undefined){\n\n\tvar $ = "+config.pkg.name+".dependencies.jQuery;",
				FOOTER: "})(window.kafe)});",
			}});

			grunt.file.write('builds/kafe/'+filename, contents);
		}
	});


	grunt.task.registerTask('kafe_vendor', '', function() {
		var files = grunt.file.expand('sources/core/vendor/**/*.js');

		for (var i in files) {
			var
				parts    = files[i].split('sources/core/vendor/'),
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

			grunt.file.write('builds/vendor/'+filename, contents);
		}
	});

	config.copy.resources = {
		expand: true,
		cwd:    'sources/core/resources/',
		src:    '**',
		dest:   'builds/vendor-resources/',
		filter: 'isFile'
	};



	config.jshint.core = {
		src: ['builds/kafe/**/*.js'],
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
			baseUrl:  'sources/tests/',
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
			out:      'tests/build.js',
			optimize: 'none',
			preserveLicenseComments: true,
			skipModuleInsertion:     true,
			findNestedDependencies:  true,
			pragmasOnSave:           { excludeRequire: true }
		}
	};
	tasks.tests        = ['requirejs:test'];
	config.watch.tests = { files: ['sources/tests/**/*.js', '!sources/tests/libs/*'], tasks:'tests' };








	// Docs
	config.yuidoc.compile = {
		name:        '<%= pkg.name %>',
		description: '<%= pkg.description %>',
		version:     '<%= pkg.name %> v.<%= pkg.version %>',
		url:         'http://github.com/absolunet/<%= pkg.name %>',
		options: {
			paths:    'builds/kafe/',
			themedir: 'sources/docs/',
			outdir:   'docs/'
		}
	};
	tasks.docs = ['core_docs','yuidoc:compile','clean:placeholders'];
	config.watch.docs = { files: ['sources/docs/*'], tasks: 'docs' };










	// --------------------------------
	// GRUNT
	// --------------------------------
	grunt.initConfig(config);

	// tasks
	for (var name in tasks) {
		grunt.registerTask(name, tasks[name]);
	}
};

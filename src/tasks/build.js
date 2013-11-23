grunt.task.loadNpmTasks('grunt-contrib-jshint');
config.jshint = {};


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

		grunt.file.write(out_build+'/'+config.pkg.name+'/'+filename, contents);
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
	src: [out_build+'/'+config.pkg.name+'/**/*.js'],
	options: {
		'-W061': true   // eval can be harmful
	}
};

tasks.core_doc = ['clean:core','kafe_core','kafe_vendor','jshint:core','copy:resources'];
tasks.core = tasks.core_doc.slice(0);
tasks.core.push('clean:placeholders');

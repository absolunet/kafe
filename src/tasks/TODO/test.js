grunt.task.loadNpmTasks('grunt-includes');
config.includes = { options: {
	includeRegexp:  /^\s*\/\/\s@import\s'([^']+)'\s*$/,
	duplicates:     false,
	filenameSuffix: '.js'
}};

config.includes.test = {
	options: { includePath:src_qunit+'/', },
	src:  src_qunit+'/test.js',
	dest: out_test+'/test.js'
};

config.copy.test = {
	expand: true,
	cwd:    src_qunit+'/',
	src:    '*.html',
	dest:   out_test+'/',
	filter: 'isFile'
};

tasks.test        = ['includes:test', 'copy:test'];
config.watch.test = { files: [src_qunit+'/**/*.js', '!'+src_qunit+'/libs/*'], tasks:'test' };

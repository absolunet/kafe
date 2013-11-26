grunt.task.loadNpmTasks('grunt-contrib-yuidoc');
config.yuidoc = {};

grunt.task.loadNpmTasks('grunt-preprocess');
config.preprocess = {};

grunt.task.loadNpmTasks('grunt-markdown');
config.markdown = {};

grunt.task.loadNpmTasks('grunt-contrib-less');
config.less = {};

grunt.task.loadNpmTasks('grunt-contrib-cssmin');
config.cssmin = {};

grunt.task.loadNpmTasks('grunt-contrib-uglify');
config.uglify = { options: { preserveComments:'some', compress:{ global_defs: { DEBUG:false } }}};



var readme_data = {
	package:     config.pkg.name,
	version:     config.pkg.version,
	description: config.pkg.description,
	definition:  config.pkg.definition,
	repo:        'https://github.com/absolunet/'+config.pkg.name,
	repo_url:    'https://github.com/absolunet/'+config.pkg.name+'/tree/master',
	homepage:    config.pkg.homepage
};

config.preprocess['readme'] = {
	options: { context:merge(readme_data,{doc:false}), inline:true },
	src:     src_tmpl+'/readme.tmpl',
	dest:    out_root+'/README.md'
};

config.preprocess['readme_doc'] = {
	options: { context:merge(readme_data,{doc:true}), inline:true },
	src:     src_tmpl+'/readme.tmpl',
	dest:    tmp+'/readme-doc.md'
};

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


config.yuidoc.compile = {
	name:        '<%= pkg.name %>',
	description: '<%= pkg.description %>',
	version:     '<%= pkg.name %> v<%= pkg.version %>',
	url:         '<%= pkg.repository_url %>',
	options: {
		paths:    out_build+'/'+config.pkg.name+'/',
		themedir: src_yuidoc+'/tmpl/',
		outdir:   out_doc+'/'
	}
};




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

config.includes.doc = {
	options: { includePath: src_yuidoc+'/js/' },
	files: [{
		src:  src_yuidoc+'/js/core.js',
		dest: tmp+'/doc-core.js'
	}]
};

config.uglify.doc = { files: [ {
	src:  tmp+'/doc-core.js',
	dest: out_doc+'/assets/core.js'
}]};






tasks.doc = ['preprocess:readme','preprocess:readme_doc','markdown:doc','core_doc','yuidoc:compile','clean:doc','copy:docassets','less:doc','cssmin:doc','includes:doc','uglify:doc','clean:docless','clean:placeholders'];
config.watch.doc = { files: [src_yuidoc+'/**/*', '!'+src_yuidoc+'/tmpl/partials/index.handlebars', src_tmpl+'/readme.tmpl'], tasks: 'doc' };

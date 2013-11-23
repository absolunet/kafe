grunt.task.loadNpmTasks('grunt-contrib-yuidoc');
config.yuidoc = {};

grunt.task.loadNpmTasks('grunt-markdown');
config.markdown = {};

grunt.task.loadNpmTasks('grunt-contrib-less');
config.less = {};

grunt.task.loadNpmTasks('grunt-contrib-cssmin');
config.cssmin = {};

grunt.task.loadNpmTasks('grunt-contrib-uglify');
config.uglify = { options: { preserveComments:'some', compress:{ global_defs: { DEBUG:false } }}};



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

grunt.task.registerTask(config.pkg.name+'_readme', '', function() {
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


tasks.doc = [config.pkg.name+'_readme','markdown:doc','core_doc','yuidoc:compile','clean:doc','copy:docassets','less:doc','cssmin:doc','includes:doc','uglify:doc','clean:docless','clean:placeholders'];
config.watch.doc = { files: [src_yuidoc+'/**/*', '!'+src_yuidoc+'/tmpl/partials/index.handlebars', src_tmpl+'/readme.tmpl'], tasks: 'doc' };

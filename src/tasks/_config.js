'use strict';


module.exports = function(grunt) {
	global.packageVersion = '3.2.8';

	for (const task of ['grunt-contrib-watch', 'grunt-contrib-less', 'grunt-contrib-cssmin', 'grunt-contrib-jshint', 'grunt-contrib-uglify', 'grunt-includes']) {
		grunt.task.loadNpmTasks(task);
	}

	const path = {
		temporaryLocal: 'src/.tmp-kafe',

		source: {
			kafe:      'src/kafe',
			qunit:     'src/qunit',
			resources: 'src/resources',
			tmpl:      'src/tmpl',
			yuidoc:    'src/yuidoc'
		},

		out: {
			root: '.',
			dist: 'dist',
			docs: 'docs',  // eslint-disable-line unicorn/prevent-abbreviations
			test: 'test'
		}
	};

	const util = {
		'copy': function(source, destination, filter = '**') {
			return grunt.file.expand({ cwd: source, filter: 'isFile' }, filter).map((file) => {
				return grunt.file.copy(source + file, destination + file);
			});
		},

		'delete': function(...source) {
			const results = [];

			for (const pattern of source) {
				for (const file of grunt.file.expand({ cwd: path.out.root }, pattern)) {
					results.push(grunt.file.delete(file, { force: true }));
				}
			}

			return results;
		}
	};


	const config = {
		'util': util,
		'internal': {
			path: path,
			pkg:  grunt.file.readJSON('package.json'),  // eslint-disable-line unicorn/prevent-abbreviations
			info: grunt.file.readJSON(`${path.source.kafe}/~info.json`)
		},
		'includes.options': {
			includeRegexp: /^\s*\/\/=\srequire\s'(?<quote>[^']+)'\s*/u,
			duplicates:  false,
			filenameSuffix: '.js'
		},
		'uglify.options': {
			preserveComments: 'some',
			compress: {
				global_defs: {  // eslint-disable-line camelcase
					DEBUG: false
				}
			}
		},
		'watch.all': {
			files: ['gruntfile.js'],
			tasks: 'default'
		}
	};

	for (const name in config) {
		if (Object.prototype.hasOwnProperty.call(config, name)) {
			grunt.config.set(name, config[name]);
		}
	}

	grunt.task.registerTask('all', ['core', 'docs']);

	return grunt.task.registerTask('default', '', () => {
		return grunt.task.run('core', 'docs');
	});
};

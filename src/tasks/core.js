'use strict';

const fs = require('fs');
const preprocess = require('preprocess');


module.exports = function(grunt) {
	const path   = grunt.config.get('internal.path');
	const config = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
	const util   = grunt.config.get('util');

	const [, packageName] = config.name.split('/');

	const source = path.source.kafe;
	const out    = `${path.out.dist}`;

	const jshintTask = {
		'jshint.dist_core': {
			src: [`${out}/**/*.js`],  // eslint-disable-line unicorn/prevent-abbreviations
			options: {
				'-W061': true
			}
		}
	};
	for (const name in jshintTask) {
		if (Object.prototype.hasOwnProperty.call(jshintTask, name)) {
			grunt.config.set(name, jshintTask[name]);
		}
	}


	// task
	grunt.task.registerTask('build_core', '', () => {
		const info = grunt.config.get('internal.info');

		util.delete(out);

		for (const file of grunt.file.expand(`${source}/**/*.js`)) {
			const parts        = file.split(`${source}/`);
			const filename     = parts[parts.length - 1];
			const name         = filename.replace(/[/-]/u, '.').substr(0, filename.length - 3);
			const module       = name.split('.');
			const finalName    = name.substring(0, 1) !== '_' ? module.pop() : '';
			const finalNameCap = finalName.charAt(0).toUpperCase() + finalName.slice(1);
			const version      = name === packageName ? global.packageVersion : info.versions[name];
			let contents       = grunt.file.read(file);

			contents = preprocess.preprocess(contents, {
				PACKAGE:     packageName,
				DESCRIPTION: config.description,
				DEFINITION:  config.definition,
				HOMEPAGE:    config.homepage,
				NAME:        name,
				NAME_FULL:   `${packageName}.${name}`,
				NAME_FINAL:  finalNameCap,
				NAME_ATTR:   packageName + finalName,
				NAME_JQUERY: packageName + finalNameCap,
				MODULE:      `${packageName}${module.length !== 0 ? `.${module.join('.')}` : ''}`,
				VERSION:     version,
				LICENSE:     `https://github.com/absolunet/${packageName}/tree/master/LICENSE.md`,
				AUTHOR:      config.author.name,
				SITE:        config.author.url,
				YEAR:        grunt.template.today('yyyy')
			});

			contents = preprocess.preprocess(contents, {
				header: `(function(global, undefined) { var ${packageName} = global.${packageName}, $ = ${packageName}.dependencies.jQuery; ${packageName}.bonify({name:'${name}', version:'${version}', obj:(function(){`,
				footer: "})()}); })(typeof window !== 'undefined' ? window : this);"
			}, 'js');

			grunt.file.write(`${out}/${filename}`, contents);
		}

		return grunt.log.ok(`${packageName} core built.`);
	});

	// main task
	return grunt.task.registerTask('core', ['build_core', 'jshint:dist_core']);
};

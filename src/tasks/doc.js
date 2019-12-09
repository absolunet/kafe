'use strict';

const fs         = require('fs');
const marked     = require('marked');
const preprocess = require('preprocess');
const Y          = require('yuidocjs');


module.exports = (grunt) => {
	const path   = grunt.config.get('internal.path');
	const config = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
	const util   = grunt.config.get('util');

	const [, packageName] = config.name.split('/');

	const temporaryLocal = `${path.tmp_local}/vendor`;
	const source         = path.source.yuidoc;
	const sourceTmpl     = path.source.tmpl;
	const out            = path.out.docs;
	const outLibs        = `${path.out.dist}`;

	// doc data
	const docdata = {
		'package':       packageName,
		'version':       config.version,
		'description':   config.description,
		'definition':    config.definition,
		'repo':         `https://github.com/absolunet/${packageName}`,
		'repo_url':     `https://github.com/absolunet/${packageName}/tree/master`,
		'repository':   config.repository.url,
		'bugs':         config.bugs.url,
		'license':      `https://github.com/absolunet/${packageName}/blob/master/license`,
		'license_name': 'MIT',
		'homepage':     config.homepage,
		'year':         grunt.template.today('yyyy'),
		'author':       config.author.name,
		'site':         config.author.url
	};

	/* eslint-disable unicorn/prevent-abbreviations */
	const tasks = {
		'less.docs': {
			files: [
				{
					src: `${source}/css/core.less`,
					dest: `${temporaryLocal}/docs-less.css`
				}
			]
		},
		'cssmin.docs': {
			files: [
				{
					src: [
						`${source}/css/libs/reset.css`,
						`${source}/css/libs/normalize.css`,
						`${source}/css/libs/html5boilerplate.css`,
						`${temporaryLocal}/docs-less.css`
					],
					dest: `${out}/assets/core.css`
				}
			]
		},
		'includes.docs': {
			options: {
				includePath: `${source}/js/`
			},
			files: [
				{
					src: `${source}/js/core.js`,
					dest: `${temporaryLocal}/docs-core.js`
				}
			]
		},
		'uglify.docs': {
			files: [
				{
					src: `${temporaryLocal}/docs-core.js`,
					dest: `${out}/assets/core.js`
				}
			]
		},
		'watch.docs': {
			files: [`${source}/**/*`, `!${source}/tmpl/partials/index.handlebars`, `${sourceTmpl}/*.tmpl`],
			tasks: 'docs'
		}
	};
	/* eslint-enable unicorn/prevent-abbreviations */

	for (const name in tasks) {
		if (Object.prototype.hasOwnProperty.call(tasks, name)) {
			grunt.config.set(name, tasks[name]);
		}
	}





	// yuidoc
	grunt.task.registerTask('yuidoc', '', function() {
		const done = this.async();

		const info = grunt.config.get('internal.info');

		// homepage
		docdata.docs = true;  // eslint-disable-line unicorn/prevent-abbreviations

		grunt.file.write(`${source}/tmpl/partials/index.handlebars`, `<div class="Home">${marked(grunt.file.read('./readme.md').replace(`### ${packageName}`, `# ${packageName}`))}</div>`);


		for (const module in info.modules) {
			if (Object.prototype.hasOwnProperty.call(info.modules, module)) {
				preprocess.preprocessFileSync(`${sourceTmpl}/module.tmpl`, `${outLibs}/${module}/_${module}.js`, {
					MODULE: `${packageName}.${module}`,
					DESCRIPTION: info.modules[module]
				});
			}
		}

		// compiler
		let options = {
			quiet: true,
			paths: [outLibs],
			themedir: `${source}/tmpl/`,
			outdir: `${out}/`,
			project: {
				name: packageName,
				description: config.description,
				version: `${packageName} ${config.version}`,
				url: config.repository_url
			}
		};

		const json = new Y.YUIDoc(options).run();
		options = Y.Project.mix(json, options);

		return new Y.DocBuilder(options, json).compile(() => {
			util.delete([`${out}/assets`]);
			done();

			// base assets
			util.copy(`${source}/assets/`, `${out}/assets/`);

			return grunt.log.ok('Full documentation generated.');
		});
	});


	// cleanup
	grunt.task.registerTask('docs_cleanup', '', () => {
		util.delete([`${outLibs}/**/_*.js`, `${source}/tmpl/partials/index.handlebars`, `${out}/api.js`, `${out}/data.json`, temporaryLocal]);

		return grunt.log.ok('Documentation cleaned.');
	});


	// main task
	return grunt.task.registerTask('docs', ['yuidoc', 'less:docs', 'cssmin:docs', 'includes:docs', 'uglify:docs', 'docs_cleanup']);
};

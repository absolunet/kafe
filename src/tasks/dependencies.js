config.clean.vendor = {
	src: [out_build+'/vendor', out_build+'/vendor-resources'], options: { force:true }
};

grunt.task.registerTask('get_vendor', '', function() {
	var
		done  = this.async(),

		files = [
			{ dest:'lo-dash',           src:'https://raw.github.com/lodash/lodash/master/dist/lodash.js' },
			{ dest:'underscore.string', src:'https://raw.github.com/epeli/underscore.string/master/lib/underscore.string.js' },
			{ dest:'modernizr',         src:'http://modernizr.com/downloads/modernizr-latest.js' },

			{ dest:'accounting',        src:'https://raw.github.com/josscrowcroft/accounting.js/master/accounting.js' },
			{ dest:'cssua',             src:'https://bitbucket.org/mckamey/cssuseragent/raw/tip/cssua.js' },
			{ dest:'json2',             src:'https://raw.github.com/douglascrockford/JSON-js/master/json2.js' },
			{ dest:'jsrender',          src:'https://raw.github.com/BorisMoore/jsrender/master/jsrender.js' },
			{ dest:'markerclusterer',   src:'http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/src/markerclusterer.js' },
			{ dest:'masonry',           src:'http://masonry.desandro.com/masonry.pkgd.js' },
			{ dest:'qrcode',            src:'http://d-project.googlecode.com/svn/trunk/misc/qrcode/js/qrcode.js' },
			{ dest:'simplexml',         src:'https://simplexmljs.googlecode.com/svn/trunk/simplexml.js' },

			{ dest:'jquery/bbq',           src: 'https://raw.github.com/cowboy/jquery-bbq/master/jquery.ba-bbq.js' },
			{ dest:'jquery/colorbox',      src: 'https://raw.github.com/jackmoore/colorbox/master/jquery.colorbox.js' },
			{ dest:'jquery/cookie',        src: 'https://raw.github.com/carhartl/jquery-cookie/master/jquery.cookie.js' },
			{ dest:'jquery/hashchange',    src: 'https://raw.github.com/cowboy/jquery-hashchange/master/jquery.ba-hashchange.js' },
			{ dest:'jquery/inputmask',     src: 'https://raw.github.com/RobinHerbots/jquery.inputmask/2.x/dist/jquery.inputmask.bundle.js'},
			{ dest:'jquery/isotope',       src: 'https://raw.github.com/desandro/isotope/master/jquery.isotope.js' },
			{ dest:'jquery/jcarousellite', src: 'https://raw.github.com/kswedberg/jquery-carousel-lite/master/jcarousellite.js' },
			{ dest:'jquery/json',          src: 'https://jquery-json.googlecode.com/svn/trunk/src/jquery.json.js' },
			{ dest:'jquery/powertip',      src: 'http://stevenbenner.github.io/jquery-powertip/scripts/jquery.powertip.js' },
			{ dest:'jquery/scrollto',      src: 'https://raw.github.com/flesler/jquery.scrollTo/master/jquery.scrollTo.js' },

			{ dest:'jquery/jscrollpane',  src:'https://raw.github.com/vitch/jScrollPane/master/script/jquery.jscrollpane.js', dependencies:['jquery/mousewheel', 'jquery/mwheelintent'] },
			{ dest:'jquery/mousewheel',   src:'https://raw.github.com/brandonaaron/jquery-mousewheel/master/jquery.mousewheel.js' },
			{ dest:'jquery/mwheelintent', src:'https://raw.github.com/vitch/jScrollPane/master/script/mwheelIntent.js' },
		]
	;
	
	async.map(files,
		function(item, callback){
			request(item.src, function(error, response, body){
				if (!error && response.statusCode == 200) {
					item.content = body;
					callback(null, item);
				} else {
					callback(error);
				}
			});
		},
		function(error, results) {
			if (error) {
				grunt.log.error(error);
				done(false);
			} else {

				var addImport = function(file) { return '// @import \'libs/vendor/'+file+'\''; };

				for (var i in results) {
					if (results[i].dependencies) {
						results[i].content = _.map(results[i].dependencies, addImport).join('\n')+'\n\n'+results[i].content;
					}
					grunt.file.write(out_build+'/vendor/'+results[i].dest+'.js', results[i].content.replace('window.jQuery','jQuery'));
				}

				grunt.log.ok('Downloaded ' + results.length.toString().cyan + ' files.');
				done();
			}
		}
	);
});






config.copy.resources = {
	expand: true,
	cwd:    src_resources+'/',
	src:    '**',
	dest:   out_build+'/vendor-resources/',
	filter: 'isFile'
};

grunt.task.registerTask('get_vendor_resources', '', function() {
	var
		done  = this.async(),

		//replace with '.'

		files = [
			{
				name: 'jquery-jscrollpane',
				files: [ { dest:'jscrollpane.less', src:'https://raw.github.com/vitch/jScrollPane/master/style/jquery.jscrollpane.css' } ]
			},
			{
				name: 'jquery-colorbox',
				files: [ { dest:'colorbox.zip', src:'https://github.com/jackmoore/colorbox/archive/master.zip' } ]
			}
		]
	;
	
	async.map(files,
		function(item, callback){
			var process = function(error, response, body){
				if (!error && response.statusCode == 200) {
					item.files[i].package = item.name;
					item.files[i].content = body;
					callback(null, item.files[i]);
				} else {
					callback(error);
				}
			};

			for (var i in item.files) {
				var options = {url:item.files[i].src};
				if (/\.zip$/.test(options.url)) {
					options.encoding = null;
				}

				request(options, process);
			}
		},
		function(error, results) {
			if (error) {
				grunt.log.error(error);
				done(false);
			} else {
				grunt.task.loadNpmTasks('grunt-zip');
				config.unzip = {};

				for (var i in results) {

					var dest = out_build+'/vendor-resources/'+results[i].package;
					grunt.file.write(dest+'/'+results[i].dest, results[i].content);
					
					if (/\.zip$/.test(results[i].dest)) {
						config.unzip[results[i].dest] = {
							src: dest+'/'+results[i].dest,
							dest: dest
						};
						grunt.task.run('unzip:'+results[i].dest);
					}
				}

				grunt.log.ok('Downloaded ' + results.length.toString().cyan + ' files.');
				done();
			}
		}
	);
});

config.copy.colorbox = {
	expand: true,
	cwd:    out_build+'/vendor-resources/jquery-colorbox/colorbox-master/',
	src:    'example*/**/*',
	dest:   out_build+'/vendor-resources/jquery-colorbox/',
	filter: 'isFile'
};


grunt.task.registerTask('process_colorbox', '', function() {
	var root = out_build+'/vendor-resources/jquery-colorbox';
	grunt.file.delete(root+'/colorbox-master', {force:true});
	grunt.file.delete(root+'/colorbox.zip', {force:true});

	var list = grunt.file.expand(root+'/*');

	for (var i in list) {
		grunt.file.delete(list[i]+'/index.html', {force:true});

		grunt.file.write(list[i]+'/colorbox.less',
			grunt.file.read(list[i]+'/colorbox.css')
				.replace(/url\(images\//g, "url('@{img-path}/vendor/jquery-colorbox/")
				.replace(/\.png\)/g,       ".png')")
				.replace(/\.gif\)/g,       ".gif')")

				.replace(/filter: progid/g, 'filter: ~"progid')
				.replace(/FFFFFF\);/g,      'FFFFFF)";')
		);

		grunt.file.delete(list[i]+'/colorbox.css', {force:true});
	}
	grunt.log.ok();
});








tasks.dependencies = ['clean:vendor','get_vendor','copy:resources', 'get_vendor_resources','copy:colorbox','process_colorbox'];

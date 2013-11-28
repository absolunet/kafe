config.clean.vendor = {
	src: [out_build+'/vendor', out_build+'/vendor-resources'], options: { force:true }
};

grunt.task.registerTask('kafe_vendor', '', function() {
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

			/*
			'jquery/bbq': '',
			'jquery/colorbox': '',
			'jquery/cookie': '',
			'jquery/hashchange': '',
			'jquery/isotope': '',
			'jquery/jcarousellite': '',
			'jquery/json': '',
			'jquery/mobile.events': '',
			'jquery/powertip': '',
			'jquery/scrollto': '',


			/*
			'jquery/inputmask'
			'jquery/inputmask/core'
			'jquery/inputmask/date.extensions'
			'jquery/inputmask/extensions'
			'jquery/inputmask/numeric.extensions'
			'jquery/inputmask/regex.extensions'

			'jquery/jscrollpane'
			'jquery/jscrollpane/core'
			'jquery/jscrollpane/mousewheel'
			'jquery/jscrollpane/mwheelIntent'
			*/
		]
	;



	async.map(files,
		function(item, callback){
			request(item.src, function(error, response, body){
				if (!error && response.statusCode == 200) {
					callback(null, {
						name: item.dest,
						content: body
					});
				} else {
					callback(error);
				}
			});
		},
		function(error, results) {
			if (error) {
				grunt.log.writeln(error);
				done(false);
			} else {
				for (var i in results) {
					grunt.file.write(out_build+'/vendor/'+results[i].name+'.js', results[i].content);
				}
				done();
			}
		}
	);

});

config.copy.resources = {
	expand: true,
	cwd:    src_vendor+'/resources/',
	src:    '**',
	dest:   out_build+'/vendor-resources/',
	filter: 'isFile'
};


tasks.dependencies = ['clean:vendor','kafe_vendor','copy:resources'];

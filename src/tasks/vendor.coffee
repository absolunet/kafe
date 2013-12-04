module.exports = (grunt) ->
	_       = require 'lodash'
	request = require 'request'
	async   = require 'async'
	AdmZip  = require 'adm-zip'

	path = grunt.config.get 'internal.path'
	pkg  = grunt.config.get 'internal.pkg'
	util = grunt.config.get 'util'

	src_resources = path.src.resources
	out           = path.out.dist+'/vendor'
	out_resources = out+'/resources'
	out_colorbox  = out_resources+'/jquery.colorbox'



	# get vendor
	grunt.task.registerTask 'get_vendor', '', ()->
		done  = this.async()

		util.delete out

		files = [
			{ dest:'lo-dash',           src:'https://raw.github.com/lodash/lodash/master/dist/lodash.js' }
			{ dest:'underscore.string', src:'https://raw.github.com/epeli/underscore.string/master/lib/underscore.string.js' }
			{ dest:'modernizr',         src:'http://modernizr.com/downloads/modernizr-latest.js' }

			{ dest:'accounting',        src:'https://raw.github.com/josscrowcroft/accounting.js/master/accounting.js' }
			{ dest:'cssua',             src:'https://bitbucket.org/mckamey/cssuseragent/raw/tip/cssua.js' }
			{ dest:'json2',             src:'https://raw.github.com/douglascrockford/JSON-js/master/json2.js' }
			{ dest:'jsrender',          src:'https://raw.github.com/BorisMoore/jsrender/master/jsrender.js' }
			{ dest:'markerclusterer',   src:'http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/src/markerclusterer.js' }
			{ dest:'masonry',           src:'http://masonry.desandro.com/masonry.pkgd.js' }
			{ dest:'qrcode',            src:'http://d-project.googlecode.com/svn/trunk/misc/qrcode/js/qrcode.js' }
			{ dest:'simplexml',         src:'https://simplexmljs.googlecode.com/svn/trunk/simplexml.js' }

			{ dest:'jquery.bbq',           src: 'https://raw.github.com/cowboy/jquery-bbq/master/jquery.ba-bbq.js' }
			{ dest:'jquery.colorbox',      src: 'https://raw.github.com/jackmoore/colorbox/master/jquery.colorbox.js' }
			{ dest:'jquery.cookie',        src: 'https://raw.github.com/carhartl/jquery-cookie/master/jquery.cookie.js' }
			{ dest:'jquery.hashchange',    src: 'https://raw.github.com/cowboy/jquery-hashchange/master/jquery.ba-hashchange.js' }
			{ dest:'jquery.inputmask',     src: 'https://raw.github.com/RobinHerbots/jquery.inputmask/2.x/dist/jquery.inputmask.bundle.js'}
			{ dest:'jquery.isotope',       src: 'https://raw.github.com/desandro/isotope/master/jquery.isotope.js' }
			{ dest:'jquery.jcarousellite', src: 'https://raw.github.com/kswedberg/jquery-carousel-lite/master/jcarousellite.js' }
			{ dest:'jquery.json',          src: 'https://jquery-json.googlecode.com/svn/trunk/src/jquery.json.js' }
			{ dest:'jquery.powertip',      src: 'http://stevenbenner.github.io/jquery-powertip/scripts/jquery.powertip.js' }
			{ dest:'jquery.scrollto',      src: 'https://raw.github.com/flesler/jquery.scrollTo/master/jquery.scrollTo.js' }

			{ dest:'jquery.jscrollpane',  src:'https://raw.github.com/vitch/jScrollPane/master/script/jquery.jscrollpane.js', dependencies:['jquery.mousewheel', 'jquery.mwheelintent'] }
			{ dest:'jquery.mousewheel',   src:'https://raw.github.com/brandonaaron/jquery-mousewheel/master/jquery.mousewheel.js' }
			{ dest:'jquery.mwheelintent', src:'https://raw.github.com/vitch/jScrollPane/master/script/mwheelIntent.js' }
		]
		
		async.mapLimit files, 10,
			(item, callback) ->
				request item.src, (error, response, body) ->
					if not error and response.statusCode is 200
						item.content = body
						callback null, item
					else
						callback error

			(error, results) ->
				if error 
					grunt.log.error error
					done false
				else
					done()

					addImport = (file) -> "// @import 'libs/vendor/"+file+"'"

					for file in results
						file.content = _.map(file.dependencies, addImport).join('\n')+'\n\n'+file.content if file.dependencies 

						grunt.file.write out+'/'+file.dest+'.js', file.content.replace('window.jQuery','jQuery')


					grunt.log.ok 'Downloaded ' + results.length.toString().cyan + ' files.'






	# get vendor resources
	grunt.task.registerTask 'get_vendor_resources', '', ()->
		done  = this.async()

		util.copy src_resources+'/', out_resources+'/'

		files = [
			{
				name: 'jquery.jscrollpane',
				files: [ dest:'jscrollpane.less', src:'https://raw.github.com/vitch/jScrollPane/master/style/jquery.jscrollpane.css' ]
			}
			{
				name: 'jquery.colorbox',
				files: [ dest:'colorbox.zip', src:'https://github.com/jackmoore/colorbox/archive/master.zip' ]
			}
		]
		
		async.mapLimit files, 10,
			(item, callback) ->
				for file in item.files
					options = url: file.src

					options.encoding = null if /\.zip$/.test(options.url)

					request options, (error, response, body)->
						if not error and response.statusCode is 200
							file.package = item.name;
							file.content = body;
							callback null, file
						else
							callback error


			(error, results) ->
				if error
					grunt.log.error error
					done false
				else
					done()
	
					for file in results
						dest = out_resources+'/'+file.package;
						
						grunt.file.write dest+'/'+file.dest, file.content
						
						new AdmZip(dest+'/'+file.dest).extractAllTo(dest) if /\.zip$/.test(file.dest)
	
					grunt.log.ok 'Downloaded ' + results.length.toString().cyan + ' files.'



					# process colorbox resources
					util.copy out_colorbox+'/colorbox-master/', out_colorbox+'/', 'example*/**/*'
					util.delete out_colorbox+'/colorbox-master', out_colorbox+'/colorbox.zip'

					for example in grunt.file.expand(out_colorbox+'/*')
						util.delete example+'/index.html'

						grunt.file.write example+'/colorbox.less',
							grunt.file.read(example+'/colorbox.css')
								.replace(/url\(images\//g, "url('@{img-path}/vendor/jquery.colorbox/")
								.replace(/\.png\)/g,       ".png')")
								.replace(/\.gif\)/g,       ".gif')")

								.replace(/filter: progid/g, 'filter: ~"progid')
								.replace(/FFFFFF\);/g,      'FFFFFF)";')

						util.delete example+'/colorbox.css'

					grunt.log.ok 'Assets processed.'




	# main task
	grunt.task.registerTask 'vendor', [
		'get_vendor'
		'get_vendor_resources'
	]

//-------------------------------------------
// kafe.ext.flickr
//-------------------------------------------
kafe.extend({name:'flickr', version:'1.0', obj:(function($,K,undefined){

	// default params
	var _params = {
		api_key:        '22da2ccb2de3b0d8331db52c44d8b576',  // Test Abso  (secret: ca0239b36cf79fa0)   
		media:          'photos',                            // all / photos / videos
		privacy_filter: 1,                                   // view flickr.PRIVACY_*
		sort:           'date-posted-desc',                  // date-posted-asc / date-posted-desc / date-taken-asc / date-taken-desc / interestingness-desc / interestingness-asc / relevance
		page:           1,                 
		per_page:       10,                
		extras:         ['url_sq','url_q','url_t','url_s','url_n','url_m','url_z','url_c','url_l','url_o','description','date_upload','date_taken','path_alias']
	};

	// _mergeParams (options,defaults)
	// return merged params
	//-------------------------------------------
	function _mergeParams(options,defaults) {
		options = options || {};
		
		if (options.extras) {
			options.extras.concat(defaults.extras);
		}
		
		return $.extend({}, defaults, options);
	}

	// _call (method,fields,options,callback)
	// return call data
	//-------------------------------------------
	function _call(method,fields,options,callback) {
		var 
			p    = _mergeParams(options,_params),
			data = {}
		;
		p.extras = p.extras.join(',');
			
		// trim fields
		for (var i in fields) {
			data[fields[i]] = p[fields[i]];
		}
		data.method       = 'flickr.'+method;
		data.format       = 'json';

		// call
		$.ajax({
			url:      'http://api.flickr.com/services/rest/',
			data:     data,
			jsonp:    'jsoncallback',
			dataType: 'jsonp',
			success:  callback
		});
	}

 	// _processPhotos (photos)
	// return images sizes
	//-------------------------------------------
    function _processPhotos(photos) {
		for (var i in photos) {
			var photo = photos[i];
			
			// url
			photo.url         = 'http://www.flickr.com/photos/'+photo.pathalias+'/'+photo.id+'/';
			photo.description = photo.description._content;
			
			// sizes
			var s  = ['sq','q','t','s','n','m','z','c','l','o'];
			photo.sizes = _getSizes(photo);

			for (var j in s) {
				delete photo['url_'+s[j]]; 
				delete photo['width_'+s[j]]; 
				delete photo['height_'+s[j]]; 
			} 

			// timestamp
			var e = new RegExp('^([0-9]{4})\-([0-9]{2})\-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})$','gi').exec(photo.datetaken);
			photo.datetaken = new Date(e[1], e[2]-1, e[3], e[4], e[5], e[6], 0);
			photo.dateupload = new Date(photo.dateupload*1000);
		}

		return photos;
	}

 	// _getSizes (photo)
	// return images sizes
	//-------------------------------------------
    function _getSizes(photo) {

		function data(s) {
			return {
				url:    photo['url_'+s],
				width:  parseInt(photo['width_'+s]),
				height: parseInt(photo['height_'+s])
			}
		}

	    var 
			large = data(
				(photo.url_l) ? 'l' : 
				(photo.url_o) ? 'o' : 
				(photo.url_c) ? 'c' : 
				(photo.url_z) ? 'z' : 'm'
			),
			original = (photo.url_o) ? data('o') : large 
		;

		return {
			thumb_square: data('sq'),                            //   75x75
			large_square: data('q'),                             // 150x150
			thumb:        data('t'),                             //     100
			small:        (photo.url_s) ? data('s') : original,  //     240
			small2:       (photo.url_n) ? data('n') : original,  //     320
			medium:       (photo.url_m) ? data('m') : original,  //     500
			medium2:      (photo.url_z) ? data('z') : original,  //     640
			medium3:      (photo.url_c) ? data('c') : large,     //     800
			large:        large,                                 //    1024
			original:     original
		};
	}


	//-------------------------------------------
	// PUBLIC
	//-------------------------------------------
	var flickr = {};

	// constants
	//-------------------------------------------
	K.fn.setReadOnlyProperties(flickr,{
		PRIVACY_PUBLIC:         1,   // public photos
		PRIVACY_FRIENDS:        2,   // private photos visible to friends
		PRIVACY_FAMILY:         3,   // private photos visible to family
		PRIVACY_FRIENDS_FAMILY: 4,   // private photos visible to friends & family
		PRIVACY_PRIVATE:        5    // completely private photos
	});
	
	// setParams (options)
	// set default params
	//-------------------------------------------
	flickr.setParams = function() {
		_params = _mergeParams(arguments[0],_params);
	};



	//-------------------------------------------
	// API
	//-------------------------------------------
	var api = {};
	
	// photosets_getPhotos (options)
	// get the list of photos in a set.
	//-------------------------------------------
	api.photosets_getPhotos = function(options, callback) {
		_call(
			'photosets.getPhotos', 
			['api_key','photoset_id','extras','privacy_filter','per_page','page','media'], 
			options,
			function (data) {
				data.photoset.photo = _processPhotos(data.photoset.photo);
				callback(data.photoset);
			}
		);
	};

	
	flickr.api = api;
	return flickr;

})(jQuery,kafe)});
//-------------------------------------------
// kafe.ext.flickr
//-------------------------------------------
kafe.extend({name:'flickr', version:'1.0', obj:(function (K,undefined) {
	var $ = K.jQuery;

	// default params
	var _params = {
		api_key:        '22da2ccb2de3b0d8331db52c44d8b576',  // Test Abso  (secret: ca0239b36cf79fa0)   
		media:          'photos',                            // all / photos / videos
		privacy_filter: 1,                                   // view flickr.PRIVACY_*
		sort:           'date-posted-desc',                  // date-posted-asc / date-posted-desc / date-taken-asc / date-taken-desc / interestingness-desc / interestingness-asc / relevance
		page:           1,
		per_page:       10,
		extras:         ['url_sq', 'url_q', 'url_t', 'url_s', 'url_n', 'url_m', 'url_z', 'url_c', 'url_l', 'url_o', 'description', 'date_upload', 'date_taken', 'path_alias']
	};

	// _mergeParams (options,defaults)
	// return merged params
	//-------------------------------------------
	function _mergeParams(options, defaults) {
		options = options || {};

		if (options.extras) {
			options.extras = options.extras.concat(defaults.extras);
		}

		return $.extend({}, defaults, options);
	}

	// _call (method,fields,options,callback)
	// return call data
	//-------------------------------------------
	function _call(method, fields, options, callback) {
		var 
			p = _mergeParams(options, _params),
			data = {}
		;

		p.extras = p.extras.join(',');

		// add manual options to fields
		for (var o in options) {
			if ($.inArray(o, fields) == -1) {
				fields = fields.concat(o);
			}
		}

		// trim fields
		for (var i in fields) {
			data[fields[i]] = p[fields[i]];
		}
		data.method = 'flickr.' + method;
		data.format = 'json';

		// call
		$.ajax({
			url: 'http://api.flickr.com/services/rest/',
			data: data,
			jsonp: 'jsoncallback',
			dataType: 'jsonp',
			success: callback
		});
	}

	// _processPhotos (photos)
	// return images sizes
	//-------------------------------------------
	function _processPhotos(photos) {
		for (var i in photos) {
			var photo = photos[i];

			// url
			photo.url = '//www.flickr.com/photos/' + photo.pathalias + '/' + photo.id + '/';
			photo.description = photo.description._content;

			// sizes
			var s = ['sq', 'q', 't', 's', 'n', 'm', 'z', 'c', 'l', 'o'];
			photo.sizes = _getSizes(photo);

			for (var j in s) {
				delete photo['url_' + s[j]];
				delete photo['width_' + s[j]];
				delete photo['height_' + s[j]];
			}

			// timestamp
			var e = new RegExp('^([0-9]{4})\-([0-9]{2})\-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})$', 'gi').exec(photo.datetaken);
			photo.datetaken = new Date(e[1], e[2] - 1, e[3], e[4], e[5], e[6], 0);
			photo.dateupload = new Date(photo.dateupload * 1000);
		}

		return photos;
	}

	// _processPhotosets (photosets)
	// parse photosets data
	//-------------------------------------------
	function _processPhotosets(photosets) {
		for (var i in photosets) {
			var photoset = photosets[i];

			photoset.title = photoset.title._content;
			photoset.description = photoset.description._content;

			// timestamp
			photoset.date_create = new Date(photoset.date_create * 1000);
			photoset.date_update = new Date(photoset.date_update * 1000);
		}

		return photosets;
	}

	// _getSizes (photo)
	// return images sizes
	//-------------------------------------------
	function _getSizes(photo) {

		function data(s) {
			return {
			url: photo['url_' + s],
			width: parseInt(photo['width_' + s]),
			height: parseInt(photo['height_' + s])
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
			thumb: data('t'),                                    //     100
			small: (photo.url_s) ? data('s') : original,         //     240
			small2: (photo.url_n) ? data('n') : original,        //     320
			medium: (photo.url_m) ? data('m') : original,        //     500
			medium2: (photo.url_z) ? data('z') : original,       //     640
			medium3: (photo.url_c) ? data('c') : large,          //     800
			large: large,                                        //    1024
			original: original
		};
	}

	// _getOptimizedSize
	// return optimized photo size from flickr
	//-------------------------------------------
	function _getOptimizedSize(photo, options) {

		var maxPhotoW = options.maxWidth ? options.maxWidth : null;
		var maxPhotoH = options.maxHeight ? options.maxHeight : null;
		var asBgImg = options.asBgImg ? options.asBgImg : false;
		var doResize = options.doResize ? options.doResize : false;

		var optimizedSize = photo.sizes['original'];

		if (maxPhotoW || maxPhotoH) {
			for (var i in photo.sizes) {
				var currSize = photo.sizes[i];
				if (asBgImg) {

					if ((currSize.width > maxPhotoW && currSize.height > maxPhotoH) && (optimizedSize.width > currSize.width || optimizedSize.height > currSize.height)) {
						optimizedSize = currSize;
					}

				} else {

					if (maxPhotoW && maxPhotoH) {
						if ((currSize.width > maxPhotoW || currSize.height > maxPhotoH) && (optimizedSize.width > currSize.width || optimizedSize.height > currSize.height)) {
							optimizedSize = currSize;
						}
					} else if (maxPhotoW) {
						if (currSize.width > maxPhotoW && optimizedSize.width > currSize.width) {
							optimizedSize = currSize;
						}
					} else if (maxPhotoH) {
						if (currSize.height > maxPhotoH && optimizedSize.height > currSize.height) {
							optimizedSize = currSize;
						}
					}
				}
			}
		}

		if (doResize) {
			var newDim = _getResizedDimensions(optimizedSize.width, optimizedSize.height, { maxWidth: maxPhotoW, maxHeight: maxPhotoH, asBgImg: asBgImg });
			optimizedSize.width = newDim.width;
			optimizedSize.height = newDim.height;
		}

		photo.optSize = optimizedSize;
		return photo;
	}

	// _getResizedDimensions
	// return the resized dimensions of the photo, keeps ratio
	//-------------------------------------------
	function _getResizedDimensions(baseWidth, baseHeight, options) {

		var newWidth = baseWidth ? baseWidth : 0;
		var newHeight = baseHeight ? baseHeight : 0;
		var maxWidth = options.maxWidth ? options.maxWidth : null;
		var maxHeight = options.maxHeight ? options.maxHeight : null;
		var asBgImg = options.asBgImg ? options.asBgImg : false;

		function __setNewWidth() {
			var nPhotoW = parseInt((maxHeight * newWidth) / newHeight);
			newHeight = maxHeight;
			newWidth = nPhotoW;
		}

		function __setNewHeight() {
			var nPhotoH = parseInt((maxWidth * newHeight) / newWidth);
			newWidth = maxWidth;
			newHeight = nPhotoH;
		}

		if (asBgImg) {
			if (maxHeight && newWidth < newHeight && newWidth > maxWidth) {
				__setNewHeight();
				if (newHeight < maxHeight) { __setNewWidth(); }
			} else if (maxWidth && newHeight < newWidth && newHeight > maxHeight) {
				__setNewWidth();
				if (newWidth < maxWidth) { __setNewHeight(); }
			}
		} else {
			if (maxWidth && newWidth > maxWidth) {
				__setNewHeight();
			}
			if (maxHeight && newHeight > maxHeight) {
				__setNewWidth();
			}
		}

		return { width: newWidth, height: newHeight };
	}


	//-------------------------------------------
	// PUBLIC
	//-------------------------------------------
	var flickr = {};

	// constants
	//-------------------------------------------
	K.fn.setReadOnlyProperties(flickr, {
		PRIVACY_PUBLIC:         1, // public photos
		PRIVACY_FRIENDS:        2, // private photos visible to friends
		PRIVACY_FAMILY:         3, // private photos visible to family
		PRIVACY_FRIENDS_FAMILY: 4, // private photos visible to friends & family
		PRIVACY_PRIVATE:        5  // completely private photos
	});

	// setParams (options)
	// set default params
	//-------------------------------------------
	flickr.setParams = function () {
		_params = _mergeParams(arguments[0], _params);
	};

	// getPhotosets (options, callback)
	// get photosets for specific user
	//-------------------------------------------
	flickr.getPhotosets = function (options, callback) {
		return api.photosets_getList(options, callback);
	};

	// getPhotosetCover (options, callback)
	// get a photoset cover
	//-------------------------------------------
	flickr.getPhotosetCover = function (photoset, callback) {
		api.photosets_getPhotos({ photoset_id: photoset.id }, function (data) {
			var cover = data.photo[0];
			$.each(data.photo, function (i, photo) {
				if (photo.id == photoset.primary) {
					cover = photo;
					return false
				}
			});
			callback(cover);
		});
	};

	// getPhotos (options, callback)
	// get photos
	//-------------------------------------------
	flickr.getPhotos = function (options, callback) {
		return api.photosets_getPhotos(options, callback);
	};

	// getPhotostream (options, callback)
	// get photoStream
	//-------------------------------------------
	flickr.getPhotostream = function (options, callback) {
		return api.photos_search(options, callback);
	};

	// getOptimizedSize (options, callback)
	// get optimized size (optSize) for a photo
	//-------------------------------------------
	flickr.getOptimizedSize = function (photo, options) {
		return _getOptimizedSize(photo, { maxWidth: options.maxWidth, maxHeight: options.maxHeight, doResize: options.doResize, asBgImg: options.asBgImg });
	};

	// getImgElement (photo, options, attributes)
	// return optimized <img> tag for a photo
	//-------------------------------------------
	flickr.getImgElement = function (photo, options, attributes) {
		options = options || {};
		var maxPhotoW = options.maxWidth ? options.maxWidth : null;
		var maxPhotoH = options.maxHeight ? options.maxHeight : null;
		var centered = options.centered && maxPhotoW && maxPhotoH ? options.centered : true;
		var link = options.link ? options.link : null;

		photo = _getOptimizedSize(photo, { maxWidth: maxPhotoW, maxHeight: maxPhotoH, doResize: true });

		//add attributes
		attributes = attributes || {};
		var strAttr = "";
		var attrAlt = photo.title;
		for (var attr in attributes) {
			if (attr != 'width' && attr != 'height' && attr != 'src') {
				if (attr == 'alt') {
					attrAlt = attributes[attr];
				} else {
					strAttr += (' ' + attr + '="' + attributes[attr] + '"');
				}
			}
		}

		var imgElement = '<img width="' + photo.optSize.width + '" height="' + photo.optSize.height + '" src="' + photo.optSize.url + '" alt="' + attrAlt + '"' + strAttr + ' />';
		var wrapperStyles = "";

		//centered option
		if (centered) {
			var hPadding = maxPhotoW ? Math.floor(((maxPhotoW - photo.optSize.width) / 2)) : null;
			var vPadding = maxPhotoH ? Math.floor(((maxPhotoH - photo.optSize.height) / 2)) : null;
			if (hPadding || vPadding) { wrapperStyles += ("padding:" + (vPadding ? vPadding + "px " : "0px ") + (hPadding ? hPadding + "px;" : "0px;")); }
		}

		// put link on photo
		if (link) {
			link = link || {};
			var linkAttributes = "";
			for (var attr in link) {
				linkAttributes += (' ' + attr + '="' + link[attr] + '"');
			}
			imgElement = '<a' + linkAttributes + '>' + imgElement + '</a>';
		}

		//wrap image if necessary
		if (wrapperStyles != "") {
			imgElement = '<span style="display:block; ' + wrapperStyles + '">' + imgElement + '</span>';
		}

		return imgElement;
	};

	// getBgImg (photo, options, attributes)
	// return optimized background styles for a photo
	//-------------------------------------------
	flickr.getBgImageStyles = function (photo, options) {
		options = options || {};
		var maxPhotoW = options.maxWidth ? options.maxWidth : null;
		var maxPhotoH = options.maxHeight ? options.maxHeight : null;

		photo = _getOptimizedSize(photo, { maxWidth: maxPhotoW, maxHeight: maxPhotoH, doResize: true, asBgImg: true });
		return { backgroundImage: ("url(" + photo.optSize.url + ")"), backgroundSize: (photo.optSize.width + "px " + photo.optSize.height + "px"), backgroundRepeat: "no-repeat", backgroundPosition: "center" };
	};

	//-------------------------------------------
	// API
	//-------------------------------------------
	var api = {};

	// photosets_getList (options)
	// get the photosets
	//-------------------------------------------
	api.photosets_getList = function (options, callback) {
		_call(
			'photosets.getList',
			['api_key', 'user_id'],
			options,
			function (data) {
			    data.photosets.photoset = _processPhotosets(data.photosets.photoset);
			    callback(data.photosets);
			}
		);
    };

    // photosets_getPhotos (options)
    // get the list of photos in a set.
    //-------------------------------------------
    api.photosets_getPhotos = function (options, callback) {
        _call(
			'photosets.getPhotos',
			['api_key', 'photoset_id', 'extras', 'privacy_filter', 'per_page', 'page', 'media'],
			options,
			function (data) {
			    data.photoset.photo = _processPhotos(data.photoset.photo);
			    callback(data.photoset);
			}
		);
    };

    // photos_search (options)
    // search photos
    //-------------------------------------------
    api.photos_search = function (options, callback) {
        _call(
			'photos.search',
			['api_key', 'user_id', 'per_page', 'page', 'extras'],
			options,
			function (data) {
			    data.photos.photo = _processPhotos(data.photos.photo);
			    callback(data.photos);
			}
		);
    };

    flickr.api = api;
    return flickr;

})(kafe)});
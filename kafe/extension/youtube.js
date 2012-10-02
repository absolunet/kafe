//-------------------------------------------
// kafe.ext.youtube
//-------------------------------------------
kafe.extend({name:'youtube', version:'1.1', obj:(function(K,undefined){
	var $ = K.jQuery;

	// dictionary
	var _locale = {
		fr: 'fr_FR',
		en: 'en_US'
	};

	// default params
	var 
		_defaultLocale = _locale[K.fn.lang(_locale)],
		_params = {
			locale: _defaultLocale,
			search: {
				maxResults:   10,
				startIndex:   1,
				orderBy:      'relevance'
			}
		}
	;
	
	// _mergeParams (options)
	// return merged params
	//-------------------------------------------
	function _mergeParams(options,defaults) {
		options = options || {};
		if (options.lang != undefined) {
			if (options.locale == undefined) {
				options.locale = _locale[K.fn.lang(_locale,options.lang)];
			}
			delete options.lang;
		}
		
		return $.extend({}, defaults, options);
	}

	// _queryString (data)
	// return query string
	//-------------------------------------------
	function _queryString(data) {
		var q = '';
		for (var i in data) {
			q += i+'='+data[i].toString()+'&amp;';
		}
		return q.toString().substr(0,q.length-5);
	}

	// _simpleSearchResults (options)
	// Parses search results into clean and simple result objects.
	//-------------------------------------------
	function _simpleSearchResults(results) {
		
		var simpleResults = [];
		if (results != undefined) {
			$.each(results, function(i, val) {
				
				var entry = {};

				entry.id = (val.id.$t).toString().split('/').pop();
				entry.title = val.title.$t;
				entry.author = val.author[0].name.$t;
				entry.publishedDate = new Date(val.published.$t);
				
				entry.thumbnail = {};
				entry.thumbnail.large = val.media$group.media$thumbnail[0].url;
				entry.thumbnail.small = val.media$group.media$thumbnail[1].url;
					
				entry.categories = [];
				$.each(val.category, function(ci, cval) {
					if (ci > 0)
						entry.categories.push(cval.term);
				});
				
				simpleResults.push(entry);
				
			});
		}
		
		//console.log(results);
		
		return simpleResults;
		
	}

	//-------------------------------------------
	// PUBLIC
	//-------------------------------------------
	var youtube = {};
	
	// setInitParams (options)
	// set default init params
	//-------------------------------------------
	youtube.setParams = function() {
		_params = _mergeParams(arguments[0],_params);
	};

	// search (params, callback)
	// Builds a youtube search url then returns the results as the first argument of the specified callback
	//-------------------------------------------
	youtube.search = function(params, callback) {
		var s = _params.search;
		
		var path = 'https://gdata.youtube.com/feeds/api/videos?';
		var query = 'alt=json-in-script&callback=?';
		
		query += '&max-results=' + s.maxResults;
		query += '&start-index=' + s.startIndex;
		query += '&orderby=' + s.orderBy;
		
		if ( !!params.query )
			query += '&q=' + encodeURIComponent(params.query);
			
		if ( !!params.author )
			query += '&author=' + encodeURIComponent(params.author);
			
		if ( !!params.category )
			query += '&category=' + encodeURIComponent(params.category.join('|'));
			
		$.ajax({
			url: path + query,
			dataType: 'json',
			success: function(data, textStatus, jqXHR) {
				var simpleResults = _simpleSearchResults(data.feed.entry);
				callback(simpleResults);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				throw K.error(new Error(errorThrown));
			}
		});
		
	};

	// getPlaylistVideos (params, callback)
	// ---
	//-------------------------------------------
	youtube.getPlaylistVideos = function (playlistId, callback) {
		K.required('kafe.url');

		if (!playlistId) {
			if (callback) callback(null);
			return;
		}

		if (playlistId.toString().substr(0, 2) == 'PL') {
			playlistId = playlistId.toString().substr(2, playlistId.length);
		}
		
		var playListURL = 'http://gdata.youtube.com/feeds/api/playlists/' + playlistId + '?v=2&alt=json&callback=?';
		var videoURL = 'http://www.youtube.com/watch?v=';
		var imageURL = 'http://img.youtube.com/vi/';
		$.ajax({
			url: playListURL,
			dataType: 'json',
			success: function (data) {
				var videos = [];
				$.each(data.feed.entry, function (i, item) {
					$.each(item.link, function (y, subitem) {
						if (subitem.rel == 'alternate') {
							var qs = K.url.parseSearchParams('?' + subitem.href.toString().split('?')[1])
							var videoId = qs.v;
							var video = {
								title: item.title.$t,
								id: videoId,
								url: videoURL + videoId,
								img_thumb: imageURL + videoId + '/default.jpg',
								img_large: imageURL + videoId + '/hqdefault.jpg'
							};
							videos.push(video);
						}
					});
				});
				callback(videos);
			},
			error: function () {
				callback(null);
			}
		});
	};

	return youtube;

})(kafe)});
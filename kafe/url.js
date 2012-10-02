//-------------------------------------------
// kafe.url
//-------------------------------------------
kafe.bonify({name:'url', version:'1.0', obj:(function(K,undefined){
	var $ = K.jQuery;

	// _parseIt (string, type)
	// parse url
	//-------------------------------------------
	function _parseIt(str,type) {
		switch (type) {
			case 'params': 
				var data  = {};
				var pairs = str.toString().split('&');
				for (var i in pairs) {
					var e = pairs[i].toString().split('=');
					data[e[0]] = decodeURI(e[1]);
				}
				return data;
			break;
			
			case 'path':
				return str.toString().split('/');
			break;
		}
	}

	//-------------------------------------------
	// PUBLIC
	//-------------------------------------------
	var url = {};

	// parseSearchParams ([url])
	// parse search as param=value
	//-------------------------------------------
	url.parseSearchParams = function(s) {
		s = (s) ? s : window.location.search;
		return _parseIt(s.toString().substring(1), 'params');
	};

	// parseSearchPath ([url])
	// parse search as a path
	//-------------------------------------------
	url.parseSearchPath = function(s) {
		s = (s) ? s : window.location.search;
		return (s.toString().substring(1,2) == '/') ? _parseIt(s.toString().substring(2), 'path') : [];
	};
	
	// parseHashParams ([url])
	// parse hash as param=value
	//-------------------------------------------
	url.parseHashParams = function(s) {
		s = (s) ? s : window.location.hash;
		return _parseIt(s.toString().substring(1), 'params');
	};

	// parseHashParams ([url])
	// parse hash as a path
	//-------------------------------------------
	url.parseHashPath = function(s) {
		s = (s) ? s : window.location.hash;
		return (s.toString().substring(1,2) == '/') ? _parseIt(s.toString().substring(2), 'path') : [];
	};

	// parseAjaxParams ([url])
	// parse hashbang(#!) as param=value
	//-------------------------------------------
	url.parseAjaxParams = function(s) {
		s = (s) ? s : window.location.hash;
		return (s.toString().substring(1,2) == '!') ? _parseIt(s.toString().substring(2), 'params') : {};
	};
	
	// parseAjaxPath ([url])
	// parse hashbang(#!) as a path
	//-------------------------------------------
	url.parseAjaxPath = function(s) {
		s = (s) ? s : window.location.hash;
		return (s.toString().substring(1,3) == '!/') ? _parseIt(s.toString().substring(3), 'path') : [];
	};
	
	return url;

})(kafe)});

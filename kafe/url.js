//-------------------------------------------
// kafe.url
//-------------------------------------------
kafe.bonify({name:'url', version:'1.0', obj:(function($,K,undefined){

	// __parseIt (string, type)
	// parse url
	//-------------------------------------------
	function __parseIt(str,type) {
		switch (type) {
			case 'params': {
				var data  = {};
				var pairs = str.split('&');
				for (var i in pairs) {
					var e = pairs[i].split('=');
					data[e[0]] = decodeURI(e[1]);
				}
				return data;
			}
			
			case 'path': {
				return str.split('/');
			}
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
		return __parseIt(s.substring(1), 'params');
	};

	// parseSearchPath ([url])
	// parse search as a path
	//-------------------------------------------
	url.parseSearchPath = function(s) {
		s = (s) ? s : window.location.search;
		return (s.substring(1,2) == '/') ? __parseIt(s.substring(2), 'path') : [];
	};
	
	// parseHashParams ([url])
	// parse hash as param=value
	//-------------------------------------------
	url.parseHashParams = function(s) {
		s = (s) ? s : window.location.hash;
		return __parseIt(s.substring(1), 'params');
	};

	// parseHashParams ([url])
	// parse hash as a path
	//-------------------------------------------
	url.parseHashPath = function(s) {
		s = (s) ? s : window.location.hash;
		return (s.substring(1,2) == '/') ? __parseIt(s.substring(2), 'path') : [];
	};

	// parseAjaxParams ([url])
	// parse hashbang(#!) as param=value
	//-------------------------------------------
	url.parseAjaxParams = function(s) {
		s = (s) ? s : window.location.hash;
		return (s.substring(1,2) == '!') ? __parseIt(s.substring(2), 'params') : {};
	};
	
	// parseAjaxPath ([url])
	// parse hashbang(#!) as a path
	//-------------------------------------------
	url.parseAjaxPath = function(s) {
		s = (s) ? s : window.location.hash;
		return (s.substring(1,3) == '!/') ? __parseIt(s.substring(3), 'path') : [];
	};
	
	return url;

})(jQuery,kafe)});

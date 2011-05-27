//-------------------------------------------
// kafe.ext.facebook
//-------------------------------------------
kafe.extend({name:'facebook', version:'1.1', obj:(function($,K,undefined){

	// dictionary
	var __locale = {
		fr: 'fr_FR',
		en: 'en_US'
	};

	// default params
	var __defaultLocale, __params;
	$(function(){
		__defaultLocale = __locale[K.fn.lang(__locale)];
		__params = {
			init: {
				app_id:      '',
				status:      true,
				cookie:      true,
				xfbml:       true,
				locale:      __defaultLocale,
				statusConnected:    null,
				statusNotConnected: null
			},
			likeButton: {
				href:        '', 
				layout:      'standard', 
				show_faces:  true,
				width:       450,
				height:      80,
				action:      'like',
				font:        '',
				colorscheme: 'light',
				locale:      __defaultLocale
			},
			likeBox: {
				href:        '', 
				show_faces:  true,
				stream:      true,
				header:      true,
				width:       292,
				height:      427,
				colorscheme: 'light',
				locale:      __defaultLocale
			},
			facepile: {
				href:      '', 
				width:     292,
				max_rows:  1,
				app_id:    '',
				locale:    __defaultLocale
			}
		};
	});
	
	
	// __mergeParams (options)
	// return merged params
	//-------------------------------------------
	function __mergeParams(options,defaults) {
		options = options || {};
		if (options.lang != undefined) {
			if (options.locale == undefined) {
				options.locale = __locale[K.fn.lang(__locale,options.lang)];
			}
			delete options.lang;
		}
		
		return $.extend({}, defaults, options);
	}

	// __queryString (data)
	// return query string
	//-------------------------------------------
	function __queryString(data) {
		var q = '';
		for (var i in data) {
			q += i+'='+data[i].toString()+'&amp;';
		}
		return q.substr(0,q.length-5);
	}

	// __iframe (type,params)
	// return iframe line
	//-------------------------------------------
	function __iframe(type,p) {
		return '<iframe src="http://www.facebook.com/plugins/'+type+'.php?'+__queryString(p)+'" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:'+p.width+'px; height:'+p.height+'px;" allowTransparency="true"></iframe>';
	}


	
	//-------------------------------------------
	// PUBLIC
	//-------------------------------------------
	var facebook = {};
	
	// init (options)
	// renders the required script and html tags and inits using the app_id
	//-------------------------------------------
	facebook.init = function(options) {
		var p = __mergeParams(options,__params.init);
		
		if (p.app_id) {
			
			$('body').append('<div id="fb-root"></div>');
			
			window.fbAsyncInit = function() {
				
				// Starts a relation with the Facebook app.
				FB.init({
					appId: p.app_id,
					status: p.status, // check login status
					cookie: p.cookie, // enable cookies to allow the server to access the session
					xfbml: p.xfbml  // parse XFBML
				});
				
				// Listen to status changes to apply layout changes accordingly.
				FB.Event.subscribe('auth.statusChange', function(response) {
					if (response.status == 'connected' && typeof p.statusConnected == 'function') {
						p.statusConnected(response);
					} else if (typeof p.statusNotConnected == 'function') {
						p.statusNotConnected(response);
					}
				});
				
				// Apply immediate layout changes depending of user login status.
				FB.getLoginStatus(function(response) {
					if (response.status == 'connected' && typeof p.statusConnected == 'function') {
						p.statusConnected(response);
					} else if (typeof p.statusNotConnected == 'function') {
						p.statusNotConnected(response);
					}
				});
				
			};
			
			var e = document.createElement('script');
			//e.src = document.location.protocol + '//connect.facebook.net/' + p.locale + '/all.js';
			e.src = 'http://connect.facebook.net/' + p.locale + '/all.js';
			e.async = true;
			document.getElementById('fb-root').appendChild(e);
			
		} else {
			throw K.error(new Error('Facebook requires an app_id to be initiated.'));
		}
		
	};
	
	// setInitParams (options)
	// set default init params
	//-------------------------------------------
	facebook.setInitParams = function() {
		__params.init = __mergeParams(arguments[0],__params.init);
	};

	// likeButton (selector,options)
	// output like button in selector
	//-------------------------------------------
	facebook.likeButton = function(selector,options) {
		var p = __mergeParams(options,__params.likeButton);
		$(selector).html(__iframe('like',p));
	};
	
	// setLikeButtonParams (options)
	// set default like button params
	//-------------------------------------------
	facebook.setLikeButtonParams = function() {
		__params.likeButton = __mergeParams(arguments[0],__params.likeButton);
	};

	// likeBox (selector,options)
	// output like box in selector
	//-------------------------------------------
	facebook.likeBox = function(selector,options) {
		var p = __mergeParams(options,__params.likeBox);
		$(selector).html(__iframe('likebox',p));
	};
	
	// setLikeBoxParams (options)
	// set default like box params
	//-------------------------------------------
	facebook.setLikeBoxParams = function() {
		__params.likeBox = __mergeParams(arguments[0],__params.likeBox);
	};

	// facepile (selector,options)
	// output facepile in selector
	//-------------------------------------------
	facebook.facepile = function(selector,options) {
		var p = __mergeParams(options,__params.facepile);
		$(selector).html(__iframe('facepile',p));
	};
	
	// setFacepileParams (options)
	// set default facepile params
	//-------------------------------------------
	facebook.setFacepileParams = function() {
		__params.facepile = __mergeParams(arguments[0],__params.facepile);
	};




	

	return facebook;

})(jQuery,kafe)});
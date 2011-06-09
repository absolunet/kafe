//-------------------------------------------
// kafe.ext.facebook
//-------------------------------------------
kafe.extend({name:'facebook', version:'1.2', obj:(function($,K,undefined){

	// dictionary
	var _locale = {
		fr: 'fr_FR',
		en: 'en_US'
	};

	// default params
	var _defaultLocale, _params;
	$(function(){
		_defaultLocale = _locale[K.fn.lang(_locale)];
		_params = {
			init: {
				app_id:      '',
				status:      true,
				cookie:      true,
				xfbml:       true,
				locale:      _defaultLocale,
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
				locale:      _defaultLocale
			},
			likeBox: {
				href:        '', 
				show_faces:  true,
				stream:      true,
				header:      true,
				width:       292,
				height:      427,
				colorscheme: 'light',
				locale:      _defaultLocale
			},
			facepile: {
				href:      '', 
				width:     292,
				max_rows:  1,
				app_id:    '',
				locale:    _defaultLocale
			}
		};
	});
	
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
		return q.substr(0,q.length-5);
	}

	// _iframe (type,params)
	// return iframe line
	//-------------------------------------------
	function _iframe(type,p) {
		return '<iframe src="http://www.facebook.com/plugins/'+type+'.php?'+_queryString(p)+'" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:'+p.width+'px; height:'+p.height+'px;" allowTransparency="true"></iframe>';
	}

	// _handleResponse (response,callback)
	// handling behavior relative to login status
	//-------------------------------------------
	function _handleResponse(response) {
		
		if (response.status == 'connected' && typeof _params.init.statusConnected == 'function') {
			
			_userSession = response.session;
			_getUserDetails( function( user ) {
				_params.init.statusConnected( user );
			});

		} else if (typeof _params.init.statusNotConnected == 'function') {

			_userSession = null;
			_params.init.statusNotConnected();

		}
		
	}

	// _getUserDetails ([callback])
	// stores user info relative to session (public or detailed), then forwards callback
	//-------------------------------------------
	function _getUserDetails(callback) {
		
		$.ajax({
			url: 'https://graph.facebook.com/' + _userSession.uid,
			dataType: 'json',
			data: 'access_token=' + _userSession.access_token + '&callback=?',
			success: function(data, textStatus, jqXHR) {
				
				_userDetails = data;
				
				if ( callback != undefined )
					callback(data);
				
			},
			error: function(jqXHR, textStatus, errorThrown) {
				throw K.error(new Error(errorThrown));
				
				//Return public details instead?...
				
			}
		});
		
	}

	//-------------------------------------------
	// PUBLIC
	//-------------------------------------------
	var facebook = {},
		_userSession = null,
		_userDetails = null;
	
	// setInitParams (options)
	// set default init params
	//-------------------------------------------
	facebook.setInitParams = function() {
		_params.init = _mergeParams(arguments[0],_params.init);
	};

	// init (options)
	// renders the required script and html tags then inits the Facebook API
	//-------------------------------------------
	facebook.init = function(options) {
		var p = _mergeParams(options,_params.init);
		
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
				FB.Event.subscribe( 'auth.statusChange', _handleResponse );
				
				// Apply immediate layout changes depending of user login status.
				FB.getLoginStatus( _handleResponse );
				
			};
			
			var e = document.createElement('script');
			e.src = document.location.protocol + '//connect.facebook.net/' + p.locale + '/all.js';
			e.async = true;
			document.getElementById('fb-root').appendChild(e);
			
		} else {
			throw K.error(new Error('Facebook requires an app_id to be initiated.'));
		}
		
	};

	// login ( [callback] )
	// open the login dialog [and executes a callback on success]
	//-------------------------------------------
	facebook.login = function(callback) {
		FB.login(function(response) {
			if (response.session) {
				
				if ( callback != undefined )
					callback(response);
				
			} else {
				// user cancelled login
			}
		});
	}

	// logout ( [callback] )
	// logs the user out [and executes a callback]
	//-------------------------------------------
	facebook.logout = function(callback) {
		FB.logout(function(response) {
			
			if ( callback != undefined )
				callback(response);
			
		});
	}
	
	// getSession ()
	// returns the session object or null if not logged
	//-------------------------------------------
	facebook.getSession = function() {
		return _userSession;
	}

	// getUser ()
	// returns the user details or null if not logged
	//-------------------------------------------
	facebook.getUser = function() {
		return _userDetails;
	}

	
	/* Social Plugins */
	
	
	// likeButton (selector,options)
	// output like button in selector
	//-------------------------------------------
	facebook.likeButton = function(selector,options) {
		var p = _mergeParams(options,_params.likeButton);
		$(selector).html(_iframe('like',p));
	};
	
	// setLikeButtonParams (options)
	// set default like button params
	//-------------------------------------------
	facebook.setLikeButtonParams = function() {
		_params.likeButton = _mergeParams(arguments[0],_params.likeButton);
	};

	// likeBox (selector,options)
	// output like box in selector
	//-------------------------------------------
	facebook.likeBox = function(selector,options) {
		var p = _mergeParams(options,_params.likeBox);
		$(selector).html(_iframe('likebox',p));
	};
	
	// setLikeBoxParams (options)
	// set default like box params
	//-------------------------------------------
	facebook.setLikeBoxParams = function() {
		_params.likeBox = _mergeParams(arguments[0],_params.likeBox);
	};

	// facepile (selector,options)
	// output facepile in selector
	//-------------------------------------------
	facebook.facepile = function(selector,options) {
		var p = _mergeParams(options,_params.facepile);
		$(selector).html(_iframe('facepile',p));
	};
	
	// setFacepileParams (options)
	// set default facepile params
	//-------------------------------------------
	facebook.setFacepileParams = function() {
		_params.facepile = _mergeParams(arguments[0],_params.facepile);
	};




	

	return facebook;

})(jQuery,kafe)});
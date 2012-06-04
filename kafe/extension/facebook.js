//-------------------------------------------
// kafe.ext.facebook
//-------------------------------------------
kafe.extend({name:'facebook', version:'1.4', obj:(function($,K,undefined){

	// dictionary
	var _locale = {
		fr: 'fr_FR',
		en: 'en_US'
	};

	// default params
	var
		_params = {
			app_id:             '',
			status:             true,
			cookie:             true,
			xfbml:              true,
			statusConnected:    null,
			statusNotConnected: null,
			permissions:        ''
		},
		_userSession = null,
		_userDetails = null,
		_userLikes   = null
	;

	// init Fb SDK
	$(function(){
		if (!$('#fb-root').length) {
			$('body').append('<div id="fb-root"></div>');
			(function(d, s, id) {
				var js, fjs = d.getElementsByTagName(s)[0];
				if (d.getElementById(id)) return;
				js = d.createElement(s); js.id = id;
				js.src = '//connect.facebook.net/' + _locale[K.env('lang')] + '/all.js#xfbml=1';
			}(document, 'script', 'facebook-jssdk'));
		}
	});
	



	//-------------------------------------------
	// PUBLIC
	//-------------------------------------------
	var facebook = {};
	
	// setParams (options)
	// set default params
	//-------------------------------------------
	facebook.setParams = function() {
		$.extend(_params, arguments[0]);
	};

	// getParams ([options])
	// get default params
	//-------------------------------------------
	facebook.getParams = function() {
		return $.extend({}, _params, arguments[0]);
	};

	// init ([options])
	// renders the required script and html tags then inits the Facebook API
	//-------------------------------------------
	facebook.init = function() {

		function _getUserDetails(callback) {
			$.ajax({
				url:      'https://graph.facebook.com/' + _userSession.userID,
				dataType: 'json',
				data:     'accessToken=' + _userSession.accessToken + '&callback=?',
				success:  function(data, textStatus, jqXHR) {
					_userDetails = data;
					if (callback) {
						callback(data);
					}
				},
				error: function(jqXHR, textStatus, errorThrown) {
					throw K.error(new Error(errorThrown));
					//Return public details instead?...
				}
			});
		}

		function _handleResponse(response) {
			if (response.status == 'connected' && !!_params.init.statusConnected) {
				_userSession = response.authResponse;
				_getUserDetails(function(user) {
					_params.init.statusConnected(user);
				});

			} else if (!!_params.init.statusNotConnected) {
				_userSession = null;
				_params.init.statusNotConnected();
			}
		}

		var p = facebook.getParams(arguments[0]);
		
		if (p.app_id) {
			
			window.fbAsyncInit = function() {
				
				// Starts a relation with the Facebook app.
				FB.init({
					appId: p.app_id,
					status: p.status, // check login status
					cookie: p.cookie, // enable cookies to allow the server to access the session
					xfbml: p.xfbml    // parse XFBML
				});
				
				// Listen to status changes to apply layout changes accordingly.
				FB.Event.subscribe('auth.statusChange', _handleResponse);
				
				// Apply immediate layout changes depending of user login status.
				FB.getLoginStatus(_handleResponse);
			};
			
		} else {
			throw K.error(new Error('Facebook requires an app_id to be initiated.'));
		}
	};

	// login ( [callback] )
	// open the login dialog [and executes a callback on success]
	//-------------------------------------------
	facebook.login = function(options,callback) {
		var p = facebook.getParams(options);

		FB.login(function(response) {
			if (response.authResponse) {
				if (callback) {
					callback(response);
				}
			}
		}, {scope: p.permissions});
	};

	// logout ( [callback] )
	// logs the user out [and executes a callback]
	//-------------------------------------------
	facebook.logout = function(callback) {
		FB.logout(callback);
	};
	
	// getSession ()
	// returns the session object or null if not logged
	//-------------------------------------------
	facebook.getSession = function() {
		return _userSession;
	};

	// getUser ()
	// returns the user details or null if not logged
	//-------------------------------------------
	facebook.getUser = function() {
		return _userDetails;
	};

	// checkUserLike (id, [callback])
	// returns the user likes or null if not logged
	//-------------------------------------------
	facebook.checkUserLike = function(id, callback) {
		$.ajax({ 
			url:      'https://graph.facebook.com/' + _userSession.userID + '/likes',
			dataType: 'json',
			data:     'accessToken=' + _userSession.accessToken + '&callback=?',
			success:  function(data, textStatus, jqXHR) {
				var _found = false;
				$.each(data.data, function(i, val) {
					if (val.id == id) {
						_found = true;
						return false;
					}
				});
				
				if (callback) {
					callback(_found);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				throw K.error(new Error(errorThrown));
				//Return public details instead?...
			}
		});
	};

	return facebook;

})(jQuery,kafe)});
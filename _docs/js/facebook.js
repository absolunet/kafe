/*------------------------------------------------------------------------------------//
// Client : kafe.ext.facebook
//------------------------------------------------------------------------------------*/

var MONSITE = (function(w,d,K,undefined){
	var $ = K.jQuery;
	
	// ------------------------------------------
	// PRIVATE
	// ------------------------------------------

	var kFacebook = K.ext.facebook;
	var _appId = '228236983862336';
	
	var _pageConnectedCallback = function(user) {
		
		$('.NotConnected').hide();
		$('.Connected').css({
			backgroundImage: 'url(https://graph.facebook.com/' + user.id + '/picture)',
			backgroundPosition: 'right bottom',
			backgroundRepeat: 'no-repeat'
		}).show();
		
		//$('pre.getSession span').html( '<em>' + kFacebook.getSession().toSource() + '</em>' );
		//$('pre.getUser span').html( '<em>' + kFacebook.getUser().toSource() + '</em>' );
		
		kFacebook.checkUserLike('165039663531531', function( isFound ) {
			$('pre.checkUserLike span').html( '<em>The user likes "Minecraft" : ' + isFound + '</em>' );
		});
		
	}
	var _pageNotConnectedCallback = function() {
		
		$('.Connected').hide();
		$('.NotConnected').show();
		
		$('pre.getSession span').html( '<em>null</em>, The user is logged out.' );
		$('pre.getUser span').html( '<em>null</em>, The user is logged out.' );
		$('pre.checkUserLike span').html( '<em>null</em>, The user is logged out.' );

	}


	// ------------------------------------------
	// PUBLIC
	// ------------------------------------------
	var MS = {};

	// ------------------------------------------
	// INIT
	// ------------------------------------------

	$(function(){
		
		// IMPORTANT: Your domain must be allowed by the Facebook app.
		kFacebook.setInitParams({
			app_id: _appId,
			statusConnected: _pageConnectedCallback,
			statusNotConnected: _pageNotConnectedCallback
		});

		kFacebook.init();
		
		$('div.NotConnected a').bind('click', function(){
			kFacebook.login(function() {
				// user successfully logged in
			});
		});
		
		$('div.Connected a').bind('click', function(){
			kFacebook.logout(function() {
			  // user is now logged out
			});
		});
		
	});
	
	return MS;
})(window,document,kafe);


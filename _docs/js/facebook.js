/*------------------------------------------------------------------------------------//
// Client : kafe.ext.facebook
//------------------------------------------------------------------------------------*/

var MONSITE = (function(w,d,$,K,undefined){
	
	// ------------------------------------------
	// PRIVATE
	// ------------------------------------------

	var kFacebook = K.ext.facebook;
	var __appId = '228236983862336';
	
	var __pageConnectedCallback = function(user) {
		
		$('.NotConnected').hide();
		$('.Connected').css({
			backgroundImage: 'url(https://graph.facebook.com/' + user.id + '/picture)',
			backgroundPosition: 'right bottom',
			backgroundRepeat: 'no-repeat'
		}).show();
		
		$('pre.getSession span').html( '<em>' + kFacebook.getSession().toSource() + '</em>' );
		$('pre.getUser span').html( '<em>' + kFacebook.getUser().toSource() + '</em>' );
		
	}
	var __pageNotConnectedCallback = function() {
		
		$('.Connected').hide();
		$('.NotConnected').show();
		
		$('pre.getSession span').html( '<em>null</em>, The user is logged out.' );
		$('pre.getUser span').html( '<em>null</em>, The user is logged out.' );

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
			app_id: __appId,
			statusConnected: __pageConnectedCallback,
			statusNotConnected: __pageNotConnectedCallback
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
})(window,document,jQuery,kafe);


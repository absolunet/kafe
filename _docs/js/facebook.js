/*------------------------------------------------------------------------------------//
// Client : kafe.ext.facebook
//------------------------------------------------------------------------------------*/

var MONSITE = (function(w,d,$,K,undefined){
	
	// ------------------------------------------
	// PRIVATE
	// ------------------------------------------

	var kFacebook = K.ext.facebook;
	var __appId = '228236983862336';
	
	var __pageLoadingCallback = function() {
		
		//Show Loading Animation
		
	}
	var __pageConnectedCallback = function(user) {
		
		$('.NotConnected').hide();
		$('.Connected').show(); //.NoPerms, 
		
		//Hide Loading Animation
		
	}
	var __pageNotConnectedCallback = function() {
		
		$('.Connected').hide();
		$('.NotConnected').show();
		
		//Hide Loading Animation
		
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
			statusTransition: __pageLoadingCallback,
			statusConnected: __pageConnectedCallback,
			statusNotConnected: __pageNotConnectedCallback
		});

		kFacebook.init();
		
		$('p.NotConnected a').bind('click', function(){
			kFacebook.login(function() {
				// user successfully logged in
			});
		});
		
		$('p.Connected a').bind('click', function(){
			kFacebook.logout(function() {
			  // user is now logged out
			});
		});
		
	});
	
	return MS;
})(window,document,jQuery,kafe);


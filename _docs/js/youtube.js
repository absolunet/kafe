/*------------------------------------------------------------------------------------//
// Client : kafe.ext.youtube
//------------------------------------------------------------------------------------*/

var MONSITE = (function(w,d,$,K,undefined){
	
	// ------------------------------------------
	// PRIVATE
	// ------------------------------------------

	var kYoutube = K.ext.youtube;
	
	var _parseResults = function(search) {
		
		var $pre = $('pre.search').empty();
		$.each(search, function(i, val) {
			$pre.append('<a target="_blank" href="http://youtu.be/' + val.id + '">' + val.title + '</a> by ' + val.author + '<br />');
		});
		
	}

	// ------------------------------------------
	// PUBLIC
	// ------------------------------------------
	var MS = {};

	// ------------------------------------------
	// INIT
	// ------------------------------------------

	$(function(){
		
		kYoutube.search({ query: 'Gallium Pro', author: 'Argon18bikes' }, _parseResults);
		
	});
	
	
	return MS;
})(window,document,jQuery,kafe);


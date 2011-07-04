/*------------------------------------------------------------------------------------//
// Client : kafe.ext.youtube
//------------------------------------------------------------------------------------*/

var MONSITE = (function(w,d,$,K,undefined){
	
	// ------------------------------------------
	// PRIVATE
	// ------------------------------------------

	var kYoutube = K.ext.youtube;
	
	var _parseResults = function(search) {
		
		$('pre.search').html( search.toSource() );
		
		console.log(search);
		
	}

	// ------------------------------------------
	// PUBLIC
	// ------------------------------------------
	var MS = {};

	// ------------------------------------------
	// INIT
	// ------------------------------------------

	$(function(){
		
		kYoutube.search({
			q: 'E-114',
			author: 'Argon18bikes'
		}, _parseResults);
		
	});
	
	return MS;
})(window,document,jQuery,kafe);


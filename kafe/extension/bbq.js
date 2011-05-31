//-------------------------------------------
// kafe.ext.bbq
//-------------------------------------------
kafe.extend({name:'bbq', version:'0.1', obj:(function($,K,undefined){

	kafe.required('plugins/jquery/jquery.ba-bbq.js');

	//default params
	var __params = {
		symbol: '#!',
		delimiter: '&'
	};
	
	//-------------------------------------------
	// PRIVATE
	//-------------------------------------------
	function __unHashbangUrl() {
		return (window.location.href).replace(new RegExp( __params.symbol ), '#');
	}
	function __reHashbangUrl(url) {
		return url.replace( /#/, __params.symbol );
	}
	
	//-------------------------------------------
	// PUBLIC
	//-------------------------------------------
	var bbq = {};
	
	// getParams
	// return default params
	//-------------------------------------------
	bbq.getParams = function() {
		var p = __params;
		return p;
	};
	
	// setParams (options)
	// set default params
	//-------------------------------------------
	bbq.setParams = function() {
		__params = arguments[0];
	};

	// getHashbang
	// get hashbang url parameters as string
	//-------------------------------------------
	bbq.getHashbang = function() {
		return $.param.fragment( __unHashbangUrl() );
	};

	// getHashbangParams
	// get hashbang url parameters as object
	//-------------------------------------------
	bbq.getHashbangParams = function() {
		return $.deparam.fragment( __unHashbangUrl(), true );
	};

	// setHashbang (options)
	// set hashbang url parameters according to object or string specified
	//-------------------------------------------
	bbq.setHashbang = function(params, mergemode) {
		window.location = __reHashbangUrl( $.param.fragment( __unHashbangUrl(), params, mergemode ) );
	};



	return bbq;

})(jQuery,kafe)});
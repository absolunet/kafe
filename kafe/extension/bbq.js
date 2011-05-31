//-------------------------------------------
// kafe.ext.bbq
//-------------------------------------------
kafe.extend({name:'bbq', version:'0.1', obj:(function($,K,undefined){

	//default params
	var __params = {
		hashbangSymbol: '#!'
	};
	
	//-------------------------------------------
	// PRIVATE
	//-------------------------------------------
	function __hashbangURL(url) {
		if (url == undefined) {
			return (window.location.href).replace('/' + __params.hashbangSymbol + '/', '#');
		} else {
			return url.replace(/#/, __params.hashbangSymbol);
		}
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

	// getHashbangObject
	// get hashbang url parameters as object
	//-------------------------------------------
	bbq.getHashbangObject = function() {
		return $.deparam.fragment( __hashbangURL() );
	};





	return bbq;

})(jQuery,kafe)});
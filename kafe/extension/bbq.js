_//-------------------------------------------
// kafe.ext.bbq
//-------------------------------------------
kafe.extend({name:'bbq', version:'0.1', obj:(function($,K,undefined){

	//default params
	var _params = {
		symbol: '#!',
		delimiter: '&'
	};
	
	//-------------------------------------------
	// PRIVATE
	//-------------------------------------------
	function _unHashbangUrl() {
		return (window.location.href).replace(new RegExp( _params.symbol ), '#');
	}
	function _reHashbangUrl(url) {
		return url.replace( /#/, _params.symbol );
	}
	
	//-------------------------------------------
	// PUBLIC
	//-------------------------------------------
	var bbq = {};
	
	// getParams
	// return default params
	//-------------------------------------------
	bbq.getParams = function() {
		return _params;
	};
	
	// setParams (options)
	// set default params
	//-------------------------------------------
	bbq.setParams = function() {
		_params = arguments[0];
	};

	// getHashbang
	// get hashbang url parameters as string
	//-------------------------------------------
	bbq.getHashbang = function() {
		return $.param.fragment( _unHashbangUrl() );
	};

	// getHashbangParams
	// get hashbang url parameters as object
	//-------------------------------------------
	bbq.getHashbangParams = function() {
		return $.deparam.fragment( _unHashbangUrl(), true );
	};

	// setHashbang (options)
	// set hashbang url parameters according to object or string specified
	//-------------------------------------------
	bbq.setHashbang = function(params, mergemode) {
		window.location = _reHashbangUrl( $.param.fragment( _unHashbangUrl(), params, mergemode ) );
	};



	return bbq;

})(jQuery,kafe)});
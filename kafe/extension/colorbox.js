//-------------------------------------------
// kafe.ext.colorbox
//-------------------------------------------
kafe.extend({name:'colorbox', version:'0.1', obj:(function($,K,undefined){

	//default params
	var __params = {
		inline:true, 
		opacity:0.9, 
		transition:'none'
	};
	
	
	//-------------------------------------------
	// PUBLIC
	//-------------------------------------------
	var colorbox = {};
	
	// getParams ([id])
	// return default params
	//-------------------------------------------
	colorbox.getParams = function(id) {
		var p = __params
		if (!!id) { p.id = '#'+id; }
		return p;
	};
	
	// setParams (options)
	// set default params
	//-------------------------------------------
	colorbox.setParams = function() {
		__params = arguments[0];
	};

	// display (string)
	// show a colorbox alert
	//-------------------------------------------
	colorbox.display = function(string) {
		$('#cb-display').html(string);
		$.colorbox(this.getParams('cb-display'));
	};

	
	// more to come from Leanders


	return colorbox;

})(jQuery,kafe)});
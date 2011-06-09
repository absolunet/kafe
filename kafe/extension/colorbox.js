//-------------------------------------------
// kafe.ext.colorbox
//-------------------------------------------
kafe.extend({name:'colorbox', version:'0.2', obj:(function($,K,undefined){

	//default params
	var _params = {
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
		var p = _params
		if (!!id) { p.id = '#'+id; }
		return p;
	};
	
	// setParams (options)
	// set default params
	//-------------------------------------------
	colorbox.setParams = function() {
		_params = arguments[0];
	};

	// display (string)
	// show a colorbox alert
	//-------------------------------------------
	colorbox.display = function(string) {
		$('#cb-display').html(string);
		$.colorbox(this.getParams('cb-display'));
	};

	// moveInForm ()
	// move colorbox in webform
	//-------------------------------------------
	colorbox.moveInForm = function() {
		$("#colorbox").appendTo('form');
	};
	
	// more to come from Leanders


	return colorbox;

})(jQuery,kafe)});
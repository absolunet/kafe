//-------------------------------------------
// kafe.ext.inputmask
//-------------------------------------------
kafe.extend({name:'inputmask', version:'1.0', obj:(function($,K,undefined){

	//-------------------------------------------
	// PRIVATE
	//-------------------------------------------
	var _masks = {
		datetime:   'y-m-d h:i',
		date:       'y-m-d',
		time:       'h:i',
		postalcode: 'a9a 9a9',
		phone:      '(999) 999-9999',
		phoneext:   '(999) 999-9999 x9999'			
	};

	var d60 = {
		validator:    '[0-5][0-9]',
		cardinality:  2,
		prevalidator: [{
			validator: '[0-5]', 
			cardinality: 1
		}]
    };

	$.extend($.inputmask.defaults.definitions, {
		
		// hour
		h: {
			validator:    '[01][0-9]|2[0-3]',
			cardinality:  2,
			prevalidator: [{
				validator: '[0-2]', 
				cardinality: 1
			}]
	    },
	
		// minute
		i: d60,
		
		// seconds
		s: d60
	});
	
	
	

	
	//-------------------------------------------
	// PUBLIC
	//-------------------------------------------
	var inputmask = {};
	
	// getMask (name)
	// return predefined mask
	//-------------------------------------------
	inputmask.getMask = function(name) {
		return (!!_masks[name]) ? _masks[name] : '';
	};
	

	return inputmask;

})(jQuery,kafe)});
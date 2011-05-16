//-------------------------------------------
// kafe.ext.twitter
//-------------------------------------------
kafe.extend({name:'twitter', version:'1.0', obj:(function($,K,undefined){

	K.required('//platform.twitter.com/widgets.js');

	
	// default params
	var __params;
	$(function(){
		__params = {
			href:        '', 
			text:        '',
			via:         '',
			related:     '',
			relatedText: '',
			type:        'none',
			lang:        K.env('lang')
		};
	});
	
	
	// __mergeParams (options)
	// return merged params
	//-------------------------------------------
	function __mergeParams(options,defaults) {
		return $.extend({}, defaults, options);
	}


	//-------------------------------------------
	// PUBLIC
	//-------------------------------------------
	var twitter = {};
	
	// button (selector,options)
	// output tweet button in selector
	//-------------------------------------------
	twitter.button = function(selector,options) {
		var p = __mergeParams(options,__params);
		$(selector).html('<a href="http://twitter.com/share" class="twitter-share-button" data-url="'+p.href+'" data-text="'+p.text+'" data-via="'+p.via+'" data-related="'+((p.related) ? p.related+((p.relatedText) ? ':'+p.relatedText : '') : '')+'" data-count="'+p.type+'" data-lang="'+p.lang+'">tweet</a>');
	};

	// setButtonParams (options)
	// set default tweet button params
	//-------------------------------------------
	twitter.setButtonParams = function() {
		__params = __mergeParams(arguments[0],__params);
	};

	return twitter;

})(jQuery,kafe)});
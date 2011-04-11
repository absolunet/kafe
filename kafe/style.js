//-------------------------------------------
// kafe.style
//-------------------------------------------
kafe.import({name:'style', version:'1.0', obj:(function($,K,undefined){

	//-------------------------------------------
	// PUBLIC
	//-------------------------------------------
	var style = {};


	// equalHeight (elements, [nbPerRow/resetHeight])
	// make all elements the same height
	//-------------------------------------------
	style.equalHeight = function() {
		function __doIt() {
			var $z = $(arguments[0]);
			$z.height( Math.max.apply(Math, $z.map(function(){ return $(this).height(); }).get()) );
		}

		var $o          = $(arguments[0]);
		var options     = arguments[1] || {};
		var nbPerRow    = options.nbPerRow;
		var resetHeight = options.resetHeight;

		if (resetHeight) {
			$o.height('auto');
		}
		
		if (nbPerRow) {
			var max = Math.ceil($o.length / nbPerRow);
			for (var i=0; i<max; ++i) {
				__doIt($($o.splice(0, nbPerRow)));
			}
		} else {
			__doIt($o);
		}
	};
	
	// replaceHr ()
	// replace <hr> tag with a <div>
	//-------------------------------------------
	style.replaceHr = function() {
		$('hr').replaceWith('<div class="hr"></div>');
	};

	// makeButton ([elements])
	// add spans to create a flexible button
	//-------------------------------------------
	style.makeButton = function(e) {
		$e = (e) ? $(e) : $('a.Btn');
		$e.wrapInner('<span class="Text" />').prepend('<span class="Left" />');
	};
	
	return style;

})(jQuery,kafe)});

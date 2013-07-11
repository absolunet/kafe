window.kafe.bonify({name:'style', version:'1.3', obj:(function(kafe,undefined){
	var $ = kafe.dependencies.jQuery;

	// PUBLIC
	var style = {};


	// make all elements the same height
	style.equalHeight = function() {
		var
			$o          = $(arguments[0]),
			options     = arguments[1] || {},
			nbPerRow    = options.nbPerRow,
			resetHeight = !!options.resetHeight,
			borderBox   = !!options.borderBox,

			_doIt = function() {
				var
					$z = $(arguments[0]),
					maxOuterHeight = Math.max.apply(Math, $z.map(function(){ return $(this).outerHeight(); }).get())
				;
				$z.each(function() {
					var $this = $(this);
					$this.height( (borderBox) ? maxOuterHeight : (maxOuterHeight - ($this.outerHeight() - $this.height())) );
				});
			}
		;


		if (resetHeight) {
			$o.height('auto');
		}

		if (!!nbPerRow) {
			var max = Math.ceil($o.length / nbPerRow);
			for (var i=0; i<max; ++i) {
				_doIt($($o.splice(0, nbPerRow)));
			}
		} else {
			_doIt($o);
		}
	};


	// replace <hr> tag with a <div>
	style.replaceHr = function() {
		var $e = (arguments[0]) ? $('hr:not(.kafe-replacehr-processed)', $(arguments[0])) : $('hr');
		$e.addClass('kafe-replacehr-processed').hide().wrap('<div class="hr"></div>');
	};


	// vertically align an element inside its parent
	style.vAlign = function(e, parent) {
		$(e).each(function(){
			var
				$this   = $(this),
				$parent = (parent) ? $(parent) : $this.parent()
			;
			$this.css({display: 'block', marginTop: Math.floor(($parent.height() - $this.height()) / 2) + 'px'});
		});
	};

	return style;

})(window.kafe)});
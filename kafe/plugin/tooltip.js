window.kafe.plug({name:'tooltip', version:'0.1', obj:(function(kafe,undefined){
	var
		$ = kafe.dependencies.jQuery
	;



	/**
	* ### Version 0.1
	* Quick tooltip
	*
	* @module kafe.plugin
	* @class kafe.plugin.tooltip
	*/
	var tooltip = {};


	/**
	* Initialize tooltip
	*
	* @method init
	* @param {Object} options Options
	*	@param {jQuerySelector} options.selector TODO
	*	@param {Number} [options.openSpeed=200] TODO
	*	@param {Number} [options.openDelay=500] TODO
	*	@param {Number} [options.closeSpeed=150] TODO
	*	@param {Number} [options.closeDelay=400] TODO
	*
	* @example
	*	$('#id').kafeTooltip(options)
	*/
	tooltip.init = function() {
		var
			options = (arguments) ? arguments[0] : {},
			c = {
				$tips:      $(options.selector),
				openSpeed:  (Number(options.openSpeed))  ? Number(options.openSpeed)  : 200,
				openDelay:  (Number(options.openDelay))  ? Number(options.openDelay)  : 500,
				closeSpeed: (Number(options.closeSpeed)) ? Number(options.closeSpeed) : 150,
				closeDelay: (Number(options.closeDelay)) ? Number(options.closeDelay) : 400
			}
		;

		if (!c.$tips.length) {
			return false;
		}

		// WIP
		/*
		c.$tips
			.bind('mouseenter', function(){
				var $sub = $(this).children('[data-kafequicktip-content]');
				
				if ($sub.data('kafequicktip-timer') != undefined)
					clearTimeout($sub.data('kafequicktip-timer'));
					
				$sub.parent().addClass('kafequicktip-open').end().data('kafequicktip-timer', setTimeout(function() {
					$sub.fadeIn(c.openSpeed);
				}, c.openDelay));
			})
			.bind('mouseleave', function(){
				var $sub = $(this).next();
				
				if ($sub.data('kafequicktip-timer') != undefined)
					clearTimeout($sub.data('kafequicktip-timer'));
					
				$sub.data('kafequicktip-timer', setTimeout(function() {
					$sub.parent().removeClass('kafequicktip-open').end().fadeOut(c.closeSpeed);
				}, c.closeDelay));
			});
		*/

	};


	// Add as jQuery plugin
	kafe.fn.plugIntojQuery('Tooltip', {
		init: function(self, parameters) {
			tooltip.init($.extend({}, parameters[0], {container:self}));
		}
	});

})(window.kafe)});
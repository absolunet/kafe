// Blend 2.1 for jQuery 1.3+
// Copyright (c) 2010 Jack Moore - jack@colorpowered.com
// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php

// Blend creates a 2nd layer on top of the selected element.
// This layer is faded in and out to create the effect.  The orignal, bottom layer
// has it's class set to 'hover' and remains that way for the duration to
// keep the CSS :hover state from being apparent when the object is moused-over.
(function ($, window) {

    $.fn.blend = function (speed, callback) {
		var $this = this,
		background = 'background',
		padding = 'padding',
		properties = [
		    background + 'Color',
		    background + 'Image',
		    background + 'Repeat',
		    background + 'Attachment',
		    background + 'Position', // Standards browsers
		    background + 'PositionX', // IE only
		    background + 'PositionY', // IE only
			padding + 'Top',
			padding + 'Left',
			padding + 'Right',
			padding + 'Bottom',
			'width',
			'height'
		];
		
		speed = parseInt(speed, 10) || $.fn.blend.speed;
		callback = callback || $.fn.blend.callback;
		
		// 1. Check to see if the jQuery object contains elements.
		// 2. Check to see if the effect has already been applied
		// 3. Check to see that the visitor is not using FireFox 2
		// or lower due to a bug that does not allow JavaScript to retrieve the CSS background position.
		// More info: https://bugzilla.mozilla.org/show_bug.cgi?id=316981
		if ($this[0] && !$this.find('.jsblend')[0] && !($.browser.mozilla && parseFloat($.browser.version) < 1.9)) {
			
			$this.each(function () {
				
				var base = this,
				i,
				style = base.currentStyle || window.getComputedStyle(base, null),
				layer = '<span style="position:absolute;top:0;left:0;display:block"/>',
				$content = $(layer),
				$hover = $(layer);
				
				if (base.style.position !== 'absolute') {
					base.style.position = 'relative';
				}
				
				for (i = 0; properties[i]; i += 1) {
					if (style[properties[i]]) {
						$hover[0].style[properties[i]] = $content[0].style[properties[i]] = style[properties[i]];
					}
				}
				
				$content[0].style.backgroundImage = $content[0].style.backgroundColor = '';
				
				$(base).wrapInner($content).addClass('hover').prepend($hover);
				
				$(base).bind('mouseenter mouseleave', function (e) {
					if (e.type === 'mouseenter') {
						$hover.stop().fadeTo(speed, 0, function () {
							if (callback && typeof(callback) === 'function') {
								callback();
							}
						});
					} else {
						$hover.stop().fadeTo(speed, 1);
					}
				});
			});
		}
		
		return $this;
	};
	
	$.fn.blend.speed = 400;
	$.fn.blend.callback = null;
	
}(jQuery, this));
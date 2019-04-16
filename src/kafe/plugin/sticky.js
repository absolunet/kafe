/* @echo header */

	var
		$window   = $(global),
		$document = $(document)
	;



	/**
	* ### Version <!-- @echo VERSION -->
	* Sticky box
	*
	* @module <!-- @echo MODULE -->
	* @class <!-- @echo NAME_FULL -->
	*/
	var sticky = {};


	/**
	* Initialize sticky (has to be `position:absolute` with defined `top` `left|right` by default).
	*
	* @method init
	* @param {Object} options Additional options.
	*	@param {String|jQueryObject|DOMElement} options.selector Element to stick.
	*	@param {String} [options.align='auto'] Specify `left` or `right` if your horizontal absolute positioning uses left or right instead of auto.
	*	@param {Boolean} [options.contain=false] If true, the sticky will become scrollable when it reaches the bottom edge of its container.
	*	@param {String|jQueryObject|DOMElement} [options.container=PARENT] Container in which to constrain the sticky.
	*	@param {Number} [options.topBuffer=0] Buffer in pixels before sticking occurs.
	*
	* @example
	*	<!-- @echo NAME_FULL -->.init({ selector: '#post-it' })
	* @example
	*	$('#post-it').<!-- @echo NAME_JQUERY -->('init', {})
	*/
	sticky.init = function(options) {
		options = options || {};

		var $e = $(options.selector);

		// if lone object
		if ($e.length == 1) {

			var
				// options
				align      = (options.align == 'left' || options.align == 'right') ? options.align : 'auto',
				contain    = !!options.contain,
				$container = (!!options.container) ? $(options.container) : $e.parent(),

				// original position
				topOffset     = null,
				topBuffer     = (options.topBuffer) ? options.topBuffer : 0,
				originalTop   = parseInt($e.css('top').toString().substr(0, $e.css('top').length-2),10),
				originalHori  = $e.css(align),
				topMargin     = originalTop,
				sticking      = true,
				fromBottom    = false,
				initiate      = true,

				_updateOffset = function () {
					topOffset = $container.offset().top + topMargin;
				}
			;

			_updateOffset();

			$window

				// on scroll & resize
				//---------------------------
				.on('scroll resize',function(event) {

					_updateOffset();

					// current position
					var
						position      = $window.scrollTop(),
						tippingTop    = topOffset - topMargin + topBuffer,
						tippingBottom = tippingTop + ($container.outerHeight() - $e.outerHeight() - (originalTop*2)),
						attr          = {}
					;

					// onresize
					if (event.type == 'resize' && fromBottom) {
						$e.css('top', $container.outerHeight() - $e.outerHeight() - originalTop);
					}

					// initiate the first time
					//---------------------------
					if (initiate) {
						sticking = !(position >= tippingTop && position <= tippingBottom);
						initiate = false;
					}

					// if is about to stick
					//---------------------------
					if (position !== 0 && position >= tippingTop && (!contain || position <= tippingBottom)) {

						// stick it
						attr = {
							position: 'fixed',
							top:  topMargin
						};

						// evaluate horizontal position
						if (align == 'auto') {
							attr.left  = 'auto';
							attr.right = 'auto';
						} else {
							// calculate offset left
							var $e2 = $e.clone();
							$e.after($e2);

							var attrT = { position: 'absolute' };
							attrT[align] = originalHori;
							$e2.css(attrT);
							var offsetLeft = $e2.offset().left;

							$e2.remove();

							if (align == 'left') {
								attr.left = Math.ceil(offsetLeft);
							} else {
								attr.right = Math.ceil($window.width()) - (Math.ceil(offsetLeft) + Math.ceil($e.outerWidth()));
							}
						}

						// apply
						$e.css(attr);
						$container.addClass('<!-- @echo NAME_ATTR -->-sticking');
						$e.trigger('<!-- @echo NAME_ATTR -->-binding');
						sticking = true;
						fromBottom = false;


					// if is about to unstick from top
					//---------------------------
					} else if (position === 0 || position < tippingTop) {

						// unstick it
						attr = {
							position: 'absolute',
							top:      originalTop+'px'
						};
						attr[align] = originalHori;

						// apply
						$e.css(attr);
						$container.removeClass('<!-- @echo NAME_ATTR -->-sticking');
						$e.trigger('<!-- @echo NAME_ATTR -->-unbinding');
						sticking   = false;
						fromBottom = false;


					// if is about to unstick from end of container
					//---------------------------
					} else if (contain && position >= tippingBottom) {

						// unstick it
						attr = {
							position: 'absolute',
							top:      ($container.outerHeight() - $e.outerHeight() - originalTop)+'px'
						};
						attr[align] = originalHori;

						// apply
						$e.css(attr);
						$container.removeClass('<!-- @echo NAME_ATTR -->-sticking');
						sticking   = false;
						fromBottom = true;
					}

				})

				// initiate
				.trigger('scroll')
			;
		}
	};


	// Add as jQuery plugin
	kafe.fn.plugIntojQuery('<!-- @echo NAME_FINAL -->', {
		init: function(obj, parameters) {
			sticky.init($.extend({}, parameters[0], {selector:obj}));
		}
	});

	return sticky;

/* @echo footer */

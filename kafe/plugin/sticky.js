//-------------------------------------------
// kafe.plugin.sticky
//-------------------------------------------
kafe.plug({name:'sticky', version:'0.1', obj:(function($,K,undefined){

	// local variables
	var 
		$window   = $(window),
		$document = $(document)
	;
	

	//-------------------------------------------
	// PUBLIC
	//-------------------------------------------
	var sticky = {};

	// stick (e/[see below])
	// stick a element
	//-------------------------------------------
	sticky.stick = function(e, options) {

		var $e = $(e);
		
		// if lone object
		if ($e.length == 1) {

			function _updateOffset() {
				topOffset = $container.offset().top + topMargin;
			}

			options = options || {};

			var 
				// options
				align      = (options.align == 'right') ? 'right' : 'left',
				contain    = !!options.contain,
				$container = (!!options.container) ? $(options.container) : $e.parent(),

				// original position
				topOffset     = null,
				originalTop   = parseInt($e.css('top').substr(0, $e.css('top').length-2)),
				originalHori  = $e.css(align),
				topMargin     = originalTop,
				sticking      = true,
				fromBottom    = false,
				initiate      = true
			;

			_updateOffset();
			
			$window
				
				// on scroll & resize
				//---------------------------
				.bind('scroll resize',function(event) {
					
					_updateOffset();
					
					// current position
					var 
						position      = $window.scrollTop(),
						tippingTop    = topOffset - topMargin
						tippingBottom = tippingTop + ($container.outerHeight() - $e.outerHeight() - (originalTop*2))
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
					if (position >= tippingTop && (!contain || position <= tippingBottom)) {
						
						// stick it
						var attr = {
							position: 'fixed',
							top:  topMargin
						};


						//-----------------------------------------------------
						// À VOIR
						// (resize horizontal layout centré au milieu ...  non fonctionnel mais une piste) --->      attr.right = Math.ceil($document.width()) - (Math.ceil($container.offset().left) + Math.ceil($container.outerWidth()) + Math.ceil($e.outerWidth()));
						// au resize remettre temp à absolute pour recalculer les valeurs ?
						// ie8-ie9 valeurs pas correctes ... mais ok ie7 (WEIRD)
						//-----------------------------------------------------

						// evaluate horizontal position
						if (align == 'left') {
							attr.left = Math.ceil($e.offset().left);
						} else {
							attr.right = Math.ceil($document.width()) - (Math.ceil($e.offset().left) + Math.ceil($e.outerWidth()));
						}

						// apply
						$e.css(attr);
						sticking = true;
						fromBottom = false;


					// if is about to unstick from top
					//---------------------------
					} else if (position < tippingTop) {

						// unstick it
						var attr = {
							position: 'absolute',
							top:      originalTop+'px'
						};
						attr[align] = originalHori;

						// apply
						$e.css(attr);
						sticking   = false;
						fromBottom = false;


					// if is about to unstick from end of container
					//---------------------------
					} else if (contain && position >= tippingBottom) {

						// unstick it
						var attr = {
							position: 'absolute',
							top:      ($container.outerHeight() - $e.outerHeight() - originalTop)+'px'
						};
						attr[align] = originalHori;

						// apply
						$e.css(attr);
						sticking   = false;
						fromBottom = true;
					}

				})
				
				// initiate
				.trigger('scroll')
			;
		}
	};
	
	return sticky;

})(jQuery,kafe)});
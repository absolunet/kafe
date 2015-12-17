//= require bower_components/elevatezoom-plus/src/jquery.ez-plus

/* @echo header */

	var
		_container = '.zoomContainer',
		_options   = {}
	;



	/**
	* ### Version <!-- @echo VERSION -->
	* Extra methods for the ElevateZoom Plus jQuery plugin.
	*
	* @module <!-- @echo MODULE -->
	* @class <!-- @echo NAME_FULL -->
	*/
	var elevatezoom = {};


	/**
	* Initialize plugin
	*
	* @method init
	* @param {String|jQueryObject|DOMElement} selector Image
	* @param {Object} [options] Options
	*/
	elevatezoom.init = function(selector, options) {

		// Non-touch
		if (!Modernizr.touchevents) {
			options         = _.merge({}, _options, options);
			var $img        = $(selector);
			var widthDelta  = $img.get(0).naturalWidth  - $img.width();
			var heightDelta = $img.get(0).naturalHeight - $img.height();

			elevatezoom.destroy($img);

			// If zoom image is big enough
			if (!$img.data('nozoom') && widthDelta > 20 && heightDelta > 20) {
				$img.ezPlus(options);
			}

			// Rebind resize
			var refresh = function() {
				elevatezoom.init($img, options);
			};

			$(window).off('resize.zoom').on('resize.zoom', refresh);
		}
	};


	/**
	* Destroy plugin
	*
	* @method destroy
	* @param {String|jQueryObject|DOMElement} selector Image
	*/
	elevatezoom.destroy = function(selector) {
		$(_container).remove();
		$(selector).removeData('ezPlus');
	};


	return elevatezoom;

/* @echo footer */

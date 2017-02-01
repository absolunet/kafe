(function(global, undefined) { var kafe = global.kafe, $ = kafe.dependencies.jQuery; kafe.bonify({name:'ext.foundation', version:'0.0.1', obj:(function(){

	/**
	* ### Version 0.0.1
	* Extra methods for Zurb Foundation.
	*
	* @module kafe.ext
	* @class kafe.ext.foundation
	*/
	var foundation = {};


	/**
	* Custom equalizer binder.
	*
	* @method equalizer
	* @param {Object} options Options
	* @param {String|jQueryObject|DOMElement} options.wrapper Selector of list wrapper having the `data-resize` attribute.
	* @param {String} options.item Selector of item to equalize.
	*	@param {Object} [options.rows] Object of breakpoint classes and number of items per row, 'and up' inheritance
	*
	* @example
	*	  kafe.ext.foundation.equalizer({
	*	    wrapper: $('[data-component="list"]'),
	*	    item:    '[data-component="item"]',
	*	    rows:    {
	*	      medium: 2,
	*	      large:  3
	*	    }
	*	  });
	*/
	foundation.equalizer = function(options) {
		var $elementList = $(options.wrapper);

		if ($elementList.length) {
			$elementList.each(function() {
				var $this = $(this);
				var $items = $this.find(options.item);

				if ($items.length > 1) {

					// By rows
					if (options.rows) {
						var max = 'small';
						Foundation.MediaQuery.queries.forEach(function(size) {
							if (options.rows[size.name]) {
								max = size.name;
							} else {
								options.rows[size.name] = options.rows[max];
							}
						});

						var $equalizer = new Foundation.Equalizer($this);

						$this.on('resizeme.zf.trigger', function() {
							var data       = [];
							var itemsByRow = _.chunk(_.flatten($items.toArray()), options.rows[Foundation.MediaQuery.current]);

							itemsByRow.forEach(function(rowItems) {
								var row = [];

								rowItems.forEach(function(item) {
									var $item = $(item);
									$item.css('height', 'auto');
									row.push([item, Math.ceil($item.get(0).offsetHeight)]);
								});

								row.push(_.maxBy(row, 1)[1]);
								data.push(row);
							});

							$equalizer.applyHeightByRow(data);

						}).trigger('resizeme.zf.trigger');

					// All the same
					} else {
						$items.attr('data-equalizer-watch', '');

						// eslint-disable-next-line no-new
						new Foundation.Equalizer($this);
					}
				}
			});
		}
	};


	return foundation;

})()}); })(typeof window !== 'undefined' ? window : this);
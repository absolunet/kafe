(function(global, undefined) { var kafe = global.kafe, $ = kafe.dependencies.jQuery; kafe.bonify({name:'ext.googletagmanager', version:'0.1.1', obj:(function(){

	var

		// Process data
		_processData = function(data, options) {
			data = _.clone(data);
			options = options || {};
			options.uri = options.uri || global.location.pathname;

			_.forEach(data, function(value, key) {
				var tmpl = _.template(value, {interpolate:/{{([\s\S]+?)}}/g});
				data[key] = tmpl(options);
			});

			return data;
		},

		// Push event
		_pushEvent = function(data, callback) {
			global.dataLayer.push({
				event:         'ga_event',
				eventCategory: data.category,
				eventAction:   data.action,
				eventLabel:    data.label,
				eventCallback: callback
			});
		},

		// Push checkout option
		_pushCheckoutOption = function(data, callback) {
			global.dataLayer.push({
				event: 'checkoutOption',
				ecommerce: {
					checkout_option: {
						actionField: {
							step: data.step,
							option: data.option
						}
					}
				},
				eventCallback: callback
			});
		},

		_gtmEvents = {},

		_checkoutOptions = {}
	;



	/**
	* ### Version 0.1.1
	* Extra methods for the Google Tag Manager.
	* Requires GTM to be included
	*
	* @module kafe.ext
	* @class kafe.ext.googletagmanager
	*/
	var googletagmanager = {};

	/**
	* Add named events to the list of possible event to be triggered, with the possibility of replacement tokens.
	* Default tokens provided:
	*	- {{uri}}: Current pathname
	*
	* @method addEvents
	* @param {Object} events List of possible events and their config
	*	@param {String} events.category The `eventCategory` value.
	*	@param {String} events.action The `eventAction` value.
	*	@param {String} events.label The `eventLabel` value.
	*
	* @example
	*	// Create named events
	*	kafe.ext.googletagmanager.addEvents({
	*		'newsletter-subscribed': {
	*			category: 'Subscription',
	*			action:   'Newsletter',
	*			label:    '{{uri}}'
	*		},
	*		'product-addedtocart': {
	*			category: 'Cart',
	*			action:   'Product added - {{uri}}',
	*			label:    '{{productname}}'
	*		}
	*	});
	*/
	googletagmanager.addEvents = function(events) {
		_.merge(_gtmEvents, events);
	};


	/**
	* Push a `ga_event` into the `dataLayer`.
	*
	* @method triggerEvent
	*	@param {String} event Event name
	*	@param {Object} [options] List of replacement tokens
	*	@param {Function} [callback] Function to call after event is pushed
	*
	* @example
	*	kafe.ext.googletagmanager.triggerEvent('product-addedtocart', { productname: 'Sexy rainbow pants' });
	*/
	googletagmanager.triggerEvent = function(event, options, callback) {
		var data = _gtmEvents[event];
		if (data) {
			_pushEvent( _processData(data, options), callback );
		}
	};


	/**
	* Add named checkout options to the list of possible options to be triggered, with the possibility of replacement tokens.
	* Default tokens provided:
	*	- {{uri}}: Current pathname
	*
	* @method addCheckoutOptions
	* @param {Object} checkoutOptions List of possible checkout options and their config
	*	@param {String} checkoutOptions.step The `step` value.
	*	@param {String} checkoutOptions.option The `option` value.
	*
	* @example
	*	// Create named checkout options
	*	kafe.ext.googletagmanager.addCheckoutOptions({
	*		'checkout-type': {
	*			step:  'Identification',
	*			label: 'Identified as {{type}}'
	*		},
	*		'checkout-shipping': {
	*			step:  'Shipping method',
	*			label: 'Shipped via {{method}}'
	*		}
	*	});
	*/
	googletagmanager.addCheckoutOptions = function(checkoutOptions) {
		_.merge(_checkoutOptions, checkoutOptions);
	};


	/**
	* Push a `checkoutOption` into the `dataLayer`.
	*
	* @method triggerCheckoutOption
	*	@param {String} checkoutOption Checkout option name
	*	@param {Object} [options] List of replacement tokens
	*	@param {Function} [callback] Function to call after event is pushed
	*
	* @example
	*	kafe.ext.googletagmanager.triggerCheckoutOption('checkout-type', { type: 'guest' });
	*/
	googletagmanager.triggerCheckoutOption = function(checkoutOption, options, callback) {
		var data = _checkoutOptions[checkoutOption];
		if (data) {
			_pushCheckoutOption( _processData(data, options), callback );
		}
	};


	/**
	* Delay link until GTM data is pushed.
	*
	* @method delayHyperlink
	* @param {Function} callback Code to execute. Receives `cb` param
	* @param {String} url Url to go to
	* @param {Number} [delay=1000] Number of ms to wait before going to the link anyway
	*
	* @example
	*	kafe.ext.googletagmanager.delayHyperlink( function (cb) {
	*		kafe.ext.googletagmanager.triggerCheckoutOption('checkout-type', { type: 'guest' }, cb);
	*	}, $(this).attr('href'));
	*/
	googletagmanager.delayHyperlink = function(callback, url, delay) {
		var done = false;

		var redirect = function() {
			if (!done) {
				done = true;
				global.location.assign(url);
			}
		};

		// Do the call
		callback(redirect);

		// If too long
		global.setTimeout(redirect, delay || 1000);
	};


	return googletagmanager;

})()}); })(typeof window !== 'undefined' ? window : this);

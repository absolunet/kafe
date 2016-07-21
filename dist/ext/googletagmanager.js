(function(global, undefined) { var kafe = global.kafe, $ = kafe.dependencies.jQuery; kafe.bonify({name:'ext.googletagmanager', version:'1.0.0', obj:(function(){

	var

		// Process data
		_processData = function(data, options) {
			data = _.clone(data);
			options = options || {};
			options.uri = options.uri || global.location.pathname;

			_.forEach(data, function(value, key) {
				var tmpl = _.template(value, {interpolate:/{{([\s\S]+?)}}/g});
				data[key] = tmpl(options);

				switch ($.type(options[key])) {
					case 'number': data[key] = Number(data[key]); break;
				}
			});

			return data;
		},

		_events = {}
	;



	/**
	* ### Version 1.0.0
	* Extra methods for the Google Tag Manager.
	* Requires GTM to be included
	*
	* @module kafe.ext
	* @class kafe.ext.googletagmanager
	*/
	var googletagmanager = {};

	/**
	* Add named events to the list of possible event to be tracked, with the possibility of replacement tokens.
	* Default tokens provided:
	*	- {{uri}}: Current pathname
	*
	* @method add
	* @param {Object} events List of possible events and their config
	*	@param {String} events.[0] The event type. Possible values are `ga_event`, `checkoutOption`, `productClick`, `productImpression`, `raw`
	*	@param {Object} events.[1] The event data. Different for each type. View code for implemantation.
	*
	* @example
	*	// Create named events
	*	kafe.ext.googletagmanager.add({
	*		'product-addedtocart': ['ga_event', {
	*			category: 'Cart',
	*			action:   'Product added - {{uri}}',
	*			label:    '{{productname}}'
	*		},
	*		'checkout-shipping': ['checkoutOption', {
	*			step:  'Shipping method',
	*			label: 'Shipped via {{method}}'
	*		},
	*		'upsell-click': ['productClick', {
	*			id:       '{{sku}} - {{id}}',
	*			name:     '{{name}}',
	*			brand:    '{{productBrand}}',
	*			price:    '{{priceWithoutTaxes}}',
	*			category: '{{category}} / {{subcategory}}',
	*			position: '{{position}}',
	*			list:     'Upsell products'
	*		},
	*		'sunset-position': ['raw', {
	*			foo: 'bar',
	*			bar: 'foo'
	*		}
	*	});
	*/
	googletagmanager.add = function(events) {
		_.merge(_events, events);
	};


	/**
	* Push a event into the `dataLayer`.
	*
	* @method track
	*	@param {String} name Event name
	*	@param {Object} [tokens] List of replacement tokens
	*	@param {Function} [callback] Function to call after event is pushed
	*
	* @example
	*	kafe.ext.googletagmanager.track('product-addedtocart', { productname: 'Sexy rainbow pants' });
	*/
	googletagmanager.track = function(name, tokens, callback) {
		var event = _events[name];

		if (event) {
			var type    = event[0];
			var options = event[1] ? _processData(event[1], tokens) : tokens;

			switch (type) {

				//-- Google Analytics - Event
				case 'ga_event':
					data = {
						event:         'ga_event',
						eventCategory: options.category,
						eventAction:   options.action,
						eventLabel:    options.label
					};
				break;

				//-- Enhanced Ecommerce - Checkout option
				case 'checkoutOption':
					data = {
						event: 'checkoutOption',
						ecommerce: {
							checkout_option: {
								actionField: {
									step:   options.step,
									option: options.option
								}
							}
						}
					};
				break;

				//-- Enhanced Ecommerce - Product click
				case 'productClick':
					data = {
						event: 'productClick',
						ecommerce: {
							click: {
								actionField: {
									list: options.list
								},
								products: [{
									id:       options.id,
									name:     options.name,
									brand:    options.brand,
									price:    options.price,
									category: options.category,
									position: options.position,
									list:     options.list
								}]
							}
						}
					};
				break;

				//-- Enhanced Ecommerce - Product impression
				case 'productImpression':
					data = {
						event: 'productImpression',
						ecommerce: {
							currency:   options.currency,
							impressions: [{
								id:       options.id,
								name:     options.name,
								brand:    options.brand,
								price:    options.price,
								category: options.category,
								position: options.position,
								list:     options.list
							}]
						}
					};
				break;

				//-- RAW
				case 'raw':
					data = options;
				break;
			}

			if (!data.eventCallback && callback) {
				data.eventCallback = callback;
			}

			global.dataLayer.push(data);
		}
	};


	/**
	* Delay link until GTM data is pushed.
	*
	* @method delayHyperlink
	* @param {Event} event Original click event
	* @param {Function} callback Code to execute. Receives `cb` param
	* @param {Number} [delay=1000] Number of ms to wait before going to the link anyway
	*
	* @example
	*	kafe.ext.googletagmanager.delayHyperlink(event, function (cb) {
	*		kafe.ext.googletagmanager.track('checkout-type', { type: 'guest' }, cb);
	*	}, 2000);
	*/
	googletagmanager.delayHyperlink = function(event, callback, delay) {
		event.preventDefault();

		var done = false;
		var url = $(event.currentTarget).attr('href');

		var redirect = function() {
			if (!done) {
				done = true;

				// Trying to guess if user requested a new window
				if ( event.ctrlKey || event.shiftKey || event.metaKey || (event.button && event.button == 1) ) {
					__.window.open(url, '_blank');
				} else {
					global.location.assign(url);
				}
			}
		};

		// Do the call
		callback(redirect);

		// If too long
		global.setTimeout(redirect, delay || 1000);
	};


	return googletagmanager;

})()}); })(typeof window !== 'undefined' ? window : this);

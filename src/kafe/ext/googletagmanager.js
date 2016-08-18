/* @echo header */

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
	* ### Version <!-- @echo VERSION -->
	* Extra methods for the Google Tag Manager.
	* Requires GTM to be included
	*
	* @module <!-- @echo MODULE -->
	* @class <!-- @echo NAME_FULL -->
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
	*	<!-- @echo NAME_FULL -->.add({
	*		'product-addedtocart': ['ga_event', {
	*			category: 'Cart',
	*			action:   'Product added - {{uri}}',
	*			label:    '{{productname}}'
	*		},
	*		'checkout-shipping': ['checkoutOption', {
	*			step:  'Shipping method',
	*			label: 'Shipped via {{method}}'
	*		},
	*		'upsell-shown': ['productImpression', {
	*			id:       '{{sku}} - {{id}}',
	*			name:     '{{name}}',
	*			brand:    '{{productBrand}}',
	*			price:    '{{priceWithoutTaxes}}',
	*			category: '{{category}} / {{subcategory}}',
	*			position: '{{position}}',
	*			list:     'Upsell products'
	*			currency: 'CAD'
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
	*
	* @example
	*	<!-- @echo NAME_FULL -->.track('product-addedtocart', { productname: 'Sexy rainbow pants' });
	*	<!-- @echo NAME_FULL -->.track('upsell-shown', [
	*		{
	*			sku: '123',
	*			price: 12.34,
	*			name: 'Sexy rainbow pants'
	*		},
	*		{
	*			sku: '456',
	*			price: 45.67,
	*			name: 'Plain beige skirt'
	*		}
	*	]);
	*/
	googletagmanager.track = function(name, tokens) {
		var deferred = $.Deferred();

		var event = _events[name];

		if (event) {
			var type = event[0];
			var options;

			// Process tokens
			switch (type) {

				//-- Multiple
				case 'productImpression':
					options = [];
					_.forEach(tokens, function(itemTokens) {
						options.push( _processData(event[1], itemTokens) );
					});
				break;

				//-- Single
				default:
					options = _processData(event[1], tokens);
				break;
			}

			// Format to GTM data
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
							currencyCode: options.currency,
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

					var impressions = [];

					_.forEach(options, function(itemOptions) {
						impressions.push({
							id:       itemOptions.id,
							name:     itemOptions.name,
							brand:    itemOptions.brand,
							price:    itemOptions.price,
							category: itemOptions.category,
							position: itemOptions.position,
							list:     itemOptions.list
						});
					});

					data = {
						event: 'productImpression',
						ecommerce: {
							currencyCode: options[0].currency,
							impressions:  impressions
						}
					};
				break;

				//-- RAW
				case 'raw':
					data = options;
				break;
			}


			// Resolve when GTM responds
			data.eventCallback = function() {
				if (deferred.state() === 'pending') {
					deferred.resolve();
				}
			};

			// Reject after 1 sec
			global.setTimeout(function() {
				if (deferred.state() === 'pending') {
					deferred.reject();
				}
			}, 1000);


			global.dataLayer.push(data);

			return deferred.promise();
		}
	};


	return googletagmanager;

/* @echo footer */

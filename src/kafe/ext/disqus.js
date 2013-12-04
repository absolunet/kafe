/* @echo header */

	var
		_params = {
			shortname: '',
			language: ''
		},

		_interval = null,
		_callback = null,

		_isDisqusLoaded = function() {
			if ($('#dsq-content #dsq-reply').length) {
				window.clearInterval(disqus.interval);
				disqus.loaded = true;
				disqus.callback();
			}
		}
	;

	window.disqus_title      = null;
	window.disqus_shortname  = null;
	window.disqus_url        = null;
	window.disqus_identifier = null;


	/**
	* ### Version <!-- @echo VERSION -->
	* Extra methods for the Disqus API.
	*
	* @module <!-- @echo MODULE -->
	* @class <!-- @echo NAME_FULL -->
	*/
	var disqus = {};


	/**
	* Init Disqus async.
	*
	* @method init
	* @param {Object} options Options.
	*	@param {String} options.title TODO
	*	@param {String} options.shortname TODO
	*	@param {String} options.url TODO
	*	@param {String} options.identifier TODO
	*	@param {String} options.language TODO
	*	@param {Function} [options.callback] TODO
	*/
	disqus.init = function (options) {
		var p = $.extend({}, _params, options);

		window.disqus_title = p.title;
		window.disqus_shortname = p.shortname;
		window.disqus_url = p.url;
		window.disqus_identifier = p.identifier;

		window.disqus_config = function () {
			this.language = p.language;
		};

		var dsq = document.createElement('script');
		dsq.type = 'text/javascript';
		dsq.async = true;

		dsq.src = '//' + p.shortname + '.disqus.com/embed.js';
		(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);

		if (p.callback && typeof (p.callback) == 'function') {
			if ($('#dsq-content #dsq-reply').length === 0) {
				_callback = p.callback;
				_interval = window.setInterval(_isDisqusLoaded, 200);
			} else {
				p.callback();
			}
		}
	};


	/**
	* Reset Disqus.
	*
	* @method reset
	* @param {String} pageId TODO
	* @param {String} url TODO
	*/
	disqus.reset = function (pageId, url) {
		DISQUS.reset({
			reload: true,
			config: function () {
				this.page.identifier = pageId;
				this.page.url = url;
			}
		});
	};


	return disqus;

/* @echo footer */
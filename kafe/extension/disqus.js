//-------------------------------------------
// kafe.ext.disqus
//-------------------------------------------
kafe.extend({ name: 'disqus', version: '0.1', obj: (function ($, K, undefined) {

	window.disqus_title      = null;
	window.disqus_shortname  = null;
	window.disqus_url        = null;
	window.disqus_identifier = null;

	// default params
	var _params = {
		shortname: '',
		language: ''
	};

	function __isDisqusLoaded() {
		if ($('#dsq-content #dsq-reply').length) {
			window.clearInterval(disqus.interval);
			disqus.loaded = true;
			disqus.callback();
		}
	}

	//-------------------------------------------
	// PUBLIC
	//-------------------------------------------
	var disqus = {
		loaded: false,
		interval: null,
		callback: null
	};


	// initialize (options)
	// init Disqus async.
	//-------------------------------------------
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
			if ($('#dsq-content #dsq-reply').length == 0) {
				disqus.callback = p.callback;
				disqus.interval = window.setInterval(__isDisqusLoaded, 200);
			} else {
				p.callback();
			}
		}
	};

	// reset (pageId, url)
	// reset data
	//-------------------------------------------
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

})(jQuery, kafe)});

(function(global, undefined) { var kafe = global.kafe, $ = kafe.dependencies.jQuery; kafe.bonify({name:'plugin.social', version:'0.1', obj:(function(){

	var
		getAbsoluteUrl = function(href) {
			if (href) {
				var link = document.createElement('a');
				link.href = href;
				return (link.protocol+'//'+link.host+link.pathname+link.search+link.hash);
			}
			return '';
		},

		networks = {
			facebook: {
				url:    'https://www.facebook.com/sharer/sharer.php?u=<%= url %>',
				width:  '675',
				height: '368'
			},
			twitter: {
				url:    'https://twitter.com/intent/tweet?url=<%= url %>&text=<%= text %>&related=<%= related %>',
				width:  '550',
				height: '450'
			},
			linkedin: {
				url:    'https://www.linkedin.com/shareArticle?url=<%= url %>&summary=<%= text %>&mini=true',  // &ro=false &title=lorem &source=example.com
				width:  '600',
				height: '500'
			},
			googleplus: {
				url:    'https://plus.google.com/share?url=<%= url %>&t=<%= text %>',
				width:  '520',
				height: '520'
			},
			pinterest: {
				url:    'http://www.pinterest.com/pin/create/button/?url=<%= url %>&description=<%= text %>&media=<%= media %>',
				width:  '750',
				height: '335'
			}
		},

		share_options = {
			url:     document.location,
			text:    document.title,
			related: '', // twitter : https://dev.twitter.com/docs/tweet-button#related
			media:   getAbsoluteUrl( $('head link[rel="image_src"]').attr('href') ) // pinterest media
		}
	;


	/**
	* ### Version 0.1
	* Social tools
	*
	* @module kafe.plugin
	* @class kafe.plugin.social
	*/
	var social = {};


	/**
	* Initialize share buttons functionality
	*
	* @method initShareButtons
	* @param {Object} [options] Options
	*
	* @example
	*	<span data-kafesocial-action="share" data-kafesocial-network="facebook">facebook</span>
	*	kafe.plugin.social.initShareButtons()
	*/
	social.initShareButtons = function(options) {
		share_options = $.extend({}, share_options, options || {});

		$('[data-kafesocial-action="share"]').on('click', function() {
			var $this = $(this);
			var network = $this.data('kafesocial-network');
			var options = $.extend({}, share_options, $this.data('kafesocial-options') || {});
			var data = networks[network];
			if (data.url) {
				window.open( _.template(data.url)(options) , '_blank', 'width='+data.width+',height='+data.height+',menubar=no,toolbar=no');
			}
		});
	};


	return social;

})()}); })(typeof window !== 'undefined' ? window : this);
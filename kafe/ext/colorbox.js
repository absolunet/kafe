//>>excludeStart('excludeRequire', pragmas.excludeRequire);
require([
	'libs/vendor/jquery/colorbox'
]);
//>>excludeEnd('excludeRequire');

window.kafe.extend({name:'colorbox', version:'1.2.1', obj:(function(kafe,undefined){
	var
		$ = kafe.dependencies.jQuery,

		_params = {
			theme:        '',
			opacity:      0.5,
			transition:   'none',
			overlayClose: true,
			escKey:       true,
			scrolling:    false
		},

		_open = function(options, obj) {
			options = colorbox.getParams(options);

			if (options.theme) {
				colorbox.changeTheme(options.theme);
				delete options.theme;
			}

			if ($obj !== undefined) {
				return $(obj).colorbox(options);
			} else {
				$.colorbox(options);
			}
		}
	;

	// bind theme changer class removing
	$(document).on('cbox_closed', function(){
		var
			$body = $('body'),
			classes = $body.attr('class') || ''
		;
		classes = classes.toString().split(' ');
		for (var i in classes) {
			if (/^kafecolorbox-theme-/.test(classes[i])) {
				$body.removeClass(classes[i]);
			}
		}
	});

	// change controls text
	if (kafe.env('lang') == 'fr') {
		$.extend($.colorbox.settings, {
			current:        'image {current} sur {total}',
			previous:       'pr&eacute;c&eacute;dente',
			next:           'suivante',
			close:          'fermer',
			xhrError:       'Impossible de charger ce contenu.',
			imgError:       'Impossible de charger cette image.',
			slideshowStart: 'd&eacute;marrer la pr&eacute;sentation',
			slideshowStop:  'arr&ecirc;ter la pr&eacute;sentation'
		});
	}


	/**
	* ### Version 1.2.1
	* Extra methods for the colorbox jQuery plugin.
	*
	* @module kafe.ext
	* @class kafe.ext.colorbox
	*/
	var colorbox = {};


	/**
	* Move the colorbox markup into .NET Webform
	*
	* @method moveInForm
	*/
	colorbox.moveInForm = function() {
		$('#colorbox').appendTo('form');
	};


	/**
	* Get the default params with optional extra params.
	*
	* @method getParams
	* @param {Object} [options] Options
	* @return {Object} The default colorbox params.
	*/
	colorbox.getParams = function() {
		return $.extend({}, _params, (!!arguments[0]) ? arguments[0] : {});
	};


	/**
	* Set the default params.
	*
	* @method setParams
	* @param {Object} options Options
	*/
	colorbox.setParams = function() {
		$.extend(_params, arguments[0]);
	};


	/**
	* Change the default theme, which is a class on the body with the name `kafecolorbox-theme-THEME`.
	*
	* @method changeTheme
	* @param {String} theme Theme name.
	*/
	colorbox.changeTheme = function(theme) {
		var $body = $('body');

		if (!$body.hasClass('kafecolorbox-theme-'+theme)) {

			var classes = $body.attr('class') || '';
			classes = classes.toString().split(' ');
			for (var i in classes) {
				if (/^kafecolorbox-theme-/.test(classes[i])) {
					$body.removeClass(classes[i]);
				}
			}

			$body.addClass('kafecolorbox-theme-'+theme);
			$.colorbox.remove();
			$.colorbox.init();
		}
	};


	/**
	* Calls $.colorbox() with the default params including theme.
	*
	* @method open
	* @param {Object} options The colorbox params.
	*/
	colorbox.open = function(options) {
		_open(options);
	};


	/**
	* Calls $.colorbox() with as content a rendered jsrender tmpl.
	*
	* @method tmpl
	* @param {JSRenderTemplate} tmpl The cached JSRender template.
	* @param {Object} [data] The JSRender template data.
	* @param {Object} [options] The colorbox params.
	*/
	colorbox.tmpl = function(tmpl, data, options) {
		options = (!!options) ? options : {};
		$.extend(options, { html:tmpl.render(data) });
		colorbox.open(options);
	};


	/**
	* Calls $.colorbox() with an inline content.
	*
	* @method inline
	* @param {String} selector The content selector.
	* @param {Object} [options] The colorbox params.
	*/
	colorbox.inline = function(selector, options) {
		options = (!!options) ? options : {};
		$.extend(options, { inline:true, href:selector });
		colorbox.open(options);
	};


	/**
	* Calls $.colorbox() with an ajax content.
	*
	* @method ajax
	* @param {String} url The content url.
	* @param {Object} [options] The colorbox params.
	*/
	colorbox.ajax = function(url, options) {
		options = (!!options) ? options : {};
		$.extend(options, { href:url });
		colorbox.open(options);
	};


	// dialog ( content, [commands] )
	// opens a message window with custom buttons
	//-------------------------------------------
	colorbox.dialog = function( content, commands  ) {

		var html = '<div id="kafecolorbox-dialog">' + content;

		if (commands === undefined || commands.length === 0) {
			commands = [{ label:'OK', callback:function(){ $.colorbox.close(); } }];
		}
		html += '<div class="Commands" style="white-space:nowrap;">';
		$.each(commands, function(i, btn){
			html += '<a href="#" class="Btn">' + btn.label + '</a>';
		});
		html += '</div></div>';

		content = $(html);
		$.each(commands, function(i, btn){
			content.find('.Btn:eq(' + i + ')').on('click', function(e) {
				e.preventDefault();
				if (typeof btn.callback === 'function') {
					btn.callback();
				} else {
					$.colorbox.close();
				}
			});
		});

		colorbox.open({html:content});
	};

	// confirm ( selector, message, OKLabel, CancelLabel )
	// simulate a confirm() behavior using colorbox.dialog
	//-------------------------------------------
	colorbox.confirm = function( selector, message, OKLabel, CancelLabel ) {
		var kDialog = this;
		$(function(){
			$(selector).on('click', function(e) {
				e.preventDefault();
				var $this = $(this);
				kDialog.dialog( message, [
					{ label:OKLabel , callback: function() {
						eval($this.attr('href'));
						$.colorbox.close();
					}},
					{ label:CancelLabel }
				]);
			});
		});
	};


	// Add as jQuery plugin
	kafe.fn.plugIntojQuery('Colorbox', {

		/**
		* Calls $(selector).colorbox() with the default params including theme.
		*
		* @method $.kafeCarousel('init')
		* @param {Object} [options] The colorbox params.
		* @example
		*	$('.picture').kafeColorbox('init')
		*/
		'init': function(obj, parameters) {
			return _open(parameters[0], obj);
		}
	});

	return colorbox;

})(window.kafe)});
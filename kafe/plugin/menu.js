window.kafe.plug({name:'menu', version:'0.1', obj:(function(kafe,undefined){
	var
		$ = kafe.dependencies.jQuery
	;



	/**
	* ### Version 0.1
	* Quick menu with submenus
	*
	* @module kafe.plugin
	* @class kafe.plugin.menu
	*/
	var menu = {};


	/**
	* Initialize menu
	*
	* @method init
	* @param {Object} options Options
	*	@param {jQuerySelector} options.container TODO
	*	@param {String} [options.handle='li'] TODO
	*	@param {String} [options.submenus='ul'] TODO
	*	@param {String} [options.animation='slide'] TODO
	*	@param {Number} [options.openSpeed=200] TODO
	*	@param {Number} [options.openDelay=500] TODO
	*	@param {Number} [options.closeSpeed=150] TODO
	*	@param {Number} [options.closeDelay=400] TODO
	*	@param {Function} [options.enterCallback] TODO
	*	@param {Function} [options.leaveCallback] TODO
	*
	* @example
	*	$('#id').kafeMenu(options)
	*/
	menu.init = function() {
		var
			options = (arguments) ? arguments[0] : {},
			c = {
				$menu:         $(options.container),
				handle:        (options.handle) ? options.handle : 'li',
				submenus:      (options.submenus) ? options.submenus : 'ul',
				animation:     (options.animation) ? options.animation : 'slide',
				openSpeed:     (Number(options.openSpeed)) ? Number(options.openSpeed) : 200,
				openDelay:     (Number(options.openDelay)) ? Number(options.openDelay) : 500,
				closeSpeed:    (Number(options.closeSpeed)) ? Number(options.closeSpeed) : 150,
				closeDelay:    (Number(options.closeDelay)) ? Number(options.closeDelay) : 400,
				enterCallback: (typeof(options.enterCallback)  == 'function') ? options.enterCallback  : undefined,
				leaveCallback: (typeof(options.leaveCallback)  == 'function') ? options.leaveCallback  : undefined
			}
		;

		if (!c.$menu.length) {
			return false;
		}

		c.$menu.children(c.handle)
			.bind('mouseenter', function(){
				var
					$parent = $(this),
					$sub = $parent.children(c.submenus)
				;

				if ($sub.data('kafe-quickmenu-timer') !== undefined) {
					clearTimeout($sub.data('kafe-quickmenu-timer'));
				}

				$parent.addClass('kafe-quickmenu-open');
				$sub.data('kafe-quickmenu-timer', setTimeout(function() {
					if (!!c.enterCallback) {
						c.enterCallback($sub);
					}
					switch (c.animation) {
						case 'fade' :
							$sub.fadeIn(c.openSpeed);
						break;

						//case 'slide' :
						default :
							$sub.slideDown(c.openSpeed);
						break;
					}
				}, c.openDelay));
			})
			.bind('mouseleave', function(){
				var
					$parent = $(this),
					$sub = $parent.children(c.submenus)
				;

				if ($sub.data('kafe-quickmenu-timer') !== undefined) {
					clearTimeout($sub.data('kafe-quickmenu-timer'));
				}

				if ($sub.size() > 0) {
					$sub.data('kafe-quickmenu-timer', setTimeout(function() {
						$parent.removeClass('kafe-quickmenu-open');
						if (!!c.leaveCallback) {
							c.leaveCallback($sub);
						}
						switch (c.animation) {
							case 'fade' :
								$sub.fadeOut(c.closeSpeed);
							break;

							//case 'slide' :
							default :
								$sub.slideUp(c.closeSpeed);
							break;
						}
					}, c.closeDelay));
				} else {
					$parent.removeClass('kafe-quickmenu-open');
					if (!!c.leaveCallback) {
						c.leaveCallback($sub);
					}
				}
			})
		;
	};


	// Add as jQuery plugin
	kafe.fn.plugIntojQuery('Menu', {
		init: function(self, parameters) {
			menu.init($.extend({}, parameters[0], {container:self}));
		}
	});

})(window.kafe)});
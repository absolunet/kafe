(function(global, undefined) { var kafe = global.kafe, $ = kafe.dependencies.jQuery; kafe.bonify({name:'plugin.menu', version:'1.0.0', obj:(function(){

	/**
	* ### Version 1.0.0
	* Attaches javascript behaviors to an HTML menu structure to create a *dropdown* style navigation.
	*
	* To preserve flexibility, the plugin only controls events, speeds, delays and callbacks. It will only manage a single custom class (`kafemenu-open`) on the handle elements upon opening or closing, leaving the positioning, visibility and other asthetic responsabilities to its css.
	*
	* @module kafe.plugin
	* @class kafe.plugin.menu
	*/
	var menu = {};

	/**
	* Attach behaviors to the menu structure.
	*
	* @method init
	* @param {Object} options Initial configurations.
	*	@param {String|jQueryObject|DOMElement} options.selector Root element of the menu structure.
	*	@param {String} [options.handle='li'] Children element of the container that will serve as a handle to open and close the submenu.
	*	@param {String} [options.submenus='ul'] Children element of the handle that will serve as a submenu, opening and closing when the handle is used.
	*	@param {String} [options.animation='slide'] Animation used when opening and closing the submenus.
	*	@param {Number} [options.openSpeed=200] Duration (in milliseconds) of the opening animation.
	*	@param {Number} [options.openDelay=500] Delay (in milliseconds) used when entering the handle before starting the opening animation.
	*	@param {Number} [options.closeSpeed=150] Duration (in milliseconds) of the closing animation.
	*	@param {Number} [options.closeDelay=400] Delay (in milliseconds) used when exiting the handle before starting the closing animation.
	*	@param {Function} [options.enterCallback] Upon entering a handle, will be triggered after the delay but before the animation. The current submenu is passed as a first argument.
	*	@param {Function} [options.leaveCallback] Upon exiting a handle, will be triggered after the delay but before the animation. The current submenu is passed as a first argument.
	*
	* @example
	*	// Sample menu structure
	*	<nav id="main-menu">
	*		<ul>
	*			<li><a href="#">Menu 1</a>
	*				<ul>
	*					<li><a href="#">Submenu 1.1</a></li>
	*					<li><a href="#">Submenu 1.2</a></li>
	*					<li><a href="#">Submenu 1.3</a></li>
	*				</ul>
	*			</li>
	*			<li><a href="#">Menu 2</a>
	*				<ul>
	*					<li><a href="#">Submenu 2.1</a></li>
	*					<li><a href="#">Submenu 2.2</a></li>
	*					<li><a href="#">Submenu 2.3</a></li>
	*				</ul>
	*			</li>
	*		</ul>
	*	</nav>
	*
	* @example
	*	// Attach behaviors using...
	*	kafe.plugin.menu.init({ selector: '#main-menu > ul' });
	*
	* @example
	*	// Or use the jQuery alternative...
	*	$('#main-menu > ul').kafeMenu('init', {});
	*/
	menu.init = function() {
		var
			options = (arguments) ? arguments[0] : {},
			c = {
				$menu:         $(options.selector),
				handle:        (options.handle) ? options.handle : 'li',
				handleBtn:     (options.handleBtn) ? options.handleBtn : 'a',
				submenus:      (options.submenus) ? options.submenus : 'ul',
				animation:     (options.animation) ? options.animation : 'slide',
				openSpeed:     !isNaN(Number(options.openSpeed)) ? Number(options.openSpeed) : 200,
				openDelay:     !isNaN(Number(options.openDelay)) ? Number(options.openDelay) : 500,
				closeSpeed:    !isNaN(Number(options.closeSpeed)) ? Number(options.closeSpeed) : 150,
				closeDelay:    !isNaN(Number(options.closeDelay)) ? Number(options.closeDelay) : 400,
				enterCallback: (typeof(options.enterCallback)  == 'function') ? options.enterCallback  : undefined,
				leaveCallback: (typeof(options.leaveCallback)  == 'function') ? options.leaveCallback  : undefined,
				clickOnly:     !!options.clickOnly
			}
		;

		if (!c.$menu.length) {
			return false;
		}

		var $handles = c.$menu.children(c.handle);

		$handles
			.bind('kafemenu:open', function(){ _openMenu(this, 0); })
			.bind('kafemenu:close', function(){ _closeMenu(this, 0); })
		;

		if (!c.clickOnly) {
			$handles
				.bind('mouseenter', function(e){ _openMenu(this, c.openDelay); })
				.bind('mouseleave', function(e){ _closeMenu(this, c.closeDelay); })
			;
		}
		else
		{
			$handles.each(function(){
				var $handle = $(this);
				if($handle.children(c.submenus).length > 0) {
					$handle.children(c.handleBtn).on('click', function(e){
						e.preventDefault();
						e.stopPropagation();
						var $handle = $(this).parent();
						if($handle.hasClass('kafemenu-open')){
							$handle.trigger('kafemenu:close');
							document.location = $(this).attr('href');
						}else{
							$handles.filter('.kafemenu-open').trigger('kafemenu:close');
							$handle.trigger('kafemenu:open');
						}
					});
				}
			});
			$('html').on('click', function() {
				c.$menu.children(c.handle).filter('.kafemenu-open').trigger('kafemenu:close');
			});
		}

		_closeMenu = function(_handle, _delay){
			var
				$parent = $(_handle),
				$sub = $parent.children(c.submenus),
				_clearclass = function() {
					$parent.removeClass('kafemenu-open');
				}
			;

			if ($sub.data('kafemenu-timer') !== undefined) {
				clearTimeout($sub.data('kafemenu-timer'));
			}

			if ($sub.length > 0) {
				$sub.data('kafemenu-timer', setTimeout(function() {
					var returnCallback = true;
					if (!!c.leaveCallback) {
						returnCallback = c.leaveCallback($sub);
					}
					if (returnCallback) {
						switch (c.animation) {
							case 'fade' :
								$sub.fadeOut(c.closeSpeed, _clearclass);
							break;

							case 'slide' :
								$sub.slideUp(c.closeSpeed, _clearclass);
							break;

							default :
								$sub.hide(c.closeSpeed, _clearclass);
							break;
						}
					}
				}, _delay));
			}
		};

		_openMenu = function(_handle, _delay) {
			var
				$parent = $(_handle),
				$sub = $parent.children(c.submenus)
			;

			if ($sub.data('kafemenu-timer') !== undefined) {
				clearTimeout($sub.data('kafemenu-timer'));
			}

			if ($sub.length > 0) {
				$sub.data('kafemenu-timer', setTimeout(function() {
					$parent.addClass('kafemenu-open');
					var returnCallback = true;
					if (!!c.enterCallback) {
						returnCallback = c.enterCallback($sub);
					}
					if (returnCallback) {
						switch (c.animation) {
							case 'fade' :
								$sub.fadeIn(c.openSpeed);
							break;

							case 'slide' :
								$sub.slideDown(c.openSpeed);
							break;

							default :
								$sub.show(c.openSpeed);
							break;
						}
					}
				}, _delay));
			}
		};
	};


	// Add as jQuery plugin
	kafe.fn.plugIntojQuery('Menu', {
		init: function(obj, parameters) {
			menu.init($.extend({}, parameters[0], {selector:obj}));
		}
	});

	return menu;

})()}); })(typeof window !== 'undefined' ? window : this);
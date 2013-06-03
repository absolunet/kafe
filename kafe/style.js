window.kafe.bonify({name:'style', version:'1.3', obj:(function(kafe,undefined){
	var $ = kafe.dependencies.jQuery;

	// PUBLIC
	var style = {};


	// make all elements the same height
	style.equalHeight = function() {
		var
			$o          = $(arguments[0]),
			options     = arguments[1] || {},
			nbPerRow    = options.nbPerRow,
			resetHeight = !!options.resetHeight,
			borderBox   = !!options.borderBox,

			_doIt = function() {
				var
					$z = $(arguments[0]),
					maxOuterHeight = Math.max.apply(Math, $z.map(function(){ return $(this).outerHeight(); }).get())
				;
				$z.each(function() {
					var $this = $(this);
					$this.height( (borderBox) ? maxOuterHeight : (maxOuterHeight - ($this.outerHeight() - $this.height())) );
				});
			}
		;


		if (resetHeight) {
			$o.height('auto');
		}

		if (!!nbPerRow) {
			var max = Math.ceil($o.length / nbPerRow);
			for (var i=0; i<max; ++i) {
				_doIt($($o.splice(0, nbPerRow)));
			}
		} else {
			_doIt($o);
		}
	};


	// replace <hr> tag with a <div>
	style.replaceHr = function() {
		var $e = (arguments[0]) ? $('hr:not(.kafe-replacehr-processed)', $(arguments[0])) : $('hr');
		$e.addClass('kafe-replacehr-processed').hide().wrap('<div class="hr"></div>');
	};


	// vertically align an element inside its parent
	style.vAlign = function(e, parent) {
		$(e).each(function(){
			var
				$this   = $(this),
				$parent = (parent) ? $(parent) : $this.parent()
			;
			$this.css({display: 'block', marginTop: Math.floor(($parent.height() - $this.height()) / 2) + 'px'});
		});
	};


	// add an opening and closing behavior on a list with custom speeds, delays and animation
	style.quickMenu = function() {
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


	// add an opening and closing behavior
	style.quickTip = function() {
		var
			options = (arguments) ? arguments[0] : {},
			c = {
				$tips:      $(options.selector),
				openSpeed:  (Number(options.openSpeed))  ? Number(options.openSpeed)  : 200,
				openDelay:  (Number(options.openDelay))  ? Number(options.openDelay)  : 500,
				closeSpeed: (Number(options.closeSpeed)) ? Number(options.closeSpeed) : 150,
				closeDelay: (Number(options.closeDelay)) ? Number(options.closeDelay) : 400
			}
		;

		if (!c.$tips.length) {
			return false;
		}

		// WIP
		/*
		c.$tips
			.bind('mouseenter', function(){
				var $sub = $(this).children('[data-kafequicktip-content]');
				
				if ($sub.data('kafequicktip-timer') != undefined)
					clearTimeout($sub.data('kafequicktip-timer'));
					
				$sub.parent().addClass('kafequicktip-open').end().data('kafequicktip-timer', setTimeout(function() {
					$sub.fadeIn(c.openSpeed);
				}, c.openDelay));
			})
			.bind('mouseleave', function(){
				var $sub = $(this).next();
				
				if ($sub.data('kafequicktip-timer') != undefined)
					clearTimeout($sub.data('kafequicktip-timer'));
					
				$sub.data('kafequicktip-timer', setTimeout(function() {
					$sub.parent().removeClass('kafequicktip-open').end().fadeOut(c.closeSpeed);
				}, c.closeDelay));
			});
		*/

	};

	return style;

})(window.kafe)});
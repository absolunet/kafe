//-------------------------------------------
// kafe.style
//-------------------------------------------
kafe.bonify({name:'style', version:'1.5', obj:(function(K,undefined){
	var $ = K.jQuery;
	
	var _name = K.idantite.non;

	//-------------------------------------------
	// PUBLIC
	//-------------------------------------------
	var style = {};


	// equalHeight (elements, [nbPerRow/resetHeight])
	// make all elements the same height
	//-------------------------------------------
	style.equalHeight = function() {
		function _doIt() {
			var $z = $(arguments[0]);
			var maxOuterHeight = Math.max.apply(Math, $z.map(function(){ return $(this).outerHeight(); }).get());
			$z.each(function() {
				var $this = $(this);
				$this.height( maxOuterHeight - ( $this.outerHeight() - $this.height() ) );
			})
		}

		var $o          = $(arguments[0]);
		var options     = arguments[1] || {};
		var nbPerRow    = options.nbPerRow;
		var resetHeight = options.resetHeight;

		if (!!resetHeight) {
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
	
	// makeButton ([elements])
	// add spans to create a flexible button
	//-------------------------------------------
	style.makeButton = function(e) {
		var $e = (e) ? $(e) : $('a.Btn:not(.'+_name+'-makebutton-processed)');
		$e.addClass(_name+'-makebutton-processed').wrapInner('<span class="text" />').prepend('<span class="left" />');
	};
	
	// vAlign ([elements])
	// vertically align an element inside its parent
	//-------------------------------------------
	style.vAlign = function(e) {
		$(e).each(function(){
			var $this = $(this);
			var $children = $this.children();
			if($children.length == 1) {
				var h = Math.floor(($this.height() - $children.height()) / 2);
				$children.css({display: 'block', marginTop: h + 'px'});
			}	
		});
	};
	
	// quickMenu ([params])
	// add an opening and closing behavior on a list with custom speeds, delays and animation
	//-------------------------------------------
	style.quickMenu = function() {
		
		var c = {};
		
		var options  = (arguments) ? arguments[0] : {};
		
		c.container = options.container;
		c.handle = (options.handle) ? options.handle : 'li';
		c.submenus = (options.submenus) ? options.submenus : 'ul';
		c.animation = (options.animation) ? options.animation : 'slide';
		c.openSpeed = (Number(options.openSpeed)) ? Number(options.openSpeed) : 200;
		c.openDelay = (Number(options.openDelay)) ? Number(options.openDelay) : 500;
		c.closeSpeed = (Number(options.closeSpeed)) ? Number(options.closeSpeed) : 150;
		c.closeDelay = (Number(options.closeDelay)) ? Number(options.closeDelay) : 400;
		c.enterCallback  = (typeof(options.enterCallback)  == 'function') ? options.enterCallback  : undefined;
		c.leaveCallback  = (typeof(options.leaveCallback)  == 'function') ? options.leaveCallback  : undefined;
		
		var $menu = $(c.container);
		if (!$menu.length) { return false; }
		
		$menu.children(c.handle)
			.bind('mouseenter', function(){
				var $parent = $(this);
				var $sub = $parent.children(c.submenus);
				
				if ($sub.data('kafe-quickmenu-timer') != undefined)
					clearTimeout($sub.data('kafe-quickmenu-timer'));
				
				$parent.addClass('kafe-quickmenu-open');
				$sub.data('kafe-quickmenu-timer', setTimeout(function() {
					if (!!c.enterCallback) {
						c.enterCallback($sub);
					}
					switch (c.animation) {
						case 'fade' :
							$sub.fadeIn(c.openSpeed);
							break;
						case 'slide' :
						default :
							$sub.slideDown(c.openSpeed);
							break;
					}
				}, c.openDelay));
			})
			.bind('mouseleave', function(){
				var $parent = $(this);
				var $sub = $parent.children(c.submenus);
				
				if ($sub.data('kafe-quickmenu-timer') != undefined)
					clearTimeout($sub.data('kafe-quickmenu-timer'));
				
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
							case 'slide' :
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
			});
		
	};
	
	// quickTip ([params])
	// add an opening and closing behavior
	//-------------------------------------------
	style.quickTip = function() {
		
		var c = {};
		
		var options  = (arguments) ? arguments[0] : {};
		
		c.selector = options.selector;
		c.openSpeed = (Number(options.openSpeed)) ? Number(options.openSpeed) : 200;
		c.openDelay = (Number(options.openDelay)) ? Number(options.openDelay) : 500;
		c.closeSpeed = (Number(options.closeSpeed)) ? Number(options.closeSpeed) : 150;
		c.closeDelay = (Number(options.closeDelay)) ? Number(options.closeDelay) : 400;
		
		var $tips = $(c.selector);
		if (!$tips.length) { return false; }
		
		// WIP
		/*
		$tips
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

})(kafe)});

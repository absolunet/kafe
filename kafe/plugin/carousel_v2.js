window.kafe.plug({name:'carousel', version:'2.0', obj:(function(kafe,undefined){
	var $ = kafe.dependencies.jQuery;

	var 
		_privateData = [],
		_idIndex     = {},
		_prefix      = 'kafecarousel'
	;

	function _getPrivate() {
		return _privateData[arguments[0]._];
	}

	function _autoStart(data) {
		if (data.autoRunning) {
			data.timeout = setTimeout(function(){ _change(data, 'next', true); }, data.autoInterval);
		}
	}
	
	function _autoStop(data) {
		clearTimeout(data.timeout);
		data.timeout = undefined;
	}

	function _changeTODO(data, target) {
		if (!!c.changing) {
			return false;
		}
		if (target == c.curr) {
			return false;
		}	
		c.changing = true;
		c.slideStopAuto();

		var callbackData = {
			action: (Number(target) == target) ? 'item' : target,
			source: {
				position: c.curr+1
			},
			target: {}
		};

		var way;

		// current li
		var $liCurr = c.$Main.children(':nth-child('+(c.curr+1)+')')

		// prev/next
		if (target == 'prev' || target == 'next') {

			way = (target == 'prev') ? -1 : 1;

			c.curr = 
				(c.wrap) ? 
					(c.curr == 0 && way == -1) ? 
						(c.total-1)
						: ((c.curr + way) % c.total)
					: (c.curr + way)
			;

		// item
		} else {
			target == Number(target);

			way = (target < c.curr) ? -1 : 1;
			c.curr = target;
		}

		// new li
		var $liNew = c.$Main.children(':nth-child('+(c.curr+1)+')');


		// add callback data
		callbackData.source.obj      = $liCurr.get(0);
		callbackData.target.position = c.curr+1;
		callbackData.target.obj      = $liNew.get(0);

		if (!!c.preSwitchCallback) {
			c.preSwitchCallback(callbackData);
		}



		// transitions
		switch (c.transition) {

			// fade
			case 'fade': 
				$liCurr.css('z-index',1);

				$liNew
					.css('z-index',2)
					.fadeIn(c.speed, function(){
						$liCurr.hide();
						c.changing = false;
					})
				;
			break;


			// move right-bottom > top-left
			/*
			case 'slideTopLeft': 
				var height = c.$Main.height() + 'px';
				var width = c.$Main.width() + 'px';

				$liCurr.animate({
					top:  (way == 1) ? '-'+height : height,
					left: (way == 1) ? '-'+width  : width
				});

				$liNew
					.css('top',  (way == 1) ? height : '-'+height)
					.css('left', (way == 1) ? width  : '-'+width)
					.animate({
						top:  '0px',
						left: '0px'
					})
				;
			break;
			*/

			// slide horizontal
			case 'slideUp': 
			case 'slideDown': 
				way = (c.transition == 'slideDown') ? -way : way;

				var height = c.$Main.height() + 'px';

				$liCurr.animate(
					{ top: (way == 1) ? '-'+height : height},
					c.speed,
					function() { $(this).hide(); c.changing = false; }
				);

				$liNew
					.css({
						top:     (way == 1) ? height : '-'+height,
						display: 'block'	
					})
					.animate({
						top: '0px'
					},c.speed)
				;
			break;

			// slide vertical
			case 'slideLeft': 
			case 'slideRight': 
			default: 
				way = (c.transition == 'slideRight') ? -way : way;

				var width = c.$Main.width() + 'px';

				$liCurr.animate(
					{ left: (way == 1) ? '-'+width : width },
					c.speed,
					function() { $(this).hide(); c.changing = false; }
				);

				$liNew
					.css({
						left:     (way == 1) ? width : '-'+width,
						display: 'block'	
					})
					.animate({
						left: '0px'
					},c.speed)
				;
			break;
		}

		_refresh(c);

		// éventuellement positionner dans le animate callback
		if (!!c.postSwitchCallback) {
			c.postSwitchCallback(callbackData);
		}

		c.slideStartAuto();
	}

	function _refreshTODO(data) {

		function none(e) { e.preventDefault(); }

		if (!c.wrap) {

			// précédent
			if (c.curr == 0) {
				c.$start
					.addClass(_prefix+'-Inactive')
					.off('click', c.startClick)
					.on('click',  none)
				;
				c.$previous
					.addClass(_prefix+'-Inactive')
					.off('click', c.previousClick)
					.on('click',  none)
				;
			} else {
				c.$start
					.removeClass(_prefix+'-Inactive')
					.off('click', c.startClick)
					.on('click',  c.startClick)
				;
				c.$previous
					.removeClass(_prefix+'-Inactive')
					.off('click', c.previousClick)
					.on('click',  c.previousClick)
				;
			}

			// next
			if (c.curr == (c.total-1)) {
				c.$next
					.addClass(_prefix+'-Inactive')
					.off('click', c.nextClick)
					.on('click',  none)
				;
				c.$end
					.addClass(_prefix+'-Inactive')
					.off('click', c.endClick)
					.on('click',  none)
				;
			} else {
				c.$next
					.removeClass(_prefix+'-Inactive')
					.off('click', c.nextClick)
					.on('click',  c.nextClick)
				;
				c.$end
					.removeClass(_prefix+'-Inactive')
					.off('click', c.endClick)
					.on('click',  c.endClick)
				;
			}
		}


		// position
		c.$position.html(c.curr+1);

		// status
		c.$status.html('');
		c.$statusNum.html('');
		for (var i=0; i<c.total; ++i) {
			if (i == c.curr) {
				c.$status.append('<strong>'+c.statusBullet+'</strong>');
				c.$statusNum.append('<strong>'+(i+1)+'</strong>');
			} else {
				if(!!c.statusLink) {
					c.$status.append(
						$('<a>')
							.attr('href','#')
							.data(_prefix+'-itemid', i+1)
							.on('click',c.itemSimpleClick)
							.html(c.statusBullet)
					);
					c.$statusNum.append(
						$('<a>')
							.attr('href','#')
							.data(_prefix+'-itemid', i+1)
							.on('click',c.itemSimpleClick)
							.html(i+1)
					);
				} else {
					c.$status.append(c.statusBullet);
					c.$statusNum.append(i+1);
				}
			}
		}
	}

	// bind events
	$('body')
		.on('click', '[data-'+_prefix+'-action]', function(e) {
			e.preventDefault();
		
			var 
				$this  = $(this),
				data   = _privateData[_idIndex[$this.data(_prefix+'-id')]]
			;
		
			switch ($this.data(_prefix+'-action')) {
				case 'start':
					_change(data, 0);
				break;

				case 'prev':
					_change(data, 'prev');
				break;

				case 'next':
					_change(data, 'next');
				break;

				case 'end':
					_change(data, c.total-1);
				break;

				case 'items':
					_change(data, $this.index());
				break;

				case 'item':
					_change(data, $this.data(_prefix+'-itemid') - 1);
				break;
					
				case 'play':
					data.autoRunning = true;
					_autoStart(data);
				break;

				case 'pause':
					data.autoRunning = false;
					_autoStop(data);
				break;
			}
		})
		
		.on('mousenter mouseleave', '[data-'+_prefix+']', function(e){
			e.preventDefault();
			
			var data  = _privateData[_idIndex[$this.data(_prefix+'-id')]];
			
			switch (e.type) {
				case 'mouseenter':
					_autoStop(data);
				break;

				case 'mouseleave':
					_autoStart(data);
				break;
			}
		})
	;

	//-------------------------------------------
	// PUBLIC
	//-------------------------------------------
	var carousel = kafe.fn.createInstantiableObject();
	
	// init ([options])
	// initialize a new carousel
	//-------------------------------------------
	carousel.prototype.init = function(options) {
		if (!this._) {
			options = options || {};

			_privateData.push({});
			this._ = _privateData.length-1;
			_idIndex[options.id] = this._;

			var self = this, _ = _getPrivate(self);

			// options
			_.id           = options.id;                                                                     // carousel id
			_.wrap         = !!options.wrap;                                                                 // wrap at the end
			_.transition   = (options.transition)           ? options.transition            : 'slideLeft';   // animation type
			_.speed        = (Number(options.speed))        ? Number(options.speed)         : 500;           // animation speed in ms
			_.startId      = (Number(options.startId))      ? Number(options.startId)       : 1;             // postion to start on
			_.autointerval = (Number(options.autointerval)) ? Number(options.autointerval)  : 0;             // number of ms before autoswitching
			_.changeNb     = (Number(options.changeNb))     ? Number(options.changeNb)      : 1;             // number of items to change at a time
			_.showNb       = (Number(options.showNb))       ? Number(options.showNb)        : 1;             // number of items to show at a time
			
			_.preChangeCallback  = (typeof(options.preChangeCallback)  == 'function') ? options.preChangeCallback  : undefined;     // pre-change callback
			_.postChangeCallback = (typeof(options.postChangeCallback) == 'function') ? options.postChangeCallback : undefined;     // post-change callback
			_.statusBullet       = (options.statusBullet) ? options.statusBullet : '<span>&bull;</span>';                           // status content
			_.statusLink         = !!options.statusLink;                                                                            // link on status item

			// base
			_.$container = $('[data-'+_prefix+'="'+_.id+'"]');
			if (!_.$container.length) { return false; }

			_.$elements      = _.$container.children();
			_.$elementsFirst = _.$elements.eq(0);
			_.total          = _.$elements.length;

			var 
				all       = $('[data-'+_prefix+'-id="'+_.id+'"]'),
				controls  = all.filter('[data-'+_prefix+'-action]'),
				display   = all.filter('[data-'+_prefix+'-display]')
			;

			// controls
			_.$start      = all.filter('[data-'+_prefix+'-action="start"]');
			_.$previous   = all.filter('[data-'+_prefix+'-action="prev"]');
			_.$next       = all.filter('[data-'+_prefix+'-action="next"]');
			_.$end        = all.filter('[data-'+_prefix+'-action="end"]');
			_.$items      = all.filter('[data-'+_prefix+'-action="items"]');
			_.$itemsimple = all.filter('[data-'+_prefix+'-action="item"]');
			_.$play       = all.filter('[data-'+_prefix+'-action="play"]');
			_.$pause      = all.filter('[data-'+_prefix+'-action="pause"]');

			// position
			_.$position  = all.filter('[data-'+_prefix+'-display="position"]');
			_.$total     = all.filter('[data-'+_prefix+'-display="total"]');
			_.$status    = all.filter('[data-'+_prefix+'-display="status"]');
			_.$statusNum = all.filter('[data-'+_prefix+'-display="status-num"]');


			// disable elements if one element
			if (_.total == 1) {
				all.addClass(_prefix+'-disabled');

			// setup
			} else {
				_.curr     = _.startId-1;
				_.changing = false;
				
				// initialize look
				_.$total.html(c.total);
				_refresh(c);

				_.$elements.hide();
				_.$container.children(':nth-child('+_.startId+')').show();

				switch (_.transition) {

					// move vertical
					case 'slideUp': 
					case 'slideDown': 
						_.$elements.css({ left:0 });
						_.$elementsFirst.css({ top:0 );
					break;

					// move horizontal
					case 'slideLeft': 
					case 'slideRight': 
					default:
						_.$elements.css({ top:0 });
						_.$elementsFirst.css({ left:0 );
					break;
				}

				// autostart	
				if (_.autoInterval != undefined) {
					_.autoRunning = true;
					_autoStart(_);
				}
			}
		}
	};
	
	// change (target)
	// manual change
	//-------------------------------------------
	carousel.prototype.change = function(target) {
		_change(_getPrivate(this),target);
	};

	// dump ()
	// dump carousel data
	//-------------------------------------------
	carousel.prototype.dump = function() {
		console.log(_getPrivate(this));
	};
	
	return carousel;

})(window.kafe)});

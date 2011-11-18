//-------------------------------------------
// kafe.plugin.carousel
//-------------------------------------------
kafe.plug({name:'carousel', version:'1.0', obj:(function($,K,undefined){

	// local variables
	var
		_DEBUG = false,
		_all = {}
	;

	// _refresh
	//-------------------------------------------
	function _refresh(c) {

		function none(e) { e.preventDefault(); }

		if (!c.wrap) {

			// précédent
			if (c.curr == 0) {
				c.$start
					.addClass('kafeCarousel-Inactive')
					.unbind('click', c.startClick)
					.bind('click',   none)
				;
				c.$previous
					.addClass('kafeCarousel-Inactive')
					.unbind('click', c.previousClick)
					.bind('click',   none)
				;
			} else {
				c.$start
					.removeClass('kafeCarousel-Inactive')
					.unbind('click', c.startClick)
					.bind('click',   c.startClick)
				;
				c.$previous
					.removeClass('kafeCarousel-Inactive')
					.unbind('click', c.previousClick)
					.bind('click',   c.previousClick)
				;
			}

			// next
			if (c.curr == (c.total-1)) {
				c.$next
					.addClass('kafeCarousel-Inactive')
					.unbind('click', c.nextClick)
					.bind('click',   none)
				;
				c.$end
					.addClass('kafeCarousel-Inactive')
					.unbind('click', c.endClick)
					.bind('click',   none)
				;
			} else {
				c.$next
					.removeClass('kafeCarousel-Inactive')
					.unbind('click', c.nextClick)
					.bind('click',   c.nextClick)
				;
				c.$end
					.removeClass('kafeCarousel-Inactive')
					.unbind('click', c.endClick)
					.bind('click',   c.endClick)
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
						$("<a>")
							.attr("href","#")
							.data('kafecarousel-itemid', i+1)
							.click(c.itemSimpleClick)
							.html(c.statusBullet)
					);
					c.$statusNum.append(
						$("<a>")
							.attr("href","#")
							.data('kafecarousel-itemid', i+1)
							.click(c.itemSimpleClick)
							.html(i+1)
					);
				} else {
					c.$status.append(c.statusBullet);
					c.$statusNum.append(i+1);
				}
			}
		}
	}


	// _change (carousel, target_position)
	// do a position change
	//-------------------------------------------
	function _change(c, target) {

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
		var $liCurr = c.$Main.find('> li:nth-child('+(c.curr+1)+')')

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
		var $liNew = c.$Main.find('> li:nth-child('+(c.curr+1)+')');


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











	//-------------------------------------------
	// PUBLIC
	//-------------------------------------------
	var carousel  = {};

	// init (id/[see below])
	// initialize a new carousel
	//-------------------------------------------
	carousel.init = function() {
		var c = {};

		var options  = (arguments) ? arguments[0] : {};
		c.id         = options.id;
		c.wrap       = !!options.wrap;
		c.transition = (options.transition) ? options.transition : 'slideLeft';
		c.speed      = (Number(options.speed))   ? Number(options.speed)   : 500;
		c.startId    = (Number(options.startId)) ? Number(options.startId) : 1;
		/*
		c.autostart  = 
			(options.autostart) ? (
				(Number(options.autostart.start)) ? 
					Number(options.autostart.start)
					: 3000)
				: undefined
		;*/
		c.autointerval = 
			(options.autostart) ? (
				(Number(options.autostart.interval)) ? 
					Number(options.autostart.interval) 
					: 3000)
				: undefined
		;
		c.preSwitchCallback  = (typeof(options.preSwitchCallback)  == 'function') ? options.preSwitchCallback  : undefined;
		c.postSwitchCallback = (typeof(options.postSwitchCallback) == 'function') ? options.postSwitchCallback : undefined;
		c.statusLink         = !!options.statusLink;
		c.statusBullet       = (options.statusBullet) ? options.statusBullet : '&bull;';

		// Liste
		c.$Main      = $('#'+c.id);
		if (!c.$Main.length) { return false; }

		c.$MainItems     = c.$Main.find('> li');
		c.$MainFirstItem = c.$Main.find('> li:first-child');
		c.total          = c.$MainItems.length;

		// nav
		c.$all        = $('[data-kafecarousel-id="'+c.id+'"]');
		c.$nav        = c.$all.filter('[data-kafecarousel-action="nav"]');
		c.$start      = c.$all.filter('[data-kafecarousel-action="start"]');
		c.$previous   = c.$all.filter('[data-kafecarousel-action="prev"]');
		c.$next       = c.$all.filter('[data-kafecarousel-action="next"]');
		c.$end        = c.$all.filter('[data-kafecarousel-action="end"]');
		c.$items      = c.$all.filter('[data-kafecarousel-action="items"]');
		c.$itemsimple = c.$all.filter('[data-kafecarousel-action="item"]');
		c.$play       = c.$all.filter('[data-kafecarousel-action="play"]');
		c.$pause      = c.$all.filter('[data-kafecarousel-action="pause"]');

		// position
		c.$position  = c.$all.filter('[data-kafecarousel-action="position"]');
		c.$total     = c.$all.filter('[data-kafecarousel-action="total"]');
		c.$status    = c.$all.filter('[data-kafecarousel-action="status"]');
		c.$statusNum = c.$all.filter('[data-kafecarousel-action="status-num"]');

		// désactiver tout si un seul item
		if (c.total == 1) {
			c.$nav.addClass('kafeCarousel-None');
			c.$previous.addClass('kafeCarousel-None');
			c.$next.addClass('kafeCarousel-None');
			c.$items.addClass('kafeCarousel-None');
			c.$itemsimple.addClass('kafeCarousel-None');
			c.$position.addClass('kafeCarousel-None');
			c.$total.addClass('kafeCarousel-None');
			c.$status.addClass('kafeCarousel-None');
			c.$statusNum.addClass('kafeCarousel-None');

		// sinon préparer carousel
		} else {

			// initial
			c.curr     = c.startId-1;
			c.changing = false;

			// general events				
			c.startClick = function(e){ 
				e.preventDefault();
				_change(c, 0);
			};

			c.previousClick = function(e){ 
				e.preventDefault();
				_change(c, 'prev');
			};

			c.nextClick = function(e){ 
				e.preventDefault();
				_change(c, 'next');
			};

			c.endClick = function(e){ 
				e.preventDefault();
				_change(c, c.total-1);
			};

			c.itemSimpleClick = function(e){ 
				e.preventDefault();
				_change(c, $(this).data('kafecarousel-itemid') - 1);
			};

			c.playClick = function(e){ 
				e.preventDefault();
				c.AutoRunning = true;
				c.slideStartAuto();
			};

			c.pauseClick = function(e){ 
				e.preventDefault();
				c.AutoRunning = false;
				c.slideStopAuto();
			};

			c.slideStartAuto = function(){ 
				if (c.AutoRunning) {
					c.Timeout = setTimeout(function(){ _change(c, 'next', true); }, c.autointerval);
				}
			};

			c.slideStopAuto = function(){ 
				clearTimeout(c.Timeout);
				c.Timeout = undefined;
			};




			// bind events				
			c.$start.click(c.startClick)
			c.$previous.click(c.previousClick)
			c.$next.click(c.nextClick)
			c.$end.click(c.endClick)
			c.$itemsimple.click(c.itemSimpleClick);

			c.$items.find('> li').each(function(i){ 
				$(this).click(function(e){
					e.preventDefault();
					_change(c, i);
				});
			});

			c.$play.click(c.playClick)
			c.$pause.click(c.pauseClick);

			c.$MainItems
				.mouseenter(c.slideStopAuto)
				.mouseleave(c.slideStartAuto)
			;




			// intialiser look
			c.$total.html(c.total);
			_refresh(c);

			c.$MainItems.hide();
			c.$Main.find('> li:nth-child('+c.startId+')').show();

			switch (c.transition) {
				// fade
				case 'fade': 
				break;


				// move vertical
				case 'slideUp': 
				case 'slideDown': 
					c.$MainItems.css({
						left: '0px'
					});
					c.$MainFirstItem.css('top','0px');
				break;

				// move horizontal
				case 'slideLeft': 
				case 'slideRight': 
				default:
					c.$MainItems.css({
						top: '0px'
					});
					c.$MainFirstItem.css('left','0px');
				break;
			}


			// autostart	
			if (c.autointerval != undefined) {
				c.AutoRunning = true;
				c.slideStartAuto();
			}


			// Ajouter à la liste
			_all[c.id] = c;
		}
	}; 


	// change (id, target_position)
	// manual change
	//-------------------------------------------
	carousel.change = function(id, target) {
		return _change(_all[id], (Number(target) == target) ? target-1 : target);
	};

	// debug only
	if (_DEBUG) {
		carousel.carousels = _all;
	}



	return carousel;

})(jQuery,kafe)});
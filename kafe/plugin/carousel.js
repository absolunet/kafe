kafe.plug({name:'carousel', version:'1.0.2', obj:(function(K,undefined){
	var
		$         = kafe.dependencies.jQuery,
		carousels = {},

		// refresh active/inactive controls, and statuses
		_refresh = function(c) {

			var none = function(e) { e.preventDefault(); };

			if (!c.wrap) {

				// précédent
				if (c.curr === 0) {
					c.$start
						.addClass('kafecarousel-Inactive')
						.off('click', c.startClick)
						.on('click',  none)
					;
					c.$previous
						.addClass('kafecarousel-Inactive')
						.off('click', c.previousClick)
						.on('click',  none)
					;
				} else {
					c.$start
						.removeClass('kafecarousel-Inactive')
						.off('click', c.startClick)
						.on('click',  c.startClick)
					;
					c.$previous
						.removeClass('kafecarousel-Inactive')
						.off('click', c.previousClick)
						.on('click',  c.previousClick)
					;
				}

				// next
				if (c.curr == (c.total-1)) {
					c.$next
						.addClass('kafecarousel-Inactive')
						.off('click', c.nextClick)
						.on('click',  none)
					;
					c.$end
						.addClass('kafecarousel-Inactive')
						.off('click', c.endClick)
						.on('click',  none)
					;
				} else {
					c.$next
						.removeClass('kafecarousel-Inactive')
						.off('click', c.nextClick)
						.on('click',  c.nextClick)
					;
					c.$end
						.removeClass('kafecarousel-Inactive')
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
								.data('kafecarousel-itemid', i+1)
								.on('click',c.itemSimpleClick)
								.html(c.statusBullet)
						);
						c.$statusNum.append(
							$('<a>')
								.attr('href','#')
								.data('kafecarousel-itemid', i+1)
								.on('click',c.itemSimpleClick)
								.html(i+1)
						);
					} else {
						c.$status.append(c.statusBullet);
						c.$statusNum.append(i+1);
					}
				}
			}
		},


		// change the slide
		_change = function(c, target) {

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
			var $liCurr = c.$Main.children(':nth-child('+(c.curr+1)+')');

			// prev/next
			if (target == 'prev' || target == 'next') {

				way = (target == 'prev') ? -1 : 1;

				c.curr =
					(c.wrap) ?
						(c.curr === 0 && way == -1) ?
							(c.total-1)
							: ((c.curr + way) % c.total)
						: (c.curr + way)
				;

			// item
			} else {
				target = Number(target);

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
				//case 'slideLeft':
				//case 'slideRight':
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
	;










	/**
	* ### Version 1.0.2
	* Carousel, image scroller, ticker, whatever you wanna call it...
	*
	* They can also be interacted with remotely by first, linking to the carousel using the `data-kafecarousel-id` attribute and then choosing a specific action with the `data-kafecarousel-action` attribute.
	* Possible actions are `nav`, `start`, `prev`, `next`, `end`, `items`, `item`, `play`, `pause`, `position`, `total`, `status` and `status-num`.
	*
	* @module kafe.plugin
	* @class kafe.plugin.carousel
	*/
	var carousel = {};

	/**
	* Attach behaviors to the carousel structure.
	*
	* @method init
	* @param {Object} options Initial configurations
	*	@param {String|jQueryObject|DOMElement} selector The slide container.
	*	@param {Boolean} [options.wrap=false] If true, will loop back to the first slide upon reaching the last one. The same is enabled in reverse.
	*	@param {String} [options.transition='slideLeft'] Animation used during a transition. Possible values are `slideLeft`, `slideRight`, `slideUp`, `slideDown` and `fade`.
	*	@param {Number} [options.speed=500] Duration (in milliseconds) of the transition.
	*	@param {Number} [options.startId=1] Index of the starting slide, starting at 1.
	*	@param {Object} [options.autostart=undefined] Allows slides to change without a user interaction after a chosen delay.
	*		@param {Number} [options.autostart.interval=3000] Delay (in milliseconds) before starting a transition to the next slide. The transition duration is included in the delay. As an example, an `interval` of 3000 combined with a `speed` of 500 will hold a slide still for 2500 milliseconds before starting the transition.
	*	@param {Function} [options.preSwitchCallback=undefined] Trigged upon receiving an instruction to change the current slide but before starting the transition. The following object is passed as a first argument:
	*		@param {Object} options.preSwitchCallback.data An object containing information relative to the transition in progress.
	*			@param {String} options.preSwitchCallback.data.action Current action being performed. Possible values are `prev`, `next` or `item` when using a specific index.
	*			@param {Object} options.preSwitchCallback.data.source Information about the slide being changed.
	*				@param {Number} options.preSwitchCallback.data.source.position Index of the source slide.
	*				@param {jQueryObject} options.preSwitchCallback.data.source.obj Reference to the source slide.
	*			@param {Object} options.preSwitchCallback.data.target Information about the destination slide.
	*				@param {Number} options.preSwitchCallback.data.target.position Index of the target slide.
	*				@param {jQueryObject} options.preSwitchCallback.data.target.obj Reference to the target slide.
	*	@param {Function} [options.postSwitchCallback=undefined] Trigged upon receiving an instruction to change the current slide but before starting the transition. Passes the same argument object as the `preSwitchCallback`.
	*	@param {Boolean} [options.statusLink=false] If true, will generate navigation links in elements linked to the carousel via `data-kafecarousel-id` and the `data-kafecarousel-action="status"` attribute.
	*	@param {String} [options.statusBullet='&bull;'] Text used as the content of generated link in a `statusLink` navigation.
	*
	* @example
	*	// Sample carousel structure
	*	<section class="home-carousel">
	*		<ul id="home-slides" data-kafecarousel-id="home-news">
	*			<li><a href="#"><img src="/images/slide-01.jpg" /></a></li>
	*			<li><a href="#"><img src="/images/slide-01.jpg" /></a></li>
	*			<li><a href="#"><img src="/images/slide-01.jpg" /></a></li>
	*		</ul>
	*		<a href="" data-kafecarousel-id="home-news" data-kafecarousel-action="prev">Back</a>
	*		<a href="" data-kafecarousel-id="home-news" data-kafecarousel-action="next">Next</a>
	*		<div data-kafecarousel-id="home-news" data-kafecarousel-action="status"></div>
	*	</section>
	*	
	* @example
	*	// Attach behaviors using...
	*	kafe.plugin.carousel.init({ selector: '#home-slides' });
	* @example
	*	// Carousels can be remotely interacted with using custom data attributes...
	*	kafe.plugin.carousel.init({ selector: '#home-slides' });
	* @example
	*	// The jQuery alternative...
	*	$('#home-slides').kafeCarousel('init', {});
	*/
	carousel.init = function() {
		var
			options = (arguments) ? arguments[0] : {},

			c = {
				$Main:        $(options.selector),
				wrap:         !!options.wrap,
				transition:   (options.transition)      ? options.transition : 'slideLeft',
				speed:        (Number(options.speed))   ? Number(options.speed)   : 500,
				startId:      (Number(options.startId)) ? Number(options.startId) : 1,
				autointerval: (
					(options.autostart) ? (
						(Number(options.autostart.interval)) ?
							Number(options.autostart.interval)
							: 3000)
						: undefined
				),
				preSwitchCallback:    (typeof(options.preSwitchCallback)  == 'function') ? options.preSwitchCallback  : undefined,
				postSwitchCallback:   (typeof(options.postSwitchCallback) == 'function') ? options.postSwitchCallback : undefined,
				initCompleteCallback: (typeof(options.initCompleteCallback)  == 'function') ? options.initCompleteCallback  : undefined,
				statusLink:           !!options.statusLink,
				statusBullet:         (options.statusBullet) ? options.statusBullet : '&bull'
			}
		;

		// Liste
		if (!c.$Main.length) {
			return false;
		} else {
			c.id = c.$Main.data('kafecarousel-id');
		}

		c.$MainItems     = c.$Main.children();
		c.$MainFirstItem = c.$MainItems.eq(0);
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
			c.$nav.addClass('kafecarousel-None');
			c.$previous.addClass('kafecarousel-None');
			c.$next.addClass('kafecarousel-None');
			c.$items.addClass('kafecarousel-None');
			c.$itemsimple.addClass('kafecarousel-None');
			c.$position.addClass('kafecarousel-None');
			c.$total.addClass('kafecarousel-None');
			c.$status.addClass('kafecarousel-None');
			c.$statusNum.addClass('kafecarousel-None');

		// sinon préparer carousel
		} else {

			// initial
			c.curr     = c.startId-1;
			c.changing = false;

			// general events				
			c.startClick = function(e) {
				e.preventDefault();
				_change(c, 0);
			};

			c.previousClick = function(e) {
				e.preventDefault();
				_change(c, 'prev');
			};

			c.nextClick = function(e) {
				e.preventDefault();
				_change(c, 'next');
			};

			c.endClick = function(e) {
				e.preventDefault();
				_change(c, c.total-1);
			};

			c.itemSimpleClick = function(e) {
				e.preventDefault();
				_change(c, $(this).data('kafecarousel-itemid') - 1);
			};

			c.playClick = function(e) {
				e.preventDefault();
				c.AutoRunning = true;
				c.slideStartAuto();
			};

			c.pauseClick = function(e) {
				e.preventDefault();
				c.AutoRunning = false;
				c.slideStopAuto();
			};

			c.slideStartAuto = function() {
				if (c.AutoRunning) {
					c.Timeout = setTimeout(function(){ _change(c, 'next', true); }, c.autointerval);
				}
			};

			c.slideStopAuto = function() {
				clearTimeout(c.Timeout);
				c.Timeout = undefined;
			};




			// on events
			c.$start.on('click',c.startClick);
			c.$previous.on('click',c.previousClick);
			c.$next.on('click',c.nextClick);
			c.$end.on('click',c.endClick);
			c.$itemsimple.on('click',c.itemSimpleClick);

			c.$items.children().each(function(i) {
				$(this).on('click',function(e){
					e.preventDefault();
					_change(c, i);
				});
			});

			c.$play.on('click',c.playClick);
			c.$pause.on('click',c.pauseClick);

			c.$MainItems.on({
				mouseenter: c.slideStopAuto,
				mouseleave: c.slideStartAuto
			});




			// intialiser look
			c.$total.html(c.total);
			_refresh(c);

			c.$MainItems.hide();
			c.$Main.children(':nth-child('+c.startId+')').show();

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
				//case 'slideLeft':
				//case 'slideRight':
				default:
					c.$MainItems.css({
						top: '0px'
					});
					c.$MainFirstItem.css('left','0px');
				break;
			}


			// autostart	
			if (c.autointerval !== undefined) {
				c.AutoRunning = true;
				c.slideStartAuto();
			}


			// Ajouter à la liste
			carousels[c.id] = c;

		}

		// Init. Completed callback
		if (!!c.initCompleteCallback) {
			c.initCompleteCallback(c);
		}
	};


	/**
	* Manually call a slide change
	*
	* @method change
	* @param {String} id Carousel `data-kafecarousel-id` id
	* @param {String|Number} target Action or 1-based slide position
	*
	* @example
	*	// Go to next slide
	*	kafe.plugin.carousel.change('home-news', 'next');
	* @example
	*	// Go to first slide 
	*	kafe.plugin.carousel.change('home-news', 1);
	* @example
	*	// The jQuery alternative...
	*	$('#home-slides').kafeCarousel('change', 1);
	*/
	carousel.change = function(id, target) {
		return _change(carousels[id], (Number(target) == target) ? target-1 : target);
	};



	// Add as jQuery plugin
	kafe.fn.plugIntojQuery('Carousel', {
		init: function(self, parameters) {
			carousel.init($.extend({}, parameters[0], {selector:self}));
		},
		change: function(self, parameters) {
			carousel.change($(self).data('kafecarousel-id'), parameters[0]);
		}
	});

	return carousel;

})(window.kafe)});
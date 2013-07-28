window.kafe.plug({name:'carousel', version:'1.0.2', obj:(function(K,undefined){
	var
		$ = kafe.dependencies.jQuery,

		// refresh active/inactive controls, and statuses
		refresh = function(self) {
			var
				__ = self.__,
				none = function(e) { e.preventDefault(); }
			;

			if (!__.wrap) {

				// précédent
				if (__.curr === 0) {
					__.$start
						.addClass('kafecarousel-inactive')
						.off('click', __.startClick)
						.on('click',  none)
					;
					__.$previous
						.addClass('kafecarousel-inactive')
						.off('click', __.previousClick)
						.on('click',  none)
					;
				} else {
					__.$start
						.removeClass('kafecarousel-inactive')
						.off('click', __.startClick)
						.on('click',  __.startClick)
					;
					__.$previous
						.removeClass('kafecarousel-inactive')
						.off('click', __.previousClick)
						.on('click',  __.previousClick)
					;
				}

				// next
				if (__.curr == (__.total-1)) {
					__.$next
						.addClass('kafecarousel-inactive')
						.off('click', __.nextClick)
						.on('click',  none)
					;
					__.$end
						.addClass('kafecarousel-inactive')
						.off('click', __.endClick)
						.on('click',  none)
					;
				} else {
					__.$next
						.removeClass('kafecarousel-inactive')
						.off('click', __.nextClick)
						.on('click',  __.nextClick)
					;
					__.$end
						.removeClass('kafecarousel-inactive')
						.off('click', __.endClick)
						.on('click',  __.endClick)
					;
				}
			}


			// position
			__.$position.html(__.curr+1);

			// status
			__.$status.html('');
			__.$statusNum.html('');
			for (var i=0; i<__.total; ++i) {
				if (i == __.curr) {
					__.$status.append('<strong>'+__.statusBullet+'</strong>');
					__.$statusNum.append('<strong>'+(i+1)+'</strong>');
				} else {
					if(!!__.statusLink) {
						__.$status.append(
							$('<a>')
								.attr('href','#')
								.data('kafecarousel-itemid', i+1)
								.on('click',__.itemSimpleClick)
								.html(__.statusBullet)
						);
						__.$statusNum.append(
							$('<a>')
								.attr('href','#')
								.data('kafecarousel-itemid', i+1)
								.on('click',__.itemSimpleClick)
								.html(i+1)
						);
					} else {
						__.$status.append(__.statusBullet);
						__.$statusNum.append(i+1);
					}
				}
			}
		},


		// change the slide
		change = function(self, target) {
			var __ = self.__;

			if (!!__.changing) {
				return false;
			}
			if (target == __.curr) {
				return false;
			}
			__.changing = true;
			__.slideStopAuto();

			var callbackData = {
				action: (Number(target) == target) ? 'item' : target,
				source: {
					position: __.curr+1
				},
				target: {}
			};

			var way;

			// current li
			var $liCurr = __.$MainItems.eq(__.curr);

			// prev/next
			if (target == 'prev' || target == 'next') {

				way = (target == 'prev') ? -1 : 1;

				__.curr =
					(__.wrap) ?
						(__.curr === 0 && way == -1) ?
							(__.total-1)
							: ((__.curr + way) % __.total)
						: (__.curr + way)
				;

			// item
			} else {
				target = Number(target);

				way = (target < __.curr) ? -1 : 1;
				__.curr = target;
			}

			// new li
			var $liNew = __.$MainItems.eq(__.curr);


			// add callback data
			callbackData.source.obj      = $liCurr.get(0);
			callbackData.target.position = __.curr+1;
			callbackData.target.obj      = $liNew.get(0);

			if (!!__.preSwitchCallback) {
				__.preSwitchCallback(callbackData);
			}



			// transitions
			switch (__.transition) {

				// fade
				case 'fade':
					$liCurr.css('z-index',1);

					$liNew
						.css('z-index',2)
						.fadeIn(__.speed, function(){
							$liCurr.hide();
							__.changing = false;
						})
					;
				break;


				// move right-bottom > top-left
				/*
				case 'slideTopLeft': 
					var height = __.$Main.height() + 'px';
					var width = __.$Main.width() + 'px';

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
					way = (__.transition == 'slideDown') ? -way : way;

					var height = __.$Main.height() + 'px';

					$liCurr.animate(
						{ top: (way == 1) ? '-'+height : height},
						__.speed,
						function() { $(this).hide(); __.changing = false; }
					);

					$liNew
						.css({
							top:     (way == 1) ? height : '-'+height,
							display: 'block'
						})
						.animate({
							top: '0px'
						},__.speed)
					;
				break;

				// slide vertical
				//case 'slideLeft':
				//case 'slideRight':
				default:
					way = (__.transition == 'slideRight') ? -way : way;

					var width = __.$Main.width() + 'px';

					$liCurr.animate(
						{ left: (way == 1) ? '-'+width : width },
						__.speed,
						function() { $(this).hide(); __.changing = false; }
					);

					$liNew
						.css({
							left:     (way == 1) ? width : '-'+width,
							display: 'block'
						})
						.animate({
							left: '0px'
						},__.speed)
					;
				break;
			}

			refresh(self);

			// éventuellement positionner dans le animate callback
			if (!!__.postSwitchCallback) {
				__.postSwitchCallback(callbackData);
			}

			__.slideStartAuto();
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
	var carousel = kafe.fn.createInstantiableObject();

	/**
	* Attach behaviors to the carousel structure.
	*
	* @method __constructor
	* @param {Object} options Initial configurations
	*	@param {String|jQueryObject|DOMElement} options.selector The slide container.
	*	@param {Boolean} [options.wrap=true] If true, will loop back to the first slide upon reaching the last one. The same is enabled in reverse.
	*	@param {String} [options.transition='slideLeft'] Animation used during a transition. Possible values are `slideLeft`, `slideRight`, `slideUp`, `slideDown` and `fade`.
	*	@param {Number} [options.speed=500] Duration (in milliseconds) of the transition.
	*	@param {Number} [options.startId=1] Index of the starting slide, starting at 1.
	*	@param {Object} [options.autostart] Allows slides to change without a user interaction after a chosen delay.
	*		@param {Number} [options.autostart.interval=3000] Delay (in milliseconds) before starting a transition to the next slide. The transition duration is included in the delay. As an example, an `interval` of 3000 combined with a `speed` of 500 will hold a slide still for 2500 milliseconds before starting the transition.
	*	@param {Function} [options.preSwitchCallback] Trigged upon receiving an instruction to change the current slide but before starting the transition. The following object is passed as a first argument:
	*		@param {Object} options.preSwitchCallback.data An object containing information relative to the transition in progress.
	*			@param {String} options.preSwitchCallback.data.action Current action being performed. Possible values are `prev`, `next` or `item` when using a specific index.
	*			@param {Object} options.preSwitchCallback.data.source Information about the slide being changed.
	*				@param {Number} options.preSwitchCallback.data.source.position Index of the source slide.
	*				@param {DOMElement} options.preSwitchCallback.data.source.obj Reference to the source slide.
	*			@param {Object} options.preSwitchCallback.data.target Information about the destination slide.
	*				@param {Number} options.preSwitchCallback.data.target.position Index of the target slide.
	*				@param {DOMElement} options.preSwitchCallback.data.target.obj Reference to the target slide.
	*	@param {Function} [options.postSwitchCallback] Trigged upon receiving an instruction to change the current slide but before starting the transition. Passes the same argument object as the `preSwitchCallback`.
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
	*	var myCarousel = kafe.plugin.carousel({ selector: '#home-slides' });
	* @example
	*	// Carousels can be remotely interacted with using custom data attributes...
	*	var myCarousel = kafe.plugin.carousel({ selector: '#home-slides' });
	* @example
	*	// The jQuery alternative...
	*	$('#home-slides').kafeCarousel('init', {});
	*/
	carousel.prototype.__constructor = function(options) {
		options = (options) ? options : {};

		var self = this, __ = self.__;

		__.$Main        = $(options.selector).data('kafecarousel-self', self);
		__.wrap         = (options.wrap === false) ? false : true;
		__.transition   = (options.transition)      ? options.transition      : 'slideLeft';
		__.speed        = (Number(options.speed))   ? Number(options.speed)   : 500;
		__.startId      = (Number(options.startId)) ? Number(options.startId) : 1;
		__.autointerval = (
			(options.autostart) ? (
				(Number(options.autostart.interval)) ?
					Number(options.autostart.interval)
					: 3000)
				: undefined
		);
		__.preSwitchCallback    = (typeof(options.preSwitchCallback)  == 'function')    ? options.preSwitchCallback    : undefined;
		__.postSwitchCallback   = (typeof(options.postSwitchCallback) == 'function')    ? options.postSwitchCallback   : undefined;
		__.initCompleteCallback = (typeof(options.initCompleteCallback)  == 'function') ? options.initCompleteCallback : undefined;
		__.statusLink           = !!options.statusLink;
		__.statusBullet         = (options.statusBullet) ? options.statusBullet : '&bull';


		// elements
		__.id             = __.$Main.data('kafecarousel-id');
		__.$MainItems     = __.$Main.children();
		__.$MainFirstItem = __.$MainItems.eq(0);
		__.total          = __.$MainItems.length;

		// nav
		__.$all        = $('[data-kafecarousel-id="'+__.id+'"]');
		__.$nav        = __.$all.filter('[data-kafecarousel-action="nav"]');
		__.$start      = __.$all.filter('[data-kafecarousel-action="start"]');
		__.$previous   = __.$all.filter('[data-kafecarousel-action="prev"]');
		__.$next       = __.$all.filter('[data-kafecarousel-action="next"]');
		__.$end        = __.$all.filter('[data-kafecarousel-action="end"]');
		__.$items      = __.$all.filter('[data-kafecarousel-action="items"]');
		__.$itemsimple = __.$all.filter('[data-kafecarousel-action="item"]');
		__.$play       = __.$all.filter('[data-kafecarousel-action="play"]');
		__.$pause      = __.$all.filter('[data-kafecarousel-action="pause"]');

		// position
		__.$position  = __.$all.filter('[data-kafecarousel-action="position"]');
		__.$total     = __.$all.filter('[data-kafecarousel-action="total"]');
		__.$status    = __.$all.filter('[data-kafecarousel-action="status"]');
		__.$statusNum = __.$all.filter('[data-kafecarousel-action="status-num"]');

		// désactiver tout si un seul item
		if (__.total == 1) {
			__.$nav.addClass('kafecarousel-none');
			__.$previous.addClass('kafecarousel-none');
			__.$next.addClass('kafecarousel-none');
			__.$items.addClass('kafecarousel-none');
			__.$itemsimple.addClass('kafecarousel-none');
			__.$position.addClass('kafecarousel-none');
			__.$total.addClass('kafecarousel-none');
			__.$status.addClass('kafecarousel-none');
			__.$statusNum.addClass('kafecarousel-none');

		// sinon préparer carousel
		} else {

			// initial
			__.curr     = __.startId-1;
			__.changing = false;

			// general events				
			__.startClick = function(e) {
				e.preventDefault();
				change(self, 0);
			};

			__.previousClick = function(e) {
				e.preventDefault();
				change(self, 'prev');
			};

			__.nextClick = function(e) {
				e.preventDefault();
				change(self, 'next');
			};

			__.endClick = function(e) {
				e.preventDefault();
				change(self, __.total-1);
			};

			__.itemSimpleClick = function(e) {
				e.preventDefault();
				change(self, $(this).data('kafecarousel-itemid') - 1);
			};

			__.playClick = function(e) {
				e.preventDefault();
				__.AutoRunning = true;
				__.slideStartAuto();
			};

			__.pauseClick = function(e) {
				e.preventDefault();
				__.AutoRunning = false;
				__.slideStopAuto();
			};

			__.slideStartAuto = function() {
				if (__.AutoRunning) {
					__.Timeout = setTimeout(function(){ change(self, 'next', true); }, __.autointerval);
				}
			};

			__.slideStopAuto = function() {
				clearTimeout(__.Timeout);
				__.Timeout = undefined;
			};




			// on events
			__.$start.on('click',__.startClick);
			__.$previous.on('click',__.previousClick);
			__.$next.on('click',__.nextClick);
			__.$end.on('click',__.endClick);
			__.$itemsimple.on('click',__.itemSimpleClick);

			__.$items.children().each(function(i) {
				$(this).on('click',function(e){
					e.preventDefault();
					change(self, i);
				});
			});

			__.$play.on('click',__.playClick);
			__.$pause.on('click',__.pauseClick);

			__.$MainItems.on({
				mouseenter: __.slideStopAuto,
				mouseleave: __.slideStartAuto
			});




			// intialiser look
			__.$total.html(__.total);
			refresh(self);

			__.$MainItems.hide()
				.eq(__.startId-1).show()
			;

			switch (__.transition) {
				// fade
				case 'fade':
				break;


				// move vertical
				case 'slideUp':
				case 'slideDown':
					__.$MainItems.css({
						left: '0px'
					});
					__.$MainFirstItem.css('top','0px');
				break;

				// move horizontal
				//case 'slideLeft':
				//case 'slideRight':
				default:
					__.$MainItems.css({
						top: '0px'
					});
					__.$MainFirstItem.css('left','0px');
				break;
			}


			// autostart	
			if (__.autointerval !== undefined) {
				__.AutoRunning = true;
				__.slideStartAuto();
			}
		}

		// Init. Completed callback
		if (!!__.initCompleteCallback) {
			__.initCompleteCallback(self);
		}
	};


	/**
	* Manually call a slide change
	*
	* @method change
	* @param {String|Number} target Action or 1-based slide position
	*
	* @example
	*	// Go to next slide
	*	myCarousel.change('next');
	* @example
	*	// Go to first slide 
	*	myCarousel.change(1);
	* @example
	*	// The jQuery alternative...
	*	$('#home-slides').kafeCarousel('change', 1);
	*/
	carousel.prototype.change = function(target) {
		var self = this, __ = self.__;
		return change(self, (Number(target) == target) ? target-1 : target);
	};



	// Add as jQuery plugin
	kafe.fn.plugIntojQuery('Carousel', {
		init: function(obj, parameters) {
			carousel($.extend({}, parameters[0], {selector:obj}));
		},
		change: function(obj, parameters) {
			$(obj).data('kafecarousel-self').change(parameters[0]);
		}
	});

	return carousel;

})(window.kafe)});
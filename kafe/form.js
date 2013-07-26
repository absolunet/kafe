window.kafe.bonify({name:'form', version:'1.4.1', obj:(function(kafe,undefined){
	var $ = kafe.dependencies.jQuery;

	/**
	* ### Version 1.4.1
	* Utilitary methods for html forms and related interactions.
	*
	* @module kafe
	* @class kafe.form
	*/
	var form = {};


	/**
	* Add a class on focus to all input/textarea/select controls and the label placed immediatly before it.
	*
	* @method focus
	* @example
	*	kafe.form.focus();
	*/
	form.focus = function() {
		$('body').on({
			focus: function() {
				$(this).prev('label').andSelf().addClass('Focus');
			},
			blur: function() {
				$(this).prev('label').andSelf().removeClass('Focus');
			}
		}, 'input, textarea, select');
	};


	/**
	* Adds support for the placeholder attribute for older browsers (Older than IE10). If applied, a "Placeholder" class will also be present when the placeholder text is shown.
	*
	* @method placeholder
	* @param {String|jQueryObject|DOMElement} [selector] Selector of text-based form elements. Defaults to 'input&#91;placeholder&#93;, textarea&#91;placeholder&#93;' when left undefined.
	* @example
	*	kafe.form.placeholder('.search-field');
	* @example
	*	$('.search-field').kafe('form.placeholder');
	*/
	form.placeholder = function() {
		if (kafe.env('ie') && kafe.env('ie') < 10) {

			var
				_isEmpty = function () {
					return (arguments[0].replace(/^\s*|\s*$/g, '').replace(/^\t*|\t*$/g, '') === '');
				},
				selector  = 'input[placeholder], textarea[placeholder]'
			;

			$('body').on({
				focus: function() {
					var $this = $(this);
					if (_isEmpty($this.val()) || $this.val() == $this.attr('placeholder')) {
						$this.one('keydown', function() {
							$this.removeClass('Placeholder').val('');
						});
					}
				},
				blur: function() {
					var $this = $(this);
					if (_isEmpty($this.val()) || $this.val() == $this.attr('placeholder')) {
						$this.addClass('Placeholder').val($this.attr('placeholder'));
					}
				}
			}, selector);

			$(selector).trigger('blur');
		}
	};


	/**
	* Detects the RETURN key, then triggers a callback.
	*
	* @method onEnter
	* @param {String|jQueryObject|DOMElement} elements Selector of text-based form elements.
	* @param {Function} callback Function to be fired by the keypress.
	* @example
	*	kafe.form.onEnter('.search-field', function(input) {
	*		$(input).parents('form').submit();
	*	});
	* @example
	*	$('.search-field').kafe('form.onEnter', function(input) {
	*		$(input).parents('form').submit();
	*	});
	*/
	form.onEnter = function(elements,callback) {
		$(elements).on('keypress', function(e) {
			if (((!!e.which) ? e.which : e.keyCode) == 13) {
				e.preventDefault();
				callback(this);
			}
		});
	};


	/**
	* Automaticaly jump the focus to the next field once the maxlength has been reached.
	*
	* @method autofocusOnNext
	* @param {String|jQueryObject|DOMElement} elements Selector of text-based form elements.
	* @example
	*	kafe.form.autofocusOnNext('.first-name, .last-name, .email');
	* @example
	*	$('.first-name, .last-name, .email').kafe('form.autofocusOnNext');
	*/
	form.autofocusOnNext = function(elements) {
		$(elements).on('keyup',function(e) {
			var
				$this = $(this),
				key   = (!!e.which) ? e.which : e.keyCode
			;

			// tab / alt+tab / arrows
			if (key != 9 && key != 16 && !(key >=36 && key <=40) && $this.val().length == $this.attr('maxlength')) {
				var inputs = $('input, textarea, select');
				inputs.eq( inputs.index(this)+1 ).focus().select();
			}
		});
	};


	/**
	* Adds a simulated maxlength support for textarea elements.
	*
	* @method maxLength
	* @param {String|jQueryObject|DOMElement} elements Selector of text-based form elements.
	* @param {Integer} max Maximum number of characters.
	* @param {Boolean} [block=false] Prevent further character entry once the limit is reached.
	* @param {Function} [callback] Callback triggered when the character limit is reached. The current number of characters is provided as the first argument of the callback.
	* @example
	*	kafe.form.maxLength('.twitter-post', 140, false, function(count) {
	*		kafe.log(count);
	*	});
	* @example
	*	$('.twitter-post').kafe('form.maxLength', 140, false, function(count) {
	*		kafe.log(count);
	*	});
	*/
	form.maxLength = function(elements, max, block, callback) {
		$(elements)
			.on('input paste cut keyup',function(e) {

				var
					$this = $(this),
					delay = (kafe.env('ie') && kafe.env('ie') < 9) ? 1 : 0
				;

				setTimeout(function(){
					var
						val   = $this.val(),
						nb    = max - val.length
					;

					if (!!block && nb < 0) {
						$this.val(val.toString().substr(0,max));
						nb = 0;
					}

					if ($.isFunction(callback)) {
						callback(nb);
					}

				},delay);
			})
			.trigger('keyup')
		;
	};


	/**
	* Calculates the password strength value of given fields.
	*
	* @method passwordStrength
	* @param {String|jQueryObject|DOMElement} elements Selector of text-based form elements.
	* @param {Function} [callback] Callback triggered when the value is changed. The calculated strengh value is provided as the first argument of the callback.
	* @example
	*	kafe.form.passwordStrength('.password', function(strengh) {
	*		kafe.log(strengh);
	*	});
	* @example
	*	$('.password').kafe('form.passwordStrength', function(strengh) {
	*		kafe.log(strengh);
	*	});
	*/
	form.passwordStrength = function(elements, callback) {

		var
			_countRegexp = function (val, rex) {
				var match = val.match(rex);
				return match ? match.length : 0;
			},

			_getStrength = function (val, minLength) {
				var len = val.length;

				// too short =(
				if (len < minLength) {
					return 0;
				}

				var
					nums = _countRegexp(val, /\d/g),
					lowers = _countRegexp(val, /[a-z]/g),
					uppers = _countRegexp(val, /[A-Z]/g),
					specials = len - nums - lowers - uppers
				;

				// just one type of characters =(
				if (nums == len || lowers == len || uppers == len || specials == len) {
					return 1;
				}

				var strength = 0;
				if (nums) { strength += 2; }
				if (lowers) { strength += uppers ? 4 : 3; }
				if (uppers) { strength += lowers ? 4 : 3; }
				if (specials) { strength += 5; }
				if (len > 10) { strength += 1; }

				return strength;
			},

			_getStrengthLevel = function(val, minLength) {
				var
					strength = _getStrength(val, minLength),
					lvl = 1
				;
				if (strength <= 0) {
					lvl = 1;
				} else if (strength > 0 && strength <= 4) {
					lvl = 2;
				} else if (strength > 4 && strength <= 8) {
					lvl = 3;
				} else if (strength > 8 && strength <= 12) {
					lvl = 4;
				} else if (strength > 12) {
					lvl = 5;
				}

				return lvl;
			},

			min_length = 6
		;

		$(elements)
			.on('input paste cut keyup',function(e) {

				var
					$this = $(this),
					delay = (kafe.env('ie') && kafe.env('ie') < 9) ? 1 : 0
				;

				setTimeout(function(){
					var
						val = $this.val(),
						strength = _getStrengthLevel(val, min_length)
					;

					if ($.isFunction(callback)) {
						callback(strength);
					}
				},delay);
			})
		;
	};


	/**
	* Sanitize form text entry for .NET validator.
	*
	* @method sanitizeFormData
	* @param {String|jQueryObject|DOMElement} elements Reference to the current .NET form.
	* @example
	*	kafe.form.sanitizeFormData('#Form1');
	* @example
	*	$('#Form1').kafe('form.sanitizeFormData');
	*/
	form.sanitizeFormData = function(form) {
		var
			$form = $(form),
			data  = $this.serializeArray()
		;

		for (var i in data) {
			$form.find('input[type="text"][name="'+data[i].name+'"],textarea[name="'+data[i].name+'"]').val(
				data[i].value.toString()
					.replace(/\\</g,'&lt;')
					.replace(/\\>/g,'&gt;')
			);
		}
	};


	/**
	* Replace elements with a submit button
	*
	* @method replaceSubmit
	* @param {String|jQueryObject|DOMElement} [elements='input:submit'] Elements to replace
	* @example
	*	kafe.form.replaceSubmit();
	* @example
	*	$('.Search input:submit').kafe('form.replaceSubmit');
	*/
	form.replaceSubmit = function(elements) {
		( (elements) ? $(elements) : $('input:submit') ).each(function() {
				var $this = $(this);
				$this
					.hide()
					.after( $('<button type="submit" data-kafe-processed="true" class="'+ $this.attr('class') +'">'+ $this.val() +'</button>').on('click', function(e) { e.preventDefault(); $this.trigger('click'); }) )
				;
		});
	};



	// Add as jQuery plugin
	kafe.fn.plugIntojQuery('', {
		'form.placeholder': function(self, parameters) {
			form.placeholder(self);
		},
		'form.onEnter': function(self, parameters) {
			form.onEnter(self, parameters[0]);
		},
		'form.autofocusOnNext': function(self, parameters) {
			form.autofocusOnNext(self);
		},
		'form.maxLength': function(self, parameters) {
			form.maxLength(self, parameters[0]);
		},
		'form.passwordStrength': function(self, parameters) {
			form.passwordStrength(self, parameters[0]);
		},
		'form.sanitizeFormData': function(self, parameters) {
			form.sanitizeFormData(self);
		},
		'form.replaceSubmit': function(self, parameters) {
			form.replaceSubmit(self);
		}
	});


	return form;

})(window.kafe)});
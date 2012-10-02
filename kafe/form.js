//-------------------------------------------
// kafe.form
//-------------------------------------------
kafe.bonify({name:'form', version:'1.4.1', obj:(function(K,undefined){
	var $ = K.jQuery;

	//-------------------------------------------
	// PUBLIC
	//-------------------------------------------
	var form = {};


	// focus ()
	// add focus styles on input/textarea/select
	//-------------------------------------------
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

	// label (element container)
	// add an inline label on input/textarea with a placeholder attribute
	//-------------------------------------------
	form.label = function() {
		if ($.browser.msie && parseInt($.browser.version) < 10) {
			
			function _isEmpty() {
				 return (arguments[0].replace(/^\s*|\s*$/g, '').replace(/^\t*|\t*$/g, '') == '');
			};

			var selector  = 'input[placeholder], textarea[placeholder]';
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
	
	// onEnter (elements,callback)
	// add onEnter event
	//-------------------------------------------
	form.onEnter = function(elements,callback) {
		$(elements).on('keypress', function(e) {
			if (((!!e.which) ? e.which : e.keyCode) == 13) {
				e.preventDefault();
				callback(this);
			}
	    });
	};
	
	// autofocusOnNext (elements)
	// moves focus on next input
	//-------------------------------------------
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




	// maxLength (elements, max, block, [callback])
	// manages a maxlength on a textarea
	//-------------------------------------------
	form.maxLength = function(elements, max, block, callback) {
		$(elements)
			.on('input paste cut keyup',function(e) {
			
				var 
					$this = $(this),
					delay = ($.browser.msie & parseInt($.browser.version) <= 8) ? 1 : 0
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

	// passwordStrength (elements, [callback])
	// calculates the password strength value of given fields
	//-------------------------------------------
	form.passwordStrength = function(elements, callback) {
		
		function _countRegexp(val, rex) {
			var match = val.match(rex);
			return match ? match.length : 0;
		}
		
		function _getStrength(val, minLength) {
			var len = val.length;

			// too short =(
			if (len < minLength) {
				return 0;
			}

			var nums = _countRegexp(val, /\d/g),
				lowers = _countRegexp(val, /[a-z]/g),
				uppers = _countRegexp(val, /[A-Z]/g),
				specials = len - nums - lowers - uppers;

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
		}
		
		function _getStrengthLevel(val, minLength) {
			var strength = _getStrength(val, minLength),
				val = 1;
			if (strength <= 0) {
				val = 1;
			} else if (strength > 0 && strength <= 4) {
				val = 2;
			} else if (strength > 4 && strength <= 8) {
				val = 3;
			} else if (strength > 8 && strength <= 12) {
				val = 4;
			} else if (strength > 12) {
				val = 5;
			}

			return val;
		}

		var min_length = 6;
		
		$(elements)
			.on('input paste cut keyup',function(e) {
			
				var $this = $(this),
					delay = ($.browser.msie & parseInt($.browser.version) <= 8) ? 1 : 0;
				
				setTimeout(function(){
					var val = $this.val(),
						strength = _getStrengthLevel(val, min_length);
					
					if ($.isFunction(callback)) {
						callback(strength);
					}
					
				},delay);
			})
		;
	};

	// sanitizeFormData (form)
	// sanitize form text entry for .net validator
	//-------------------------------------------
	form.sanitizeFormData = function(form) {
		var
			$form = $(form),
			data  = $this.serializeArray()
		;

		for (var i in data) {
			$form.find('input[type="text"][name="'+data[i].name+'"],textarea[name="'+data[i].name+'"]').val(
				data[i].value.toString()
					.replace(/\</g,'&lt;')
					.replace(/\>/g,'&gt;')
			);
		}
    };

	return form;

})(kafe)});

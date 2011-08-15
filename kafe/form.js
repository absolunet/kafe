//-------------------------------------------
// kafe.form
//-------------------------------------------
kafe.bonify({name:'form', version:'1.2', obj:(function($,K,undefined){

	//-------------------------------------------
	// PUBLIC
	//-------------------------------------------
	var form = {};


	// focus ()
	// add focus styles on input/textarea/select
	//-------------------------------------------
	form.focus = function() {
		$('input, textarea, select')
			.bind('focus', function() {
				$(this).prev('label').andSelf().addClass('Focus');
			})
			.bind('blur', function() {
				$(this).prev('label').andSelf().removeClass('Focus');
			}
		);
	};

	// label ()
	// add an inline label on input/textarea with a title attribute
	//-------------------------------------------
	form.label = function() {

		function _isEmpty() {
			 return (arguments[0].replace(/^\s*|\s*$/g, '').replace(/^\t*|\t*$/g, '') == '');
		};

		$('input[title!=""], textarea[title!=""]').each(function() {

			var $this = $(this);

			$this
				.data('Label', $this.attr('title'))
				.attr('title','')
				.bind('focus', function() {
					var $this = $(this);
					if (_isEmpty($this.val()) || $this.val() == $this.data('Label')) {
						$this.one('keydown', function() {
							$this.removeClass('Label').val('');
						});
					}
				})
				.bind('blur', function() {
					var $this = $(this);
					if (_isEmpty($this.val()) || $this.val() == $this.data('Label')) {
						$this.addClass('Label').val($this.data('Label'));
					}
				})
				.blur()
			;
		});
	};
	
	// onEnter (elements,callback)
	// add onEnter event
	//-------------------------------------------
	form.onEnter = function(elements,callback) {
		$(elements).keypress(function(e) {
			if (((!!e.which) ? e.which : e.keyCode) == 13) {
				callback(this);
			}
	    });
	};
	
	// autofocusOnNext (elements)
	// moves focus on next input
	//-------------------------------------------
	form.autofocusOnNext = function(elements) {
		$(elements).bind('keyup input',function(e) {
			var $this = $(this);
			if($this.val().length == $this.attr('maxlength')) {
				var inputs = $('input, textarea, select');
		        inputs.eq( inputs.index(this)+1 ).focus();
		    }
		});
	};

	// maxLength (elements, max, block, [callback])
	// manages a maxlength on a textarea
	//-------------------------------------------
	form.maxLength = function(elements, max, block, callback) {
		$(elements)
			.bind('input paste cut keyup',function(e) {
			
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
						$this.val(val.substr(0,max));
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
		
		var min_length = 6;
		
		var _countRegexp = function (val, rex) {
			var match = val.match(rex);
			return match ? match.length : 0;
		};
		var _getStrength = function (val, minLength) {
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
		};
		var _getStrengthLevel = function (val, minLength) {
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
		};
		
		$(elements)
			.bind('input paste cut keyup',function(e) {
			
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



	return form;

})(jQuery,kafe)});

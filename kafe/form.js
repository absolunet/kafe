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
						$this.removeClass('Label').one('keydown', function() {
							$this.val('');
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

	return form;

})(jQuery,kafe)});

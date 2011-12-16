//-------------------------------------------
// kafe.ext.colorbox
//-------------------------------------------
kafe.extend({name:'colorbox', version:'1.2', obj:(function($,K,undefined){

	//default params
	var _params = {
		theme: '',
		opacity:0.5, 
		transition:'none',
		overlayClose:true,
		escKey:true,
		scrolling:false
	};


	//-------------------------------------------
	// PUBLIC
	//-------------------------------------------
	var colorbox = {};
	
	// moveInForm ()
	// move colorbox in webform
	//-------------------------------------------
	colorbox.moveInForm = function() {
		$("#colorbox").appendTo('form');
	};

	// getParams ([options])
	// return default params with optional extra params
	//-------------------------------------------
	colorbox.getParams = function(options) {
		var p = {};
		$.extend(p, _params);
		$.extend(p, (!!options) ? options : {});
		return p;
	};
	
	// setParams (options)
	// set default params
	//-------------------------------------------
	colorbox.setParams = function() {
		$.extend(_params, arguments[0]);
	};

	// changeTheme (theme)
	// change colorbox theme
	//-------------------------------------------
	colorbox.changeTheme = function(theme) {
		var $body = $('body');
		
		if (!$body.hasClass('cb-'+theme)) {
			
			var classes = $body.attr('class') || '';
			classes = classes.split(' ');
			for (var i in classes) {
				if (/^cb-/.test(classes[i])) {
					$body.removeClass(classes[i]);
				}
			}

			$body.addClass('cb-'+theme);
			$.colorbox.remove()
			$.colorbox.init();
		}
	};

	// open ([options])
	// open colorbox
	//-------------------------------------------
	colorbox.open = function(options) {
		options = colorbox.getParams(options);
		
		if (options['theme']) {
			colorbox.changeTheme((options['theme']));
			delete options['theme'];
		}

		$.colorbox(options);
	};

	// tmpl (id, [data], [options])
	// open colorbox with a jquery tmpl
	//-------------------------------------------
	colorbox.tmpl = function(id,data,options) {
		options = (!!options) ? options : {};
		$.extend(options, {html:$.tmpl(id,data)});
		colorbox.open(options);
	};

	// inline (stringID)
	// show an inline element in a colorbox
	//-------------------------------------------
	colorbox.inline = function(stringID) {
		colorbox.open({ inline:true, href:'#'+stringID });
	};

	// ajax (stringID)
	// load html of a specific url and show in a colorbox
	//-------------------------------------------
	colorbox.ajax = function(stringID) {
		colorbox.open({ href:stringID });
	};

	// display (string)
	// show a colorbox alert
	//-------------------------------------------
	colorbox.display = function(string) {
		$('#cb-display').html(string);
		colorbox.open({id:'#cb-display'});
	};
	
	// dialog ( content, [commands] )
	// opens a message window with custom buttons
	//-------------------------------------------
	colorbox.dialog = function( content, commands  ) {
		
		var html = '<div id="kafe-colorbox-dialog">' + content;

		if (commands == undefined || commands.length == 0)
			commands = [{ label:'OK', callback:function(){ $.colorbox.close(); } }];

		html += '<div class="commands" style="white-space:nowrap;">';
		$.each(commands, function(i, btn){
			html += '<a href="#" class="Btn">' + btn.label + '</a>';
		});
		html += '</div></div>';

		var content = $(html);
		$.each(commands, function(i, btn){
			content.find('.Btn:eq(' + i + ')').bind('click', function(e) {
				e.preventDefault();
				if (typeof btn.callback === 'function') {
					btn.callback();
				} else {
					$.colorbox.close();
				} 
			});
		});
		
		colorbox.open({html:content});
	};

	// confirm ( selector, message, OKLabel, CancelLabel )
	// simulate a confirm() behavior using colorbox.dialog
	//-------------------------------------------
	colorbox.confirm = function( selector, message, OKLabel, CancelLabel ) {
		var kDialog = this;
		$(function(){
			$(selector).bind('click', function(e) {
				e.preventDefault();
				var $this = $(this);
				kDialog.dialog( message, [
					{ label:OKLabel , callback: function() {
						eval($this.attr('href'));
						$.colorbox.close();
					}},
					{ label:CancelLabel }
				]);
			});
		});
	}

	return colorbox;

})(jQuery,kafe)});
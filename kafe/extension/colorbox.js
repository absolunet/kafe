//-------------------------------------------
// kafe.ext.colorbox
//-------------------------------------------
kafe.extend({name:'colorbox', version:'1.1', obj:(function($,K,undefined){

	//default params
	var _params = {
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
	
	// getParams ([options])
	// return default params with optional extra params
	//-------------------------------------------
	colorbox.getParams = function(options) {
		var p = (!!options) ? options : {};
		$.extend(p, _params);
		return p;
	};
	
	// setParams (options)
	// set default params
	//-------------------------------------------
	colorbox.setParams = function() {
		$.extend(_params, arguments[0]);
		//_params = arguments[0];
	};

	// display (string)
	// show a colorbox alert
	//-------------------------------------------
	colorbox.display = function(string) {
		$('#cb-display').html(string);
		$.colorbox( this.getParams({ id:'#cb-display' }) );
	};

	// moveInForm ()
	// move colorbox in webform
	//-------------------------------------------
	colorbox.moveInForm = function() {
		$("#colorbox").appendTo('form');
	};
	
	// dialog ( content, [commands] )
	// opens a message window with custom buttons
	//-------------------------------------------
	colorbox.dialog = function( content, commands ) {
		
		var html = '<div id="kafe-colorbox-dialog">' + content;

		if (commands == undefined || commands.length == 0)
			commands = [{ label:'OK', callback:function(){ $.colorbox.close(); } }];

		html += '<div class="commands" style="white-space:nowrap;">';
		$.each(commands, function(i, btn){
			html += '<a href="javascript:void(0);" class="Btn">' + btn.label + '</a>';
		});
		html += '</div></div>';

		var content = $(html);
		$.each(commands, function(i, btn){
			content.find('.Btn:eq(' + i + ')').bind('click', (typeof btn.callback === 'function') ? btn.callback : function(){ $.colorbox.close(); });
		});
		
		$.colorbox( this.getParams({ html:content }) );
		
	};

	// confirm ( selector, message, OKLabel, CancelLabel )
	// simulate a confirm() behavior using colorbox.dialog
	//-------------------------------------------
	colorbox.confirm = function( selector, message, OKLabel, CancelLabel ) {
		kDialog = this;
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
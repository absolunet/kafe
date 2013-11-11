(function($) {
	$(function(){

		var
			isClass  = !!$('#Content header.class').length,
			isFile   = !!$('#Content header.file').length,
			location = window.location.pathname
		;
		
		if (isFile) {
			location = $('#Content header.file h1').text().split('/');
			location.shift();
			location = location.join('.').replace('.js','.html');
		}

		var
			current = location.split('/').pop(),
			parts   = current.split('.')
		;


		$('#Header > nav a[href*="'+parts[0]+'.'+parts[1]+'"]').parent().addClass('On');
		if (!$('#Header > nav li.On').length) {
			$('#Header > nav li:first').addClass('On');
		}

		if (isClass || isFile) {
			$('#Content > nav a[href$="'+current+'"], #Content > nav a[href*="'+parts.join('_')+'"]').parent().addClass('On');
		}
	});
})(window.jQuery);
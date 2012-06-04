//-------------------------------------------
// kafe.mobile
//-------------------------------------------
kafe.bonify({name:'mobile', version:'1.1', obj:(function($,K,undefined){

	// local variables
	var
		_name        = K.idantite.non,
		_$html       = $('html'),
		_iOsWebApp   = !!window.navigator.standalone,
		_orientation
	;

	// ios webapp mode
	K.env('mobile-iOsWebApp', _iOsWebApp);
	if (_iOsWebApp) {
		_$html.addClass(_name+'-mobile-iOsWebApp');
	}
	
	// mobile orientation
	$(window)
		.on('orientationchange', function() { 
			_orientation = (!!this.orientation) ? 'landscape' : 'portrait';

			K.env('mobile-orientation', _orientation);
			_$html
				.removeClass(_name+'-mobile-landscape '+_name+'-mobile-portrait')
				.addClass(_name+'-mobile-'+_orientation)
			;
		})
		.trigger('orientationchange')
	;




	//-------------------------------------------
	// PUBLIC
	//-------------------------------------------
	var mobile = {};

	// scrollTop ()
	// remove top navigation bar
	//-------------------------------------------
	mobile.scrollTop = function() {
		if (!_iOsWebApp) {
			window.scrollTo(0,0);
		}
	};

 	// redirector ()
	// activate the redirector script on the mobile site
	//-------------------------------------------
	mobile.redirector = function() {
		
		function _saveCookie(activate) {
			var domain = window.location.hostname.split('.');
			domain = (domain.length >=2) ? domain[domain.length-2]+'.'+ domain[domain.length-1] : '';
			if (!!activate) {
	            document.cookie = 'NoRedirectMobile=0;' + ((domain) ? 'domain='+domain+';' :'')  +'expires=' + (new Date('2010-04-19').toUTCString());
	        } else {
	            document.cookie = 'NoRedirectMobile=1;' + ((domain) ? 'domain='+domain+';' :'')  +'expires=' + (new Date(new Date().getTime() + 90 * 24 * 60 * 60 * 1000).toUTCString());
	        }
		}

		$('body').on('click', function(){ _saveCookie(false); }, 'a[data-'+_name+'mobile-redirector="true"]');
		
		if (window.location.search.substr(1) == 'mobile') {
	        _saveCookie(true);
	    }
    };

 	// iOsWepAppPatchLinks ()
	// reverse internal/external links behaviour for an iOS web application mode
	//-------------------------------------------
	mobile.iOsWepAppPatchLinks = function() {
		if (_iOSWebApp) {
			$('body').on('click' ,function(e) {
				e.preventDefault();
				window.location.href = $(this).attr('href'); 
			}, 'a[rel="external"][data-'+_name+'mobile-IgnoreWepAppPatch="true"][target!="_blank"]');
		}
	};

	return mobile;

})(jQuery,kafe)});

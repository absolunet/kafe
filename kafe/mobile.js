//-------------------------------------------
// kafe.mobile
//-------------------------------------------
kafe.bonify({name:'mobile', version:'1.0', obj:(function($,K,undefined){

	// local variables
	var
		__name        = K.idantite.non,
		__$html       = $('html'),
		__iOsWebApp   = !!window.navigator.standalone,
		__orientation
	;

	// ios webapp mode
	K.env('mobile-iOsWebApp', __iOsWebApp);
	if (__iOsWebApp) {
		__$html.addClass(__name+'-mobile-iOsWebApp');
	}
	
	// mobile orientation
	$(window)
		.bind('orientationchange', function() { 
			__orientation = (!!this.orientation) ? 'landscape' : 'portrait';

			K.env('mobile-orientation', __orientation);
			__$html
				.removeClass(__name+'-mobile-landscape '+__name+'-mobile-portrait')
				.addClass(__name+'-mobile-'+__orientation)
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
		if (!__iOSWebApp) {
			window.scrollTo(0,1);
		}
	};

 	// redirector ()
	// activate the redirector script on the mobile site
	//-------------------------------------------
	mobile.redirector = function() {
		
		function __saveCookie(activate) {
			var domain = window.location.hostname.split('.');
			domain = (domain.length >=2) ? domain[domain.length-2]+'.'+ domain[domain.length-1] : '';
			if (!!activate) {
	            document.cookie = 'NoRedirectMobile=0;' + ((domain) ? 'domain='+domain+';' :'')  +'expires=' + (new Date('2010-04-19').toUTCString());
	        } else {
	            document.cookie = 'NoRedirectMobile=1;' + ((domain) ? 'domain='+domain+';' :'')  +'expires=' + (new Date(new Date().getTime() + 90 * 24 * 60 * 60 * 1000).toUTCString());
	        }
		}

		$('a[rel="'+__name+'Mobile-Redirector"]').live('click', function(){ __saveCookie(false); });
		
		if (window.location.search.substr(1) == 'mobile') {
	        __saveCookie(true);
	    }
    };

 	// iOsWepAppPatchLinks ()
	// reverse internal/external links behaviour for an iOS web application mode
	//-------------------------------------------
	mobile.iOsWepAppPatchLinks = function() {
		if (__iOSWebApp) {
			$('a[rel~="external"][rel~="'+__name+'-IgnoreWepAppPatch"][target!="_blank"]').live('click',function(e) {
				e.preventDefault();
				window.location.href = $(this).attr('href'); 
			});
		}
	};

	return mobile;

})(jQuery,kafe)});

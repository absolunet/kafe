//-------------------------------------------
// kafe.geolocation
//-------------------------------------------
kafe.bonify({name:'geolocation', version:'1.0', obj:(function($,K,undefined){
	
	// is available
	var _isAvailable = !!navigator.geolocation;

	// dictonary
	var _dict = {
		fr: {
			search:      'Recherche de votre positionnement',
			position:    'Votre position',
			unavailable: 'Service de localisation non-disponible',
			deactivated: 'Service de localisation désactivé',
			notFound:    'Position indisponible',
			timeout:     'Délai expiré',
			error:       'Il y a eu un problème'
		},
		en: {
			search:      'Searching your location',
			position:    'Your position',
			unavailable: 'Location service unavailable',
			deactivated: 'Location service deactivated',
			notFound:    'Position not found',
			timeout:     'Timeout',
			error:       'There has been a problem'
		}
	};

	// _lang ([lang])
	// get a valid lang
	//-------------------------------------------
	function _lang(lang) {
		return K.fn.lang(_dict,lang);
	}
	



	
	//-------------------------------------------
	// PUBLIC
	//-------------------------------------------
	var geolocation = {};

	// locate ( message_container/success_callback/error_callback/[lang] )
	// locate user
	//------------------------------------------
	geolocation.locate = function(options) {
		
		var d = _dict[_lang(options.lang)];

		// if service available
		if (_isAvailable) {
			var $msg            = $(options.msgContainer);
			var successCallback = options.success;
			var errorCallback   = options.error;
		    
		    $msg.html('... '+d.search+' ...'); 

			// try to get coords
		    navigator.geolocation.getCurrentPosition(

				// success
				function(position) {
					$msg.html(d.position + ': ' + position.coords.latitude + ', ' +  position.coords.longitude);
					if (!!successCallback) {
						successCallback({coords:position.coords});
					}
				},
				
				// failure
				function(error) {
					var msg = '';
					switch (error.code) {
						case 1:	msg = d.deactivated; break;
						case 2:	msg = d.notFound; break;
						case 3:	msg = d.timeout; break;
					}

					$msg.html(msg);
					if (!!errorCallback) {
						errorCallback({message:msg});
					}
				}
			);
		
		// if service unavailable
		} else {
			var msg = d.unavailable;
			$msg.html(msg);
			if (!!errorCallback) {
				errorCallback({message:msg});
			}
		}
	};

	return geolocation;

})(jQuery,kafe)});

//-------------------------------------------
// kafe.string
//-------------------------------------------
window.kafe.bonify({name:'string', version:'1.1', obj:(function(kafe,undefined){
	var $ = kafe.jQuery;

	//-------------------------------------------
	// PUBLIC
	//-------------------------------------------
	var string = {};

	// capitalize (string)
	// first char to uppercase
	//-------------------------------------------
	string.capitalize = function() {
		return arguments[0].replace(/^\w/, function($0) { return $0.toUpperCase(); });
	};

	// removeAccent (string)
	// replace accented letters with plain letter
	//-------------------------------------------
	string.removeAccent = function() {
		return arguments[0]
			.replace(/[àáâãäå]/g, 'a') .replace(/[ÀÁÂÃÄÅ]/g, 'A')
			.replace(/æ/g, 'ae')       .replace(/Æ/g, 'AE')
			.replace(/ç/g, 'c')        .replace(/Ç/g, 'C')
			.replace(/[èéêë]/g, 'e')   .replace(/[ÈÉÊË]/g, 'E')
			.replace(/[ìíîï]/g, 'i')   .replace(/[ÌÍÎÏ]/g, 'I')
			.replace(/ñ/g, 'n')        .replace(/Ñ/g, 'N')
			.replace(/[òóôõö]/g, 'o')  .replace(/[ÒÓÔÕÖ]/g, 'O')
			.replace(/œ/g, 'oe')       .replace(/Œ/g, 'OE')
			.replace(/[ùúûü]/g, 'u')   .replace(/[ÙÚÛÜ]/g, 'U')
			.replace(/[ýÿ]/g, 'y')     .replace(/[ÝŸ]/g, 'Y')
		;
	};

	// toCodeSafe (string, [substitute])
	// transform to a code-safe string
	//-------------------------------------------
	string.toCodeSafe = function(str,sub) {
		return string.removeAccent(arguments[0].toLowerCase())
			.replace(/'/g, '')
			.replace(/[^a-z0-9]/g, ' ')
			.replace(/\s+/g, ' ')
			.replace(/^\s|\s$/g, '')
			.replace(/\s/g, (sub) ? sub : '-')
		;
	};

	// zeroPad (string, nb_total)
	// add zeros
	//-------------------------------------------
	string.zeroPad = function(s,nb) {
		return ('00000000000000000000'+s).toString().slice(-nb);
	};

	// repeat (string, nb_repeat)
	// repeat string n times
	//-------------------------------------------
	string.repeat = function(s,nb) {
		return new Array(nb+1).join(s);
	};

	// contains (string, needles)
	// check if space-separated string contains one of the needles
	//-------------------------------------------
	string.contains = function(s,n) {
		var stack = s.split(' ');
		for (var i = 0; i<n.length; ++i) {
			if ($.inArray(n[i], stack) != -1) {
				return true
			}
		}
		return false;
	};

	// toObject (string)
	// take a JSON string to javascript object
	//-------------------------------------------
	string.toObject = function(s) {
		
		function cast(o) {
			for (var i in o) {
				// object
				if (typeof(o[i]) == 'object') {
					o[i] = cast(o[i]);
				
				// date
				} else if (/^\d{4}\-\d{2}\-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(o[i])) {
					o[i] = new Date(o[i]);
				}
			}
			return o;
		}

		kafe.required('kafe.jQuery.toJSON');
		return cast($.evalJSON(s));
	};

	// generateGuid ()
	// generates a random GUID/UUID Version 4 (random)
	//-------------------------------------------
	string.generateGuid = function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});
	};


	return string;

})(window.kafe)});


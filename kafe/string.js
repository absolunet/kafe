//-------------------------------------------
// kafe.string
//-------------------------------------------
kafe.bonify({name:'string', version:'1.1', obj:(function($,K,undefined){

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
		return this.removeAccent(arguments[0].toLowerCase())
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

		K.required('jQuery.toJSON');
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





	//-------------------------------------------
	// NATIVE
	//-------------------------------------------
	var Native = {};

	// capitalize ()
	// first char to uppercase
	//-------------------------------------------
	Native.capitalize = function() {
		return string.capitalize(this.get());
	};

	// removeAccent ()
	// replace accented letters with plain letter
	//-------------------------------------------
	Native.removeAccent = function() {
		return string.removeAccent(this.get());
	};

	// toCodeSafe ([substitute])
	// transform to a code-safe string
	//-------------------------------------------
	Native.toCodeSafe = function(sub) {
		return string.toCodeSafe(this.get(),sub);
	};

	// zeroPad (nb_total)
	// add zeros
	//-------------------------------------------
	Native.zeroPad = function(nb) {
		return string.zeroPad(this.get(),nb);
	};

	// repeat (nb_repeat)
	// repeat string n times
	//-------------------------------------------
	Native.repeat = function(nb) {
		return string.repeat(this.get(),nb);
	};

	// toObject ()
	// take a JSON string to javascript object
	//-------------------------------------------
	Native.toObject = function() {
		return string.toObject(this.get());
	};

	string.Native = Native;

	return string;

})(jQuery,kafe)});


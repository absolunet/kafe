//>>excludeStart('excludeRequire', pragmas.excludeRequire);
require([
	'libs/kafe/string'
]);
//>>excludeEnd('excludeRequire');

window.kafe.bonify({name:'string.validate', version:'1.0', obj:(function(kafe,undefined){
	var $ = kafe.dependencies.jQuery;


	// PUBLIC
	var validate = {};


	// if string is empty of contains only whitespaces
	validate.isEmpty = function () {
		return (arguments[0].replace(/^\s*|\s*$/g, '').replace(/^\t*|\t*$/g, '') === '') ? true : false;
	};

	// if string is numeric
	validate.isNum = function(s) {
		return (s === Number(s).toString());
	};

	// if string is a valid email
	validate.isEmail = function(s) {
		s = s.replace(/^\s*|\s*$/g, '');
		s = s.replace(/^\t*|\t*$/g, '');
		return (/^\w+([\.\+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(s) !== 0);
	};

	// isPostalCode (str, [format])
	validate.isPostalCode = function(s,format) {
		switch (format) {
			case 'A1A 1A1': format='[a-z][0-9][a-z] [0-9][a-z][0-9]'; break;
			case 'A1A':     format='[a-z][0-9][a-z]';                 break;
			case '1A1':     format='[0-9][a-z][0-9]';                 break;
			default:        format='([a-z][0-9]){3}';                 break;
		}
		return new RegExp('^'+format+'$','i').test(s);
	};

	// if string is a valid credit card
	validate.isCreditCard = function(s,type) {

		// http://davidwalsh.name/validate-credit-cards
		// http://jsfiddle.net/silvinci/84bru/
		var
			_pattern = {
				mc:  '5[1-5][0-9]{14}',                          // Master Card
				ec:  '5[1-5][0-9]{14}',                          // Electronic Cash
				vi:  '4(?:[0-9]{12}|[0-9]{15})',                 // Visa
				ax:  '3[47][0-9]{13}',                           // American Express
				dc:  '3(?:0[0-5][0-9]{11}|[68][0-9]{12})',       // DC
				bl:  '3(?:0[0-5][0-9]{11}|[68][0-9]{12})',       // BL
				di:  '6011[0-9]{12}',                            // Diner's Club
				jcb: '(?:3[0-9]{15}|(2131|1800)[0-9]{11})',      // JCB
				er:  '2(?:014|149)[0-9]{11}'                     // ER
			},


			_validateStructure = function(value, ccType) {
				value = String(value).replace(/[^0-9]/g, ''); // ignore dashes and whitespaces - We could even ignore all non-numeric chars (/[^0-9]/g)

				var cardinfo = creditCardValidator.cards,
					results  = []
				;

				if(ccType){
					var expr = '^' + cardinfo[ccType.toLowerCase()] + '$';
					return expr ? !!value.match(expr) : false; // boolean
				}

				for(var i in cardinfo){
					if(value.match('^' + cardinfo[i] + '$')){
						results.push(i);
					}
				}
				return results.length ? results.join('|') : false; // String | boolean
			},


			// Luhn validator 
			_validateChecksum = function(value) {
				value = String(value).replace(/[^0-9]/g, ''); // ignore dashes and whitespaces - We could even ignore all non-numeric chars (/[^0-9]/g)
				var sum       = 0,
					parity    = value.length % 2
				;

				for(var i = 0; i <= (value.length - 1); i++) { // We'll iterate LTR - it's faster and needs less calculating
					var digit = parseInt(value[i], 10);

					if(i % 2 == parity) {
						digit = digit * 2;
					}
					if(digit > 9) {
						digit = digit - 9; // get the cossfoot - Exp: 10 - 9 = 1 + 0 | 12 - 9 = 1 + 2 | ... | 18 - 9 = 1 + 8
					}
					sum += digit;
				}
				return ((sum % 10) === 0); // divide by 10 and check if it ends in 0 - return true | false
			}
		;


		if (_validateChecksum(s)) {
			return _validateStructure(s, type);
		}

        return false;
	};


	return validate;
})(window.kafe)});
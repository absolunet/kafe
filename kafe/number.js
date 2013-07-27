window.kafe.bonify({name:'number', version:'1.0', obj:(function(kafe,undefined){
	var $ = kafe.dependencies.jQuery;

	/**
	* ### Version 1.0
	* Additionnal manipulation methods for numbers.
	*
	* @module kafe
	* @class kafe.number 
	*/
	var number = {};

	/**
	* Converts a number to its roman numeral value.
	*
	* @method toRoman
	* @param {Number} number
	* @return {String} The roman numeral value.
	* @example
	*	kafe.number.toRoman(1954);
	*	// returns "MCMLIV"
	*/
	number.toRoman = function(n) {

		var
			// repeat string n times
			repeat = function (s,nb) {
				return new Array(Number(nb)+1).join(s);
			},

			data   = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1},
			result = ''
		;

		// transform to int
		n = parseInt(n,10);

		// foreach numeral
		for (var i in data) {
			var matches = parseInt(n / data[i], 10);
			if (!!matches) {
				result += repeat(i, matches);
				n = n % data[i];
			}
		}
		return result;
	};


	return number;

})(window.kafe)});
//-------------------------------------------
// kafe.number
//-------------------------------------------
kafe.import({name:'number', version:'1.0', obj:(function($,K,undefined){

	//-------------------------------------------
	// PUBLIC
	//-------------------------------------------
	var number = {};

	// toRoman (num)
	// to roman numerals
	//-------------------------------------------
	number.toRoman = function(n) {

		// repeat string n times
		function repeat(s,nb) {
			return new Array(Number(nb)+1).join(s);
		};

		// transform to int
		n = parseInt(n);

		// data
		var data = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1};
		var result = '';

		// foreach numeral
		for (var i in data) {
			var matches = parseInt(n / data[i]);
			if (matches) {
				result += repeat(i, matches);
				n = n % data[i];
			}
		}
		return result;
	};








	//-------------------------------------------
	// NATIVE
	//-------------------------------------------
	var Native = {};

	// toRoman ()
	// to roman numerals
	//-------------------------------------------
	Native.toRoman = function() {
		return number.toRoman(this.get());
	};

	number.Native = Native;

	return number;

})(jQuery,kafe)});


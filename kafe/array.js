//-------------------------------------------
// kafe.array
//-------------------------------------------
kafe.bonify({name:'array', version:'0.1', obj:(function(K,undefined){
	var $ = K.jQuery;
	
	//-------------------------------------------
	// PUBLIC
	//-------------------------------------------
	var array = {};

	// randomize (array)
	// randomize array order (fisherYates)
	//-------------------------------------------
	array.randomize = function(myArray) {
		var i = myArray.length;
		if ( i == 0 ) return false;

		while ( --i ) {
			var j = Math.floor( Math.random() * ( i + 1 ) );
			var tempi = myArray[i];
			var tempj = myArray[j];
			myArray[i] = tempj;
			myArray[j] = tempi;
		}
		return myArray;
	};

	return array;

})(kafe)});

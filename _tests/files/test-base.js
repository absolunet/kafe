//>>excludeStart('excludeRequire', pragmas.excludeRequire);
require([
	'../libs/kafe/date'
]);
//>>excludeEnd('excludeRequire');

(function(kafe,undefined){

	var
		$         = kafe.dependencies.jQuery,
		_         = kafe.dependencies.underscore,
		Modernizr = kafe.dependencies.Modernizr
	;


	// date
	test('kafe.date', function() {

		strictEqual( kafe.date.getDayYear( kafe.date.parse('2013-01-01') ), 1,   'getDayYear() - First day' );
		strictEqual( kafe.date.getDayYear( kafe.date.parse('2013-07-17') ), 198, 'getDayYear() - Random day' );
		strictEqual( kafe.date.getDayYear( kafe.date.parse('2013-12-31') ), 365, 'getDayYear() - Last day' );
		strictEqual( kafe.date.getDayYear( kafe.date.parse('2016-12-31') ), 366, 'getDayYear() - Last day leap year' );
		
		strictEqual( kafe.date.isLeapYear(1980), true,  'isLeapYear() - 1980' );
		strictEqual( kafe.date.isLeapYear(2000), true,  'isLeapYear() - 2000' );
		strictEqual( kafe.date.isLeapYear(2010), false, 'isLeapYear() - 2010' );
		strictEqual( kafe.date.isLeapYear(2400), false, 'isLeapYear() - 2400' );

		strictEqual( kafe.date.isWeekend( kafe.date.parse('2013-07-17') ), false, 'isWeekend() - Wednesday' );
		strictEqual( kafe.date.isWeekend( kafe.date.parse('2013-07-20') ), true,  'isWeekend() - Saturday' );
		strictEqual( kafe.date.isWeekend( kafe.date.parse('2013-07-21') ), true,  'isWeekend() - Sunday' );

	});



})(window.kafe);
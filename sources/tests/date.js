//>>excludeStart('excludeRequire', pragmas.excludeRequire);
require([
	'libs/kafe/date'
]);
//>>excludeEnd('excludeRequire');

(function(kafe,undefined){

	var
		$         = kafe.dependencies.jQuery,
		_         = kafe.dependencies.underscore,
		Modernizr = kafe.dependencies.Modernizr
	;

	module('kafe.date');


	test('getDayYear()', function() {
		var getDayYear = function(date,expected,comment) {
			strictEqual( kafe.date.getDayYear( kafe.date.parse(date) ), expected, comment );
		};
		getDayYear('2013-01-01', 1,   'First day');
		getDayYear('2013-07-17', 198, 'Random day');
		getDayYear('2013-12-31', 365, 'Last day');
		getDayYear('2016-12-31', 366, 'Last day / Leap year');
		
	});


	test('isLeapYear()', function() {
		var isLeapYear = function(year,expected) {
			strictEqual( kafe.date.isLeapYear(year), expected, year );
		};
		isLeapYear(1980, true);
		isLeapYear(2000, true);
		isLeapYear(2010, false);
		isLeapYear(2400, false);
	});


	test('isWeekend()', function() {
		var isWeekend = function(date,expected,comment) {
			strictEqual( kafe.date.isWeekend( kafe.date.parse(date) ), expected, comment );
		};
		isWeekend('2013-07-17', false, 'Wednesday');
		isWeekend('2013-07-20', true,  'Saturday');
		isWeekend('2013-07-21', true,  'Sunday');
	});


	test('getMaxMonth()', function() {
		var getMaxMonth = function(year,month,expected,comment) {
			strictEqual( kafe.date.getMaxMonth(year)[month-1], expected, comment );
		};
		getMaxMonth(2013, 2, 28, 'February');
		getMaxMonth(2016, 2, 29, 'February / Leap year');
		getMaxMonth(2013, 7, 31, 'July');
	});


	test('getMonthNames()', function() {
		var getMonthNames = function(month,expected,comment) {
			strictEqual( kafe.date.getMonthNames(    )[month-1], expected[0], comment + ' / Default lang' );
			strictEqual( kafe.date.getMonthNames('en')[month-1], expected[1], comment + ' / Specified lang' );
		};
		getMonthNames(2, ['Février','February'], 'February');
	});


	test('getMonth1Names()', function() {
		var getMonth1Names = function(month,expected,comment) {
			strictEqual( kafe.date.getMonth1Names(    )[month-1], expected[0], comment + ' / Default lang' );
			strictEqual( kafe.date.getMonth1Names('en')[month-1], expected[1], comment + ' / Specified lang' );
		};
		getMonth1Names(2, ['F','F'], 'February');
	});


	test('getMonth2Names()', function() {
		var getMonth2Names = function(month,expected,comment) {
			strictEqual( kafe.date.getMonth2Names(    )[month-1], expected[0], comment + ' / Default lang' );
			strictEqual( kafe.date.getMonth2Names('en')[month-1], expected[1], comment + ' / Specified lang' );
		};
		getMonth2Names(2, ['Fe','Fe'], 'February');
	});


	test('getMonth3Names()', function() {
		var getMonth3Names = function(month,expected,comment) {
			strictEqual( kafe.date.getMonth3Names(    )[month-1], expected[0], comment + ' / Default lang' );
			strictEqual( kafe.date.getMonth3Names('en')[month-1], expected[1], comment + ' / Specified lang' );
		};
		getMonth3Names(2, ['Fév','Feb'], 'February');
	});


	test('getWeekdayNames()', function() {
		var getWeekdayNames = function(weekday,expected,comment) {
			strictEqual( kafe.date.getWeekdayNames(    )[weekday], expected[0], comment + ' / Default lang' );
			strictEqual( kafe.date.getWeekdayNames('en')[weekday], expected[1], comment + ' / Specified lang' );
		};
		getWeekdayNames(1, ['Lundi','Monday'], 'Monday');
	});


	test('getWeekday1Names()', function() {
		var getWeekday1Names = function(weekday,expected,comment) {
			strictEqual( kafe.date.getWeekday1Names(    )[weekday], expected[0], comment + ' / Default lang' );
			strictEqual( kafe.date.getWeekday1Names('en')[weekday], expected[1], comment + ' / Specified lang' );
		};
		getWeekday1Names(1, ['L','M'], 'Monday');
	});


	test('getWeekday2Names()', function() {
		var getWeekday2Names = function(weekday,expected,comment) {
			strictEqual( kafe.date.getWeekday2Names(    )[weekday], expected[0], comment + ' / Default lang' );
			strictEqual( kafe.date.getWeekday2Names('en')[weekday], expected[1], comment + ' / Specified lang' );
		};
		getWeekday2Names(1, ['Lu','Mo'], 'Monday');
	});


	test('getWeekday3Names()', function() {
		var getWeekday3Names = function(weekday,expected,comment) {
			strictEqual( kafe.date.getWeekday3Names(    )[weekday], expected[0], comment + ' / Default lang' );
			strictEqual( kafe.date.getWeekday3Names('en')[weekday], expected[1], comment + ' / Specified lang' );
		};
		getWeekday3Names(1, ['Lun','Mon'], 'Monday');
	});


	test('getDayNames()', function() {
		var getDayNames = function(day,expected,comment) {
			strictEqual( kafe.date.getDayNames(    )[day-1], expected[0], comment + ' / Default lang' );
			strictEqual( kafe.date.getDayNames('en')[day-1], expected[1], comment + ' / Specified lang' );
		};
		getDayNames(1, ['1er','1st'], 'First');
		getDayNames(2, ['2',  '2nd'], 'Second');
	});


	test('format()', function() {
		var format = function(format,date,lang,expected,comment) {
			strictEqual( kafe.date.format(format, kafe.date.parse('2013-'+date), ((lang) ? lang : undefined)), expected, comment);
		};
		format('%Y | %y',                               '01-01 00:00:00', '',   '2013 | 13',                                         'Years');
		format('%M | %m | %A | %a | %B | %b | %C | %c', '04-01 00:00:00', '',   '04 | 4 | Avril | avril | Avr | avr | AL | Al',      'Months / Default lang / 1 digit');
		format('%M | %m | %A | %a | %B | %b | %C | %c', '10-01 00:00:00', 'en', '10 | 10 | October | october | Oct | oct | OC | Oc', 'Months / Specified lang / 2 digits');
		format('%D | %d | %e',                          '01-10 00:00:00', '',   '10 | 10 | 10',                                      'Days / Default lang / 2 digits');
		format('%D | %d | %e',                          '01-06 00:00:00', 'en', '06 | 6 | 6th',                                      'Days / Specified lang / 1 digit');
		format('%W | %w | %X | %x | %Z | %z',           '01-01 00:00:00', '',   'Mardi | mardi | Mar | mar | Ma | ma',               'Weekdays / Default lang');
		format('%W | %w | %X | %x | %Z | %z',           '01-06 00:00:00', 'en', 'Sunday | sunday | Sun | sun | Su | su',             'Weekdays / Specified lang');
		format('%H | %h | %K | %k | %p',                '01-01 01:00:00', '',   '01 | 1 | 01 | 1 | am',                              'Hours / 1 digit / AM');
		format('%H | %h | %K | %k | %p',                '01-01 22:00:00', '',   '22 | 22 | 10 | 10 | pm',                            'Hours / 2 digits / PM');
		format('%I | %i',                               '01-01 00:01:00', '',   '01 | 1',                                            'Minutes / 1 digit');
		format('%I | %i',                               '01-01 00:10:00', '',   '10 | 10',                                           'Minutes / 2 digits');
		format('%S | %s',                               '01-01 00:00:01', '',   '01 | 1',                                            'Seconds / 1 digit');
		format('%S | %s',                               '01-01 00:00:10', '',   '10 | 10',                                           'Seconds / 2 digits');
	});


	test('formatRelative()', function() {
		var formatRelative = function(date,expected,comment) {
			strictEqual( kafe.date.formatRelative(kafe.date.parse('2013-01-01 00:00:00'), kafe.date.parse('2013-'+date)),       expected[0], comment+' / Default lang');
			strictEqual( kafe.date.formatRelative(kafe.date.parse('2013-01-01 00:00:00'), kafe.date.parse('2013-'+date), 'en'), expected[1], comment+' / Specified lang');
		};
		formatRelative('01-01 00:00:00', ['en ce moment',              'now'                   ], 'now');
		formatRelative('01-01 00:00:30', ["il y a moins d'une minute", 'less than a minute ago'], '1 second');
		formatRelative('01-01 00:01:00', ['il y a environ une minute', 'about a minute ago'    ], '1 minute');
		formatRelative('01-01 00:02:00', ['il y a 2 minutes',          '2 minutes ago'         ], '2 minutes');
		formatRelative('01-01 01:00:00', ['il y a environ une heure',  'about an hour ago'     ], '1 hour');
		formatRelative('01-01 02:00:00', ['il y a 2 heures',           '2 hours ago'           ], '2 hours');
		formatRelative('01-02 00:00:00', ['hier',                      'yesterday'             ], '1 day');
		formatRelative('01-03 00:00:00', ['avant-hier',                'day before yesterday'  ], '2 days');
		formatRelative('01-04 00:00:00', ['il y a 3 jours',            '3 days ago'            ], '3 days');
		formatRelative('01-08 00:00:00', ['la semaine passée',         'last week'             ], '1 week');
		formatRelative('01-15 00:00:00', ['il y a 2 semaines',         '2 weeks ago'           ], '2 weeks');
		formatRelative('02-01 00:00:00', ['le mois passé',             'last month'            ], '1 month');
		formatRelative('03-15 00:00:00', ['il y a 2 mois',             '2 months ago'          ], '2 months');
	});


	test('parse()', function() {
		var parse = function(date,comment) {
			strictEqual( kafe.date.parse(date).getTime(), new Date('Tue Jan 01 2013 00:00:00 GMT-0500 (EST)').getTime(), comment+' / '+date);
		};

		parse('January 1, 2013',                'US human readable');
		parse('2013-01-01',                     'ISO 8601 (standard)');
		parse('2013-01-01 00:00:00',            'ISO 8601 (standard)');
		parse('2013-01-01T01:00:00-04:00',      'ISO 8601 (standard)');
		parse('2013-01-01T05:00:00+00:00',      'ISO 8601 (standard)');
		parse('2013-01-01T09:00:00+04:00',      'ISO 8601 (standard)');
		parse('2013-01-01T05:00:00.000+00:00',  'ISO 8601 (standard)');
		parse('Tue, 01 Jan 13 04:00:00 -0100',  'RFC 822 (rss)');
		parse('Tue, 01 Jan 13 05:00:00 +0000',  'RFC 822 (rss)');
		parse('Tue, 01 Jan 13 06:00:00 +0100',  'RFC 822 (rss)');
		parse('Tue Jan 01 04:00:00 -0100 2013', '(twitter)');
		parse('Tue Jan 01 05:00:00 +0000 2013', '(twitter)');
		parse('Tue Jan 01 06:00:00 +0100 2013', '(twitter)');
	});

	/*
	
	TODO


	test('refreshSelectDays()', function() {
	});


	test('makeMonthCalendar()', function() {
	});

	*/

})(window.kafe);
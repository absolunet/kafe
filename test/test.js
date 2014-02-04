Error including "src\qunit\libs\kafe\kafe.js".

(function(kafe,undefined){

	var
		$         = kafe.dependencies.jQuery,
		_         = kafe.dependencies.LoDash,
		Modernizr = kafe.dependencies.Modernizr
	;

	module('kafe');


	test('dependencies', function() {
		ok( !_.isUndefined(kafe.dependencies.jQuery),        'jQuery - Loaded');
		ok( !_.isUndefined(kafe.dependencies.LoDash),        'LoDash - Loaded');
		ok( !_.isUndefined(kafe.dependencies.LoDash.string), 'underscore.string - Loaded');
		ok( !_.isUndefined(kafe.dependencies.Modernizr),     'modernizr - Loaded');
	});


	test('internal functions', function() {
		var nb = 0;

		ok( _.isFunction( kafe.fn.createInstantiableObject() ), 'createInstantiableObject() - Returns object'); ++nb;

		strictEqual( kafe.fn.lang({}),            'en', 'lang() - Not in dict / Default lang'); ++nb;
		strictEqual( kafe.fn.lang({es:[]}, 'es'), 'es', 'lang() - In dictionary / Specified lang'); ++nb;

		window.TEST = true;
		kafe.fn.deleteVar('window.TEST');
		ok( _.isUndefined(window.TEST), 'deleteVar() - Variable deleted'); ++nb;

		kafe.fn.plugIntojQuery('TEST', {test: function() { ok(true, 'plugIntojQuery() - Plugged into jQuery'); }}); ++nb;
		$('html').kafeTEST('test');

		expect(nb);
	});


	test('environment', function() {
		strictEqual( kafe.env('culture'), 'fr-ca',          'culture');
		strictEqual( kafe.env('lang'),    'fr',             'lang');
		strictEqual( kafe.env('page'),    'SpecialContent', 'page');
		deepEqual(   kafe.env('tmpl'),    ['Content'],      'tmpl');
	});


	test('modules', function() {
		kafe.bonify({name:'TEST', version:'X', obj:{test:true}});
		strictEqual( kafe.TEST.test, true, 'bonify() - Bonified kafe');
	});


})(window.kafe);
// @import 'date'               // 2 methods pending
// **@import 'form'
// **@import 'geolocation'      // difficult to automate
Error including "src\qunit\libs\kafe\number.js".

(function(kafe,undefined){

	var
		$         = kafe.dependencies.jQuery,
		_         = kafe.dependencies.LoDash,
		Modernizr = kafe.dependencies.Modernizr
	;

	module('kafe.number');


	test('toRoman()', function() {
		var toRoman = function(number,expected) {
			strictEqual( kafe.number.toRoman( number ), expected, number );
		};
		toRoman(1,    'I');
		toRoman(2,    'II');
		toRoman(3,    'III');
		toRoman(4,    'IV');
		toRoman(5,    'V');
		toRoman(6,    'VI');
		toRoman(7,    'VII');
		toRoman(8,    'VIII');
		toRoman(9,    'IX');
		toRoman(10,   'X');
		toRoman(14,   'XIV');
		toRoman(15,   'XV');
		toRoman(16,   'XVI');
		toRoman(23,   'XXIII');
		toRoman(44,   'XLIV');
		toRoman(53,   'LIII');
		toRoman(99,   'XCIX');
		toRoman(101,  'CI');
		toRoman(477,  'CDLXXVII');
		toRoman(956,  'CMLVI');
		toRoman(1111, 'MCXI');
		toRoman(1982, 'MCMLXXXII');
		toRoman(1999, 'MCMXCIX');
		toRoman(2013, 'MMXIII');
	});

	test('getPrecision()', function() {
		var getPrecision = function(number,expected) {
			strictEqual( kafe.number.getPrecision( number ), expected, number + ' = ' + expected );
		};
		getPrecision(5.458,	3);
		getPrecision(2,     0);
	});

	test('trimPrecision()', function() {
		var trimPrecision = function(number,precision,expected) {
			strictEqual( kafe.number.trimPrecision( number, precision ), expected, number + ' trimed to ' + precision + ' = ' + expected );
		};
		trimPrecision(5.458, 2, 5.45);
		trimPrecision(5.458, 0, 5);
		trimPrecision(5.458, 6, 5.458);
	});

	test('product()', function() {
		var product = function(number,factor,expected) {
			strictEqual( kafe.number.product( number, factor ), expected, number + ' * ' + factor + ' = ' + expected );
		};
		product(3, 5.3, 15.9);
	});




})(window.kafe);
// **@import 'storage'
Error including "src\qunit\libs\kafe\string.js".

(function(kafe,undefined){

	var
		$         = kafe.dependencies.jQuery,
		_         = kafe.dependencies.LoDash,
		Modernizr = kafe.dependencies.Modernizr
	;

	module('kafe.string');


	test('removeAccent()', function() {
		var removeAccent = function(string,expected) {
			strictEqual( kafe.string.removeAccent( string ), expected, string );
		};
		removeAccent("Maman li pas là l'allée la rivière / Papa li pas là l'allé pêcher l'crab",                 "Maman li pas la l'allee la riviere / Papa li pas la l'alle pecher l'crab");
		removeAccent("Des sapins bleus / Des érables mouillés / Ont pleuré tous ces gens / Qui s'aimèrent tant", "Des sapins bleus / Des erables mouilles / Ont pleure tous ces gens / Qui s'aimerent tant");
		removeAccent("Traverser le présent en s'excusant déjà de n'être pas plus loin",                          "Traverser le present en s'excusant deja de n'etre pas plus loin");
		removeAccent("Quand un trophée est plus facile à gagner qu'à soulever, il y a un problème.",             "Quand un trophee est plus facile a gagner qu'a soulever, il y a un probleme.");
		removeAccent("Tacîtié bibéndum nullä mié Frînglilia nullä, àc congés aptenté namé",                      "Tacitie bibendum nulla mie Fringlilia nulla, ac conges aptente name");
		removeAccent("àáâãäåÀÁÂÃÄÅæÆçÇèéêëÈÉÊËìíîïÌÍÎÏñÑòóôõöÒÓÔÕÖœŒùúûüÙÚÛÜýÿÝŸ",                               "aaaaaaAAAAAAaeAEcCeeeeEEEEiiiiIIIInNoooooOOOOOoeOEuuuuUUUUyyYY");
	});


	test('toObject()', function() {
		var toObject = function(string,expected) {
			deepEqual( kafe.string.toObject( string ), expected, string );
		};

		toObject(
			'{'+
				'"str1":"lorem ipsum",'+
				'"str2":"123456",'+
				'"bool1":true,'+
				'"bool2":false,'+
				'"num1":11,'+
				'"num2":11.11,'+
				'"obj":{"a":1,"b":2,"c":{"d":4,"e":5,"f":6}},'+
				'"date":"2013-01-01T05:00:00.000Z",'+
				'"arr":["alpha","beta","gamma",1,2,3.33,"2013-01-01T05:00:00.000Z",true,false,{"a":1,"b":2,"c":3}]'+
			'}',
			{
				str1: 'lorem ipsum',
				str2: '123456',
				bool1: true,
				bool2: false,
				num1:  11,
				num2:  11.11,
				obj:   { a:1, b:2, c:{ d:4, e:5, f:6 } },
				date:  new Date('Tue Jan 01 2013 00:00:00 GMT-0500 (EST)'),
				arr:   ['alpha', 'beta', 'gamma', 1, 2, 3.33, new Date('Tue Jan 01 2013 00:00:00 GMT-0500 (EST)'), true, false, { a:1, b:2, c:3 }]
			}
		);
	});


	test('generateGuid()', function() {
		var generateGuid = function() {
			var guid = kafe.string.generateGuid();
			ok( /[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-(:?[89ab])[a-f0-9]{3}-[a-f0-9]{12}/.test(guid), guid );
		};

		for (var i=0; i<10; ++i) {
			generateGuid();
		}
	});

})(window.kafe);
Error including "src\qunit\libs\kafe\string-encrypt.js".

(function(kafe,undefined){

	var
		$         = kafe.dependencies.jQuery,
		_         = kafe.dependencies.LoDash,
		Modernizr = kafe.dependencies.Modernizr
	;

	module('kafe.string.encrypt');


	test('md5()', function() {
		var md5 = function(string,expected) {
			strictEqual( kafe.string.encrypt.md5( string ), expected, string );
		};
		md5("Do you mean this horny creep / Set upon weary feet / Who looks in need of sleep / That doesn't come",  'b0ec2ff6ccd86b5a274e477e73e9a546');
		md5("Wir werden beobachtet / Und wir spuhren unserem Puls / Wir sind Schaufensterpuppen",                   '84c3f8f7966c917ec38c3ad21888fde0');
		md5("I am just a shadow of a shadow of a shadow / Always trying to catch up with myself",                   'f811a12e02455baa18562f245efe7ea2');
		md5("Nunc auctor iaculis magna, eu aliquam augue posuere nec, ellentesque bibendum enim nec ligula mattis", '4f655a9f744877676118ddcd40f5dafe');
	});


})(window.kafe);
Error including "src\qunit\libs\kafe\string-validate.js".

(function(kafe,undefined){

	var
		$         = kafe.dependencies.jQuery,
		_         = kafe.dependencies.LoDash,
		Modernizr = kafe.dependencies.Modernizr
	;

	module('kafe.string.validate');


	test('isNum()', function() {
		var isNum = function(string,expected) {
			strictEqual( kafe.string.validate.isNum( string ), expected, string );
		};
		isNum('0',     true);
		isNum('1',     true);
		isNum('-1',    true);
		isNum('33.33', true);
		isNum('33,33', false);
		isNum('4a4',   false);
		isNum('z',     false);
		isNum('0x8',   false);
	});


	test('isEmail()', function() {
		var isEmail = function(string,expected) {
			strictEqual( kafe.string.validate.isEmail( string ), expected, string );
		};
		isEmail('me@example.com',         true);
		isEmail('a.nonymous@example.com', true);
		isEmail('name+tag@example.com',   true);
		isEmail('a.name+tag@example.com', true);
		isEmail('me@',                    false);
		isEmail('@example.com',           false);
		isEmail('me.@example.com',        false);
		isEmail('.me@example.com',        false);
		isEmail('me@example..com',        false);
		isEmail('me.example@com',         false);
	});


	test('isPostalCode()', function() {
		var isPostalCode = function(string,expected) {
			for (var i in expected) {
				strictEqual( kafe.string.validate.isPostalCode( string, i ), expected[i], string+' / '+i );
			}
		};
		isPostalCode('Z9Z 9Z9', {'A1A 1A1':true,  'A1A':false, '1A1':false, 'default':false});
		isPostalCode('9Z9 Z9Z', {'A1A 1A1':false, 'A1A':false, '1A1':false, 'default':false});
		isPostalCode('ZZZ ZZZ', {'A1A 1A1':false, 'A1A':false, '1A1':false, 'default':false});
		isPostalCode('999 999', {'A1A 1A1':false, 'A1A':false, '1A1':false, 'default':false});
		isPostalCode('Z9Z9Z9',  {'A1A 1A1':false, 'A1A':false, '1A1':false, 'default':true });
		isPostalCode('9Z9Z9Z',  {'A1A 1A1':false, 'A1A':false, '1A1':false, 'default':false});
		isPostalCode('ZZZZZZ',  {'A1A 1A1':false, 'A1A':false, '1A1':false, 'default':false});
		isPostalCode('999999',  {'A1A 1A1':false, 'A1A':false, '1A1':false, 'default':false});
		isPostalCode('Z9Z',     {'A1A 1A1':false, 'A1A':true,  '1A1':false, 'default':false});
		isPostalCode('9Z9',     {'A1A 1A1':false, 'A1A':false, '1A1':true,  'default':false});
		isPostalCode('ZZZ',     {'A1A 1A1':false, 'A1A':false, '1A1':false, 'default':false});
		isPostalCode('999',     {'A1A 1A1':false, 'A1A':false, '1A1':false, 'default':false});
	});


	test('isLuhnAlgorithm()', function() {
		var isLuhnAlgorithm = function(string,expected) {
			strictEqual( kafe.string.validate.isLuhnAlgorithm( string ), expected, string );
		};
		isLuhnAlgorithm('79927398713',      true);
		isLuhnAlgorithm('4818071690396457', true);
		isLuhnAlgorithm('370197397289881',  true);
		isLuhnAlgorithm('7992739871',       false);
		isLuhnAlgorithm('481807169039645',  false);
		isLuhnAlgorithm('37019739728988',   false);
	});


	test('isCreditCard()', function() {
		var isCreditCard = function(string,cc) {
			ok( kafe.string.validate.isCreditCard( string, cc ), string+' / '+cc );
		};

		isCreditCard('40-24 00-71 12-58 93-52', 'visa');

		isCreditCard('4348777735457539', 'visa');
		isCreditCard('4539714067819',    'visa');
		isCreditCard('4122853720464129', 'visa');
		isCreditCard('4716473808464',    'visa');
		isCreditCard('4916918495155069', 'visa');
		isCreditCard('4716473808464',    'visa');

		isCreditCard('5114000761374752', 'mastercard');
		isCreditCard('5411928162908648', 'mastercard');
		isCreditCard('5470472264268674', 'mastercard');
		isCreditCard('5581229236487709', 'mastercard');
		isCreditCard('5260877406810312', 'mastercard');
		isCreditCard('5157155621837790', 'mastercard');

		isCreditCard('347584604671607', 'americanexpress');
		isCreditCard('370455448657203', 'americanexpress');
		isCreditCard('371730591569697', 'americanexpress');
		isCreditCard('379096961119477', 'americanexpress');
		isCreditCard('372089802856891', 'americanexpress');
		isCreditCard('344746586751979', 'americanexpress');

		isCreditCard('30109992783525', 'dinersclub');
		isCreditCard('36514055375362', 'dinersclub');
		isCreditCard('30269487993300', 'dinersclub');
		isCreditCard('30269487993300', 'dinersclub');
		isCreditCard('38136707585285', 'dinersclub');
		isCreditCard('30143446918445', 'dinersclub');

		isCreditCard('6011330290543144', 'discover');
		isCreditCard('6011085862588535', 'discover');
		isCreditCard('6011099399595855', 'discover');
		isCreditCard('6011350784362959', 'discover');
		isCreditCard('6011814358443644', 'discover');
		isCreditCard('6011444663853442', 'discover');
	});

})(window.kafe);
// **@import 'style'
Error including "src\qunit\libs\kafe\url.js".

(function(kafe,undefined){

	var
		$         = kafe.dependencies.jQuery,
		_         = kafe.dependencies.LoDash,
		Modernizr = kafe.dependencies.Modernizr
	;

	module('kafe.url');


	test('parseSearchParams()', function() {
		var parseSearchParams = function(string,expected) {
			deepEqual( kafe.url.parseSearchParams( string ), expected, string );
		};
		parseSearchParams('?group=players&team=blue&ranking=3', {group:'players', team:'blue', ranking:'3'});
	});


	test('parseSearchPath()', function() {
		var parseSearchPath = function(string,expected) {
			deepEqual( kafe.url.parseSearchPath( string ), expected, string );
		};
		parseSearchPath('?/Players/Teams/Blue', ['Players', 'Teams', 'Blue']);
	});


	test('parseHashParams()', function() {
		var parseHashParams = function(string,expected) {
			deepEqual( kafe.url.parseHashParams( string ), expected, string );
		};
		parseHashParams('#group=players&team=blue&ranking=3', {group:'players', team:'blue', ranking:'3'});
	});


	test('parseHashPath()', function() {
		var parseHashPath = function(string,expected) {
			deepEqual( kafe.url.parseHashPath( string ), expected, string );
		};
		parseHashPath('#/Players/Teams/Blue', ['Players', 'Teams', 'Blue']);
	});


	test('parseAjaxParams()', function() {
		var parseAjaxParams = function(string,expected) {
			deepEqual( kafe.url.parseAjaxParams( string ), expected, string );
		};
		parseAjaxParams('#!group=players&team=blue&ranking=3', {group:'players', team:'blue', ranking:'3'});
	});


	test('parseAjaxPath()', function() {
		var parseAjaxPath = function(string,expected) {
			deepEqual( kafe.url.parseAjaxPath( string ), expected, string );
		};
		parseAjaxPath('#!/Players/Teams/Blue', ['Players', 'Teams', 'Blue']);
	});


})(window.kafe);
// **@import 'cms/drupal'
// **@import 'cms/magento'
// **@import 'cms/sitecore'		// manual
// **@import 'ext/addthis'
// **@import 'ext/bbq'
// **@import 'ext/colorbox'
// **@import 'ext/disqus'
// **@import 'ext/facebook'
// **@import 'ext/flickr'
// **@import 'ext/googlemaps'
// **@import 'ext/soundcloud'
// **@import 'ext/twitter'
// **@import 'ext/youtube'
// **@import 'plugin/carousel'  // manual
// **@import 'plugin/menu'		// manual
// **@import 'plugin/qrcode'	// manual
// **@import 'plugin/sticky'	// manual
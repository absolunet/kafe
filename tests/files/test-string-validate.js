//>>excludeStart('excludeRequire', pragmas.excludeRequire);
require([
	'../libs/kafe/string-validate'
]);
//>>excludeEnd('excludeRequire');

(function(kafe,undefined){

	var
		$         = kafe.dependencies.jQuery,
		_         = kafe.dependencies.underscore,
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
/*

	test('isCreditCard()', function() {
		var isCreditCard = function(string,cc,expected) {
			strictEqual( kafe.string.validate.isCreditCard( string, i ), expected[i], string+' / '+i );
		};

		/*

		visa
		mastercard
		americanexpress
		dinersclub
		discover
		jcb

		*/

		/*

		isCreditCard('371449635398431', 'mastercard');
		isCreditCard('343434343434343', 'mastercard');
		isCreditCard('371144371144376', 'mastercard');
		isCreditCard('341134113411347', 'mastercard');

		isCreditCard('6011016011016011', 'di');
		isCreditCard('6011000990139424', 'di');
		isCreditCard('6011000000000004', 'di');
		isCreditCard('6011000995500000', 'di');

		*/
/*


	});
*/

})(window.kafe);
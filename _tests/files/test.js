//>>excludeStart('excludeRequire', pragmas.excludeRequire);
require([
	'../libs/kafe/kafe'
]);
//>>excludeEnd('excludeRequire');

(function(kafe,undefined){

	var $ = kafe.dependencies.jQuery;

	test('kafe.env', function() {
		strictEqual( kafe.env('culture'), 'fr-ca',          'kafe.env(\'culture\')');
		strictEqual( kafe.env('lang'),    'fr',             'kafe.env(\'lang\')');
		strictEqual( kafe.env('page'),    'SpecialContent', 'kafe.env(\'page\')');
		deepEqual(   kafe.env('tmpl'),    ['Content'],      'kafe.env(\'tmpl\')');
	});



})(window.kafe);
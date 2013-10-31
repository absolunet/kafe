//>>excludeStart('excludeRequire', pragmas.excludeRequire);
require([
	'../libs/kafe/kafe'
]);
//>>excludeEnd('excludeRequire');

(function(kafe,undefined){

	var
		$         = kafe.dependencies.jQuery,
		_         = kafe.dependencies.underscore,
		Modernizr = kafe.dependencies.Modernizr
	;

	module('kafe');


	test('dependencies', function() {
		ok( !_.isUndefined(kafe.dependencies.jQuery),            'jQuery - Loaded');
		ok( !_.isUndefined(kafe.dependencies.underscore),        'underscore - Loaded');
		ok( !_.isUndefined(kafe.dependencies.underscore.string), 'underscore.string - Loaded');
		ok( !_.isUndefined(kafe.dependencies.Modernizr),         'modernizr - Loaded');
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
		strictEqual( kafe.env('culture'), 'fr-ca',          'kafe.env(\'culture\')');
		strictEqual( kafe.env('lang'),    'fr',             'kafe.env(\'lang\')');
		strictEqual( kafe.env('page'),    'SpecialContent', 'kafe.env(\'page\')');
		deepEqual(   kafe.env('tmpl'),    ['Content'],      'kafe.env(\'tmpl\')');
	});


	test('modules', function() {
		kafe.bonify({name:'TEST', version:'X', obj:{test:true}});
		strictEqual( kafe.TEST.test, true, 'bonify() - Bonified kafe');

		kafe.plug({name:'TEST', version:'X', obj:{test:true}});
		strictEqual( kafe.plugin.TEST.test, true, 'plug() - Plugged into kafe');

		kafe.extend({name:'TEST', version:'X', obj:{test:true}});
		strictEqual( kafe.ext.TEST.test, true, 'extend() - Extended kafe');
	});


})(window.kafe);
// @import 'libs/kafe/kafe'

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
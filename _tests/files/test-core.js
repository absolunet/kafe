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


	// dependencies
	test('kafe.dependencies', function() {
		ok( !_.isUndefined(kafe.dependencies.jQuery),            'jQuery - Loaded');
		ok( !_.isUndefined(kafe.dependencies.underscore),        'underscore - Loaded');
		ok( !_.isUndefined(kafe.dependencies.underscore.string), 'underscore.string - Loaded');
		ok( !_.isUndefined(kafe.dependencies.Modernizr),         'modernizr - Loaded');
	});


	// internal functions
	test('kafe.fn', function() {
		ok( _.isFunction( kafe.fn.createInstantiableObject() ), 'createInstantiableObject() - Returns object');

		strictEqual( kafe.fn.lang({}),            'en', 'lang() - Not in dict / Default lang');
		strictEqual( kafe.fn.lang({es:[]}, 'es'), 'es', 'lang() - In dictionary / Specified lang');

		window.TEST = true;
		kafe.fn.deleteVar('window.TEST');
		ok( _.isUndefined(window.TEST), 'deleteVar() - Variable deleted');

		kafe.fn.plugIntojQuery('TEST', {test: function() { ok(true, 'plugIntojQuery() - Plugged into jQuery'); }});
		$('html').kafeTEST('test');
	});


	// environment
	test('kafe.env', function() {
		strictEqual( kafe.env('culture'), 'fr-ca',          'kafe.env(\'culture\')');
		strictEqual( kafe.env('lang'),    'fr',             'kafe.env(\'lang\')');
		strictEqual( kafe.env('page'),    'SpecialContent', 'kafe.env(\'page\')');
		deepEqual(   kafe.env('tmpl'),    ['Content'],      'kafe.env(\'tmpl\')');
	});


	// modules
	test('kafe modules', function() {
		kafe.bonify({name:'TEST', version:'X', obj:{test:true}});
		strictEqual( kafe.TEST.test, true, 'bonify() - Bonified kafe');

		kafe.plug({name:'TEST', version:'X', obj:{test:true}});
		strictEqual( kafe.plugin.TEST.test, true, 'plug() - Plugged into kafe');

		kafe.extend({name:'TEST', version:'X', obj:{test:true}});
		strictEqual( kafe.ext.TEST.test, true, 'extend() - Extended kafe');
	});


})(window.kafe);
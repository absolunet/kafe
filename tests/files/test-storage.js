//>>excludeStart('excludeRequire', pragmas.excludeRequire);
require([
	'../libs/kafe/storage',
	'../libs/vendor/jquery/mobile-events'
]);
//>>excludeEnd('excludeRequire');

(function(kafe,undefined){

	var
		$         = kafe.dependencies.jQuery,
		_         = kafe.dependencies.underscore,
		Modernizr = kafe.dependencies.Modernizr
	;

	module('kafe.storage');


	test('get/set/delete item', function() {




		kafe.storage.setPersistentItem('TEST', 'alpha');
		strictEqual( kafe.storage.getPersistentItem('TEST'), 'alpha', 'get/set PersistentItem' );
		kafe.storage.removePersistentItem('TEST');
		strictEqual( kafe.storage.getPersistentItem('TEST'), undefined, 'delete PersistentItem' );

	});


	/*
	storage.getPersistentItem
	storage.getSessionItem

	storage.setPersistentItem
	storage.setSessionItem

	storage.removePersistentItem
	storage.removeSessionItem



	storage.getPersistentNamespaceKeys
	storage.getSessionNamespaceKeys

	storage.getPersistentNamespaceItems
	storage.getSessionNamespaceItems

	storage.removePersistentNamespace
	storage.removeSessionNamespace

	storage.getAllPersistentKeys
	storage.getAllSessionKeys



	storage.getAllPersistentItems
	storage.getAllSessionItems

	storage.removeAllPersistent
	storage.removeAllSession

	storage.getJSON = function() {
	*/

})(window.kafe);
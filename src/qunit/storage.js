// @import 'libs/kafe/storage'

(function(kafe,undefined){

	var
		$         = kafe.dependencies.jQuery,
		_         = kafe.dependencies.LoDash,
		Modernizr = kafe.dependencies.Modernizr
	;

	module('kafe.storage');


	test('get/set/delete items', function() {

		/*- Persistent Items -*/

		// get/set
		kafe.storage.setPersistentItem('persistent', 'item');
		strictEqual( kafe.storage.getPersistentItem('persistent'), 'item', 'get/set an item (persistent)' );
		// delete
		kafe.storage.removePersistentItem('persistent');
		strictEqual( kafe.storage.getPersistentItem('persistent'), undefined, 'delete an item (persistent)' );

		// get expired
		var _pCookieName = 'persistent-expired-test';
		$.cookie(_pCookieName, 'init');
		kafe.storage.setPersistentItem('expire', 'item', { expires: _pCookieName });
		$.cookie(_pCookieName, 'changed');
		strictEqual( kafe.storage.getPersistentItem('expire'), undefined, 'get an expired item based on cookie (persistent)' );
		$.removeCookie(_pCookieName);
		kafe.storage.setPersistentItem('expire', 'item', { expires: -1 });
		strictEqual( kafe.storage.getPersistentItem('expire'), undefined, 'get an expired item based on time (persistent)' );

		// get - namespaces
		kafe.storage.setPersistentItem('test:first-key', 'first-value');
		kafe.storage.setPersistentItem('test:second-key', 'second-value');
		deepEqual( kafe.storage.getPersistentNamespaceKeys('test'), ['test:second-key', 'test:first-key'], 'get a namespace keys (persistent)' );
		deepEqual( kafe.storage.getPersistentNamespaceItems('test'), { 'test:second-key':'second-value', 'test:first-key':'first-value' }, 'get a namespace items (persistent)' );
		// delete - namespaces
		kafe.storage.removePersistentNamespace('test');
		deepEqual( kafe.storage.getPersistentNamespaceItems('test'), {}, 'delete a namespace (persistent)' );

		// get - All
		kafe.storage.setPersistentItem('test:first-key', 'first-value');
		kafe.storage.setPersistentItem('test:second-key', 'second-value');
		kafe.storage.setPersistentItem('user', 'my-username');
		deepEqual( kafe.storage.getAllPersistentKeys(), ['user', 'test:second-key', 'test:first-key'], 'get all keys (persistent)' );
		deepEqual( kafe.storage.getAllPersistentItems(), { 'test:first-key':'first-value', 'test:second-key':'second-value', 'user':'my-username' }, 'get all items (persistent)' );
		// delete - All
		kafe.storage.removeAllPersistent();
		deepEqual( kafe.storage.getAllPersistentItems(), {}, 'delete all items (persistent)' );

		/*- Session Items -*/

		// get/set
		kafe.storage.setSessionItem('session', 'item');
		strictEqual( kafe.storage.getSessionItem('session'), 'item', 'get/set an item (session)' );
		// delete
		kafe.storage.removeSessionItem('session');
		strictEqual( kafe.storage.getSessionItem('session'), undefined, 'delete an item (session)' );

		// get expired
		var _sCookieName = 'session-expired-test';
		$.cookie(_sCookieName, 'init');
		kafe.storage.setSessionItem('expire', 'item', { expires: _sCookieName });
		$.cookie(_sCookieName, 'changed');
		strictEqual( kafe.storage.getSessionItem('expire'), undefined, 'get an expired item based on cookie (session)' );
		$.removeCookie(_sCookieName);
		kafe.storage.setPersistentItem('expire', 'item', { expires: -1 });
		strictEqual( kafe.storage.getSessionItem('expire'), undefined, 'get an expired item based on time (session)' );

		// get - namespace
		kafe.storage.setSessionItem('test:first-key', 'first-value');
		kafe.storage.setSessionItem('test:second-key', 'second-value');
		deepEqual( kafe.storage.getSessionNamespaceKeys('test'), ['test:second-key', 'test:first-key'], 'get a namespace keys (session)' );
		deepEqual( kafe.storage.getSessionNamespaceItems('test'), { 'test:second-key':'second-value', 'test:first-key':'first-value' }, 'get a namespace items (session)' );
		// delete - namespace
		kafe.storage.removeSessionNamespace('test');
		deepEqual( kafe.storage.getSessionNamespaceItems('test'), {}, 'delete a namespace (session)' );

		// get - All
		kafe.storage.setSessionItem('test:first-key', 'first-value');
		kafe.storage.setSessionItem('test:second-key', 'second-value');
		kafe.storage.setSessionItem('user', 'my-username');
		deepEqual( kafe.storage.getAllSessionKeys(), ['user', 'test:second-key', 'test:first-key'], 'get all keys (session)' );
		deepEqual( kafe.storage.getAllSessionItems(), { 'test:first-key':'first-value', 'test:second-key':'second-value', 'user':'my-username' }, 'get all items (session)' );
		// delete - All
		kafe.storage.removeAllSession();
		deepEqual( kafe.storage.getAllSessionItems(), {}, 'delete all items (session)' );

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
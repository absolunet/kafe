//>>excludeStart('excludeRequire', pragmas.excludeRequire);
require([
	'libs/external/jquery/cookie',
	'libs/external/jquery/json',
	'libs/kafe/string'
]);
//>>excludeEnd('excludeRequire');

window.kafe.bonify({name:'storage', version:'1.1', obj:(function(kafe,undefined){
	var
		$         = kafe.dependencies.jQuery,
		Modernizr = kafe.dependencies.Modernizr,

		LOCAL   = 1,
		SESSION = 2,


		// if storage type is available
		_isAvailable = function() {
			return (arguments[0] == LOCAL) ? Modernizr.localstorage : Modernizr.sessionstorage;
		},


		// get storage obj
		_getStorageObj = function() {
			return (arguments[0] == LOCAL) ? localStorage : sessionStorage;
		},



		// get data from storage
		_get = function(type, key) {
			if (_isAvailable(type)) {
				var
					sData = _getStorageObj(type).getItem(key),
					data = (sData) ? kafe.string.toObject(sData) : undefined
				;
				if (!!data) {

					if (!!data.expires && data.expires < new Date()) {
						_remove(type,key);

					} else if (!!data.cookie) {

						if (data.cookie != $.cookie(key)) {
							_remove(type,key);

						} else {
							return data.data;
						}
					} else {
						return data.data;
					}
				}
			}
			return undefined;
		},


		// set data in storage
		_set = function(type,key,value,options) {
			if (_isAvailable(type)) {
				options = options || {};
				var data = {
					//modified: new Date(),
					data: value
				};

				if (!!options.expires) {
					if (options.expires == 'cookie') {
						data.cookie = $.cookie(key);
					} else {
						data.expires = new Date( new Date().getTime()+(options.expires * 1000) );
					}
				}

				_getStorageObj(type).setItem(key, $.toJSON(data));
			}
		},


		// remove data from storage
		_remove = function(type,key) {
			if (_isAvailable(type)) {
				_getStorageObj(type).removeItem(key);
			}
		},




		// get namespace keys from storage
		_getNamespaceKeys = function(type,name) {
			if (_isAvailable(type)) {
				var
					data = [],
					root = _get(type, name),
					s    = _getStorageObj(type),
					r    = new RegExp('^'+name+':')
				;

				if (root !== undefined) {
					data.push(name);
				}

				for (var i in s) {
					if (r.test(i)) {
						if (_get(type,i) !== undefined) {
							data.push(i);
						}
					}
				}

				return data;
			}
			return undefined;
		},


		// get namespace data from storage
		_getNamespaceItems = function(type,name) {
			if (_isAvailable(type)) {

				var
					data = [],
					root = _get(type, name),
					s    = _getStorageObj(type),
					r    = new RegExp('^'+name+':')
				;
				if (root !== undefined) {
					data[name] = root;
				}

				for (var i in s) {
					if (r.test(i)) {
						var d = _get(type,i);
						if (d !== undefined) {
							data[i] = d;
						}
					}
				}

				return data;
			}
			return undefined;
		},


		// remove namespace data from storage
		_removeNamespace = function(type,name) {
			if (_isAvailable(type)) {

				_remove(type,name);

				var
					s = _getStorageObj(type),
					r = new RegExp('^'+name+':')
				;
				for (var i in s) {
					if (r.test(i)) {
						_remove(type,i);
					}
				}
			}
		},




		// get all keys from storage
		_getAllKeys = function(type) {
			if (_isAvailable(type)) {
				var
					data = [],
					s    = _getStorageObj(type)
				;
				for (var i in s) {
					if (_get(type,i) !== undefined) {
						data.push(i);
					}
				}

				return data;
			}
			return undefined;
		},


		// get all data from storage
		_getAllItems = function(type) {
			if (_isAvailable(type)) {
				var
					data = {},
					s    = _getStorageObj(type)
				;
				for (var i in s) {
					var d = _get(type,i);
					if (d !== undefined) {
						data[i] = d;
					}
				}

				return data;
			}
			return undefined;
		},


		// remove all data from storage
		_removeAll = function(type) {
			if (_isAvailable(type)) {
				_getStorageObj(type).clear();
			}
		}
	;




	// PUBLIC
	var storage = {};

	// get data from local storage
	storage.getPersistentItem = function(key) {
		return _get(LOCAL,key);
	};

	// get data from session storage
	storage.getSessionItem = function(key) {
		return _get(SESSION,key);
	};

	// set data in local storage
	storage.setPersistentItem = function(key,value,options) {
		_set(LOCAL,key,value,options);
	};

	// set data in session storage
	storage.setSessionItem = function(key,value,options) {
		_set(SESSION,key,value,options);
	};

	// remove data from local storage
	storage.removePersistentItem = function(key) {
		_remove(LOCAL,key);
	};

	// remove data from session storage
	storage.removeSessionItem = function(key) {
		_remove(SESSION,key);
	};



	// get namespace keys from local storage
	storage.getPersistentNamespaceKeys = function(name) {
		return _getNamespaceKeys(LOCAL,name);
	};

	// get namespace keys from session storage
	storage.getSessionNamespaceKeys = function(name) {
		return _getNamespaceKeys(SESSION,name);
	};

	// get namespace data from local storage
	storage.getPersistentNamespaceItems = function(name) {
		return _getNamespaceItems(LOCAL,name);
	};

	// get namespace data from session storage
	storage.getSessionNamespaceItems = function(name) {
		return _getNamespaceItems(SESSION,name);
	};

	// remove namespace data from local storage
	storage.removePersistentNamespace = function(name) {
		_removeNamespace(LOCAL,name);
	};

	// remove namespace data from session storage
	storage.removeSessionNamespace = function(name) {
		_removeNamespace(SESSION,name);
	};



	// get all keys from local storage
	storage.getAllPersistentKeys = function() {
		return _getAllKeys(LOCAL);
	};

	// get all keys from session storage
	storage.getAllSessionKeys = function() {
		return _getAllKeys(SESSION);
	};

	// get all data from local storage
	storage.getAllPersistentItems = function() {
		return _getAllItems(LOCAL);
	};

	// get all data from session storage
	storage.getAllSessionItems = function() {
		return _getAllItems(SESSION);
	};

	// remove all data from local storage
	storage.removeAllPersistent = function() {
		_removeAll(LOCAL);
	};

	// remove all data from session storage
	storage.removeAllSession = function() {
		_removeAll(SESSION);
	};



	// call and cache a getJSON() call
	storage.getJSON = function() {
		if (_isAvailable(SESSION)) {
			var
				url      = arguments[0],
				options  = (typeof(arguments[1]) != 'function') ? arguments[1] : {expires:600},
				callback = (typeof(arguments[1]) != 'function') ? arguments[2] : arguments[1],
				key      = 'kafe-storage-getJSON_'+url.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
				cache    = storage.getSessionItem(key)
			;

			if (cache !== undefined) {
				callback(cache);
			} else {
				$.getJSON(url, function(data) {
					storage.setSessionItem(key, data, options);
					callback(data);
				});
			}
		}
	};




	return storage;

})(window.kafe)});
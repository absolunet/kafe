//-------------------------------------------
// kafe.storage
//-------------------------------------------
window.kafe.bonify({name:'storage', version:'1.1', obj:(function(kafe,undefined){
	var $ = kafe.jQuery;
	
	// test storage availability
	var 
		_isLocalStorage = (function() {
			try {
				return !!localStorage.getItem;
			} catch(e) {
				return false;
			}
		})(),

		_isSessionStorage = (function() {
			try {
				return !!sessionStorage.getItem;
			} catch(e) {
				return false;
			}
		})(),
	
		LOCAL   = 1,
		SESSION = 2
	;

	// _isAvailable (type)
	// if storage type is available
	//-------------------------------------------
	function _isAvailable() {
		return (arguments[0] == LOCAL) ? _isLocalStorage : _isSessionStorage;
	}

	// _getStorageObj (type)
	// get storage obj
	//-------------------------------------------
	function _getStorageObj() {
		return (arguments[0] == LOCAL) ? localStorage : sessionStorage;
	}

	// _toObject(string)
	// same as kafe.string.toObject()
	//-------------------------------------------
	function _toObject(s) {
		
		function cast(o) {
			for (var i in o) {
				// object
				if (typeof(o[i]) == 'object') {
					o[i] = cast(o[i]);
				
				// date
				} else if (/^\d{4}\-\d{2}\-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(o[i])) {
					o[i] = new Date(o[i]);
				}
			}
			return o;
		}

		kafe.required('kafe.jQuery.toJSON');
		return cast($.evalJSON(s));
	}

	// _get (type, key)
	// get data from storage
	//-------------------------------------------
	function _get(type, key) {
		if (_isAvailable(type)) {
			var 
				sData = _getStorageObj(type).getItem(key),
				data = (sData) ? K.string.toObject(sData) : undefined
			;
			if (!!data) {
				
				if (!!data.expires && data.expires < new Date()) {
					_remove(type,key);

				} else if (!!data.cookie) {

					K.required('kafe.jQuery.cookie');
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
	}

	// _set (type,key,value,[expires])
	// set data in storage
	//-------------------------------------------
	function _set(type,key,value,options) {
		K.required('kafe.jQuery.toJSON');

		if (_isAvailable(type)) {
			options = options || {};
			var data = {
				//modified: new Date(),
				data: value
			};
		
			if (!!options.expires) {
				if (options.expires == 'cookie') {
					K.required('kafe.jQuery.cookie');
					data.cookie = $.cookie(key);
				} else {
					data.expires = new Date( new Date().getTime()+(options.expires * 1000) );
				}
			}
		
			_getStorageObj(type).setItem(key, $.toJSON(data));
		}
	}
	
	// _remove (type,key)
	// remove data from storage
	//-------------------------------------------
	function _remove(type,key) {
		if (_isAvailable(type)) {
			_getStorageObj(type).removeItem(key);
		}
	}



	// _getNamespaceKeys (type,name)
	// get namespace keys from storage
	//-------------------------------------------
	function _getNamespaceKeys(type,name) {
		if (_isAvailable(type)) {
			var data = [];

			var root = _get(type, name);
			if (root != undefined) {
				data.push(name);
			}
			
			var s = _getStorageObj(type);
			var r = new RegExp('^'+name+':');
			for (var i in s) {
				if (r.test(i)) {
					if (_get(type,i) != undefined) {
						data.push(i);
					}
				}
			}

			return data;
		}
		return undefined;
	}

	// _getNamespaceItems (type,name)
	// get namespace data from storage
	//-------------------------------------------
	function _getNamespaceItems(type,name) {
		if (_isAvailable(type)) {
			var data = {};

			var root = _get(type, name);
			if (root != undefined) {
				data[name] = root;
			}
			
			var s = _getStorageObj(type);
			var r = new RegExp('^'+name+':');
			for (var i in s) {
				if (r.test(i)) {
					var d = _get(type,i);
					if (d != undefined) {
						data[i] = d;
					}
				}
			}

			return data;
		}
		return undefined;
	}

	// _removeNamespace (type, name)
	// remove namespace data from storage
	//-------------------------------------------
	function _removeNamespace(type,name) {
		if (_isAvailable(type)) {

			_remove(type,name);

			var s = _getStorageObj(type);
			var r = new RegExp('^'+name+':');
			for (var i in s) {
				if (r.test(i)) {
					_remove(type,i);
				}
			}
		}
	}



	// _getAllKeys (type)
	// get all keys from storage
	//-------------------------------------------
	function _getAllKeys(type) {
		if (_isAvailable(type)) {
			var data = [];

			var s = _getStorageObj(type);
			for (var i in s) {
				if (_get(type,i) != undefined) {
					data.push(i);
				}
			}

			return data;
		}
		return undefined;
	}

	// _getAllItems (type)
	// get all data from storage
	//-------------------------------------------
	function _getAllItems(type) {
		if (_isAvailable(type)) {
			var data = {};

			var s = _getStorageObj(type);
			for (var i in s) {
				var d = _get(type,i);
				if (d != undefined) {
					data[i] = d;
				}
			}

			return data;
		}
		return undefined;
	}

	// _removeAll (type)
	// remove all data from storage
	//-------------------------------------------
	function _removeAll(type) {
		if (_isAvailable(type)) {
			_getStorageObj(type).clear();
		}
	}
	
	
	





	//-------------------------------------------
	// PUBLIC
	//-------------------------------------------
	var storage = {};

	// getPersistentItem (key)
	// get data from local storage
	//-------------------------------------------
	storage.getPersistentItem = function(key) {
		return _get(LOCAL,key);
	};

	// getSessionItem (key)
	// get data from session storage
	//-------------------------------------------
	storage.getSessionItem = function(key) {
		return _get(SESSION,key);
	};

	// setPersistentItem (key,value,[expires])
	// set data in local storage
	//-------------------------------------------
	storage.setPersistentItem = function(key,value,options) {
		_set(LOCAL,key,value,options);
	};

	// setSessionItem (key,value,[expires])
	// set data in session storage
	//-------------------------------------------
	storage.setSessionItem = function(key,value,options) {
		_set(SESSION,key,value,options);
	};
	
	// removePersistentItem (key)
	// remove data from local storage
	//-------------------------------------------
	storage.removePersistentItem = function(key) {
		_remove(LOCAL,key);
	};

	// removeSessionItem (key)
	// remove data from session storage
	//-------------------------------------------
	storage.removeSessionItem = function(key) {
		_remove(SESSION,key);
	};



	// getPersistentNamespaceKeys (name)
	// get namespace keys from local storage
	//-------------------------------------------
	storage.getPersistentNamespaceKeys = function(name) {
		return _getNamespaceKeys(LOCAL,name);
	};

	// getSessionNamespaceKeys (name)
	// get namespace keys from session storage
	//-------------------------------------------
	storage.getSessionNamespaceKeys = function(name) {
		return _getNamespaceKeys(SESSION,name);
	};

	// getPersistentNamespaceItems (name)
	// get namespace data from local storage
	//-------------------------------------------
	storage.getPersistentNamespaceItems = function(name) {
		return _getNamespaceItems(LOCAL,name);
	};

	// getSessionNamespaceItems (name)
	// get namespace data from session storage
	//-------------------------------------------
	storage.getSessionNamespaceItems = function(name) {
		return _getNamespaceItems(SESSION,name);
	};

	// removePersistentNamespace (name)
	// remove namespace data from local storage
	//-------------------------------------------
	storage.removePersistentNamespace = function(name) {
		_removeNamespace(LOCAL,name);
	};

	// removeSessionNamespace (key)
	// remove namespace data from session storage
	//-------------------------------------------
	storage.removeSessionNamespace = function(name) {
		_removeNamespace(SESSION,name);
	};



	// getAllPersistentKeys ()
	// get all keys from local storage
	//-------------------------------------------
	storage.getAllPersistentKeys = function() {
		return _getAllKeys(LOCAL);
	};

	// getAllSessionKeys ()
	// get all keys from session storage
	//-------------------------------------------
	storage.getAllSessionKeys = function() {
		return _getAllKeys(SESSION);
	};

	// getAllPersistentItems ()
	// get all data from local storage
	//-------------------------------------------
	storage.getAllPersistentItems = function() {
		return _getAllItems(LOCAL);
	};

	// getAllSessionItems ()
	// get all data from session storage
	//-------------------------------------------
	storage.getAllSessionItems = function() {
		return _getAllItems(SESSION);
	};

	// removeAllPersistent ()
	// remove all data from local storage
	//-------------------------------------------
	storage.removeAllPersistent = function() {
		_removeAll(LOCAL);
	};

	// removeAllSession ()
	// remove all data from session storage
	//-------------------------------------------
	storage.removeAllSession = function() {
		_removeAll(SESSION);
	};
	
	// getJSON (url [,data] ,callback)
	// call and cache a getJSON() call
	//-------------------------------------------
	storage.getJSON = function() {
		if (_isAvailable(SESSION)) {
			var 
				url      = arguments[0],
				options  = (typeof(arguments[1]) != 'function') ? arguments[1] : {expires:600},
				callback = (typeof(arguments[1]) != 'function') ? arguments[2] : arguments[1],
				key      = 'kafe-storage-getJSON_'+url.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
				cache    = storage.getSessionItem(key)
			;
		
			if (cache != undefined) {
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

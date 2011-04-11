//-------------------------------------------
// kafe.storage
//-------------------------------------------
kafe.import({name:'storage', version:'1.0', obj:(function($,K,undefined){
	
	// test storage availability
	var 
		__isLocalStorage = (function() {
 	       try {
	            return !!localStorage.getItem;
	        } catch(e) {
	            return false;
	        }
	    })(),

		__isSessionStorage = (function() {
	        try {
	            return !!sessionStorage.getItem;
	        } catch(e) {
	            return false;
	        }
	    })(),
	
		LOCAL   = 1,
		SESSION = 2
	;

	// __isAvailable (type)
	// if storage type is available
	//-------------------------------------------
	function __isAvailable() {
		return (arguments[0] == LOCAL) ? __isLocalStorage : __isSessionStorage;
	}

	// __getStorageObj (type)
	// get storage obj
	//-------------------------------------------
	function __getStorageObj() {
		return (arguments[0] == LOCAL) ? localStorage : sessionStorage;
	}



	// __get (type, key)
	// get data from storage
	//-------------------------------------------
	function __get(type, key) {
		K.required('kafe.string');

		if (__isAvailable(type)) {
			var data = K.string.toObject(__getStorageObj(type).getItem(key));
		
			if (data) {
				if (data.expires && data.expires < new Date()) {
					__remove(type,key);
				} else {
					return data.data;
				}
			}
		}
		return undefined;
	}

	// __set (type,key,value,[expires])
	// set data in storage
	//-------------------------------------------
	function __set(type,key,value,options) {
		K.required('jQuery.toJSON');

		if (__isAvailable(type)) {
			options = options || {};
			var data = {
				//modified: new Date(),
				data:     value
			};
		
			if (options.expires) {
				data.expires = new Date( new Date().getTime()+(options.expires * 1000) );
			}
		
			__getStorageObj(type).setItem(key, $.toJSON(data));
		}
	}
	
	// __remove (type,key)
	// remove data from storage
	//-------------------------------------------
	function __remove(type,key) {
		if (__isAvailable(type)) {
			__getStorageObj(type).removeItem(key);
		}
	}



	// __getNamespaceKeys (type,name)
	// get namespace keys from storage
	//-------------------------------------------
	function __getNamespaceKeys(type,name) {
		if (__isAvailable(type)) {
			var data = [];

			var root = __get(type, name);
			if (root != undefined) {
				data.push(name);
			}
			
			var s = __getStorageObj(type);
			var r = new RegExp('^'+name+':');
			for (var i in s) {
				if (r.test(i)) {
					if (__get(type,i) != undefined) {
						data.push(i);
					}
				}
			}

			return data;
		}
		return undefined;
	}

	// __getNamespaceItems (type,name)
	// get namespace data from storage
	//-------------------------------------------
	function __getNamespaceItems(type,name) {
		if (__isAvailable(type)) {
			var data = {};

			var root = __get(type, name);
			if (root != undefined) {
				data[name] = root;
			}
			
			var s = __getStorageObj(type);
			var r = new RegExp('^'+name+':');
			for (var i in s) {
				if (r.test(i)) {
					var d = __get(type,i);
					if (d != undefined) {
						data[i] = d;
					}
				}
			}

			return data;
		}
		return undefined;
	}

	// __removeNamespace (type, name)
	// remove namespace data from storage
	//-------------------------------------------
	function __removeNamespace(type,name) {
		if (__isAvailable(type)) {

			__remove(type,name);

			var s = __getStorageObj(type);
			var r = new RegExp('^'+name+':');
			for (var i in s) {
				if (r.test(i)) {
					__remove(type,i);
				}
			}
		}
	}



	// __getAllKeys (type)
	// get all keys from storage
	//-------------------------------------------
	function __getAllKeys(type) {
		if (__isAvailable(type)) {
			var data = [];

			var s = __getStorageObj(type);
			for (var i in s) {
				if (__get(type,i) != undefined) {
					data.push(i);
				}
			}

			return data;
		}
		return undefined;
	}

	// __getAllItems (type)
	// get all data from storage
	//-------------------------------------------
	function __getAllItems(type) {
		if (__isAvailable(type)) {
			var data = {};

			var s = __getStorageObj(type);
			for (var i in s) {
				var d = __get(type,i);
				if (d != undefined) {
					data[i] = d;
				}
			}

			return data;
		}
		return undefined;
	}

	// __removeAll (type)
	// remove all data from storage
	//-------------------------------------------
	function __removeAll(type) {
		if (__isAvailable(type)) {
			__getStorageObj(type).clear();
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
		return __get(LOCAL,key);
	};

	// getSessionItem (key)
	// get data from session storage
	//-------------------------------------------
	storage.getSessionItem = function(key) {
		return __get(SESSION,key);
	};

	// setPersistentItem (key,value,[expires])
	// set data in local storage
	//-------------------------------------------
	storage.setPersistentItem = function(key,value,options) {
		__set(LOCAL,key,value,options);
	};

	// setSessionItem (key,value,[expires])
	// set data in session storage
	//-------------------------------------------
	storage.setSessionItem = function(key,value,options) {
		__set(SESSION,key,value,options);
	};
	
	// removePersistentItem (key)
	// remove data from local storage
	//-------------------------------------------
	storage.removePersistentItem = function(key) {
		__remove(LOCAL,key);
	};

	// removeSessionItem (key)
	// remove data from session storage
	//-------------------------------------------
	storage.removeSessionItem = function(key) {
		__remove(SESSION,key);
	};



	// getPersistentNamespaceKeys (name)
	// get namespace keys from local storage
	//-------------------------------------------
	storage.getPersistentNamespaceKeys = function(name) {
		return __getNamespaceKeys(LOCAL,name);
	};

	// getSessionNamespaceKeys (name)
	// get namespace keys from session storage
	//-------------------------------------------
	storage.getSessionNamespaceKeys = function(name) {
		return __getNamespaceKeys(SESSION,name);
	};

	// getPersistentNamespaceItems (name)
	// get namespace data from local storage
	//-------------------------------------------
	storage.getPersistentNamespaceItems = function(name) {
		return __getNamespaceItems(LOCAL,name);
	};

	// getSessionNamespaceItems (name)
	// get namespace data from session storage
	//-------------------------------------------
	storage.getSessionNamespaceItems = function(name) {
		return __getNamespaceItems(SESSION,name);
	};

	// removePersistentNamespace (name)
	// remove namespace data from local storage
	//-------------------------------------------
	storage.removePersistentNamespace = function(name) {
		__removeNamespace(LOCAL,name);
	};

	// removeSessionNamespace (key)
	// remove namespace data from session storage
	//-------------------------------------------
	storage.removeSessionNamespace = function(name) {
		__removeNamespace(SESSION,name);
	};



	// getAllPersistentKeys ()
	// get all keys from local storage
	//-------------------------------------------
	storage.getAllPersistentKeys = function() {
		return __getAllKeys(LOCAL);
	};

	// getAllSessionKeys ()
	// get all keys from session storage
	//-------------------------------------------
	storage.getAllSessionKeys = function() {
		return __getAllKeys(SESSION);
	};

	// getAllPersistentItems ()
	// get all data from local storage
	//-------------------------------------------
	storage.getAllPersistentItems = function() {
		return __getAllItems(LOCAL);
	};

	// getAllSessionItems ()
	// get all data from session storage
	//-------------------------------------------
	storage.getAllSessionItems = function() {
		return __getAllItems(SESSION);
	};

	// removeAllPersistent ()
	// remove all data from local storage
	//-------------------------------------------
	storage.removeAllPersistent = function() {
		__removeAll(LOCAL);
	};

	// removeAllSession ()
	// remove all data from session storage
	//-------------------------------------------
	storage.removeAllSession = function() {
		__removeAll(SESSION);
	};

	return storage;

})(jQuery,kafe)});

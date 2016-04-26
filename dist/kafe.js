/*!
 * kafe 3.1.2
 * http://absolunet.github.io/kafe
 *
 * Copyright 2011-2016 Absolunet, http://absolunet.com/
 * Released under the MIT license
 * https://github.com/absolunet/kafe/tree/master/LICENSE.md
 */

/**
* @module kafe
* @main kafe
*/
(function(global, $, undefined) {

	var
		// check if module imported
		_exists = function(name) {
			try {
				return eval("("+name+" != undefined)");
			} catch(e) {
				return false;
			}
		},

		// delete var (try/catch for ie8)
		_delete = function(name) {
			try {
				eval("delete "+name+";");
			} catch(e) {
				eval(name+" = undefined;");
			}
		},

		// ie version
		_ie = (function(){
			var
				v = 3,
				div = document.createElement('div'),
				all = div.getElementsByTagName('i')
			;
			while ((
				div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
				all[0]
			));

			return v > 4 ? v : undefined;
		})(),

		// jquery methods
		_jQueryMethods = {},


		/**
		* ### Version 3.1.2
		* kafe core
		*
		* @module kafe
		* @class kafe
		*/
		core = {

			/**
			* kafe version
			*
			* @property VESYON
			* @type String
			**/
			VESYON: '3.1.2',

			/**
			* kafe author
			*
			* @property PARAN
			* @type String
			**/
			PARAN: 'absolunet.com',

			/**
			* Versions of dependencies / kafe modules
			*
			* @property chaje
			* @type Object
			**/
			chaje: {
				'dependencies.jQuery':    $().jquery,
				'dependencies.lodash':    _.VERSION,
				'dependencies.Modernizr': Modernizr._version
			},

			// isolate core dependencies
			dependencies: {

				/**
				* local jQuery copy
				* ref: [http://jquery.com/](http://jquery.com/)
				*
				* @property dependencies.jQuery
				* @type Object
				**/
				jQuery: $

			},

			cms:    {},
			ext:    {},
			plugin: {}
		}
	;


	// miscellaneous core functions
	core.fn = {

		/**
		* Create a instantiable object
		* By John Resig (MIT Licensed)
		* ref: [http://ejohn.org/blog/simple-class-instantiation/](http://ejohn.org/blog/simple-class-instantiation/)
		*
		* @method fn.createInstantiableObject
		* @return {Object} The instantiable object
		*/
		createInstantiableObject: function() {
			return function(args){
				if (this instanceof arguments.callee) {
					if (typeof this.__constructor == 'function') {
						this.__ = {};
						this.__constructor.apply(this, (args.callee) ? args : arguments);
					}
				} else {
					return new arguments.callee(arguments);
				}
			};
		},


		/**
		* Return the language if available or else 'en'
		*
		* @method fn.lang
		* @param {Object} dict The dictionary to check against
		* @param {String} lang The language to check
		* @return {String} The available language
		*/
		lang: function(dict, lang) {
			lang = (!!lang) ? lang : core.env.lang;
			return (!!dict[lang]) ? lang : 'en';
		},


		/**
		* Delete the variable (patch for ie8)
		*
		* @method fn.deleteVar
		* @param {String} name Name of the variable to delete
		*/
		deleteVar: function(name) {
			_delete(name);
		},


		/**
		* Add method as jQuery plugin
		*
		* @method fn.plugIntojQuery
		* @param {String} name The jQuery plugin name
		* @param {Object[Function]} methods Action:Method hash
		*/
		plugIntojQuery: function(name, methods) {
			var id = 'kafe'+name;
			name = name || 'CORE';

			if ($.fn[id] === undefined) {
				_jQueryMethods[name] = {};

				$.fn[id] = function() {
					var args = $.makeArray(arguments);
					var method = args.shift();
					return this.each(function() {
						_jQueryMethods[name][method]( this, args );
					});
				};
			}

			$.extend(_jQueryMethods[name], methods);
		}
	};



	// environment constants
	core.env = {

		/**
		* Current lang
		*
		* @property env.lang
		* @type String
		**/
		lang: document.documentElement.lang.toLowerCase().substr(0,2),

		/**
		* Internet Explorer version
		*
		* @property env.ie
		* @type Number
		**/
		ie: _ie
	};


	/**
	* Add module to core
	*
	* @method bonify
	* @param {Object} options The options
	*	@param {String} options.name The module name
	*	@param {String} options.version The module version
	*	@param {Object} options.obj The module itself
	*/
	core.bonify = function(options) {

		// if not already extended
		if (!_exists('core.'+options.name)) {

			core.chaje[options.name] = options.version;
			eval('this.'+options.name+' = arguments[0].obj;');

		// throw error
		} else {
			throw core.error('kafe.'+options.name+' already exists');
		}
	};


	/**
	* Throw kafe errors
	*
	* @method error
	* @param {Error} error The error with description
	* @return {Error} error The error
	* @example
	*	kafe.error(new Error('barf'));
	*/
	core.error = function(e) {
		var msg = ((!!e.description) ? e.description : e.message);
		e.description = e.message = '<kafe:erè> : '+ ((!!msg) ? msg : 'anonim');
		return (_ie && _ie == 8) ? new Error(e) : e;
	};


	global.kafe = core;

})(typeof window !== 'undefined' ? window : this, jQuery);

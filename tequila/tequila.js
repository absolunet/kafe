/*

    ##############################
    ##......................... ##
     ##::::::::::::::::::::::::##
      ##:::::  tequila  :::::##
       ##:::::::::::::::::::##
        ##::::::::::::::::##
         ###:::::::::::::###
          ####:::::::::####
           #####:::::#####
           ##############
           ##############
           ##..........##
            ############

*/
window.tequila = (function(w,d,$,undefined){

	// _exists (name)
	// check if module imported
	function _exists(name) {
		try {
			return eval("("+name+" != undefined);");
		} catch(e) {
			return false;
		}
	};

	//-------------------------------------------
	// CORE
	//-------------------------------------------
	var core = {};
	core.tequila = '';
	
	
	//-------------------------------------------
	// FN
	//-------------------------------------------
	core.fn  = (function(){
		var fn = {};
		
		// internalUsefulFunction ()
		// comment
		//-------------------------------------------
		fn.internalUsefulFunction = function () {

		};
		
		fn.setReadOnlyProperties = function (o,p) {
			eval("var o=arguments[0], p=arguments[1];");
			for (var i in p) {
				try {
					eval("o.__defineGetter__('"+i+"', function(){ return p['"+i+"']; });");
				} catch (e) {
					try {
						eval("Object.defineProperty(o, '"+i+"', {get:function(){ return p['"+i+"']; }});");
					} catch (e) {
						o[i] = p[i];
					}
				}
			}
		};
	
		return fn;
	})();
	
	// animation
	core.animate = function(){
		return core.tween.to.apply(core.tween.to, arguments)
	}
	
	core.pauseAll = function() {
		core.tween.pauseAllTweens();
	}
	
	core.resumeAll = function() {
		core.tween.resumeAllTweens();
	}


	
	// identification
	var 
		_i           = {},
		_setReadOnly = core.fn.setReadOnlyProperties
		// _kError      = K.error
	;
	_setReadOnly(_i = {}, {
		nombre:      'tequila',
		version:     '0.1-dev',
		destilacion: 'absolunet.com'
	});
	_setReadOnly(core,{tequila: _i.version});
	_setReadOnly(core,{identidad:_i});
	_setReadOnly(core,{version:{}});


	// bonify (name/version/object)
	// add module to core
	//-------------------------------------------
	core.bonify = function(options) {
		
		// if not already extended
		var oname = options.name; 
		var name  = 'this.'+oname; 

		// if not already extended
		if (!_exists('core.'+oname)) {

			// add version
			var v = {};
			v[oname] = options.version;
			_setReadOnly(core.version,v);
			
			// extend
			eval(name+' = arguments[0].obj;');
			
		// throw error
		} else {
			throw _kError(new Error(_i.nombre+'.'+oname+' already exists'));
		}
	};
	
	// required (name_or_url)
	// check if required module is included
	//-------------------------------------------
	core.required = function(name) {
		if (name.substr(0,2) == '//') {

			var found = false;
			$('script').each(function(){
				if (new RegExp(name).test(this.src)) {
					found = true;
					return false;
				}
			});

			if (!found) {
				throw core.error(new Error('\'' + name+'\' is required'));
			}

		} else if (!_exists(name)) {
			throw core.error(new Error(name+' is required'));
		}
	};
	
	return core;

})(window,document,jQuery);
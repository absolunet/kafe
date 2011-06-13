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
window.tequila = (function(w,d,$,K,undefined){

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
	
		return fn;
	})();



	
	// identification
	var 
		_i           = {},
		_setReadOnly = K.fn.setReadOnlyProperties,
		_kError      = K.error
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
	
	return core;

})(window,document,jQuery,kafe);
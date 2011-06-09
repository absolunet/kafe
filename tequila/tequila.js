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

	// __exists (name)
	// check if module imported
	function __exists(name) {
		try {
			return eval("("+name+" == undefined) ? false : true;");
		} catch(e) {
			return false;
		}
	};

	//-------------------------------------------
	// CORE
	//-------------------------------------------
	var core = {};

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
		version:     '0.1',
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
		if (!__exists(options.name)) {

			var name = 'this.'+options.name; 

			// add version
			var v = {};
			v[options.name] = options.version;
			_setReadOnly(core.version,v);
			
			// extend
			eval(name+' = arguments[0].obj;');
			
		// throw error
		} else {
			throw _kError(new Error(_i.nombre+'.'+options.name+' already exists'));
		}
	};
	
	return core;

})(window,document,jQuery,kafe);
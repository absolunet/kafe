//-------------------------------------------
// kafe.plugin.qrcode
//-------------------------------------------
kafe.plug({name:'qrcode', version:'0.1', obj:(function($,K,undefined){

	K.required('QRCode');
	
	var _params = {
		width		 : 256,
		height		 : 256,
		typeNumber	 : 4,
		correctLevel : QRErrorCorrectLevel.H
	};

	// _mergeParams (options)
	// return merged params
	//-------------------------------------------
	function _mergeParams(options,defaults) {
		return $.extend({}, defaults, options);
	}




	//-------------------------------------------
	// PUBLIC
	//-------------------------------------------
	var qrcode = {};
	

	// setParams (options)
	// set default params
	//-------------------------------------------
	qrcode.setParams = function() {
		_params = _mergeParams(arguments[0],_params);
	};

	// generate (text)
	// get html for qrcode
	//-------------------------------------------
	qrcode.generate = function(text) {
		
		// create the qrcode itself
		var qrcode	= new QRCode(_params.typeNumber, _params.correctLevel);
		qrcode.addData(text);
		qrcode.make();

		var table = document.createElement('table');
		
		for( var row = 0; row < qrcode.getModuleCount(); row++ ){
			var tr = document.createElement('tr');
			for( var col = 0; col < qrcode.getModuleCount(); col++ ){
				var td = document.createElement('td');
				if (qrcode.isDark(row, col)) {
					td.className = 'X';
				}
				tr.appendChild(td);
			}	
			table.appendChild(tr);
		}			

		return $( $('<div></div>').html($(table).clone()) ).html();
		
	};
	

	return qrcode;

})(jQuery,kafe)});
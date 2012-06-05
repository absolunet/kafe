//-------------------------------------------
// kafe.plugin.qrcode
//-------------------------------------------
kafe.plug({name:'qrcode', version:'0.1.1', obj:(function($,K,undefined){

	K.required('qrcode');
	
	var _params = {
		width		 : 256,
		height		 : 256,
		typeNumber	 : 4,
		correctLevel : 'H'  // high
	};

	//-------------------------------------------
	// PUBLIC
	//-------------------------------------------
	var qrcodeX = {};
	

	// setParams (options)
	// set default params
	//-------------------------------------------
	qrcodeX.setParams = function() {
		$.extend(_params, arguments[0]);
	};

	// generate (text)
	// get html for qrcode
	//-------------------------------------------
	qrcodeX.generate = function(text) {
		
		// create the qrcode itself
		var code = new qrcode(_params.typeNumber, _params.correctLevel);
		code.addData(text);
		code.make();

		var table = document.createElement('table');
		
		for( var row = 0; row < code.getModuleCount(); row++ ){
			var tr = document.createElement('tr');
			for( var col = 0; col < code.getModuleCount(); col++ ){
				var td = document.createElement('td');
				if (code.isDark(row, col)) {
					td.className = 'X';
				}
				tr.appendChild(td);
			}	
			table.appendChild(tr);
		}			

		return $( $('<div></div>').html($(table).clone()) ).html();
		
	};
	

	return qrcodeX;

})(jQuery,kafe)});
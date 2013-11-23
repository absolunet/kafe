// @import 'libs/vendor/qrcode'

window.kafe.bonify({name:'plugin.qrcode', version:'0.1.1', obj:(function(kafe,undefined){

	var $ = kafe.dependencies.jQuery;

	/**
	* ### Version 0.1.1
	* Returns a HTML table for displaying a QR code, encoded from the sent string.
	*
	* @module kafe.plugin
	* @class kafe.plugin.qrcode
	*/
	var qrcodeK = {};

	/**
	* Generate the HTML table of the QR code.
	*
	* @method generate
	* @param {String} text The text to convert to a QR code.
	* @param {Object} [options] Additional options.
	*	@param {Number} [options.version=4] QR code version (`1-40`) [Explanation on [Wikipedia](http://en.wikipedia.org/wiki/QR_code#Storage)].
	*	@param {String} [options.correctLevel='H'] QR code correction level (`L`,`M`,`Q`,`H`) [Explanation on [Wikipedia](http://en.wikipedia.org/wiki/QR_code#Error_correction)].
	* @return {String} The HTML table representing the QR code.
	*
	* @example
	*	kafe.plugin.qrcode.generate('Scan me beautiful');
	*	// returns "<table><tbody><tr><td class="X"></td><td></td><td class="X"></td></tr>[...]</tbody></table>"
	*/
	qrcodeK.generate = function(text, options) {
		options = (options) ? options : {};

		var
			version      = options.version || 4,
			correctLevel = options.correctLevel || 'H',
			table        = document.createElement('table'),
			code         = new qrcode(version, correctLevel)
		;

		// create the qrcode itself
		code.addData(text);
		code.make();

		// build table
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


	return qrcodeK;

})(window.kafe)});
/* @echo header */

	var
		_privateFunction = function () {

		}
	;


	/**
	* ### Version <!-- @echo VERSION -->
	* Additionnal methods for Magento
	*
	* @module <!-- @echo MODULE -->
	* @class <!-- @echo NAME_FULL -->
	*/
	var magento = {};


	/**
	* Bind listener on Magento's Prototype ajax complete.
	*
	* @method onAjaxComplete
	* @param {Function} callback Callback
	*/
	magento.onAjaxComplete = function(func) {
		Ajax.Responders.register({ onComplete: func });
	};

	return magento;

/* @echo footer */
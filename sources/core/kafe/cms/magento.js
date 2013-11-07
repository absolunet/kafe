/* {%= HEADER %} */

	var
		_privateFunction = function () {

		}
	;


	/**
	* ### Version <%= VERSION %>
	* Additionnal methods for Magento
	*
	* @module <%= MODULE %>
	* @class <%= NAME_FULL %>
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

/* {%= FOOTER %} */
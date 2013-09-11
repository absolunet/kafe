window.kafe.bonify({name:'cms.magento', version:'0.1', obj:(function(kafe,undefined) {
	var
		$ = kafe.dependencies.jQuery,

		_privateFunction = function () {

		}
	;


	/**
	* ### Version 0.1
	* Additionnal methods for Magento
	*
	* @module kafe.cms
	* @class kafe.cms.magento
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

})(window.kafe)});
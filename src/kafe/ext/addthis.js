/* @echo header */

	/**
	* ### Version <!-- @echo VERSION -->
	* Additionnal methods for AddThis
	*
	* @module <!-- @echo MODULE -->
	* @class <!-- @echo NAME_FULL -->
	*/
	var addthis = {};

	/**
	* Refresh addthis share data
	*
	* @method refreshData
	* @param {Object} options Options
	*	@param {String} options.url The url
	*	@param {String} options.title The page title
	*/
    addthis.refreshData = function (options) {
		options = options || {};
		window.addthis.ost = 0;
		window.addthis.update('share', 'url',   (options.url)   ? options.url   : window.location.toString());
		window.addthis.update('share', 'title', (options.title) ? options.title : document.title);
		window.addthis.ready();
		window.addthis.toolbox('.addthis_toolbox');
    };

	return addthis;

/* @echo footer */
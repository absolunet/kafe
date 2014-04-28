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
		global.addthis.ost = 0;
		global.addthis.update('share', 'url',   (options.url)   ? options.url   : global.location.toString());
		global.addthis.update('share', 'title', (options.title) ? options.title : document.title);
		global.addthis.ready();
		global.addthis.toolbox('.addthis_toolbox');
    };

	return addthis;

/* @echo footer */
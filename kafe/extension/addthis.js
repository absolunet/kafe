//-------------------------------------------
// kafe.ext.addthis
//-------------------------------------------
kafe.extend({name:'addthis', version:'0.1', obj:(function(K,undefined){
	var $ = K.jQuery;

	//-------------------------------------------
	// PUBLIC
	//-------------------------------------------
	var addthis = {};

	// refreshData ([options])
	// refresh addthis share data
	//-------------------------------------------
    addthis.refreshData = function (options) {
		options = options || {};
		window.addthis.ost = 0;
		window.addthis.update('share', 'url',   (options.url)   ? options.url   : window.location.toString());
		window.addthis.update('share', 'title', (options.title) ? options.title : document.title);
		window.addthis.ready();
		window.addthis.toolbox('.addthis_toolbox');
    };
	
	return addthis;

})(kafe)});

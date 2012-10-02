//-------------------------------------------
// kafe.ext.googlemaps.styles
// Make your template online http://gmaps-samples-v3.googlecode.com/svn/trunk/styledmaps/wizard/index.html
//-------------------------------------------
kafe.extend({name:'googlemaps.styles', version:'1.0', obj:(function(K,undefined){
	var $ = K.jQuery;

	var _styles = {
		entrepreneur: {
			name:   'Entrepreneur',
			style: [
				{
					featureType: 'road',
				    elementType: 'all',
					stylers: [
				        { hue: '#a99f96' },
				        { saturation:-100 }
				      ]	
				},
				{
					featureType: 'water',
				    elementType: 'all',
					stylers: [
				        { hue: '#baafa5' },
				        { saturation:-100 }
				      ]
				},
				{
					featureType: 'poi.park',
				    elementType: 'all',
					stylers: [
				        { hue: '#bdb2a8' },
				        { saturation:-100 }	
					]
				},
				{
					featureType: 'landscape',
				    elementType: 'all',
					stylers: [
				        { hue: '#f7e8db' },
				        { saturation:100 }
					]
				}
			]
		}
	};

	// ------------------------------------------
	// PUBLIC
	// ------------------------------------------
	var STYLES = {};
	
	STYLES.getStyle = function(id, options){
		var 
			options          = options || {}
			style    		 = null;
		;
		
		for(var o in _styles){
			if(_styles[o].name === id){
				style = _styles[o];
				break;
			}
		}
		
	
		if(style != null && style.style != null){
			return new google.maps.StyledMapType(style.style, {
				name: (options.name) ? options.name : style.name
			});
		}else{
			K.log('googlemaps-styles: Ce style n\'existe pas!');
		}
	};

	return STYLES;
})(kafe)});
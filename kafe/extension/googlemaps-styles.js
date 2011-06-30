//-------------------------------------------
// kafe.ext.googlemaps.styles
//-------------------------------------------
kafe.extend({name:'googlemaps.styles', version:'1.0', obj:(function($,K,undefined){

	// ------------------------------------------
	// PUBLIC
	// ------------------------------------------
	var STYLES = {};
	
	STYLES.getStyle = {
		
		entrepreneur: function(){
			
			var style = [
				{
					featureType: "road",
				    elementType: "all",
					stylers: [
				        { hue: "#a99f96" },
				        { saturation:-100 }
				      ]	
				},
				{
					featureType: "water",
				    elementType: "all",
					stylers: [
				        { hue: "#baafa5" },
				        { saturation:-100 }
				      ]
				},
				{
					featureType: "poi.park",
				    elementType: "all",
					stylers: [
				        { hue: "#bdb2a8" },
				        { saturation:-100 }
					]
				},
				{
					featureType: "landscape",
				    elementType: "all",
					stylers: [
				        { hue: "#f7e8db" },
				        { saturation:100 }
					]
				}
			  ];

			var styledMapOptions = {name: "Entrepreneur"}
			var entrepreneurType = new google.maps.StyledMapType(style, styledMapOptions);
			
			return entrepreneurType;
		}

	};

	// ------------------------------------------
	// INIT
	// ------------------------------------------
	$(function(){


	});
	
	return STYLES;
})(jQuery,kafe)});
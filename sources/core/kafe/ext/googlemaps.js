/* {%= HEADER %} */

	/**
	* ### Version <%= VERSION %>
	* Extra methods for the GoogleMaps API.
	* Requires `//maps.google.com/maps/api/js` to be included
	*
	* @module <%= MODULE %>
	* @class <%= NAME_FULL %>
	*/
	var googlemaps = {};


	/**
	* Get bound box of array of coords.
	*
	* @method getCoordsBounds
	* @param {Array(Array)} coords List of lat/lon coords
	*
	* @example
	*   myMap.fitBounds( <%= NAME_FULL %>.getCoordsBounds([ [45.64137, -73.86612], [45.51933, -73.58503] ]) );
	*/
	googlemaps.getCoordsBounds = function (coords) {
		var
			minLat = 90,
			maxLat = -90,
			minLon = 180,
			maxLon = -180
		;
		
		for (var i=0; i<coords.length; ++i) {
			minLat = Math.min(minLat, Number(coords[i][0]));
			maxLat = Math.max(maxLat, Number(coords[i][0]));
			minLon = Math.min(minLon, Number(coords[i][1]));
			maxLon = Math.max(maxLon, Number(coords[i][1]));
		}

		return new google.maps.LatLngBounds(new google.maps.LatLng(minLat, minLon), new google.maps.LatLng(maxLat, maxLon));
	};


	return googlemaps;

/* {%= FOOTER %} */
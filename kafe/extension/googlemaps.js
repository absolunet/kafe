//-------------------------------------------
// kafe.ext.googlemaps
// Produced by : Interactive Team
//-------------------------------------------
kafe.extend({name:'googlemaps', version:'0.2', obj:(function($,K,undefined){
	
	K.required('//maps.google.com/maps/api/js');
	
	var _mapLayout = {},
		_mapConfiguration = {},
		_markersConfiguration = {},
		_infoWindowConfiguration = {},
		_map = {},
		_markersArray = [],
		_infoWindowOverlay = null
	;
	
	// ------------------------------------------
	// PRIVATE
	// ------------------------------------------
	
	/* --------------------------------------------------  
		PRIVATE Function _create(params)
		Description : Create the fresh new Google Maps.
			@params params : Object. All the params of the Google Maps. 
				*For all the parameters, see GM.create() method description.
	--------------------------------------------------  */
	
	function _create(params){
		if(params){
			_mapConfiguration = _parseParamsCreateIfNotExist(params, _mapConfiguration);
			_mapLayout = _parseParamsCreateIfNotExist(params, _mapLayout);
		}
		
		var mapDiv = '<div id="' + _mapLayout.mapId +'" style="width:' + _mapLayout.width + '; height:' + _mapLayout.height + ';">&nbsp;</div>';
		
		var $parent = $(_mapLayout.parent);
		
		if(!($parent.get(0))){
			_throwGoogleMapsError('Google Maps parent is null! @ GM.create()');
			return;
		}
		
		$parent.append(mapDiv);
		
		_map = new google.maps.Map(document.getElementById(_mapLayout.mapId), _mapConfiguration);
		
		if(!_mapLayout.visible){
			$parent.hide();
		}
		
		if(_mapLayout.mapStyle) GM.setStyle(_mapLayout.mapStyle);
		if(_mapLayout.markers) _addMarkers(_mapLayout.markers);
	}
	
	/* --------------------------------------------------  
		PRIVATE Function _addMarkers(pMarkers)
		Description : Add the marker in the array in the map. 
			@params pMarkers : Array. Contains all the marker. 
				*For marker config see description of method GM.addMarkers();
	--------------------------------------------------  */
	
	function _addMarkers(pMarkers){
		for(var m in pMarkers){
			var	mInfos = pMarkers[m]
				title = mInfos.title
				tempM = new Object
				position = new google.maps.LatLng(pMarkers[m].position[0], pMarkers[m].position[1])
			;
			
			if(mInfos.iconImage){
				var iconImage = new google.maps.MarkerImage(mInfos.iconImage,
					new google.maps.Size(mInfos.width, mInfos.height),
				    new google.maps.Point(0,0),
				 	new google.maps.Point(0,0)
				);
			}
			
			if(mInfos.labelOptions){
				var x = 0
					y = 0
					c = (mInfos.labelOptions.className) ? mInfos.labelOptions.className : 'CustomMarker'
				var anchor;
				
				
				if(mInfos.labelOptions.anchor){
					x = mInfos.labelOptions.anchor[0];
					y = mInfos.labelOptions.anchor[1];
				}
				
				anchor = new google.maps.Point(x, y);
				
				tempM = new MarkerWithLabel({
					position:position,
					icon:iconImage,
					labelContent:title,
					labelAnchor:anchor,
					labelClass:c,
					labelInForeground: true
				});
			}
			else{
				tempM = new google.maps.Marker({
					position:position,
					icon:iconImage,
					title:title,
					animation:google.maps.Animation.DROP
				});
			}
			
			if(mInfos.useDefaultConfiguration){
				_parseAndOverride(tempM, _markersConfiguration);
			}
			else{
				_parseParamsIfExist(tempM, mInfos, _markersConfiguration);
			}
			
			tempM.setMap(_map);
			
			tempM.id = _markersArray.length;
		    _markersArray[_markersArray.length] = {m:tempM, i:mInfos};
			
			google.maps.event.addListener(tempM, 'click', function(e){
				for(var m in _markersArray){
					if(_markersArray[m].m.getPosition() == e.latLng){
						if(_markersArray[m].i.clickCallBack){
							_markersArray[m].i.clickCallBack();
						}
						
						if(_markersArray[m].i.clickInfoWindow){
							_infoWindow({content:_markersArray[m].i.content, position:_markersArray[m].m.getPosition()});
						}
						return;
					}
				}
				
			});
		}
	}
	
	/* --------------------------------------------------  
		PRIVATE Function _removeMarkers()
		Description : Remove all the markers on the map and clear reference.
	--------------------------------------------------  */
	
	function _removeMarkers(){
		for(var m in _markersArray){
			_markersArray[m].m.setMap(null);
		}
		
		_markersArray = [];
	}
	
	/* --------------------------------------------------  
	    PRIVATE  Function removeMarker(pLatLng, pTitle)
		Description : Remove marker by the latitude/longiture OR the title. You can specify the two parameters for optimal result ! 
		@params params : Object. 
			Required attributes are :
				'latlng' : Array. The position of the marker.
				'title' : String. The title of the marker.
	--------------------------------------------------  */
	
	function _removeMarker(params){
		var m = _returnMarkerByTitleOrLatLnt(params);
		if(m){
			m.setMap(null);
		}
	}
	
	/* --------------------------------------------------  
		Function infoWindow(params)
		Description : Show the info window.
		@params params : Object. 
			Required attributes are :
				'content' : String. The content of the info window. Can be html style!!
	--------------------------------------------------  */;
	
	function _infoWindow(params){
	    _parseParamsCreateIfNotExist(params, _infoWindowConfiguration);
		
		var m = null;
		
		if(params.markerInfo){
			m = _returnMarkerByTitleOrLatLnt(params.markerInfo);
		}
		
		if(_infoWindowOverlay){
			_infoWindowOverlay.close();
		}
		_infoWindowOverlay = new google.maps.InfoWindow(params, m);
		_infoWindowOverlay.open(_map);
	}
	
	/* --------------------------------------------------  
		PRIVATE Function _setDefaultMapConfiguration()
		Description : Set the default map configuration
	--------------------------------------------------  */
	
	function _setDefaultMapConfiguration(){
		_mapConfiguration.disableDoubleClickZoom = true;
		_mapConfiguration.draggable = true;
		_mapConfiguration.zoom = 6;
		_mapConfiguration.keyboardShortcuts = true;
		_mapConfiguration.mapTypeControl = true;
		_mapConfiguration.maxZoom = null;
		_mapConfiguration.minZoom = null;
		_mapConfiguration.noClear = false;
		_mapConfiguration.overviewMapControl = true;
		_mapConfiguration.panControl = true;
		_mapConfiguration.rotateControl = false;
		_mapConfiguration.scaleControl = true;
		_mapConfiguration.scrollwheel = true;
		_mapConfiguration.streetViewControl = true;
		_mapConfiguration.tilt = 0;
		_mapConfiguration.zoomControl = true;
		_mapConfiguration.center = new google.maps.LatLng(45.621, -73.83);
		_mapConfiguration.mapTypeId = google.maps.MapTypeId.ROADMAP;
	}
	
	/* --------------------------------------------------  
		PRIVATE Function _setDefaultMapLayout()
		Description : Set the default map layout configuration.
			*All the native GoogleMaps Options. See there all the niceeee attributes http://code.google.com/intl/fr-FR/apis/maps/documentation/javascript/reference.html#MapOptions
	--------------------------------------------------  */
	
	function _setDefaultMapLayout(){
		_mapLayout.mapId = 'map_canvas';
		_mapLayout.parent = 'body';
		_mapLayout.width = '500px';
		_mapLayout.height = '500px';
		_mapLayout.markers = [];
		_mapLayout.visible = true;
		_mapLayout.mapStyle = null;
	}
	
	/* --------------------------------------------------  
		PRIVATE Function _setDefaultMarkersConfiguration()
		Description : Set the default marker configuration
	--------------------------------------------------  */
	
	function _setDefaultMarkersConfiguration(){
		_markersConfiguration.clickable = true;
		_markersConfiguration.draggable = true;
		_markersConfiguration.flat = true;
		_markersConfiguration.optimized = true;
		_markersConfiguration.raiseOnDrag = true;
		_markersConfiguration.visible = true;
		_markersConfiguration.zIndex = 0;
	}
	
	/* --------------------------------------------------  
		PRIVATE Function _setDefaultInfoWindowConfiguration()
		Description : Set the default info window configuration
	--------------------------------------------------  */
	
	function _setDefaultInfoWindowConfiguration(){
		_infoWindowConfiguration.content = '';
		_infoWindowConfiguration.disableAutoPan = true;
		_infoWindowConfiguration.maxWidth = null;
		_infoWindowConfiguration.pixelOffset = null;
		_infoWindowConfiguration.position = null;
		_infoWindowConfiguration.zIndex = 1;
	}
	
	/* --------------------------------------------------  
		PRIVATE Function _parseParamsCreateIfNotExist(pParams, pObject)
		Description : Return the parameters in the object. If the parameters doens't exist it will create it !
			@params pParams : Object. The object for parsing the data.
			@params pObject : Object. The new parameters to parse.
	--------------------------------------------------  */
	
	function _parseParamsCreateIfNotExist(pParams, pObject){
		var o = new Object();
		for(var initialData in pObject){
			if(pParams[initialData] != undefined){
				o[initialData] = pParams[initialData]; 
			}
			else{
				o[initialData] = pObject[initialData];
			}
		}
		
		return o;
	}
	
	/* --------------------------------------------------  
		PRIVATE Function _parseParamsIfExist(pObject, pInitial, pBase)
		Description : Parse the parameters in the object if the object got it.
			@params pObject : Object. The object for parsing the data.
			@params pParams : Object. The new parameters to parse.
			@params pBase : Object. The base object with parameters to check if it exist.
	--------------------------------------------------  */
	
	function _parseParamsIfExist(pObject, pParams, pBase){
		for(var i in pParams){
			if(pBase[i] != undefined){
				pObject[i] = pParams[i];
			}
		}
	}
	
	/* --------------------------------------------------  
		PRIVATE Function _parseAndOverride(pObject, pParams)
		Description : Parse the new parameters in the object.
			@params pObject : Object. The object for parsing the data.
			@params pParams : Object. The new parameters to parse.
	--------------------------------------------------  */
	
	function _parseAndOverride(pObject, pParams){
		for(var b in pParams){
			pObject[b] = pParams[b];
		}
	}
	
	/* --------------------------------------------------  
		PRIVATE Function _initConfiguration()
		Description : Set the initial configuration of the GMaps.
	--------------------------------------------------  */
	
	function _initConfiguration(){
		_setDefaultMapConfiguration();
		_setDefaultMapLayout();
		_setDefaultMarkersConfiguration();
		_setDefaultInfoWindowConfiguration();
	}
	
	/* --------------------------------------------------  
		PRIVATE Function _throwGoogleMapsError(pError)
		Description : Make a Console.log with the error
	--------------------------------------------------  */
	
	function _throwGoogleMapsError(pError){
		console.log('googlemaps : ' + pError);
	}
	
	/* --------------------------------------------------  
		PRIVATE Function _ifMapExist(pThrowError, pErrorInfos)
		Description : Return if a map exist
			@params pThrowError : Boolean. If true, throw a error if no map exist.
			@params pErrorInfos : String. Add some info to the error throwed !
	--------------------------------------------------  */
	
	function _ifMapExist(pThrowError, pErrorInfos){
		if(_map && $('#' + _mapLayout.mapId).get(0)){
			return true;
		}
		else
		{
			if(pThrowError){
				_throwGoogleMapsError(' Map doesn\'t exist! Create one it\'s free! ' + pErrorInfos);
			}
			return false;
		}
	}
	
	/* --------------------------------------------------  
		PRIVATE Function _throwGoogleMapsError(pError)
		Description : Make a Console.log with the error
	--------------------------------------------------  */
	
	function _returnMarkerByTitleOrLatLnt(params){
		if(!params){
			_throwGoogleMapsError('params is null! @Method _returnMarkerByTitleOrLatLnt();');
			return;
		}
		for(var m in _markersArray){
			var mK = _markersArray[m];
			
			if(params.latlng && params.title){
				var l = new google.maps.LatLng(params.latlng[0], params.latlng[1]);
				
				if(mK.m.position.toString() == l.toString()){
					if(mK.i.title == params.title){
						return mK.m;
					}
				}
			}
			else{
				if(params.latlng){
					var l = new google.maps.LatLng(params.latlng[0], params.latlng[1]);
				
					if(mK.m.position.toString() == l.toString()){
						return mK.m;
					}
				}
			
				if(params.title){
					if(mK.i.title == params.title){
						return mK.m;
					}
				}
			}
		}
	}
	
	// ------------------------------------------
	// PUBLIC
	// ------------------------------------------
	
	var GM = {};
	
	/* --------------------------------------------------  
		Function create(params)
		Description : This method create a new cool Google Maps.
		@param params: Object. 
			Possible attributes are : 
				'parent' :  String. The selector of the parent of the new GMaps.
				'width' : Int. The width of the new GMaps.
				'height' : Int. The height of the new GMaps.
				'visible' : Boolean. Display of the new GMaps. If False, the new GMaps will be Display:none;.
				'mapStyle' : Object. Pre-defited style are in the ext googlemaps.styles.
				'markers' : Array. All the marker of the new GMaps. See description of method GM.addMarker for marker structure.
				*All the native GoogleMaps Options. See there all the niceeee attributes http://code.google.com/intl/fr-FR/apis/maps/documentation/javascript/reference.html#MapOptions
	 --------------------------------------------------  */

	GM.create = function(params){
		_create(params);
	};
	
	/* --------------------------------------------------  
		Function addMarkers(pMarkers)
		Description : The method add all the marker to the map and keep a reference of it. 
		@params pMarkers: Array.
			Required attributes are : 
				'position' : Array. The Latitude and Longitude of the marker.
				'width': Int. The width of the marker.
				'height': Int. The height of the marker.
				'title': String. The title of the marker.
				'clickCallBack' : Function. When the marker is clicked, this function is called.
				'clickInfoWindow' : Boolean. If TRUE, will show content in the infowindow on click.
				'content' : String. The content of the info window.
				'iconImage' : String. Image of the marker.
				'labelOptions' : Object
					attributes :
						'className' : String. The class of the label.
						'anchor' : Array. Set an anchor to the label.
				*All the native MarkerOptions. See there http://code.google.com/intl/fr-FR/apis/maps/documentation/javascript/reference.html#MarkerOptions
	--------------------------------------------------  */
	
	GM.addMarkers = function(pMarkers){
		if(_ifMapExist(true, 'GM.addMarkers()') && pMarkers){
			_addMarkers(pMarkers)
		}		
	};
	
	/* --------------------------------------------------  
		Function addMarker(pMarker)
		Description : The method add a single marker to the map and keep a reference of it. 
		@params pMarker: Object.
			*See required attributes from GM.addMarkers() description.
	--------------------------------------------------  */
	
	GM.addMarker = function(pMarker){
		if(_ifMapExist(true, 'GM.addMarkers()') && pMarkers){
			_addMarkers([pMarker])
		}	
	};
	
	/* --------------------------------------------------  
		Function removeMarkers()
		Description : Remove all the markers on the map and clear reference.
	--------------------------------------------------  */

	GM.removeMarkers = function(){
		if(_ifMapExist(true, 'GM.removeMarkers()')){
			_removeMarkers();
		}
	};
	
	/* --------------------------------------------------  
		Function removeMarker(pLatLng, pTitle)
		Description : Remove marker by the latitude/longiture or the title. 
		@params params : Object. 
			Required attributes are :
				'latlng' : Array. The position of the marker.
				'title' : String. The title of the marker.
	--------------------------------------------------  */
	
	GM.removeMarker = function(params){
		if(_ifMapExist(true, 'GM.removeMarker()')){
			_removeMarker(params);
		}
	};
	
	/* --------------------------------------------------  
		Function hideMarkers()
		Description : Hide all the markers.
	--------------------------------------------------  */
	
	GM.hideMarkers = function(){
		if(_ifMapExist(true, 'GM.hideMarkers()')){
			
		}
	};
	
	/* --------------------------------------------------  
		Function hideMarker(params)
		Description : Hide a specific marker by the title or the latitude and longitude).
	--------------------------------------------------  */
	
	GM.hideMarker = function(params){
		if(_ifMapExist(true, 'GM.hideMarker()')){
			
		}
	};
	
	/* --------------------------------------------------  
		Function infoWindow(params)
		Description : Show the info window.
		@params params : Object. 
			Required attributes are :
				'content' : String. The content of the info window. Can be html style!!
	--------------------------------------------------  */
	
	GM.infoWindow = function(params){
		if(_ifMapExist(true, 'GM.infoWindow()')){
			if(!params){
				_throwGoogleMapsError('The params is null!, @GM.infoWindow();');
				return;
			}
			
			_infoWindow(params);
		}
	};
	
	/* --------------------------------------------------  
		Function panTo(latLng)
		Description : Pan the google maps to the Latitude and longitude passed in params.
		@params latLng: google.maps.LatLng.
	--------------------------------------------------  */
	
	GM.panTo = function(latLng){
		if(_ifMapExist(true, 'GM.panTo()') && latLng){
			_map.panTo(latLng);
		}
	};

	/* --------------------------------------------------  
		Function fitBounds(latLngBounds)
		Description : Pan and zoom the google maps to the Latitude and longitude bound box passed in params.
		@params latLng: google.maps.LatLngBounds.
	--------------------------------------------------  */
	
	GM.fitBounds = function(latLngBounds){
		if(_ifMapExist(true, 'GM.fitBounds()') && latLngBounds){
			console.log(latLngBounds);
			_map.fitBounds(latLngBounds);
		}
	};
	
	/* --------------------------------------------------  
		Function setMapOptions(params)
		Description : Change a map options property. This change will be live. That's rock !
		@params params: Object.
			Possible attributes are : 
				*All the native GoogleMaps Options. See there all the niceeee attributes http://code.google.com/intl/fr-FR/apis/maps/documentation/javascript/reference.html#MapOptions
	--------------------------------------------------  */
	
	GM.setMapOptions = function(params){
		if(_ifMapExist(true, 'GM.setMapOptions()')){
			_mapConfiguration = _parseParamsCreateIfNotExist(params, _mapConfiguration);
			_map.setOptions(_mapConfiguration);
		}
	};
	
	/* --------------------------------------------------  
		Function setStyle(pStyle)
		Description : Change the style of the maps. This change will be live. That's too cool !
		@params params: Object. Pre-defited style are in the kafe.ext googlemaps.styles.
	--------------------------------------------------  */
	
	GM.setStyle = function(pStyle){
		if(_ifMapExist(true, 'GM.setStyle()')){
		    _map.mapTypes.set(pStyle.name, pStyle);
			_map.setMapTypeId(pStyle.name);
		}
	};
	
	/* --------------------------------------------------  
		Function resetMapOptions()
		Description : This will reset the original MapOptions. Warning!!! The current map configuration is destroyed !
	--------------------------------------------------  */
	
	GM.resetMapOptions = function(){
		if(_ifMapExist(true, 'GM.resetMapOptions()')){
			_setDefaultMapConfiguration();
			_map.setOptions(_mapConfiguration);
		}
	};
	
	/* --------------------------------------------------  
		Function getMapConfiguration()
		Description : Return the current map configuration.
	--------------------------------------------------  */
		
	GM.getMapConfiguration = function(){
		return _mapConfiguration;
	};
	
	/* --------------------------------------------------  
		Function getMapLayout()
		Description : Return the current map layout configuration.
	--------------------------------------------------  */
	
	GM.getMapLayout = function(){
		return _mapLayout;
	};
	
	/* --------------------------------------------------  
		Function getMapCenter()
		Description : Return the map center position.
	--------------------------------------------------  */
	
	GM.getMapCenter = function(){
		if(_ifMapExist(true, 'GM.getMapCenter()')){
			return _map.getCenter();
		}
	};
	
	/* --------------------------------------------------  
		Function getMarkersBounds()
		Description : Return bound box of array of markers
	--------------------------------------------------  */
	
	GM.getMarkersBounds = function(d) {
		var
			minLat = 90,
			maxLat = -90,
			minLon = 180,
			maxLon = -180
		;
		for (var i in d) {
			minLat = Math.min(minLat, Number(d[i][0]));
			maxLat = Math.max(maxLat, Number(d[i][0]));
			minLon = Math.min(minLon, Number(d[i][1]));
			maxLon = Math.max(maxLon, Number(d[i][1]));
		}
		
		return {sw:[minLat,minLon], ne:[maxLat,maxLon]};
	};
	
	/* --------------------------------------------------  
		Function toLatLngBounds()
		Description : a latLongBounds object
	--------------------------------------------------  */
	
	GM.toLatLngBounds = function(d) {
		return new google.maps.LatLngBounds(new google.maps.LatLng(d.sw[0],d.sw[1]),new google.maps.LatLng(d.ne[0],d.ne[1]));
	};


	/* --------------------------------------------------  
		Function dismiss()
		Description : Kill the current GMaps.
	--------------------------------------------------  */
	
	GM.dismiss = function(){
		if(_ifMapExist(true, 'GM.dismiss()')){
			_removeMarkers();
			$('#' + _mapLayout.mapId).remove();
		}
	};
	
	/* --------------------------------------------------  
		Function hide()
		Description : Hide the current GMaps.
	--------------------------------------------------  */
	
	GM.hide = function(){
		if(_ifMapExist(true, 'GM.hide()')){
			$('#' + _mapLayout.mapId).hide();
		}
	};
	
	
	// ------------------------------------------
	// INIT
	// ------------------------------------------
	
	// Call the init configuration on JS Loaded.
	_initConfiguration();
	
	return GM;
	
})(jQuery,kafe)});
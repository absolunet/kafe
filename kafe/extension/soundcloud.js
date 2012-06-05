//-------------------------------------------
// kafe.ext.soundcloud
//-------------------------------------------
kafe.extend({ name: 'soundcloud', version: '0.1', obj: (function ($, K, undefined) {

	// default params
	var _params = {
		cliendId: ''
	};
	
	
	//-------------------------------------------
	// PUBLIC
	//-------------------------------------------
	var soundcloud = {};

	// initialize (options)
	// init SoundCloud API
	//-------------------------------------------
	soundcloud.init = function (options) {
		// K.required('//connect.soundcloud.com/sdk.js'); // required but async
		var p = $.extend({}, _params, (options) ? options : {}); 

		if (window.SC) {
			SC.initialize({ client_id: p.clientId });
		}
	};

	// getPlaylistTracks (playlistId, [options], [callback])
	// get Playlist Tracks
	//-------------------------------------------
	soundcloud.getPlaylistTracks = function (playlistId, options, callback) {
		options = (!!options) ? options : {};

		if (window.SC) {
			SC.get('/playlists/' + playlistId, options, callback);
		} else {
			callback();
		}
	};

	// getTracks ([options], [callback])
	// get tracks
	//-------------------------------------------
	soundcloud.getTracks = function (options, callback) {
		options = (!!options) ? options : {};

		if (window.SC) {
			SC.get('/tracks/', options, callback);
		} else {
			callback();
		}
	};

	return soundcloud;

})(jQuery, kafe)});
//-------------------------------------------
// kafe.plugin.webcropper
// Produced by : Interactive Team
//-------------------------------------------

kafe.plug({name:'webcropper', version:'1.0', obj:(function($,K,undefined){
	
	K.required('jQuery.ui.draggable');
	
	var _cropperExist = false,
		_isFormBased = false,
		_inputUpdateSetInterval = 0,
		_inputUpdateInterval = 500,
		_imagePath = '',
		$image = null,
		$container = null,
		_uploader = null,
		_copperOptions = {
			img: '',
			imgContainer: '',
			filePicker: '',
			draggable: true,
			mouseDownZoom: true,
			zoomByCenter: true,
			zoomingInterval: 50,
			zoomAnimated: true,
			zoomEasing: 'linear',
			zoomAnimationTime: 100,
			zoomRatio: 100,
			minWidth: 1,
			minHeight: 1,
			maxWidth: 9999,
			maxHeight: 9999,
			inFormParams: {
				imgPath: '',
				imgWidth: '',
				imgHeight: '',
				topLeft: '',
				boxWidth: '',
				boxHeight: '',
			},
			maxSizeError: 'Votre image ne doît pas dépasser 6mo.'
			zoomIn: '',
			zoomOut: '',
			rotation: '',
			ajaxServiceUrl: '/Tools/CropperService.ashx',
			imageGeneratorPath: '/Tools/ImageGenerator.aspx',
			imgExt: ['png', 'jpg', 'bmp', 'gif', 'jpeg'],
		}
	;

	// ------------------------------------------
	// PRIVATE
	// ------------------------------------------
	
	// _initAjax and _initForm params possibility
	/*
	* @img 					: String -> Selector of the image. Ex. '.image'
	* @imgContainer 		: String -> Selector of the image container. Ex. '.imageContainer'.
	* @zoomIn 				: String -> Selector of the zoomIn button. Ex. '#zoomIn'.
	* @zoomOut 				: String -> Selector of the zoomOut button. Ex. '#zoomOut'.
	* @rotation 			: String -> Selector of the rotation button. Ex. '#rotation'. TODO
	* @filePicker 			: String -> Selector of the file picker or a «a». Ex. '#filePicker'.
	* @draggable 			: Boolean -> Set if the image is draggble.
	* @mouseDownZoom 		: Boolean -> Set if holding mouse down zoom the image in yoyo.
	* @zoomByCenter 		: Boolean -> Set if you zoom the image by the center of his container.
	  @maxSizeError			: String -> Set the error message when the image is bigger than the server can handle(webconfig). 
	* @zoomingInterval 		: Int -> Set the zooming animation interval.
	* @zoomAnimated 		: Int -> Set if the zoom is animated.
	* @zoomEasing 			: String -> Set the zooming animation easing. See the jquery easing choice.
	* @zoomAnimationTime 	: Int -> Set the zooming animation time.
	* @zoomRatio 			: Int -> Set the ratio of the zoomIn/zoomOut. Bigger zoom bigger!
	* @minWidth 			: Int -> Set the minimal width of the image.
	* @minHeight 			: Int -> Set the minimal height of the image.
	* @maxWidth 			: Int -> Set the maximum height of the image.
	* @maxHeigh 			: Int -> Set the maximum height of the image.
	* @inFormParams 		: Object -> Set the input hidden selectors.
		@imgPath 			: String -> Selector of the imagePath input hidden. Ex. '.imgPath'.
		@imgWidth 			: String -> Selector of the imgWidth input hidden. Ex. '.imgWidth'.
		@imgHeight 			: String -> Selector of the imgHeight input hidden. Ex. '.imgHeight'.
		@topLeft 			: String -> Selector of the topLeft input hidden. Ex. '.topLeft'.
		@boxWidth 			: String -> Selector of the boxWidth input hidden. Ex. '.boxWidth'.
		@boxHeight 			: String -> Selector of the boxHeight input hidden. Ex. '.boxHeight'.
	* @ajaxServiceUrl 		: String -> Set the url of the service for save the data of the cropped image.
	* @imageGeneratorPath 	: String -> Set the url for the saving ajax image (temp image).
	* @imgExt 				: Array -> Set the image extensions allowed.
	*/
	
	/* --------------------------------------------------  
		PRIVATE Function _initAjax(params)
		Description : Init the webcropper with Ajax save.
			@PARAMS see line 56
	--------------------------------------------------  */
	
	function _initAjax(params) {
		_configure(params);
	}
	
	/* --------------------------------------------------  
		PRIVATE Function _initForm(params)
		Description : Init the webcropper with form. You need 6 input type hidden. See line 76 for the selectors needed.
			@PARAMS see line 56
	--------------------------------------------------  */
	
	function _initForm(params){
		_isFormBased = true;
		var f = _copperOptions.inFormParams;
			f.imgPath = $(f.imgPath);
			f.imgWidth = $(f.imgWidth);
			f.imgHeight = $(f.imgHeight);
			f.topLeft = $(f.topLeft);
			f.boxWidth = $(f.boxWidth);
			f.boxHeight = $(f.boxHeight);
		_configure(params);
	}
	
	/* --------------------------------------------------  
		PRIVATE Function _configure()
		Description : Configure the webcropper with the params passed.
			@PARAMS see line 56
	--------------------------------------------------  */
	
	function _configure(params){
		_parseParams(params);
		$image = $(_copperOptions.img);
		$container = $(_copperOptions.imgContainer);
			
		_setInteractivity();
		_updateHiddenInput();
		
		if(_copperOptions.filePicker && _copperOptions.filePicker != ''){
			_ajaxImageUploader();
		}
		
		_cropperExist = true;
	}
	
	/* --------------------------------------------------  
		PRIVATE Function _ajaxImageUploader()
		Description : This method is for image upload with Ajax. It copy you're input/a and place a input file above. The params for you're input/a is «filePicker».
			@PARAMS see line 56
	--------------------------------------------------  */
	
	function _ajaxImageUploader() {
		
		_uploader = new AjaxUpload($(_copperOptions.filePicker), {
	        action: _copperOptions.imageGeneratorPath,
	        name: 'image',
			className: 'ImageProfile',
	        onSubmit: function (file, extension) {
				delete onSubmit;
	        },
	        onComplete: function (file, response) {
                try{
                    var myObject = JSON.parse(response);
                    if(myObject.Path != undefined){
                        _resetImage();
                        _imagePath = myObject.Path;
                        $image.attr('src', _imagePath);
                        delete onComplete;
                    }else{
                        alert(_copperOptions.maxSizeError);
                    }
                }catch(e){
                    alert(_copperOptions.maxSizeError);
                }
	        }
	    });
	
	}
	
	/* --------------------------------------------------  
		PRIVATE Function _setInteractivity()
		Description : Like it say, set the interactivity of the webcropper. Button/Drag ect... Don't watch this method.
	--------------------------------------------------  */
	
	function _setInteractivity() {
		
		if(_copperOptions.rotation) {
			_copperOptions.rotation = $(_copperOptions.rotation);
			_copperOptions.rotation.bind('click', _rotate)
		}
		
		if(_copperOptions.zoomIn != undefined && _copperOptions.zoomOut != undefined){
			
			_copperOptions.zoomIn = $(_copperOptions.zoomIn);
			_copperOptions.zoomOut = $(_copperOptions.zoomOut);
			
			if(_copperOptions.mouseDownZoom){
				
				var interval = 0;
				
				_copperOptions.zoomIn
					.bind('mousedown', function () { interval = setInterval(_zoomIn, _copperOptions.zoomingInterval)  })
					.bind('mouseup mouseleave', function () { clearInterval(interval); })
				;

				_copperOptions.zoomOut
					.bind('mousedown', function () { interval = setInterval(_zoomOut, _copperOptions.zoomingInterval) })
					.bind('mouseup mouseleave', function () { clearInterval(interval); })
				;
			}
		
			_copperOptions.zoomIn.bind('click', _zoomIn);
			_copperOptions.zoomOut.bind('click', _zoomOut);
		}
		
       
		$image.draggable({
			disabled:false, 
			stop: _moveOrZoomActionDone
		});
	}
	
	/* --------------------------------------------------  
		PRIVATE Function _save()
		Description : If you have set a Ajax webcropper, it will call the service with all the required value. If you have set a form webcropper, it will only refresh the value of the hidden input.
		@success : Function -> Succes callback
		@failed : Function -> Failed callback
	--------------------------------------------------  */
	
	function _save(success, failed) {
		if(_isFormBased){
			_updateHiddenInput();
		}else{
			_sendAjaxInfos(success, failed);
		}
	}
	
	/* --------------------------------------------------  
		PRIVATE Function _clear()
		Description : This methode is for clear the current image cropper and all it data.
	--------------------------------------------------  */
	
	function _clear() {
		// TODO
	}
	
	/* --------------------------------------------------  
		PRIVATE Function _replaceImage()
		Description : Replace the current image with this one.
			@src -> The link to the image.
	--------------------------------------------------  */
	
	function _replaceImage(src) {
		_imagePath = src;
		$image
			.attr('src', _imagePath)
			.bind('load', function(){_moveOrZoomActionDone();});
	}
	
	/* --------------------------------------------------  
		PRIVATE Function _clearTemp()
		Description : Clear the current temp image on server with service. 
	--------------------------------------------------  */
	
	function _clearTemp() {
		
		$.ajax({
			type: "GET",
			url: _ajaxServiceUrl + '?action=delete&tip=' + _imagePath,
			dataType: "json",
			success: function (data) {
                if (data != null) {
				    if (data) {
					
				    } else {
					
				    }
                }
			}
		});
		
	}
	
	/* --------------------------------------------------  
		PRIVATE Function _parseParams(params)
		Description : Parse the param and override «_copperOptions» param's .
			@PARAMS see line 56
	--------------------------------------------------  */
	
	function _parseParams(params) {
		for(var i in _copperOptions){
			if(_copperOptions[i] != undefined){
				if(params[i] != undefined){
					_copperOptions[i] = params[i];
				}
			}
		}
	}
	
	/* --------------------------------------------------  
		PRIVATE Function _zoomIn()
		Description : Called by the zoomIn'btn. Zoom in the image with the «zoomRatio».
	--------------------------------------------------  */
	
	function _zoomIn() {
		_zoomSelector(_copperOptions.zoomRatio);
	}
	
	/* --------------------------------------------------  
		PRIVATE Function _zoomOut()
		Description : Called by the zoomOut'btn. Zoom out the image with the «zoomRatio».
	--------------------------------------------------  */
	
	function _zoomOut() {
		_zoomSelector(-_copperOptions.zoomRatio);
	}
	
	/* --------------------------------------------------  
		PRIVATE Function _zoomSelector(factor)
		Description : Select the zoom option. Center or top left.
			@factor : The zoom factor. Bigger than will be bigger.....
	--------------------------------------------------  */
	
	function _zoomSelector(factor) {
		if(_copperOptions.zoomByCenter){
			_zoomByCenter(factor);
		}
		else{
			var s = _resizeWithRatio($image.get(0), $image.width() + factor, $image.height() + factor);
			_zoom(s.w, s.h, $image.position().top, $image.position().left);
		}
	}
	
	/* --------------------------------------------------  
		PRIVATE Function _rotate(factor)
		Description : TODO-
			@PARAMS
	--------------------------------------------------  */
	
	function _rotate(factor) {
		// standby for webservice
	}
	
	/* --------------------------------------------------  
		PRIVATE Function _zoomByCenter(pSize)
		Description : Will zoom the image by the center of the container.
			@factor : The zoom factor. Bigger than will be bigger.....
	--------------------------------------------------  */
	
	function _zoomByCenter(factor) {
		
		var s = _resizeWithRatio($image.get(0), $image.width() + factor, $image.height() + factor),
			iW = $image.width(),
			iH = $image.height(),
			iL = $image.position().left,
			iT = $image.position().top,
			contCenterX = $container.width() * .5,
			contCenterY = $container.height() * .5,
			imgCenterX = (iL + iW * .5),
			imgCenterY = (iT + iH * .5),
			imgRelCenterX = contCenterX - iL,
			imgRelCenterY = contCenterY - iT,
			k = (s.w * imgRelCenterX) / iW,
			top = (s.h * imgRelCenterY) / iH,
			l = -k + contCenterX,
			t = -top + contCenterY
		;
		
		if(factor < 0){
			if(s.w < 50 || s.h < 50) 
				return;
			
		}
		else{
			if(s.w > 6000 || s.h > 6000) 
				return;
		}
		
		_zoom(s.w, s.h, t, l);
	}
	
	/* --------------------------------------------------  
		PRIVATE Function _zoom(w, h, t, l)
		Description : zoom the current image with the parameters.
			@w -> width
			@h -> height
			@t -> top
			@l -> left
	--------------------------------------------------  */
	
	function _zoom(w, h, t, l) {
		
		if(w < _copperOptions.minWidth || h < _copperOptions.minHeight) { return };
		if(w > _copperOptions.maxWidth || h > _copperOptions.maxHeight) { return };
		
		if(_copperOptions.zoomAnimated){
			$image.stop().animate({ width: w, height: h, top: t, left: l }, _copperOptions.zoomAnimationTime, _copperOptions.zoomEasing, _moveOrZoomActionDone);
		}else{
			$image
				.css('width', w)
				.css('height', h)
				.css('top', t)
				.css('left', l);
				
			_moveOrZoomActionDone();
		}
	}
	
	/* --------------------------------------------------  
		PRIVATE Function _resetImage()
		Description : Reset the style of the image.
	--------------------------------------------------  */
	
	function _resetImage() {
		$image.removeAttr('style');
	}
	
	/* --------------------------------------------------  
		PRIVATE Function _moveOrZoomActionDone()
		Description : When a move or zoom action is done, call the good methode with the webcropper type.
	--------------------------------------------------  */
	
	function _moveOrZoomActionDone() {
		if(_isFormBased) {
			_updateHiddenInput();
		}else{
			
		}
	}
	
	/* --------------------------------------------------  
		PRIVATE Function _resizeWithRatio(img, maxw , maxh)
		Description : Return a object with the new w and h respecting the ratio. -
			@img -> the image
			@maxw -> the maximum width
			@maxh -> the maximum height
	--------------------------------------------------  */
	
	function _resizeWithRatio(img, maxw , maxh) {
		if (img.width > img.height) {
			return { w: maxw, h: maxw / img.width * img.height };
		}
		else {
			return { w: maxh / img.height * img.width, h: maxh };
		}
	}
	
	/* --------------------------------------------------  
		PRIVATE Function _updateHiddenInput()
		Description : Update the hidden input with the value of the image.
	--------------------------------------------------  */
	
	function _updateHiddenInput() {
		clearInterval(_inputUpdateSetInterval);
		_inputUpdateSetInterval = setInterval(function(){
			clearInterval(_inputUpdateSetInterval);
			var f = _copperOptions.inFormParams;
				iLX = $image.position().left.toFixed(2),
				iLY = $image.position().top.toFixed(2),
			$(f.imgPath).val(_imagePath);
			$(f.imgWidth).val(Math.round($image.width()));
			$(f.imgHeight).val(Math.round($image.height()));
			$(f.topLeft).val(Math.round(iLX) + ',' + Math.round(iLY));
			$(f.boxWidth).val(Math.round($container.width()));
			$(f.boxHeight).val(Math.round($container.height()));
			
		}, _inputUpdateInterval)
	}
	
	/* --------------------------------------------------  
		PRIVATE Function _sendAjaxInfos(success, failed)
		Description : Send to the ajaxServiceUrl the value needed for save the image.
		@success : Function -> Succes callback
		@failed : Function -> Failed callback
	--------------------------------------------------  */
	
	function _sendAjaxInfos(success, failed) {
		
		if(_copperOptions.ajaxServiceUrl == '' || _copperOptions.ajaxServiceUrl == undefined){
			_cropperError('You must specified a Ajax service url!');
			return;
		}
		
		var iLX = $image.position().left.toFixed(2),
			iLY = $image.position().top.toFixed(2),
			t = Math.round(iLX) + ',' + Math.round(iLY),
			ox = t.substring(0, t.indexOf(',')),
			oy = t.substring(t.indexOf(',')+1, t.length);
		
		$.ajax({
			type: "GET",
			url: _copperOptions.ajaxServiceUrl + '?action=cropper' + '&ox=' + ox + '&oy=' + oy  + '&bw=' + Math.round($container.width()) + '&bh=' + Math.round($container.height()) + '&inw=' + Math.round($image.width()) + '&inh=' + Math.round($image.height()) + '&tip=' + _imagePath + '&tpu=' + false,
			dataType: "json",
			success: function (data) {
                if (data != null) {
				    if (data) {
						if(success){
							success();
						}
				    } else {
						if(failed){
							failed();
						}
				    }
                }else{
					if(failed){
						failed();
					}
				}
			}
		});
		
	}
	
	/* --------------------------------------------------  
		PRIVATE Function _cropperError()
		Description : Send a Kafe error.
			@error : Error.
	--------------------------------------------------  */
	
	function _cropperError(error) {
		throw kafe.error(new Error('webcropper-> ' + error));
	}
	
	// ------------------------------------------
	// PUBLIC
	// ------------------------------------------
	
	var WC = {};
	
	/* --------------------------------------------------  
		PUBLIC Function WC.initAjax(params)
		Description : init the webcropper with ajax
			@params see line 56.
	--------------------------------------------------  */
	
	WC.initAjax = function(params){
		_initAjax(params);
	}
	
	/* --------------------------------------------------  
		PUBLIC Function WC.initForm(params)
		Description : Init the webcropper with form. You need 6 input type hidden. See line 76 for the selectors needed.
			@params see line 56.
	--------------------------------------------------  */
	
	WC.initForm = function(params){
		_initForm(params);
	}
	
	/* --------------------------------------------------  
		PUBLIC Function WC.save()
		Description :  If you have set a Ajax webcropper, it will call the service with all the required value. If you have set a form webcropper, it will only refresh the value of the hidden input.
			@success : Function -> Succes callback
			@failed : Function -> Failed callback
	--------------------------------------------------  */
	
	WC.save = function(success, failed){
		if(!_cropperExist){ _cropperError('You must create a webcropper first! Method save()'); return;}
		_save(success, failed);
	}
	
	/* --------------------------------------------------  
		PUBLIC Function WC.clear()
		Description : This methode is for clear the current image cropper and all it data.
	--------------------------------------------------  */
	
	WC.clear = function(){
		if(!_cropperExist){ _cropperError('You must create a webcropper first! Method clear()'); return;}
		_clear();
	}
	
	/* --------------------------------------------------  
		PUBLIC Function WC.clearTemp()
		Description :  Clear the current temp image on server with service. 
	--------------------------------------------------  */
	
	WC.clearTemp = function(){
		if(!_cropperExist){ _cropperError('You must create a webcropper first! Method clearTemp()'); return;}
		_clearTemp();
	}
	
	/* --------------------------------------------------  
		PUBLIC Function WC.replaceImage(src)
		Description :  Replace the current image with the link passed
	--------------------------------------------------  */
	
	WC.replaceImage = function(src){
		if(!_cropperExist){ _cropperError('You must create a webcropper first! Method replaceImage()'); return;}
		_replaceImage(src);
	}
	
	return WC;
	
})(jQuery,kafe)});
//-------------------------------------------
// tequila.tween
//-------------------------------------------
tequila.bonify({name:'tween', version:'0.1', obj:(function($,T,undefined){
	
	var
		_TweenLiteEnabled = null,
		_tweens = []
	;
	
	// ------------------------------------------
	// PUBLIC
	// ------------------------------------------
	
	var tween = {};
	
	// to ()
	// tween a object and return a tequila tween object
	//-------------------------------------------
	tween.to = function(o, p, duration, options) {
		
		var 
			$t = $(o),
			duration = duration || 1,
			options = options || {},
			tTween = _createTweenObject($t, p, duration, options)
		;
		
		if(_TweenLiteEnabled && !options.forceJquery) {
			tTween.isTweenlite = true;
			tTween.tween = TweenLite.to($t, (duration/1000), {css:p, onComplete:tTween.onComplete});
			
		}else {
			tTween.isTweenlite = false;
			tTween.tween = $t.animate(p, (duration), tTween.onComplete);
			
		}
		
		_tweens.push(tTween);
		
		return tTween;
	};
	
	tween.pauseAllTweens = function() {
		for(var t in _tweens) {
			_tweens[t].pause();
		}
	};
	
	tween.resumeAllTweens = function() {
		for(var t in _tweens) {
			_tweens[t].resume();
		}
	};
	
	function _createTweenObject($t, p, duration, options) {
		
		var 
			tTween = {
				target: $t,
				properties: p,
				duration: duration,
				options: options,
				isPaused: false,
				resume: function() {
					if(this.isTweenlite){
						this.tween.resume();
					}else{
						tween.to(this.tween, this.properties, this.duration, {forceJquery:true})
					}
					this.isPaused = false;
					return this;
				}, 
				pause: function() {
					if(this.isTweenlite){
						this.tween.pause();
					}else {
						this.tween.stop();
					}
					this.isPaused = true;
					return this;
				},
				kill: function() {
					if(this.isTweenlite){
						TweenLite.killTweensOf(this.tween);
					}else {
						this.tween.stop();
					}
					
					return this;
				}, 
				onComplete:function() {
					var t = tTween;
					if(t.options.callback){
						t.options.callback();
					}
				}
			}
		;
		
		_tweenliteTest();
		return tTween;
	}
	
	// _tweenliteTest()
	//  check if tweenlite is enable.
	function _tweenliteTest(){
		if(_TweenLiteEnabled == null) {
			if (typeof TweenLite === 'undefined') {
			    _TweenLiteEnabled = false;
			}else{
				_TweenLiteEnabled = true;
			}
		}
		return _TweenLiteEnabled;
	}
	
	return tween;

})(jQuery,tequila)});

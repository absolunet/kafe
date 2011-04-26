/*
              (
                )     (
                 ___...(-------)-....___
             .-""       )    (          ""-.
       .-'``'|-._             )         _.-|
      /  .--.|   `""---...........---""`   |
     /  /    |                             |
     |  |    |                             |
      \  \   |                             |
       `\ `\ |            kafe             |
         `\ `|                             |
         _/ /\                             /
        (__/  \                           /
     _..---""` \                         /`""---.._
  .-'           \                       /          '-.
 :               `-.__             __.-'              :
 :                  ) ""---...---"" (                 :
  '._               `"--...___...--"`              _.'
    \""--..__                              __..--""/
     '._     """----.....______.....----"""     _.'
        `""--..,,_____            _____,,..--""`
                      `"""----"""`
*/

var kafe = (function(w,d,$,undefined){

	// __exists (name)
	// check if module imported
	function __exists(name) {
		try {
			return eval("("+name+" == undefined) ? false : true;");
		} catch(e) {
			return false;
		}
	};

	// native extensions
	var __Native = {};
	 


	//-------------------------------------------
	// CORE
	//-------------------------------------------
	var core = {};

	//-------------------------------------------
	// FN
	//-------------------------------------------
	core.fn  = (function(){
		var fn = {};
		
		// setReadOnlyProperties (object, properties)
		// force readonly properties if possible
		//-------------------------------------------
		fn.setReadOnlyProperties = function (o,p) {
			eval("var o=arguments[0], p=arguments[1];");
			for (var i in p) {
				if (o.__defineGetter__) {
					eval("o.__defineGetter__('"+i+"', function(){ return p['"+i+"']; });");
				} else if (Object.defineProperty) {
					eval("Object.defineProperty(o, '"+i+"', {get:function(){ return p['"+i+"']; }});");
				} else {
					o[i] = p[i];
				}
			}
		};
		
		// lang (dict,lang)
		// get a existing lang
		//-------------------------------------------
		fn.lang = function(dict,lang) {
			lang = (lang) ? lang : core.env('lang');
			return (dict[lang]) ? lang : 'en';
		};
	
		return fn;
	})();



	
	// identification
	var __i = {};
	core.fn.setReadOnlyProperties(__i = {}, {
		name:    'kafe',
		version: '1.0',
		pare_a:  'absolunet.com'
	});
	core.fn.setReadOnlyProperties(core,{kafe: __i.version});
	core.fn.setReadOnlyProperties(core,{identify:__i});
	core.fn.setReadOnlyProperties(core,{version:{}});

	// bonify (name/version/object)
	// add module to core
	//-------------------------------------------
	core.bonify = function(options) {
		
		// if not already extended
		if (!__exists(options.name)) {

			var name = 'this.'+options.name; 

			// if has Native methods
			if (options.obj.Native != undefined) {
				var 
					type           = options.name.split('.')[0].replace(/^\w/, function($0) { return $0.toUpperCase(); }),
					isNativeObject = (':Array:Boolean:Date:Number:String:RegExp:'.search(new RegExp('\:'+type+'\:')) != -1) ? true : false,
					isNativeModule = (':Math:Window:Navigator:Screen:History:Location:Document:'.search(new RegExp('\:'+type+'\:')) != -1) ? true : false						
				;
				
				// if object
				if (isNativeObject) {

					var sub = options.name.split('.');
					
					// if subclass
					if (sub.length > 1) {
						sub.shift();
						sub = sub.join('_') + '_';
						
					// if not
					} else {
						sub = '';
						__Native[type] = function(o) { this.get = function(){return o;}; };
						w[type].prototype.kafe = function() { return new __Native[type](this); };
					}

					// push methods
					for (var i in options.obj.Native) {
						__Native[type].prototype[sub+i] = options.obj.Native[i];
					}

				
				
				// if module
				} else if (isNativeModule) {
					var sub = options.name.split('.');
					
					// if subclass
					if (sub.length > 1) {
						sub.shift();
						sub = sub.join('_') + '_';
					} else {
						sub = '';
						w[type].kafe = {};
					}
					
					// push methods
					for (var i in options.obj.Native) {
						w[type].kafe[sub+i] = obj.Native[i];
					}
				}

				// delete local reference
				delete arguments[0].obj.Native;
			}

			// add version
			var v = {};
			v[options.name] = options.version;
			core.fn.setReadOnlyProperties(core.version,v);
			
			// extend
			eval(name+' = arguments[0].obj;');
			
		// throw error
		} else {
			throw this.error(new Error(__i.name+'.'+options.name+' already exists'));
		}
	};
	
	// plug (name/version/object)
	// add a plugin
	//-------------------------------------------
	core.plug = function(options) {
		options.name = 'plugin.'+options.name;
		this.bonify(options);
	};

	// extend (name/version/object)
	// add an external plugin extension
	//-------------------------------------------
	core.extend = function(options) {
		options.name = 'ext.'+options.name;
		this.bonify(options);
	};

	// required (name_or_url)
	// check if required module is included
	//-------------------------------------------
	core.required = function(name) {
		if (name.substr(0,2) == '//') {

			var found = false;
			$('script').each(function(){
				if (new RegExp(name).test(this.src)) {
					found = true;
					return false;
				}
			});

			if (!found) {
				throw this.error(new Error('\'' + name+'\' is required'));
			}

		} else if (!__exists(name)) {
			throw this.error(new Error(name+' is required'));
		}
	};

	// log (text)
	// traces
	//-------------------------------------------
	core.log = function(t) {
		try {
			var node = d.getElementById('LOG');
			var hr = d.createElement('hr');
			var code = d.createElement('code');
			code.appendChild(d.createTextNode(t))
			node.appendChild(code);
			node.appendChild(hr);
		} catch (e) {
			try {
				console.log(t);
			} catch (e) {
				alert(t);
			}
		}
	};

	// error (error)
	// throw errors - kafe.error(new Error('barf'));
	//-------------------------------------------
	core.error = function(e) {
		var msg = ((e.description) ? e.description : e.message);
		e.description = e.message = '<'+__i.name+':erè> : '+ ((msg) ? msg : 'anonim');
		return ($.browser.msie && parseInt($.browser.version) == 8) ? new Error(e) : e;
	};





	//-------------------------------------------
	// ENV
	//-------------------------------------------
	core.env = (function(){

		// base vals
		var __data = {
			culture: '',
			lang:    '',
			page:    '',
			tmpl:    '',
			dtc:     {}
		};

		// ready
		$(function(){
			var 
				$html = $('html'),
				$body = $('body')
			;

			// parse doc
			__data.culture = $html.attr('id');
			__data.lang    = $html.attr('lang').toLowerCase();
			__data.page    = $body.attr('id');
			__data.tmpl    = $body.attr('class').split(' ')[0];

			// parse detections
			var dtc = $html.attr('class').split(' ');
			if (dtc.length) {
				for (var i in dtc) {
					if (dtc[i].substring(0,4) == 'dtc-') {
						__data.dtc[dtc[i].substring(4).replace(/-/g,'_')] = true;
					} 
				}
			}
		});

		// public method (name, [value])
		//-------------------------------------------
		var env = function(name, value) {
			var updatable = ':mobile-orientation:';

			// get
			if (value == undefined) {
				return __data[name];

			// already set 
			} else if (__data[name] != undefined && updatable.search(new RegExp('\:'+name+'\:')) == -1) {
				throw this.error(new Error(__i.name+'.env > property \''+name+'\' already defined'));

			// set
			} else {
				__data[name] = value;
			}
		};

		return env;
	})();

	// namespace for plugins and extensions
	core.plugin = {};
	core.ext    = {};

	return core;

})(window,document,jQuery);





//-------------------------------------------
// patch ie8 and less for HTML5 
//-------------------------------------------
(function(d,$){
	var __patchHTML5 = ($.browser.msie && parseInt($.browser.version) < 9);

	if (__patchHTML5) {
		var html5 = "address|article|aside|audio|canvas|command|datalist|details|dialog|figure|figcaption|footer|header|hgroup|keygen|mark|meter|menu|nav|progress|ruby|section|time|video".split('|');
		for (var i=0; i<html5.length; ++i){
			d.createElement(html5[i]);
		}
	}

	$.fn.appendHTML5 = function(str) {
		if (__patchHTML5) {
			var d, r;
			function innerShiv (h, u) {
				if (!d) {
					d = d.createElement('div');
					r = d.createDocumentFragment();
					/*@cc_on d.style.display = 'none';@*/
				}

				var e = d.cloneNode(true);
				/*@cc_on d.body.appendChild(e);@*/
				e.innerHTML = h.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
				/*@cc_on d.body.removeChild(e);@*/

				if (u === false) return e.childNodes;

				var f = r.cloneNode(true), i = e.childNodes.length;
				while (i--) f.appendChild(e.firstChild);

				return f;
			}
			str = innerShiv(str);
	    }
		$(this[0]).append(str);
	    return this;
	}
})(document,jQuery);	

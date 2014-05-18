if (typeof Begun !== "object") {
	var Begun = {};
}
if (!Begun.Utils) {
	Begun.$ = function (id, context) {
		return (context || document).getElementById(id);
	};

	Begun.$$ = function (tn, context, index) {
		var els = (context || document).getElementsByTagName(tn);

		if (null == index || isNaN(index)) {
			return els;
		} else {
			return els[index];
		}
	};

	Begun.extend = function(destination, source, isRecursively) {
		if (typeof destination !== "object") {
			destination = {};
		}
		for (var property in source) {
			if (!isRecursively || typeof source[property] !== "object") {
				destination[property] = source[property];
			} else {
				destination[property] = Begun.extend(destination[property], source[property]);
			}
		}
		return destination;
	};

	Begun.Browser = new function() {
		var _ua = navigator.userAgent;
		this.IE = !!(window.attachEvent && _ua.indexOf('Opera') === -1);
		this.Opera =  _ua.indexOf('Opera') > -1;
		this.WebKit = _ua.indexOf('AppleWebKit/') > -1;
		this.Gecko =  _ua.indexOf('Gecko') > -1 && _ua.indexOf('KHTML') === -1;
		this.Android =  _ua.indexOf('Android') > -1;
		this.Linux = _ua.indexOf('Linux') > -1;
		this.TabletPC = _ua.indexOf('iPad') > -1;
		var ver = null;
		this.version = function() {
			if (ver !== null){
				return ver;
			}
			if (typeof detect !== "undefined") {
				ver = detect();
				return ver;
			} else {
				return;
			}
		};
		var detect;
		function check(re){
			var versionParsed = re.exec(_ua);
			if (versionParsed && versionParsed.length && versionParsed.length > 1 && versionParsed[1]) {
				return versionParsed[1];
			}
		}
		if (this.IE){
			detect = function() { return check(/MSIE (\d*.\d*)/gim); };
		} else if (this.Opera) {
			detect = function() { return check(/Opera\/(\d*\.\d*)/gim); };
		} else if (this.WebKit) {
			detect = function() { return check(/AppleWebKit\/(\d*\.\d*)/gim); };
		} else if (this.Gecko) {
			detect = function() { return check(/Firefox\/(\d*\.\d*)/gim); };
		}
		this.more = function(n) {
			return parseFloat(this.version()) > n;
		};
		this.less = function(n) {
			return parseFloat(this.version()) < n;
		};
	}();

	Begun.Utils = new function() {
		var d = document;
		var script_count = 0;
		var swf_count = 0;
		var script_timeout = 5000;
		var getHead = function(obj) {
			var wnd = obj || window;
			var head = Begun.$$('head', wnd.document, 0);
			if (!head){
				head = wnd.document.createElement("head");
				wnd.document.documentElement.insertBefore(head, wnd.document.documentElement.firstChild);
			}
			return head;
		};
		this.REVISION = '$LastChangedRevision$';

		this.includeScript = function (url, type, callback, check_var) {
			/* "append" or "write" */
			type = type || 'write';

			var INC_SCRIPT_PREFIX = 'begun_js_',
				SCRIPT_TYPE = 'text/javascript';

			var w = window,
				inc = 0,
				protocol = Begun.Scripts.getConformProtocol(),
				script = null,
				undefined,
				scriptTimeoutCounter = protocol +
					'//autocontext.begun.ru/blockcounter?pad_id={{pad_id}}&block={{block_id}}&script_timeout=1';

			if (url && Begun.Scripts.isConformProtocol(url, protocol)) {
				if (type == 'write'){
					script_count++;
					var id = INC_SCRIPT_PREFIX + script_count;
					if (check_var){
						w.setTimeout(function(){
							var scripts = Begun.$$('script');
							var s = scripts.length > 0 ? scripts[scripts.length - 1] : null;
							if (s && w[check_var] === undefined){
								s.parentNode.removeChild(s);
								Begun.Utils.includeCounter(
									scriptTimeoutCounter,
									{
										'pad_id': (w.begun_auto_pad || ''),
										'block_id': (w.begun_block_id || '')
									}
								);
							}
						}, script_timeout);
					}
					d.write('<scr'+'ipt type="' + SCRIPT_TYPE + '" src="' + url + '" id="' + id + '"></scr'+'ipt>'); 
					script = Begun.$(id);
				} else if (type == 'append'){
					script = d.createElement('script');

					script.setAttribute('type', SCRIPT_TYPE);
					script.setAttribute('async', true);
					script.setAttribute('src', url);

					var head = getHead();
					head.appendChild(script);
				}
				if (script && typeof callback == 'function'){
					var callback_fired = false;
					script.onload = function(){
						if (!callback_fired){
							callback();
							callback_fired = true;
						}
					};
					script.onreadystatechange = function(){
						if (callback_fired){
							return;
						}
						var check_statement = (Begun.Browser.Opera ? (this.readyState == "complete") : (this.readyState == "complete" || this.readyState == "loaded"));
						if (check_statement){
							callback();
							callback_fired = true;
						}
					};
				}

				return true;
			}

			return false;
		};

		this.includeImage = function (src) {
			if (Begun.Scripts.isConformProtocol(src)) {
				var img = d.createElement('img');
				img.setAttribute('src', src);
				return img;
			}

			return false;
		};

		this.makeFlashesTransparent = function() {
			var i, embeds = Begun.$$('embed');
			for (i = 0; i < embeds.length; i++) {
				var new_embed, embed = embeds[i];
				if (embed.outerHTML) {
					var html = embed.outerHTML;
					if (html.match(/wmode\s*=\s*('|")[a-zA-Z]+('|")/i)) {
						new_embed = html.replace(/wmode\s*=\s*('|")window('|")/i, "wmode='opaque'");
					} else {
						new_embed = html.replace(/<embed\s/i, "<embed wmode='opaque' ");
					}
					embed.insertAdjacentHTML('beforeBegin', new_embed);
					embed.parentNode.removeChild(embed);
				} else {
					new_embed = embed.cloneNode(true);
					if (!new_embed.getAttribute('wmode') || new_embed.getAttribute('wmode').toLowerCase() == 'window') {
						new_embed.setAttribute('wmode', 'opaque');
					}
					embed.parentNode.replaceChild(new_embed,embed);
				}
			}
			var objects = Begun.$$('object');
			for (i=0; i<objects.length; i++) {
				var new_object, object = objects[i];
				if (object.outerHTML) {
					var html = object.outerHTML;
					if (html.match(/<param\s+name\s*=\s*('|")wmode('|")\s+value\s*=\s*('|")[a-zA-Z]+('|")\s*\/?\>/i)) {
						new_object = html.replace(/<param\s+name\s*=\s*('|")wmode('|")\s+value\s*=\s*('|")window('|")\s*\/?\>/i, "<param name='wmode' value='opaque' />");
					} else {
						new_object = html.replace(/<\/object\>/i, "<param name='wmode' value='opaque' />\n</object>");
					}
					var children = object.childNodes;
					for (var j=0; j < children.length; j++) {
						if (children[j].tagName && children[j].getAttribute('name') && children[j].getAttribute('name').match(/flashvars/i)) {
							new_object = new_object.replace(/<param\s+name\s*=\s*('|")flashvars('|")\s+value\s*=\s*('|")[^'"]*('|")\s*\/?\>/i, "<param name='flashvars' value='"+children[j].getAttribute('value')+"' />");
						}
					}
					object.insertAdjacentHTML('beforeBegin', new_object);
					object.parentNode.removeChild(object);
				}
			}
		};
		this.evalScript = function(code){
			try {
				eval(code);
			} catch(e) {}
		};

		if (window.JSON && window.JSON.parse) {
			this.parseJSON = function (data) {
				var obj;

				try {
					obj = JSON.parse(data);
				} catch (e) {}

				return new Object(obj);
			};
		} else {
			this.parseJSON = function (data) {
				var obj;

				data = data.replace(/[\n\r\t]+/g, '');

				try {
					obj = (new Function('return ' + data)());
				} catch (e) {}

				return new Object(obj);
			};
		}

		this.checkFlash = function() {
			for (var i=3;i<10;i++){
				var string = 'ShockwaveFlash.ShockwaveFlash.'+i;
				try{
					var obj = new ActiveXObject(string);
					if(obj) {
						return true;
					}
				} catch (e) {}
			}
			if(navigator.mimeTypes && navigator.mimeTypes.length && navigator.mimeTypes['application/x-shockwave-flash'] && navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin) {
				return true;
			} else if(navigator.plugins["Shockwave Flash"]) {
				return true;
			} else {
				return false;
			}
		};
		this.reformSWFData = function(url){
			var params = url.split(/\?/);
			if(params[1] && params[1].match(/uuid/)) {
				var data = params[1].split(/&/);
				var reformed_params = '';
				for(var i=0, l=data.length; i<l; i++) {
					var tmp_data = data[i].split(/=/);
					if(tmp_data[1]) {
						reformed_params += encodeURIComponent(tmp_data[0]) + ':' + encodeURIComponent(tmp_data[1]);
						if(i != l-1) {
							reformed_params += ',';
						}
					}
				}
				var postback_url = params[0].replace('.swf', '.xml');
				url = params[0] + '?sync_params=' + reformed_params + '&postback_url=' + encodeURIComponent(postback_url);
			}
			return url;
		};

		this.includeSWF = function (url){
			var include = Begun.Scripts.isConformProtocol(url);

			if (include) {
				url = this.reformSWFData(url);
				var INC_SWF_PREFIX = 'begun_swf_';
				swf_count++;
				var swf_wrapper = d.createElement('div');
				swf_wrapper.style.visability = 'hidden';
				swf_wrapper.style.top = '-1000px';
				swf_wrapper.style.left = '-1000px';
				swf_wrapper.innerHTML =
					'<object id="' + INC_SWF_PREFIX + swf_count + '" type="application/x-shockwave-flash" data="' + url + '" width="1" height="1">' + 
						'<param name="movie" value="' + url + '" />' + 
					'</object>';
				var body = Begun.$$('body', null, 0);
				if (body) {
					body.appendChild(swf_wrapper);
				}
			}

			return include;
		};

		this.includeStyle = function(css_text, type, id, wnd){
			wnd = wnd || window;
			type = type || 'write'; // append or write
			var DEFUALT_STYLE_ID = 'begun-default-css';
			var style;
			id = id || DEFUALT_STYLE_ID;
			if (css_text){
				if (type == 'write'){
					wnd.document.write('<style type="text/css" id="' + id + '">' + css_text + '</style>');
				} else if (type == 'append'){
					// IE
					if (wnd.document.createStyleSheet){
						style = null;
						try{
							style = wnd.document.createStyleSheet();
							style.cssText += css_text;
							if (id) {
								style.title = id;
							}
						}catch(e){
							for (var i = wnd.document.styleSheets.length - 1; i >= 0; i--){
								try{
									style = wnd.document.styleSheets[i];
									style.cssText += css_text;
									break; // access granted? get outta here!
								}catch(k){
									style = null;
								}
							}
						}
					} else {
						if (Begun.$(id)) {
							// For Google Chrome 4 (and earlier versions) (#5385). With GC 5 beta all works fine
							if (Begun.Browser.WebKit && Begun.Browser.version() < 533) {
								Begun.$(id).appendChild(document.createTextNode(css_text));
							} else {
								Begun.$(id).innerHTML = css_text;
							}
						} else {
							style = wnd.document.createElement("style");
							style.setAttribute("type", "text/css");
							style.id = id;
							style.appendChild(wnd.document.createTextNode(css_text));
							getHead(wnd).appendChild(style);
						}
					}
				}
			}
		};
		this.includeCSSFile = function(url) {
			if (Begun.Scripts.isConformProtocol(url)) {
				var style = d.createElement('link');
				style.setAttribute('type', 'text/css');
				style.setAttribute('rel', 'stylesheet');
				style.setAttribute('href', url);
				getHead().appendChild(style);
				return true;
			}

			return false;
		};

		this.includeCounter = function(src, obj) {
			if (src && obj) {
				src = (new Begun.Template(src)).evaluate(obj);

				if (src.length) {
					return this.includeImage(src);
				}
			}

			return false;
		};

		this.toQuery = function (params) {
			var toTail = {
				real_refer: true,
				ref: true
			}, head = [], tail = [];

			for (var key in params) {
				if (this.hop(params, key)) {
					var value = params[key],
						pair = {};

					pair[key] = value;

					if (this.hop(toTail, key) && !!value) {
						tail.push(pair);
					} else {
						head.push(pair);
					}
				}
			}

			var query = head.concat(tail);

			return this.serialize(query);
		};

		this.toJSON = function(obj){
			switch (typeof obj) {
				case 'object':
					if (obj) {
						var list = [];
						if (obj instanceof Array) {
						for (var i=0;i < obj.length;i++) {
							list.push(this.toJSON(obj[i]));
						}
						return '[' + list.join(',') + ']';
						} else {
							for (var prop in obj) {
								list.push('"' + prop + '":' + this.toJSON(obj[prop]));
							}
							return '{' + list.join(',') + '}';
						}
					} else {
						return 'null';
					}
				case 'string':
					return '"' + obj.replace(/(["'])/g, '\\$1') + '"';
				case 'number':
					return obj;
				case 'boolean':
					return new String(obj);
			}
		};

		this.safeEncode = (function () {
			var urlencoding = /(%[ABCDEF0-9]{2})+/gi;

			var tryDecode = function (s) {
				var decoded = s;

				try {
					decoded = decodeURIComponent(s);
				} catch (e) {}

				return decoded;
			};

			return function (str) {
				var decoded = String(str).replace(
					urlencoding, tryDecode
				);

				return encodeURIComponent(decoded);
			};
		})();

		this.hop = function (obj, prop) {
			return obj.hasOwnProperty && obj.hasOwnProperty(prop);
		};

		this.serialize = function (obj) {
			var NAME_DELIM = '=',
				PAIR_DELIM = '&',
				LIST_DELIM = ',';

			var key, value, pair, str = [];

			for (key in obj) {
				if (this.hop(obj, key)) {
					value = obj[key];
					pair = null;

					if (null != value) {
						if (this.isPrimitivesArray(value)) {
							value = value.join(LIST_DELIM);
						}

						if ('object' === typeof value) {
							/**
							 * If the value is an object,
							 * it's key is discarded.
							 */
							pair = this.serialize(value);
						} else if ('' !== value) {
							pair = [
								this.safeEncode(key),
								this.safeEncode(value)
							].join(NAME_DELIM);
						}
					}

					if (null != pair) {
						str.push(pair);
					}
				}
			}

			return str.length ? str.join(PAIR_DELIM) : null;
		};

		this.isPrimitivesArray = function (obj) {
			if (obj instanceof Array) {
				var Primitives = {
					'string': true,
					'number': true,
					'boolean': true
				};

				for (var i = 0, len = obj.length; i < len; i++) {
					var node = obj[i];

					if (!(null == node || typeof node in Primitives)) {
						return false;
					}
				}

				return true;
			}

			return false;
		};

		this.unescapeTruncateDomain = function (domain, shortLength) {
			shortLength = shortLength || 13;

			domain = this.unescapeHTML(domain);

			if (domain.length > 2 * shortLength + 3) {
				domain = [
					domain.substring(0, shortLength),
					domain.slice(-shortLength)
				].join('&hellip;');
			}

			return domain;
		};

		this.forEach = function (obj, callback, context) {
			if (obj) {
				var i = 0,
					l = obj.length,
					ret;

				if ('number' === typeof l && i in obj) {
					for (; i < l; i++) {
						ret = callback.call(context, obj[i], i, obj);
						if (false === ret) break;
					}
				}
				else {
					for (i in obj) {
						if (obj.hasOwnProperty(i)) {
							ret = callback.call(context, obj[i], i, obj);
							if (false === ret) break;
						}
					}
				}
			}
		};

		this.isFunction = function (obj) {
			return ('function' === typeof obj);
		};

		this.inArray = this.in_array = (function (_this) {
			var isValue = function (value) {
				return (this.value === value);
			};

			var some;

			if (_this.isFunction(Array.prototype.some)) {
				some = function (arr, callback, context) {
					return arr.some(callback, context);
				};
			} else {
				some = function (arr, callback, context) {
					for (var i = 0, l = arr.length; i < l; i++) {
						if (callback.call(
							context, arr[i], i, arr
						)) {
							return true;
						}
					}

					return false;
				};
			}

			return function (arr, check, context) {
				if (arr) {
					var callback;

					if (this.isFunction(check)) {
						callback = check;
					} else {
						callback = isValue;
						context = { value: check };
					}

					return some(arr, callback, context);
				}
			};
		}(this));

		this.inList = function(string, value){
			var arr = string && string.toLowerCase().split(',');
			return !!Begun.Utils.inArray(
				arr, value.toLowerCase()
			);
		};

		this.countWindowSize = function(context) {
			var win = context || window,
                doc = win.document,
                w = 0, h = 0;
			if( typeof( win.innerWidth ) == 'number' ) {
				w = win.innerWidth;
				h = win.innerHeight;
			} else if( doc.documentElement && ( doc.documentElement.clientWidth || doc.documentElement.clientHeight ) ) {
				w = doc.documentElement.clientWidth;
				h = doc.documentElement.clientHeight;
			} else if( doc.body && ( doc.body.clientWidth || doc.body.clientHeight ) ) {
				w = doc.body.clientWidth;
				h = doc.body.clientHeight;
			}
			var obj = {
				width: w,
				height: h
			};
			return obj;
		};
		this.getScrollXY = function (context) {
			var win = context || window,
                doc = win.document,
                x = 0, y = 0;
			if( typeof( win.pageYOffset ) == 'number' ) {
				y = win.pageYOffset;
				x = win.pageXOffset;
			} else if( doc.body && ( doc.body.scrollLeft || doc.body.scrollTop ) ) {
				y = doc.body.scrollTop;
				x = doc.body.scrollLeft;
			} else if( doc.documentElement && ( doc.documentElement.scrollLeft || doc.documentElement.scrollTop ) ) {
				y = doc.documentElement.scrollTop;
				x = doc.documentElement.scrollLeft;
			}
			var obj = {
				x: x,
				y: y
			};
			return obj;
		};

		this.findPos = function (el) {
			var left = 0, top = 0;

			while (el) {
				left += el.offsetLeft;
				top += el.offsetTop;
				el = el.offsetParent;
			}

			return {
				top: top,
				left: left
			};
		};

		this.addEvent = function (obj, name, func) {
			if (obj.addEventListener) {
				obj.addEventListener(name, func, false);
			} else if (obj.attachEvent) {
				obj.attachEvent('on' + name, func);
			}
		};

		this.hasClassName = function (element, className) {
			return (' ' + element.className + ' ').indexOf(' ' + className + ' ') !== -1;
		};

		this.addClassName = function (element, className) {
			if (!this.hasClassName(element, className)) {
				var cl = element.className
				element.className = cl ? cl + ' ' + className : className;
			}
			return element;
		};

		this.removeClassName = function (element, className) {
			var classes = element.className.split(' ');
			for (var i = classes.length - 1; i >= 0; i--) {
				if (classes[i] === className) {
					classes.splice(i, 1);
				}
			}
			element.className = classes.join(' ');
			return element;
		};

		this.toggleClassName = function (element, className, toggle) {
			if (toggle) {
				this.addClassName(element, className);
			} else {
				this.removeClassName(element, className);
			}
			return element;
		};

		this.toCamelCase = function(s){
			for(var exp=/-([a-z])/; exp.test(s); s=s.replace(exp,RegExp.$1.toUpperCase())) {}
			return s;
		};
		this.getStyle = function(el, a) {
			if (!el) {
				return;
			}
			el = el || Begun.$(el); 
			var v = null;
			if(d.defaultView && d.defaultView.getComputedStyle){
				var cs = d.defaultView.getComputedStyle(el,null);
				if(cs && cs.getPropertyValue) {
					v = cs.getPropertyValue(a);
				}
			}
			if(!v && el && el.currentStyle) {
				v = el.currentStyle[this.toCamelCase(a)];
			}
			return v;
		};
		this.setStyle = function(el, property, value) {
			if (el.style.setProperty) {
				el.style.setProperty(property, value, "important");
			} else {
				el.runtimeStyle.setAttribute(property, value);
			}
		};
		this.getElementsByClassName = function(oElm, strTagName, strClassName){
			var arrElements = (strTagName == "*" && oElm.all)? oElm.all : Begun.$$(strTagName, oElm);
			var arrReturnElements = new Array();
			strClassName = strClassName.replace(/\-/g, "\\-");
			var oRegExp = new RegExp("(^|\\s)" + strClassName + "(\\s|$)");
			var oElement;
			for (var i=0; i<arrElements.length; i++) {
				oElement = arrElements[i];     
				if (oRegExp.test(oElement.className)){
					arrReturnElements.push(oElement);
				}   
			}
			return (arrReturnElements);
		};

		this.unescapeHTML = function (txt) {
			var div = document.createElement('DIV');
			div.innerHTML = txt.replace(/<\/?[^>]+>/gi, '');
			txt = div.childNodes[0] ? div.childNodes[0].nodeValue : '';
			div = null;
			return txt;
		};

		this.createWaiter = function (fn, ctx, undefined) {
			var len = fn.length,
				args = new Array(len);

			return function () {
				var allDone = true,
					i, passedArg;

				for (i = 0; i < len; i++) {
					passedArg = arguments[i];

					if (undefined !== passedArg) {
						args[i] = passedArg;
					}

					if (undefined === args[i]) {
						allDone = false;
					}
				}

				if (allDone) {
					fn.apply(ctx, args);
				}
			};
		};

		this.trim = function(str) {
			if (typeof str.trim !== 'undefined') {
				return str.trim();
			}
			return str.replace(/^\s+/, '').replace(/\s+$/, '');
		};
		this.getPageParam = function(name, page_url) {
			var location_search = page_url || window.location.search;
			var params = location_search.substring(location_search.indexOf('?') + 1).split("&");
			var variable = "";
			var params_items = [];
			for (var i = 0; i < params.length; i++){
				params_items = params[i].split("=");
				if (params_items[0] == name){
					params_items.shift();
					variable = params_items.join('=')
					return variable;
				}
			}
			return "";
		};

		this.repeat = function (fn, delay) {
			(function repeat() {
				fn() || setTimeout(repeat, delay || 0);
			})();
		};

		this.getRandomId = function () {
			return Math.random().toString(32).substring(2);
		};

		this.animate = (function (globals) {
			var requestFrame = globals.requestAnimationFrame ||
				globals.mozRequestAnimationFrame ||
				globals.webkitRequestAnimationFrame ||
				(function (delay) {
					return function (callback) {
						setTimeout(function () {
							callback((new Date).getTime());
						}, delay);
					}
				}(1000 / 60));

			/* Formulae by Robert Penner, http://robertpenner.com/easing/ */
			var easings = {
				easeInQuad: function (t, b, c, d) {
					return c*(t/=d)*t + b;
				},
				easeOutBack: function (t, b, c, d, s) {
					if (s == undefined) s = 1.70158;
					return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
				}
			};

			function setStyle(el, prop, value, units) {
				if (prop in el.style) {
					el.style[prop] = value + (units || 'px');
				} else if (prop in el) {
					el[prop] = value; // e.g. el.scrollTop
				}
			}

			function animate(el, params) {
				var ease = easings[params.easing],
                    perf = window.performance,
                    perfStartDate = perf && perf.now && perf.now(),
					startDate = (new Date).getTime(),
					state = {};

				var frame = function (date) {
                    var progress;
                    if (date < 1e12) {
                        progress = date - perfStartDate;
                    } else {
                        progress = date - startDate;
                    }
					var next = progress < params.duration &&
						(!('condition' in params) || params.condition(state));
					var prop, style, value;
					for (prop in params.styles) {
						if (params.styles.hasOwnProperty(prop)) {
							style = params.styles[prop];
							if (next) {
								value = ease(
									progress,
									style.start,
									style.end - style.start,
									params.duration
								);
							} else {
								value = style.end;
							}
							value = ~~value;
							state[prop] = value;
							setStyle(el, prop, value, style.units);
						}
					}

					if (next) {
						requestFrame(frame);
					} else {
						params.callback && params.callback();
					}
				};

				/* Launch animation. */
				frame(perfStartDate || startDate);
			}

			return animate;
		}(window));

		this.punycode = (function() {

			var punycode,

				/** Highest positive signed 32-bit float value */
					maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

				/** Bootstring parameters */
					base = 36,
				tMin = 1,
				tMax = 26,
				skew = 38,
				damp = 700,
				initialBias = 72,
				initialN = 128, // 0x80
				delimiter = '-', // '\x2D'

				regexPunycode = /^xn--/,
				regexNonASCII = /[^ -~]/, // unprintable ASCII chars + non-ASCII chars
				regexSeparators = /\x2E|\u3002|\uFF0E|\uFF61/g, // RFC 3490 separators

				errors = {
					'overflow': 'Overflow: input needs wider integers to process',
					'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
					'invalid-input': 'Invalid input'
				},

				/** Convenience shortcuts */
					baseMinusTMin = base - tMin,
				floor = Math.floor,
				stringFromCharCode = String.fromCharCode,

				/** Temporary variable */
					key;

			function error(type) {
				throw new RangeError(errors[type]);
			}

			function map(array, fn) {
				var length = array.length;
				while (length--) {
					array[length] = fn(array[length]);
				}
				return array;
			}

			/**
			 * A simple `Array#map`-like wrapper to work with domain name strings.
			 * @private
			 * @param {String} string The domain name.
			 * @param {Function} fn The function that gets called for every
			 * character.
			 * @returns {Array} A new string of characters returned by the callback
			 * function.
			 */
			function mapDomain(string, fn) {
				return map(string.split(regexSeparators), fn).join('.');
			}

			/**
			 * Creates an array containing the decimal code points of each Unicode
			 * character in the string. While JavaScript uses UCS-2 internally,
			 * this function will convert a pair of surrogate halves (each of which
			 * UCS-2 exposes as separate characters) into a single code point,
			 * matching UTF-16.
			 * @see `punycode.ucs2.encode`
			 * @see <http://mathiasbynens.be/notes/javascript-encoding>
			 * @memberOf punycode.ucs2
			 * @name decode
			 * @param {String} string The Unicode input string (UCS-2).
			 * @returns {Array} The new array of code points.
			 */
			function ucs2decode(string) {
				var output = [],
					counter = 0,
					length = string.length,
					value,
					extra;
				while (counter < length) {
					value = string.charCodeAt(counter++);
					if ((value & 0xF800) == 0xD800 && counter < length) {
						// high surrogate, and there is a next character
						extra = string.charCodeAt(counter++);
						if ((extra & 0xFC00) == 0xDC00) { // low surrogate
							output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
						} else {
							output.push(value, extra);
						}
					} else {
						output.push(value);
					}
				}
				return output;
			}

			/**
			 * Creates a string based on an array of decimal code points.
			 * @see `punycode.ucs2.decode`
			 * @memberOf punycode.ucs2
			 * @name encode
			 * @param {Array} array The array of decimal code points.
			 * @returns {String} The new Unicode string (UCS-2).
			 */
			function ucs2encode(array) {
				return map(array, function(value) {
					var output = '';
					if (value > 0xFFFF) {
						value -= 0x10000;
						output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
						value = 0xDC00 | value & 0x3FF;
					}
					output += stringFromCharCode(value);
					return output;
				}).join('');
			}

			/**
			 * Converts a basic code point into a digit/integer.
			 * @see `digitToBasic()`
			 * @private
			 * @param {Number} codePoint The basic (decimal) code point.
			 * @returns {Number} The numeric value of a basic code point (for use in
			 * representing integers) in the range `0` to `base - 1`, or `base` if
			 * the code point does not represent a value.
			 */
			function basicToDigit(codePoint) {
				return codePoint - 48 < 10
					? codePoint - 22
					: codePoint - 65 < 26
					? codePoint - 65
					: codePoint - 97 < 26
					? codePoint - 97
					: base;
			}

			/**
			 * Converts a digit/integer into a basic code point.
			 * @see `basicToDigit()`
			 * @private
			 * @param {Number} digit The numeric value of a basic code point.
			 * @param {Number} flag Use uppercase.
			 * @returns {Number}  The basic code point whose value (when used for
			 * representing integers) is `digit`, which needs to be in the range
			 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
			 * used; else, the lowercase form is used. The behavior is undefined
			 * if flag is non-zero and `digit` has no uppercase form.
			 */
			function digitToBasic(digit, flag) {
				//  0..25 map to ASCII a..z or A..Z
				// 26..35 map to ASCII 0..9
				return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
			}

			/**
			 * Bias adaptation function as per section 3.4 of RFC 3492.
			 * http://tools.ietf.org/html/rfc3492#section-3.4
			 * @private
			 */
			function adapt(delta, numPoints, firstTime) {
				var k = 0;
				delta = firstTime ? floor(delta / damp) : delta >> 1;
				delta += floor(delta / numPoints);
				for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
					delta = floor(delta / baseMinusTMin);
				}
				return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
			}

			/**
			 * Converts a Punycode string of ASCII code points to a string of Unicode
			 * code points.
			 * @memberOf punycode
			 * @param {String} input The Punycode string of ASCII code points.
			 * @returns {String} The resulting string of Unicode code points.
			 */
			function decode(input) {
				// Don't use UCS-2
				var output = [],
					inputLength = input.length,
					out,
					i = 0,
					n = initialN,
					bias = initialBias,
					basic,
					j,
					index,
					oldi,
					w,
					k,
					digit,
					t,
					length,
					/** Cached calculation results */
						baseMinusT;

				// Handle the basic code points: let `basic` be the number of input code
				// points before the last delimiter, or `0` if there is none, then copy
				// the first basic code points to the output.

				basic = input.lastIndexOf(delimiter);
				if (basic < 0) {
					basic = 0;
				}

				for (j = 0; j < basic; ++j) {
					// if it's not a basic code point
					if (input.charCodeAt(j) >= 0x80) {
						error('not-basic');
					}
					output.push(input.charCodeAt(j));
				}

				// Main decoding loop: start just after the last delimiter if any basic code
				// points were copied; start at the beginning otherwise.

				for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

					// `index` is the index of the next character to be consumed.
					// Decode a generalized variable-length integer into `delta`,
					// which gets added to `i`. The overflow checking is easier
					// if we increase `i` as we go, then subtract off its starting
					// value at the end to obtain `delta`.
					for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

						if (index >= inputLength) {
							error('invalid-input');
						}

						digit = basicToDigit(input.charCodeAt(index++));

						if (digit >= base || digit > floor((maxInt - i) / w)) {
							error('overflow');
						}

						i += digit * w;
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

						if (digit < t) {
							break;
						}

						baseMinusT = base - t;
						if (w > floor(maxInt / baseMinusT)) {
							error('overflow');
						}

						w *= baseMinusT;

					}

					out = output.length + 1;
					bias = adapt(i - oldi, out, oldi == 0);

					// `i` was supposed to wrap around from `out` to `0`,
					// incrementing `n` each time, so we'll fix that now:
					if (floor(i / out) > maxInt - n) {
						error('overflow');
					}

					n += floor(i / out);
					i %= out;

					// Insert `n` at position `i` of the output
					output.splice(i++, 0, n);

				}

				return ucs2encode(output);
			}

			/**
			 * Converts a string of Unicode code points to a Punycode string of ASCII
			 * code points.
			 * @memberOf punycode
			 * @param {String} input The string of Unicode code points.
			 * @returns {String} The resulting Punycode string of ASCII code points.
			 */
			function encode(input) {
				var n,
					delta,
					handledCPCount,
					basicLength,
					bias,
					j,
					m,
					q,
					k,
					t,
					currentValue,
					output = [],
					/** `inputLength` will hold the number of code points in `input`. */
						inputLength,
					/** Cached calculation results */
						handledCPCountPlusOne,
					baseMinusT,
					qMinusT;

				// Convert the input in UCS-2 to Unicode
				input = ucs2decode(input);

				// Cache the length
				inputLength = input.length;

				// Initialize the state
				n = initialN;
				delta = 0;
				bias = initialBias;

				// Handle the basic code points
				for (j = 0; j < inputLength; ++j) {
					currentValue = input[j];
					if (currentValue < 0x80) {
						output.push(stringFromCharCode(currentValue));
					}
				}

				handledCPCount = basicLength = output.length;

				// `handledCPCount` is the number of code points that have been handled;
				// `basicLength` is the number of basic code points.

				// Finish the basic string - if it is not empty - with a delimiter
				if (basicLength) {
					output.push(delimiter);
				}

				// Main encoding loop:
				while (handledCPCount < inputLength) {

					// All non-basic code points < n have been handled already. Find the next
					// larger one:
					for (m = maxInt, j = 0; j < inputLength; ++j) {
						currentValue = input[j];
						if (currentValue >= n && currentValue < m) {
							m = currentValue;
						}
					}

					// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
					// but guard against overflow
					handledCPCountPlusOne = handledCPCount + 1;
					if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
						error('overflow');
					}

					delta += (m - n) * handledCPCountPlusOne;
					n = m;

					for (j = 0; j < inputLength; ++j) {
						currentValue = input[j];

						if (currentValue < n && ++delta > maxInt) {
							error('overflow');
						}

						if (currentValue == n) {
							// Represent delta as a generalized variable-length integer
							for (q = delta, k = base; /* no condition */; k += base) {
								t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
								if (q < t) {
									break;
								}
								qMinusT = q - t;
								baseMinusT = base - t;
								output.push(
									stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
								);
								q = floor(qMinusT / baseMinusT);
							}

							output.push(stringFromCharCode(digitToBasic(q, 0)));
							bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
							delta = 0;
							++handledCPCount;
						}
					}

					++delta;
					++n;

				}
				return output.join('');
			}

			/**
			 * Converts a Punycode string representing a domain name to Unicode. Only the
			 * Punycoded parts of the domain name will be converted, i.e. it doesn't
			 * matter if you call it on a string that has already been converted to
			 * Unicode.
			 * @memberOf punycode
			 * @param {String} domain The Punycode domain name to convert to Unicode.
			 * @returns {String} The Unicode representation of the given Punycode
			 * string.
			 */
			function toUnicode(domain) {
				return mapDomain(domain, function(string) {
					return regexPunycode.test(string)
						? decode(string.slice(4).toLowerCase())
						: string;
				});
			}

			/**
			 * Converts a Unicode string representing a domain name to Punycode. Only the
			 * non-ASCII parts of the domain name will be converted, i.e. it doesn't
			 * matter if you call it with a domain that's already in ASCII.
			 * @memberOf punycode
			 * @param {String} domain The domain name to convert, as a Unicode string.
			 * @returns {String} The Punycode representation of the given domain name.
			 */
			function toASCII(domain) {
				return mapDomain(domain, function(string) {
					return regexNonASCII.test(string)
						? 'xn--' + encode(string)
						: string;
				});
			}

			/*--------------------------------------------------------------------------*/

			/** Define the public API */
			punycode = {
				/**
				 * A string representing the current Punycode.js version number.
				 * @memberOf punycode
				 * @type String
				 */
				'version': '1.2.1',
				/**
				 * An object of methods to convert from JavaScript's internal character
				 * representation (UCS-2) to decimal Unicode code points, and back.
				 * @see <http://mathiasbynens.be/notes/javascript-encoding>
				 * @memberOf punycode
				 * @type Object
				 */
				'ucs2': {
					'decode': ucs2decode,
					'encode': ucs2encode
				},
				'decode': decode,
				'encode': encode,
				'toASCII': toASCII,
				'toUnicode': toUnicode
			};

			return punycode;

		}());

		this.$ = Begun.$;
		this.$$ = Begun.$$;
	}();

	Begun.Template = (function (Scripts, Utils) {
		var Template = function (tpl) {
			this.tpl = tpl || '';
		};

		Template.prototype.braces = /{{(.*?)}}/g;

		var escapeDollar = function (value) {
			if ('string' === typeof value) {
				return value.replace(/\$/g, '&#36;');
			}
			return value;
		};

		var interpolate = function (vars, name) {
			if (name in vars && name != null) {
				return vars[name];
			}
			return '';
		};

		Template.prototype.evaluate = (function (Utils) {
			return function (vars) {
				var tpl = this.tpl;

				if (tpl.length) {
					var escaped = {};
					for (var i in vars) {
						if (vars.hasOwnProperty(i)) {
							escaped[i] = escapeDollar(vars[i]);
						}
					}

					tpl = tpl.replace(
						this.braces, function (_, name) {
							return interpolate(escaped, name);
						}
					);
				}

				return tpl;
			};
		})(Utils);

		return Template;
	})(Begun.Scripts, Begun.Utils); // dependencies
}

if (typeof Begun.Scripts != 'undefined') {
	Begun.Scripts.load("begun_utils.js");
}

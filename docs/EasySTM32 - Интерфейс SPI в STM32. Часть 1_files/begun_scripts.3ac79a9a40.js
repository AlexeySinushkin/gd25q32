if (typeof Begun !== "object") {
	var Begun = {};
}
if (typeof Begun.Scripts !== "object") {
	Begun.Scripts = {};
}
(function() {
	var i;

	if (typeof Begun.importedScripts === "undefined") {
		Begun.Scripts.Callbacks = {};
		Begun.importedScripts   = [];

		var urlUtils = (function () {
			var SCHEME_REGEX     = /^[^:/?#]+:/,
				SECURE_PROTOCOL  = 'https:',
				DEFAULT_PROTOCOL = 'http:';

			var protocol = document.location.protocol.toLowerCase();

			var getConformProtocol = function () {
				/* if https, return https, else http */
				var confProtocol;

				if (SECURE_PROTOCOL === protocol) {
					confProtocol = SECURE_PROTOCOL;
				} else {
					confProtocol = DEFAULT_PROTOCOL;
				}

				return (this.getConformProtocol = function () {
					return confProtocol;
				})();
			};

			var isConformProtocol = function (url) {
				var ret = true;

				if (SECURE_PROTOCOL === protocol) {
					var urlProtocol = url.match(SCHEME_REGEX);

					if (null !== urlProtocol) {
						ret = (urlProtocol[0] === SECURE_PROTOCOL);
					}
				}

				return ret;
			};

			var conformProtocol = function (url, scheme) {
				if ('string' !== typeof scheme || !scheme.length) {
					scheme = this.getConformProtocol();
				}

				return url.replace(SCHEME_REGEX, scheme);
			};

			return {
				getConformProtocol: getConformProtocol,

				isConformProtocol: isConformProtocol,

				conformProtocol: conformProtocol,

				hasDomain: function (url) {
					var ret = false;

					/* no scheme (malformed) URI, but it's absolute */
					ret = /^\/\//.test(url);

					if (!ret) {
						ret = SCHEME_REGEX.test(url);
					}

					return ret;
				}
			};
		}());

		var mixin = {
			REVISION: '$LastChangedRevision$',

			_required: {},

			_toRun: [],

			_baseUrl: (function () {
				var w = window, url;

				if (w.begun_urls && w.begun_urls.base_scripts_url) {
					url = w.begun_urls.base_scripts_url;
				} else {
					url = 'http://autocontext.begun.ru/';
				}

				return urlUtils.conformProtocol(url);
			}()),

			_norm: function(scriptUrl, isStrict) {
				if (null != scriptUrl) {
					if (
						scriptUrl.indexOf(this._baseUrl) !== 0
							&& !urlUtils.hasDomain(scriptUrl)
					) {
						scriptUrl = this._baseUrl + scriptUrl.replace(/\?.*$/, '');
					}

					if (isStrict) {
						scriptUrl = scriptUrl.replace(
							/acp\/([^.]+)\.[0-9a-f]*(?=\.js)/,
							'$1'
						);
					}
				}

				return scriptUrl;
			},

			_importScript: function(scriptUrl, isAsync) {
				var noAcpUrl = this._norm(scriptUrl, true);

				if (this._inArray(
						Begun.importedScripts,
						noAcpUrl
				)) {
					return;
				}

				Begun.importedScripts.push(noAcpUrl);

				scriptUrl = this._norm(scriptUrl);

				var d = document,
					SCRIPT_TYPE = 'text/javascript';

				if (isAsync) {
					var script = d.createElement('script');
					script.setAttribute('type', SCRIPT_TYPE);
					script.setAttribute('async', true);
					script.setAttribute('src', scriptUrl);

					var head = d.getElementsByTagName('head')[0];
					if (!head) {
						head = d.createElement('head');
						d.documentElement.insertBefore(
							head, d.documentElement.firstChild
						);
					}
					head.appendChild(script);
				} else {
					d.write(
						'<scr' + 'ipt type="' +
						SCRIPT_TYPE +
						'" src="' +
						scriptUrl +
						'"></scr' + 'ipt>'
					);
				}
			},

			_inArray: function (arr, value) {
				for (var i = 0; i < arr.length; i++) {
					if (arr[i] === value) {
						return true;
					}
				}
				return false;
			},

			_require: function(requiredScripts) {
				for (var reqScript in requiredScripts) {
					if (
						requiredScripts.hasOwnProperty(reqScript) &&
						requiredScripts[reqScript] &&
						!this._inArray(
							Begun.importedScripts,
							this._norm(reqScript, true)
						)
					) {
						this._required[this._norm(reqScript)] = requiredScripts[reqScript];
					}
				}
			},

			importAllScripts: function(scriptUrls, isAsync) {
				this._require(scriptUrls);
				for (var reqScript in scriptUrls) {
					if (scriptUrls.hasOwnProperty(reqScript) && scriptUrls[reqScript]) {
						this._importScript(reqScript, isAsync);
					}
				}
			},

			isLastRequired: function(scriptUrl) {
				var numb = 0;
				for (var reqScript in this._required) {
					if (this._required.hasOwnProperty(reqScript) && this._required[reqScript]) {
						if (this._norm(reqScript, true) === this._norm(scriptUrl, true)) {
							delete this._required[reqScript];
						} else {
							numb++;
						}
					}
				}
				return (numb < 1);
			},

			load: function(fileName) {
				this.isLastRequired(fileName);
				for (var i = 0; i < this._toRun.length; i++) {
					this._toRun[i](fileName);
				}
			},

			addStrictFunction: function(newOne) {
				var newFnTxt = newOne.toString();

				for (var i = 0; i < this._toRun.length; i++) {
					if (this._toRun[i].toString() === newFnTxt) {
						return;
					}
				}

				this._toRun.push(newOne);
				this.load();
			}
		};

		/* delegate */
		(function (from, to) {
			for (var i in from) {
				if (from.hasOwnProperty(i)) {
					to[i] = from[i];
				}
			}

			return arguments.callee;
		}
			(mixin, Begun.Scripts)
			(urlUtils, Begun.Scripts)
		);
	}

	if (typeof Begun.loaderCallbacks !== 'undefined') {
		for (i = 0; i < Begun.loaderCallbacks.length; i++) { 
			Begun.loaderCallbacks[i]();
		}
	}
})()

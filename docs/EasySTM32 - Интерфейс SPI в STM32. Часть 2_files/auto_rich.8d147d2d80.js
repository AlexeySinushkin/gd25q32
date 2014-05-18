if (typeof Begun == 'undefined') {
	var Begun = {};
}
Begun.richBlocks = function(element, options) {
	if (!element) {
		return;
	}
	var options = options || {};
	this.num_steps = 10;
	this.duration = 100; //ms
	this.time_step = this.duration/this.num_steps;
	this.step = [];
	this.current_value = [];
	this.direction = [];
	this.timers = [];
	this.timers_out = [];
	this.imgs = [];
	this.small_images = [];
	this.big_images = [];
	this.REVISION = '$LastChangedRevision: 47858 $';
	this.BORDERS_WIDTH = 2;

	var IMG_WIDTH_MAX = 200;
	var IMG_WIDTH_MIN = 70;

	var sizes = options.sizes || {};
	var num_pics = options.num_pics || 1;
	var windowSize = Begun.Utils.countWindowSize();

	for (var i = 0; i < num_pics; i++) {
		if (windowSize.width < sizes['img_width_max_' + i]) {
			this['IMG_WIDTH_MAX_' + i] = windowSize.width - this.BORDERS_WIDTH;
			this['IMG_HEIGHT_MAX_' + i] = Math.floor(sizes['img_height_max_' + i] * windowSize.width / sizes['img_width_max_' + i]);
		} else if (windowSize.height < sizes['img_height_max_' + i]) {
			this['IMG_HEIGHT_MAX_' + i] = windowSize.height - this.BORDERS_WIDTH;
			this['IMG_WIDTH_MAX_' + i] = Math.floor(sizes['img_width_max_' + i] * windowSize.height / sizes['img_height_max_' + i]);
		} else {
			this['IMG_WIDTH_MAX_' + i] = sizes['img_width_max_' + i] || IMG_WIDTH_MAX;
			this['IMG_HEIGHT_MAX_' + i] = sizes['img_height_max_' + i] || IMG_WIDTH_MAX;
		}
		this['IMG_WIDTH_MIN_' + i] = sizes['img_width_min_' + i] || IMG_WIDTH_MIN;
		this['IMG_HEIGHT_MIN_' + i] = sizes['img_height_min_' + i] || IMG_WIDTH_MIN;
		this['LEFT_MAX_' + i] = -Math.floor((this['IMG_WIDTH_MAX_' + i] - this['IMG_WIDTH_MIN_' + i])/2);
		this['TOP_MAX_' + i] = -Math.floor((this['IMG_HEIGHT_MAX_' + i] - this['IMG_HEIGHT_MIN_' + i])/2);
		this['LEFT_MAX_' + i + '_ORIGINAL'] = this['LEFT_MAX_' + i];
		this['TOP_MAX_' + i + '_ORIGINAL'] = this['TOP_MAX_' + i];
	}

	if (options.is_block_240x400) {
		this.LEFT_MAX_0_ORIGINAL = this.LEFT_MAX_1_ORIGINAL = this.LEFT_MAX_2_ORIGINAL = this.LEFT_MAX_0 = this.LEFT_MAX_1 = this.LEFT_MAX_2 = 10;
		this.TOP_MAX_0_ORIGINAL = this.TOP_MAX_0 = -25;
		this.TOP_MAX_1_ORIGINAL = this.TOP_MAX_1 = -65;
		this.TOP_MAX_2_ORIGINAL = this.TOP_MAX_2 = -115;
	}
	this.element = element;

};

Begun.richBlocks.prototype = {
	init: function() {
		var _this = this;
		var cells = Begun.Utils.getElementsByClassName(this.element, '*', 'begun_adv_rich');
		for(var i = 0, l = cells.length; i < l; i++) {
			var pic_wrapper = Begun.Utils.getElementsByClassName(cells[i], 'div', 'begun_adv_image')[0];
			if (pic_wrapper) {
				pic_wrapper.onmouseover = (function(num) {
					return function() {
						window.clearTimeout(_this.timers_out[num]);
						var picture = this.getElementsByTagName('img')[0];
						if (Begun.Utils.hasClassName(picture, 'begun_adv_picture')) {
							_this.imgs[_this.imgs.length] = picture;
							picture._i = num;
							_this.initImages(picture);
							_this.zoomIn.apply(_this, [picture]);
						}
					}
				})(i);
				pic_wrapper.onmouseout = (function(num) {
					return function() {
						var picture = this.getElementsByTagName('img')[0];
						if (Begun.Utils.hasClassName(picture, 'begun_adv_picture')) {
							_this.timers_out[num] = window.setTimeout(function() {
								_this.zoomOut.apply(_this, [picture]);
							}, 10);
						}
					}
				})(i);
			}
		}
	},
	isBlockPositionFixed: function(el) {
		if (typeof this.isBlockFixed === 'undefined') {
			if (Begun.Utils.getStyle(el, 'position') == 'fixed') {
				this.isBlockFixed = true;
			} else if (el.parentNode && el.parentNode && el.parentNode != document.body) {
				this.isBlockPositionFixed(el.parentNode);
			} else {
				this.isBlockFixed = false;
			}
		}
		return this.isBlockFixed;
	},
	initImages: function(img) {
		this.small_images[img._i] = new Image();
		this.small_images[img._i].src = img.getAttribute('_small_photo_src');
		this.big_images[img._i] = new Image();
		this.big_images[img._i].src = img.getAttribute('_big_photo_src');
	},
	toggleImageSrc: function(img, flg) {
		if (flg == 1 && this.big_images[img._i]) {
			img.src = this.big_images[img._i].src;
		} else if (this.small_images[img._i]) {
			img.src = this.small_images[img._i].src;
		}
	},
	zoomIn: function(img) {
		var _this = this;
		_this['LEFT_MAX_' + img._i] = _this['LEFT_MAX_' + img._i + '_ORIGINAL'];
		_this['TOP_MAX_' + img._i] = _this['TOP_MAX_' + img._i + '_ORIGINAL'];
		var pos = Begun.Utils.findPos(img);

		var scrollPos = Begun.Utils.getScrollXY();
		var windowSize = Begun.Utils.countWindowSize();

		var fromLeft = pos.left - (this.isBlockPositionFixed(img) ? 0 : scrollPos.x);
		var fromTop = pos.top - (this.isBlockPositionFixed(img) ? 0 : scrollPos.y);
		if (_this['LEFT_MAX_' + img._i] + fromLeft < 0) {
			_this['LEFT_MAX_' + img._i] = -fromLeft;
		} else if (fromLeft + _this['LEFT_MAX_' + img._i] + _this['IMG_WIDTH_MAX_' + img._i] > windowSize.width) {
			_this['LEFT_MAX_' + img._i] = windowSize.width - _this['IMG_WIDTH_MAX_' + img._i] - fromLeft - _this.BORDERS_WIDTH;
		}
		if (_this['TOP_MAX_' + img._i] + fromTop < 0) {
			_this['TOP_MAX_' + img._i] = -fromTop;
		} else if (fromTop + _this['TOP_MAX_' + img._i] + _this['IMG_HEIGHT_MAX_' + img._i] > windowSize.height) {
			_this['TOP_MAX_' + img._i] = windowSize.height - _this['IMG_HEIGHT_MAX_' + img._i] - fromTop - _this.BORDERS_WIDTH;
		}

		if (this['IMG_WIDTH_MIN_' + img._i] - img.clientWidth != 0) {
			return;
		}

		this.timers[img._i] = window.clearTimeout(this.timers[img._i]);

		this.timers[img._i] = window.setTimeout(function() {

			_this.toggleImageSrc(img, 1);

			for(var k=0, length=_this.imgs.length; k<length; k++) {
				Begun.Utils.removeClassName(_this.imgs[k].parentNode.parentNode, 'begun_active_image');
			}

			Begun.Utils.addClassName(img.parentNode.parentNode, 'begun_active_image');

			_this.start.apply(_this, [img, {
				top: _this['TOP_MAX_' + img._i],
				left: _this['LEFT_MAX_' + img._i],
				width: _this['IMG_WIDTH_MAX_' + img._i],
				height: _this['IMG_HEIGHT_MAX_' + img._i]
			}]);

		}, 10);
	},
	zoomOut: function(img) {
		this.timers[img._i] = window.clearTimeout(this.timers[img._i]);
		this.toggleImageSrc(img, 0);
		this.start(img, {
			top: 0,
			left: 0,
			width: this['IMG_WIDTH_MIN_' + img._i],
			height: this['IMG_HEIGHT_MIN_' + img._i]
		});
		window.setTimeout(function() {
			Begun.Utils.removeClassName(img.parentNode.parentNode, 'begun_active_image');
		}, 50);
	},
	start: function(img, params) {
		this.step[img._i] = [];
		this.current_value[img._i] = [];
		for(var key in params) {
			this.current_value[img._i][key] = parseFloat(Begun.Utils.getStyle(img, key));
			this.step[img._i][key] = (params[key] - this.current_value[img._i][key])/this.num_steps;
		}
		this.direction[img._i] = (this.current_value[img._i]['width'] <= params['width']) ? 1 : -1;
		this.set(img, params);
	},
	set: function(img, params) {
		var _this = this;
		var currentHeight = Math.round(this.current_value[img._i]['height'] + this.step[img._i]['height']);

		if (currentHeight >= this['IMG_HEIGHT_MIN_' + img._i] && currentHeight <= this['IMG_HEIGHT_MAX_' + img._i]) {
			for(var key in params) {
				this.current_value[img._i][key] += this.step[img._i][key];
				img.style[key] = Math.round(this.current_value[img._i][key]) + 'px';
			}			
		}
		if (currentHeight < params['height'] && this.direction[img._i] > 0 ||
			currentHeight > params['height'] && this.direction[img._i] < 0) {
			window.setTimeout(function() {
				_this.set(img, params);
			}, _this.time_step);
		}
	}
};

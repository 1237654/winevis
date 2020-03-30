!
function(window) {
	function Element() {
		this.initialize = function() {
			this.elementType = "element",
			this.serializedProperties = ["elementType"],
			this.propertiesStack = [],
			this._id = "" + (new Date).getTime()
		},
		this.distroy = function() {},
		this.removeHandler = function() {},
		this.attr = function(a, b) {
			if (null != a && null != b) this[a] = b;
			else if (null != a) return this[a];
			return this
		},
		this.save = function() {
			var a = this,
			b = {};
			this.serializedProperties.forEach(function(c) {
				b[c] = a[c]
			}),
			this.propertiesStack.push(b)
		},
		this.restore = function() {
			var a, b;
			null != this.propertiesStack && 0 != this.propertiesStack.length && (a = this, b = this.propertiesStack.pop(), this.serializedProperties.forEach(function(c) {
				a[c] = b[c]
			}))
		},
		this.toJson = function() {
			var a = this,
			b = "{",
			c = this.serializedProperties.length;
			return this.serializedProperties.forEach(function(d, e) {
				var f = a[d];
				"string" == typeof f && (f = '"' + f + '"'),
				b += '"' + d + '":' + f,
				c > e + 1 && (b += ",")
			}),
			b += "}"
		}
	}
	CanvasRenderingContext2D.prototype.JTopoRoundRect = function(a, b, c, d, e) {
		"undefined" == typeof e && (e = 5),
		this.beginPath(),
		this.moveTo(a + e, b),
		this.lineTo(a + c - e, b),
		this.quadraticCurveTo(a + c, b, a + c, b + e),
		this.lineTo(a + c, b + d - e),
		this.quadraticCurveTo(a + c, b + d, a + c - e, b + d),
		this.lineTo(a + e, b + d),
		this.quadraticCurveTo(a, b + d, a, b + d - e),
		this.lineTo(a, b + e),
		this.quadraticCurveTo(a, b, a + e, b),
		this.closePath()
	},
	CanvasRenderingContext2D.prototype.JTopoDashedLineTo = function(a, b, c, d, e) {
		var f, g, h, i, j, k, l;
		for ("undefined" == typeof e && (e = 5), f = c - a, g = d - b, h = Math.floor(Math.sqrt(f * f + g * g)), i = 0 >= e ? h: h / e, j = g / h * e, k = f / h * e, this.beginPath(), l = 0; i > l; l++) l % 2 ? this.lineTo(a + l * k, b + l * j) : this.moveTo(a + l * k, b + l * j);
		this.stroke()
	},
	JTopo = {
		version: "0.4.6",
		zIndex_Container: 1,
		zIndex_Link: 2,
		zIndex_Node: 3,
		SceneMode: {
			normal: "normal",
			drag: "drag",
			edit: "edit",
			select: "select"
		},
		MouseCursor: {
			normal: "default",
			pointer: "pointer",
			top_left: "nw-resize",
			top_center: "n-resize",
			top_right: "ne-resize",
			middle_left: "e-resize",
			middle_right: "e-resize",
			bottom_left: "ne-resize",
			bottom_center: "n-resize",
			bottom_right: "nw-resize",
			move: "move"//,
			//open_hand: "url(img/cur/openhand.cur) 8 8, default",
			//closed_hand: "url(img/cur/closedhand.cur) 8 8, default"
		},
		createStageFromJson: function(jsonStr, canvas) {
			var stage, k, scenes;
			eval("var jsonObj = " + jsonStr),
			stage = new JTopo.Stage(canvas);
			for (k in jsonObj)"childs" != k && (stage[k] = jsonObj[k]);
			return scenes = jsonObj.childs,
			scenes.forEach(function(a) {
				var c, d, b = new JTopo.Scene(stage);
				for (c in a)"childs" != c && (b[c] = a[c]),
				"background" == c && (b.background = a[c]);
				d = a.childs,
				d.forEach(function(a) {
					var e, c = null,
					d = a.elementType;
					"node" == d ? c = new JTopo.Node: "CircleNode" == d && (c = new JTopo.CircleNode);
					for (e in a) c[e] = a[e];
					b.add(c)
				})
			}),
			stage
		}
	},
	JTopo.Element = Element,
	window.JTopo = JTopo
} (window),
function(JTopo) {
	function MessageBus(a) {
		var b = this;
		this.name = a,
		this.messageMap = {},
		this.messageCount = 0,
		this.subscribe = function(a, d) {
			var e = b.messageMap[a];
			null == e && (b.messageMap[a] = []),
			b.messageMap[a].push(d),
			b.messageCount++
		},
		this.unsubscribe = function(a) {
			var c = b.messageMap[a];
			null != c && (b.messageMap[a] = null, delete b.messageMap[a], b.messageCount--)
		},
		this.publish = function(a, c, d) {
			var f, e = b.messageMap[a];
			if (null != e) for (f = 0; f < e.length; f++) d ?
			function(a, b) {
				setTimeout(function() {
					a(b)
				},
				10)
			} (e[f], c) : e[f](c)
		}
	}
	function getDistance(a, b, c, d) {
		var e, f;
		return null == c && null == d ? (e = b.x - a.x, f = b.y - a.y) : (e = c - a, f = d - b),
		Math.sqrt(e * e + f * f)
	}
	function getElementsBound(a) {
		var c, d, b = {
			left: Number.MAX_VALUE,
			right: Number.MIN_VALUE,
			top: Number.MAX_VALUE,
			bottom: Number.MIN_VALUE
		};
		for (c = 0; c < a.length; c++) d = a[c],
		d instanceof JTopo.Link || (b.left > d.x && (b.left = d.x, b.leftNode = d), b.right < d.x + d.width && (b.right = d.x + d.width, b.rightNode = d), b.top > d.y && (b.top = d.y, b.topNode = d), b.bottom < d.y + d.height && (b.bottom = d.y + d.height, b.bottomNode = d));
		return b.width = b.right - b.left,
		b.height = b.bottom - b.top,
		b
	}
	function mouseCoords(a) {
		return a = cloneEvent(a),
		a.pageX || (a.pageX = a.clientX + document.body.scrollLeft - document.body.clientLeft, a.pageY = a.clientY + document.body.scrollTop - document.body.clientTop),
		a
	}
	function getEventPosition(a) {
		return a = mouseCoords(a)
	}
	function rotatePoint(a, b, c, d, e) {
		var f = c - a,
		g = d - b,
		h = Math.sqrt(f * f + g * g),
		i = Math.atan2(g, f) + e;
		return {
			x: a + Math.cos(i) * h,
			y: b + Math.sin(i) * h
		}
	}
	function rotatePoints(a, b, c) {
		var e, f, d = [];
		for (e = 0; e < b.length; e++) f = rotatePoint(a.x, a.y, b[e].x, b[e].y, c),
		d.push(f);
		return d
	}
	function $foreach(a, b, c) {
		function e(d) {
			d != a.length && (b(a[d]), setTimeout(function() {
				e(++d)
			},
			c))
		}
		if (0 != a.length) {
			var d = 0;
			e(d)
		}
	}
	function $for(a, b, c, d) {
		function f(a) {
			a != b && (c(b), setTimeout(function() {
				f(++a)
			},
			d))
		}
		if (! (a > b)) {
			var e = 0;
			f(e)
		}
	}
	function cloneEvent(a) {
		var c, b = {};
		for (c in a)"returnValue" != c && "keyLocation" != c && (b[c] = a[c]);
		return b
	}
	function clone(a) {
		var c, b = {};
		for (c in a) b[c] = a[c];
		return b
	}
	function isPointInRect(a, b) {
		var c = b.x,
		d = b.y,
		e = b.width,
		f = b.height;
		return a.x > c && a.x < c + e && a.y > d && a.y < d + f
	}
	function isPointInLine(a, b, c) {
		var d = JTopo.util.getDistance(b, c),
		e = JTopo.util.getDistance(b, a),
		f = JTopo.util.getDistance(c, a),
		g = Math.abs(e + f - d) <= .5;
		return g
	}
	function removeFromArray(a, b) {
		var c, d;
		for (c = 0; c < a.length; c++) if (d = a[c], d === b) {
			a = a.del(c);
			break
		}
		return a
	}
	function randomColor() {
		return Math.floor(255 * Math.random()) + "," + Math.floor(255 * Math.random()) + "," + Math.floor(255 * Math.random())
	}
	function isIntsect() {}
	function getProperties(a, b) {
		var d, e, c = "";
		for (d = 0; d < b.length; d++) d > 0 && (c += ","),
		e = a[b[d]],
		"string" == typeof e ? e = '"' + e + '"': void 0 == e && (e = null),
		c += b[d] + ":" + e;
		return c
	}
	function loadStageFromJson(json, canvas) {
		var k, scenes, i, sceneObj, scene, p, nodeMap, elements, m, elementObj, type, element, mk, obj = eval(json),
		stage = new JTopo.Stage(canvas);
		for (k in stageObj) if ("scenes" != k) stage[k] = obj[k];
		else for (scenes = obj.scenes, i = 0; i < scenes.length; i++) {
			sceneObj = scenes[i],
			scene = new JTopo.Scene(stage);
			for (p in sceneObj) if ("elements" != p) scene[p] = sceneObj[p];
			else for (nodeMap = {},
			elements = sceneObj.elements, m = 0; m < elements.length; m++) {
				elementObj = elements[m],
				type = elementObj.elementType,
				"Node" == type && (element = new JTopo.Node);
				for (mk in elementObj) element[mk] = elementObj[mk];
				nodeMap[element.text] = element,
				scene.add(element)
			}
		}
		return console.log(stage),
		stage
	}
	function toJson(a) {
		var e, f, g, h, b = "backgroundColor,visible,mode,rotate,alpha,scaleX,scaleY,shadow,translateX,translateY,areaSelect,paintAll".split(","),
		c = "text,elementType,x,y,width,height,visible,alpha,rotate,scaleX,scaleY,fillColor,shadow,transformAble,zIndex,dragable,selected,showSelected,font,fontColor,textPosition,textOffsetX,textOffsetY".split(","),
		d = "{";
		for (d += "frames:" + a.frames, d += ", scenes:[", e = 0; e < a.childs.length; e++) {
			for (f = a.childs[e], d += "{", d += getProperties(f, b), d += ", elements:[", g = 0; g < f.childs.length; g++) h = f.childs[g],
			g > 0 && (d += ","),
			d += "{",
			d += getProperties(h, c),
			d += "}";
			d += "]}"
		}
		return d += "]",
		d += "}"
	}
	function changeColor(a, b, c, d, e) {
		var h, i, j, k, l, m, f = canvas.width = b.width,
		g = canvas.height = b.height;
		for (a.clearRect(0, 0, canvas.width, canvas.height), a.drawImage(b, 0, 0), h = a.getImageData(0, 0, b.width, b.height), i = h.data, j = 0; f > j; j++) for (k = 0; g > k; k++) l = 4 * (j + k * f),
		0 != i[l + 3] && (null != c && (i[l + 0] += c), null != d && (i[l + 1] += d), null != e && (i[l + 2] += e));
		return a.putImageData(h, 0, 0, 0, 0, b.width, b.height),
		m = canvas.toDataURL(),
		alarmImageCache[b.src] = m,
		m
	}
	function genImageAlarm(a, b) {
		null == b && (b = 255);
		try {
			if (alarmImageCache[a.src]) return alarmImageCache[a.src];
			var c = new Image;
			return c.src = changeColor(graphics, a, b),
			alarmImageCache[a.src] = c,
			c
		} catch(d) {}
		return null
	}
	function getOffsetPosition(a) {
		var b, c, d, e, f, g, h, i;
		if (!a) return {
			left: 0,
			top: 0
		};
		if (b = 0, c = 0, "getBoundingClientRect" in document.documentElement) d = a.getBoundingClientRect(),
		e = a.ownerDocument,
		f = e.body,
		g = e.documentElement,
		h = g.clientTop || f.clientTop || 0,
		i = g.clientLeft || f.clientLeft || 0,
		b = d.top + (self.pageYOffset || g && g.scrollTop || f.scrollTop) - h,
		c = d.left + (self.pageXOffset || g && g.scrollLeft || f.scrollLeft) - i;
		else do b += a.offsetTop || 0,
		c += a.offsetLeft || 0,
		a = a.offsetParent;
		while (a);
		return {
			left: c,
			top: b
		}
	}
	function lineF(a, b, c, d) {
		function g(a) {
			return a * e + f
		}
		var e = (d - b) / (c - a),
		f = b - a * e;
		return g.k = e,
		g.b = f,
		g.x1 = a,
		g.x2 = c,
		g.y1 = b,
		g.y2 = d,
		g
	}
	function inRange(a, b, c) {
		var d = Math.abs(b - c),
		e = Math.abs(b - a),
		f = Math.abs(c - a),
		g = Math.abs(d - (e + f));
		return 1e-6 > g ? !0 : !1
	}
	function isPointInLineSeg(a, b, c) {
		return inRange(a, c.x1, c.x2) && inRange(b, c.y1, c.y2)
	}
	function intersection(a, b) {
		var c, d;
		return a.k == b.k ? null: (1 / 0 == a.k ? (c = a.x1, d = b(a.x1)) : 1 / 0 == b.k ? (c = b.x1, d = a(b.x1)) : (c = (b.b - a.b) / (a.k - b.k), d = a(c)), 0 == isPointInLineSeg(c, d, a) ? null: 0 == isPointInLineSeg(c, d, b) ? null: {
			x: c,
			y: d
		})
	}
	function intersectionLineBound(a, b) {
		var c = JTopo.util.lineF(b.left, b.top, b.left, b.bottom),
		d = JTopo.util.intersection(a, c);
		return null == d && (c = JTopo.util.lineF(b.left, b.top, b.right, b.top), d = JTopo.util.intersection(a, c), null == d && (c = JTopo.util.lineF(b.right, b.top, b.right, b.bottom), d = JTopo.util.intersection(a, c), null == d && (c = JTopo.util.lineF(b.left, b.bottom, b.right, b.bottom), d = JTopo.util.intersection(a, c)))),
		d
	}
	var canvas, graphics, alarmImageCache;
	requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame ||
	function(a) {
		setTimeout(a, 1e3 / 24)
	},
	Array.prototype.del = function(a) {
		if ("number" != typeof a) {
			for (var b = 0; b < this.length; b++) if (this[b] === a) return this.slice(0, b).concat(this.slice(b + 1, this.length));
			return this
		}
		return 0 > a ? this: this.slice(0, a).concat(this.slice(a + 1, this.length))
	},
	[].indexOf || (Array.prototype.indexOf = function(a) {
		for (var b = 0; b < this.length; b++) if (this[b] === a) return b;
		return - 1
	}),
	window.console || (window.console = {
		log: function() {},
		info: function() {},
		debug: function() {},
		warn: function() {},
		error: function() {}
	}),
	canvas = document.createElement("canvas"),
	graphics = canvas.getContext("2d"),
	alarmImageCache = {},
	JTopo.util = {
		rotatePoint: rotatePoint,
		rotatePoints: rotatePoints,
		getDistance: getDistance,
		getEventPosition: getEventPosition,
		mouseCoords: mouseCoords,
		MessageBus: MessageBus,
		isFirefox: navigator.userAgent.indexOf("Firefox") > 0,
		isIE: !(!window.attachEvent || -1 !== navigator.userAgent.indexOf("Opera")),
		isChrome: null != navigator.userAgent.toLowerCase().match(/chrome/),
		clone: clone,
		isPointInRect: isPointInRect,
		isPointInLine: isPointInLine,
		removeFromArray: removeFromArray,
		cloneEvent: cloneEvent,
		randomColor: randomColor,
		isIntsect: isIntsect,
		toJson: toJson,
		loadStageFromJson: loadStageFromJson,
		getElementsBound: getElementsBound,
		genImageAlarm: genImageAlarm,
		getOffsetPosition: getOffsetPosition,
		lineF: lineF,
		intersection: intersection,
		intersectionLineBound: intersectionLineBound
	},
	window.$for = $for,
	window.$foreach = $foreach
} (JTopo),
function(a) {
	function b(a) {
		return {
			hgap: 16,
			visible: !1,
			exportCanvas: document.createElement("canvas"),
			getImage: function(b, c) {
				var g, d = a.getBound(),
				e = 1,
				f = 1;
				return this.exportCanvas.width = a.canvas.width,
				this.exportCanvas.height = a.canvas.height,
				null != b && null != c ? (this.exportCanvas.width = b, this.exportCanvas.height = c, e = b / d.width, f = c / d.height) : (d.width > a.canvas.width && (this.exportCanvas.width = d.width), d.height > a.canvas.height && (this.exportCanvas.height = d.height)),
				g = this.exportCanvas.getContext("2d"),
				a.childs.length > 0 && (g.save(), g.clearRect(0, 0, this.exportCanvas.width, this.exportCanvas.height), a.childs.forEach(function(a) {
					1 == a.visible && (a.save(), a.translateX = 0, a.translateY = 0, a.scaleX = 1, a.scaleY = 1, g.scale(e, f), d.left < 0 && (a.translateX = Math.abs(d.left)), d.top < 0 && (a.translateY = Math.abs(d.top)), a.paintAll = !0, a.repaint(g), a.paintAll = !1, a.restore())
				}), g.restore()),
				this.exportCanvas.toDataURL("image/png")
			},
			canvas: document.createElement("canvas"),
			update: function() {
				this.eagleImageDatas = this.getData(a)
			},
			setSize: function(a, b) {
				this.width = this.canvas.width = a,
				this.height = this.canvas.height = b
			},
			getData: function(b, c) {
				function e(a) {
					var b = a.stage.canvas.width,
					c = a.stage.canvas.height,
					d = b / a.scaleX / 2,
					e = c / a.scaleY / 2;
					return {
						translateX: a.translateX + d - d * a.scaleX,
						translateY: a.translateY + e - e * a.scaleY
					}
				}
				var d, f, g, h, i, j, k, l;
				if (null != j && null != k ? this.setSize(b, c) : this.setSize(200, 160), d = this.canvas.getContext("2d"), a.childs.length > 0) {
					d.save(),
					d.clearRect(0, 0, this.canvas.width, this.canvas.height),
					a.childs.forEach(function(a) {
						1 == a.visible && (a.save(), a.centerAndZoom(null, null, d), a.repaint(d), a.restore())
					}),
					f = e(a.childs[0]),
					g = f.translateX * this.canvas.width / a.canvas.width * a.childs[0].scaleX,
					h = f.translateY * this.canvas.height / a.canvas.height * a.childs[0].scaleY,
					i = a.getBound(),
					j = a.canvas.width / a.childs[0].scaleX / i.width,
					k = a.canvas.height / a.childs[0].scaleY / i.height,
					j > 1 && (j = 1),
					k > 1 && (j = 1),
					g *= j,
					h *= k,
					i.left < 0 && (g -= Math.abs(i.left) * (this.width / i.width)),
					i.top < 0 && (h -= Math.abs(i.top) * (this.height / i.height)),
					d.save(),
					d.lineWidth = 1,
					d.strokeStyle = "rgba(255,0,0,1)",
					d.strokeRect( - g, -h, d.canvas.width * j, d.canvas.height * k),
					d.restore(),
					l = null;
					try {
						l = d.getImageData(0, 0, d.canvas.width, d.canvas.height)
					} catch(m) {}
					return l
				}
				return null
			},
			paint: function() {
				if (null != this.eagleImageDatas) {
					var b = a.graphics;
					b.save(),
					b.fillStyle = "rgba(211,211,211,0.3)",
					b.fillRect(a.canvas.width - this.canvas.width - 2 * this.hgap, a.canvas.height - this.canvas.height - 1, a.canvas.width - this.canvas.width, this.canvas.height + 1),
					b.fill(),
					b.putImageData(this.eagleImageDatas, a.canvas.width - this.canvas.width - this.hgap, a.canvas.height - this.canvas.height),
					b.restore()
				} else this.eagleImageDatas = this.getData(a)
			},
			eventHandler: function(a, b, c) {
				var f, g, h, i, j, d = b.x,
				e = b.y;
				return d > c.canvas.width - this.canvas.width && e > c.canvas.height - this.canvas.height ? (d = b.x - this.canvas.width, e = b.y - this.canvas.height, "mousedown" == a && (this.lastTranslateX = c.childs[0].translateX, this.lastTranslateY = c.childs[0].translateY), "mousedrag" == a && c.childs.length > 0 && (f = b.dx, g = b.dy, h = c.getBound(), i = this.canvas.width / c.childs[0].scaleX / h.width, j = this.canvas.height / c.childs[0].scaleY / h.height, c.childs[0].translateX = this.lastTranslateX - f / i, c.childs[0].translateY = this.lastTranslateY - g / j), void 0) : void 0
			}
		}
	}
	function c(c) {
		function f(b) {
			var c = a.util.getEventPosition(b),
			e = a.util.getOffsetPosition(d.canvas);
			return c.offsetLeft = c.pageX - e.left,
			c.offsetTop = c.pageY - e.top,
			c.x = c.offsetLeft,
			c.y = c.offsetTop,
			c.target = null,
			c
		}
		function g(a) {
			e = !1,
			document.onselectstart = function() {
				return ! 1
			},
			this.mouseOver = !0;
			var b = f(a);
			d.dispatchEventToScenes("mouseover", b),
			d.dispatchEvent("mouseover", b)
		}
		function h(a) {
			e = !0,
			document.onselectstart = function() {
				return ! 0
			};
			var b = f(a);
			d.dispatchEventToScenes("mouseout", b),
			d.dispatchEvent("mouseout", b),
			d.needRepaint = 0 == d.animate ? !1 : !0
		}
		function i(a) {
			var b = f(a);
			d.mouseDown = !0,
			d.mouseDownX = b.x,
			d.mouseDownY = b.y,
			d.dispatchEventToScenes("mousedown", b),
			d.dispatchEvent("mousedown", b)
		}
		function j(a) {
			var b = f(a);
			d.dispatchEventToScenes("mouseup", b),
			d.dispatchEvent("mouseup", b),
			d.mouseDown = !1,
			d.needRepaint = 0 == d.animate ? !1 : !0
		}
		function k(a) {
			var b = f(a);
			d.mouseDown ? 0 == a.button && (b.dx = b.x - d.mouseDownX, b.dy = b.y - d.mouseDownY, d.dispatchEventToScenes("mousedrag", b), d.dispatchEvent("mousedrag", b), 1 == d.eagleEye.visible && d.eagleEye.update()) : (d.dispatchEventToScenes("mousemove", b), d.dispatchEvent("mousemove", b))
		}
		function l(a) {
			var b = f(a);
			d.dispatchEventToScenes("click", b),
			d.dispatchEvent("click", b)
		}
		function m(a) {
			var b = f(a);
			d.dispatchEventToScenes("dbclick", b),
			d.dispatchEvent("dbclick", b)
		}
		function n(a) {
			var b = f(a);
			d.dispatchEventToScenes("mousewheel", b),
			d.dispatchEvent("mousewheel", b),
			null != d.wheelZoom && (a.preventDefault ? a.preventDefault() : (a = a || window.event, a.returnValue = !1), 1 == d.eagleEye.visible && d.eagleEye.update())
		}
		function o(b) {
			a.util.isIE || !window.addEventListener ? (b.onmouseout = h, b.onmouseover = g, b.onmousedown = i, b.onmouseup = j, b.onmousemove = k, b.onclick = l, b.ondblclick = m, b.onmousewheel = n, b.touchstart = i, b.touchmove = k, b.touchend = j) : (b.addEventListener("mouseout", h), b.addEventListener("mouseover", g), b.addEventListener("mousedown", i), b.addEventListener("mouseup", j), b.addEventListener("mousemove", k), b.addEventListener("click", l), b.addEventListener("dblclick", m), a.util.isFirefox ? b.addEventListener("DOMMouseScroll", n) : b.addEventListener("mousewheel", n)),
			window.addEventListener && (window.addEventListener("keydown",
			function(b) {
				d.dispatchEventToScenes("keydown", a.util.cloneEvent(b));
				var c = b.keyCode; (37 == c || 38 == c || 39 == c || 40 == c) && (b.preventDefault ? b.preventDefault() : (b = b || window.event, b.returnValue = !1))
			},
			!0), window.addEventListener("keyup",
			function(b) {
				d.dispatchEventToScenes("keyup", a.util.cloneEvent(b));
				var c = b.keyCode; (37 == c || 38 == c || 39 == c || 40 == c) && (b.preventDefault ? b.preventDefault() : (b = b || window.event, b.returnValue = !1))
			},
			!0))
		}
		var d, e, p, q;
		a.stage = this,
		d = this,
		this.initialize = function(c) {
			o(c),
			this.canvas = c,
			this.graphics = c.getContext("2d"),
			this.childs = [],
			this.frames = 24,
			this.messageBus = new a.util.MessageBus,
			this.eagleEye = b(this),
			this.wheelZoom = null,
			this.mouseDownX = 0,
			this.mouseDownY = 0,
			this.mouseDown = !1,
			this.mouseOver = !1,
			this.needRepaint = !0,
			this.serializedProperties = ["frames", "wheelZoom"]
		},
		null != c && this.initialize(c),
		e = !0,
		document.oncontextmenu = function() {
			return e
		},
		this.dispatchEventToScenes = function(a, b) {
			var c, d;
			return 0 != this.frames && (this.needRepaint = !0),
			1 == this.eagleEye.visible && -1 != a.indexOf("mouse") && (c = b.x, d = b.y, c > this.width - this.eagleEye.width && d > this.height - this.eagleEye.height) ? (this.eagleEye.eventHandler(a, b, this), void 0) : (this.childs.forEach(function(c) {
				if (1 == c.visible) {
					var d = c[a + "Handler"];
					if (null == d) throw new Error("Function not found:" + a + "Handler");
					d.call(c, b)
				}
			}), void 0)
		},
		this.add = function(a) {
			for (var b = 0; b < this.childs.length; b++) if (this.childs[b] === a) return;
			a.addTo(this),
			this.childs.push(a)
		},
		this.remove = function(a) {
			if (null == a) throw new Error("Stage.remove出错: 参数为null!");
			for (var b = 0; b < this.childs.length; b++) if (this.childs[b] === a) return a.stage = null,
			this.childs = this.childs.del(b),
			this;
			return this
		},
		this.clear = function() {
			this.childs = []
		},
		this.addEventListener = function(a, b) {
			var c = this,
			d = function(a) {
				b.call(c, a)
			};
			return this.messageBus.subscribe(a, d),
			this
		},
		this.removeEventListener = function(a) {
			this.messageBus.unsubscribe(a)
		},
		this.removeAllEventListener = function() {
			this.messageBus = new a.util.MessageBus
		},
		this.dispatchEvent = function(a, b) {
			return this.messageBus.publish(a, b),
			this
		},
		p = "click,dbclick,mousedown,mouseup,mouseover,mouseout,mousemove,mousedrag,mousewheel,touchstart,touchmove,touchend,keydown,keyup".split(","),
		q = this,
		p.forEach(function(a) {
			q[a] = function(b) {
				null != b ? this.addEventListener(a, b) : this.dispatchEvent(a)
			}
		}),
		this.saveImageInfo = function(a, b) {
			var c = this.eagleEye.getImage(a, b),
			d = window.open("about:blank");
			return d.document.write("<img src='" + c + "' alt='from canvas'/>"),
			this
		},
		this.saveAsLocalImage = function(a, b) {
			var c = this.eagleEye.getImage(a, b);
			return c.replace("image/png", "image/octet-stream"),
			window.location.href = c,
			this
		},
		this.paint = function() {
			null != this.canvas && (this.graphics.save(), this.graphics.clearRect(0, 0, this.width, this.height), this.childs.forEach(function(a) {
				1 == a.visible && a.repaint(d.graphics)
			}), 1 == this.eagleEye.visible && this.eagleEye.paint(this), this.graphics.restore())
		},
		this.repaint = function() {
			0 != this.frames && (this.frames < 0 && 0 == this.needRepaint || (this.paint(), this.frames < 0 && (this.needRepaint = !1)))
		},
		this.zoom = function(a) {
			this.childs.forEach(function(b) {
				0 != b.visible && b.zoom(a)
			})
		},
		this.zoomOut = function(a) {
			this.childs.forEach(function(b) {
				0 != b.visible && b.zoomOut(a)
			})
		},
		this.zoomIn = function(a) {
			this.childs.forEach(function(b) {
				0 != b.visible && b.zoomIn(a)
			})
		},
		this.centerAndZoom = function() {
			this.childs.forEach(function(a) {
				0 != a.visible && a.centerAndZoom()
			})
		},
		this.setCenter = function(a, b) {
			var c = this;
			this.childs.forEach(function(d) {
				var e = a - c.canvas.width / 2,
				f = b - c.canvas.height / 2;
				d.translateX = -e,
				d.translateY = -f
			})
		},
		this.getBound = function() {
			var a = {
				left: Number.MAX_VALUE,
				right: Number.MIN_VALUE,
				top: Number.MAX_VALUE,
				bottom: Number.MIN_VALUE
			};
			return this.childs.forEach(function(b) {
				var c = b.getElementsBound();
				c.left < a.left && (a.left = c.left, a.leftNode = c.leftNode),
				c.top < a.top && (a.top = c.top, a.topNode = c.topNode),
				c.right > a.right && (a.right = c.right, a.rightNode = c.rightNode),
				c.bottom > a.bottom && (a.bottom = c.bottom, a.bottomNode = c.bottomNode)
			}),
			a.width = a.right - a.left,
			a.height = a.bottom - a.top,
			a
		},
		this.toJson = function() {
			var b = this,
			c = '{"version":"' + a.version + '",';
			return this.serializedProperties.length,
			this.serializedProperties.forEach(function(a) {
				var e = b[a];
				"string" == typeof e && (e = '"' + e + '"'),
				c += '"' + a + '":' + e + ","
			}),
			c += '"childs":[',
			this.childs.forEach(function(a) {
				c += a.toJson()
			}),
			c += "]",
			c += "}"
		},
		function() {
			0 == d.frames ? setTimeout(arguments.callee, 100) : d.frames < 0 ? (d.repaint(), setTimeout(arguments.callee, 1e3 / -d.frames)) : (d.repaint(), setTimeout(arguments.callee, 1e3 / d.frames))
		} (),
		setTimeout(function() {
			d.mousewheel(function(a) {
				var b = null == a.wheelDelta ? a.detail: a.wheelDelta;
				null != this.wheelZoom && (b > 0 ? this.zoomIn(this.wheelZoom) : this.zoomOut(this.wheelZoom))
			}),
			d.paint()
		},
		300),
		setTimeout(function() {
			d.paint()
		},
		1e3),
		setTimeout(function() {
			d.paint()
		},
		3e3)
	}
	c.prototype = {
		get width() {
			return this.canvas.width
		},
		get height() {
			return this.canvas.height
		},
		set cursor(a) {
			this.canvas.style.cursor = a
		},
		get cursor() {
			return this.canvas.style.cursor
		},
		set mode(a) {
			this.childs.forEach(function(b) {
				b.mode = a
			})
		}
	},
	a.Stage = c
} (JTopo),
function(a) {
	function b(c) {
		function e(a, b, c, d) {
			return function(e) {
				e.beginPath(),
				e.strokeStyle = "rgba(0,0,236,0.5)",
				e.fillStyle = "rgba(0,0,236,0.1)",
				e.rect(a, b, c, d),
				e.fill(),
				e.stroke(),
				e.closePath()
			}
		}
		var f, g, d = this;
		return this.initialize = function() {
			b.prototype.initialize.apply(this, arguments),
			this.messageBus = new a.util.MessageBus,
			this.elementType = "scene",
			this.childs = [],
			this.zIndexMap = {},
			this.zIndexArray = [],
			this.backgroundColor = "255,255,255",
			this.visible = !0,
			this.alpha = 0,
			this.scaleX = 1,
			this.scaleY = 1,
			this.mode = a.SceneMode.normal,
			this.translate = !0,
			this.translateX = 0,
			this.translateY = 0,
			this.lastTranslateX = 0,
			this.lastTranslateY = 0,
			this.mouseDown = !1,
			this.mouseDownX = null,
			this.mouseDownY = null,
			this.mouseDownEvent = null,
			this.areaSelect = !0,
			this.operations = [],
			this.selectedElements = [],
			this.paintAll = !1;
			var c = "background,backgroundColor,mode,paintAll,areaSelect,translate,translateX,translateY,lastTranslatedX,lastTranslatedY,alpha,visible,scaleX,scaleY".split(",");
			this.serializedProperties = this.serializedProperties.concat(c)
		},
		this.initialize(),
		this.setBackground = function(a) {
			this.background = a
		},
		this.addTo = function(a) {
			this.stage !== a && null != a && (this.stage = a)
		},
		null != c && (c.add(this), this.addTo(c)),
		this.show = function() {
			this.visible = !0
		},
		this.hide = function() {
			this.visible = !1
		},
		this.paint = function(a) {
			if (0 != this.visible && null != this.stage) {
				if (a.save(), this.paintBackgroud(a), a.restore(), a.save(), a.scale(this.scaleX, this.scaleY), 1 == this.translate) {
					var b = this.getOffsetTranslate(a);
					a.translate(b.translateX, b.translateY)
				}
				this.paintChilds(a),
				a.restore(),
				a.save(),
				this.paintOperations(a, this.operations),
				a.restore()
			}
		},
		this.repaint = function(a) {
			0 != this.visible && this.paint(a)
		},
		this.paintBackgroud = function(a) {
			null != this.background ? a.drawImage(this.background, 0, 0, a.canvas.width, a.canvas.height) : (a.beginPath(), a.fillStyle = "rgba(" + this.backgroundColor + "," + this.alpha + ")", a.fillRect(0, 0, a.canvas.width, a.canvas.height), a.closePath())
		},
		this.getDisplayedElements = function() {
			var b, c, d, e, f, a = [];
			for (b = 0; b < this.zIndexArray.length; b++) for (c = this.zIndexArray[b], d = this.zIndexMap[c], e = 0; e < d.length; e++) f = d[e],
			this.isVisiable(f) && a.push(f);
			return a
		},
		this.getDisplayedNodes = function() {
			var c, d, b = [];
			for (c = 0; c < this.childs.length; c++) d = this.childs[c],
			d instanceof a.Node && this.isVisiable(d) && b.push(d);
			return b
		},
		this.paintChilds = function(b) {
			var d, e, f, g, h, i;
			for (d = 0; d < this.zIndexArray.length; d++) for (e = this.zIndexArray[d], f = this.zIndexMap[e], g = 0; g < f.length; g++) h = f[g],
			(1 == this.paintAll || this.isVisiable(h)) && (b.save(), 1 == h.transformAble && (i = h.getCenterLocation(), b.translate(i.x, i.y), h.rotate && b.rotate(h.rotate), h.scaleX && h.scaleY ? b.scale(h.scaleX, h.scaleY) : h.scaleX ? b.scale(h.scaleX, 1) : h.scaleY && b.scale(1, h.scaleY)), 1 == h.shadow && (b.shadowBlur = h.shadowBlur, b.shadowColor = h.shadowColor, b.shadowOffsetX = h.shadowOffsetX, b.shadowOffsetY = h.shadowOffsetY), h instanceof a.InteractiveElement && (h.selected && 1 == h.showSelected && h.paintSelected(b), 1 == h.isMouseOver && h.paintMouseover(b)), h.paint(b), b.restore())
		},
		this.getOffsetTranslate = function(a) {
			var d, e, f, b = this.stage.canvas.width,
			c = this.stage.canvas.height;
			return null != a && "move" != a && (b = a.canvas.width, c = a.canvas.height),
			d = b / this.scaleX / 2,
			e = c / this.scaleY / 2,
			f = {
				translateX: this.translateX + (d - d * this.scaleX),
				translateY: this.translateY + (e - e * this.scaleY)
			}
		},
		this.isVisiable = function(b) {
			var c, d, e, f, g;
			return 1 != b.visible ? !1 : b instanceof a.Link ? !0 : (c = this.getOffsetTranslate(), d = b.x + c.translateX, e = b.y + c.translateY, d *= this.scaleX, e *= this.scaleY, f = d + b.width * this.scaleX, g = e + b.height * this.scaleY, d > this.stage.canvas.width || e > this.stage.canvas.height || 0 > f || 0 > g ? !1 : !0)
		},
		this.paintOperations = function(a, b) {
			for (var c = 0; c < b.length; c++) b[c](a)
		},
		this.findElements = function(a) {
			var c, b = [];
			for (c = 0; c < this.childs.length; c++) 1 == a(this.childs[c]) && b.push(this.childs[c]);
			return b
		},
		this.getElementsByClass = function(a) {
			return this.findElements(function(b) {
				return b instanceof a
			})
		},
		this.addOperation = function(a) {
			return this.operations.push(a),
			this
		},
		this.clearOperations = function() {
			return this.operations = [],
			this
		},
		this.getElementByXY = function(b, c) {
			var e, f, g, h, i, d = null;
			for (e = this.zIndexArray.length - 1; e >= 0; e--) for (f = this.zIndexArray[e], g = this.zIndexMap[f], h = g.length - 1; h >= 0; h--) if (i = g[h], i instanceof a.InteractiveElement && this.isVisiable(i) && i.isInBound(b, c)) return d = i;
			return d
		},
		this.add = function(a) {
			this.childs.push(a),
			null == this.zIndexMap[a.zIndex] && (this.zIndexMap[a.zIndex] = [], this.zIndexArray.push(a.zIndex), this.zIndexArray.sort(function(a, b) {
				return a - b
			})),
			this.zIndexMap["" + a.zIndex].push(a)
		},
		this.remove = function(b) {
			this.childs = a.util.removeFromArray(this.childs, b);
			var c = this.zIndexMap[b.zIndex];
			c && (this.zIndexMap[b.zIndex] = a.util.removeFromArray(c, b)),
			b.removeHandler(this)
		},
		this.clear = function() {
			var a = this;
			this.childs.forEach(function(b) {
				b.removeHandler(a)
			}),
			this.childs = [],
			this.operations = [],
			this.zIndexArray = [],
			this.zIndexMap = {}
		},
		this.addToSelected = function(a) {
			this.selectedElements.push(a)
		},
		this.cancleAllSelected = function(a) {
			for (var b = 0; b < this.selectedElements.length; b++) this.selectedElements[b].unselectedHandler(a);
			this.selectedElements = []
		},
		this.notInSelectedNodes = function(a) {
			for (var b = 0; b < this.selectedElements.length; b++) if (a === this.selectedElements[b]) return ! 1;
			return ! 0
		},
		this.removeFromSelected = function(a) {
			var b, c;
			for (b = 0; b < this.selectedElements.length; b++) c = this.selectedElements[b],
			a === c && (this.selectedElements = this.selectedElements.del(b))
		},
		this.toSceneEvent = function(b) {
			var d, c = a.util.clone(b);
			return c.x /= this.scaleX,
			c.y /= this.scaleY,
			1 == this.translate && (d = this.getOffsetTranslate(), c.x -= d.translateX, c.y -= d.translateY),
			null != c.dx && (c.dx /= this.scaleX, c.dy /= this.scaleY),
			null != this.currentElement && (c.target = this.currentElement),
			c.scene = this,
			c
		},
		this.selectElement = function(a) {
			var c, e, b = d.getElementByXY(a.x, a.y);
			if (null != b) if (a.target = b, b.mousedownHander(a), b.selectedHandler(a), d.notInSelectedNodes(b)) a.ctrlKey || d.cancleAllSelected(),
			d.addToSelected(b);
			else for (1 == a.ctrlKey && (b.unselectedHandler(), this.removeFromSelected(b)), c = 0; c < this.selectedElements.length; c++) e = this.selectedElements[c],
			e.selectedHandler(a);
			else a.ctrlKey || d.cancleAllSelected();
			this.currentElement = b
		},
		this.mousedownHandler = function(b) {
			var c = this.toSceneEvent(b);
			if (this.mouseDown = !0, this.mouseDownX = c.x, this.mouseDownY = c.y, this.mouseDownEvent = c, this.mode == a.SceneMode.normal) this.selectElement(c),
			(null == this.currentElement || this.currentElement instanceof a.Link) && 1 == this.translate && (this.lastTranslateX = this.translateX, this.lastTranslateY = this.translateY);
			else {
				if (this.mode == a.SceneMode.drag && 1 == this.translate) return this.lastTranslateX = this.translateX,
				this.lastTranslateY = this.translateY,
				void 0;
				this.mode == a.SceneMode.select ? this.selectElement(c) : this.mode == a.SceneMode.edit && (this.selectElement(c), (null == this.currentElement || this.currentElement instanceof a.Link) && 1 == this.translate && (this.lastTranslateX = this.translateX, this.lastTranslateY = this.translateY))
			}
			d.dispatchEvent("mousedown", c)
		},
		this.mouseupHandler = function(b) {
			this.stage.cursor != a.MouseCursor.normal && (this.stage.cursor = a.MouseCursor.normal),
			d.clearOperations();
			var c = this.toSceneEvent(b);
			null != this.currentElement && (c.target = d.currentElement, this.currentElement.mouseupHandler(c)),
			this.dispatchEvent("mouseup", c),
			this.mouseDown = !1
		},
		this.dragElements = function(b) {
			var c, d, e;
			if (null != this.currentElement && 1 == this.currentElement.dragable) for (c = 0; c < this.selectedElements.length; c++) d = this.selectedElements[c],
			0 != d.dragable && (e = a.util.clone(b), e.target = d, d.mousedragHandler(e))
		},
		this.mousedragHandler = function(b) {
			var c = this.toSceneEvent(b);
			this.mode == a.SceneMode.normal ? null == this.currentElement || this.currentElement instanceof a.Link ? 1 == this.translate && (this.stage.cursor = a.MouseCursor.closed_hand, this.translateX = this.lastTranslateX + c.dx, this.translateY = this.lastTranslateY + c.dy) : this.dragElements(c) : this.mode == a.SceneMode.drag ? 1 == this.translate && (this.stage.cursor = a.MouseCursor.closed_hand, this.translateX = this.lastTranslateX + c.dx, this.translateY = this.lastTranslateY + c.dy) : this.mode == a.SceneMode.select ? null != this.currentElement ? 1 == this.currentElement.dragable && this.dragElements(c) : 1 == this.areaSelect && this.areaSelectHandle(c) : this.mode == a.SceneMode.edit && (null == this.currentElement || this.currentElement instanceof a.Link ? 1 == this.translate && (this.stage.cursor = a.MouseCursor.closed_hand, this.translateX = this.lastTranslateX + c.dx, this.translateY = this.lastTranslateY + c.dy) : this.dragElements(c)),
			this.dispatchEvent("mousedrag", c)
		},
		this.areaSelectHandle = function(a) {
			var m, n, o, p, b = a.offsetLeft,
			c = a.offsetTop,
			f = this.mouseDownEvent.offsetLeft,
			g = this.mouseDownEvent.offsetTop,
			h = b >= f ? f: b,
			i = c >= g ? g: c,
			j = Math.abs(a.dx) * this.scaleX,
			k = Math.abs(a.dy) * this.scaleY,
			l = new e(h, i, j, k);
			for (d.clearOperations().addOperation(l), b = a.x, c = a.y, f = this.mouseDownEvent.x, g = this.mouseDownEvent.y, h = b >= f ? f: b, i = c >= g ? g: c, j = Math.abs(a.dx), k = Math.abs(a.dy), m = h + j, n = i + k, o = 0; o < d.childs.length; o++) p = d.childs[o],
			p.x > h && p.x + p.width < m && p.y > i && p.y + p.height < n && d.notInSelectedNodes(p) && (p.selectedHandler(a), d.addToSelected(p))
		},
		this.mousemoveHandler = function(b) {
			var c, e;
			return this.mousecoord = {
				x: b.x,
				y: b.y
			},
			c = this.toSceneEvent(b),
			this.mode == a.SceneMode.drag ? (this.stage.cursor = a.MouseCursor.open_hand, void 0) : (this.mode == a.SceneMode.normal ? this.stage.cursor = a.MouseCursor.normal: this.mode == a.SceneMode.select && (this.stage.cursor = a.MouseCursor.normal), e = d.getElementByXY(c.x, c.y), null != e ? (d.mouseOverelement && d.mouseOverelement !== e && (c.target = e, d.mouseOverelement.mouseoutHandler(c)), d.mouseOverelement = e, 0 == e.isMouseOver ? (c.target = e, e.mouseoverHandler(c), d.dispatchEvent("mouseover", c)) : (c.target = e, e.mousemoveHandler(c), d.dispatchEvent("mousemove", c))) : d.mouseOverelement && (c.target = e, d.mouseOverelement.mouseoutHandler(c), d.mouseOverelement = null, d.dispatchEvent("mouseout", c)), d.dispatchEvent("mousemove", c), void 0)
		},
		this.mouseoverHandler = function(a) {
			var b = this.toSceneEvent(a);
			this.dispatchEvent("mouseover", b)
		},
		this.mouseoutHandler = function(a) {
			var b = this.toSceneEvent(a);
			this.dispatchEvent("mouseout", b)
		},
		this.clickHandler = function(a) {
			var b = this.toSceneEvent(a);
			this.currentElement && (b.target = this.currentElement, this.currentElement.clickHandler(b)),
			this.dispatchEvent("click", b)
		},
		this.dbclickHandler = function(a) {
			var b = this.toSceneEvent(a);
			this.currentElement ? (b.target = this.currentElement, this.currentElement.dbclickHandler(b)) : d.cancleAllSelected(),
			this.dispatchEvent("dbclick", b)
		},
		this.mousewheelHandler = function(a) {
			var b = this.toSceneEvent(a);
			this.dispatchEvent("mousewheel", b)
		},
		this.touchstart = this.mousedownHander,
		this.touchmove = this.mousedragHandler,
		this.touchend = this.mousedownHander,
		this.keydownHandler = function(a) {
			this.dispatchEvent("keydown", a)
		},
		this.keyupHandler = function(a) {
			this.dispatchEvent("keyup", a)
		},
		this.addEventListener = function(a, b) {
			var c = this,
			d = function(a) {
				b.call(c, a)
			};
			return this.messageBus.subscribe(a, d),
			this
		},
		this.removeEventListener = function(a) {
			this.messageBus.unsubscribe(a)
		},
		this.removeAllEventListener = function() {
			this.messageBus = new a.util.MessageBus
		},
		this.dispatchEvent = function(a, b) {
			return this.messageBus.publish(a, b),
			this
		},
		f = "click,dbclick,mousedown,mouseup,mouseover,mouseout,mousemove,mousedrag,mousewheel,touchstart,touchmove,touchend,keydown,keyup".split(","),
		g = this,
		f.forEach(function(a) {
			g[a] = function(b) {
				null != b ? this.addEventListener(a, b) : this.dispatchEvent(a)
			}
		}),
		this.zoom = function(a, b) {
			null != a && 0 != a && (this.scaleX = a),
			null != b && 0 != b && (this.scaleY = b)
		},
		this.zoomOut = function(a) {
			0 != a && (null == a && (a = .8), this.scaleX /= a, this.scaleY /= a)
		},
		this.zoomIn = function(a) {
			0 != a && (null == a && (a = .8), this.scaleX *= a, this.scaleY *= a)
		},
		this.getBound = function() {
			return {
				left: 0,
				top: 0,
				right: this.stage.canvas.width,
				bottom: this.stage.canvas.height,
				width: this.stage.canvas.width,
				height: this.stage.canvas.height
			}
		},
		this.getElementsBound = function() {
			return a.util.getElementsBound(this.childs)
		},
		this.translateToCenter = function(a) {
			var b = this.getElementsBound(),
			c = this.stage.canvas.width / 2 - (b.left + b.right) / 2,
			d = this.stage.canvas.height / 2 - (b.top + b.bottom) / 2;
			a && (c = a.canvas.width / 2 - (b.left + b.right) / 2, d = a.canvas.height / 2 - (b.top + b.bottom) / 2),
			this.translateX = c,
			this.translateY = d
		},
		this.setCenter = function(a, b) {
			var c = a - this.stage.canvas.width / 2,
			d = b - this.stage.canvas.height / 2;
			this.translateX = -c,
			this.translateY = -d
		},
		this.centerAndZoom = function(a, b, c) {
			var d, e, f, g, h, i;
			if (this.translateToCenter(c), null == a || null == b) {
				if (d = this.getElementsBound(), e = d.right - d.left, f = d.bottom - d.top, g = this.stage.canvas.width / e, h = this.stage.canvas.height / f, c && (g = c.canvas.width / e, h = c.canvas.height / f), i = Math.min(g, h), i > 1) return;
				this.zoom(i, i)
			}
			this.zoom(a, b)
		},
		this.getCenterLocation = function() {
			return {
				x: d.stage.canvas.width / 2,
				y: d.stage.canvas.height / 2
			}
		},
		this.doLayout = function(a) {
			a && a(this, this.childs)
		},
		this.toJson = function() {
			var d, a = this,
			b = "{";
			return this.serializedProperties.length,
			this.serializedProperties.forEach(function(c) {
				var e = a[c];
				"background" == c && (e = a._background.src),
				"string" == typeof e && (e = '"' + e + '"'),
				b += '"' + c + '":' + e + ","
			}),
			b += '"childs":[',
			d = this.childs.length,
			this.childs.forEach(function(a, c) {
				b += a.toJson(),
				d > c + 1 && (b += ",")
			}),
			b += "]",
			b += "}"
		},
		d
	}
	b.prototype = new a.Element;
	var c = {};
	Object.defineProperties(b.prototype, {
		background: {
			get: function() {
				return this._background
			},
			set: function(a) {
				if ("string" == typeof a) {
					var d = c[a];
					null == d && (d = new Image, d.src = a, d.onload = function() {
						c[a] = d
					}),
					this._background = d
				} else this._background = a
			}
		}
	}),
	a.Scene = b
} (JTopo),
function(a) {
	function b() {
		this.initialize = function() {
			b.prototype.initialize.apply(this, arguments),
			this.elementType = "displayElement",
			this.x = 0,
			this.y = 0,
			this.width = 32,
			this.height = 32,
			this.visible = !0,
			this.alpha = 1,
			this.rotate = 0,
			this.scaleX = 1,
			this.scaleY = 1,
			this.strokeColor = "22,124,255",
			this.borderColor = "22,124,255",
			this.fillColor = "22,124,255",
			this.shadow = !1,
			this.shadowBlur = 5,
			this.shadowColor = "rgba(0,0,0,0.5)",
			this.shadowOffsetX = 3,
			this.shadowOffsetY = 6,
			this.transformAble = !1,
			this.zIndex = 0;
			var a = "x,y,width,height,visible,alpha,rotate,scaleX,scaleY,strokeColor,fillColor,shadow,shadowColor,shadowOffsetX,shadowOffsetY,transformAble,zIndex".split(",");
			this.serializedProperties = this.serializedProperties.concat(a)
		},
		this.initialize(),
		this.paint = function(a) {
			a.beginPath(),
			a.fillStyle = "rgba(" + this.fillColor + "," + this.alpha + ")",
			a.rect( - this.width / 2, -this.height / 2, this.width, this.height),
			a.fill(),
			a.stroke(),
			a.closePath()
		},
		this.getLocation = function() {
			return {
				x: this.x,
				y: this.y
			}
		},
		this.setLocation = function(a, b) {
			return this.x = a,
			this.y = b,
			this
		},
		this.getCenterLocation = function() {
			return {
				x: this.x + this.width / 2,
				y: this.y + this.height / 2
			}
		},
		this.setCenterLocation = function(a, b) {
			return this.x = a - this.width / 2,
			this.y = b - this.height / 2,
			this
		},
		this.getSize = function() {
			return {
				width: this.width,
				height: this.heith
			}
		},
		this.setSize = function(a, b) {
			return this.width = a,
			this.height = b,
			this
		},
		this.getBound = function() {
			return {
				left: this.x,
				top: this.y,
				right: this.x + this.width,
				bottom: this.y + this.height,
				width: this.width,
				height: this.height
			}
		},
		this.setBound = function(a, b, c, d) {
			return this.setLocation(a, b),
			this.setSize(c, d),
			this
		},
		this.getDisplayBound = function() {
			return {
				left: this.x,
				top: this.y,
				right: this.x + this.width * this.scaleX,
				bottom: this.y + this.height * this.scaleY
			}
		},
		this.getDisplaySize = function() {
			return {
				width: this.width * this.scaleX,
				height: this.height * this.scaleY
			}
		},
		this.getPosition = function(a) {
			var c, b = this.getBound();
			return "Top_Left" == a ? c = {
				x: b.left,
				y: b.top
			}: "Top_Center" == a ? c = {
				x: this.cx,
				y: b.top
			}: "Top_Right" == a ? c = {
				x: b.right,
				y: b.top
			}: "Middle_Left" == a ? c = {
				x: b.left,
				y: this.cy
			}: "Middle_Center" == a ? c = {
				x: this.cx,
				y: this.cy
			}: "Middle_Right" == a ? c = {
				x: b.right,
				y: this.cy
			}: "Bottom_Left" == a ? c = {
				x: b.left,
				y: b.bottom
			}: "Bottom_Center" == a ? c = {
				x: this.cx,
				y: b.bottom
			}: "Bottom_Right" == a && (c = {
				x: b.right,
				y: b.bottom
			}),
			c
		}
	}
	function c() {
		var b, d;
		this.initialize = function() {
			c.prototype.initialize.apply(this, arguments),
			this.elementType = "interactiveElement",
			this.dragable = !1,
			this.selected = !1,
			this.showSelected = !0,
			this.selectedLocation = null,
			this.isMouseOver = !1;
			var a = "dragable,selected,showSelected,isMouseOver".split(",");
			this.serializedProperties = this.serializedProperties.concat(a)
		},
		this.initialize(),
		this.paintSelected = function(a) {
			0 != this.showSelected && (a.save(), a.beginPath(), a.strokeStyle = "rgba(168,202,255, 0.9)", a.fillStyle = "rgba(168,202,236,0.7)", a.rect( - this.width / 2 - 3, -this.height / 2 - 3, this.width + 6, this.height + 6), a.fill(), a.stroke(), a.closePath(), a.restore())
		},
		this.paintMouseover = function(a) {
			return this.paintSelected(a)
		},
		this.isInBound = function(a, b) {
			return a > this.x && a < this.x + this.width * Math.abs(this.scaleX) && b > this.y && b < this.y + this.height * Math.abs(this.scaleY)
		},
		this.selectedHandler = function() {
			this.selected = !0,
			this.selectedLocation = {
				x: this.x,
				y: this.y
			}
		},
		this.unselectedHandler = function() {
			this.selected = !1,
			this.selectedLocation = null
		},
		this.dbclickHandler = function(a) {
			this.dispatchEvent("dbclick", a)
		},
		this.clickHandler = function(a) {
			this.dispatchEvent("click", a)
		},
		this.mousedownHander = function(a) {
			this.dispatchEvent("mousedown", a)
		},
		this.mouseupHandler = function(a) {
			this.dispatchEvent("mouseup", a)
		},
		this.mouseoverHandler = function(a) {
			this.isMouseOver = !0,
			this.dispatchEvent("mouseover", a)
		},
		this.mousemoveHandler = function(a) {
			this.dispatchEvent("mousemove", a)
		},
		this.mouseoutHandler = function(a) {
			this.isMouseOver = !1,
			this.dispatchEvent("mouseout", a)
		},
		this.mousedragHandler = function(a) {
			var b = this.selectedLocation.x + a.dx,
			c = this.selectedLocation.y + a.dy;
			this.setLocation(b, c),
			console.log("拖拽" + b),
			this.dispatchEvent("mousedrag", a)
		},
		this.addEventListener = function(b, c) {
			var d = this,
			e = function(a) {
				c.call(d, a)
			};
			return this.messageBus || (this.messageBus = new a.util.MessageBus),
			this.messageBus.subscribe(b, e),
			this
		},
		this.dispatchEvent = function(a, b) {
			return this.messageBus ? (this.messageBus.publish(a, b), this) : null
		},
		this.removeEventListener = function(a) {
			this.messageBus.unsubscribe(a)
		},
		this.removeAllEventListener = function() {
			this.messageBus = new a.util.MessageBus
		},
		b = "click,dbclick,mousedown,mouseup,mouseover,mouseout,mousemove,mousedrag,touchstart,touchmove,touchend".split(","),
		d = this,
		b.forEach(function(a) {
			d[a] = function(b) {
				null != b ? this.addEventListener(a, b) : this.dispatchEvent(a)
			}
		})
	}
	function d() {
		this.initialize = function() {
			d.prototype.initialize.apply(this, arguments),
			this.editAble = !1,
			this.selectedPoint = null
		},
		this.getCtrlPosition = function(a) {
			var b = 5,
			c = 5,
			d = this.getPosition(a);
			return {
				left: d.x - b,
				top: d.y - c,
				right: d.x + b,
				bottom: d.y + c
			}
		},
		this.selectedHandler = function(b) {
			d.prototype.selectedHandler.apply(this, arguments),
			this.selectedSize = {
				width: this.width,
				height: this.height
			},
			b.scene.mode == a.SceneMode.edit && (this.editAble = !0)
		},
		this.unselectedHandler = function() {
			d.prototype.unselectedHandler.apply(this, arguments),
			this.selectedSize = null,
			this.editAble = !1
		};
		var b = ["Top_Left", "Top_Center", "Top_Right", "Middle_Left", "Middle_Right", "Bottom_Left", "Bottom_Center", "Bottom_Right"];
		this.paintCtrl = function(a) {
			var c, d, e, f;
			if (0 != this.editAble) {
				for (a.save(), c = 0; c < b.length; c++) d = this.getCtrlPosition(b[c]),
				d.left -= this.cx,
				d.right -= this.cx,
				d.top -= this.cy,
				d.bottom -= this.cy,
				e = d.right - d.left,
				f = d.bottom - d.top,
				a.beginPath(),
				a.strokeStyle = "rgba(0,0,0,0.8)",
				a.rect(d.left, d.top, e, f),
				a.stroke(),
				a.closePath(),
				a.beginPath(),
				a.strokeStyle = "rgba(255,255,255,0.3)",
				a.rect(d.left + 1, d.top + 1, e - 2, f - 2),
				a.stroke(),
				a.closePath();
				a.restore()
			}
		},
		this.isInBound = function(a, c) {
			var e, f;
			if (this.selectedPoint = null, 1 == this.editAble) for (e = 0; e < b.length; e++) if (f = this.getCtrlPosition(b[e]), a > f.left && a < f.right && c > f.top && c < f.bottom) return this.selectedPoint = b[e],
			!0;
			return d.prototype.isInBound.apply(this, arguments)
		},
		this.mousedragHandler = function(a) {
			var b, c, d, e;
			null == this.selectedPoint ? (b = this.selectedLocation.x + a.dx, c = this.selectedLocation.y + a.dy, this.setLocation(b, c), this.dispatchEvent("mousedrag", a)) : ("Top_Left" == this.selectedPoint ? (d = this.selectedSize.width - a.dx, e = this.selectedSize.height - a.dy, b = this.selectedLocation.x + a.dx, c = this.selectedLocation.y + a.dy, b < this.x + this.width && (this.x = b, this.width = d), c < this.y + this.height && (this.y = c, this.height = e)) : "Top_Center" == this.selectedPoint ? (e = this.selectedSize.height - a.dy, c = this.selectedLocation.y + a.dy, c < this.y + this.height && (this.y = c, this.height = e)) : "Top_Right" == this.selectedPoint ? (d = this.selectedSize.width + a.dx, c = this.selectedLocation.y + a.dy, c < this.y + this.height && (this.y = c, this.height = this.selectedSize.height - a.dy), d > 1 && (this.width = d)) : "Middle_Left" == this.selectedPoint ? (d = this.selectedSize.width - a.dx, b = this.selectedLocation.x + a.dx, b < this.x + this.width && (this.x = b), d > 1 && (this.width = d)) : "Middle_Right" == this.selectedPoint ? (d = this.selectedSize.width + a.dx, d > 1 && (this.width = d)) : "Bottom_Left" == this.selectedPoint ? (d = this.selectedSize.width - a.dx, b = this.selectedLocation.x + a.dx, d > 1 && (this.x = b, this.width = d), e = this.selectedSize.height + a.dy, e > 1 && (this.height = e)) : "Bottom_Center" == this.selectedPoint ? (e = this.selectedSize.height + a.dy, e > 1 && (this.height = e)) : "Bottom_Right" == this.selectedPoint && (d = this.selectedSize.width + a.dx, d > 1 && (this.width = d), e = this.selectedSize.height + a.dy, e > 1 && (this.height = e)), this.dispatchEvent("resize", a))
		}
	}
	b.prototype = new a.Element,
	Object.defineProperties(b.prototype, {
		cx: {
			get: function() {
				return this.x + this.width / 2
			},
			set: function(a) {
				this.x = a - this.width / 2
			}
		},
		cy: {
			get: function() {
				return this.y + this.height / 2
			},
			set: function(a) {
				this.y = a - this.height / 2
			}
		}
	}),
	c.prototype = new b,
	d.prototype = new c,
	a.DisplayElement = b,
	a.InteractiveElement = c,
	a.EditableElement = d
} (JTopo),
function(a) {
	function c(d) {
		this.initialize = function(b) {
			c.prototype.initialize.apply(this, arguments),
			this.elementType = "node",
			this.zIndex = a.zIndex_Node,
			this.text = b,
			this.font = "12px Consolas",
			this.fontColor = "255,255,255",
			this.borderRadius = null,
			this.dragable = !0,
			this.textPosition = "Bottom_Center",
			this.textOffsetX = 0,
			this.textOffsetY = 0,
			this.transformAble = !0,
			this.inLinks = null,
			this.outLinks = null;
			var d = "text,font,fontColor,textPosition,textOffsetX,textOffsetY,borderRadius".split(",");
			this.serializedProperties = this.serializedProperties.concat(d)
		},
		this.initialize(d),
		this.paint = function(a) {
			this.image ? a.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height) : (a.beginPath(), a.fillStyle = "rgba(" + this.fillColor + "," + this.alpha + ")", null == this.borderRadius ? a.rect( - this.width / 2, -this.height / 2, this.width, this.height, this.borderRadius) : a.JTopoRoundRect( - this.width / 2, -this.height / 2, this.width, this.height, 10), a.fill(), a.closePath()),
			this.paintText(a),
			this.paintCtrl(a)
		},
		this.paintText = function(a) {
			var c, d, e, b = this.text;
			null != b && "" != b && (a.beginPath(), a.font = this.font, c = a.measureText(b).width, d = a.measureText("田").width, a.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")", e = this.getTextPostion(this.textPosition, c, d), a.fillText(b, e.x, e.y), a.closePath())
		},
		this.getTextPostion = function(a, b, c) {
			var d = null;
			return null == a || "Bottom_Center" == a ? d = {
				x: -this.width / 2 + (this.width - b) / 2,
				y: this.height / 2 + c
			}: "Top_Center" == a ? d = {
				x: -this.width / 2 + (this.width - b) / 2,
				y: -this.height / 2 - c / 2
			}: "Top_Right" == a ? d = {
				x: this.width / 2,
				y: -this.height / 2 - c / 2
			}: "Top_Left" == a ? d = {
				x: -this.width / 2 - b,
				y: -this.height / 2 - c / 2
			}: "Bottom_Right" == a ? d = {
				x: this.width / 2,
				y: this.height / 2 + c
			}: "Bottom_Left" == a ? d = {
				x: -this.width / 2 - b,
				y: this.height / 2 + c
			}: "Middle_Center" == a ? d = {
				x: -this.width / 2 + (this.width - b) / 2,
				y: c / 2
			}: "Middle_Right" == a ? d = {
				x: this.width / 2,
				y: c / 2
			}: "Middle_Left" == a && (d = {
				x: -this.width / 2 - b,
				y: c / 2
			}),
			null != this.textOffsetX && (d.x += this.textOffsetX),
			null != this.textOffsetY && (d.y += this.textOffsetY),
			d
		},
		this.setImage = function(c, d) {
			var e, f;
			if (null == c) throw new Error("Node.setImage(): 参数Image对象为空!");
			e = this,
			"string" == typeof c ? (f = b[c], null == f ? (f = new Image, f.src = c, f.onload = function() {
				b[c] = f,
				1 == d && e.setSize(f.width, f.height);
				var g = a.util.genImageAlarm(f);
				g && (f.alarm = g),
				e.image = f
			}) : (d && this.setSize(f.width, f.height), this.image = f)) : (this.image = c, 1 == d && this.setSize(c.width, c.height))
		},
		this.removeHandler = function(a) {
			var b = this;
			this.outLinks && (this.outLinks.forEach(function(c) {
				c.nodeA === b && a.remove(c)
			}), this.outLinks = null),
			this.inLinks && (this.inLinks.forEach(function(c) {
				c.nodeZ === b && a.remove(c)
			}), this.inLinks = null)
		}
	}
	function d() {
		d.prototype.initialize.apply(this, arguments)
	}
	function e(a) {
		this.initialize(),
		this.text = a,
		this.elementType = "TextNode",
		this.paint = function(a) {
			a.beginPath(),
			a.font = this.font,
			this.width = a.measureText(this.text).width,
			this.height = a.measureText("田").width,
			a.strokeStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")",
			a.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")",
			a.fillText(this.text, -this.width / 2, this.height / 2),
			a.closePath(),
			this.paintCtrl(a)
		},
		this.paintSelected = function(a) {
			a.save(),
			a.beginPath(),
			a.font = this.font,
			a.strokeStyle = "rgba(168,202,255, 0.9)",
			a.fillStyle = "rgba(168,202,236,0.7)",
			a.rect( - this.width / 2 - 3, -this.height / 2 - 3, this.width + 6, this.height + 6),
			a.fill(),
			a.stroke(),
			a.closePath(),
			a.restore()
		}
	}
	function f(a, b, c) {
		this.initialize(),
		this.text = a,
		this.href = b,
		this.target = c,
		this.elementType = "LinkNode",
		this.isVisited = !1,
		this.visitedColor = null,
		this.paint = function(a) {
			a.beginPath(),
			a.font = this.font,
			this.width = a.measureText(this.text).width,
			this.height = a.measureText("田").width,
			this.isVisited && null != this.visitedColor ? (a.strokeStyle = "rgba(" + this.visitedColor + ", " + this.alpha + ")", a.fillStyle = "rgba(" + this.visitedColor + ", " + this.alpha + ")") : (a.strokeStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")", a.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")"),
			a.fillText(this.text, -this.width / 2, this.height / 2),
			this.isMouseOver && (a.moveTo( - this.width / 2, this.height), a.lineTo(this.width / 2, this.height), a.stroke()),
			a.closePath()
		},
		this.paintSelected = function() {},
		this.mousemove(function() {
			var b, a = document.getElementsByTagName("canvas");
			if (a && a.length > 0) for (b = 0; b < a.length; b++) a[b].style.cursor = "pointer"
		}),
		this.mouseout(function() {
			var b, a = document.getElementsByTagName("canvas");
			if (a && a.length > 0) for (b = 0; b < a.length; b++) a[b].style.cursor = "default"
		}),
		this.click(function() {
			"_blank" == this.target ? window.open(this.href) : location = this.href,
			this.isVisited = !0
		})
	}
	function g(a) {
		this.initialize(arguments),
		this._radius = 20,
		this.beginDegree = 0,
		this.endDegree = 2 * Math.PI,
		this.text = a,
		this.paint = function(a) {
			a.save(),
			a.beginPath(),
			a.fillStyle = "rgba(" + this.fillColor + "," + this.alpha + ")",
			a.arc(0, 0, this.radius, this.beginDegree, this.endDegree, !0),
			a.fill(),
			a.closePath(),
			a.restore(),
			this.paintText(a),
			this.paintCtrl(a)
		},
		this.paintSelected = function(a) {
			a.save(),
			a.beginPath(),
			a.strokeStyle = "rgba(168,202,255, 0.9)",
			a.fillStyle = "rgba(168,202,236,0.7)",
			a.arc(0, 0, this.radius + 3, this.beginDegree, this.endDegree, !0),
			a.fill(),
			a.stroke(),
			a.closePath(),
			a.restore()
		}
	}
	function h(a, b, c) {
		var d, e;
		this.initialize(),
		this.frameImages = a || [],
		this.frameIndex = 0,
		this.isStop = !0,
		d = b || 1e3,
		this.repeatPlay = !1,
		e = this,
		this.nextFrame = function() {
			if (!this.isStop && null != this.frameImages.length) {
				if (this.frameIndex++, this.frameIndex >= this.frameImages.length) {
					if (!this.repeatPlay) return;
					this.frameIndex = 0
				}
				this.setImage(this.frameImages[this.frameIndex], c),
				setTimeout(function() {
					e.nextFrame()
				},
				d / a.length)
			}
		}
	}
	function i(a, b, c, d, e) {
		var f, g;
		this.initialize(),
		f = this,
		this.setImage(a),
		this.frameIndex = 0,
		this.isPause = !0,
		this.repeatPlay = !1,
		g = d || 1e3,
		e = e || 0,
		this.paint = function(a) {
			var b, d, f, g;
			this.image && (b = this.width, d = this.height, a.save(), a.beginPath(), a.fillStyle = "rgba(" + this.fillColor + "," + this.alpha + ")", f = (Math.floor(this.frameIndex / c) + e) * d, g = Math.floor(this.frameIndex % c) * b, a.drawImage(this.image, g, f, b, d, -b / 2, -d / 2, b, d), a.fill(), a.closePath(), a.restore())
		},
		this.nextFrame = function() {
			if (!this.isStop) {
				if (this.frameIndex++, this.frameIndex >= b * c) {
					if (!this.repeatPlay) return;
					this.frameIndex = 0
				}
				setTimeout(function() {
					f.isStop || f.nextFrame()
				},
				g / (b * c))
			}
		}
	}
	function j() {
		var a = null;
		return a = arguments.length <= 3 ? new h(arguments[0], arguments[1], arguments[2]) : new i(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]),
		a.stop = function() {
			a.isStop = !0
		},
		a.play = function() {
			a.isStop = !1,
			a.frameIndex = 0,
			a.nextFrame()
		},
		a
	}
	var b = {};
	c.prototype = new a.EditableElement,
	d.prototype = new c,
	e.prototype = new d,
	f.prototype = new e,
	g.prototype = new d,
	Object.defineProperties(g.prototype, {
		radius: {
			get: function() {
				return this._radius
			},
			set: function(a) {
				var b, c;
				this._radius = a,
				b = 2 * this.radius,
				c = 2 * this.radius,
				this.width = b,
				this.height = c
			}
		},
		width: {
			get: function() {
				return this._width
			},
			set: function(a) {
				this._radius = a / 2,
				this._width = a
			}
		},
		height: {
			get: function() {
				return this._height
			},
			set: function(a) {
				this._radius = a / 2,
				this._height = a
			}
		}
	}),
	h.prototype = new d,
	i.prototype = new d,
	j.prototype = new d,
	a.Node = d,
	a.TextNode = e,
	a.LinkNode = f,
	a.CircleNode = g,
	a.AnimateNode = j
} (JTopo),
function(a) {
	function b(a, b) {
		var d, e, f, g, c = [];
		if (null == a || null == b) return c;
		if (a && b && a.outLinks && b.inLinks) for (d = 0; d < a.outLinks.length; d++) for (e = a.outLinks[d], f = 0; f < b.inLinks.length; f++) g = b.inLinks[f],
		e === g && c.push(g);
		return c
	}
	function c(a, c) {
		var d = b(a, c),
		e = b(c, a),
		f = d.concat(e);
		return f
	}
	function d(a) {
		var b = c(a.nodeA, a.nodeZ);
		return b = b.filter(function(b) {
			return a !== b
		})
	}
	function e(a, b) {
		return c(a, b).length
	}
	function f(b, c, g) {
		function h(b, c) {
			var d = a.util.lineF(b.cx, b.cy, c.cx, c.cy),
			e = b.getBound(),
			f = a.util.intersectionLineBound(d, e);
			return f
		}
		this.initialize = function(b, c, d) {
			if (f.prototype.initialize.apply(this, arguments), this.elementType = "link", this.zIndex = a.zIndex_Link, 0 != arguments.length) {
				this.text = d,
				this.nodeA = b,
				this.nodeZ = c,
				this.nodeA && null == this.nodeA.outLinks && (this.nodeA.outLinks = []),
				this.nodeA && null == this.nodeA.inLinks && (this.nodeA.inLinks = []),
				this.nodeZ && null == this.nodeZ.inLinks && (this.nodeZ.inLinks = []),
				this.nodeZ && null == this.nodeZ.outLinks && (this.nodeZ.outLinks = []),
				null != this.nodeA && this.nodeA.outLinks.push(this),
				null != this.nodeZ && this.nodeZ.inLinks.push(this),
				this.caculateIndex(),
				this.font = "12px Consolas",
				this.fontColor = "255,255,255",
				this.lineWidth = 2, 
				this.lineJoin = "miter",
				this.transformAble = !1,
				this.bundleOffset = 20,
				this.bundleGap = 12,
				this.textOffsetX = 0,
				this.textOffsetY = 0,
				this.arrowsRadius = null,
				this.arrowsShape =null,//-8.21 箭头形状
				this.arrowsOffset = 0,
				this.dashedPattern = null,
				this.path = [];
				var e = "text,font,fontColor,lineWidth,lineJoin".split(",");
				this.serializedProperties = this.serializedProperties.concat(e)
			}
		},
		this.caculateIndex = function() {
			var a = e(this.nodeA, this.nodeZ);
			a > 0 && (this.nodeIndex = a - 1)
		},
		this.initialize(b, c, g),
		this.removeHandler = function() {
			var b, a = this;
			this.nodeA && this.nodeA.outLinks && (this.nodeA.outLinks = this.nodeA.outLinks.filter(function(b) {
				return b !== a
			})),
			this.nodeZ && this.nodeZ.inLinks && (this.nodeZ.inLinks = this.nodeZ.inLinks.filter(function(b) {
				return b !== a
			})),
			b = d(this),
			b.forEach(function(a, b) {
				a.nodeIndex = b
			})
		},
		this.getStartPosition = function() {
			var a = {
				x: this.nodeA.cx,
				y: this.nodeA.cy
			};
			return a
		},
		this.getEndPosition = function() {
			var a;
			return null != this.arrowsRadius && (a = h(this.nodeZ, this.nodeA)),
			null == a && (a = {
				x: this.nodeZ.cx,
				y: this.nodeZ.cy
			}),
			a
		},
		this.getPath = function() {
			var f, g, h, i, j, k, l, m, n, o, b = [],
			c = this.getStartPosition(),
			d = this.getEndPosition();
			return this.nodeA === this.nodeZ ? [c, d] : (f = e(this.nodeA, this.nodeZ), 1 == f ? [c, d] : (g = Math.atan2(d.y - c.y, d.x - c.x), h = {
				x: c.x + this.bundleOffset * Math.cos(g),
				y: c.y + this.bundleOffset * Math.sin(g)
			},
			i = {
				x: d.x + this.bundleOffset * Math.cos(g - Math.PI),
				y: d.y + this.bundleOffset * Math.sin(g - Math.PI)
			},
			j = g - Math.PI / 2, k = g - Math.PI / 2, l = f * this.bundleGap / 2 - this.bundleGap / 2, m = this.bundleGap * this.nodeIndex, n = {
				x: h.x + m * Math.cos(j),
				y: h.y + m * Math.sin(j)
			},
			o = {
				x: i.x + m * Math.cos(k),
				y: i.y + m * Math.sin(k)
			},
			n = {
				x: n.x + l * Math.cos(j - Math.PI),
				y: n.y + l * Math.sin(j - Math.PI)
			},
			o = {
				x: o.x + l * Math.cos(k - Math.PI),
				y: o.y + l * Math.sin(k - Math.PI)
			},
			b.push({
				x: c.x,
				y: c.y
			}), b.push({
				x: n.x,
				y: n.y
			}), b.push({
				x: o.x,
				y: o.y
			}), b.push({
				x: d.x,
				y: d.y
			}), b))
		},
		this.paintPath = function(a, b) {
			var c, d, e;
			if (this.nodeA === this.nodeZ) return this.paintLoop(a),
			void 0;
			for (a.beginPath(), a.moveTo(b[0].x, b[0].y), c = 1; c < b.length; c++) null == this.dashedPattern ? a.lineTo(b[c].x, b[c].y) : a.JTopoDashedLineTo(b[c - 1].x, b[c - 1].y, b[c].x, b[c].y, this.dashedPattern);
			a.stroke(),
			a.closePath(),
			null != this.arrowsRadius && (d = b[b.length - 2], e = b[b.length - 1], this.paintArrow(a, d, e))
		},
		this.paintLoop = function(a) {
			a.beginPath();
			var b = this.bundleGap * (this.nodeIndex + 1) / 2;
			Math.PI + Math.PI / 2,
			a.arc(this.nodeA.x, this.nodeA.y, b, Math.PI / 2, 2 * Math.PI),
			a.stroke(),
			a.closePath()
		},
		this.paintArrow = function(b, c, d) {
			var o, p, e = this.arrowsOffset,
			f = this.arrowsRadius / 2,
			g = c,
			h = d,
			i = Math.atan2(h.y - g.y, h.x - g.x),
			j = a.util.getDistance(g, h) - this.arrowsRadius,
			k = g.x + (j + e) * Math.cos(i),
			l = g.y + (j + e) * Math.sin(i),
			m = h.x + e * Math.cos(i),
			n = h.y + e * Math.sin(i);
			i -= Math.PI / 2,
			o = {
				x: k + f * Math.cos(i),
				y: l + f * Math.sin(i)
			},
			p = {
				x: k + f * Math.cos(i - Math.PI),
				y: l + f * Math.sin(i - Math.PI)
			},//- 8.21 加点 箭头形状
			q ={
                x: p.x + o.x - m,
                y: p.y + o.y - n
				},
			b.beginPath()
			/*
			b.fillStyle = "rgba(" + this.strokeColor + "," + this.alpha + ")",
			b.moveTo(o.x, o.y),
			b.lineTo(m, n),
			b.lineTo(p.x, p.y),
			b.stroke(),
			b.closePath()*/
			if(this.arrowsShape=="arrows"){
			b.fillStyle = "rgba(" + this.strokeColor + "," + this.alpha + ")",
			b.moveTo(o.x, o.y),
			b.lineTo(m, n),
			b.lineTo(p.x, p.y),
			b.stroke()
			}else if(this.arrowsShape=="triangle"){
			b.fillStyle = "rgba(" + this.strokeColor + "," + this.alpha + ")",
			b.moveTo(m, n),
			b.lineTo(o.x, o.y),
			b.lineTo(p.x, p.y),
			b.lineTo(m, n),
			b.stroke(),
			b.fillStyle ="#ffffff",
			b.fill()
			}else if(this.arrowsShape=="rhombus"){
			b.fillStyle = "rgba(" + this.strokeColor + "," + this.alpha + ")",
			b.moveTo(m, n),
			b.lineTo(p.x, p.y),
			b.lineTo(q.x, q.y),
			b.lineTo(o.x, o.y),
			b.lineTo(m, n),
			b.stroke(),
			b.fillStyle ="#ffffff",
			b.fill()
			}
		},
		this.paint = function(a) {
			if (null != this.nodeA && null != !this.nodeZ) {
				var b = this.getPath(this.nodeIndex);
				this.path = b,
				a.strokeStyle = "rgba(" + this.strokeColor + "," + this.alpha + ")",
				a.lineWidth = this.lineWidth,
				this.paintPath(a, b),
				b && b.length > 0 && this.paintText(a, b)
			}
		};
		var i = -(Math.PI / 2 + Math.PI / 4);
		this.paintText = function(a, b) {
			var e, f, g, h, j, c = b[0],
			d = b[b.length - 1];
			4 == b.length && (c = b[1], d = b[2]),
			this.text && this.text.length > 0 && (e = (d.x + c.x) / 2 + this.textOffsetX, f = (d.y + c.y) / 2 + this.textOffsetY, a.save(), a.beginPath(), a.font = this.font, g = a.measureText(this.text).width, h = a.measureText("田").width, a.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")", this.nodeA === this.nodeZ ? (j = this.bundleGap * (this.nodeIndex + 1) / 2, e = this.nodeA.x + j * Math.cos(i), f = this.nodeA.y + j * Math.sin(i), a.fillText(this.text, e, f)) : a.fillText(this.text, e - g / 2, f - h / 2), a.stroke(), a.closePath(), a.restore())
		},
		this.paintSelected = function(a) {
			a.shadowBlur = 10,
			a.shadowColor = "rgba(0,0,0,1)",
			a.shadowOffsetX = 0,
			a.shadowOffsetY = 0
		},
		this.isInBound = function(b, c) {
			var d, e, f, g, h, i;
			if (this.nodeA === this.nodeZ) return d = this.bundleGap * (this.nodeIndex + 1) / 2,
			e = a.util.getDistance(this.nodeA, {
				x: b,
				y: c
			}) - d,
			Math.abs(e) <= 3;
			for (f = !1, g = 1; g < this.path.length; g++) if (h = this.path[g - 1], i = this.path[g], 1 == a.util.isPointInLine({
				x: b,
				y: c
			},
			h, i)) {
				f = !0;
				break
			}
			return f
		}
	}
	function g(a, b, c) {
		this.initialize = function() {
			g.prototype.initialize.apply(this, arguments),
			this.direction = "horizontal"
		},
		this.initialize(a, b, c),
		this.getStartPosition = function() {
			var a = {
				x: this.nodeA.cx,
				y: this.nodeA.cy
			};
			return "horizontal" == this.direction ? this.nodeZ.cx > a.x ? a.x += this.nodeA.width / 2 : a.x -= this.nodeA.width / 2 : this.nodeZ.cy > a.y ? a.y += this.nodeA.height / 2 : a.y -= this.nodeA.height / 2,
			a
		},
		this.getEndPosition = function() {
			var a = {
				x: this.nodeZ.cx,
				y: this.nodeZ.cy
			};
			return "horizontal" == this.direction ? this.nodeA.cy < a.y ? a.y -= this.nodeZ.height / 2 : a.y += this.nodeZ.height / 2 : a.x = this.nodeA.cx < a.x ? this.nodeZ.x: this.nodeZ.x + this.nodeZ.width,
			a
		},
		this.getPath = function(a) {
			var f, g, h, i, j, b = [],
			c = this.getStartPosition(),
			d = this.getEndPosition();
			return this.nodeA === this.nodeZ ? [c, d] : (f = e(this.nodeA, this.nodeZ), g = (f - 1) * this.bundleGap, h = this.bundleGap * a - g / 2, "horizontal" == this.direction ? (i = d.x + h, j = c.y - h, b.push({
				x: c.x,
				y: j
			}), b.push({
				x: i,
				y: j
			}), b.push({
				x: i,
				y: d.y
			})) : (i = c.x + h, j = d.y - h, b.push({
				x: i,
				y: c.y
			}), b.push({
				x: i,
				y: j
			}), b.push({
				x: d.x,
				y: j
			})), b)
		},
		this.paintText = function(a, b) {
			var c, d, e, f, g;
			this.text && this.text.length > 0 && (c = b[1], d = c.x + this.textOffsetX, e = c.y + this.textOffsetY, a.save(), a.beginPath(), a.font = this.font, f = a.measureText(this.text).width, g = a.measureText("田").width, a.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")", a.fillText(this.text, d - f / 2, e - g / 2), a.stroke(), a.closePath(), a.restore())
		}
	}
	function h(a, b, c) {
		this.initialize = function() {
			h.prototype.initialize.apply(this, arguments),
			this.direction = "vertical",
			this.offsetGap = 44
		},
		this.initialize(a, b, c),
		this.getStartPosition = function() {
			var a = {
				x: this.nodeA.cx,
				y: this.nodeA.cy
			};
			return "horizontal" == this.direction ? a.x = this.nodeZ.cx < a.x ? this.nodeA.x: this.nodeA.x + this.nodeA.width: a.y = this.nodeZ.cy < a.y ? this.nodeA.y: this.nodeA.y + this.nodeA.height,
			a
		},
		this.getEndPosition = function() {
			var a = {
				x: this.nodeZ.cx,
				y: this.nodeZ.cy
			};
			return "horizontal" == this.direction ? a.x = this.nodeA.cx < a.x ? this.nodeZ.x: this.nodeZ.x + this.nodeZ.width: a.y = this.nodeA.cy < a.y ? this.nodeZ.y: this.nodeZ.y + this.nodeZ.height,
			a
		},
		this.getPath = function(a) {
			var d, f, g, h, i, b = this.getStartPosition(),
			c = this.getEndPosition();
			return this.nodeA === this.nodeZ ? [b, c] : (d = [], f = e(this.nodeA, this.nodeZ), g = (f - 1) * this.bundleGap, h = this.bundleGap * a - g / 2, i = this.offsetGap, "horizontal" == this.direction ? (this.nodeA.cx > this.nodeZ.cx && (i = -i), d.push({
				x: b.x,
				y: b.y + h
			}), d.push({
				x: b.x + i,
				y: b.y + h
			}), d.push({
				x: c.x - i,
				y: c.y + h
			}), d.push({
				x: c.x,
				y: c.y + h
			})) : (this.nodeA.cy > this.nodeZ.cy && (i = -i), d.push({
				x: b.x + h,
				y: b.y
			}), d.push({
				x: b.x + h,
				y: b.y + i
			}), d.push({
				x: c.x + h,
				y: c.y - i
			}), d.push({
				x: c.x + h,
				y: c.y
			})), d)
		}
	}
	function i(a, b, c) {
		this.initialize = function() {
			i.prototype.initialize.apply(this, arguments)
		},
		this.initialize(a, b, c),
		this.paintPath = function(a, b) {
			var c, d, e, f, g, h, i;
			if (this.nodeA === this.nodeZ) return this.paintLoop(a),
			void 0;
			for (a.beginPath(), a.moveTo(b[0].x, b[0].y), c = 1; c < b.length; c++) d = b[c - 1],
			e = b[c],
			f = (d.x + e.x) / 2,
			g = (d.y + e.y) / 2,
			g += (e.y - d.y) / 2,
			a.strokeStyle = "rgba(" + this.strokeColor + "," + this.alpha + ")",
			a.lineWidth = this.lineWidth,
			a.moveTo(d.x, d.cy),
			a.quadraticCurveTo(f, g, e.x, e.y),
			a.stroke();
			a.stroke(),
			a.closePath(),
			null != this.arrowsRadius && (h = b[b.length - 2], i = b[b.length - 1], this.paintArrow(a, h, i))
		}
	}
	f.prototype = new a.InteractiveElement,
	g.prototype = new f,
	h.prototype = new f,
	i.prototype = new f,
	a.Link = f,
	a.FoldLink = g,
	a.FlexionalLink = h,
	a.CurveLink = i
} (JTopo),
function(a) {
	function b(c) {
		this.initialize = function(c) {
			b.prototype.initialize.apply(this, null),
			this.elementType = "container",
			this.zIndex = a.zIndex_Container,
			this.width = 100,
			this.height = 100,
			this.childs = [],
			this.alpha = .5,
			this.dragable = !0,
			this.childDragble = !0,
			this.visible = !0,
			this.fillColor = "10,100,80",
			this.borderColor = "0,255,0",
			this.borderRadius = null,
			this.font = "12px Consolas",
			this.fontColor = "255,255,255",
			this.text = c,
			this.textPosition = "Bottom_Center",
			this.textOffsetX = 0,
			this.textOffsetY = 0,
			this.layout = new a.layout.AutoBoundLayout
		},
		this.initialize(c),
		this.add = function(a) {
			this.childs.push(a),
			a.dragable = this.childDragble
		},
		this.remove = function(a) {
			for (var b = 0; b < this.childs.length; b++) if (this.childs[b] === a) {
				a.parentContainer = null,
				this.childs = this.childs.del(b),
				a.lastParentContainer = this;
				break
			}
		},
		this.removeAll = function() {
			this.childs = []
		},
		this.setLocation = function(a, b) {
			var e, f, c = a - this.x,
			d = b - this.y;
			for (this.x = a, this.y = b, e = 0; e < this.childs.length; e++) f = this.childs[e],
			f.setLocation(f.x + c, f.y + d)
		},
		this.doLayout = function(a) {
			a && a(this, this.childs)
		},
		this.paint = function(a) {//- 8.21 修改参数 容器边框
			this.visible && (this.layout && this.layout(this, this.childs), a.beginPath(), a.shadowBlur = 0, a.shadowColor = "rgba(0,0,0,0.5)", a.shadowOffsetX = 0, a.shadowOffsetY = 0,a.lineWidth=this.lineWidth, a.strokeStyle = "rgba(" + this.borderColor + "," + this.alpha + ")", a.fillStyle = "rgba(" + this.fillColor + "," + this.alpha + ")", null == this.borderRadius ? a.rect(this.x, this.y, this.width, this.height) : a.JTopoRoundRect(this.x, this.y, this.width, this.height, this.borderRadius), a.fill(), a.stroke(), a.closePath(), this.paintText(a))
		},
		this.paintText = function(a) {
			var c, d, e, b = this.text;
			null != b && "" != b && (a.beginPath(), a.font = this.font, c = a.measureText(b).width, d = a.measureText("田").width, a.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")", e = this.getTextPostion(this.textPosition, c, d), a.fillText(b, e.x, e.y), a.closePath())
		},
		this.getTextPostion = function(a, b, c) {
			var d = null;
			return null == a || "Bottom_Center" == a ? d = {
				x: this.x + this.width / 2 - b / 2,
				y: this.y + this.height + c
			}: "Top_Center" == a ? d = {
				x: this.x + this.width / 2 - b / 2,
				y: this.y - c / 2
			}: "Top_Right" == a ? d = {
				x: this.x + this.width - b,
				y: this.y - c / 2
			}: "Top_Left" == a ? d = {
				x: this.x,
				y: this.y - c / 2
			}: "Bottom_Right" == a ? d = {
				x: this.x + this.width - b,
				y: this.y + this.height + c
			}: "Bottom_Left" == a ? d = {
				x: this.x,
				y: this.y + this.height + c
			}: "Middle_Center" == a ? d = {
				x: this.x + this.width / 2 - b / 2,
				y: this.y + this.height / 2 + c / 2
			}: "Middle_Right" == a ? d = {
				x: this.x + this.width - b,
				y: this.y + this.height / 2 + c / 2
			}: "Middle_Left" == a && (d = {
				x: this.x,
				y: this.y + this.height / 2 + c / 2
			}),
			null != this.textOffsetX && (d.x += this.textOffsetX),
			null != this.textOffsetY && (d.y += this.textOffsetY),
			d
		},
		this.paintSelected = function() {}
	}
	b.prototype = new a.InteractiveElement,
	a.Container = b
} (JTopo),
function(a) {
	function b(a, b) {
		return function(c) {
			var e, f, g, h, j, k, l, m, n, o, d = c.childs;
			if (! (d.length <= 0)) for (e = c.getBound(), f = d[0], g = (e.width - f.width) / b, h = (e.height - f.height) / a, d.length, j = 0, k = 0; a > k; k++) for (l = 0; b > l; l++) if (m = d[j++], n = e.left + g / 2 + l * g, o = e.top + h / 2 + k * h, m.setLocation(n, o), j >= d.length) return
		}
	}
	function c(a, b) {
		return null == a && (a = 0),
		null == b && (b = 0),
		function(c) {
			var e, f, g, h, i, d = c.childs;//-  8.21 修改显示padding
			if (! (d.length <= 0)) for (e = c.getBound(), f = e.left+30, g = e.top+30, h = 0; h < d.length; h++) i = d[h],
			f + i.width >= e.right && (f = e.left+30, g += b + i.height),
			i.setLocation(f, g),
			f += a + i.width
		}
	}
	function d() {
		return function(a, b) {
			var c, d, e, f, g, h, i, j;
			if (b.length > 0) {
				for (c = 1e7, d = -1e7, e = 1e7, f = -1e7, g = d - c, h = f - e, i = 0; i < b.length; i++) j = b[i],
				j.x <= c && (c = j.x),
				j.x >= d && (d = j.x),
				j.y <= e && (e = j.y),
				j.y >= f && (f = j.y),
				g = d - c + j.width,
				h = f - e + j.height;
				a.x = c,
				a.y = e,
				a.width = g,
				a.height = h
			}
		}
	}
	function e(b) {
		var c = [],
		d = b.filter(function(b) {
			return b instanceof a.Link ? !0 : (c.push(b), !1)
		});
		return b = c.filter(function(a) {
			for (var b = 0; b < d.length; b++) if (d[b].nodeZ === a) return ! 1;
			return ! 0
		}),
		b = b.filter(function(a) {
			for (var b = 0; b < d.length; b++) if (d[b].nodeA === a) return ! 0;
			return ! 1
		})
	}
	function f(a) {
		var b = 0,
		c = 0;
		return a.forEach(function(a) {
			b += a.width,
			c += a.height
		}),
		{
			width: b / a.length,
			height: c / a.length
		}
	}
	function g(a, b, c, d) {
		var e, f;
		for (b.x += c, b.y += d, e = q(a, b), f = 0; f < e.length; f++) g(a, e[f], c, d)
	}
	function h(a, b) {
		function d(b, e) {
			var g, f = q(a, b);
			for (null == c[e] && (c[e] = {},
			c[e].nodes = [], c[e].childs = []), c[e].nodes.push(b), c[e].childs.push(f), g = 0; g < f.length; g++) d(f[g], e + 1),
			f[g].parent = b
		}
		var c = [];
		return d(b, 0),
		c
	}
	function i(b, c, d) {
		return function(e) {
			function j(f, i) {
				var m, n, o, p, q, r, s, t, u, v, w, x, y, z, j = a.layout.getTreeDeep(f, i),
				k = h(f, i),
				l = k["" + j].nodes;
				for (m = 0; m < l.length; m++) n = l[m],
				o = (m + 1) * (c + 10),
				p = j * d,
				"down" == b || ("up" == b ? p = -p: "left" == b ? (o = -j * d, p = (m + 1) * (c + 10)) : "right" == b && (o = j * d, p = (m + 1) * (c + 10))),
				n.setLocation(o, p);
				for (q = j - 1; q >= 0; q--) for (r = k["" + q].nodes, s = k["" + q].childs, m = 0; m < r.length; m++) if (t = r[m], u = s[m], "down" == b ? t.y = q * d: "up" == b ? t.y = -q * d: "left" == b ? t.x = -q * d: "right" == b && (t.x = q * d), u.length > 0 ? "down" == b || "up" == b ? t.x = (u[0].x + u[u.length - 1].x) / 2 : ("left" == b || "right" == b) && (t.y = (u[0].y + u[u.length - 1].y) / 2) : m > 0 && ("down" == b || "up" == b ? t.x = r[m - 1].x + r[m - 1].width + c: ("left" == b || "right" == b) && (t.y = r[m - 1].y + r[m - 1].height + c)), m > 0) if ("down" == b || "up" == b) {
					if (t.x < r[m - 1].x + r[m - 1].width) for (v = r[m - 1].x + r[m - 1].width + c, w = Math.abs(v - t.x), x = m; x < r.length; x++) g(e.childs, r[x], w, 0)
				} else if (("left" == b || "right" == b) && t.y < r[m - 1].y + r[m - 1].height) for (y = r[m - 1].y + r[m - 1].height + c, z = Math.abs(y - t.y), x = m; x < r.length; x++) g(e.childs, r[x], 0, z)
			}
			var k, l, m, n, o, i = null;
			null == c && (i = f(e.childs), c = i.width, ("left" == b || "right" == b) && (c = i.width + 10)),
			null == d && (null == i && (i = f(e.childs)), d = 2 * i.height),
			null == b && (b = "down"),
			k = a.layout.getRootNodes(e.childs),
			k.length > 0 && (j(e.childs, k[0]), l = a.util.getElementsBound(e.childs), m = e.getCenterLocation(), n = m.x - (l.left + l.right) / 2, o = m.y - (l.top + l.bottom) / 2, e.childs.forEach(function(b) {
				b instanceof a.Node && (b.x += n, b.y += o)
			}))
		}
	}
	function j(b) {
		return function(c) {
			function d(a, c, e) {
				var g, f = q(a, c);
				0 != f.length && (null == e && (e = b), g = 2 * Math.PI / f.length, f.forEach(function(b, f) {
					var j, h = c.x + e * Math.cos(g * f),
					i = c.y + e * Math.sin(g * f);
					b.setLocation(h, i),
					j = e / 2,
					d(a, b, j)
				}))
			}
			var f, g, h, i, e = a.layout.getRootNodes(c.childs);
			e.length > 0 && (d(c.childs, e[0]), f = a.util.getElementsBound(c.childs), g = c.getCenterLocation(), h = g.x - (f.left + f.right) / 2, i = g.y - (f.top + f.bottom) / 2, c.childs.forEach(function(b) {
				b instanceof a.Node && (b.x += h, b.y += i)
			}))
		}
	}
	function k(a, b, c, d, e, f) {
		var h, i, g = [];
		for (h = 0; c > h; h++) for (i = 0; d > i; i++) g.push({
			x: a + i * e,
			y: b + h * f
		});
		return g
	}
	function l(a, b, c, d, e, f) {
		var l, m, n, g = e ? e: 0,
		h = f ? f: 2 * Math.PI,
		i = h - g,
		j = i / c,
		k = [];
		for (g += j / 2, l = g; h >= l; l += j) m = a + Math.cos(l) * d,
		n = b + Math.sin(l) * d,
		k.push({
			x: m,
			y: n
		});
		return k
	}
	function m(a, b, c, d, e, f) {
		var i, j, g = f || "bottom",
		h = [];
		if ("bottom" == g) for (i = a - c / 2 * d + d / 2, j = 0; c >= j; j++) h.push({
			x: i + j * d,
			y: b + e
		});
		else if ("top" == g) for (i = a - c / 2 * d + d / 2, j = 0; c >= j; j++) h.push({
			x: i + j * d,
			y: b - e
		});
		else if ("right" == g) for (i = b - c / 2 * d + d / 2, j = 0; c >= j; j++) h.push({
			x: a + e,
			y: i + j * d
		});
		else if ("left" == g) for (i = b - c / 2 * d + d / 2, j = 0; c >= j; j++) h.push({
			x: a - e,
			y: i + j * d
		});
		return h
	}
	function k(a, b, c, d, e, f) {
		var h, i, g = [];
		for (h = 0; c > h; h++) for (i = 0; d > i; i++) g.push({
			x: a + i * e,
			y: b + h * f
		});
		return g
	}
	function o(a, b) {
		var c, d, e, f, g, h, i, j;
		if (a.layout) {
			if (c = a.layout, d = c.type, e = null, "circle" == d) f = c.radius || Math.max(a.width, a.height),
			e = l(a.cx, a.cy, b.length, f, a.layout.beginAngle, a.layout.endAngle);
			else if ("tree" == d) g = c.width || 50,
			h = c.height || 50,
			i = c.direction,
			e = m(a.cx, a.cy, b.length, g, h, i);
			else {
				if ("grid" != d) return;
				e = k(a.x, a.y, c.rows, c.cols, c.horizontal || 0, c.vertical || 0)
			}
			for (j = 0; j < b.length; j++) b[j].setCenterLocation(e[j].x, e[j].y)
		}
	}
	function q(b, c) {
		var e, d = [];
		for (e = 0; e < b.length; e++) b[e] instanceof a.Link && b[e].nodeA === c && d.push(b[e].nodeZ);
		return d
	}
	function r(a, b, c) {
		var e, d = q(a.childs, b);
		if (0 == d.length) return null;
		if (o(b, d), 1 == c) for (e = 0; e < d.length; e++) r(a, d[e], c);
		return null
	}
	function s(b, c) {
		function i(a, b) {
			var i = a.x - b.x,
			j = a.y - b.y;
			g += i * d,
			h += j * d,
			g *= e,
			h *= e,
			h += f,
			b.x += g,
			b.y += h
		}
		function l() {
			if (! (++j > 150)) {
				for (var a = 0; a < k.length; a++) k[a] != b && i(b, k[a], k);
				setTimeout(l, 1e3 / 24)
			}
		}
		var d = .01,
		e = .95,
		f = -5,
		g = 0,
		h = 0,
		j = 0,
		k = c.getElementsByClass(a.Node);
		l()
	}
	function t(a, b) {
		function d(a, b, e) {
			var g, f = q(a, b);
			for (e > c && (c = e), g = 0; g < f.length; g++) d(a, f[g], e + 1)
		}
		var c = 0;
		return d(a, b, 0),
		c
	}
	a.layout = a.Layout = {
		layoutNode: r,
		getNodeChilds: q,
		adjustPosition: o,
		springLayout: s,
		getTreeDeep: t,
		getRootNodes: e,
		GridLayout: b,
		FlowLayout: c,
		AutoBoundLayout: d,
		CircleLayout: j,
		TreeLayout: i
	}
} (JTopo),
function(a) {
	function b() {
		var b = new a.CircleNode;
		return b.radius = 150,
		b.colors = ["#3666B0", "#2CA8E0", "#77D1F6"],
		b.datas = [.3, .3, .4],
		b.titles = ["A", "B", "C"],
		b.paint = function(a) {
			var e, f, g, h, i, k, l, m, c = 2 * b.radius,
			d = 2 * b.radius;
			for (b.width = c, b.height = d, e = 0, f = 0; f < this.datas.length; f++) g = 2 * this.datas[f] * Math.PI,
			a.save(),
			a.beginPath(),
			a.fillStyle = b.colors[f],
			a.moveTo(0, 0),
			a.arc(0, 0, this.radius, e, e + g, !1),
			a.fill(),
			a.closePath(),
			a.restore(),
			a.beginPath(),
			a.font = this.font,
			h = this.titles[f] + ": " + (100 * this.datas[f]).toFixed(2) + "%",
			i = a.measureText(h).width,
			a.measureText("田").width,
			k = (e + e + g) / 2,
			l = this.radius * Math.cos(k),
			m = this.radius * Math.sin(k),
			k > Math.PI / 2 && k <= Math.PI ? l -= i: k > Math.PI && k < 3 * 2 * Math.PI / 4 ? l -= i: k > .75 * 2 * Math.PI,
			a.fillStyle = "#FFFFFF",
			a.fillText(h, l, m),
			a.moveTo(this.radius * Math.cos(k), this.radius * Math.sin(k)),
			k > Math.PI / 2 && k < 3 * 2 * Math.PI / 4 && (l -= i),
			k > Math.PI,
			a.fill(),
			a.stroke(),
			a.closePath(),
			e += g
		},
		b
	}
	function c() {
		var b = new a.Node;
		return b.showSelected = !1,
		b.width = 250,
		b.height = 180,
		b.colors = ["#3666B0", "#2CA8E0", "#77D1F6"],
		b.datas = [.3, .3, .4],
		b.titles = ["A", "B", "C"],
		b.paint = function(a) {
			var f, g, h, i, j, k, l, d = 3,
			e = (this.width - d) / this.datas.length;
			for (a.save(), a.beginPath(), a.fillStyle = "#FFFFFF", a.strokeStyle = "#FFFFFF", a.moveTo( - this.width / 2 - 1, -this.height / 2), a.lineTo( - this.width / 2 - 1, this.height / 2 + 3), a.lineTo(this.width / 2 + d + 1, this.height / 2 + 3), a.stroke(), a.closePath(), a.restore(), f = 0; f < this.datas.length; f++) a.save(),
			a.beginPath(),
			a.fillStyle = b.colors[f],
			g = this.datas[f],
			h = f * (e + d) - this.width / 2,
			i = this.height - g - this.height / 2,
			a.fillRect(h, i, e, g),
			j = "" + parseInt(this.datas[f]),
			k = a.measureText(j).width,
			l = a.measureText("田").width,
			a.fillStyle = "#FFFFFF",
			a.fillText(j, h + (e - k) / 2, i - l),
			a.fillText(this.titles[f], h + (e - k) / 2, this.height / 2 + l),
			a.fill(),
			a.closePath(),
			a.restore()
		},
		b
	}
	a.BarChartNode = c,
	a.PieChartNode = b
} (JTopo),
function(a) {
	function b(b, c) {
		var e, d = null;
		return {
			stop: function() {
				return e ? (window.clearInterval(e), d && d.publish("stop"), this) : this
			},
			start: function() {
				var a = this;
				return e = setInterval(function() {
					b.call(a)
				},
				c),
				this
			},
			onStop: function(b) {
				return null == d && (d = new a.util.MessageBus),
				d.subscribe("stop", b),
				this
			}
		}
	}
	function c(a, c) {
		var d, e, f, g, h, i;
		return c = c || {},
		d = c.gravity || .1,
		e = c.dx || 0,
		f = c.dy || 5,
		g = c.stop,
		h = c.interval || 30,
		i = new b(function() {
			g && g() ? (f = .5, this.stop()) : (f += d, a.setLocation(a.x + e, a.y + f))
		},
		h)
	}
	function d(a, c, d, e, f) {
		var i, j, k, l, g = 1e3 / 24,
		h = {};
		for (i in c) j = c[i],
		k = j - a[i],
		h[i] = {
			oldValue: a[i],
			targetValue: j,
			step: k / d * g,
			isDone: function(b) {
				var c = this.step > 0 && a[b] >= this.targetValue || this.step < 0 && a[b] <= this.targetValue;
				return c
			}
		};
		return l = new b(function() {
			var d, g, b = !0;
			for (d in c) h[d].isDone(d) || (a[d] += h[d].step, b = !1);
			if (b) {
				if (!e) return this.stop();
				for (d in c) f ? (g = h[d].targetValue, h[d].targetValue = h[d].oldValue, h[d].oldValue = g, h[d].step = -h[d].step) : a[d] = h[d].oldValue
			}
			return this
		},
		g)
	}
	function f(a) {
		var b, c, d, f;
		return null == a && (a = {}),
		b = a.spring || .1,
		c = a.friction || .8,
		d = a.grivity || 0,
		a.wind || 0,
		f = a.minLength || 0,
		{
			items: [],
			timer: null,
			isPause: !1,
			addNode: function(a, b) {
				var c = {
					node: a,
					target: b,
					vx: 0,
					vy: 0
				};
				return this.items.push(c),
				this
			},
			play: function(a) {
				this.stop(),
				a = null == a ? 1e3 / 24 : a;
				var b = this;
				this.timer = setInterval(function() {
					b.nextFrame()
				},
				a)
			},
			stop: function() {
				null != this.timer && window.clearInterval(this.timer)
			},
			nextFrame: function() {
				var a, e, g, h, i, j, k, l, m, n, o;
				for (a = 0; a < this.items.length; a++) e = this.items[a],
				g = e.node,
				h = e.target,
				i = e.vx,
				j = e.vy,
				k = h.x - g.x,
				l = h.y - g.y,
				m = Math.atan2(l, k),
				0 != f ? (n = h.x - Math.cos(m) * f, o = h.y - Math.sin(m) * f, i += (n - g.x) * b, j += (o - g.y) * b) : (i += k * b, j += l * b),
				i *= c,
				j *= c,
				j += d,
				g.x += i,
				g.y += j,
				e.vx = i,
				e.vy = j
			}
		}
	}
	function h(a, b) {
		function g() {
			return d = setInterval(function() {
				return i ? (e.stop(), void 0) : (a.rotate += f || .2, a.rotate > 2 * Math.PI && (a.rotate = 0), void 0)
			},
			100),
			e
		}
		function h() {
			return window.clearInterval(d),
			e.onStop && e.onStop(a),
			e
		}
		var d, e, f;
		return b.context,
		d = null,
		e = {},
		f = b.v,
		e.run = g,
		e.stop = h,
		e.onStop = function(a) {
			return e.onStop = a,
			e
		},
		e
	}
	function j(a, b) {
		function g() {
			return window.clearInterval(e),
			f.onStop && f.onStop(a),
			f
		}
		function h() {
			var h = b.dx || 0,
			j = b.dy || 2;
			return e = setInterval(function() {
				return i ? (f.stop(), void 0) : (j += d, a.y + a.height < c.stage.canvas.height ? a.setLocation(a.x + h, a.y + j) : (j = 0, g()), void 0)
			},
			20),
			f
		}
		var c = b.context,
		d = b.gravity || .1,
		e = null,
		f = {};
		return f.run = h,
		f.stop = g,
		f.onStop = function(a) {
			return f.onStop = a,
			f
		},
		f
	}
	function k(b, c) {
		function g(c, d, e, f, g) {
			var h = new a.Node;
			return h.setImage(b.image),
			h.setSize(b.width, b.height),
			h.setLocation(c, d),
			h.showSelected = !1,
			h.dragable = !1,
			h.paint = function(a) {
				a.save(),
				a.arc(0, 0, e, f, g),
				a.clip(),
				a.beginPath(),
				null != this.image ? a.drawImage(this.image, -this.width / 2, -this.height / 2) : (a.fillStyle = "rgba(" + this.style.fillStyle + "," + this.alpha + ")", a.rect( - this.width / 2, -this.height / 2, this.width / 2, this.height / 2), a.fill()),
				a.closePath(),
				a.restore()
			},
			h
		}
		function h(c, d) {
			var e = c,
			h = c + Math.PI,
			i = g(b.x, b.y, b.width, e, h),
			j = g(b.x - 2 + 4 * Math.random(), b.y, b.width, e + Math.PI, e);
			b.visible = !1,
			d.add(i),
			d.add(j),
			a.Animate.gravity(i, {
				context: d,
				dx: .3
			}).run().onStop(function() {
				d.remove(i),
				d.remove(j),
				f.stop()
			}),
			a.Animate.gravity(j, {
				context: d,
				dx: -.2
			}).run()
		}
		function i() {
			return h(c.angle, d),
			f
		}
		function j() {
			return f.onStop && f.onStop(b),
			f
		}
		var f, d = c.context;
		return b.style,
		f = {},
		f.onStop = function(a) {
			return f.onStop = a,
			f
		},
		f.run = i,
		f.stop = j,
		f
	}
	function l(a, b) {
		function g(a) {
			a.visible = !0,
			a.rotate = Math.random();
			var b = f.stage.canvas.width / 2;
			a.x = b + Math.random() * (b - 100) - Math.random() * (b - 100),
			a.y = f.stage.canvas.height,
			a.vx = 5 * Math.random() - 5 * Math.random(),
			a.vy = -25
		}
		function k() {
			return g(a),
			h = setInterval(function() {
				return i ? (j.stop(), void 0) : (a.vy += c, a.x += a.vx, a.y += a.vy, (a.x < 0 || a.x > f.stage.canvas.width || a.y > f.stage.canvas.height) && (j.onStop && j.onStop(a), g(a)), void 0)
			},
			50),
			j
		}
		function l() {
			window.clearInterval(h)
		}
		var c = .8,
		f = b.context,
		h = null,
		j = {};
		return j.onStop = function(a) {
			return j.onStop = a,
			j
		},
		j.run = k,
		j.stop = l,
		j
	}
	function m() {
		i = !0
	}
	function n() {
		i = !1
	}
	function o(b, c) {
		function o() {
			return n = setInterval(function() {
				if (i) return m.stop(),
				void 0;
				var a = d.y + g + Math.sin(k) * j;
				b.setLocation(b.x, a),
				k += l
			},
			100),
			m
		}
		function p() {
			window.clearInterval(n)
		}
		var g, h, j, k, l, m, n, d = c.p1,
		e = c.p2;
		return c.context,
		g = d.x + (e.x - d.x) / 2,
		h = d.y + (e.y - d.y) / 2,
		j = a.util.getDistance(d, e) / 2,
		k = Math.atan2(h, g),
		l = c.speed || .2,
		m = {},
		n = null,
		m.run = o,
		m.stop = p,
		m
	}
	function p(a, b) {
		function h() {
			return g = setInterval(function() {
				var b, d, g, h;
				return i ? (f.stop(), void 0) : (b = c.x - a.x, d = c.y - a.y, g = b * e, h = d * e, a.x += g, a.y += h, .01 > g && .1 > h && j(), void 0)
			},
			100),
			f
		}
		function j() {
			window.clearInterval(g)
		}
		var e, f, g, c = b.position;
		return b.context,
		e = b.easing || .2,
		f = {},
		g = null,
		f.onStop = function(a) {
			return f.onStop = a,
			f
		},
		f.run = h,
		f.stop = j,
		f
	}
	function q(a, b) {
		function k() {
			return j = setInterval(function() {
				a.scaleX += f,
				a.scaleY += f,
				a.scaleX >= e && l()
			},
			100),
			i
		}
		function l() {
			i.onStop && i.onStop(a),
			a.scaleX = g,
			a.scaleY = h,
			window.clearInterval(j)
		}
		var e, f, g, h, i, j;
		return b.position,
		b.context,
		e = b.scale || 1,
		f = .06,
		g = a.scaleX,
		h = a.scaleY,
		i = {},
		j = null,
		i.onStop = function(a) {
			return i.onStop = a,
			i
		},
		i.run = k,
		i.stop = l,
		i
	}
	a.Animate = {},
	a.Effect = {};
	var i = !1;
	a.Effect.spring = f,
	a.Effect.gravity = c,
	a.Animate.stepByStep = d,
	a.Animate.rotate = h,
	a.Animate.scale = q,
	a.Animate.move = p,
	a.Animate.cycle = o,
	a.Animate.repeatThrow = l,
	a.Animate.dividedTwoPiece = k,
	a.Animate.gravity = j,
	a.Animate.startAll = n,
	a.Animate.stopAll = m
} (JTopo),
function(a) {
	function c(a, b) {
		var d, e, f, g, h, i, j, c = [];
		return 0 == a.length ? c: (d = b.match(/^\s*(\w+)\s*$/), null != d ? (e = a.filter(function(a) {
			return a.elementType == d[1]
		}), null != e && e.length > 0 && (c = c.concat(e))) : (f = !1, d = b.match(/\s*(\w+)\s*\[\s*(\w+)\s*([>=<])\s*['"](\S+)['"]\s*\]\s*/), (null == d || d.length < 5) && (d = b.match(/\s*(\w+)\s*\[\s*(\w+)\s*([>=<])\s*(\d+(\.\d+)?)\s*\]\s*/), f = !0), null != d && d.length >= 5 && (g = d[1], h = d[2], i = d[3], j = d[4], e = a.filter(function(a) {
			if (a.elementType != g) return ! 1;
			var b = a[h];
			return 1 == f && (b = parseInt(b)),
			"=" == i ? b == j: ">" == i ? b > j: "<" == i ? j > b: "<=" == i ? j >= b: ">=" == i ? b >= j: "!=" == i ? b != j: !1
		}), null != e && e.length > 0 && (c = c.concat(e)))), c)
	}
	function d(a) {
		var c, d, f;
		if (a.find = function(a) {
			return e.call(this, a)
		},
		b.forEach(function(b) {
			a[b] = function(a) {
				for (var c = 0; c < this.length; c++) this[c][b](a);
				return this
			}
		}), a.length > 0) {
			c = a[0];
			for (d in c) f = c[d],
			"function" == typeof f &&
			function(b) {
				a[d] = function() {
					var d, c = [];
					for (d = 0; d < a.length; d++) c.push(b.apply(a[d], arguments));
					return c
				}
			} (f)
		}
		return a.attr = function(a, b) {
			var c, d, e;
			if (null != a && null != b) for (c = 0; c < this.length; c++) this[c][a] = b;
			else {
				if (null != a && "string" == typeof a) {
					for (d = [], c = 0; c < this.length; c++) d.push(this[c][a]);
					return d
				}
				if (null != a) for (c = 0; c < this.length; c++) for (e in a) this[c][e] = a[e]
			}
			return this
		},
		a
	}
	function e(b) {
		var g, e = [],
		f = [];
		return this instanceof a.Stage ? (e = this.childs, f = f.concat(e)) : this instanceof a.Scene ? e = [this] : f = this,
		e.forEach(function(a) {
			f = f.concat(a.childs)
		}),
		g = null,
		g = "function" == typeof b ? f.filter(b) : c(f, b),
		g = d(g)
	}
	a.Node.prototype.paint = function(a) {
		this.image ? null != this.image.alarm && null != this.alarm ? a.drawImage(this.image.alarm, -this.width / 2, -this.height / 2, this.width, this.height) : a.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height) : (a.beginPath(), a.fillStyle = "rgba(" + this.fillColor + "," + this.alpha + ")", null == this.borderRadius ? a.rect( - this.width / 2, -this.height / 2, this.width, this.height) : a.JTopoRoundRect( - this.width / 2, -this.height / 2, this.width, this.height, this.borderRadius), a.fill(), a.closePath()),
		this.paintText(a),
		null != this.alarm && this.paintAlarmText(a),
		this.paintCtrl(a)
	},
	a.Node.prototype.paintAlarmText = function(a) {
		var b, c, d, e;
		"" != this.alarm && (a.beginPath(), a.font = this.alarmFont || "10px 微软雅黑", b = a.measureText(this.alarm).width + 6, c = a.measureText("田").width + 6, d = this.width / 2 - b / 2, e = -this.height / 2 - c - 8, a.strokeStyle = "rgba(255,0,0, 0.5)", a.fillStyle = "rgba(255,0,0, 0.5)", a.lineCap = "round", a.lineWidth = 1, a.moveTo(d, e), a.lineTo(d + b, e), a.lineTo(d + b, e + c), a.lineTo(d + b / 2 + 6, e + c), a.lineTo(d + b / 2, e + c + 8), a.lineTo(d + b / 2 - 6, e + c), a.lineTo(d, e + c), a.lineTo(d, e), a.fill(), a.stroke(), a.closePath(), a.beginPath(), a.strokeStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")", a.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")", a.fillText(this.alarm, d + 2, e + c - 4), a.closePath())
	};
	var b = "click,mousedown,mouseup,mouseover,mouseout,mousedrag,keydown,keyup".split(",");
	a.Stage.prototype.find = e,
	a.Scene.prototype.find = e
} (JTopo);

/* External Libraries used in saranyu player*/

/*! Hammer.JS - v1.0.6dev - 2013-05-04
 * http://eightmedia.github.com/hammer.js
 *
 * Copyright (c) 2013 Jorik Tangelder <j.tangelder@gmail.com>;
 * Licensed under the MIT license */

/*
 * Modifying Hammer.JS - v1.0.6dev
 * as Saranyu Hammer JS - V1.0
 * Modifying to prevent overlapping if the host HTML uses different version of Hammer.JS.
 * */

/*
 * 	    The MIT License (MIT)
		Copyright (c) 2014 Hammer.js
		
		Permission is hereby granted, free of charge, to any person obtaining a copy
		of this software and associated documentation files (the "Software"), to deal
		in the Software without restriction, including without limitation the rights
		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		copies of the Software, and to permit persons to whom the Software is
		furnished to do so, subject to the following conditions:
		
		The above copyright notice and this permission notice shall be included in all
		copies or substantial portions of the Software.
		
		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		SOFTWARE.
 */

(function(B, j) {
    var w = function(M, L) {
        return new w.Instance(M, L || {})
    };
    w.defaults = {
        stop_browser_behavior: {
            userSelect: "none",
            touchAction: "none",
            touchCallout: "none",
            contentZooming: "none",
            userDrag: "none",
            tapHighlightColor: "rgba(0,0,0,0)"
        }
    };
    w.HAS_POINTEREVENTS = navigator.pointerEnabled || navigator.msPointerEnabled;
    w.HAS_TOUCHEVENTS = ("ontouchstart" in B);
    w.MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;
    w.NO_MOUSEEVENTS = w.HAS_TOUCHEVENTS && navigator.userAgent.match(w.MOBILE_REGEX);
    w.EVENT_TYPES = {};
    w.DIRECTION_DOWN = "down";
    w.DIRECTION_LEFT = "left";
    w.DIRECTION_UP = "up";
    w.DIRECTION_RIGHT = "right";
    w.POINTER_MOUSE = "mouse";
    w.POINTER_TOUCH = "touch";
    w.POINTER_PEN = "pen";
    w.EVENT_START = "start";
    w.EVENT_MOVE = "move";
    w.EVENT_END = "end";
    w.DOCUMENT = document;
    w.plugins = {};
    w.READY = false;

    function e() {
        if (w.READY) {
            return
        }
        w.event.determineEventTypes();
        for (var L in w.gestures) {
            if (w.gestures.hasOwnProperty(L)) {
                w.detection.register(w.gestures[L])
            }
        }
        w.event.onTouch(w.DOCUMENT, w.EVENT_MOVE, w.detection.detect);
        w.event.onTouch(w.DOCUMENT, w.EVENT_END, w.detection.detect);
        w.READY = true
    }
    w.Instance = function(N, M) {
        var L = this;
        e();
        this.element = N;
        this.enabled = true;
        this.options = w.utils.extend(w.utils.extend({}, w.defaults), M || {});
        if (this.options.stop_browser_behavior) {
            w.utils.stopDefaultBrowserBehavior(this.element, this.options.stop_browser_behavior)
        }
        w.event.onTouch(N, w.EVENT_START, function(O) {
            if (L.enabled) {
                w.detection.startDetect(L, O)
            }
        });
        return this
    };
    w.Instance.prototype = {
        on: function C(M, N) {
            var O = M.split(" ");
            for (var L = 0; L < O.length; L++) {
                this.element.addEventListener(O[L], N, false)
            }
            return this
        },
        off: function o(M, N) {
            var O = M.split(" ");
            for (var L = 0; L < O.length; L++) {
                this.element.removeEventListener(O[L], N, false)
            }
            return this
        },
        trigger: function G(M, O) {
            var N = w.DOCUMENT.createEvent("Event");
            N.initEvent(M, true, true);
            N.gesture = O;
            var L = this.element;
            if (w.utils.hasParent(O.target, L)) {
                L = O.target
            }
            L.dispatchEvent(N);
            return this
        },
        enable: function d(L) {
            this.enabled = L;
            return this
        }
    };
    var F = null;
    var l = false;
    var h = false;
    w.event = {
        bindDom: function(N, P, O) {
            var M = P.split(" ");
            for (var L = 0; L < M.length; L++) {
                N.addEventListener(M[L], O, false)
            }
        },
        onTouch: function z(N, M, O) {
            var L = this;
            this.bindDom(N, w.EVENT_TYPES[M], function P(R) {
                var S = R.type.toLowerCase();
                if (S.match(/mouse/) && h) {
                    return
                } else {
                    if (S.match(/touch/) || S.match(/pointerdown/) || (S.match(/mouse/) && R.which === 1)) {
                        l = true
                    } else {
                        if (S.match(/mouse/) && R.which !== 1) {
                            l = false
                        }
                    }
                }
                if (S.match(/touch|pointer/)) {
                    h = true
                }
                var Q = 0;
                if (l) {
                    if (w.HAS_POINTEREVENTS && M != w.EVENT_END) {
                        Q = w.PointerEvent.updatePointer(M, R)
                    } else {
                        if (S.match(/touch/)) {
                            Q = R.touches.length
                        } else {
                            if (!h) {
                                Q = S.match(/up/) ? 0 : 1
                            }
                        }
                    }
                    if (Q > 0 && M == w.EVENT_END) {
                        M = w.EVENT_MOVE
                    } else {
                        if (!Q) {
                            M = w.EVENT_END
                        }
                    }
                    if (!Q && F !== null) {
                        R = F
                    } else {
                        F = R
                    }
                    O.call(w.detection, L.collectEventData(N, M, R));
                    if (w.HAS_POINTEREVENTS && M == w.EVENT_END) {
                        Q = w.PointerEvent.updatePointer(M, R)
                    }
                }
                if (!Q) {
                    F = null;
                    l = false;
                    h = false;
                    w.PointerEvent.reset()
                }
            })
        },
        determineEventTypes: function E() {
            var L;
            if (w.HAS_POINTEREVENTS) {
                L = w.PointerEvent.getEvents()
            } else {
                if (w.NO_MOUSEEVENTS) {
                    L = ["touchstart", "touchmove", "touchend touchcancel"]
                } else {
                    L = ["touchstart mousedown", "touchmove mousemove", "touchend touchcancel mouseup"]
                }
            }
            w.EVENT_TYPES[w.EVENT_START] = L[0];
            w.EVENT_TYPES[w.EVENT_MOVE] = L[1];
            w.EVENT_TYPES[w.EVENT_END] = L[2]
        },
        getTouchList: function s(L) {
            if (w.HAS_POINTEREVENTS) {
                return w.PointerEvent.getTouchList()
            } else {
                if (L.touches) {
                    return L.touches
                } else {
                    return [{
                        identifier: 1,
                        pageX: L.pageX,
                        pageY: L.pageY,
                        target: L.target
                    }]
                }
            }
        },
        collectEventData: function J(N, M, O) {
            var P = this.getTouchList(O, M);
            var L = w.POINTER_TOUCH;
            if (O.type.match(/mouse/) || w.PointerEvent.matchType(w.POINTER_MOUSE, O)) {
                L = w.POINTER_MOUSE
            }
            return {
                center: w.utils.getCenter(P),
                timeStamp: new Date().getTime(),
                target: O.target,
                touches: P,
                eventType: M,
                pointerType: L,
                srcEvent: O,
                preventDefault: function() {
                    if (this.srcEvent.preventManipulation) {
                        this.srcEvent.preventManipulation()
                    }
                    if (this.srcEvent.preventDefault) {
                        this.srcEvent.preventDefault()
                    }
                },
                stopPropagation: function() {
                    this.srcEvent.stopPropagation()
                },
                stopDetect: function() {
                    return w.detection.stopDetect()
                }
            }
        }
    };
    w.PointerEvent = {
        pointers: {},
        getTouchList: function() {
            var L = this;
            var M = [];
            Object.keys(L.pointers).sort().forEach(function(N) {
                M.push(L.pointers[N])
            });
            return M
        },
        updatePointer: function(M, L) {
            if (M == w.EVENT_END) {
                this.pointers = {}
            } else {
                L.identifier = L.pointerId;
                this.pointers[L.pointerId] = L
            }
            return Object.keys(this.pointers).length
        },
        matchType: function(L, N) {
            if (!N.pointerType) {
                return false
            }
            var M = {};
            M[w.POINTER_MOUSE] = (N.pointerType == N.MSPOINTER_TYPE_MOUSE || N.pointerType == w.POINTER_MOUSE);
            M[w.POINTER_TOUCH] = (N.pointerType == N.MSPOINTER_TYPE_TOUCH || N.pointerType == w.POINTER_TOUCH);
            M[w.POINTER_PEN] = (N.pointerType == N.MSPOINTER_TYPE_PEN || N.pointerType == w.POINTER_PEN);
            return M[L]
        },
        getEvents: function() {
            return ["pointerdown MSPointerDown", "pointermove MSPointerMove", "pointerup pointercancel MSPointerUp MSPointerCancel"]
        },
        reset: function() {
            this.pointers = {}
        }
    };
    w.utils = {
        extend: function i(L, N, O) {
            for (var M in N) {
                if (L[M] !== j && O) {
                    continue
                }
                L[M] = N[M]
            }
            return L
        },
        hasParent: function(M, L) {
            while (M) {
                if (M == L) {
                    return true
                }
                M = M.parentNode
            }
            return false
        },
        getCenter: function x(O) {
            var P = [],
                N = [];
            for (var M = 0, L = O.length; M < L; M++) {
                P.push(O[M].pageX);
                N.push(O[M].pageY)
            }
            return {
                pageX: ((Math.min.apply(Math, P) + Math.max.apply(Math, P)) / 2),
                pageY: ((Math.min.apply(Math, N) + Math.max.apply(Math, N)) / 2)
            }
        },
        getVelocity: function a(L, N, M) {
            return {
                x: Math.abs(N / L) || 0,
                y: Math.abs(M / L) || 0
            }
        },
        getAngle: function n(N, M) {
            var O = M.pageY - N.pageY,
                L = M.pageX - N.pageX;
            return Math.atan2(O, L) * 180 / Math.PI
        },
        getDirection: function k(N, M) {
            var L = Math.abs(N.pageX - M.pageX),
                O = Math.abs(N.pageY - M.pageY);
            if (L >= O) {
                return N.pageX - M.pageX > 0 ? w.DIRECTION_LEFT : w.DIRECTION_RIGHT
            } else {
                return N.pageY - M.pageY > 0 ? w.DIRECTION_UP : w.DIRECTION_DOWN
            }
        },
        getDistance: function m(N, M) {
            var L = M.pageX - N.pageX,
                O = M.pageY - N.pageY;
            return Math.sqrt((L * L) + (O * O))
        },
        getScale: function v(M, L) {
            if (M.length >= 2 && L.length >= 2) {
                return this.getDistance(L[0], L[1]) / this.getDistance(M[0], M[1])
            }
            return 1
        },
        getRotation: function t(M, L) {
            if (M.length >= 2 && L.length >= 2) {
                return this.getAngle(L[1], L[0]) - this.getAngle(M[1], M[0])
            }
            return 0
        },
        isVertical: function A(L) {
            return (L == w.DIRECTION_UP || L == w.DIRECTION_DOWN)
        },
        stopDefaultBrowserBehavior: function c(N, M) {
            var Q, P = ["webkit", "khtml", "moz", "ms", "o", ""];
            if (!M || !N.style) {
                return
            }
            for (var L = 0; L < P.length; L++) {
                for (var O in M) {
                    if (M.hasOwnProperty(O)) {
                        Q = O;
                        if (P[L]) {
                            Q = P[L] + Q.substring(0, 1).toUpperCase() + Q.substring(1)
                        }
                        N.style[Q] = M[O]
                    }
                }
            }
            if (M.userSelect == "none") {
                N.onselectstart = function() {
                    return false
                }
            }
        }
    };
    w.detection = {
        gestures: [],
        current: null,
        previous: null,
        stopped: false,
        startDetect: function y(M, L) {
            if (this.current) {
                return
            }
            this.stopped = false;
            this.current = {
                inst: M,
                startEvent: w.utils.extend({}, L),
                lastEvent: false,
                name: ""
            };
            this.detect(L)
        },
        detect: function q(O) {
            if (!this.current || this.stopped) {
                return
            }
            O = this.extendEventData(O);
            var P = this.current.inst.options;
            for (var N = 0, L = this.gestures.length; N < L; N++) {
                var M = this.gestures[N];
                if (!this.stopped && P[M.name] !== false) {
                    if (M.handler.call(M, O, this.current.inst) === false) {
                        this.stopDetect();
                        break
                    }
                }
            }
            if (this.current) {
                this.current.lastEvent = O
            }
            if (O.eventType == w.EVENT_END && !O.touches.length - 1) {
                this.stopDetect()
            }
            return O
        },
        stopDetect: function b() {
            this.previous = w.utils.extend({}, this.current);
            this.current = null;
            this.stopped = true
        },
        extendEventData: function u(P) {
            var Q = this.current.startEvent;
            if (Q && (P.touches.length != Q.touches.length || P.touches === Q.touches)) {
                Q.touches = [];
                for (var N = 0, L = P.touches.length; N < L; N++) {
                    Q.touches.push(w.utils.extend({}, P.touches[N]))
                }
            }
            var M = P.timeStamp - Q.timeStamp,
                S = P.center.pageX - Q.center.pageX,
                R = P.center.pageY - Q.center.pageY,
                O = w.utils.getVelocity(M, S, R);
            w.utils.extend(P, {
                deltaTime: M,
                deltaX: S,
                deltaY: R,
                velocityX: O.x,
                velocityY: O.y,
                distance: w.utils.getDistance(Q.center, P.center),
                angle: w.utils.getAngle(Q.center, P.center),
                direction: w.utils.getDirection(Q.center, P.center),
                scale: w.utils.getScale(Q.touches, P.touches),
                rotation: w.utils.getRotation(Q.touches, P.touches),
                startEvent: Q
            });
            return P
        },
        register: function f(M) {
            var L = M.defaults || {};
            if (L[M.name] === j) {
                L[M.name] = true
            }
            w.utils.extend(w.defaults, L, true);
            M.index = M.index || 1000;
            this.gestures.push(M);
            this.gestures.sort(function(O, N) {
                if (O.index < N.index) {
                    return -1
                }
                if (O.index > N.index) {
                    return 1
                }
                return 0
            });
            return this.gestures
        }
    };
    w.gestures = w.gestures || {};
    w.gestures.Hold = {
        name: "hold",
        index: 10,
        defaults: {
            hold_timeout: 500,
            hold_threshold: 1
        },
        timer: null,
        handler: function I(L, M) {
            switch (L.eventType) {
                case w.EVENT_START:
                    clearTimeout(this.timer);
                    w.detection.current.name = this.name;
                    this.timer = setTimeout(function() {
                        if (w.detection.current.name == "hold") {
                            M.trigger("hold", L)
                        }
                    }, M.options.hold_timeout);
                    break;
                case w.EVENT_MOVE:
                    if (L.distance > M.options.hold_threshold) {
                        clearTimeout(this.timer)
                    }
                    break;
                case w.EVENT_END:
                    clearTimeout(this.timer);
                    break
            }
        }
    };
    w.gestures.Tap = {
        name: "tap",
        index: 100,
        defaults: {
            tap_max_touchtime: 250,
            tap_max_distance: 10,
            tap_always: true,
            doubletap_distance: 20,
            doubletap_interval: 300
        },
        handler: function D(N, O) {
            if (N.eventType == w.EVENT_END) {
                var M = w.detection.previous,
                    L = false;
                if (N.deltaTime > O.options.tap_max_touchtime || N.distance > O.options.tap_max_distance) {
                    return
                }
                if (M && M.name == "tap" && (N.timeStamp - M.lastEvent.timeStamp) < O.options.doubletap_interval && N.distance < O.options.doubletap_distance) {
                    O.trigger("doubletap", N);
                    L = true
                }
                if (!L || O.options.tap_always) {
                    w.detection.current.name = "tap";
                    O.trigger(w.detection.current.name, N)
                }
            }
        }
    };
    w.gestures.Swipe = {
        name: "swipe",
        index: 40,
        defaults: {
            swipe_max_touches: 1,
            swipe_velocity: 0.7
        },
        handler: function K(L, M) {
            if (L.eventType == w.EVENT_END) {
                if (M.options.swipe_max_touches > 0 && L.touches.length > M.options.swipe_max_touches) {
                    return
                }
                if (L.velocityX > M.options.swipe_velocity || L.velocityY > M.options.swipe_velocity) {
                    M.trigger(this.name, L);
                    M.trigger(this.name + L.direction, L)
                }
            }
        }
    };
    w.gestures.Drag = {
        name: "drag",
        index: 50,
        defaults: {
            drag_min_distance: 10,
            correct_for_drag_min_distance: true,
            drag_max_touches: 1,
            drag_block_horizontal: false,
            drag_block_vertical: false,
            drag_lock_to_axis: false,
            drag_lock_min_distance: 25
        },
        triggered: false,
        handler: function r(M, N) {
            if (w.detection.current.name != this.name && this.triggered) {
                N.trigger(this.name + "end", M);
                this.triggered = false;
                return
            }
            if (N.options.drag_max_touches > 0 && M.touches.length > N.options.drag_max_touches) {
                return
            }
            switch (M.eventType) {
                case w.EVENT_START:
                    this.triggered = false;
                    break;
                case w.EVENT_MOVE:
                    if (M.distance < N.options.drag_min_distance && w.detection.current.name != this.name) {
                        return
                    }
                    if (w.detection.current.name != this.name) {
                        w.detection.current.name = this.name;
                        if (N.options.correct_for_drag_min_distance) {
                            var L = Math.abs(N.options.drag_min_distance / M.distance);
                            w.detection.current.startEvent.center.pageX += M.deltaX * L;
                            w.detection.current.startEvent.center.pageY += M.deltaY * L;
                            M = w.detection.extendEventData(M)
                        }
                    }
                    if (w.detection.current.lastEvent.drag_locked_to_axis || (N.options.drag_lock_to_axis && N.options.drag_lock_min_distance <= M.distance)) {
                        M.drag_locked_to_axis = true
                    }
                    var O = w.detection.current.lastEvent.direction;
                    if (M.drag_locked_to_axis && O !== M.direction) {
                        if (w.utils.isVertical(O)) {
                            M.direction = (M.deltaY < 0) ? w.DIRECTION_UP : w.DIRECTION_DOWN
                        } else {
                            M.direction = (M.deltaX < 0) ? w.DIRECTION_LEFT : w.DIRECTION_RIGHT
                        }
                    }
                    if (!this.triggered) {
                        N.trigger(this.name + "start", M);
                        this.triggered = true
                    }
                    N.trigger(this.name, M);
                    N.trigger(this.name + M.direction, M);
                    if ((N.options.drag_block_vertical && w.utils.isVertical(M.direction)) || (N.options.drag_block_horizontal && !w.utils.isVertical(M.direction))) {
                        M.preventDefault()
                    }
                    break;
                case w.EVENT_END:
                    if (this.triggered) {
                        N.trigger(this.name + "end", M)
                    }
                    this.triggered = false;
                    break
            }
        }
    };
    w.gestures.Transform = {
        name: "transform",
        index: 45,
        defaults: {
            transform_min_scale: 0.01,
            transform_min_rotation: 1,
            transform_always_block: false
        },
        triggered: false,
        handler: function p(N, O) {
            if (w.detection.current.name != this.name && this.triggered) {
                O.trigger(this.name + "end", N);
                this.triggered = false;
                return
            }
            if (N.touches.length < 2) {
                return
            }
            if (O.options.transform_always_block) {
                N.preventDefault()
            }
            switch (N.eventType) {
                case w.EVENT_START:
                    this.triggered = false;
                    break;
                case w.EVENT_MOVE:
                    var M = Math.abs(1 - N.scale);
                    var L = Math.abs(N.rotation);
                    if (M < O.options.transform_min_scale && L < O.options.transform_min_rotation) {
                        return
                    }
                    w.detection.current.name = this.name;
                    if (!this.triggered) {
                        O.trigger(this.name + "start", N);
                        this.triggered = true
                    }
                    O.trigger(this.name, N);
                    if (L > O.options.transform_min_rotation) {
                        O.trigger("rotate", N)
                    }
                    if (M > O.options.transform_min_scale) {
                        O.trigger("pinch", N);
                        O.trigger("pinch" + ((N.scale < 1) ? "in" : "out"), N)
                    }
                    break;
                case w.EVENT_END:
                    if (this.triggered) {
                        O.trigger(this.name + "end", N)
                    }
                    this.triggered = false;
                    break
            }
        }
    };
    w.gestures.Touch = {
        name: "touch",
        index: -Infinity,
        defaults: {
            prevent_default: false,
            prevent_mouseevents: false
        },
        handler: function g(L, M) {
            if (M.options.prevent_mouseevents && L.pointerType == w.POINTER_MOUSE) {
                L.stopDetect();
                return
            }
            if (M.options.prevent_default) {
                L.preventDefault()
            }
            if (L.eventType == w.EVENT_START) {
                M.trigger(this.name, L)
            }
        }
    };
    w.gestures.Release = {
        name: "release",
        index: Infinity,
        handler: function H(L, M) {
            if (L.eventType == w.EVENT_END) {
                M.trigger(this.name, L)
            }
        }
    };
    if (typeof define == "function" && typeof define.amd == "object" && define.amd) {
        B.SaranyuHammer = w;
        define(function() {
            return w
        })
    } else {
        if (typeof module === "object" && typeof module.exports === "object") {
            module.exports = w
        } else {
            B.SaranyuHammer = w
        }
    }
})(this);
(function(a, b) {
    if (a === b) {
        return
    }
    SaranyuHammer.event.bindDom = function(c, e, d) {
        a(c).on(e, function(f) {
            var g = f.originalEvent || f;
            if (g.pageX === b) {
                g.pageX = f.pageX;
                g.pageY = f.pageY
            }
            if (!g.target) {
                g.target = f.target
            }
            if (g.which === b) {
                g.which = g.button
            }
            if (!g.preventDefault) {
                g.preventDefault = f.preventDefault
            }
            if (!g.stopPropagation) {
                g.stopPropagation = f.stopPropagation
            }
            d.call(this, g)
        })
    };
    SaranyuHammer.Instance.prototype.on = function(c, d) {
        return a(this.element).on(c, d)
    };
    SaranyuHammer.Instance.prototype.off = function(c, d) {
        return a(this.element).off(c, d)
    };
    SaranyuHammer.Instance.prototype.trigger = function(c, e) {
        var d = a(this.element);
        if (d.has(e.target).length) {
            d = a(e.target)
        }
        return d.trigger({
            type: c,
            gesture: e
        })
    };
    a.fn.saranyuHammer = function(c) {
        return this.each(function() {
            var d = a(this);
            var e = d.data("saranyuHammer");
            if (!e) {
                d.data("saranyuHammer", new SaranyuHammer(this, c || {}))
            } else {
                if (e && c) {
                    SaranyuHammer.utils.extend(e.options, c)
                }
            }
        })
    }
})(window.jQuery || window.Zepto);
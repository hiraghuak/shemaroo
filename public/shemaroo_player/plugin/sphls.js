var SaranyuHlsHTML5Player = SaranyuHlsHTML5Player || {};
SaranyuHlsHTML5Player.version = "0.0.1", SaranyuHlsHTML5Player.players = [], SaranyuHlsHTML5Player.PLUGIN_NAME = "Saranyu HLS Video Player", SaranyuHlsHTML5Player.debug = !1, SaranyuHlsHTML5Player.inActivityTimeout = 2e3, SaranyuHlsHTML5Player.googleImaSDKURL = "//imasdk.googleapis.com/js/sdkloader/ima3.js", SaranyuHlsHTML5Player.googleImaSDKLoaded = !1, SaranyuHlsHTML5Player.maxNonLinearAdHeight = 150, SaranyuHlsHTML5Player.defaultOptions = {
	debug: "false",
	type: "video",
	autoplay: "true",
	videotitle: "",
	content: "vod",
	maintainaspect: "true",
	titleStrings: {
		pause: "Pause",
		play: "Play",
		replay: "Replay",
		fullscreenText: "Full Screen",
		unFullscreenText: "Exit Fullscreen",
		muteText: "Mute",
		unmuteText: "Unmute",
		socialShare: "Share",
		download: "Download",
		watchLater: "Watch Later",
		favourite: "Favourite",
		videotitle: "VideoTitle",
		swap: "Swap",
		guide: "Guide",
		like: "Like",
		record: "Record",
		stop: "Stop",
		light: "Light",
		playlist: "Playlist",
		multiaudio: "Default",
		subtitles: "OFF"
	}
}, SaranyuHlsHTML5Player.Utils = {
	DLOG: function () {
		SaranyuHlsHTML5Player.debug || console.log(SaranyuHlsHTML5Player.PLUGIN_NAME + ": ", arguments)
	},
	secondsToTimeCode: function (e, t, o, l) {
		void 0 === o ? o = !1 : void 0 === l && (l = 25);
		var a = Math.floor(e / 3600) % 24,
			n = Math.floor(e / 60) % 60,
			i = Math.floor(e % 60),
			r = Math.floor((e % 1 * l).toFixed(3));
		return a = isNaN(a) ? 0 : a, n = isNaN(n) ? 0 : n, i = isNaN(i) ? 0 : i, result = (t || a > 0 ? (a < 10 ? "0" + a : a) + ":" : "") + (n < 10 ? "0" + n : n) + ":" + (i < 10 ? "0" + i : i) + (o ? ":" + (r < 10 ? "0" + r : r) : ""), result
	},
	timeCodeToSeconds: function (e, t, o, l) {
		if (void 0 === o ? o = !1 : void 0 === l && (l = 25), e)
			if (e) {
				var a = e.split(":"),
					n = 0;
				3 == a.length ? n = 60 * Number(a[0]) * 60 + 60 * Number(a[1]) + Number(a[2]) : 2 == a.length && (n = 60 * Number(a[0]) + Number(a[1]))
			} else n = 0;
		return n
	},
	getWidthInPercentage: function (e) {
		var t = e.parent();
		return (e.width() / t.width() * 100).toFixed(0) + "%"
	},
	getHeightInPercentage: function (e) {
		var t = e.parent();
		return (e.height() / t.height() * 100).toFixed(0) + "%"
	},
	preventSelectionOfTextInMouseMove: function (e) {
		return e.stopPropagation && e.stopPropagation(), e.preventDefault && e.preventDefault(), e.cancelBubble = !0, e.returnValue = !1, e
	},
	getPercentageForGivenDuration: function (e, t) {
		return e / t * 100
	}
}, SaranyuHlsHTML5Player.MediaFeatures = {
	init: function () {
		window.navigator, navigator.userAgent.toLowerCase()
	}
}, SaranyuHlsHTML5Player.MediaFeatures.init(), SaranyuHlsHTML5Player.MediaPlayer = function (e, t, o) {
	SaranyuHlsHTML5Player.Utils.DLOG("Constructor", e, t);
	var l = this;
	l.masterElementid = e, l.options = t, l.playerType = o, l.$masterContainer = $(e), l._validateParams(t), l.init()
}, SaranyuHlsHTML5Player.MediaPlayer.prototype = {
	_validateParams: function (e) {
		e.type ? (SaranyuHlsHTML5Player.Utils.DLOG("Media Type present. Check if its valid"), $.inArray(e.type, SaranyuHlsHTML5Player.MediaTypes) > -1 ? (SaranyuHlsHTML5Player.Utils.DLOG("Valid Media Types"), e.file ? SaranyuHlsHTML5Player.Utils.DLOG("File Info Present") : SaranyuHlsHTML5Player.Utils.DLOG("File Information Not present")) : SaranyuHlsHTML5Player.Utils.DLOG("Unknown Media Type")) : SaranyuHlsHTML5Player.Utils.DLOG("Media Type Not present")
	},
	init: function () {
		var e = this;
		SaranyuHlsHTML5Player.Utils.DLOG("Init Function", e, e.options, e.$masterContainer), e.container = $('<div class="sp-main-container-wrapper"><div class="sp-main-container"><div class="sp-player-inner"><div class="sp-ad-container"></div><div class="sp-media-element"></div><div class="sp-player-layers"></div><div class="sp-full-controls"></div></div></div></div>').appendTo(e.$masterContainer), e.mainContainerWrapper = e.container.find(".sp-main-container-wrapper"), e.mainContainer = e.container.find(".sp-main-container"), e.playerInner = e.container.find(".sp-player-inner"), e.adContainer = e.container.find(".sp-ad-container"), e.mediaElement = e.container.find(".sp-media-element"), e.playerLayers = e.container.find(".sp-player-layers"), e.fullControls = e.container.find(".sp-full-controls"), e._createMediaElement(), e._createFullControls(), e._createIndividualControls(), e._createAndAppendHLStoPlayer(e.options.file[0]), e._hideControlsUnderInactivity(), e._createCustomContextmenu()
	},
	_createMediaElement: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("_createMediaElement function being called");
		var e = this.mediaElement;
		e.append("<video></video>"), this.mediaElement.videoElement = e.find("video")[0]
	},
	_createFullControls: function () {
		var e = this;
		e.fullControls.append('<div class="sp-controls-top"></div>'), e.fullControls.topContolbar = e.fullControls.find(".sp-controls-top"), e.fullControls.append('<div class="sp-controls-middle"></div>'), e.fullControls.middleControlbar = e.fullControls.find(".sp-controls-middle"), e.fullControls.append('<div class="sp-controls-bottom1"></div>'), e.fullControls.bottomControlBar1 = e.fullControls.find(".sp-controls-bottom1"), e.fullControls.append('<div class="sp-controls-bottom"></div>'), e.fullControls.bottomControlBar = e.fullControls.find(".sp-controls-bottom"), e.fullControls.bottomControlBar1.append('<div class="sp-controls-bottom-progress-bar"></div>'), e.fullControls.bottomControlBar1.bottomProgressBar = e.fullControls.find(".sp-controls-bottom-progress-bar"), e.fullControls.bottomControlBar.append('<div class="sp-controls-bottom-plyr-controls"></div>'), e.fullControls.bottomControlBar.bottomPlayerControls = e.fullControls.find(".sp-controls-bottom-plyr-controls"), e._createFullControls.hideFullControls = function () {
			e.fullControls.hide();
			try {
				e._buildadvertisement.initializeAd.adStarted && !e._buildadvertisement.initializeAd.isLinear && e.adContainer.removeClass("sp-playlist-show")
			} catch (e) {}
		}, e._createFullControls.showFullControls = function () {
			e.fullControls.show();
			try {
				if (e.fullControls.playlistPanel.is(":visible")) try {
					e._buildadvertisement.initializeAd.adStarted && !e._buildadvertisement.initializeAd.isLinear && e.adContainer.addClass("sp-playlist-show")
				} catch (e) {}
			} catch (e) {}
			try {
				var t = e.mediaElement.videoElement,
					o = t.currentTime / t.duration;
				e._buildprogressbar.adjustCurrentAndHandleInSeek(o)
			} catch (e) {}
		}
	},
	_createIndividualControls: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("_createcontrols function being called");
		var e = this.options.features;
		SaranyuHlsHTML5Player.Utils.DLOG("options pass is " + e);
		for (featureIndex in e) feature = e[featureIndex], this["_build" + feature] && this["_build" + feature]()
	},
	_createAndAppendHLStoPlayer: function (e) {
		var t = this,
			o = t.mediaElement.videoElement,
			l = e.content_url,
			a = t.options;
		t.mediaElement.videoElement.hlsObj && t.mediaElement.videoElement.hlsObj.destroy(), t._createAndAppendHLStoPlayer._attachHLStoVideo = function () {
			Hls.isSupported() ? (t.mediaElement.videoElement.saranyuHlsMertics = {}, t.mediaElement.videoElement.saranyuHlsMertics.playbackRateOld = o.playbackRate, t.mediaElement.videoElement.hlsObj = new Hls, t.mediaElement.videoElement.hlsObj.loadSource(l), t.mediaElement.videoElement.hlsObj.attachMedia(o), t.mediaElement.videoElement.mediaId = e.mediaid, o.playbackRate = t.mediaElement.videoElement.saranyuHlsMertics.playbackRateOld, t.mediaElement.videoElement.hlsObj.on(Hls.Events.MANIFEST_PARSED, function () {
				if ("true" === a.autoplay || !0 === a.autoplay) {
					console.log("hls manifest parsed so play now");
					var e = Number(a.seekonload);
					e > 0 ? setTimeout(function () {
						t._videoPlayerControls("seek", e)
					}.bind(t), 2e3) : (o.play(), t._hideControlsUnderInactivityFirstLaunch())
				}
				t.options.features.includes("qualityswitch") && t._buildqualityswitch._buildQualityPopup(t.mediaElement.videoElement.hlsObj.levels)
			}), t.mediaElement.videoElement.hlsObj.on(Hls.Events.MANIFEST_PARSED, function () {
				if (1 == t.mediaElement.videoElement.hlsObj.levels.length) t.mediaElement.videoElement.hlsObj.startLevel = 0;
				else {
					var e = t.mediaElement.videoElement.hlsObj.levels.length - 1,
						o = Math.floor(e / 2);
					t.mediaElement.videoElement.hlsObj.startLevel = o
				}
				t.mediaElement.videoElement.hlsObj.startLoad()
			}), t.mediaElement.videoElement.hlsObj.on(Hls.Events.AUDIO_TRACKS_UPDATED, function (e, o) {
				t.options.features.includes("multiaudio") && t._buildmultiaudio._buildMultiaudioPopup(t.mediaElement.videoElement.hlsObj.audioTracks)
			}), t.mediaElement.videoElement.hlsObj.on(Hls.Events.LEVEL_LOADED, function (e, o) {
				t.mediaElement.videoElement.saranyuHlsMertics = o.details, t.mediaElement.videoElement.saranyuHlsMertics.islive = o.details.live
			})) : SaranyuHlsHTML5Player.Utils.DLOG("MSE (Media Source Extension) is not supported in Your Browser")
		}, !t._isSupportedMSE() && t._checkHLS() ? (t.mediaElement.videoElement.src = l, t.mediaElement.videoElement.mediaId = e.mediaid, o.play()) : "mp4" == t.playerType ? (t.mediaElement.videoElement.src = l, t.mediaElement.videoElement.mediaId = e.mediaid, o.play()) : t._createAndAppendHLStoPlayer._attachHLStoVideo();
		try {
			t.fullControls.topContolbar.videoTitle.changeTitle(e.videotitle)
		} catch (e) {}
		try {
			t.playerLayers.poster.changePoster(e.poster)
		} catch (e) {}
		t.options.features.includes("subtitles") && t._buildsubtitles._buildSubtitlesPopup(), t.playerInner.trigger("mousemove")
	},
	_hideControlsUnderInactivityFirstLaunch: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("Attaching logic of hiding controls when there is no user interactivity");
		var e = this,
			t = e.mediaElement.videoElement;
		e.counterToCheckInActivity, e._createFullControls.showFullControls(), clearTimeout(e.counterToCheckInActivity), "true" == e.options.hideControlsWhenInactive && (e.counterToCheckInActivity = setTimeout(function () {
			e.fullControls.is(":visible") && !t.paused && (e._createFullControls.hideFullControls(), SaranyuHlsHTML5Player.Utils.DLOG("hiding controls because there is no user activity from " + SaranyuHlsHTML5Player.inActivityTimeout + " ms"))
		}, SaranyuHlsHTML5Player.inActivityTimeout))
	},
	_hideControlsUnderInactivity: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("Attaching logic of hiding controls when there is no user interactivity");
		var e = this,
			t = e.mediaElement.videoElement;
		e.counterToCheckInActivity, e.playerInner.on("mousemove mouseenter mouseover", function (o) {
			e._createFullControls.showFullControls(), clearTimeout(e.counterToCheckInActivity), "true" == e.options.hideControlsWhenInactive && (e.counterToCheckInActivity = setTimeout(function () {
				e.fullControls.is(":visible") && !t.paused && (e._createFullControls.hideFullControls(), SaranyuHlsHTML5Player.Utils.DLOG("hiding controls because there is no user activity from " + SaranyuHlsHTML5Player.inActivityTimeout + " ms"))
			}, SaranyuHlsHTML5Player.inActivityTimeout))
		}.bind(e, t))
	},
	_createCustomContextmenu: function () {
		try {
			SaranyuHlsHTML5Player.Utils.DLOG("Attaching custom context menu");
			var e = this;
			e.playerInner.contextmenu(function (t) {
				t.preventDefault(), SaranyuHlsHTML5Player.Utils.DLOG("Right Clicked on player"), e.playerLayers.feedbackTextElement.html("Player Developed by <br> Saranyu Technologies Pvt Ltd").stop(!1, !0).show().fadeOut(3500)
			})
		} catch (e) {}
	},
	_buildplaypause: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("Attaching play pause icon");
		var e = this,
			t = e.mediaElement.videoElement;
		e.fullControls.middleControlbar.append('<div class="sp-button sp-play-pause sp-play"><span class="tooltiptext"></span><button class="sp-play-pause-btn"></button></div>'), e.fullControls.middleControlbar.saranyuPlaypause = e.fullControls.middleControlbar.find(".sp-button.sp-play-pause.sp-play"), e.fullControls.middleControlbar.saranyuPlaypause.tooltip = e.fullControls.middleControlbar.saranyuPlaypause.find(".tooltiptext"), e.fullControls.middleControlbar.saranyuPlaypause.click(function (o) {
			SaranyuHlsHTML5Player.Utils.DLOG("Clicked on Play Pause Icon"), o.preventDefault(), t.paused ? e._videoPlayerControls("play") : e._videoPlayerControls("pause"), t.ended && e._videoPlayerControls("seek", 0), document.activeElement.blur(), t.focus()
		}), t.addEventListener("play", function () {
			try {
				SaranyuHlsHTML5Player.Utils.DLOG("Play triggered"), e.fullControls.middleControlbar.saranyuPlaypause.addClass("sp-play"), e.fullControls.middleControlbar.saranyuPlaypause.removeClass("sp-pause"), e.fullControls.middleControlbar.saranyuPlaypause.removeClass("sp-replay"), e.fullControls.middleControlbar.saranyuPlaypause.tooltip.html(SaranyuHlsHTML5Player.defaultOptions.titleStrings.pause)
			} catch (e) {}
		}, !1), t.addEventListener("pause", function () {
			try {
				if (console.log((new Date).getTime() - e._buildqualityswitch.lastQualityChangeAt), (new Date).getTime() - e._buildqualityswitch.lastQualityChangeAt < 1e3) return console.log("last time when quality changed was below 1s"), !0
			} catch (e) {}
			try {
				SaranyuHlsHTML5Player.Utils.DLOG("Pause triggered"), e.fullControls.middleControlbar.saranyuPlaypause.addClass("sp-pause"), e.fullControls.middleControlbar.saranyuPlaypause.removeClass("sp-play"), e.fullControls.middleControlbar.saranyuPlaypause.removeClass("sp-replay"), e.fullControls.middleControlbar.saranyuPlaypause.tooltip.html(SaranyuHlsHTML5Player.defaultOptions.titleStrings.play)
			} catch (e) {}
		}, !1), t.addEventListener("ended", function () {
			try {
				SaranyuHlsHTML5Player.Utils.DLOG("Re-Play triggered"), e.fullControls.middleControlbar.saranyuPlaypause.addClass("sp-replay"), e.fullControls.middleControlbar.saranyuPlaypause.removeClass("sp-play"), e.fullControls.middleControlbar.saranyuPlaypause.removeClass("sp-pause"), e.fullControls.middleControlbar.saranyuPlaypause.tooltip.html(SaranyuHlsHTML5Player.defaultOptions.titleStrings.replay), e._createFullControls.showFullControls()
			} catch (e) {}
		}, !1), "false" == e.options.autoplay && (e.fullControls.middleControlbar.saranyuPlaypause.addClass("sp-pause"), e.fullControls.middleControlbar.saranyuPlaypause.removeClass("sp-play"), e.fullControls.middleControlbar.saranyuPlaypause.removeClass("sp-replay"), e.fullControls.middleControlbar.saranyuPlaypause.tooltip.html(SaranyuHlsHTML5Player.defaultOptions.titleStrings.play))
	},
	_buildforward: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("Attaching forward icon");
		var e = this;
		e.mediaElement.videoElement, e.fullControls.middleControlbar.append('<div class="sp-button sp-forward"><span class="tooltiptext"></span><button class="sp-forward-btn"></button></div>'), e.fullControls.middleControlbar.saranyuForward = e.fullControls.middleControlbar.find(".sp-button.sp-forward"), e.fullControls.middleControlbar.saranyuForward.tooltip = e.fullControls.middleControlbar.saranyuForward.find(".tooltiptext"), e.fullControls.middleControlbar.saranyuForward.tooltip.html("+10"), e.fullControls.middleControlbar.saranyuForward.click(function (t) {
			SaranyuHlsHTML5Player.Utils.DLOG("Clicked on Play Pause Icon"), t.preventDefault(), e.mediaElement.videoElement.currentTime + 10 < e.mediaElement.videoElement.duration && (e.mediaElement.videoElement.currentTime += 10)
		}.bind(e))
	},
	_buildrewind: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("Attaching rewind icon");
		var e = this;
		e.mediaElement.videoElement, e.fullControls.middleControlbar.append('<div class="sp-button sp-rewind"><span class="tooltiptext"></span><button class="sp-rewind-btn"></button></div>'), e.fullControls.middleControlbar.saranyuRewind = e.fullControls.middleControlbar.find(".sp-button.sp-rewind"), e.fullControls.middleControlbar.saranyuRewind.tooltip = e.fullControls.middleControlbar.saranyuRewind.find(".tooltiptext"), e.fullControls.middleControlbar.saranyuRewind.tooltip.html("-10"), e.fullControls.middleControlbar.saranyuRewind.click(function (t) {
			SaranyuHlsHTML5Player.Utils.DLOG("Clicked on Play Pause Icon"), t.preventDefault(), e.mediaElement.videoElement.currentTime - 10 >= 0 ? e.mediaElement.videoElement.currentTime -= 10 : e.mediaElement.videoElement.currentTime = 0
		}.bind(e))
	},
	_buildvolume: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("Attaching volume icon and volume seekbar");
		var e = this,
			t = e.mediaElement.videoElement,
			o = e.options,
			l = '<div class="sp-button sp-volume-btn-wrap sp-unmute"><span class="tooltiptext" style="display:none;">' + SaranyuHlsHTML5Player.defaultOptions.titleStrings.muteText + '</span><button id="sp-volume-btn1" class="sp-volume-btn"></button></div>';
		e.fullControls.bottomControlBar.bottomPlayerControls.append(l), e.fullControls.bottomControlBar.bottomPlayerControls.volumebtn = e.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-button.sp-volume-btn-wrap"), e.fullControls.bottomControlBar.bottomPlayerControls.volumebtn.tooltip = e.fullControls.bottomControlBar.bottomPlayerControls.volumebtn.find(".tooltiptext"), e.fullControls.bottomControlBar.bottomPlayerControls.volumebtn.append('<div class="sp-volume-slider sp-volume-slider-wrap"><div class="sp-volume-current"></div><div class="sp-volume-handle"><span class="tooltiptext" style="display:none;" ></span></div></div>'), e.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider = e.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-volume-slider.sp-volume-slider-wrap"), e.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.volumeCurrent = e.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.find(".sp-volume-current"), e.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.volumeHandle = e.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.find(".sp-volume-handle"), e.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.volumeHandle.tooltip = e.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.volumeHandle.find(".tooltiptext"), e.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.writeToVolumeHandleTooltip = function () {
			e.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.volumeHandle.tooltip.html(SaranyuHlsHTML5Player.Utils.getWidthInPercentage(e.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.volumeCurrent))
		}, e.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.positionVolumeHandle = function (t) {
			console.log(t), e.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.volumeCurrent.css("width", 100 * t + "%"), e.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.volumeCurrent.css("right", 100 * (1 - t) + "%"), e.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.volumeHandle.css("right", "calc(" + (100 - 100 * t) + "% - " + e.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.volumeHandle.width() / 2 + "px)"), e.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.volumeHandle.css("left", "unset"), e.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.writeToVolumeHandleTooltip()
		}, e.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.handleVolumeMove = function (t) {
			var o = null,
				l = e.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider,
				a = l.offset().left,
				n = l.width();
			i = t.pageX - a, console.log(n), o = i / n, o = Math.max(0, o), o = Math.min(o, 1), e.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.positionVolumeHandle(o), e._videoPlayerControls("volumechange", o)
		}, e.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.writeToVolumeHandleTooltip(), t.addEventListener("volumechange", function () {
			try {
				SaranyuHlsHTML5Player.Utils.DLOG("volume change triggered"), t.muted ? (e.fullControls.bottomControlBar.bottomPlayerControls.volumebtn.addClass("sp-mute"), e.fullControls.bottomControlBar.bottomPlayerControls.volumebtn.removeClass("sp-unmute"), e.fullControls.bottomControlBar.bottomPlayerControls.addClass("mute_add"), e.fullControls.bottomControlBar.bottomPlayerControls.removeClass("mute_remove"), e.fullControls.bottomControlBar.bottomPlayerControls.volumebtn.tooltip.html(SaranyuHlsHTML5Player.defaultOptions.titleStrings.unmuteText), e.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.hide(), e.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.writeToVolumeHandleTooltip()) : (e.fullControls.bottomControlBar.bottomPlayerControls.volumebtn.addClass("sp-unmute"), e.fullControls.bottomControlBar.bottomPlayerControls.volumebtn.removeClass("sp-mute"), e.fullControls.bottomControlBar.bottomPlayerControls.addClass("mute_remove"), e.fullControls.bottomControlBar.bottomPlayerControls.removeClass("mute_add"), e.fullControls.bottomControlBar.bottomPlayerControls.volumebtn.tooltip.html(SaranyuHlsHTML5Player.defaultOptions.titleStrings.muteText), e.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.show(), e.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.writeToVolumeHandleTooltip())
			} catch (e) {}
		}, !1), e.fullControls.bottomControlBar.bottomPlayerControls.volumebtn.click(function (o) {
			console.log("SDfdsff"), SaranyuHlsHTML5Player.Utils.DLOG("Clicked on volume button"), o.preventDefault(), "sp-volume-slider sp-volume-slider-wrap" != o.target.className && (t.muted ? e._videoPlayerControls("unmute") : e._videoPlayerControls("mute"))
		}), e.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.bind("mouseover", function (t) {
			t = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(t), e.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.mouseIsOver = !0
		}).bind("mousemove", function (t) {
			t = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(t), e.playerInner.trigger("mousemove"), 1 == e.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.mouseIsDown && e.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.handleVolumeMove(t)
		}).bind("mouseup", function (t) {
			t = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(t), e.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.mouseIsDown = !1
		}).bind("mousedown", function (t) {
			t = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(t), e.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.handleVolumeMove(t), e.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.mouseIsDown = !0
		}).bind("mouseleave", function (t) {
			t = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(t), e.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.mouseIsDown = !1
		}), "true" !== o.mute && 1 != o.mute || (e._videoPlayerControls("mute"), e.fullControls.bottomControlBar.bottomPlayerControls.volumebtn.addClass("sp-mute"), e.fullControls.bottomControlBar.bottomPlayerControls.volumebtn.removeClass("sp-unmute"), e.fullControls.bottomControlBar.bottomPlayerControls.volumebtn.tooltip.html(SaranyuHlsHTML5Player.defaultOptions.titleStrings.unmuteText), e.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.hide()), $(e.fullControls.bottomControlBar.bottomPlayerControls.volumebtn).hover(function () {
			t.muted
		}, function () {
			$(e.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider).is(":hover")
		}), $(e.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider).hover(function () {
			t.muted || e.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.show()
		}, function () {
			$(e.fullControls.bottomControlBar.bottomPlayerControls.volumebtn).is(":hover")
		})
	},
	_buildprogressbar: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("Attaching progressbar");
		var e = this,
			t = e.mediaElement.videoElement;

		function o(o) {
			try {
				var l, a = e.fullControls.bottomControlBar1.bottomProgressBar.progressbar,
					n = a.offset(),
					i = a.width(),
					r = o.pageX - n.left;
				percentage = r / i;
				var s, d, u, m, p = 100 * percentage + "%";
				if ((l = percentage * t.duration) < 0 || l > t.duration || isNaN(l)) return void e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.timefloat.show();
				e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.timefloat.html(SaranyuHlsHTML5Player.Utils.secondsToTimeCode(l)), e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.timefloat.css("left", p), e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.timefloat.show();
				var b = 0;
				if (s = e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.timefloat.offset().left, (d = e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.timefloat.outerWidth()) + s > (u = e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.offset().left) + (m = e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.outerWidth()) && (b = m - d, e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.timefloat.css("left", b + "px"), e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.timefloat.show()), e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.parseAndCalculateCordinates.thumbnailsMetaData) {
					var C, c;
					e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.renderingThumbnailPreview(l), e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.css("left", p), e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.show();
					var v = 0;
					C = e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.offset().left, (c = e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.outerWidth()) + C > u + m && (v = m - c, e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.css("left", v + "px"), e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.show())
				}
			} catch (o) {}
		}

		function l() {
			e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.timefloat.hide(), e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.hide()
		}

		function a(l) {
			var a, n = e.fullControls.bottomControlBar1.bottomProgressBar.progressbar,
				i = n.offset(),
				r = n.width(),
				s = l.pageX - i.left;
			percentage = s / r, (a = percentage * t.duration) < 0 || a > t.duration || isNaN(a) || (t.ended && t.paused && (e.fullControls.bottomControlBar1.bottomPlayerControls.saranyuPlaypause.addClass("sp-pause"), e.fullControls.bottomControlBar1.bottomPlayerControls.saranyuPlaypause.removeClass("sp-play"), e.fullControls.bottomControlBar1.bottomPlayerControls.saranyuPlaypause.removeClass("sp-replay"), e.fullControls.bottomControlBar1.bottomPlayerControls.saranyuPlaypause.tooltip.html(SaranyuHlsHTML5Player.defaultOptions.titleStrings.play), e.playerLayers.bigreplay.hide(), e.playerLayers.bigplay.show()), e._videoPlayerControls("seek", a), e._buildprogressbar.adjustCurrentAndHandleInSeek(percentage), o(l))
		}
		e.fullControls.bottomControlBar1.append('<div class="sp-progress-bar-time-rail"><span class="sp-progress-bar-buffering"></span><span class="sp-progress-bar-loaded"></span><span class="sp-progress-bar-current"></span><span class="sp-progress-bar-cues"></span><span class="sp-progress-bar-handle"></span><span class="sp-progress-bar-timefloat"></span><span class="sp-progress-bar-seekbar-preview"></span></div>'), console.log(e), e.fullControls.bottomControlBar1.bottomProgressBar.progressbar = e.fullControls.bottomControlBar1.find(".sp-progress-bar-time-rail"), e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.buffering = e.fullControls.bottomControlBar1.find(".sp-progress-bar-buffering"), e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.loaded = e.fullControls.bottomControlBar1.find(".sp-progress-bar-loaded"), e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.current = e.fullControls.bottomControlBar1.find(".sp-progress-bar-current"), e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.handle = e.fullControls.bottomControlBar1.find(".sp-progress-bar-handle"), e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.timefloat = e.fullControls.bottomControlBar1.find(".sp-progress-bar-timefloat"), e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer = e.fullControls.bottomControlBar1.find(".sp-progress-bar-seekbar-preview"), e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.cues = e.fullControls.bottomControlBar1.find(".sp-progress-bar-cues"), e._buildprogressbar.adjustCurrentAndHandleInSeek = function (t) {
			if (!(t < 0 || t > 1)) {
				var o, l, a, n, i = 100 * t + "%",
					r = e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.handle.width() / 2;
				if (e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.current.width(i), e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.handle.css("left", "calc(" + i + " - " + r + "px)"), o = e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.handle.offset().left, l = e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.handle.width(), a = e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.offset().left, n = e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.width(), o < a) {
					var s = 0;
					e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.handle.css("left", s + "px")
				} else l + o > a + n && (s = n - l, r = e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.handle.width(), e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.handle.css("left", "calc(" + i + " - " + r + "px)"))
			}
		}, e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.bind("mouseover", function (t) {
			o(t), t = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(t), e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.mouseIsOver = !0
		}).bind("mousemove", function (t) {
			o(t), t = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(t), 1 == e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.mouseIsDown && a(t)
		}).bind("mouseup", function (t) {
			t = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(t), e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.mouseIsDown = !1
		}).bind("mousedown", function (t) {
			a(t = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(t)), e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.mouseIsDown = !0
		}).bind("mouseleave", function (t) {
			l(), t = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(t), e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.mouseIsDown = !1
		}), e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.handle.saranyuHammer({
			drag_max_touches: 0
		}).on("touch drag", function (t) {
			var l = t.gesture.touches;
			t.gesture.preventDefault(), o(t);
			for (var n = 0, i = l.length; n < i; n++) e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.handle.mouseIsDown = !0, a(l[n])
		}).on("release", function (t) {
			a(t), e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.handle.mouseIsDown = !1, l()
		}).on("mouseleave", function (t) {
			e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.handle.mouseIsDown = !1
		}), t.addEventListener("timeupdate", function (t) {
			var o = e.mediaElement.videoElement,
				l = o.currentTime / o.duration;
			e._buildprogressbar.adjustCurrentAndHandleInSeek(l)
		}.bind(e)), t.addEventListener("progress", function (t) {
			for (var o, l = e.mediaElement.videoElement, a = 0, n = 0; n < l.buffered.length; n++) l.currentTime >= l.buffered.start(n) && l.currentTime <= l.buffered.end(n) && (a = l.buffered.end(n) / l.duration);
			o = a, e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.loaded.width(100 * o + "%")
		}.bind(e)), e._buildprogressbar.resizeOfProgressBarWrap = function () {
			var t = 25;
			$(e.fullControls.bottomControlBar1.bottomPlayerControls).children().each(function (e, o) {
				"sp-progress-bar-time-rail" != $(o).attr("class") && (t += Math.ceil($(o).outerWidth()))
			}), $(e.fullControls.bottomControlBar1.bottomProgressBar.progressbar).css("maxWidth", Math.floor(Math.floor($(e.fullControls.bottomControlBar1).width() + 26) - Math.ceil(t)))
		}.bind(e), document.addEventListener("fullscreenchange", function () {
			clearInterval(e._buildprogressbar.resizeOfProgressBarWrap.timer1), e._buildprogressbar.resizeOfProgressBarWrap.timer1 = setInterval(function () {
				e._buildprogressbar.resizeOfProgressBarWrap()
			}.bind(e), 100)
		}.bind(e), !1), document.addEventListener("webkitfullscreenchange", function () {
			clearInterval(e._buildprogressbar.resizeOfProgressBarWrap.timer1), e._buildprogressbar.resizeOfProgressBarWrap.timer1 = setInterval(function () {
				e._buildprogressbar.resizeOfProgressBarWrap()
			}.bind(e), 100)
		}.bind(e), !1), document.addEventListener("mozfullscreenchange", function () {
			clearInterval(e._buildprogressbar.resizeOfProgressBarWrap.timer1), e._buildprogressbar.resizeOfProgressBarWrap.timer1 = setInterval(function () {
				e._buildprogressbar.resizeOfProgressBarWrap()
			}.bind(e), 100)
		}.bind(e), !1), $(window).resize(function () {
			clearInterval(e._buildprogressbar.resizeOfProgressBarWrap.timer1), e._buildprogressbar.resizeOfProgressBarWrap.timer1 = setInterval(function () {
				e._buildprogressbar.resizeOfProgressBarWrap()
			}.bind(e), 100)
		}.bind(e)), e._buildprogressbar.resizeOfProgressBarWrap(), e._buildprogressbar.resizeOfProgressBarWrap.timer1 = setInterval(function () {
			e._buildprogressbar.resizeOfProgressBarWrap()
		}.bind(e), 100), setTimeout(function () {
			clearInterval(e._buildprogressbar.resizeOfProgressBarWrap.timer1)
		}.bind(e), 5e3)
	},
	_buildseekbarpreview: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("Attaching seekbar preview");
		var e = this;
		e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.append('<img class="sp-progress-bar-seekbar-preview-img" />'), e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.seekbarPreviewContainerImgTag = e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.find(".sp-progress-bar-seekbar-preview-img"), e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.parseAndCalculateCordinates = function (t) {
			if (e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.parseAndCalculateCordinates.thumbnailsMetaData = [], "" != t) {
				var o = t.split("\n\r\n");
				o.length <= 1 && (o = t.split("\n\n")), $.each(o, function (t, l) {
					var a, n, i, r, s, d, u = o[t].split("\n");
					if (void 0 != u[0] && "" != u[0] && "webvtt" != u[0].toLowerCase()) {
						var m = u[0].split("--\x3e");
						a = SaranyuHlsHTML5Player.Utils.timeCodeToSeconds(m[0]), n = SaranyuHlsHTML5Player.Utils.timeCodeToSeconds(m[1])
					}
					if (void 0 != u[1] && "" != u[1] && "webvtt" != u[1].toLowerCase()) {
						var p = u[1].split("#");
						d = p[0];
						var b = p[1].split("=")[1].split(",");
						r = "-" + b[0] + "px", s = "-" + b[1] + "px", i = b[2] + "px";
						var C = {
							startTime: a,
							endTime: n,
							imgxPos: r,
							imgyPos: s,
							imgHeight: b[3] + "px",
							imgWidth: i,
							imgSrc: d
						};
						e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.parseAndCalculateCordinates.thumbnailsMetaData.push(C)
					}
				})
			}
		}, e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.ajaxForVtt = function (t) {
			e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.ajaxForVtt.abort = function () {
				e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.ajax.abort()
			};
			try {
				e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.ajaxForVtt.abort()
			} catch (e) {}
			e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.ajax = $.ajax({
				type: "GET",
				url: t
			}).done(function (t) {
				e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.parseAndCalculateCordinates(t)
			}.bind(e))
		}, e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.renderingThumbnailPreview = function (t) {
			e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.parseAndCalculateCordinates.thumbnailsMetaData.length > 1 && $.each(e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.parseAndCalculateCordinates.thumbnailsMetaData, function (o, l) {
				t >= l.startTime && t <= l.endTime && ($(e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.seekbarPreviewContainerImgTag).attr("src", l.imgSrc), $(e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.seekbarPreviewContainerImgTag).css("height", l.imgHeight), $(e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.seekbarPreviewContainerImgTag).css("width", l.imgWidth), $(e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.seekbarPreviewContainerImgTag).css("object-position", l.imgxPos + " " + l.imgyPos))
			})
		}, e.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.ajaxForVtt(e.options.file[0].thumbnails)
	},
	_buildfullscreen: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("Attaching fullscreen icon");
		var e = this;
		e.isFullScreen = !1;
		var t = '<div class="sp-button sp-fullscreen-unfullscreen sp-fullscreen"><span class="tooltiptext">' + SaranyuHlsHTML5Player.defaultOptions.titleStrings.fullscreenText + '</span><button class="sp-fullscreen-btn"></button></div>';
		e.fullControls.bottomControlBar.bottomPlayerControls.append(t), e.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen = e.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-button.sp-fullscreen-unfullscreen"), e.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.tooltip = e.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.find(".tooltiptext"), e.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.fullScreenChanges = function () {
			e.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.addClass("sp-unfullscreen"), e.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.removeClass("sp-fullscreen"), e.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.tooltip.html(SaranyuHlsHTML5Player.defaultOptions.titleStrings.unFullscreenText)
		}, e.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.unFullScreenChanges = function () {
			e.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.addClass("sp-fullscreen"), e.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.removeClass("sp-unfullscreen"), e.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.tooltip.html(SaranyuHlsHTML5Player.defaultOptions.titleStrings.fullscreenText), e.playerInner.trigger("mousemove")
		}, e.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.launchIntoFullscreen = function () {
			var t = e.playerInner[0];
			t.requestFullscreen ? t.requestFullscreen() : t.mozRequestFullScreen ? t.mozRequestFullScreen() : t.webkitRequestFullscreen ? t.webkitRequestFullscreen() : t.msRequestFullscreen && t.msRequestFullscreen()
		}, e.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.exitFullscreen = function (e) {
			document.exitFullscreen ? document.exitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitExitFullscreen && document.webkitExitFullscreen()
		}, e.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.toggleFullscreen = function () {
			e.isFullScreen ? (SaranyuHlsHTML5Player.Utils.DLOG("Exit FullScreen Mode"), e.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.exitFullscreen(), e.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.unFullScreenChanges(), e.playerInner.removeClass("sp-is-fullscreen"), e.isFullScreen = !1) : (SaranyuHlsHTML5Player.Utils.DLOG("FullScreen Mode"), e.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.launchIntoFullscreen(), e.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.fullScreenChanges(), e.playerInner.addClass("sp-is-fullscreen"), e.isFullScreen = !0)
		}, e.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.click(function (t) {
			t.preventDefault(), SaranyuHlsHTML5Player.Utils.DLOG("Clicked on FullScreen"), e.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.toggleFullscreen()
		}), $(document).on("webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange", function () {
			setTimeout(function () {
				Math.floor(e.playerInner.height()) == Math.floor(window.innerHeight) && Math.floor(e.playerInner.width()) == Math.floor(window.innerWidth) || (e.isFullScreen = !1, e.playerInner.removeClass("sp-is-fullscreen"), e.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.unFullScreenChanges())
			}.bind(e), 400)
		}), e.playerInner.keyup(function (t) {
			27 == t.keyCode && setTimeout(function () {
				e.isFullScreen && (e.isFullScreen = !1, e.playerInner.removeClass("sp-is-fullscreen"), e.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.unFullScreenChanges())
			}.bind(e), 500)
		})
	},
	_buildclosebtn: function () {
		console.log("closeBtn..."), SaranyuHlsHTML5Player.Utils.DLOG("Attaching close icon");
		var e = this,
			t = e.mediaElement.videoElement;
		e.fullControls.bottomControlBar.bottomPlayerControls.append('<div class="sp-close-button"><span class="tooltiptext"></span><button class="sp-close-btn"></button></div>'), e.fullControls.bottomControlBar.bottomPlayerControls.closeBtn = e.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-close-button .sp-close-btn"), e.fullControls.bottomControlBar.bottomPlayerControls.closeBtn.tooltip = e.fullControls.bottomControlBar.bottomPlayerControls.saranyuPlaypause.find(".tooltiptext"), e.fullControls.bottomControlBar.bottomPlayerControls.closeBtn.click(function (e) {
			console.log("close button clicked"), SaranyuHlsHTML5Player.Utils.DLOG("Clicked on close Icon"), e.preventDefault(), document.getElementById("video_player").remove(), document.activeElement.blur(), t.focus()
		})
	},
	_buildtime: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("Attaching time");
		var e = this,
			t = e.mediaElement.videoElement;
		e.fullControls.bottomControlBar.bottomPlayerControls.append('<div class="sp-player-time"><span class="sp-plyr-currenttime">00:00</span>&nbsp;/&nbsp;<span class="sp-plyr-duration">00:00</span></div>'), e.fullControls.bottomControlBar.bottomPlayerControls.saranyuPlayerTime = e.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-player-time"), e.fullControls.bottomControlBar.bottomPlayerControls.saranyuPlayerTime.currentTime = e.fullControls.bottomControlBar.bottomPlayerControls.saranyuPlayerTime.find(".sp-plyr-currenttime"), e.fullControls.bottomControlBar.bottomPlayerControls.saranyuPlayerTime.duration = e.fullControls.bottomControlBar.bottomPlayerControls.saranyuPlayerTime.find(".sp-plyr-duration"), t.addEventListener("timeupdate", function (o) {
			e.fullControls.bottomControlBar.bottomPlayerControls.saranyuPlayerTime.currentTime.html(SaranyuHlsHTML5Player.Utils.secondsToTimeCode(t.currentTime)), e.fullControls.bottomControlBar.bottomPlayerControls.saranyuPlayerTime.duration.html(SaranyuHlsHTML5Player.Utils.secondsToTimeCode(t.duration))
		}.bind(e))
	},
	_buildshare: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("Attaching share"), this.mediaElement.videoElement, this.fullControls.bottomControlBar.bottomPlayerControls.append('<div class="sp-button sp-share sp-share-wrap"><span class="tooltiptext">Share</span><button class="sp-share-btn"></button>')
	},
	_buildwatchlater: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("Attaching watchlater"), this.mediaElement.videoElement, this.fullControls.bottomControlBar.bottomPlayerControls.append('<div class="sp-button sp-watchlater sp-watchlater-wrap"><span class="tooltiptext">Watchlater</span><button class="sp-watchlater-btn"></button>')
	},
	_buildnxplayback: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("Attaching nxplayback");
		var e = this,
			t = e.mediaElement.videoElement,
			o = e.options;
		e.fullControls.bottomControlBar.bottomPlayerControls.append('<div class="sp-nxplayback-switch sp-nxplayback-switch-wrap"><button class="sp-nxplayback-switch-btn"></button><div class="sp-nxplayback-switch-wrap sp-nxplayback-switch-popup-wrap"></div></div>'), e.fullControls.bottomControlBar.bottomPlayerControls.nxplayback = e.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-nxplayback-switch-wrap"), e.fullControls.bottomControlBar.bottomPlayerControls.nxplayback.button = e.fullControls.bottomControlBar.bottomPlayerControls.nxplayback.find(".sp-nxplayback-switch-btn"), e.fullControls.bottomControlBar.bottomPlayerControls.nxplayback.popup = e.fullControls.bottomControlBar.bottomPlayerControls.nxplayback.find(".sp-nxplayback-switch-popup-wrap"), $.each(o.nxplayback, function (o, l) {
			var a, n;
			"true" === l.default.toLowerCase() || 1 == l.default ? (e.fullControls.bottomControlBar.bottomPlayerControls.nxplayback.button.html(l.label), t.playbackRate = l.speed, n = "active") : n = "inactive", a = "<div><button class=" + n + " type='button' label=" + l.label + " speed=" + l.speed + ">" + l.label + "</button></div>", e.fullControls.bottomControlBar.bottomPlayerControls.nxplayback.popup.append(a).find("button").unbind().click(function (t) {
				var o = $(t.target).attr("speed"),
					l = $(t.target).attr("label"),
					a = e.mediaElement.videoElement;
				a.playbackRate = o, a.muted = 1 != o, $(t.target).parent().parent().find(".active").removeClass("active").addClass("inactive"), $(t.target).addClass("active").removeClass("inactive"), e.fullControls.bottomControlBar.bottomPlayerControls.nxplayback.button.html(l), e.fullControls.bottomControlBar.bottomPlayerControls.nxplayback.popup.hide(), SaranyuHlsHTML5Player.Utils.DLOG("video playback speed changed to " + o + "x or label " + l)
			}.bind(e))
		}), e.fullControls.bottomControlBar.bottomPlayerControls.nxplayback.button.unbind().click(function (t) {
			e.fullControls.bottomControlBar.bottomPlayerControls.nxplayback.popup.toggle(), e.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup.hide(), e.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.hide(), e.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.hide(), e.fullControls.playlistPanel.hide()
		}.bind(e))
	},
	_buildqualityswitch: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("Attaching qualityswitch");
		var e = this;
		e.mediaElement.videoElement, e.options, e.fullControls.bottomControlBar.bottomPlayerControls.append('<div class="sp-quality-switch sp-quality-switch-wrap"><button class="sp-quality-switch-btn"></button><div class="sp-quality-switch-wrap sp-quality-switch-popup-wrap"></div></div>'), e.fullControls.bottomControlBar.bottomPlayerControls.quality = e.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-quality-switch-wrap"), e.fullControls.bottomControlBar.bottomPlayerControls.quality.button = e.fullControls.bottomControlBar.bottomPlayerControls.quality.find(".sp-quality-switch-btn"), e.fullControls.bottomControlBar.bottomPlayerControls.quality.popup = e.fullControls.bottomControlBar.bottomPlayerControls.quality.find(".sp-quality-switch-popup-wrap"), e._buildqualityswitch._buildQualityPopup = function (t) {
			function o(t) {
				t.find("button").unbind().click(function (t) {
					var o = Number($(t.target).attr("index")),
						l = $(t.target).html();
					e.mediaElement.videoElement, e.mediaElement.videoElement.hlsObj.currentLevel = o, e._buildqualityswitch.lastQualityChangeAt = (new Date).getTime(), $(t.target).parent().parent().find(".active").removeClass("active").addClass("inactive"), $(t.target).addClass("active").removeClass("inactive"), $(t.target).parent().parent().parent().find(".active").removeClass("active"), $(t.target).parent().addClass("active").removeClass("inactive"), e.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.hide(), SaranyuHlsHTML5Player.Utils.DLOG("quality index changed to " + o + "x or label " + l)
				}.bind(e))
			}
			if (e.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.hide(), e.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.empty(), SaranyuHlsHTML5Player.Utils.DLOG("Attaching qualityswitch popup elements"), t.length > 1) $.each(t, function (t, l) {
				SaranyuHlsHTML5Player.Utils.DLOG("Attaching quality switching with bit rate of " + (l.bitrate / 1024).toFixed(0) + " Kbps");
				var a = "",
					n = "inactive",
					i = e.options.qualityswitch.label,
					r = (l.bitrate / 1024).toFixed(0),
					s = l.height + "p";
				e.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.children().length || (classActiveOrInactive = "active", a = "<div class=active ><button class=active type='button' label=" + i + " index=" + -1 + ">" + i + "</button></div>"), "resolution" == e.options.qualityswitch.metric ? a += "<div><button class=" + n + " type='button' label=" + r + " index=" + t + ">" + s + "</button></div>" : "bitrate" == e.options.qualityswitch.metric && (a += "<div class=" + n + "><button class=" + n + " type='button' label=" + r + " index=" + t + ">" + r + " kbps</button></div>"), o(e.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.append(a))
			});
			else {
				SaranyuHlsHTML5Player.Utils.DLOG("Attaching quality switching Auto only , if there is just one quality");
				var l, a = e.options.qualityswitch.label;
				classActiveOrInactive = "active", l = "<div class=active ><button class=active type='button' label=" + a + " index=" + -1 + ">" + a + "</button></div>", o(e.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.append(l))
			}
		}, e.fullControls.bottomControlBar.bottomPlayerControls.quality.button.unbind().click(function (t) {
			if (e.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.children().length > 0) {
				try {
					e.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.toggle()
				} catch (e) {}
				try {
					e.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup.hide()
				} catch (e) {}
				try {
					e.fullControls.bottomControlBar.bottomPlayerControls.nxplayback.popup.hide()
				} catch (e) {}
				try {
					e.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.hide()
				} catch (e) {}
				try {
					e.fullControls.playlistPanel.hide()
				} catch (e) {}
			} else e.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.hide()
		}.bind(e))
	},
	_buildmultiaudio: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("Attaching multiaudio tracks");
		var e = this;
		e.mediaElement.videoElement, e.options, e.fullControls.bottomControlBar.bottomPlayerControls.append('<div class="sp-multiaudio-switch sp-multiaudio-switch-wrap"><button class="sp-multiaudio-switch-btn"></button><div class="sp-multiaudio-switch-wrap sp-multiaudio-switch-popup-wrap"></div></div>'), e.fullControls.bottomControlBar.bottomPlayerControls.multiaudio = e.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-multiaudio-switch-wrap"), e.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.button = e.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.find(".sp-multiaudio-switch-btn"), e.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup = e.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.find(".sp-multiaudio-switch-wrap"), e.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.button.html("Audio"), e._buildmultiaudio._buildMultiaudioPopup = function (t) {
			if (e.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup.hide(), e.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup.empty(), SaranyuHlsHTML5Player.Utils.DLOG("Attaching multiaudio popup elements"), t.length > 1) {
				var o = t[0].groupId;
				$.each(t, function (t, l) {
					SaranyuHlsHTML5Player.Utils.DLOG("Attaching multiaudio switching with name of " + l.name);
					var a = "",
						n = SaranyuHlsHTML5Player.defaultOptions.titleStrings.multiaudio,
						i = l.name;
					l.groupId == o && (e.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup.children().length || (classActiveOrInactive = "active", a = "<div><button class=active type='button' label=" + n + " index=0>" + n + "</button></div>"), a += "<div><button class=inactive type='button' label=" + i + " index=" + t + ">" + i + "</button></div>", e.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup.append(a).find("button").unbind().click(function (t) {
						var o = Number($(t.target).attr("index")),
							l = $(t.target).html();
						e.mediaElement.videoElement, e.mediaElement.videoElement.hlsObj.audioTrack = o, $(t.target).parent().parent().find(".active").removeClass("active").addClass("inactive"), $(t.target).addClass("active").removeClass("inactive"), e.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup.hide(), SaranyuHlsHTML5Player.Utils.DLOG("multiaudio index changed to " + o + "x or label " + l)
					}.bind(e)))
				})
			}
		}, e.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.button.unbind().click(function (t) {
			e.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup.children().length > 0 ? (e.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup.toggle(), e.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.toggle(), e.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.hide(), e.fullControls.bottomControlBar.bottomPlayerControls.nxplayback.popup.hide(), e.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.hide(), e.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.hide(), e.fullControls.playlistPanel.hide()) : e.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup.hide()
		}.bind(e))
	},
	_buildsubtitles: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("Attaching subtitles tracks");
		var e = this;
		e.mediaElement.videoElement, e.options, e.fullControls.bottomControlBar.bottomPlayerControls.append('<div class="sp-button sp-subtitles-switch sp-subtitles-switch-wrap"><span class="tooltiptext">Subtitles</span><button class="sp-subtitles-switch-btn"></button><div class="sp-subtitles-switch-wrap sp-subtitles-switch-popup-wrap"></div></div>'), e.fullControls.bottomControlBar.bottomPlayerControls.subtitles = e.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-subtitles-switch-wrap"), e.fullControls.bottomControlBar.bottomPlayerControls.subtitles.button = e.fullControls.bottomControlBar.bottomPlayerControls.subtitles.find(".sp-subtitles-switch-btn"), e.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup = e.fullControls.bottomControlBar.bottomPlayerControls.subtitles.find(".sp-subtitles-switch-wrap"), e.fullControls.bottomControlBar.bottomPlayerControls.subtitles.button.html(""), e.mediaElement.append('<div class="sp-subtitles-panel"></div>'), e.mediaElement.subtitlesPanel = e.mediaElement.find(".sp-subtitles-panel"), e.mediaElement.subtitlesPanel.subtitlesArray = [], e._buildsubtitles.hideSubTitlesContainer = function () {
			e.mediaElement.subtitlesPanel.hide()
		}, e._buildsubtitles.showSubTitlesContainer = function () {
			e.mediaElement.subtitlesPanel.html().length > 1 ? e.mediaElement.subtitlesPanel.show() : e.mediaElement.subtitlesPanel.hide()
		}, e._buildsubtitles.hideSubTitlesContainer(), e._buildsubtitles._buildSubtitlesPopup = function (t) {
			var o = 0;

			function l(t) {
				t.find("button").unbind().click(function (t) {
					var l = Number($(t.target).attr("index")),
						a = $(t.target).html();
					e.mediaElement.videoElement,
						function (t) {
							if (SaranyuHlsHTML5Player.Utils.DLOG(t + " uday 2 Check playlist index for subtitles " + o), isNaN(t)) return e.mediaElement.subtitlesPanel.subtitlesArray = [], !1;
							e.mediaElement.subtitlesPanel.subtitlesArray = [], $.ajax({
								url: e.options.file[o].subtitles[t].file,
								context: e,
								success: function (e) {
									var t = this;

									function o(e) {
										return e.replace(/^\s+|\s+$/g, "")
									}
									var l = e.replace(/\r\n|\r|\n/g, "\n"),
										a = (l = o(l)).split("\n\n"),
										n = 0;
									for (s in a) {
										var i = a[s].split("\n");
										if (i.length >= 2) {
											var r = i[0],
												d = o(i[1].split(" --\x3e ")[0]),
												u = o(i[1].split(" --\x3e ")[1]),
												m = i[2];
											if (i.length > 2)
												for (j = 3; j < i.length; j++) m += "\n" + i[j];
											t.mediaElement.subtitlesPanel.subtitlesArray[n] = {}, t.mediaElement.subtitlesPanel.subtitlesArray[n].number = r, t.mediaElement.subtitlesPanel.subtitlesArray[n].start = d, t.mediaElement.subtitlesPanel.subtitlesArray[n].end = u, t.mediaElement.subtitlesPanel.subtitlesArray[n].text = m
										}
										n++
									}
								}
							})
						}(l), $(t.target).parent().parent().find(".active").removeClass("active").addClass("inactive"), $(t.target).addClass("active").removeClass("inactive"), e.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.hide(), SaranyuHlsHTML5Player.Utils.DLOG("subtitles index changed to " + l + "x or label " + a)
				}.bind(e))
			}
			if (console.log("playingIndex = " + e.fullControls.playlistPanel.playingIndex), e.fullControls.playlistPanel.playingIndex && (o = e.fullControls.playlistPanel.playingIndex), SaranyuHlsHTML5Player.Utils.DLOG("Check playlist index for subtitles" + o), console.log("Check playlist index for subtitles" + o + e.options.file[o].subtitles), t = e.options.file[o].subtitles, e.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.hide(), e.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.empty(), SaranyuHlsHTML5Player.Utils.DLOG("Attaching subtitles popup elements" + e.mediaElement.subtitlesPanel.subtitlesArray.length), e.mediaElement.subtitlesPanel.subtitlesArray = [], SaranyuHlsHTML5Player.Utils.DLOG("check subtitle length" + e.mediaElement.subtitlesPanel.subtitlesArray.length), void 0 != t) t.length > 1 && $.each(t, function (t, o) {
				SaranyuHlsHTML5Player.Utils.DLOG("Attaching subtitles switching with name of " + o.lang);
				var a = "",
					n = SaranyuHlsHTML5Player.defaultOptions.titleStrings.subtitles,
					i = o.lang;
				e.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.children().length || (classActiveOrInactive = "active", a = "<div><button class=active type='button' label=" + n + " index=no>" + n + "</button></div>"), a += "<div><button class=inactive type='button' label=" + i + " index=" + t + ">" + i + "</button></div>", l(e.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.append(a))
			});
			else {
				SaranyuHlsHTML5Player.Utils.DLOG("Attaching multiaudio switching Auto only , if there is just one audio");
				var a, n = SaranyuHlsHTML5Player.defaultOptions.titleStrings.subtitles;
				e.fullControls.bottomControlBar.bottomPlayerControls.subtitles.button.html(n), classActiveOrInactive = "active", a = "<div><button class=active type='button' label=" + n + " index=no>" + n + "</button></div>", l(e.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.append(a))
			}
		}, e.mediaElement.videoElement.addEventListener("timeupdate", function () {
			function t(e) {
				var t = e.split(":");
				return 60 * +t[0] * 60 + 60 * +t[1] + +t[2]
			}! function () {
				var o = Math.floor(Number(e.mediaElement.videoElement.currentTime));
				if (e.mediaElement.subtitlesPanel.subtitlesArray.length > 0)
					for (var l = 0; l < e.mediaElement.subtitlesPanel.subtitlesArray.length; l++) {
						var a = t(e.mediaElement.subtitlesPanel.subtitlesArray[l].start.split(",")[0]),
							n = t(e.mediaElement.subtitlesPanel.subtitlesArray[l].end.split(",")[0]);
						if (o >= a && o <= n) return e._buildsubtitles.showSubTitlesContainer(), void e.mediaElement.subtitlesPanel.html(e.mediaElement.subtitlesPanel.subtitlesArray[l].text)
					}
				e._buildsubtitles.hideSubTitlesContainer()
			}()
		}), e.fullControls.bottomControlBar.bottomPlayerControls.subtitles.button.unbind().click(function (t) {
			e.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.children().length > 0 ? (e.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.toggle(), e.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup.hide(), e.fullControls.bottomControlBar.bottomPlayerControls.nxplayback.popup.hide(), e.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.hide(), e.fullControls.playlistPanel.hide()) : e.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.hide()
		}.bind(e))
	},
	_buildplaylist: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("Building playlist");
		var e = this,
			t = (e.mediaElement.videoElement, '<div class="sp-button sp-playlist-button-wrap sp-playlist-inactive"><span class="tooltiptext">' + SaranyuHlsHTML5Player.defaultOptions.titleStrings.playlist + '</span><button class="sp-playlist-btn"></button></div>');
		e.fullControls.bottomControlBar.bottomPlayerControls.append(t), e.fullControls.bottomControlBar.bottomPlayerControls.playlist = e.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-playlist-button-wrap"), e.fullControls.bottomControlBar.bottomPlayerControls.playlist.button = e.fullControls.bottomControlBar.bottomPlayerControls.playlist.find(".sp-playlist-btn"), e.fullControls.append('<div class="sp-playlist-panel"></div>'), e.fullControls.playlistPanel = e.fullControls.find(".sp-playlist-panel"), e.fullControls.playlistPanel.playingIndex = 0, e.fullControls.playlistPanel.append('<span class="sp-playlist-panel-left-btn"></span>'), e.fullControls.playlistPanel.append('<span class="sp-playlist-panel-right-btn"></span>'), e.fullControls.playlistPanel.playlistLeftButton = e.fullControls.find(".sp-playlist-panel-left-btn"), e.fullControls.playlistPanel.playlistRightButton = e.fullControls.find(".sp-playlist-panel-right-btn"), e.fullControls.playlistPanel.append('<div class="sp-playlist-panel-itemview"></div>'), e.fullControls.playlistPanel.playlistItemView = e.fullControls.find(".sp-playlist-panel-itemview"), $.each(e.options.file, function (t, o) {
			var l;
			l = 0 == t ? '<div class="item sp-playlist-active-item sp-playlist-item" indexoftile="' + t + '"><img class="sp-playlist-item-img" src="' + e.options.file[t].poster + '"><span class="sp-playlist-item-videotitle">' + e.options.file[t].videotitle + "</span></div>" : '<div class="item sp-playlist-item" indexoftile="' + t + '"><img class="sp-playlist-item-img" src="' + e.options.file[t].poster + '"><span class="sp-playlist-item-videotitle">' + e.options.file[t].videotitle + "</span></div>", e.fullControls.playlistPanel.playlistItemView.append(l)
		}), e.fullControls.playlistPanel.playlistItemView.saranyuOwlCarousel = $(e.fullControls.playlistPanel.playlistItemView), e.fullControls.playlistPanel.playlistItemView.saranyuOwlCarousel.saranyuOwlCarousel({
			margin: 10,
			items: 5,
			loop: !1,
			afterAction: function () {
				this.itemsAmount > this.visibleItems.length ? (e.fullControls.playlistPanel.playlistLeftButton.show(), e.fullControls.playlistPanel.playlistRightButton.show(), 0 == this.currentItem && e.fullControls.playlistPanel.playlistLeftButton.hide(), this.currentItem == this.maximumItem && e.fullControls.playlistPanel.playlistRightButton.hide()) : (e.fullControls.playlistPanel.playlistLeftButton.hide(), e.fullControls.playlistPanel.playlistRightButton.hide())
			}
		}), e.fullControls.playlistPanel.removeActiveClass = function () {
			$.each(e.fullControls.playlistPanel.find(".sp-playlist-item"), function (e, t) {
				$(t).removeClass("sp-playlist-active-item")
			})
		}, e.fullControls.playlistPanel.addActiveClass = function (t) {
			$.each(e.fullControls.playlistPanel.find(".sp-playlist-item"), function (e, o) {
				e == t && $(o).addClass("sp-playlist-active-item")
			})
		}, e.fullControls.playlistPanel.buildAdCuesAfterPlaylistUpdate = function () {
			try {
				e._buildadvertisement._buildadcue.constructed = !1
			} catch (e) {}
			e.mediaElement.videoElement.addEventListener("timeupdate", function () {
				"true" != e.options.advertisement.cues || isNaN(e.mediaElement.videoElement.duration) || "vod" != e.options.content || e._buildadvertisement._buildadcue.constructed || e._buildadvertisement._buildadcue()
			})
		}, e.fullControls.playlistPanel.updateNewPlaylistStats = function (t) {
			console.log("Clicked on item " + t), console.log("playingIndex " + e.fullControls.playlistPanel.playingIndex), e.fullControls.playlistPanel.playingIndex = t, console.log("playingIndex " + e.fullControls.playlistPanel.playingIndex), e._createAndAppendHLStoPlayer(e.options.file[t]), e.fullControls.playlistPanel.removeActiveClass(), e.fullControls.playlistPanel.addActiveClass(t), e.fullControls.playlistPanel.playingIndex = t, e.fullControls.playlistPanel.buildAdCuesAfterPlaylistUpdate()
		}, e.fullControls.playlistPanel.find(".sp-playlist-item").click(function (t) {
			t = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(t);
			var o = $(this).attr("indexoftile");
			SaranyuHlsHTML5Player.Utils.DLOG("Clicked on item " + o), e.fullControls.playlistPanel.updateNewPlaylistStats(o), e.fullControls.bottomControlBar.bottomProgressBar.progressbar.seekbarPreviewContainer.seekbarPreviewContainerImgTag && e.fullControls.bottomControlBar.bottomProgressBar.progressbar.seekbarPreviewContainer.ajaxForVtt(e.options.file[o].thumbnails)
		}), e.fullControls.bottomControlBar.bottomPlayerControls.playlist.button.click(function (t) {
			t = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(t), SaranyuHlsHTML5Player.Utils.DLOG("Clicked on playlist button"), e.fullControls.playlistPanel.toggle(), e._buildadvertisement.initializeAd.adStarted && !e._buildadvertisement.initializeAd.isLinear && e.adContainer.toggleClass("sp-playlist-show"), e.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup.hide(), e.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.hide(), e.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.hide(), e.fullControls.bottomControlBar.bottomPlayerControls.nxplayback.popup.hide()
		}), e.fullControls.playlistPanel.playlistLeftButton.click(function (t) {
			t = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(t), SaranyuHlsHTML5Player.Utils.DLOG("Clicked on prev playlist button"), e.fullControls.playlistPanel.playlistItemView.saranyuOwlCarousel.trigger("owl.prev")
		}), e.fullControls.playlistPanel.playlistRightButton.click(function (t) {
			t = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(t), SaranyuHlsHTML5Player.Utils.DLOG("Clicked on next playlist button"), e.fullControls.playlistPanel.playlistItemView.saranyuOwlCarousel.trigger("owl.next")
		}), e.mediaElement.videoElement.addEventListener("ended", function () {
			if ("true" === e.options.autoplay || 1 == e.options.autoplay) try {
				var t = Number(e.fullControls.playlistPanel.playingIndex) + 1;
				t < e.options.file.length ? (SaranyuHlsHTML5Player.Utils.DLOG("video ended choosing next playlist index " + t), e.fullControls.playlistPanel.updateNewPlaylistStats(t)) : SaranyuHlsHTML5Player.Utils.DLOG("video ended choosing next playlist index is not present so ending playlist " + t)
			} catch (e) {} else SaranyuHlsHTML5Player.Utils.DLOG("player will be in replay mode and it will play same file")
		})
	},
	_buildvideotitle: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("Attaching video title");
		var e = this;
		e.fullControls.topContolbar.append('<div class="sp-controls-top-video-title"><span class="sp-controls-top-video-title-text"></span></div>'), e.fullControls.topContolbar.videoTitle = e.fullControls.topContolbar.find(".sp-controls-top-video-title .sp-controls-top-video-title-text"), e.fullControls.topContolbar.videoTitle.changeTitle = function (t) {
			e.fullControls.topContolbar.videoTitle.html(t)
		}.bind(e)
	},
	_buildbigicons: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("Attaching big icons");
		var e = this,
			t = (e.options, e.mediaElement.videoElement);
		e.playerLayers.append('<div class="sp-player-poster"><img></div>'), e.playerLayers.append('<div class="sp-player-bigplay"></div>'), e.playerLayers.append('<div class="sp-player-loading"></div>'), e.playerLayers.append('<div class="sp-player-replay"></div>'), e.playerLayers.poster = e.playerLayers.find(".sp-player-poster"), e.playerLayers.poster.img = e.playerLayers.poster.find("img"), e.playerLayers.poster.changePoster = function (t) {
			$(e.playerLayers.poster.img).attr("src", t)
		}.bind(e), e.playerLayers.bigplay = e.playerLayers.find(".sp-player-bigplay"), e.playerLayers.loading = e.playerLayers.find(".sp-player-loading"), e.playerLayers.bigreplay = e.playerLayers.find(".sp-player-replay"), "true" === e.options.autoplay || 1 == e.options.autoplay ? (e.playerLayers.bigplay.hide(), e.playerLayers.bigreplay.hide()) : (e.playerLayers.bigreplay.hide(), e.playerLayers.loading.hide(), e.fullControls.middleControlbar.saranyuPlaypause.addClass("sp-pause"), e.fullControls.middleControlbar.saranyuPlaypause.removeClass("sp-play"), e.fullControls.middleControlbar.saranyuPlaypause.removeClass("sp-replay"), e.fullControls.middleControlbar.saranyuPlaypause.tooltip.html(SaranyuHlsHTML5Player.defaultOptions.titleStrings.play)), e.playerLayers.click(function (o) {
			o.preventDefault(), t.paused ? e._videoPlayerControls("play") : e._videoPlayerControls("pause")
		}), t.addEventListener("play", function () {
			e.playerLayers.poster.hide(), e.playerLayers.bigplay.hide(), e.playerLayers.loading.hide(), e.playerLayers.bigreplay.hide(), $(".sp-controls-middle").show()
		}), t.addEventListener("playing", function () {
			e.playerLayers.poster.hide(), e.playerLayers.bigplay.hide(), e.playerLayers.loading.hide(), e.playerLayers.bigreplay.hide(), $(".sp-controls-middle").show()
		}), t.addEventListener("pause", function () {
			try {
				if (console.log((new Date).getTime() - e._buildqualityswitch.lastQualityChangeAt), (new Date).getTime() - e._buildqualityswitch.lastQualityChangeAt < 1e3) return console.log("last time when quality changed was below 1s"), !0
			} catch (e) {}
			e.playerLayers.bigplay.show(), e.playerLayers.loading.hide(), e.playerLayers.bigreplay.hide()
		}), t.addEventListener("waiting", function () {
			t.paused || e.playerLayers.loading.show(), $(".sp-controls-middle").hide()

		}), t.addEventListener("ended", function () {
			e.playerLayers.bigreplay.show(), e.playerLayers.bigplay.hide(), $(".sp-controls-middle").hide()
		})
	},
	_buildeventcallbacks: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("Attaching Event Callbacks");
		var e = this,
			t = e.mediaElement.videoElement;
		e.eventcallbacks = {}, t.addEventListener("ended", function () {
			try {
				if (e._buildadvertisement.initializeAd.isLinear) return
			} catch (e) {}
			try {
				e.eventcallbacks.onComplete(t.currentTime, t.duration, t.mediaId)
			} catch (e) {
				SaranyuHlsHTML5Player.Utils.DLOG("callback events complete is not listened")
			}
		}), t.addEventListener("pause", function () {
			try {
				if (e._buildadvertisement.initializeAd.isLinear) return
			} catch (e) {}
			try {
				e.eventcallbacks.onPause(t.currentTime, t.duration, t.mediaId)
			} catch (e) {
				SaranyuHlsHTML5Player.Utils.DLOG("callback events Pause is not listened")
			}
		}), t.addEventListener("play", function () {
			try {
				if (e._buildadvertisement.initializeAd.isLinear) return
			} catch (e) {}
			try {
				0 == t.currentTime ? e.eventcallbacks.onPlay(t.currentTime, t.duration, t.mediaId) : e.eventcallbacks.onResume(t.currentTime, t.duration, t.mediaId)
			} catch (e) {
				SaranyuHlsHTML5Player.Utils.DLOG("callback events Play/Resume is not listened")
			}
		}), t.addEventListener("seeked", function () {
			try {
				if (e._buildadvertisement.initializeAd.isLinear) return
			} catch (e) {}
			try {
				e.eventcallbacks.onSeeked(t.currentTime, t.duration, t.mediaId)
			} catch (e) {
				SaranyuHlsHTML5Player.Utils.DLOG("callback events Seeked is not listened")
			}
		})
	},
	_buildhotkeys: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("Attaching Hotkeys");
		var e = this,
			t = e.mediaElement.videoElement;
		e.playerLayers.append('<div class="sp-player-text-feedback-container"></div>'), e.playerLayers.feedbackTextElement = e.playerLayers.find(".sp-player-text-feedback-container"), e.playerLayers.feedbackTextElement.hide(), e.playerInner.attr("tabindex", "0"), e.playerInner.keydown(function (o) {
			o.preventDefault();
			try {
				if (e._buildadvertisement.initializeAd.isLinear) return
			} catch (e) {}
			var l = "number" == typeof o.which ? o.which : o.keyCode;
			if (13 == l || 32 == l) SaranyuHlsHTML5Player.Utils.DLOG("Hotkey space/enter pressed which actions play/pause"), t.paused ? (e._videoPlayerControls("play"), e.playerLayers.feedbackTextElement.html("Key pressed for play").stop(!1, !0).show().fadeOut(3e3)) : (e._videoPlayerControls("pause"), e.playerLayers.feedbackTextElement.html("Key pressed for pause").stop(!1, !0).show().fadeOut(3e3));
			else if (109 == l || 77 == l) SaranyuHlsHTML5Player.Utils.DLOG("Hotkey M/m pressed which actions mute or unmute"), 1 == t.muted ? (e._videoPlayerControls("unmute"), e.playerLayers.feedbackTextElement.html("Key pressed for unmute").stop(!1, !0).show().fadeOut(3e3)) : (e._videoPlayerControls("mute"), e.playerLayers.feedbackTextElement.html("Key pressed for mute").stop(!1, !0).show().fadeOut(3e3));
			else if (70 == l || 102 == l) SaranyuHlsHTML5Player.Utils.DLOG("Hotkey F/f pressed which actions fullscreen toggle"), e.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.toggleFullscreen();
			else if (117 == l || 85 == l) {
				SaranyuHlsHTML5Player.Utils.DLOG("Hotkey up-arrow pressed which actions  volume increase");
				var a = t.volume;
				a += .1, a = Math.max(0, a), a = Math.min(a, 1), e._videoPlayerControls("volumechange", a), e.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.positionVolumeHandle(a), e.playerLayers.feedbackTextElement.html("Key pressed for volume up").stop(!1, !0).show().fadeOut(3e3)
			} else 100 != l && 68 != l || (SaranyuHlsHTML5Player.Utils.DLOG("Hotkey down-arrow pressed which actions volume decrease"), a = t.volume, a -= .1, a = Math.max(0, a), a = Math.min(a, 1), e._videoPlayerControls("volumechange", a), e.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.positionVolumeHandle(a), e.playerLayers.feedbackTextElement.html("Key pressed for volume down").stop(!1, !0).show().fadeOut(3e3))
		})
	},
	_buildadvertisement: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("building advertisement that supports vmap");
		var e = this,
			t = e.options,
			o = ["playpause", "fullScreen", "volume", "title", "time"];
		if (t.advertisement.hasOwnProperty("vmap") && "true" == t.advertisement.vmap) {
			if (t.advertisement) {
				var l = '<div class="sp-ad-top-controlbar"></div>',
					a = '<div class="sp-ad-video-element"></div>',
					n = '<div class="sp-ad-bottom-controlbar"></div>',
					i = '<video class="sp-ad-dummy-video"></video>';
				e.adContainer.append(i), e.adContainer.append(l), e.adContainer.append(a), e.adContainer.append(n), e.adContainer.adTopControls = e.adContainer.find(".sp-ad-top-controlbar"), e.adContainer.adVideoElement = e.adContainer.find(".sp-ad-video-element"), e.adContainer.adBottomControls = e.adContainer.find(".sp-ad-bottom-controlbar"), e.adContainer.adDummyVideoTag = e.adContainer.find(".sp-ad-dummy-video"), e._buildadvertisement._buildadcue = function () {
						if (e._buildadvertisement._buildadcue.constructed = !1, !e._buildadvertisement._buildadcue.constructed) {
							try {
								e.fullControls.bottomControlBar.bottomProgressBar.progressbar.cues.empty()
							} catch (e) {}
							$.each(e._buildadvertisement.initializeAd.adCues, function (t, o) {
								if (Number(o)) {
									var l = SaranyuHlsHTML5Player.Utils.getPercentageForGivenDuration(o, e.mediaElement.videoElement.duration);
									if (!(l >= 0 && l <= 100)) return !0;
									var a = "<span class='sp-ad-cue-points sp-ad-cue-points-" + t + "' style='left:" + l + "%'></span>";
									e.fullControls.bottomControlBar.bottomProgressBar.progressbar.cues.append(a), e.fullControls.bottomControlBar.bottomProgressBar.progressbar.cues.find(".sp-ad-cue-points-" + t), e._buildadvertisement._buildadcue.constructed = !0
								}
							})
						}
					}, e._buildadvertisement._buildadtitle = function () {
						SaranyuHlsHTML5Player.Utils.DLOG("Building ad title icon for ad container"), e.adContainer.adTopControls.append('<div class="ad-video-title"><span class="ad-video-title-text"></span></div>'), e.adContainer.adTopControls.adTitle = e.adContainer.adTopControls.find(".ad-video-title-text")
					}, e._buildadvertisement._buildadplaypause = function () {
						SaranyuHlsHTML5Player.Utils.DLOG("Building playpause icon for ad container"), e.adContainer.adBottomControls.append('<div class="sp-ad-button sp-ad-playpause sp-ad-play"><button></button></div>'), e.adContainer.adBottomControls.playpause = e.adContainer.adBottomControls.find(".sp-ad-playpause"), e.adContainer.adBottomControls.playpause.click(function () {
							SaranyuHlsHTML5Player.Utils.DLOG("AD play pause button clicked");
							try {
								e._buildadvertisement.initializeAd.adPaused ? (e._buildadvertisement.initializeAd.adsManager.resume(), e._buildadvertisement.initializeAd.adPaused = !1) : (e._buildadvertisement.initializeAd.adsManager.pause(), e._buildadvertisement.initializeAd.adPaused = !0)
							} catch (e) {}
						}.bind(e)), e.adContainer.adBottomControls.playpause.changeIcon = function () {
							e._buildadvertisement.initializeAd.adPaused ? e.adContainer.adBottomControls.playpause.removeClass("sp-ad-play").addClass("sp-ad-pause") : e.adContainer.adBottomControls.playpause.removeClass("sp-ad-pause").addClass("sp-ad-play")
						}
					}, e._buildadvertisement._buildadvolume = function () {
						SaranyuHlsHTML5Player.Utils.DLOG("Building volume icon for ad container"), e.adContainer.adBottomControls.append('<div class="sp-ad-button sp-ad-volume-muteunmute sp-ad-unmute"><button></button></div>'), e.adContainer.adBottomControls.volumeMuteUnmute = e.adContainer.adBottomControls.find(".sp-ad-volume-muteunmute"), e.adContainer.adBottomControls.append('<div class="sp-ad-volume-slider sp-ad-volume-slider-wrap"><div class="sp-ad-volume-current"></div><div class="sp-ad-volume-handle"></div></div>'), e.adContainer.adBottomControls.volumeSlider = e.adContainer.adBottomControls.find(".sp-ad-volume-slider.sp-ad-volume-slider-wrap"), e.adContainer.adBottomControls.volumeSlider.volumeCurrent = e.adContainer.adBottomControls.volumeSlider.find(".sp-ad-volume-current"), e.adContainer.adBottomControls.volumeSlider.volumeHandle = e.adContainer.adBottomControls.volumeSlider.find(".sp-ad-volume-handle"), e.adContainer.adBottomControls.volumeSlider.oldVolume = 1, e.adContainer.adBottomControls.volumeSlider.positionVolumeHandle = function (t) {
							e.adContainer.adBottomControls.volumeSlider.volumeCurrent.css("width", 100 * t + "%"), e.adContainer.adBottomControls.volumeSlider.volumeHandle.css("left", "calc(" + 100 * t + "% - " + e.adContainer.adBottomControls.volumeSlider.volumeHandle.width() / 2 + "px)")
						}, e.adContainer.adBottomControls.volumeSlider.handleVolumeMove = function (t) {
							var o = null,
								l = e.adContainer.adBottomControls.volumeSlider,
								a = l.offset(),
								n = l.width();
							o = (t.pageX - a.left) / n, o = Math.max(0, o), o = Math.min(o, 1), e.adContainer.adBottomControls.volumeSlider.positionVolumeHandle(o);
							try {
								e._buildadvertisement.initializeAd.adsManager.setVolume(o), e.adContainer.adBottomControls.volumeSlider.oldVolume = o
							} catch (t) {}
						}, e.adContainer.adBottomControls.volumeSlider.bind("mouseover", function (t) {
							t = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(t), e.adContainer.adBottomControls.volumeSlider.mouseIsOver = !0
						}).bind("mousemove", function (t) {
							t = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(t), 1 == e.adContainer.adBottomControls.volumeSlider.mouseIsDown && e.adContainer.adBottomControls.volumeSlider.handleVolumeMove(t)
						}).bind("mouseup", function (t) {
							t = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(t), e.adContainer.adBottomControls.volumeSlider.mouseIsDown = !1
						}).bind("mousedown", function (t) {
							t = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(t), e.adContainer.adBottomControls.volumeSlider.handleVolumeMove(t), e.adContainer.adBottomControls.volumeSlider.mouseIsDown = !0
						}).bind("mouseleave", function (t) {
							t = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(t), e.adContainer.adBottomControls.volumeSlider.mouseIsDown = !1
						}), e.adContainer.adBottomControls.volumeMuteUnmute.click(function () {
							e._buildadvertisement.initializeAd.adMuted ? (e.adContainer.adBottomControls.volumeSlider.oldVolume >= 0 && e._buildadvertisement.initializeAd.adsManager.setVolume(e.adContainer.adBottomControls.volumeSlider.oldVolume), e._buildadvertisement.initializeAd.adsManager.setVolume(.2), e._buildadvertisement.initializeAd.adMuted = !1) : (e._buildadvertisement.initializeAd.adsManager.setVolume(0), e._buildadvertisement.initializeAd.adMuted = !0)
						}), e.adContainer.adBottomControls.volumeMuteUnmute.changeIcon = function () {
							e._buildadvertisement.initializeAd.adMuted ? (e.adContainer.adBottomControls.volumeMuteUnmute.addClass("sp-ad-mute").removeClass("sp-ad-unmute"), e.adContainer.adBottomControls.volumeSlider.hide()) : (e.adContainer.adBottomControls.volumeMuteUnmute.addClass("sp-ad-unmute").removeClass("sp-ad-mute"), e.adContainer.adBottomControls.volumeSlider.show())
						}, e.adContainer.adBottomControls.volumeMuteUnmute.checkDefaultContentVolume = function () {
							e.mediaElement.videoElement.muted ? (e.adContainer.adBottomControls.volumeMuteUnmute.removeClass("sp-ad-unmute").addClass("sp-ad-mute"), e._buildadvertisement.initializeAd.adsManager.setVolume(0), e.adContainer.adBottomControls.volumeSlider.oldVolume = e.mediaElement.videoElement.volume, e.adContainer.adBottomControls.volumeSlider.positionVolumeHandle(e.adContainer.adBottomControls.volumeSlider.oldVolume), e._buildadvertisement.initializeAd.adMuted = !0) : (e.adContainer.adBottomControls.volumeMuteUnmute.removeClass("sp-ad-mute").addClass("sp-ad-unmute"), e._buildadvertisement.initializeAd.adsManager.setVolume(e.mediaElement.videoElement.volume), e.adContainer.adBottomControls.volumeSlider.oldVolume = e.mediaElement.videoElement.volume, e.adContainer.adBottomControls.volumeSlider.positionVolumeHandle(e.adContainer.adBottomControls.volumeSlider.oldVolume), e._buildadvertisement.initializeAd.adMuted = !1)
						}
					}, e._buildadvertisement._buildadtime = function () {
						SaranyuHlsHTML5Player.Utils.DLOG("Building time for ad container"), e.adContainer.adBottomControls.append('<div class="sp-ad-player-time"><span class="sp-ad-plyr-currenttime">00:00</span>&nbsp;/&nbsp;<span class="sp-ad-plyr-duration">00:00</span></div>'), e.adContainer.adBottomControls.timeContainer = e.adContainer.adBottomControls.find(".sp-ad-player-time"), e.adContainer.adBottomControls.timeContainer.currentTime = e.adContainer.adBottomControls.find(".sp-ad-plyr-currenttime"), e.adContainer.adBottomControls.timeContainer.duration = e.adContainer.adBottomControls.find(".sp-ad-plyr-duration"), e._buildadvertisement._buildadtime.changeCurrentTime = function () {
							try {
								var t;
								t = e._buildadvertisement.initializeAd.ad.getDuration() - e._buildadvertisement.initializeAd.remainingTime >= 0 ? e._buildadvertisement.initializeAd.ad.getDuration() - e._buildadvertisement.initializeAd.remainingTime : 0, e.adContainer.adBottomControls.timeContainer.currentTime.html(SaranyuHlsHTML5Player.Utils.secondsToTimeCode(t))
							} catch (e) {}
						}, e._buildadvertisement._buildadtime.changeDuration = function () {
							try {
								e.adContainer.adBottomControls.timeContainer.duration.html(SaranyuHlsHTML5Player.Utils.secondsToTimeCode(e._buildadvertisement.initializeAd.ad.getDuration()))
							} catch (e) {}
						}
					}, e._buildadvertisement._buildadfullScreen = function () {
						SaranyuHlsHTML5Player.Utils.DLOG("Building playpause icon for ad container"), e.adContainer.adBottomControls.append('<div class="sp-ad-button sp-ad-fullscreen-unfullscreen sp-ad-fullscreen"><button></button></div>'), e.adContainer.adBottomControls.fullscreenunfullscreen = e.adContainer.adBottomControls.find(".sp-ad-fullscreen-unfullscreen"), e.isFullScreen ? e.adContainer.adBottomControls.fullscreenunfullscreen.removeClass("sp-ad-fullscreen").addClass("sp-ad-unfullscreen") : e.adContainer.adBottomControls.fullscreenunfullscreen.removeClass("sp-ad-unfullscreen").addClass("sp-ad-fullscreen"), e.adContainer.adBottomControls.fullscreenunfullscreen.click(function (t) {
							t.preventDefault(), SaranyuHlsHTML5Player.Utils.DLOG("Clicked on FullScreen"), e.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.toggleFullscreen(), setTimeout(function () {
								e.isFullScreen ? e.adContainer.adBottomControls.fullscreenunfullscreen.removeClass("sp-ad-fullscreen").addClass("sp-ad-unfullscreen") : e.adContainer.adBottomControls.fullscreenunfullscreen.removeClass("sp-ad-unfullscreen").addClass("sp-ad-fullscreen")
							}.bind(e), 600)
						}.bind(e))
					}, e._buildadvertisement._createAdControls = function () {
						SaranyuHlsHTML5Player.Utils.DLOG("_createAdControls");
						var e = o;
						this._buildadvertisement._destroyAdControls();
						for (featureIndex in e)
							if (feature = e[featureIndex], SaranyuHlsHTML5Player.Utils.DLOG("ad feature found is " + feature), this._buildadvertisement["_buildad" + feature]) try {
								this._buildadvertisement["_buildad" + feature]()
							} catch (e) {
								SaranyuHlsHTML5Player.Utils.DLOG(e)
							} else SaranyuHlsHTML5Player.Utils.DLOG("Error could not find function")
					}.bind(e), e._buildadvertisement._destroyAdControls = function () {
						SaranyuHlsHTML5Player.Utils.DLOG("_destroyAdControls"), this.adContainer.adTopControls.empty(), this.adContainer.adBottomControls.empty(), this.adContainer.adVideoElement.empty();
						try {
							this.fullControls.bottomControlBar.bottomProgressBar.progressbar.cues.empty()
						} catch (e) {}
					}.bind(e), e._buildadvertisement._createAdControls(), e._buildadvertisement.initializeAd = function (t) {
						try {
							try {
								e.adContainer.adBottomControls.volumeMuteUnmute.checkDefaultContentVolume()
							} catch (e) {}
							e._buildadvertisement.initializeAd.onAdError()
						} catch (e) {}
						e._buildadvertisement.initializeAd.adsManager, e._buildadvertisement.initializeAd.adsLoader, e._buildadvertisement.initializeAd.adDisplayContainer, e._buildadvertisement.initializeAd.intervalTimer, e._buildadvertisement.initializeAd.videoContent, e._buildadvertisement.initializeAd.adStarted = !1, e._buildadvertisement.initializeAd.isLinear = !1, e._buildadvertisement.initializeAd.adObj, e._buildadvertisement.initializeAd.adPaused = !1, e._buildadvertisement.initializeAd.adMuted = !1, e._buildadvertisement.initializeAd.init = function (t) {
							e._buildadvertisement.initializeAd.videoContent = e.mediaElement.videoElement, e._buildadvertisement.initializeAd.setUpIMA(t)
						}, e._buildadvertisement.initializeAd.setUpIMA = function (t) {
							e._buildadvertisement.initializeAd.createAdDisplayContainer(), e._buildadvertisement.initializeAd.adsLoader = new google.ima.AdsLoader(e._buildadvertisement.initializeAd.adDisplayContainer), e._buildadvertisement.initializeAd.adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, e._buildadvertisement.initializeAd.onAdsManagerLoaded, !1), e._buildadvertisement.initializeAd.adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, e._buildadvertisement.initializeAd.onAdError, !1), e._buildadvertisement.initializeAd.adsRequest = new google.ima.AdsRequest, e._buildadvertisement.initializeAd.adsRequest.adTagUrl = t.adurl, e._buildadvertisement.initializeAd.adsRequest.linearAdSlotWidth = e.adContainer.width(), e._buildadvertisement.initializeAd.adsRequest.linearAdSlotHeight = e.adContainer.height(), e._buildadvertisement.initializeAd.adsRequest.nonLinearAdSlotWidth = e.adContainer.width(), e._buildadvertisement.initializeAd.adsRequest.nonLinearAdSlotHeight = SaranyuHlsHTML5Player.maxNonLinearAdHeight, e._buildadvertisement.initializeAd.adsLoader.requestAds(e._buildadvertisement.initializeAd.adsRequest)
						}.bind(e), e._buildadvertisement.initializeAd.createAdDisplayContainer = function () {
							try {
								e.adContainer.adVideoElement.empty()
							} catch (e) {}
							google.ima.settings.setVpaidMode(google.ima.ImaSdkSettings.VpaidMode.ENABLED), e._buildadvertisement.initializeAd.adDisplayContainer = new google.ima.AdDisplayContainer(e.adContainer.adVideoElement[0], e.mediaElement.videoElement)
						}, e._buildadvertisement.initializeAd.playAds = function () {
							try {
								e.adContainer.addClass("sp-ad-container-display")
							} catch (e) {}
							e._buildadvertisement.initializeAd.videoContent.load(), e._buildadvertisement.initializeAd.adDisplayContainer.initialize();
							try {
								e._buildadvertisement.initializeAd.adsManager.init(e.adContainer.adVideoElement.width(), e.adContainer.adVideoElement.height(), google.ima.ViewMode.NORMAL), e._buildadvertisement.initializeAd.adsManager.start()
							} catch (t) {
								e._buildadvertisement.initializeAd.videoContent.play()
							}
						}, e._buildadvertisement.initializeAd.onAdsManagerLoaded = function (t) {
							e._buildadvertisement.initializeAd.adsRenderingSettings = new google.ima.AdsRenderingSettings, e._buildadvertisement.initializeAd.adsRenderingSettings.useStyledNonLinearAds = !0, e._buildadvertisement.initializeAd.adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = !0, e._buildadvertisement.initializeAd.adsManager = t.getAdsManager(e.mediaElement.videoElement, e._buildadvertisement.initializeAd.adsRenderingSettings), console.log("the ad cue points are"), console.log(e._buildadvertisement.initializeAd.adsManager.getCuePoints()), e._buildadvertisement.initializeAd.adCues = e._buildadvertisement.initializeAd.adsManager.getCuePoints(), e.mediaElement.videoElement.addEventListener("timeupdate", function (t) {
								e._buildadvertisement._buildadcue()
							}.bind(e)), e._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, e._buildadvertisement.initializeAd.onAdError), e._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, e._buildadvertisement.initializeAd.onContentPauseRequested), e._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, e._buildadvertisement.initializeAd.onContentResumeRequested), e._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, e._buildadvertisement.initializeAd.onAdEvent), e._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.CLICK, e._buildadvertisement.initializeAd.onAdEvent), e._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.PAUSED, e._buildadvertisement.initializeAd.onAdEvent), e._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.RESUMED, e._buildadvertisement.initializeAd.onAdEvent), e._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.VOLUME_CHANGED, e._buildadvertisement.initializeAd.onAdEvent), e._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.VOLUME_MUTED, e._buildadvertisement.initializeAd.onAdEvent), e._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.LOADED, e._buildadvertisement.initializeAd.onAdEvent), e._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.STARTED, e._buildadvertisement.initializeAd.onAdEvent), e._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE, e._buildadvertisement.initializeAd.onAdEvent), e._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.SKIPPED, e._buildadvertisement.initializeAd.onAdEvent), e._buildadvertisement.initializeAd.playAds()
						}, e._buildadvertisement.initializeAd.completesPlayingAd = function () {
							try {
								e._buildadvertisement.initializeAd.isLinear && (SaranyuHlsHTML5Player.Utils.DLOG("Retaining volume status change made in ad player to content player"), e._videoPlayerControls("volumechange", e.adContainer.adBottomControls.volumeSlider.oldVolume), e.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.positionVolumeHandle(e.adContainer.adBottomControls.volumeSlider.oldVolume), e._buildadvertisement.initializeAd.adMuted ? e._videoPlayerControls("mute") : e._videoPlayerControls("unmute"))
							} catch (e) {}
							try {
								clearInterval(e._buildadvertisement.initializeAd.intervalTimer)
							} catch (e) {}
							try {
								SaranyuHlsHTML5Player.Utils.DLOG("resetting ad container height"), e.adContainer.height("100%")
							} catch (e) {}
							try {
								e.adContainer.removeClass("sp-ad-container-display")
							} catch (e) {}
							if ("postroll" != e._buildadvertisement.initializeAd.adObj.schedule) e.mediaElement.videoElement.play();
							else try {
								Number(e.fullControls.playlistPanel.playingIndex) + 1 < e.options.file.length && e.mediaElement.videoElement.play()
							} catch (e) {}
							e.adContainer.removeClass("sp-ad-active"), e.adContainer.removeClass("sp-ad-banner"), e._buildadvertisement.initializeAd.adStarted = !1, e._buildadvertisement.initializeAd.isLinear = !1
						}, e._buildadvertisement.initializeAd.onAdError = function (t) {
							try {
								SaranyuHlsHTML5Player.Utils.DLOG(t.getError())
							} catch (e) {}
							try {
								e._buildadvertisement.initializeAd.isLinear && (SaranyuHlsHTML5Player.Utils.DLOG("Retaining volume status change made in ad player to content player"), e._videoPlayerControls("volumechange", e.adContainer.adBottomControls.volumeSlider.oldVolume), e.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.positionVolumeHandle(e.adContainer.adBottomControls.volumeSlider.oldVolume), e._buildadvertisement.initializeAd.adMuted ? e._videoPlayerControls("mute") : e._videoPlayerControls("unmute"))
							} catch (e) {}
							try {
								e._buildadvertisement.initializeAd.adsManager.destroy()
							} catch (e) {}
							try {
								clearInterval(e._buildadvertisement.initializeAd.intervalTimer)
							} catch (e) {}
							try {
								SaranyuHlsHTML5Player.Utils.DLOG("resetting ad container height"), e.adContainer.height("100%")
							} catch (e) {}
							try {
								e.adContainer.removeClass("sp-ad-container-display")
							} catch (e) {}
							if ("postroll" != e._buildadvertisement.initializeAd.adObj.schedule) e.mediaElement.videoElement.play();
							else try {
								Number(e.fullControls.playlistPanel.playingIndex) + 1 < e.options.file.length && e.mediaElement.videoElement.play()
							} catch (e) {}
							e.adContainer.removeClass("sp-ad-active"), e.adContainer.removeClass("sp-ad-banner"), e._buildadvertisement.initializeAd.adStarted = !1, e._buildadvertisement.initializeAd.isLinear = !1
						}, e._buildadvertisement.initializeAd.onAdEvent = function (t) {
							switch (e._buildadvertisement.initializeAd.ad = t.getAd(), t.type) {
								case google.ima.AdEvent.Type.LOADED:
									SaranyuHlsHTML5Player.Utils.DLOG("New Ads Loaded"), e._buildadvertisement.initializeAd.ad.isLinear() ? (e._buildadvertisement.initializeAd.adStarted = !0, e._buildadvertisement.initializeAd.isLinear = !0, e.adContainer.addClass("sp-ad-active"), e.adContainer.adTopControls.adTitle.html(e._buildadvertisement.initializeAd.ad.getTitle()), e.adContainer.adBottomControls.volumeMuteUnmute.checkDefaultContentVolume(), e._buildadvertisement.initializeAd.intervalTimer = setInterval(function () {
										e._buildadvertisement.initializeAd.remainingTime = e._buildadvertisement.initializeAd.adsManager.getRemainingTime(), e._buildadvertisement.initializeAd.remainingTime = e._buildadvertisement.initializeAd.remainingTime >= 0 ? e._buildadvertisement.initializeAd.remainingTime : 0, e._buildadvertisement.initializeAd.adsManager.resize(e.adContainer.adVideoElement.width(), e.adContainer.adVideoElement.height(), google.ima.ViewMode.NORMAL), e._buildadvertisement._buildadtime.changeCurrentTime(), e._buildadvertisement._buildadtime.changeDuration(), e.mediaElement.videoElement.pause()
									}.bind(e), 300)) : (e._buildadvertisement.initializeAd.adStarted = !0, e._buildadvertisement.initializeAd.isLinear = !1, e.adContainer.addClass("sp-ad-banner"), e.adContainer.adBottomControls.volumeMuteUnmute.checkDefaultContentVolume(), e.adContainer.height(e._buildadvertisement.initializeAd.ad.getHeight() + 10), e._buildadvertisement.initializeAd.intervalTimer = setInterval(function () {
										e._buildadvertisement.initializeAd.adsManager.resize(e.adContainer.adVideoElement.width(), e.adContainer.adVideoElement.height(), google.ima.ViewMode.NORMAL)
									}.bind(e), 300), e.adContainer.adVideoElement.append('<div class="sp-ad-banner-closebtn">Close</div>'), e.adContainer.adVideoElement.bannerAdCloseBtn = e.adContainer.adVideoElement.find(".sp-ad-banner-closebtn"), e.adContainer.adVideoElement.bannerAdCloseBtn.click(function () {
										e.adContainer.removeClass("sp-ad-banner"), $(this).remove()
									}));
									break;
								case google.ima.AdEvent.Type.STARTED:
									e._buildadvertisement.initializeAd.ad.isLinear();
									break;
								case google.ima.AdEvent.Type.CLICK:
									e._buildadvertisement.initializeAd.adsManager.pause();
									break;
								case google.ima.AdEvent.Type.PAUSED:
									e._buildadvertisement.initializeAd.adPaused = !0, e.adContainer.adBottomControls.playpause.changeIcon();
									break;
								case google.ima.AdEvent.Type.RESUMED:
									e._buildadvertisement.initializeAd.adPaused = !1, e.adContainer.adBottomControls.playpause.changeIcon();
									break;
								case google.ima.AdEvent.Type.VOLUME_CHANGED:
									0 == e._buildadvertisement.initializeAd.adsManager.getVolume() ? e._buildadvertisement.initializeAd.adMuted = !0 : (e._buildadvertisement.initializeAd.adMuted = !1, e.adContainer.adBottomControls.volumeSlider.positionVolumeHandle(e._buildadvertisement.initializeAd.adsManager.getVolume())), e.adContainer.adBottomControls.volumeMuteUnmute.changeIcon();
									break;
								case google.ima.AdEvent.Type.VOLUME_MUTED:
									e._buildadvertisement.initializeAd.adMuted = !0, e.adContainer.adBottomControls.volumeMuteUnmute.changeIcon();
									break;
								case google.ima.AdEvent.Type.ALL_ADS_COMPLETED:
								case google.ima.AdEvent.Type.COMPLETE:
								case google.ima.AdEvent.Type.SKIPPED:
									e._buildadvertisement.initializeAd.completesPlayingAd()
							}
						}, e._buildadvertisement.initializeAd.onContentPauseRequested = function () {
							e._buildadvertisement.initializeAd.videoContent.pause()
						}, e._buildadvertisement.initializeAd.onContentResumeRequested = function () {
							e._buildadvertisement.initializeAd.videoContent.play()
						}, e._buildadvertisement.initializeAd.init(t)
					}.bind(e), e._buildadvertisement.adsets = t.advertisement.adsets, e._buildadvertisement.adinvoker = function () {
						e._buildadvertisement.adinvoker.peroll, e._buildadvertisement.adinvoker.midroll = [], e._buildadvertisement.adinvoker.postroll, $.each(e._buildadvertisement.adsets, function (t, o) {
							"preroll" == o.schedule && (SaranyuHlsHTML5Player.Utils.DLOG("Preroll ad has been invoked"), e._buildadvertisement.initializeAd.adObj = o, e._buildadvertisement.initializeAd(e._buildadvertisement.initializeAd.adObj), e._buildadvertisement.adinvoker.peroll = !0)
						})
					},
					function () {
						if (SaranyuHlsHTML5Player.googleImaSDKLoaded) SaranyuHlsHTML5Player.Utils.DLOG("Google IMA SDK was Loaded already"), e._buildadvertisement.adinvoker();
						else {
							var t = document.createElement("script");
							t.type = "text/javascript", t.src = SaranyuHlsHTML5Player.googleImaSDKURL, document.getElementsByTagName("head")[0].appendChild(t), SaranyuHlsHTML5Player.googleImaSDKLoaded = !0, SaranyuHlsHTML5Player.Utils.DLOG("Google IMA SDK Loaded"), t.onload = function () {
								e._buildadvertisement.adinvoker()
							}.bind(e)
						}
					}.bind(e)()
			}
		} else t.advertisement && (l = '<div class="sp-ad-top-controlbar"></div>', a = '<div class="sp-ad-video-element"></div>', n = '<div class="sp-ad-bottom-controlbar"></div>', i = '<video class="sp-ad-dummy-video"></video>', e.adContainer.append(i), e.adContainer.append(l), e.adContainer.append(a), e.adContainer.append(n), e.adContainer.adTopControls = e.adContainer.find(".sp-ad-top-controlbar"), e.adContainer.adVideoElement = e.adContainer.find(".sp-ad-video-element"), e.adContainer.adBottomControls = e.adContainer.find(".sp-ad-bottom-controlbar"), e.adContainer.adDummyVideoTag = e.adContainer.find(".sp-ad-dummy-video"), e._buildadvertisement._buildadcue = function () {
			if (SaranyuHlsHTML5Player.Utils.DLOG("Building ad title icon for ad container"), e._buildadvertisement._buildadcue.constructed = !1, !e._buildadvertisement._buildadcue.constructed) {
				try {
					e.fullControls.bottomControlBar.bottomProgressBar.progressbar.cues.empty()
				} catch (e) {}
				$.each(e._buildadvertisement.adsets, function (t, o) {
					if (Number(o.schedule)) {
						var l = SaranyuHlsHTML5Player.Utils.getPercentageForGivenDuration(o.schedule, e.mediaElement.videoElement.duration);
						if (!(l >= 0 && l <= 100)) return !0;
						var a = "<span class='sp-ad-cue-points sp-ad-cue-points-" + t + "' style='left:" + l + "%'></span>";
						e.fullControls.bottomControlBar.bottomProgressBar.progressbar.cues.append(a), e.fullControls.bottomControlBar.bottomProgressBar.progressbar.cues.find(".sp-ad-cue-points-" + t), e._buildadvertisement._buildadcue.constructed = !0
					}
				})
			}
		}, e._buildadvertisement._buildadtitle = function () {
			SaranyuHlsHTML5Player.Utils.DLOG("Building ad title icon for ad container"), e.adContainer.adTopControls.append('<div class="ad-video-title"><span class="ad-video-title-text"></span></div>'), e.adContainer.adTopControls.adTitle = e.adContainer.adTopControls.find(".ad-video-title-text")
		}, e._buildadvertisement._buildadplaypause = function () {
			SaranyuHlsHTML5Player.Utils.DLOG("Building playpause icon for ad container"), e.adContainer.adBottomControls.append('<div class="sp-ad-button sp-ad-playpause sp-ad-play"><button></button></div>'), e.adContainer.adBottomControls.playpause = e.adContainer.adBottomControls.find(".sp-ad-playpause"), e.adContainer.adBottomControls.playpause.click(function () {
				SaranyuHlsHTML5Player.Utils.DLOG("AD play pause button clicked");
				try {
					e._buildadvertisement.initializeAd.adPaused ? (e._buildadvertisement.initializeAd.adsManager.resume(), e._buildadvertisement.initializeAd.adPaused = !1) : (e._buildadvertisement.initializeAd.adsManager.pause(), e._buildadvertisement.initializeAd.adPaused = !0)
				} catch (e) {}
			}.bind(e)), e.adContainer.adBottomControls.playpause.changeIcon = function () {
				e._buildadvertisement.initializeAd.adPaused ? e.adContainer.adBottomControls.playpause.removeClass("sp-ad-play").addClass("sp-ad-pause") : e.adContainer.adBottomControls.playpause.removeClass("sp-ad-pause").addClass("sp-ad-play")
			}
		}, e._buildadvertisement._buildadvolume = function () {
			SaranyuHlsHTML5Player.Utils.DLOG("Building volume icon for ad container"), e.adContainer.adBottomControls.append('<div class="sp-ad-button sp-ad-volume-muteunmute sp-ad-unmute"><button></button></div>'), e.adContainer.adBottomControls.volumeMuteUnmute = e.adContainer.adBottomControls.find(".sp-ad-volume-muteunmute"), e.adContainer.adBottomControls.append('<div class="sp-ad-volume-slider sp-ad-volume-slider-wrap"><div class="sp-ad-volume-current"></div><div class="sp-ad-volume-handle"></div></div>'), e.adContainer.adBottomControls.volumeSlider = e.adContainer.adBottomControls.find(".sp-ad-volume-slider.sp-ad-volume-slider-wrap"), e.adContainer.adBottomControls.volumeSlider.volumeCurrent = e.adContainer.adBottomControls.volumeSlider.find(".sp-ad-volume-current"), e.adContainer.adBottomControls.volumeSlider.volumeHandle = e.adContainer.adBottomControls.volumeSlider.find(".sp-ad-volume-handle"), e.adContainer.adBottomControls.volumeSlider.oldVolume = 1, e.adContainer.adBottomControls.volumeSlider.positionVolumeHandle = function (t) {
				e.adContainer.adBottomControls.volumeSlider.volumeCurrent.css("width", 100 * t + "%"), e.adContainer.adBottomControls.volumeSlider.volumeHandle.css("left", "calc(" + 100 * t + "% - " + e.adContainer.adBottomControls.volumeSlider.volumeHandle.width() / 2 + "px)")
			}, e.adContainer.adBottomControls.volumeSlider.handleVolumeMove = function (t) {
				var o = null,
					l = e.adContainer.adBottomControls.volumeSlider,
					a = l.offset(),
					n = l.width();
				o = (t.pageX - a.left) / n, o = Math.max(0, o), o = Math.min(o, 1), e.adContainer.adBottomControls.volumeSlider.positionVolumeHandle(o);
				try {
					e._buildadvertisement.initializeAd.adsManager.setVolume(o), e.adContainer.adBottomControls.volumeSlider.oldVolume = o
				} catch (t) {}
			}, e.adContainer.adBottomControls.volumeSlider.bind("mouseover", function (t) {
				t = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(t), e.adContainer.adBottomControls.volumeSlider.mouseIsOver = !0
			}).bind("mousemove", function (t) {
				t = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(t), 1 == e.adContainer.adBottomControls.volumeSlider.mouseIsDown && e.adContainer.adBottomControls.volumeSlider.handleVolumeMove(t)
			}).bind("mouseup", function (t) {
				t = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(t), e.adContainer.adBottomControls.volumeSlider.mouseIsDown = !1
			}).bind("mousedown", function (t) {
				t = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(t), e.adContainer.adBottomControls.volumeSlider.handleVolumeMove(t), e.adContainer.adBottomControls.volumeSlider.mouseIsDown = !0
			}).bind("mouseleave", function (t) {
				t = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(t), e.adContainer.adBottomControls.volumeSlider.mouseIsDown = !1
			}), e.adContainer.adBottomControls.volumeMuteUnmute.click(function () {
				e._buildadvertisement.initializeAd.adMuted ? (e.adContainer.adBottomControls.volumeSlider.oldVolume >= 0 && e._buildadvertisement.initializeAd.adsManager.setVolume(e.adContainer.adBottomControls.volumeSlider.oldVolume), e._buildadvertisement.initializeAd.adsManager.setVolume(.2), e._buildadvertisement.initializeAd.adMuted = !1) : (e._buildadvertisement.initializeAd.adsManager.setVolume(0), e._buildadvertisement.initializeAd.adMuted = !0)
			}), e.adContainer.adBottomControls.volumeMuteUnmute.changeIcon = function () {
				e._buildadvertisement.initializeAd.adMuted ? (e.adContainer.adBottomControls.volumeMuteUnmute.addClass("sp-ad-mute").removeClass("sp-ad-unmute"), e.adContainer.adBottomControls.volumeSlider.hide()) : (e.adContainer.adBottomControls.volumeMuteUnmute.addClass("sp-ad-unmute").removeClass("sp-ad-mute"), e.adContainer.adBottomControls.volumeSlider.show())
			}, e.adContainer.adBottomControls.volumeMuteUnmute.checkDefaultContentVolume = function () {
				e.mediaElement.videoElement.muted ? (e.adContainer.adBottomControls.volumeMuteUnmute.removeClass("sp-ad-unmute").addClass("sp-ad-mute"), e._buildadvertisement.initializeAd.adsManager.setVolume(0), e.adContainer.adBottomControls.volumeSlider.oldVolume = e.mediaElement.videoElement.volume, e.adContainer.adBottomControls.volumeSlider.positionVolumeHandle(e.adContainer.adBottomControls.volumeSlider.oldVolume), e._buildadvertisement.initializeAd.adMuted = !0) : (e.adContainer.adBottomControls.volumeMuteUnmute.removeClass("sp-ad-mute").addClass("sp-ad-unmute"), e._buildadvertisement.initializeAd.adsManager.setVolume(e.mediaElement.videoElement.volume), e.adContainer.adBottomControls.volumeSlider.oldVolume = e.mediaElement.videoElement.volume, e.adContainer.adBottomControls.volumeSlider.positionVolumeHandle(e.adContainer.adBottomControls.volumeSlider.oldVolume), e._buildadvertisement.initializeAd.adMuted = !1)
			}
		}, e._buildadvertisement._buildadtime = function () {
			SaranyuHlsHTML5Player.Utils.DLOG("Building time for ad container"), e.adContainer.adBottomControls.append('<div class="sp-ad-player-time"><span class="sp-ad-plyr-currenttime">00:00</span>&nbsp;/&nbsp;<span class="sp-ad-plyr-duration">00:00</span></div>'), e.adContainer.adBottomControls.timeContainer = e.adContainer.adBottomControls.find(".sp-ad-player-time"), e.adContainer.adBottomControls.timeContainer.currentTime = e.adContainer.adBottomControls.find(".sp-ad-plyr-currenttime"), e.adContainer.adBottomControls.timeContainer.duration = e.adContainer.adBottomControls.find(".sp-ad-plyr-duration"), e._buildadvertisement._buildadtime.changeCurrentTime = function () {
				try {
					var t;
					t = e._buildadvertisement.initializeAd.ad.getDuration() - e._buildadvertisement.initializeAd.remainingTime >= 0 ? e._buildadvertisement.initializeAd.ad.getDuration() - e._buildadvertisement.initializeAd.remainingTime : 0, e.adContainer.adBottomControls.timeContainer.currentTime.html(SaranyuHlsHTML5Player.Utils.secondsToTimeCode(t))
				} catch (e) {}
			}, e._buildadvertisement._buildadtime.changeDuration = function () {
				try {
					e.adContainer.adBottomControls.timeContainer.duration.html(SaranyuHlsHTML5Player.Utils.secondsToTimeCode(e._buildadvertisement.initializeAd.ad.getDuration()))
				} catch (e) {}
			}
		}, e._buildadvertisement._buildadfullScreen = function () {
			SaranyuHlsHTML5Player.Utils.DLOG("Building playpause icon for ad container"), e.adContainer.adBottomControls.append('<div class="sp-ad-button sp-ad-fullscreen-unfullscreen sp-ad-fullscreen"><button></button></div>'), e.adContainer.adBottomControls.fullscreenunfullscreen = e.adContainer.adBottomControls.find(".sp-ad-fullscreen-unfullscreen"), e.isFullScreen ? e.adContainer.adBottomControls.fullscreenunfullscreen.removeClass("sp-ad-fullscreen").addClass("sp-ad-unfullscreen") : e.adContainer.adBottomControls.fullscreenunfullscreen.removeClass("sp-ad-unfullscreen").addClass("sp-ad-fullscreen"), e.adContainer.adBottomControls.fullscreenunfullscreen.click(function (t) {
				t.preventDefault(), SaranyuHlsHTML5Player.Utils.DLOG("Clicked on FullScreen"), e.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.toggleFullscreen(), setTimeout(function () {
					e.isFullScreen ? e.adContainer.adBottomControls.fullscreenunfullscreen.removeClass("sp-ad-fullscreen").addClass("sp-ad-unfullscreen") : e.adContainer.adBottomControls.fullscreenunfullscreen.removeClass("sp-ad-unfullscreen").addClass("sp-ad-fullscreen")
				}.bind(e), 600)
			}.bind(e))
		}, e._buildadvertisement._createAdControls = function () {
			SaranyuHlsHTML5Player.Utils.DLOG("_createAdControls");
			var e = o;
			this._buildadvertisement._destroyAdControls();
			for (featureIndex in e)
				if (feature = e[featureIndex], SaranyuHlsHTML5Player.Utils.DLOG("ad feature found is " + feature), this._buildadvertisement["_buildad" + feature]) try {
					this._buildadvertisement["_buildad" + feature]()
				} catch (e) {
					SaranyuHlsHTML5Player.Utils.DLOG(e)
				} else SaranyuHlsHTML5Player.Utils.DLOG("Error could not find function")
		}.bind(e), e._buildadvertisement._destroyAdControls = function () {
			SaranyuHlsHTML5Player.Utils.DLOG("_destroyAdControls"), this.adContainer.adTopControls.empty(), this.adContainer.adBottomControls.empty(), this.adContainer.adVideoElement.empty();
			try {
				this.fullControls.bottomControlBar.bottomProgressBar.progressbar.cues.empty()
			} catch (e) {}
		}.bind(e), e._buildadvertisement._createAdControls(), e._buildadvertisement.initializeAd = function (t) {
			try {
				try {
					e.adContainer.adBottomControls.volumeMuteUnmute.checkDefaultContentVolume()
				} catch (e) {}
				e._buildadvertisement.initializeAd.onAdError()
			} catch (e) {}
			e._buildadvertisement.initializeAd.adsManager, e._buildadvertisement.initializeAd.adsLoader, e._buildadvertisement.initializeAd.adDisplayContainer, e._buildadvertisement.initializeAd.intervalTimer, e._buildadvertisement.initializeAd.videoContent, e._buildadvertisement.initializeAd.adStarted = !1, e._buildadvertisement.initializeAd.isLinear = !1, e._buildadvertisement.initializeAd.adObj, e._buildadvertisement.initializeAd.adPaused = !1, e._buildadvertisement.initializeAd.adMuted = !1, e._buildadvertisement.initializeAd.init = function (t) {
				e._buildadvertisement.initializeAd.videoContent = e.adContainer.adDummyVideoTag[0], e._buildadvertisement.initializeAd.setUpIMA(t)
			}, e._buildadvertisement.initializeAd.setUpIMA = function (t) {
				e._buildadvertisement.initializeAd.createAdDisplayContainer(), e._buildadvertisement.initializeAd.adsLoader = new google.ima.AdsLoader(e._buildadvertisement.initializeAd.adDisplayContainer), e._buildadvertisement.initializeAd.adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, e._buildadvertisement.initializeAd.onAdsManagerLoaded, !1), e._buildadvertisement.initializeAd.adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, e._buildadvertisement.initializeAd.onAdError, !1), e._buildadvertisement.initializeAd.adsRequest = new google.ima.AdsRequest, e._buildadvertisement.initializeAd.adsRequest.adTagUrl = t.adurl, e._buildadvertisement.initializeAd.adsLoader.requestAds(e._buildadvertisement.initializeAd.adsRequest)
			}.bind(e), e._buildadvertisement.initializeAd.createAdDisplayContainer = function () {
				try {
					e.adContainer.adVideoElement.empty()
				} catch (e) {}
				google.ima.settings.setVpaidMode(google.ima.ImaSdkSettings.VpaidMode.ENABLED), e._buildadvertisement.initializeAd.adDisplayContainer = new google.ima.AdDisplayContainer(e.adContainer.adVideoElement[0], e._buildadvertisement.initializeAd.videoContent[0])
			}, e._buildadvertisement.initializeAd.playAds = function () {
				try {
					e.adContainer.addClass("sp-ad-container-display")
				} catch (e) {}
				e._buildadvertisement.initializeAd.videoContent.load(), e._buildadvertisement.initializeAd.adDisplayContainer.initialize();
				try {
					e._buildadvertisement.initializeAd.adsManager.init(e.adContainer.adVideoElement.width(), e.adContainer.adVideoElement.height(), google.ima.ViewMode.NORMAL), e._buildadvertisement.initializeAd.adsManager.start()
				} catch (t) {
					e._buildadvertisement.initializeAd.videoContent.play()
				}
			}, e._buildadvertisement.initializeAd.onAdsManagerLoaded = function (t) {
				e._buildadvertisement.initializeAd.adsRenderingSettings = new google.ima.AdsRenderingSettings, e._buildadvertisement.initializeAd.adsManager = t.getAdsManager(e._buildadvertisement.initializeAd.videoContent, e._buildadvertisement.initializeAd.adsRenderingSettings), e._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, e._buildadvertisement.initializeAd.onAdError), e._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, e._buildadvertisement.initializeAd.onContentPauseRequested), e._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, e._buildadvertisement.initializeAd.onContentResumeRequested), e._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, e._buildadvertisement.initializeAd.onAdEvent), e._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.CLICK, e._buildadvertisement.initializeAd.onAdEvent), e._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.PAUSED, e._buildadvertisement.initializeAd.onAdEvent), e._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.RESUMED, e._buildadvertisement.initializeAd.onAdEvent), e._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.VOLUME_CHANGED, e._buildadvertisement.initializeAd.onAdEvent), e._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.VOLUME_MUTED, e._buildadvertisement.initializeAd.onAdEvent), e._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.LOADED, e._buildadvertisement.initializeAd.onAdEvent), e._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.STARTED, e._buildadvertisement.initializeAd.onAdEvent), e._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE, e._buildadvertisement.initializeAd.onAdEvent), e._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.SKIPPED, e._buildadvertisement.initializeAd.onAdEvent), e._buildadvertisement.initializeAd.playAds()
			}, e._buildadvertisement.initializeAd.onAdError = function (t) {
				try {
					SaranyuHlsHTML5Player.Utils.DLOG(t.getError())
				} catch (e) {}
				try {
					e._buildadvertisement.initializeAd.isLinear && (SaranyuHlsHTML5Player.Utils.DLOG("Retaining volume status change made in ad player to content player"), e._videoPlayerControls("volumechange", e.adContainer.adBottomControls.volumeSlider.oldVolume), e.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.positionVolumeHandle(e.adContainer.adBottomControls.volumeSlider.oldVolume), e._buildadvertisement.initializeAd.adMuted ? e._videoPlayerControls("mute") : e._videoPlayerControls("unmute"))
				} catch (e) {}
				try {
					e._buildadvertisement.initializeAd.adsManager.destroy()
				} catch (e) {}
				try {
					clearInterval(e._buildadvertisement.initializeAd.intervalTimer)
				} catch (e) {}
				try {
					SaranyuHlsHTML5Player.Utils.DLOG("resetting ad container height"), e.adContainer.height("100%")
				} catch (e) {}
				try {
					e.adContainer.removeClass("sp-ad-container-display")
				} catch (e) {}
				if ("postroll" != e._buildadvertisement.initializeAd.adObj.schedule) e.mediaElement.videoElement.play();
				else try {
					Number(e.fullControls.playlistPanel.playingIndex) + 1 < e.options.file.length && e.mediaElement.videoElement.play()
				} catch (e) {}
				e.adContainer.removeClass("sp-ad-active"), e.adContainer.removeClass("sp-ad-banner"), e._buildadvertisement.initializeAd.adStarted = !1, e._buildadvertisement.initializeAd.isLinear = !1
			}, e._buildadvertisement.initializeAd.onAdEvent = function (t) {
				switch (e._buildadvertisement.initializeAd.ad = t.getAd(), t.type) {
					case google.ima.AdEvent.Type.LOADED:
						e._buildadvertisement.initializeAd.ad.isLinear() ? (e._buildadvertisement.initializeAd.adStarted = !0, e._buildadvertisement.initializeAd.isLinear = !0, e.adContainer.addClass("sp-ad-active"), e.adContainer.adTopControls.adTitle.html(e._buildadvertisement.initializeAd.ad.getTitle()), e.adContainer.adBottomControls.volumeMuteUnmute.checkDefaultContentVolume(), e._buildadvertisement.initializeAd.intervalTimer = setInterval(function () {
							e._buildadvertisement.initializeAd.remainingTime = e._buildadvertisement.initializeAd.adsManager.getRemainingTime(), e._buildadvertisement.initializeAd.remainingTime = e._buildadvertisement.initializeAd.remainingTime >= 0 ? e._buildadvertisement.initializeAd.remainingTime : 0, e._buildadvertisement.initializeAd.adsManager.resize(e.adContainer.adVideoElement.width(), e.adContainer.adVideoElement.height(), google.ima.ViewMode.NORMAL), e._buildadvertisement._buildadtime.changeCurrentTime(), e._buildadvertisement._buildadtime.changeDuration(), e.mediaElement.videoElement.pause()
						}.bind(e), 300)) : (e._buildadvertisement.initializeAd.adStarted = !0, e._buildadvertisement.initializeAd.isLinear = !1, e.adContainer.addClass("sp-ad-banner"), e.adContainer.adBottomControls.volumeMuteUnmute.checkDefaultContentVolume(), e.adContainer.height(e._buildadvertisement.initializeAd.ad.getHeight() + 10), e._buildadvertisement.initializeAd.intervalTimer = setInterval(function () {
							e._buildadvertisement.initializeAd.adsManager.resize(e.adContainer.adVideoElement.width(), e.adContainer.adVideoElement.height(), google.ima.ViewMode.NORMAL)
						}.bind(e), 300), e.adContainer.adVideoElement.append('<div class="sp-ad-banner-closebtn">Close</div>'), e.adContainer.adVideoElement.bannerAdCloseBtn = e.adContainer.adVideoElement.find(".sp-ad-banner-closebtn"), e.adContainer.adVideoElement.bannerAdCloseBtn.click(function () {
							e.adContainer.removeClass("sp-ad-banner"), $(this).remove()
						}));
						break;
					case google.ima.AdEvent.Type.STARTED:
						e._buildadvertisement.initializeAd.ad.isLinear();
						break;
					case google.ima.AdEvent.Type.CLICK:
						e._buildadvertisement.initializeAd.adsManager.pause();
						break;
					case google.ima.AdEvent.Type.PAUSED:
						e._buildadvertisement.initializeAd.adPaused = !0, e.adContainer.adBottomControls.playpause.changeIcon();
						break;
					case google.ima.AdEvent.Type.RESUMED:
						e._buildadvertisement.initializeAd.adPaused = !1, e.adContainer.adBottomControls.playpause.changeIcon();
						break;
					case google.ima.AdEvent.Type.VOLUME_CHANGED:
						0 == e._buildadvertisement.initializeAd.adsManager.getVolume() ? e._buildadvertisement.initializeAd.adMuted = !0 : (e._buildadvertisement.initializeAd.adMuted = !1, e.adContainer.adBottomControls.volumeSlider.positionVolumeHandle(e._buildadvertisement.initializeAd.adsManager.getVolume())), e.adContainer.adBottomControls.volumeMuteUnmute.changeIcon();
						break;
					case google.ima.AdEvent.Type.VOLUME_MUTED:
						e._buildadvertisement.initializeAd.adMuted = !0, e.adContainer.adBottomControls.volumeMuteUnmute.changeIcon();
						break;
					case google.ima.AdEvent.Type.ALL_ADS_COMPLETED:
					case google.ima.AdEvent.Type.COMPLETE:
					case google.ima.AdEvent.Type.SKIPPED:
						e._buildadvertisement.initializeAd.onAdError()
				}
			}, e._buildadvertisement.initializeAd.onContentPauseRequested = function () {
				e._buildadvertisement.initializeAd.videoContent.pause()
			}, e._buildadvertisement.initializeAd.onContentResumeRequested = function () {
				e._buildadvertisement.initializeAd.videoContent.play()
			}, e._buildadvertisement.initializeAd.init(t)
		}.bind(e), e._buildadvertisement.adsets = t.advertisement.adsets, e._buildadvertisement.adinvoker = function () {
			e._buildadvertisement.adinvoker.peroll, e._buildadvertisement.adinvoker.midroll = [], e._buildadvertisement.adinvoker.postroll, $.each(e._buildadvertisement.adsets, function (t, o) {
				"preroll" == o.schedule && (SaranyuHlsHTML5Player.Utils.DLOG("Preroll ad has been invoked"), e._buildadvertisement.initializeAd.adObj = o, e._buildadvertisement.initializeAd(e._buildadvertisement.initializeAd.adObj), e._buildadvertisement.adinvoker.peroll = !0), isNaN(o.schedule) || (o.flag = !0, e._buildadvertisement.adinvoker.midroll.push(o)), "postroll" == o.schedule && e.mediaElement.videoElement.addEventListener("ended", function () {
					e._buildadvertisement.adinvoker.postroll ? SaranyuHlsHTML5Player.Utils.DLOG("Postroll ad has been played") : (SaranyuHlsHTML5Player.Utils.DLOG("Postroll ad has been invoked"), e._buildadvertisement.initializeAd.adObj = o, e._buildadvertisement.initializeAd(e._buildadvertisement.initializeAd.adObj), e._buildadvertisement.adinvoker.postroll = !0)
				}.bind(e))
			}), e._buildadvertisement.adinvoker.midroll && e.mediaElement.videoElement.addEventListener("timeupdate", function () {
				"true" != e.options.advertisement.cues || isNaN(e.mediaElement.videoElement.duration) || "vod" != e.options.content || e._buildadvertisement._buildadcue.constructed || e._buildadvertisement._buildadcue(), $.each(e._buildadvertisement.adinvoker.midroll, function (t, o) {
					var l = e.mediaElement.videoElement;
					l.currentTime >= Number(o.schedule) && o.flag && !l.paused && (SaranyuHlsHTML5Player.Utils.DLOG("midroll ad has been invoked with schedule " + Number(o.schedule)), e._buildadvertisement.initializeAd.adObj = o, e._buildadvertisement.initializeAd(e._buildadvertisement.initializeAd.adObj), e._buildadvertisement.initializeAd.adObj.flag = !1)
				})
			}.bind(e))
		}, function () {
			if (SaranyuHlsHTML5Player.googleImaSDKLoaded) SaranyuHlsHTML5Player.Utils.DLOG("Google IMA SDK was Loaded already"), e._buildadvertisement.adinvoker();
			else {
				var t = document.createElement("script");
				t.type = "text/javascript", t.src = SaranyuHlsHTML5Player.googleImaSDKURL, document.getElementsByTagName("head")[0].appendChild(t), SaranyuHlsHTML5Player.googleImaSDKLoaded = !0, SaranyuHlsHTML5Player.Utils.DLOG("Google IMA SDK Loaded"), t.onload = function () {
					e._buildadvertisement.adinvoker()
				}.bind(e)
			}
		}.bind(e)())
	},
	_videoPlayerControls: function (e, t) {
		SaranyuHlsHTML5Player.Utils.DLOG("inside video controls function received command , " + e + " with value of " + t);
		var o = this,
			l = o.mediaElement.videoElement;
		switch (o.options, e) {
			case "play":
				try {
					o.mediaElement.videoElement.saranyuHlsMertics.islive && "livedvr" != o.options.content.toLowerCase() && (l.currentTime = l.duration - 3 * o.mediaElement.videoElement.saranyuHlsMertics.targetduration)
				} catch (e) {}
				l.play(), SaranyuHlsHTML5Player.Utils.DLOG(e + " to video player");
				break;
			case "pause":
				l.pause(), SaranyuHlsHTML5Player.Utils.DLOG(e + " to video player");
				break;
			case "stop":
				l.currentTime = 0, l.pause(), SaranyuHlsHTML5Player.Utils.DLOG(e + " to video player");
				break;
			case "mute":
				console.log("mute======================="), console.log(t), l.muted = !0, SaranyuHlsHTML5Player.Utils.DLOG(e + " to video player");
				break;
			case "unmute":
				l.muted = !1, SaranyuHlsHTML5Player.Utils.DLOG(e + " to video player");
				break;
			case "volumechange":
				console.log("volumechange======================="), l.volume = t, SaranyuHlsHTML5Player.Utils.DLOG(e + " to video player");
				break;
			case "seek":
				l.currentTime = t, l.play(), SaranyuHlsHTML5Player.Utils.DLOG(e + " to video player")
		}
	},
	_getCurrentTime: function () {
		var e = this.mediaElement.videoElement;
		return this.options, e.currentTime
	},
	_playcustomPlayList: function (e) {
		SaranyuHlsHTML5Player.Utils.DLOG("Building custom playlist"), this.mediaElement.videoElement, this._createAndAppendHLStoPlayer(e), this._videoPlayerControls("play")
	},
	_isSupportedMSE: function () {
		return window.MediaSource = window.MediaSource || window.WebKitMediaSource, window.MediaSource && "function" == typeof window.MediaSource.isTypeSupported && window.MediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"')
	},
	_checkHLS: function () {
		return !!(navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i))
	}
};
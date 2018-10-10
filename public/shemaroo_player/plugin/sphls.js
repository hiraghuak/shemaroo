var SaranyuHlsHTML5Player = SaranyuHlsHTML5Player || {};
SaranyuHlsHTML5Player.version = "0.0.1";
SaranyuHlsHTML5Player.players = [];
SaranyuHlsHTML5Player.PLUGIN_NAME = "Saranyu HLS Video Player";
SaranyuHlsHTML5Player.debug = false;
SaranyuHlsHTML5Player.inActivityTimeout = 3000;
SaranyuHlsHTML5Player.googleImaSDKURL = "//imasdk.googleapis.com/js/sdkloader/ima3.js";
SaranyuHlsHTML5Player.googleImaSDKLoaded = false;
SaranyuHlsHTML5Player.maxNonLinearAdHeight = 150;
SaranyuHlsHTML5Player.defaultOptions = {
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
};
SaranyuHlsHTML5Player.Utils = {
	DLOG: function () {
		if (!SaranyuHlsHTML5Player.debug) {
			console.log(SaranyuHlsHTML5Player.PLUGIN_NAME + ": ", arguments)
		}
		return
	},
	secondsToTimeCode: function (e, h, b, d) {
		if (typeof b == "undefined") {
			b = false
		} else {
			if (typeof d == "undefined") {
				d = 25
			}
		}
		var a = Math.floor(e / 3600) % 24,
			c = Math.floor(e / 60) % 60,
			g = Math.floor(e % 60),
			f = Math.floor(((e % 1) * d).toFixed(3)),
			a = ((isNaN(a)) ? 0 : a);
		c = ((isNaN(c)) ? 0 : c);
		g = ((isNaN(g)) ? 0 : g);
		result = ((h || a > 0) ? (a < 10 ? "0" + a : a) + ":" : "") + (c < 10 ? "0" + c : c) + ":" + (g < 10 ? "0" + g : g) + ((b) ? ":" + (f < 10 ? "0" + f : f) : "");
		return result
	},
	timeCodeToSeconds: function (c, h, a, b) {
		if (typeof a == "undefined") {
			a = false
		} else {
			if (typeof b == "undefined") {
				b = 25
			}
		}
		if (c) {
			if (c) {
				var g = c.split(":");
				var d = 0;
				if (g.length == 3) {
					var i = Number(g[0]);
					var e = Number(g[1]);
					var f = Number(g[2]);
					d = (i * 60 * 60) + (e * 60) + (f)
				} else {
					if (g.length == 2) {
						var e = Number(g[0]);
						var f = Number(g[1]);
						d = (e * 60) + (f)
					}
				}
			} else {
				var d = 0
			}
		}
		return d
	},
	getWidthInPercentage: function (b) {
		var a = b.parent();
		return ((b.width() / a.width()) * 100).toFixed(0) + "%"
	},
	getHeightInPercentage: function (b) {
		var a = b.parent();
		return ((b.height() / a.height()) * 100).toFixed(0) + "%"
	},
	preventSelectionOfTextInMouseMove: function (a) {
		if (a.stopPropagation) {
			a.stopPropagation()
		}
		if (a.preventDefault) {
			a.preventDefault()
		}
		a.cancelBubble = true;
		a.returnValue = false;
		return a
	},
	getPercentageForGivenDuration: function (b, a) {
		return ((b / a) * 100)
	}
};
SaranyuHlsHTML5Player.MediaFeatures = {
	init: function () {
		var d = this,
			f = window.navigator,
			c = navigator.userAgent.toLowerCase(),
			b, a = null,
			e = ["source", "track", "audio", "video"]
	}
};
SaranyuHlsHTML5Player.MediaFeatures.init();
SaranyuHlsHTML5Player.MediaPlayer = function (c, a, d) {
	SaranyuHlsHTML5Player.Utils.DLOG("Constructor", c, a);
	var b = this;
	b.masterElementid = c;
	b.options = a;
	b.playerType = d;
	b.$masterContainer = $(c);
	b._validateParams(a);
	b.init()
};
SaranyuHlsHTML5Player.MediaPlayer.prototype = {
	_validateParams: function (a) {
		if (a.type) {
			SaranyuHlsHTML5Player.Utils.DLOG("Media Type present. Check if its valid");
			if ($.inArray(a.type, SaranyuHlsHTML5Player.MediaTypes) > -1) {
				SaranyuHlsHTML5Player.Utils.DLOG("Valid Media Types");
				if (a.file) {
					SaranyuHlsHTML5Player.Utils.DLOG("File Info Present")
				} else {
					SaranyuHlsHTML5Player.Utils.DLOG("File Information Not present")
				}
			} else {
				SaranyuHlsHTML5Player.Utils.DLOG("Unknown Media Type")
			}
		} else {
			SaranyuHlsHTML5Player.Utils.DLOG("Media Type Not present")
		}
	},
	init: function () {
		var a = this;
		SaranyuHlsHTML5Player.Utils.DLOG("Init Function", a, a.options, a.$masterContainer);
		a.container = $('<div class="sp-main-container-wrapper"><div class="sp-main-container"><div class="sp-player-inner"><div class="sp-ad-container"></div><div class="sp-media-element"></div><div class="sp-player-layers"></div><div class="sp-full-controls"></div></div></div></div>').appendTo(a.$masterContainer);
		a.mainContainerWrapper = a.container.find(".sp-main-container-wrapper");
		a.mainContainer = a.container.find(".sp-main-container");
		a.playerInner = a.container.find(".sp-player-inner");
		a.adContainer = a.container.find(".sp-ad-container");
		a.mediaElement = a.container.find(".sp-media-element");
		a.playerLayers = a.container.find(".sp-player-layers");
		a.fullControls = a.container.find(".sp-full-controls");
		a._createMediaElement();
		a._createFullControls();
		a._createIndividualControls();
		a._createAndAppendHLStoPlayer(a.options.file[0]);
		a._hideControlsUnderInactivity();
		a._createCustomContextmenu()
	},
	_createMediaElement: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("_createMediaElement function being called");
		var b = this;
		var a = b.mediaElement;
		var c = "<video></video>";
		a.append(c);
		b.mediaElement.videoElement = a.find("video")[0]
	},
	_createFullControls: function () {
		var b = this;
		var e = '<div class="sp-controls-top"></div>';
		b.fullControls.append(e);
		b.fullControls.topContolbar = b.fullControls.find(".sp-controls-top");
		var mid = '<div class="sp-controls-middle"></div>';
		b.fullControls.append(mid);
		b.fullControls.middleControlbar = b.fullControls.find(".sp-controls-middle");
		var a1 = '<div class="sp-controls-bottom1"></div>';
		b.fullControls.append(a1);
		b.fullControls.bottomControlBar1 = b.fullControls.find(".sp-controls-bottom1");
		var a = '<div class="sp-controls-bottom"></div>';
		b.fullControls.append(a);
		b.fullControls.bottomControlBar = b.fullControls.find(".sp-controls-bottom");
		var c = '<div class="sp-controls-bottom-progress-bar"></div>';
		b.fullControls.bottomControlBar1.append(c);
		b.fullControls.bottomControlBar1.bottomProgressBar = b.fullControls.find(".sp-controls-bottom-progress-bar");
		var d = '<div class="sp-controls-bottom-plyr-controls"></div>';
		b.fullControls.bottomControlBar.append(d);
		b.fullControls.bottomControlBar.bottomPlayerControls = b.fullControls.find(".sp-controls-bottom-plyr-controls");
		b._createFullControls.hideFullControls = function () {
			b.fullControls.hide();
			try {
				if (b._buildadvertisement.initializeAd.adStarted && !b._buildadvertisement.initializeAd.isLinear) {
					b.adContainer.removeClass("sp-playlist-show")
				}
			} catch (f) {}
		};
		b._createFullControls.showFullControls = function () {
			b.fullControls.show();
			try {
				if (b.fullControls.playlistPanel.is(":visible")) {
					try {
						if (b._buildadvertisement.initializeAd.adStarted && !b._buildadvertisement.initializeAd.isLinear) {
							b.adContainer.addClass("sp-playlist-show")
						}
					} catch (h) {}
				}
			} catch (h) {}
			try {
				var g = b.mediaElement.videoElement;
				var f = g.currentTime / g.duration;
				b._buildprogressbar.adjustCurrentAndHandleInSeek(f)
			} catch (h) {}
		}
	},
	_createIndividualControls: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("_createcontrols function being called");
		var a = this;
		var b = a.options.features;
		SaranyuHlsHTML5Player.Utils.DLOG("options pass is " + b);
		for (featureIndex in b) {
			feature = b[featureIndex];
			if (a["_build" + feature]) {
				a["_build" + feature]()
			}
		}
	},
	_createAndAppendHLStoPlayer: function (d) {
		var c = this;
		var g = c.mediaElement.videoElement;
		var a = d.content_url;
		var b = c.options;
		if (c.mediaElement.videoElement.hlsObj) {
			c.mediaElement.videoElement.hlsObj.destroy()
		}
		c._createAndAppendHLStoPlayer._attachHLStoVideo = function () {
			if (Hls.isSupported()) {
				c.mediaElement.videoElement.saranyuHlsMertics = {};
				c.mediaElement.videoElement.saranyuHlsMertics.playbackRateOld = g.playbackRate;
				c.mediaElement.videoElement.hlsObj = new Hls();
				c.mediaElement.videoElement.hlsObj.loadSource(a);
				c.mediaElement.videoElement.hlsObj.attachMedia(g);
				c.mediaElement.videoElement.mediaId = d.mediaid;
				g.playbackRate = c.mediaElement.videoElement.saranyuHlsMertics.playbackRateOld;
				c.mediaElement.videoElement.hlsObj.on(Hls.Events.MANIFEST_PARSED, function () {
					if ((b.autoplay === "true") || (b.autoplay === true)) {
						console.log("hls manifest parsed so play now");
						var e = Number(b.seekonload);
						var h;
						if (e > 0) {
							h = setTimeout(function () {
								c._videoPlayerControls("seek", e)
							}.bind(c), 2000)
						} else {
							g.play();
							c._hideControlsUnderInactivityFirstLaunch()
						}
					}
					if (c.options.features.includes("qualityswitch")) {
						c._buildqualityswitch._buildQualityPopup(c.mediaElement.videoElement.hlsObj.levels)
					}
				});
				c.mediaElement.videoElement.hlsObj.on(Hls.Events.MANIFEST_PARSED, function () {
					if (c.mediaElement.videoElement.hlsObj.levels.length == 1) {
						c.mediaElement.videoElement.hlsObj.startLevel = 0
					} else {
						var h = c.mediaElement.videoElement.hlsObj.levels.length - 1;
						var e = Math.floor((h / 2));
						c.mediaElement.videoElement.hlsObj.startLevel = e
					}
					c.mediaElement.videoElement.hlsObj.startLoad()
				});
				c.mediaElement.videoElement.hlsObj.on(Hls.Events.AUDIO_TRACKS_UPDATED, function (e, h) {
					if (c.options.features.includes("multiaudio")) {
						c._buildmultiaudio._buildMultiaudioPopup(c.mediaElement.videoElement.hlsObj.audioTracks)
					}
				});
				c.mediaElement.videoElement.hlsObj.on(Hls.Events.LEVEL_LOADED, function (e, h) {
					c.mediaElement.videoElement.saranyuHlsMertics = h.details;
					c.mediaElement.videoElement.saranyuHlsMertics.islive = h.details.live
				})
			} else {
				SaranyuHlsHTML5Player.Utils.DLOG("MSE (Media Source Extension) is not supported in Your Browser")
			}
		};
		if (!c._isSupportedMSE() && c._checkHLS()) {
			c.mediaElement.videoElement.src = a;
			c.mediaElement.videoElement.mediaId = d.mediaid;
			g.play()
		} else {
			if (c.playerType == "mp4") {
				c.mediaElement.videoElement.src = a;
				c.mediaElement.videoElement.mediaId = d.mediaid;
				g.play()
			} else {
				c._createAndAppendHLStoPlayer._attachHLStoVideo()
			}
		}
		try {
			c.fullControls.topContolbar.videoTitle.changeTitle(d.videotitle)
		} catch (f) {}
		try {
			c.playerLayers.poster.changePoster(d.poster)
		} catch (f) {}
		if (c.options.features.includes("subtitles")) {
			c._buildsubtitles._buildSubtitlesPopup()
		}
		c.playerInner.trigger("mousemove")
	},
	_hideControlsUnderInactivityFirstLaunch: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("Attaching logic of hiding controls when there is no user interactivity");
		var a = this;
		var b = a.mediaElement.videoElement;
		a.counterToCheckInActivity;
		a._createFullControls.showFullControls();
		clearTimeout(a.counterToCheckInActivity);
		if (a.options.hideControlsWhenInactive == "true") {
			a.counterToCheckInActivity = setTimeout(function () {
				if ((a.fullControls.is(":visible")) && (!b.paused)) {
					a._createFullControls.hideFullControls();
					SaranyuHlsHTML5Player.Utils.DLOG("hiding controls because there is no user activity from " + SaranyuHlsHTML5Player.inActivityTimeout + " ms")
				}
			}, SaranyuHlsHTML5Player.inActivityTimeout)
		}
	},
	_hideControlsUnderInactivity: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("Attaching logic of hiding controls when there is no user interactivity");
		var a = this;
		var b = a.mediaElement.videoElement;
		a.counterToCheckInActivity;
		a.playerInner.on("mousemove mouseenter mouseover", function (c) {
			a._createFullControls.showFullControls();
			clearTimeout(a.counterToCheckInActivity);
			if (a.options.hideControlsWhenInactive == "true") {
				a.counterToCheckInActivity = setTimeout(function () {
					if ((a.fullControls.is(":visible")) && (!b.paused)) {
						a._createFullControls.hideFullControls();
						SaranyuHlsHTML5Player.Utils.DLOG("hiding controls because there is no user activity from " + SaranyuHlsHTML5Player.inActivityTimeout + " ms")
					}
				}, SaranyuHlsHTML5Player.inActivityTimeout)
			}
		}.bind(a, b))
	},
	_createCustomContextmenu: function () {
		try {
			SaranyuHlsHTML5Player.Utils.DLOG("Attaching custom context menu");
			var a = this;
			a.playerInner.contextmenu(function (c) {
				c.preventDefault();
				SaranyuHlsHTML5Player.Utils.DLOG("Right Clicked on player");
				a.playerLayers.feedbackTextElement.html("Player Developed by <br> Saranyu Technologies Pvt Ltd").stop(false, true).show().fadeOut(3500)
			})
		} catch (b) {}
	},
	_buildplaypause: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("Attaching play pause icon");
		var b = this;
		var c = b.mediaElement.videoElement;
		var a = '<div class="sp-button sp-play-pause sp-play"><span class="tooltiptext"></span><button class="sp-play-pause-btn"></button></div>';
		b.fullControls.middleControlbar.append(a);
		b.fullControls.middleControlbar.saranyuPlaypause = b.fullControls.middleControlbar.find(".sp-button.sp-play-pause.sp-play");
		b.fullControls.middleControlbar.saranyuPlaypause.tooltip = b.fullControls.middleControlbar.saranyuPlaypause.find(".tooltiptext");
		b.fullControls.middleControlbar.saranyuPlaypause.click(function (d) {
			SaranyuHlsHTML5Player.Utils.DLOG("Clicked on Play Pause Icon");
			d.preventDefault();
			if (c.paused) {
				b._videoPlayerControls("play")
			} else {
				b._videoPlayerControls("pause")
			}
			if (c.ended) {
				b._videoPlayerControls("seek", 0)
			}
			document.activeElement.blur();
			c.focus()
		});
		c.addEventListener("play", function () {
			try {
				SaranyuHlsHTML5Player.Utils.DLOG("Play triggered");
				b.fullControls.middleControlbar.saranyuPlaypause.addClass("sp-play");
				b.fullControls.middleControlbar.saranyuPlaypause.removeClass("sp-pause");
				b.fullControls.middleControlbar.saranyuPlaypause.removeClass("sp-replay");
				b.fullControls.middleControlbar.saranyuPlaypause.tooltip.html(SaranyuHlsHTML5Player.defaultOptions.titleStrings.pause)
			} catch (d) {}
		}, false);
		c.addEventListener("pause", function () {
			try {
				console.log(new Date().getTime() - b._buildqualityswitch.lastQualityChangeAt);
				if (new Date().getTime() - b._buildqualityswitch.lastQualityChangeAt < 1000) {
					console.log("last time when quality changed was below 1s");
					return true
				}
			} catch (d) {}
			try {
				SaranyuHlsHTML5Player.Utils.DLOG("Pause triggered");
				b.fullControls.middleControlbar.saranyuPlaypause.addClass("sp-pause");
				b.fullControls.middleControlbar.saranyuPlaypause.removeClass("sp-play");
				b.fullControls.middleControlbar.saranyuPlaypause.removeClass("sp-replay");
				b.fullControls.middleControlbar.saranyuPlaypause.tooltip.html(SaranyuHlsHTML5Player.defaultOptions.titleStrings.play)
			} catch (d) {}
		}, false);
		c.addEventListener("ended", function () {
			try {
				SaranyuHlsHTML5Player.Utils.DLOG("Re-Play triggered");
				b.fullControls.middleControlbar.saranyuPlaypause.addClass("sp-replay");
				b.fullControls.middleControlbar.saranyuPlaypause.removeClass("sp-play");
				b.fullControls.middleControlbar.saranyuPlaypause.removeClass("sp-pause");
				b.fullControls.middleControlbar.saranyuPlaypause.tooltip.html(SaranyuHlsHTML5Player.defaultOptions.titleStrings.replay);
				b._createFullControls.showFullControls()
			} catch (d) {}
		}, false);
		if (b.options.autoplay == "false") {
			b.fullControls.middleControlbar.saranyuPlaypause.addClass("sp-pause");
			b.fullControls.middleControlbar.saranyuPlaypause.removeClass("sp-play");
			b.fullControls.middleControlbar.saranyuPlaypause.removeClass("sp-replay");
			b.fullControls.middleControlbar.saranyuPlaypause.tooltip.html(SaranyuHlsHTML5Player.defaultOptions.titleStrings.play)
		}
	},
	_buildforward: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("Attaching forward icon");
		var b = this;
		var c = b.mediaElement.videoElement;
		var a = '<div class="sp-button sp-forward"><span class="tooltiptext"></span><button class="sp-forward-btn"></button></div>';
		b.fullControls.middleControlbar.append(a);
		b.fullControls.middleControlbar.saranyuForward = b.fullControls.middleControlbar.find(".sp-button.sp-forward");
		b.fullControls.middleControlbar.saranyuForward.tooltip = b.fullControls.middleControlbar.saranyuForward.find(".tooltiptext");
		b.fullControls.middleControlbar.saranyuForward.tooltip.html("+10");
		b.fullControls.middleControlbar.saranyuForward.click(function (d) {
			SaranyuHlsHTML5Player.Utils.DLOG("Clicked on Play Pause Icon");
			d.preventDefault();
			if ((b.mediaElement.videoElement.currentTime + 10) < b.mediaElement.videoElement.duration) {
				b.mediaElement.videoElement.currentTime += 10
			}
		}.bind(b))
	},
	_buildrewind: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("Attaching rewind icon");
		var b = this;
		var c = b.mediaElement.videoElement;
		var a = '<div class="sp-button sp-rewind"><span class="tooltiptext"></span><button class="sp-rewind-btn"></button></div>';
		b.fullControls.middleControlbar.append(a);
		b.fullControls.middleControlbar.saranyuRewind = b.fullControls.middleControlbar.find(".sp-button.sp-rewind");
		b.fullControls.middleControlbar.saranyuRewind.tooltip = b.fullControls.middleControlbar.saranyuRewind.find(".tooltiptext");
		b.fullControls.middleControlbar.saranyuRewind.tooltip.html("-10");
		b.fullControls.middleControlbar.saranyuRewind.click(function (d) {
			SaranyuHlsHTML5Player.Utils.DLOG("Clicked on Play Pause Icon");
			d.preventDefault();
			if ((b.mediaElement.videoElement.currentTime - 10) >= 0) {
				b.mediaElement.videoElement.currentTime -= 10
			} else {
				b.mediaElement.videoElement.currentTime = 0
			}
		}.bind(b))
	},
	_buildvolume: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("Attaching volume icon and volume seekbar");
		var c = this;
		var e = c.mediaElement.videoElement;
		var b = c.options;
		var d = '<div class="sp-button sp-volume-btn-wrap sp-unmute"><span class="tooltiptext" style="display:none;">' + SaranyuHlsHTML5Player.defaultOptions.titleStrings.muteText + '</span><button class="sp-volume-btn"></button></div>';
		c.fullControls.bottomControlBar.bottomPlayerControls.append(d);
		c.fullControls.bottomControlBar.bottomPlayerControls.volumebtn = c.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-button.sp-volume-btn-wrap");
		c.fullControls.bottomControlBar.bottomPlayerControls.volumebtn.tooltip = c.fullControls.bottomControlBar.bottomPlayerControls.volumebtn.find(".tooltiptext");
		var a = '<div class="sp-volume-slider sp-volume-slider-wrap"><div class="sp-volume-current"></div><div class="sp-volume-handle"><span class="tooltiptext" style="display:none;" ></span></div></div>';
		c.fullControls.bottomControlBar.bottomPlayerControls.volumebtn.append(a);
		c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider = c.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-volume-slider.sp-volume-slider-wrap");
		c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.volumeCurrent = c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.find(".sp-volume-current");
		c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.volumeHandle = c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.find(".sp-volume-handle");
		c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.volumeHandle.tooltip = c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.volumeHandle.find(".tooltiptext");
		c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.writeToVolumeHandleTooltip = function () {
			c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.volumeHandle.tooltip.html(SaranyuHlsHTML5Player.Utils.getWidthInPercentage(c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.volumeCurrent))
		};
		c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.positionVolumeHandle = function (f) {
			c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.volumeCurrent.css("width", f * 100 + "%");
			c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.volumeCurrent.css("right", (1 - f) * 100 + "%");
			c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.volumeHandle.css("right", "calc(" + (100 - (f * 100)) + "% - " + c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.volumeHandle.width() / 2 + "px)");
			c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.writeToVolumeHandleTooltip()
		};
		c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.handleVolumeMove = function (k) {
			var h = null,
				g = c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider,
				f = g.offset();
			var l = g.height(),
				i = k.pageY - f.top;
			h = 1 - (i / l);
			h = Math.max(0, h);
			h = Math.min(h, 1);
			c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.positionVolumeHandle(h);
			c._videoPlayerControls("volumechange", h)
		};
		c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.writeToVolumeHandleTooltip();
		e.addEventListener("volumechange", function () {
			try {
				SaranyuHlsHTML5Player.Utils.DLOG("volume change triggered");
				if (e.muted) {
					c.fullControls.bottomControlBar.bottomPlayerControls.volumebtn.addClass("sp-mute");
					c.fullControls.bottomControlBar.bottomPlayerControls.volumebtn.removeClass("sp-unmute");
					c.fullControls.bottomControlBar.bottomPlayerControls.addClass("mute_add");
					c.fullControls.bottomControlBar.bottomPlayerControls.removeClass("mute_remove");
					c.fullControls.bottomControlBar.bottomPlayerControls.volumebtn.tooltip.html(SaranyuHlsHTML5Player.defaultOptions.titleStrings.unmuteText);
					c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.hide();
					c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.writeToVolumeHandleTooltip()
				} else {
					c.fullControls.bottomControlBar.bottomPlayerControls.volumebtn.addClass("sp-unmute");
					c.fullControls.bottomControlBar.bottomPlayerControls.volumebtn.removeClass("sp-mute");
					c.fullControls.bottomControlBar.bottomPlayerControls.addClass("mute_remove");
					c.fullControls.bottomControlBar.bottomPlayerControls.removeClass("mute_add");
					c.fullControls.bottomControlBar.bottomPlayerControls.volumebtn.tooltip.html(SaranyuHlsHTML5Player.defaultOptions.titleStrings.muteText);
					c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.show();
					c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.writeToVolumeHandleTooltip()
				}
			} catch (f) {}
		}, false);
		c.fullControls.bottomControlBar.bottomPlayerControls.volumebtn.click(function (f) {
			SaranyuHlsHTML5Player.Utils.DLOG("Clicked on volume button");
			f.preventDefault();
			if (f.target.className != "sp-volume-handle") {
				if (e.muted) {
					c._videoPlayerControls("unmute")
				} else {
					c._videoPlayerControls("mute")
				}
			}
		});
		c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.bind("mouseover", function (f) {
			f = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(f);
			c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.mouseIsOver = true
		}).bind("mousemove", function (f) {
			f = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(f);
			c.playerInner.trigger("mousemove");
			if (c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.mouseIsDown == true) {
				c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.handleVolumeMove(f)
			}
		}).bind("mouseup", function (f) {
			f = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(f);
			c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.mouseIsDown = false
		}).bind("mousedown", function (f) {
			f = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(f);
			c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.handleVolumeMove(f);
			c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.mouseIsDown = true
		}).bind("mouseleave", function (f) {
			f = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(f);
			c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.mouseIsDown = false
		});
		if ((b.mute === "true") || (b.mute == true)) {
			c._videoPlayerControls("mute");
			c.fullControls.bottomControlBar.bottomPlayerControls.volumebtn.addClass("sp-mute");
			c.fullControls.bottomControlBar.bottomPlayerControls.volumebtn.removeClass("sp-unmute");
			c.fullControls.bottomControlBar.bottomPlayerControls.volumebtn.tooltip.html(SaranyuHlsHTML5Player.defaultOptions.titleStrings.unmuteText);
			c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.hide()
		}
		$(c.fullControls.bottomControlBar.bottomPlayerControls.volumebtn).hover(function () {
			if (!e.muted) {
				//c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.show()
			}
		}, function () {
			if (!$(c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider).is(":hover")) {
				//c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.hide()
			}
		});
		$(c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider).hover(function () {
			if (!e.muted) {
				c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.show()
			}
		}, function () {
			if (!$(c.fullControls.bottomControlBar.bottomPlayerControls.volumebtn).is(":hover")) {
				//c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.hide()
			}
		})
	},
	_buildprogressbar: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("Attaching progressbar");
		var c = this;
		var g = c.mediaElement.videoElement;
		var a = '<div class="sp-progress-bar-time-rail"><span class="sp-progress-bar-buffering"></span><span class="sp-progress-bar-loaded"></span><span class="sp-progress-bar-current"></span><span class="sp-progress-bar-cues"></span><span class="sp-progress-bar-handle"></span><span class="sp-progress-bar-timefloat"></span><span class="sp-progress-bar-seekbar-preview"></span></div>';
		c.fullControls.bottomControlBar1.append(a);
		console.log(c);
		c.fullControls.bottomControlBar1.bottomProgressBar.progressbar = c.fullControls.bottomControlBar1.find(".sp-progress-bar-time-rail");
		c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.buffering = c.fullControls.bottomControlBar1.find(".sp-progress-bar-buffering");
		c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.loaded = c.fullControls.bottomControlBar1.find(".sp-progress-bar-loaded");
		c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.current = c.fullControls.bottomControlBar1.find(".sp-progress-bar-current");
		c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.handle = c.fullControls.bottomControlBar1.find(".sp-progress-bar-handle");
		c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.timefloat = c.fullControls.bottomControlBar1.find(".sp-progress-bar-timefloat");
		c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer = c.fullControls.bottomControlBar1.find(".sp-progress-bar-seekbar-preview");
		c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.cues = c.fullControls.bottomControlBar1.find(".sp-progress-bar-cues");
		c._buildprogressbar.adjustCurrentAndHandleInSeek = function (q) {
			if (q < 0 || q > 1) {
				return
			}
			var h = q * 100 + "%";
			var i = c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.handle.width() / 2;
			c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.current.width(h);
			c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.handle.css("left", "calc(" + h + " - " + i + "px)");
			var l, n;
			var k, m;
			var p = 0;
			l = c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.handle.offset().left;
			n = c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.handle.width();
			k = c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.offset().left;
			m = c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.width();
			if (l < k) {
				var o = 0;
				c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.handle.css("left", o + "px")
			} else {
				if ((n + l) > (k + m)) {
					var o;
					o = m - n;
					p = o;
					i = c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.handle.width();
					c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.handle.css("left", "calc(" + h + " - " + i + "px)")
				}
			}
		};

		function d(p) {
			try {
				var t = c.fullControls.bottomControlBar1.bottomProgressBar.progressbar,
					k = t.offset();
				var x = t.width(),
					r = p.pageX - k.left;
				var v;
				percentage = (r / x);
				var m = percentage * 100 + "%";
				v = percentage * g.duration;
				if (v < 0 || v > g.duration || isNaN(v)) {
					c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.timefloat.show();
					return
				}
				c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.timefloat.html(SaranyuHlsHTML5Player.Utils.secondsToTimeCode(v));
				c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.timefloat.css("left", m);
				c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.timefloat.show();
				var h, o;
				var n, u;
				var z = 0;
				h = c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.timefloat.offset().left;
				o = c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.timefloat.outerWidth();
				n = c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.offset().left;
				u = c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.outerWidth();
				if ((o + h) > (n + u)) {
					var y;
					y = u - o;
					z = y;
					c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.timefloat.css("left", z + "px");
					c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.timefloat.show()
				}
				if (c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.parseAndCalculateCordinates.thumbnailsMetaData) {
					c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.renderingThumbnailPreview(v);
					c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.css("left", m);
					c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.show();
					var l, q;
					var w = 0;
					l = c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.offset().left;
					q = c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.outerWidth();
					if ((q + l) > (n + u)) {
						var i;
						i = u - q;
						w = i;
						c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.css("left", w + "px");
						c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.show()
					}
				}
			} catch (p) {}
		}

		function f() {
			c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.timefloat.hide();
			c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.hide()
		}

		function b(k) {
			var n = c.fullControls.bottomControlBar1.bottomProgressBar.progressbar,
				h = n.offset();
			var m = n.width(),
				l = k.pageX - h.left;
			var i;
			percentage = (l / m);
			i = percentage * g.duration;
			if (i < 0 || i > g.duration || isNaN(i)) {
				return
			}
			if (g.ended && g.paused) {
				c.fullControls.bottomControlBar1.bottomPlayerControls.saranyuPlaypause.addClass("sp-pause");
				c.fullControls.bottomControlBar1.bottomPlayerControls.saranyuPlaypause.removeClass("sp-play");
				c.fullControls.bottomControlBar1.bottomPlayerControls.saranyuPlaypause.removeClass("sp-replay");
				c.fullControls.bottomControlBar1.bottomPlayerControls.saranyuPlaypause.tooltip.html(SaranyuHlsHTML5Player.defaultOptions.titleStrings.play);
				c.playerLayers.bigreplay.hide();
				c.playerLayers.bigplay.show()
			}
			c._videoPlayerControls("seek", i);
			c._buildprogressbar.adjustCurrentAndHandleInSeek(percentage);
			d(k)
		}
		c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.bind("mouseover", function (h) {
			d(h);
			h = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(h);
			c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.mouseIsOver = true
		}).bind("mousemove", function (h) {
			d(h);
			h = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(h);
			if (c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.mouseIsDown == true) {
				b(h)
			}
		}).bind("mouseup", function (h) {
			h = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(h);
			c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.mouseIsDown = false
		}).bind("mousedown", function (h) {
			h = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(h);
			b(h);
			c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.mouseIsDown = true
		}).bind("mouseleave", function (h) {
			f();
			h = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(h);
			c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.mouseIsDown = false
		});
		c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.handle.saranyuHammer({
			drag_max_touches: 0
		}).on("touch drag", function (l) {
			var m = l.gesture.touches;
			l.gesture.preventDefault();
			d(l);
			for (var k = 0, h = m.length; k < h; k++) {
				c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.handle.mouseIsDown = true;
				b(m[k])
			}
		}).on("release", function (h) {
			b(h);
			c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.handle.mouseIsDown = false;
			f()
		}).on("mouseleave", function (h) {
			c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.handle.mouseIsDown = false
		});

		function e(h) {
			c.fullControls.bottomControlBar1.bottomProgressBar.progressbar.loaded.width(h * 100 + "%")
		}
		g.addEventListener("timeupdate", function (k) {
			var i = c.mediaElement.videoElement;
			var h = i.currentTime / i.duration;
			c._buildprogressbar.adjustCurrentAndHandleInSeek(h)
		}.bind(c));
		g.addEventListener("progress", function (m) {
			var l = c.mediaElement.videoElement;
			var n;
			var h = 0;
			for (var k = 0; k < l.buffered.length; k++) {
				if ((l.currentTime >= l.buffered.start(k)) && (l.currentTime <= l.buffered.end(k))) {
					n = l.buffered.end(k);
					h = n / l.duration
				}
			}
			e(h)
		}.bind(c));
		c._buildprogressbar.resizeOfProgressBarWrap = function () {
			var h = 25;
			$(c.fullControls.bottomControlBar1.bottomPlayerControls).children().each(function (i, k) {
				if ($(k).attr("class") != "sp-progress-bar-time-rail") {
					h += Math.ceil($(k).outerWidth())
				}
			});
			$(c.fullControls.bottomControlBar1.bottomProgressBar.progressbar).css("maxWidth", Math.floor((Math.floor($(c.fullControls.bottomControlBar1).width()+26) - Math.ceil(h))))
		}.bind(c);
		document.addEventListener("fullscreenchange", function () {
			clearInterval(c._buildprogressbar.resizeOfProgressBarWrap.timer1);
			c._buildprogressbar.resizeOfProgressBarWrap.timer1 = setInterval(function () {
				c._buildprogressbar.resizeOfProgressBarWrap()
			}.bind(c), 100)
		}.bind(c), false);
		document.addEventListener("webkitfullscreenchange", function () {
			clearInterval(c._buildprogressbar.resizeOfProgressBarWrap.timer1);
			c._buildprogressbar.resizeOfProgressBarWrap.timer1 = setInterval(function () {
				c._buildprogressbar.resizeOfProgressBarWrap()
			}.bind(c), 100)
		}.bind(c), false);
		document.addEventListener("mozfullscreenchange", function () {
			clearInterval(c._buildprogressbar.resizeOfProgressBarWrap.timer1);
			c._buildprogressbar.resizeOfProgressBarWrap.timer1 = setInterval(function () {
				c._buildprogressbar.resizeOfProgressBarWrap()
			}.bind(c), 100)
		}.bind(c), false);
		$(window).resize(function () {
			clearInterval(c._buildprogressbar.resizeOfProgressBarWrap.timer1);
			c._buildprogressbar.resizeOfProgressBarWrap.timer1 = setInterval(function () {
				c._buildprogressbar.resizeOfProgressBarWrap()
			}.bind(c), 100)
		}.bind(c));
		c._buildprogressbar.resizeOfProgressBarWrap();
		c._buildprogressbar.resizeOfProgressBarWrap.timer1 = setInterval(function () {
			c._buildprogressbar.resizeOfProgressBarWrap()
		}.bind(c), 100);
		setTimeout(function () {
			clearInterval(c._buildprogressbar.resizeOfProgressBarWrap.timer1)
		}.bind(c), 5000)
	},
	_buildseekbarpreview: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("Attaching seekbar preview");
		var a = this;
		var b = '<img class="sp-progress-bar-seekbar-preview-img" />';
		a.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.append(b);
		a.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.seekbarPreviewContainerImgTag = a.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.find(".sp-progress-bar-seekbar-preview-img");
		a.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.parseAndCalculateCordinates = function (d) {
			a.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.parseAndCalculateCordinates.thumbnailsMetaData = [];
			if (d != "") {
				var c = d.split("\n\r\n");
				if (c.length <= 1) {
					c = d.split("\n\n")
				}
				$.each(c, function (l, p) {
					var e;
					var i;
					var o;
					var n;
					var q;
					var k;
					var u;
					var t = c[l].split("\n");
					if ((t[0] != undefined) && (t[0] != "") && (t[0].toLowerCase() != "webvtt")) {
						var m = t[0].split("-->");
						e = SaranyuHlsHTML5Player.Utils.timeCodeToSeconds(m[0]);
						i = SaranyuHlsHTML5Player.Utils.timeCodeToSeconds(m[1])
					}
					if ((t[1] != undefined) && (t[1] != "") && (t[1].toLowerCase() != "webvtt")) {
						var h = t[1].split("#");
						u = h[0];
						var g = h[1].split("=");
						var r = g[1].split(",");
						q = "-" + r[0] + "px";
						k = "-" + r[1] + "px";
						n = r[2] + "px";
						o = r[3] + "px";
						var f = {
							startTime: e,
							endTime: i,
							imgxPos: q,
							imgyPos: k,
							imgHeight: o,
							imgWidth: n,
							imgSrc: u
						};
						a.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.parseAndCalculateCordinates.thumbnailsMetaData.push(f)
					}
				})
			}
		};
		a.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.ajaxForVtt = function (c) {
			a.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.ajaxForVtt.abort = function () {
				a.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.ajax.abort()
			};
			try {
				a.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.ajaxForVtt.abort()
			} catch (d) {}
			a.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.ajax = $.ajax({
				type: "GET",
				url: c
			}).done(function (e) {
				a.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.parseAndCalculateCordinates(e)
			}.bind(a))
		};
		a.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.renderingThumbnailPreview = function (c) {
			if (a.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.parseAndCalculateCordinates.thumbnailsMetaData.length > 1) {
				$.each(a.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.parseAndCalculateCordinates.thumbnailsMetaData, function (d, e) {
					if (c >= e.startTime && c <= e.endTime) {
						$(a.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.seekbarPreviewContainerImgTag).attr("src", e.imgSrc);
						$(a.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.seekbarPreviewContainerImgTag).css("height", e.imgHeight);
						$(a.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.seekbarPreviewContainerImgTag).css("width", e.imgWidth);
						$(a.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.seekbarPreviewContainerImgTag).css("object-position", e.imgxPos + " " + e.imgyPos)
					}
				})
			}
		};
		a.fullControls.bottomControlBar1.bottomProgressBar.progressbar.seekbarPreviewContainer.ajaxForVtt(a.options.file[0].thumbnails)
	},
	_buildfullscreen: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("Attaching fullscreen icon");
		var b = this;
		b.isFullScreen = false;
		var a = '<div class="sp-button sp-fullscreen-unfullscreen sp-fullscreen"><span class="tooltiptext">' + SaranyuHlsHTML5Player.defaultOptions.titleStrings.fullscreenText + '</span><button class="sp-fullscreen-btn"></button></div>';
		b.fullControls.bottomControlBar.bottomPlayerControls.append(a);
		b.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen = b.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-button.sp-fullscreen-unfullscreen");
		b.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.tooltip = b.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.find(".tooltiptext");
		b.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.fullScreenChanges = function () {
			b.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.addClass("sp-unfullscreen");
			b.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.removeClass("sp-fullscreen");
			b.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.tooltip.html(SaranyuHlsHTML5Player.defaultOptions.titleStrings.unFullscreenText)
		};
		b.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.unFullScreenChanges = function () {
			b.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.addClass("sp-fullscreen");
			b.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.removeClass("sp-unfullscreen");
			b.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.tooltip.html(SaranyuHlsHTML5Player.defaultOptions.titleStrings.fullscreenText);
			b.playerInner.trigger("mousemove")
		};
		b.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.launchIntoFullscreen = function () {
			var c = b.playerInner[0];
			if (c.requestFullscreen) {
				c.requestFullscreen()
			} else {
				if (c.mozRequestFullScreen) {
					c.mozRequestFullScreen()
				} else {
					if (c.webkitRequestFullscreen) {
						c.webkitRequestFullscreen()
					} else {
						if (c.msRequestFullscreen) {
							c.msRequestFullscreen()
						}
					}
				}
			}
		};
		b.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.exitFullscreen = function (c) {
			if (document.exitFullscreen) {
				document.exitFullscreen()
			} else {
				if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen()
				} else {
					if (document.webkitExitFullscreen) {
						document.webkitExitFullscreen()
					}
				}
			}
		};
		b.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.toggleFullscreen = function () {
			if (!b.isFullScreen) {
				SaranyuHlsHTML5Player.Utils.DLOG("FullScreen Mode");
				b.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.launchIntoFullscreen();
				b.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.fullScreenChanges();
				b.playerInner.addClass("sp-is-fullscreen");
				b.isFullScreen = true
			} else {
				SaranyuHlsHTML5Player.Utils.DLOG("Exit FullScreen Mode");
				b.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.exitFullscreen();
				b.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.unFullScreenChanges();
				b.playerInner.removeClass("sp-is-fullscreen");
				b.isFullScreen = false
			}
		};
		b.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.click(function (c) {
			c.preventDefault();
			SaranyuHlsHTML5Player.Utils.DLOG("Clicked on FullScreen");
			b.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.toggleFullscreen()
		});
		$(document).on("webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange", function () {
			setTimeout(function () {
				if (!(Math.floor(b.playerInner.height()) == Math.floor(window.innerHeight) && Math.floor(b.playerInner.width()) == Math.floor(window.innerWidth))) {
					b.isFullScreen = false;
					b.playerInner.removeClass("sp-is-fullscreen");
					b.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.unFullScreenChanges()
				}
			}.bind(b), 400)
		});
		b.playerInner.keyup(function (d) {
			var c = d.keyCode;
			if (c == 27) {
				setTimeout(function () {
					if (b.isFullScreen) {
						b.isFullScreen = false;
						b.playerInner.removeClass("sp-is-fullscreen");
						b.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.unFullScreenChanges()
					}
				}.bind(b), 500)
			}
		})
	},
	_buildclosebtn: function () {
		console.log("closeBtn...");
		SaranyuHlsHTML5Player.Utils.DLOG("Attaching close icon");
		var a = this;
		var c = a.mediaElement.videoElement;
		var b = '<div class="sp-close-button"><span class="tooltiptext"></span><button class="sp-close-btn"></button></div>';
		a.fullControls.bottomControlBar.bottomPlayerControls.append(b);
		a.fullControls.bottomControlBar.bottomPlayerControls.closeBtn = a.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-close-button .sp-close-btn");
		a.fullControls.bottomControlBar.bottomPlayerControls.closeBtn.tooltip = a.fullControls.bottomControlBar.bottomPlayerControls.saranyuPlaypause.find(".tooltiptext");
		a.fullControls.bottomControlBar.bottomPlayerControls.closeBtn.click(function (d) {
			console.log("close button clicked");
			SaranyuHlsHTML5Player.Utils.DLOG("Clicked on close Icon");
			d.preventDefault();
			document.getElementById("video_player").remove();
			document.activeElement.blur();
			c.focus()
		})
	},
	_buildtime: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("Attaching time");
		var a = this;
		var b = a.mediaElement.videoElement;
		var c = '<div class="sp-player-time"><span class="sp-plyr-currenttime">00:00</span>&nbsp;/&nbsp;<span class="sp-plyr-duration">00:00</span></div>';
		a.fullControls.bottomControlBar.bottomPlayerControls.append(c);
		a.fullControls.bottomControlBar.bottomPlayerControls.saranyuPlayerTime = a.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-player-time");
		a.fullControls.bottomControlBar.bottomPlayerControls.saranyuPlayerTime.currentTime = a.fullControls.bottomControlBar.bottomPlayerControls.saranyuPlayerTime.find(".sp-plyr-currenttime");
		a.fullControls.bottomControlBar.bottomPlayerControls.saranyuPlayerTime.duration = a.fullControls.bottomControlBar.bottomPlayerControls.saranyuPlayerTime.find(".sp-plyr-duration");
		b.addEventListener("timeupdate", function (d) {
			a.fullControls.bottomControlBar.bottomPlayerControls.saranyuPlayerTime.currentTime.html(SaranyuHlsHTML5Player.Utils.secondsToTimeCode(b.currentTime));
			a.fullControls.bottomControlBar.bottomPlayerControls.saranyuPlayerTime.duration.html(SaranyuHlsHTML5Player.Utils.secondsToTimeCode(b.duration))
		}.bind(a))
	},
	_buildnxplayback: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("Attaching nxplayback");
		var d = this;
		var e = d.mediaElement.videoElement;
		var c = d.options;
		var a = '<div class="sp-nxplayback-switch sp-nxplayback-switch-wrap"><button class="sp-nxplayback-switch-btn"></button><div class="sp-nxplayback-switch-wrap sp-nxplayback-switch-popup-wrap"></div></div>';
		d.fullControls.bottomControlBar.bottomPlayerControls.append(a);
		d.fullControls.bottomControlBar.bottomPlayerControls.nxplayback = d.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-nxplayback-switch-wrap");
		d.fullControls.bottomControlBar.bottomPlayerControls.nxplayback.button = d.fullControls.bottomControlBar.bottomPlayerControls.nxplayback.find(".sp-nxplayback-switch-btn");
		d.fullControls.bottomControlBar.bottomPlayerControls.nxplayback.popup = d.fullControls.bottomControlBar.bottomPlayerControls.nxplayback.find(".sp-nxplayback-switch-popup-wrap");

		function b(f) {
			f.find("button").unbind().click(function (h) {
				var i = $(h.target).attr("speed");
				var g = $(h.target).attr("label");
				var k = d.mediaElement.videoElement;
				k.playbackRate = i;
				if (i == 1) {
					k.muted = false
				} else {
					k.muted = true
				}
				$(h.target).parent().parent().find(".active").removeClass("active").addClass("inactive");
				$(h.target).addClass("active").removeClass("inactive");
				d.fullControls.bottomControlBar.bottomPlayerControls.nxplayback.button.html(g);
				d.fullControls.bottomControlBar.bottomPlayerControls.nxplayback.popup.hide();
				SaranyuHlsHTML5Player.Utils.DLOG("video playback speed changed to " + i + "x or label " + g)
			}.bind(d))
		}
		$.each(c.nxplayback, function (g, h) {
			var f;
			var i;
			if ((h["default"].toLowerCase() === "true") || (h["default"] == true)) {
				d.fullControls.bottomControlBar.bottomPlayerControls.nxplayback.button.html(h.label);
				e.playbackRate = h.speed;
				i = "active"
			} else {
				i = "inactive"
			}
			f = "<div><button class=" + i + " type='button' label=" + h.label + " speed=" + h.speed + ">" + h.label + "</button></div>";
			b(d.fullControls.bottomControlBar.bottomPlayerControls.nxplayback.popup.append(f))
		});
		d.fullControls.bottomControlBar.bottomPlayerControls.nxplayback.button.unbind().click(function (f) {
			d.fullControls.bottomControlBar.bottomPlayerControls.nxplayback.popup.toggle();
			d.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup.hide();
			d.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.hide();
			d.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.hide();
			d.fullControls.playlistPanel.hide()
		}.bind(d))
	},
	_buildqualityswitch: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("Attaching qualityswitch");
		var b = this;
		var c = b.mediaElement.videoElement;
		var a = b.options;
		var d = '<div class="sp-quality-switch sp-quality-switch-wrap"><button class="sp-quality-switch-btn"></button><div class="sp-quality-switch-wrap sp-quality-switch-popup-wrap"></div></div>';
		b.fullControls.bottomControlBar.bottomPlayerControls.append(d);
		b.fullControls.bottomControlBar.bottomPlayerControls.quality = b.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-quality-switch-wrap");
		b.fullControls.bottomControlBar.bottomPlayerControls.quality.button = b.fullControls.bottomControlBar.bottomPlayerControls.quality.find(".sp-quality-switch-btn");
		b.fullControls.bottomControlBar.bottomPlayerControls.quality.popup = b.fullControls.bottomControlBar.bottomPlayerControls.quality.find(".sp-quality-switch-popup-wrap");
		b._buildqualityswitch._buildQualityPopup = function (l) {
			b.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.hide();
			b.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.empty();
			SaranyuHlsHTML5Player.Utils.DLOG("Attaching qualityswitch popup elements");

			function e(m) {
				m.find("button").unbind().click(function (p) {
					var o = Number($(p.target).attr("index"));
					var n = $(p.target).html();
					var q = b.mediaElement.videoElement;
					b.mediaElement.videoElement.hlsObj.currentLevel = o;
					b._buildqualityswitch.lastQualityChangeAt = new Date().getTime();
					$(p.target).parent().parent().find(".active").removeClass("active").addClass("inactive");
					$(p.target).addClass("active").removeClass("inactive");
					$(p.target).parent().parent().parent().find(".active").removeClass("active");
					$(p.target).parent().addClass("active").removeClass("inactive");
					b.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.hide();
					SaranyuHlsHTML5Player.Utils.DLOG("quality index changed to " + o + "x or label " + n)
				}.bind(b))
			}
			if (l.length > 1) {
				$.each(l, function (q, u) {
					SaranyuHlsHTML5Player.Utils.DLOG("Attaching quality switching with bit rate of " + (u.bitrate / 1024).toFixed(0) + " Kbps");
					var m = "";
					var v = "inactive";
					var r = "active";
					var n = -1;
					var p = b.options.qualityswitch.label;
					var t = ((u.bitrate) / 1024).toFixed(0);
					var o = u.height + "p";
					if (!b.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.children().length) {
						classActiveOrInactive = "active";
						m = "<div class=" + r + " ><button class=" + r + " type='button' label=" + p + " index=" + n + ">" + p + "</button></div>"
					}
					if (b.options.qualityswitch.metric == "resolution") {
						m += "<div><button class=" + v + " type='button' label=" + t + " index=" + q + ">" + o + "</button></div>"
					} else {
						if (b.options.qualityswitch.metric == "bitrate") {
							m += "<div class=" + v + "><button class=" + v + " type='button' label=" + t + " index=" + q + ">" + t + " kbps</button></div>"
						}
					}
					e(b.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.append(m))
				})
			} else {
				SaranyuHlsHTML5Player.Utils.DLOG("Attaching quality switching Auto only , if there is just one quality");
				var h = "";
				var g = "inactive";
				var f = "active";
				var k = -1;
				var i = b.options.qualityswitch.label;
				classActiveOrInactive = "active";
				h = "<div class=" + f + " ><button class=" + f + " type='button' label=" + i + " index=" + k + ">" + i + "</button></div>";
				e(b.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.append(h))
			}
		};
		b.fullControls.bottomControlBar.bottomPlayerControls.quality.button.unbind().click(function (f) {
			if (b.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.children().length > 0) {
				try {
					b.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.toggle()
				} catch (g) {}
				try {
					b.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup.hide()
				} catch (g) {}
				try {
					b.fullControls.bottomControlBar.bottomPlayerControls.nxplayback.popup.hide()
				} catch (g) {}
				try {
					b.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.hide()
				} catch (g) {}
				try {
					b.fullControls.playlistPanel.hide()
				} catch (g) {}
			} else {
				b.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.hide()
			}
		}.bind(b))
	},
	_buildmultiaudio: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("Attaching multiaudio tracks");
		var d = this;
		var e = d.mediaElement.videoElement;
		var c = d.options;
		var a = "Audio";
		var b = '<div class="sp-multiaudio-switch sp-multiaudio-switch-wrap"><button class="sp-multiaudio-switch-btn"></button><div class="sp-multiaudio-switch-wrap sp-multiaudio-switch-popup-wrap"></div></div>';
		d.fullControls.bottomControlBar.bottomPlayerControls.append(b);
		d.fullControls.bottomControlBar.bottomPlayerControls.multiaudio = d.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-multiaudio-switch-wrap");
		d.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.button = d.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.find(".sp-multiaudio-switch-btn");
		d.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup = d.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.find(".sp-multiaudio-switch-wrap");
		d.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.button.html(a);
		d._buildmultiaudio._buildMultiaudioPopup = function (f) {
			d.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup.hide();
			d.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup.empty();
			SaranyuHlsHTML5Player.Utils.DLOG("Attaching multiaudio popup elements");

			function h(i) {
				i.find("button").unbind().click(function (m) {
					var l = Number($(m.target).attr("index"));
					var k = $(m.target).html();
					var n = d.mediaElement.videoElement;
					d.mediaElement.videoElement.hlsObj.audioTrack = l;
					$(m.target).parent().parent().find(".active").removeClass("active").addClass("inactive");
					$(m.target).addClass("active").removeClass("inactive");
					d.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup.hide();
					SaranyuHlsHTML5Player.Utils.DLOG("multiaudio index changed to " + l + "x or label " + k)
				}.bind(d))
			}
			if (f.length > 1) {
				var g = f[0].groupId;
				$.each(f, function (n, q) {
					SaranyuHlsHTML5Player.Utils.DLOG("Attaching multiaudio switching with name of " + (q.name));
					var l = "";
					var k = "inactive";
					var i = "active";
					var p = 0;
					var o = SaranyuHlsHTML5Player.defaultOptions.titleStrings.multiaudio;
					var m = q.name;
					if (q.groupId != g) {
						return
					}
					if (!d.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup.children().length) {
						classActiveOrInactive = "active";
						l = "<div><button class=" + i + " type='button' label=" + o + " index=" + p + ">" + o + "</button></div>"
					}
					l += "<div><button class=" + k + " type='button' label=" + m + " index=" + n + ">" + m + "</button></div>";
					h(d.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup.append(l))
				})
			} else {}
		};
		d.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.button.unbind().click(function (f) {
			if (d.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup.children().length > 0) {
				d.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup.toggle();
				d.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.toggle();
				d.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.hide();
				d.fullControls.bottomControlBar.bottomPlayerControls.nxplayback.popup.hide();
				d.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.hide();
				d.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.hide();
				d.fullControls.playlistPanel.hide()
			} else {
				d.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup.hide()
			}
		}.bind(d))
	},
	_buildsubtitles: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("Attaching subtitles tracks");
		var c = this;
		var e = c.mediaElement.videoElement;
		var b = c.options;
		var a = "Subtitles";
		var f = '<div class="sp-subtitles-switch sp-subtitles-switch-wrap"><button class="sp-subtitles-switch-btn"></button><div class="sp-subtitles-switch-wrap sp-subtitles-switch-popup-wrap"></div></div>';
		c.fullControls.bottomControlBar.bottomPlayerControls.append(f);
		c.fullControls.bottomControlBar.bottomPlayerControls.subtitles = c.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-subtitles-switch-wrap");
		c.fullControls.bottomControlBar.bottomPlayerControls.subtitles.button = c.fullControls.bottomControlBar.bottomPlayerControls.subtitles.find(".sp-subtitles-switch-btn");
		c.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup = c.fullControls.bottomControlBar.bottomPlayerControls.subtitles.find(".sp-subtitles-switch-wrap");
		c.fullControls.bottomControlBar.bottomPlayerControls.subtitles.button.html(a);
		var d = '<div class="sp-subtitles-panel"></div>';
		c.mediaElement.append(d);
		c.mediaElement.subtitlesPanel = c.mediaElement.find(".sp-subtitles-panel");
		c.mediaElement.subtitlesPanel.subtitlesArray = [];
		c._buildsubtitles.hideSubTitlesContainer = function () {
			c.mediaElement.subtitlesPanel.hide()
		};
		c._buildsubtitles.showSubTitlesContainer = function () {
			if (c.mediaElement.subtitlesPanel.html().length > 1) {
				c.mediaElement.subtitlesPanel.show()
			} else {
				c.mediaElement.subtitlesPanel.hide()
			}
		};
		c._buildsubtitles.hideSubTitlesContainer();
		c._buildsubtitles._buildSubtitlesPopup = function (m) {
			var n = 0;
			console.log("playingIndex = " + c.fullControls.playlistPanel.playingIndex);
			if (c.fullControls.playlistPanel.playingIndex) {
				n = c.fullControls.playlistPanel.playingIndex
			}
			SaranyuHlsHTML5Player.Utils.DLOG("Check playlist index for subtitles" + n);
			console.log("Check playlist index for subtitles" + n + c.options.file[n].subtitles);
			m = c.options.file[n].subtitles;
			c.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.hide();
			c.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.empty();
			SaranyuHlsHTML5Player.Utils.DLOG("Attaching subtitles popup elements" + c.mediaElement.subtitlesPanel.subtitlesArray.length);
			c.mediaElement.subtitlesPanel.subtitlesArray = [];
			SaranyuHlsHTML5Player.Utils.DLOG("check subtitle length" + c.mediaElement.subtitlesPanel.subtitlesArray.length);

			function i(q) {
				SaranyuHlsHTML5Player.Utils.DLOG(q + " uday 2 Check playlist index for subtitles " + n);
				if (isNaN(q)) {
					c.mediaElement.subtitlesPanel.subtitlesArray = [];
					return false
				}
				c.mediaElement.subtitlesPanel.subtitlesArray = [];
				$.ajax({
					url: c.options.file[n].subtitles[q].file,
					context: c,
					success: function (z) {
						var B = this;

						function u(t) {
							return t.replace(/^\s+|\s+$/g, "")
						}
						var w = z.replace(/\r\n|\r|\n/g, "\n");
						w = u(w);
						var v = w.split("\n\n");
						var D = 0;
						for (s in v) {
							var C = v[s].split("\n");
							if (C.length >= 2) {
								var y = C[0];
								var r = u(C[1].split(" --> ")[0]);
								var x = u(C[1].split(" --> ")[1]);
								var A = C[2];
								if (C.length > 2) {
									for (j = 3; j < C.length; j++) {
										A += "\n" + C[j]
									}
								}
								B.mediaElement.subtitlesPanel.subtitlesArray[D] = {};
								B.mediaElement.subtitlesPanel.subtitlesArray[D].number = y;
								B.mediaElement.subtitlesPanel.subtitlesArray[D].start = r;
								B.mediaElement.subtitlesPanel.subtitlesArray[D].end = x;
								B.mediaElement.subtitlesPanel.subtitlesArray[D].text = A
							}
							D++
						}
					}
				})
			}

			function p(q) {
				q.find("button").unbind().click(function (u) {
					var t = Number($(u.target).attr("index"));
					var r = $(u.target).html();
					var v = c.mediaElement.videoElement;
					i(t);
					$(u.target).parent().parent().find(".active").removeClass("active").addClass("inactive");
					$(u.target).addClass("active").removeClass("inactive");
					c.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.hide();
					SaranyuHlsHTML5Player.Utils.DLOG("subtitles index changed to " + t + "x or label " + r)
				}.bind(c))
			}
			if (m != undefined) {
				if (m.length > 1) {
					$.each(m, function (v, y) {
						SaranyuHlsHTML5Player.Utils.DLOG("Attaching subtitles switching with name of " + (y.lang));
						var t = "";
						var r = "inactive";
						var q = "active";
						var x = "no";
						var w = SaranyuHlsHTML5Player.defaultOptions.titleStrings.subtitles;
						var u = y.lang;
						if (!c.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.children().length) {
							classActiveOrInactive = "active";
							t = "<div><button class=" + q + " type='button' label=" + w + " index=" + x + ">" + w + "</button></div>"
						}
						t += "<div><button class=" + r + " type='button' label=" + u + " index=" + v + ">" + u + "</button></div>";
						p(c.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.append(t))
					})
				}
			} else {
				SaranyuHlsHTML5Player.Utils.DLOG("Attaching multiaudio switching Auto only , if there is just one audio");
				var g = "";
				var o = "inactive";
				var l = "active";
				var h = "no";
				var k = SaranyuHlsHTML5Player.defaultOptions.titleStrings.subtitles;
				c.fullControls.bottomControlBar.bottomPlayerControls.subtitles.button.html(k);
				classActiveOrInactive = "active";
				g = "<div><button class=" + l + " type='button' label=" + k + " index=" + h + ">" + k + "</button></div>";
				p(c.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.append(g))
			}
		};
		c.mediaElement.videoElement.addEventListener("timeupdate", function () {
			function h(l) {
				var k = l;
				var i = k.split(":");
				var m = (+i[0]) * 60 * 60 + (+i[1]) * 60 + (+i[2]);
				return m
			}(function g() {
				var k = Math.floor(Number(c.mediaElement.videoElement.currentTime));
				if (c.mediaElement.subtitlesPanel.subtitlesArray.length > 0) {
					for (var m = 0; m < c.mediaElement.subtitlesPanel.subtitlesArray.length; m++) {
						var n = h(c.mediaElement.subtitlesPanel.subtitlesArray[m].start.split(",")[0]);
						var l = h(c.mediaElement.subtitlesPanel.subtitlesArray[m].end.split(",")[0]);
						if (k >= n && k <= l) {
							c._buildsubtitles.showSubTitlesContainer();
							c.mediaElement.subtitlesPanel.html(c.mediaElement.subtitlesPanel.subtitlesArray[m].text);
							return
						}
					}
				}
				c._buildsubtitles.hideSubTitlesContainer()
			})()
		});
		c.fullControls.bottomControlBar.bottomPlayerControls.subtitles.button.unbind().click(function (g) {
			if (c.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.children().length > 0) {
				c.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.toggle();
				c.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup.hide();
				c.fullControls.bottomControlBar.bottomPlayerControls.nxplayback.popup.hide();
				c.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.hide();
				c.fullControls.playlistPanel.hide()
			} else {
				c.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.hide()
			}
		}.bind(c))
	},
	_buildplaylist: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("Building playlist");
		var a = this;
		var d = a.mediaElement.videoElement;
		var g = '<div class="sp-button sp-playlist-button-wrap sp-playlist-inactive"><span class="tooltiptext">' + SaranyuHlsHTML5Player.defaultOptions.titleStrings.playlist + '</span><button class="sp-playlist-btn"></button></div>';
		a.fullControls.bottomControlBar.bottomPlayerControls.append(g);
		a.fullControls.bottomControlBar.bottomPlayerControls.playlist = a.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-playlist-button-wrap");
		a.fullControls.bottomControlBar.bottomPlayerControls.playlist.button = a.fullControls.bottomControlBar.bottomPlayerControls.playlist.find(".sp-playlist-btn");
		var f = '<div class="sp-playlist-panel"></div>';
		a.fullControls.append(f);
		a.fullControls.playlistPanel = a.fullControls.find(".sp-playlist-panel");
		a.fullControls.playlistPanel.playingIndex = 0;
		var e = '<span class="sp-playlist-panel-left-btn"></span>';
		var c = '<span class="sp-playlist-panel-right-btn"></span>';
		a.fullControls.playlistPanel.append(e);
		a.fullControls.playlistPanel.append(c);
		a.fullControls.playlistPanel.playlistLeftButton = a.fullControls.find(".sp-playlist-panel-left-btn");
		a.fullControls.playlistPanel.playlistRightButton = a.fullControls.find(".sp-playlist-panel-right-btn");
		var b = '<div class="sp-playlist-panel-itemview"></div>';
		a.fullControls.playlistPanel.append(b);
		a.fullControls.playlistPanel.playlistItemView = a.fullControls.find(".sp-playlist-panel-itemview");
		$.each(a.options.file, function (h, k) {
			var i;
			if (h == 0) {
				i = '<div class="item sp-playlist-active-item sp-playlist-item" indexoftile="' + h + '"><img class="sp-playlist-item-img" src="' + a.options.file[h].poster + '"><span class="sp-playlist-item-videotitle">' + a.options.file[h].videotitle + "</span></div>"
			} else {
				i = '<div class="item sp-playlist-item" indexoftile="' + h + '"><img class="sp-playlist-item-img" src="' + a.options.file[h].poster + '"><span class="sp-playlist-item-videotitle">' + a.options.file[h].videotitle + "</span></div>"
			}
			a.fullControls.playlistPanel.playlistItemView.append(i)
		});
		a.fullControls.playlistPanel.playlistItemView.saranyuOwlCarousel = $(a.fullControls.playlistPanel.playlistItemView);
		a.fullControls.playlistPanel.playlistItemView.saranyuOwlCarousel.saranyuOwlCarousel({
			margin: 10,
			items: 5,
			loop: false,
			afterAction: function () {
				if (this.itemsAmount > this.visibleItems.length) {
					a.fullControls.playlistPanel.playlistLeftButton.show();
					a.fullControls.playlistPanel.playlistRightButton.show();
					if (this.currentItem == 0) {
						a.fullControls.playlistPanel.playlistLeftButton.hide()
					}
					if (this.currentItem == this.maximumItem) {
						a.fullControls.playlistPanel.playlistRightButton.hide()
					}
				} else {
					a.fullControls.playlistPanel.playlistLeftButton.hide();
					a.fullControls.playlistPanel.playlistRightButton.hide()
				}
			}
		});
		a.fullControls.playlistPanel.removeActiveClass = function () {
			$.each(a.fullControls.playlistPanel.find(".sp-playlist-item"), function (h, i) {
				$(i).removeClass("sp-playlist-active-item")
			})
		};
		a.fullControls.playlistPanel.addActiveClass = function (h) {
			$.each(a.fullControls.playlistPanel.find(".sp-playlist-item"), function (i, k) {
				if (i == h) {
					$(k).addClass("sp-playlist-active-item")
				}
			})
		};
		a.fullControls.playlistPanel.buildAdCuesAfterPlaylistUpdate = function () {
			try {
				a._buildadvertisement._buildadcue.constructed = false
			} catch (h) {}
			a.mediaElement.videoElement.addEventListener("timeupdate", function () {
				if (a.options.advertisement.cues == "true" && (!isNaN(a.mediaElement.videoElement.duration)) && (a.options.content == "vod")) {
					if (!a._buildadvertisement._buildadcue.constructed) {
						a._buildadvertisement._buildadcue()
					}
				}
			})
		};
		a.fullControls.playlistPanel.updateNewPlaylistStats = function (h) {
			console.log("Clicked on item " + h);
			console.log("playingIndex " + a.fullControls.playlistPanel.playingIndex);
			a.fullControls.playlistPanel.playingIndex = h;
			console.log("playingIndex " + a.fullControls.playlistPanel.playingIndex);
			a._createAndAppendHLStoPlayer(a.options.file[h]);
			a.fullControls.playlistPanel.removeActiveClass();
			a.fullControls.playlistPanel.addActiveClass(h);
			a.fullControls.playlistPanel.playingIndex = h;
			a.fullControls.playlistPanel.buildAdCuesAfterPlaylistUpdate()
		};
		a.fullControls.playlistPanel.find(".sp-playlist-item").click(function (h) {
			h = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(h);
			var i = $(this).attr("indexoftile");
			SaranyuHlsHTML5Player.Utils.DLOG("Clicked on item " + i);
			a.fullControls.playlistPanel.updateNewPlaylistStats(i);
			if (a.fullControls.bottomControlBar.bottomProgressBar.progressbar.seekbarPreviewContainer.seekbarPreviewContainerImgTag) {
				a.fullControls.bottomControlBar.bottomProgressBar.progressbar.seekbarPreviewContainer.ajaxForVtt(a.options.file[i].thumbnails)
			}
		});
		a.fullControls.bottomControlBar.bottomPlayerControls.playlist.button.click(function (h) {
			h = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(h);
			SaranyuHlsHTML5Player.Utils.DLOG("Clicked on playlist button");
			a.fullControls.playlistPanel.toggle();
			if (a._buildadvertisement.initializeAd.adStarted && !a._buildadvertisement.initializeAd.isLinear) {
				a.adContainer.toggleClass("sp-playlist-show")
			}
			a.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup.hide();
			a.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.hide();
			a.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.hide();
			a.fullControls.bottomControlBar.bottomPlayerControls.nxplayback.popup.hide()
		});
		a.fullControls.playlistPanel.playlistLeftButton.click(function (h) {
			h = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(h);
			SaranyuHlsHTML5Player.Utils.DLOG("Clicked on prev playlist button");
			a.fullControls.playlistPanel.playlistItemView.saranyuOwlCarousel.trigger("owl.prev")
		});
		a.fullControls.playlistPanel.playlistRightButton.click(function (h) {
			h = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(h);
			SaranyuHlsHTML5Player.Utils.DLOG("Clicked on next playlist button");
			a.fullControls.playlistPanel.playlistItemView.saranyuOwlCarousel.trigger("owl.next")
		});
		a.mediaElement.videoElement.addEventListener("ended", function () {
			if ((a.options.autoplay === "true") || (a.options.autoplay == true)) {
				try {
					var h = Number(a.fullControls.playlistPanel.playingIndex) + 1;
					if (h < a.options.file.length) {
						SaranyuHlsHTML5Player.Utils.DLOG("video ended choosing next playlist index " + h);
						a.fullControls.playlistPanel.updateNewPlaylistStats(h)
					} else {
						SaranyuHlsHTML5Player.Utils.DLOG("video ended choosing next playlist index is not present so ending playlist " + h)
					}
				} catch (i) {}
			} else {
				SaranyuHlsHTML5Player.Utils.DLOG("player will be in replay mode and it will play same file")
			}
		})
	},
	_buildvideotitle: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("Attaching video title");
		var b = this;
		var a = '<div class="sp-controls-top-video-title"><span class="sp-controls-top-video-title-text"></span></div>';
		b.fullControls.topContolbar.append(a);
		b.fullControls.topContolbar.videoTitle = b.fullControls.topContolbar.find(".sp-controls-top-video-title .sp-controls-top-video-title-text");
		b.fullControls.topContolbar.videoTitle.changeTitle = function (c) {
			b.fullControls.topContolbar.videoTitle.html(c)
		}.bind(b)
	},
	_buildbigicons: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("Attaching big icons");
		var c = this;
		var a = c.options;
		var e = c.mediaElement.videoElement;
		var g = '<div class="sp-player-poster"><img></div>';
		var d = '<div class="sp-player-bigplay"></div>';
		var f = '<div class="sp-player-loading"></div>';
		var b = '<div class="sp-player-replay"></div>';
		c.playerLayers.append(g);
		c.playerLayers.append(d);
		c.playerLayers.append(f);
		c.playerLayers.append(b);
		c.playerLayers.poster = c.playerLayers.find(".sp-player-poster");
		c.playerLayers.poster.img = c.playerLayers.poster.find("img");
		c.playerLayers.poster.changePoster = function (h) {
			$(c.playerLayers.poster.img).attr("src", h)
		}.bind(c);
		c.playerLayers.bigplay = c.playerLayers.find(".sp-player-bigplay");
		c.playerLayers.loading = c.playerLayers.find(".sp-player-loading");
		c.playerLayers.bigreplay = c.playerLayers.find(".sp-player-replay");
		if ((c.options.autoplay === "true") || (c.options.autoplay == true)) {
			c.playerLayers.bigplay.hide();
			c.playerLayers.bigreplay.hide()
		} else {
			c.playerLayers.bigreplay.hide();
			c.playerLayers.loading.hide();
			c.fullControls.middleControlbar.saranyuPlaypause.addClass("sp-pause");
			c.fullControls.middleControlbar.saranyuPlaypause.removeClass("sp-play");
			c.fullControls.middleControlbar.saranyuPlaypause.removeClass("sp-replay");
			c.fullControls.middleControlbar.saranyuPlaypause.tooltip.html(SaranyuHlsHTML5Player.defaultOptions.titleStrings.play)
		}
		c.playerLayers.click(function (h) {
			h.preventDefault();
			if (e.paused) {
				c._videoPlayerControls("play")
			} else {
				c._videoPlayerControls("pause")
			}
		});
		e.addEventListener("play", function () {
			c.playerLayers.poster.hide();
			c.playerLayers.bigplay.hide();
			c.playerLayers.loading.hide();
			c.playerLayers.bigreplay.hide()
		});
		e.addEventListener("playing", function () {
			c.playerLayers.poster.hide();
			c.playerLayers.bigplay.hide();
			c.playerLayers.loading.hide();
			c.playerLayers.bigreplay.hide()
		});
		e.addEventListener("pause", function () {
			try {
				console.log(new Date().getTime() - c._buildqualityswitch.lastQualityChangeAt);
				if (new Date().getTime() - c._buildqualityswitch.lastQualityChangeAt < 1000) {
					console.log("last time when quality changed was below 1s");
					return true
				}
			} catch (h) {}
			c.playerLayers.bigplay.show();
			c.playerLayers.loading.hide();
			c.playerLayers.bigreplay.hide()
		});
		e.addEventListener("waiting", function () {
			if (!e.paused) {
				c.playerLayers.loading.show()
			}
		});
		e.addEventListener("ended", function () {
			c.playerLayers.bigreplay.show();
			c.playerLayers.bigplay.hide()
		})
	},
	_buildeventcallbacks: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("Attaching Event Callbacks");
		var a = this;
		var b = a.mediaElement.videoElement;
		a.eventcallbacks = {};
		b.addEventListener("ended", function () {
			try {
				if (a._buildadvertisement.initializeAd.isLinear) {
					return
				}
			} catch (c) {}
			try {
				a.eventcallbacks.onComplete(b.currentTime, b.duration, b.mediaId)
			} catch (c) {
				SaranyuHlsHTML5Player.Utils.DLOG("callback events complete is not listened")
			}
		});
		b.addEventListener("pause", function () {
			try {
				if (a._buildadvertisement.initializeAd.isLinear) {
					return
				}
			} catch (c) {}
			try {
				a.eventcallbacks.onPause(b.currentTime, b.duration, b.mediaId)
			} catch (c) {
				SaranyuHlsHTML5Player.Utils.DLOG("callback events Pause is not listened")
			}
		});
		b.addEventListener("play", function () {
			try {
				if (a._buildadvertisement.initializeAd.isLinear) {
					return
				}
			} catch (c) {}
			try {
				if (b.currentTime == 0) {
					a.eventcallbacks.onPlay(b.currentTime, b.duration, b.mediaId)
				} else {
					a.eventcallbacks.onResume(b.currentTime, b.duration, b.mediaId)
				}
			} catch (c) {
				SaranyuHlsHTML5Player.Utils.DLOG("callback events Play/Resume is not listened")
			}
		});
		b.addEventListener("seeked", function () {
			try {
				if (a._buildadvertisement.initializeAd.isLinear) {
					return
				}
			} catch (c) {}
			try {
				a.eventcallbacks.onSeeked(b.currentTime, b.duration, b.mediaId)
			} catch (c) {
				SaranyuHlsHTML5Player.Utils.DLOG("callback events Seeked is not listened")
			}
		})
	},
	_buildhotkeys: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("Attaching Hotkeys");
		var a = this;
		var c = a.mediaElement.videoElement;
		var b = '<div class="sp-player-text-feedback-container"></div>';
		a.playerLayers.append(b);
		a.playerLayers.feedbackTextElement = a.playerLayers.find(".sp-player-text-feedback-container");
		a.playerLayers.feedbackTextElement.hide();
		a.playerInner.attr("tabindex", "0");
		a.playerInner.keydown(function (g) {
			g.preventDefault();
			try {
				if (a._buildadvertisement.initializeAd.isLinear) {
					return
				}
			} catch (h) {}
			var d = (typeof g.which == "number") ? g.which : g.keyCode;
			if (d == 13 || d == 32) {
				SaranyuHlsHTML5Player.Utils.DLOG("Hotkey space/enter pressed which actions play/pause");
				if (c.paused) {
					a._videoPlayerControls("play");
					a.playerLayers.feedbackTextElement.html("Key pressed for play").stop(false, true).show().fadeOut(3000)
				} else {
					a._videoPlayerControls("pause");
					a.playerLayers.feedbackTextElement.html("Key pressed for pause").stop(false, true).show().fadeOut(3000)
				}
			} else {
				if (d == 109 || d == 77) {
					SaranyuHlsHTML5Player.Utils.DLOG("Hotkey M/m pressed which actions mute or unmute");
					if (c.muted == true) {
						a._videoPlayerControls("unmute");
						a.playerLayers.feedbackTextElement.html("Key pressed for unmute").stop(false, true).show().fadeOut(3000)
					} else {
						a._videoPlayerControls("mute");
						a.playerLayers.feedbackTextElement.html("Key pressed for mute").stop(false, true).show().fadeOut(3000)
					}
				} else {
					if (d == 70 || d == 102) {
						SaranyuHlsHTML5Player.Utils.DLOG("Hotkey F/f pressed which actions fullscreen toggle");
						a.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.toggleFullscreen()
					} else {
						if (d == 117 || d == 85) {
							SaranyuHlsHTML5Player.Utils.DLOG("Hotkey up-arrow pressed which actions  volume increase");
							var f = c.volume;
							f += 0.1;
							f = Math.max(0, f);
							f = Math.min(f, 1);
							a._videoPlayerControls("volumechange", f);
							a.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.positionVolumeHandle(f);
							a.playerLayers.feedbackTextElement.html("Key pressed for volume up").stop(false, true).show().fadeOut(3000)
						} else {
							if (d == 100 || d == 68) {
								SaranyuHlsHTML5Player.Utils.DLOG("Hotkey down-arrow pressed which actions volume decrease");
								var f = c.volume;
								f -= 0.1;
								f = Math.max(0, f);
								f = Math.min(f, 1);
								a._videoPlayerControls("volumechange", f);
								a.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.positionVolumeHandle(f);
								a.playerLayers.feedbackTextElement.html("Key pressed for volume down").stop(false, true).show().fadeOut(3000)
							}
						}
					}
				}
			}
		})
	},
	_buildadvertisement: function () {
		SaranyuHlsHTML5Player.Utils.DLOG("building advertisement that supports vmap");
		var d = this;
		var b = d.options;
		var f = ["playpause", "fullScreen", "volume", "title", "time"];
		if (b.advertisement.hasOwnProperty("vmap") && b.advertisement.vmap == "true") {
			if (b.advertisement) {
				var h = '<div class="sp-ad-top-controlbar"></div>';
				var c = '<div class="sp-ad-video-element"></div>';
				var g = '<div class="sp-ad-bottom-controlbar"></div>';
				var e = '<video class="sp-ad-dummy-video"></video>';
				d.adContainer.append(e);
				d.adContainer.append(h);
				d.adContainer.append(c);
				d.adContainer.append(g);
				d.adContainer.adTopControls = d.adContainer.find(".sp-ad-top-controlbar");
				d.adContainer.adVideoElement = d.adContainer.find(".sp-ad-video-element");
				d.adContainer.adBottomControls = d.adContainer.find(".sp-ad-bottom-controlbar");
				d.adContainer.adDummyVideoTag = d.adContainer.find(".sp-ad-dummy-video");
				d._buildadvertisement._buildadcue = function () {
					d._buildadvertisement._buildadcue.constructed = false;
					if (!d._buildadvertisement._buildadcue.constructed) {
						try {
							d.fullControls.bottomControlBar.bottomProgressBar.progressbar.cues.empty()
						} catch (i) {}
						$.each(d._buildadvertisement.initializeAd.adCues, function (m, o) {
							if (Number(o)) {
								var k = SaranyuHlsHTML5Player.Utils.getPercentageForGivenDuration(o, d.mediaElement.videoElement.duration);
								if (!(k >= 0 && k <= 100)) {
									return true
								}
								var l = "<span class='sp-ad-cue-points sp-ad-cue-points-" + m + "' style='left:" + k + "%'></span>";
								d.fullControls.bottomControlBar.bottomProgressBar.progressbar.cues.append(l);
								var n = d.fullControls.bottomControlBar.bottomProgressBar.progressbar.cues.find(".sp-ad-cue-points-" + m);
								d._buildadvertisement._buildadcue.constructed = true
							}
						})
					}
				};
				d._buildadvertisement._buildadtitle = function () {
					SaranyuHlsHTML5Player.Utils.DLOG("Building ad title icon for ad container");
					var i = '<div class="ad-video-title"><span class="ad-video-title-text"></span></div>';
					d.adContainer.adTopControls.append(i);
					d.adContainer.adTopControls.adTitle = d.adContainer.adTopControls.find(".ad-video-title-text")
				};
				d._buildadvertisement._buildadplaypause = function () {
					SaranyuHlsHTML5Player.Utils.DLOG("Building playpause icon for ad container");
					var i = '<div class="sp-ad-button sp-ad-playpause sp-ad-play"><button></button></div>';
					d.adContainer.adBottomControls.append(i);
					d.adContainer.adBottomControls.playpause = d.adContainer.adBottomControls.find(".sp-ad-playpause");
					d.adContainer.adBottomControls.playpause.click(function () {
						SaranyuHlsHTML5Player.Utils.DLOG("AD play pause button clicked");
						try {
							if (!d._buildadvertisement.initializeAd.adPaused) {
								d._buildadvertisement.initializeAd.adsManager.pause();
								d._buildadvertisement.initializeAd.adPaused = true
							} else {
								d._buildadvertisement.initializeAd.adsManager.resume();
								d._buildadvertisement.initializeAd.adPaused = false
							}
						} catch (k) {}
					}.bind(d));
					d.adContainer.adBottomControls.playpause.changeIcon = function () {
						if (d._buildadvertisement.initializeAd.adPaused) {
							d.adContainer.adBottomControls.playpause.removeClass("sp-ad-play").addClass("sp-ad-pause")
						} else {
							d.adContainer.adBottomControls.playpause.removeClass("sp-ad-pause").addClass("sp-ad-play")
						}
					}
				};
				d._buildadvertisement._buildadvolume = function () {
					SaranyuHlsHTML5Player.Utils.DLOG("Building volume icon for ad container");
					var k = '<div class="sp-ad-button sp-ad-volume-muteunmute sp-ad-unmute"><button></button></div>';
					d.adContainer.adBottomControls.append(k);
					d.adContainer.adBottomControls.volumeMuteUnmute = d.adContainer.adBottomControls.find(".sp-ad-volume-muteunmute");
					var i = '<div class="sp-ad-volume-slider sp-ad-volume-slider-wrap"><div class="sp-ad-volume-current"></div><div class="sp-ad-volume-handle"></div></div>';
					d.adContainer.adBottomControls.append(i);
					d.adContainer.adBottomControls.volumeSlider = d.adContainer.adBottomControls.find(".sp-ad-volume-slider.sp-ad-volume-slider-wrap");
					d.adContainer.adBottomControls.volumeSlider.volumeCurrent = d.adContainer.adBottomControls.volumeSlider.find(".sp-ad-volume-current");
					d.adContainer.adBottomControls.volumeSlider.volumeHandle = d.adContainer.adBottomControls.volumeSlider.find(".sp-ad-volume-handle");
					d.adContainer.adBottomControls.volumeSlider.oldVolume = 1;
					d.adContainer.adBottomControls.volumeSlider.positionVolumeHandle = function (l) {
						d.adContainer.adBottomControls.volumeSlider.volumeCurrent.css("width", l * 100 + "%");
						d.adContainer.adBottomControls.volumeSlider.volumeHandle.css("left", "calc(" + l * 100 + "% - " + d.adContainer.adBottomControls.volumeSlider.volumeHandle.width() / 2 + "px)")
					};
					d.adContainer.adBottomControls.volumeSlider.handleVolumeMove = function (o) {
						var n = null,
							m = d.adContainer.adBottomControls.volumeSlider,
							l = m.offset();
						var q = m.width(),
							p = o.pageX - l.left;
						n = p / q;
						n = Math.max(0, n);
						n = Math.min(n, 1);
						d.adContainer.adBottomControls.volumeSlider.positionVolumeHandle(n);
						try {
							d._buildadvertisement.initializeAd.adsManager.setVolume(n);
							d.adContainer.adBottomControls.volumeSlider.oldVolume = n
						} catch (o) {}
					};
					d.adContainer.adBottomControls.volumeSlider.bind("mouseover", function (l) {
						l = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(l);
						d.adContainer.adBottomControls.volumeSlider.mouseIsOver = true
					}).bind("mousemove", function (l) {
						l = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(l);
						if (d.adContainer.adBottomControls.volumeSlider.mouseIsDown == true) {
							d.adContainer.adBottomControls.volumeSlider.handleVolumeMove(l)
						}
					}).bind("mouseup", function (l) {
						l = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(l);
						d.adContainer.adBottomControls.volumeSlider.mouseIsDown = false
					}).bind("mousedown", function (l) {
						l = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(l);
						d.adContainer.adBottomControls.volumeSlider.handleVolumeMove(l);
						d.adContainer.adBottomControls.volumeSlider.mouseIsDown = true
					}).bind("mouseleave", function (l) {
						l = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(l);
						d.adContainer.adBottomControls.volumeSlider.mouseIsDown = false
					});
					d.adContainer.adBottomControls.volumeMuteUnmute.click(function () {
						if (d._buildadvertisement.initializeAd.adMuted) {
							if (d.adContainer.adBottomControls.volumeSlider.oldVolume >= 0) {
								d._buildadvertisement.initializeAd.adsManager.setVolume(d.adContainer.adBottomControls.volumeSlider.oldVolume)
							}
							d._buildadvertisement.initializeAd.adsManager.setVolume(0.2);
							d._buildadvertisement.initializeAd.adMuted = false
						} else {
							d._buildadvertisement.initializeAd.adsManager.setVolume(0);
							d._buildadvertisement.initializeAd.adMuted = true
						}
					});
					d.adContainer.adBottomControls.volumeMuteUnmute.changeIcon = function () {
						if (d._buildadvertisement.initializeAd.adMuted) {
							d.adContainer.adBottomControls.volumeMuteUnmute.addClass("sp-ad-mute").removeClass("sp-ad-unmute");
							d.adContainer.adBottomControls.volumeSlider.hide()
						} else {
							d.adContainer.adBottomControls.volumeMuteUnmute.addClass("sp-ad-unmute").removeClass("sp-ad-mute");
							d.adContainer.adBottomControls.volumeSlider.show()
						}
					};
					d.adContainer.adBottomControls.volumeMuteUnmute.checkDefaultContentVolume = function () {
						if (d.mediaElement.videoElement.muted) {
							d.adContainer.adBottomControls.volumeMuteUnmute.removeClass("sp-ad-unmute").addClass("sp-ad-mute");
							d._buildadvertisement.initializeAd.adsManager.setVolume(0);
							d.adContainer.adBottomControls.volumeSlider.oldVolume = d.mediaElement.videoElement.volume;
							d.adContainer.adBottomControls.volumeSlider.positionVolumeHandle(d.adContainer.adBottomControls.volumeSlider.oldVolume);
							d._buildadvertisement.initializeAd.adMuted = true
						} else {
							d.adContainer.adBottomControls.volumeMuteUnmute.removeClass("sp-ad-mute").addClass("sp-ad-unmute");
							d._buildadvertisement.initializeAd.adsManager.setVolume(d.mediaElement.videoElement.volume);
							d.adContainer.adBottomControls.volumeSlider.oldVolume = d.mediaElement.videoElement.volume;
							d.adContainer.adBottomControls.volumeSlider.positionVolumeHandle(d.adContainer.adBottomControls.volumeSlider.oldVolume);
							d._buildadvertisement.initializeAd.adMuted = false
						}
					}
				};
				d._buildadvertisement._buildadtime = function () {
					SaranyuHlsHTML5Player.Utils.DLOG("Building time for ad container");
					var i = '<div class="sp-ad-player-time"><span class="sp-ad-plyr-currenttime">00:00</span>&nbsp;/&nbsp;<span class="sp-ad-plyr-duration">00:00</span></div>';
					d.adContainer.adBottomControls.append(i);
					d.adContainer.adBottomControls.timeContainer = d.adContainer.adBottomControls.find(".sp-ad-player-time");
					d.adContainer.adBottomControls.timeContainer.currentTime = d.adContainer.adBottomControls.find(".sp-ad-plyr-currenttime");
					d.adContainer.adBottomControls.timeContainer.duration = d.adContainer.adBottomControls.find(".sp-ad-plyr-duration");
					d._buildadvertisement._buildadtime.changeCurrentTime = function () {
						try {
							var k = 0;
							if ((d._buildadvertisement.initializeAd.ad.getDuration() - d._buildadvertisement.initializeAd.remainingTime) >= 0) {
								k = d._buildadvertisement.initializeAd.ad.getDuration() - d._buildadvertisement.initializeAd.remainingTime
							} else {
								k = 0
							}
							d.adContainer.adBottomControls.timeContainer.currentTime.html(SaranyuHlsHTML5Player.Utils.secondsToTimeCode(k))
						} catch (l) {}
					};
					d._buildadvertisement._buildadtime.changeDuration = function () {
						try {
							d.adContainer.adBottomControls.timeContainer.duration.html(SaranyuHlsHTML5Player.Utils.secondsToTimeCode(d._buildadvertisement.initializeAd.ad.getDuration()))
						} catch (k) {}
					}
				};
				d._buildadvertisement._buildadfullScreen = function () {
					SaranyuHlsHTML5Player.Utils.DLOG("Building playpause icon for ad container");
					var i = '<div class="sp-ad-button sp-ad-fullscreen-unfullscreen sp-ad-fullscreen"><button></button></div>';
					d.adContainer.adBottomControls.append(i);
					d.adContainer.adBottomControls.fullscreenunfullscreen = d.adContainer.adBottomControls.find(".sp-ad-fullscreen-unfullscreen");
					var k = d.isFullScreen;
					if (k) {
						d.adContainer.adBottomControls.fullscreenunfullscreen.removeClass("sp-ad-fullscreen").addClass("sp-ad-unfullscreen")
					} else {
						d.adContainer.adBottomControls.fullscreenunfullscreen.removeClass("sp-ad-unfullscreen").addClass("sp-ad-fullscreen")
					}
					d.adContainer.adBottomControls.fullscreenunfullscreen.click(function (l) {
						l.preventDefault();
						SaranyuHlsHTML5Player.Utils.DLOG("Clicked on FullScreen");
						d.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.toggleFullscreen();
						setTimeout(function () {
							var m = d.isFullScreen;
							if (m) {
								d.adContainer.adBottomControls.fullscreenunfullscreen.removeClass("sp-ad-fullscreen").addClass("sp-ad-unfullscreen")
							} else {
								d.adContainer.adBottomControls.fullscreenunfullscreen.removeClass("sp-ad-unfullscreen").addClass("sp-ad-fullscreen")
							}
						}.bind(d), 600)
					}.bind(d))
				};
				d._buildadvertisement._createAdControls = function () {
					SaranyuHlsHTML5Player.Utils.DLOG("_createAdControls");
					var i = this,
						k = f;
					i._buildadvertisement._destroyAdControls();
					for (featureIndex in k) {
						feature = k[featureIndex];
						SaranyuHlsHTML5Player.Utils.DLOG("ad feature found is " + feature);
						if (i._buildadvertisement["_buildad" + feature]) {
							try {
								i._buildadvertisement["_buildad" + feature]()
							} catch (l) {
								SaranyuHlsHTML5Player.Utils.DLOG(l)
							}
						} else {
							SaranyuHlsHTML5Player.Utils.DLOG("Error could not find function")
						}
					}
				}.bind(d);
				d._buildadvertisement._destroyAdControls = function () {
					SaranyuHlsHTML5Player.Utils.DLOG("_destroyAdControls");
					var i = this;
					i.adContainer.adTopControls.empty();
					i.adContainer.adBottomControls.empty();
					i.adContainer.adVideoElement.empty();
					try {
						i.fullControls.bottomControlBar.bottomProgressBar.progressbar.cues.empty()
					} catch (k) {}
				}.bind(d);
				d._buildadvertisement._createAdControls();
				d._buildadvertisement.initializeAd = function (i) {
					try {
						try {
							d.adContainer.adBottomControls.volumeMuteUnmute.checkDefaultContentVolume()
						} catch (k) {}
						d._buildadvertisement.initializeAd.onAdError()
					} catch (k) {}
					d._buildadvertisement.initializeAd.adsManager;
					d._buildadvertisement.initializeAd.adsLoader;
					d._buildadvertisement.initializeAd.adDisplayContainer;
					d._buildadvertisement.initializeAd.intervalTimer;
					d._buildadvertisement.initializeAd.videoContent;
					d._buildadvertisement.initializeAd.adStarted = false;
					d._buildadvertisement.initializeAd.isLinear = false;
					d._buildadvertisement.initializeAd.adObj;
					d._buildadvertisement.initializeAd.adPaused = false;
					d._buildadvertisement.initializeAd.adMuted = false;
					d._buildadvertisement.initializeAd.init = function (l) {
						d._buildadvertisement.initializeAd.videoContent = d.mediaElement.videoElement;
						d._buildadvertisement.initializeAd.setUpIMA(l)
					};
					d._buildadvertisement.initializeAd.setUpIMA = function (l) {
						d._buildadvertisement.initializeAd.createAdDisplayContainer();
						d._buildadvertisement.initializeAd.adsLoader = new google.ima.AdsLoader(d._buildadvertisement.initializeAd.adDisplayContainer);
						d._buildadvertisement.initializeAd.adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, d._buildadvertisement.initializeAd.onAdsManagerLoaded, false);
						d._buildadvertisement.initializeAd.adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, d._buildadvertisement.initializeAd.onAdError, false);
						d._buildadvertisement.initializeAd.adsRequest = new google.ima.AdsRequest();
						d._buildadvertisement.initializeAd.adsRequest.adTagUrl = l.adurl;
						d._buildadvertisement.initializeAd.adsRequest.linearAdSlotWidth = d.adContainer.width();
						d._buildadvertisement.initializeAd.adsRequest.linearAdSlotHeight = d.adContainer.height();
						d._buildadvertisement.initializeAd.adsRequest.nonLinearAdSlotWidth = d.adContainer.width();
						d._buildadvertisement.initializeAd.adsRequest.nonLinearAdSlotHeight = SaranyuHlsHTML5Player.maxNonLinearAdHeight;
						d._buildadvertisement.initializeAd.adsLoader.requestAds(d._buildadvertisement.initializeAd.adsRequest)
					}.bind(d);
					d._buildadvertisement.initializeAd.createAdDisplayContainer = function () {
						try {
							d.adContainer.adVideoElement.empty()
						} catch (l) {}
						google.ima.settings.setVpaidMode(google.ima.ImaSdkSettings.VpaidMode.ENABLED);
						d._buildadvertisement.initializeAd.adDisplayContainer = new google.ima.AdDisplayContainer(d.adContainer.adVideoElement[0], d.mediaElement.videoElement)
					};
					d._buildadvertisement.initializeAd.playAds = function () {
						try {
							d.adContainer.addClass("sp-ad-container-display")
						} catch (l) {}
						d._buildadvertisement.initializeAd.videoContent.load();
						d._buildadvertisement.initializeAd.adDisplayContainer.initialize();
						try {
							d._buildadvertisement.initializeAd.adsManager.init(d.adContainer.adVideoElement.width(), d.adContainer.adVideoElement.height(), google.ima.ViewMode.NORMAL);
							d._buildadvertisement.initializeAd.adsManager.start()
						} catch (m) {
							d._buildadvertisement.initializeAd.videoContent.play()
						}
					};
					d._buildadvertisement.initializeAd.onAdsManagerLoaded = function (l) {
						d._buildadvertisement.initializeAd.adsRenderingSettings = new google.ima.AdsRenderingSettings();
						d._buildadvertisement.initializeAd.adsRenderingSettings.useStyledNonLinearAds = true;
						d._buildadvertisement.initializeAd.adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
						d._buildadvertisement.initializeAd.adsManager = l.getAdsManager(d.mediaElement.videoElement, d._buildadvertisement.initializeAd.adsRenderingSettings);
						console.log("the ad cue points are");
						console.log(d._buildadvertisement.initializeAd.adsManager.getCuePoints());
						d._buildadvertisement.initializeAd.adCues = d._buildadvertisement.initializeAd.adsManager.getCuePoints();
						d.mediaElement.videoElement.addEventListener("timeupdate", function (m) {
							d._buildadvertisement._buildadcue()
						}.bind(d));
						d._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, d._buildadvertisement.initializeAd.onAdError);
						d._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, d._buildadvertisement.initializeAd.onContentPauseRequested);
						d._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, d._buildadvertisement.initializeAd.onContentResumeRequested);
						d._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, d._buildadvertisement.initializeAd.onAdEvent);
						d._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.CLICK, d._buildadvertisement.initializeAd.onAdEvent);
						d._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.PAUSED, d._buildadvertisement.initializeAd.onAdEvent);
						d._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.RESUMED, d._buildadvertisement.initializeAd.onAdEvent);
						d._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.VOLUME_CHANGED, d._buildadvertisement.initializeAd.onAdEvent);
						d._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.VOLUME_MUTED, d._buildadvertisement.initializeAd.onAdEvent);
						d._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.LOADED, d._buildadvertisement.initializeAd.onAdEvent);
						d._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.STARTED, d._buildadvertisement.initializeAd.onAdEvent);
						d._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE, d._buildadvertisement.initializeAd.onAdEvent);
						d._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.SKIPPED, d._buildadvertisement.initializeAd.onAdEvent);
						d._buildadvertisement.initializeAd.playAds()
					};
					d._buildadvertisement.initializeAd.completesPlayingAd = function () {
						try {
							if (d._buildadvertisement.initializeAd.isLinear) {
								SaranyuHlsHTML5Player.Utils.DLOG("Retaining volume status change made in ad player to content player");
								d._videoPlayerControls("volumechange", d.adContainer.adBottomControls.volumeSlider.oldVolume);
								d.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.positionVolumeHandle(d.adContainer.adBottomControls.volumeSlider.oldVolume);
								if (d._buildadvertisement.initializeAd.adMuted) {
									d._videoPlayerControls("mute")
								} else {
									d._videoPlayerControls("unmute")
								}
							}
						} catch (m) {}
						try {
							clearInterval(d._buildadvertisement.initializeAd.intervalTimer)
						} catch (m) {}
						try {
							SaranyuHlsHTML5Player.Utils.DLOG("resetting ad container height");
							d.adContainer.height("100%")
						} catch (m) {}
						try {
							d.adContainer.removeClass("sp-ad-container-display")
						} catch (m) {}
						if (!(d._buildadvertisement.initializeAd.adObj.schedule == "postroll")) {
							d.mediaElement.videoElement.play()
						} else {
							try {
								var l = Number(d.fullControls.playlistPanel.playingIndex) + 1;
								if (l < d.options.file.length) {
									d.mediaElement.videoElement.play()
								}
							} catch (m) {}
						}
						d.adContainer.removeClass("sp-ad-active");
						d.adContainer.removeClass("sp-ad-banner");
						d._buildadvertisement.initializeAd.adStarted = false;
						d._buildadvertisement.initializeAd.isLinear = false
					}, d._buildadvertisement.initializeAd.onAdError = function (l) {
						try {
							SaranyuHlsHTML5Player.Utils.DLOG(l.getError())
						} catch (n) {}
						try {
							if (d._buildadvertisement.initializeAd.isLinear) {
								SaranyuHlsHTML5Player.Utils.DLOG("Retaining volume status change made in ad player to content player");
								d._videoPlayerControls("volumechange", d.adContainer.adBottomControls.volumeSlider.oldVolume);
								d.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.positionVolumeHandle(d.adContainer.adBottomControls.volumeSlider.oldVolume);
								if (d._buildadvertisement.initializeAd.adMuted) {
									d._videoPlayerControls("mute")
								} else {
									d._videoPlayerControls("unmute")
								}
							}
						} catch (n) {}
						try {
							d._buildadvertisement.initializeAd.adsManager.destroy()
						} catch (n) {}
						try {
							clearInterval(d._buildadvertisement.initializeAd.intervalTimer)
						} catch (n) {}
						try {
							SaranyuHlsHTML5Player.Utils.DLOG("resetting ad container height");
							d.adContainer.height("100%")
						} catch (n) {}
						try {
							d.adContainer.removeClass("sp-ad-container-display")
						} catch (n) {}
						if (!(d._buildadvertisement.initializeAd.adObj.schedule == "postroll")) {
							d.mediaElement.videoElement.play()
						} else {
							try {
								var m = Number(d.fullControls.playlistPanel.playingIndex) + 1;
								if (m < d.options.file.length) {
									d.mediaElement.videoElement.play()
								}
							} catch (n) {}
						}
						d.adContainer.removeClass("sp-ad-active");
						d.adContainer.removeClass("sp-ad-banner");
						d._buildadvertisement.initializeAd.adStarted = false;
						d._buildadvertisement.initializeAd.isLinear = false
					};
					d._buildadvertisement.initializeAd.onAdEvent = function (l) {
						d._buildadvertisement.initializeAd.ad = l.getAd();
						switch (l.type) {
							case google.ima.AdEvent.Type.LOADED:
								SaranyuHlsHTML5Player.Utils.DLOG("New Ads Loaded");
								if (d._buildadvertisement.initializeAd.ad.isLinear()) {
									d._buildadvertisement.initializeAd.adStarted = true;
									d._buildadvertisement.initializeAd.isLinear = true;
									d.adContainer.addClass("sp-ad-active");
									d.adContainer.adTopControls.adTitle.html(d._buildadvertisement.initializeAd.ad.getTitle());
									d.adContainer.adBottomControls.volumeMuteUnmute.checkDefaultContentVolume();
									d._buildadvertisement.initializeAd.intervalTimer = setInterval(function () {
										d._buildadvertisement.initializeAd.remainingTime = d._buildadvertisement.initializeAd.adsManager.getRemainingTime();
										d._buildadvertisement.initializeAd.remainingTime = (d._buildadvertisement.initializeAd.remainingTime >= 0) ? d._buildadvertisement.initializeAd.remainingTime : 0;
										d._buildadvertisement.initializeAd.adsManager.resize(d.adContainer.adVideoElement.width(), d.adContainer.adVideoElement.height(), google.ima.ViewMode.NORMAL);
										d._buildadvertisement._buildadtime.changeCurrentTime();
										d._buildadvertisement._buildadtime.changeDuration();
										d.mediaElement.videoElement.pause()
									}.bind(d), 300)
								} else {
									d._buildadvertisement.initializeAd.adStarted = true;
									d._buildadvertisement.initializeAd.isLinear = false;
									d.adContainer.addClass("sp-ad-banner");
									d.adContainer.adBottomControls.volumeMuteUnmute.checkDefaultContentVolume();
									d.adContainer.height(d._buildadvertisement.initializeAd.ad.getHeight() + 10);
									d._buildadvertisement.initializeAd.intervalTimer = setInterval(function () {
										d._buildadvertisement.initializeAd.adsManager.resize(d.adContainer.adVideoElement.width(), d.adContainer.adVideoElement.height(), google.ima.ViewMode.NORMAL)
									}.bind(d), 300);
									var m = '<div class="sp-ad-banner-closebtn">Close</div>';
									d.adContainer.adVideoElement.append(m);
									d.adContainer.adVideoElement.bannerAdCloseBtn = d.adContainer.adVideoElement.find(".sp-ad-banner-closebtn");
									d.adContainer.adVideoElement.bannerAdCloseBtn.click(function () {
										d.adContainer.removeClass("sp-ad-banner");
										$(this).remove()
									})
								}
								break;
							case google.ima.AdEvent.Type.STARTED:
								if (d._buildadvertisement.initializeAd.ad.isLinear()) {}
								break;
							case google.ima.AdEvent.Type.CLICK:
								d._buildadvertisement.initializeAd.adsManager.pause();
								break;
							case google.ima.AdEvent.Type.PAUSED:
								d._buildadvertisement.initializeAd.adPaused = true;
								d.adContainer.adBottomControls.playpause.changeIcon();
								break;
							case google.ima.AdEvent.Type.RESUMED:
								d._buildadvertisement.initializeAd.adPaused = false;
								d.adContainer.adBottomControls.playpause.changeIcon();
								break;
							case google.ima.AdEvent.Type.VOLUME_CHANGED:
								if (d._buildadvertisement.initializeAd.adsManager.getVolume() == 0) {
									d._buildadvertisement.initializeAd.adMuted = true
								} else {
									d._buildadvertisement.initializeAd.adMuted = false;
									d.adContainer.adBottomControls.volumeSlider.positionVolumeHandle(d._buildadvertisement.initializeAd.adsManager.getVolume())
								}
								d.adContainer.adBottomControls.volumeMuteUnmute.changeIcon();
								break;
							case google.ima.AdEvent.Type.VOLUME_MUTED:
								d._buildadvertisement.initializeAd.adMuted = true;
								d.adContainer.adBottomControls.volumeMuteUnmute.changeIcon();
								break;
							case google.ima.AdEvent.Type.ALL_ADS_COMPLETED:
							case google.ima.AdEvent.Type.COMPLETE:
							case google.ima.AdEvent.Type.SKIPPED:
								d._buildadvertisement.initializeAd.completesPlayingAd();
								break
						}
					};
					d._buildadvertisement.initializeAd.onContentPauseRequested = function () {
						d._buildadvertisement.initializeAd.videoContent.pause()
					};
					d._buildadvertisement.initializeAd.onContentResumeRequested = function () {
						d._buildadvertisement.initializeAd.videoContent.play()
					};
					d._buildadvertisement.initializeAd.init(i)
				}.bind(d);
				d._buildadvertisement.adsets = b.advertisement.adsets;
				d._buildadvertisement.adinvoker = function () {
					d._buildadvertisement.adinvoker.peroll;
					d._buildadvertisement.adinvoker.midroll = [];
					d._buildadvertisement.adinvoker.postroll;
					$.each(d._buildadvertisement.adsets, function (k, i) {
						if (i.schedule == "preroll") {
							SaranyuHlsHTML5Player.Utils.DLOG("Preroll ad has been invoked");
							d._buildadvertisement.initializeAd.adObj = i;
							d._buildadvertisement.initializeAd(d._buildadvertisement.initializeAd.adObj);
							d._buildadvertisement.adinvoker.peroll = true
						}
					})
				};
				(function a() {
					if (!SaranyuHlsHTML5Player.googleImaSDKLoaded) {
						var i = document.createElement("script");
						i.type = "text/javascript";
						i.src = SaranyuHlsHTML5Player.googleImaSDKURL;
						document.getElementsByTagName("head")[0].appendChild(i);
						SaranyuHlsHTML5Player.googleImaSDKLoaded = true;
						SaranyuHlsHTML5Player.Utils.DLOG("Google IMA SDK Loaded");
						i.onload = function () {
							d._buildadvertisement.adinvoker()
						}.bind(d)
					} else {
						SaranyuHlsHTML5Player.Utils.DLOG("Google IMA SDK was Loaded already");
						d._buildadvertisement.adinvoker()
					}
				}.bind(d))()
			}
		} else {
			if (b.advertisement) {
				var h = '<div class="sp-ad-top-controlbar"></div>';
				var c = '<div class="sp-ad-video-element"></div>';
				var g = '<div class="sp-ad-bottom-controlbar"></div>';
				var e = '<video class="sp-ad-dummy-video"></video>';
				d.adContainer.append(e);
				d.adContainer.append(h);
				d.adContainer.append(c);
				d.adContainer.append(g);
				d.adContainer.adTopControls = d.adContainer.find(".sp-ad-top-controlbar");
				d.adContainer.adVideoElement = d.adContainer.find(".sp-ad-video-element");
				d.adContainer.adBottomControls = d.adContainer.find(".sp-ad-bottom-controlbar");
				d.adContainer.adDummyVideoTag = d.adContainer.find(".sp-ad-dummy-video");
				d._buildadvertisement._buildadcue = function () {
					SaranyuHlsHTML5Player.Utils.DLOG("Building ad title icon for ad container");
					d._buildadvertisement._buildadcue.constructed = false;
					if (!d._buildadvertisement._buildadcue.constructed) {
						try {
							d.fullControls.bottomControlBar.bottomProgressBar.progressbar.cues.empty()
						} catch (i) {}
						$.each(d._buildadvertisement.adsets, function (m, o) {
							if (Number(o.schedule)) {
								var k = SaranyuHlsHTML5Player.Utils.getPercentageForGivenDuration(o.schedule, d.mediaElement.videoElement.duration);
								if (!(k >= 0 && k <= 100)) {
									return true
								}
								var l = "<span class='sp-ad-cue-points sp-ad-cue-points-" + m + "' style='left:" + k + "%'></span>";
								d.fullControls.bottomControlBar.bottomProgressBar.progressbar.cues.append(l);
								var n = d.fullControls.bottomControlBar.bottomProgressBar.progressbar.cues.find(".sp-ad-cue-points-" + m);
								d._buildadvertisement._buildadcue.constructed = true
							}
						})
					}
				};
				d._buildadvertisement._buildadtitle = function () {
					SaranyuHlsHTML5Player.Utils.DLOG("Building ad title icon for ad container");
					var i = '<div class="ad-video-title"><span class="ad-video-title-text"></span></div>';
					d.adContainer.adTopControls.append(i);
					d.adContainer.adTopControls.adTitle = d.adContainer.adTopControls.find(".ad-video-title-text")
				};
				d._buildadvertisement._buildadplaypause = function () {
					SaranyuHlsHTML5Player.Utils.DLOG("Building playpause icon for ad container");
					var i = '<div class="sp-ad-button sp-ad-playpause sp-ad-play"><button></button></div>';
					d.adContainer.adBottomControls.append(i);
					d.adContainer.adBottomControls.playpause = d.adContainer.adBottomControls.find(".sp-ad-playpause");
					d.adContainer.adBottomControls.playpause.click(function () {
						SaranyuHlsHTML5Player.Utils.DLOG("AD play pause button clicked");
						try {
							if (!d._buildadvertisement.initializeAd.adPaused) {
								d._buildadvertisement.initializeAd.adsManager.pause();
								d._buildadvertisement.initializeAd.adPaused = true
							} else {
								d._buildadvertisement.initializeAd.adsManager.resume();
								d._buildadvertisement.initializeAd.adPaused = false
							}
						} catch (k) {}
					}.bind(d));
					d.adContainer.adBottomControls.playpause.changeIcon = function () {
						if (d._buildadvertisement.initializeAd.adPaused) {
							d.adContainer.adBottomControls.playpause.removeClass("sp-ad-play").addClass("sp-ad-pause")
						} else {
							d.adContainer.adBottomControls.playpause.removeClass("sp-ad-pause").addClass("sp-ad-play")
						}
					}
				};
				d._buildadvertisement._buildadvolume = function () {
					SaranyuHlsHTML5Player.Utils.DLOG("Building volume icon for ad container");
					var k = '<div class="sp-ad-button sp-ad-volume-muteunmute sp-ad-unmute"><button></button></div>';
					d.adContainer.adBottomControls.append(k);
					d.adContainer.adBottomControls.volumeMuteUnmute = d.adContainer.adBottomControls.find(".sp-ad-volume-muteunmute");
					var i = '<div class="sp-ad-volume-slider sp-ad-volume-slider-wrap"><div class="sp-ad-volume-current"></div><div class="sp-ad-volume-handle"></div></div>';
					d.adContainer.adBottomControls.append(i);
					d.adContainer.adBottomControls.volumeSlider = d.adContainer.adBottomControls.find(".sp-ad-volume-slider.sp-ad-volume-slider-wrap");
					d.adContainer.adBottomControls.volumeSlider.volumeCurrent = d.adContainer.adBottomControls.volumeSlider.find(".sp-ad-volume-current");
					d.adContainer.adBottomControls.volumeSlider.volumeHandle = d.adContainer.adBottomControls.volumeSlider.find(".sp-ad-volume-handle");
					d.adContainer.adBottomControls.volumeSlider.oldVolume = 1;
					d.adContainer.adBottomControls.volumeSlider.positionVolumeHandle = function (l) {
						d.adContainer.adBottomControls.volumeSlider.volumeCurrent.css("width", l * 100 + "%");
						d.adContainer.adBottomControls.volumeSlider.volumeHandle.css("left", "calc(" + l * 100 + "% - " + d.adContainer.adBottomControls.volumeSlider.volumeHandle.width() / 2 + "px)")
					};
					d.adContainer.adBottomControls.volumeSlider.handleVolumeMove = function (o) {
						var n = null,
							m = d.adContainer.adBottomControls.volumeSlider,
							l = m.offset();
						var q = m.width(),
							p = o.pageX - l.left;
						n = p / q;
						n = Math.max(0, n);
						n = Math.min(n, 1);
						d.adContainer.adBottomControls.volumeSlider.positionVolumeHandle(n);
						try {
							d._buildadvertisement.initializeAd.adsManager.setVolume(n);
							d.adContainer.adBottomControls.volumeSlider.oldVolume = n
						} catch (o) {}
					};
					d.adContainer.adBottomControls.volumeSlider.bind("mouseover", function (l) {
						l = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(l);
						d.adContainer.adBottomControls.volumeSlider.mouseIsOver = true
					}).bind("mousemove", function (l) {
						l = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(l);
						if (d.adContainer.adBottomControls.volumeSlider.mouseIsDown == true) {
							d.adContainer.adBottomControls.volumeSlider.handleVolumeMove(l)
						}
					}).bind("mouseup", function (l) {
						l = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(l);
						d.adContainer.adBottomControls.volumeSlider.mouseIsDown = false
					}).bind("mousedown", function (l) {
						l = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(l);
						d.adContainer.adBottomControls.volumeSlider.handleVolumeMove(l);
						d.adContainer.adBottomControls.volumeSlider.mouseIsDown = true
					}).bind("mouseleave", function (l) {
						l = SaranyuHlsHTML5Player.Utils.preventSelectionOfTextInMouseMove(l);
						d.adContainer.adBottomControls.volumeSlider.mouseIsDown = false
					});
					d.adContainer.adBottomControls.volumeMuteUnmute.click(function () {
						if (d._buildadvertisement.initializeAd.adMuted) {
							if (d.adContainer.adBottomControls.volumeSlider.oldVolume >= 0) {
								d._buildadvertisement.initializeAd.adsManager.setVolume(d.adContainer.adBottomControls.volumeSlider.oldVolume)
							}
							d._buildadvertisement.initializeAd.adsManager.setVolume(0.2);
							d._buildadvertisement.initializeAd.adMuted = false
						} else {
							d._buildadvertisement.initializeAd.adsManager.setVolume(0);
							d._buildadvertisement.initializeAd.adMuted = true
						}
					});
					d.adContainer.adBottomControls.volumeMuteUnmute.changeIcon = function () {
						if (d._buildadvertisement.initializeAd.adMuted) {
							d.adContainer.adBottomControls.volumeMuteUnmute.addClass("sp-ad-mute").removeClass("sp-ad-unmute");
							d.adContainer.adBottomControls.volumeSlider.hide()
						} else {
							d.adContainer.adBottomControls.volumeMuteUnmute.addClass("sp-ad-unmute").removeClass("sp-ad-mute");
							d.adContainer.adBottomControls.volumeSlider.show()
						}
					};
					d.adContainer.adBottomControls.volumeMuteUnmute.checkDefaultContentVolume = function () {
						if (d.mediaElement.videoElement.muted) {
							d.adContainer.adBottomControls.volumeMuteUnmute.removeClass("sp-ad-unmute").addClass("sp-ad-mute");
							d._buildadvertisement.initializeAd.adsManager.setVolume(0);
							d.adContainer.adBottomControls.volumeSlider.oldVolume = d.mediaElement.videoElement.volume;
							d.adContainer.adBottomControls.volumeSlider.positionVolumeHandle(d.adContainer.adBottomControls.volumeSlider.oldVolume);
							d._buildadvertisement.initializeAd.adMuted = true
						} else {
							d.adContainer.adBottomControls.volumeMuteUnmute.removeClass("sp-ad-mute").addClass("sp-ad-unmute");
							d._buildadvertisement.initializeAd.adsManager.setVolume(d.mediaElement.videoElement.volume);
							d.adContainer.adBottomControls.volumeSlider.oldVolume = d.mediaElement.videoElement.volume;
							d.adContainer.adBottomControls.volumeSlider.positionVolumeHandle(d.adContainer.adBottomControls.volumeSlider.oldVolume);
							d._buildadvertisement.initializeAd.adMuted = false
						}
					}
				};
				d._buildadvertisement._buildadtime = function () {
					SaranyuHlsHTML5Player.Utils.DLOG("Building time for ad container");
					var i = '<div class="sp-ad-player-time"><span class="sp-ad-plyr-currenttime">00:00</span>&nbsp;/&nbsp;<span class="sp-ad-plyr-duration">00:00</span></div>';
					d.adContainer.adBottomControls.append(i);
					d.adContainer.adBottomControls.timeContainer = d.adContainer.adBottomControls.find(".sp-ad-player-time");
					d.adContainer.adBottomControls.timeContainer.currentTime = d.adContainer.adBottomControls.find(".sp-ad-plyr-currenttime");
					d.adContainer.adBottomControls.timeContainer.duration = d.adContainer.adBottomControls.find(".sp-ad-plyr-duration");
					d._buildadvertisement._buildadtime.changeCurrentTime = function () {
						try {
							var k = 0;
							if ((d._buildadvertisement.initializeAd.ad.getDuration() - d._buildadvertisement.initializeAd.remainingTime) >= 0) {
								k = d._buildadvertisement.initializeAd.ad.getDuration() - d._buildadvertisement.initializeAd.remainingTime
							} else {
								k = 0
							}
							d.adContainer.adBottomControls.timeContainer.currentTime.html(SaranyuHlsHTML5Player.Utils.secondsToTimeCode(k))
						} catch (l) {}
					};
					d._buildadvertisement._buildadtime.changeDuration = function () {
						try {
							d.adContainer.adBottomControls.timeContainer.duration.html(SaranyuHlsHTML5Player.Utils.secondsToTimeCode(d._buildadvertisement.initializeAd.ad.getDuration()))
						} catch (k) {}
					}
				};
				d._buildadvertisement._buildadfullScreen = function () {
					SaranyuHlsHTML5Player.Utils.DLOG("Building playpause icon for ad container");
					var i = '<div class="sp-ad-button sp-ad-fullscreen-unfullscreen sp-ad-fullscreen"><button></button></div>';
					d.adContainer.adBottomControls.append(i);
					d.adContainer.adBottomControls.fullscreenunfullscreen = d.adContainer.adBottomControls.find(".sp-ad-fullscreen-unfullscreen");
					var k = d.isFullScreen;
					if (k) {
						d.adContainer.adBottomControls.fullscreenunfullscreen.removeClass("sp-ad-fullscreen").addClass("sp-ad-unfullscreen")
					} else {
						d.adContainer.adBottomControls.fullscreenunfullscreen.removeClass("sp-ad-unfullscreen").addClass("sp-ad-fullscreen")
					}
					d.adContainer.adBottomControls.fullscreenunfullscreen.click(function (l) {
						l.preventDefault();
						SaranyuHlsHTML5Player.Utils.DLOG("Clicked on FullScreen");
						d.fullControls.bottomControlBar.bottomPlayerControls.saranyuFullScreen.toggleFullscreen();
						setTimeout(function () {
							var m = d.isFullScreen;
							if (m) {
								d.adContainer.adBottomControls.fullscreenunfullscreen.removeClass("sp-ad-fullscreen").addClass("sp-ad-unfullscreen")
							} else {
								d.adContainer.adBottomControls.fullscreenunfullscreen.removeClass("sp-ad-unfullscreen").addClass("sp-ad-fullscreen")
							}
						}.bind(d), 600)
					}.bind(d))
				};
				d._buildadvertisement._createAdControls = function () {
					SaranyuHlsHTML5Player.Utils.DLOG("_createAdControls");
					var i = this,
						k = f;
					i._buildadvertisement._destroyAdControls();
					for (featureIndex in k) {
						feature = k[featureIndex];
						SaranyuHlsHTML5Player.Utils.DLOG("ad feature found is " + feature);
						if (i._buildadvertisement["_buildad" + feature]) {
							try {
								i._buildadvertisement["_buildad" + feature]()
							} catch (l) {
								SaranyuHlsHTML5Player.Utils.DLOG(l)
							}
						} else {
							SaranyuHlsHTML5Player.Utils.DLOG("Error could not find function")
						}
					}
				}.bind(d);
				d._buildadvertisement._destroyAdControls = function () {
					SaranyuHlsHTML5Player.Utils.DLOG("_destroyAdControls");
					var i = this;
					i.adContainer.adTopControls.empty();
					i.adContainer.adBottomControls.empty();
					i.adContainer.adVideoElement.empty();
					try {
						i.fullControls.bottomControlBar.bottomProgressBar.progressbar.cues.empty()
					} catch (k) {}
				}.bind(d);
				d._buildadvertisement._createAdControls();
				d._buildadvertisement.initializeAd = function (i) {
					try {
						try {
							d.adContainer.adBottomControls.volumeMuteUnmute.checkDefaultContentVolume()
						} catch (k) {}
						d._buildadvertisement.initializeAd.onAdError()
					} catch (k) {}
					d._buildadvertisement.initializeAd.adsManager;
					d._buildadvertisement.initializeAd.adsLoader;
					d._buildadvertisement.initializeAd.adDisplayContainer;
					d._buildadvertisement.initializeAd.intervalTimer;
					d._buildadvertisement.initializeAd.videoContent;
					d._buildadvertisement.initializeAd.adStarted = false;
					d._buildadvertisement.initializeAd.isLinear = false;
					d._buildadvertisement.initializeAd.adObj;
					d._buildadvertisement.initializeAd.adPaused = false;
					d._buildadvertisement.initializeAd.adMuted = false;
					d._buildadvertisement.initializeAd.init = function (l) {
						d._buildadvertisement.initializeAd.videoContent = d.adContainer.adDummyVideoTag[0];
						d._buildadvertisement.initializeAd.setUpIMA(l)
					};
					d._buildadvertisement.initializeAd.setUpIMA = function (l) {
						d._buildadvertisement.initializeAd.createAdDisplayContainer();
						d._buildadvertisement.initializeAd.adsLoader = new google.ima.AdsLoader(d._buildadvertisement.initializeAd.adDisplayContainer);
						d._buildadvertisement.initializeAd.adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, d._buildadvertisement.initializeAd.onAdsManagerLoaded, false);
						d._buildadvertisement.initializeAd.adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, d._buildadvertisement.initializeAd.onAdError, false);
						d._buildadvertisement.initializeAd.adsRequest = new google.ima.AdsRequest();
						d._buildadvertisement.initializeAd.adsRequest.adTagUrl = l.adurl;
						d._buildadvertisement.initializeAd.adsLoader.requestAds(d._buildadvertisement.initializeAd.adsRequest)
					}.bind(d);
					d._buildadvertisement.initializeAd.createAdDisplayContainer = function () {
						try {
							d.adContainer.adVideoElement.empty()
						} catch (l) {}
						google.ima.settings.setVpaidMode(google.ima.ImaSdkSettings.VpaidMode.ENABLED);
						d._buildadvertisement.initializeAd.adDisplayContainer = new google.ima.AdDisplayContainer(d.adContainer.adVideoElement[0], d._buildadvertisement.initializeAd.videoContent[0])
					};
					d._buildadvertisement.initializeAd.playAds = function () {
						try {
							d.adContainer.addClass("sp-ad-container-display")
						} catch (l) {}
						d._buildadvertisement.initializeAd.videoContent.load();
						d._buildadvertisement.initializeAd.adDisplayContainer.initialize();
						try {
							d._buildadvertisement.initializeAd.adsManager.init(d.adContainer.adVideoElement.width(), d.adContainer.adVideoElement.height(), google.ima.ViewMode.NORMAL);
							d._buildadvertisement.initializeAd.adsManager.start()
						} catch (m) {
							d._buildadvertisement.initializeAd.videoContent.play()
						}
					};
					d._buildadvertisement.initializeAd.onAdsManagerLoaded = function (l) {
						d._buildadvertisement.initializeAd.adsRenderingSettings = new google.ima.AdsRenderingSettings();
						d._buildadvertisement.initializeAd.adsManager = l.getAdsManager(d._buildadvertisement.initializeAd.videoContent, d._buildadvertisement.initializeAd.adsRenderingSettings);
						d._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, d._buildadvertisement.initializeAd.onAdError);
						d._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, d._buildadvertisement.initializeAd.onContentPauseRequested);
						d._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, d._buildadvertisement.initializeAd.onContentResumeRequested);
						d._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, d._buildadvertisement.initializeAd.onAdEvent);
						d._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.CLICK, d._buildadvertisement.initializeAd.onAdEvent);
						d._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.PAUSED, d._buildadvertisement.initializeAd.onAdEvent);
						d._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.RESUMED, d._buildadvertisement.initializeAd.onAdEvent);
						d._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.VOLUME_CHANGED, d._buildadvertisement.initializeAd.onAdEvent);
						d._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.VOLUME_MUTED, d._buildadvertisement.initializeAd.onAdEvent);
						d._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.LOADED, d._buildadvertisement.initializeAd.onAdEvent);
						d._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.STARTED, d._buildadvertisement.initializeAd.onAdEvent);
						d._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE, d._buildadvertisement.initializeAd.onAdEvent);
						d._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.SKIPPED, d._buildadvertisement.initializeAd.onAdEvent);
						d._buildadvertisement.initializeAd.playAds()
					};
					d._buildadvertisement.initializeAd.onAdError = function (l) {
						try {
							SaranyuHlsHTML5Player.Utils.DLOG(l.getError())
						} catch (n) {}
						try {
							if (d._buildadvertisement.initializeAd.isLinear) {
								SaranyuHlsHTML5Player.Utils.DLOG("Retaining volume status change made in ad player to content player");
								d._videoPlayerControls("volumechange", d.adContainer.adBottomControls.volumeSlider.oldVolume);
								d.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.positionVolumeHandle(d.adContainer.adBottomControls.volumeSlider.oldVolume);
								if (d._buildadvertisement.initializeAd.adMuted) {
									d._videoPlayerControls("mute")
								} else {
									d._videoPlayerControls("unmute")
								}
							}
						} catch (n) {}
						try {
							d._buildadvertisement.initializeAd.adsManager.destroy()
						} catch (n) {}
						try {
							clearInterval(d._buildadvertisement.initializeAd.intervalTimer)
						} catch (n) {}
						try {
							SaranyuHlsHTML5Player.Utils.DLOG("resetting ad container height");
							d.adContainer.height("100%")
						} catch (n) {}
						try {
							d.adContainer.removeClass("sp-ad-container-display")
						} catch (n) {}
						if (!(d._buildadvertisement.initializeAd.adObj.schedule == "postroll")) {
							d.mediaElement.videoElement.play()
						} else {
							try {
								var m = Number(d.fullControls.playlistPanel.playingIndex) + 1;
								if (m < d.options.file.length) {
									d.mediaElement.videoElement.play()
								}
							} catch (n) {}
						}
						d.adContainer.removeClass("sp-ad-active");
						d.adContainer.removeClass("sp-ad-banner");
						d._buildadvertisement.initializeAd.adStarted = false;
						d._buildadvertisement.initializeAd.isLinear = false
					};
					d._buildadvertisement.initializeAd.onAdEvent = function (l) {
						d._buildadvertisement.initializeAd.ad = l.getAd();
						switch (l.type) {
							case google.ima.AdEvent.Type.LOADED:
								if (d._buildadvertisement.initializeAd.ad.isLinear()) {
									d._buildadvertisement.initializeAd.adStarted = true;
									d._buildadvertisement.initializeAd.isLinear = true;
									d.adContainer.addClass("sp-ad-active");
									d.adContainer.adTopControls.adTitle.html(d._buildadvertisement.initializeAd.ad.getTitle());
									d.adContainer.adBottomControls.volumeMuteUnmute.checkDefaultContentVolume();
									d._buildadvertisement.initializeAd.intervalTimer = setInterval(function () {
										d._buildadvertisement.initializeAd.remainingTime = d._buildadvertisement.initializeAd.adsManager.getRemainingTime();
										d._buildadvertisement.initializeAd.remainingTime = (d._buildadvertisement.initializeAd.remainingTime >= 0) ? d._buildadvertisement.initializeAd.remainingTime : 0;
										d._buildadvertisement.initializeAd.adsManager.resize(d.adContainer.adVideoElement.width(), d.adContainer.adVideoElement.height(), google.ima.ViewMode.NORMAL);
										d._buildadvertisement._buildadtime.changeCurrentTime();
										d._buildadvertisement._buildadtime.changeDuration();
										d.mediaElement.videoElement.pause()
									}.bind(d), 300)
								} else {
									d._buildadvertisement.initializeAd.adStarted = true;
									d._buildadvertisement.initializeAd.isLinear = false;
									d.adContainer.addClass("sp-ad-banner");
									d.adContainer.adBottomControls.volumeMuteUnmute.checkDefaultContentVolume();
									d.adContainer.height(d._buildadvertisement.initializeAd.ad.getHeight() + 10);
									d._buildadvertisement.initializeAd.intervalTimer = setInterval(function () {
										d._buildadvertisement.initializeAd.adsManager.resize(d.adContainer.adVideoElement.width(), d.adContainer.adVideoElement.height(), google.ima.ViewMode.NORMAL)
									}.bind(d), 300);
									var m = '<div class="sp-ad-banner-closebtn">Close</div>';
									d.adContainer.adVideoElement.append(m);
									d.adContainer.adVideoElement.bannerAdCloseBtn = d.adContainer.adVideoElement.find(".sp-ad-banner-closebtn");
									d.adContainer.adVideoElement.bannerAdCloseBtn.click(function () {
										d.adContainer.removeClass("sp-ad-banner");
										$(this).remove()
									})
								}
								break;
							case google.ima.AdEvent.Type.STARTED:
								if (d._buildadvertisement.initializeAd.ad.isLinear()) {}
								break;
							case google.ima.AdEvent.Type.CLICK:
								d._buildadvertisement.initializeAd.adsManager.pause();
								break;
							case google.ima.AdEvent.Type.PAUSED:
								d._buildadvertisement.initializeAd.adPaused = true;
								d.adContainer.adBottomControls.playpause.changeIcon();
								break;
							case google.ima.AdEvent.Type.RESUMED:
								d._buildadvertisement.initializeAd.adPaused = false;
								d.adContainer.adBottomControls.playpause.changeIcon();
								break;
							case google.ima.AdEvent.Type.VOLUME_CHANGED:
								if (d._buildadvertisement.initializeAd.adsManager.getVolume() == 0) {
									d._buildadvertisement.initializeAd.adMuted = true
								} else {
									d._buildadvertisement.initializeAd.adMuted = false;
									d.adContainer.adBottomControls.volumeSlider.positionVolumeHandle(d._buildadvertisement.initializeAd.adsManager.getVolume())
								}
								d.adContainer.adBottomControls.volumeMuteUnmute.changeIcon();
								break;
							case google.ima.AdEvent.Type.VOLUME_MUTED:
								d._buildadvertisement.initializeAd.adMuted = true;
								d.adContainer.adBottomControls.volumeMuteUnmute.changeIcon();
								break;
							case google.ima.AdEvent.Type.ALL_ADS_COMPLETED:
							case google.ima.AdEvent.Type.COMPLETE:
							case google.ima.AdEvent.Type.SKIPPED:
								d._buildadvertisement.initializeAd.onAdError();
								break
						}
					};
					d._buildadvertisement.initializeAd.onContentPauseRequested = function () {
						d._buildadvertisement.initializeAd.videoContent.pause()
					};
					d._buildadvertisement.initializeAd.onContentResumeRequested = function () {
						d._buildadvertisement.initializeAd.videoContent.play()
					};
					d._buildadvertisement.initializeAd.init(i)
				}.bind(d);
				d._buildadvertisement.adsets = b.advertisement.adsets;
				d._buildadvertisement.adinvoker = function () {
					d._buildadvertisement.adinvoker.peroll;
					d._buildadvertisement.adinvoker.midroll = [];
					d._buildadvertisement.adinvoker.postroll;
					$.each(d._buildadvertisement.adsets, function (k, i) {
						if (i.schedule == "preroll") {
							SaranyuHlsHTML5Player.Utils.DLOG("Preroll ad has been invoked");
							d._buildadvertisement.initializeAd.adObj = i;
							d._buildadvertisement.initializeAd(d._buildadvertisement.initializeAd.adObj);
							d._buildadvertisement.adinvoker.peroll = true
						}
						if (!isNaN(i.schedule)) {
							i.flag = true;
							d._buildadvertisement.adinvoker.midroll.push(i)
						}
						if (i.schedule == "postroll") {
							d.mediaElement.videoElement.addEventListener("ended", function () {
								if (!d._buildadvertisement.adinvoker.postroll) {
									SaranyuHlsHTML5Player.Utils.DLOG("Postroll ad has been invoked");
									d._buildadvertisement.initializeAd.adObj = i;
									d._buildadvertisement.initializeAd(d._buildadvertisement.initializeAd.adObj);
									d._buildadvertisement.adinvoker.postroll = true
								} else {
									SaranyuHlsHTML5Player.Utils.DLOG("Postroll ad has been played")
								}
							}.bind(d))
						}
					});
					if (d._buildadvertisement.adinvoker.midroll) {
						d.mediaElement.videoElement.addEventListener("timeupdate", function () {
							if (d.options.advertisement.cues == "true" && (!isNaN(d.mediaElement.videoElement.duration)) && (d.options.content == "vod")) {
								if (!d._buildadvertisement._buildadcue.constructed) {
									d._buildadvertisement._buildadcue()
								}
							}
							$.each(d._buildadvertisement.adinvoker.midroll, function (i, k) {
								var l = d.mediaElement.videoElement;
								if ((l.currentTime >= Number(k.schedule)) && k.flag && (!l.paused)) {
									SaranyuHlsHTML5Player.Utils.DLOG("midroll ad has been invoked with schedule " + Number(k.schedule));
									d._buildadvertisement.initializeAd.adObj = k;
									d._buildadvertisement.initializeAd(d._buildadvertisement.initializeAd.adObj);
									d._buildadvertisement.initializeAd.adObj.flag = false
								}
							})
						}.bind(d))
					}
				};
				(function a() {
					if (!SaranyuHlsHTML5Player.googleImaSDKLoaded) {
						var i = document.createElement("script");
						i.type = "text/javascript";
						i.src = SaranyuHlsHTML5Player.googleImaSDKURL;
						document.getElementsByTagName("head")[0].appendChild(i);
						SaranyuHlsHTML5Player.googleImaSDKLoaded = true;
						SaranyuHlsHTML5Player.Utils.DLOG("Google IMA SDK Loaded");
						i.onload = function () {
							d._buildadvertisement.adinvoker()
						}.bind(d)
					} else {
						SaranyuHlsHTML5Player.Utils.DLOG("Google IMA SDK was Loaded already");
						d._buildadvertisement.adinvoker()
					}
				}.bind(d))()
			}
		}
	},
	_videoPlayerControls: function (a, d) {
		SaranyuHlsHTML5Player.Utils.DLOG("inside video controls function received command , " + a + " with value of " + d);
		var c = this;
		var g = c.mediaElement.videoElement;
		var b = c.options;
		switch (a) {
			case "play":
				try {
					if (c.mediaElement.videoElement.saranyuHlsMertics.islive && (!(c.options.content.toLowerCase() == "livedvr"))) {
						g.currentTime = g.duration - 3 * c.mediaElement.videoElement.saranyuHlsMertics.targetduration
					}
				} catch (f) {}
				g.play();
				SaranyuHlsHTML5Player.Utils.DLOG(a + " to video player");
				break;
			case "pause":
				g.pause();
				SaranyuHlsHTML5Player.Utils.DLOG(a + " to video player");
				break;
			case "stop":
				g.currentTime = 0;
				g.pause();
				SaranyuHlsHTML5Player.Utils.DLOG(a + " to video player");
				break;
			case "mute":
				g.muted = true;
				SaranyuHlsHTML5Player.Utils.DLOG(a + " to video player");
				break;
			case "unmute":
				g.muted = false;
				SaranyuHlsHTML5Player.Utils.DLOG(a + " to video player");
				break;
			case "volumechange":
				g.volume = d;
				SaranyuHlsHTML5Player.Utils.DLOG(a + " to video player");
				break;
			case "seek":
				g.currentTime = d;
				g.play();
				SaranyuHlsHTML5Player.Utils.DLOG(a + " to video player");
				break
		}
	},
	_getCurrentTime: function () {
		var b = this;
		var c = b.mediaElement.videoElement;
		var a = b.options;
		return c.currentTime
	},
	_playcustomPlayList: function (b) {
		SaranyuHlsHTML5Player.Utils.DLOG("Building custom playlist");
		var a = this;
		var c = a.mediaElement.videoElement;
		a._createAndAppendHLStoPlayer(b);
		a._videoPlayerControls("play")
	},
	_isSupportedMSE: function () {
		window.MediaSource = window.MediaSource || window.WebKitMediaSource;
		return (window.MediaSource && typeof window.MediaSource.isTypeSupported === "function" && window.MediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"'))
	},
	_checkHLS: function () {
		if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
			return true
		}
		return false
	}
};
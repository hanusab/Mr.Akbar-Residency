(function(){
    var script = {
 "scrollBarWidth": 10,
 "vrPolyfillScale": 0.5,
 "children": [
  "this.MainViewer",
  "this.IconButton_466CA349_4A3F_DA25_41B1_B8E0417A7CEA"
 ],
 "id": "rootPlayer",
 "paddingTop": 0,
 "width": "100%",
 "mobileMipmappingEnabled": false,
 "scrollBarColor": "#000000",
 "start": "this.init()",
 "scrollBarOpacity": 0.5,
 "horizontalAlign": "left",
 "scrollBarVisible": "rollOver",
 "data": {
  "name": "Player451"
 },
 "backgroundPreloadEnabled": true,
 "defaultVRPointer": "laser",
 "verticalAlign": "top",
 "contentOpaque": false,
 "class": "Player",
 "scripts": {
  "setStartTimeVideo": function(video, time){  var items = this.getPlayListItems(video); var startTimeBackup = []; var restoreStartTimeFunc = function() { for(var i = 0; i<items.length; ++i){ var item = items[i]; item.set('startTime', startTimeBackup[i]); item.unbind('stop', restoreStartTimeFunc, this); } }; for(var i = 0; i<items.length; ++i) { var item = items[i]; var player = item.get('player'); if(player.get('video') == video && player.get('state') == 'playing') { player.seek(time); } else { startTimeBackup.push(item.get('startTime')); item.set('startTime', time); item.bind('stop', restoreStartTimeFunc, this); } } },
  "getPanoramaOverlayByName": function(panorama, name){  var overlays = this.getOverlays(panorama); for(var i = 0, count = overlays.length; i<count; ++i){ var overlay = overlays[i]; var data = overlay.get('data'); if(data != undefined && data.label == name){ return overlay; } } return undefined; },
  "keepComponentVisibility": function(component, keep){  var key = 'keepVisibility_' + component.get('id'); var value = this.getKey(key); if(value == undefined && keep) { this.registerKey(key, keep); } else if(value != undefined && !keep) { this.unregisterKey(key); } },
  "getPlayListItems": function(media, player){  var itemClass = (function() { switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': return 'PanoramaPlayListItem'; case 'Video360': return 'Video360PlayListItem'; case 'PhotoAlbum': return 'PhotoAlbumPlayListItem'; case 'Map': return 'MapPlayListItem'; case 'Video': return 'VideoPlayListItem'; } })(); if (itemClass != undefined) { var items = this.getByClassName(itemClass); for (var i = items.length-1; i>=0; --i) { var item = items[i]; if(item.get('media') != media || (player != undefined && item.get('player') != player)) { items.splice(i, 1); } } return items; } else { return []; } },
  "fixTogglePlayPauseButton": function(player){  var state = player.get('state'); var buttons = player.get('buttonPlayPause'); if(typeof buttons !== 'undefined' && player.get('state') == 'playing'){ if(!Array.isArray(buttons)) buttons = [buttons]; for(var i = 0; i<buttons.length; ++i) buttons[i].set('pressed', true); } },
  "existsKey": function(key){  return key in window; },
  "pauseGlobalAudiosWhilePlayItem": function(playList, index, exclude){  var self = this; var item = playList.get('items')[index]; var media = item.get('media'); var player = item.get('player'); var caller = media.get('id'); var endFunc = function(){ if(playList.get('selectedIndex') != index) { if(hasState){ player.unbind('stateChange', stateChangeFunc, self); } self.resumeGlobalAudios(caller); } }; var stateChangeFunc = function(event){ var state = event.data.state; if(state == 'stopped'){ this.resumeGlobalAudios(caller); } else if(state == 'playing'){ this.pauseGlobalAudios(caller, exclude); } }; var mediaClass = media.get('class'); var hasState = mediaClass == 'Video360' || mediaClass == 'Video'; if(hasState){ player.bind('stateChange', stateChangeFunc, this); } this.pauseGlobalAudios(caller, exclude); this.executeFunctionWhenChange(playList, index, endFunc, endFunc); },
  "executeFunctionWhenChange": function(playList, index, endFunction, changeFunction){  var endObject = undefined; var changePlayListFunction = function(event){ if(event.data.previousSelectedIndex == index){ if(changeFunction) changeFunction.call(this); if(endFunction && endObject) endObject.unbind('end', endFunction, this); playList.unbind('change', changePlayListFunction, this); } }; if(endFunction){ var playListItem = playList.get('items')[index]; if(playListItem.get('class') == 'PanoramaPlayListItem'){ var camera = playListItem.get('camera'); if(camera != undefined) endObject = camera.get('initialSequence'); if(endObject == undefined) endObject = camera.get('idleSequence'); } else{ endObject = playListItem.get('media'); } if(endObject){ endObject.bind('end', endFunction, this); } } playList.bind('change', changePlayListFunction, this); },
  "initGA": function(){  var sendFunc = function(category, event, label) { ga('send', 'event', category, event, label); }; var media = this.getByClassName('Panorama'); media = media.concat(this.getByClassName('Video360')); media = media.concat(this.getByClassName('Map')); for(var i = 0, countI = media.length; i<countI; ++i){ var m = media[i]; var mediaLabel = m.get('label'); var overlays = this.getOverlays(m); for(var j = 0, countJ = overlays.length; j<countJ; ++j){ var overlay = overlays[j]; var overlayLabel = overlay.get('data') != undefined ? mediaLabel + ' - ' + overlay.get('data')['label'] : mediaLabel; switch(overlay.get('class')) { case 'HotspotPanoramaOverlay': case 'HotspotMapOverlay': var areas = overlay.get('areas'); for (var z = 0; z<areas.length; ++z) { areas[z].bind('click', sendFunc.bind(this, 'Hotspot', 'click', overlayLabel), this); } break; case 'CeilingCapPanoramaOverlay': case 'TripodCapPanoramaOverlay': overlay.bind('click', sendFunc.bind(this, 'Cap', 'click', overlayLabel), this); break; } } } var components = this.getByClassName('Button'); components = components.concat(this.getByClassName('IconButton')); for(var i = 0, countI = components.length; i<countI; ++i){ var c = components[i]; var componentLabel = c.get('data')['name']; c.bind('click', sendFunc.bind(this, 'Skin', 'click', componentLabel), this); } var items = this.getByClassName('PlayListItem'); var media2Item = {}; for(var i = 0, countI = items.length; i<countI; ++i) { var item = items[i]; var media = item.get('media'); if(!(media.get('id') in media2Item)) { item.bind('begin', sendFunc.bind(this, 'Media', 'play', media.get('label')), this); media2Item[media.get('id')] = item; } } },
  "pauseGlobalAudios": function(caller, exclude){  if (window.pauseGlobalAudiosState == undefined) window.pauseGlobalAudiosState = {}; if (window.pauseGlobalAudiosList == undefined) window.pauseGlobalAudiosList = []; if (caller in window.pauseGlobalAudiosState) { return; } var audios = this.getByClassName('Audio').concat(this.getByClassName('VideoPanoramaOverlay')); if (window.currentGlobalAudios != undefined) audios = audios.concat(Object.values(window.currentGlobalAudios)); var audiosPaused = []; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = 0; j<objAudios.length; ++j) { var a = objAudios[j]; if(audiosPaused.indexOf(a) == -1) audiosPaused.push(a); } } window.pauseGlobalAudiosState[caller] = audiosPaused; for (var i = 0, count = audios.length; i < count; ++i) { var a = audios[i]; if (a.get('state') == 'playing' && (exclude == undefined || exclude.indexOf(a) == -1)) { a.pause(); audiosPaused.push(a); } } },
  "startPanoramaWithCamera": function(media, camera){  if(window.currentPanoramasWithCameraChanged != undefined && window.currentPanoramasWithCameraChanged.indexOf(media) != -1){ return; } var playLists = this.getByClassName('PlayList'); if(playLists.length == 0) return; var restoreItems = []; for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media && (item.get('class') == 'PanoramaPlayListItem' || item.get('class') == 'Video360PlayListItem')){ restoreItems.push({camera: item.get('camera'), item: item}); item.set('camera', camera); } } } if(restoreItems.length > 0) { if(window.currentPanoramasWithCameraChanged == undefined) { window.currentPanoramasWithCameraChanged = [media]; } else { window.currentPanoramasWithCameraChanged.push(media); } var restoreCameraOnStop = function(){ var index = window.currentPanoramasWithCameraChanged.indexOf(media); if(index != -1) { window.currentPanoramasWithCameraChanged.splice(index, 1); } for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.set('camera', restoreItems[i].camera); restoreItems[i].item.unbind('stop', restoreCameraOnStop, this); } }; for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.bind('stop', restoreCameraOnStop, this); } } },
  "updateMediaLabelFromPlayList": function(playList, htmlText, playListItemStopToDispose){  var changeFunction = function(){ var index = playList.get('selectedIndex'); if(index >= 0){ var beginFunction = function(){ playListItem.unbind('begin', beginFunction); setMediaLabel(index); }; var setMediaLabel = function(index){ var media = playListItem.get('media'); var text = media.get('data'); if(!text) text = media.get('label'); setHtml(text); }; var setHtml = function(text){ if(text !== undefined) { htmlText.set('html', '<div style=\"text-align:left\"><SPAN STYLE=\"color:#FFFFFF;font-size:12px;font-family:Verdana\"><span color=\"white\" font-family=\"Verdana\" font-size=\"12px\">' + text + '</SPAN></div>'); } else { htmlText.set('html', ''); } }; var playListItem = playList.get('items')[index]; if(htmlText.get('html')){ setHtml('Loading...'); playListItem.bind('begin', beginFunction); } else{ setMediaLabel(index); } } }; var disposeFunction = function(){ htmlText.set('html', undefined); playList.unbind('change', changeFunction, this); playListItemStopToDispose.unbind('stop', disposeFunction, this); }; if(playListItemStopToDispose){ playListItemStopToDispose.bind('stop', disposeFunction, this); } playList.bind('change', changeFunction, this); changeFunction(); },
  "getCurrentPlayers": function(){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); return players; },
  "getComponentByName": function(name){  var list = this.getByClassName('UIComponent'); for(var i = 0, count = list.length; i<count; ++i){ var component = list[i]; var data = component.get('data'); if(data != undefined && data.name == name){ return component; } } return undefined; },
  "getMediaFromPlayer": function(player){  switch(player.get('class')){ case 'PanoramaPlayer': return player.get('panorama') || player.get('video'); case 'VideoPlayer': case 'Video360Player': return player.get('video'); case 'PhotoAlbumPlayer': return player.get('photoAlbum'); case 'MapPlayer': return player.get('map'); } },
  "setPanoramaCameraWithCurrentSpot": function(playListItem){  var currentPlayer = this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer == undefined){ return; } var playerClass = currentPlayer.get('class'); if(playerClass != 'PanoramaPlayer' && playerClass != 'Video360Player'){ return; } var fromMedia = currentPlayer.get('panorama'); if(fromMedia == undefined) { fromMedia = currentPlayer.get('video'); } var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, fromMedia); this.startPanoramaWithCamera(panorama, newCamera); },
  "loadFromCurrentMediaPlayList": function(playList, delta){  var currentIndex = playList.get('selectedIndex'); var totalItems = playList.get('items').length; var newIndex = (currentIndex + delta) % totalItems; while(newIndex < 0){ newIndex = totalItems + newIndex; }; if(currentIndex != newIndex){ playList.set('selectedIndex', newIndex); } },
  "playGlobalAudioWhilePlay": function(playList, index, audio, endCallback){  var changeFunction = function(event){ if(event.data.previousSelectedIndex == index){ this.stopGlobalAudio(audio); if(isPanorama) { var media = playListItem.get('media'); var audios = media.get('audios'); audios.splice(audios.indexOf(audio), 1); media.set('audios', audios); } playList.unbind('change', changeFunction, this); if(endCallback) endCallback(); } }; var audios = window.currentGlobalAudios; if(audios && audio.get('id') in audios){ audio = audios[audio.get('id')]; if(audio.get('state') != 'playing'){ audio.play(); } return audio; } playList.bind('change', changeFunction, this); var playListItem = playList.get('items')[index]; var isPanorama = playListItem.get('class') == 'PanoramaPlayListItem'; if(isPanorama) { var media = playListItem.get('media'); var audios = (media.get('audios') || []).slice(); if(audio.get('class') == 'MediaAudio') { var panoramaAudio = this.rootPlayer.createInstance('PanoramaAudio'); panoramaAudio.set('autoplay', false); panoramaAudio.set('audio', audio.get('audio')); panoramaAudio.set('loop', audio.get('loop')); panoramaAudio.set('id', audio.get('id')); var stateChangeFunctions = audio.getBindings('stateChange'); for(var i = 0; i<stateChangeFunctions.length; ++i){ var f = stateChangeFunctions[i]; if(typeof f == 'string') f = new Function('event', f); panoramaAudio.bind('stateChange', f, this); } audio = panoramaAudio; } audios.push(audio); media.set('audios', audios); } return this.playGlobalAudio(audio, endCallback); },
  "isCardboardViewMode": function(){  var players = this.getByClassName('PanoramaPlayer'); return players.length > 0 && players[0].get('viewMode') == 'cardboard'; },
  "setPanoramaCameraWithSpot": function(playListItem, yaw, pitch){  var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); var initialPosition = newCamera.get('initialPosition'); initialPosition.set('yaw', yaw); initialPosition.set('pitch', pitch); this.startPanoramaWithCamera(panorama, newCamera); },
  "setMapLocation": function(panoramaPlayListItem, mapPlayer){  var resetFunction = function(){ panoramaPlayListItem.unbind('stop', resetFunction, this); player.set('mapPlayer', null); }; panoramaPlayListItem.bind('stop', resetFunction, this); var player = panoramaPlayListItem.get('player'); player.set('mapPlayer', mapPlayer); },
  "shareWhatsapp": function(url){  window.open('https://api.whatsapp.com/send/?text=' + encodeURIComponent(url), '_blank'); },
  "showPopupImage": function(image, toggleImage, customWidth, customHeight, showEffect, hideEffect, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedCallback, hideCallback){  var self = this; var closed = false; var playerClickFunction = function() { zoomImage.unbind('loaded', loadedFunction, self); hideFunction(); }; var clearAutoClose = function(){ zoomImage.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var resizeFunction = function(){ setTimeout(setCloseButtonPosition, 0); }; var loadedFunction = function(){ self.unbind('click', playerClickFunction, self); veil.set('visible', true); setCloseButtonPosition(); closeButton.set('visible', true); zoomImage.unbind('loaded', loadedFunction, this); zoomImage.bind('userInteractionStart', userInteractionStartFunction, this); zoomImage.bind('userInteractionEnd', userInteractionEndFunction, this); zoomImage.bind('resize', resizeFunction, this); timeoutID = setTimeout(timeoutFunction, 200); }; var timeoutFunction = function(){ timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ hideFunction(); }; zoomImage.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } zoomImage.bind('backgroundClick', hideFunction, this); if(toggleImage) { zoomImage.bind('click', toggleFunction, this); zoomImage.set('imageCursor', 'hand'); } closeButton.bind('click', hideFunction, this); if(loadedCallback) loadedCallback(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); closed = true; if(timeoutID) clearTimeout(timeoutID); if (timeoutUserInteractionID) clearTimeout(timeoutUserInteractionID); if(autoCloseMilliSeconds) clearAutoClose(); if(hideCallback) hideCallback(); zoomImage.set('visible', false); if(hideEffect && hideEffect.get('duration') > 0){ hideEffect.bind('end', endEffectFunction, this); } else{ zoomImage.set('image', null); } closeButton.set('visible', false); veil.set('visible', false); self.unbind('click', playerClickFunction, self); zoomImage.unbind('backgroundClick', hideFunction, this); zoomImage.unbind('userInteractionStart', userInteractionStartFunction, this); zoomImage.unbind('userInteractionEnd', userInteractionEndFunction, this, true); zoomImage.unbind('resize', resizeFunction, this); if(toggleImage) { zoomImage.unbind('click', toggleFunction, this); zoomImage.set('cursor', 'default'); } closeButton.unbind('click', hideFunction, this); self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } }; var endEffectFunction = function() { zoomImage.set('image', null); hideEffect.unbind('end', endEffectFunction, this); }; var toggleFunction = function() { zoomImage.set('image', isToggleVisible() ? image : toggleImage); }; var isToggleVisible = function() { return zoomImage.get('image') == toggleImage; }; var setCloseButtonPosition = function() { var right = zoomImage.get('actualWidth') - zoomImage.get('imageLeft') - zoomImage.get('imageWidth') + 10; var top = zoomImage.get('imageTop') + 10; if(right < 10) right = 10; if(top < 10) top = 10; closeButton.set('right', right); closeButton.set('top', top); }; var userInteractionStartFunction = function() { if(timeoutUserInteractionID){ clearTimeout(timeoutUserInteractionID); timeoutUserInteractionID = undefined; } else{ closeButton.set('visible', false); } }; var userInteractionEndFunction = function() { if(!closed){ timeoutUserInteractionID = setTimeout(userInteractionTimeoutFunction, 300); } }; var userInteractionTimeoutFunction = function() { timeoutUserInteractionID = undefined; closeButton.set('visible', true); setCloseButtonPosition(); }; this.MainViewer.set('toolTipEnabled', false); var veil = this.veilPopupPanorama; var zoomImage = this.zoomImagePopupPanorama; var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } var timeoutID = undefined; var timeoutUserInteractionID = undefined; zoomImage.bind('loaded', loadedFunction, this); setTimeout(function(){ self.bind('click', playerClickFunction, self, false); }, 0); zoomImage.set('image', image); zoomImage.set('customWidth', customWidth); zoomImage.set('customHeight', customHeight); zoomImage.set('showEffect', showEffect); zoomImage.set('hideEffect', hideEffect); zoomImage.set('visible', true); return zoomImage; },
  "cloneCamera": function(camera){  var newCamera = this.rootPlayer.createInstance(camera.get('class')); newCamera.set('id', camera.get('id') + '_copy'); newCamera.set('idleSequence', camera.get('initialSequence')); return newCamera; },
  "setMainMediaByName": function(name){  var items = this.mainPlayList.get('items'); for(var i = 0; i<items.length; ++i){ var item = items[i]; if(item.get('media').get('label') == name) { this.mainPlayList.set('selectedIndex', i); return item; } } },
  "setMediaBehaviour": function(playList, index, mediaDispatcher){  var self = this; var stateChangeFunction = function(event){ if(event.data.state == 'stopped'){ dispose.call(this, true); } }; var onBeginFunction = function() { item.unbind('begin', onBeginFunction, self); var media = item.get('media'); if(media.get('class') != 'Panorama' || (media.get('camera') != undefined && media.get('camera').get('initialSequence') != undefined)){ player.bind('stateChange', stateChangeFunction, self); } }; var changeFunction = function(){ var index = playListDispatcher.get('selectedIndex'); if(index != -1){ indexDispatcher = index; dispose.call(this, false); } }; var disposeCallback = function(){ dispose.call(this, false); }; var dispose = function(forceDispose){ if(!playListDispatcher) return; var media = item.get('media'); if((media.get('class') == 'Video360' || media.get('class') == 'Video') && media.get('loop') == true && !forceDispose) return; playList.set('selectedIndex', -1); if(panoramaSequence && panoramaSequenceIndex != -1){ if(panoramaSequence) { if(panoramaSequenceIndex > 0 && panoramaSequence.get('movements')[panoramaSequenceIndex-1].get('class') == 'TargetPanoramaCameraMovement'){ var initialPosition = camera.get('initialPosition'); var oldYaw = initialPosition.get('yaw'); var oldPitch = initialPosition.get('pitch'); var oldHfov = initialPosition.get('hfov'); var previousMovement = panoramaSequence.get('movements')[panoramaSequenceIndex-1]; initialPosition.set('yaw', previousMovement.get('targetYaw')); initialPosition.set('pitch', previousMovement.get('targetPitch')); initialPosition.set('hfov', previousMovement.get('targetHfov')); var restoreInitialPositionFunction = function(event){ initialPosition.set('yaw', oldYaw); initialPosition.set('pitch', oldPitch); initialPosition.set('hfov', oldHfov); itemDispatcher.unbind('end', restoreInitialPositionFunction, this); }; itemDispatcher.bind('end', restoreInitialPositionFunction, this); } panoramaSequence.set('movementIndex', panoramaSequenceIndex); } } if(player){ item.unbind('begin', onBeginFunction, this); player.unbind('stateChange', stateChangeFunction, this); for(var i = 0; i<buttons.length; ++i) { buttons[i].unbind('click', disposeCallback, this); } } if(sameViewerArea){ var currentMedia = this.getMediaFromPlayer(player); if(currentMedia == undefined || currentMedia == item.get('media')){ playListDispatcher.set('selectedIndex', indexDispatcher); } if(playList != playListDispatcher) playListDispatcher.unbind('change', changeFunction, this); } else{ viewerArea.set('visible', viewerVisibility); } playListDispatcher = undefined; }; var mediaDispatcherByParam = mediaDispatcher != undefined; if(!mediaDispatcher){ var currentIndex = playList.get('selectedIndex'); var currentPlayer = (currentIndex != -1) ? playList.get('items')[playList.get('selectedIndex')].get('player') : this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer) { mediaDispatcher = this.getMediaFromPlayer(currentPlayer); } } var playListDispatcher = mediaDispatcher ? this.getPlayListWithMedia(mediaDispatcher, true) : undefined; if(!playListDispatcher){ playList.set('selectedIndex', index); return; } var indexDispatcher = playListDispatcher.get('selectedIndex'); if(playList.get('selectedIndex') == index || indexDispatcher == -1){ return; } var item = playList.get('items')[index]; var itemDispatcher = playListDispatcher.get('items')[indexDispatcher]; var player = item.get('player'); var viewerArea = player.get('viewerArea'); var viewerVisibility = viewerArea.get('visible'); var sameViewerArea = viewerArea == itemDispatcher.get('player').get('viewerArea'); if(sameViewerArea){ if(playList != playListDispatcher){ playListDispatcher.set('selectedIndex', -1); playListDispatcher.bind('change', changeFunction, this); } } else{ viewerArea.set('visible', true); } var panoramaSequenceIndex = -1; var panoramaSequence = undefined; var camera = itemDispatcher.get('camera'); if(camera){ panoramaSequence = camera.get('initialSequence'); if(panoramaSequence) { panoramaSequenceIndex = panoramaSequence.get('movementIndex'); } } playList.set('selectedIndex', index); var buttons = []; var addButtons = function(property){ var value = player.get(property); if(value == undefined) return; if(Array.isArray(value)) buttons = buttons.concat(value); else buttons.push(value); }; addButtons('buttonStop'); for(var i = 0; i<buttons.length; ++i) { buttons[i].bind('click', disposeCallback, this); } if(player != itemDispatcher.get('player') || !mediaDispatcherByParam){ item.bind('begin', onBeginFunction, self); } this.executeFunctionWhenChange(playList, index, disposeCallback); },
  "getPixels": function(value){  var result = new RegExp('((\\+|\\-)?\\d+(\\.\\d*)?)(px|vw|vh|vmin|vmax)?', 'i').exec(value); if (result == undefined) { return 0; } var num = parseFloat(result[1]); var unit = result[4]; var vw = this.rootPlayer.get('actualWidth') / 100; var vh = this.rootPlayer.get('actualHeight') / 100; switch(unit) { case 'vw': return num * vw; case 'vh': return num * vh; case 'vmin': return num * Math.min(vw, vh); case 'vmax': return num * Math.max(vw, vh); default: return num; } },
  "autotriggerAtStart": function(playList, callback, once){  var onChange = function(event){ callback(); if(once == true) playList.unbind('change', onChange, this); }; playList.bind('change', onChange, this); },
  "getGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios != undefined && audio.get('id') in audios){ audio = audios[audio.get('id')]; } return audio; },
  "init": function(){  if(!Object.hasOwnProperty('values')) { Object.values = function(o){ return Object.keys(o).map(function(e) { return o[e]; }); }; } var history = this.get('data')['history']; var playListChangeFunc = function(e){ var playList = e.source; var index = playList.get('selectedIndex'); if(index < 0) return; var id = playList.get('id'); if(!history.hasOwnProperty(id)) history[id] = new HistoryData(playList); history[id].add(index); }; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i) { var playList = playLists[i]; playList.bind('change', playListChangeFunc, this); } },
  "getOverlays": function(media){  switch(media.get('class')){ case 'Panorama': var overlays = media.get('overlays').concat() || []; var frames = media.get('frames'); for(var j = 0; j<frames.length; ++j){ overlays = overlays.concat(frames[j].get('overlays') || []); } return overlays; case 'Video360': case 'Map': return media.get('overlays') || []; default: return []; } },
  "getCurrentPlayerWithMedia": function(media){  var playerClass = undefined; var mediaPropertyName = undefined; switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'panorama'; break; case 'Video360': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'video'; break; case 'PhotoAlbum': playerClass = 'PhotoAlbumPlayer'; mediaPropertyName = 'photoAlbum'; break; case 'Map': playerClass = 'MapPlayer'; mediaPropertyName = 'map'; break; case 'Video': playerClass = 'VideoPlayer'; mediaPropertyName = 'video'; break; }; if(playerClass != undefined) { var players = this.getByClassName(playerClass); for(var i = 0; i<players.length; ++i){ var player = players[i]; if(player.get(mediaPropertyName) == media) { return player; } } } else { return undefined; } },
  "pauseCurrentPlayers": function(onlyPauseCameraIfPanorama){  var players = this.getCurrentPlayers(); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('state') == 'playing') { if(onlyPauseCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.pauseCamera(); } else { player.pause(); } } else { players.splice(i, 1); } } return players; },
  "triggerOverlay": function(overlay, eventName){  if(overlay.get('areas') != undefined) { var areas = overlay.get('areas'); for(var i = 0; i<areas.length; ++i) { areas[i].trigger(eventName); } } else { overlay.trigger(eventName); } },
  "getActivePlayerWithViewer": function(viewerArea){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); players = players.concat(this.getByClassName('MapPlayer')); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('viewerArea') == viewerArea) { var playerClass = player.get('class'); if(playerClass == 'PanoramaPlayer' && (player.get('panorama') != undefined || player.get('video') != undefined)) return player; else if((playerClass == 'VideoPlayer' || playerClass == 'Video360Player') && player.get('video') != undefined) return player; else if(playerClass == 'PhotoAlbumPlayer' && player.get('photoAlbum') != undefined) return player; else if(playerClass == 'MapPlayer' && player.get('map') != undefined) return player; } } return undefined; },
  "unregisterKey": function(key){  delete window[key]; },
  "changePlayListWithSameSpot": function(playList, newIndex){  var currentIndex = playList.get('selectedIndex'); if (currentIndex >= 0 && newIndex >= 0 && currentIndex != newIndex) { var currentItem = playList.get('items')[currentIndex]; var newItem = playList.get('items')[newIndex]; var currentPlayer = currentItem.get('player'); var newPlayer = newItem.get('player'); if ((currentPlayer.get('class') == 'PanoramaPlayer' || currentPlayer.get('class') == 'Video360Player') && (newPlayer.get('class') == 'PanoramaPlayer' || newPlayer.get('class') == 'Video360Player')) { var newCamera = this.cloneCamera(newItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, currentItem.get('media')); this.startPanoramaWithCamera(newItem.get('media'), newCamera); } } },
  "showPopupPanoramaOverlay": function(popupPanoramaOverlay, closeButtonProperties, imageHD, toggleImage, toggleImageHD, autoCloseMilliSeconds, audio, stopBackgroundAudio){  var self = this; this.MainViewer.set('toolTipEnabled', false); var cardboardEnabled = this.isCardboardViewMode(); if(!cardboardEnabled) { var zoomImage = this.zoomImagePopupPanorama; var showDuration = popupPanoramaOverlay.get('showDuration'); var hideDuration = popupPanoramaOverlay.get('hideDuration'); var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); var popupMaxWidthBackup = popupPanoramaOverlay.get('popupMaxWidth'); var popupMaxHeightBackup = popupPanoramaOverlay.get('popupMaxHeight'); var showEndFunction = function() { var loadedFunction = function(){ if(!self.isCardboardViewMode()) popupPanoramaOverlay.set('visible', false); }; popupPanoramaOverlay.unbind('showEnd', showEndFunction, self); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', 1); self.showPopupImage(imageHD, toggleImageHD, popupPanoramaOverlay.get('popupMaxWidth'), popupPanoramaOverlay.get('popupMaxHeight'), null, null, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedFunction, hideFunction); }; var hideFunction = function() { var restoreShowDurationFunction = function(){ popupPanoramaOverlay.unbind('showEnd', restoreShowDurationFunction, self); popupPanoramaOverlay.set('visible', false); popupPanoramaOverlay.set('showDuration', showDuration); popupPanoramaOverlay.set('popupMaxWidth', popupMaxWidthBackup); popupPanoramaOverlay.set('popupMaxHeight', popupMaxHeightBackup); }; self.resumePlayers(playersPaused, audio == null || !stopBackgroundAudio); var currentWidth = zoomImage.get('imageWidth'); var currentHeight = zoomImage.get('imageHeight'); popupPanoramaOverlay.bind('showEnd', restoreShowDurationFunction, self, true); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', hideDuration); popupPanoramaOverlay.set('popupMaxWidth', currentWidth); popupPanoramaOverlay.set('popupMaxHeight', currentHeight); if(popupPanoramaOverlay.get('visible')) restoreShowDurationFunction(); else popupPanoramaOverlay.set('visible', true); self.MainViewer.set('toolTipEnabled', true); }; if(!imageHD){ imageHD = popupPanoramaOverlay.get('image'); } if(!toggleImageHD && toggleImage){ toggleImageHD = toggleImage; } popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); } else { var hideEndFunction = function() { self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } popupPanoramaOverlay.unbind('hideEnd', hideEndFunction, self); self.MainViewer.set('toolTipEnabled', true); }; var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } popupPanoramaOverlay.bind('hideEnd', hideEndFunction, this, true); } popupPanoramaOverlay.set('visible', true); },
  "playGlobalAudio": function(audio, endCallback){  var endFunction = function(){ audio.unbind('end', endFunction, this); this.stopGlobalAudio(audio); if(endCallback) endCallback(); }; audio = this.getGlobalAudio(audio); var audios = window.currentGlobalAudios; if(!audios){ audios = window.currentGlobalAudios = {}; } audios[audio.get('id')] = audio; if(audio.get('state') == 'playing'){ return audio; } if(!audio.get('loop')){ audio.bind('end', endFunction, this); } audio.play(); return audio; },
  "getPlayListWithMedia": function(media, onlySelected){  var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(onlySelected && playList.get('selectedIndex') == -1) continue; if(this.getPlayListItemByMedia(playList, media) != undefined) return playList; } return undefined; },
  "setMainMediaByIndex": function(index){  var item = undefined; if(index >= 0 && index < this.mainPlayList.get('items').length){ this.mainPlayList.set('selectedIndex', index); item = this.mainPlayList.get('items')[index]; } return item; },
  "visibleComponentsIfPlayerFlagEnabled": function(components, playerFlag){  var enabled = this.get(playerFlag); for(var i in components){ components[i].set('visible', enabled); } },
  "syncPlaylists": function(playLists){  var changeToMedia = function(media, playListDispatched){ for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(playList != playListDispatched){ var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ if(items[j].get('media') == media){ if(playList.get('selectedIndex') != j){ playList.set('selectedIndex', j); } break; } } } } }; var changeFunction = function(event){ var playListDispatched = event.source; var selectedIndex = playListDispatched.get('selectedIndex'); if(selectedIndex < 0) return; var media = playListDispatched.get('items')[selectedIndex].get('media'); changeToMedia(media, playListDispatched); }; var mapPlayerChangeFunction = function(event){ var panoramaMapLocation = event.source.get('panoramaMapLocation'); if(panoramaMapLocation){ var map = panoramaMapLocation.get('map'); changeToMedia(map); } }; for(var i = 0, count = playLists.length; i<count; ++i){ playLists[i].bind('change', changeFunction, this); } var mapPlayers = this.getByClassName('MapPlayer'); for(var i = 0, count = mapPlayers.length; i<count; ++i){ mapPlayers[i].bind('panoramaMapLocation_change', mapPlayerChangeFunction, this); } },
  "pauseGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; } if(audio.get('state') == 'playing') audio.pause(); },
  "showPopupPanoramaVideoOverlay": function(popupPanoramaOverlay, closeButtonProperties, stopAudios){  var self = this; var showEndFunction = function() { popupPanoramaOverlay.unbind('showEnd', showEndFunction); closeButton.bind('click', hideFunction, this); setCloseButtonPosition(); closeButton.set('visible', true); }; var endFunction = function() { if(!popupPanoramaOverlay.get('loop')) hideFunction(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); popupPanoramaOverlay.set('visible', false); closeButton.set('visible', false); closeButton.unbind('click', hideFunction, self); popupPanoramaOverlay.unbind('end', endFunction, self); popupPanoramaOverlay.unbind('hideEnd', hideFunction, self, true); self.resumePlayers(playersPaused, true); if(stopAudios) { self.resumeGlobalAudios(); } }; var setCloseButtonPosition = function() { var right = 10; var top = 10; closeButton.set('right', right); closeButton.set('top', top); }; this.MainViewer.set('toolTipEnabled', false); var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(true); if(stopAudios) { this.pauseGlobalAudios(); } popupPanoramaOverlay.bind('end', endFunction, this, true); popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); popupPanoramaOverlay.bind('hideEnd', hideFunction, this, true); popupPanoramaOverlay.set('visible', true); },
  "shareTwitter": function(url){  window.open('https://twitter.com/intent/tweet?source=webclient&url=' + url, '_blank'); },
  "setStartTimeVideoSync": function(video, player){  this.setStartTimeVideo(video, player.get('currentTime')); },
  "historyGoForward": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.forward(); } },
  "setComponentVisibility": function(component, visible, applyAt, effect, propertyEffect, ignoreClearTimeout){  var keepVisibility = this.getKey('keepVisibility_' + component.get('id')); if(keepVisibility) return; this.unregisterKey('visibility_'+component.get('id')); var changeVisibility = function(){ if(effect && propertyEffect){ component.set(propertyEffect, effect); } component.set('visible', visible); if(component.get('class') == 'ViewerArea'){ try{ if(visible) component.restart(); else if(component.get('playbackState') == 'playing') component.pause(); } catch(e){}; } }; var effectTimeoutName = 'effectTimeout_'+component.get('id'); if(!ignoreClearTimeout && window.hasOwnProperty(effectTimeoutName)){ var effectTimeout = window[effectTimeoutName]; if(effectTimeout instanceof Array){ for(var i=0; i<effectTimeout.length; i++){ clearTimeout(effectTimeout[i]) } }else{ clearTimeout(effectTimeout); } delete window[effectTimeoutName]; } else if(visible == component.get('visible') && !ignoreClearTimeout) return; if(applyAt && applyAt > 0){ var effectTimeout = setTimeout(function(){ if(window[effectTimeoutName] instanceof Array) { var arrayTimeoutVal = window[effectTimeoutName]; var index = arrayTimeoutVal.indexOf(effectTimeout); arrayTimeoutVal.splice(index, 1); if(arrayTimeoutVal.length == 0){ delete window[effectTimeoutName]; } }else{ delete window[effectTimeoutName]; } changeVisibility(); }, applyAt); if(window.hasOwnProperty(effectTimeoutName)){ window[effectTimeoutName] = [window[effectTimeoutName], effectTimeout]; }else{ window[effectTimeoutName] = effectTimeout; } } else{ changeVisibility(); } },
  "showComponentsWhileMouseOver": function(parentComponent, components, durationVisibleWhileOut){  var setVisibility = function(visible){ for(var i = 0, length = components.length; i<length; i++){ var component = components[i]; if(component.get('class') == 'HTMLText' && (component.get('html') == '' || component.get('html') == undefined)) { continue; } component.set('visible', visible); } }; if (this.rootPlayer.get('touchDevice') == true){ setVisibility(true); } else { var timeoutID = -1; var rollOverFunction = function(){ setVisibility(true); if(timeoutID >= 0) clearTimeout(timeoutID); parentComponent.unbind('rollOver', rollOverFunction, this); parentComponent.bind('rollOut', rollOutFunction, this); }; var rollOutFunction = function(){ var timeoutFunction = function(){ setVisibility(false); parentComponent.unbind('rollOver', rollOverFunction, this); }; parentComponent.unbind('rollOut', rollOutFunction, this); parentComponent.bind('rollOver', rollOverFunction, this); timeoutID = setTimeout(timeoutFunction, durationVisibleWhileOut); }; parentComponent.bind('rollOver', rollOverFunction, this); } },
  "updateVideoCues": function(playList, index){  var playListItem = playList.get('items')[index]; var video = playListItem.get('media'); if(video.get('cues').length == 0) return; var player = playListItem.get('player'); var cues = []; var changeFunction = function(){ if(playList.get('selectedIndex') != index){ video.unbind('cueChange', cueChangeFunction, this); playList.unbind('change', changeFunction, this); } }; var cueChangeFunction = function(event){ var activeCues = event.data.activeCues; for(var i = 0, count = cues.length; i<count; ++i){ var cue = cues[i]; if(activeCues.indexOf(cue) == -1 && (cue.get('startTime') > player.get('currentTime') || cue.get('endTime') < player.get('currentTime')+0.5)){ cue.trigger('end'); } } cues = activeCues; }; video.bind('cueChange', cueChangeFunction, this); playList.bind('change', changeFunction, this); },
  "setEndToItemIndex": function(playList, fromIndex, toIndex){  var endFunction = function(){ if(playList.get('selectedIndex') == fromIndex) playList.set('selectedIndex', toIndex); }; this.executeFunctionWhenChange(playList, fromIndex, endFunction); },
  "getMediaByName": function(name){  var list = this.getByClassName('Media'); for(var i = 0, count = list.length; i<count; ++i){ var media = list[i]; if((media.get('class') == 'Audio' && media.get('data').label == name) || media.get('label') == name){ return media; } } return undefined; },
  "getMediaHeight": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxH=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('height') > maxH) maxH = r.get('height'); } return maxH; }else{ return r.get('height') } default: return media.get('height'); } },
  "shareFacebook": function(url){  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank'); },
  "historyGoBack": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.back(); } },
  "setCameraSameSpotAsMedia": function(camera, media){  var player = this.getCurrentPlayerWithMedia(media); if(player != undefined) { var position = camera.get('initialPosition'); position.set('yaw', player.get('yaw')); position.set('pitch', player.get('pitch')); position.set('hfov', player.get('hfov')); } },
  "playAudioList": function(audios){  if(audios.length == 0) return; var currentAudioCount = -1; var currentAudio; var playGlobalAudioFunction = this.playGlobalAudio; var playNext = function(){ if(++currentAudioCount >= audios.length) currentAudioCount = 0; currentAudio = audios[currentAudioCount]; playGlobalAudioFunction(currentAudio, playNext); }; playNext(); },
  "stopGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; if(audio){ delete audios[audio.get('id')]; if(Object.keys(audios).length == 0){ window.currentGlobalAudios = undefined; } } } if(audio) audio.stop(); },
  "getPlayListItemByMedia": function(playList, media){  var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media) return item; } return undefined; },
  "setOverlayBehaviour": function(overlay, media, action){  var executeFunc = function() { switch(action){ case 'triggerClick': this.triggerOverlay(overlay, 'click'); break; case 'stop': case 'play': case 'pause': overlay[action](); break; case 'togglePlayPause': case 'togglePlayStop': if(overlay.get('state') == 'playing') overlay[action == 'togglePlayPause' ? 'pause' : 'stop'](); else overlay.play(); break; } if(window.overlaysDispatched == undefined) window.overlaysDispatched = {}; var id = overlay.get('id'); window.overlaysDispatched[id] = true; setTimeout(function(){ delete window.overlaysDispatched[id]; }, 2000); }; if(window.overlaysDispatched != undefined && overlay.get('id') in window.overlaysDispatched) return; var playList = this.getPlayListWithMedia(media, true); if(playList != undefined){ var item = this.getPlayListItemByMedia(playList, media); if(playList.get('items').indexOf(item) != playList.get('selectedIndex')){ var beginFunc = function(e){ item.unbind('begin', beginFunc, this); executeFunc.call(this); }; item.bind('begin', beginFunc, this); return; } } executeFunc.call(this); },
  "resumeGlobalAudios": function(caller){  if (window.pauseGlobalAudiosState == undefined || !(caller in window.pauseGlobalAudiosState)) return; var audiosPaused = window.pauseGlobalAudiosState[caller]; delete window.pauseGlobalAudiosState[caller]; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = audiosPaused.length-1; j>=0; --j) { var a = audiosPaused[j]; if(objAudios.indexOf(a) != -1) audiosPaused.splice(j, 1); } } for (var i = 0, count = audiosPaused.length; i<count; ++i) { var a = audiosPaused[i]; if (a.get('state') == 'paused') a.play(); } },
  "registerKey": function(key, value){  window[key] = value; },
  "getMediaWidth": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxW=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('width') > maxW) maxW = r.get('width'); } return maxW; }else{ return r.get('width') } default: return media.get('width'); } },
  "showPopupMedia": function(w, media, playList, popupMaxWidth, popupMaxHeight, autoCloseWhenFinished, stopAudios){  var self = this; var closeFunction = function(){ playList.set('selectedIndex', -1); self.MainViewer.set('toolTipEnabled', true); if(stopAudios) { self.resumeGlobalAudios(); } this.resumePlayers(playersPaused, !stopAudios); if(isVideo) { this.unbind('resize', resizeFunction, this); } w.unbind('close', closeFunction, this); }; var endFunction = function(){ w.hide(); }; var resizeFunction = function(){ var getWinValue = function(property){ return w.get(property) || 0; }; var parentWidth = self.get('actualWidth'); var parentHeight = self.get('actualHeight'); var mediaWidth = self.getMediaWidth(media); var mediaHeight = self.getMediaHeight(media); var popupMaxWidthNumber = parseFloat(popupMaxWidth) / 100; var popupMaxHeightNumber = parseFloat(popupMaxHeight) / 100; var windowWidth = popupMaxWidthNumber * parentWidth; var windowHeight = popupMaxHeightNumber * parentHeight; var footerHeight = getWinValue('footerHeight'); var headerHeight = getWinValue('headerHeight'); if(!headerHeight) { var closeButtonHeight = getWinValue('closeButtonIconHeight') + getWinValue('closeButtonPaddingTop') + getWinValue('closeButtonPaddingBottom'); var titleHeight = self.getPixels(getWinValue('titleFontSize')) + getWinValue('titlePaddingTop') + getWinValue('titlePaddingBottom'); headerHeight = closeButtonHeight > titleHeight ? closeButtonHeight : titleHeight; headerHeight += getWinValue('headerPaddingTop') + getWinValue('headerPaddingBottom'); } var contentWindowWidth = windowWidth - getWinValue('bodyPaddingLeft') - getWinValue('bodyPaddingRight') - getWinValue('paddingLeft') - getWinValue('paddingRight'); var contentWindowHeight = windowHeight - headerHeight - footerHeight - getWinValue('bodyPaddingTop') - getWinValue('bodyPaddingBottom') - getWinValue('paddingTop') - getWinValue('paddingBottom'); var parentAspectRatio = contentWindowWidth / contentWindowHeight; var mediaAspectRatio = mediaWidth / mediaHeight; if(parentAspectRatio > mediaAspectRatio) { windowWidth = contentWindowHeight * mediaAspectRatio + getWinValue('bodyPaddingLeft') + getWinValue('bodyPaddingRight') + getWinValue('paddingLeft') + getWinValue('paddingRight'); } else { windowHeight = contentWindowWidth / mediaAspectRatio + headerHeight + footerHeight + getWinValue('bodyPaddingTop') + getWinValue('bodyPaddingBottom') + getWinValue('paddingTop') + getWinValue('paddingBottom'); } if(windowWidth > parentWidth * popupMaxWidthNumber) { windowWidth = parentWidth * popupMaxWidthNumber; } if(windowHeight > parentHeight * popupMaxHeightNumber) { windowHeight = parentHeight * popupMaxHeightNumber; } w.set('width', windowWidth); w.set('height', windowHeight); w.set('x', (parentWidth - getWinValue('actualWidth')) * 0.5); w.set('y', (parentHeight - getWinValue('actualHeight')) * 0.5); }; if(autoCloseWhenFinished){ this.executeFunctionWhenChange(playList, 0, endFunction); } var mediaClass = media.get('class'); var isVideo = mediaClass == 'Video' || mediaClass == 'Video360'; playList.set('selectedIndex', 0); if(isVideo){ this.bind('resize', resizeFunction, this); resizeFunction(); playList.get('items')[0].get('player').play(); } else { w.set('width', popupMaxWidth); w.set('height', popupMaxHeight); } this.MainViewer.set('toolTipEnabled', false); if(stopAudios) { this.pauseGlobalAudios(); } var playersPaused = this.pauseCurrentPlayers(!stopAudios); w.bind('close', closeFunction, this); w.show(this, true); },
  "resumePlayers": function(players, onlyResumeCameraIfPanorama){  for(var i = 0; i<players.length; ++i){ var player = players[i]; if(onlyResumeCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.resumeCamera(); } else{ player.play(); } } },
  "changeBackgroundWhilePlay": function(playList, index, color){  var stopFunction = function(event){ playListItem.unbind('stop', stopFunction, this); if((color == viewerArea.get('backgroundColor')) && (colorRatios == viewerArea.get('backgroundColorRatios'))){ viewerArea.set('backgroundColor', backgroundColorBackup); viewerArea.set('backgroundColorRatios', backgroundColorRatiosBackup); } }; var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var viewerArea = player.get('viewerArea'); var backgroundColorBackup = viewerArea.get('backgroundColor'); var backgroundColorRatiosBackup = viewerArea.get('backgroundColorRatios'); var colorRatios = [0]; if((color != backgroundColorBackup) || (colorRatios != backgroundColorRatiosBackup)){ viewerArea.set('backgroundColor', color); viewerArea.set('backgroundColorRatios', colorRatios); playListItem.bind('stop', stopFunction, this); } },
  "showWindow": function(w, autoCloseMilliSeconds, containsAudio){  if(w.get('visible') == true){ return; } var closeFunction = function(){ clearAutoClose(); this.resumePlayers(playersPaused, !containsAudio); w.unbind('close', closeFunction, this); }; var clearAutoClose = function(){ w.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ w.hide(); }; w.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } var playersPaused = this.pauseCurrentPlayers(!containsAudio); w.bind('close', closeFunction, this); w.show(this, true); },
  "stopAndGoCamera": function(camera, ms){  var sequence = camera.get('initialSequence'); sequence.pause(); var timeoutFunction = function(){ sequence.play(); }; setTimeout(timeoutFunction, ms); },
  "loopAlbum": function(playList, index){  var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var loopFunction = function(){ player.play(); }; this.executeFunctionWhenChange(playList, index, loopFunction); },
  "openLink": function(url, name){  if(url == location.href) { return; } var isElectron = (window && window.process && window.process.versions && window.process.versions['electron']) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0); if (name == '_blank' && isElectron) { if (url.startsWith('/')) { var r = window.location.href.split('/'); r.pop(); url = r.join('/') + url; } var extension = url.split('.').pop().toLowerCase(); if(extension != 'pdf' || url.startsWith('file://')) { var shell = window.require('electron').shell; shell.openExternal(url); } else { window.open(url, name); } } else if(isElectron && (name == '_top' || name == '_self')) { window.location = url; } else { var newWindow = window.open(url, name); newWindow.focus(); } },
  "getKey": function(key){  return window[key]; }
 },
 "minHeight": 20,
 "paddingBottom": 0,
 "downloadEnabled": false,
 "definitions": [{
 "automaticZoomSpeed": 0,
 "id": "camera_5A1E5227_4A4F_DA6D_41D1_0EF26068F5CF",
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": 132.87,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "manualZoomSpeed": 0
},
{
 "automaticZoomSpeed": 0,
 "id": "panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E_camera",
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "manualZoomSpeed": 0
},
{
 "thumbnailUrl": "media/panorama_441B344E_49A2_1C8E_41C2_CED6F1B0DE75_t.jpg",
 "overlays": [
  "this.overlay_5CEB232A_4A66_34B1_41CA_ACC95AEB2F59",
  "this.overlay_5F87ABD1_4A66_6B93_41A0_B99B95052B1A",
  "this.overlay_5F20CDED_4A66_2FB2_41C5_837A5591A984"
 ],
 "label": "living 2",
 "id": "panorama_441B344E_49A2_1C8E_41C2_CED6F1B0DE75",
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E",
   "class": "AdjacentPanorama"
  },
  {
   "yaw": 81.32,
   "backwardYaw": 6.49,
   "panorama": "this.panorama_4426B37D_49A2_1493_41CC_4DF2476A6313",
   "class": "AdjacentPanorama",
   "distance": 1
  },
  {
   "panorama": "this.panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7",
   "class": "AdjacentPanorama"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "partial": false,
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_441B344E_49A2_1C8E_41C2_CED6F1B0DE75_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_441B344E_49A2_1C8E_41C2_CED6F1B0DE75_0/f/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_441B344E_49A2_1C8E_41C2_CED6F1B0DE75_0/f/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_441B344E_49A2_1C8E_41C2_CED6F1B0DE75_0/f/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_441B344E_49A2_1C8E_41C2_CED6F1B0DE75_0/f/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_441B344E_49A2_1C8E_41C2_CED6F1B0DE75_0/f/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_441B344E_49A2_1C8E_41C2_CED6F1B0DE75_0/u/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_441B344E_49A2_1C8E_41C2_CED6F1B0DE75_0/u/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_441B344E_49A2_1C8E_41C2_CED6F1B0DE75_0/u/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_441B344E_49A2_1C8E_41C2_CED6F1B0DE75_0/u/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_441B344E_49A2_1C8E_41C2_CED6F1B0DE75_0/u/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_441B344E_49A2_1C8E_41C2_CED6F1B0DE75_0/b/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_441B344E_49A2_1C8E_41C2_CED6F1B0DE75_0/b/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_441B344E_49A2_1C8E_41C2_CED6F1B0DE75_0/b/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_441B344E_49A2_1C8E_41C2_CED6F1B0DE75_0/b/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_441B344E_49A2_1C8E_41C2_CED6F1B0DE75_0/b/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_441B344E_49A2_1C8E_41C2_CED6F1B0DE75_0/d/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_441B344E_49A2_1C8E_41C2_CED6F1B0DE75_0/d/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_441B344E_49A2_1C8E_41C2_CED6F1B0DE75_0/d/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_441B344E_49A2_1C8E_41C2_CED6F1B0DE75_0/d/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_441B344E_49A2_1C8E_41C2_CED6F1B0DE75_0/d/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_441B344E_49A2_1C8E_41C2_CED6F1B0DE75_0/l/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_441B344E_49A2_1C8E_41C2_CED6F1B0DE75_0/l/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_441B344E_49A2_1C8E_41C2_CED6F1B0DE75_0/l/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_441B344E_49A2_1C8E_41C2_CED6F1B0DE75_0/l/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_441B344E_49A2_1C8E_41C2_CED6F1B0DE75_0/l/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_441B344E_49A2_1C8E_41C2_CED6F1B0DE75_0/r/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_441B344E_49A2_1C8E_41C2_CED6F1B0DE75_0/r/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_441B344E_49A2_1C8E_41C2_CED6F1B0DE75_0/r/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_441B344E_49A2_1C8E_41C2_CED6F1B0DE75_0/r/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_441B344E_49A2_1C8E_41C2_CED6F1B0DE75_0/r/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "class": "Panorama",
 "vfov": 180
},
{
 "automaticZoomSpeed": 0,
 "id": "camera_5A59F1E8_4A4F_D9E3_41AC_97111D338FB5",
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "hfov": 120,
  "yaw": 88.75,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "manualZoomSpeed": 0
},
{
 "automaticZoomSpeed": 0,
 "id": "camera_5AF1A2A4_4A4F_DA63_41CA_64097BA9725A",
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "hfov": 120,
  "yaw": 47.04,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "manualZoomSpeed": 0
},
{
 "automaticZoomSpeed": 0,
 "id": "camera_5AC78294_4A4F_DA23_41C5_600699C01327",
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": 165.48,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "manualZoomSpeed": 0
},
{
 "automaticZoomSpeed": 0,
 "id": "camera_5A718207_4A4F_DA2D_41B7_B7EF17B15838",
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": -34.49,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "manualZoomSpeed": 0
},
{
 "thumbnailUrl": "media/panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E_t.jpg",
 "overlays": [
  "this.overlay_5FAA6290_4A66_1592_41C1_2F611E5A269B",
  "this.overlay_5F41B3B2_4A66_1B96_41C9_FA18819E067A",
  "this.overlay_5E2422E1_4A66_75B3_41B0_1E085DE16D50",
  "this.overlay_44F5D5B0_4A4A_7E63_417D_8C42D380A690",
  "this.overlay_4556F770_4A49_BAE3_41BE_3E47ABCC5DA7"
 ],
 "adjacentPanoramas": [
  {
   "yaw": 91.55,
   "backwardYaw": -14.52,
   "panorama": "this.panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315",
   "class": "AdjacentPanorama",
   "distance": 1
  },
  {
   "yaw": 155.26,
   "backwardYaw": -132.96,
   "panorama": "this.panorama_4426B37D_49A2_1493_41CC_4DF2476A6313",
   "class": "AdjacentPanorama",
   "distance": 1
  },
  {
   "yaw": 145.51,
   "backwardYaw": 49.05,
   "panorama": "this.panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7",
   "class": "AdjacentPanorama",
   "distance": 1
  },
  {
   "yaw": -144.01,
   "backwardYaw": 120.52,
   "panorama": "this.panorama_4415303D_49A6_7492_41CA_7894FE9285EF",
   "class": "AdjacentPanorama",
   "distance": 1
  },
  {
   "yaw": -116.01,
   "backwardYaw": -112.1,
   "panorama": "this.panorama_4423A38F_49A6_7B8E_41BE_733AE6F66BB3",
   "class": "AdjacentPanorama",
   "distance": 1
  }
 ],
 "label": "prayer room",
 "hfovMax": 130,
 "id": "panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E",
 "partial": false,
 "hfov": 360,
 "class": "Panorama",
 "frames": [
  {
   "thumbnailUrl": "media/panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E_0/f/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E_0/f/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E_0/f/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E_0/f/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E_0/f/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E_0/u/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E_0/u/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E_0/u/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E_0/u/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E_0/u/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E_0/b/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E_0/b/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E_0/b/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E_0/b/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E_0/b/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E_0/d/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E_0/d/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E_0/d/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E_0/d/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E_0/d/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E_0/l/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E_0/l/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E_0/l/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E_0/l/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E_0/l/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E_0/r/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E_0/r/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E_0/r/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E_0/r/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E_0/r/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "vfov": 180,
 "pitch": 0
},
{
 "automaticZoomSpeed": 0,
 "id": "camera_5A40C1F8_4A4F_D9E3_41D1_A0CF36D69E64",
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "hfov": 120,
  "yaw": -98.68,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "manualZoomSpeed": 0
},
{
 "automaticZoomSpeed": 0,
 "id": "camera_5A6DA217_4A4F_DA2D_41D0_F839A18EC0D1",
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "hfov": 120,
  "yaw": 130.04,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "manualZoomSpeed": 0
},
{
 "automaticZoomSpeed": 0,
 "id": "camera_5A098236_4A4F_DA6F_41C8_97AE9B8B1908",
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "hfov": 120,
  "yaw": 47.72,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "manualZoomSpeed": 0
},
{
 "automaticZoomSpeed": 0,
 "id": "camera_5AE162B3_4A4F_DA65_417D_CB3318582B71",
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "hfov": 120,
  "yaw": -130.95,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "manualZoomSpeed": 0
},
{
 "thumbnailUrl": "media/panorama_4423A38F_49A6_7B8E_41BE_733AE6F66BB3_t.jpg",
 "overlays": [
  "this.overlay_5F7021E8_4A66_17B1_41D0_070E55AA3091",
  "this.overlay_5F0AC08A_4A66_1471_41AA_AA634B00A040"
 ],
 "adjacentPanoramas": [
  {
   "yaw": -112.1,
   "backwardYaw": -116.01,
   "panorama": "this.panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E",
   "class": "AdjacentPanorama",
   "distance": 1
  },
  {
   "yaw": -88.49,
   "backwardYaw": -19.04,
   "panorama": "this.panorama_4415303D_49A6_7492_41CA_7894FE9285EF",
   "class": "AdjacentPanorama",
   "distance": 1
  }
 ],
 "label": "kitchen 2",
 "hfovMax": 130,
 "id": "panorama_4423A38F_49A6_7B8E_41BE_733AE6F66BB3",
 "partial": false,
 "hfov": 360,
 "class": "Panorama",
 "frames": [
  {
   "thumbnailUrl": "media/panorama_4423A38F_49A6_7B8E_41BE_733AE6F66BB3_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_4423A38F_49A6_7B8E_41BE_733AE6F66BB3_0/f/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_4423A38F_49A6_7B8E_41BE_733AE6F66BB3_0/f/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_4423A38F_49A6_7B8E_41BE_733AE6F66BB3_0/f/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_4423A38F_49A6_7B8E_41BE_733AE6F66BB3_0/f/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_4423A38F_49A6_7B8E_41BE_733AE6F66BB3_0/f/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_4423A38F_49A6_7B8E_41BE_733AE6F66BB3_0/u/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_4423A38F_49A6_7B8E_41BE_733AE6F66BB3_0/u/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_4423A38F_49A6_7B8E_41BE_733AE6F66BB3_0/u/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_4423A38F_49A6_7B8E_41BE_733AE6F66BB3_0/u/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_4423A38F_49A6_7B8E_41BE_733AE6F66BB3_0/u/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_4423A38F_49A6_7B8E_41BE_733AE6F66BB3_0/b/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_4423A38F_49A6_7B8E_41BE_733AE6F66BB3_0/b/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_4423A38F_49A6_7B8E_41BE_733AE6F66BB3_0/b/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_4423A38F_49A6_7B8E_41BE_733AE6F66BB3_0/b/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_4423A38F_49A6_7B8E_41BE_733AE6F66BB3_0/b/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_4423A38F_49A6_7B8E_41BE_733AE6F66BB3_0/d/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_4423A38F_49A6_7B8E_41BE_733AE6F66BB3_0/d/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_4423A38F_49A6_7B8E_41BE_733AE6F66BB3_0/d/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_4423A38F_49A6_7B8E_41BE_733AE6F66BB3_0/d/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_4423A38F_49A6_7B8E_41BE_733AE6F66BB3_0/d/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_4423A38F_49A6_7B8E_41BE_733AE6F66BB3_0/l/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_4423A38F_49A6_7B8E_41BE_733AE6F66BB3_0/l/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_4423A38F_49A6_7B8E_41BE_733AE6F66BB3_0/l/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_4423A38F_49A6_7B8E_41BE_733AE6F66BB3_0/l/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_4423A38F_49A6_7B8E_41BE_733AE6F66BB3_0/l/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_4423A38F_49A6_7B8E_41BE_733AE6F66BB3_0/r/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_4423A38F_49A6_7B8E_41BE_733AE6F66BB3_0/r/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_4423A38F_49A6_7B8E_41BE_733AE6F66BB3_0/r/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_4423A38F_49A6_7B8E_41BE_733AE6F66BB3_0/r/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_4423A38F_49A6_7B8E_41BE_733AE6F66BB3_0/r/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "vfov": 180,
 "pitch": 0
},
{
 "automaticZoomSpeed": 0,
 "id": "camera_5B58C330_4A4F_DA63_41C9_AA40CA1352C4",
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "hfov": 120,
  "yaw": -173.51,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "manualZoomSpeed": 0
},
{
 "automaticZoomSpeed": 0,
 "id": "camera_45A9C1D9_4A4F_D625_41B0_0C744B9A09BC",
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "hfov": 120,
  "yaw": -58.8,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "manualZoomSpeed": 0
},
{
 "automaticZoomSpeed": 0,
 "id": "camera_5AD68275_4A4F_DAED_41D0_F5D0948BC893",
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": 91.51,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "manualZoomSpeed": 0
},
{
 "automaticZoomSpeed": 0,
 "id": "camera_5A8D7301_4A4F_DA25_41CA_D2BE72235E47",
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": -88.45,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "manualZoomSpeed": 0
},
{
 "automaticZoomSpeed": 0,
 "id": "camera_5A9352D3_4A4F_DA26_41AD_3B80F908C8C4",
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": -59.48,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "manualZoomSpeed": 0
},
{
 "thumbnailUrl": "media/panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315_t.jpg",
 "overlays": [
  "this.overlay_5F06B95A_4A7E_1491_41CF_02009B7D951E",
  "this.overlay_5EB3AAF9_4A7E_1593_41C8_1B35CEC2E240",
  "this.overlay_5EE20BFC_4A7E_2B92_4194_008DA47ABE8C",
  "this.overlay_5E479D7B_4AA2_2C97_41BE_96B0CFCACED4"
 ],
 "adjacentPanoramas": [
  {
   "yaw": -14.52,
   "backwardYaw": 91.55,
   "panorama": "this.panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E",
   "class": "AdjacentPanorama",
   "distance": 1
  },
  {
   "yaw": 155.95,
   "backwardYaw": -30.33,
   "panorama": "this.panorama_443358C1_49A2_15F2_41C7_54C799483365",
   "class": "AdjacentPanorama",
   "distance": 1
  },
  {
   "panorama": "this.panorama_4426B37D_49A2_1493_41CC_4DF2476A6313",
   "class": "AdjacentPanorama"
  },
  {
   "yaw": -47.13,
   "backwardYaw": 113.62,
   "panorama": "this.panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7",
   "class": "AdjacentPanorama",
   "distance": 1
  }
 ],
 "label": "sitout 2",
 "hfovMax": 130,
 "id": "panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315",
 "partial": false,
 "hfov": 360,
 "class": "Panorama",
 "frames": [
  {
   "thumbnailUrl": "media/panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315_0/f/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315_0/f/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315_0/f/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315_0/f/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315_0/f/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315_0/u/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315_0/u/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315_0/u/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315_0/u/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315_0/u/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315_0/b/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315_0/b/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315_0/b/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315_0/b/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315_0/b/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315_0/d/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315_0/d/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315_0/d/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315_0/d/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315_0/d/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315_0/l/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315_0/l/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315_0/l/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315_0/l/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315_0/l/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315_0/r/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315_0/r/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315_0/r/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315_0/r/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315_0/r/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "vfov": 180,
 "pitch": 0
},
{
 "automaticZoomSpeed": 0,
 "id": "camera_5AAEE321_4A4F_DA65_41C5_B74351D4ECEC",
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "hfov": 120,
  "yaw": -66.38,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "manualZoomSpeed": 0
},
{
 "automaticZoomSpeed": 0,
 "id": "camera_45A001C9_4A4F_D625_41C7_C4AC4FCF2928",
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": -24.05,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "manualZoomSpeed": 0
},
{
 "automaticZoomSpeed": 0,
 "id": "camera_5A52A1D9_4A4F_D625_41C1_97C32DDDFF91",
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": -24.74,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "manualZoomSpeed": 0
},
{
 "automaticZoomSpeed": 0,
 "id": "camera_5ABD2311_4A4F_DA25_41C1_65988134D116",
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "hfov": 120,
  "yaw": 149.67,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "manualZoomSpeed": 0
},
{
 "automaticZoomSpeed": 0,
 "id": "camera_5A8322F2_4A4F_DBE7_41CE_CDB3389CFD5A",
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": 67.9,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "manualZoomSpeed": 0
},
{
 "automaticZoomSpeed": 0,
 "id": "panorama_4426B37D_49A2_1493_41CC_4DF2476A6313_camera",
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "hfov": 120,
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "manualZoomSpeed": 0
},
{
 "gyroscopeVerticalDraggingEnabled": true,
 "buttonCardboardView": "this.IconButton_466CA349_4A3F_DA25_41B1_B8E0417A7CEA",
 "viewerArea": "this.MainViewer",
 "class": "PanoramaPlayer",
 "displayPlaybackBar": true,
 "id": "MainViewerPanoramaPlayer",
 "touchControlMode": "drag_rotation",
 "mouseControlMode": "drag_acceleration"
},
{
 "automaticZoomSpeed": 0,
 "id": "panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315_camera",
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "manualZoomSpeed": 0
},
{
 "automaticZoomSpeed": 0,
 "id": "camera_5B793340_4A4F_DA23_41D0_44661FB97A8B",
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": 160.96,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "manualZoomSpeed": 0
},
{
 "thumbnailUrl": "media/panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7_t.jpg",
 "overlays": [
  "this.overlay_5F3F15BF_4A62_3F8E_41CE_5D42D3F0BAA7",
  "this.overlay_5EBC83F4_4A63_FB91_41CA_F4087B503E22",
  "this.overlay_5FEF77F2_4A62_3B91_41D0_2E5EC67E40A1",
  "this.overlay_5F25DA1E_4A62_7491_41BE_13C1BA4F1E62"
 ],
 "label": "dining",
 "id": "panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7",
 "adjacentPanoramas": [
  {
   "yaw": 49.05,
   "backwardYaw": 145.51,
   "panorama": "this.panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E",
   "class": "AdjacentPanorama",
   "distance": 1
  },
  {
   "yaw": 121.2,
   "backwardYaw": -49.96,
   "panorama": "this.panorama_443358C1_49A2_15F2_41C7_54C799483365",
   "class": "AdjacentPanorama",
   "distance": 1
  },
  {
   "yaw": 121.2,
   "backwardYaw": -49.96,
   "panorama": "this.panorama_443358C1_49A2_15F2_41C7_54C799483365",
   "class": "AdjacentPanorama",
   "distance": 1
  },
  {
   "yaw": 113.62,
   "backwardYaw": -47.13,
   "panorama": "this.panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315",
   "class": "AdjacentPanorama",
   "distance": 1
  },
  {
   "yaw": -91.25,
   "backwardYaw": -132.28,
   "panorama": "this.panorama_4426B37D_49A2_1493_41CC_4DF2476A6313",
   "class": "AdjacentPanorama",
   "distance": 1
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "partial": false,
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7_0/f/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7_0/f/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7_0/f/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7_0/f/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7_0/f/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7_0/u/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7_0/u/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7_0/u/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7_0/u/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7_0/u/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7_0/b/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7_0/b/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7_0/b/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7_0/b/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7_0/b/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7_0/d/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7_0/d/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7_0/d/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7_0/d/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7_0/d/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7_0/l/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7_0/l/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7_0/l/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7_0/l/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7_0/l/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7_0/r/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7_0/r/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7_0/r/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7_0/r/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7_0/r/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "class": "Panorama",
 "vfov": 180
},
{
 "automaticZoomSpeed": 0,
 "id": "panorama_441B344E_49A2_1C8E_41C2_CED6F1B0DE75_camera",
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "hfov": 120,
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "manualZoomSpeed": 0
},
{
 "automaticZoomSpeed": 0,
 "id": "camera_5A3A8246_4A4F_DA2F_41AF_41C9F4E3129F",
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": 35.99,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "manualZoomSpeed": 0
},
{
 "automaticZoomSpeed": 0,
 "id": "panorama_4423A38F_49A6_7B8E_41BE_733AE6F66BB3_camera",
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "manualZoomSpeed": 0
},
{
 "items": [
  {
   "media": "this.panorama_443358C1_49A2_15F2_41C7_54C799483365",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_443358C1_49A2_15F2_41C7_54C799483365_camera"
  },
  {
   "media": "this.panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315_camera"
  },
  {
   "media": "this.panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7_camera"
  },
  {
   "media": "this.panorama_4426B37D_49A2_1493_41CC_4DF2476A6313",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_4426B37D_49A2_1493_41CC_4DF2476A6313_camera"
  },
  {
   "media": "this.panorama_441B344E_49A2_1C8E_41C2_CED6F1B0DE75",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 4, 5)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_441B344E_49A2_1C8E_41C2_CED6F1B0DE75_camera"
  },
  {
   "media": "this.panorama_4415303D_49A6_7492_41CA_7894FE9285EF",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 5, 6)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_4415303D_49A6_7492_41CA_7894FE9285EF_camera"
  },
  {
   "media": "this.panorama_4423A38F_49A6_7B8E_41BE_733AE6F66BB3",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 6, 7)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_4423A38F_49A6_7B8E_41BE_733AE6F66BB3_camera"
  },
  {
   "media": "this.panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E",
   "end": "this.trigger('tourEnded')",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 7, 0)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E_camera"
  }
 ],
 "id": "mainPlayList",
 "class": "PlayList"
},
{
 "automaticZoomSpeed": 0,
 "id": "panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7_camera",
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "hfov": 120,
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "manualZoomSpeed": 0
},
{
 "thumbnailUrl": "media/panorama_4426B37D_49A2_1493_41CC_4DF2476A6313_t.jpg",
 "overlays": [
  "this.overlay_5EA179FB_4A62_3797_41A0_DC74BD650A61",
  "this.overlay_5FA18CE1_4A62_6DB2_4179_977D3D3553AD",
  "this.overlay_45551A1D_4A4E_4A5D_41BE_FE2146F9416F"
 ],
 "label": "living 1",
 "id": "panorama_4426B37D_49A2_1493_41CC_4DF2476A6313",
 "adjacentPanoramas": [
  {
   "yaw": -132.96,
   "backwardYaw": 155.26,
   "panorama": "this.panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E",
   "class": "AdjacentPanorama",
   "distance": 1
  },
  {
   "yaw": -132.28,
   "backwardYaw": -91.25,
   "panorama": "this.panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7",
   "class": "AdjacentPanorama",
   "distance": 1
  },
  {
   "yaw": 6.49,
   "backwardYaw": 81.32,
   "panorama": "this.panorama_441B344E_49A2_1C8E_41C2_CED6F1B0DE75",
   "class": "AdjacentPanorama",
   "distance": 1
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "partial": false,
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_4426B37D_49A2_1493_41CC_4DF2476A6313_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_4426B37D_49A2_1493_41CC_4DF2476A6313_0/f/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_4426B37D_49A2_1493_41CC_4DF2476A6313_0/f/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_4426B37D_49A2_1493_41CC_4DF2476A6313_0/f/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_4426B37D_49A2_1493_41CC_4DF2476A6313_0/f/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_4426B37D_49A2_1493_41CC_4DF2476A6313_0/f/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_4426B37D_49A2_1493_41CC_4DF2476A6313_0/u/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_4426B37D_49A2_1493_41CC_4DF2476A6313_0/u/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_4426B37D_49A2_1493_41CC_4DF2476A6313_0/u/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_4426B37D_49A2_1493_41CC_4DF2476A6313_0/u/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_4426B37D_49A2_1493_41CC_4DF2476A6313_0/u/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_4426B37D_49A2_1493_41CC_4DF2476A6313_0/b/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_4426B37D_49A2_1493_41CC_4DF2476A6313_0/b/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_4426B37D_49A2_1493_41CC_4DF2476A6313_0/b/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_4426B37D_49A2_1493_41CC_4DF2476A6313_0/b/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_4426B37D_49A2_1493_41CC_4DF2476A6313_0/b/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_4426B37D_49A2_1493_41CC_4DF2476A6313_0/d/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_4426B37D_49A2_1493_41CC_4DF2476A6313_0/d/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_4426B37D_49A2_1493_41CC_4DF2476A6313_0/d/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_4426B37D_49A2_1493_41CC_4DF2476A6313_0/d/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_4426B37D_49A2_1493_41CC_4DF2476A6313_0/d/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_4426B37D_49A2_1493_41CC_4DF2476A6313_0/l/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_4426B37D_49A2_1493_41CC_4DF2476A6313_0/l/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_4426B37D_49A2_1493_41CC_4DF2476A6313_0/l/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_4426B37D_49A2_1493_41CC_4DF2476A6313_0/l/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_4426B37D_49A2_1493_41CC_4DF2476A6313_0/l/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_4426B37D_49A2_1493_41CC_4DF2476A6313_0/r/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_4426B37D_49A2_1493_41CC_4DF2476A6313_0/r/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_4426B37D_49A2_1493_41CC_4DF2476A6313_0/r/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_4426B37D_49A2_1493_41CC_4DF2476A6313_0/r/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_4426B37D_49A2_1493_41CC_4DF2476A6313_0/r/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "class": "Panorama",
 "vfov": 180
},
{
 "thumbnailUrl": "media/panorama_443358C1_49A2_15F2_41C7_54C799483365_t.jpg",
 "overlays": [
  "this.overlay_59B2FB1B_4A62_1496_41B0_A12B49B650CC",
  "this.overlay_59F4C98E_4A62_178E_41CE_46777204CA54"
 ],
 "label": "sitout",
 "id": "panorama_443358C1_49A2_15F2_41C7_54C799483365",
 "adjacentPanoramas": [
  {
   "yaw": -30.33,
   "backwardYaw": 155.95,
   "panorama": "this.panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315",
   "class": "AdjacentPanorama",
   "distance": 1
  },
  {
   "yaw": -49.96,
   "backwardYaw": 121.2,
   "panorama": "this.panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7",
   "class": "AdjacentPanorama",
   "distance": 1
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "partial": false,
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_443358C1_49A2_15F2_41C7_54C799483365_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_443358C1_49A2_15F2_41C7_54C799483365_0/f/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_443358C1_49A2_15F2_41C7_54C799483365_0/f/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_443358C1_49A2_15F2_41C7_54C799483365_0/f/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_443358C1_49A2_15F2_41C7_54C799483365_0/f/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_443358C1_49A2_15F2_41C7_54C799483365_0/f/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_443358C1_49A2_15F2_41C7_54C799483365_0/u/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_443358C1_49A2_15F2_41C7_54C799483365_0/u/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_443358C1_49A2_15F2_41C7_54C799483365_0/u/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_443358C1_49A2_15F2_41C7_54C799483365_0/u/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_443358C1_49A2_15F2_41C7_54C799483365_0/u/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_443358C1_49A2_15F2_41C7_54C799483365_0/b/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_443358C1_49A2_15F2_41C7_54C799483365_0/b/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_443358C1_49A2_15F2_41C7_54C799483365_0/b/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_443358C1_49A2_15F2_41C7_54C799483365_0/b/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_443358C1_49A2_15F2_41C7_54C799483365_0/b/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_443358C1_49A2_15F2_41C7_54C799483365_0/d/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_443358C1_49A2_15F2_41C7_54C799483365_0/d/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_443358C1_49A2_15F2_41C7_54C799483365_0/d/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_443358C1_49A2_15F2_41C7_54C799483365_0/d/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_443358C1_49A2_15F2_41C7_54C799483365_0/d/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_443358C1_49A2_15F2_41C7_54C799483365_0/l/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_443358C1_49A2_15F2_41C7_54C799483365_0/l/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_443358C1_49A2_15F2_41C7_54C799483365_0/l/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_443358C1_49A2_15F2_41C7_54C799483365_0/l/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_443358C1_49A2_15F2_41C7_54C799483365_0/l/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_443358C1_49A2_15F2_41C7_54C799483365_0/r/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_443358C1_49A2_15F2_41C7_54C799483365_0/r/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_443358C1_49A2_15F2_41C7_54C799483365_0/r/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_443358C1_49A2_15F2_41C7_54C799483365_0/r/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_443358C1_49A2_15F2_41C7_54C799483365_0/r/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "class": "Panorama",
 "vfov": 180
},
{
 "automaticZoomSpeed": 0,
 "id": "camera_5B488330_4A4F_DA63_41B3_C75954DDB3A9",
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": 63.99,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "manualZoomSpeed": 0
},
{
 "automaticZoomSpeed": 0,
 "id": "camera_5A259256_4A4F_DA2F_41CB_ABFA6520704E",
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": 91.51,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "manualZoomSpeed": 0
},
{
 "automaticZoomSpeed": 0,
 "id": "camera_5A625217_4A4F_DA2D_41C8_5FB7BBA38AD7",
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "hfov": 120,
  "yaw": 130.04,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "manualZoomSpeed": 0
},
{
 "thumbnailUrl": "media/panorama_4415303D_49A6_7492_41CA_7894FE9285EF_t.jpg",
 "overlays": [
  "this.overlay_5E9685AF_4A62_1F8F_41B6_BD58E5609553",
  "this.overlay_5E95CCED_4A63_EDB2_41C3_02151390D420",
  "this.overlay_5E1EAE23_4A62_6CB7_41CA_AB9468CC38DA",
  "this.overlay_5E902C12_4A62_EC96_4140_8EF79839D2BE"
 ],
 "adjacentPanoramas": [
  {
   "yaw": 120.52,
   "backwardYaw": -144.01,
   "panorama": "this.panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E",
   "class": "AdjacentPanorama",
   "distance": 1
  },
  {
   "panorama": "this.panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_4426B37D_49A2_1493_41CC_4DF2476A6313",
   "class": "AdjacentPanorama"
  },
  {
   "yaw": -19.04,
   "backwardYaw": -88.49,
   "panorama": "this.panorama_4423A38F_49A6_7B8E_41BE_733AE6F66BB3",
   "class": "AdjacentPanorama",
   "distance": 1
  },
  {
   "yaw": -19.04,
   "backwardYaw": -88.49,
   "panorama": "this.panorama_4423A38F_49A6_7B8E_41BE_733AE6F66BB3",
   "class": "AdjacentPanorama",
   "distance": 1
  }
 ],
 "label": "kitchen 1",
 "hfovMax": 130,
 "id": "panorama_4415303D_49A6_7492_41CA_7894FE9285EF",
 "partial": false,
 "hfov": 360,
 "class": "Panorama",
 "frames": [
  {
   "thumbnailUrl": "media/panorama_4415303D_49A6_7492_41CA_7894FE9285EF_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_4415303D_49A6_7492_41CA_7894FE9285EF_0/f/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_4415303D_49A6_7492_41CA_7894FE9285EF_0/f/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_4415303D_49A6_7492_41CA_7894FE9285EF_0/f/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_4415303D_49A6_7492_41CA_7894FE9285EF_0/f/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_4415303D_49A6_7492_41CA_7894FE9285EF_0/f/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_4415303D_49A6_7492_41CA_7894FE9285EF_0/u/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_4415303D_49A6_7492_41CA_7894FE9285EF_0/u/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_4415303D_49A6_7492_41CA_7894FE9285EF_0/u/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_4415303D_49A6_7492_41CA_7894FE9285EF_0/u/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_4415303D_49A6_7492_41CA_7894FE9285EF_0/u/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_4415303D_49A6_7492_41CA_7894FE9285EF_0/b/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_4415303D_49A6_7492_41CA_7894FE9285EF_0/b/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_4415303D_49A6_7492_41CA_7894FE9285EF_0/b/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_4415303D_49A6_7492_41CA_7894FE9285EF_0/b/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_4415303D_49A6_7492_41CA_7894FE9285EF_0/b/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_4415303D_49A6_7492_41CA_7894FE9285EF_0/d/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_4415303D_49A6_7492_41CA_7894FE9285EF_0/d/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_4415303D_49A6_7492_41CA_7894FE9285EF_0/d/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_4415303D_49A6_7492_41CA_7894FE9285EF_0/d/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_4415303D_49A6_7492_41CA_7894FE9285EF_0/d/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_4415303D_49A6_7492_41CA_7894FE9285EF_0/l/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_4415303D_49A6_7492_41CA_7894FE9285EF_0/l/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_4415303D_49A6_7492_41CA_7894FE9285EF_0/l/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_4415303D_49A6_7492_41CA_7894FE9285EF_0/l/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_4415303D_49A6_7492_41CA_7894FE9285EF_0/l/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_4415303D_49A6_7492_41CA_7894FE9285EF_0/r/0/{row}_{column}.jpg",
      "colCount": 13,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 6656,
      "rowCount": 13,
      "height": 6656
     },
     {
      "url": "media/panorama_4415303D_49A6_7492_41CA_7894FE9285EF_0/r/1/{row}_{column}.jpg",
      "colCount": 7,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3584,
      "rowCount": 7,
      "height": 3584
     },
     {
      "url": "media/panorama_4415303D_49A6_7492_41CA_7894FE9285EF_0/r/2/{row}_{column}.jpg",
      "colCount": 4,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_4415303D_49A6_7492_41CA_7894FE9285EF_0/r/3/{row}_{column}.jpg",
      "colCount": 2,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_4415303D_49A6_7492_41CA_7894FE9285EF_0/r/4/{row}_{column}.jpg",
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "vfov": 180,
 "pitch": 0
},
{
 "automaticZoomSpeed": 0,
 "id": "panorama_443358C1_49A2_15F2_41C7_54C799483365_camera",
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "hfov": 120,
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "manualZoomSpeed": 0
},
{
 "automaticZoomSpeed": 0,
 "id": "panorama_4415303D_49A6_7492_41CA_7894FE9285EF_camera",
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "manualZoomSpeed": 0
},
{
 "propagateClick": false,
 "toolTipTextShadowOpacity": 0,
 "progressRight": 0,
 "toolTipFontFamily": "Arial",
 "id": "MainViewer",
 "progressBarBackgroundColorDirection": "vertical",
 "vrPointerSelectionTime": 2000,
 "playbackBarHeadShadowColor": "#000000",
 "progressOpacity": 1,
 "firstTransitionDuration": 0,
 "width": "100%",
 "playbackBarHeadShadow": true,
 "progressBottom": 0,
 "playbackBarHeadShadowHorizontalLength": 0,
 "progressBackgroundOpacity": 1,
 "transitionMode": "blending",
 "playbackBarOpacity": 1,
 "progressHeight": 10,
 "toolTipFontColor": "#606060",
 "vrPointerColor": "#FFFFFF",
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBarOpacity": 1,
 "minHeight": 50,
 "playbackBarHeadShadowOpacity": 0.7,
 "paddingBottom": 0,
 "progressBorderSize": 0,
 "toolTipBackgroundColor": "#F6F6F6",
 "playbackBarBorderColor": "#FFFFFF",
 "height": "100%",
 "paddingRight": 0,
 "displayTooltipInTouchScreens": true,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "toolTipBorderSize": 1,
 "toolTipPaddingRight": 6,
 "borderSize": 0,
 "minWidth": 100,
 "progressBackgroundColorRatios": [
  0
 ],
 "progressBorderRadius": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "toolTipPaddingLeft": 6,
 "paddingLeft": 0,
 "playbackBarHeadShadowVerticalLength": 0,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "toolTipDisplayTime": 600,
 "toolTipPaddingTop": 4,
 "borderRadius": 0,
 "playbackBarHeadHeight": 15,
 "progressBackgroundColorDirection": "vertical",
 "toolTipBorderRadius": 3,
 "playbackBarLeft": 0,
 "playbackBarBottom": 5,
 "progressBarBorderColor": "#000000",
 "shadow": false,
 "progressBorderColor": "#000000",
 "playbackBarHeadOpacity": 1,
 "progressBarBackgroundColorRatios": [
  0
 ],
 "paddingTop": 0,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "toolTipBorderColor": "#767676",
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "toolTipShadowSpread": 0,
 "playbackBarHeight": 10,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeadWidth": 6,
 "toolTipOpacity": 1,
 "toolTipFontSize": "1.11vmin",
 "toolTipShadowBlurRadius": 3,
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipTextShadowColor": "#000000",
 "playbackBarRight": 0,
 "progressBarBorderSize": 0,
 "class": "ViewerArea",
 "playbackBarProgressBorderRadius": 0,
 "toolTipPaddingBottom": 4,
 "playbackBarProgressBorderSize": 0,
 "toolTipFontWeight": "normal",
 "progressBarBorderRadius": 0,
 "toolTipTextShadowBlurRadius": 3,
 "playbackBarBorderRadius": 0,
 "toolTipShadowHorizontalLength": 0,
 "toolTipShadowColor": "#333333",
 "toolTipShadowVerticalLength": 0,
 "playbackBarHeadBorderRadius": 0,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderColor": "#000000",
 "progressLeft": 0,
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "toolTipShadowOpacity": 1,
 "playbackBarBorderSize": 0,
 "playbackBarBackgroundOpacity": 1,
 "toolTipFontStyle": "normal",
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "transitionDuration": 500,
 "data": {
  "name": "Main Viewer"
 }
},
{
 "cursor": "hand",
 "horizontalAlign": "center",
 "id": "IconButton_466CA349_4A3F_DA25_41B1_B8E0417A7CEA",
 "paddingTop": 0,
 "width": 55,
 "maxWidth": 55,
 "right": "3.63%",
 "maxHeight": 54,
 "class": "IconButton",
 "bottom": "0%",
 "minHeight": 1,
 "paddingBottom": 0,
 "height": 54,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "minWidth": 1,
 "borderSize": 0,
 "paddingLeft": 0,
 "transparencyActive": false,
 "backgroundOpacity": 0,
 "mode": "push",
 "shadow": false,
 "iconURL": "skin/IconButton_466CA349_4A3F_DA25_41B1_B8E0417A7CEA.png",
 "borderRadius": 0,
 "propagateClick": false,
 "data": {
  "name": "IconButton12826"
 }
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03c"
 },
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_5ECC4E57_4A63_EC9E_41CF_99B326DCE737",
   "yaw": 108.36,
   "pitch": -29.06,
   "hfov": 15.99,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_5CEB232A_4A66_34B1_41CA_ACC95AEB2F59",
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "maps": [
  {
   "hfov": 15.99,
   "yaw": 108.36,
   "image": {
    "levels": [
     {
      "url": "media/panorama_441B344E_49A2_1C8E_41C2_CED6F1B0DE75_0_HS_6_0_0_map.gif",
      "width": 30,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -29.06,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03c"
 },
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_5ECDFE67_4A63_ECBF_41A9_4F271A9AC62D",
   "yaw": 81.32,
   "pitch": -37.3,
   "hfov": 31.59,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_5F87ABD1_4A66_6B93_41A0_B99B95052B1A",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_4426B37D_49A2_1493_41CC_4DF2476A6313, this.camera_5B58C330_4A4F_DA63_41C9_AA40CA1352C4); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "maps": [
  {
   "hfov": 31.59,
   "yaw": 81.32,
   "image": {
    "levels": [
     {
      "url": "media/panorama_441B344E_49A2_1C8E_41C2_CED6F1B0DE75_0_HS_7_0_0_map.gif",
      "width": 20,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -37.3,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03c"
 },
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_5ECDAE67_4A63_ECBF_41BD_91B4AE3826D6",
   "yaw": 122.91,
   "pitch": -20.9,
   "hfov": 18.12,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_5F20CDED_4A66_2FB2_41C5_837A5591A984",
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "maps": [
  {
   "hfov": 18.12,
   "yaw": 122.91,
   "image": {
    "levels": [
     {
      "url": "media/panorama_441B344E_49A2_1C8E_41C2_CED6F1B0DE75_0_HS_8_0_0_map.gif",
      "width": 48,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -20.9,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03c"
 },
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_5ECFFE67_4A63_ECBF_41CE_1CDFD464C393",
   "yaw": -116.01,
   "pitch": -26.45,
   "hfov": 22.28,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_5FAA6290_4A66_1592_41C1_2F611E5A269B",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_4423A38F_49A6_7B8E_41BE_733AE6F66BB3, this.camera_5A8322F2_4A4F_DBE7_41CE_CDB3389CFD5A); this.mainPlayList.set('selectedIndex', 6)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "maps": [
  {
   "hfov": 22.28,
   "yaw": -116.01,
   "image": {
    "levels": [
     {
      "url": "media/panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E_0_HS_5_0_0_map.gif",
      "width": 20,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -26.45,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03c"
 },
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_5ECF8E67_4A63_ECBF_41D0_9A9DE73F83AE",
   "yaw": -144.01,
   "pitch": -45.26,
   "hfov": 27.95,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_5F41B3B2_4A66_1B96_41C9_FA18819E067A",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_4415303D_49A6_7492_41CA_7894FE9285EF, this.camera_5A9352D3_4A4F_DA26_41AD_3B80F908C8C4); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "maps": [
  {
   "hfov": 27.95,
   "yaw": -144.01,
   "image": {
    "levels": [
     {
      "url": "media/panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E_0_HS_6_0_0_map.gif",
      "width": 20,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -45.26,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03c"
 },
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_5EC8AE67_4A63_ECBF_41A6_A52A2104E927",
   "yaw": 155.26,
   "pitch": -27.02,
   "hfov": 26.97,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_5E2422E1_4A66_75B3_41B0_1E085DE16D50",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_4426B37D_49A2_1493_41CC_4DF2476A6313, this.camera_5AF1A2A4_4A4F_DA63_41CA_64097BA9725A); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "maps": [
  {
   "hfov": 26.97,
   "yaw": 155.26,
   "image": {
    "levels": [
     {
      "url": "media/panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E_0_HS_9_0_0_map.gif",
      "width": 48,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -27.02,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03c"
 },
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_45D9FA18_4A49_CA22_41CF_6A0B29E6D77E",
   "yaw": 145.51,
   "pitch": -49.06,
   "hfov": 22.71,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_44F5D5B0_4A4A_7E63_417D_8C42D380A690",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7, this.camera_5AE162B3_4A4F_DA65_417D_CB3318582B71); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "maps": [
  {
   "hfov": 22.71,
   "yaw": 145.51,
   "image": {
    "levels": [
     {
      "url": "media/panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E_0_HS_10_0_0_map.gif",
      "width": 20,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -49.06,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03c"
 },
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_45D9DA18_4A49_CA22_41B7_0A3372C94546",
   "yaw": 91.55,
   "pitch": -51.64,
   "hfov": 24.64,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_4556F770_4A49_BAE3_41BE_3E47ABCC5DA7",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315, this.camera_5AC78294_4A4F_DA23_41C5_600699C01327); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "maps": [
  {
   "hfov": 24.64,
   "yaw": 91.55,
   "image": {
    "levels": [
     {
      "url": "media/panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E_0_HS_11_0_0_map.gif",
      "width": 20,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -51.64,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03c"
 },
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_5ECE8E67_4A63_ECBF_41B8_037C621D38BB",
   "yaw": -88.49,
   "pitch": -36.06,
   "hfov": 32.1,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_5F7021E8_4A66_17B1_41D0_070E55AA3091",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_4415303D_49A6_7492_41CA_7894FE9285EF, this.camera_5B793340_4A4F_DA23_41D0_44661FB97A8B); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "maps": [
  {
   "hfov": 32.1,
   "yaw": -88.49,
   "image": {
    "levels": [
     {
      "url": "media/panorama_4423A38F_49A6_7B8E_41BE_733AE6F66BB3_0_HS_2_0_0_map.gif",
      "width": 20,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -36.06,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03c"
 },
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_5ECE2E67_4A63_ECBF_41D1_475C7FD0BD15",
   "yaw": -112.1,
   "pitch": -27.14,
   "hfov": 20.68,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_5F0AC08A_4A66_1471_41AA_AA634B00A040",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E, this.camera_5B488330_4A4F_DA63_41B3_C75954DDB3A9); this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "maps": [
  {
   "hfov": 20.68,
   "yaw": -112.1,
   "image": {
    "levels": [
     {
      "url": "media/panorama_4423A38F_49A6_7B8E_41BE_733AE6F66BB3_0_HS_3_0_0_map.gif",
      "width": 30,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -27.14,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 06a"
 },
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_5E1A2FD5_4A7E_2B93_41C7_5A2C17E0BDB0",
   "yaw": -47.13,
   "pitch": -45.46,
   "hfov": 18.54,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_5F06B95A_4A7E_1491_41CF_02009B7D951E",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7, this.camera_5AAEE321_4A4F_DA65_41C5_B74351D4ECEC); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "maps": [
  {
   "hfov": 18.54,
   "yaw": -47.13,
   "image": {
    "levels": [
     {
      "url": "media/panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315_0_HS_10_0_0_map.gif",
      "width": 20,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -45.46,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 06a"
 },
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_5E1B9FD5_4A7E_2B93_41CA_A103C81FFB78",
   "yaw": 155.95,
   "pitch": -51.69,
   "hfov": 19.28,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_5EB3AAF9_4A7E_1593_41C8_1B35CEC2E240",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_443358C1_49A2_15F2_41C7_54C799483365, this.camera_5ABD2311_4A4F_DA25_41C1_65988134D116); this.mainPlayList.set('selectedIndex', 0)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "maps": [
  {
   "hfov": 19.28,
   "yaw": 155.95,
   "image": {
    "levels": [
     {
      "url": "media/panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315_0_HS_11_0_0_map.gif",
      "width": 20,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -51.69,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 06a"
 },
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_5E1BAFD5_4A7E_2B93_41D0_40F2F5551CB5",
   "yaw": -66.37,
   "pitch": -30.16,
   "hfov": 14.79,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_5EE20BFC_4A7E_2B92_4194_008DA47ABE8C",
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "maps": [
  {
   "hfov": 14.79,
   "yaw": -66.37,
   "image": {
    "levels": [
     {
      "url": "media/panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315_0_HS_12_0_0_map.gif",
      "width": 30,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -30.16,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Point 02c"
 },
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_5D395521_4AA2_3CB3_41D1_312BF3F37C7F",
   "yaw": -14.52,
   "pitch": -39.15,
   "hfov": 23.95,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_5E479D7B_4AA2_2C97_41BE_96B0CFCACED4",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E, this.camera_5A8D7301_4A4F_DA25_41CA_D2BE72235E47); this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "maps": [
  {
   "hfov": 23.95,
   "yaw": -14.52,
   "image": {
    "levels": [
     {
      "url": "media/panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315_0_HS_13_0_0_map.gif",
      "width": 48,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -39.15,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03b"
 },
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_5EC28E57_4A63_EC9E_41A9_5535BFBB3F5B",
   "yaw": 113.62,
   "pitch": -48.69,
   "hfov": 17.41,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_5F3F15BF_4A62_3F8E_41CE_5D42D3F0BAA7",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315, this.camera_5A1E5227_4A4F_DA6D_41D1_0EF26068F5CF); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "maps": [
  {
   "hfov": 17.41,
   "yaw": 113.62,
   "image": {
    "levels": [
     {
      "url": "media/panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7_0_HS_8_0_0_map.gif",
      "width": 20,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -48.69,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03c"
 },
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_5EC25E57_4A63_EC9E_41C1_9B1B1D623EF0",
   "yaw": 121.2,
   "pitch": -26.87,
   "hfov": 20.98,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_5EBC83F4_4A63_FB91_41CA_F4087B503E22",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_443358C1_49A2_15F2_41C7_54C799483365, this.camera_5A6DA217_4A4F_DA2D_41D0_F839A18EC0D1); this.mainPlayList.set('selectedIndex', 0); this.mainPlayList.set('selectedIndex', 0)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "maps": [
  {
   "hfov": 20.98,
   "yaw": 121.2,
   "image": {
    "levels": [
     {
      "url": "media/panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7_0_HS_9_0_0_map.gif",
      "width": 48,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -26.87,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03b"
 },
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_5EC3FE57_4A63_EC9E_41B3_DC2883A0606A",
   "yaw": 49.05,
   "pitch": -46.91,
   "hfov": 17.27,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_5FEF77F2_4A62_3B91_41D0_2E5EC67E40A1",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E, this.camera_5A718207_4A4F_DA2D_41B7_B7EF17B15838); this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "maps": [
  {
   "hfov": 17.27,
   "yaw": 49.05,
   "image": {
    "levels": [
     {
      "url": "media/panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7_0_HS_10_0_0_map.gif",
      "width": 20,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -46.91,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03b"
 },
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_5EC3BE57_4A63_EC9E_41CC_74E60113EE48",
   "yaw": -91.25,
   "pitch": -44.71,
   "hfov": 17.96,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_5F25DA1E_4A62_7491_41BE_13C1BA4F1E62",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_4426B37D_49A2_1493_41CC_4DF2476A6313, this.camera_5A098236_4A4F_DA6F_41C8_97AE9B8B1908); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "maps": [
  {
   "hfov": 17.96,
   "yaw": -91.25,
   "image": {
    "levels": [
     {
      "url": "media/panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7_0_HS_11_0_0_map.gif",
      "width": 20,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -44.71,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03c"
 },
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_5ECCEE57_4A63_EC9E_41D0_EC515C473407",
   "yaw": -132.28,
   "pitch": -41.96,
   "hfov": 29.53,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_5EA179FB_4A62_3797_41A0_DC74BD650A61",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7, this.camera_5A59F1E8_4A4F_D9E3_41AC_97111D338FB5); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "maps": [
  {
   "hfov": 29.53,
   "yaw": -132.28,
   "image": {
    "levels": [
     {
      "url": "media/panorama_4426B37D_49A2_1493_41CC_4DF2476A6313_0_HS_7_0_0_map.gif",
      "width": 30,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -41.96,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03c"
 },
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_5ECC8E57_4A63_EC9E_419D_8740C1412677",
   "yaw": -132.96,
   "pitch": -27.76,
   "hfov": 28.82,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_5FA18CE1_4A62_6DB2_4179_977D3D3553AD",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E, this.camera_5A52A1D9_4A4F_D625_41C1_97C32DDDFF91); this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "maps": [
  {
   "hfov": 28.82,
   "yaw": -132.96,
   "image": {
    "levels": [
     {
      "url": "media/panorama_4426B37D_49A2_1493_41CC_4DF2476A6313_0_HS_8_0_0_map.gif",
      "width": 48,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -27.76,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03b"
 },
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_45D89A18_4A49_CA22_41CE_431ED64322D2",
   "yaw": 6.49,
   "pitch": -44.5,
   "hfov": 18.02,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_45551A1D_4A4E_4A5D_41BE_FE2146F9416F",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_441B344E_49A2_1C8E_41C2_CED6F1B0DE75, this.camera_5A40C1F8_4A4F_D9E3_41D1_A0CF36D69E64); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "maps": [
  {
   "hfov": 18.02,
   "yaw": 6.49,
   "image": {
    "levels": [
     {
      "url": "media/panorama_4426B37D_49A2_1493_41CC_4DF2476A6313_0_HS_9_0_0_map.gif",
      "width": 20,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -44.5,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 06a"
 },
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_5E1D0FD5_4A7E_2B93_41C7_0B981AA092CA",
   "yaw": -30.33,
   "pitch": -57.75,
   "hfov": 13.23,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_59B2FB1B_4A62_1496_41B0_A12B49B650CC",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315, this.camera_45A001C9_4A4F_D625_41C7_C4AC4FCF2928); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "maps": [
  {
   "hfov": 13.23,
   "yaw": -30.33,
   "image": {
    "levels": [
     {
      "url": "media/panorama_443358C1_49A2_15F2_41C7_54C799483365_0_HS_6_0_0_map.gif",
      "width": 20,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -57.75,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 06a"
 },
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_5E1A7FD5_4A7E_2B93_41C3_D837D4309703",
   "yaw": -49.96,
   "pitch": -29.89,
   "hfov": 15.3,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_59F4C98E_4A62_178E_41CE_46777204CA54",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7, this.camera_45A9C1D9_4A4F_D625_41B0_0C744B9A09BC); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "maps": [
  {
   "hfov": 15.3,
   "yaw": -49.96,
   "image": {
    "levels": [
     {
      "url": "media/panorama_443358C1_49A2_15F2_41C7_54C799483365_0_HS_7_0_0_map.gif",
      "width": 30,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -29.89,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03b"
 },
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_5ECD4E67_4A63_ECBF_41C2_1D5D2473975A",
   "yaw": 120.52,
   "pitch": -53.29,
   "hfov": 29.71,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_5E9685AF_4A62_1F8F_41B6_BD58E5609553",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E, this.camera_5A3A8246_4A4F_DA2F_41AF_41C9F4E3129F); this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "maps": [
  {
   "hfov": 29.71,
   "yaw": 120.52,
   "image": {
    "levels": [
     {
      "url": "media/panorama_4415303D_49A6_7492_41CA_7894FE9285EF_0_HS_8_0_0_map.gif",
      "width": 30,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -53.29,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03c"
 },
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_5ECD4E67_4A63_ECBF_41CC_C4547ED41B1D",
   "yaw": 154.09,
   "pitch": -32.98,
   "hfov": 24.47,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_5E95CCED_4A63_EDB2_41C3_02151390D420",
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "maps": [
  {
   "hfov": 24.47,
   "yaw": 154.09,
   "image": {
    "levels": [
     {
      "url": "media/panorama_4415303D_49A6_7492_41CA_7894FE9285EF_0_HS_9_0_0_map.gif",
      "width": 48,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -32.98,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03c"
 },
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_5E16BFD5_4A7E_2B93_41B2_C2C9B7E3A05D",
   "yaw": -19.04,
   "pitch": -32.15,
   "hfov": 36.18,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_5E1EAE23_4A62_6CB7_41CA_AB9468CC38DA",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_4423A38F_49A6_7B8E_41BE_733AE6F66BB3, this.camera_5AD68275_4A4F_DAED_41D0_F5D0948BC893); this.mainPlayList.set('selectedIndex', 6); this.mainPlayList.set('selectedIndex', 6)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "maps": [
  {
   "hfov": 36.18,
   "yaw": -19.04,
   "image": {
    "levels": [
     {
      "url": "media/panorama_4415303D_49A6_7492_41CA_7894FE9285EF_0_HS_10_0_0_map.gif",
      "width": 20,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -32.15,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03c"
 },
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_5E166FD5_4A7E_2B93_41AA_78B810FCB7A9",
   "yaw": -146.49,
   "pitch": -25.84,
   "hfov": 24.62,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_5E902C12_4A62_EC96_4140_8EF79839D2BE",
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "maps": [
  {
   "hfov": 24.62,
   "yaw": -146.49,
   "image": {
    "levels": [
     {
      "url": "media/panorama_4415303D_49A6_7492_41CA_7894FE9285EF_0_HS_11_0_0_map.gif",
      "width": 48,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -25.84,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_441B344E_49A2_1C8E_41C2_CED6F1B0DE75_0_HS_6_0.png",
   "width": 1200,
   "height": 930,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "id": "AnimatedImageResource_5ECC4E57_4A63_EC9E_41CF_99B326DCE737",
 "frameDuration": 41
},
{
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_441B344E_49A2_1C8E_41C2_CED6F1B0DE75_0_HS_7_0.png",
   "width": 1200,
   "height": 1440,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "id": "AnimatedImageResource_5ECDFE67_4A63_ECBF_41A9_4F271A9AC62D",
 "frameDuration": 41
},
{
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_441B344E_49A2_1C8E_41C2_CED6F1B0DE75_0_HS_8_0.png",
   "width": 1200,
   "height": 600,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "id": "AnimatedImageResource_5ECDAE67_4A63_ECBF_41BD_91B4AE3826D6",
 "frameDuration": 41
},
{
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E_0_HS_5_0.png",
   "width": 1200,
   "height": 1440,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "id": "AnimatedImageResource_5ECFFE67_4A63_ECBF_41CE_1CDFD464C393",
 "frameDuration": 41
},
{
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E_0_HS_6_0.png",
   "width": 1200,
   "height": 1440,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "id": "AnimatedImageResource_5ECF8E67_4A63_ECBF_41D0_9A9DE73F83AE",
 "frameDuration": 41
},
{
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E_0_HS_9_0.png",
   "width": 1200,
   "height": 600,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "id": "AnimatedImageResource_5EC8AE67_4A63_ECBF_41A6_A52A2104E927",
 "frameDuration": 41
},
{
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E_0_HS_10_0.png",
   "width": 1200,
   "height": 1440,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "id": "AnimatedImageResource_45D9FA18_4A49_CA22_41CF_6A0B29E6D77E",
 "frameDuration": 41
},
{
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_44295D90_49A6_2F92_41D1_2B7085B2D86E_0_HS_11_0.png",
   "width": 1200,
   "height": 1440,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "id": "AnimatedImageResource_45D9DA18_4A49_CA22_41B7_0A3372C94546",
 "frameDuration": 41
},
{
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_4423A38F_49A6_7B8E_41BE_733AE6F66BB3_0_HS_2_0.png",
   "width": 1200,
   "height": 1440,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "id": "AnimatedImageResource_5ECE8E67_4A63_ECBF_41B8_037C621D38BB",
 "frameDuration": 41
},
{
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_4423A38F_49A6_7B8E_41BE_733AE6F66BB3_0_HS_3_0.png",
   "width": 1200,
   "height": 930,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "id": "AnimatedImageResource_5ECE2E67_4A63_ECBF_41D1_475C7FD0BD15",
 "frameDuration": 41
},
{
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315_0_HS_10_0.png",
   "width": 1200,
   "height": 1440,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "id": "AnimatedImageResource_5E1A2FD5_4A7E_2B93_41C7_5A2C17E0BDB0",
 "frameDuration": 41
},
{
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315_0_HS_11_0.png",
   "width": 1200,
   "height": 1440,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "id": "AnimatedImageResource_5E1B9FD5_4A7E_2B93_41CA_A103C81FFB78",
 "frameDuration": 41
},
{
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315_0_HS_12_0.png",
   "width": 1200,
   "height": 930,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "id": "AnimatedImageResource_5E1BAFD5_4A7E_2B93_41D0_40F2F5551CB5",
 "frameDuration": 41
},
{
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_444BE070_49A2_7492_41CD_3B5DC1AA4315_0_HS_13_0.png",
   "width": 1200,
   "height": 600,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "id": "AnimatedImageResource_5D395521_4AA2_3CB3_41D1_312BF3F37C7F",
 "frameDuration": 41
},
{
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7_0_HS_8_0.png",
   "width": 1200,
   "height": 1440,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "id": "AnimatedImageResource_5EC28E57_4A63_EC9E_41A9_5535BFBB3F5B",
 "frameDuration": 41
},
{
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7_0_HS_9_0.png",
   "width": 1200,
   "height": 600,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "id": "AnimatedImageResource_5EC25E57_4A63_EC9E_41C1_9B1B1D623EF0",
 "frameDuration": 41
},
{
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7_0_HS_10_0.png",
   "width": 1200,
   "height": 1440,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "id": "AnimatedImageResource_5EC3FE57_4A63_EC9E_41B3_DC2883A0606A",
 "frameDuration": 41
},
{
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_451D2CEB_49A2_6DB6_41CD_A71D57A7FDB7_0_HS_11_0.png",
   "width": 1200,
   "height": 1440,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "id": "AnimatedImageResource_5EC3BE57_4A63_EC9E_41CC_74E60113EE48",
 "frameDuration": 41
},
{
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_4426B37D_49A2_1493_41CC_4DF2476A6313_0_HS_7_0.png",
   "width": 1200,
   "height": 930,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "id": "AnimatedImageResource_5ECCEE57_4A63_EC9E_41D0_EC515C473407",
 "frameDuration": 41
},
{
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_4426B37D_49A2_1493_41CC_4DF2476A6313_0_HS_8_0.png",
   "width": 1200,
   "height": 600,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "id": "AnimatedImageResource_5ECC8E57_4A63_EC9E_419D_8740C1412677",
 "frameDuration": 41
},
{
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_4426B37D_49A2_1493_41CC_4DF2476A6313_0_HS_9_0.png",
   "width": 1200,
   "height": 1440,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "id": "AnimatedImageResource_45D89A18_4A49_CA22_41CE_431ED64322D2",
 "frameDuration": 41
},
{
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_443358C1_49A2_15F2_41C7_54C799483365_0_HS_6_0.png",
   "width": 1200,
   "height": 1440,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "id": "AnimatedImageResource_5E1D0FD5_4A7E_2B93_41C7_0B981AA092CA",
 "frameDuration": 41
},
{
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_443358C1_49A2_15F2_41C7_54C799483365_0_HS_7_0.png",
   "width": 1200,
   "height": 930,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "id": "AnimatedImageResource_5E1A7FD5_4A7E_2B93_41C3_D837D4309703",
 "frameDuration": 41
},
{
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_4415303D_49A6_7492_41CA_7894FE9285EF_0_HS_8_0.png",
   "width": 1200,
   "height": 930,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "id": "AnimatedImageResource_5ECD4E67_4A63_ECBF_41C2_1D5D2473975A",
 "frameDuration": 41
},
{
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_4415303D_49A6_7492_41CA_7894FE9285EF_0_HS_9_0.png",
   "width": 1200,
   "height": 600,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "id": "AnimatedImageResource_5ECD4E67_4A63_ECBF_41CC_C4547ED41B1D",
 "frameDuration": 41
},
{
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_4415303D_49A6_7492_41CA_7894FE9285EF_0_HS_10_0.png",
   "width": 1200,
   "height": 1440,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "id": "AnimatedImageResource_5E16BFD5_4A7E_2B93_41B2_C2C9B7E3A05D",
 "frameDuration": 41
},
{
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_4415303D_49A6_7492_41CA_7894FE9285EF_0_HS_11_0.png",
   "width": 1200,
   "height": 600,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "id": "AnimatedImageResource_5E166FD5_4A7E_2B93_41AA_78B810FCB7A9",
 "frameDuration": 41
}],
 "paddingRight": 0,
 "minWidth": 20,
 "height": "100%",
 "borderSize": 0,
 "paddingLeft": 0,
 "scrollBarMargin": 2,
 "mouseWheelEnabled": true,
 "borderRadius": 0,
 "overflow": "visible",
 "shadow": false,
 "layout": "absolute",
 "desktopMipmappingEnabled": false,
 "propagateClick": false,
 "gap": 10
};

    
    function HistoryData(playList) {
        this.playList = playList;
        this.list = [];
        this.pointer = -1;
    }

    HistoryData.prototype.add = function(index){
        if(this.pointer < this.list.length && this.list[this.pointer] == index) {
            return;
        }
        ++this.pointer;
        this.list.splice(this.pointer, this.list.length - this.pointer, index);
    };

    HistoryData.prototype.back = function(){
        if(!this.canBack()) return;
        this.playList.set('selectedIndex', this.list[--this.pointer]);
    };

    HistoryData.prototype.forward = function(){
        if(!this.canForward()) return;
        this.playList.set('selectedIndex', this.list[++this.pointer]);
    };

    HistoryData.prototype.canBack = function(){
        return this.pointer > 0;
    };

    HistoryData.prototype.canForward = function(){
        return this.pointer >= 0 && this.pointer < this.list.length-1;
    };
    //

    if(script.data == undefined)
        script.data = {};
    script.data["history"] = {};    //playListID -> HistoryData

    TDV.PlayerAPI.defineScript(script);
})();

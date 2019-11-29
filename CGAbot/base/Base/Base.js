(function(){
  var _util = IncludeExt("General/Util/Util.js");
  var _wb = Include("base/WorldBase/WorldBase.js");
  var _gc = Include("base/GameConfig/GameConfig.js");
////

  return{
		state: {
			mapTries:0
		},
		mapTry: function(result){
			if(result == undefined){
				this.state.mapTries++;
				if(this.state.mapTries >= 100){
					gn.player.input.KeyEvent(4);
					this.state.mapTries = 0;
				}
			}else{
				this.state.mapTries = 0;
			}
		},
		getMap : function(){
			var result = undefined;
      for (var prop in _gc.maps) {
        if(result)
          break;
        if (_gc.maps.hasOwnProperty(prop)) {
          var obj = _gc.maps[prop];
          for (var i = 0; i < obj.indicators.length; i++) {
             var indicator = obj.indicators[i];
             if(indicator.find({tries:1, confirms:1})){
               result = prop;
               break;
             }
          }
        }
      }
			this.mapTry(result);
			return result;
		},
    closeAllDialogs : function() {
      for (var i = 0; i < 3; i++) {
        if(!_base.closeDialogs()){
          break;
        }

        gn.tools.Wait(2000);
        gn.player.screen.Refresh();
      }
    },
    toggleWorldUI : function(b){
      // _wb.ui.show(b);
    },
    changeMap : function(map){
      // this.toggleWorldUI(true);
      if(map.button.some(function(el){return el.tap({tries:5, confirms:3})})){
        gn.tools.Wait(2000, "");
        gn.player.screen.Refresh();
        return true;
      }
      return false;
    },
		closeDialogs : function(){
      var popups = _util.toArray(_gc.popups);
      popups.forEach(function(el){
        if(el.tap())
          return;
      });
		},

		move: {
			world:{
				up: function(){ gn.player.input.Swipe(0, 1000, 100, false);},
				right: function(){ gn.player.input.Swipe(1, 1000, 100, false)},
				down: function(){ gn.player.input.Swipe(2, 1000, 100, false)},
				left: function(){ gn.player.input.Swipe(3, 1000, 100, false)}
			},
			town:{
				up: function(){ gn.player.input.Swipe(0, 1000, 100, false)},
				right: function(){ gn.player.input.Swipe(1, 1000, 80, false)},
				down: function(){ gn.player.input.Swipe(2, 1000, 100, false)},
				left: function(){ gn.player.input.Swipe(3, 1000, 80, false)},
				fastTopLeft:function(){
					gn.player.input.Swipe(3, 250, 120, false);
					gn.player.input.Swipe(0, 250, 120, false);
				},
				fastBottomRight:function(){
					gn.player.input.Swipe(1, 250, 120, false);
					gn.player.input.Swipe(2, 250, 120, false);
				},
        fastBottomLeft:function(){
          gn.player.input.Swipe(2, 250, 120, false);
          gn.player.input.Swipe(3, 250, 120, false);
        },
				fastTopRight:function(){
					gn.player.input.Swipe(0, 250, 120, false);
					gn.player.input.Swipe(1, 250, 120, false);
				},
			},
			ui:{
				up: function(){ gn.player.input.Swipe(0, 1000, 50, false)},
				right: function(){ gn.player.input.Swipe(1, 1000, 50, false)},
				down: function(){ gn.player.input.Swipe(2, 1000, 50, false)},
				left: function(){ gn.player.input.Swipe(3, 1000, 50, false)}
			}
		},
		townCheck : function(){
			var map = this.getMap();
			if(map  && map != "town")
				this.changeMap(_gc.maps.town);

			if(map === "town")
				return true;
			else
				return false;
		},

		worldCheck : function(){
			var map = this.getMap();
			if(map  && map != "world")
				this.changeMap(_gc.maps.world);

			if(map === "world")
				return true;
			else
				return false;
		}
	}
})();

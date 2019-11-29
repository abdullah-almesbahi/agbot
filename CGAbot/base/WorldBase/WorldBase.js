(function(){
    var _gc = Include("base/GameConfig/GameConfig.js");
    var _util = IncludeExt("General/Util/Util.js");
    var _f = IncludeExt("General/Framework/Framework.js");
    var Image = _f != null ? _f.Image : function (){ return null};
    //REPLACE IMAGES//

    return{
      images:{
        bookmarkBtn: new Image("BookmarkButton", 0.93, [2, 400, 65, 74]),
        recenterBtn: new Image("RecenterButton", 0.93, [2, 182, 155, 353])
      },
      // ui:{
      //   images:{
      //     hideUIBtn: new Image("HideUIButton", 0.93, [384, 354, 48, 117]),
      //     showUIBtn: new Image("ShowUIButton", 0.93, [384, 354, 48, 117]),
      //   },
      //   hasUi:false,
      //   visible:true,
      //   refresh: function(){
      //     if(!this.hasUi) return;
      //     if(this.images.hideUIBtn.find())
      //       this.visible = true;
      //     else if(this.images.showUIBtn.find())
      //       this.visible = false;
      //     else
      //       this.visible = false;
      //   },
      //   show:function(b){
      //     if(!this.hasUi) return;
      //     this.refresh();
      //     if(b){
      //       if(!this.visible && this.images.showUIBtn.tap()){
      //         gn.tools.Wait(1500);
      //         gn.player.screen.refresh();
      //         this.refresh();
      //       }
      //     }else{
      //       if(this.visible && this.images.hideUIBtn.tap()){
      //         gn.tools.Wait(1500);
      //         gn.player.screen.Refresh();
      //         this.refresh();
      //       }
      //     }
      //   }
      // },
      recenter:function(){
        gn.tools.Log("Recentering Map", 0);
        gn.player.screen.Refresh();
        _base.closeAllDialogs();
        // this.ui.show(true); //
        if(!this.images.recenterBtn.tap({tries:3, confirms:2})){
          _base.changeMap(_gc.maps.town);
          _base.changeMap(_gc.maps.world);
        }
      },
      goToBookmark:function(options){
        gn.tools.Log("Opening bookmarks", 0);
        gn.player.screen.Refresh();
        _base.closeAllDialogs();
        gn.player.screen.Refresh();
        // this.ui.show(true);
        this.images.bookmarkBtn.tap({tries:4, confirms:2});
        return this.dialogs.bookmark(options);
      },
      check : function(){
      	gn.player.screen.Refresh();
      	_base.closeDialogs();
      	if(!_base.worldCheck()) return;
        // this.ui.refresh();
        return true;
      },
      dialogs:{
        images:{
          marchTitle:new Image("MarchTitle", 0.9, [90, 1, 211, 46]),
          marchButton:new Image("MarchButton", 0.9, [220, 593, 134, 60]),
          bookmarkTitle:new Image("BookmarkTitle", 0.9, [138, 1, 128, 80]),
          equalizeButton:new Image("EqualizeButton", 0.9, [415, 80, 208, 338]),
          marchNoTroopsBtn:new Image("NoTroopsOkButton", 0.9, [87, 318, 210, 154]),
        },
        march:function(options){
          gn.tools.Log("Looking for march dialog.", 0);
          if(!this.images.marchTitle.find({tries:5, confirms:2})) return false;
          gn.tools.Log("March dialog found.", 0);

          if(options && options.eq){
            gn.tools.Log("Clicking Equalize Button.", 0);
            if(this.images.equalizeButton.tap({tries:2, confirms:1})){
              gn.tools.Wait(1000);
            }
          }
          gn.tools.Log("Clicking March Button.", 0);

          if(!this.images.marchButton.tap({tries:3, confirms:1})){
            gn.tools.Log("Can't find March Button.", 0);
            return false;
          }
          if(this.images.marchNoTroopsBtn.tap({tries:3, confirms:2})){
            gn.tools.Log("No troops available.", 0);
            gn.tools.Wait(1000);
            gn.player.screen.Refresh();
            return false;
          }
          gn.tools.Wait(2000);
          gn.player.screen.Refresh();
          _base.closeAllDialogs();
          gn.tools.Log("March sent.", 0);
          return true;
        },
        bookmark:function(options){
          gn.tools.Log("Looking for bookmark dialog.", 0);
          if(!this.images.bookmarkTitle.find({tries:4, confirms:2})) return false;
          var x=140, y=120, yOffset = 80;
          gn.tools.Log("Clicking bookmark " + options.slot, 0);
          gn.player.input.Tap(x, y + (yOffset * (options.slot - 1)));
          gn.tools.Wait(4000);
          return true;
        }
      }
    }
})();

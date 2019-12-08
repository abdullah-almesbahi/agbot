(function(){
  var _gc = Include("base/GameConfig/GameConfig.js");
  var _f = IncludeExt("General/Framework/Framework.js");
  var _base = Include("base/Base/Base.js");
  var Image = _f != null ? _f.Image : function (){ return null};

  return{
    buildings : {
      overview:{
        open:new Image('OverviewOpen', 0.9, [0, 300, 22, 23]),
        indicator:new Image('IndicatorOverview', 0.9, [137, 104, 59, 26]),
      },
      buttons:{
        collect:'CollectBtn',
        progress:'ProgressBtn',
        getMore:'GetMoreBtn',
        build:'BuildBtn',
      },
      recruitment : {
        indicator:new Image('IndicatorTroops', 0.9, [1, 239, 36, 41]),
      },
      hospital:{
        indicator:new Image('IndicatorHospital', 0.9, [2, 132, 41, 405]),
      },
      dailiesHeroes:{ //heroesHall
        indicator:new Image('IndicatorHeroes', 0.7, [2, 328, 140, 46]),
      },
      dailiesFountain:{
        indicator:new Image('IndicatorFountain', 0.7, [19, 446, 79, 33]),
      },
    },
    overview:function(obj){
      for(var i = 0; i < 3; i++){
        if(!this.buildings.overview.indicator.find({tries:2, confirms:2})){
          if(this.buildings.overview.open.tap({tries:1, confirms:1})){
            Print('Open Overview');
          }else{
            return false;
          }
        }else{
          if(obj == undefined){
            return true;
          }
          break;
        }
      }
      //reset
      gn.player.input.customSwipe(150, 150, 150, 500, 1000);
      //
      for(var i = 0; i < 4; i++){
        if(!this.buildings[obj].indicator.find({tries:4, confirms:2})){
          gn.player.input.customSwipe(150, 450, 150, 250, 1000);
          gn.tools.wait(1000);
        }else{
          return true;
        }
      }
    },
    action:function(area){
      for(var x in this.buildings.buttons){
        var img = new Image(this.buildings.buttons[x], 0.94, area);
        if(x == 'collect' && img.tap({tries:1, confirms:1})){
          gn.tools.wait(4000);
          gn.player.screen.Refresh();
        }
        if(x == 'build' && img.tap({tries:1, confirms:1})){
          return true;
        }
        if(x == 'progress' && img.find({tries:1, confirms:1})){
          return false;
        }
        if(x == 'getMore' && img.find({tries:1, confirms:1})){
          return false;
        }
      }
    },
    resource:{
      images:{
        indicatorNotEnough:new Image('IndicatorNotEnough', 0.9, [302, 256, 82, 313]),
        indicatorRed:new Image('IndicatorRedResource', 0.94, [99, 87, 225, 32]),
        indicatorResourceMenu:new Image('IndicatorResourceMenu', 0.9, [23, 45, 47, 46]),
        resourceUseBtn:new Image('ResourceUseBtn', 0.9, [303, 135, 91, 497]),
        resourceYesBtn:new Image('ResourceYesBtn', 0.9, [163, 408, 70, 49]),
      },
      usePacks:function(value, usePacks) {
        if(value == undefined){value == false}
        if(usePacks == undefined){usePacks == false}
        if(value || this.images.indicatorNotEnough.tap({tries:3, confirms:2})){
          if(this.images.indicatorResourceMenu.find({tries:5, confirms:1})){
            while(true){
              if(!this.images.indicatorRed.find({tries:4, confirms:1})){
                Print('Enough resources for stack')
                this.quitResource();
                return 'checkAgain'
              }
              if(usePacks == false){
                this.quitResource();
                return false;
              }
              if(!this.images.resourceUseBtn.tap({tries:4, confirms:2})){
                gn.tools.log('Not enough resources packs', 0);
                this.quitResource();
                return false;
              }
              if(this.images.resourceYesBtn.tap({tries:4, confirms:2})){
                Print('using stack')
                gn.tools.wait(2000);
              }else{
                gn.tools.log('Cannot use packs', 0);
                this.quitResource();
                break;
              }
            }
          }
        }
        return true
      },
      quitResource:function() {
        Print('get out')
        while(!this.images.indicatorResourceMenu.find({tries:3, confirms:1})){
          gn.player.input.tap(200, 10);
        }
        gn.player.input.tap(24, 24);
        return true;
      }
    },
    refs:{
      starts:{
        topLeft:{
          image: [new Image("TopLeftRef1", 0.92, [153, 222, 52, 49]), new Image('TopLeftRef2', 0.92, [135, 361, 51, 52])],
          title: "Top Left Reference",
          move:function(){
            _base.move.town.fastTopLeft();
          },
        },
        // topRight:{
        //   image: [new Image("TopRightReference", 0.92, [274, 333, 68, 50]), new Image("TopRightReference2", 0.92, [398, 247, 60, 77])],
        //   title: "Top Right Reference",
        //   move:function(){
        //     _base.move.town.fastTopRight();
        //   },
        // },
        bottomRight:{
          image: [new Image("BottomRightRef1", 0.92, [185, 129, 46, 45]), new Image('BottomRightRef2', 0.92, [58, 214, 44, 35])],
          title: "Bottom Right Reference",
          move:function(){
            _base.move.town.fastBottomRight();
          },
        },
        bottomLeft:{
          image: [new Image("BottomLeftRef1", 0.92, [5, 220, 46, 44]), new Image("BottomLeftRef2", 0.92, [88, 442, 54, 48])],
          title: "Bottom Right Reference",
          move:function(){
            _base.move.town.fastBottomLeft();
          },
        }
      },
    },
    cfg:{
      startRef:"topLeft"
    },
    state:{
      refStart:true,
      reportedRef: false
    },
    check : function(){
    	gn.player.screen.Refresh();
    	_base.closeDialogs();
    	if(!_base.townCheck()) return;
      if(!this.state.refStart){
        this.goToReferencePoint();
        return;
      }
      return true;
    },
    recenter:function(){
      gn.tools.Log("Recentering town", 0);
      gn.player.screen.Refresh();
      _base.closeAllDialogs();
      gn.player.screen.Refresh();
      gn.tools.Wait(1000);
      _base.changeMap(_gc.maps.world);
      _base.changeMap(_gc.maps.town);
    },
    resetStart : function(){
      this.state.refStart = false;
      this.state.reportedRef = false;
    },

    goToReferencePoint : function(){
      if(!this.scanReference()){
        this.refs.starts[this.cfg.startRef].move();
      }else{
        this.state.refStart = true;
        gn.tools.Log("Found " + this.refs.starts[this.cfg.startRef].title + " point.", 0);
      }
    },
    scanReference : function() {
      var ref = this.refs.starts[this.cfg.startRef];
      if(!this.state.reportedRef){
        gn.tools.Log("Looking for " + ref.title + " point.", 0);
        this.state.reportedRef = true;
      }
      var found = false
      for (var i = 0; i <  ref.image.length; i++) {
        found = ref.image[i].find();
        if(found)
        break;
      }
      return found;
    },
  }
})();

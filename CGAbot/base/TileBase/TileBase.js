(function(){
    var _gc = Include("base/GameConfig/GameConfig.js");
    var _f = IncludeExt("General/Framework/Framework.js");
    var _util = IncludeExt("General/Util/Util.js");
    var Image = _f != null ? _f.Image : function (){ return null};
    return{
      tiles:{
        rss:{
          tier1:{
            image: new Image(["Food1", "Food2"], 0.92, [46, 78, 297, 476]),
            name:"Food"
          },
          tier2:{
            image: new Image(["Lumber1", "Lumber2"], 0.92, [46, 78, 297, 476]),
            name:"Lumber"
          },
          tier3:{
            image: new Image(["Ore1", "Ore2"], 0.92, [46, 78, 297, 476]),
            name:"Ore"
          },
        }
      },
      images:{
        infoBtn:new Image('InfoBtn', 0.9, [66, 166, 295, 279]),
        gatherBtn:new Image('GatherBtn', 0.9, [66, 166, 295, 279]),
        //
        attack:new Image('AttackBtn', 0.9, [36, 489, 142, 42]), //normal
        attack:new Image('AttackBtn', 0.9, [210, 488, 159, 44]), //strong
        //
        indicatorGatherMenu:new Image('IndicatorGatherMenu', 0.9, [244, 574, 51, 43]),
        capacityFull:new Image('CapacityFull', 0.9, [126, 552, 131, 18]),
        teamFull:new Image('TeamFull', 0.9, [321, 98, 65, 65]),
        expeditionBtn:new Image('ExpeditionBtn', 0.9, [227, 606, 149, 38]),
        infoVip:new Image('InfoVip', 0.9, [24, 358, 353, 118]),
        lessTroops:new Image('LessTroops', 0.9, [40, 360, 147, 134]),
      },
      scan:function(list){
        for(var x in this.tiles.rss){
          for(var i = 0; i < list.length; i++){
            if(this.tiles.rss[x].name == list[i]){
              var tile = this.tiles.rss[x].image;
              var found = tile.find({tries:1, confirms:1});
              if(found !== undefined){
                gn.tools.log('Found: ' + this.tiles.rss[x].name, 0);
                gn.player.input.center(found[0].X, found[0].Y, 1500);
                gn.tools.wait(2000);
                gn.player.input.tap(0);
                return true;
              }
            }
          }
        }
      },
      gather:function(attack){
        gn.tools.wait(3000);
        if(this.images.infoBtn.find({tries:2, confirms:2}) && this.images.gatherBtn.tap({tries:1, confirms:1})){
          return true;
        }else if(attack && this.images.attack.tap()){
          return true;
        }else if(!attack && this.images.attack.tap()){
          return true;
        }
      },
      march:function(){
        if(this.images.indicatorGatherMenu.find({tries:2, confirms:2})){
          for(var i = 0; i < 8; i++){
              if(i<4){
                gn.player.input.tap(50+(i*100), 250);
              }
              else if(i>=4 && i<8){
                gn.player.input.tap(50+((i-4)*100), 350);
              }
            if(this.images.capacityFull.find({tries:2, confirms:1}) || !this.images.teamFull.find({tries:1, confirms:1})){
              break;
            }
          }
          if(this.images.expeditionBtn.tap({tries:1, confirms:1})){
            if(this.images.lessTroops.tap({tries:4, confirms:2})){
              Print('Less Troops');
            }
            if(this.images.expeditionBtn.find({tries:4, confirms:2})){
              return false;
            }else{
              return true;
            }
          }
        }else if(this.images.infoVip.find({tries:1, confirms:1})){
          // gn.tools.log('Not enough marches left', 0);
          return false;
        }
      },
    }
})();

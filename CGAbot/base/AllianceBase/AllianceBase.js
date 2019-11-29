(function(){
  var _wb = Include("base/WorldBase/WorldBase.js");
  var _util = IncludeExt("General/Util/Util.js");
  var _f = IncludeExt("General/Framework/Framework.js");
  var Image = _f != null ? _f.Image : function (){ return null};
  //
  return{
    images:{
      allianceBtn:new Image('AllianceBtn', 0.9, [343, 604, 39, 40]),
      indicatorAllianceMenu:new Image('IndicatorAllianceMenu', 0.9, [14, 604, 52, 41]),
      //buttons menu
      guildProvince:new Image('GuildProvince', 0.9, [17, 238, 362, 352]),
      guildResearch:new Image('GuildResearch', 0.9, [17, 238, 362, 352]),
      guildGifts:new Image('GuildGifts', 0.9, [17, 238, 362, 352]),
      //
    },
    allianceMenu:function(){
      if(this.images.allianceBtn.tap({tries:2, confirms:2})){
        if(this.images.indicatorAllianceMenu.find({tries:8, confirms:2})){
          return true;
        }
      }
    },
    allianceAction:function(button){
      if(this.images[button].tap({tries:2, confirms:2})){
        gn.tools.wait(2000);
        if(!this.images.indicatorAllianceMenu.find({tries:4, confirms:2})){
          return true;
        }
      }
    },

  }
})();

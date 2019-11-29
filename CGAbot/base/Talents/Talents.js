var _base = Include("base/Base/Base.js");
var _town = Include("base/TownBase/TownBase.js");
var _wb = Include("base/WorldBase/WorldBase.js");
var _tp = Include("base/TownPaths/TownPaths.js");
var _util = IncludeExt("General/Util/Util.js");
var _gc = Include("base/GameConfig/GameConfig.js");
var _f = IncludeExt("General/Framework/Framework.js");
var Image = _f != null ? _f.Image : function (){ return null};
//
var tooltips = {
  skip:'skip script for X minutes'
};

var cfg = {
  skip:0,
  //
  ExpediteGather:true,
  BumperHarvest:true,
  Safeguard:true,
};

var state = {
  line:0,
  list:[],
};

function listTalents(){
  if(cfg.ExpediteGather){
    this.state.list.push('ExpediteGather');
  }
  if(cfg.BumperHarvest){
    this.state.list.push('BumperHarvest');
  }
  if(cfg.Safeguard){
    this.state.list.push('Safeguard');
  }

}

var images = {
  talentBtn:new Image('TalentBtn', 0.9, [3, 455, 53, 57]),
  activateBtn:new Image('ActivateBtn', 0.94, [111, 601, 177, 46]),
  indicatorTalentMenu:new Image('IndicatorTalentMenu', 0.96, [0, 422, 28, 48]),
}

var posTalents = {
  ExpediteGather:[60, 500],
  BumperHarvest:[180, 500],
  Safeguard:[300, 500],
  // gather:[340, 360],
  // recall:[280, 360],
  // march:[400, 360],
  //swipe
  // lifePreserver:[360, 360],
  // surge:[320, 360],
  // heal:[390, 360],
};

function Start(){
  var left = _util.hasTimeLeft(gn.storage.Get("TalentsLastRunTime"), cfg.skip);
  if(left > 0){
    gn.tools.Log("Skipping Talents for " + Number(left / 60).toFixed(0) + " minutes.", 0);
    gn.actions.Finish();
  }else{
    gn.storage.Set("TalentsLastRunTime", gn.helper.Timestamp());
  }
  listTalents();
  gn.tools.log('Talents', 0);
}

function Pulse(){

  if(!_town.check()){
    return;
  }

  if(this.state.line == 0){
    if(talentMenu()){
      this.state.line = 'use';
    }
  }

  if(this.state.line == 'use'){
    if(useTalents()){
      gn.tools.log('Talents done', 0);
      this.state.line = 'done';
    }
  }

  if(this.state.line == 'done'){
    gn.actions.Finish();
  }

}

function talentMenu(){
  if(images.talentBtn.tap({tries:2, confirms:2})){
    gn.tools.wait(2000);
    if(images.indicatorTalentMenu.find({tries:2, confirms:2})){
      return true;
    }
  }
}

function useTalents(){
  loop1: for(var x in this.posTalents){
    for(var j = 0; j < this.state.list.length; j++){
      var talent = this.state.list;
      Print(x + ' ' + talent[j]);
      if(x == talent[j]){
        var pos = this.posTalents[x];
        gn.player.input.tap(pos[0], pos[1]);
        gn.tools.wait(2000);
        if(images.activateBtn.tap({tries:2, confirms:2})){
          gn.tools.log('Talent used: ' + x, 0);
          gn.tools.wait(4000);
          for(var i = 0; i < 10; i++){
            if(images.indicatorTalentMenu.find({tries:2, confirms:2})){
              continue loop1;
            }
          }
          gn.tools.log('Something went wrong', 0);
          return true;
        }else{
          gn.tools.log('Talent on cooldown: ' + x, 0);
        }
      }
    }
  }
  gn.tools.wait(1000);
  gn.player.input.tap(100, 100);
  return true;
}

function Finish(){
  gn.tools.log('Done', 0);
}

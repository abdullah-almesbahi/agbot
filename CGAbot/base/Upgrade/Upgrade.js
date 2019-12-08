var _base = Include("base/Base/Base.js");
var _town = Include("base/TownBase/TownBase.js");
var _tp = Include("base/TownPaths/TownPaths.js");
var _util = IncludeExt("General/Util/Util.js");
var _gc = Include("base/GameConfig/GameConfig.js");
var _f = IncludeExt("General/Framework/Framework.js");
var Image = _f != null ? _f.Image : function (){ return null};

var tooltips = {
 mainHall:'main building of your base',
 resources:'buildings in production field',
};

var cfg = {
  skip:0,
  //
  useResourcePacks:false,

  Upgrade:{
    value:'mainHall',
    options:['mainHall', 'resources'],
  },
  //
  Food:true,
  Wood:true,
  Ore:true,
  Infirmary:true,
  Barracks:true,
};

var state = {
  line:0,
  upgrade:true,
  list:[],
};

function setResources(){
  if(cfg.Food){
    this.state.list.push('Food');
  }
  if(cfg.Wood){
    this.state.list.push('Wood');
  }
  if(cfg.Ore){
    this.state.list.push('Ore');
  }
  if(cfg.Infirmary){
    this.state.list.push('Infirmary');
  }
  if(cfg.Barracks){
    this.state.list.push('Barracks');
  }
}

var images = {
  upgradeDialog:new Image('UpgradeDialog', 0.92, [51, 68, 294, 445]),
  upgradeDialog2:new Image('UpgradeDialog2', 0.92, [51, 68, 294, 445]),
  speedDialog:new Image('SpeedDialog', 0.92, [131, 375, 118, 129]),
  indicatorQueueFull:new Image('IndicatorQueueFull', 0.9, [228, 384, 43, 39]),
  indicatorUpgradeMenu:new Image('IndicatorUpgradeMenu', 0.9, [219, 561, 46, 45]),
  upgradeBtn:new Image('UpgradeBtn', 0.9, [220, 589, 159, 58]),
  freeBuildBtn:new Image('FreeBuildBtn', 0.94, [66, 570, 80, 34]),
  jumpBtn:new Image('JumpBtn', 0.94, [322, 243, 60, 315]),
  rss:{
    Food:new Image('Food', 0.92, [51, 54, 558, 359]),
    Wood:new Image('Wood', 0.92, [51, 54, 558, 359]),
    Ore:new Image('Ore', 0.92, [51, 54, 558, 359]),
    Infirmary:new Image('Infirmary', 0.92, [51, 54, 558, 359]),
    Barracks:new Image('Barracks', 0.92, [51, 54, 558, 359]),
  },
};

var queue = [];

function Start(){
  var left = _util.hasTimeLeft(gn.storage.Get("UpgradeLastRunTime"), cfg.skip);
  if(left > 0){
    gn.tools.Log("Skipping upgrade for " + Number(left / 60).toFixed(0) + " minutes.", 0);
    gn.actions.Finish();
  }else{
    gn.storage.Set("UpgradeLastRunTime", gn.helper.Timestamp());
  }

  if(cfg.Upgrade.value == 'mainHall'){
    queue = _tp.getPath("mainHall", upgradeMain);
  }

  if(cfg.Upgrade.value == 'resources'){
    queue = _tp.getPath("productions", resources);
  }

  setResources();
}

function Pulse(){

  if(!_town.check()){
    return;
  }

  if(!this.state.upgrade || !_util.exec(this.queue)){
    gn.actions.Finish();
  }
}

function resources(){
  gn.tools.wait(1000);
  gn.player.screen.refresh();
  for(var i = 0; i < this.state.list.length; i++){
    for(var x in images.rss){
      if(this.state.list[i] == x){
        var rss = images.rss[x];
        var found = rss.find({tries:1, confirms:1});
        if(found !== undefined){
          Print(found.length)
          gn.player.input.tap(found[0].X, found[0].Y);
          loop1: for(var k = 0; k < 4; k++){
            if(!images.indicatorUpgradeMenu.find({tries:3, confirms:2}) && !images.upgradeDialog.tap() && !images.upgradeDialog2.tap()){
              gn.player.input.tap(found[0].X, found[0].Y);
            }else if(images.speedDialog.find()){
              gn.tools.log('Queue is full', 0);
              this.state.upgrade = false;
              return;
            }else{
              for(var n = 0; n < 5; n++){
                if(checkUpgrade()){
                  this.state.upgrade = false;
                  return;
                }else{
                  continue loop1;
                }
              }
              break;
            }
          }
        }
      }
    }
  }
}

function checkArray(value){
  for(var i = 0; i < this.state.filter.length; i++){
    if(this.state.filter[i] == value){
      return true;
    }
  }
  return false;
}

function upgradeMain(){
  gn.tools.wait(2000);
  gn.player.input.tap(340, 310);

  for(var i = 0; i < 6; i++){
    gn.tools.wait(2000);
    if(upgradeDialog()){
      return;
    }
  }
}

function upgradeDialog(){
  if(images.upgradeDialog.tap({tries:5, confirms:2}) || images.upgradeDialog2.tap() || images.indicatorUpgradeMenu.find()){
    if(images.indicatorUpgradeMenu.find({tries:5, confirms:2})){
      if(checkUpgrade()){
        this.state.upgrade = false;
        return true;
      }
    }
  }else if(images.speedDialog.find()){
    gn.tools.log('Queue is full', 0);
    this.state.upgrade = false;
    return;
  }else{
    Print('didnt found dialog')
    gn.player.input.tap(0);
  }
}

function checkUpgrade(){
  if(images.freeBuildBtn.tap({tries:5, confirms:2, offset:{x:0, y:30}})){
    gn.tools.log('Building upgraeded for free', 0);
    return false;
  }else if(images.jumpBtn.tap({tries:1, confirms:1})){
    gn.tools.log('Jump to next building', 0);
    return false;
  }

  //use usePacks
  if(cfg.useResourcePacks){
    while(true){
      let result = _town.resource.usePacks(false);
      if(result == true){
        gn.tools.log('Enough Resources', 0);
        break;
      }else if(result == 'checkAgain'){
        //
      }else{
        gn.tools.log('Not Enough Resources', 0);
        this.state.upgrade = false;
        break;
      }
    }
    if(!this.state.upgrade){return}
  }
  //

  if(images.upgradeBtn.tap({tries:1, confirms:1})){
    if(images.indicatorQueueFull.find({tries:5, confirms:2})){
      gn.tools.log('Queue is full', 0);
      this.state.upgrade = false;
      return true;
    }
    gn.tools.log('Building upgrading', 0);
    return true;
  }
}


function Finish(){
  gn.tools.log('Done', 0);
}

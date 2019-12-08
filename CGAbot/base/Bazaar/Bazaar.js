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
  useGoldRefresh:true,
  //
  useFood:true,
  useWood:true,
  // useStone:true,
  //
  buyFood:true,
  buyWood:true,
  buyStone:true,
  //
  useResourcePacks:false,
};

var state = {
  line:0,
  bazzar:true,
  uselist:[],
  buylist:[],
};

var images = {
  bagBtn:new Image('BagBtn', 0.9, [208, 601, 50, 51]),
  indicatorBazzar:new Image('IndicatorBazzar', 0.9, [308, 166, 53, 57]),
  //
  useFood:'UseFood',
  useWood:'UseWood',
  // useStone:'missing',
  //
  buyFood:'BuyFood',
  buyWood:'BuyWood',
  buyStone:'BuyStone',
  //
  yesBtn:new Image('YesBtn', 0.9, [255, 418, 66, 41]),
  refreshFreeBtn:new Image('RefreshFreeBtn', 0.96, [32, 162, 139, 64]),
  refreshGoldBtn:new Image('RefreshGoldBtn', 0.94, [32, 162, 139, 64]),
  resetBtn:new Image('ResetBtn', 0.9, [212, 379, 98, 48]),
}

function Start(){
  var left = _util.hasTimeLeft(gn.storage.Get("bazzarLastRunTime"), cfg.skip);
  if(left > 0){
    gn.tools.Log("Skipping Bazzar for " + Number(left / 60).toFixed(0) + " minutes.", 0);
    gn.actions.Finish();
  }else{
    gn.storage.Set("bazzarLastRunTime", gn.helper.Timestamp());
  }
  list()
}

function list() {
  if(cfg.useFood){this.state.uselist.push('useFood')}
  if(cfg.useWood){this.state.uselist.push('useWood')}
  if(cfg.useStone){this.state.uselist.push('useStone')}

  if(cfg.buyFood){this.state.buylist.push('buyFood')}
  if(cfg.buyWood){this.state.buylist.push('buyWood')}
  if(cfg.buyStone){this.state.buylist.push('buyStone')}
}

function Pulse(){

  if(!_town.check()){
    return;
  }

  if(this.state.bazzar){
    if(openMenu()){
      bazzar()
      gn.tools.log('Bazzar done', 0);
      this.state.bazzar = false;
    }
  }

  if(!this.state.bazzar){
    gn.actions.Finish();
  }
}

function openMenu() {
  if(images.bagBtn.tap({tries:2, confirms:2})){
    gn.tools.wait(2000);
    gn.player.input.tap(340, 60);
    gn.player.input.tap(340, 60);
    gn.player.input.tap(340, 60);
    if(images.indicatorBazzar.find({tries:5, confirms:1})){
      return true;
    }
    gn.tools.log('Could not find Bazzar', 0);
  }
}

function bazzar() {
  for(var k = 0; k < 5; k++){
    findItems()

    if(images.refreshFreeBtn.tap({tries:4, confirms:2})){
      images.resetBtn.tap({tries:4, confirms:2});
      // gn.tools.log('No more free refresh for bazzar', 0);
    }else if(cfg.useGoldRefresh && images.refreshGoldBtn.tap()){
      images.resetBtn.tap({tries:4, confirms:2});
      gn.player.input.tap(200, 10);
      gn.player.input.tap(200, 10);
      // gn.tools.log('No more gold refresh for bazzar', 0);
    }else{
      gn.tools.log('No more refresh left', 0);
      gn.player.input.tap(200, 10);
      gn.player.input.tap(200, 10);
      return;
    }
  }
}
function findItems() {
  let items = {
    1:[6, 295, 96, 142],
    2:[101, 292, 96, 148],
    3:[197, 294, 96, 142],
    4:[293, 294, 94, 143],
  };

  for(var x in items){
    while(!images.indicatorBazzar.find({tries:3, confirms:1})){
      Print('get refreshed menu')
      gn.player.input.tap(200, 10)
    }
    for (var i = 0; i < this.state.buylist.length; i++) {
      if(new Image(images[this.state.buylist[i]], 0.9, items[x]).find()){
        buy: for (var j = 0; j < this.state.uselist.length; j++) {
          if(new Image(images[this.state.uselist[j]], 0.94, items[x]).tap({tries:2, confirms:1})){
            if(buy()){
              j--; //redo this step
              continue buy;
            }
          }
        }
      }
    }
  }
}

function buy() {
  if(images.yesBtn.tap({tries:5, confirms:2})){
    let result = _town.resource.usePacks(true, cfg.useResourcePacks);
    if(result == true || result == 'checkAgain'){
      // gn.tools.log('Enough Resources', 0);
      gn.tools.wait(1000)
      return true;
    }else{
      gn.tools.log('Not Enough Resources', 0);
    }
  }
}



function Finish(){
  gn.tools.log('Done', 0);
}

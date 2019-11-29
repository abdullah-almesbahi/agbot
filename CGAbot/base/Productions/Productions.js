var _base = Include("base/Base/Base.js");
var _town = Include("base/TownBase/TownBase.js");
var _tp = Include("base/TownPaths/TownPaths.js");
var _util = IncludeExt("General/Util/Util.js");
var _gc = Include("base/GameConfig/GameConfig.js");
var _f = IncludeExt("General/Framework/Framework.js");
var Image = _f != null ? _f.Image : function (){ return null};
//

var tooltips = {
  collectResources:'collect resources from fields',
}

var cfg = {
  collectResources:true,
  skip:0,
};

var images = {
  rssList:[
    new Image('Food', 0.92, [48, 84, 298, 429]),
    new Image('Wood', 0.92, [48, 84, 298, 429]),
    new Image('Ore', 0.92, [48, 84, 298, 429]),
  ],
};

var state = {
  line:0,
};

var queue = [];

function Start(){
  var left = _util.hasTimeLeft(gn.storage.Get("ProductionsLastRunTime"), cfg.skip);
  if(left > 0){
    gn.tools.Log("Skipping productions for " + Number(left / 60).toFixed(0) + " minutes.", 0);
    gn.actions.Finish();
  }else{
    gn.storage.Set("ProductionsLastRunTime", gn.helper.Timestamp());
  }
  queue = _tp.getPath("productions", scan);
}

function Pulse(){
  if(!_town.check()){
    return;
  }

  if(!_util.exec(queue)){
    gn.actions.Finish();
  }
}

function scan(){
  gn.tools.wait(1000);
  gn.player.screen.refresh();

  if(cfg.collectResources){
    for(var i = 0; i < images.rssList.length; i++){
      var found = images.rssList[i].find({tries:1, confirms:1});
      if(found !== undefined){
        for(var j = 0; j < found.length; j++){
          gn.player.input.tap(found[j].X, found[j].Y);
        }
      }
    }
  }
}

function Finish(){
  gn.tools.log('Done', 0);
}

var _base = Include("base/Base/Base.js");
var _town = Include("base/TownBase/TownBase.js");
var _tp = Include("base/TownPaths/TownPaths.js");
var _util = IncludeExt("General/Util/Util.js");
var _f = IncludeExt("General/Framework/Framework.js");
var Image = _f != null ? _f.Image : function (){ return null};

var tooltips = {
  repairWall:'repair damaged wall after attack',
};

var cfg = {
  repairWall:true,
  skip:0,
};

var state = {
  line:0,
  repairWall:true,
};

var images = {
  wallDialog:new Image(['WallDialog1', 'WallDialog2'], 0.92, [65, 94, 276, 415]),
  indicatorWallMenu:new Image('IndicatorWallMenu', 0.92, [214, 279, 84, 52]),
  recoverBtn:new Image('RecoverBtn', 0.92, [210, 466, 169, 64]),
};

function reset(){
  completed = {
    done: false
  };
}
var queue = [];

function Start(){
  reset();
  var left = _util.hasTimeLeft(gn.storage.Get("WallLastRun"), cfg.skip);
  if(left > 0){
    gn.tools.Log("Skipping Wall for " + Number(left / 60).toFixed(0) + " minutes.", 0);
    gn.actions.Finish();
  }else{
    gn.storage.Set("WallLastRun", gn.helper.Timestamp());
  }
 queue = _tp.getPath("wall", wall);
}


function Pulse(){
  if(!_town.check()){
    return;
  }

  if(!this.state.repairWall || !_util.exec(queue)){
    gn.actions.Finish();
  }

}

function wall(){
  gn.player.input.customSwipe(100, 190, 315, 380, 1500);
  gn.player.input.tap(200, 250);

  if(images.wallDialog.tap({tries:2, confirms:2})){
    if(images.indicatorWallMenu.find({tries:8, confirms:1})){
      if(images.recoverBtn.find({tries:1, confirms:1})){
        gn.tools.log('Wall is in good shape', 0);
      }else{
        gn.player.input.tap(270, 500);
        gn.player.input.tap(270, 500);
        gn.tools.log('Wall repairing', 0);
      }
    }
  }
  gn.tools.log('Wall done', 0);
  this.state.repairWall = false;
}

function Finish(){
  gn.tools.log('Done', 0);
}

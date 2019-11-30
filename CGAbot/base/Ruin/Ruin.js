
var _util = IncludeExt("General/Util/Util.js");
var _town = Include("base/TownBase/TownBase.js");
var _tp = Include("base/TownPaths/TownPaths.js");
var _f = IncludeExt("General/Framework/Framework.js");
var Image = _f != null ? _f.Image : function (){ return null};

var tooltips = {
  Ruin:'Auto use ruin',
};

var cfg = {
  Ruin:true,
};

var state = {
 ruin:true,
};

var images = {
  herosIcon : new Image('HerosIcon', 0.9, [83, 638, 21, 13]),
}

function reset(){
  completed = {
    done: false
  };
}
var queue = [];

function Start(){
  reset();
  var left = _util.hasTimeLeft(gn.storage.Get("RuinLastRun"), cfg.skip);
  if(left > 0){
    gn.tools.Log("Skipping Ruin for " + Number(left / 60).toFixed(0) + " minutes.", 0);
    gn.actions.Finish();
  }else{
    gn.storage.Set("RuinLastRun", gn.helper.Timestamp());
  }

  queue = _tp.getPath("wall", ruin);
}

function Pulse(){
  if(!_town.check()){
    return
  }

  if(!this.state.ruin || !_util.exec(queue)){
    gn.actions.Finish();
  }

}

function ruin(){
	gn.player.input.customSwipe(100, 190, 315, 380, 1500);
    return false;
}




function Finish(){
  gn.tools.log('Done Equipment', 0);
}

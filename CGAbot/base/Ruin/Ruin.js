
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
  canCollect : new Image('CanCollect', 0.9, [215, 418, 8, 12]),
  ruinIcon : new Image('RuinIcon', 0.9, [202, 431, 11, 20]),
  mysticQuarryIcon : new Image('MysticQuarryIcon', 0.9, [353, 175, 15, 17]),
  collectButton : new Image('CollectButton', 0.9, [173, 597, 21, 14]),
  enabledExcavateButton:  new Image('EnabledExcavateButton', 0.9, [171, 600, 20, 13])
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
	// speed = 1500 
	gn.player.input.customSwipe(0, 130, 415, 500, 1500);
	gn.tools.wait(1000);
	gn.player.input.tap(222, 362);
	gn.tools.wait(1000);
	if(images.ruinIcon.tap({tries:2,confirms:2})){
		gn.tools.wait(1000);
       if(images.mysticQuarryIcon.tap({tries:2,confirms:2})){
       	  // if can collect
       	  if(images.collectButton.find({tries:2,confirms:2})){
       	  	 // press on collect button
       	  	 images.collectButton.tap({tries:2,confirms:2});
       	  	 gn.tools.wait(1000);
       	  	 // close results dialog
       	  	 gn.player.input.tap(138, 50);
       	  }

       	  // if can Excavate Button clickable
       	  if(images.enabledExcavateButton.find({tries:2,confirms:2})){
       	  	 images.enabledExcavateButton.tap({tries:2,confirms:2});
       	  	 gn.tools.wait(1000);
       	  }
          
       } 
	}
    gn.tools.log('Ruin done', 0);
    this.state.ruin = false;
}




function Finish(){
  gn.tools.log('Done Equipment', 0);
}

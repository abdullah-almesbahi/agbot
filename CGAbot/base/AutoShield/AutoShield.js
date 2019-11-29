var _wb = Include("base/WorldBase/WorldBase.js");
var _base = Include("base/Base/Base.js");
var _util = IncludeExt("General/Util/Util.js");
var _mp = IncludeExt("General/MovePatterns/MovePatterns.js");
var _gc = Include("base/GameConfig/GameConfig.js");
var _f = IncludeExt("General/Framework/Framework.js");
var Image = _f != null ? _f.Image : function (){ return null};
//

var tooltips = {
  shield:'select protection shield for protecting your turf',
  skip:'skip script for X minutes',
};


var cfg = {
  shield:{
    value:"8Hours",
    options:["any", "8Hours", "24Hours", "3Days"]
  },
  skip:0,

};

var images = { //
  //shield
  buffDialog:new Image('BuffDialog', 0.9, [190, 131, 258, 219]),
  shieldBtn:new Image('ShieldBtn', 0.9, [7, 49, 81, 568]),
  shield:[
    new Image('Shield8h', 0.9, [4, 46, 393, 547]),
    new Image('Shield24h', 0.9, [4, 46, 393, 547]),
    new Image('Shield3d', 0.9, [4, 46, 393, 547]),
  ],
  // useBtn:[
  //   new Image('UseBtn', 0.92, [50, 148, 542, 88]),
  //   new Image('UseBtn', 0.92, [44, 236, 554, 91]),
  //   new Image('UseBtn', 0.92, [48, 327, 546, 75]),
  // ],
  buffBar:new Image('BuffBar', 0.92, [9, 51, 124, 107]),
  // confirmBtn:new Image('ConfirmBtn', 0.92, [316, 263, 162, 56]), //miss
};

var state = {
 shield:true,
};

function reset(){
  completed = {
    done:false,
  };
};

function Start(){
  reset();
  var left = _util.hasTimeLeft(gn.storage.Get("AutoShieldLastRun"), cfg.skip);
  if(left > 0){
    gn.tools.Log("Skipping autoshield for " + Number(left / 60).toFixed(0) + " minutes.", 0);
    gn.actions.Finish();
  }else{
    gn.storage.Set("AutoShieldLastRun", gn.helper.Timestamp());
  }
}

function Pulse(){

  if(!_wb.check()){
    return;
  }

  if(this.state.shield){
    if(!shield()){
      gn.tools.log('Couldnt activate any shield', 0);
    }
    this.state.shield = false;
    return;
  }

  if(_util.goals(this.completed) || !this.state.shield){
    gn.actions.Finish();
  }

}

function shield() {
  gn.tools.log('Check Shield', 0);
  gn.tools.wait(2000);
  gn.player.input.tap(190, 350);
  gn.tools.wait(2000);

  if(images.buffDialog.tap({tries:4, confirms:2})){
    gn.tools.wait(2000);
    // gn.player.input.customSwipe(200, 600, 200, 50, 2000);
    // gn.tools.wait(5000);

  if(images.shieldBtn.tap({tries:4, confirms:2, offset:{x:350, y:0}})){

    //check status
    if(images.buffBar.find({tries:4, confirms:2})){
      gn.tools.log('Shield is still activated', 0);
      return true;
    }else{
      gn.tools.log('New Shield required', 0);
    }

    gn.tools.wait(1000);
    if(cfg.shield.value === 'any'){
      for(var i = 0; i < images.shield.length; i++){
        var found = images.shield[i].find({tries:2, confirms:2});
        if(found !== undefined){
          var area = new Image('UseBtn', 0.9, [found[0].X, found[0].Y, 300, 100]);
          if(area.tap({tries:2, confirms:2})){
            gn.tools.wait(2000);
            // images.confirmBtn.tap({tries:2, confirms:2});
            gn.tools.log('Shield activated', 0);
            return true;

          }
        }
      }
        //
      }else if (cfg.shield.value === '8Hours') {
        gn.tools.log('Check: Shield 8h', 0);

        var found = images.shield[0].find({tries:2, confirms:2});
        if(found !== undefined){
          var area = new Image('UseBtn', 0.9, [found[0].X, found[0].Y, 300, 100]);
          if(area.tap({tries:2, confirms:2})){
            gn.tools.wait(2000);
            // images.confirmBtn.tap({tries:2, confirms:2});
            gn.tools.log('Shield activated', 0);
            return true;
          }
        }

        }else if (cfg.shield.value === '24Hours') {
          gn.tools.log('Check: Shield 24h', 0);

          var found = images.shield[1].find({tries:2, confirms:2});
          if(found !== undefined){
            var area = new Image('UseBtn', 0.9, [found[0].X, found[0].Y, 300, 100]);
            if(area.tap({tries:2, confirms:2})){
              gn.tools.wait(2000);
              // images.confirmBtn.tap({tries:2, confirms:2});
              gn.tools.log('Shield activated', 0);
              return true;
            }
          }

        }else if (cfg.shield.value === '3Days') {
          gn.tools.log('Check: Shield 3Days', 0);

          var found = images.shield[2].find({tries:2, confirms:2});
          if(found !== undefined){
            var area = new Image('UseBtn', 0.9, [found[0].X, found[0].Y, 300, 100]);
            if(area.tap({tries:2, confirms:2})){
              gn.tools.wait(2000);
              // images.confirmBtn.tap({tries:2, confirms:2});
              gn.tools.log('Shield activated', 0);
              return true;
            }
          }
        }
      }
    }
  }


function Finish(){
  gn.tools.log('Done', 0);
}

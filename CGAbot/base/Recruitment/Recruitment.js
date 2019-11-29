var _base = Include("base/Base/Base.js");
var _town = Include("base/TownBase/TownBase.js");
var _tp = Include("base/TownPaths/TownPaths.js");
var _util = IncludeExt("General/Util/Util.js");
var _gc = Include("base/GameConfig/GameConfig.js");
var _f = IncludeExt("General/Framework/Framework.js");
var Image = _f != null ? _f.Image : function (){ return null};

var tooltips = {
  Heal:'Heal wounded troops in infirmary',
};

var cfg = {
  skip:0,

  Level:{
    value:'lowest',
    options:['lowest', 'highest'],
  },
  Infantry:true,
  Stables:true,
  Range:true,
  Workshop:true,
  //
  Heal:true,
};

var state = {
  line:0,
  list:[],
  train:true,
  heal:true,
};

var images = {
  units:{
    Infantry:new Rectangle(232, 269, 65, 36), //Infantry
    Stables:new Rectangle(226, 303, 71, 32), //Stables
    Range:new Rectangle(232, 323, 64, 37), //Range
    Workshop:new Rectangle(221, 366, 83, 32), //Workshop
  },
  heal:new Image('Heal', 0.9, [2, 125, 66, 416]), //Heal
  notEnough:new Image('NotEnough', 0.9, [307, 451, 66, 108]),
  indicatorUnitsMenu:new Image('IndicatorUnitsMenu', 0.9, [227, 574, 48, 37]),
  //
  trainBtn:new Image('TrainBtn', 0.9, [221, 603, 154, 47]),
}

function reset(){
  if(cfg.Infantry){
    this.state.list.push('Infantry');
  }
  if(cfg.Stables){
    this.state.list.push('Stables');
  }
  if(cfg.Range){
    this.state.list.push('Range');
  }
  if(cfg.Workshop){
    this.state.list.push('Workshop');
  }
  if(cfg.Heal){
    this.state.list.push('Heal');
  }
}

function Start(){
  var left = _util.hasTimeLeft(gn.storage.Get("RecruitmentLastRunTime"), cfg.skip);
  if(left > 0){
    gn.tools.Log("Skipping recruitment for " + Number(left / 60).toFixed(0) + " minutes.", 0);
    gn.actions.Finish();
  }else{
    gn.storage.Set("RecruitmentLastRunTime", gn.helper.Timestamp());
  }
  //
  reset();
}

function Pulse(){

  if(!_town.check()){
    return;
  }

  if(this.state.train && (cfg.Infantry || cfg.Stables || cfg.Range || cfg.Workshop)){
    recruit();
    gn.tools.log('Troops done', 0);
    this.state.train = false;
    return;
  }else{
    this.state.train = false;
  }

  if(this.state.heal && cfg.Heal){
    hosptial();
    gn.tools.log('Heal done', 0);
    return;
  }else{
    this.state.heal = false;
  }

  if(!this.state.train && !this.state.heal){
    gn.actions.Finish();
  }

}

function hosptial(){
  if(_town.overview('hospital')){
    var inf = images.heal.find({tries:2, confirms:2});
    if(inf !== undefined){
      var area = new Rectangle(inf[0].X+200, inf[0].Y, 100, 90);
      if(_town.action(area)){
        if(heal()){
          gn.tools.log('Completed: Heal', 0);
        }
      }else{
        gn.tools.log('Units already recover', 0);
      }
    }
  }
  this.state.heal = false;
}

function heal(){
  if(images.indicatorUnitsMenu.find({tries:4, confirms:2})){
    if(images.notEnough.find({tries:1, confirms:1})){
      gn.player.input.tap(30, 20);
      gn.tools.wait(1000);
      gn.player.input.tap(30, 20);
      gn.tools.log('Not enough resources', 0);
      return true;
    }
    if(images.trainBtn.tap({tries:1, confirms:1})){
      gn.tools.wait(1000);
      gn.player.input.tap(30, 20);
      gn.tools.wait(1000);
      return true;
    }
  }
}

function recruit(){
  if(_town.overview('recruitment')){
    for(var i = 0; i < this.state.list.length; i++){
      for(var x in images.units){
        if(this.state.list[i] == x){
          gn.tools.wait(2000);
          gn.player.screen.Refresh();
          var area = images.units[x];
          gn.tools.wait(1000);
          gn.player.screen.Refresh();
          if(_town.action(area)){
            if(train()){
              gn.tools.log('Completed: ' + x, 0);
            }
          }else{
            gn.tools.log('Already in work: ' + x, 0);
          }
        }
      }
    }
  }
}

function train(){
  if(images.indicatorUnitsMenu.find({tries:4, confirms:2})){
    setLevel();
    if(images.notEnough.find({tries:1, confirms:1})){
      gn.player.input.tap(30, 20);
      gn.tools.wait(1000);
      gn.player.input.tap(30, 20);
      gn.tools.log('Not enough resources', 0);
      return true;
    }
    if(images.trainBtn.tap({tries:1, confirms:1})){
      gn.tools.wait(1000);
      gn.player.input.tap(30, 20);
      gn.tools.wait(1000);
      return true;
    }
  }
}

function setLevel(){
  //full manpower
  gn.player.input.tap(221, 534);
  //
  gn.tools.log('Troops level: ' + cfg.Level.value , 0);
  if(cfg.Level.value == 'lowest'){
    gn.player.input.customSwipe(20, 405, 450, 405, 1200);
  }
}

function Finish(){
  gn.tools.log('Done', 0);
}

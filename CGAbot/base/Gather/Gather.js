var _town = Include("base/TownBase/TownBase.js");
var _wb = Include("base/WorldBase/WorldBase.js");
var _tb = Include("base/TileBase/TileBase.js");
var _base = Include("base/Base/Base.js");
var _util = IncludeExt("General/Util/Util.js");
var _mp = IncludeExt("General/MovePatterns/MovePatterns.js");
var _gc = Include("base/GameConfig/GameConfig.js");
var _f = IncludeExt("General/Framework/Framework.js");
var Image = _f != null ? _f.Image : function (){ return null};
//


var tooltips = {
  buff:'activate gather buff',
  resourceLevel:'level of resource gather for vip',
  huntLevel:'level of units for hunt in vip',
  adjustLevel:'if level to high it will be reduced',
  marches:'how many groups you want sent',
  distance:'how far the bot will search for fields for NOvip',
  strongerAttack:'Use more energy for fighting rebels',
}
var cfg = {
  // buff:true,
  // buffOption:{
  //   value:"any",
  //   options:["any", "1Hours" ,"8Hours", "24Hours"]
  // },
  // elite:false,
  skip:0,

  vip:true,
  normal:true,
  //
  marches:4,
  distance:30,
  // rebel:false,
  strongerAttack:false,
  Rebel:true,
  Camp:false,
  Food:false,
  Lumber:false,
  Ore:false,
  Intruder:false,
  //
  LvRebel:4,
  LvCamp:1,
  LvFood:4,
  LvLumber:4,
  LvOre:4,
  LvIntruder:1,
  //
  up:true,
  right:true,
  down:true,
  left:true
};
var images = {
  //City buff
  // buffDialog:new Image('BuffDialog', 0.9, [2, 185, 393, 227]),
  // buffBtn:new Image('BuffBtn', 0.9, [6, 55, 90, 575]),
  // buff:[
  //   new Image('Buff1h', 0.9, [6, 123, 385, 102]),
  //   new Image('Buff8h', 0.9, [2, 220, 392, 107]),
  //   new Image('Buff24h', 0.9, [8, 322, 388, 98]),
  // ],
  // useBtn:[
  //   new Image('UseBtn', 0.9, [6, 123, 385, 102]),
  //   new Image('UseBtn', 0.9, [2, 220, 392, 107]),
  //   new Image('UseBtn', 0.9, [8, 322, 388, 98]),
  // ],
  // useBtnAmount:new Image('UseBtnAmount', 0.9, [104, 368, 188, 103]),
  // buffBar:new Image('BuffBar', 0.9, [148, 55, 24, 588]),
  // confirmBtn:new Image('ConfirmBtn', 0.92, [140, 322, 121, 68]),

  //vip
  vipGlass:new Image('VipGlass', 0.9, [339, 385, 57, 179]),
  vipSearchBtn:new Image('VipSearchBtn', 0.9, [116, 595, 163, 54]),
  infoVip:new Image('InfoVip', 0.9, [51, 391, 265, 39]),
  //normal search

};

var state = {
  line:0,
  marches:0,
  distance:0,
  //
  vip:true,
  normal:true,
  //
  move:[], //direction
  list:[], //resources
  done:[],
  // buff:true,
  //
  Rebel:0,
  Camp:0,
  Food:0,
  Lumber:0,
  Ore:0,
  Intruder:0,
};

function reset(){
  _util.fy(this.state.list); //resources
  Print('Reset list of move and resources');
}
function setLv(){
  this.state.Rebel = cfg.LvRebel;
  this.state.Camp = cfg.LvCamp;
  this.state.Food = cfg.LvFood;
  this.state.Lumber = cfg.LvLumber;
  this.state.Ore = cfg.LvOre;
  this.state.Intruder = cfg.LvIntruder;
}
function setList(){
  if(cfg.Food){
    this.state.list.push('Food');
  }
  if(cfg.Lumber){
    this.state.list.push('Lumber');
  }
  if(cfg.Ore){
    this.state.list.push('Ore');
  }
  if(cfg.Rebel){
    this.state.list.push('Rebel');
  }
  if(cfg.Camp){
    this.state.list.push('Camp');
  }
  if(cfg.Intruder){
    this.state.list.push('Intruder');
  }
}
function setDirections(){
  this.state.move = [];

  if(cfg.up){
    if(cfg.right){
      this.state.move.push('right');
      this.state.move.push('up');
    }
    if(cfg.left){
      this.state.move.push('left');
      this.state.move.push('up');
    }
    if(!cfg.right || !cfg.left){
      this.state.move.push('up');
      this.state.move.push('0');
    }
  }else if(cfg.right){
      this.state.move.push('right');
      this.state.move.push('0');
  }else if(cfg.left){
    this.state.move.push('left');
    this.state.move.push('0');
  }

  if(cfg.down){
    if(cfg.right){
      this.state.move.push('right');
      this.state.move.push('down');
    }
    if(cfg.left){
      this.state.move.push('left');
      this.state.move.push('down');
    }
    if(!cfg.right || !cfg.left){
      this.state.move.push('down');
      this.state.move.push('0');
    }
  }else if(cfg.right){
    this.state.move.push('right');
    this.state.move.push('0');
  }else if(cfg.left){
    this.state.move.push('left');
    this.state.move.push('0');
  }
  // this.state.move.length = 8;
}

function Start(){
  var left = _util.hasTimeLeft(gn.storage.Get("GatherLastRun"), cfg.skip);
  if(left > 0){
    gn.tools.Log("Skipping gather for " + Number(left / 60).toFixed(0) + " minutes.", 0);
    gn.actions.Finish();
  }else{
    gn.storage.Set("GatherLastRun", gn.helper.Timestamp());
  }
  setLv();
  setList();
  setDirections();
  reset();
}

function Pulse(){

  if(this.state.line == 0){
    // make sure this is world map screen other wise do not continue
    if(!_wb.check()){
      return;
    }
  }

  Print(this.state.marches);

  if(this.state.move.length <= 0){
    gn.tools.log('Too many tries/distance for gather over, skip action', 0);
    gn.actions.Finish();
  }

  //city buff
  // if(cfg.buff && this.state.buff){
  //   buff();
  //   this.state.buff = false;
  //   return;
  // }
  //city buff end

  //vip
  // tap search menu and double check search button is exists
  if(cfg.vip && this.state.vip){

    if(this.state.line == 0){
      if(vipMenu()){
        this.state.line = 'search';
      }
    }


    if(this.state.line == 'search'){
      if(vipSearch()){
        this.state.marches++;
        gn.tools.log('Marches: ' + this.state.marches + '/' + cfg.marches, 0);
      }else{
        gn.player.input.tap(200, 29);
        this.state.line = 0;
      }
      complete();
      return;
    }

  }else{
    this.state.vip = false;
  }

  //normal gather
  if(cfg.normal && this.state.normal){
    if(this.state.distance <= 0 && cfg.vip){
      gn.tools.log('Gather: Normal', 0);
      gn.player.input.tap(35, 620);
      gn.player.input.tap(35, 620);
      this.state.distance++;
      return;
    }

    if(this.state.line == 0){
      move();
      if(normal()){
        this.state.marches++;
        gn.tools.log('Marches: ' + this.state.marches + '/' + cfg.marches, 0);
      }
      complete();
    }


  }else{
    this.state.normal = false;
  }
  //normal end

  if(!this.state.normal && !this.state.vip){
    gn.player.input.tap(25, 25);
    gn.actions.Finish();
  }
}

//buff
// function buff() {
//   gn.tools.log('Check Gather Buff', 0);
//   gn.tools.wait(2000);
//   gn.player.input.tap(200, 270);
//   gn.tools.wait(2000);
//
//   if(images.buffDialog.tap({tries:4, confirms:2})){
//     gn.tools.wait(2000);
//     // gn.player.input.customSwipe(200, 600, 200, 50, 2000);
//     // gn.tools.wait(5000);
//
//     //check status
//     if(images.buffBar.find({tries:4, confirms:2})){
//       gn.tools.log('Buff is still activated', 0);
//       return true;
//     }else{
//       // gn.tools.log('New Shield required', 0);
//     }
//
//     if(images.buffBtn.tap({tries:4, confirms:2, offset:{x:150, y:0}})){
//       gn.tools.wait(1000);
//       if(cfg.buffOption.value === 'any'){
//         for(var i = 0; i < images.buff.length; i++){
//           if(images.buff[i].find({tries:2, confirms:2}) && images.useBtn[i].tap({tries:2, confirms:2})){
//             gn.tools.wait(2000);
//             if(images.confirmBtn.tap({tries:2, confirms:2}) || images.useBtnAmount.tap({tries:2, confirms:2})){
//               gn.tools.log('Buff activated', 0);
//               return true;
//             }
//           }
//         }
//       //
//     }else if (cfg.buffOption.value === '1Hours') {
//         if(images.buff[0].find({tries:2, confirms:2}) && images.useBtn[0].tap({tries:2, confirms:2})){
//           gn.tools.wait(2000);
//           if(images.confirmBtn.tap({tries:2, confirms:2}) || images.useBtnAmount.tap({tries:2, confirms:2})){
//             gn.tools.log('Buff activated 1hours', 0);
//             return true;
//           }
//         }
//
//       }else if (cfg.buffOption.value === '8Hours') {
//         if(images.buff[1].tap({tries:2, confirms:2}) && images.useBtn[1].tap({tries:2, confirms:2})){
//           gn.tools.wait(2000);
//           if(images.confirmBtn.tap({tries:2, confirms:2}) || images.useBtnAmount.tap({tries:2, confirms:2})){
//             gn.tools.log('Buff activated 8hours', 0);
//             return true;
//           }
//         }
//
//       }else if (cfg.buffOption.value === '24Hours') {
//         if(images.buff[2].tap({tries:2, confirms:2}) && images.useBtn[1].tap({tries:2, confirms:2})){
//           gn.tools.wait(2000);
//           if(images.confirmBtn.tap({tries:2, confirms:2}) || images.useBtnAmount.tap({tries:2, confirms:2})){
//             gn.tools.log('Buff activated 24hours', 0);
//             return true;
//           }
//         }
//       }
//     }
//   }
// }
//buff end

//vip
function vipMenu(){
  if(images.vipGlass.tap({tries:4, confirms:2})){
    if(images.vipSearchBtn.find({tries:6, confirms:2})){
      return true;
    }
  }
}

function vipSearch(){
  var pos = {
    Rebel:[30 ,450],
    Camp:[100 ,450],
    Food:[170 ,450],
    Lumber:[230 ,450],
    Ore:[300 ,450],
    Intruder:[360 ,450],
  };

  _util.fy(this.state.list); //resources

  for(var x in pos){
    Print('List ' + this.state.list.length);
    if(x == this.state.list[0]){
      gn.tools.log('Resource: ' + x, 0);
      var tile = pos[x];
      gn.player.input.tap(tile[0], tile[1]);
      for(var i = 0; i < this.state[x]; i++){
        if(setLevel(x)){
          // click on the center of map and show resourse options
          gn.player.input.tap(200, 330);
          if(!_tb.canSendRebel()){
              return;
          }
          if(_tb.gather()){
            if(_tb.march(cfg.strongerAttack)){
              gn.tools.log('Send: ' + x, 0);
              return true;
            }else{
              this.state.marches = cfg.marches;
              return;
            }
          }else{
            gn.player.input.tap(200, 29);
            return false;
          }
        }else{
          return false;
        }
      }
    }
  }
}

function setLevel(rss){
  //reset
  gn.player.input.tap(128, 552);
  gn.player.input.tap(90, 552);
  gn.player.input.tap(90, 552);
  gn.player.input.tap(90, 552);
  //
  gn.tools.log('Level: ' + this.state[rss], 0);
  for(var i = 0; i < this.state[rss]-1; i++){
    gn.player.input.tap(290, 552);
  }
  //
  if(images.vipSearchBtn.tap({tries:2, confirms:2})){
    //
    this.state[rss]--;
    if(this.state[rss] <= 0){
      // this.state.done.push(this.state[rss]);
      this.state.list = this.state.list.slice(1, this.state.list.length);
    }
    //
    gn.tools.wait(2000);
    if(!images.vipSearchBtn.find({tries:2, confirms:1})){
      return true;
    }
  }

}
//vip end

//normal
function normal(){
  Print('Search');
  //
  gn.tools.wait(1500);
  gn.player.screen.refresh();
  if(_tb.scan(this.state.list)){
    if(_tb.gather()){
      if(_tb.march()){
        return true;
      }else{
        this.state.marches = cfg.marches;
      }
    }else{
      gn.player.input.tap(0); //reselecting tile
      gn.player.input.tap(200, 29); //if monster get clicked
      return false;
    }
  }
}

function move(){

  if(this.state.move.length > 0 && this.state.distance > cfg.distance){
    this.state.move = this.state.move.slice(2, this.state.move.length);
    this.state.distance = 0;
    gn.tools.log('Reset distance and change direction: ' + this.state.move.length, 0);
    if(!cfg.vip){
      gn.player.input.tap(35, 620);
      gn.player.input.tap(35, 620);
    }
    return true;
  }
  this.state.distance++;

  for(var i = 0; i < 2; i++){
    loop1: switch(this.state.move[i]){
      case 'up':
        gn.player.input.customSwipe(5, 320, 5, 570, 1000); //+250
        break loop1;
      case 'down':
        gn.player.input.customSwipe(5, 320, 5, 70, 1000); //-250
        break loop1;
      case 'right':
        gn.player.input.customSwipe(395, 320, 145, 320, 1000); //-250
        break loop1;
      case 'left':
        gn.player.input.customSwipe(5, 320, 255, 320, 1000); //+250
        break loop1;
      default:
      break loop1;
    }
  }
}
//normal end

function complete(){
  if(this.state.marches >= cfg.marches || images.infoVip.find({tries:2, confirms:2})){
    gn.tools.log('No more marches left', 0);
    this.state.vip = false;
    this.state.normal = false;
  }
  if(this.state.list.length <= 0){
    gn.tools.log('No more tiles in list', 0);
    this.state.vip = false;
  }
}


function Finish(){
  gn.tools.Log("Done", 0);
}

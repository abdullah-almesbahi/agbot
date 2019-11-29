var _wb = Include("base/WorldBase/WorldBase.js");
var _base = Include("base/Base/Base.js");
var _util = IncludeExt("General/Util/Util.js");
var _mp = IncludeExt("General/MovePatterns/MovePatterns.js");
var _gc = Include("base/GameConfig/GameConfig.js");
var _f = IncludeExt("General/Framework/Framework.js");
var Image = _f != null ? _f.Image : function (){ return null};
//


var tooltips = {
  Transfer:'choose what system you want to send resources',
  TransferAlliance:'where is the player you want send your resources',
  TransferBookmark:'bot will look in the category "Friends"',
  Priority:'what kind of resources should picked at the beginning',
  Percentage:'how much resources do you want to send',
  Marches:'how many Transfers you want send',
};

var cfg = {
  skip:0,

  Transfer:{
    value:'bookmark',
    options:['bookmark'],
  },
  // TransferAlliance:{
  //   value:'commander',
  //   options:['commander', 'general1', 'general2', 'general3'],
  // },
  TransferBookmark:{
    value:'position1',
    options:['position1', 'position2', 'position3'],
  },
  Priority:{
    value:'Lumber',
    options:['none', 'Food', 'Lumber', 'Iron'],
  },
  Percentage:{
    value:'25%',
    options:['100%', '75%', '50%', '25%'],
  },
  Marches:2,
  Food:true,
  Lumber:true,
  Iron:true,
};

var images = {
  //book
  bookmarkBtn:new Image('BookmarkBtn', 0.9, [120, 527, 44, 39]),
  indicatorBook:new Image('IndicatorBook', 0.9, [150, 0, 113, 44]),
  // friendsBtn:new Image('FriendsBtn', 0.9, [317, 109, 124, 39]),
  friends:[
    new Image('GotoBtn', 0.9, [9, 85, 84, 79]),
    new Image('GotoBtn', 0.9, [6, 168, 91, 80]),
    new Image('GotoBtn', 0.9, [10, 244, 83, 82]),
  ],
  tradeDialog:new Image('TradeDialog', 0.9, [156, 143, 324, 264]),
  //alliance
  // allianceBtn:new Image('AllianceBtn', 0.9, [408, 426, 51, 53]),
  // allianceMemberBtn:new Image('AllianceMemberBtn', 0.9, [256, 3, 125, 38]),
  // indicatorMember:new Image('IndicatorMember', 0.9, [30, 87, 52, 48]),
  // allianceOpenBtn:new Image('AllianceOpenBtn', 0.9, [548, 266, 57, 50]),
  // allianceSendBtn:new Image('AllianceSendBtn', 0.9, [405, 232, 103, 92]),
  //send
  indicatorSendMenu:new Image('IndicatorSendMenu', 0.9, [150, 91, 58, 55]),
  sendBtn:new Image('SendBtn', 0.9, [107, 604, 184, 37]),
  infoVip:new Image('InfoVip', 0.9, [51, 391, 265, 39]),
};

var state = {
  line:0,
  pos:0,
  list:[],
  marches:0,
  tries:0,
};

function settings(){
  //Transfer
  if(cfg.Transfer.value == 'bookmark'){
    Print('Transfer: ' +  cfg.Transfer.value +  ' ' + cfg.TransferBookmark.value);
    if(cfg.TransferBookmark.value == 'position1'){
      this.state.pos = 1;
    }else if(cfg.TransferBookmark.value == 'position2'){
      this.state.pos = 2;
    }else if(cfg.TransferBookmark.value == 'position3'){
      this.state.pos = 3;
    }
  }
  // else if(cfg.Transfer.value == 'alliance'){
  //   Print('Transfer: ' +  cfg.Transfer.value +  ' ' + cfg.TransferAlliance.value);
  //   if(cfg.TransferAlliance.value == 'commander'){
  //     this.state.pos = 1;
  //   }else if(cfg.TransferAlliance.value == 'general1'){
  //     this.state.pos = 2;
  //   }else if(cfg.TransferAlliance.value == 'general2'){
  //     this.state.pos = 3;
  //   }else if(cfg.TransferBookmark.value == 'general3'){
  //     this.state.pos = 4;
  //   }
  // }
  //resources
  if(cfg.Food){
    this.state.list.push('Food');
  }
  if(cfg.Lumber){
    this.state.list.push('Lumber');
  }
  if(cfg.Iron){
    this.state.list.push('Iron');
  }
  if(cfg.Priority.value !== 'none'){
    this.state.list.unshift(cfg.Priority.value);
  }
}

function Start(){
  var left = _util.hasTimeLeft(gn.storage.Get("TransferLastRun"), cfg.skip);
  if(left > 0){
    gn.tools.Log("Skipping Transfer for " + Number(left / 60).toFixed(0) + " minutes.", 0);
    gn.actions.Finish();
  }else{
    gn.storage.Set("TransferLastRun", gn.helper.Timestamp());
  }
  settings();
  gn.tools.log('Transfer: ' + cfg.Transfer.value + ' ' + 'Amount: ' + cfg.Percentage.value, 0);
}

function Pulse(){

  if(this.state.line == 0 && !_wb.check()){
    return;
  }

  if(this.state.tries >= 3){
    gn.tools.log('Too many tries for Transfer, skip', 0);
    this.state.line = 'done';
  }

  if(this.state.line == 0){
    this.state.tries++;

    if(cfg.Transfer.value == 'bookmark'){
      gn.player.input.customSwipe(50, 200, 300, 200, 1000);
      gn.player.input.customSwipe(50, 200, 300, 200, 1000);
      if(bookmark()){
        this.state.line = 'send';
      }else{
        this.state.tries++;
      }
      return;
    }else{
      // if(alliance()){
      //   this.state.line = 'member';
      // }else{
      //   this.state.tries++;
      // }
      // return;
    }
  }

  // if(this.state.line == 'member'){
  //   if(chooseMember()){
  //     this.state.line = 'send';
  //   }else{
  //     this.state.line = 0;
  //   }
  //   return;
  // }

  if(this.state.line == 'send'){
    if(send()){
      this.state.tries = 0;
      gn.tools.log('Marches: ' + this.state.marches + '/' + cfg.Marches, 0);
      //
      if(this.state.marches < cfg.Marches){
        if(!redo()){
          this.state.line = 'done';
        }
        return;
      }
      //
      this.state.line = 'done';
    }else{
      this.state.line = 0;
    }
    return;
  }


  if(this.state.line == 'done'){
    gn.tools.log('Transfer done', 0);
    gn.actions.Finish();
  }
}

function redo(){
  if(cfg.Transfer.value == 'alliance'){
    this.state.line = 'member';
    return true;
  }else{
    gn.player.input.tap(0);
    gn.tools.wait(2000);
    if(images.tradeDialog.tap({tries:4, confirms:2})){
      return true;
    }
  }
}

function bookmark(){
  if(images.bookmarkBtn.tap({tries:3, confirms:2})){
    if(!images.indicatorBook.find({tries:5, confirms:2})){
      gn.tools.log('Failed to open bookmark', 0);
    }
    gn.player.input.tap(250, 60);
    gn.player.input.tap(250, 60);
    gn.player.input.tap(250, 60);
    gn.tools.wait(2000);
    // if(images.friendsBtn.tap({tries:4, confirms:2})){
    //   gn.tools.wait(2000);
      if(images.friends[this.state.pos-1].tap({tries:4, confirms:2})){
        gn.tools.wait(3000);
        for(var i = 0; i < 3; i++){
          if(!images.tradeDialog.tap({tries:2, confirms:2})){
            gn.player.input.tap(320, 280);
            gn.tools.wait(2000);
          }else{
            break;
          }
        }
        if(!images.infoVip.find({tries:4, confirms:2})){
          gn.tools.log('Send resources', 0);
          return true;
        }else{
          gn.tools.log('No more Marches for Transfer', 0);
          return false;
        }
      // }
    }
  }
}

// function alliance(){
//   if(images.allianceBtn.tap({tries:2, confirms:2})){
//     gn.tools.wait(2000);
//     if(images.allianceMemberBtn.tap({tries:4, confirms:2})){
//       gn.tools.wait(2000);
//       if(images.indicatorMember.find({tries:4, confirms:2})){
//         return true;
//       }
//     }
//   }
// }

// function chooseMember(){
//   var memberPos = {
//     1:[320, 210],
//     2:[135, 380],
//     3:[325, 380],
//     4:[510, 380],
//   }
//
//   gn.tools.wait(2000);
//   for(var x in memberPos){
//     if(this.state.pos == x){
//       if(this.state.pos !== 1){
//         if(images.allianceOpenBtn.tap({tries:4, confirms:2})){
//           Print('open member');
//           gn.tools.wait(1500);
//         }
//       }
//       var member = memberPos[x];
//       gn.player.input.tap(member[0], member[1]);
//       gn.tools.wait(2000);
//       if(images.allianceSendBtn.tap({tries:4, confirms:2})){
//         return true;
//       }
//     }
//   }
// }

function send(){
  Print('send');
  var rssPos = {
    Food:[250, 265],
    Lumber:[250, 330],
    Iron:[250, 390],
  }

  if(images.indicatorSendMenu.find({tries:6, confirms:2})){
    var percant = percantage();
    for(var i = 0; i < this.state.list.length; i++){
      for(var y in rssPos){
        if(this.state.list[i] == y){
          var pos = rssPos[y];
          gn.tools.log('Select: ' + cfg.Percentage.value + ' ' + y, 0);
          gn.player.input.tap(pos[0]-percant, pos[1]); //x250 max
          gn.tools.wait(500);
        }
      }
    }

    if(images.sendBtn.tap({tries:6, confirms:2})){
      gn.tools.wait(2000);
      if(!images.indicatorSendMenu.find({tries:2, confirms:2})){
        this.state.marches++;
        return true;
      }
    }

  }
}

function percantage(){
  switch(cfg.Percentage.value){
    case '100%':
      return 0;
    case '75%':
      return 32;
    case '50%':
      return 64;
    case '25%':
      return 98;
  }
}

function Finish(){
  gn.tools.Log("Done", 0);
}

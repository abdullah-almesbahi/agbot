var _base = Include("base/Base/Base.js");
var _town = Include("base/TownBase/TownBase.js");
var _tp = Include("base/TownPaths/TownPaths.js");
var _util = IncludeExt("General/Util/Util.js");
var _f = IncludeExt("General/Framework/Framework.js");
var Image = _f != null ? _f.Image : function (){ return null};

var tooltips = {
  skip:'skip scripts for X minutes'
};

var cfg = {
  skip:0,
  FountainWish:{
    value:'food',
    options:['off', 'food', 'lumber', 'iron'],
  },
  HeroesHall:false,
  Quest:false,
  LoginGift:false,
  Activities:false,
};

var state = {
  line:0,
  heroes:true,
  wish:true,
  quest:true,
  loginGift:true,
  activities:true,
};

var images = {
  heroes:new Rectangle(223, 359, 76, 72),
  fountain:new Rectangle(227, 469, 71, 46),
  //heroes
  indicatorHeroes:new Image('IndicatorHeroes', 0.9, [1, 232, 57, 83]),
  pots:[
    new Image('Cooldown', 0.9, [7, 609, 104, 41]),
    new Image('Gold', 0.9, [146, 627, 111, 25]),
    new Image('Gold', 0.9, [269, 592, 122, 59]),
  ],
  recruitAgain:new Image('RecruitAgain', 0.94, [128, 374, 141, 38]),
  useItem:new Image('UseItem', 0.94, [139, 373, 111, 41]),
  //fountain
  indicatorFountain:new Image('IndicatorFountain', 0.9, [25, 439, 80, 84]),
  freeBtn:{
    food:new Image('FreeBtn', 0.96, [14, 611, 101, 36]),
    lumber:new Image('FreeBtn', 0.96, [145, 606, 104, 45]),
    iron:new Image('FreeBtn', 0.96, [278, 607, 106, 42]),
  },
  yesBtn:new Image('YesBtn', 0.9, [125, 407, 147, 37]),
  //quest
  questBtn:new Image('QuestBtn', 0.9, [134, 597, 64, 54]),
  indicatorQuest:new Image('IndicatorQuest', 0.9, [154, 4, 85, 39]),
  collectBtn:new Image('CollectBtn', 0.92, [283, 91, 113, 554]),
  collectBtn2:new Image('CollectBtn2', 0.92, [103, 509, 193, 62]),
  claimBtn:new Image('ClaimBtn', 0.9, [263, 267, 123, 50]),
  //logingift
  loginGiftBtn:new Image('LoginGiftBtn', 0.9, [302, 345, 93, 214]),
  claimGiftBtn:new Image('ClaimGiftBtn', 0.9, [123, 521, 148, 44]),
  //activities
  claimBox:new Image('ClaimBox', 0.9, [346, 76, 49, 227]),
  indicatorClaimBox:new Image('IndicatorClaimBox', 0.9, [142, 5, 114, 37]),
  vipBox:{
    6:new Image('Chest', 0.9, [220, 483, 148, 167]),
    5:new Image('Chest', 0.9, [21, 501, 148, 148]),
    4:new Image('Chest', 0.9, [200, 371, 173, 156]),
    3:new Image('Chest', 0.9, [27, 367, 145, 150]),
    2:new Image('Chest', 0.9, [237, 191, 133, 136]),
    1:new Image('Chest', 0.9, [20, 150, 170, 185]),
  }
};

function Start(){
  var left = _util.hasTimeLeft(gn.storage.Get("DailiesLastRun"), cfg.skip);
  if(left > 0){
    gn.tools.Log("Skipping dailies for " + Number(left / 60).toFixed(0) + " minutes.", 0);
    gn.actions.Finish();
  }else{
    gn.storage.Set("DailiesLastRun", gn.helper.Timestamp());
  }
}

function Pulse(){
  if(!_town.check()){
    return;
  }

  if(cfg.HeroesHall && this.state.heroes){
    if(heroesHall()){
      if(collectFree()){
        this.state.heroes = false;
      }
    }
  }else{
    this.state.heroes = false;
  }

  if(cfg.FountainWish.value !== 'off' && this.state.wish){
    if(fountain()){
      if(wish()){
        this.state.wish = false;
      }
    }
    return;
  }else{
    this.state.wish = false;
  }

  if(cfg.Quest && this.state.quest){
    if(quest()){
      this.state.quest = false;
    }
    return;
  }else{
    this.state.quest = false;
  }

  if(cfg.LoginGift && this.state.loginGift){
    loginGift();
    this.state.loginGift = false;
    return;
  }else{
    this.state.loginGift = false;
  }

  if(cfg.Activities && this.state.activities){
    if(activities()){
      if(chests()){
        this.state.activities = false;
      }
    }
    return;
  }else{
    this.state.activities = false;
  }

  if(!this.state.heroes && !this.state.wish && !this.state.quest && !this.state.loginGift && !this.state.activities){
    gn.actions.Finish();
  }
}

function activities(){
  for(var i = 0; i < 2; i++){
    if(!images.claimBox.tap({tries:4, confirms:2})){
      gn.player.input.tap(370, 145);
    }else{
      return true;
    }
  }
  gn.tools.log('Couldnt found Claim Box', 0);
}

function chests(){
  for(var i = 0; i < 2; i++){
    gn.player.input.tap(100+(i*100), 60);
    gn.tools.wait(2000);
    if(i == 0){
      gn.tools.log('Playtime Chest', 0);
      gn.player.input.tap(200, 240);
      gn.tools.wait(3000);
      gn.player.input.tap(200, 20);
      gn.tools.wait(1000);
    }else if(i == 1){
      gn.player.input.customSwipe(200, 400, 200, 100, 1500);
      gn.tools.wait(1000);
      gn.player.screen.refresh();
      for(var x in images.vipBox){
        if(images.vipBox[x].tap({tries:1, confirms:1})){
          gn.tools.log('Vip Chest collected', 0);
          gn.tools.wait(3000);
          gn.player.input.tap(200, 20);
          return true;
        }
      }
      gn.tools.log('No Vip Chest available', 0);
    }
  }
  return true;
}

function loginGift(){
  if(images.loginGiftBtn.tap({tries:4, confirms:2})){
    if(images.claimGiftBtn.tap({tries:4, confirms:2})){
      gn.tools.log('Collect login gift', 0);
    }
  }else{
    gn.tools.log('No login gift available', 0);
  }
}

function quest(){
  if(images.questBtn.tap({tries:4, confirms:2})){
    if(images.indicatorQuest.find({tries:6, confirms:2})){
      //
      for(var i = 0; i < 3; i++){
        gn.player.input.tap(50+(i*150), 60); //pages
        gn.tools.log('Quest Page: ' + (i+1), 0);
        //
        gn.tools.wait(2000);
        if(i == 0){
          questPage1();
        }else if(i == 1){
          questPage2();
        }else if(i == 2){
          questPage3();
        }
      }
      //
    }
  }
  return true;
}

function questPage1(){
  for(var i = 0; i < 5; i++){
    //
    var found = images.collectBtn.find({tries:2, confirms:2});
    if(found !== undefined){
      for(var j = 0; j < found.length; j++){
        gn.player.input.tap(350, 290); //always the first
        gn.tools.wait(1000);
      }
    }else{
      gn.tools.log('No more rewards', 0);
      break;
    }
    //
  }
}

function questPage2(){
  var pos = {
    1:[60, 137],
    2:[100, 210],
    3:[150, 137],
    4:[190, 210],
    5:[230, 137],
    6:[280, 210],
    7:[320, 137],
    8:[350, 210],
  };

  for(var x in pos){
    var po = pos[x];
    gn.player.input.tap(po[0], po[1]);
    gn.tools.wait(2000);
    if(images.collectBtn2.tap({tries:2, confirms:2})){
      gn.tools.log('Collect Box: ' + x, 0);
      gn.tools.wait(2000);
      gn.player.input.tap(200, 20); // get out of congrats info
      gn.tools.wait(1000);
    }else{
      gn.player.input.tap(200, 20); // close winodw
      gn.tools.wait(1000);
    }
  }
}

function questPage3(){
  var pos = {
    1:[50, 124],
    2:[130, 124],
    3:[230, 124],
    4:[310, 124],
    //swipe
    5:[260, 124],
    6:[350, 124],
  };

  for(var x in pos){
    if(x >= 5){
      gn.player.input.customSwipe(360, 124, 50, 124, 1500);
    }
    var po = pos[x];
    gn.player.input.tap(po[0], po[1]);
    gn.tools.log('Collect Page: ' + x, 0);
    gn.tools.wait(2000);
    loop1: for(var i = 0; i < 10; i++){
      if(images.claimBtn.tap({tries:2, confirms:2})){
        gn.tools.wait(3500);
      }else{
        break loop1;
      }
    }
    var found = images.collectBtn.find({tries:2, confirms:2});
    if(found !== undefined){
      for(var j = 0; j < found.length; j++){
        gn.player.input.tap(found[j].X, found[j].Y);
        gn.tools.wait(1000);
      }
    }
  }
}

function fountain(){
  if(_town.overview()){
    gn.tools.wait(1000);
    gn.player.input.customSwipe(160, 500, 160, 0, 1000);
    gn.tools.wait(1000);
    gn.player.input.tap(270, 490);
    if(images.indicatorFountain.find({tries:6, confirms:2})){
      return true;
    }
  }
}

function wish(){
  for(var x in images.freeBtn){
    if(cfg.FountainWish.value == x){
      if(images.freeBtn[x].tap({tries:2, confirms:2})){
        gn.tools.wait(1000);
        if(images.yesBtn.tap({tries:4, confirms:2})){
          gn.tools.log('Wish: ' + x, 0);
          return true;
        }
      }else{
        gn.tools.log('No more wishes', 0);
        return true;
      }
    }
  }
}

function heroesHall(){
  if(_town.overview()){
    gn.tools.wait(1000);
    gn.player.input.customSwipe(160, 500, 160, 0, 1000);
    gn.tools.wait(1000);
    gn.player.input.tap(270, 380);
    if(images.indicatorHeroes.find({tries:6, confirms:2})){
      return true;
    }
  }
}

function collectFree(){
  Print('collect');
  //
  gn.tools.wait(1000);
  gn.player.screen.refresh();
  //
  for(var i = 0; i < images.pots.length; i++){
    if(!images.pots[i].find({tries:1, confirms:1})){
      gn.player.input.tap(40+(i*150), 535);
      gn.tools.wait(2000);
      if(i == 0){
        loop1: for(var j = 0; j < 20; j++){
          if(images.recruitAgain.tap({tries:2, confirms:2})){
            gn.tools.wait(3000);
          }else{
            gn.tools.log('No more normal recurits left', 0);
            back();
            break loop1;
          }
        }
      }else if(i == 1){
        loop2: for(var j = 0; j < 20; j++){
          if(images.useItem.tap({tries:2, confirms:2})){
            gn.tools.wait(3000);
          }else{
            gn.tools.log('No more normal recurits left', 0);
            back();
            break loop2;
          }
        }
      }else if(i == 2){
        gn.tools.log('No more special recurits left', 0);
        back();
      }
      gn.tools.wait(1000);
      gn.player.screen.refresh();
    }else{
      gn.tools.log('Heroes ' + i + ': Done', 0);
    }
  }
  return true;
}

function back(){
  for(var i = 0; i < 10; i++){
    if(images.indicatorHeroes.find({tries:2, confirms:2})){
      return true;
    }else{
      gn.player.input.tap(40, 20);
    }
  }
}

function Finish(){
  gn.tools.log('Done', 0);
}

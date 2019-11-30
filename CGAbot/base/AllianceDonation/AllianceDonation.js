var _base = Include("base/Base/Base.js");
var _ab = Include("base/AllianceBase/AllianceBase.js");
var _util = IncludeExt("General/Util/Util.js");
var _town = Include("base/TownBase/TownBase.js");
var _f = IncludeExt("General/Framework/Framework.js");
var Image = _f != null ? _f.Image : function (){ return null};

var tooltips = {
  AllianceDonation:'donate for alliance technology',
  AllianceGift:'collect gifts from alliance',
  skip:'skip script for X minutes',
};

var cfg = {
  skip:0,
  AllianceDonation:{
    value:'both',
    options:['off', 'donate', 'speedUp', 'both'],
  },
  AllianceGift:true,
};

var state = {
 allianceDonation:true,
 allianceGift:true,
};

var images = {
  //Research
  indicatorResearch:new Image('IndicatorResearch', 0.9, [159, 36, 40, 39]),
  indicatorDonateMenu:new Image('IndicatorDonateMenu', 0.9, [40, 302, 56, 48]),
  donateBtn:new Image('DonateBtn', 0.9, [293, 139, 96, 64]),
  speedUpBtn:new Image('SpeedUpBtn', 0.9, [298, 252, 87, 48]),
  spendBtn:new Image('SpendBtn', 0.9, [213, 403, 154, 56]),

  indicatorTech:new Image('IndicatorTech', 0.9, [82, 158, 51, 47]),
  donationCollectBtn:new Image('DonationCollectBtn', 0.9, [106, 507, 196, 70]),
  //gifts
  indicatorGifts:new Image('IndicatorGifts', 0.9, [53, 39, 52, 52]),
  collectAllGifts:new Image('CollectAllGifts', 0.9, [299, 121, 93, 465]),
}

function Start(){
  var left = _util.hasTimeLeft(gn.storage.Get("AllianceDonationLastRun"), cfg.skip);
  if(left > 0){
    gn.tools.Log("Skipping donation for " + Number(left / 60).toFixed(0) + " minutes.", 0);
    gn.actions.Finish();
  }else{
    gn.storage.Set("AllianceDonationLastRun", gn.helper.Timestamp());
  }
}

function Pulse(){
  if(!_town.check()){
    return
  }

  if(cfg.AllianceDonation.value !== 'off' && this.state.allianceDonation){
    gn.tools.log('Alliance Donation', 0);

    if(_ab.allianceMenu()){
      if(_ab.allianceAction('guildResearch')){
        if(allianceDonation()){
          if(menu()){
            collectRewards()
          }
          gn.tools.log('Alliance Research done', 0);
          this.state.allianceDonation = false;
        }
      }
    }
    return;
  }else{
    this.state.allianceDonation = false;
  }

  if(cfg.AllianceGift && this.state.allianceGift){
    gn.tools.log('Alliance Gift', 0);

    if(_ab.allianceMenu()){
      if(_ab.allianceAction('guildGifts')){
        if(allianceGift()){
          gn.tools.log('Alliance Gift done', 0);
          this.state.allianceGift = false;
        }
      }
    }
    return;
  }else{
    this.state.allianceGift = false;
  }

  if(!this.state.allianceDonation && !this.state.allianceGift){
    gn.actions.Finish();
  }

}

function allianceGift(){
  if(images.indicatorGifts.find({tries:4, confirms:2})){
    //
    gn.tools.log('Collect Gifts from Alliance', 0);
    for(var i = 0; i < 20; i++){
      if(!images.collectAllGifts.tap({tries:2, confirms:2})){
        gn.tools.log('No more Gifts from Alliance', 0);
        break;
      }
    }
    return true;
  }
}

function allianceDonation(){
  Print('donation');
  if(images.indicatorResearch.find({tries:4, confirms:2})){
    //
    open();
    if(images.indicatorDonateMenu.find({tries:4, confirms:2})){
      //
      for(var i = 0; i < 30; i++){
        if(i == 10 || i == 20){
          gn.tools.wait(1000);
          gn.player.screen.refresh();
        }
        if(images.spendBtn.tap({tries:1, confirms:1})){
          continue;
        }else{
          gn.tools.log('No more donations available', 0);
          break;
        }
      }
      return true;
      //
    }
    //
  }
}

function open(){
  if(cfg.AllianceDonation.value == 'donate'){
    if(images.donateBtn.tap({tries:1, confirms:1})){
      gn.tools.log('Open Donation', 0);
    }
  }else if(cfg.AllianceDonation.value == 'speedUp'){
    if(images.speedUpBtn.tap({tries:1, confirms:1})){
      gn.tools.log('Open SpeedUp', 0);
    }
  }else if(cfg.AllianceDonation.value == 'both'){
    if(images.donateBtn.tap({tries:1, confirms:1}) || images.donateBtn.tap({tries:1, confirms:1})){
      gn.tools.log('Open Donation or SpeedUp', 0);
    }
  }
}

function menu() {
  for(var i = 0; i < 5; i++){
    if(images.indicatorTech.find({tries:3, confirms:2})){
      return true;
    }
    gn.player.input.tap(200, 10);
  }
  gn.tools.log('Failed to find tech menu', 0);
}

function collectRewards() {
  let pos = {
    box1:[70, 95],
    box2:[170, 95],
    box3:[270, 95],
    box4:[370, 95],
  }
  for(var x in pos){
    gn.player.input.tap(pos[x][0], pos[x][1]);
    if(images.donationCollectBtn.tap({tries:3, confirms:1})){
      gn.tools.log('Collect Reward', 0);
    }
    menu();
  }



}

function Finish(){
  gn.tools.log('Done', 0);
}

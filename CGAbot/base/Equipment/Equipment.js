var _base = Include("base/Base/Base.js");
var _ab = Include("base/AllianceBase/AllianceBase.js");
var _util = IncludeExt("General/Util/Util.js");
var _town = Include("base/TownBase/TownBase.js");
var _f = IncludeExt("General/Framework/Framework.js");
var Image = _f != null ? _f.Image : function (){ return null};

var tooltips = {
  Equipment:'Auto use stamina',
};

var cfg = {
  Equipment:true,
};

var state = {
 equipment:true,
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
  var left = _util.hasTimeLeft(gn.storage.Get("EquipmentLastRun"), cfg.skip);
  if(left > 0){
    gn.tools.Log("Skipping donation for " + Number(left / 60).toFixed(0) + " minutes.", 0);
    gn.actions.Finish();
  }else{
    gn.storage.Set("EquipmentLastRun", gn.helper.Timestamp());
  }
}

function Pulse(){
  if(!_town.check()){
    return
  }

  if(cfg.Equipment.value !== 'off' && this.state.equipment){
    gn.tools.log('Equipment', 0);

    if(_ab.allianceMenu()){
      if(_ab.allianceAction('guildResearch')){
        if(allianceDonation()){
          if(menu()){
            collectRewards()
          }
          gn.tools.log('Alliance Research done', 0);
          this.state.equipment = false;
        }
      }
    }
    return;
  }else{
    this.state.equipment = false;
  }

  if(!this.state.equipment){
    gn.actions.Finish();
  }

}


function Finish(){
  gn.tools.log('Done Equipment', 0);
}

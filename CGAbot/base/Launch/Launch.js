var _base = Include("base/Base/Base.js");
var _util = IncludeExt("General/Util/Util.js");

var cfg = { ////

  autoRelog:false,
  skip:180,
  instance:0,
  slot:1,
  tries:10,
  platform:{
    value:"Google",
    options:["Google"]
  }
};

var state = {
  tries:0,
  switched:false,
  launched:false,
	imageOptionsButton: "OptionsButton",
	imageAccountButton: "AccountButton",
	imageSwitchButton: "SwitchButton",
	imageAccountDialogTitle: "AccountDialogTitle",
	imageChooseDialogTitle: "ChooseDialogTitle",
	imageGoogleButton: "GoogleButton",
  imageConfirmButton: "ConfirmButton"
};

function Start(){
  gn.instances.Launch(cfg.instance);
  state.tries = 0;
  state.switched = false;
  state.launched = false;
  closeAll();
  gn.player.screen.Refresh();
  gn.player.screen.Refresh();
  _base.toggleWorldUI(false);
  gn.actions.PauseResolution("03EB7018CCECA35A896534ACF4AD19F8");
}


function closeAll(){
  gn.player.screen.Refresh();

  /*if(_util.FindAndTap("ShipmentButton", 0.94, 1, 1, new Rectangle(251, 376, 135, 20))){
    gn.tools.Wait(4000);
    gn.player.screen.Refresh();
  }*/
  gn.player.screen.Refresh();
  _base.closeDialogs();
  gn.tools.Wait();
  gn.player.screen.Refresh();
  _base.closeDialogs();
}

function goToAccount(){
  openProfile();
  if(openOptions()) {
    if(openAccount()){
      return true
    }
  }
  return false;
}

function processLogin(){

  if(isAccountDialogOpen()){
    if(clickSwitchButton()){
      clickConfirmButton();
      gn.actions.PauseActivity();
      if(cfg.platform.value == "Google"){
        if(clickGoogleButton()){
          clickConfirmButton();
          return processGoogle();
        }
      }
    }
  }
}

function processGoogle(){
  if(isChooseDialogOpen()){
    gn.tools.Wait();
    var slot = cfg.slot;
    if(gn.storage && gn.storage.Account.EmailSlot){
        slot = gn.storage.Account.EmailSlot;
    }
    selectGoogleAccount(slot);
	  return true;
  }
  return false;
}

function openProfile(){
  gn.player.input.Tap(30, 30);
  gn.tools.Wait();
}

function openOptions(){
   if(clickOptionsButton())
    return true;
}

function openAccount(){
  return clickAccountButton();
}

function selectGoogleAccount(num){
  for (var i = 0; i < num; i++) {
    gn.player.input.KeyEvent(20);
    gn.tools.Wait(1000, "");
  }
  gn.tools.Wait(2000, "");
  gn.player.input.KeyEvent(66);
  gn.tools.Wait();
}

function clickGoogleButton(){
  var val = gn.tools.images.TryFindInArea(state.imageGoogleButton, 0.9, new Rectangle(133, 184, 299, 226), 5, 2);
  if(val.length > 0){
    gn.player.input.Tap(val[0].X, val[0].Y);
    return true;
  }
  return false;
}

function isChooseDialogOpen(){
	var val = gn.tools.images.TryFindInArea(state.imageChooseDialogTitle, 0.9, new Rectangle(444, 17, 97, 424), 25, 2);
	if(val.length > 0){
		gn.player.input.Tap(val[0].X, val[0].Y);
		return true;
	}
	return false;
}

function isAccountDialogOpen(){
	var val = gn.tools.images.TryFindInArea(state.imageAccountDialogTitle, 0.9, new Rectangle(262, 0, 108, 23), 5, 2);
	if(val.length > 0){
		return true;
	}
	return false;
}

function clickSwitchButton(){
	var val = gn.tools.images.TryFindInArea(state.imageSwitchButton, 0.9, new Rectangle(132, 168, 389, 253), 5, 2);
	if(val.length > 0){
		gn.player.input.Tap(val[0].X, val[0].Y);
		return true;
	}
	return false;
}

function clickConfirmButton(){
	var val = gn.tools.images.TryFindInArea(state.imageConfirmButton, 0.9, new Rectangle(132, 168, 389, 253), 3, 2);
	if(val.length > 0){
		gn.player.input.Tap(val[0].X, val[0].Y);
		return clickConfirmButton();
	}
	return false;
}

function clickOptionsButton(){
	var val = gn.tools.images.TryFindInArea(state.imageOptionsButton, 0.9, new Rectangle(2, 365, 95, 112), 5, 2);
	if(val.length > 0){
		gn.player.input.Tap(val[0].X, val[0].Y);
		return true;
	}
	return false;
}

function clickAccountButton(){
	var val = gn.tools.images.TryFindInArea(state.imageAccountButton, 0.9, new Rectangle(89, 110, 396, 195), 5, 2);
	if(val.length > 0){
		gn.player.input.Tap(val[0].X, val[0].Y);
		return true;
	}
	return false;
}

function Finish(){
  Print("Finish");
}

function launchPulse(){
  gn.player.screen.Refresh();
  if(_base.getMap())
    state.launched = true;
}

function Pulse(){
  closeAll();
  if(!state.launched){
    launchPulse();
    return;
  }
  if(!cfg.autoRelog){
    gn.actions.Finish();
    return;
  }
  if(!state.switched && goToAccount()){
    state.switched = processLogin();
  }

  if(state.switched){
      Print("Switching account success");
      gn.tools.Wait(4000, "");
      gn.actions.Finish();
    }

  state.tries++;
  if(state.tries > cfg.tries){
    Print("Switching account failed");
    gn.actions.Finish();
  }
}

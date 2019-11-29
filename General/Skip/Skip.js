var  _util = IncludeExt("General/Util/Util.js");

var tooltips = {
  minMinutes:"Random minimum minutes the bot should skip this account",
  maxMinutes:"Random maximum minutes the bot should skip this account",
};

var cfg = {
  minMinutes:80,
  maxMinutes:120,
};

var waitRan = 0;
var curTime = 0;
var refresher = 0;
var tick = 2000;
var shouldRun = true;

function Start(){
  var storedMinutes = gn.storage.Get("SkipAccountMinutes");
  var left = _util.hasTimeLeft(gn.storage.Get("SkipAccountTime"), storedMinutes);
  if(left > 0){
    gn.tools.Log("Skipping account for another " + Number(left / 60).toFixed(0) + " minutes.", 0);
    gn.actions.Finish();
    gn.instances.Finish();

    return;
  }

  waitRan = Number(Math.floor(Math.random() * (Number(cfg.maxMinutes) - Number(cfg.minMinutes) + 1) ) + Number(cfg.minMinutes));
  curTime = waitRan * 60 * 1000;
  gn.tools.log("Skipping account for " + waitRan + " minutes after completion.", 0);
  gn.storage.Set("SkipAccountMinutes", waitRan);
  gn.storage.Set("SkipAccountTime", gn.helper.Timestamp());
}

function Pulse(){
}

function Finish(){

}

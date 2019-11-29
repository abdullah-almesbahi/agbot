var tooltips = {
  minMinutes:"Minimum minutes the bot should wait",
  maxMinutes:"Maximum minutes the bot should wait",
  closeGame:"Close the game while waiting",
  trigger:"How often do you want to trigger the wait"
};

var cfg = {
  minMinutes:10,
  maxMinutes:120,
  closeGame:true,
  trigger:{
    value:"always",
    options:["always", "75%", "50%", "25%", "10%", "5%"]
  }
};

var waitRan = 0;
var curTime = 0;
var refresher = 0;
var tick = 2000;
var shouldRun = true;

function evaluate(){
  var ran = Math.random() * 100;
  var value = 100;
  switch (cfg.trigger.value) {
    case "always":
      value = 100;
      break;
    case "75%":
      value = 75;
      break;
    case "50%":
      value = 50;
      break;
    case "25%":
      value = 25;
      break;
    case "10%":
      value = 10;
      break;
    case "5%":
      value = 5;
      break;
    default:
      value = 100;
  }
  gn.tools.log("Rolled a " + Number(ran).toFixed() + " (setting: " + cfg.trigger.value + ")", 0);
  if(ran <= value){
    return true;
  }

  return false;
}

function Start(){
  if(!evaluate()){
    gn.tools.log("Skipping wait.", 0);
    shouldRun = false;
    gn.actions.finish();
    return;
  }
  waitRan = Number(Math.floor(Math.random() * (Number(cfg.maxMinutes) - Number(cfg.minMinutes) + 1) ) + Number(cfg.minMinutes));
  curTime = waitRan * 60 * 1000;
  gn.tools.log("Waiting for " + waitRan + " minutes.", 0);
  gn.tools.log("Closing game: " + (cfg.closeGame ? "ON" : "OFF"), 0);

  if(cfg.closeGame){
      gn.actions.resetActivity();
      gn.actions.closeApp();
  }

}

function Pulse(){
  if(!shouldRun){
    return;
  }

  if(curTime >= 0){
    curTime -= tick;
  }else{
      if(cfg.closeGame)
        gn.actions.resetActivity();
    gn.tools.log("Waited for " + waitRan + " minutes.", 0);
    gn.actions.finish();
    if(cfg.closeGame)
      gn.actions.resetActivity();
    return;
  }

  gn.actions.resetSameScreen();
  gn.actions.resetSameAccount();
  gn.actions.resetSameAction();
  if(cfg.closeGame)
    gn.actions.resetActivity();
  gn.tools.wait(tick);
}

function Finish(){

}

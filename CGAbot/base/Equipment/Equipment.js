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
  herosIcon : new Image('HerosIcon', 0.9, [83, 638, 21, 13]),
  heroCampScreen : new Image('HeroCampScreen', 0.9, [209, 16, 34, 13]),
  plusEquipment : new Image('PlusEquipment', 0.9, [1, 0, 403, 652]),
  plusEquipment2 : new Image('PlusEquipment2', 0.9, [355, 323, 3, 18]),
  craftButton : new Image('CraftButton', 0.9, [182, 450, 18, 13]),
  equipmentInfoDialog: new Image('EquipmentInfoDialog', 0.9, [145, 76, 19, 17]),
  equipmentRed : new Image('EquipmentRed', 0.9, [290, 484, 403, 652]),
  sweepAllButton: new Image('SweepAllButton', 0.9, [91, 425, 19, 15]),
  canCraft : new Image('CanCraft', 0.9, [186, 537, 17, 16]),
  obtainButton: new Image('ObtainButton', 0.9, [179, 450, 21, 11]),
  equip : new Image('Equip', 0.9, [179, 444, 17, 21])
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

    if(doEquipment()){
    	// nothing
    }
    this.state.equipment = false;
  }else{
    this.state.equipment = false;
  }

  if(!this.state.equipment){
    gn.actions.Finish();
  }

}

function doEquipment(){
	if(PressHerosIcon()){
    	if(OpenHeroPage()){
    		if(OpenEquipmentInfoDialog()){
                if(OpenEquipmentInfo2Dialog()){
                    if(OpenCraftingRequirment()){
                    	doSweepAll();
                    	return true;
                    } else{
                    	gn.tools.log('failed OpenCraftingRequirment', 0);
                    }
                } else{
                	gn.tools.log('failed OpenEquipmentInfo2Dialog', 0);
                }
    		} else{
    			gn.tools.log('failed OpenEquipmentInfoDialog', 0);
    		}
    	} else{
    		gn.tools.log('failed OpenHeroPage', 0);
    	}
    }
    return false;
}

function PressHerosIcon(){
	gn.tools.log('PressHerosIcon', 0);
    if(images.herosIcon.tap({tries:2,confirms:0})){
    	// TODO: this is not going to work if received new here at top of page
    	// if(images.heroCampScreen.find({tries:2,confirms:2})){
    	    return true;
        // } else {
        	// return false;
        // }
    } else {
    	return false;
    }	
}

function OpenHeroPage(){
	gn.tools.log('OpenHeroPage', 0);

  var chose = 1;
	
  // if(found === undefined){
  //    found = images.plusEquipment2.find({tries:2, confirms:2});
  //    chose = 2;
  // }
  for(var i = 0; i < 30; i++){
     var found = images.plusEquipment.find({tries:2, confirms:2});
     if(found === undefined){
        gn.player.input.Swipe(2, 1000, 50, false);
        gn.tools.wait(2000);
     } else {
       break;
     }
  }

	if(found !== undefined){
		  // var area = new Image(chose=== 1?'PlusEquipment':'PlusEquipment2', 0.9, [found[0].X, found[0].Y,found[0].Width, found[0].Height]);
      // open hero page
      gn.player.input.tap(found[0].X, found[0].Y);
      gn.tools.wait(2000);
      return true;
      // if(area.tap({tries:2, confirms:2})){
      //     gn.tools.wait(2000);
      //     return true;
      // } else {
      // 	gn.tools.log('not worked'+found, 0);
      // 	return false;
      // }
	} else {
		return false;
	}
}
function OpenEquipmentInfoDialog(){
	gn.tools.log('OpenEquipmentInfoDialog', 0);
	var found = images.plusEquipment2.find({tries:2, confirms:2});
	// some time is not going to work for strange reason , we try to find it using another picutre
	if(found === undefined){
	   found = images.plusEquipment.find({tries:2, confirms:2});
	}
  if(found !== undefined){
      var area = new Image('PlusEquipment2', 0.9, [found[0].X, found[0].Y, 300, 100]);
      if(area.tap({tries:2, confirms:2})){
          gn.tools.wait(2000);
          return true;
      }
  }
  return false;
}
function OpenEquipmentInfo2Dialog(){
	gn.tools.log('OpenEquipmentInfo2Dialog', 0);
	 // check if craft  , Equiop or obtain button
	if(images.obtainButton.find({tries:2, confirms:2})){
		gn.tools.log('Found Obtain button', 0);
		images.obtainButton.tap({tries:2, confirms:2});
		gn.tools.wait(2000);
	  return true;
	} else if(images.equip.find({tries:2, confirms:2})) {
    images.equip.tap({tries:2, confirms:2});

    // try reset
    if(OpenEquipmentInfoDialog()){
      if(OpenEquipmentInfo2Dialog()){
        return true;
      }
    }
    
  } else if(images.craftButton.find({tries:2, confirms:2})) {

		if(images.craftButton.tap({tries:2, confirms:2})){

			// make sure equipment Info Dialog exists
			// TODO: when there is news , this is not going to work
			//if(images.equipmentInfoDialog.find({tries:2, confirms:2})){

	            // if equipment can be craft , then do it
				
				if(images.canCraft.find({tries:2, confirms:2})){
					images.canCraft.tap({tries:2, confirms:2});

					// TODO: should reset 
					// _town.check();
					// doEquipment();
				} else{
					var foundEquipmentRed = images.equipmentRed.find({tries:2, confirms:2});
	       
		            if(foundEquipmentRed !== undefined){
		            	gn.tools.wait(2000);
      						gn.player.input.tap(foundEquipmentRed[0].X, foundEquipmentRed[0].Y-27)
      						gn.tools.wait(2000);
		              return true;
		            }
				}
	            
	            
			//}

		}
	}

	return false;
}
function OpenCraftingRequirment(){
	gn.tools.log('OpenCraftingRequirment', 0);
	// click on picture
	gn.player.input.tap(82,421);
	gn.tools.wait(2000);
	return true;

}
function doSweepAll(){
	gn.tools.log('doSweepAll', 0);
	if(images.sweepAllButton.tap({tries:2, confirms:2})){
		gn.tools.log('Done Sweep all', 0);
		return true;
	}
	return false;
}


function Finish(){
  gn.tools.log('Done Equipment', 0);
}
